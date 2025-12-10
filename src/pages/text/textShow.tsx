import { useNavigate, useParams } from 'react-router';
import { getText } from '../../api/http/api'
import styles from './textShow.module.less'
import { useEffect, useState } from 'react';
import { App, Button, Image, Skeleton, Space } from 'antd'; // 引入 Space (可选)
import {
    DownloadOutlined, // 新增：下载图标
    RotateLeftOutlined,
    RotateRightOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    SwapOutlined // 用于翻转图标 (Antd默认图标通常是这些)
} from '@ant-design/icons';
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

                // 2. 定义自定义按钮的点击事件 (例如：下载图片)
                // const handleDownload = (e: React.MouseEvent) => {
                //     // 阻止事件冒泡，防止触发图片的关闭预览等
                //     e.stopPropagation();

                //     const src = restAttribs.src;
                //     if (src) {
                //         // 简单的下载逻辑：在新窗口打开
                //         window.open(src, '_blank');

                //         // 如果需要强制下载，可能需要创建一个临时 a 标签
                //         /*
                //         const link = document.createElement('a');
                //         link.href = src;
                //         link.download = 'image.png';
                //         link.click();
                //         */
                //     }
                // };

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
                                // 新增：自定义工具栏
                                // toolbarRender: (_, { icons }) => {
                                //     return (
                                //         // 使用 ant-image-preview-operations 类名以继承默认的半透明黑底样式
                                //         <div className="ant-image-preview-operations">
                                //             {/* 1. 放置默认的图标 (按你喜欢的顺序) */}
                                //             {icons.flipYIcon}
                                //             {icons.flipXIcon}
                                //             {icons.rotateLeftIcon}
                                //             {icons.rotateRightIcon}
                                //             {icons.zoomOutIcon}
                                //             {icons.zoomInIcon}

                                //             {/* 2. 放置自定义按钮 */}
                                //             {/* 使用 ant-image-preview-operations-operation 类名以继承默认按钮样式 */}
                                //             <div
                                //                 className="ant-image-preview-operations-operation"
                                //                 onClick={handleDownload}
                                //                 title="新窗口打开/下载"
                                //             >
                                //                 <DownloadOutlined />
                                //             </div>
                                //         </div>
                                //     );
                                // }
                            }}
                        />
                    </div>
                );
            }
        }
    };
    // --- 核心修改部分结束 ---

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