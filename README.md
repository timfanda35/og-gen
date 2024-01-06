# OG Gen

A VS Code extension to execute `og_gen` command in the hugo project: https://github.com/timfanda35/timfanda35.github.io

## Features

Currently only support the project: https://github.com/timfanda35/timfanda35.github.io

It will detect current file in active editor and generate OG Image under `static/images` directory.

## Development

Press `F5` to run debug window.

## Package

Install [vsce](https://github.com/microsoft/vscode-vsce)

```bash
npm install -g @vscode/vsce
```

```bash
make package
```

## Install vsix

```bash
make install
```
