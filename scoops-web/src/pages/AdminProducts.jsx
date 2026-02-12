import { useEffect, useState, useCallback } from "react";
import { Trash2, ChevronLeft, ChevronRight, Package, Loader2, AlertTriangle } from "lucide-react";
import { motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Ajustado para refletir a paginação que o .NET está processando
      const res = await api.get(`/products/paged?page=${page}&size=5`);
      
      // O .NET retorna a lista direta no corpo da resposta
      setProducts(res.data);
    } catch (error) {
        console.error("Erro ao buscar produtos", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este anúncio?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert("Erro ao excluir produto.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
        <Navbar />

        <Motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-[95%] mx-auto p-6 mt-6" // Expandido conforme novo design global
        >
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bubble text-scoop-pink drop-shadow-sm">Gestão de Anúncios 📋</h1>

            <div className="bg-scoop-blue/10 text-scoop-blue px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-sm">
                <Package size={20} /> {products.length} itens listados
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white flex flex-col min-h-[500px]">

            {loading ? (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-scoop-pink" size={48} />
            </div>
            ) : (
            <>
                <table className="w-full text-left border-collapse">
                <thead className="bg-scoop-bg text-scoop-purple font-black uppercase text-xs tracking-[0.2em]">
                    <tr>
                        <th className="p-6">Produto</th>
                        <th className="p-6 hidden md:table-cell">Categoria</th>
                        <th className="p-6">Estoque</th> {/* NOVA COLUNA */}
                        <th className="p-6">Preço</th>
                        <th className="p-4 text-center">Ações</th>
                    </tr>
                </thead>

                <Motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                    {products.map(p => (
                    <Motion.tr 
                        key={p.id} 
                        variants={rowVariants} 
                        className="border-b border-gray-50 hover:bg-scoop-bg/30 transition-colors group"
                    >
                        <td className="p-6 flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-[1.2rem] overflow-hidden shadow-md border-2 border-white bg-gray-50 shrink-0">
                                {/* Adicionado encodeURI para prevenir 404 em imagens */}
                                <img 
                                    src={p.imageUrl ? encodeURI(p.imageUrl) : ""} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                    alt={p.name} 
                                />
                            </div>
                            <span className="font-black text-gray-700 text-lg">{p.name}</span>
                        </td>

                        <td className="p-6 hidden md:table-cell">
                            <span className="bg-white text-scoop-purple text-[10px] font-black px-3 py-1 rounded-full uppercase border border-scoop-purple/20">
                                {p.category}
                            </span>
                        </td>

                        {/* EXIBIÇÃO DO ESTOQUE COM CORES DINÂMICAS */}
                        <td className="p-6">
                            <div className={`flex items-center gap-2 font-black ${
                                p.stockQuantity <= 0 ? 'text-red-500' : 
                                p.stockQuantity <= 5 ? 'text-orange-500' : 'text-green-500'
                            }`}>
                                {p.stockQuantity <= 0 && <AlertTriangle size={16} className="animate-pulse" />}
                                {p.stockQuantity} un
                            </div>
                        </td>

                        <td className="p-6 font-black text-scoop-pink text-xl tracking-tighter">
                            {Number(p.price).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </td>

                        <td className="p-6 text-center">
                            <button
                                disabled={deletingId === p.id}
                                onClick={() => handleDelete(p.id)}
                                className="p-3 rounded-2xl text-red-300 hover:bg-red-500 hover:text-white transition-all active:scale-90 disabled:opacity-50 shadow-sm hover:shadow-red-200"
                                title="Excluir"
                            >
                                {deletingId === p.id ? <Loader2 size={24} className="animate-spin" /> : <Trash2 size={24} />}
                            </button>
                        </td>
                    </Motion.tr>
                    ))}
                </Motion.tbody>
                </table>

                {products.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4 py-20">
                    <Package size={64} className="opacity-10" />
                    <p className="font-hand text-3xl italic">Nenhum anúncio por aqui... ✨</p>
                </div>
                )}
            </>
            )}

            {/* CONTROLES DE PAGINAÇÃO */}
            <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-white mt-auto">
                <button 
                    disabled={page === 0 || loading} 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    className="flex items-center gap-2 font-black text-scoop-blue disabled:text-gray-200 transition-all hover:-translate-x-2"
                >
                    <ChevronLeft size={24} /> ANTERIOR
                </button>

                <div className="bg-scoop-bg px-6 py-2 rounded-2xl border border-gray-50">
                    <span className="font-bubble text-xl text-scoop-purple">
                        Página <strong className="text-scoop-pink">{page + 1}</strong>
                    </span>
                </div>

                <button 
                    disabled={products.length < 5 || loading} 
                    onClick={() => setPage(p => p + 1)}
                    className="flex items-center gap-2 font-black text-scoop-blue disabled:text-gray-200 transition-all hover:translate-x-2"
                >
                    PRÓXIMA <ChevronRight size={24} />
                </button>
            </div>

        </div>
        </Motion.div>
    </div>
  );
}