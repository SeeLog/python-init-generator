import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { glob } from 'glob';

export class FileController {
  fromContextMenu = false;

  public async createFile(filePath: string) {
    /*
      Create an empty file.
    */
    fs.writeFileSync(filePath, '');
  }

  public async getPythonFileDirs(rootDir: string): Promise<Array<string>> {
    /*
      Get all dirs which include *.py file(s).
    */
    const exclude = vscode.workspace.getConfiguration('pythonInitGenerator').get('ignoreDirectories') as Array<string>;
    return await this.getDirsWithExtension(rootDir, 'py', exclude);
  }

  public async getDirsWithExtension(rootDir: string, ext: string, exclude: Array<string>): Promise<Array<string>> {
    /*
      Get all dirs which include *.{ext} file(s).
    */
    const files = glob.sync(path.join(rootDir, `/**/*.${ext}`));
    const dirsSet = new Set<string>();

    let excludeRegex: RegExp | undefined = undefined;
    if (exclude.length !== 0) {
      excludeRegex = new RegExp(exclude.join('|'));
    }

    files.forEach((file: string) => {
      const dir = path.dirname(file);
      // Only consider the relative path
      const relativeDir = path.relative(rootDir, dir);

      // Check if the relative directory path matches the combined exclude regex
      if (!excludeRegex?.test(relativeDir)) {
        dirsSet.add(dir);
      }
    });
    const dirs = Array.from(dirsSet);

    // If we call the class from the context menu, there is no need to go further
    if (this.fromContextMenu) {
      return dirs;
    }

    return this.getParentPathArrayRecursive(dirs, rootDir);
  }

  private getParentPathArrayRecursive(pathDirs: Array<string>, stopPath: string): Array<string> {
    /*
      Get parent directories
    */
    const dirs = pathDirs.map((path: string) => {
      return this.getParentPathRecursive(path, stopPath);
    });

    return this.uniqueArray(this.flatten(dirs));
  }

  private flatten<T>(arr: Array<Array<T>>): Array<T> {
    /*
      flatten array
    */
    return ([] as T[]).concat(...arr);
  }

  private getParentPathRecursive(pathDir: string, stopPath: string): Array<string> {
    /*
      Get parent directories
    */
    const retArr = new Array<string>();

    while (pathDir.length > 1 && pathDir !== stopPath) {
      retArr.push(pathDir);

      pathDir = path.dirname(pathDir);
    }

    return retArr;
  }

  private uniqueArray<T>(array: Array<T>): Array<T> {
    /*
      Unique Array
    */
    const uniqueSet = new Set<T>();

    array.map((elm: T) => {
      uniqueSet.add(elm);
    });

    return Array.from(uniqueSet);
  }

  public async generateInitFiles(rootDir: string): Promise<number> {
    /*
      Generate init files.
    */
    const dirs = await this.getPythonFileDirs(rootDir);

    const counts = await Promise.all(
      dirs.map((dir) => {
        return this.generateInitFile(dir);
      })
    );

    const count = counts.reduce((a, b) => a + b, 0);

    return count;
  }

  public async generateInitFile(createDir: string): Promise<number> {
    let count = 0;
    const initPath = path.join(createDir, '__init__.py');
    if (!fs.existsSync(initPath)) {
      count++;
      this.createFile(initPath);
    }

    return count;
  }
}
