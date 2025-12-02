import styles from './home.module.less'
import { useContext } from 'react';
import { InfoContext } from '../../layout/mainLayout/mainLayout';
import CollapseBoard from '../../components/textCard/CollapseBoard';
interface keyArr {
    [key: string]: Text[]
}

export default function Home() {

    const context = useContext(InfoContext);

    const keyList = (() => {
        const set = new Set;
        const ans: keyArr = {};
        context?.texts.forEach((item) => {
            set.add(item.tag);
            ans[item.tag] ??= [];
            ans[item.tag].push(item);
        })
        return ans;
    })();

    return <>
        <div className={styles.wrapper}>
            <div className={styles.singleText}>
                {Object.keys(keyList).length != 0 ? Object.keys(keyList).map((item) => {
                    return <div key={item}>
                        <CollapseBoard tags={item} texts={keyList[item]} setPinText={context?.setPinText} setCancelPinText={context?.setCancelPinText}></CollapseBoard>
                    </div>
                }) : "加载中"}
            </div>
        </div>
    </>
}