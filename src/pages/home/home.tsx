import styles from './home.module.less'
import { useContext } from 'react';
import { InfoContext } from '../../layout/mainLayout/mainLayout';
import TextCard from '../../components/textCard/textCard';
import { textKeyList } from '../../utils/textKeyList';

export default function Home() {

    const context = useContext(InfoContext);

    const keyList = textKeyList(context.texts);

    return <>
        <div className={styles.wrapper}>
            <div className={styles.singleText}>
                {Object.keys(keyList).length != 0 ? Object.keys(keyList).map((item) => {
                    return <div key={item}>
                        <TextCard tags={item} texts={keyList[item]} setPinText={context?.setPinText} setCancelPinText={context?.setCancelPinText}></TextCard>
                    </div>
                }) : "加载中"}
            </div>
        </div>
    </>
}