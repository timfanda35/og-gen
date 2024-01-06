// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const child_process = require('child_process');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function writeClipboard(content) {
	vscode.env.clipboard.writeText(content)
		.then(() => {
			console.log('OG Image path is copied:', content);
		}, (error) => {
			console.error('OG Image path can not be copied:', error);
		});
}

function appendToMetadata(content) {
	const activeTextEditor = vscode.window.activeTextEditor;
	const document = activeTextEditor.document;
	const fileContent = document.getText();

	// Get markdown metadata from fileContent
	const metadata = fileContent.match(/^---[\s\S]*?---/m)?.[0];
	if (!metadata) {
		console.log("Metadata is not found.");
		return;
	}

	// Append to last line
	const newMetadata = metadata.replace(/\n---/m, `\nimages:\n  - ${content}\n---`);
	const newFileContent = fileContent.replace(/^---[\s\S]*?---/m, newMetadata);

	activeTextEditor.edit((editBuilder) => {
		editBuilder.replace(new vscode.Range(0, 0, document.lineCount, 0), newFileContent);
	});
}

function commandCallback(error, stdout, stderr) {
	if (error) {
		console.error(`OG Occur Error: ${error.message}`);
		vscode.window.showErrorMessage(`OG Occur Error: ${error.message}`);
		return;
	}

	if (stderr) {
		console.error(`OG Occur Error: ${stderr}`);
		vscode.window.showErrorMessage(`OG Occur Error: ${stderr}`);
		return;
	}

	console.log("OG Image path:", stdout);

	vscode.window.showInformationMessage(`OG Image path:\n${stdout}`);
	writeClipboard(stdout?.trim());
	appendToMetadata(stdout?.trim());
}

function ogGenFromCurrentFile() {
	const execute = "og_gen";
	const currentWorkspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri;
	const activeTextEditor = vscode.window.activeTextEditor;

	if (activeTextEditor) {
		const { fsPath } = activeTextEditor.document.uri;

		console.log('Current file path:', fsPath);

		const command = `${currentWorkspaceUri.fsPath}/${execute} -dir=${currentWorkspaceUri.fsPath} ${fsPath}`;
		child_process.exec(command, commandCallback);
	} else {
		vscode.window.showInformationMessage('Opened file not found');
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "og-gen" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('og-gen.genOGImageFromCurrentFile', ogGenFromCurrentFile);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
