import * as vscode from 'vscode';



enum CommentType {
    Hash = "#",
    DoubleSlash = "//",
    SlashStar = "/*"
}
enum FileType {
    Python = CommentType.Hash,
    JavaScript = CommentType.DoubleSlash,
    TypeScript = CommentType.DoubleSlash,
    Cpp = CommentType.DoubleSlash,
    C = CommentType.DoubleSlash,
    CMake = CommentType.Hash

}

export function getFileType(document: vscode.TextDocument): string {
    const fileName:string = document.fileName;
    const strFileType = fileName.split('.').pop();

    if (strFileType === 'py')
        return FileType.Python;
    else if (strFileType === 'js')
        return FileType.JavaScript;
    else if (strFileType === 'ts')
        return FileType.TypeScript;
    else if (strFileType === 'cpp')
        return FileType.Cpp;
    else if (strFileType === 'c')
        return FileType.C;
    else if (strFileType === 'cmake')
        return FileType.CMake;
    else
        return "";

}

export async function clearComments(context: vscode.WindowState) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const fileType = getFileType(editor.document);

    if (fileType === "") {
        vscode.window.showErrorMessage('File type not supported.');
        return;
    }

    const document = editor.document;
    const content = document.getText();
    
    const cleanedContent = content
        .split('\n')
        .filter(line => !line.trim().startsWith(fileType))
        .join('\n');

    // Use the VSCode API to replace the document's text
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(content.length)
    );
    edit.replace(document.uri, fullRange, cleanedContent);

    // Apply the edit
    await vscode.workspace.applyEdit(edit);
    vscode.window.showInformationMessage('File processed successfully!');
}