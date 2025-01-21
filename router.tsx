import Login from "./src/pages/Login";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter ([
    {
        path: '/',
        element: <Login/>
    },
 
])

export default router