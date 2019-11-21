'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';


const CONFIG_PATH:string = 'settings.json';

export function activate(context: vscode.ExtensionContext) {

    console.log('SceneBuilder Extension is now active!');

    let disposable = vscode.commands.registerCommand('extension.scenebuilder', (event) => {

        let fxmlPath:string;
        let editor = vscode.window.activeTextEditor;
        if(event) {
            fxmlPath = event.path;
        } else if(editor) {
            /** path that will be opened in SceneBuilder */
            fxmlPath = editor.document.fileName;
            console.log("fxml file path -" + fxmlPath);
        } else {
            // exception ?
            console.log("no file -- exception");
            return;
        }
        
        /** SceneBuilder application path */
        let config = vscode.workspace.getConfiguration();
        let sceneBuilderPath:string|undefined = config.get('scenebuilder.home');
        /** if user configurated SceneBuilder path with scenebuilder.home key into global settings,
         * simply return it. 
         */
        if(sceneBuilderPath) {
            console.log('Executing scenebuilder in ' + sceneBuilderPath);
            cp.execFile(sceneBuilderPath, [fxmlPath], {}, (error, stdout, stderr) => {
                if (error) {
                     console.log('exec error: ' + error);
                     vscode.window.showErrorMessage("SceneBuilder couldn't opened!");
                }
            });
        } else {
            try {
                /** Trying to read SceneBuilder path from config file. User do not set this config
                 * manually. If SceneBuilderExtension can not find the config file, it will generate
                 * by itself and expects to determine SceneBuilder path from user.
                 */
                let buffer:Buffer = fs.readFileSync(CONFIG_PATH, null);
                sceneBuilderPath = buffer.toString();
                cp.execFile(sceneBuilderPath, [fxmlPath], {}, (error, stdout, stderr) => {
                    if (error) {
                         console.log('exec error: ' + error);
                         vscode.window.showErrorMessage("SceneBuilder couldn't opened!");
                    }
                });
            }catch(error) {
                /** As extension needs a config file, if there path is not exist we should
                 * create a new one.
                 */
                if(error.code === 'ENOENT') {
                    /** there is itchy here. As I'm not a Javascript developer. I couldn't
                     * resolved the following problem: 
                     * showOpenDialog() is aync. However
                     */
                    if(CONFIG_PATH) {
                        let exists = fs.existsSync(CONFIG_PATH);
                        if(!exists) { 
                            fs.closeSync(fs.openSync(CONFIG_PATH, 'w'));
                        }
                    }
                    
                    createConfigurationFile(fxmlPath, (sceneBuilderPath:string, fxmlPath:string) => {
                        cp.execFile(sceneBuilderPath, [fxmlPath], {}, (error, stdout, stderr) => {
                            if (error) {
                                 console.log('exec error: ' + error);
                                 vscode.window.showErrorMessage("SceneBuilder couldn't opened!");
                            }
                        });
                    });
                }
        
            }
        }
        
        console.log("scenebuilder path -" + sceneBuilderPath);
        
    });

    context.subscriptions.push(disposable);
}

function createConfigurationFile(fxmlPath:string, callback: (sceneBuilderPath:string, fxmlPath:string) => void) {
    /** stackoverflow.com/a/47063669/5929406 */
    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Open',
        filters: {
            'All files': ['*']
        }
    };
    
    vscode.window.showOpenDialog(options).then(fileUri => {
        if (fileUri && fileUri[0]) {
            let scenebuilderPath = fileUri[0].fsPath;
            console.log('Selected file: ' + scenebuilderPath);

            fs.writeFile(CONFIG_PATH, scenebuilderPath, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log("Settings are created!");
            });

            callback(scenebuilderPath, fxmlPath);
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}