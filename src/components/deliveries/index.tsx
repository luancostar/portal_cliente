// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import { API_URL } from "../../../config";
import loadingGif from "../../assets/loading.gif";
import { Link } from "react-router-dom";

export default function DeliveriesTable({ idCliente }) {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idCliente) {
      const controller = new AbortController();
      const signal = controller.signal;

      // ✅ Data fixa conforme solicitado
      const dataInicial = "2025-01-01";
      const dataFinal = "2025-12-31";

      const url = `${API_URL}/entregas/listarEntregas.php?id_cliente=${idCliente}&data_inicial=${dataInicial}&data_final=${dataFinal}`;

      setLoading(true);

      fetch(url, { signal })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados da API");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success" && Array.isArray(data.data.entregas)) {
            const entregas = data.data.entregas;
            const entregasAbertas = entregas.filter(
              (entrega) => entrega.status_entrega !== "ENTREGUE"
            );
          
            if (entregasAbertas.length > 0) {
              setColetas(entregasAbertas);
            } else {
              // Ordena pela data do CTE (mais recente primeiro)
              const entregasOrdenadas = [...entregas].sort((a, b) => {
                const dataA = new Date(a.emissao_cte);
                const dataB = new Date(b.emissao_cte);
                return dataB - dataA;
              });
          
              const ultimasTres = entregasOrdenadas.slice(0, 3);
              setColetas(ultimasTres);
            }
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
    return <div className="text-red-500 mt-2 text-sm">⚠️ Dados não carregados, tente novamente. {error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl text-gray-500 font-bold mb-4">🚚 Acompanhe suas Entregas:</h2>
      {coletas.map((entrega, index) => (
        <Card className="mt-4 text-xs p-4" key={index}>
          <p><strong>CTE:</strong> {entrega.cte}</p>
          <p><strong>Postado em:</strong> {entrega.emissao_cte ? new Date(entrega.emissao_cte).toLocaleDateString("pt-BR") : "Não informado"}</p>
          <p><strong>Destinatário:</strong> {entrega.destinatario} - {entrega.destinatario_cidade}</p>
          <p><strong>Previsão de Entrega:</strong> {entrega.prev_entrega_real ? new Date(entrega.prev_entrega_real).toLocaleDateString("pt-BR") : "Não informado"}</p>

          <ul className="md:flex md:justify-between mt-4 list-disc">
            {entrega.emissao_cte && (
              <li className="flex items-center text-gray-500">
                <span className="rounded-2xl bg-green-500">
                  <svg style={{ borderRadius: '20px', width: '30px', height: '30px', padding: '4px' }} className="h-5 w-5 text-white bg-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2">POSTADO EM {new Date(entrega.emissao_cte).toLocaleDateString("pt-BR")}</p>
              </li>
            )}

            <div className="bg-[#24c200] xl:h-[2px] xl:w-[100px] xl:mt-[15px] xl:ml-[5px] h-[17px] w-[2px] mt-[5px] sm:mt-[-25px] ml-[14px]"></div>

            {entrega.data_maf ? (
              <li className="mt-2 text-gray-500 flex">
                <span className="rounded-2xl bg-green-500">
                  <svg style={{ borderRadius: '20px', width: '30px', height: '30px', padding: '4px' }} className="h-5 w-5 text-white bg-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="text-xs ml-2">EM TRÂNSITO PARA {entrega.destinatario_cidade}</p>
              </li>
            ) : (
              <li className="mt-2 text-gray-500 flex">
                <span className="rounded-2xl bg-green-500">
                  <img src={loadingGif} alt="Carregando" width={'28px'} />
                </span>
                <p className="text-xs ml-2">EM TRÂNSITO PARA {entrega.destinatario_cidade}</p>
              </li>
            )}

            <div className="bg-[#24c200] xl:h-[2px] xl:w-[100px] xl:mt-[15px] xl:ml-[5px] h-[17px] w-[2px] mt-[5px] sm:mt-[-25px] ml-[14px]"></div>

            <li className="text-gray-500 flex mt-2">
              <span className="rounded-2xl bg-transparent">
                <img src={loadingGif} alt="Carregando" width={'28px'} />
              </span>
              <p className="ml-2">AGUARDANDO ENTREGA</p>
            </li>
          </ul>
        </Card>
      ))}

      <Link to="/mydeliveries">
        <button type="button" className="text-md font-bold text-green-500 w-full mt-4 hover:text-white border border-green-500 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
          📦 Ver Mais
        </button>
      </Link>
    </div>
  );
}
