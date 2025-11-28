import axios from "axios";
import { message } from "antd";
import useUserStore from '../../store/user'
interface response<T> {
    code: number,
    message: string,
    data: T
}
interface loginRes {
    accessToken: string,
    message: string,
}

export const http = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
    withCredentials: true,//跨域时是否携带cookie
    timeout: 100000,
})

http.interceptors.request.use(config => {//发送时的拦截器
    const token = localStorage.getItem('token');
    if (token)
        config.headers['Authorization'] = 'Bearer ' + token;

    return config;
});

http.interceptors.response.use(//接收时的拦截器
    response => {//网络上没错
        if (response.data.code < 300) {
            console.log(response.data);
            return response.data.data;
        }
        else if (response.data.code == 401) {//当accesstoken过期时
            message.error('未登录');

            const renewToken = async () => {
                const res = await renewTokenRequest(useUserStore.getState().accessToken);
                useUserStore.getState().setAccessToken(res);
            }
            renewToken();
            return Promise.reject(response.data.message);
        } else {
            message.error('网络异常');
            return Promise.reject(response.data.message);
        }
    }, errorHandle => {
        message.error('网络异常');
        return Promise.reject("error");
    }
)

export const getAllText = async (): Promise<Text[]> => { return await http.post('article/getAllText/') };

export const setPinTextHttp = async (id: number): Promise<response<Text[]>> => {
    return await http.post('article/setQuickAccess/', null, {
        params: {
            id: id
        }
    })
}

export const setUnPinTextHttp = async (id: number): Promise<response<Text[]>> => {
    return await http.post('article/removeQuickAccess/', null, {
        params: {
            id: id
        }
    })
}
export const getAllPinText = async (): Promise<Text[]> => {
    return await http.post('/article/getQuickAccess/');
}

export const getText = async (id: number): Promise<Text> => {
    return await http.post('/articleGet/getArticle/', null, {
        params: {
            id: id,
        }
    })
}

export const loginRequest = async (email: string, password: string): Promise<loginRes> => {
    return await http.post('/admin/login/', null, {
        params: {
            email: email,
            password: password,
        }
    })
}

const renewTokenRequest = async (AccessToken: string): Promise<string> => {
    return await http.post('/token/renewAccessToken/', null, {
        params: {
            accessToken: AccessToken,
        }
    })
}

export const uploadText = async (Text: Text): Promise<string> => {
    return await http.post('/article/addNew/', new URLSearchParams({
        article: JSON.stringify({
            id: '',
            content: Text.content,
            title: Text.title,
            tag: Text.tag,
        }),
    }))
}

export const updateText = async (Text: Text): Promise<string> => {
    return await http.post('/article/updata/', new URLSearchParams({
        article: JSON.stringify({
            id: Text.id,
            content: Text.content,
            title: Text.title,
            tag: Text.tag,
        }),
    }))
}