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
  
  // --- Estados de Paginação e Filtro ---
  const [page, setPage] = useState(0);
  const [size] = useState(6); // 6 produtos por página fica ótimo no grid
  const [category, setCategory] = useState("Todas");

  // Lista de categorias (Pode vir de uma API no futuro)
  const categories = ["Todas", "Scoops", "Beleza", "Acessórios", "Papelaria"];

  useEffect(() => {
    fetchProducts();
  }, [page, category]); // Recarrega sempre que mudar a página ou a categoria

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Usamos o endpoint paged que configuramos no Backend
      const response = await api.get(`/products/paged?page=${page}&size=${size}`);
      
      let data = response.data;

      // Filtro no Frontend (para simplicidade, ou você pode passar a categoria via query se o backend suportar)
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

        {/* --- FILTROS DE CATEGORIA --- */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(0); }}
              className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm ${
                category === cat 
                ? "bg-scoop-pink text-white scale-105 shadow-pink-200" 
                : "bg-white text-scoop-purple hover:bg-scoop-blue/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

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
            <p className="text-xl font-hand">Nenhum scoop disponível nesta categoria... 😢</p>
          </Motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-white rounded-xl shadow-sm disabled:opacity-30 hover:bg-gray-50 transition font-bold text-scoop-purple"
              >
                Anterior
              </button>
              
              <span className="font-bubble text-scoop-pink text-xl">
                {page + 1}
              </span>

              <button
                disabled={products.length < size} // Se veio menos que o 'size', é a última página
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-white rounded-xl shadow-sm disabled:opacity-30 hover:bg-gray-50 transition font-bold text-scoop-purple"
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