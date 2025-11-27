import styles from './mainLayout.module.less'
import Left from '../../components/layout/left/left'
import Center from '../../pages/home/components/center/center'
import Right from '../../components/layout/right/right'
import { getAllText } from '../../api/http/api'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Basement from '../../components/basement/basement'
interface keyArr {
    [key: string]: Text[]
}
export default function MainLayout() {
    const [textList, setTextList] = useState<Text[]>([]);
    const [timeOrderList, setTimeOrderList] = useState<Text[]>([]);

    const [keyList, setKeyList] = useState<keyArr>({});
    useEffect(() => {
        const init = async () => {
            const unorderList = await getAllText();
            const sortedList = [...unorderList].sort((a, b) => b.id - a.id);
            setTextList(unorderList);
            setTimeOrderList(unorderList);
            const temp: keyArr = {};
            unorderList.map((item) => {
                if (temp[item.tag])
                    temp[item.tag].push(item);
                else {
                    temp[item.tag] = [];
                    temp[item.tag].push(item);
                }
            })

            setKeyList(temp);

        }
        init();
    }, [])
    return <>
        <div className={styles.base}>
            <Left></Left>
            <Basement>
                <Outlet context={{ keyList }}>

                </Outlet>
            </Basement>
            <Right text={timeOrderList}>

            </Right>
        </div>
    </>
}