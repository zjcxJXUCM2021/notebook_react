import styles from './textCard.module.less'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { CloseOutlined, PushpinOutlined } from '@ant-design/icons';
import { setPinText, setUnPinText } from '../../../../api/http/api';
import { useQueryClient } from '@tanstack/react-query';


interface props {
    texts: Text[],
    tags: string,
}
export default function CollapseBoard(props: props) {
    const singleItem = props;
    const nav = useNavigate();
    const queryClient = useQueryClient(); // 获取那个“缓存池”管理者
    const jump = (id: number) => {
        nav(`/text/${id}`)
    }
    const [texts, setTexts] = useState<Text[]>(structuredClone(props.texts));


    let [openState, setopenState] = useState(false);
    const open = () => {
        setopenState(!openState);
    }
    useEffect(() => {
        singleItem.texts.sort((a, b) => { return b.id - a.id })
    }, [singleItem.texts])


    const setPin = async (e: React.MouseEvent, id: number, item: Text) => {
        e.stopPropagation(); // 阻止事件冒泡到父级 div
        try {
            await setPinText(id);
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
    const setCancelPin = async (e: React.MouseEvent, id: number, item: Text) => {
        e.stopPropagation(); // 阻止事件冒泡到父级 div
        try {
            await setUnPinText(id);
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
        <div className='chapter'>
            <div className={styles.chapterTitle} onClick={() => { open() }}>{singleItem.tags}</div>
            <div>

            </div>
            {(texts || []).map((item) => {
                return <div className={`${styles.mainContent} `} key={item.id} onClick={() => { jump(item.id) }}>
                    <div className={`${styles.textTitle} ${openState ? styles.mainContentOpen : ''}`}>
                        <div className={styles.mainTitle}>
                            <div>{item.title}
                            </div>
                            <span>
                                {item.state ? '' : <PushpinOutlined onClick={(e) => setPin(e, item.id, item)} className={styles.setPin} />}
                                {item.state == '快速访问' ? <CloseOutlined onClick={(e) => setCancelPin(e, item.id, item)} className={styles.setCancelPin} /> : ''}
                            </span>
                        </div>
                    </div>
                </div>
            })}
        </div>

    </>
}