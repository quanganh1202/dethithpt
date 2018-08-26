import fs from 'fs-extra';
import path from 'path';
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
  await fs.rename(
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

export { initStoreFolder, storeFile, validateExtension, removeFile };