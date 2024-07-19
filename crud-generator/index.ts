import Handlebars from "handlebars";
import { Command } from 'commander';
import helpers from "./src/handlebars/helpers";
import { generateFile } from "./src/utils/generate_file";
import { updateAppModule } from "./src/utils/module_updator";
import { pluralize, singularize } from "inflection";
import path from "path";
import { import_config } from "./src/utils/import_config";

const program = new Command();

program
    .name("nmcg")
    .description("NestJs Mongodb CRUD Generator")
    .requiredOption('-c, --config <value>', "Configuration file path", )
    .option('-o, --output <value>', "Output Directory", ".")
    .version("0.1.0")
    .parse(process.argv);

const options = program.opts();

//@ts-ignore
Object.entries(helpers).forEach(([key, helper]) => {
    Handlebars.registerHelper(key, helper);
});

(async () => {
    const data = import_config(options.config);

    const baseConfigPath = path.dirname(options.config);
    const outputDir = `${options.output}/${pluralize(data.title.toLowerCase())}`;

    // Resolve JSON jsonSchema
    for(const [key, value] of Object.entries(data.properties as object)) {
        let ref = '';
        if (value.relation) {
            if (value.type == "object") {
                ref = value.$ref;
            } else if (value.type === "array") {
                ref = value.items.$ref;
            } else {
                throw new Error("Invalid config file");
            }
            const _config = import_config(`${baseConfigPath}/${ref}`)            
            if (value.type == "object") {
                data.properties[key].$ref = _config;
            } else if (value.type === "array") { 
                data.properties[key].items.$ref = _config;
            }
        }
    }

    const itemOptions = [
        {
            name: "schema",
            file_name_format_function: singularize 
        },
        {
            name: "service",
            file_name_format_function: pluralize 
        },
        {
            name: "controller",
            file_name_format_function: pluralize 
        },
        {
            name: "module",
            file_name_format_function: singularize
        }
    ];

    for (const itemOption of itemOptions) {
        await generateFile(data, itemOption.name, itemOption.file_name_format_function, outputDir, baseConfigPath);
    }

    const appModule = await updateAppModule(
      data, 
      outputDir, 
      {
        name: "module",
        file_name_format_function: singularize
      }
    );

})();

