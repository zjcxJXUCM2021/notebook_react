import styles from './mainLayout.module.less'
import Left from '../../components/layout/left/left'
import Center from '../../pages/home/components/center/center'
import Right from '../../components/layout/right/right'
import { getAllText, setPinTextHttp, setUnPinTextHttp } from '../../api/http/api'
import { useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router'
import Basement from '../../components/basement/basement'
import { useQueryClient } from '@tanstack/react-query'
interface keyArr {
    [key: string]: Text[]
};

export default function MainLayout() {
    const [texts, setTexts] = useState<Text[]>([]);
    // const [keyList, setKeyList] = useState<keyArr>({});
    const queryClient = useQueryClient(); // 获取那个“缓存池”管理者
    useEffect(() => {
        const init = async () => {
            const unorderList = await getAllText();
            const orderList = unorderList.sort((a: Text, b: Text) => b.id - a.id);
            setTexts(orderList);
        }
        init();
    }, []);

    const keyList = useMemo(() => {
        const temp: keyArr = {};
        texts.forEach((item) => {
            if (temp[item.tag]) {
                temp[item.tag].push(item);
            } else {
                temp[item.tag] = [item];
            }
        });
        return temp;
    }, [texts])
    const setPinText = async (id: number) => {
        try {
            await setPinTextHttp(id);
            setTexts(texts.map((i: Text) => {
                if (i.id == id) {
                    return {
                        ...i,
                        state: '快速访问',
                    }
                }
                return i;
            }))
            queryClient.invalidateQueries({ queryKey: ['allPinTexts'] });
        } catch {

        }
    }
    const setCancelPinText = async (id: number) => {
        try {
            await setUnPinTextHttp(id);
            setTexts(texts.map((i: Text) => {
                if (i.id == id) {
                    return {
                        ...i,
                        state: '',
                    }
                }
                return i;
            }))
            queryClient.invalidateQueries({ queryKey: ['allPinTexts'] });
        } catch {

        }
    }

    return <>
        <div className={styles.base}>
            <Left></Left>
            <Basement>
                <Outlet context={{ keyList, setPinText, setCancelPinText, }}>

                </Outlet>
            </Basement>
            <Right text={texts}>

            </Right>
        </div>
    </>
}