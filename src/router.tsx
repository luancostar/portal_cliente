import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewCollect from "./pages/NewCollect";
import Diretoria from "./pages/Diretoria";
import MyCollects from "./pages/MyCollects";
import Performance from "./pages/Performance";
import AlterarSenha from "./pages/changePassword";
import MyDeliveries from "./pages/MyDeliveries";
 

const router = createBrowserRouter ([
    {
        path: '/',
        element: <Login/>
    },
    {
        path: '/alterarsenha',
        element: <AlterarSenha/>
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
        path: '/mydeliveries',
        element: <MyDeliveries/>
    },
    {
        path: '/performance',
        element: <Performance/>
    },
    {
        path: '*',
        element: <Home />
    }
 
])

export default router