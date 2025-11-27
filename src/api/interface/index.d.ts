
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