import {
  Card,
  CardBody,
} from "@material-tailwind/react";
import { FaTruckRampBox, FaBoxesStacked, FaRegPaperPlane } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function TrackTurn() {
  return (
    <Card className="mt-4 shadow-none w-full">
      <CardBody
        style={{ backgroundColor: "#fff", borderRadius: "10px" }}
        className="w-full flex flex-col gap-4"
      >
        <div className="w-full justify-between flex sm:justify-around">
          {/* Nova Coleta */}
          <div className="grid justify-items-center">
          <Link to="/newcollect" className="flex flex-col items-center group">
            <div
              style={{
                borderRadius: "100%",
              }}
              className="w-fit cursor-pointer bg-gradient-to-b from-green-500 to-green-700 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
            >
              <FaTruckRampBox className="text-6xl p-3 text-white group-hover:text-green-500" />
            </div>
            <label className="text-sm font-bold text-center">Nova Coleta</label>
          </Link>
        </div>


          {/* Minhas Coletas */}
          <div className="grid justify-items-center">
            <Link to="/mycollects" className="flex flex-col items-center group">
              <div
                style={{
                  borderRadius: "100%",
                }}
                className="w-fit cursor-pointer bg-gradient-to-b from-green-500 to-green-700 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
              >
                <FaBoxesStacked className="text-6xl p-3 text-white group-hover:text-green-500" />
              </div>
              <label className="text-sm font-bold text-center">Minhas Coletas</label>
            </Link>
          </div>

          {/* Suporte */}
          <div className="grid justify-items-center">
            <Link to="/support" className="flex flex-col items-center group">
              <div
                style={{
                  borderRadius: "100%",
                }}
                className="w-fit cursor-pointer bg-gradient-to-b from-green-500 to-green-700 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
              >
                <FaRegPaperPlane className="text-6xl p-3 text-white group-hover:text-green-500" />
              </div>
              <label className="text-sm font-bold text-center">Fala <strong>VB</strong></label>
            </Link>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
