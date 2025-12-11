import { createBrowserRouter } from "react-router";
import Login_register from "../pages/login/Login_register";
import Home from "../pages/home/home";
import TextShow from "../pages/text/textShow";
import MainLayout from "../layout/mainLayout/mainLayout";
import NotFound from "../pages/404/notFound";
import Upload from "../pages/upload/upload";
import SearchText from "../pages/search/searchText";
import AuthGuard from "./guard";
import { lazy, Suspense, type ComponentType } from "react";
import Loading from "../pages/loading/loading";
import LoadingTopLine from "../components/loading/loading";
import nProgress from "nprogress";


const importTextShow = () => import('../pages/text/textShow');
// 你的代码封装
const lazyLoad = (dynamicImport: () => Promise<{ default: ComponentType<any> }>) => {
    const Component = lazy(dynamicImport);
    return (
        // 如果 Component 还没下载完，界面显示 fallback 里的 <Loading />
        // 下载完了，自动替换为 <Component />
        //如果这里是替换了父路由中的一个组件，就是替换子组件，而不是全屏显示
        <Suspense fallback={<LoadingTopLine />}>
            <Component />
        </Suspense>
    );
};

const adminRouters = [{
    path: 'upload',
    element: <Upload></Upload>,
}];

const showRouters = [
    {
        path: "/login/",
        Component: Login_register
    }, {
        path: "/",
        Component: Home
    }, {
        path: '/text/:id',
        // element: lazyLoad(importTextShow),
        // loader: async () => {
        //     await importTextShow();
        //     return null; // 不需要返回数据，只需要阻塞
        // }
        lazy: async () => {
            nProgress.start();
            const { default: Component } = await import('../pages/text/textShow');
            nProgress.done();
            return { Component };
        }
    }, {
        path: '/search/',
        element: <SearchText />
    }, {
        path: '/*',
        element: <NotFound />
    },
];


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: showRouters,
    }, {
        path: "admin/",
        element: <AuthGuard></AuthGuard>,
        children: adminRouters,
    }, {
        path: '/*',
        element: <NotFound />
    }
]);
export default router;