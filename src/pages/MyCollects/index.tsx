// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect } from "react";
import ColetasTable from "../../components/tableOrders";
import withAuth from "../hoc"; // Importe o HOC

function MyCollects() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [idCliente, setIdCliente] = useState<string | null>(null);

  useEffect(() => {
    // Recuperando o ID do cliente do localStorage
    const clienteId = localStorage.getItem("idCliente");
    setIdCliente(clienteId);
  }, []); // O useEffect será executado apenas uma vez quando o componente for montado

  return (
    <div>
      {/* <OrdersTableAll idCliente={idCliente}/> */}
      <ColetasTable />
    </div>
  );
}

// Aplique o HOC antes de exportar o componente
// eslint-disable-next-line react-refresh/only-export-components
export default withAuth(MyCollects);