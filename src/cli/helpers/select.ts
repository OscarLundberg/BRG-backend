export function select<T>(key: string | Predicate<T>, record: Record<string, T> | T[], onselected: (selected: T) => any, els = (els?: any) => els) {
    let selected;
    if (typeof key == 'string') {
        selected = (record as Record<string, T>)[key];
    } else {
        selected = (record as T[]).find(key);
    }

    if (!selected)
        return els();

    return onselected(selected);
}

export type Predicate<T> = (e: T) => boolean; 