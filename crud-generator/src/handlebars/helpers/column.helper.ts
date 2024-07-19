import { TSP_COLS } from "../../shared/constants"

export const objectToArray = (obj: Record<string, any>): Array<{ key: string, value: any }> => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}

export const json = (collection: {} | []): string => JSON.stringify(collection);

export const colOpt = (column: any): string => {
  const pattern = /"(\w+)"(?=\s*:)/g;
  const options: {
    length?: number,
    nullable?: boolean,
    default?: any,
    unique?: boolean
  } = {};
  if (column.maximum) {
    options["length"] = column.maximum;
  }
  if (column.nullable) {
    options["nullable"] = true;
  }
  if (column.default) {
    options["default"] = column.default;
  }
  if (column.unique) {
    options["unique"] = true;
  }

  return JSON.stringify({ ...options, ...column?.options })
    .replace(pattern, '$1');
}

export const tspCols = (tsps: any) => {
  if (!tsps) return null;
  /*
   *  [
   *      {
   *          prop: "name",
   *          type: "string",
   *          decos: [
   *              {
   *                  name: "@CreatedDateColumn",
   *                  options: "{}"
   *              }
   *          ]
   *      }
   *  ]
   * */

  if (!tsps) {
    return [];
  }

  return Object.entries(tsps).map(([key, _]) => (
    {
      prop: key,
      type: "Date",
      decos: [
        {
          // @ts-ignore
          name: TSP_COLS[key]
        }
      ]
    }
  ));

};
