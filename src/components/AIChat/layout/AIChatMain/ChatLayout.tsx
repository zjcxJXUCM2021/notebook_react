
import { UploadOutlined } from '@ant-design/icons';
import styles from './ChatLayout.module.less'
import { Button, Form, Input, type FormProps } from 'antd';
import SingleChat from '../SingleChat';
import { useState } from 'react';
import getStreamData from '../../../../api/http/aiChat';
export default function ChatLayout() {
    type FieldType = {
        prompt?: string,
    };
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [chatDatas, setChatDatas] = useState<chatData[]>([]);

    const [chatData, setChatData] = useState<chatData>();
    let [isEnd, setIsEnd] = useState(false);
    // useEffect(() => {
    //     setChatDatas([
    //         {
    //             "role": "system",
    //             "content": "你是一个资深的Python专家。你会用清晰、准确且带有代码示例的方式回答用户的编程问题。",
    //             "reason": "设定系统角色为Python专家，确保回答的专业度。"
    //         },
    //         {
    //             "role": "user",
    //             "content": "什么是递归？",
    //             "reason": "用户询问递归的基本定义。"
    //         },
    //         {
    //             "role": "assistant",
    //             "content": "递归（Recursion）是指在函数的定义中使用函数自身的方法。简单来说，就是函数在执行过程中调用了它自己。\n\n一个合法的递归通常包含两个关键部分：\n1. **基准情况 (Base Case)**：这是递归结束的条件，防止无限循环。\n2. **递归步骤 (Recursive Step)**：将问题分解为更小的子问题，并再次调用自身。",
    //             "reason": "解释递归的概念，并强调两个核心要素：基准情况和递归步骤。"
    //         },
    //         {
    //             "role": "user",
    //             "content": "能不能给个代码示例？",
    //             "reason": "用户请求具体的Python代码演示。"
    //         },
    //         {
    //             "role": "assistant",
    //             "content": "好的，这是最经典的递归示例：**计算阶乘 (Factorial)**。\n\n阶乘 `n!` 的定义是 `n * (n-1) * ... * 1`。\n\n```python\ndef factorial(n):\n    # 1. 基准情况：当 n 为 1 时，停止递归\n    if n == 1:\n        return 1\n    \n    # 2. 递归步骤：n 乘以 (n-1) 的阶乘\n    else:\n        return n * factorial(n - 1)\n\n# 测试代码\nresult = factorial(5)\nprint(f\"5的阶乘是: {result}\")  # 输出: 120\n```\n\n**执行流程解析：**\n`factorial(5)` 会调用 `5 * factorial(4)`，接着调用 `4 * factorial(3)`... 直到 `factorial(1)` 返回 `1`，然后层层返回计算结果。",
    //             "reason": "提供阶乘代码，包含清晰的注释，并简要解释执行堆栈的流程，补全了之前仅仅回答'好的'的不足。"
    //         },
    //         {
    //             "role": "user",
    //             "content": "如果我忘了写那个 `if n == 1` 会发生什么？",
    //             "reason": "用户提出一个常见的错误场景，考察模型对递归风险的理解。"
    //         },
    //         {
    //             "role": "assistant",
    //             "content": "如果你忘记写基准情况（Base Case），函数就会无限次地调用自己，这会导致**无限递归**。\n\n在 Python 中，这会抛出一个 `RecursionError`，通常提示为：\n`RecursionError: maximum recursion depth exceeded`\n\n这是因为计算机的内存中有一个“调用栈（Call Stack）”，每调用一次函数就需要占用一部分栈空间。如果只进不出，栈空间最终会被耗尽（即栈溢出）。",
    //             "reason": "解释缺少基准情况的后果，引入 RecursionError 和调用栈（Stack Overflow）的概念。"
    //         },
    //         {
    //             "role": "user",
    //             "content": "那递归和普通的 `for` 循环相比，哪个更好？",
    //             "reason": "用户询问递归与迭代的优劣对比，这是进阶的编程问题。"
    //         },
    //         {
    //             "role": "assistant",
    //             "content": "这就取决于具体的应用场景了，它们各有优缺点：\n\n**递归的优点：**\n* **代码简洁**：对于树形结构（如文件目录遍历、HTML DOM树）或分治算法（如快速排序、归并排序），递归的代码通常比循环更简洁、更符合逻辑直觉。\n\n**递归的缺点：**\n* **性能开销**：函数调用有额外的开销（压栈和出栈），速度通常比循环慢。\n* **内存风险**：如前所述，深度过大时会导致栈溢出。\n\n**结论：**\n如果逻辑简单（如累加列表），优先用 `for` 循环。如果处理复杂的层级结构，递归通常是更好的选择。",
    //             "reason": "客观分析递归与迭代（循环）的权衡，从代码可读性、性能和内存三个维度进行对比。"
    //         }
    //     ]);
    // }, [])
    //正在传输中
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        send(values.prompt);
        setChatDatas([...chatDatas, {
            role: "user",
            content: values.prompt || '',
            reason: ""
        }]);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const send = (values: any) => {
        const history = [
            ...chatDatas, {
                'role': 'user',
                "content": values,
            }
        ];
        console.log("🚀 开始请求...");
        setIsEnd(false);
        form.resetFields();
        // 调用函数
        getStreamData(
            history,
            (token: any) => {
                console.log(token);
                // 这里就是“流”的效果，字是一个一个蹦出来的
                if (token.content === '') {
                    // 防止 token.reasoning 为 undefined
                    setChatData(prev => {
                        // ✅ 这里打印 prev 是最准确的调试方式，因为它代表更新前的瞬间状态
                        return {
                            role: 'assistant',
                            // ⚠️ 修复点1：必须加括号，否则只有第一段字能显示
                            content: prev?.content || '',
                            // ⚠️ 修复点2：同理，拼接逻辑要加括号
                            reason: (prev?.reason || '') + (token.reasoning || ''),
                        };
                    });
                } else {
                    setChatData(prev => {
                        return {
                            role: 'assistant',
                            content: (prev?.content || '') + (token.content || ''),
                            reason: prev?.reason || '',
                        };
                    });
                }
            },
            () => {
                console.log("\n✅ 生成结束");
                setChatDatas([...chatDatas, {
                    role: "assistant",
                    content: chatData?.content || '',
                    reason: chatData?.reason || ''
                }]);
                setChatData({
                    role: "assistant",
                    content: "",
                    reason: ""
                })
                setIsEnd(true);
            },
            (err: any) => {
                console.error("❌ 发生错误:", err);
            }
        );
    };
    return <>
        <div className={styles.chatWrapper}>
            <div className={styles.chat}>
                {chatDatas.length}
                {
                    chatDatas.map((items, index) => {
                        return <SingleChat chatData={items} isEnd={true} key={index}></SingleChat>

                    })
                }
                {
                    chatData && <SingleChat chatData={chatData} isEnd={isEnd}></SingleChat>
                }
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