import fs from 'fs-extra';
import pdfjs from 'pdfjs-dist/build/pdf';
import path from 'path';
import tmp from 'temporary';
import childProcess from 'child_process';
import gm from 'gm';
import fileTypeAllowed from '../constant/fileType';
import logger from '../../src/libs/logger';

const initStoreFolder = async function initStoreFolder(pathFolder) {
  const existed = await fs.pathExists(pathFolder);
  if (!existed) {
    await fs.mkdir(pathFolder);
  }
};

const validateExtension = function validate(files, userId) {
  const pathFolderStore = process.env.PATH_FOLDER_STORE || path.resolve(__dirname, '../../../storage');
  const file = files.filter(i => i.fieldname === 'fileUpload');
  if (!file.length) {
    return {
      status: 400,
      error: 'Should be provided fileUpload',
    };
  }
  const preview = files.filter(i => i.fieldname === 'filePreview');
  const extension = file[0].originalname.split('.').pop();
  const response = {};
  if (!fileTypeAllowed.includes(extension)) {
    return {
      status: 400,
      error: `This file extenstion does not support. Only support [${fileTypeAllowed}]`,
    };
  }
  if (['zip', 'rar'].includes(extension)) {
    if (!preview[0] || preview[0].fieldname !== 'filePreview') {
      return {
        status: 400,
        error: 'Should be provide a file preview for zip, rar file',
      };
    }
    response.filePreview = `${pathFolderStore}/${userId}_${Date.now()}.png`;
  }
  response.fileName = `${pathFolderStore}/${userId}_${Date.now()}.${extension}`;

  return response;
};

const storeFile = async function store(files, fileName, preview) {
  try {
    const file = files.filter(i => i.fieldname === 'fileUpload');
    if (!file.length) {
      return {
        status: 400,
        error: 'Should be provided fileUpload',
      };
    }
    const previewFile = files.filter(i => i.fieldname === 'filePreview');
    await fs.move(
      preview ? previewFile[0].path : file[0].path,
      path.resolve(__dirname, fileName)
    );
  } catch(ex) {
    logger.error(ex.message || ex || 'Unexpected error when store file');
  }

};

const removeFile = async function removeFile(pathOld) {
  const pathFolderStore = process.env.PATH_FOLDER_STORE || path.resolve(__dirname, '../../../storage');
  const fileName = path.basename(pathOld, path.basename(path.extname(pathOld)));
  const arrFiles = fs.readdirSync(pathFolderStore).filter((file => file.includes(fileName)));
  const existed = await fs.pathExists(pathOld);
  if (existed) {
    const promises = arrFiles.map(file => fs.unlink(`${pathFolderStore}/${file}`));
    await Promise.all(promises);
  } else {
    logger.error('Unexpect error when delete file');
  }
};

const preview = function getPreview(fileName) {
  return new Promise((resolve, reject) => {
    const dirname = path.dirname(fileName);
    const filename = path.basename(fileName, path.extname(fileName));
    const previewFile = `${dirname}/${filename}`;
    const extension = path.extname(fileName);
    const limitTimeToLoop = process.env.LIMIT_THUMB_FILE || 30;
    if (extension === '.docx' || extension === '.doc') {
      office2Pdf(fileName, dirname).then(async (pdfName) => {
        const { numPages } = await pdfjs.getDocument(pdfName);
        resolve({
          statusCode: 200,
          message: 'Thumb file is created',
          numPages,
        });
        const timeToLoop = numPages < limitTimeToLoop ? numPages : limitTimeToLoop;
        const promises = [];
        for (let i = 0; i < timeToLoop; i += 1) {
          promises.push(pdf2Image(`${pdfName}[${i}]`, `${previewFile}0${i}.png`));
        }
        Promise.all(promises).then(() => {
          fs.unlink(pdfName);
        }).catch(err => {
          logger.error(`[DOCUMENT] ${err.message || 'Generate preview file has error'}`);
          fs.unlink(pdfName);
        });
      }).catch((err) => {
        logger.error(`[DOCUMENT] ${err.message || 'Generate preview file has error'}`);
        reject({
          statusCode: 500,
          error: err.message || 'Create thumb file failed',
        });
      });
    }

    if (extension === '.pdf') {
      pdfjs.getDocument(fileName).then(result => {
        const { numPages } = result;
        resolve({
          statusCode: 200,
          message: 'Thumb file is created',
          numPages,
        });
        const timeToLoop = numPages < limitTimeToLoop ? numPages : limitTimeToLoop;
        const promises = [];
        for (let i = 0; i < timeToLoop; i += 1) {
          promises.push(pdf2Image(`${fileName}[${i}]`, `${previewFile}0${i}.png`));
        }
        Promise.all(promises).catch(err => {
          logger.error(`[DOCUMENT] ${err.message || 'Generate preview file has error'}`);
        });
      }).catch(err => {
        logger.error(`[DOCUMENT] ${err.message || 'Generate preview file has error'}`);
        reject({
          statusCode: 500,
          error: err.message || 'Create thumb file failed',
        });
      });
    }
  });
};

const pdf2Image = (pdf, image) => {
  return new Promise((resolve, reject) => {
    // gm('img.png').command('convert').in('+adjoin').quality(100).in(pdf).write(image, function(err) {
    gm().command('convert').in('+adjoin').quality(100).flatten().density(96, 96).in(pdf).write(image, function(err) {
      if(err) return reject(err);

      return resolve();
    });
  });
};

const myQueue = [];
let count = 0;

const office2Pdf = (word, pdf) => {
  return new Promise((resolve, reject) => {
    let file = new tmp.File();
    const wordBuffer = fs.readFileSync(word);
    file.writeFile(wordBuffer, (err) => {
      if(err) reject(err);
      let cmd = `libreoffice6.1 --headless --convert-to pdf:writer_pdf_Export ${file.path} --outdir ${pdf}`;
      const childCallback = (error) => {
        console.log('Next can start');
        myQueue.shift();

        if(error) {
          reject(error);
        } else {
          const fileConverted = path.join(pdf, `${path.basename(file.path, path.extname(file.path))}.pdf`);
          // Wait to file was created by system, delay 500 to sure file is created
          const interval = setInterval(() => {
            if (fs.pathExistsSync(fileConverted)) {
              clearInterval(interval);
              console.log(`Resolved: ${count}`);

              return resolve(fileConverted);
            }
          }, 1000);
        }
      };

      count += 1;
      if (myQueue.length === 0) {
        console.log(`Start: ${count}`);
        myQueue.push(cmd);
        childProcess.exec(cmd, childCallback);
      } else {
        console.log(`Waiting: ${count}`);
        myQueue.push(cmd);
        const intervalQueue = setInterval(() => {
          if (myQueue[0] === cmd) {
            console.log(`Start: ${count}`);
            clearInterval(intervalQueue);

            childProcess.exec(cmd, childCallback);
          }
        }, 1000);
      }
    });
  });
};

export { preview, initStoreFolder, storeFile, validateExtension, removeFile };
