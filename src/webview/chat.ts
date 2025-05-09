// src/webview/chat.ts
import * as vscode from 'vscode';

export class ChatWebviewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        try {
            console.log('Resolving webview view'); // Debug log
            this._view = webviewView;
            webviewView.webview.options = {
                enableScripts: true,
                localResourceRoots: [this._extensionUri]
            };
    
            webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    
            // Handle messages from the webview
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

    private _getHtmlForWebview(webview: vscode.Webview): string {
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
                                }
                            });

                            function addMessage(text, sender) {
                                const messageDiv = document.createElement('div');
                                messageDiv.className = \`message \${sender}-message\`;
                                messageDiv.textContent = text;
                                messagesContainer.appendChild(messageDiv);
                                messageDiv.scrollIntoView({ behavior: 'smooth' });
                            }

                            // Send message function
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

                            // Handle Enter key
                            messageInput.addEventListener('keypress', (e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            });

                            // Focus input on load
                            messageInput.focus();
                        })();
                    </script>
                </body>
            </html>
        `;
    }

    private async handleChatMessage(message: string) {
        try {
            // Here you would integrate with your backend API
            // For now, we'll just echo the message
            if (this._view) {
                // Simulate a delay to make it feel more natural
                await new Promise(resolve => setTimeout(resolve, 500));
                
                this._view.webview.postMessage({
                    type: 'response',
                    message: `Echo: ${message}`
                });
            }
        } catch (error) {
            console.error('Error handling chat message:', error);
            if (this._view) {
                this._view.webview.postMessage({
                    type: 'response',
                    message: 'Sorry, there was an error processing your message.'
                });
            }
        }
    }
}