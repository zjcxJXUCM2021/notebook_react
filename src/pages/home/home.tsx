import { useOutletContext } from "react-router"
import Center from "./components/center/center";

interface IOutletContext {
    keyList: keyArr;
}
export default function Home() {
    const { keyList } = useOutletContext<IOutletContext>();
    return <>
        <Center keyList={keyList}>

        </Center>
    </>
}