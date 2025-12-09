import { useCallback, useEffect, useRef } from "react";


export default function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
    // 1. 使用 useRef 保存最新的函数
    // 这样每次组件渲染 fn 变化时，ref.current 都会更新，保证执行的是最新的逻辑
    const fnRef = useRef(fn);

    // 2. 每次渲染都更新 ref，解决闭包陷阱
    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    // 3. 这里的 useRef 是为了保存定时器 ID，跨渲染持久化
    const timerRef = useRef(1);

    // 4. 返回稳定的防抖函数
    return useCallback((...args: any[]) => {
        // 如果有定时器，清除它
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // 设置新定时器
        timerRef.current = setTimeout(() => {
            // 调用最新的函数逻辑
            fnRef.current(...args);
        }, delay);
    }, [delay]);
}