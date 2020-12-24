# dparakh-utils README

Some utilities for my personal use - mainly related to using P4 integration.

## Features

it provides the following commands:

* p4edit : to open the currently open file in editor for editing.
* p4revert : to revert the currently open file in editor.
* p4blame : to show who/which CL was used for the last change to the current line in current file.
* keeplines : to only keep lines that contain a matching RegEx
* flushlines : to remove all lines that contain a matching RegEx

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


-----------------------------------------------------------------------------------------------------------

