import styles from './center.module.less'
import CollapseBoard from '../textCard/CollapseBoard'
interface keyArr {
    [key: string]: Text[]
}
interface center {
    keyList: keyArr,
    setPinText: (id: number) => Promise<void>,
    setCancelPinText: (id: number) => Promise<void>
}
export default function Center(prop: center) {
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