import { useState } from "react";
import { setPinTextHttp, setUnPinTextHttp } from "../api/http/api";
import { useQueryClient } from "@tanstack/react-query";


type useKeyListResult = [
    keyArr,
]
export default function useKeyList(texts: Text[]): useKeyListResult {

    const queryClient = useQueryClient(); // 获取那个“缓存池”管理者
    const set = new Set;
    const ans: keyArr = {};
    texts.forEach((item) => {
        set.add(item.tag);
        ans[item.tag] ??= [];
        ans[item.tag].push(item);
    });
    const setPinText = async (id: number) => {
        try {
            await setPinTextHttp(id);
            // setTexts(texts.map((i: Text) => {
            //     if (i.id == id) {
            //         return {
            //             ...i,
            //             state: '快速访问',
            //         }
            //     }
            //     return i;
            // }))
            queryClient.invalidateQueries({ queryKey: ['allPinTexts'] });
        } catch {

        }
    }
    const setCancelPinText = async (id: number) => {
        try {
            await setUnPinTextHttp(id);
            // setTexts(texts.map((i: Text) => {
            //     if (i.id == id) {
            //         return {
            //             ...i,
            //             state: '',
            //         }
            //     }
            //     return i;
            // }))
            queryClient.invalidateQueries({ queryKey: ['allPinTexts'] });
        } catch {

        }
    }
    return [ans] as const
    // : useKeyListResult
}