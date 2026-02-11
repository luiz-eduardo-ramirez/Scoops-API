import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. ESTADO DE VISIBILIDADE DO CARRINHO (NOVO) 👁️
  // Isso controla se a sidebar está aberta ou fechada
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. INICIALIZAÇÃO INTELIGENTE DO CARRINHO 🧠
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("scoops_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 3. EFEITO DE PERSISTÊNCIA 💾
  useEffect(() => {
    localStorage.setItem("scoops_cart", JSON.stringify(cart));
  }, [cart]);

  // --- Funções do Carrinho ---

  const addToCart = (product, quantity = 1, option = "Padrão") => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.option === option
      );

      if (itemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[itemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity, option }];
      }
    });

    // Opcional: Se quiser que o carrinho abra AUTOMATICAMENTE sempre que adicionar algo,
    // descomente a linha abaixo:
     setIsCartOpen(true); 
  };

  const removeFromCart = (productId, option) => {
    setCart((prevCart) => 
      prevCart.filter((item) => !(item.id === productId && item.option === option))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        totalValue,
        // Exportando o controle de visibilidade
        isCartOpen, 
        setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);