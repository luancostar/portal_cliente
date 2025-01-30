import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
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

export default function ColetasTable() {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idCliente, setIdCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o texto de pesquisa
  

  useEffect(() => {
    const clienteId = localStorage.getItem("idCliente");
    if (clienteId) {
      setIdCliente(clienteId);
    }
  }, []);

  useEffect(() => {
    if (!idCliente) return;

    setLoading(true);
    fetch(`${API_URL}/coletas/getColetasCliente.php?id_cliente=${idCliente}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setColetas(data.data);
        }
      })
      .catch((error) => console.error("Erro ao buscar dados:", error))
      .finally(() => setLoading(false));
  }, [idCliente]);


  const exportToExcel = () => {
    // Defina os dados da tabela
    const data = filteredColetas.map((coleta) => ({
      "Data Solicitação": new Date(coleta.data_solicitacao).toLocaleDateString("pt-BR"),
      "Hora Solicitação": coleta.hora_solicitacao,
      "Status": coleta.status_coleta,
      "Data Coleta": new Date(coleta.data_coleta).toLocaleDateString("pt-BR"),
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


  const filteredColetas = coletas.filter((coleta) => {
    return (
      (coleta.data_solicitacao && coleta.data_solicitacao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coleta.hora_solicitacao && coleta.hora_solicitacao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coleta.status_coleta && coleta.status_coleta.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coleta.data_coleta && coleta.data_coleta.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coleta.hora_coleta && coleta.hora_coleta.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coleta.solicitante_coleta && coleta.solicitante_coleta.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coleta.nome_motorista && coleta.nome_motorista.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coleta.placa_veiculo && coleta.placa_veiculo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });


  return (
    <div className="p-4 w-full">
        <div className="flex justify-between">
   <button
        onClick={exportToExcel}
        className="p-2 bg-transparent flex text-green-500 font-bold text-sm rounded mb-4 border-[1px] border-green-500"
        >
        <img width={'30px'} className="mr-2" src="../src/assets/excel.png" alt="" />
        Download
      </button>
        <Link to="/home" className="flex flex-col items-end group">
            <h2><i  style={{color: "rgb(13,171,97"}} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i></h2>
        </Link>
        </div>
          
    <Card  className="mt-2 p-0 shadow-none w-full">
      <CardHeader   floated={false} shadow={false} className="rounded-none">
        <div  className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div >
 
            <Typography    variant="h5" color="blue-gray">
              Histórico de Coletas
            </Typography>
            <Typography  color="gray" className="mt-1 font-normal">
              Últimas coletas solicitadas:
            </Typography>
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
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Data Solicitação
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Hora Solicitação
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Status
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Data Coleta
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Hora Coleta
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Solicitante
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Volumes
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Peso/KG
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Motorista
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Placa
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center p-4">Carregando...</td>
                </tr>
              ) : (
                filteredColetas.map((coleta, index) => {
                  const isLast = index === filteredColetas.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={index}>
                        <td className={classes}>
                        {isNaN(new Date(coleta.data_solicitacao)) ? "Aguardando..." : new Date(coleta.data_solicitacao).toLocaleDateString("pt-BR")}
                        </td>
                      <td className={classes}>{coleta.hora_solicitacao}</td>
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
                      <td className={classes}>
                        {isNaN(new Date(coleta.data_coleta)) ? "Aguardando..." : new Date(coleta.data_coleta).toLocaleDateString("pt-BR")}
                        </td>
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
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
      <Button variant="outlined" className="bg-green-500 text-white border-none" size="sm">
      Anterior
        </Button>
        <Button variant="outlined" className="bg-green-500 text-white border-none" size="sm">
          Próxima
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
}
