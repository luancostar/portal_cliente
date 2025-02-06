import { useState, useEffect } from "react";
import { Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import axios from "axios";
import alteraBg from "../../assets/alterabg.png";

export default function ChangePassword() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [idCliente, setIdCliente] = useState("");

  useEffect(() => {
    const clienteId = localStorage.getItem("idCliente");
    if (!clienteId) {
      setError("⚠️ ID do cliente não encontrado. Faça login novamente.");
      return;
    }
    setIdCliente(clienteId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!idCliente) {
      setError("⚠️ Erro ao obter ID do cliente. Faça login novamente.");
      return;
    }

    if (!novaSenha || !confirmarSenha) {
      setError("⚠️ Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("⚠️ As senhas não coincidem.");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(novaSenha)) {
      setError("⚠️ A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas e minúsculas.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/clientes/alterarSenha.php`,
        new URLSearchParams({
          id_cliente: idCliente,
          nova_senha: novaSenha,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response.data.status === "success") {
        setSuccess("✅ Senha alterada com sucesso! Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.data.message || "Erro ao alterar a senha.");
      }
    } catch (err) {
      setError("⚠️ Erro na requisição. Tente novamente.");
    }
  };

  return (
 <>
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
        <div className="p-6 text-2xl font-bold text-white sm:text-6xl md:text-4xl">
          Bem-vindo ao Portal do Cliente VB !
        </div>
        <div className="mt-2 flex justify-center">
          <img src={alteraBg} alt="" className="w-full xl:max-w-[50%]" />
        </div>
      </div>
      
    </CardBody>
    
    <div className="py-4 max-w-none container">
      <h2 className="text-center font-bold">Definir Nova Senha:</h2>
      <small> Para sua maior segurança, redefina uma nova senha!</small><br></br>
      <small className="text-light-blue-800 font-bold">❗ A nova senha requer 8 caracteres entre letras maiúsculas e minúsculas</small>
      <form className="mt-2  bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Nova Senha:</label>
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Confirmar Senha:</label>
        <input
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-400 transition duration-200"
      >
        Alterar Senha
      </button>
    </form>
    </div>
  </Card>

    </>
  );
}
