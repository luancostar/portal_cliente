// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import FormLogin from "../../components/login-side-left";
import CoverLogin from "../../components/login-side-right";
 
export default function Login() {
 return (
   <div style={{ overflow: 'hidden' }}  className="h-full flex justify-center">
{/* <FormLogin/> */}
<CoverLogin/>
   </div>
 );
}