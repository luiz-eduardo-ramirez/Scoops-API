import { useState, useEffect } from "react";
import { Sparkles, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

// Variantes simplificadas e mais robustas
const itemVariants = {
  hidden: { opacity: 0, y: 50 }, // Começa invisível e um pouco para baixo
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  }
};

export default function ProductCard({ id, name, price, image1, image2, image3, description, category }) {
  console.log(`Produto: ${name} | Categoria: ${category} | Preço recebido:`, price);
  const [scoopsInBundle, setScoopsInBundle] = useState(1);
  const [currentImage, setCurrentImage] = useState(image1);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    setCurrentImage(image1);
  }, [image1]);

 const getBundlePrice = () => {
    if (category !== "Scoops") return price;
    
    switch (scoopsInBundle) {
        case 1: return 60.00;
        case 2: return 110.00;
        case 3: return 150.00;
        default: return price;
    }
  };
 

  const handleBuy = () => {
    const finalPrice = getBundlePrice();
    const productData = { id, name, price: finalPrice, image: currentImage };
    const optionName = category === "Scoops" ? `${scoopsInBundle}x Scoops` : "Padrão";

    addToCart(productData, 1, optionName);
    
    if (setIsCartOpen) setIsCartOpen(true);
  };

  return (
    <Motion.div 
      layout 
      variants={itemVariants}
      initial="hidden"
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px" }} 
      className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-transparent hover:border-scoop-blue transition-all duration-300 hover:-translate-y-2 group flex flex-col h-full relative"
    >
      
      {/* Área da Imagem */}
      <div className="h-64 bg-scoop-bg relative flex items-center justify-center overflow-hidden">
          
          <Link 
            to={`/product/${id}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full h-full flex items-center justify-center"
          >
            <Motion.img 
                key={currentImage} // A chave muda, forçando a re-renderização da animação da imagem
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={currentImage || image1} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer" 
            />
          </Link>

        {/* Badges / Etiquetas */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none z-10">
            {category === "Scoops" ? (
                <div className="bg-white/90 text-scoop-purple text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
                    <Sparkles size={12} /> {scoopsInBundle}x
                </div>
            ) : (
                <div className="bg-white/90 p-1 rounded-full shadow-sm backdrop-blur-sm">
                    <span className="text-xl">🎁</span>
                </div>
            )}
        </div>
        
        <div className="absolute top-3 right-3 bg-white/90 text-scoop-purple text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm pointer-events-none z-10">
          <Sparkles size={12} /> {category || "Geral"}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5 flex flex-col flex-1">
        
        <Link 
            to={`/product/${id}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block hover:text-scoop-pink transition-colors duration-300"
        >
            <h3 className="font-bubble text-2xl text-gray-700 mb-1 leading-tight">{name}</h3>
        </Link>
        
        <p className="font-hand text-gray-500 text-lg leading-tight mb-4 line-clamp-3">
          {description}
        </p>

        {category === "Scoops" && (
            <div className="mb-4 bg-scoop-bg p-3 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase">Escolha o combo:</span>
                    {scoopsInBundle === 3 && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            Melhor Oferta! ✨
                        </span>
                    )}
                </div>
                
                <div className="flex justify-between gap-2">
                    {[1, 2, 3].map((qtd) => (
                        <button
                            key={qtd}
                            onClick={() => {
                                setScoopsInBundle(qtd);
                                if(qtd === 1) setCurrentImage(image1);
                                if(qtd === 2) setCurrentImage(image2 || image1);
                                if(qtd === 3) setCurrentImage(image3 || image1);
                            }}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                                scoopsInBundle === qtd 
                                ? "bg-scoop-pink text-white shadow-md scale-105" 
                                : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {qtd}x
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase">Total</span>
            <span className="text-2xl font-bold text-scoop-pink">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getBundlePrice())}
            </span>
          </div>

          <button 
            onClick={handleBuy} 
            className="bg-scoop-blue text-white font-bold py-2 px-4 rounded-xl hover:bg-cyan-500 transition-all shadow-md active:scale-90 flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            ADICIONAR
          </button>
        </div>
      </div>
    </Motion.div>
  );
}