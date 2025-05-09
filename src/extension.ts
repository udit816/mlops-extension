// src/extension.ts
import * as vscode from 'vscode';
import { MLOpsTreeViewProvider } from './treeView';
import { ChatWebviewProvider } from './webview/chat';
import { registerCommands } from './commands';
import { OutputLogger } from './logger';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating MLOps extension...');

    // Initialize services
    const logger = new OutputLogger('MLOps');
    
    try {
        // Register Tree View
        const treeViewProvider = new MLOpsTreeViewProvider();
        const treeView = vscode.window.createTreeView('mlopsExplorer', {
            treeDataProvider: treeViewProvider,
            showCollapseAll: true
        });
        context.subscriptions.push(treeView);
        
        // Register Webview Provider
        const chatProvider = new ChatWebviewProvider(context.extensionUri);
        const chatViewRegistration = vscode.window.registerWebviewViewProvider(
            'mlops.chatView',
            chatProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        );
        context.subscriptions.push(chatViewRegistration);
        
        // Register Commands
        registerCommands(context, treeViewProvider, chatProvider, logger);
        
        logger.info('MLOps Extension Activated Successfully');
        console.log('MLOps extension activated successfully');
    } catch (error) {
        logger.error(`Failed to activate MLOps extension: ${error}`);
        console.error('Failed to activate MLOps extension:', error);
    }
}

export function deactivate() {}