import { useNavigate, useParams } from 'react-router';
import { getText } from '../../api/http/api'
import Basement from '../../components/basement/basement'
import styles from './textShow.module.less'
import { useEffect, useState } from 'react';
import { message } from 'antd';

export default function TextShow() {
    const nav = useNavigate();
    const { id } = useParams();
    console.log(id);
    const [text, setText] = useState<Text>();
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        const init = async () => {
            if (!id) {
                nav('/404/');
                return <></>
            }
            try {
                const res = await getText(Number(id));
                setText(res);
            } catch (err: any) {
                console.log("报错", err);
                messageApi.open({
                    type: 'error',
                    content: `${err},即将跳转`,
                });
                setTimeout(() => {
                    nav('/404/');
                    return <></>
                }, 3000);
            }
        }
        init();
    }, [])


    return <>
        {contextHolder}
        <div className={styles.titleWrapper}>
            <div className={styles.tag}>
                {text?.tag}
            </div>
            <div className={styles.title}>
                {text?.title}
            </div >
        </div>
        <div dangerouslySetInnerHTML={{ __html: text?.content || '加载中' }} />
    </>
}