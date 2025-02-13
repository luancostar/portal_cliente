// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardBody } from "@material-tailwind/react";
import axios from "axios";
import { API_URL } from "../../../config";
import alteraBg from "../../assets/alterabg.png";

const RecuperarSenha = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!token) {
      setMensagem("Token inválido ou expirado.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!token) {
      setMensagem("Token inválido.");
      return;
    }
  
    if (novaSenha.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
  
    if (novaSenha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }
  
    setCarregando(true);
    setMensagem("");
  
    try {
      const response = await axios.post(
        `${API_URL}/clientes/alterarSenhaToken.php`,
        { token, nova_senha: novaSenha }, // Enviando como JSON
        {
          headers: { "Content-Type": "application/json" }, // Cabeçalho correto
        }
      );
  
      setMensagem(response.data.message);
  
      if (response.data.status === "success") {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMensagem(error.response.data.message || "Erro ao alterar senha.");
      } else {
        setMensagem("Erro ao conectar com o servidor.");
      }
    } finally {
      setCarregando(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Redefinir Senha</h2>

        {mensagem && (
          <p className={`mb-4 ${mensagem.includes("sucesso") ? "text-green-500" : "text-red-500"}`}>
            {mensagem}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nova Senha</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Confirmar Senha</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={carregando}
          >
            {carregando ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarSenha;
