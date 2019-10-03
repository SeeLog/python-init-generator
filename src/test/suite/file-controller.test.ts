import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as chai from 'chai';
import * as typemoq from 'typemoq';

import {FileController} from '../../file-controller';

import * as glob from 'glob';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

    const fileController = new FileController();

    test("unique Array test", () => {
        assert.deepEqual((fileController as any).uniqueArray(["hoge", "hoge", "foo", "bar"]), ["hoge", "foo", "bar"]);
    });

    test("Get parent path recursive test", () => {
        let paths = (fileController as any).getParentPathRecursive("/hoge/test/bar", "/hoge");
        assert.deepEqual(paths, ["/hoge/test/bar", "/hoge/test"]);
    });

    test("Flatten Array test", () => {
        assert.deepEqual((fileController as any).flatten([
                ["hoge", "foo", "bar"],
                ["hoge", "hoge"],
            ]),
            ["hoge", "foo", "bar", "hoge", "hoge"]
        );
    });

    test("Get parent path recursive array test", () => {
        let paths = (fileController as any).getParentPathArrayRecursive(["/hoge/test/bar", "/hoge/test/foo/bar"], "/hoge");
        assert.deepEqual(paths, ["/hoge/test/bar", "/hoge/test", "/hoge/test/foo/bar", "/hoge/test/foo"]);
    });
});
