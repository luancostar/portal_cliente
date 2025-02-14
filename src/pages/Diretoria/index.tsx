// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardBody } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { API_URL } from '../../../config';
import bgMsg from "../../assets/diretoriabg.png";
import InputMask from 'react-input-mask';


const Formulario: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clienteId = localStorage.getItem("idCliente");
    setIdCliente(clienteId);
  }, []);

  const enviarFormulario = async () => {
    setLoading(true); // Ativa o loading
    const response = await fetch(`${API_URL}/email/diretoria.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        nome,
        email,
        telefone,
        mensagem,
        id_cliente: idCliente,
      }),
    });

    const data = await response.json();
    setLoading(false); // Desativa o loading

    if (response.ok) {
      alert(data.message || 'Mensagem enviada com sucesso!');
    } else {
      alert(data.error || 'Erro ao enviar a mensagem');
    }

    // Zera os inputs após o envio
    setNome('');
    setEmail('');
    setTelefone('');
    setMensagem('');
  };

  return (
    <>
       <Link to="/home" className="flex flex-col items-end p-4">
                  <h2><i  style={{color: "rgb(13,171,97"}} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i></h2>
              </Link>

      <Card className="p-6 w-full bg-transparent shadow-none">
        <CardBody
          style={{
            padding: '0px',
            backgroundImage: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50))",
            borderRadius: "10px"
          }}
          className="w-full flex flex-col gap-4"
        >
          <div className="flex justify-between">
            <div className="p-6 text-xl font-bold text-white sm:text-6xl md:text-4xl">
              Suas mensagens vão direto para a diretoria da VB Logística!
            </div>
            <div className="flex justify-center">
              <img src={bgMsg} alt="" className="w-full xl:max-w-[50%]" />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="p-8 mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email para contato</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
        <label className="block text-sm font-medium text-gray-700">Telefone para contato</label>
        <InputMask
          mask="(99) 99999-9999"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">O que tem a nos dizer ?</label>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          onClick={enviarFormulario}
          className="mt-4 px-4 py-2 bg-green-500 w-full text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
        </div>
      )}
    </>
  );
};

export default Formulario;
