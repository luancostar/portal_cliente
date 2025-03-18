// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from "react";
import StatsSection from "../../components/my-performances";
import { Card } from "@material-tailwind/react";
import { FaParachuteBox, FaPeopleCarry } from "react-icons/fa";
import StatsSectionEntregas from "../../components/my-performances-entregas";
import { Link } from "react-router-dom";
import withAuth from "../hoc"; 


// eslint-disable-next-line react-refresh/only-export-components
function Performance() {
  const [idCliente, setIdCliente] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("coletas"); // Estado para alternar a exibição

  useEffect(() => {
    // Recuperando o ID do cliente do localStorage
    const clienteId = localStorage.getItem("idCliente");
    setIdCliente(clienteId);
  }, []);

  return (
    <div className="h-full p-2 justify-center">
      <div className="flex justify-between items-center">
        <h4 className="ml-2 text-xl font-bold text-gray-700">Minhas Performances</h4>
        <Link to="/home" className="flex flex-col items-end p-2">
          <h2>
            <i style={{ color: "rgb(13,171,97)" }} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i>
          </h2>
        </Link>
      </div>

      <Card className="bg-green-700 ">
        <div className="bg-transparent w-full text-white flex justify-center text-center ">
          <button
            className={`text-xl rounded-md justify-center w-full border-r-2 border-gray-500 p-2 flex items-center active:scale-95 transition-all ${
              activeSection === "coletas" ? "bg-green-900" : ""
            }`}
            onClick={() => setActiveSection("coletas")}
          >
            <FaPeopleCarry className="mr-2" /> COLETAS
          </button>
          <button
            className={`text-xl rounded-md justify-center w-full p-2 flex items-center active:scale-95 transition-all ${
              activeSection === "entregas" ? "bg-green-900" : ""
            }`}
            onClick={() => setActiveSection("entregas")}
          >
            <FaParachuteBox className="mr-2" /> ENTREGAS
          </button>
        </div>
      </Card>

      {activeSection === "coletas" && <StatsSection idCliente={idCliente} />}
      {activeSection === "entregas" && <StatsSectionEntregas idCliente={idCliente} />}
    </div>
  );
}

// Aplique o HOC antes de exportar o componente
// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(Performance);