export const partition = <T>(
    array: Array<T>,
    predicate: (value: T, index: number, array: Array<T>) => boolean,
): [Array<T>, Array<T>] => {
    const truthy: Array<T> = [];
    const falsy: Array<T> = [];

    array.forEach((value, index, arr) => {
        if (predicate(value, index, arr)) {
            truthy.push(value);
        } else {
            falsy.push(value);
        }
    });

    return [truthy, falsy];
};
