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
exports.MLOpsTreeViewProvider = void 0;
// src/treeView.ts
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class MLOpsTreeViewProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    items = [
        new MLOpsItem('MLOps Flows', 'flows', vscode.TreeItemCollapsibleState.Collapsed, [
            new MLOpsItem('Training Flows', 'training', vscode.TreeItemCollapsibleState.Collapsed),
            new MLOpsItem('Inference Flows', 'inference', vscode.TreeItemCollapsibleState.Collapsed)
        ]),
        new MLOpsItem('Artifacts', 'artifacts', vscode.TreeItemCollapsibleState.Collapsed, [
            new MLOpsItem('Models', 'models', vscode.TreeItemCollapsibleState.Collapsed),
            new MLOpsItem('Datasets', 'datasets', vscode.TreeItemCollapsibleState.Collapsed)
        ]),
        new MLOpsItem('Chat History', 'chat', vscode.TreeItemCollapsibleState.Collapsed)
    ];
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve(this.items);
        }
        return Promise.resolve(element.children || []);
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
}
exports.MLOpsTreeViewProvider = MLOpsTreeViewProvider;
class MLOpsItem extends vscode.TreeItem {
    label;
    id;
    collapsibleState;
    children;
    constructor(label, id, collapsibleState, children) {
        super(label, collapsibleState);
        this.label = label;
        this.id = id;
        this.collapsibleState = collapsibleState;
        this.children = children;
        this.tooltip = label;
        this.contextValue = id;
        // Get the extension's root path
        const extensionPath = path.join(__dirname, '..', '..');
        // Create proper Uri objects for the icon paths
        this.iconPath = {
            light: vscode.Uri.file(path.join(extensionPath, 'resources', 'light', `${id}.svg`)),
            dark: vscode.Uri.file(path.join(extensionPath, 'resources', 'dark', `${id}.svg`))
        };
    }
}
//# sourceMappingURL=treeView.js.map