import type { ReactNode } from 'react'
import styles from './buttonList.module.less'
import { useNavigate } from 'react-router'


interface prop {
    path?: string,
    children: ReactNode,
    size?: string
    // onClick: () => void
}
export default function ButtonList(prop: prop): ReactNode {
    let nav = useNavigate();
    const jump = () => {
        if (prop.path)
            nav(prop.path)
    }
    return <>
        <div className={styles.innerWrapper} onClick={jump} style={{ fontSize: prop.size }}>
            {prop.children}
        </div>
    </>
}