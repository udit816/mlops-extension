// src/test/extension.test.ts
import * as assert from 'assert';
import { describe, it, before } from 'mocha';
import * as vscode from 'vscode';

describe('Extension Test Suite', () => {
    before(() => {
        vscode.window.showInformationMessage('Start all tests.');
    });

    it('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
});