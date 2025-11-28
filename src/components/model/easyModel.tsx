import { Modal } from 'antd'
import styles from './easyModel.module.less'
import { useState, type ReactNode } from 'react';


interface EasyModel {
    isModalOpen: boolean,
    handleOk: () => void,
    handleCancel: () => void,
    children: ReactNode
}
export default function EasyModel(prop: EasyModel) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        prop.handleOk();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        prop.handleCancel();
        setIsModalOpen(false);
    };
    return <>
        <Modal
            title="Basic Modal"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            {prop.children}
        </Modal>
    </>
}