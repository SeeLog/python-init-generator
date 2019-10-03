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
});
