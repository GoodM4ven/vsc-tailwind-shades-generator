const vscode = require('vscode');
const colorNamer = require('hex-to-color-name');
const { generateTailwindShades, getShadesAsJsonString, getShadesAsCssVariablesString } = require('./utils');

const TAILWIND_CSS_COLOR_NAMES = {
    black: '000000',
    slate: '64748B',
    gray: '6B7280',
    zinc: '71717A',
    neutral: '737373',
    stone: '78716C',
    red: 'EF4444',
    orange: 'F97316',
    amber: 'F59E0B',
    yellow: 'EAB308',
    lime: '84CC16',
    green: '22C55E',
    emerald: '10B981',
    teal: '14B8A6',
    cyan: '06B6D4',
    sky: '0EA5E9',
    blue: '3B82F6',
    indigo: '6366F1',
    violet: '8B5CF6',
    purple: 'A855F7',
    fuchsia: 'D946EF',
    pink: 'EC4899',
    rose: 'F43F5E',
    white: 'FFFFFF',
};

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('vsc-tailwind-shades-generator.generateColorShadesAsJson', () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                return vscode.window.showErrorMessage('No open text editor.');
            }

            const range = editor.document.getText(editor.selection);
            const shades = generateTailwindShades(range);

            if (!shades) {
                return vscode.window.showErrorMessage('No valid color is selected.');
            }

            const colorName = colorNamer(range, TAILWIND_CSS_COLOR_NAMES);
            const line = editor.document.lineAt(editor.selection.start.line);
            const match = line.text.match(/^(\s*)/);
            const indentation = match ? match[1] : '';
            const tabWidth = editor.options.tabSize;
            const shadesString = getShadesAsJsonString(shades, colorName, indentation, tabWidth);

            editor.edit((builder) => {
                builder.replace(editor.selection, shadesString);
            });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('vsc-tailwind-shades-generator.generateColorShadesAsCssVariables', () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                return vscode.window.showErrorMessage('No open text editor.');
            }

            const selectedText = editor.document.getText(editor.selection);
            const shades = generateTailwindShades(selectedText);

            if (!shades) {
                return vscode.window.showErrorMessage('No valid color is selected.');
            }

            const colorName = colorNamer(selectedText, TAILWIND_CSS_COLOR_NAMES);
            const selection = editor.selection.isReversed ? editor.selection.active : editor.selection.anchor;
            const indentation = selection.character;
            const shadesString = getShadesAsCssVariablesString(shades, colorName, indentation);

            editor.edit((builder) => {
                builder.replace(editor.selection, shadesString);
            });
        })
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
