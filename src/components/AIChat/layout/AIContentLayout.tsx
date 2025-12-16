import { Button, Form, Input, type FormProps } from 'antd'
import styles from './AIContentLayout.module.less'
import { UploadOutlined } from '@ant-design/icons';


type FieldType = {
    keyword?: string,
};
const { TextArea } = Input;
export default function AIContentLayout() {

    const [form] = Form.useForm();
    const keyword = Form.useWatch('keyword', form);
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return <>
        <div className={styles.chatWrapper}>
            <div className={styles.chat}>

            </div>
            <div className={styles.input}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: 'center',
                        width: '100%',
                    }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {/* <Form.Item<FieldType>
                        name="keyword"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item> */}

                    <div className={styles.inputWrapper}>
                        <div className={styles.innerInputWrapper}>
                            <Form.Item<FieldType> noStyle name="keyword">
                                <TextArea rows={2} placeholder="输入提示词" className={styles.customTextarea} style={{ height: '100%', resize: 'none' }} />
                            </Form.Item>
                            <div className={styles.hiddenDiv}>{keyword}</div>
                        </div>

                        <div className={styles.btnWrapper}>
                            <Form.Item noStyle>
                                <Button icon={<UploadOutlined />}></Button>
                            </Form.Item>
                            <Form.Item noStyle>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </div>

                    </div>

                    {/* <Form.Item label={null} noStyle>
                        <div className={styles.inputWrapper}>
                            <div className={styles.textarea}>

                            </div>
                            <div className={styles.uploadBtn}>

                            </div>
                            <div className={styles.subBtn}>

                            </div>
                        </div>
                    </Form.Item> */}
                </Form>
            </div>
        </div>
    </>
}