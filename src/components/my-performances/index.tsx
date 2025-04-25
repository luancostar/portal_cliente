// eslint-disable-next-line @typescript-eslint/ban-ts-comment 
// @ts-nocheck

import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card, Button } from "@material-tailwind/react";
import { API_URL } from "../../../config";
import Chart from "react-apexcharts";
import bgPerformance from "../../assets/bgperformance.png"
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
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
  
    // Obtém o primeiro e último dia do mês atual
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  
    const [dataInicial, setDataInicial] = useState(firstDay);
    const [dataFinal, setDataFinal] = useState(lastDay);
    const [filterData, setFilterData] = useState({ dataInicial: firstDay, dataFinal: lastDay });
  
  
      const fetchData = async (dataIni: string, dataFim: string) => {
        if (!idCliente) return;
    
        setLoading(true);
        try {
          const response = await axios.get(
            `${API_URL}/coletas/performanceColetas.php?id_cliente=${idCliente}&data_inicial=${dataIni}&data_final=${dataFim}`
          );
          setData(response.data?.data || null);
        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
        } finally {
          setLoading(false);
        }
      };

       // Buscar dados automaticamente ao montar o componente (mês vigente)
  useEffect(() => {
    fetchData(firstDay, lastDay);
  }, [idCliente]);

  // Buscar dados apenas quando o usuário clicar no botão Filtrar
  useEffect(() => {
    if (submitted) {
      fetchData(filterData.dataInicial, filterData.dataFinal);
    }
  }, [submitted, filterData]);
  
    if (loading) {
      return <Typography className="w-full flex justify-center">
        <img style={{ width: '80px', marginTop: '100px' }} src={loadingGif} alt="" />
      </Typography>;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const donutData = [performanceValue, 100 - performanceValue];

  return (
    <section className="px-2 mt-2 w-full mx-auto">
      <section className="px-2 mt-2 w-full mx-auto">
      <form
        className="grid sm:flex gap-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          setFilterData({ dataInicial, dataFinal });
          setSubmitted(true);
        }}
      >
        <div className="flex justify-center"> 

        <input
          type="date"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
          className="border p-2 rounded"
        />
        </div>
        <Button className="w-full sm:w-auto" type="submit" color="green">
          Filtrar
        </Button>
      </form>

      {loading ? (
        <Typography className="w-full flex justify-center">
          <img style={{ width: "80px", marginTop: "100px" }} src={loadingGif} alt="Carregando" />
        </Typography>
      ) : data ? (
        <div>
          {/* Renderizar os cards e gráficos aqui */}
          <Typography className="text-green-700"> </Typography>
        </div>
      ) : (
        <Typography className="text-red-500">Erro ao carregar os dados.</Typography>
      )}
    </section>
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
  {/* Gráfico de Performance - Semi Circle Gauge */}
{performanceColetas && (
  <div className="flex justify-center mt-10">
    <Card className="p-6 w-full">
      <Typography variant="h5" className="text-center font-bold text-gray-700">
        Eficiência de Coletas:
      </Typography>
      <Chart
        className="flex justify-center"
        options={{
          chart: { type: "radialBar" },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#cccccc",
                strokeWidth: "97%",
              },
              dataLabels: {
                name: { show: false },
                value: {
                  fontSize: "30px",
                  fontWeight: "bold",
                  offsetY: 10,
                  color: "#0dab61",
                  formatter: (val) => `${parseFloat(val).toFixed(2)}%`,
                },
              },
            },
          },
          colors: ["#0dab61"],
          stroke: { lineCap: "round" },
          labels: ["Performance"],
        }}
        series={[performanceValue]}
        type="radialBar"
        width="350px"
      />
    </Card>
  </div>

      )}
    </section>
  );
}

export default StatsSection;
