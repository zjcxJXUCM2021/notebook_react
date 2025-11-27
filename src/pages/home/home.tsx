import { useOutletContext } from "react-router"
import Center from "./components/center/center";

interface IOutletContext {
    keyList: keyArr,
    setPinText: (id: number) => Promise<void>,
    setCancelPinText: (id: number) => Promise<void>
}
export default function Home() {
    const { keyList, setPinText, setCancelPinText } = useOutletContext<IOutletContext>();
    return <>
        <Center keyList={keyList} setPinText={setPinText} setCancelPinText={setCancelPinText}>

        </Center>
    </>
}