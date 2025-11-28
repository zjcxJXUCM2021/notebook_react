import { useNavigate, useParams } from 'react-router';
import { getText } from '../../api/http/api'
import styles from './textShow.module.less'
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import useTextFontSize from '../../store/state/textFontSize';

export default function TextShow() {
    const nav = useNavigate();
    const { id } = useParams();
    const [text, setText] = useState<Text>();
    const [messageApi, contextHolder] = message.useMessage();
    const [textFontSize, setTextFontSize] = useState(1);
    const textFontSizeStore = useTextFontSize();
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
    useEffect(() => {
        setTextFontSize(Number(textFontSizeStore.fontSize));
    }, [textFontSizeStore.fontSize])
    const jump = () => {
        nav(`/upload/?id=${id}`);
    }

    return <>
        {contextHolder}
        <div className={styles.sumWrapper}>
            <div className={styles.titleWrapper}>
                <div className={styles.tag}>
                    {text?.tag}
                </div>
                <div className={styles.title}>
                    {text?.title}
                </div >
            </div>
            <div>
                <Button onClick={() => jump()}>修改</Button>
            </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: text?.content || '加载中' }} style={{ fontSize: `${textFontSize}rem` }} />
    </>
}