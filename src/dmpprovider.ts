import * as vscode from 'vscode';
import * as cp from "child_process";
import * as fs from 'fs';

const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
        cp.exec(cmd, (err, out) => {
            if (err) {
                return reject(err);
            }
            return resolve(out);
        });
    });


class DmpDocument implements vscode.CustomDocument {
    private _uri: vscode.Uri;
    private _content: string;
    
    dispose(): void {
        throw new Error('Method not implemented.');
    }

    private static symPath() : string | undefined
    {
        return vscode.workspace.getConfiguration("dparakh-utils").get("symlocation");
    }

    private static debuggerPath() : string | undefined
    {
        return vscode.workspace.getConfiguration("dparakh-utils").get("dtwlocation");
    }

    private static dtwInstalled() : boolean
    {
        const cdbPath = "" + DmpDocument.debuggerPath() + "\\cdb.exe";
        const windbgPath = "" + DmpDocument.debuggerPath() + "\\windbg.exe";
        return fs.existsSync(cdbPath) && fs.existsSync(windbgPath);
    }

	static async create(
		uri: vscode.Uri
	): Promise<DmpDocument | PromiseLike<DmpDocument>> {
		let newDoc = new DmpDocument(uri);
        if (this.dtwInstalled()) {
            newDoc._content = await execShell('"' + DmpDocument.debuggerPath() + '\\cdb" -z "' + uri.fsPath + '" -c "lmv M *.exe;!analyze -v;~*kb;q" -y "' + DmpDocument.symPath() + '"');
        }
        else {
            newDoc._content = "Unable to find Debugging Tools For Windows at:\n" + this.debuggerPath() +
                "\n\nPlease make sure DTW is installed and correct path is specified in configuration for Extension: Memory Dump Viewer.";
        }
        return newDoc;
	}

	private constructor(
		uri: vscode.Uri
	) {
		this._uri = uri;
        this._content = "";
        //Execute cdb to extract all that we need...
	}


    public get uri() { return this._uri; }
    
    html() : string {
        const contents = '<p>' + this._content.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>').replace(/ /g, '&nbsp;') + '</p>';
        const thescript = `
        function OpenInWinDbg() {
            const vscode = acquireVsCodeApi();
            alert("test")
            vscode.postMessage({
                type: 'open_in_windbg'
            });
        }`

        if (DmpDocument.dtwInstalled())
        {
            return '<html><button onclick="OpenInWinDbg()" style="float: right;">Open DMP in WinDbg</button><tt><script>' + thescript + '</script>' + contents + '</tt></html>';
        }
        else {
            return '<html><button onclick="OpenInWinDbg()" style="float: right;">Configure DTW Path</button><tt><script>' + thescript + '</script>' + contents + '</tt></html>';
        }
    }

    openInWinDbg() {
        //var spawn = require('child_process').spawn;
        if (DmpDocument.dtwInstalled()) {
            const windbg = DmpDocument.debuggerPath() + "\\windbg.exe";
            cp.spawn(windbg, ['-z', this._uri.fsPath, '-y', "" + DmpDocument.symPath()], {
                detached: true
            });
        }
        else {
            vscode.commands.executeCommand("workbench.action.openSettings2")
        }
    }

}


export class DmpEditorProvider implements vscode.CustomReadonlyEditorProvider<DmpDocument> {
    async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): Promise<DmpDocument> {
        const document: DmpDocument = await DmpDocument.create(uri);
        return document;
    }
    resolveCustomEditor(document: DmpDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
		};
        webviewPanel.webview.html = document.html();
        webviewPanel.webview.onDidReceiveMessage(e => this.onMessage(document, e));        
    }

	private onMessage(document: DmpDocument, message: any) {
		switch (message.type) {
			case 'open_in_windbg':
				document.openInWinDbg();
				return;
		}
	}

	constructor(
		private readonly _context: vscode.ExtensionContext
	) { }

}


