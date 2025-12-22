
interface Text {
    id: number,
    title: string,
    content: string,
    tag: string,
    state?: string

}

interface keyArr {
    [key: string]: Text[]
}

interface chatData {
    role: string,
    content: string
}

declare module 'react-syntax-highlighter';

// 解决具体的 Prism 模式报错
declare module 'react-syntax-highlighter/dist/esm/prism';

// 解决样式文件报错 (非常重要，否则你的 vscDarkPlus 还会报错)
declare module 'react-syntax-highlighter/dist/esm/styles/prism';