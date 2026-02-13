import { useState, useContext } from "react";
import { ArrowLeft, Lock, User, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import logoImg from "../assets/logo.png";
import ErrorModal from "../components/ErrorModal";
import { AuthContext } from "../context/AuthContext";
import { motion as Motion } from "framer-motion";

export default function Login() {
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await api.post("/auth/login", { 
    login: username, 
    password 
});


      const { accessToken, username: displayName, roles } = response.data;
      const primaryRole = roles && roles.length > 0 ? roles[0] : "USER";

      // --- CORREÇÃO DE SINCRONISMO ---
      // 1. Salva no localStorage IMEDIATAMENTE (Síncrono)
      // Isso garante que o api.js vai encontrar o token na próxima requisição
      localStorage.setItem("scoops_token", accessToken);
      localStorage.setItem("scoops_user", displayName);
      localStorage.setItem("scoops_role", primaryRole);
      // Apenas o nome de exibição (que não vai no contexto de segurança) salvamos aqui
      authLogin(accessToken, primaryRole);

      // Redirecionamento baseado na role
      if (primaryRole === "ADMIN") {
          navigate("/admin-products"); 
      } else {
          navigate("/");
      }

    } catch (err) {
      console.error("Erro detalhado no login:", err);
      const message = err.response?.status === 401 
          ? "Usuário ou senha inválidos." 
          : "Erro na comunicação com o servidor.";
      setErrorMessage(message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-scoop-bg">
      
     
      <Motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100 
        }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-scoop-blue/20 hover:shadow-pink-200 transition-shadow duration-500"
      >
        
        <div className="text-center mb-8">
          <Motion.img 
            initial={{ rotate: -10, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            src={logoImg}
            alt="Logo"
            className="h-24 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bubble text-scoop-pink">Login</h2>
          <p className="text-gray-400 font-hand text-lg">Digite suas credenciais mágicas</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-500 font-bold mb-2 ml-1 text-sm">USUÁRIO</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type="text" 
                placeholder="admin@scoopsamanda.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-scoop-pink focus:outline-none transition bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-500 font-bold mb-2 ml-1 text-sm">SENHA SECRETA</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-scoop-purple" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-scoop-pink focus:outline-none transition bg-gray-50"
              />
            </div>
            
            <div className="flex justify-end mt-2">
                <Link 
                    to="/forgot-password" 
                    className="text-sm text-scoop-blue hover:text-scoop-pink transition font-medium"
                >
                    Esqueci minha senha
                </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-scoop-pink text-white font-bubble text-xl py-3 rounded-xl hover:bg-pink-500 transition shadow-lg active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
            <span className="text-gray-400">Novo por aqui? </span>
            <Link to="/register" className="text-scoop-blue font-bold hover:underline">Crie sua conta</Link>
        </div>

        <div className="mt-6 text-center">
            <Link to="/" className="text-scoop-blue font-bold flex items-center justify-center gap-2 hover:underline">
                <ArrowLeft size={16} /> Voltar para a Loja
            </Link>
        </div>

        <ErrorModal
          open={showError}
          onClose={() => setShowError(false)}
          title="Acesso negado"
          message={errorMessage}
        />
      </Motion.div>
    </div>
  );
}