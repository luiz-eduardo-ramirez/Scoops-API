import { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, Ban } from "lucide-react"; // Adicionei o ícone Ban
import { useCart } from "../context/CartContext";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  }
};

// 1. ADICIONEI stockQuantity AQUI NAS PROPS
export default function ProductCard({ id, name, price, image1, image2, image3, description, category, stockQuantity }) {
  // console.log(`Produto: ${name} | Estoque: ${stockQuantity}`); // Debug
  
  const [scoopsInBundle, setScoopsInBundle] = useState(1);
  const [currentImage, setCurrentImage] = useState(image1);
  const { addToCart, setIsCartOpen } = useCart();

  // 2. LÓGICA DE ESTOQUE
  const isOutOfStock = stockQuantity <= 0;

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
    // Bloqueia a função se não tiver estoque
    if (isOutOfStock) return;

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
      className={`bg-white rounded-[2.5rem] shadow-xl shadow-pink-100/50 overflow-hidden border-2 transition-all duration-500 hover:-translate-y-3 group flex flex-col h-full relative ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'border-transparent hover:border-scoop-pink/30'}`}
    >
      
      <div className="h-80 bg-scoop-bg relative flex items-center justify-center overflow-hidden">
          
          <Link 
            to={`/product/${id}`} 
            className="w-full h-full flex items-center justify-center"
          >
            <Motion.img 
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={currentImage || image1} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
          </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
            {/* 3. BADGE VISUAL DE ESGOTADO NA IMAGEM */}
            {isOutOfStock ? (
                <div className="bg-gray-800/90 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-md">
                    <Ban size={14} /> Esgotado
                </div>
            ) : category === "Scoops" ? (
                <div className="bg-white/80 backdrop-blur-md text-scoop-purple text-sm font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/50">
                    <Sparkles size={14} /> {scoopsInBundle}x
                </div>
            ) : (
                <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/50">
                    <span className="text-2xl">🎁</span>
                </div>
            )}
        </div>
        
        {!isOutOfStock && (
            <div className="absolute top-4 right-4 bg-scoop-pink/90 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm uppercase tracking-widest">
                {category || "Geral"}
            </div>
        )}
      </div>

      <div className="p-7 flex flex-col flex-1">
        
        <Link to={`/product/${id}`} className="block group-hover:text-scoop-pink transition-colors">
            <h3 className="font-bubble text-3xl text-gray-800 mb-2 leading-tight">{name}</h3>
        </Link>
        
        <p className="font-hand text-gray-500 text-xl leading-relaxed mb-6 line-clamp-2">
          {description}
        </p>

        {/* Esconde opções de combo se estiver esgotado para limpar visualmente */}
        {category === "Scoops" && !isOutOfStock && (
            <div className="mb-6 bg-scoop-pink/5 p-4 rounded-2xl border border-scoop-pink/10">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-scoop-purple/60 font-black uppercase tracking-tighter">Escolha o seu combo:</span>
                </div>
                
                <div className="flex justify-between gap-3">
                    {[1, 2, 3].map((qtd) => (
                        <button
                            key={qtd}
                            onClick={() => {
                                setScoopsInBundle(qtd);
                                if(qtd === 1) setCurrentImage(image1);
                                if(qtd === 2) setCurrentImage(image2 || image1);
                                if(qtd === 3) setCurrentImage(image3 || image1);
                            }}
                            className={`flex-1 py-3 rounded-xl font-black text-base transition-all duration-300 ${
                                scoopsInBundle === qtd 
                                ? "bg-scoop-pink text-white shadow-xl shadow-pink-200 scale-105" 
                                : "bg-white text-gray-400 border border-gray-100 hover:border-scoop-pink/30 hover:text-scoop-pink"
                            }`}
                        >
                            {qtd}x
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-black uppercase">Investimento</span>
            <span className="text-3xl font-black text-scoop-pink tracking-tighter">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getBundlePrice())}
            </span>
          </div>

          {/* 4. BOTÃO COM LÓGICA DE ESTOQUE */}
          <button 
            onClick={handleBuy} 
            disabled={isOutOfStock}
            className={`
                font-black py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl flex items-center gap-2 uppercase text-sm tracking-widest
                ${isOutOfStock 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                    : "bg-scoop-blue text-white hover:bg-scoop-pink shadow-blue-100 hover:shadow-pink-100 active:scale-95"
                }
            `}
          >
            {isOutOfStock ? (
                <>Indisponível</>
            ) : (
                <>
                    <ShoppingBag size={20} />
                    Pegar!
                </>
            )}
          </button>
        </div>
      </div>
    </Motion.div>
  );
}