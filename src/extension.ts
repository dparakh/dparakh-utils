// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { window } from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import { DmpEditorProvider } from './dmpprovider';

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

	let p4diffCommand = vscode.commands.registerCommand('extension.p4diff', () => {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
                if (os.platform() === 'win32') {
                    sendTextToTerminal('$env:P4DIFF="C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd --diff"; p4 diff "' + activeEditor.document.uri.fsPath + '"');
                } else {
                    sendTextToTerminal('P4DIFF="code --diff --wait" p4 diff "' + activeEditor.document.uri.fsPath + '"');
                }
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

	let addsgmarksCommand = vscode.commands.registerCommand('extension.addsgmarks', () => {
		// The code you place here will be executed every time your command is executed
        addSGMarks();
	});

    let dmpEditor = vscode.window.registerCustomEditorProvider("dparakh.dmp", new DmpEditorProvider(context),
    {
        // For this demo extension, we enable `retainContextWhenHidden` which keeps the
        // webview alive even when it is not visible. You should avoid using this setting
        // unless is absolutely required as it does have memory overhead.
        webviewOptions: {
            retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
    });


	context.subscriptions.push(p4editCommand);
	context.subscriptions.push(p4revertCommand);
	context.subscriptions.push(p4blameCommand);
	context.subscriptions.push(p4diffCommand);
	context.subscriptions.push(keeplinesCommand);
	context.subscriptions.push(flushlinesCommand);
	context.subscriptions.push(addsgmarksCommand);
    context.subscriptions.push(dmpEditor);
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

function getFileEncoding( f: fs.PathLike ) {
    //var d = new Buffer.alloc(5, [0, 0, 0, 0, 0]);
    var d = Buffer.alloc(5);
    var fd = fs.openSync(f, 'r');
    fs.readSync(fd, d, 0, 5, 0);
    fs.closeSync(fd);

    // https://en.wikipedia.org/wiki/Byte_order_mark
    var e = '';
    if ( e.length == 0 && d[0] === 0xEF && d[1] === 0xBB && d[2] === 0xBF)
        e = 'utf8';
    if (e.length == 0 && d[0] === 0xFE && d[1] === 0xFF)
        e = 'utf16be';
    if (e.length == 0 && d[0] === 0xFF && d[1] === 0xFE)
        e = 'utf16le';
    if (e.length == 0)
        e = 'utf8';

    return e;
}

async function addSGMarks(): Promise<void> {
    const markExpressionsFile = os.homedir() + "/Documents/SGDiagBookmarkPhrases.txt"
    const expressionsArray = fs.existsSync(markExpressionsFile) ? fs.readFileSync(markExpressionsFile, "utf8").split(/\r?\n/).filter(phrase => phrase.length > 0) : [];
    if (expressionsArray.length < 1)
    {
        window.showErrorMessage("Could not find a list of strings to match in " + markExpressionsFile);
        return;
    }
    //ToDo: Create bookmarks.json if one does not exist...
    const dotVSCodeFolder = (vscode.workspace.workspaceFolders != undefined) ? vscode.workspace.workspaceFolders[0].uri.fsPath + "/.vscode" : "";
    const bookmarksFile = (vscode.workspace.workspaceFolders != undefined) ? vscode.workspace.workspaceFolders[0].uri.fsPath + "/.vscode/bookmarks.json" : "";
    var bookmarksFromFile = fs.existsSync(bookmarksFile) ? JSON.parse(fs.readFileSync(bookmarksFile, "utf8")) : { files : []}
    await vscode.workspace.findFiles('**', null, 1000).then((uris: vscode.Uri[] ) => {         
        uris.forEach((uri: vscode.Uri) => {              
              if ((uri.toString().includes("/.vscode/")) || (uri.path.endsWith(".sys")) || (uri.path.endsWith(".dmp")) || (uri.path.endsWith(".evtx")) || (uri.path.endsWith(".etl")) || (uri.path.endsWith(".pdb")))
              {
                  console.log("Will Skip: " + uri);
              }
              else {
                  console.log("Searching: " + uri);
                  var new_bookmarks : Object[] = [];
                  const fileContents = fs.readFileSync(uri.fsPath, getFileEncoding(uri.fsPath))
                  const linesArray = fileContents.split(/\r?\n/);
                  linesArray.forEach((line, lineIndex) => {
                      expressionsArray.forEach((markExpression, exprIndex) => {
                          const columnPos = line.indexOf(markExpression);
                          if (columnPos >= 0) {
                              var bookmark = {line: lineIndex, column : columnPos, label : markExpression};
                              new_bookmarks.push(bookmark);
                          }
                      });
                  });
                  if (new_bookmarks.length > 0)
                  {
                      const newEntry = {path : vscode.workspace.asRelativePath(uri), bookmarks : new_bookmarks};
                      bookmarksFromFile["files"].push (newEntry);
                  }
              }
        });
     });

     //cannot assume that the dot vs code folder existis
     if (!fs.existsSync(dotVSCodeFolder))
     {
         fs.mkdirSync(dotVSCodeFolder);
     }

     fs.writeFileSync(bookmarksFile, JSON.stringify(bookmarksFromFile), "utf8")

     //this is to make sure bookmarks extension reloads the bookmarks
     vscode.commands.executeCommand("workbench.action.reloadWindow")
}

