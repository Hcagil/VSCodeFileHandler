import * as vscode from 'vscode';
import { clearComments as fileHandlerClearComments } from './fileHandler';

export function activate(context: vscode.ExtensionContext) {

	let clearCommentsDisposable = vscode.commands.registerCommand('filehandler.clearComments', fileHandlerClearComments);
	context.subscriptions.push(clearCommentsDisposable);
}


// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Extension is deactivated!');
}
