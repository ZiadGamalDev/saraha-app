import crypto from 'crypto';
import bcrypt from 'bcrypt';

const getKeyLength = () => {
    const keyLength = parseInt(process.env.ENCRYPTION_KEY_LENGTH, 10);
    if (isNaN(keyLength)) {
        throw new Error('Invalid KEY_LENGTH environment variable');
    }
    return keyLength;
};

const getIvLength = () => {
    const ivLength = parseInt(process.env.ENCRYPTION_IV_LENGTH, 10);
    if (isNaN(ivLength)) {
        throw new Error('Invalid ENCRYPTION_IV_LENGTH environment variable');
    }
    return ivLength;
};

export const encrypt = (text) => {
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', getKeyLength());
    const iv = crypto.randomBytes(getIvLength());
    const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', getKeyLength());
    const decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

export const hash = (password) => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    return bcrypt.hash(password, saltRounds);
};

export const compare = (password, hash) => {
    return bcrypt.compare(password, hash);
};