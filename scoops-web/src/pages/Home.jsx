import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion"; 
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
       .then(response => {
           setProducts(response.data);
           setLoading(false);
       })
       .catch(error => {
           console.error("Erro ao buscar produtos:", error);
           setLoading(false);
       });
  }, []);

  return (
    <div className="min-h-screen pb-10 bg-scoop-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto p-4">
        {/* Animação do Cabeçalho */}
        <Motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center my-8"
        >
          <h1 className="text-4xl font-bubble text-scoop-pink drop-shadow-md">
            Escolha seu Destino ✨
          </h1>
          <p className="text-scoop-purple font-hand text-xl mt-2">
            Deixe o universo escolher os melhores itens para você!
          </p>
        </Motion.div>

        {loading ? (
            <div className="flex justify-center mt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scoop-pink"></div>
            </div>
        ) : products.length === 0 ? (
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center text-gray-400 mt-10"
          >
            <p className="text-xl font-hand">Nenhum scoop disponível no momento... 😢</p>
          </Motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence>
                {products.map(product => (
                <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name} 
                    price={product.price}
                    image1={product.imageUrl ? encodeURI(product.imageUrl) : null} 
                    image2={product.imageUrl2} 
                    image3={product.imageUrl3}
                    description={product.description}
                    category={product.category}
                />
                ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}