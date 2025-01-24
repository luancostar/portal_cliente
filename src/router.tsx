import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";

const router = createBrowserRouter ([
    {
        path: '/',
        element: <Login/>
    },
    {
        path: '/home',
        element: <Home/>
    },
 
])

export default router