"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWebviewProvider = void 0;
class ChatWebviewProvider {
    _extensionUri;
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    await this.handleChatMessage(data.message);
                    break;
            }
        });
    }
    _getHtmlForWebview(webview) {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        .chat-container {
                            display: flex;
                            flex-direction: column;
                            height: 100vh;
                            padding: 10px;
                        }
                        .messages {
                            flex: 1;
                            overflow-y: auto;
                            margin-bottom: 10px;
                        }
                        .input-container {
                            display: flex;
                            padding: 5px;
                        }
                        #messageInput {
                            flex: 1;
                            margin-right: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="chat-container">
                        <div class="messages" id="messages"></div>
                        <div class="input-container">
                            <input type="text" id="messageInput" placeholder="Type your message...">
                            <button onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                    <script>
                        const vscode = acquireVsCodeApi();
                        
                        function sendMessage() {
                            const input = document.getElementById('messageInput');
                            const message = input.value;
                            if (message) {
                                vscode.postMessage({
                                    type: 'sendMessage',
                                    message: message
                                });
                                input.value = '';
                            }
                        }
                    </script>
                </body>
            </html>
        `;
    }
    async handleChatMessage(message) {
        // Here you would integrate with your backend API
        // For now, we'll just echo the message
        if (this._view) {
            this._view.webview.postMessage({
                type: 'response',
                message: `Echo: ${message}`
            });
        }
    }
}
exports.ChatWebviewProvider = ChatWebviewProvider;
//# sourceMappingURL=chat.js.map