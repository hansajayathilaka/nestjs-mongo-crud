import fs from "fs";
import path from "path";
import { Validator } from "jsonschema";

export const import_config = (file_path: string) => { 
    try {
        const config_string = fs.readFileSync(file_path, "utf8");
        const config = JSON.parse(config_string);

        // TODO: Write validation schema and uncomment below code snippet to validate it
        // if (!config.$schema) {
        //     throw new Error(`Schema is not defined for the config file ${file_path}`);
        // }
        //
        // const baseConfigPath = path.dirname(file_path);
        // const schema_string = fs.readFileSync(`${baseConfigPath}/${config.$schema}`, "utf8");
        // const schema = JSON.parse(schema_string);
        //
        // const validator = new Validator();
        //
        // const res = validator.validate(config, schema, {});
        // if (!res.valid) {
        //     for (const error of res.errors) {
        //         console.error(error.stack);
        //     }
        //     throw new Error(`Validation errors on ${file_path} config file.`);
        // }
        // console.log(`Config ${file_path} is validated successfully.`);

        return config;
    } catch (err) {
        console.error(`Error on importing config file ${file_path}`);
        console.error(err);
        throw err;
    }

}

