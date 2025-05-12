// src/commands.ts
import * as vscode from 'vscode';
import { MLOpsTreeViewProvider } from './treeView';
import { ChatWebviewProvider } from './webview/chat';
import { OutputLogger } from './logger';

export function registerCommands(
    context: vscode.ExtensionContext,
    treeView: MLOpsTreeViewProvider,
    _chatProvider: ChatWebviewProvider,
    logger: OutputLogger
) {
    // Register all commands
    const commands = [
        vscode.commands.registerCommand('mlops.startFlow', async () => {
            try {
                const flowType = await vscode.window.showQuickPick(['Training', 'Inference'], {
                    placeHolder: 'Select flow type'
                });
                if (flowType) {
                    logger.info(`Starting ${flowType} flow`);
                    // Implement flow start logic
                }
            } catch (error) {
                logger.error(`Error starting flow: ${error}`);
                vscode.window.showErrorMessage(`Failed to start flow: ${error}`);
            }
        }),

        vscode.commands.registerCommand('mlops.viewHistory', () => {
            try {
                vscode.commands.executeCommand('mlops.chatView.focus');
                logger.info('Opened chat history view');
            } catch (error) {
                logger.error(`Error viewing history: ${error}`);
                vscode.window.showErrorMessage(`Failed to open chat history: ${error}`);
            }
        }),

        vscode.commands.registerCommand('mlops.deployModel', async () => {
            try {
                const modelId = await vscode.window.showInputBox({
                    placeHolder: 'Enter model ID to deploy',
                    validateInput: text => {
                        return text && text.trim().length > 0 ? null : 'Model ID is required';
                    }
                });
                if (modelId) {
                    logger.info(`Deploying model: ${modelId}`);
                    // Implement deployment logic
                }
            } catch (error) {
                logger.error(`Error deploying model: ${error}`);
                vscode.window.showErrorMessage(`Failed to deploy model: ${error}`);
            }
        }),

        vscode.commands.registerCommand('mlops.refreshExplorer', () => {
            try {
                treeView.refresh();
                logger.info('Refreshed MLOps Explorer');
            } catch (error) {
                logger.error(`Error refreshing explorer: ${error}`);
                vscode.window.showErrorMessage(`Failed to refresh explorer: ${error}`);
            }
        })
    ];

    context.subscriptions.push(...commands);
    logger.info('MLOps commands registered successfully');
}