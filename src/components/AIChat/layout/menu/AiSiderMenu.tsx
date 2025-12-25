import { Menu, type MenuProps } from "antd";
import { useEffect, useState } from "react";
import { getSessionHistory, getUserSessionList } from "../../../../api/http/api";

type MenuItem = Required<MenuProps>['items'][number];

interface AiSiderMenuProp {
    collapsed: boolean,
    getHistory: (chatDatas: chatData[]) => void
}

interface sortChat {

}
export default function AiSiderMenu(prop: AiSiderMenuProp) {
    const [items, setItems] = useState<MenuItem[]>(
        [
            {
                key: 'grp',
                type: 'group',
                children: [
                    { key: '13', label: '新对话' },
                ],
            },
        ]);

    const sortSession = (res: any): any => {
        const sortRes = [...res].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

        // const map = new Map<string, { sessionId: string, title: string }[]>;

        // sortRes.forEach((item: session) => {
        //     const nowMapList = map.get(item.updatedAt) || [];
        //     const injectObject = {
        //         sessionId: item.sessionId, title: item.title
        //     }
        //     map.set(item.updatedAt || '', [...nowMapList, injectObject]);
        // })
        // console.log(map, "这里");
        // const obj = Object.fromEntries(map);

        // return Object.entries(obj).map(([updatedAt, array]) => {
        //     return {
        //         key: updatedAt,
        //         label: updatedAt,
        //         type: 'group',
        //         children: array.map((item) => {
        //             return {
        //                 key: item.sessionId,
        //                 label: item.title,
        //             }
        //         })
        //     }
        // })
        // 2. 分组
        // value 存储的是最终要展示的 MenuItem 数组，一步到位
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

        // 3. 转换为 AntD 需要的 Group 结构
        // 建议直接从 Map 转数组，保证顺序与 sortRes 一致
        const groupResult: MenuItem[] = [];

        map.forEach((items, dateKey) => {
            groupResult.push({
                key: dateKey,       // 组的 key
                type: 'group',      // 标记为分组
                label: dateKey,     // 组名显示日期
                children: items     // 组内的对话列表
            });
        });

        return groupResult;
    }
    useEffect(() => {
        const init = async () => {
            try {
                const res = await getUserSessionList();
                const handleRes = res.map((i) => {
                    return {
                        sessionId: i.sessionId,
                        title: i.title,
                        updatedAt: i.updatedAt.slice(0, 10),
                    }
                });
                console.log(handleRes);
                const groupRes = sortSession(handleRes);
                console.log(groupRes, "here");
                const tempItems: MenuItem = {
                    key: 'chatlist',
                    //type: 'group',
                    label: "历史对话",
                    children: groupRes,
                };

                setItems([...items, tempItems]);
            } catch {

            }
        }
        init();
    }, []);
    const cilckSession: MenuProps['onClick'] = async ({ key }) => {
        try {
            const res = await getSessionHistory(key);
            console.log(res);
            prop.getHistory(res);
        } catch {

        }
    }
    return <>
        <Menu
            style={{ height: "100%", overflow: "hidden", overflowY: "auto" }}
            // defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            inlineCollapsed={prop.collapsed}
            onClick={cilckSession}
        />
    </>
}