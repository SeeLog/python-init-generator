import * as path from 'path';
import * as fs from 'fs';

var glob = require("glob");


export class FileController {
    public async createFile(filePath: string) {
        /*
            Create an empty file.
        */
        fs.writeFileSync(filePath, "");
    }

    public async getPythonFileDirs(rootDir: string): Promise<Array<string>> {
        /*
            Get all dirs which include *.py file(s).
        */
        return await this.getDirsWithExtension(rootDir, "py");
    }

    public async getDirsWithExtension(rootDir: string, ext: string): Promise<Array<string>> {
        /*
            Get all dirs which include *.{ext} file(s).
        */
        let dirs = await glob.sync(path.join(rootDir, "/**/*." + ext)).map((file: string) => {
            let dir = path.dirname(file);
            return dir;
        });

        console.log(dirs);

        return this.uniqueArray(dirs);
    }

    private uniqueArray(array: Array<any>): Array<any> {
        /*
            Unique Array
        */
        let uniqueSet = new Set<any>();

        array.map((elm: any) => {
            uniqueSet.add(elm);
        });

        return Array.from(uniqueSet);
    }

    public async generateInitFiles(rootDir: string): Promise<number> {
        /*
            Generate init files.
        */
        let dirs = await this.getPythonFileDirs(rootDir);

        let counts = await Promise.all(dirs.map(dir => {
            return this.generateInitFile(dir);
        }));

        let count = 0;

        counts.forEach(c => {
            count += c;
        });

        return count;
    }

    public async generateInitFile(createDir: string): Promise<number> {
        let count = 0;
        if (!fs.existsSync(path.join(createDir, "__init__.py"))) {
            count++;
            this.createFile(path.join(createDir, "__init__.py"));
        }

        return count;
    }
}