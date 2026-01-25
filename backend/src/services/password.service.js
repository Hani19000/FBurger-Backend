import crypto from 'crypto';
import { promisify } from 'util';
import { ENV } from '../config/environment.js';

const pbkdf2 = promisify(crypto.pbkdf2);

class PasswordService {
    static instance;

    constructor() {
        if (PasswordService.instance) return PasswordService.instance;
        PasswordService.instance = this;
    }


    generateSalt(length = 16) {
        return crypto.randomBytes(length).toString('hex');
    }


    async hashPassword(password, salt) {
        const iterations = ENV.bcrypt?.iterations || 100000; 
        const hash = await pbkdf2(password, salt, iterations, 64, 'sha512');
        return hash.toString('hex');
    }

    async comparePassword(password, hash, salt) {
        const hashedAttempt = await this.hashPassword(password, salt);
        return crypto.timingSafeEqual(
            Buffer.from(hash, 'hex'),
            Buffer.from(hashedAttempt, 'hex')
        );
    }
}

export const passwordService = new PasswordService();