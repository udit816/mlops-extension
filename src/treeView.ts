// src/treeView.ts
import * as vscode from 'vscode';
import * as path from 'path';

export class MLOpsTreeViewProvider implements vscode.TreeDataProvider<MLOpsItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<MLOpsItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private items: MLOpsItem[] = [
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

    getTreeItem(element: MLOpsItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: MLOpsItem): Thenable<MLOpsItem[]> {
        if (!element) {
            return Promise.resolve(this.items);
        }
        return Promise.resolve(element.children || []);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

class MLOpsItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly id: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly children?: MLOpsItem[]
    ) {
        super(label, collapsibleState);
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