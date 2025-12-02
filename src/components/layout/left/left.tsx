import styles from './left.module.less'
import { Input, Avatar, Tooltip, Button, Divider, Form, Slider } from 'antd'
import { MailOutlined, MoonOutlined } from '@ant-design/icons'
import Icon from '../../icon/Icon'
import useDarkStore from '../../../store/darkMode'
import ButtonList from '../../buttonList/buttonList'
import { useLocation, useNavigate } from 'react-router'
import useUserStore from '../../../store/user'
import { useEffect, useState } from 'react'
import useTextFontSize from '../../../store/state/textFontSize'
import { logoutAdmin } from '../../../api/http/api'

interface formType {
    keyword: string,
}
interface leftProp {
    text: Text[]
}
export default function Left(prop: leftProp) {
    const UserStore = useUserStore();

    const location = useLocation();
    const [textFontSize, setTextFontSize] = useState(1);
    const textFontSizeStore = useTextFontSize();
    const nav = useNavigate();
    const [form] = Form.useForm();
    let darkStore = useDarkStore();

    useEffect(() => {
        textFontSizeStore.setFontSize(String(textFontSize));
    }, [textFontSize])
    const toDark = () => {
        darkStore.updateDark();
    }
    const jump = () => nav('/');
    const validateKeyword = (_: any, keyword: string): Promise<void> => {
        if (!keyword.trim()) return Promise.reject(new Error('请输入文字'));
        else return Promise.resolve();
    }
    const onFinish = async () => {
        nav(`/search/?keyword=${form.getFieldValue('keyword')}`);
    }
    const logout = async () => {
        try {
            await logoutAdmin();
            localStorage.removeItem('email');
            localStorage.removeItem('accessToken');
            // localStorage.clear();
            UserStore.setAccessToken('');
        } catch (e) {

        }
    }
    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // 平滑滚动
        })
    }
    const set = new Set;
    prop.text.forEach((item) => {
        set.add(item.tag);
    })
    return <>
        <div className={styles.wrapper}>
            <div className={styles.upWrapper}>
                <img className={styles.avatar} src='https://img0.baidu.com/it/u=3267993544,3801388513&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666' />
                <div onClick={jump} className={styles.title}>
                    JLY Blog
                </div>
                <div className={styles.sum}>
                    {prop.text.length}篇文档<Divider type="vertical" />{set.size}个专题
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
                    UserStore.accessToken ?
                        <>{localStorage.getItem("email") ? <><ButtonList path='/upload/' >上传</ButtonList></> : ''}
                            <div onClick={() => { logout() }} style={{ width: "100%" }}>
                                <ButtonList >注销</ButtonList>
                            </div> </>
                        : <ButtonList path='/login/' >登录</ButtonList>
                }
                <ButtonList path='/' >首页</ButtonList>
                <div style={{ width: "100%" }} onClick={scrollTop}><ButtonList path='/' >回到顶部</ButtonList></div>
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
                {
                    location.pathname.slice(0, 5) == '/text' ? <div style={{ width: '100%' }}>
                        字体大小
                        <Slider value={textFontSize} onChange={(value) => setTextFontSize(value)} max={3} min={0.5} step={0.1} />
                    </div> : ''
                }
            </div>

        </div >
    </>
}