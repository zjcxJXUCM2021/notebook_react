import { Button, Form, Input, type FormProps } from 'antd'
import styles from './AIContentLayout.module.less'
import { UploadOutlined } from '@ant-design/icons';
import getStreamData from '../../../api/http/aiChat';
import { useState } from 'react';


type FieldType = {
    prompt?: string,
};
const { TextArea } = Input;
export default function AIContentLayout() {
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [reason, setReason] = useState('');
    const [prompt, setPrompt] = useState('');
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setContent('');
        setReason('');
        setPrompt(values.prompt || '');
        const history = [
            { role: "user", content: values.prompt }
        ];
        console.log("🚀 开始请求...");
        // 调用函数
        getStreamData(
            history,
            (token: any) => {
                // 这里就是“流”的效果，字是一个一个蹦出来的
                console.log(token) // 在控制台不换行打印
                if (token.content === '') {
                    // 防止 token.reasoning 为 undefined 导致显示 undefined
                    setReason(prev => prev + (token.reasoning || ''));
                } else {
                    setContent(prev => prev + (token.content || ''));
                }
            },
            () => {
                console.log("\n✅ 生成结束");
            },
            (err: any) => {
                console.error("❌ 发生错误:", err);
            }
        );
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return <>
        <div className={styles.chatWrapper}>
            <div className={styles.chat}>
                <div className={styles.center}>
                    <div className={styles.prompt}>
                        {prompt}
                    </div>
                    <div className={styles.thinking}>
                        {reason}
                    </div>
                    <div className={styles.content}>
                        {content}
                    </div>
                </div>
            </div>
            <div className={styles.input}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: 'center',
                        width: '100%',
                    }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <div className={styles.inputWrapper}>
                        <Form.Item<FieldType> noStyle name="prompt">
                            <TextArea
                                placeholder="输入提示词"
                                // className={styles.customTextarea}
                                // 关键属性：自动调整高度，最小1行，最大6行（或不限）
                                autoSize={{ minRows: 1, maxRows: 10 }}
                            />
                        </Form.Item>

                        <div className={styles.btnWrapper}>
                            <Form.Item noStyle>
                                <Button icon={<UploadOutlined />}></Button>
                            </Form.Item>
                            <Form.Item noStyle>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </div>

                    </div>
                </Form>
            </div>
        </div>
    </>
}