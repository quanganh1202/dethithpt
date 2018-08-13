import fs from 'fs-extra';

const initStoreFolder = async function initStoreFolder(pathFolder) {
  const existed = await fs.pathExists(pathFolder);
  if (!existed) {
    await fs.mkdir(pathFolder);
  }
};

export { initStoreFolder };