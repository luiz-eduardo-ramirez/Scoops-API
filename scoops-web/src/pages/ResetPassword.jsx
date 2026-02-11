import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Check, X, Loader2, CheckCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import logoImg from "../assets/logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estado para controlar os requisitos
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false
  });

  // Validação em Tempo Real
  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password), 
    });
  }, [password]);

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      alert("Sua senha precisa atender a todos os requisitos de segurança!");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não conferem.");
      return;
    }

    if (!token) {
        alert("Token inválido ou ausente.");
        return;
    }

    setLoading(true);

    try {
      // O Java espera receber o token e a nova senha
      await api.post("/auth/reset-password", { 
        token: token, 
        newPassword: password 
      });
      
      setSuccess(true);

    } catch (error) {
      console.error(error);
      alert("Erro ao redefinir senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  };

  // --- TELA DE SUCESSO ---
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-scoop-bg">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-green-200 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500 w-20 h-20" />
          </div>
          <h2 className="text-3xl font-bubble text-scoop-pink mb-4">Senha Atualizada!</h2>
          <p className="text-gray-600 mb-6">
            Agora você pode acessar sua conta com sua nova senha mágica.
          </p>
          <button 
            onClick={() => navigate("/login")} 
            className="w-full bg-scoop-blue text-white font-bubble text-xl py-3 rounded-xl hover:bg-cyan-500 transition shadow-md"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-scoop-bg">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-scoop-blue/20">
        
        <div className="text-center mb-6">
          <img src={logoImg} alt="Logo" className="h-20 mx-auto mb-2" />
          <h2 className="text-2xl font-bubble text-scoop-pink">Nova Senha</h2>
          <p className="text-gray-400 font-hand text-sm">Crie uma senha forte e segura</p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          
          {/* Campo Nova Senha */}
          <div>
            <label className="text-gray-500 font-bold text-xs ml-1">NOVA SENHA</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Nova senha secreta" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full pl-10 pr-10 p-3 rounded-xl border-2 border-gray-100 focus:border-scoop-pink outline-none transition" 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-scoop-purple"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
            </div>
          </div>

          {/* --- CHECKLIST DE SEGURANÇA --- */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-xs font-bold text-gray-500 mb-2">A senha deve conter:</p>
            <ul className="space-y-1">
                <RequirementItem met={requirements.length} text="Mínimo de 8 caracteres" />
                <RequirementItem met={requirements.uppercase} text="Uma letra MAIÚSCULA" />
                <RequirementItem met={requirements.lowercase} text="Uma letra minúscula" />
                <RequirementItem met={requirements.symbol} text="Um símbolo (!@#$)" />
            </ul>
          </div>

          {/* Campo Confirmar Senha */}
          <div>
            <label className="text-gray-500 font-bold text-xs ml-1">CONFIRME A SENHA</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type="password" 
                placeholder="Repita a senha" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className={`w-full pl-10 p-3 rounded-xl border-2 outline-none transition ${
                    confirmPassword && password !== confirmPassword 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-100 focus:border-scoop-pink"
                }`}
                required 
              />
            </div>
          </div>

          <button 
            disabled={loading || !allRequirementsMet || password !== confirmPassword} 
            className="w-full bg-scoop-blue text-white font-bubble text-xl py-3 rounded-xl hover:bg-cyan-500 transition shadow-md flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Redefinir Senha 🔐"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Componente pequeno para os itens da lista
function RequirementItem({ met, text }) {
    return (
        <li className={`text-xs flex items-center gap-2 ${met ? "text-green-600 font-bold" : "text-gray-400"}`}>
            {met ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>}
            {text}
        </li>
    );
}