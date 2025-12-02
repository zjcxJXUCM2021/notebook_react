
export const textKeyList = (texts: Text[]) => {
    const ans: keyArr = {};
    texts.forEach((item) => {
        ans[item.tag] ??= [];
        ans[item.tag].push(item);
    })
    return ans;
}