# Change Log
All notable changes to the "scenebuilderextension" extension will be documented in this file.

I'm not a JS developer. I am not familiar with Promise and callbacks. I am open to any kind of feedback.

## [Unreleased]
- Tests are required.

### [0.0.3] - 21 November 2019
- Change path of settings.json to store scenebuilder executable path.

### [0.0.2] - 15 April 2018
-`Open in SceneBuilder` command can be invoked from either context menu or explorer menu.
-SceneBuilderExtension needs application path for open FXML files with it. Application path is searching in following steps:
    *`scenebuilder.home` should be set in global settings in VSCode.
    *Extension asks user for where application path is located. After user make a selection. Configuration file saves into extension
    storage path. For next usage, extension will read this path information to open it.

## [0.0.1] - 11 April 2018

### Added
-This extension can be used from Java Developers who is currently developing JavaFX project and working with FXML files on VSCode.
-Basicly, extension opens FXML files in SceneBuilder. SceneBuilderExtension needs a pre-setting to use.
 `scenebuilder.home` must be setted into configurations of VSCode(User settings is enough).
 User can interact with extension by searching command `Open in SceneBuilder` in command palette, but, FXML file should be opened on editor. Extension can be used only when current document is a file that associated that FXML.