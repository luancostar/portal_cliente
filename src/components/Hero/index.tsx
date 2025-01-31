// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import heroBg from "../../assets/herobg.png";
import { Card, CardBody } from "@material-tailwind/react";


export default function Hero() {
 return (
   <div>

 
  <Card className="mt-4 w-full">
      <CardBody style={{ padding:'0px', backgroundImage: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50))", borderRadius: "10px" }}
        className="w-full flex flex-col gap-4">
        <div className="flex justify-between">
        <div className="p-6 text-2xl font-bold text-white  sm:text-6xl md:text-6xl">
              Nós cuidamos pra você 💚
            </div>
            <div className="flex justify-center"> 
            <img src={heroBg} alt="" className="w-full xl:max-w-[50%]" />

            </div>
        </div>
      </CardBody>
    </Card>
   </div>
 );
}