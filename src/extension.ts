'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log('SceneBuilder Extension is now active!');

    let disposable = vscode.commands.registerCommand('extension.scenebuilder', () => {

        /** SceneBuilder application path */
        let sceneBuilderPath = getSceneBuilderPath();
        console.log("scenebuilder path -" + sceneBuilderPath);

        let fxmlPath:string|undefined;
        let editor = vscode.window.activeTextEditor;
        if(editor) {
            /** path that will be opened in SceneBuilder */
            fxmlPath = editor.document.fileName;
            console.log("fxml file path -" + fxmlPath);
        }

        /** if sceneBuilderPath and file path is okey. There is no validation for now.*/
        if(fxmlPath && sceneBuilderPath) {
            cp.execFile(sceneBuilderPath, [fxmlPath], {}, (error, stdout, stderr) => {
                if (error || stderr) {
                     console.log('exec error: ' + error);
                     vscode.window.showErrorMessage("SceneBuilder couldn't opened!");
                }
            });
            vscode.window.showInformationMessage('SceneBuilder is opening..!');
        } else {
            vscode.window.showErrorMessage("SceneBuilder configuration could not found!");
        }
        
    });

    context.subscriptions.push(disposable);
}

function getSceneBuilderPath():string|undefined {
    let config = vscode.workspace.getConfiguration();
    let path:string|undefined = config.get('scenebuilder.home');
    return path;
}

// this method is called when your extension is deactivated
export function deactivate() {
}