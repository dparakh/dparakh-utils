# dparakh-utils README

Some utilities for my personal use - mainly related to using P4 integration.

## Features

it provides the following commands:

* p4edit : to open the currently open file in editor for editing.
* p4revert : to revert the currently open file in editor.
* p4blame : to show who/which CL was used for the last change to the current line in current file.
* keeplines : to only keep lines that contain a matching RegEx
* flushlines : to remove all lines that contain a matching RegEx
* addsgmarks : to automatically create bookmarks for SG Diagnostic Log reports (needs SGDiagBookmarkPhrases.txt in Documents folder)

## Requirements

You must have the p4blame.py acessible in the path for p4blame to work.

## Extension Settings

No Settings!

## Known Issues

None that I know of!

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release of dparakh-utils

### 0.0.2

* Fixed issue related to spaces in filenames when running p4 commands.
* Changes to use a dedicated terminal named P4 for all commands.

### 0.0.3

* Added keeplines and flushlines commands (similar to the emacs keep-lines and flush-lines).

### 0.0.4

* Added addsgmarks command - to automatically generate bookmarks

### 0.0.5

* Added support for UTF-16 encoded files for addsgmarks

### 0.0.6

* Fix Bug : If phrases file has empty lines - all files' all lines are bookmarked.

### 0.0.7

* Added support for .dmp files (Windows Memory Dumps)

-----------------------------------------------------------------------------------------------------------

