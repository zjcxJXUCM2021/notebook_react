import React, { useRef, useState } from 'react'
import styles from './AiChat.module.less'
import { FloatButton } from 'antd';
import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons';

interface pos {
    nowX: number,
    nowY: number,
}
export default function AiChat() {
    let [isShow, setIsShow] = useState(false);
    let [pos, setPos] = useState<pos>({ nowX: 24, nowY: 100 });
    let isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    // let offsetX = 
    const handleMouseMove = (e: any) => {
        isDragging.current = true;
        // 【关键】直接用 鼠标位置 - 固定的偏移量 = 盒子新位置
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        setPos({ nowX: newX, nowY: newY });

    }
    const handleMouseDown = (e: any) => {
        if (e.button != 0) return
        // 【关键】计算并锁死这个偏移量
        // 公式：偏移量 = 鼠标当前坐标 - 盒子当前坐标
        dragOffset.current = {
            x: e.clientX - pos.nowX,
            y: e.clientY - pos.nowY
        };
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    const handleMouseUp = (e: any) => {
        console.log("抬起");
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    const handleOpenChange = () => {
        setIsShow(!isShow);
    }
    return <>
        <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ right: 24, top: 24 }}
            icon={<CustomerServiceOutlined />}
            onOpenChange={handleOpenChange}
        >
            <FloatButton style={{ display: 'none' }} />
        </FloatButton.Group>

        <div className={`${styles.wrapper} ${isShow ? styles.show : ''}`} style={{ top: pos.nowY, left: pos.nowX, visibility: isShow ? 'visible' : "hidden" }}>
            <div className={styles.title} onMouseDown={(e) => handleMouseDown(e)} >
                title
            </div>
            <div className={styles.content}>
                content
            </div>
        </div>
    </>
}