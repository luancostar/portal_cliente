import React, { useState, useEffect } from "react";
import { Card, CardBody, Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../../../config";

export function SearchHeaderCard({ idCliente }) {
  const [location, setLocation] = useState("Obtendo localização...");
  const [razaoSocial, setRazaoSocial] = useState("Carregando...");

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const city = data.address.city || data.address.town || "Desconhecida";
              const suburb = data.address.suburb || "Bairro não identificado";

              setLocation(`${suburb}, ${city}`);
            } catch (error) {
              setLocation("Erro ao obter localização");
            }
          },
          () => {
            setLocation("Localização não disponível");
          }
        );
      } else {
        setLocation("Geolocalização não suportada pelo dispositivo");
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (idCliente) {
      const fetchRazaoSocial = async () => {
        try {
          const response = await fetch(
            `${API_URL}/coletas/getColetasCliente.php?id_cliente=${idCliente}`
          );
          const data = await response.json();
          if (data.status === "success" && data.data.length > 0) {
            setRazaoSocial(data.data[0].razao_social || "Não identificado");
          } else {
            setRazaoSocial("VB Logística 💚");
          }
        } catch (error) {
          setRazaoSocial("Erro ao buscar cliente");
        }
      };

      fetchRazaoSocial();
    }
  }, [idCliente]);

  return (
    <Card className="w-full">
      <CardBody
        style={{
          backgroundImage: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50))",
          borderRadius: "10px",
        }}
        className="w-full flex flex-col gap-4"
      >
        <h4 className="flex items-start m-0 p-0 text-white justify-between">
          <div className="flex items-center">
            <div style={{ backgroundColor: "#ffffff45" }} className="flex justify-center rounded-md mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28 28"
                fill="currentColor"
                className="pl-1 size-6"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="grid-flow-col">
              <p className="text-sm">Você está Próximo a :</p>
              {location}
            </div>
          </div>
          <div>
            <p>Bem-vindo:</p>
            <p className="font-bold">{razaoSocial}</p>
          </div>
        </h4>
        <Input
          style={{ backgroundColor: "#027A48", color: "#ffffff" }}
          label="Consultar por Nº do Pedido"
          icon={
            <button
              style={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "25%",
                padding: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: "-5px",
              }}
              onClick={() => {
                // Adicione sua lógica de ação do botão aqui
              }}
            >
              <MagnifyingGlassIcon className="text-green-600 h-5 w-5" />
            </button>
          }
          size="lg"
          labelProps={{
            style: { color: "white" },
          }}
        />
      </CardBody>
    </Card>
  );
}
