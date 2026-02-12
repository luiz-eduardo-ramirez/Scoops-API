import { useEffect, useState } from "react";
import { 
  TrendingUp, ShoppingBag, AlertTriangle, Clock, 
  DollarSign, Package, Award, Loader2 
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (loading) return (
    <div className="min-h-screen bg-scoop-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-scoop-pink" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 mt-8">
        
        {/* Título de Boas-vindas */}
        <Motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
        >
            <h1 className="text-4xl font-bubble text-gray-700">
                Olá, Amanda! 👋
            </h1>
            <p className="text-scoop-purple font-hand text-xl mt-1">
                Aqui está o raio-x da sua loja hoje.
            </p>
        </Motion.div>

        {/* --- GRID DE CARDS PRINCIPAIS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            
            {/* Card Faturamento */}
            <StatsCard 
                title="Faturamento Total" 
                value={formatCurrency(stats?.totalRevenue || 0)} 
                icon={<DollarSign size={24} className="text-green-600"/>}
                bg="bg-green-100"
                border="border-green-200"
                textColor="text-green-800"
            />

            {/* Card Pedidos */}
            <StatsCard 
                title="Total de Pedidos" 
                value={stats?.totalOrders} 
                icon={<ShoppingBag size={24} className="text-blue-600"/>}
                bg="bg-blue-100"
                border="border-blue-200"
                textColor="text-blue-800"
            />

            {/* Card Pendentes */}
            <StatsCard 
                title="Aguardando Pagto." 
                value={stats?.pendingOrders} 
                icon={<Clock size={24} className="text-orange-600"/>}
                bg="bg-orange-100"
                border="border-orange-200"
                textColor="text-orange-800"
            />

            {/* Card Alerta Estoque */}
            <StatsCard 
                title="Estoque Crítico" 
                value={stats?.lowStockCount} 
                icon={<AlertTriangle size={24} className="text-red-600"/>}
                bg="bg-red-100"
                border="border-red-200"
                textColor="text-red-800"
                alert={stats?.lowStockCount > 0}
            />
        </div>

        {/* --- SEGUNDA LINHA: TOP PRODUTOS E GRÁFICO (FUTURO) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Lista de Top Produtos */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-white">
                <h2 className="text-2xl font-bubble text-scoop-pink mb-6 flex items-center gap-2">
                    <Award /> Os Queridinhos ✨
                </h2>
                
                <div className="space-y-4">
                    {stats?.topProducts?.length === 0 ? (
                        <p className="text-gray-400 italic">Nenhuma venda registrada ainda.</p>
                    ) : (
                        stats?.topProducts?.map((prod, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:scale-105 transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-400 shadow-yellow-200 shadow-md' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-scoop-blue'}`}>
                                        {index + 1}
                                    </div>
                                    <span className="font-bold text-gray-700">{prod.name}</span>
                                </div>
                                <span className="text-sm font-black text-scoop-purple bg-white px-3 py-1 rounded-full shadow-sm">
                                    {prod.quantitySold} vendidos
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Card de Atalhos Rápidos */}
            <div className="bg-scoop-blue/10 rounded-[2rem] p-8 border-2 border-scoop-blue/20 flex flex-col justify-center items-center text-center">
                <Package size={64} className="text-scoop-blue mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-scoop-blue mb-2">Precisa repor estoque?</h3>
                <p className="text-gray-600 mb-6">Registre uma nova entrada de produtos agora mesmo.</p>
                <a href="/admin-deliveries" className="bg-scoop-blue text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-scoop-pink transition-colors">
                    Registrar Entrada
                </a>
            </div>

        </div>

      </main>
    </div>
  );
}

// Componente auxiliar para os Cards
function StatsCard({ title, value, icon, bg, border, textColor, alert }) {
    return (
        <Motion.div 
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] border-2 shadow-sm ${bg} ${border} flex flex-col gap-2`}
        >
            <div className="flex justify-between items-start">
                <span className={`font-bold uppercase text-xs tracking-wider opacity-70 ${textColor}`}>{title}</span>
                {icon}
            </div>
            <div className={`text-4xl font-black ${textColor} ${alert ? 'animate-pulse' : ''}`}>
                {value}
            </div>
        </Motion.div>
    );
}