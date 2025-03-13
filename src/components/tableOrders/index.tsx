// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { API_URL } from "../../../config";
import excelPng from "../../assets/excel.png";
import pdfPng from "../../assets/pdf.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import touchGif from "../../assets/touch.gif"

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

export default function ColetasTable() {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idCliente, setIdCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    fetch(`${API_URL}/coletas/getColetasCliente.php?id_cliente=${idCliente}&data_inicial=2025-01-01&data_final=2099-12-31`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setColetas(data.data.reverse()); // Inverte a ordem dos itens
        }
      })
      .catch((error) => console.error("Erro ao buscar dados:", error))
      .finally(() => setLoading(false));
  }, [idCliente]);
  
  const ajustarData = (data) => {
    if (!data) return "Aguardando...";
  
    const partes = data.split("-"); // Supondo que a data venha no formato YYYY-MM-DD
    if (partes.length !== 3) return "Data inválida";
  
    const dataCorrigida = new Date(
      Number(partes[0]), // Ano
      Number(partes[1]) - 1, // Mês (ajustando, pois no JS os meses vão de 0 a 11)
      Number(partes[2]) // Dia
    );
  
    return dataCorrigida.toLocaleDateString("pt-BR");
  };
  

  const filteredColetas = coletas.filter((coleta) => {
    const agendamentoDate = new Date(coleta.data_agendamento);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || agendamentoDate >= start) &&
      (!end || agendamentoDate <= end) &&
      Object.values(coleta).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const totalPages = Math.ceil(filteredColetas.length / itemsPerPage);
  const currentItems = filteredColetas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    // Defina os dados da tabela
    const data = filteredColetas.map((coleta) => ({
      "Data Solicitação": ajustarData(coleta.data_solicitacao),
      "Data Agendamento": ajustarData(coleta.data_agendamento),
      "Hora Solicitação": coleta.hora_solicitacao,
      "Status": coleta.status_coleta,
      "Data Coleta": ajustarData(coleta.data_coleta),
      "Hora Coleta": coleta.hora_coleta,
      "Solicitante": coleta.solicitante_coleta,
      "Volume": coleta.volume_solicitado,
      "Peso": coleta.peso,
      "Motorista": coleta.nome_motorista,
      "Placa": coleta.placa_veiculo,
    }));
    

    // Crie uma planilha a partir dos dados
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Crie um novo arquivo de Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Coletas");

    // Exporte o arquivo para o usuário
    XLSX.writeFile(wb, "coletas.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Título do documento
    doc.text("Histórico de Coletas", 14, 10);
  
    // Definir as colunas e dados da tabela
    const columns = [
      "Data Solicitação",
      "Data Agendamento",
      "Hora Solicitação",
      "Status",
      "Data Coleta",
      "Hora Coleta",
      "Solicitante",
      "Volumes",
      "Peso/KG",
      "Motorista",
      "Placa",
    ];
    const rows = filteredColetas.map((coleta) => [
      ajustarData(coleta.data_solicitacao),
      ajustarData(coleta.data_agendamento),
      coleta.hora_solicitacao,
      coleta.status_coleta,
      ajustarData(coleta.data_coleta),
      coleta.hora_coleta,
      coleta.solicitante_coleta,
      coleta.volume_solicitado,
      coleta.peso,
      coleta.nome_motorista,
      coleta.placa_veiculo,
    ]);
    
  
    // Gerar tabela no PDF
      autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20, // Posição inicial abaixo do título
    });
  
    // Salvar o arquivo PDF
    doc.save("coletas.pdf");
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
            <h2><i  style={{color: "rgb(13,171,97"}} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i></h2>
        </Link>
        </div>
          
    <Card  className="mt-2 p-0 shadow-none w-full">
      <CardHeader   floated={false} shadow={false} className="rounded-none">
        <div  className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div >
 
            <Typography variant="h5" color="blue-gray">
              Histórico de Coletas
            </Typography>
            <Typography  color="gray" className="mt-1 font-normal">
             Procure por período de agendamento ou filtre por palavra chave
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
                  onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado do filtro
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
                  "Data Solicitação",
                  "Data Agendamento",
                  "Hora Solicitação",
                  "Status",
                  "Data Coleta",
                  "Hora Coleta",
                  "Solicitante",
                  "Volumes",
                  "Peso/KG",
                  "Motorista",
                  "Placa",
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
                <tr>
                  <td colSpan="10" className="text-center p-4">Carregando...</td>
                </tr>
              ) : (
                
                currentItems.map((coleta, index) => {

                  const isLast = index === filteredColetas.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={index}>
                        <td className={classes}>
                    
                        {isNaN(new Date(coleta.data_solicitacao)) ? "Aguardando..." : new Date(coleta.data_solicitacao + "T00:00:00Z").toLocaleDateString("pt-BR")}
                        </td>
                        <td className={classes}>{ajustarData(coleta.data_agendamento)}</td>
                        <td className={classes}>{ajustarData(coleta.data_solicitacao)}</td>
                      <td className={classes}>
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={coleta.status_coleta}
                          color={
                            coleta.status_coleta.toLowerCase() === "coletada"
                              ? "green"
                              : coleta.status_coleta.toLowerCase() === "em aberto"
                              ? "amber"
                              : coleta.status_coleta.toLowerCase() === "autorizada"
                              ? "blue"
                              : coleta.status_coleta.toLowerCase() === "pendente de autorização"
                              ? "gray"
                              : "red" // Para qualquer outro status não especificado
                          }
                        />
                      </td>
                      {isNaN(new Date(coleta.data_coleta)) ? "Aguardando..." : new Date(coleta.data_coleta + "T00:00:00Z").toLocaleDateString("pt-BR")}
                      <td className={classes}>{coleta.hora_coleta}</td>
                      <td className={classes}>{coleta.solicitante_coleta}</td>
                      <td className={classes} style={{ textAlign: "center" }}>{coleta.volume_solicitado}</td>
                      <td className={classes} style={{ textAlign: "center" }}>{coleta.peso} KG</td>
                      <td className={classes}>{coleta.nome_motorista}</td>
                      <td className={classes}>{coleta.placa_veiculo}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
        </table>
      </CardBody>
      <CardFooter>
          <div className="flex justify-between gap-2">
            <Button className="bg-green-500" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Anterior
            </Button>
            <span className="text-xs">
              Página {currentPage} de {totalPages}
            </span>
            <Button  className="bg-green-500" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Próxima
            </Button>
          </div>
        </CardFooter>
    </Card>
    <div className="fixed bottom-[120px] right-[-30px] z-[1] w-[180px] h-[59px]">
    <img className="invert xl:hidden" src={touchGif} alt="Carregando..." />
    </div>
    </div>
  );
}
