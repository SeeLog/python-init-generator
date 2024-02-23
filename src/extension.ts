// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FileController } from './file-controller';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('python-init-generator.generateInit', async () => {
    // The code you place here will be executed every time your command is executed

    const fileController = new FileController();
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath.replace(/\\/g, '/');

    if (rootPath !== null && rootPath !== undefined) {
      const count = await fileController.generateInitFiles(rootPath);
      vscode.window.showInformationMessage(`Python init Generator: Generate ${count} __init__.py file(s)`);
    } else {
      vscode.window.showErrorMessage('Python init Generator: You must open directory or workspace.');
    }
  });
  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand('python-init-generator.generateInitFromLocation', async (uri: vscode.Uri) => {
      const fileController = new FileController();
      fileController.fromContextMenu = true;
      const count = await fileController.generateInitFiles(uri.fsPath);

      vscode.window.showInformationMessage(`Python init Generator: Generate ${count} __init__.py file(s)`);
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  // nothing to do
}
