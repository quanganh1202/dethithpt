import Ajv from 'ajv';
import path from 'path';
import fs from 'fs-extra';

const ajv = new Ajv({ allErrors: true });

const addSchema = async function () {
  const pathFolderSchema = path.resolve(__dirname, '../../http/schema');
  const files = await fs.readdir(pathFolderSchema);
  files.forEach(fileName => {
    const schema = require(`${pathFolderSchema}/${fileName}`);
    ajv.addSchema(schema);
  });
};

const dataValidator = function validateData(data, idSchema) {
  const valid = ajv.validate(idSchema, data);
  if (!valid) return {
    status: 403,
    valid,
    errors: ajv.errors,
  };

  return {
    valid,
  };
};


export { dataValidator, addSchema };