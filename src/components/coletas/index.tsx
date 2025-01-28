import React, { useState, useEffect } from "react";

export function ColetasTable({ idCliente }) {
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

      // Abortar requisição se o componente desmontar
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
      <h2 className="text-lg font-bold mb-4">Tabela de Coletas</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Data Solicitação</th>
            <th className="border border-gray-300 p-2">Hora Solicitação</th>
            <th className="border border-gray-300 p-2">Data Agendamento</th>
            <th className="border border-gray-300 p-2">Solicitante</th>
            <th className="border border-gray-300 p-2">Volume</th>
            <th className="border border-gray-300 p-2">Peso</th>
            <th className="border border-gray-300 p-2">Qtd Notas</th>
            <th className="border border-gray-300 p-2">Observações</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">CPF/CNPJ Cliente</th>
            <th className="border border-gray-300 p-2">Razão Social</th>
            <th className="border border-gray-300 p-2">Nome Motorista</th>
            <th className="border border-gray-300 p-2">Placa Veículo</th>
          </tr>
        </thead>
        <tbody>
          {coletas.length > 0 ? (
            coletas.map((coleta, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {coleta.data_solicitacao || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.hora_solicitacao || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.data_agendamento || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.solicitante_coleta || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.volume_solicitado || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.peso || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.qtd_notas || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.obs || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.status_coleta || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.cpf_cnpj_cliente || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.razao_social || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.nome_motorista || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coleta.placa_veiculo || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="text-center p-4">
                Nenhuma coleta encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
