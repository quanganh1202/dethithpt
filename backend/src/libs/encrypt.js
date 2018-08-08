import bcrypt from 'bcrypt';

const encryptor = function encryp(password) {
  const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10;
  return bcrypt.hash(password, saltRounds);
}

const descryptor = function descrypt(password, hash) {
  return bcrypt.compare(password, hash);
}

export { encryptor, descryptor };