import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { FileController } from '../../file-controller';

import * as glob from 'glob';

const fileController = new FileController();

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('unique Array test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.deepStrictEqual((fileController as any).uniqueArray(['hoge', 'hoge', 'foo', 'bar']), ['hoge', 'foo', 'bar']);
  });

  test('Get parent path recursive test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paths = (fileController as any).getParentPathRecursive('/hoge/test/bar', '/hoge');
    assert.deepStrictEqual(paths, ['/hoge/test/bar', '/hoge/test']);
  });

  test('Flatten Array test', () => {
    assert.deepStrictEqual(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fileController as any).flatten([
        ['hoge', 'foo', 'bar'],
        ['hoge', 'hoge'],
      ]),
      ['hoge', 'foo', 'bar', 'hoge', 'hoge']
    );
  });

  test('Get parent path recursive array test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paths = (fileController as any).getParentPathArrayRecursive(
      ['/hoge/test/bar', '/hoge/test/foo/bar'],
      '/hoge'
    );
    assert.deepStrictEqual(paths, ['/hoge/test/bar', '/hoge/test', '/hoge/test/foo/bar', '/hoge/test/foo']);
  });
});

// HACK: the compiled js its inside `out` and not `src`
// although there might be better ways, it works for now
const tmpPath = path.join(__dirname.replace('out', 'src'), 'tmp');

/**
 * Define the tmp directory structure. The key `path` contains the path of
 * the directory and the key `containsPy` contain a boolean indicating if
 * it should contain a python file.
 */
const tmpStructure = {
  other: { path: path.join(tmpPath, 'other'), containsPy: false },
  src: { path: path.join(tmpPath, 'src'), containsPy: true },
  srcOld: { path: path.join(tmpPath, 'src_old'), containsPy: true },
  api: { path: path.join(tmpPath, 'src', 'api'), containsPy: true },
  tests: { path: path.join(tmpPath, 'tests'), containsPy: true },
  data: { path: path.join(tmpPath, 'data'), containsPy: true },
};

/**
 * Setup the tmp folder when the test suite starts.
 *
 * This action will create the folders and also a placeholder .py file where it should.
 */
setup('Setup tmp folder', () => {
  for (const value of Object.values(tmpStructure)) {
    fs.mkdirSync(value.path, { recursive: true });
    if (value.containsPy) {
      fs.writeFileSync(path.join(value.path, 'main.py'), '');
    }
  }
});

/**
 * Check if __init__.py exists.
 *
 * @param dir directory where to check for the init.
 * @returns true if exists false otherwise
 */
const initExists = (dir: string) => {
  return fs.existsSync(path.join(dir, '__init__.py'));
};

const sortArray = (a: Array<string>) => {
  return a.sort((a: string, b: string) => a.localeCompare(b));
};

suite('Execute commands', () => {
  setup('Cleanup __init__.py files in tmp folder', async () => {
    glob.sync(path.join(tmpPath, '/**/__init__.py')).map((file: string) => {
      fs.unlinkSync(file);
    });
  });

  test('Generate __init__.py from default command', async () => {
    // path should exists but better save than sorry
    if (!fs.existsSync(tmpPath)) {
      return;
    }
    await fileController.generateInitFiles(tmpPath);

    for (const tmpPath of Object.values(tmpStructure)) {
      const itExists = initExists(tmpPath.path);
      assert.ok(tmpPath.containsPy ? itExists : !itExists);
    }
  });

  test('Generate __init__.py from context menu command', async () => {
    if (!fs.existsSync(tmpPath)) {
      return;
    }

    fileController.fromContextMenu = true;
    await fileController.generateInitFiles(tmpStructure.src.path);

    assert.ok(initExists(tmpStructure.src.path));
    assert.ok(initExists(tmpStructure.api.path));

    assert.ok(!initExists(tmpStructure.tests.path));
    assert.ok(!initExists(tmpStructure.other.path));
  });

  test('Generate __init__.py from context menu command on empty folder', async () => {
    if (!fs.existsSync(tmpPath)) {
      return;
    }

    fileController.fromContextMenu = true;
    await fileController.generateInitFiles(tmpStructure.other.path);
    assert.ok(!initExists(tmpStructure.other.path));
  });

  test('Generate __init__.py but skip some folders', async () => {
    if (!fs.existsSync(tmpPath)) {
      return;
    }

    fileController.fromContextMenu = true;

    // exclude: src, src_old
    const dirs = await fileController.getDirsWithExtension(tmpPath, 'py', ['src']);

    assert.deepStrictEqual(sortArray(dirs), sortArray([tmpStructure.data.path, tmpStructure.tests.path]));
  });

  test('Generate __init__.py but skip some folders using regex', async () => {
    if (!fs.existsSync(tmpPath)) {
      return;
    }

    fileController.fromContextMenu = true;

    // exclude: tests, api, data
    const dirs = await fileController.getDirsWithExtension(tmpPath, 'py', ['te.+', 'a[p|b]i', '.+ta$']);

    assert.deepStrictEqual(sortArray(dirs), sortArray([tmpStructure.src.path, tmpStructure.srcOld.path]));
  });
});
