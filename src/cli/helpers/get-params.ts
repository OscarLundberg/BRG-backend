const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^,]+)/g;

export function getParams(func: Function, vals?:string[]): Param[] {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result.map((cur, i) => {
        const [name, def] = cur.split("=");
        return {
            name: name.trim(),
            ...(def && { def: def.trim() }),
            ...(vals?.[i] && { def: vals[i].trim() })
        }
    });
}

export type Param = { name: string, def?: string }