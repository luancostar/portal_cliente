// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { Card, CardBody } from "@material-tailwind/react";
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
      setMensagem("⚠️ Token inválido ou expirado.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMensagem("⚠️ Token inválido.");
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(novaSenha)) {
      setMensagem("⚠️ A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas e minúsculas.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem("⚠️ As senhas não coincidem.");
      return;
    }
    setCarregando(true);
    setMensagem("");

    try {
      const response = await axios.post(
        `${API_URL}/clientes/alterarSenhaToken.php`,
        { token, nova_senha: novaSenha },
        { headers: { "Content-Type": "application/json" } }
      );
      setMensagem(response.data.message);
      if (response.data.status === "success") {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMensagem("⚠️ Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card className="p-6 w-full bg-transparent shadow-none">
      <CardBody
        style={{
          padding: "0px",
          backgroundImage: "linear-gradient(to bottom, rgb(13,171,97), rgb(0,128,50))",
          borderRadius: "10px",
        }}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex justify-between">
          <div className="p-6 text-2xl font-bold text-white sm:text-6xl md:text-4xl">
            Bem-vindo ao Portal do Cliente VB!
          </div>
          <div className="mt-2 flex justify-center">
            <img src={alteraBg} alt="" className="w-full xl:max-w-[50%]" />
          </div>
        </div>
      </CardBody>
      <div className="py-4 max-w-none container">
        <h2 className="text-center font-bold">Definir Nova Senha:</h2>
        <small>Para sua maior segurança, redefina uma nova senha!</small>
        <br />
        <small className="text-light-blue-800 font-bold">❗ A nova senha requer 8 caracteres entre letras maiúsculas e minúsculas</small>
        <form className="mt-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
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
          {mensagem && <p className={`text-sm text-center ${mensagem.includes("sucesso") ? "text-green-500" : "text-red-500"}`}>{mensagem}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-400 transition duration-200"
            disabled={carregando}
          >
            {carregando ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>
      </div>
    </Card>
  );
};

export default RecuperarSenha;
