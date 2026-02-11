import { ShoppingCart, LogOut, ShoppingBag, ClipboardList, Package, Settings, Plus } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("scoops_token");
  const role = localStorage.getItem("scoops_role");

  const handleLogout = () => {
    localStorage.removeItem("scoops_token");
    localStorage.removeItem("scoops_role");
    navigate("/login");
  };

  // Estilos padronizados para os botões
  const btnStyle = "flex items-center gap-2 px-4 py-2 rounded-full font-bold transition hover:scale-105 shadow-sm bg-scoop-blue/10 text-scoop-blue hover:bg-scoop-blue hover:text-white text-sm sm:text-base";
  
  // Estilo especial para o botão de Gestão (roxo)
  const managementBtnStyle = "flex items-center gap-2 px-4 py-2 rounded-full font-bold transition hover:scale-105 shadow-sm bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white text-sm sm:text-base";

  return (
    <>
      <nav className="bg-white shadow-md py-3 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Logo" className="h-12 group-hover:rotate-6 transition duration-300" />
            <span className="text-2xl font-bubble text-scoop-pink hidden sm:block">Scoops da Amanda</span>
          </Link>

          {/* Ações */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Botão Carrinho */}
            <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-scoop-blue transition p-1"
            >
              <ShoppingCart size={28} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-scoop-pink text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Menu de Usuário */}
            {token ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {role === "ADMIN" ? (
                  <>
                    {/* Botão Novo Produto */}
                    <Link to="/admin" className={btnStyle} title="Cadastrar Novo">
                      <Plus size={18} />
                      <span className="hidden lg:inline">Novo</span>
                    </Link>

                    {/* Botão Gestão (NOVO) */}
                    <Link to="/admin-products" className={managementBtnStyle} title="Gerenciar Estoque">
                      <Settings size={18} />
                      <span className="hidden md:inline">Gestão</span>
                    </Link>

                    {/* Botão Pedidos */}
                    <Link to="/admin-orders" className={btnStyle} title="Ver Pedidos">
                      <Package size={18} />
                      <span className="hidden lg:inline">Pedidos</span>
                    </Link>
                  </>
                ) : (
                  <Link to="/orders" className={btnStyle}>
                    <ShoppingBag size={18} />
                    <span className="hidden sm:inline">Meus Pedidos</span>
                  </Link>
                )}

                <button onClick={handleLogout} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition ml-1" title="Sair">
                  <LogOut size={20} /> 
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-scoop-blue text-white px-6 py-2 rounded-full font-bold hover:bg-cyan-500 transition shadow-md text-sm active:scale-95">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}