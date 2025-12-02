import styles from './login.module.less'
import Basement from '../../components/basement/basement'
import { Tabs } from 'antd'
import Login from './components/login/login'
import Register from './components/register/register'
export default function Login_register() {
    return <>
        <Basement>
            <div className={styles.title}>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    items={[{
                        label: `登录`,
                        key: '1',
                        children: <div className={styles.fadeContent}><Login /></div>
                    }, {
                        label: `注册`,
                        key: '2',
                        children: <div className={styles.fadeContent}><Register /></div>,
                    }]}
                />
            </div>
        </Basement>
    </>
}