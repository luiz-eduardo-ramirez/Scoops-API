import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { 
    ClipboardList, Calendar, User, Loader2, Check, X, 
    Camera, Truck, Link as LinkIcon, MapPin, Phone, XCircle 
} from "lucide-react";
import api from "../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar o Modal de Cliente
  const [selectedClientOrder, setSelectedClientOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get("/orders/all-orders");
        const sorted = response.data.sort((a, b) => b.id - a.id);
        setOrders(sorted);
      } catch (err) {
        console.error("Erro ao buscar pedidos", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
      const action = newStatus === 'PAID' ? 'confirmar pagamento' : 'cancelar pedido';
      if (!window.confirm(`Tem certeza que deseja ${action}?`)) return;

      try {
          await api.patch(`/orders/${orderId}/status`, { status: newStatus });
          setOrders(prev => prev.map(order => 
              order.id === orderId ? { ...order, status: newStatus } : order
          ));
          alert(`Sucesso! Pedido #${orderId} agora está ${newStatus}.`);
      } catch (error) {
          console.error("Erro ao atualizar status", error);
          alert("Erro ao comunicar com o servidor.");
      }
  };

  const handleEditLinks = async (order) => {
    const currentInsta = order.instagramReelUrl || "";
    const currentTrack = order.trackingUrl || "";
    const newInsta = prompt("Cole o link do Reel do Instagram:", currentInsta);
    if (newInsta === null) return; 
    const newTrack = prompt("Cole o link de Rastreio/Entrega:", currentTrack);
    if (newTrack === null) return; 

    try {
        const response = await api.patch(`/orders/${order.id}/links`, {
            instagramReelUrl: newInsta,
            trackingUrl: newTrack
        });
        setOrders(prev => prev.map(o => o.id === order.id ? response.data : o));
    } catch (error) {
        console.error("Erro ao salvar links", error);
        alert("Erro ao salvar os links.");
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString) => new Date(dateString).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const getStatusColor = (status) => {
    switch(status) {
        case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
        case 'CANCELED': return 'bg-red-100 text-red-700 border-red-200';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-scoop-bg pb-10 relative">
      <Navbar />
          
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-scoop-blue p-3 rounded-full shadow-sm text-white">
            <ClipboardList size={32} />
          </div>
          <h1 className="text-3xl font-bubble text-gray-700">Gestão de Pedidos</h1>
        </div>

        {loading ? (
           <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-scoop-blue" size={48} /></div>
        ) : orders.length === 0 ? (
           <p className="text-center text-gray-500">Nenhum pedido realizado na loja ainda.</p>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* ID e Data */}
                <div className="flex flex-col w-full md:w-1/6">
                  <span className="font-bold text-lg text-scoop-blue">Pedido #{order.id}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} /> {formatDate(order.moment)}
                  </div>
                </div>

                {/* Cliente (AGORA É UM BOTÃO) */}
                <div className="flex items-center gap-2 w-full md:w-1/6 text-gray-600">
                    <button 
                        onClick={() => setSelectedClientOrder(order)}
                        className="flex items-center gap-2 group hover:bg-blue-50 p-2 rounded-lg transition text-left"
                        title="Ver dados de entrega"
                    >
                        <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-200 transition">
                            <User size={18} className="text-gray-600 group-hover:text-blue-700" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 group-hover:text-blue-500">Cliente</span>
                            <span className="text-sm font-bold text-gray-700 capitalize group-hover:text-blue-700 underline decoration-dotted">
                                {order.clientName || "?"}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Status e Total */}
                <div className="flex flex-col items-center w-full md:w-1/6 gap-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    <span className="font-bubble text-xl text-gray-700">
                        {formatCurrency(order.total ?? 0)}
                    </span>
                </div>

                {/* Links */}
                <div className="flex flex-col items-center justify-center w-full md:w-1/4 gap-2">
                    <div className="flex gap-2">
                        {order.instagramReelUrl && (
                            <button onClick={() => window.open(order.instagramReelUrl, '_blank')} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm hover:opacity-90 transition" style={{ background: 'linear-gradient(45deg, #f09433 0%, #dc2743 50%, #bc1888 100%)' }}>
                                <Camera size={14} /> Reel
                            </button>
                        )}
                        {order.trackingUrl && (
                            <button onClick={() => window.open(order.trackingUrl, '_blank')} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue-500 shadow-sm hover:bg-blue-600 transition">
                                <Truck size={14} /> Entrega
                            </button>
                        )}
                    </div>
                    <button onClick={() => handleEditLinks(order)} className="text-xs text-gray-400 hover:text-scoop-blue flex items-center gap-1 underline">
                        <LinkIcon size={12} /> {order.instagramReelUrl || order.trackingUrl ? "Editar links" : "Adicionar links"}
                    </button>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 w-full md:w-1/6 justify-end">
                    {order.status === 'PENDING' ? (
                        <>
                            <button onClick={() => handleUpdateStatus(order.id, 'PAID')} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-500 hover:text-white transition shadow-sm border border-green-200"><Check size={20} /></button>
                            <button onClick={() => handleUpdateStatus(order.id, 'CANCELED')} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition shadow-sm border border-red-200"><X size={20} /></button>
                        </>
                    ) : (
                        <span className="text-xs text-gray-300 italic font-medium">{order.status === 'PAID' ? 'Pago em dia' : 'Encerrado'}</span>
                    )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL DE INFORMAÇÕES DO CLIENTE --- */}
      {selectedClientOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header do Modal */}
                <div className="bg-scoop-blue p-4 flex justify-between items-center text-white">
                    <h2 className="font-bubble text-xl flex items-center gap-2">
                        <User size={24} /> Dados de Entrega
                    </h2>
                    <button onClick={() => setSelectedClientOrder(null)} className="hover:bg-white/20 p-1 rounded-full transition">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-scoop-blue"><User size={20} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Nome do Cliente</p>
                            <p className="font-bold text-gray-800 text-lg capitalize">{selectedClientOrder.clientName}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-lg text-green-600"><Phone size={20} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Telefone / WhatsApp</p>
                            <p className="font-bold text-gray-800 text-lg">
                                {selectedClientOrder.clientPhone || "Não informado"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><MapPin size={20} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Endereço de Entrega</p>
                            <p className="font-bold text-gray-800">
                                {selectedClientOrder.clientAddress || "Endereço não cadastrado"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                        <button 
                            onClick={() => setSelectedClientOrder(null)}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}