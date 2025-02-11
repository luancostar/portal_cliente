// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import excelPng from "../../assets/excel.png";
import { API_URL } from "../../../config";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Input,
} from "@material-tailwind/react";

export default function EntregasTable() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idCliente, setIdCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const clienteId = localStorage.getItem("idCliente");
    if (clienteId) {
      setIdCliente(clienteId);
    }
  }, []);

  useEffect(() => {
    if (!idCliente) return;
  
    setLoading(true);
    fetch(`${API_URL}/entregas/listarEntregas.php?id_cliente=${idCliente}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && data.data.entregas) {
          setEntregas(data.data.entregas.reverse()); // Corrigido para acessar "entregas"
        }
      })
      .catch((error) => console.error("Erro ao buscar dados:", error))
      .finally(() => setLoading(false));
  }, [idCliente]);

  const filteredEntregas = entregas.filter((entrega) =>
    Object.values(entrega).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredEntregas.length / itemsPerPage);
  const currentItems = filteredEntregas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "EM ABERTO":
        return "blue";
      case "ENTREGUE":
        return "green";
      default:
        return "orange";
    }
  };
  

  const exportToExcel = () => {
    // Defina os dados da tabela com base nas entregas
    const data = filteredEntregas.map((entrega) => ({
      "CTE": entrega.cte,
      "Emissão": new Date(entrega.emissao_cte).toLocaleDateString("pt-BR"),
      "CPF/CNPJ Cliente": entrega.cpf_cnpj_cliente,
      "Condição Pgto": entrega.condicao_pgto,
      "Status": entrega.status_entrega,
      "Tipo Frete": entrega.cif_fob,
      "Valor Total (R$)": parseFloat(entrega.vlr_total_cte).toFixed(2),
      "MAF": entrega.maf,
      "Data MAF": new Date(entrega.data_maf).toLocaleDateString("pt-BR"),
      "Prev. Entrega": new Date(entrega.prev_entrega).toLocaleDateString("pt-BR"),
      "Peso Taxado (KG)": entrega.peso_taxado,
      "Qtd Volumes": entrega.qtd_volumes,
      "Origem": entrega.origem_cidade,
      "Destino": entrega.destinatario_cidade,
      "Destinatário": entrega.destinatario,
      "Valor NF (R$)": parseFloat(entrega.vlr_nota_fiscal).toFixed(2),
      "Número NF": entrega.num_nota_fiscal,
    }));
  
    // Criação da planilha
    const ws = XLSX.utils.json_to_sheet(data);
  
    // Criação do arquivo Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Entregas");
  
    // Download do arquivo
    XLSX.writeFile(wb, "entregas.xlsx");
  };
  

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between">
      <button
        onClick={exportToExcel}
        className="p-2 bg-transparent flex text-green-500 font-bold text-sm rounded mb-4 border-[1px] border-green-500"
        >
        <img width={'30px'} className="mr-2" src={excelPng} alt="" />
        Download
      </button>
        <Link to="/home" className="flex flex-col items-end group">
          <h2>
            <i style={{ color: "rgb(13,171,97)" }} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i>
          </h2>
        </Link>
      </div>
      
      <Card className="mt-2 p-0 shadow-none w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Histórico de Entregas
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Últimas entregas realizadas:
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Filtrar na Tabela"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {[
                  "CTE",
                  "Emissão",
                  "Status",
                  "CPF/CNPJ Cliente",
                  "Condição Pgto",
                  "Tipo Frete",
                  "Valor Total",
                  "MAF",
                  "Data MAF",
                  "Prev. Entrega",
                  "Peso Taxado",
                  "Qtd Volumes",
                  "Origem",
                  "Destino",
                  "Destinatário",
                  "Valor NF",
                  "Número NF",
                ].map((header) => (
                  <th key={header} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="16" className="text-center p-4">Carregando...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan="16" className="text-center p-4">Nenhuma entrega encontrada.</td></tr>
              ) : (
                currentItems.map((entrega, index) => (
                  <tr key={index}>
                    <td className="p-4">{entrega.cte}</td>
                    <td className="p-4">{new Date(entrega.emissao_cte).toLocaleDateString("pt-BR")}</td>
                    <td className="p-4">
                      <Chip 
                        value={entrega.status_entrega} 
                        color={getStatusColor(entrega.status_entrega)} 
                        className=" "
                        variant="ghost"
                        size="sm"
                      />
                    </td>
                    <td className="p-4">{entrega.cpf_cnpj_cliente}</td>
                    <td className="p-4">{entrega.condicao_pgto}</td>
                    <td className="p-4">{entrega.cif_fob}</td>
                    <td className="p-4">R$ {parseFloat(entrega.vlr_total_cte).toFixed(2)}</td>
                    <td className="p-4">{entrega.maf}</td>
                    <td className="p-4">{new Date(entrega.data_maf).toLocaleDateString("pt-BR")}</td>
                    <td className="p-4">{new Date(entrega.prev_entrega).toLocaleDateString("pt-BR")}</td>
                    <td className="p-4 text-center">{entrega.peso_taxado} KG</td>
                    <td className="p-4 text-center">{entrega.qtd_volumes}</td>
                    <td className="p-4">{entrega.origem_cidade}</td>
                    <td className="p-4">{entrega.destinatario_cidade}</td>
                    <td className="p-4">{entrega.destinatario}</td>
                    <td className="p-4">R$ {parseFloat(entrega.vlr_nota_fiscal).toFixed(2)}</td>
                    <td className="p-4">{entrega.num_nota_fiscal}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter>
          <div className="flex justify-between gap-2">
            <Button className="bg-green-500" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Anterior</Button>
            <span className="text-xs">Página {currentPage} de {totalPages}</span>
            <Button className="bg-green-500" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
