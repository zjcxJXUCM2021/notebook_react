
import { useEffect, useRef, useState } from 'react';
import styles from './upload.module.less'
import { Editor } from '@tinymce/tinymce-react'
import { Form, Button, Input, ConfigProvider, theme, Modal, AutoComplete } from 'antd';
import { getTags, getText, updateText, uploadText } from '../../api/http/api';
import axios from 'axios';
import { useBlocker, useNavigate, useSearchParams } from 'react-router';
import useDarkStore from '../../store/darkMode';
import EasyModel from '../../components/model/easyModel';


interface FieldType {
    title: string,
    tag: string,
}
interface searchTag {
    value: string,
    label: string
}
export default function Upload() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const editorRef = useRef<any>(null);
    const [form] = Form.useForm();
    const nav = useNavigate();
    const [param] = useSearchParams();
    const [content, setContent] = useState('');
    const id = param.get('id');
    const [options, setOptions] = useState<searchTag[]>([]);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) => {
            if (nextLocation.pathname == '/') return false;
            else if (currentLocation.pathname !== nextLocation.pathname && content) {
                showModal();
                return true;
            }
            else return false;
        }

    );
    useEffect(() => {
        const init = async () => {
            try {
                const res = await getText(Number(id));
                setContent(res.content);
                form.setFieldsValue({
                    title: res.title,
                    tag: res.tag
                });
            } catch {
            }
        }
        init();
    }, [])
    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            e.returnValue = ""; // 必须有，Chrome 要求这样才能拦截
        };
        window.addEventListener("beforeunload", handler);
        return () => {
            window.removeEventListener("beforeunload", handler);
        };
    }, []);

    const onFinish = async (value: FieldType) => {
        if (!editorRef.current) {
            return;
        }
        const currentContent = editorRef.current.getContent();
        try {
            if (!id) {
                await uploadText({
                    id: 0,
                    content: currentContent,
                    title: value.title,
                    tag: value.tag,
                } as Text);
            } else {
                await updateText({
                    id: Number(id),
                    content: currentContent,
                    title: value.title,
                    tag: value.tag,
                } as Text)
            }
            nav('/');
        } catch {
            console.log("失败");
        }

    }
    const onFinishFailed = async (value: any) => {

    }
    const handleImageUpload = (blobInfo: any, progress: (percent: number) => void) => {
        return new Promise<string>((resolve, reject) => {
            const formData = new FormData();
            // 注意：这里假设后端接收文件的参数名为 'file'。
            // 如果你的后端是用 'image' 或其他名字，请把 'file' 改掉。
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            axios.post('http://124.221.73.180:3001/upload/photo/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (e) => {
                    if (e.total) {
                        progress((e.loaded / e.total) * 100);
                    }
                }
            }).then(response => {
                const data = response.data.location;
                console.log(data, "返回的是");
                // 根据后端返回格式解析图片 URL
                // 情况1：直接返回 URL 字符串
                if (typeof data === 'string') {
                    resolve(data);
                }
                // 情况2：返回 JSON 对象 { url: "..." }
                else if (data && data.url) {
                    resolve(data.url);
                }
                // 情况3：返回 JSON 对象 { data: "..." }
                else if (data && data.data) {
                    resolve(data.data);
                } else {
                    console.error("无法解析后端返回的图片地址:", data);

                }
            }).catch(err => {
                console.error("图片上传出错:", err);
                reject('图片上传失败: ' + (err.message || err));
            });
        });
    };

    const themeConfig = () => {
        if (useDarkStore().isDark)
            return {
                "components": {
                    "Form": {
                        "labelColor": "rgba(255,255,255,0.88)",
                        "algorithm": theme.darkAlgorithm,
                    },
                    "Input": {
                        "algorithm": theme.darkAlgorithm,
                        "colorBgContainer": "#141414",
                        "colorText": "rgba(255,255,255,0.85)",
                        "colorBorder": "rgb(29,29,29)"
                    }

                },
            }
        else
            return {};

    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        blocker.proceed?.()
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        blocker.reset?.()
        setIsModalOpen(false);
    };

    const onSearch = async (keyword: string) => {
        try {
            const res = await getTags();
            let newOptions = res.map((item) => ({
                value: item, // 唯一标识，必须不重复
                label: item  // 下拉列表中显示的文字
            }));
            newOptions = newOptions.filter((item) => {
                if (item.value.toLowerCase().includes(keyword)) return true;
                else return false;
            })
            setOptions(newOptions)
        } catch {

        }
    }
    const onSelect = (e: searchTag) => {
        console.log(e);
    }
    return <>
        <div className={styles.wrapper}>
            <Form
                form={form}
                name="log"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                style={{ width: '70%' }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='vertical'
            >
                <div className={styles.inputWrapper}>
                    <ConfigProvider
                        theme={themeConfig()}>
                        <Form.Item<FieldType>
                            label="章节:"
                            name="tag"
                            rules={[{ required: true, message: '请输入Tag' }]}
                        // initialValue={title} 只有第一次才能设置初始值，即组件挂载时
                        >
                            {/* <Input /> */}
                            <AutoComplete
                                options={options}
                                style={{ width: 200 }}
                                onSelect={onSelect}//选中时
                                onSearch={onSearch}
                                showSearch={true}
                                placeholder="input here"
                            />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="标题:"
                            name="title"
                            rules={[{ required: true, }]}
                        >
                            <Input />
                        </Form.Item>
                    </ConfigProvider>


                </div>
                <Form.Item>
                    <div className={styles.editorWrapper}>
                        <Editor
                            tinymceScriptSrc='/tinymce/tinymce.min.js'
                            licenseKey='gpl'
                            onInit={(_evt, editor) => editorRef.current = editor}
                            initialValue={content}
                            init={{
                                skin: 'oxide-dark',       // 界面变黑
                                content_css: 'dark',    // 内容区域也变黑
                                height: '600px',
                                menubar: false,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'image | removeformat | help', // 已添加 image 按钮
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                                // 图片上传配置
                                images_upload_handler: handleImageUpload,
                                automatic_uploads: true,
                                paste_data_images: true // 允许粘贴图片
                            }}
                        />
                    </div>
                </Form.Item>
                <Form.Item>
                    <div className={styles.btnWrapper}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </div>
                </Form.Item>
            </Form >
        </div >

        <Modal
            title="提示"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={(_, { OkBtn, CancelBtn }) => (
                <>
                    <OkBtn />
                    <CancelBtn />
                </>
            )}
        >
            <div>
                还没有保存文档，确定返回吗？
            </div>
        </Modal>



    </>
}