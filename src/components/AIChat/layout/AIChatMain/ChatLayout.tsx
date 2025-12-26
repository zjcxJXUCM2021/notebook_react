import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import styles from './ChatLayout.module.less';
import { Button, Form, Input, type FormProps, App } from 'antd';
import SingleChat from '../SingleChat';
import { useEffect, useState, useRef } from 'react';
import getStreamData from '../../../../api/http/aiChat';
import { uploadAiChatData } from '../../../../api/http/api';
import { useAiChatStore } from '../../../../store/aiChatStore';
import { useQueryClient } from '@tanstack/react-query';

// 定义类型 (建议移到单独的 type 文件)
type ChatRole = 'system' | 'user' | 'assistant';
interface ChatData {
    role: ChatRole;
    content: string;
    reasoningContent: string;
}
interface sendChatData {
    role: ChatRole;
    content: string;
}
interface chatHistory {
    chatDatas: chatData[]
}
export default function ChatLayout(prop: chatHistory) {

    type FieldType = {
        prompt?: string;
    };
    const { message } = App.useApp();
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const aiChatStore = useAiChatStore();
    // 历史对话记录
    const [chatDatas, setChatDatas] = useState<ChatData[]>([]);
    // 当前正在流式生成的对话
    const [streamingChat, setStreamingChat] = useState<ChatData | null>(null);
    // 是否正在生成中
    const [loading, setLoading] = useState(false);

    // 关键修复：使用 Ref 来追踪流式累积的内容，避免闭包陷阱
    const streamContentRef = useRef<ChatData>({ role: 'assistant', content: '', reasoningContent: '' });
    // 滚动锚点
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 自动滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatDatas, streamingChat]); // 数据变化时滚动

    useEffect(() => {
        setChatDatas(prop.chatDatas);
    }, [prop.chatDatas])
    const queryClient = useQueryClient(); // 1. 获取全局 Client 实例
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (!values.prompt?.trim()) return;

        const userPrompt = values.prompt;
        await uploadAiChatData({
            role: "user", content: userPrompt, reasoningContent: ""
        });
        queryClient.invalidateQueries({ queryKey: ['sessionList'] });
        // 1. 先构建新的历史记录（包含用户的这一条）
        const newHistory: sendChatData[] = [
            ...chatDatas.map((item) => {
                return {
                    role: item.role,
                    content: item.content.replace(/\n/g, ''),
                }
            }),
            { role: "user", content: userPrompt }
        ];
        const newHistoryWithoutReason: ChatData[] = [//发的是去除了推理的消息
            ...chatDatas,
            { role: "user", content: userPrompt, reasoningContent: "" }
        ];
        // 2. 更新 UI 显示用户提问
        setChatDatas(newHistoryWithoutReason);
        aiChatStore.increaseParentId();
        form.resetFields();
        // 3. 发送请求
        send(newHistory);

    };

    const send = (history: sendChatData[]) => {
        setLoading(true);
        // 重置 Ref 和当前流状态
        streamContentRef.current = { role: 'assistant', content: '', reasoningContent: '' };
        setStreamingChat({ role: 'assistant', content: '', reasoningContent: '' });

        getStreamData(
            history,
            (token: any) => {
                // --- 更新逻辑 ---
                // 更新 Ref (用于逻辑真值)
                if (token.content === '') {
                    // 处理 reasoning (思考过程)
                    streamContentRef.current.reasoningContent += (token.reasoning || '');
                } else {
                    // 处理正文
                    streamContentRef.current.content += (token.content || '');
                }
                // 更新 State (用于触发 UI 渲染)
                // 注意：这里直接用 Ref 的值更新 State，避免了复杂的 prev 计算
                setStreamingChat({ ...streamContentRef.current });
            },
            async () => {
                console.log("\n✅ 生成结束");
                // --- 成功回调 ---
                // 关键修复：从 Ref 中读取最终结果，而不是从 stale 的 state 中读取
                const finalReply = streamContentRef.current;
                setChatDatas(prev => [...prev, finalReply]);
                await uploadAiChatData(finalReply);
                aiChatStore.increaseParentId();
                setStreamingChat(null); // 清除流状态
                setLoading(false);
            },
            (err: any) => {
                console.error("❌ 发生错误:", err);
                message.error("请求失败，请稍后重试");
                setLoading(false);
                setStreamingChat(null);
            }
        );
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 支持回车发送，Shift+Enter 换行
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.submit();
        }
    };

    return (
        <div className={styles.chatWrapper}>
            <div className={styles.chat}>
                {/* 渲染历史记录 */}
                {
                    chatDatas.length == 0 &&
                    <div className={styles.defaultShow}>
                        有问题可以问
                    </div>
                }
                {
                    chatDatas.map((item, index) => (
                        <SingleChat chatData={item} isEnd={true} onFinish={onFinish} key={index} />
                    ))
                }

                {/* 渲染正在流式生成的内容 */}
                {streamingChat && (
                    <SingleChat chatData={streamingChat} isEnd={false} onFinish={onFinish} />
                )}

                {/* 滚动锚点 */}
                <div ref={messagesEndRef} style={{ height: 1 }} />
            </div>

            <div className={styles.input}>
                <Form
                    form={form}
                    name="basic"
                    style={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: 'center',
                        width: '100%',
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div className={styles.inputWrapper}>
                        <Form.Item<FieldType> noStyle name="prompt">
                            <TextArea
                                placeholder="输入提示词..."
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                onKeyDown={onKeyDown}
                                disabled={loading}
                            />
                        </Form.Item>

                        <div className={styles.btnWrapper}>
                            <Form.Item noStyle>
                                <Button icon={<UploadOutlined />} disabled={loading} />
                            </Form.Item>
                            <Form.Item noStyle>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading} // 添加 loading 状态
                                    icon={<SendOutlined />}
                                >
                                    {loading ? '发送中' : '发送'}
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}