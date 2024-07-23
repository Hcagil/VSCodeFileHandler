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
    C = CommentType.DoubleSlash

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
    else
        return "";

}

export async function clearComments(context: vscode.WindowState) {
    // const editor = vscode.window.activeTextEditor;
    // if (!editor) {
    //     return;
    // }

    // const fileType = getFileType(editor.document);

    // try {
    //     // Read file content
    //     const filePath = editor.document.uri.fsPath;
    //     const content = fs.readFileSync(filePath, 'utf8');

    //     // Split content into lines, filter out lines starting with '#', and join remaining lines
    //     const filteredContent = content
    //         .split('\n')
    //         .filter(line => !line.trim().startsWith(fileType))
    //         .join('\n');

    //     // Write the cleaned content back to the file
    //     fs.writeFileSync(filePath, filteredContent, 'utf8');
    //     vscode.window.showInformationMessage('Comments Cleared successfully!');
    // } catch (error) {
    //     // Type assertion to `Error` to access `message` property
    //     if (error instanceof Error) {
    //         vscode.window.showErrorMessage(`Error processing file: ${error.message}`);
    //     } else {
    //         // Handle case where error is not of type `Error`
    //         vscode.window.showErrorMessage('An unknown error occurred.');
    //     }    }

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const fileType = getFileType(editor.document);

    const document = editor.document;
    const content = document.getText();

    // Filter out lines starting with '#'
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