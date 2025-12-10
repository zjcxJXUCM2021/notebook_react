import { useNavigate, useParams } from 'react-router';
import { getText } from '../../api/http/api'
import styles from './textShow.module.less'
import { useEffect, useState } from 'react';
import { App, Button, Image, Skeleton } from 'antd';
import useTextFontSize from '../../store/state/textFontSize';
import parse from 'html-react-parser';
import useUserStore from '../../store/user';

export default function TextShow() {
    const nav = useNavigate();
    const { id } = useParams();
    const [text, setText] = useState<Text>();
    const [textFontSize, setTextFontSize] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const textFontSizeStore = useTextFontSize();
    const userStore = useUserStore()
    const app = App.useApp();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        const init = async () => {
            if (!id) {
                nav('/404/');
                return <></>
            }
            try {
                const res = await getText(Number(id));
                setIsLoading(false);
                setText(res);
                document.title = res.title;
            } catch (err: any) {
                app.message.error("当前页面不存在，正在跳转");
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
        nav(`/admin/upload/?id=${id}`);
    }
    const htmlOptions = {
        replace: (domNode: any) => {
            if (domNode.name === 'img') {
                // 1. 将 style 从 attribs 中解构出来，避免直接传给组件导致报错
                const { style: rawStyle, ...restAttribs } = domNode.attribs;
                return (
                    <div className="image-wrapper">
                        <Image
                            {...restAttribs}

                            style={{
                                border: '0px solid red',
                            }}
                            preview={{
                                onVisibleChange: (visible) => {
                                    // 获取 html 和 body 元素
                                    const html = document.documentElement;

                                    if (visible) {
                                        html.style.scrollbarGutter = 'auto';
                                    } else {
                                        // 关闭时：恢复默认
                                        html.style.scrollbarGutter = 'stable';
                                    }
                                }
                            }}
                        />
                    </div>
                );
            }
        }
    };
    return <>
        {isLoading ? <Skeleton /> : <><div className={styles.sumWrapper}>
            <div className={styles.titleWrapper}>
                <div className={styles.tag} >
                    {text?.tag}
                </div>
                <div className={styles.title}>
                    {text?.title}
                </div >
            </div>
            {userStore.role == '管理员' ? <Button onClick={() => jump()}>修改</Button> : ''}
        </div>
            {/* <div dangerouslySetInnerHTML={{ __html: text?.content || '加载中' }} style={{ fontSize: `${textFontSize}rem` }} /> */}
            <div style={{ fontSize: `${textFontSize}rem`, }} className={styles.text}>

                {isLoading ? <Skeleton paragraph={{ rows: 10 }} /> : parse((text?.content || ''), htmlOptions)}

            </div ></>
        }
    </>
}