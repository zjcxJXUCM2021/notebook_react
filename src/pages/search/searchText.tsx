import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router'
import { searchTextByKeyword, setPinTextHttp, setUnPinTextHttp } from '../../api/http/api';
import { textKeyList } from '../../utils';
import TextCard from '../../components/textCard/textCard';
import { useQueryClient } from '@tanstack/react-query';
import styles from './searchText.module.less'
import { App } from 'antd';

export default function SearchText() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const [keyList, setKeyList] = useState<keyArr>({});
    const [texts, setTexts] = useState<Text[]>([]);
    const queryClient = useQueryClient();
    const { message } = App.useApp();

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const init = async () => {
            try {
                if (keyword) {
                    const res = await searchTextByKeyword(keyword);
                    setLoading(false);
                    setTexts(res);
                    setKeyList(textKeyList(res));
                } else {
                    throw new Error("13");
                }

            } catch {
                message.error("搜索错误");
            }
        }
        init();
    }, [keyword]);
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
        <div className={styles.wrapper}>
            <div className={styles.singleText}>
                {Object.keys(keyList).length != 0 ? Object.keys(keyList).map((item) => {
                    return <div key={item}>
                        <TextCard tags={item} texts={keyList[item]} setPinText={setPinText} setCancelPinText={setCancelPinText}></TextCard>
                    </div>
                }) : (loading ? '加载中' : "没有数据")}
            </div>
        </div>
    </>
}
