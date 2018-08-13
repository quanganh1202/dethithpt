import fs from 'fs-extra';
import path from 'path';
import fileTypeAllowed from '../constant/fileType';

const initStoreFolder = async function initStoreFolder(pathFolder) {
  const existed = await fs.pathExists(pathFolder);
  if (!existed) {
    await fs.mkdir(pathFolder);
  }
};

const validateExtension = function validate(file, userId) {
  const pathFolderStore = process.env.PATH_FOLDER_STORE || path.resolve(__dirname, '../../storage');
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

export { initStoreFolder, storeFile, validateExtension };