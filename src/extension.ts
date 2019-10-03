// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {FileController} from './file-controller';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.generateInit', async () => {
		// The code you place here will be executed every time your command is executed

		const fileController = new FileController();
		let rootPath = vscode.workspace.rootPath;
		if (rootPath !== null) {
			let count = await fileController.generateInitFiles(vscode.workspace.rootPath!);
			vscode.window.showInformationMessage(`Python init Generator: Generate ${count} __init__.py file(s)`);
		}
		else {
			vscode.window.showErrorMessage("Python init Generator: You must open directory or workspace.");
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
