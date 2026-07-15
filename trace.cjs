const fs = require('fs');
const code = fs.readFileSync('src/server/routes/generate.ts', 'utf8');

const ts = require('typescript');
const sourceFile = ts.createSourceFile('generate.ts', code, ts.ScriptTarget.Latest, true);

function visit(node) {
    if (node.kind === ts.SyntaxKind.TryStatement) {
        const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
        if (line > 227 && line < 770) {
           console.log(`try block at line ${line}`);
           if (node.catchClause) {
               const catchLine = sourceFile.getLineAndCharacterOfPosition(node.catchClause.getStart()).line + 1;
               console.log(`  -> caught at line ${catchLine}`);
           } else {
               console.log(`  -> NO CATCH OR FINALLY`);
           }
        }
    }
    ts.forEachChild(node, visit);
}
visit(sourceFile);
