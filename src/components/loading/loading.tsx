import { useState } from 'react'
import styles from './loading.module.less'

export default function LoadingTopLine() {

    let [length, setLength] = useState(20);
    setTimeout(() => {
        setLength(100);
    }, 0);

    return <>
        <div className={styles.wrapper} style={{ width: length + "vw" }}>

        </div>
    </>
}