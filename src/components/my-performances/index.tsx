// eslint-disable-next-line @typescript-eslint/ban-ts-comment 
// @ts-nocheck

import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card } from "@material-tailwind/react";
import { API_URL } from "../../../config";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import bgPerformance from "../../assets/bgperformance.png"

interface StatsCardPropsType {
  count: string;
  title: string;
  description: string;
  fullWidth?: boolean;
  bgImage?: string;
}

function StatsCard({ count, title, description, fullWidth = false, bgImage, isFirst = false }: StatsCardPropsType) {
    return (
      <Card 
        shadow={false} 
        style={{ backgroundImage: isFirst ? "none" : "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50))" }} 
        className={`relative p-6 rounded-lg overflow-hidden ${fullWidth ? "col-span-1 lg:col-span-3 w-full" : ""} 
        ${isFirst ? "bg-white text-green-700" : "text-white"}`}
      >
        {/* Imagem de fundo no final do card */}
        {bgImage && (
          <div className="absolute bottom-0 left-0 w-full flex justify-end">
            <img 
              src={bgImage} 
              alt="" 
              className="w-32 mr-4 opacity-90"
            />
          </div>
        )}
  
        <div className="relative z-10">
          <Typography variant="gradient" className={`text-4xl font-bold ${isFirst ? "text-green-700" : "text-white"}`}>
            {count}
          </Typography>
          <hr className={`mt-2 mb-4 max-w-xs ${isFirst ? "border-green-700" : "border-white"}`} />
          <Typography variant="h5" className={`mt-1 font-bold ${isFirst ? "text-green-700" : "text-white"}`}>
            {title}
          </Typography>
          <Typography className={`text-base max-w-xs font-normal leading-7 ${isFirst ? "text-green-700" : "text-white"}`}>
            {description}
          </Typography>
        </div>
      </Card>
    );
  }
  

export function StatsSection({ idCliente }: { idCliente?: string }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ID Cliente recebido:", idCliente);
    if (!idCliente) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/coletas/performanceColetas.php?id_cliente=${idCliente}`
        );
        console.log("Resposta da API:", response.data);
        setData(response.data?.data || null);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idCliente]);

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (!data) {
    return <Typography className="text-red-500">Erro ao carregar os dados.</Typography>;
  }

  const fieldsToShow = {
    total_coletas: "TOTAL DE COLETAS",
    coletas_em_aberto: "COLETAS EM ABERTO",
    coletas_efetuadas: "COLETAS EFETUADAS",
    coletas_nao_efetuadas: "COLETAS NÃO EFETUADAS",
    performance_coletas: "PERFORMANCE DE COLETAS",
  };

  const stats = Object.entries(fieldsToShow)
    .filter(([key]) => data[key] !== undefined)
    .map(([key, title]) => ({
      count: data[key]?.toString() || "0",
      title,
      description: `Valor correspondente a ${title.toLowerCase()}.`,
    }));

  const totalColetas = stats.find((stat) => stat.title === "TOTAL DE COLETAS");
  const middleStats = stats.filter(
    (stat) =>
      stat.title === "COLETAS EM ABERTO" ||
      stat.title === "COLETAS EFETUADAS" ||
      stat.title === "COLETAS NÃO EFETUADAS"
  );
  const performanceColetas = stats.find((stat) => stat.title === "PERFORMANCE DE COLETAS");

  const performanceValue = parseFloat(data.performance_coletas) || 0;
  const donutData = [performanceValue, 100 - performanceValue];

  return (
    <section className="px-2 w-full mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-gray-600 text-3xl px-2">Performance de Coletas</h1>
        <Link to="/home" className="flex flex-col items-end p-4">
          <h2>
            <i style={{ color: "rgb(13,171,97)" }} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i>
          </h2>
        </Link>
      </div>

      {/* Card Total de Coletas com a imagem de fundo */}
      {totalColetas && (
        <div className="grid grid-cols-1 gap-6">
          <StatsCard {...totalColetas} fullWidth bgImage={bgPerformance} />
        </div>
      )}

      {/* Cards do Meio */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {middleStats.map((props, index) => (
          <StatsCard key={index} {...props} />
        ))}
      </div>

      {/* Gráfico de Performance */}
      {performanceColetas && (
        <div className="flex justify-center mt-10">
          <Card className="p-6 w-full">
            <Typography variant="h5" className="text-center font-bold text-gray-700">
              Eficiência de Coletas:
            </Typography>
            <Chart
                className="flex justify-center"
              options={{
                chart: { type: "donut" },
                labels: ["Performance", "Restante"],
                colors: ["#0dab61", "#cccccc"],
                dataLabels: { enabled: true },
                legend: { show: false },
                plotOptions: {
                  pie: { donut: { size: "70%" } },
                },
              }}
              series={donutData}
              type="donut"
              width="350px"
            />
          </Card>
        </div>
      )}
    </section>
  );
}

export default StatsSection;
