import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para pegar o ID da URL
import { ShoppingBag, Star, ArrowLeft, Loader2 } from "lucide-react";
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
  const [scoops, setScoops] = useState(1); // Quantidade selecionada

  useEffect(() => {
    api.get(`/products/${id}`)
       .then(res => {
         setProduct(res.data);
         setSelectedImage(res.data.imageUrl); // Define a primeira foto como padrão
       })
       .catch(err => console.error("Erro ao carregar produto", err))
       .finally(() => setLoading(false));
  }, [id]);

  // Lista de imagens disponíveis (filtra as que não existem)
  const images = product ? [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean) : [];

  const handleBuy = () => {
    // Lógica de preço dinâmico se for Scoop
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
  if (!product) return <div className="min-h-screen flex items-center justify-center">Produto não encontrado 😢</div>;

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />

      <main className="max-w-6xl mx-auto p-4 mt-8">
        <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-white p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10"
        >
            {/* 📸 COLUNA DA ESQUERDA: GALERIA */}
            <div className="flex flex-col gap-4">
                <Motion.div 
                    key={selectedImage}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-gray-100"
                >
                    <img src={selectedImage} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </Motion.div>

                {/* Miniaturas */}
                <div className="flex gap-4 justify-center">
                    {images.map((img, index) => (
                        <button 
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-scoop-pink scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* 📝 COLUNA DA DIREITA: DETALHES */}
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-scoop-blue/10 text-scoop-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.category}
                    </span>
                    <div className="flex text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bubble text-gray-800 mb-4">{product.name}</h1>
                
                <p className="text-gray-500 font-hand text-xl leading-relaxed mb-8">
                    {product.description}
                </p>

                {/* Seletor se for Scoop */}
                {product.category === "Scoops" && (
                    <div className="mb-8">
                        <span className="block text-sm font-bold text-gray-400 mb-2 uppercase">Escolha o tamanho:</span>
                        <div className="flex gap-3">
                            {[1, 2, 3].map(qtd => (
                                <button
                                    key={qtd}
                                    onClick={() => setScoops(qtd)}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all ${scoops === qtd ? 'bg-scoop-pink text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                >
                                    {qtd}x
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div>
                        <span className="block text-gray-400 text-sm font-bold">PREÇO TOTAL</span>
                        <span className="text-4xl font-bold text-scoop-pink">
                            {product.category === "Scoops" 
                                ? (scoops === 1 ? "R$ 60,00" : scoops === 2 ? "R$ 110,00" : "R$ 150,00")
                                : `R$ ${product.price}`
                            }
                        </span>
                    </div>

                    <button 
                        onClick={handleBuy}
                        className="w-full md:w-auto bg-scoop-blue hover:bg-cyan-500 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-cyan-200/50 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <ShoppingBag />
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </Motion.div>
      </main>
    </div>
  );
}