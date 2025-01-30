import { PencilIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";

export default function ColetasTable() {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idCliente, setIdCliente] = useState(null);

  useEffect(() => {
    const clienteId = localStorage.getItem("idCliente");
    if (clienteId) {
      setIdCliente(clienteId);
    }
  }, []);

  useEffect(() => {
    if (!idCliente) return;

    setLoading(true);
    fetch(`http://localhost/roteirizador/functions/portal_cliente/coletas/getColetasCliente.php?id_cliente=${idCliente}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setColetas(data.data);
        }
      })
      .catch((error) => console.error("Erro ao buscar dados:", error))
      .finally(() => setLoading(false));
  }, [idCliente]);

  return (
    <div className="p-4 w-full">

        <Link to="/home" className="flex flex-col items-end group">
            <h2><i  style={{color: "rgb(13,171,97"}} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i></h2>
        </Link>
          
    <Card className="mt-2 shadow-none w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Histórico de Coletas
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Últimas coletas solicitadas:
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Filtrar na Tabela"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
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
                  Volume
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Peso
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
                <td colSpan="8" className="text-center p-4">
                  Carregando...
                </td>
              </tr>
            ) : (
              coletas.map((coleta, index) => {
                const isLast = index === coletas.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>{coleta.data_solicitacao}</td>
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
                            : "red"
                        }
                    />
                    </td>

                    <td className={classes}>{coleta.data_coleta}</td>
                    <td className={classes}>{coleta.hora_coleta}</td>
                    <td className={classes}>{coleta.solicitante_coleta}</td>
                    <td className={classes} style={{ textAlign: "center" }}>
                      {coleta.volume_solicitado}
                    </td>
                    <td className={classes} style={{ textAlign: "center" }}>
                      {coleta.peso}
                    </td>
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
