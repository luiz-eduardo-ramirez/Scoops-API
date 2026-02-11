import { useState } from "react";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import logoImg from "../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Controla se já enviou

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // O endpoint que vamos criar no Java
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      
      alert("Erro ao solicitar recuperação. Verifique o e-mail.");
    } finally {
      setLoading(false);
    }
  };

  // --- TELA DE SUCESSO ---
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-scoop-bg">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-green-200 text-center animate-fade-in">
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bubble text-scoop-pink mb-2">E-mail Enviado! 🚀</h2>
          <p className="text-gray-600 mb-6">
            Se existir uma conta com <b>{email}</b>, você receberá um link para redefinir sua senha em instantes.
          </p>
          <Link to="/login" className="text-scoop-blue font-bold hover:underline">
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  // --- FORMULÁRIO ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-scoop-bg">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-scoop-blue/20">
        
        <div className="text-center mb-8">
          <img src={logoImg} alt="Logo" className="h-20 mx-auto mb-2" />
          <h2 className="text-2xl font-bubble text-scoop-pink">Recuperar Senha</h2>
          <p className="text-gray-400 font-hand">Não se preocupe, acontece!</p>
        </div>

        <form className="space-y-6" onSubmit={handleForgot}>
          <div>
            <label className="block text-gray-500 font-bold mb-2 ml-1 text-sm">DIGITE SEU E-MAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-scoop-pink focus:outline-none transition bg-gray-50"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-scoop-blue text-white font-bubble text-xl py-3 rounded-xl hover:bg-cyan-500 transition shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Enviar Link de Recuperação"}
          </button>
        </form>

        <div className="mt-6 text-center">
            <Link to="/login" className="text-gray-500 font-bold flex items-center justify-center gap-2 hover:text-scoop-pink transition">
                <ArrowLeft size={16} /> Voltar
            </Link>
        </div>

      </div>
    </div>
  );
}