
/**
 * 核心流式请求函数
 * @param {Array} messages - 聊天上下文 [{role: 'user', content: '...'}]
 * @param {Function} onToken - 回调函数，每收到一个字调用一次
 * @param {Function} onDone - 完成时的回调
 * @param {Function} onError - 出错时的回调
 */
const getStreamData = async (messages: chatData[], onToken: any, onDone: any, onError: any) => {
    const LLMType = 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B';
    const API_KEY = "sk-wstsseszxmaatoaufgueuaevvlaqwopaxsliruurquuiflap";
    const URL = "https://api.siliconflow.cn/v1/chat/completions";

    try {

        const res = await fetch(URL, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: `${LLMType}`, // 记得替换可用模型
                messages: messages,
                stream: true, // 必须开启
                temperature: 0.7
            })
        });
        if (!res.ok) {//fetch仅在网络不好的情况下抛出错误，而不是像axios一样status不为200-299就报错
            const errorText = await res.text();//将报错信息转为text
            throw new Error(`HTTP Error ${res.status}: ${errorText}`);
        }
        // 2. 缓冲区（关键！用于处理数据被截断的情况）
        let buffer = "";

        if (!res.body) {
            throw new Error("Response body is empty (Server returned no data)");
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // 解码当前收到的二进制块
            const chunk = decoder.decode(value, { stream: true });

            // 将新块拼接到缓冲区
            buffer += chunk;

            // 按换行符切分（SSE 格式标准）
            const lines = buffer.split("\n");

            // ⚠️ 核心技巧：保留最后一行！
            // 因为最后一行可能是不完整的（比如 {"content": "好 ），需要等到下一块数据来了拼上才能解
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmedLine = line.trim();

                // 忽略空行
                if (!trimmedLine) continue;

                // 处理 SSE 前缀
                if (trimmedLine.startsWith("data: ")) {
                    const jsonStr = trimmedLine.replace("data: ", "");

                    // 结束标记
                    if (jsonStr === "[DONE]") {
                        if (onDone) onDone();
                        return;
                    }

                    try {
                        const data = JSON.parse(jsonStr);
                        const content = data.choices[0]?.delta?.content || "";

                        //如果有内容，通过回调吐出去
                        if (content) {
                            onToken(content);
                        }
                    } catch (e) {
                        console.warn("JSON解析跳过非关键错误:", e);
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default getStreamData;