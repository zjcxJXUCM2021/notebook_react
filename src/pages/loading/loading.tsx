import { Spin } from 'antd'
import styles from './loading.module.less'
export default function Loading() {

    return <>
        <Spin spinning={true} percent='auto' fullscreen />
    </>
}