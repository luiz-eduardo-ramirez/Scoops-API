import { useState } from "react";
import { Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import logoImg from "../assets/logo.png";
import ErrorModal from "../components/ErrorModal";
export default function Register() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
  setErrorMessage("As senhas não coincidem.");
  setShowError(true);
  return;
}

    setLoading(true);

    try {
      await api.post("/auth/register", {
        login: email,
        password,
        role: "USER"
      });
      
      setSuccess(true);

    } catch {
        setErrorMessage("Este e-mail já está cadastrado.");
        setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // --- TELA DE SUCESSO (PÓS-CADASTRO) ---
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-scoop-bg">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-green-200 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500 w-20 h-20" />
          </div>
          
          <h2 className="text-3xl font-bubble text-scoop-pink mb-4">Quase lá! ✨</h2>
          
          <p className="text-gray-600 mb-6 text-lg">
            Enviamos um link de confirmação para: <br/>
            <span className="font-bold text-scoop-blue">{email}</span>
          </p>
          
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6">
            <p className="text-sm text-yellow-700">
              💌 <b>Dica:</b> Se não encontrar, verifique sua caixa de <b>Spam</b> ou <b>Lixo Eletrônico</b>.
            </p>
          </div>

          <button 
            onClick={() => navigate("/login")} 
            className="w-full bg-scoop-blue text-white font-bubble text-xl py-3 rounded-xl hover:bg-cyan-500 transition shadow-md"
          >
            Ir para o Login
          </button>
        </div>
      </div>
    );
  }

  // --- FORMULÁRIO DE CADASTRO ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-scoop-bg">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-scoop-blue/20">
        <div className="text-center mb-6">
          <img src={logoImg} alt="Logo" className="h-20 mx-auto mb-2" />
          <h2 className="text-3xl font-bubble text-scoop-pink">Crie sua Conta</h2>
          <p className="text-gray-400 font-hand">Para acompanhar seus scoops!</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          
          {/* Campo de E-mail */}
          <div>
            <label className="text-gray-500 font-bold text-sm">SEU E-MAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type="email" 
                placeholder="exemplo@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full pl-10 p-3 rounded-xl border-2 border-gray-100 focus:border-scoop-pink outline-none transition" 
                required 
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="text-gray-500 font-bold text-sm">SUA SENHA</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full pl-10 p-3 rounded-xl border-2 border-gray-100 focus:border-scoop-pink outline-none transition" 
                required 
              />
            </div>
          </div>

          {/* 3. Campo de Confirmar Senha */}
          <div>
            <label className="text-gray-500 font-bold text-sm">CONFIRME SUA SENHA</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className={`w-full pl-10 p-3 rounded-xl border-2 outline-none transition ${
                    confirmPassword && password !== confirmPassword 
                    ? "border-red-300 focus:border-red-500" // Fica vermelho se não bater
                    : "border-gray-100 focus:border-scoop-pink"
                }`}
                required 
              />
            </div>
             {/* Feedback visual rápido se as senhas não baterem */}
            {confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-xs mt-1 font-bold pl-1">As senhas não conferem</p>
            )}
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-scoop-blue text-white font-bubble text-xl py-3 rounded-xl hover:bg-cyan-500 transition shadow-md flex justify-center items-center gap-2 hover:-translate-y-1 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Cadastrar e Confirmar ✨"}
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-gray-400">Já tem conta?</p>
            <Link to="/login" className="text-scoop-pink font-bold hover:underline">Fazer Login</Link>
        </div>
        <ErrorModal
  open={showError}
  onClose={() => setShowError(false)}
  title="Ops!"
  message={errorMessage}
/>
      </div>
    </div>
  );
}