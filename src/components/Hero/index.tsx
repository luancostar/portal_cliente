import { Card, CardBody } from "@material-tailwind/react";


export default function Hero() {
 return (
   <div>
  <Card className="mt-4 w-full">
      <CardBody style={{ padding:'0px', backgroundImage: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50))", borderRadius: "10px" }}
        className="w-full flex flex-col gap-4">
        <div className="flex justify-between">
        <div className="p-6 text-2xl font-bold text-white sm:text-6xl md:text-6xl">
                   Pro seu negócio ir mais longe! 
            </div>
            <div className="flex justify-center"> 
            <img src="../src/assets/herobg.png" alt="" className="w-full xl:max-w-[50%]" />

            </div>
        </div>
      </CardBody>
    </Card>
   </div>
 );
}