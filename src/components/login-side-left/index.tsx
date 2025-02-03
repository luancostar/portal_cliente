// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { useState } from "react";
import axios from "axios";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config.tsx";
import logoVb from "../../assets/LogoVBLOG_Prioritaria.png"
import coverLogin from "../../assets/bgLogin.png";


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
        `${API_URL}/autenticacao.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        const { id, razao_social } = response.data.data;
      
        setIdCliente(id);
        localStorage.setItem("idCliente", id);
        localStorage.setItem("razaoSocial", razao_social); // Armazenando a razão social
      
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
    <section style={{ width: '100%' }} className="grid text-center h-screen items-center p-8">
 <div
  className="absolute inset-0 bg-cover md:hidden"
  style={{
    background: `linear-gradient(to top, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.7)), url(${coverLogin})`,
    backgroundColor: '#FBFBFB',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }}
></div>

      <div>
        <div className="flex justify-center">
          <img
            style={{ width: '500px', position: 'relative' }}
            src={logoVb}
            alt="Logo"
          />
        </div>
         
            <Typography style={{ position: 'relative' }} variant="h4" color="blue-gray" className="mb-2">
          Portal do Cliente
        </Typography>
        <Typography style={{ position: 'relative' }} className="mb-16 text-gray-600 font-normal text-[18px]">
          O Controle de suas encomendas ao seu alcance
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
              className="text-center text-white font-bold w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 sm:text-black"
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
  className="text-center w-full text-white font-bold placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 sm:text-black"
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
            style={{ backgroundColor: '#00D479', position: 'relative' }}
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
            <Typography variant="small" style={{ position: 'relative', fontWeight: 'bold', background: '#ffffff45' }} color="red" className="text-center mt-4">
              ⚠️ {errors.general}
            </Typography>
          )}

          {/* Mensagem de sucesso */}
          {idCliente && (
            <Typography variant="small" color="green" style={{ position: 'relative' }} className="text-center font-bold mt-4">
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
