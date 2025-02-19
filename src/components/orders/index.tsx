// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import { API_URL } from "../../../config";
import loadingGif from "../../assets/loading.gif"

export function OrdersTable({ idCliente }) {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idCliente) {
      const controller = new AbortController();
      const signal = controller.signal;
  
      const url = `${API_URL}/coletas/getColetasCliente.php?id_cliente=${idCliente}`;
  
      setLoading(true);
  
      fetch(url, { signal })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados da API");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Coletas recebidas:", data.data); // Verificar retorno da API
  
          if (data.status === "success" && Array.isArray(data.data) && data.data.length > 0) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Ajuste para comparar datas sem horário
  
            // Ordena todas as coletas pela data, da mais recente para a mais antiga
            const coletasOrdenadas = data.data
              .map(coleta => ({
                ...coleta,
                data_agendamento: new Date(coleta.data_agendamento).setHours(0, 0, 0, 0)
              }))
              .sort((a, b) => b.data_agendamento - a.data_agendamento);
  
            // Encontra a coleta do dia atual
            const coletaHoje = coletasOrdenadas.find(coleta => coleta.data_agendamento === hoje.getTime());
  
            // Encontra a coleta imediatamente anterior (aquela que vem logo antes da de hoje)
            const indexHoje = coletaHoje ? coletasOrdenadas.indexOf(coletaHoje) : -1;
            const coletaAnterior = indexHoje > 0 ? coletasOrdenadas[indexHoje + 1] : null;
  
            // Define o estado com as coletas filtradas
            setColetas(
              coletaHoje 
                ? (coletaAnterior ? [coletaHoje, coletaAnterior] : [coletaHoje]) 
                : []
            );
  
            // Armazena a razão social no localStorage, se houver coleta do dia
            if (coletaHoje) {
              localStorage.setItem("razao_social", coletaHoje.razao_social || "");
            }
  
            // Exibir motorista e placa para depuração
            console.log("Motorista hoje:", coletaHoje?.motorista);
            console.log("Placa hoje:", coletaHoje?.placa);
          } else {
            setColetas([]);
          }
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("Requisição abortada");
          } else {
            setError(err.message);
          }
        })
        .finally(() => setLoading(false));
  
      return () => controller.abort();
    }
  }, [idCliente]);
  
  
  if (loading) {
    return <div>Carregando dados...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl text-gray-500 font-bold mb-4">📦 Acompanhe sua coleta: </h2>
      {coletas.length > 0 ? (
        coletas.map((coleta, index) => (
          <Card className="mt-4" key={index}>
            <div className="p-4 pb-10 flow-root">
              <ul role="list" className="-mb-8 w-full grid justify-items-start xl:flex sm:justify-start" >
                {/* Etapa 1: Pendente de autorização ou Autorizada ou Coletada */}
                <li>
                  <div className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        {/* Ícone SVG: Só aparece quando status_coleta NÃO for "Pendente de autorização" */}
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            coleta.status_coleta === "Pendente de autorização" ? "hidden" : "bg-green-500"
                          }`}
                        >
                          <svg
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>

                        {/* Imagem de carregamento: Só aparece quando status_coleta for "Pendente de autorização" */}
                        <img
                          src={loadingGif}
                          alt="Carregando"
                          width={'28px'}
                          className={`${coleta.status_coleta === "Pendente de autorização" ? "block" : "hidden"}`}
                        />
                      </div>

                      <div className="text-sm text-gray-500 flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          {coleta.status_coleta === "Pendente de autorização"
                            ? "Aguardando confirmação de coleta"
                            : coleta.status_coleta === "Autorizada" || coleta.status_coleta === "Coletada"
                            ? "Coleta aprovada! roteirizando..."
                            : "Coleta aprovada! roteirizando..."}
                        </div>

                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time>
                            {coleta.data_agendamento
                              ? new Date(coleta.data_agendamento).toLocaleDateString("pt-BR")
                              : "N/A"}{" "}
                            - 📅
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <div
                className="bg-[#24c200] xl:h-[2px] xl:w-[100px] xl:mt-[15px] xl:ml-[5px] h-[17px] w-[2px] mt-[-25px] ml-[14px]"
              >
              </div>

                {/* Etapa 2: Roteirizando coleta ou dados do motorista e placa */}
                {(
                  coleta.status_coleta === "Autorizada" ||
                  coleta.status_coleta === "Não coletada" ||
                  coleta.status_coleta === "Coletada") && (
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                        <span
                          className={`h-8 w-8 rounded-full ${
                            coleta.nome_motorista === "SEM MOTORISTA" && coleta.placa_veiculo === "SEM PLACA"
                              ? "bg-transparent"
                              : "bg-green-500"
                          } flex items-center justify-center ring-8 ring-white`}
                        >
                          <img
                            src={loadingGif}
                            alt=""
                            className={`${
                              coleta.nome_motorista === "SEM MOTORISTA" && coleta.placa_veiculo === "SEM PLACA"
                                ? "block"
                                : "hidden"
                            }`}
                          />
                          <svg
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {coleta.nome_motorista !== "SEM MOTORISTA" &&
                              coleta.placa_veiculo !== "SEM PLACA"
                                ? `Motorista: ${coleta.nome_motorista} | Placa: ${coleta.placa_veiculo}`
                                : "Roteirizando coleta"}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={coleta.data_hora_inclusao}>
                            {coleta.data_agendamento ? new Date(coleta.data_agendamento).toLocaleDateString("pt-BR"): "N/A"} - 

                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              <div
                className="bg-[#24c200] xl:h-[2px] xl:w-[100px] xl:mt-[15px] xl:ml-[5px] h-[17px] w-[2px] mt-[-25px]  ml-[14px]"
              >
              </div>
   {/* Etapa 3: Coleta realizada, não realizada ou veículo em rota de coleta */}
   {coleta.status_coleta === "Coletada" ? (
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <svg
                              className="h-5 w-5 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">Coleta realizada com sucesso</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={coleta.data_coleta}>
                              {coleta.data_coleta ? new Date(coleta.data_coleta).toLocaleDateString("pt-BR") : "N/A"} - {coleta.hora_coleta || "N/A"}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : coleta.status_coleta === "Não coletada" ? (
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                            <svg
                              className="h-5 w-5 text-white"
                              viewBox="0 0 18 18"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                            <path  d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>

                            </svg>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">Coleta não realizada! - 
                            <time dateTime={coleta.data_coleta}>
                              {coleta.data_coleta ? new Date(coleta.data_coleta).toLocaleDateString("pt-BR") : "N/A"}  
                            </time>
                            </p>
                         
                          <a className="text-blue-600 flex items-center" href="">Suporte Online
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ml-1  bi bi-whatsapp" viewBox="0 0 16 16">
                                <path  d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                              </svg>
                             </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : coleta.nome_motorista && coleta.nome_motorista !== "SEM MOTORISTA" && coleta.placa_veiculo && coleta.placa_veiculo !== "SEM PLACA" ? (
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center ring-8 ring-white">
                            <img src={loadingGif} alt="Carregando..." />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">Veículo em rota de coleta</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={coleta.data_hora_inclusao}>
                              {coleta.data_hora_inclusao || "N/A"}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
          </Card>
        ))
      ) : (
        <div>Não há coletas registradas para este cliente.</div>
      )}
    </div>
  );
}
