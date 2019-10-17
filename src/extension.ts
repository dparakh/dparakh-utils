// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { isNullOrUndefined } from "util";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"dparakh-utils" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.p4edit', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				sendTextToTerminal ('p4 edit ' + activeEditor.document.uri.fsPath);
		}
	});

	let disposable2 = vscode.commands.registerCommand('extension.p4revert', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				sendTextToTerminal ('p4 revert ' + activeEditor.document.uri.fsPath);
		}
	});

	let disposable3 = vscode.commands.registerCommand('extension.p4blame', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				sendTextToTerminal ('p4blame.py ' + activeEditor.document.uri.fsPath + ' ' + (activeEditor.selection.start.line+1));
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function sendTextToTerminal(in_text: string)
{
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		let activeTerminal = vscode.window.activeTerminal;

		if (activeTerminal) {
		}
		else {
			activeTerminal = vscode.window.createTerminal();
		}

		if (activeTerminal) {
			activeTerminal.sendText(in_text);
			activeTerminal.show(true);
		}
	}
}