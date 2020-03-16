'use strict';

import * as vscode from 'vscode';
import * as cp from 'child_process';

const SCENE_BUILDER_KEY: string = 'sceneBuilderPath'; 

export function activate(context: vscode.ExtensionContext) {

    console.log('SceneBuilder Extension is now active!');

    let disposableOpenIn = vscode.commands.registerCommand('extension.scenebuilder.open-in', (event) => {
        openInSceneBuilder(event, context);
    });

    let disposableChangePath = vscode.commands.registerCommand('extension.scenebuilder.change-path', (event) => {
        updateSceneBuilderPath(context, (sceneBuilderPath:string) => { /* no op */ });
    });

    context.subscriptions.push(disposableOpenIn);
    context.subscriptions.push(disposableChangePath);
}

function openInSceneBuilder(event: any, context: vscode.ExtensionContext) {
    let fxmlPath:string;
    let editor = vscode.window.activeTextEditor;
    if(event) {
        fxmlPath = event.path;
    } else if(editor) {
        /** path that will be opened in SceneBuilder */
        fxmlPath = editor.document.fileName;
    } else {
        vscode.window.showErrorMessage("FXML path could not be determined");
        return;
    }
    
    console.log(`FXML file path ${fxmlPath}`);
    // if scene buidler already defined, try to exec
    if(isSceneBuilderPathDefined(context)) {
        execSceneBuilder(context, fxmlPath);
    } else {
        // if scene buidler is not defined, select scenebuilder path and try to exec
        updateSceneBuilderPath(context, (sbPath) => {
            execSceneBuilder(context, fxmlPath)
        })
    }        
}

function isSceneBuilderPathDefined(context: vscode.ExtensionContext): boolean {
    return getSceneBuilderPath(context) !== undefined;
}

function getSceneBuilderPath(context: vscode.ExtensionContext): string {
    return context
        .globalState
        .get(SCENE_BUILDER_KEY) as string;
}

function execSceneBuilder(context: vscode.ExtensionContext, fxmlFilePath: string) {
    let sceneBuilderPath = getSceneBuilderPath(context);

    let command: string;
    let args: string[];
    // for macOS applications
    if (process.platform == 'darwin' && sceneBuilderPath.startsWith('/Applications/')) {
        command = `/usr/bin/open`
        args = ['-a', sceneBuilderPath, '--args', fxmlFilePath]
    } else {
        command = sceneBuilderPath
        args = [fxmlFilePath]
    }

    console.log(`executing command: ${command} ${args.join(' ')}`);
    cp.execFile(command, args, {}, (error, stdout, stderr) => {
        if (error) {
            console.error('exec error: ' + error);
            vscode.window.showErrorMessage("SceneBuilder couldn't opened!");
        }
    });
}

function updateSceneBuilderPath(context: vscode.ExtensionContext, callback: (sceneBuilderPath:string) => void) {
    /** stackoverflow.com/a/47063669/5929406 */
    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Open',
        filters: {
            'All files': ['*']
        }
    };
    
    vscode
        .window
        .showOpenDialog(options)
        .then(fileUri => {
            if (fileUri && fileUri[0]) {
                let scenebuilderPath = fileUri[0].fsPath;
                console.log('Selected file: ' + scenebuilderPath);

                context
                    .globalState
                    .update(SCENE_BUILDER_KEY, scenebuilderPath)
                    .then(value => {
                        callback(scenebuilderPath);
                    });
            }
        });
}

// this method is called when your extension is deactivated
export function deactivate() {
}