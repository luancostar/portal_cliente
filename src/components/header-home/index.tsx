// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@material-tailwind/react";
import { API_URL } from "../../../config";

export function SearchHeaderCard({ idCliente }) {
 const [enderecoPrincipal, setEnderecoPrincipal] = useState("Buscando endereço...");
 const [razaoSocial, setRazaoSocial] = useState("");


  useEffect(() => {

    const storedRazaoSocial = localStorage.getItem("razaoSocial");
    if (storedRazaoSocial) {
      setRazaoSocial(storedRazaoSocial);
    }

    if (idCliente) {
 
      const fetchEndereco = async () => {
        try {
          const response = await fetch(
            `${API_URL}/clientes/getEnderecosCliente.php?id_cliente=${idCliente}`
          );
          const data = await response.json();
          if (data.status === "success" && data.data.length > 0) {
            const enderecoCompleto = `${data.data[0].endereco}, ${data.data[0].endereco_num}, CEP: ${data.data[0].cep}`;
            setEnderecoPrincipal(enderecoCompleto);
          } else {
            setEnderecoPrincipal("Endereço não encontrado");
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setEnderecoPrincipal("Erro ao buscar endereço");
        }
      };
 
      fetchEndereco();

    }
  }, [idCliente]);

  return (
    <Card className="w-full">
      <CardBody
      
        style={{
          backgroundImage: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50))",
          borderRadius: "10px",
          padding: "10px",
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
              <p className="text-xs">Endereço Principal:</p>
              <p className="text-xs font-bold ">{enderecoPrincipal}</p>
            </div>
          </div>
          <div>
            <p className="text-xs">Bem-vindo(a):</p>
            <p className="font-bold text-sm">{razaoSocial}</p>
           </div>
        </h4>
      </CardBody>
    </Card>
    
  );
}
