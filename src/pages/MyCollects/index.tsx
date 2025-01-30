// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import React, { useState, useEffect } from "react";
import ColetasTable from "../../components/tableOrders";

export default function MyCollects() {

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [idCliente, setIdCliente] = useState(null);

useEffect(() => {
// Recuperando o ID do cliente do localStorage
const clienteId = localStorage.getItem("idCliente");
setIdCliente(clienteId);
}, []); // O useEffect será executado apenas uma vez quando o componente for montado


 return (
   <div>
{/* <OrdersTableAll idCliente={idCliente}/> */}
<ColetasTable/>
   </div>
 );
}