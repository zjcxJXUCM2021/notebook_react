import { createBrowserRouter } from "react-router";
import Login_register from "../pages/login/Login_register";
import Home from "../pages/home/home";
import TextShow from "../pages/text/textShow";
import MainLayout from "../layout/mainLayout/mainLayout";
import NotFound from "../pages/404/notFound";
import Upload from "../pages/upload/upload";

const adminRouters = [{}];

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
        path: '/404/',
        element: <NotFound />
    }
];


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: showRouters,
    }, {
        path: '/upload/',
        element: <Upload></Upload>
    }
]);
export default router;