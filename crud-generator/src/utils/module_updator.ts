import fs from 'fs';
import findUp from 'findup-sync';
import path from 'path';
import { pluralize, capitalize } from "inflection";
import prettier from "prettier";
import * as ts from "typescript";

const entityPattern = /TypeOrmModule\.forFeature\(\[\s*([\w,.\s]+)\s*\]\)/;


export async function updateEntities(path: string, ...entities: string[]) {
  const file = fs.readFileSync(path, "utf8");

  const matchedArr = file.match(entityPattern);
  if (matchedArr) {
    const mappedEntities = matchedArr[1].split(",").concat(entities).map(et => et.trim());
    matchedArr.input = matchedArr.input?.replace(entityPattern, mappedEntities.join(', '))
  } else {
    throw new Error(`FileNotFound at ${path}`)
  }

  return matchedArr;
}


export async function updateAppModule(data: any, outputDir: string, options: any) {
  const appModulePath = findUp('app.module.ts');
  if (appModulePath) {
    const moduleStr = fs.readFileSync(appModulePath, "utf8");

    let nextCode = '';
    const modImpsResArr = moduleStr.match(/@Module\s*\(\s*{[^}]*imports\s*:\s*\[([^\]]*)\]/);
    if (modImpsResArr) {
      const moduleClassName = `${capitalize(pluralize(data.title))}Module`;
      // @Module imports updated

      const mappedModules = Array.from(
        new Set(
          modImpsResArr[1]
            .split(',')
            .concat(moduleClassName)
            .map(mod => mod.trim())
            .filter(mod => !!mod)
        )
      );
      

      nextCode = modImpsResArr.input!.replace(/(@Module\s*\(\s*{[^}]*imports\s*:\s*)\[([^\]]*)\]/, `$1[${mappedModules.join(", ")}]`)

      // User-provided path where NewModule.module.ts is generated
      const newPath = `${outputDir}/${options.file_name_format_function(data.title.toLowerCase())}.module.ts`; // Replace this with the actual path

      // Calculate the relative path
      const relativePath = path.relative(path.dirname(appModulePath), newPath).replace('.ts', '');

      // New import statement to append
      const newImport = `import { ${moduleClassName} } from './${relativePath.replace(/\\/g, '/')}';`;

      // Regex to match the end of existing import statements
      const importRegex = /^(import .* from .*;)/gm;

      // Find the last import statement
      const imptStmtResArr = nextCode.match(importRegex);

      if (imptStmtResArr) {
        // Get the last import statement
        const lastImport = imptStmtResArr[imptStmtResArr.length - 1];

        // Append the new import statement after the last import
        nextCode = nextCode.replace(lastImport, `${lastImport}\n${newImport}`);
      } else {
        // If no import statements found, add the new import statement at the beginning
        const firstBracketIndex = nextCode.indexOf('{');
        nextCode = `${nextCode.slice(0, firstBracketIndex + 1)}\n${newImport}\n${nextCode.slice(firstBracketIndex + 1)}`;
      }

      const formatted_code = await prettier.format(
        nextCode,
        { parser: "typescript" }
      );
      console.log('file path is :', appModulePath);
      
      fs.writeFileSync(appModulePath, formatted_code);

      return await optimizeImports( appModulePath, formatted_code);

    } else {
      throw new Error("FileNotFound - Can't update the App.module.ts.")
    }
  }
}


async function optimizeImports(filePath: string, source: string) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const importStatements: { [key: string]: ts.ImportDeclaration } = {};

  const cleanedStatements = sourceFile.statements.filter(statement => {
    if (ts.isImportDeclaration(statement)) {
      const importText = statement.getText();
      if (importStatements[importText]) {
        return false;
      }

      importStatements[importText] = statement;
    }

    return true;
  })

  const printer = ts.createPrinter();
  const formatted_code = cleanedStatements.map(statement => printer.printNode(ts.EmitHint.Unspecified, statement, sourceFile)).join('\n');
  fs.writeFileSync(filePath, formatted_code);

  return formatted_code;
}