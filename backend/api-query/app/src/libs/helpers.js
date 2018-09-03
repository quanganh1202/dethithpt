import fs from 'fs-extra';

const initStoreFolder = async function initStoreFolder(pathFolder) {
  const existed = await fs.pathExists(pathFolder);
  if (!existed) {
    const mkFolderResult = await fs.mkdir(pathFolder);

    return mkFolderResult;
  }
};

export { initStoreFolder };