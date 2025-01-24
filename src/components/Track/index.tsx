 
import {
  Card,
  CardBody,
 
} from "@material-tailwind/react";
import { FaTruckRampBox, FaBoxesStacked, FaRegPaperPlane } from "react-icons/fa6";

export default function TrackTurn() {
 return (
  <Card className="mt-4 shadow-none w-full">
      <CardBody
        style={{ backgroundColor: "#fff", borderRadius: "10px" }}
        className="w-full flex flex-col gap-4"
      >
        <div className="w-full justify-around flex">
          <div className="grid justify-items-center">
              <div style={{ borderRadius:"100%", backgroundColor: "rgb(13,171,97)"}} className="w-fit">
                <FaTruckRampBox  className="text-6xl p-3  text-white" />
              </div>
               <label className="font-bold text-center">Solicitar Coleta</label>
          </div>

          <div className="grid justify-items-center">
              <div style={{ borderRadius:"100%", backgroundColor: "rgb(13,171,97)"}} className="w-fit">
              <FaBoxesStacked  
              className="text-6xl p-3  text-white" />
              </div>
               <label className="font-bold text-center">Minhas Coletas</label>
          </div>
          
          
          <div className="grid justify-items-center">
              <div style={{ borderRadius:"100%", backgroundColor: "rgb(13,171,97)"}} className="w-fit">
              <FaRegPaperPlane 
              className="text-6xl p-3  text-white" />
              </div>
               <label className="font-bold text-center">Mensagem de Suporte</label>
          </div>

        </div>
       

      </CardBody>
    </Card>
 );
}