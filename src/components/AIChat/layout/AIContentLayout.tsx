import { Button, Collapse, Form, Input, Tooltip, type CollapseProps, type FormProps } from 'antd'
import styles from './AIContentLayout.module.less'
import { CopyOutlined, DownOutlined, LikeOutlined, LoadingOutlined, RedoOutlined, UploadOutlined, UpOutlined } from '@ant-design/icons';
import getStreamData from '../../../api/http/aiChat';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
type FieldType = {
    prompt?: string,
};
const { TextArea } = Input;
export default function AIContentLayout() {
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [reason, setReason] = useState('');
    const [prompt, setPrompt] = useState('');
    let [isEnd, setIsEnd] = useState(false);
    let [collapseItem, setCollapseItem] = useState<CollapseProps['items']>();
    useEffect(() => {
        setCollapseItem([{
            key: '1',
            label: `展开思考`, // 引用 useState 变量
            children: <div>{reason}</div>,
        }])
    }, [reason]);
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        setContent('');
        setReason('');
        setPrompt(values.prompt || '');
        const history = [
            { role: "user", content: values.prompt }
        ];
        console.log("🚀 开始请求...");
        setIsEnd(false);
        form.resetFields();
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
                setIsEnd(true);
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
                    {prompt ? <div className={styles.prompt}>{prompt}</div> : ''}
                    <div className={styles.thinking}>
                        {reason ? <Collapse className={styles.collapseCustom} items={collapseItem} ghost expandIcon={({ isActive }) => isEnd ? (isActive ? <DownOutlined /> : <UpOutlined />) : <LoadingOutlined />} /> : ''}
                    </div>
                    <div className={styles.content}>
                        <ReactMarkdown
                            // 使用插件支持表格等 GFM 语法
                            remarkPlugins={[remarkGfm]}
                            // 自定义渲染组件
                            components={{
                                // 2. 这里给 props 加上类型，通常用 any 处理第三方库复杂的类型推导是比较稳妥的做法
                                code(props: any) {
                                    const { node, inline, className, children, ...rest } = props;
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            {...rest}
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...rest}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                    {
                        isEnd ?
                            <div className={styles.endBtn}>
                                <Tooltip title="like" zIndex={999999} placement="bottom">
                                    <Button shape="circle" icon={<LikeOutlined />} />
                                </Tooltip>
                                <Tooltip title="redo" zIndex={999999} placement="bottom">
                                    <Button shape="circle" icon={<RedoOutlined />} />
                                </Tooltip>
                                <Tooltip title="search" zIndex={999999} placement="bottom">
                                    <Button shape="circle" icon={<CopyOutlined />} />
                                </Tooltip>

                            </div>
                            :
                            ''
                    }
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