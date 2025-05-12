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
        
        // Get API URL from configuration
        const config = vscode.workspace.getConfiguration('mlops');
        const apiBaseUrl: string = config.get('apiBaseUrl') || 'http://localhost:5000';
        
        // Register Webview Provider
        const chatProvider = new ChatWebviewProvider(context.extensionUri, apiBaseUrl);
        const chatViewRegistration = vscode.window.registerWebviewViewProvider(
            'mlops.chatView',
            chatProvider
        );
        context.subscriptions.push(chatViewRegistration);
        
        // Register Commands
        registerCommands(context, treeViewProvider, chatProvider, logger);
        
        logger.info('MLOps Extension Activated Successfully');
    } catch (error) {
        logger.error(`Failed to activate MLOps extension: ${error}`);
    }
}

export function deactivate() {}