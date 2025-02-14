// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { useState } from "react";  // Importa o hook useState
import { useNavigate } from "react-router-dom";  // Importa useNavigate
import { Card, CardBody } from "@material-tailwind/react";
import { FaDoorOpen } from "react-icons/fa";
import { FaTruckRampBox, FaBoxesStacked, FaChartSimple, FaTruck } from "react-icons/fa6";
import vbIcon from "../../assets/logo_negativa.png"
import { Link } from "react-router-dom";

export default function TrackTurn() {
  const navigate = useNavigate();  // Inicializa o hook useNavigate
  const [loading, setLoading] = useState(false);  // Estado para controlar o loading

  // Função para limpar o localStorage, exibir o loading e redirecionar
  const handleLogout = () => {
    setLoading(true);  // Ativa o loading
    localStorage.clear();  // Limpa o localStorage

    // Adiciona um delay de 2 segundos antes de redirecionar
    setTimeout(() => {
      setLoading(false);  // Desativa o loading
      navigate("/");  // Redireciona para a página de login
    }, 1500);  // Delay de 2 segundos
  };

  return (
    <div >
      {/* Exibe o loading em tela cheia */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
        </div>
      )}

      <Card className="overflow-auto mt-4 shadow-none w-full">
        <CardBody
          style={{ backgroundColor: "#fff", borderRadius: "10px" }}
          className="p-2 flex flex-col gap-4"
        >
          <div className="min-w-[120vw] md:min-w-px md:w-full justify-evenly md:justify-between flex sm:justify-around">
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
                <label className="text-xs font-bold text-center">Nova Coleta</label>
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
                <label className="text-xs font-bold text-center"> Coletas</label>
              </Link>
            </div>

            <div className="grid justify-items-center">
              <Link to="/mydeliveries" className="flex flex-col items-center group">
                <div
                  style={{
                    borderRadius: "100%",
                  }}
                  className="w-fit cursor-pointer bg-gradient-to-b from-green-500 to-green-700 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
                >
                  <FaTruck className="text-6xl p-3 text-white group-hover:text-green-500" />
                </div>
                <label className="text-xs font-bold text-center"> Entregas</label>
              </Link>
            </div>


            <div className="grid justify-items-center">
              <Link to="/performance" className="flex flex-col items-center group">
                <div
                  style={{
                    borderRadius: "100%",
                  }}
                  className="w-fit cursor-pointer bg-gradient-to-b from-green-500 to-green-700 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
                >
                  <FaChartSimple className="text-6xl p-3 text-white group-hover:text-green-500" />
                </div>
                <label className="text-xs font-bold text-center"> Performances</label>
              </Link>
            </div>

           
            <div className="grid justify-items-center">
              <Link to="/support" className="flex flex-col items-center group">
                <div
                  
                  style={{
                    borderRadius: "100%",
                    width:'55px',
                  }}
                  className="w-fit flex justify-center cursor-pointer bg-gradient-to-b from-green-500 to-green-700 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
                >
                  <img src={vbIcon} width={'50px'} alt="" className="text-6xl p-2 text-white group-hover:text-green-500" />
                </div>
                <label className="text-xs font-bold text-center">Fale com a <br />Diretoria</label>
              </Link>
            </div>
            
            {/* Sair */}
            <div className="grid justify-items-center">
              <button
                onClick={handleLogout}  // Chama a função handleLogout ao clicar
                className="flex flex-col items-center group"
              >
                <div
                  style={{
                    borderRadius: "100%",
                  }}
                  className="w-fit cursor-pointer bg-gradient-to-b from-white to-gray-600 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
                >
                  <FaDoorOpen className="text-6xl p-3 text-white group-hover:text-green-500" />
                </div>
                <label className="text-xs font-bold text-center">Sair</label>
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
