// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
 
import React, { useState, useEffect } from "react";
import EntregasTable from "../../components/tableDeliveries";
 

export default function MyDeliveries() {

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
<EntregasTable/>
   </div>
 );
}