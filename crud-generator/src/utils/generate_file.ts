import prettier from "prettier";
import fs from "fs";
import Handlebars from "handlebars";

export async function generateFile(data: any, type: string, formatFunction: Function, outputDir: string, baseConfigPath: string) {
    try {
        const importsTemp = fs.readFileSync(`${__dirname}/../templates/${type}.imports.hbs`, "utf8");
        Handlebars.registerPartial('imports', importsTemp);
    } catch (error) { }

    const itemTemp = fs.readFileSync(`${__dirname}/../templates/${type}.main.hbs`, "utf8");
    const item = Handlebars.compile(itemTemp);

    const processed_item = await prettier.format(
        item({ ...data, baseConfigPath }),
        { parser: "typescript" }
    );

    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(`${outputDir}/${formatFunction(data.title.toLowerCase())}.${type}.ts`, processed_item);
}
