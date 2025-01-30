import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { API_URL } from '../../../config';

const SolicitarColetaForm = () => {
  const [data, setData] = useState({
    id_cliente: "",
    cep: "",
    destino_numero: "",
    destino_bairro: "",
    destino_cidade: "",
    nome_destinatario: "",
    telefone_destinatario: "",
    local_entrega: "",
    solicitante_coleta: "",
    volume_solicitado: "",
    peso_solicitado: "",
    qtd_notas: "",
    tipo_embalagem: "",
    id_endereco_coleta: "",
    obs: "",

  });

  const [addresses, setAddresses] = useState([]); // Armazenar múltiplos endereços
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [embalagens, setEmbalagens] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const idCliente = localStorage.getItem("idCliente");
    if (idCliente) {
      setData((prevData) => ({
        ...prevData,
        id_cliente: idCliente,
      }));
      fetchAddress(idCliente); // Chama a função para buscar os endereços
    }
  }, []);

  const fetchAddress = async (idCliente) => {
    try {
      const response = await axios.get(
        `${API_URL}/clientes/getEnderecosCliente.php?id_cliente=${idCliente}`
      );
      if (response.data.status === "success" && response.data.data.length > 0) {
        setAddresses(response.data.data); // Armazenar múltiplos endereços
        // Se necessário, definir valores iniciais para campos do formulário
        setData((prevData) => ({
          ...prevData,
          cep: response.data.data[0].cep,
          coleta_numero: response.data.data[0].endereco_num,
          endereco_coleta: response.data.data[0].endereco,
          id_endereco_coleta: response.data.data[0].id,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/embalagens/getEmbalagens.php`)
      .then(response => {
        if (response.data.status === 'success') {
          setEmbalagens(response.data.data);
        }
      })
      .catch(error => console.error("Erro ao buscar embalagens:", error));
  }, []);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setShowOverlay(true);

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    try {
      const response = await axios.post(
        `${API_URL}/coletas/solicitar_coleta.php`, // Usando API_URL na URL da requisição
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    
      if (response.data.status === "success") {
        setMessage("✅️ Coleta solicitada com sucesso! Aguarde Confirmação.");
        setMessageType("success");
      } else {
        setMessage("Erro ao solicitar coleta: " + response.data.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Erro ao enviar solicitação");
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowOverlay(false);
        navigate("/home");
      }, 3000);
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const getStepTitle = () => {
    const titles = {
      1: "Dados de Coleta",
      2: "Endereço de Destino (Opcional)",
      3: "Confirme Solicitação"
    };
    return titles[currentStep] || "Solicitação de Coleta";
  };
  
  return (
    <div style={{height: '100%' }} className="relative">
      {showOverlay && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div
            
            className={`p-6 rounded-md ${messageType === 'success' ? 'bg-green-500 text-green-800' : 'bg-red-100 text-red-700'}`}
            style={{ width: '80%', maxWidth: '400px', padding: '70px 0px', marginTop: '-15rem', border:'5px solid #fff', borderRadius:'5px', textAlign: 'center', fontWeight:'bold', backgroundColor: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50)" }}
          >
            <span className='text-white text-2xl'>{message}</span>
          </div>
        </div>
      )}
          <div className="p-4 flex justify-between">

          <h1 className='text-2xl font-semibold text-gray-600'>
              {getStepTitle()}
          </h1>
                
          <Link to="/home" className="flex flex-col items-center group">
              <h2><i  style={{color: "rgb(13,171,97"}} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i></h2>
          </Link>
        </div>


      <form onSubmit={handleSubmit} className="space-y-6 p-4 rounded-lg max-w-8xl mx-auto">
      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
          <div className="hidden relative">
        
             
            <input
              type="hidden"
              id="id_cliente"
              name="id_cliente"
              value={data.id_cliente}
              onChange={handleChange}
              placeholder="ID Cliente"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          
          <div className="relative">
            <label htmlFor="solicitante_coleta" className="text-sm font-medium text-gray-700">Nome do Solicitante</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <input
              type="text"
              id="solicitante_coleta"
              name="solicitante_coleta"
              value={data.solicitante_coleta}
              onChange={handleChange}
              placeholder="Solicitante da Coleta"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="volume_solicitado" className="text-sm font-medium text-gray-700">Quantidade de Volumes</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <input
              type="text"
              id="volume_solicitado"
              name="volume_solicitado"
              value={data.volume_solicitado}
              onChange={handleChange}
              placeholder="Volume Solicitado"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>


          <div className="relative">
            <label htmlFor="tipo_embalagem" className="text-sm font-medium text-gray-700">Tipo de Embalagem</label>
            <select
          id="tipo_embalagem"
          name="tipo_embalagem"
          value={data.tipo_embalagem}
          onChange={handleChange}
          className="input input-bordered w-full py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma embalagem</option>
          {embalagens.map((embalagem) => (
            <option key={embalagem.id} value={embalagem.id}>
              {embalagem.nome}
            </option>
          ))}
        </select>
          </div>
          
          <div className="relative">
            <label htmlFor="peso_solicitado" className="text-sm font-medium text-gray-700">Peso Solicitado</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <input
              type="text"
              id="peso_solicitado"
              name="peso_solicitado"
              value={data.peso_solicitado}
              onChange={handleChange}
              placeholder="Peso Solicitado"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
       
            />
          </div>

          <div className="relative">
            <label htmlFor="qtd_notas" className="text-sm font-medium text-gray-700">Quantidade de Notas</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <input
              type="number"
              id="qtd_notas"
              name="qtd_notas"
              value={data.qtd_notas}
              onChange={handleChange}
              placeholder="Quantidade de Notas"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
              <label htmlFor="id_endereco_coleta" className="text-sm font-medium text-gray-700">Selecione Endereço de Coleta:</label>
              <select
                id="id_endereco_coleta"
                name="id_endereco_coleta"
                value={data.id_endereco_coleta}
                onChange={handleChange}
                className="input input-bordered w-full pl-2 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {addresses.map((address, index) => (
                   <option
                   key={index}
                   value={address.endereco} // O valor visível para o usuário
                   data-id={address.id} // O id oculto no atributo data-id
                 >
                   CEP: {address.cep} - {address.endereco}, {address.endereco_num}
                  </option>
                ))}
              </select>
            </div>

           

           <div className="w-100 flex justify-center">
            <div className="w-full ">
            <label htmlFor="obs" className="text-sm font-medium text-gray-700">Observações</label>
            <textarea
                id="obs"
                name="obs"
                value={data.obs}
                onChange={handleChange}
                placeholder="Observações"
                className="input input-bordered w-full pl-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                     </div>
                </div>
            </div>

            
       
        )}
        {currentStep === 2 && (

 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="relative">
            <label htmlFor="cep" className="text-sm font-medium text-gray-700">CEP</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-map-pin"></i>
            </div>
            <input
              type="text"
              id="cep"
              name="cep"
              value={data.cep}
              onChange={handleChange}
              placeholder="CEP"
              autoComplete="off"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="destino_numero" className="text-sm font-medium text-gray-700">Número do Destino</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-home"></i>
            </div>
            <input
              type="text"
              id="destino_numero"
              name="destino_numero"
              value={data.destino_numero}
              onChange={handleChange}
              placeholder="Número do Destino"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
     

         
          <div className="relative">
            <label htmlFor="destino_bairro" className="text-sm font-medium text-gray-700">Bairro</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-building"></i>
            </div>
            <input
              type="text"
              id="destino_bairro"
              name="destino_bairro"
              value={data.destino_bairro}
              onChange={handleChange}
              placeholder="Bairro"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="destino_cidade" className="text-sm font-medium text-gray-700">Cidade</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-city"></i>
            </div>
            <input
              type="text"
              id="destino_cidade"
              name="destino_cidade"
              value={data.destino_cidade}
              onChange={handleChange}
              placeholder="Cidade"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="nome_destinatario" className="text-sm font-medium text-gray-700">Nome do Destinatário</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-user-alt"></i>
            </div>
            <input
              type="text"
              id="nome_destinatario"
              name="nome_destinatario"
              value={data.nome_destinatario}
              onChange={handleChange}
              placeholder="Nome do Destinatário"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
       
          <div className="relative">
            <label htmlFor="telefone_destinatario" className="text-sm font-medium text-gray-700">Telefone do Destinatário</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-phone"></i>
            </div>
            <input
              type="text"
              id="telefone_destinatario"
              name="telefone_destinatario"
              value={data.telefone_destinatario}
              onChange={handleChange}
              placeholder="Telefone do Destinatário"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="local_entrega" className="text-sm font-medium text-gray-700">Local de Entrega</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <input
              type="text"
              id="local_entrega"
              name="local_entrega"
              value={data.local_entrega}
              onChange={handleChange}
              placeholder="Local de Entrega"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

        </div>
 
)}
{currentStep === 3 && (
  <button type="submit"  className="w-full p-3 border rounded-xl text-white cursor-pointer bg-gradient-to-b from-blue-600 to-blue-400 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95" >
    <i class="fa-solid fa-circle-check"></i> Solicitar Coleta
  </button>
)}
<div className="flex justify-between mt-4">
  {currentStep > 1 && (
    <button type="button" onClick={handlePreviousStep} className="w-full p-3 border rounded-xl text-white cursor-pointer bg-gradient-to-b from-green-200 to-green-400 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95">
     <i class="fa-solid fa-chevron-left"></i>  Voltar
    </button>
  )}
  {currentStep < 3 && (
    <button type="button" onClick={handleNextStep} className="w-full p-3 border rounded-xl text-white cursor-pointer bg-gradient-to-b from-green-500 to-green-700 group-hover:from-white group-hover:to-white group-hover:border group-hover:border-green-500 transform transition-transform duration-200 group-hover:scale-95"
>
      Próximo <i className="fa-solid fa-chevron-right"></i>
    </button>
  )}
</div>
      </form>
      
    </div>
    
  );
};

export default SolicitarColetaForm;
