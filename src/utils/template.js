import fs from 'fs';
import path from 'path';

export const template = (folder, fileName) => {
    const templatePath = path.resolve('src/templates', folder, fileName);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
    }
    return fs.readFileSync(templatePath, 'utf-8');
};
