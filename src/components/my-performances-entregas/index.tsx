// eslint-disable-next-line @typescript-eslint/ban-ts-comment 
// @ts-nocheck

import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import bgPerformance from "../../assets/bgperformance.png";
import { API_URL } from "../../../config";
import loadingGif from "../../assets/loading.gif";

 
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
        {bgImage && (
          <div className="absolute bottom-0 left-0 w-full flex justify-end">
            <img src={bgImage} alt="" className="w-32 mr-4 opacity-90" />
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
  
export function StatsSectionEntregas({ idCliente }: { idCliente?: string }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idCliente) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/entregas/performanceEntregas.php?id_cliente=${idCliente}`
        );
        setData(response.data?.data?.entregas || null);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idCliente]);

  if (loading) {
    return <Typography className="w-full flex justify-center">
    <img
    style={{width:'80px', marginTop:'100px'}}
    
    src={loadingGif} alt="" />
    </Typography>;
  }

  if (!data) {
    return <Typography className="text-red-500">Erro ao carregar os dados.</Typography>;
  }

  const fieldsToShow = {
    total_entregas: "TOTAL DE ENTREGAS",
    entregas_em_aberto: "ENTREGAS EM ABERTO",
    entregas_efetuadas: "ENTREGAS EFETUADAS",
    entregas_em_aberto_fora_prazo: "EM ABERTO FORA DO PRAZO",
    entregas_em_aberto_no_prazo: "EM ABERTO NO PRAZO",
    entregas_efetuadas_fora_prazo: "EFETUADAS FORA DO PRAZO",
    entregas_efetuadas_no_prazo: "EFETUADAS NO PRAZO",
  };

  const stats = Object.entries(fieldsToShow)
    .filter(([key]) => data[key] !== undefined)
    .map(([key, title]) => ({
      count: data[key]?.toString() || "0",
      title,
      description: `Valor correspondente a ${title.toLowerCase()}.`,
    }));

  const totalEntregas = stats.find((stat) => stat.title === "TOTAL DE ENTREGAS");
  const middleStats = stats.filter((stat) =>
    ["ENTREGAS EM ABERTO", "ENTREGAS EFETUADAS", "EM ABERTO FORA DO PRAZO"].includes(stat.title)
  );
  const performanceValue = ((data.entregas_efetuadas / data.total_entregas) * 100) || 0;
  const donutData = [performanceValue, 100 - performanceValue];

  return (
    <section className="px-2 mt-2 w-full mx-auto">
 
      {totalEntregas && (
        <div className="grid grid-cols-1 gap-6">
          <StatsCard {...totalEntregas} fullWidth bgImage={bgPerformance} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {middleStats.map((props, index) => (
          <StatsCard key={index} {...props} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Card className="p-6 w-full">
          <Typography variant="h5" className="text-center font-bold text-gray-700">
            Eficiência de Entregas:
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
    </section>
  );
}

export default StatsSectionEntregas;
