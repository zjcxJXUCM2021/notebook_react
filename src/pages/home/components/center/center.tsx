import styles from './center.module.less'
import CollapseBoard from '../textCard/textCard'
interface keyArr {
    [key: string]: Text[]
}
interface center {
    keyList: keyArr,
}
export default function Center(prop: center) {

    return <>
        <div className={styles.wrapper}>
            <div className={styles.singleText}>
                {Object.keys(prop.keyList).length != 0 ? Object.keys(prop.keyList).map((item) => {
                    return <div key={item}>
                        <CollapseBoard tags={item} texts={prop.keyList[item]}></CollapseBoard>
                    </div>
                }) : "加载中"}
            </div>
        </div>
    </>
}