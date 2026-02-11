import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // --- CORREÇÃO AQUI ---
  // Iniciamos o estado já sabendo se tem token ou não.
  // Isso evita chamar setStatus dentro do useEffect e causar loop.
  const [status, setStatus] = useState(token ? "verificando" : "erro");
  const [mensagem, setMensagem] = useState(token ? "Aguarde, validando..." : "Token não encontrado.");

  useEffect(() => {
    // Se não tem token, o estado inicial já cuidou disso. Não fazemos nada.
    if (!token) return;

    // Flag para evitar atualização de estado se o componente desmontar
    let mounted = true;

    // Limpeza do LocalStorage
    localStorage.removeItem("scoops_token");
    localStorage.removeItem("scoops_role");

    // Chamada ao Backend
    fetch(`http://localhost:8080/auth/confirm?token=${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(async (response) => {
        // Se o usuário já saiu da tela, não atualiza o estado
        if (!mounted) return;

        if (response.ok) {
            setStatus("sucesso");
            setMensagem("Conta ativada com sucesso! Redirecionando...");
            setTimeout(() => navigate("/login"), 3000);
        } else {
            const text = await response.text();
            setStatus("erro");
            setMensagem(`Erro: ${text || response.statusText}`);
            console.error("Erro do Backend:", text);
        }
    })
    .catch((error) => {
        if (!mounted) return;
        setStatus("erro");
        setMensagem("Erro de conexão. O backend está rodando?");
        console.error("Erro de rede:", error);
    });

    // Função de limpeza (cleanup) do useEffect
    return () => {
        mounted = false;
    };

  }, [token, navigate]);

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#fce7f3' 
    }}>
      <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '20px', 
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
      }}>
        
        <h1 style={{ color: '#be185d', marginBottom: '20px', fontSize: '24px' }}>
            {status === 'verificando' && '⏳ Verificando...'}
            {status === 'sucesso' && '🎉 Conta Ativada!'}
            {status === 'erro' && '❌ Ops!'}
        </h1>

        <p style={{ color: '#666', marginBottom: '20px' }}>
            {mensagem}
        </p>

        {status === 'erro' && (
            <button 
                onClick={() => navigate("/login")}
                style={{
                    backgroundColor: '#be185d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Voltar para Login
            </button>
        )}
      </div>
    </div>
  );
}