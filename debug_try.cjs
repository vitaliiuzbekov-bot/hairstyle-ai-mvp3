const fs = require('fs');
const ts = require('typescript');
const code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');
const sourceFile = ts.createSourceFile('generate.ts', code, ts.ScriptTarget.Latest, true);

function visit(node) {
    if (node.kind === ts.SyntaxKind.TryStatement) {
        const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
        const endLine = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1;
        console.log(`try block at line ${line}, ends at ${endLine}`);
        if (node.catchClause) {
            const catchLine = sourceFile.getLineAndCharacterOfPosition(node.catchClause.getStart()).line + 1;
            console.log(`  -> caught at line ${catchLine}`);
        } else {
            console.log(`  -> NO CATCH OR FINALLY`);
        }
    }
    ts.forEachChild(node, visit);
}
visit(sourceFile);
