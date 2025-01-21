/* eslint-disable @typescript-eslint/no-unused-vars */

import FormLogin from "../../components/login-side-left";
import CoverLogin from "../../components/login-side-right";
 
export default function Login() {
 return (
   <div className="h-full flex">
<FormLogin/>
<CoverLogin/>
   </div>
 );
}