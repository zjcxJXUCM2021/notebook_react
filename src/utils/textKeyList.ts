
export const textKeyList = (texts: Text[]) => {

    //.sort是会修改原数组的
    let ans: keyArr = {};
    texts.forEach((item) => {
        ans[item.tag] ??= [];
        ans[item.tag].push(item);

    });
    // ans = Object.fromEntries(mapList);
    return ans;
}