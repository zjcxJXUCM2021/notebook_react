// 定义回调数据的接口
interface StreamUpdate {
    content: string;   // 最终回答的片段
    reasoning: string; // 思考过程的片段
}

/**
 * 核心流式请求函数
 * @param {Array} messages - 聊天上下文
 * @param {Function} onToken - 回调函数 (update: StreamUpdate) => void
 * @param {Function} onDone - 完成回调
 * @param {Function} onError - 错误回调
 */
const getStreamData = async (
    messages: any[],
    onToken: (update: StreamUpdate) => void,
    onDone: () => void,
    onError: (error: Error) => void
) => {
    // ⚠️ 安全警告：实际生产环境中，API Key 必须存储在后端，通过后端转发请求！
    // 前端直接暴露 Key 极易导致额度被盗用。
    const API_KEY = "sk-wstsseszxmaatoaufgueuaevvlaqwopaxsliruurquuiflap";
    const URL = "https://api.siliconflow.cn/v1/chat/completions";
    // DeepSeek R1 模型名称
    const LLMType = 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B';

    try {
        const res = await fetch(URL, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: LLMType,
                messages: messages,
                stream: true,
                temperature: 0.6 // R1 建议温度不要太高
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP Error ${res.status}: ${errorText}`);
        }

        if (!res.body) {
            throw new Error("Response body is empty");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const lines = buffer.split("\n");
            // 保留最后一行可能是残缺的数据
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

                const jsonStr = trimmedLine.replace("data: ", "");

                if (jsonStr === "[DONE]") {
                    if (onDone) onDone();
                    return;
                }

                try {
                    const data = JSON.parse(jsonStr);
                    const delta = data.choices[0]?.delta;

                    if (delta) {
                        // 1. 获取普通内容
                        const contentVal = delta.content || "";
                        // 2. 获取推理内容 (DeepSeek R1 核心部分)
                        const reasoningVal = delta.reasoning_content || "";

                        // 只有当有内容或有推理时才回调
                        if (contentVal || reasoningVal) {
                            onToken({
                                content: contentVal,
                                reasoning: reasoningVal
                            });
                        }
                    }
                } catch (e) {
                    console.warn("JSON解析跳过:", e);
                }
            }
        }
    } catch (error) {
        if (onError) onError(error as Error);
    }
}

export default getStreamData;