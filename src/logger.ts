// src/logger.ts
import * as vscode from 'vscode';

export class OutputLogger {
    private channel: vscode.OutputChannel;

    constructor(name: string) {
        this.channel = vscode.window.createOutputChannel(name);
    }

    info(message: string) {
        this.log(message, 'INFO');
    }

    error(message: string) {
        this.log(message, 'ERROR');
        // Also show error messages in the UI
        vscode.window.showErrorMessage(message);
    }

    debug(message: string) {
        this.log(message, 'DEBUG');
    }

    private log(message: string, level: string) {
        const timestamp = new Date().toLocaleString();
        this.channel.appendLine(`[${timestamp}] [${level}] ${message}`);
    }

    show() {
        this.channel.show();
    }

    clear() {
        this.channel.clear();
    }
}