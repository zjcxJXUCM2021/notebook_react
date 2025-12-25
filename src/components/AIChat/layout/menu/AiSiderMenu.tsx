import { Menu, type MenuProps } from "antd";
import { useEffect, useState } from "react";
import { getUserSessionList } from "../../../../api/http/api";

type MenuItem = Required<MenuProps>['items'][number];

interface AiSiderMenuProp {
    collapsed: boolean,
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

    useEffect(() => {
        const init = async () => {
            try {
                const res = await getUserSessionList();
                const handleRes = res.map((i) => {
                    return {
                        key: i.sessionId,
                        label: i.title,
                    }
                });
                const tempItems: MenuItem = {
                    key: 'chatlist',
                    //type: 'group',
                    label: "对话",
                    children: handleRes,
                };
                setItems([...items, tempItems]);
            } catch {

            }
        }
        init();
    }, []);

    return <>
        <Menu
            style={{ height: "100%", overflow: "hidden" }}
            // defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            inlineCollapsed={prop.collapsed}
        />
    </>
}