// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogBody, DialogFooter, DialogHeader, Button, Input, Spinner } from "@material-tailwind/react";
import { API_URL } from "../../../config";
 
interface RecuperarSenhaModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RecuperarSenhaModal({ open, onClose }: RecuperarSenhaModalProps) {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [mensagem, setMensagem] = useState(""); // Estado para exibir a resposta
  const [loading, setLoading] = useState(false); // Estado para controlar o loading

  const handleSubmit = async () => {
    setMensagem(""); // Limpa a mensagem antes da requisição
    setLoading(true); // Ativa o loading

    const formData = new FormData();
    formData.append("cpf_cnpj", cpfCnpj);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        `${API_URL}/email/gerarTokenNovaSenha.php`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMensagem("✅ E-mail enviado com sucesso! Verifique sua caixa de entrada.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMensagem("❌ Erro ao enviar solicitação. Verifique as informações.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Recuperação de Senha</DialogHeader>
      <DialogBody>
        <p className="  text-gray-700">Digite seu CPF ou CNPJ para recuperar sua senha.</p>
        <small className="mb-4">📩 Enviaremos um e-mail para a caixa vínculada ao CPF ou CPNJ cadastrados</small>
      
        <Input 
          type="text" 
          placeholder="Digite o CPF ou CNPJ do titular" 
          className="w-full" 
          value={cpfCnpj} 
          onChange={(e) => setCpfCnpj(e.target.value)}
        />
        {mensagem && (
          <p className={`mt-2 text-sm ${mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
            {mensagem}
          </p>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose} className="mr-2" disabled={loading}>
          Voltar
        </Button>
        <Button className="bg-green-500" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner className="w-4 h-4 mr-2" /> : "Enviar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
