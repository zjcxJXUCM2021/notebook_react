import styles from './left.module.less'
import { Input, Avatar, Tooltip, Button, Divider, Form } from 'antd'
import { MailOutlined, MoonOutlined } from '@ant-design/icons'
import Icon from '../../icon/Icon'
import useDarkStore from '../../../store/darkMode'
import ButtonList from '../../buttonList/buttonList'
import { useNavigate } from 'react-router'
import useUserStore from '../../../store/user'

interface formType {
    keyword: string,
}
export default function Left() {
    const UserStore = useUserStore();
    const nav = useNavigate();
    const [form] = Form.useForm();
    let darkStore = useDarkStore();
    const toDark = () => {
        darkStore.updateDark();
    }
    const jump = () => nav('/');
    const validateKeyword = (_: any, keyword: string): Promise<void> => {
        if (!keyword.trim()) return Promise.reject(new Error('请输入文字'));
        else return Promise.resolve();
    }
    const onFinish = async (value: formType) => {
        console.log(value);
        nav('/search/' + form.getFieldValue('keyword'));
    }
    return <>
        <div className={styles.wrapper}>
            <div className={styles.upWrapper}>
                {/* <span style={{ "margin": "0 auto" }}>
                    
                </span> */}
                <img className={styles.avatar} src='https://img0.baidu.com/it/u=3267993544,3801388513&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666' />
                <div onClick={jump} className={styles.title}>
                    JLY Blog
                </div>
                <div className={styles.sum}>
                    41篇文章<Divider type="vertical" />32个专题
                </div>
                <div className={styles.btn}>
                    <Tooltip title="2631854038@qq.com">
                        <Button type="primary" shape="circle" icon={<MailOutlined />} />
                    </Tooltip>
                    <Tooltip title="黑夜模式">
                        <Button type="primary" shape="circle" icon={<MoonOutlined />} onClick={toDark} />
                    </Tooltip>
                </div>

                <Divider size='small' />
                <div className={styles.sup}>
                    <Icon type='icon-react1'></Icon>
                    <Icon type='icon-tengxunyun'></Icon>
                    <Icon type='icon-qiniuyuncunchu'></Icon>
                </div>
            </div>
            <div className={styles.downWrapper} >
                {
                    UserStore.accessToken ? <><ButtonList path='/upload/' >上传</ButtonList>
                        <div onClick={() => { localStorage.clear() }} style={{ width: "100%" }}>
                            <ButtonList >注销</ButtonList>
                        </div> </> : <ButtonList path='/login/' >登录</ButtonList>
                }
                <ButtonList path='/about/' >关于</ButtonList>
                <ButtonList path='/' >回到顶部</ButtonList>
                <Form
                    form={form}
                    name="log"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 24 }}
                    style={{}}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                ><Form.Item<formType>
                    name="keyword"
                    rules={[{ required: false, validator: validateKeyword }]}
                >
                        <Input placeholder='文章标题' />
                    </Form.Item></Form>


            </div>

        </div >
    </>
}