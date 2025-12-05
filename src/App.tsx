import { RouterProvider } from 'react-router'
import './App.less'
import router from './router/router'
import { useEffect, useState } from 'react'
import useDarkStore from './store/darkMode'
import useUserStore from './store/user'
import { ConfigProvider, theme } from 'antd'
import getThemeConfig from './css/themeConfig/themeConfig'
import { GlobalStyle } from './components/cssinJS/GlobalStyle'
function App() {
  const DarkMode = useDarkStore();
  const UserStore = useUserStore();
  let { isDark } = DarkMode;
  let [themeConfig, setThemeConfig] = useState({});
  useEffect(() => {
    if (localStorage.getItem("isDark") == 'true') DarkMode.setDark(true);
    else DarkMode.setDark(false);

    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setThemeConfig(getThemeConfig());
  }, [isDark])
  useEffect(() => {//取出token,设置全局变量,不用和后端进行检验，如果发http是401就更新
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      UserStore.setAccessToken(accessToken);
    }
  }, [])


  return (
    <>

      <ConfigProvider theme={themeConfig}>
        <GlobalStyle></GlobalStyle>
        <RouterProvider router={router} />
      </ConfigProvider>

    </>
  )
}

export default App
