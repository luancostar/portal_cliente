// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import excelPng from "../../assets/excel.png";
import pdfPng from "../../assets/pdf.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import touchGif from "../../assets/touch.gif"
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          const entregasOrdenadas = data.data.entregas.sort((a, b) => {
            // Prioriza entregas com status "EM ABERTO"
            if (a.status_entrega === "EM ABERTO" && b.status_entrega !== "EM ABERTO") {
              return -1;
            }
            if (a.status_entrega !== "EM ABERTO" && b.status_entrega === "EM ABERTO") {
              return 1;
            }
  
            // Se ambos forem "ENTREGUE", ordena pela baixa_entrega mais recente
            if (a.status_entrega === "ENTREGUE" && b.status_entrega === "ENTREGUE") {
              const dataA = a.baixa_entrega ? new Date(a.baixa_entrega).getTime() : 0;
              const dataB = b.baixa_entrega ? new Date(b.baixa_entrega).getTime() : 0;
              return dataB - dataA;
            }
          
            // Para os demais casos, mantém a ordenação original
            return 0;
          });
          
  
          setEntregas(entregasOrdenadas);
        }
      })
      .catch((error) => console.error("Erro ao buscar dados:", error))
      .finally(() => setLoading(false));
  }, [idCliente]);
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Histórico de Entregas", 14, 10);
    
    const tableData = entregas.map(entrega => [
      entrega.cte,
      new Date(entrega.emissao_cte).toLocaleDateString("pt-BR"),
      entrega.status_entrega,
      entrega.cpf_cnpj_cliente,
      new Date(entrega.baixa_entrega).toLocaleDateString("pt-BR"),
      entrega.condicao_pgto,
      entrega.cif_fob,
      parseFloat(entrega.vlr_total_cte).toFixed(2),
    ]);
    
    autoTable(doc, {
      head: [["CTE", "Emissão", "Status", "CPF/CNPJ Cliente", "Data Entrega", "Condição Pgto", "Tipo Frete", "Valor Total (R$)"]],
      body: tableData,
    });
    
    doc.save("entregas.pdf");
  };
  
  const filteredEntregas = entregas.filter((entrega) => {
    const entregaDate = new Date(entrega.baixa_entrega);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || entregaDate >= start) &&
      (!end || entregaDate <= end) &&

    Object.values(entrega).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
    );
});

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
      "Data Entrega": new Date(entrega.baixa_entrega).toLocaleDateString("pt-BR"),
      "Condição Pgto": entrega.condicao_pgto,
      "Status": entrega.status_entrega,
      "Tipo Frete": entrega.cif_fob,
      "Valor Total (R$)": parseFloat(entrega.vlr_total_cte).toFixed(2),
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
      <div className="flex justify-between w-full">
      <div className="flex w-full">
      <button
        onClick={exportToExcel}
        className="p-2 bg-transparent items-center flex text-green-500 font-bold text-xs rounded mb-4 border-[1px] border-green-500"
        >
        <img width={'40px'} className="mr-2" src={excelPng} alt="" />
      BAIXAR XLSX
      </button>
      <button
          onClick={exportToPDF}
          className="p-2 ml-5 items-center bg-transparent flex text-red-500 font-bold text-xs rounded mb-4 border-[1px] border-red-500"
        >
          <img width={'25px'} className="mr-2" src={pdfPng} alt="" />
          BAIXAR PDF
        </button>
      </div>
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
              Procure por período de entrega ou filtre por palavra chave

              </Typography>
            </div>
            <div className="flex gap-2 justify-between">
            <div className="flex flex-col w-full">
              <label className="text-gray-700 font-medium">De</label>
              <input
                className="border-2 border-gray-300 p-1 rounded-md"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-gray-700 font-medium">Até</label>
              <input
                className="border-2 border-gray-300 p-1 rounded-md"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
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
                  "Data Entrega",
                  "Condição Pgto",
                  "Tipo Frete",
                  "Valor Total",
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
                    <td>
                      {entrega.baixa_entrega && !isNaN(new Date(entrega.baixa_entrega).getTime()) 
                        ? new Date(entrega.baixa_entrega).toLocaleDateString("pt-BR") 
                        : "AGUARDANDO..."}
                    </td>
                    <td className="p-4">{entrega.condicao_pgto}</td>
                    <td className="p-4">{entrega.cif_fob}</td>
                    <td className="p-4">R$ {parseFloat(entrega.vlr_total_cte).toFixed(2)}</td>
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
      <div className="fixed bottom-[120px] right-[-30px] z-[1] w-[180px] h-[59px]">
    < img className="invert xl:hidden" src={touchGif} alt="Carregando..." />
    </div>
    </div>
  );
}
