import { useState } from "react";
import { 
  ShoppingCart, LogOut, ShoppingBag, ClipboardList, Package, 
  Settings, Plus, Truck, History, LayoutDashboard, ChevronDown, Menu 
} from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("scoops_token");
  const role = localStorage.getItem("scoops_role");

  // Estado para controlar o menu dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("scoops_token");
    localStorage.removeItem("scoops_role");
    navigate("/login");
  };

  const btnStyle = "flex items-center gap-2 px-4 py-2 rounded-full font-bold transition hover:scale-105 shadow-sm bg-scoop-blue/10 text-scoop-blue hover:bg-scoop-blue hover:text-white text-sm whitespace-nowrap";
  const primaryBtnStyle = "flex items-center gap-2 px-5 py-2 rounded-full font-bold transition hover:scale-105 shadow-md bg-scoop-pink text-white hover:bg-pink-600 text-sm whitespace-nowrap";

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md shadow-sm py-2 px-4 sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-[98%] mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-16 sm:h-20 w-auto group-hover:rotate-6 transition duration-300 object-contain" 
            />
            <span className="text-2xl lg:text-3xl font-bubble text-scoop-pink hidden lg:block">
                Scoops da Amanda
            </span>
          </Link>

          {/* ÁREA DIREITA */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Carrinho (Sempre visível) */}
            <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-500 hover:text-scoop-blue transition p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart size={28} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-scoop-pink text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md border-2 border-white">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Menu de Usuário */}
            {token ? (
              <div className="flex items-center gap-2">
                
                {role === "ADMIN" ? (
                  <>
                    {/* Botões Principais (Sempre visíveis em telas grandes) */}
                    <div className="hidden xl:flex items-center gap-2">
                        <Link to="/admin-dashboard" className={primaryBtnStyle} title="Visão Geral">
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        
                        <Link to="/admin-orders" className={btnStyle} title="Ver Pedidos">
                            <Package size={18} /> Pedidos
                        </Link>

                        <Link to="/admin-products" className={btnStyle} title="Estoque">
                            <Settings size={18} /> Produtos
                        </Link>
                    </div>

                    {/* Menu Dropdown para opções secundárias (ou mobile) */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition border border-gray-200"
                        >
                            <Menu size={20} />
                            <span className="hidden sm:inline text-sm">Mais</span>
                            <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <>
                                    {/* Overlay invisível para fechar ao clicar fora */}
                                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                                    
                                    <Motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 flex flex-col gap-1"
                                    >
                                        <div className="xl:hidden border-b border-gray-100 pb-2 mb-2">
                                            <Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-scoop-pink/10 hover:text-scoop-pink rounded-xl text-gray-600 font-bold text-sm">
                                                <LayoutDashboard size={18} /> Dashboard
                                            </Link>
                                            <Link to="/admin-orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-scoop-pink/10 hover:text-scoop-pink rounded-xl text-gray-600 font-bold text-sm">
                                                <Package size={18} /> Pedidos
                                            </Link>
                                            <Link to="/admin-products" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-scoop-pink/10 hover:text-scoop-pink rounded-xl text-gray-600 font-bold text-sm">
                                                <Settings size={18} /> Produtos
                                            </Link>
                                        </div>

                                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-scoop-blue/10 hover:text-scoop-blue rounded-xl text-gray-600 font-bold text-sm transition-colors">
                                            <Plus size={18} /> Novo Produto
                                        </Link>

                                        <Link to="/admin-deliveries" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-scoop-blue/10 hover:text-scoop-blue rounded-xl text-gray-600 font-bold text-sm transition-colors">
                                            <ClipboardList size={18} /> Nova Entrada
                                        </Link>

                                        <Link to="/admin-suppliers" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-scoop-blue/10 hover:text-scoop-blue rounded-xl text-gray-600 font-bold text-sm transition-colors">
                                            <Truck size={18} /> Fornecedores
                                        </Link>
                                        
                                        <Link to="/admin-deliveries-history" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-scoop-blue/10 hover:text-scoop-blue rounded-xl text-gray-600 font-bold text-sm transition-colors">
                                            <History size={18} /> Histórico Entradas
                                        </Link>
                                        
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-50 hover:text-red-500 rounded-xl text-red-400 font-bold text-sm transition-colors">
                                                <LogOut size={18} /> Sair do Sistema
                                            </button>
                                        </div>
                                    </Motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                  </>
                ) : (
                  // MENU CLIENTE (Mais simples)
                  <div className="flex items-center gap-3">
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold bg-white border border-gray-200 text-gray-600 hover:border-scoop-pink hover:text-scoop-pink transition shadow-sm text-sm">
                        <ShoppingBag size={18} />
                        <span className="hidden sm:inline">Meus Pedidos</span>
                      </Link>
                      
                      <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 p-2 transition" title="Sair">
                        <LogOut size={20} /> 
                      </button>
                  </div>
                )}

              </div>
            ) : (
              <Link to="/login" className="bg-scoop-blue text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-500 transition shadow-lg hover:shadow-cyan-200/50 text-sm active:scale-95">
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