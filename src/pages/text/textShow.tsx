import { useNavigate, useParams } from 'react-router';
import { getText } from '../../api/http/api'
import styles from './textShow.module.less'
import { useEffect, useState } from 'react';
import { Button, Image, message } from 'antd';
import useTextFontSize from '../../store/state/textFontSize';
import parse from 'html-react-parser';
import useUserStore from '../../store/user';

export default function TextShow() {
    const nav = useNavigate();
    const { id } = useParams();
    const [text, setText] = useState<Text>();
    const [textFontSize, setTextFontSize] = useState(1);
    const textFontSizeStore = useTextFontSize();
    const userStore = useUserStore()
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
                message.error({ content: `${err}，即将跳转`, duration: 2 });
                setTimeout(() => {
                    nav('/404/');
                    return <></>
                }, 3000);
            }
        }
        init();
    }, [id])
    useEffect(() => {
        setTextFontSize(Number(textFontSizeStore.fontSize));
    }, [textFontSizeStore.fontSize])
    const jump = () => {
        nav(`/upload/?id=${id}`);
    }
    const htmlOptions = {
        replace: (domNode: any) => {
            if (domNode.name === 'img')
                return (
                    <div className="image-wrapper">
                        <Image  {...domNode.attribs} style={{ border: '0px solid red' }} />
                    </div>
                );
        }
    }
    return <>
        <div className={styles.sumWrapper}>
            <div className={styles.titleWrapper}>
                <div className={styles.tag}>
                    {text?.tag}
                </div>
                <div className={styles.title}>
                    {text?.title}
                </div >
            </div>
            {userStore.role == '管理员' ? <Button onClick={() => jump()}>修改</Button> : ''}

        </div>
        {/* <div dangerouslySetInnerHTML={{ __html: text?.content || '加载中' }} style={{ fontSize: `${textFontSize}rem` }} /> */}
        <div style={{ fontSize: `${textFontSize}rem` }}>

            {parse(text?.content || '加载中', htmlOptions)}

        </div>
    </>
}