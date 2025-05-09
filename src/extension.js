"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// src/extension.ts
const vscode = __importStar(require("vscode"));
const treeView_1 = require("./treeView");
const chat_1 = require("./webview/chat");
const commands_1 = require("./commands");
const logger_1 = require("./logger");
async function activate(context) {
    // Initialize services
    const logger = new logger_1.OutputLogger('MLOps');
    // Register Tree View
    const treeViewProvider = new treeView_1.MLOpsTreeViewProvider();
    vscode.window.registerTreeDataProvider('mlopsExplorer', treeViewProvider);
    // Register Webview Provider
    const chatProvider = new chat_1.ChatWebviewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('mlops.chatView', chatProvider));
    // Register Commands
    (0, commands_1.registerCommands)(context, treeViewProvider, chatProvider, logger);
    logger.info('MLOps Extension Activated');
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map