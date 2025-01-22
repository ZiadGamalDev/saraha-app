import fs from 'fs';
import path from 'path';

const file = {
    store(file, targetFolder = 'common', customName = null) {
        const folderPath = path.join('uploads', targetFolder);
        fs.mkdirSync(folderPath, { recursive: true });
        const fileName = customName || file.filename;
        const targetPath = path.join(folderPath, fileName);
        fs.renameSync(file.path, targetPath);
        return targetPath;
    },

    delete(filePath) {
        const resolvedPath = path.resolve(filePath);
        if (fs.existsSync(resolvedPath)) {
            fs.unlinkSync(resolvedPath);
        }
    },
};

export default file;
