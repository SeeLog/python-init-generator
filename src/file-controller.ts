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

        return this.getParentPathArrayRecursive(this.uniqueArray(dirs), rootDir);
    }

    private getParentPathArrayRecursive(pathDirs: Array<string>, stopPath: string): Array<string> {
        /*
            Get parent directories
        */
        let dirs = pathDirs.map((path: string) => {
            return this.getParentPathRecursive(path, stopPath);
        });

        return this.uniqueArray(this.flatten(dirs));
    }

    private flatten(arr: Array<any>): Array<any> {
        /*
            flatten array
        */
        return [].concat(...arr);
    }

    private getParentPathRecursive(pathDir: string, stopPath: string): Array<string> {
        /*
            Get parent directories
        */
        let retArr = new Array<string>();

        while (pathDir.length > 1 && pathDir !== stopPath) {
            retArr.push(pathDir);

            pathDir = path.dirname(pathDir);
        }

        return retArr;
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
        let init_path = path.join(createDir, "__init__.py");
        if (!fs.existsSync(init_path)) {
            count++;
            this.createFile(init_path);
        }

        return count;
    }
}