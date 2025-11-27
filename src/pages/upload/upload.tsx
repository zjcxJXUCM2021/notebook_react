
import { useRef } from 'react';
import styles from './upload.module.less'
import { Editor } from '@tinymce/tinymce-react'
import { Form, Button, Input } from 'antd';
import { uploadText } from '../../api/http/api';
import axios from 'axios';
import { useNavigate } from 'react-router';

interface FieldType {
    title: string,
    tag: string,
}
export default function Upload() {
    const editorRef = useRef<any>(null);
    const [form] = Form.useForm();
    const nav = useNavigate();


    const onFinish = async (value: FieldType) => {
        console.log(value);
        if (!editorRef.current) {
            return;
        }
        const currentContent = editorRef.current.getContent();

        try {
            const res = await uploadText({
                id: 0,
                content: currentContent,
                title: value.title,
                tag: value.tag,
            } as Text)
            nav('/');
        } catch {
            console.log("失败")
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
    return <>
        <div className={styles.wrapper}>
            <Form
                form={form}
                name="log"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                style={{}}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='vertical'
            >
                <div className={styles.inputWrapper}>
                    <Form.Item<FieldType>
                        label="章节:"
                        name="title"
                        rules={[{ required: true, }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="标题:"
                        name="tag"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </div>
                <Form.Item>
                    <div className={styles.editorWrapper}>
                        <Editor
                            tinymceScriptSrc='/tinymce/tinymce.min.js'
                            licenseKey='gpl'
                            onInit={(_evt, editor) => editorRef.current = editor}
                            initialValue={""}
                            init={{
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
            </Form>


        </div>




    </>
}