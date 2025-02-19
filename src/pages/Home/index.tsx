// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import React, { useState, useEffect } from "react";
import { SearchHeaderCard } from "../../components/header-home";
import TrackTurn from "../../components/Track";
import { OrdersTable } from "../../components/orders";
import DeliveriesTable from "../../components/deliveries";
import Hero from "../../components/Hero";
import ButtonBaloon from "../../components/buttonBalloon";
 
 
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
 
        <SearchHeaderCard idCliente={idCliente} />
        <TrackTurn />
 
        <Hero/>
        <OrdersTable idCliente={idCliente} />
        <DeliveriesTable idCliente={idCliente} />
        <ButtonBaloon/>
       
      </div>
    </div>
  );
}
