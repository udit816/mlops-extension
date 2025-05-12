// src/webview/chat.ts
import * as vscode from 'vscode';
import { ChatService } from '../services/chat/chatService';
import { ChatContext } from '../services/chat/types';

export class ChatWebviewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private chatService: ChatService;
    private chatContext?: ChatContext;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        apiBaseUrl: string
    ) {
        this.chatService = new ChatService(apiBaseUrl);
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        try {
            console.log('Resolving webview view');
            this._view = webviewView;
            webviewView.webview.options = {
                enableScripts: true,
                localResourceRoots: [this._extensionUri]
            };
    
            webviewView.webview.html = this._getHtmlForWebview();
    
            webviewView.webview.onDidReceiveMessage(async (data) => {
                try {
                    switch (data.type) {
                        case 'sendMessage':
                            await this.handleChatMessage(data.message);
                            break;
                    }
                } catch (error) {
                    console.error('Error handling webview message:', error);
                }
            });
        } catch (error) {
            console.error('Error resolving webview:', error);
            throw error;
        }
    }

    private async handleChatMessage(message: string) {
        try {
            if (!this._view) return;

            // Show loading state
            this._view.webview.postMessage({
                type: 'status',
                status: 'loading'
            });

            // Process message using chatService
            const response = await this.chatService.processMessage(message, this.chatContext);

            // Update context if provided
            if (response.context) {
                this.chatContext = response.context;
            }

            // Send response back to webview
            this._view.webview.postMessage({
                type: 'response',
                message: response.message
            });

            // Handle any actions if present
            if (response.action) {
                await this.handleAction(response.action);
            }

        } catch (error) {
            console.error('Error handling chat message:', error);
            if (this._view) {
                this._view.webview.postMessage({
                    type: 'error',
                    message: 'Sorry, there was an error processing your message.'
                });
            }
        }
    }

    private async handleAction(action: string) {
        switch (action) {
            case 'CREATE_TRAINING_PIPELINE':
                await vscode.commands.executeCommand('mlops.startFlow', 'Training');
                break;
            case 'CREATE_INFERENCE_PIPELINE':
                await vscode.commands.executeCommand('mlops.startFlow', 'Inference');
                break;
            // Add more actions as needed
        }
    }

    private _getHtmlForWebview(): string {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            padding: 0;
                            margin: 0;
                        }
                        .chat-container {
                            display: flex;
                            flex-direction: column;
                            height: 100vh;
                            padding: 10px;
                            box-sizing: border-box;
                        }
                        .messages {
                            flex: 1;
                            overflow-y: auto;
                            margin-bottom: 10px;
                            padding: 10px;
                            background-color: var(--vscode-editor-background);
                        }
                        .message {
                            margin-bottom: 10px;
                            padding: 8px;
                            border-radius: 4px;
                            max-width: 80%;
                        }
                        .user-message {
                            background-color: var(--vscode-button-background);
                            color: var(--vscode-button-foreground);
                            margin-left: auto;
                        }
                        .bot-message {
                            background-color: var(--vscode-editor-inactiveSelectionBackground);
                            color: var(--vscode-editor-foreground);
                        }
                        .input-container {
                            display: flex;
                            padding: 5px;
                            background-color: var(--vscode-editor-background);
                            border-top: 1px solid var(--vscode-panel-border);
                        }
                        #messageInput {
                            flex: 1;
                            margin-right: 5px;
                            padding: 8px;
                            border: 1px solid var(--vscode-input-border);
                            background-color: var(--vscode-input-background);
                            color: var(--vscode-input-foreground);
                            border-radius: 4px;
                        }
                        button {
                            padding: 8px 16px;
                            background-color: var(--vscode-button-background);
                            color: var(--vscode-button-foreground);
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        button:hover {
                            background-color: var(--vscode-button-hoverBackground);
                        }
                    </style>
                </head>
                <body>
                    <div class="chat-container">
                        <div class="messages" id="messages">
                            <div class="message bot-message">Hello! How can I help you today?</div>
                        </div>
                        <div class="input-container">
                            <input type="text" 
                                   id="messageInput" 
                                   placeholder="Type your message..."
                                   autofocus>
                            <button onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                    <script>
                        (function() {
                            const vscode = acquireVsCodeApi();
                            const messagesContainer = document.getElementById('messages');
                            const messageInput = document.getElementById('messageInput');

                            // Handle messages sent from the extension to the webview
                            window.addEventListener('message', event => {
                                const message = event.data;
                                switch (message.type) {
                                    case 'response':
                                        addMessage(message.message, 'bot');
                                        break;
                                    case 'error':
                                        addMessage(message.message, 'bot');
                                        break;
                                }
                            });

                            function addMessage(text, sender) {
                                const messageDiv = document.createElement('div');
                                messageDiv.className = \`message \${sender}-message\`;
                                messageDiv.textContent = text;
                                messagesContainer.appendChild(messageDiv);
                                messageDiv.scrollIntoView({ behavior: 'smooth' });
                            }

                            window.sendMessage = function() {
                                const message = messageInput.value.trim();
                                if (message) {
                                    addMessage(message, 'user');
                                    vscode.postMessage({
                                        type: 'sendMessage',
                                        message: message
                                    });
                                    messageInput.value = '';
                                }
                            };

                            messageInput.addEventListener('keypress', (e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            });

                            messageInput.focus();
                        })();
                    </script>
                </body>
            </html>
        `;
    }
}