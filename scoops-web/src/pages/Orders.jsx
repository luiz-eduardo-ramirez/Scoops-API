import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Package, Calendar, Loader2, Camera, Truck, ExternalLink } from "lucide-react";
import api from "../services/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyOrders() {
      try {
        // Endpoint que busca apenas os pedidos do usuário logado
        const response = await api.get("/orders/my-orders");
        // Ordena do mais recente para o mais antigo
        const sorted = response.data.sort((a, b) => b.id - a.id);
        setOrders(sorted);
      } catch (err) {
        console.error("Erro ao buscar meus pedidos", err);
      } finally {
        setLoading(false);
      }
    }
    loadMyOrders();
  }, []);

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  
  const formatDate = (dateString) => new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

  const getStatusColor = (status) => {
    switch(status) {
        case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
        case 'CANCELED': return 'bg-red-100 text-red-700 border-red-200';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />
          
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bubble text-gray-700 mb-6 flex items-center gap-2">
            <Package className="text-scoop-blue" /> Meus Pedidos
        </h1>

        {loading ? (
           <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-scoop-blue" size={48} /></div>
        ) : orders.length === 0 ? (
           <div className="text-center py-10 bg-white rounded-xl shadow-sm">
               <p className="text-gray-500 text-lg">Você ainda não fez nenhum pedido!</p>
           </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-gray-50 pb-4">
                    <div>
                        <span className="font-bold text-lg text-scoop-blue block">Pedido #{order.id}</span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(order.moment)}
                        </span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {order.status === 'PENDING' ? 'Aguardando Pagamento' : 
                             order.status === 'PAID' ? 'Pago / Em Preparo' : 
                             order.status === 'CANCELED' ? 'Cancelado' : order.status}
                        </span>
                        <span className="font-bubble text-xl text-gray-700 mt-1">
                            {formatCurrency(order.total ?? 0)}
                        </span>
                    </div>
                </div>

                {/* Lista de Itens (Resumida) */}
                <div className="text-sm text-gray-600 mb-4">
                    {order.items.map(item => (
                        <div key={item.productId} className="flex justify-between border-b border-dotted border-gray-100 py-1">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">{formatCurrency(item.price)}</span>
                        </div>
                    ))}
                </div>

                {/* --- ÁREA DOS BOTÕES ESPECIAIS (INSTA & RASTREIO) --- */}
                {/* Só exibe essa área se houver pelo menos um link cadastrado pelo Admin */}
                {(order.instagramReelUrl || order.trackingUrl) && (
                    <div className="bg-blue-50 p-4 rounded-lg flex flex-wrap gap-3 items-center mt-4 border border-blue-100">
                        <span className="text-sm font-bold text-blue-800 mr-2">Acompanhe seu pedido:</span>
                        
                        {/* Botão Instagram */}
                        {order.instagramReelUrl && (
                            <button 
                                onClick={() => window.open(order.instagramReelUrl, '_blank')}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm hover:scale-105 transition-transform"
                                style={{ background: 'linear-gradient(45deg, #f09433 0%, #dc2743 50%, #bc1888 100%)' }}
                            >
                                <Camera size={16} /> Ver Preparo no Insta
                            </button>
                        )}

                        {/* Botão Rastreio */}
                        {order.trackingUrl && (
                            <button 
                                onClick={() => window.open(order.trackingUrl, '_blank')}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-green-500 shadow-sm hover:bg-green-600 hover:scale-105 transition-transform"
                            >
                                <Truck size={16} /> Rastrear Entrega
                            </button>
                        )}
                    </div>
                )}
                
                {/* Se não tiver links ainda */}
                {(!order.instagramReelUrl && !order.trackingUrl && order.status === 'PAID') && (
                    <div className="mt-4 text-xs text-gray-400 italic flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin"/> Aguardando envio ou link de vídeo...
                    </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}