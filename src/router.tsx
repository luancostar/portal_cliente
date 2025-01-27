import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewCollect from "./pages/NewCollect";

const router = createBrowserRouter ([
    {
        path: '/',
        element: <Login/>
    },
    {
        path: '/home',
        element: <Home/>
    },
    {
        path: '/newcollect',
        element: <NewCollect/>
    },
 
])

export default router