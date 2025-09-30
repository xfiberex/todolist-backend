import crypto from 'crypto';

const generarId = () => {
  return crypto.randomBytes(20).toString('hex');
};

export default generarId;