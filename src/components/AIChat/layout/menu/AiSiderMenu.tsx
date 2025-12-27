import { Menu, type MenuProps } from "antd";
import { useEffect, useState } from "react";
import { getSessionHistory, getUserSessionList } from "../../../../api/http/api";
import { useAiChatStore } from "../../../../store/aiChatStore";
import { useQuery } from "@tanstack/react-query";
import { useImmer } from "use-immer";

type MenuItem = Required<MenuProps>['items'][number];

interface AiSiderMenuProp {
    collapsed: boolean,
    getHistory: (chatDatas: chatData[]) => void
}

const transformData = (res: any[]) => {
    const handleRes = res.map((i) => {
        return {
            sessionId: i.sessionId,
            title: i.title,
            updatedAt: i.updatedAt.slice(0, 10),
        }
    });
    const sortRes = [...handleRes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const map = new Map<string, MenuItem[]>();

    sortRes.forEach((item: any) => {
        // 如果没有该日期，初始化为空数组 []
        const currentList = map.get(item.updatedAt) || [];

        // 创建当前的菜单项
        const newItem = {
            key: item.sessionId,
            label: item.title
        };

        // 存入 Map
        map.set(item.updatedAt, [...currentList, newItem]);
    });

    const groupResult: MenuItem[] = [];

    map.forEach((items, dateKey) => {
        groupResult.push({
            key: dateKey,       // 组的 key
            type: 'group' as const,      // 标记为分组
            label: dateKey,     // 组名显示日期
            children: items     // 组内的对话列表
        });
    });
    const tempItems: MenuItem = {
        key: 'chatlist',
        //type: 'group',
        label: "历史对话",
        children: groupResult,
    };
    return tempItems;

}
export default function AiSiderMenu(prop: AiSiderMenuProp) {
    //const [items, setItems] = useImmer<MenuItem[]>([]);
    const AiChatStore = useAiChatStore();
    const { data: res } = useQuery({
        queryKey: ['sessionList'],
        queryFn: () => getUserSessionList(),
        // placeholderData: (PreviousData) => {
        //     return [{ sessionId: 'temp-1', title: '加载中...', updatedAt: new Date().toISOString() }, ...PreviousData || []]
        // },
        select: (data) => {
            const ResData = transformData(data);
            return [{
                key: 'grp',
                type: 'group' as const,
                children: [
                    { key: '1', label: '新对话' },//点击之后不显示流式输出，streamId和sessionId不一样就不显示
                ],
            }, ResData]
        }
    });

    const cilckSession: MenuProps['onClick'] = async ({ key }) => {
        try {
            if (key == '1') {
                AiChatStore.init();
                prop.getHistory([]);
            }
            else {
                const res = await getSessionHistory(key);
                AiChatStore.setSessionId(key);
                prop.getHistory(res);
            }

        } catch {

        }
    }
    return <>
        <Menu
            style={{ height: "100%", overflow: "hidden", overflowY: "auto", userSelect: 'none' }}
            // defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            selectedKeys={[AiChatStore.sessionId]}
            mode="inline"
            items={res}
            inlineCollapsed={prop.collapsed}
            onClick={cilckSession}
        />
    </>
}