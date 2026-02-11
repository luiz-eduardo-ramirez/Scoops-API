import { useEffect, useState, useCallback } from "react";
import { Trash2, ChevronLeft, ChevronRight, Package, Loader2 } from "lucide-react";
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
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // O .NET retorna uma lista direta, não um objeto "Page" do Spring
      // Se quiser paginação real, teríamos que ajustar o Controller do .NET
      // Para o MVP, o endpoint retorna a lista toda se não passar params
      const res = await api.get(`/products?page=${page}&size=5`);
      
      // Ajuste: O .NET retorna a lista direto, ou precisamos ver como ficou o Controller
      // Se o Controller retorna List<Product>, então res.data É a lista.
      setProducts(res.data); 
      setTotalPages(1); // Simplificação para o MVP
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
            className="max-w-5xl mx-auto p-6 mt-6"
        >
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bubble text-scoop-pink drop-shadow-sm">Gestão de Anúncios 📋</h1>

            <div className="bg-scoop-blue/10 text-scoop-blue px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm">
                <Package size={18} /> {products.length} nesta página
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white flex flex-col min-h-[400px]">

            {loading ? (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-scoop-pink" size={48} />
            </div>
            ) : (
            <>
                <table className="w-full text-left border-collapse">
                <thead className="bg-scoop-bg text-scoop-purple font-bold uppercase text-sm tracking-wider">
                    <tr>
                        <th className="p-4">Produto</th>
                        <th className="p-4 hidden sm:table-cell">Categoria</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4 text-center">Ações</th>
                    </tr>
                </thead>

                <Motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                    {products.map(p => (
                    <Motion.tr 
                        key={p.id} 
                        variants={rowVariants} 
                        className="border-b border-gray-100 hover:bg-scoop-bg/20 transition-colors"
                    >
                        <td className="p-4 flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 shrink-0">
                                <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.name} />
                            </div>
                            <span className="font-bold text-gray-700 line-clamp-1">{p.name}</span>
                        </td>

                        <td className="p-4 hidden sm:table-cell">
                            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-md uppercase">
                                {p.category}
                            </span>
                        </td>

                        <td className="p-4 font-bold text-scoop-pink">
                            {Number(p.price).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </td>

                        <td className="p-4 text-center">
                            <button
                                disabled={deletingId === p.id}
                                onClick={() => handleDelete(p.id)}
                                className="p-2 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition active:scale-90 disabled:opacity-50"
                                title="Excluir"
                            >
                                {deletingId === p.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                            </button>
                        </td>
                    </Motion.tr>
                    ))}
                </Motion.tbody>
                </table>

                {products.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2">
                    <Package size={48} className="opacity-20" />
                    <p className="font-hand text-xl">Nenhum anúncio encontrado</p>
                </div>
                )}
            </>
            )}

            {/* CONTROLES DE PAGINAÇÃO */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 mt-auto">
                <button 
                    disabled={page === 0 || loading} 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    className="flex items-center gap-1 font-bold text-scoop-blue disabled:text-gray-300 transition hover:-translate-x-1 disabled:hover:translate-x-0"
                >
                    <ChevronLeft size={18} /> Anterior
                </button>

                <span className="font-hand text-lg text-gray-500">
                    Página <strong className="text-scoop-pink font-sans">{page + 1}</strong> de {totalPages || 1}
                </span>

                <button 
                    disabled={page + 1 >= totalPages || loading} 
                    onClick={() => setPage(p => p + 1)}
                    className="flex items-center gap-1 font-bold text-scoop-blue disabled:text-gray-300 transition hover:translate-x-1 disabled:hover:translate-x-0"
                >
                    Próxima <ChevronRight size={18} />
                </button>
            </div>

        </div>
        </Motion.div>
    </div>
  );
}