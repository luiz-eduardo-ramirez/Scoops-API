import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, totalValue } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose(); // Fecha o menu
    navigate("/checkout"); // Vai pro checkout
  };

  return (
    <>
      {/* Fundo Escuro (Overlay) - Clica para fechar */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* A Coluna Lateral (Esquerda) */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Cabeçalho */}
        <div className="p-5 bg-scoop-pink text-white flex justify-between items-center shadow-md">
          <h2 className="font-bubble text-xl flex items-center gap-2">
            <ShoppingBag size={20} /> Sua Sacola
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Lista de Itens (Scrollável) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <ShoppingBag size={48} className="mx-auto mb-2 opacity-30" />
              <p>Sua sacola está vazia!</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                {/* Imagem Pequena */}
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Detalhes */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-700 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-400">{item.option}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-scoop-blue font-bold text-sm">
                        {item.quantity}x R$ {item.price}
                    </span>
                    <button 
                        onClick={() => removeFromCart(item.id, item.option)}
                        className="text-red-400 hover:text-red-600 transition p-1"
                        title="Remover item"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé (Total e Botão) */}
        <div className="p-5 border-t border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold">Total</span>
            <span className="text-2xl font-bubble text-scoop-pink">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
            </span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition shadow-lg flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Finalizar Compra <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </>
  );
}