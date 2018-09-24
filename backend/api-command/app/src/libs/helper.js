import fs from 'fs-extra';
import path from 'path';
import doc2Pdf from 'docx-pdf';
import gm from 'gm';
import fileTypeAllowed from '../constant/fileType';
import logger from '../../src/libs/logger';

const initStoreFolder = async function initStoreFolder(pathFolder) {
  const existed = await fs.pathExists(pathFolder);
  if (!existed) {
    await fs.mkdir(pathFolder);
  }
};

const validateExtension = function validate(file, userId) {
  const pathFolderStore = process.env.PATH_FOLDER_STORE || path.resolve(__dirname, '../../../storage');
  const extension = file[0].originalname.split('.').pop();
  const response = {};
  if (!fileTypeAllowed.includes(extension)) {
    return {
      status: 400,
      error: `This file extenstion does not support. Only support [${fileTypeAllowed}]`,
    };
  }
  if (['zip', 'rar'].includes(extension)) {
    if (!file[1] || file[1].fieldname !== 'filePreview') {
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

const storeFile = async function store(file, fileName, preview) {
  try {
    await fs.move(
      preview ? file[1].path : file[0].path,
      path.resolve(__dirname, fileName)
    );
  } catch(ex) {
    logger.error(ex.message || ex || 'Unexpected error when store file');
  }

};

const removeFile = async function removeFile(pathOld) {
  const existed = await fs.pathExists(pathOld);
  if (existed) {
    await fs.unlink(pathOld);
  } else {
    logger.error('Unexpect error when delete file');
  }
};

const preview = async function getPreview(fileName) {
  return new Promise((resolve, reject) => {
    const dirname = path.dirname(fileName);
    const filename = path.basename(fileName, path.extname(fileName));
    const previewFIle = `${dirname}/${filename}.png`;
    const extension = path.extname(fileName);
    if (extension === '.docx' || extension === '.doc') {
      const pdfName = `${dirname}/${filename}.pdf`;
      doc2Pdf(fileName, pdfName, (err) => {
        if (err) {
          reject({
            statusCode: 500,
            error: err.message || 'Create thumb file failed',
          });
        } else {
          gm(pdfName)
            .page(860, 1240)
            .draw(['rotate 40 text 200,200 "TAILIEUDOC.VN"'])
            .fontSize(80)
            .write(previewFIle, (err) => {
              if (err) {
                reject({
                  statusCode: 500,
                  error: err.message || 'Create thumb file failed',
                });
              } else {
                resolve({
                  statusCode: 200,
                  message: 'Thumb file is created',
                });
              }
              fs.unlink(pdfName);
            });
        }
      });
    }

    if ( extension === '.pdf') {
      gm(fileName)
        .page(860, 1240)
        .draw(['rotate 40 text 200,200 "TAILIEUDOC.VN"'])
        .fontSize(80)
        .write(previewFIle, (err) => {
          if (err) {
            reject({
              statusCode: 500,
              error: err.message || 'Create thumb file failed',
            });
          } else {
            resolve({
              statusCode: 200,
              message: 'Thumb file is created',
            });
          }
        });
    }
  });
};


export { preview, initStoreFolder, storeFile, validateExtension, removeFile };