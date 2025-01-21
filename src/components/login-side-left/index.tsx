import { useState } from "react";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";
 

export default function FormLogin() {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [idCliente, setIdCliente] = useState(null);
  const [errors, setErrors] = useState({ cpfCnpj: "", senha: "", general: "" }); // Estado para mensagens de erro

  async function handleLogin(cpfCnpj: string, senha: string) {
    try {
      setLoading(true);
      setErrors({ cpfCnpj: "", senha: "", general: "" }); // Limpa os erros antes do envio

      // Validação básica
      if (!cpfCnpj) {
        setErrors((prev) => ({ ...prev, cpfCnpj: "⚠️ CPF ou CNPJ é obrigatório." }));
        setLoading(false);
        return;
      }
      if (!senha) {
        setErrors((prev) => ({ ...prev, senha: "⚠️ A senha é obrigatória." }));
        setLoading(false);
        return;
      }

      // Criação do FormData
      const formData = new FormData();
      formData.append("cpf_cnpj", cpfCnpj);
      formData.append("senha", senha);

      const response = await axios.post(
        "https://rotas.calledtecnologia.com/functions/portal_cliente/autenticacao.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Define o tipo correto
          },
        }
      );

      if (response.data.status === "success") {
        setIdCliente(response.data.data.id); // Atualiza o estado com o ID do cliente
      } else {
        setErrors((prev) => ({
          ...prev,
          general: response.data.message || "Erro ao realizar login.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || "Erro ao realizar login.",
      }));
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    handleLogin(cpfCnpj, senha);
  }

  return (
    <div
    style={{ backgroundColor: `#014753` }}
    className="p-10 flex flex-col gap-6 w-full md:w-1/3"
  >
  
      <div>
        <img
          src="../src/assets/Logo com Conceito VB LOG_Secundaria.png"
          alt="Logo"
        />
        <h3 className="text-center text-white">Portal do Cliente</h3>
      </div>

      {/* CPF ou CNPJ Input */}
      <div className="flex flex-col">
        <Input className="login--inputs"
          style={{ backgroundColor: "#fff" }}
          variant="outlined"
          label="CPF ou CNPJ"
          placeholder="Insira seu CPF ou CNPJ"
          value={cpfCnpj}
          onChange={(e) => setCpfCnpj(e.target.value)}
        />
        {errors.cpfCnpj && (
          <p className="text-red-500 text-sm mt-1 spanLogin">{errors.cpfCnpj}</p>
        )}
      </div>

      {/* Senha Input */}
      <div className="flex flex-col">
        <Input className="login--inputs"
          style={{ backgroundColor: "#fff" }}
          variant="outlined"
          label="Senha"
          placeholder="Insira sua Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {errors.senha && (
          <p className="text-red-500 text-sm mt-1 spanLogin">{errors.senha}</p>
        )}
      </div>

      {/* Botão de Login */}
      <Button
        style={{ backgroundColor: `#00D479` }}
        className="flex justify-center text-center rounded-full"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Carregando..." : "LOGIN"}
      </Button>

      {/* Mensagem de erro geral */}
      {errors.general && (
        <div className="text-red-500 text-sm mt-4 spanLogin">⚠️ {errors.general}</div>
      )}

      {/* Mensagem de sucesso */}
      {idCliente && (
        <div className="mt-4 text-green-600">
          <p>Bem-vindo, seu ID de cliente é: {idCliente}</p>
        </div>
      )}
    </div>
  );
}
