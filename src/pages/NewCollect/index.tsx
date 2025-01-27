import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


const SolicitarColetaForm = () => {
  const [data, setData] = useState({
    id_cliente: '',
    cep: '',
    destino_numero: '',
    destino_bairro: '',
    destino_cidade: '',
    nome_destinatario: '',
    telefone_destinatario: '',
    local_entrega: '',
    solicitante_coleta: '',
    volume_solicitado: '',
    peso_solicitado: '',
    qtd_notas: '',
    tipo_embalagem: '',
    obs: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showOverlay, setShowOverlay] = useState(false); // Controle do overlay
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setMessage('');
    setShowOverlay(true); // Exibe o overlay enquanto carrega

    const formData = new FormData();
    formData.append('id_cliente', data.id_cliente);
    formData.append('cep', data.cep);
    formData.append('destino_numero', data.destino_numero);
    formData.append('destino_bairro', data.destino_bairro);
    formData.append('destino_cidade', data.destino_cidade);
    formData.append('nome_destinatario', data.nome_destinatario);
    formData.append('telefone_destinatario', data.telefone_destinatario);
    formData.append('local_entrega', data.local_entrega);
    formData.append('solicitante_coleta', data.solicitante_coleta);
    formData.append('volume_solicitado', data.volume_solicitado);
    formData.append('peso_solicitado', data.peso_solicitado);
    formData.append('qtd_notas', data.qtd_notas);
    formData.append('tipo_embalagem', data.tipo_embalagem);
    formData.append('obs', data.obs);

    try {
      const response = await axios.post(
        'http://localhost/roteirizador/functions/portal_cliente/coletas/solicitar_coleta.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status === 'success') {
        setMessage('✅️ Coleta solicitada com sucesso! Agora é com a gente, em pouco tempos sua solicitação de coleta será respondida!');
        setMessageType('success');
      } else {
        setMessage('Erro ao solicitar coleta: ' + response.data.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro ao enviar solicitação');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowOverlay(false); // Remove o overlay
        setMessage('');
        navigate('/home');
      }, 500000000);
    }
  };

  return (
    <div style={{height: '100%' }} className="relative">
      {showOverlay && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div
            
            className={`p-6 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            style={{ width: '80%', maxWidth: '400px', padding: '70px 0px', marginTop: '-30rem', textAlign: 'center', fontWeight:'bold', backgroundColor: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50)" }}
          >
            <span className='text-white text-2xl'>{message}</span>
          </div>
        </div>
      )}
          <div className="p-4 flex justify-between">
                <h1>
                    Solicitação de Coleta
                </h1>
          <Link to="/home" className="flex flex-col items-center group">
              <h2><i  style={{color: "rgb(13,171,97"}} className="text-3xl fa-sharp fa-solid fa-arrow-left"></i></h2>
          </Link>
            </div>
      <form onSubmit={handleSubmit} className="space-y-6 p-4 rounded-lg max-w-8xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
          <div className="relative">
        
            <label htmlFor="id_cliente" className="text-sm font-medium text-gray-700">ID Cliente</label>
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <input
              type="text"
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
            <div className="mt-4 absolute left-3 top-3 text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <input
              type="text"
              id="tipo_embalagem"
              name="tipo_embalagem"
              value={data.tipo_embalagem}
              onChange={handleChange}
              placeholder="Tipo de Embalagem"
              className="input input-bordered w-full pl-10 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

           <div className="w-100 flex justify-center">
            <div className="w-full ">
            <label htmlFor="obs" className="text-sm font-medium text-gray-700">Observações</label>
            <textarea
                id="obs"
                name="obs"
                value={data.obs}
                onChange={handleChange}
                placeholder="Observações"
                className="input input-bordered w-full   rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                     </div>
                </div>
            </div>
       
       
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
 


        <div className="flex justify-center">
          <button
            style={{width:'100%', background : "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50)"}}
            type="submit"
            className="text-white p-3 font-bold"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Solicitar Coleta'}
          </button>
        </div>
        
        
      </form>
    </div>
  );
};

export default SolicitarColetaForm;
