// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
 
import { useState, useEffect } from "react";
import StatsSection from "../../components/my-performances";
  
export default function Performance() {
  const [idCliente, setIdCliente] = useState(null);

  useEffect(() => {
    // Recuperando o ID do cliente do localStorage
    const clienteId = localStorage.getItem("idCliente");
    setIdCliente(clienteId);
  }, []); 

 return (
   <div className="h-full flex justify-center">
    <StatsSection idCliente={idCliente}/>
   </div>
 );
}