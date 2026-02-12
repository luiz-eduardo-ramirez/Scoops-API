import { ShoppingCart, LogOut, ShoppingBag, ClipboardList, Package, Settings, Plus, Truck, History  } from "lucide-react"; 
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
      {/* Ajuste: px-6 para px-4 e py-3 para py-2 para focar na altura da logo */}
      <nav className="bg-white shadow-md py-2 px-4 sticky top-0 z-30">
        
        {/* AJUSTE DE MARGEM: Mudamos de max-w-7xl para max-w-[98%] para ocupar a tela toda */}
        <div className="max-w-[98%] mx-auto flex justify-between items-center">
          
          {/* Logo - AJUSTE DE TAMANHO: h-12 -> h-20 */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-20 sm:h-24 w-auto group-hover:rotate-6 transition duration-300 object-contain" 
            />
            {/* Aumentamos o texto da logo também para acompanhar */}
            <span className="text-3xl font-bubble text-scoop-pink hidden lg:block">
                Scoops da Amanda
            </span>
          </Link>

          {/* Ações */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Botão Carrinho */}
            <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-scoop-blue transition p-2"
            >
              <ShoppingCart size={32} /> {/* Ícone um pouco maior */}
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-scoop-pink text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Menu de Usuário */}
            {token ? (
              <div className="flex items-center gap-1 sm:gap-2">
                
                {role === "ADMIN" ? (
                  <div className="flex flex-wrap justify-end gap-1">
                    {/* Botão Novo Produto */}
                    <Link to="/admin" className={btnStyle} title="Cadastrar Novo">
                      <Plus size={18} />
                      <span className="hidden xl:inline">Novo</span>
                    </Link>

                     {/* Botão Gestão */}
                    <Link to="/admin-products" className={managementBtnStyle} title="Gerenciar Estoque">
                      <Settings size={18} />
                      <span className="hidden xl:inline">Gestão</span>
                    </Link>

                    {/* Botão Pedidos */}
                    <Link to="/admin-orders" className={btnStyle} title="Ver Pedidos">
                      <Package size={18} />
                      <span className="hidden xl:inline">Pedidos</span>
                    </Link>

                    {/* Botão Fornecedores */}
                    <Link to="/admin-suppliers" className={btnStyle} title="Gerenciar Fornecedores">
                      <Truck size={18} />
                      <span className="hidden xl:inline">Fornecedores</span>
                    </Link>

                    {/* Botão Entregas */}
                    <Link to="/admin-deliveries" className={btnStyle} title="Registro de Entregas">
                      <ClipboardList size={18} />
                      <span className="hidden xl:inline">Entregas</span>
                    </Link>
                    
                    {/* Botão Histórico */}
                    <Link to="/admin-deliveries-history" className={btnStyle} title="Histórico de Entradas">
                      <History size={18} />
                      <span className="hidden xl:inline">Histórico</span>
                    </Link>
                  </div>
                ) : (
                  <Link to="/orders" className={btnStyle}>
                    <ShoppingBag size={18} />
                    <span className="hidden sm:inline">Meus Pedidos</span>
                  </Link>
                )}

                <button onClick={handleLogout} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition ml-1" title="Sair">
                  <LogOut size={22} /> 
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-scoop-blue text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-500 transition shadow-md text-base active:scale-95">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};