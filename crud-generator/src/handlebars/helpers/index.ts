import { capitalize, pluralize, singularize } from 'inflection';
import { objectToArray, json, colOpt, tspCols} from './column.helper';
import {isEqual} from "lodash";

const deco = (key: string, column: any, opt: any) => {
    const decorators: {
        name: string,
        type?: 'General' | 'Relation' | 'JoinColumn',
        options: any,
        inverseColumn?: string,
    }[] = [];
    decorators.push({
        name: "ApiProperty",
        type: "General",
        options: {}
    });
    if (column.type === "ObjectId") {
        decorators.push({
            name: "Prop",
            type: "General",
            options: {
                type: 'Types.ObjectId',
            }
        });
    } else {
        decorators.push({
            name: "Prop",
            type: "General",
            options: {
                ...(column.options ?? {})
            }
        });
    }
    return decorators;
}

const typeVal = (key: string, column: any) => {
    if (column.relation) {
        let ref: string;
        if (column.type === "object") {
            ref = column.$ref;
        } else if (column.type === "array") {
            ref = column.items.$ref;
        } else {
          throw new Error("Ref not found in relation column");
        }

        //const jsonSchemaString = fs.readFileSync(`${root.baseConfigPath}/${ref}`, "utf8");
        const jsonSchema: any = ref;  // JSON.parse(jsonSchemaString);
        if (jsonSchema.title) {
           return jsonSchema.title
        }

    } else if (column.type) {
        switch (column.type) {
            case "integer":
            case "int":
            case "num":
                return "number";
            default:
                return column.type;
        }
    }
}

const relationImportEntity = (properties: any) => {
    const imports: {
        name: string,
        path: string,
    }[] = [];
    for (const [key, value] of Object.entries<any>(properties)) {
        if (value.relation) {
            let jsonSchema;
            if (value.type === "object") {
                jsonSchema = value.$ref;
            } else if (value.type === "array") {
                jsonSchema = value.items.$ref;
            } else {
                //console.log(value);
                throw new Error("Invalid schema");
            }

            imports.push({
                name: jsonSchema.title,
                path: `../${pluralize(jsonSchema.title.toLowerCase())}/${singularize(jsonSchema.title.toLowerCase())}.entity`
            });
        }
    }
    return imports;
}

const helpers = {
	json,
	colOpt,
	tspCols,
	objectToArray,
    deco,
    typeVal,
    relationImportEntity,
    isEqual,
    capitalize: (arg: string) => capitalize(arg),
    pluralize: (arg: string ) => pluralize(arg),
    singularize: (arg: string) => singularize(arg),
    toLowerCase: (arg: string) => arg.toLowerCase(),
}
export default helpers;

