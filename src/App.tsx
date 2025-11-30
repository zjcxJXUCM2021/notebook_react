import { RouterProvider } from 'react-router'
import './App.less'
import router from './router/router'
import { useEffect } from 'react'
import useDarkStore from './store/darkMode'
import useUserStore from './store/user'
function App() {
  const DarkMode = useDarkStore();
  const UserStore = useUserStore();
  let { isDark } = DarkMode;
  useEffect(() => {
    if (localStorage.getItem("isDark") == 'true') DarkMode.setDark(true);
    else DarkMode.setDark(false);

    if (isDark) {
      // 如果是深色模式，设为 dark
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      // 关键点：如果是浅色模式，要设为 light (或者移除该属性)
      document.documentElement.setAttribute('data-theme', 'light');
      // 或者使用: document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark])
  useEffect(() => {//取出token,设置全局变量,不用和后端进行检验，如果发http是401就更新
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      UserStore.setAccessToken(accessToken);
    }
  }, [])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
