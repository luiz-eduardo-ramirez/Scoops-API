import { createContext, useState } from "react";

// O Linter reclama de exportar Contexto e Componente juntos, 
// mas para projetos pequenos isso é aceitável.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // --- CORREÇÃO AQUI ---
  // Inicialização "Preguiçosa": O React roda essa função APENAS na primeira vez.
  // Já lemos o token direto na inicialização, sem precisar de useEffect.
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("scoops_token");
    const role = localStorage.getItem("scoops_role");

    if (token) {
      return { token, role };
    }
    return null;
  });

  const login = (token, role) => {
    localStorage.setItem("scoops_token", token);
    localStorage.setItem("scoops_role", role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem("scoops_token");
    localStorage.removeItem("scoops_role");
    setUser(null);
    window.location.href = "/login"; 
  };

  return (
    // Removemos o "loading" porque a leitura agora é instantânea
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};