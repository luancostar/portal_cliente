import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewCollect from "./pages/NewCollect";
import Diretoria from "./pages/Diretoria";
import MyCollects from "./pages/MyCollects";

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
    {
        path: '/support',
        element: <Diretoria/>
    },
    {
        path: '/mycollects',
        element: <MyCollects/>
    },
    {
        path: '*',
        element: <Home />
    }
 
])

export default router