
import { useEffect, useState } from 'react';
import ButtonList from '../../buttonList/buttonList';
import styles from './right.module.less'
import { ClockCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import { getAllPinText } from '../../../api/http/api';
import { useQuery } from '@tanstack/react-query';

interface rightProp {
    text: Text[];
}
export default function Right(prop: rightProp) {
    const [newText, setnewText] = useState<Text[]>();
    useEffect(() => {
        // const init = async () => {
        //     let t = await getAllPinText();
        //     console.log(t);
        //     setPinText(t);
        // }
        // init();
        let temp = structuredClone(prop.text);
        temp.sort((a, b) => b.id - a.id);
        setnewText(temp.slice(0, 5));
    }, [prop])
    const { data: pinText } = useQuery({
        queryKey: ['allPinTexts'], // 身份证：给这份数据起个名，叫 'texts'
        queryFn: () => getAllPinText(), // 怎么获取数据：传入你的 API 函数
        initialData: [], // 初始值，防止 data 为 undefined 报错
    });
    return <>
        <div className={styles.wrapper}>
            <div>
                <span><ClockCircleOutlined /> 最新</span>
                {newText?.map((item) => {
                    return <div key={item.id}>
                        <ButtonList path={`/text/${item.id}`} size='1rem'>
                            {item.tag}&nbsp;&nbsp;{item.title}
                        </ButtonList>
                    </div>
                })}
            </div>
            <div>
                <span><PushpinOutlined /> 固定访问</span>
                {pinText.map((item) => {
                    return <div key={item.id}>
                        <ButtonList path={`/text/${item.id}`} size='1rem'>
                            {item.title}
                        </ButtonList>
                    </div>
                })}
            </div>
        </div>
    </>
}