import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Mantenha os imports corretos
import { ShoppingBag, Star, Loader2, XCircle } from "lucide-react";
import { motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function ProductDetails() {
  // ... (mantenha toda a lógica de estado e hooks igual) ...
  const { id } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [scoops, setScoops] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
       .then(res => {
         setProduct(res.data);
         setSelectedImage(res.data.imageUrl ? encodeURI(res.data.imageUrl) : "");
       })
       .catch(err => console.error("Erro ao carregar produto", err))
       .finally(() => setLoading(false));
  }, [id]);

  const images = product ? [
    product.imageUrl ? encodeURI(product.imageUrl) : null,
    product.imageUrl2 ? encodeURI(product.imageUrl2) : null,
    product.imageUrl3 ? encodeURI(product.imageUrl3) : null
  ].filter(Boolean) : [];

  const handleBuy = () => {
    // ... (mantenha a lógica de compra igual) ...
    let finalPrice = product.price;
    if (product.category === "Scoops") {
        if(scoops === 1) finalPrice = 60.00;
        if(scoops === 2) finalPrice = 110.00;
        if(scoops === 3) finalPrice = 150.00;
    }

    addToCart({ 
        id: product.id, 
        name: product.name, 
        price: finalPrice, 
        image: selectedImage 
    }, 1, product.category === "Scoops" ? `${scoops}x Scoops` : "Padrão");
    
    setIsCartOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-scoop-bg"><Loader2 className="animate-spin text-scoop-pink" size={48}/></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-hand text-2xl">Produto não encontrado 😢</div>;

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />
      
      {/* AJUSTE 1: Limitei a largura máxima para max-w-6xl (antes era max-w-[95%]) */}
      <main className="max-w-6xl mx-auto p-4 mt-8">
        
        <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-2 border-white p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
            {/* GALERIA */}
            <div className="flex flex-col gap-4">
                <Motion.div 
                    key={selectedImage}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    /* AJUSTE 2: Altura máxima definida e object-contain para não cortar */
                    className="w-full aspect-square max-h-[450px] rounded-[2rem] overflow-hidden bg-gray-50 border-2 border-gray-50 shadow-inner flex items-center justify-center"
                >
                    <img 
                        src={selectedImage} 
                        alt={product.name} 
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" 
                    />
                </Motion.div>

                {/* Miniaturas mais compactas */}
                <div className="flex gap-3 justify-center">
                    {images.map((img, index) => (
                        <button 
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? 'border-scoop-pink scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="miniatura" />
                        </button>
                    ))}
                </div>
            </div>

            {/* DETALHES - Layout mais limpo */}
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <span className="bg-scoop-pink/10 text-scoop-pink text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                        {product.category}
                    </span>
                    
                    {product.stockQuantity > 0 ? (
                        <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Disponível
                        </span>
                    ) : (
                        <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                            Esgotado
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-5xl font-bubble text-gray-800 mb-4 leading-tight">
                    {product.name}
                </h1>
                
                <p className="text-gray-500 font-hand text-lg md:text-xl leading-relaxed mb-8">
                    {product.description}
                </p>

                {product.category === "Scoops" && (
                    <div className="mb-8 p-5 bg-scoop-pink/5 rounded-2xl border border-scoop-pink/10">
                        <span className="block text-xs font-black text-scoop-purple/60 mb-3 uppercase tracking-tighter">
                            Escolha o seu combo:
                        </span>
                        <div className="flex gap-3">
                            {[1, 2, 3].map(qtd => (
                                <button
                                    key={qtd}
                                    onClick={() => setScoops(qtd)}
                                    className={`flex-1 py-3 rounded-xl font-black text-base transition-all duration-300 ${scoops === qtd ? 'bg-scoop-pink text-white shadow-lg scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:text-scoop-pink'}`}
                                >
                                    {qtd}x
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col xl:flex-row items-center gap-6 justify-between">
                    <div className="text-center xl:text-left">
                        <span className="block text-gray-400 text-[10px] font-black uppercase mb-1">Investimento Total</span>
                        <span className={`text-4xl md:text-5xl font-black tracking-tighter ${product.stockQuantity > 0 ? 'text-scoop-pink' : 'text-gray-300'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                product.category === "Scoops" 
                                    ? (scoops === 1 ? 60 : scoops === 2 ? 110 : 150)
                                    : product.price
                            )}
                        </span>
                    </div>

                    {product.stockQuantity > 0 ? (
                        <button 
                            onClick={handleBuy}
                            className="w-full xl:w-auto bg-scoop-blue hover:bg-scoop-pink text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-pink-200 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            <ShoppingBag size={20} />
                            Pegar Agora!
                        </button>
                    ) : (
                        <div className="w-full xl:w-auto bg-gray-100 text-gray-400 font-black text-lg px-8 py-4 rounded-2xl border-2 border-gray-200 flex items-center justify-center gap-3 cursor-not-allowed select-none">
                            <XCircle size={20} />
                            ESTOQUE INDISPONÍVEL
                        </div>
                    )}
                </div>
            </div>
        </Motion.div>
      </main>
    </div>
  );
}