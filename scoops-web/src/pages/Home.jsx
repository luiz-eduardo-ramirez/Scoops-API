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
  const [page, setPage] = useState(0);
  const [size] = useState(8); // Aumentamos para 8 para preencher melhor o grid de 4 colunas
  const [category, setCategory] = useState("Todas");

  const categories = ["Todas", "Scoops", "Beleza", "Acessórios", "Papelaria"];

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/paged?page=${page}&size=${size}`);
      let data = response.data;

      if (category !== "Todas") {
        data = data.filter(p => p.category === category);
      }

      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-scoop-bg">
      <Navbar />

      {/* AJUSTE: max-w-[95%] para espalhar o conteúdo pelas laterais */}
      <main className="max-w-[95%] mx-auto p-4">
        
        {/* Animação do Cabeçalho - Título Aumentado */}
        <Motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center my-12"
        >
          <h1 className="text-5xl md:text-6xl font-bubble text-scoop-pink drop-shadow-lg mb-4">
            Escolha seu Destino ✨
          </h1>
          <p className="text-scoop-purple font-hand text-2xl mt-2 italic">
            Deixe o universo escolher os melhores itens para você!
          </p>
        </Motion.div>

        {/* --- FILTROS DE CATEGORIA --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(0); }}
              className={`px-8 py-3 rounded-full font-black transition-all duration-300 shadow-md ${
                category === cat 
                ? "bg-scoop-pink text-white scale-110 shadow-pink-200" 
                : "bg-white text-scoop-purple hover:bg-scoop-blue/10 border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
            <div className="flex justify-center mt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-scoop-pink"></div>
            </div>
        ) : products.length === 0 ? (
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center text-gray-400 mt-10"
          >
            <p className="text-2xl font-hand">Nenhum scoop disponível nesta categoria... 😢</p>
          </Motion.div>
        ) : (
          <>
            {/* GRID: 4 colunas em telas grandes (xl) e gap maior para respiro */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              <AnimatePresence mode="wait">
                  {products.map(product => (
                    <Motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard 
                          id={product.id}
                          name={product.name} 
                          price={product.price}
                          image1={product.imageUrl ? encodeURI(product.imageUrl) : null} 
                          description={product.description}
                          category={product.category}
                      />
                    </Motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {/* --- CONTROLES DE PAGINAÇÃO --- */}
            <div className="flex justify-center items-center gap-6 mt-16">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-6 py-3 bg-white rounded-2xl shadow-lg disabled:opacity-30 hover:bg-gray-50 transition-all font-black text-scoop-purple hover:-translate-x-1"
              >
                Anterior
              </button>
              
              <div className="bg-white px-6 py-3 rounded-2xl shadow-inner border border-gray-50">
                <span className="font-bubble text-scoop-pink text-2xl">
                    {page + 1}
                </span>
              </div>

              <button
                disabled={products.length < size}
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-3 bg-white rounded-2xl shadow-lg disabled:opacity-30 hover:bg-gray-50 transition-all font-black text-scoop-purple hover:translate-x-1"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}