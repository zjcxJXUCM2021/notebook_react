import { createBrowserRouter, Outlet } from "react-router";
import Login_register from "../pages/login/Login_register";
import Home from "../pages/home/home";
import TextShow from "../pages/text/textShow";
import MainLayout from "../layout/mainLayout/mainLayout";
import NotFound from "../pages/404/notFound";
import Upload from "../pages/upload/upload";
import SearchText from "../pages/search/searchText";
import AuthGuard from "./guard";

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
        element: <TextShow />
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
    }
]);
export default router;