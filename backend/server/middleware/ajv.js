import Ajv from 'ajv';

let globalSchema;
const ajv = new Ajv();

const schemaAdder = function addSchema(schema) {
  globalSchema = ajv.addSchema(schema, 'mySchema');
};

const dataValidator = function validateData(data) {
  const valid = globalSchema.validate('mySchema', data);

  if (!valid) return valid.error;
};

export { schemaAdder, dataValidator };