
export const textKeyList = (texts: Text[]) => {
    const mapList = new Map<string, Text[]>
    const tempSort = texts.sort((a, b) => a.id - b.id);
    const orderTag = new Set;
    tempSort.forEach((item) => {
        orderTag.add(item.tag);
        mapList.set(item.tag, []);
    });

    let ans: keyArr = {};
    texts.forEach((item) => {
        mapList.get(item.tag)?.push(item);
        // ans[item.tag] ??= [];
        // ans[item.tag].push(item);

    });
    ans = Object.fromEntries(mapList);
    return ans;
}