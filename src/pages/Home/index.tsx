// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import React, { useState, useEffect } from "react";
import { SearchHeaderCard } from "../../components/header-home";
import TrackTurn from "../../components/Track";
import { OrdersTable } from "../../components/orders";
import Hero from "../../components/Hero";
 

export default function Home() {
  const [idCliente, setIdCliente] = useState(null);

  useEffect(() => {
    // Recuperando o ID do cliente do localStorage
    const clienteId = localStorage.getItem("idCliente");
    setIdCliente(clienteId);
  }, []); // O useEffect será executado apenas uma vez quando o componente for montado

  return (
    <div className="h-full w-100 flex">
      <div className="p-6 w-full">
        {/* Passando o idCliente para os componentes */}
        <SearchHeaderCard idCliente={idCliente} />
        <TrackTurn />
        {/* <ColetasTable idCliente={idCliente} /> */}
        <Hero/>
 
        <OrdersTable idCliente={idCliente} />
      </div>
    </div>
  );
}
