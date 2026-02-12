import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingBag, Star, Loader2 } from "lucide-react";
import { motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function ProductDetails() {
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
         // Aplicamos o encodeURI na imagem inicial
         setSelectedImage(res.data.imageUrl ? encodeURI(res.data.imageUrl) : "");
       })
       .catch(err => console.error("Erro ao carregar produto", err))
       .finally(() => setLoading(false));
  }, [id]);

  // Lista de imagens com encodeURI aplicado em todas
  const images = product ? [
    product.imageUrl ? encodeURI(product.imageUrl) : null,
    product.imageUrl2 ? encodeURI(product.imageUrl2) : null,
    product.imageUrl3 ? encodeURI(product.imageUrl3) : null
  ].filter(Boolean) : [];

  const handleBuy = () => {
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-scoop-bg">
      <Loader2 className="animate-spin text-scoop-pink" size={48}/>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-hand text-2xl">
      Produto não encontrado 😢
    </div>
  );

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />
      <main className="max-w-[95%] mx-auto p-4 mt-8"> {/* Ajustado para nova margem do site */}
        <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-2 border-white p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12"
        >
            {/* GALERIA */}
            <div className="flex flex-col gap-6">
                <Motion.div 
                    key={selectedImage}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="aspect-square rounded-[2rem] overflow-hidden bg-scoop-bg border-2 border-gray-50 shadow-inner"
                >
                    <img 
                        src={selectedImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" 
                    />
                </Motion.div>

                <div className="flex gap-4 justify-center">
                    {images.map((img, index) => (
                        <button 
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? 'border-scoop-pink scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="miniatura" />
                        </button>
                    ))}
                </div>
            </div>

            {/* DETALHES */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <span className="bg-scoop-pink/10 text-scoop-pink text-sm font-black px-6 py-2 rounded-full uppercase tracking-widest">
                        {product.category}
                    </span>
                    <div className="flex text-yellow-400 gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bubble text-gray-800 mb-6 leading-tight">
                    {product.name}
                </h1>
                
                <p className="text-gray-500 font-hand text-2xl leading-relaxed mb-10">
                    {product.description}
                </p>

                {product.category === "Scoops" && (
                    <div className="mb-10 p-6 bg-scoop-pink/5 rounded-3xl border border-scoop-pink/10">
                        <span className="block text-xs font-black text-scoop-purple/60 mb-4 uppercase tracking-tighter">
                            Escolha o seu combo:
                        </span>
                        <div className="flex gap-4">
                            {[1, 2, 3].map(qtd => (
                                <button
                                    key={qtd}
                                    onClick={() => setScoops(qtd)}
                                    className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all duration-300 ${scoops === qtd ? 'bg-scoop-pink text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:text-scoop-pink'}`}
                                >
                                    {qtd}x
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center gap-8 justify-between">
                    <div>
                        <span className="block text-gray-400 text-xs font-black uppercase mb-1">Investimento Total</span>
                        <span className="text-5xl font-black text-scoop-pink tracking-tighter">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                product.category === "Scoops" 
                                    ? (scoops === 1 ? 60 : scoops === 2 ? 110 : 150)
                                    : product.price
                            )}
                        </span>
                    </div>

                    <button 
                        onClick={handleBuy}
                        className="w-full sm:w-auto bg-scoop-blue hover:bg-scoop-pink text-white font-black text-xl px-12 py-5 rounded-[2rem] shadow-2xl hover:shadow-pink-200 transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 uppercase tracking-widest"
                    >
                        <ShoppingBag size={24} />
                        Pegar Agora!
                    </button>
                </div>
            </div>
        </Motion.div>
      </main>
    </div>
  );
}