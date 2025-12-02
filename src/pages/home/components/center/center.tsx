import styles from './center.module.less'
import CollapseBoard from '../../../../components/textCard/textCard'
import { useContext } from 'react';
interface keyArr {
    [key: string]: Text[]
}
interface center {
    keyList: keyArr,
    setPinText: (id: number) => Promise<void>,
    setCancelPinText: (id: number) => Promise<void>
}
export default function Center() {
    const context = useContext(InfoContext);
    text = { context?.texts } setPinText = { context?.setPinText } setCancelPinText = { context?.setCancelPinText }
    return <>
        <div className={styles.wrapper}>
            <div className={styles.singleText}>
                {Object.keys(prop.keyList).length != 0 ? Object.keys(prop.keyList).map((item) => {
                    return <div key={item}>
                        <CollapseBoard tags={item} texts={prop.keyList[item]} setPinText={prop.setPinText} setCancelPinText={prop.setCancelPinText}></CollapseBoard>
                    </div>
                }) : "加载中"}
            </div>
        </div>
    </>
}