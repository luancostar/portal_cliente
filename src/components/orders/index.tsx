import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";

export function OrdersTable({ idCliente }) {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idCliente) {
      const controller = new AbortController();
      const signal = controller.signal;

      const url = `http://localhost/roteirizador/functions/portal_cliente/coletas/getColetasCliente.php?id_cliente=${idCliente}`;

      setLoading(true);

      fetch(url, { signal })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados da API");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            setColetas(data.data);
          } else {
            setError(data.message);
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
            <div className="p-4 flow-root">
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
          src="../src/assets/loading.gif.gif"
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
            : "Aguardando confirmação de coleta"}
        </div>

        <div className="whitespace-nowrap text-right text-sm text-gray-500">
          <time>
            {coleta.data_solicitacao
              ? new Date(coleta.data_solicitacao).toLocaleDateString("pt-BR")
              : "N/A"}{" "}
            - {coleta.hora_solicitacao}
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
                            src="../src/assets/loading.gif.gif"
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
                className="bg-[#24c200] xl:h-[2px] xl:w-[100px] xl:mt-[15px] xl:ml-[5px] h-[17px] w-[2px] mt-[-25px] ml-[14px]"
              >
              </div>

                {/* Etapa 3: Veículo em rota de coleta ou Coleta realizada com sucesso */}
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
                            <p className="text-sm text-gray-500">
                              Coleta realizada com sucesso
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={coleta.data_coleta}>
                            {coleta.data_coleta ? new Date(coleta.data_coleta).toLocaleDateString("pt-BR"): "N/A"} - 
                              {coleta.hora_coleta || "N/A"}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  // Caso o status seja "Autorizada" e tenha motorista/placa, continua com "Veículo em rota de coleta"
                  (coleta.nome_motorista && coleta.nome_motorista !== "SEM MOTORISTA" &&
                    coleta.placa_veiculo && coleta.placa_veiculo !== "SEM PLACA") && (
                     <li>
                       <div className="relative pb-8">
                         <div className="relative flex space-x-3">
                           <div>
                             <span className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center ring-8 ring-white">
                        <img src="../src/assets/loading.gif.gif" alt="" />

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
                                 Veículo em rota de coleta
                                </p>
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
                  )
                )}
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
