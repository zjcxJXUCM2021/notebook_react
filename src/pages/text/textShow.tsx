import { useNavigate, useParams } from 'react-router';
import { getText } from '../../api/http/api'
import styles from './textShow.module.less'
import { useEffect, useState } from 'react';
import { App, Button, Image, Skeleton } from 'antd'; // 引入 Space (可选)
import useTextFontSize from '../../store/state/textFontSize';
import parse from 'html-react-parser';
import useUserStore from '../../store/user';

// 定义 Text 类型接口（根据你项目实际情况补充）
interface Text {
    tag: string;
    title: string;
    content: string;
}

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
                return;
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

    // --- 核心修改部分开始 ---
    const htmlOptions = {
        replace: (domNode: any) => {
            if (domNode.name === 'img') {
                // 1. 获取图片属性
                const { style: rawStyle, ...restAttribs } = domNode.attribs;
                if (restAttribs.src.slice(0, 4) == 'data')
                    return (
                        <div className="image-wrapper">
                            <Image
                                {...restAttribs}
                                src={restAttribs.src}
                                style={{
                                    border: '0px solid red', // 你之前的样式
                                }}
                                preview={{
                                    src: restAttribs.src,
                                    // 保留你原有的滚动条逻辑
                                    onVisibleChange: (visible) => {
                                        const html = document.documentElement;
                                        if (visible) {
                                            html.style.scrollbarGutter = 'auto';
                                        } else {
                                            html.style.scrollbarGutter = 'stable';
                                        }
                                    },
                                }}
                            />
                        </div>
                    )
                else
                    return (
                        <div className="image-wrapper">
                            <Image
                                {...restAttribs}
                                src={restAttribs.src + '?imageMogr2/format/webp/quality/15'}
                                style={{
                                    border: '0px solid red', // 你之前的样式
                                }}
                                preview={{
                                    src: restAttribs.src,
                                    // 保留你原有的滚动条逻辑
                                    onVisibleChange: (visible) => {
                                        const html = document.documentElement;
                                        if (visible) {
                                            html.style.scrollbarGutter = 'auto';
                                        } else {
                                            html.style.scrollbarGutter = 'stable';
                                        }
                                    },
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
            <div style={{ fontSize: `${textFontSize}rem`, }} className={styles.text}>
                {isLoading ? <Skeleton paragraph={{ rows: 10 }} /> : parse((text?.content || ''), htmlOptions)}
            </div ></>
        }
    </>
}