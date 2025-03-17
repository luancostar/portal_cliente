 

import { useState, useEffect } from "react";
import { SearchHeaderCard } from "../../components/header-home";
import TrackTurn from "../../components/Track";
import { OrdersTable } from "../../components/orders";
import DeliveriesTable from "../../components/deliveries";
import Hero from "../../components/Hero";
import ButtonBaloon from "../../components/buttonBalloon";
import withAuth from "../hoc";

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(function Home() { // Aplique o HOC diretamente aqui
  const [idCliente, setIdCliente] = useState<string | null>(null);

  useEffect(() => {
    const clienteId = localStorage.getItem("idCliente");
    setIdCliente(clienteId);
  }, []);  

  return (
    <div className="h-full w-100 flex">
      <div className="p-6 w-full">
        <SearchHeaderCard idCliente={idCliente} />
        <TrackTurn />
        <Hero />
        <OrdersTable idCliente={idCliente} />
        <DeliveriesTable idCliente={idCliente} />
        <ButtonBaloon />
      </div>
    </div>
  );
});