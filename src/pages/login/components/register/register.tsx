import { Form, Input, Button, Space } from "antd"
import commonStyles from '@/css/commonStyles/commonStyles.module.less'
import type { FormProps } from 'antd';
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { loginRequest, registerAdmin } from "../../../../api/http/api";
type FieldType = {
    username: string;
    password: string;
    confirmPassword: string;
    phone: string;
    email: string;
    code: string;
    remember?: string;
};


export default function Register() {
    const [form] = Form.useForm();
    const nav = useNavigate();
    let [countdown, setcountdown] = useState(60);
    let [emailState, setemailState] = useState(true);
    let timeRef = useRef(0);
    let sendCode = async () => {
        setemailState(true);
        await axios.post(import.meta.env.VITE_BASE_URL + 'admin/sendEmail/', null, {
            params: {
                name: form.getFieldValue("username"),
                email: form.getFieldValue("email")
            },
            headers: {

            }
        })
        setcountdown(setcountdown => setcountdown - 1);
        timeRef.current = setInterval(() => {
            setcountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timeRef.current!);
                    setemailState(false);
                    return 60;
                }
                return prev - 1;
            });
        }, 1000)
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {//values是填入的值，当表单前端验证通过时
        try {
            await registerAdmin({
                name: form.getFieldValue("username"),
                password: form.getFieldValue("password"),
                email: form.getFieldValue("email"),
                code: form.getFieldValue("code"),
            });
            await loginRequest({ email: values.email, password: values.password, remember: false });
            nav('/');

        } catch (e) {
            console.log(e);
        }
    };
    let onFinishFailed = () => {

    }

    const validateUsername = (_: any, value: string) => {//这里需要传的是一个promise，可能需要链接后端才能鉴别
        if (!value) {
            return Promise.reject(new Error('请输入用户名'));
        }
        if (value.length < 3) {
            return Promise.reject(new Error('用户名长度至少为3个字符'));
        }
        return Promise.resolve();
    };
    const validatePhone = (_: any, value: string) => {//使用正则表达式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!value) return Promise.resolve();
        else if (!phoneRegex.test(value)) {//正则表达式
            return Promise.reject(new Error('请输入正确的11位手机号'));
        }
        return Promise.resolve();

    };
    const validateEmail = (_: any, value: string) => {
        const emailRegex = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) {
            setemailState(true);
            return Promise.reject(new Error("请输入邮箱"))
        }
        else if (!emailRegex.test(value)) {
            setemailState(true);
            return Promise.reject(new Error('请输入正确的邮箱地址'))
        }
        else {
            setemailState(false);
            return Promise.resolve()
        };
    }
    const validateUserPassword = (_: any, value: string) => {
        if (!value) return Promise.reject(new Error("请输入密码"));
        else if (value.length < 3) return Promise.reject(new Error('密码强度过弱'));
        else return Promise.resolve();
    }
    return <>
        <div className={commonStyles.center}>
            <Form
                form={form}
                name="reg"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="用户名:"
                    name="username"
                    rules={[{ required: true, validator: validateUsername }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="密码:"
                    name="password"
                    rules={[{ required: true, validator: validateUserPassword }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="确认密码:"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: '请再次输入密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.reject(new Error('请再次输入密码'));
                                }
                                if (value !== getFieldValue('password')) {
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="手机号:"
                    name="phone"
                    rules={[{ required: false, validator: validatePhone }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="邮箱:"
                    name="email"
                    rules={[{ required: true, validator: validateEmail }]}
                >
                    <Space.Compact style={{ width: '100%' }}>
                        {/* 3. 使用一个普通的 Input 组件 */}
                        <Input
                            placeholder="邮箱"
                            allowClear
                            size="large"
                        // 当用户在输入框内按回车时，也触发 sendCode
                        // onPressEnter={sendCode}
                        />
                        {/* 4. 使用一个独立的 Button 组件 */}
                        <Button
                            type="primary"
                            size="large"
                            disabled={emailState}
                            // 当用户点击按钮时，触发 sendCode
                            onClick={sendCode}
                        >
                            {countdown == 0 || countdown == 60 ? '发送验证码' : countdown}
                        </Button>
                    </Space.Compact>
                </Form.Item>
                <Form.Item<FieldType>
                    label="验证码:"
                    name="code"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        注册
                    </Button>
                </Form.Item>
            </Form>
        </div>

    </>
}