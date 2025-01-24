import { useState } from "react";
import axios from "axios";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function FormLogin() {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [idCliente, setIdCliente] = useState(null);
  const [errors, setErrors] = useState({ cpfCnpj: "", senha: "", general: "" });
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  async function handleLogin(cpfCnpj, senha) {
    try {
      setLoading(true);
      setErrors({ cpfCnpj: "", senha: "", general: "" });

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

      const formData = new FormData();
      formData.append("cpf_cnpj", cpfCnpj);
      formData.append("senha", senha);

      const response = await axios.post(
        "https://rotas.calledtecnologia.com/functions/portal_cliente/autenticacao.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setIdCliente(response.data.data.id);
        localStorage.setItem("idCliente", response.data.data.id);

        // Delay de 2 segundos antes de redirecionar
        setTimeout(() => {
          navigate("/home");
        }, 2000);
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
    <section style={{ width: '70%' }} className="grid text-center h-screen items-center p-8">
      <div>
        <div className="flex justify-center">
          <img
            style={{ width: '500px' }}
            src="../src/assets/Logo VB LOG_Prioritaria.png"
            alt="Logo"
          />
        </div>
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Portal do Cliente
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          O Controle de suas encomendas na palma da sua mão.
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
          {/* CPF ou CNPJ Input */}
          <div className="mb-6">
            <label htmlFor="cpfCnpj">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                CPF ou CNPJ
              </Typography>
            </label>
            <Input
              id="cpfCnpj"
              size="lg"
              placeholder="Insira seu CPF ou CNPJ"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              className="text-center w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
            />
            {errors.cpfCnpj && (
              <Typography variant="small" color="red" className="text-center mt-1">
                {errors.cpfCnpj}
              </Typography>
            )}
          </div>

          {/* Senha Input */}
          <div className="mb-6">
            <label htmlFor="senha">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Senha
              </Typography>
            </label>
            <Input
              id="senha"
              size="lg"
              placeholder="********"
              type={passwordShown ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="text-center w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              icon={
                <i onClick={togglePasswordVisibility}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
            {errors.senha && (
              <Typography variant="small" color="red" className="text-center mt-1">
                {errors.senha}
              </Typography>
            )}
          </div>

          {/* Botão de Login */}
          <Button
            style={{ backgroundColor: '#00D479' }}
            color="gray"
            size="lg"
            className="mt-6"
            fullWidth
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? "Carregando..." : "LOGIN"}
          </Button>

          {/* Mensagem de erro geral */}
          {errors.general && (
            <Typography variant="small" color="red" className="text-center mt-4">
              ⚠️ {errors.general}
            </Typography>
          )}

          {/* Mensagem de sucesso */}
          {idCliente && (
            <Typography variant="small" color="green" className="text-center font-bold mt-4">
              {/* Bem-vindo, seu ID de cliente é: {idCliente} */}
              Bem-vindo ao Portal do Cliente! 😉 
            </Typography>
          )}
        </form>

        {/* Loader Spinner - Centralizado */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-200"></div>
          </div>
        )}
      </div>
    </section>
  );
}
