// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogBody, DialogFooter, DialogHeader, Button, Input, Spinner } from "@material-tailwind/react";

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
      const response = await axios.post(
        "https://rotas.calledtecnologia.com/functions/portal_cliente/email/gerarTokenNovaSenha.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMensagem("✅ E-mail enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (error) {
      setMensagem("Erro ao enviar solicitação. Verifique as informações.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Recuperação de Senha</DialogHeader>
      <DialogBody>
        <p className=" mb-4 text-gray-700">Digite seu CPF ou CNPJ para recuperar sua senha.</p>
      
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
