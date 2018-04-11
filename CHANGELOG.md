# Change Log
All notable changes to the "scenebuilderextension" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]
- `Open in SceneBuilder` should be called from explorer menu and context menu.
- `scenebuilder.home` is setting manually by hand. User should be select it via file dialog.

## [0.0.1] - 11 April 2018

### Added
-This extension can be used from Java Developers who is currently developing JavaFX project and working with FXML files on VSCode.
-Basicly, extension opens FXML files in SceneBuilder. SceneBuilderExtension needs a pre-setting to use.
 `scenebuilder.home` must be setted into configurations of VSCode(User settings is enough).
 User can interact with extension by searching command `Open in SceneBuilder` in command palette, but, FXML file should be opened on editor. Extension can be used only when current document is a file that associated that FXML.