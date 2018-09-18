import fs from 'fs-extra';
import path from 'path';
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
  if (!fileTypeAllowed.includes(extension)) {
    return {
      status: 400,
      error: `This file extenstion does not support. Only support [${fileTypeAllowed}]`,
    };
  }

  return {
    fileName: `${pathFolderStore}/${userId}_${Date.now()}.${extension}`,
  };
};

const storeFile = async function store(file, fileName) {
  await fs.move(
    file[0].path,
    path.resolve(__dirname, fileName)
  );
};

const removeFile = async function removeFile(pathOld) {
  const fileName = pathOld.split('/').pop();
  const pathFolderArchived = process.env.PATH_FOLDER_ARCHIVED || path.resolve(__dirname, '../../archived');
  const existed = await fs.pathExists(pathOld);
  if (existed) {
    await fs.move(pathOld, `${pathFolderArchived}/${fileName}`);
  } else {
    logger.error('Unexpect error when delete file');
  }
};

const preview = async function getPreview(fileName) {
  return new Promise((resolve, reject) => {
    const dirname = path.dirname(fileName);
    const filename = path.basename(fileName, path.extname(fileName));
    const previewFIle = `${dirname}/${filename}.png`;
    if (path.extname(fileName) === '.pdf') {
      gm(fileName)
        .page(860, 1240)
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
    } else {
      resolve({
        statusCode: 200,
        message: 'Need to convert from docx to pdf then get a thumb file',
      });
    }
  });
};

export { preview, initStoreFolder, storeFile, validateExtension, removeFile };