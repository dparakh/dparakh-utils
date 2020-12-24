// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { window } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"dparakh-utils" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let p4editCommand = vscode.commands.registerCommand('extension.p4edit', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				sendTextToTerminal ('p4 edit "' + activeEditor.document.uri.fsPath + '"');
		}
	});

	let p4revertCommand = vscode.commands.registerCommand('extension.p4revert', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				sendTextToTerminal ('p4 revert "' + activeEditor.document.uri.fsPath + '"');
		}
	});

	let p4blameCommand = vscode.commands.registerCommand('extension.p4blame', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				sendTextToTerminal ('p4blame.py "' + activeEditor.document.uri.fsPath + '" ' + (activeEditor.selection.start.line+1));
		}
	});

	let keeplinesCommand = vscode.commands.registerCommand('extension.keeplines', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				keepLines();
		}
    });
    
	let flushlinesCommand = vscode.commands.registerCommand('extension.flushlines', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
				flushLines();
		}
	});


	context.subscriptions.push(p4editCommand);
	context.subscriptions.push(p4revertCommand);
	context.subscriptions.push(p4blameCommand);
	context.subscriptions.push(keeplinesCommand);
	context.subscriptions.push(flushlinesCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function sendTextToTerminal(in_text: string)
{
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		let workingTerminal = undefined;

		vscode.window.terminals.forEach( aTerminal => {
			if (aTerminal.name === "P4") {
				workingTerminal = aTerminal;
			}
		});

		if (workingTerminal) {
		}
		else {
			workingTerminal = vscode.window.createTerminal("P4");
		}

		if (workingTerminal) {
			workingTerminal.sendText(in_text);
			workingTerminal.show(true);
		}
	}
}

async function flushLines(): Promise<void> {
    // Display a message box to the user
    const result = await window.showInputBox({
        value: '',
        placeHolder: 'Enter a RegEx to flush matching lines',
    });

    const editor = vscode.window.activeTextEditor;
    if (editor && result) {
        const regExp = new RegExp(result || '');
        const document = editor.document;
        const lineCount = document.lineCount;
        const rangesToDelete : vscode.Range[] = [];
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            const aLine = document.lineAt(lineIndex);
            if (regExp.test(aLine.text)) {
                const lineRange = new vscode.Range(aLine.range.start.line, 0, aLine.range.start.line+1, 0);
                rangesToDelete.push(lineRange);
            }
        }
        if (rangesToDelete.length) {
            editor.edit(editBuilder => {
                for (let aRange of rangesToDelete) {
                    editBuilder.delete (aRange);
                }
            });
        }
    }
}



async function keepLines(): Promise<void> {
    // Display a message box to the user
    const result = await window.showInputBox({
        value: '',
        placeHolder: 'Enter a RegEx to keep only matching lines',
    });

    const editor = vscode.window.activeTextEditor;
    if (editor && result) {
        const regExp = new RegExp(result || '');
        const document = editor.document;
        const lineCount = document.lineCount;
        const rangesToDelete : vscode.Range[] = [];
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            const aLine = document.lineAt(lineIndex);
            if (!regExp.test(aLine.text)) {
                const lineRange = new vscode.Range(aLine.range.start.line, 0, aLine.range.start.line+1, 0);
                rangesToDelete.push(lineRange);
            }
        }
        if (rangesToDelete.length) {
            editor.edit(editBuilder => {
                for (let aRange of rangesToDelete) {
                    editBuilder.delete (aRange);
                }
            });
        }
    }
}
