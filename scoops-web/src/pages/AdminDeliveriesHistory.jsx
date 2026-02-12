import { useState, useEffect } from "react";
import { History, ChevronDown, ChevronUp, Package, Calendar, Truck, DollarSign, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AdminDeliveriesHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null); // ID da entrega expandida

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    // Filtro simples por nome do fornecedor
    if (!searchTerm) {
      setFilteredDeliveries(deliveries);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = deliveries.filter(d => 
        d.supplier?.name.toLowerCase().includes(lowerSearch)
      );
      setFilteredDeliveries(filtered);
    }
  }, [searchTerm, deliveries]);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/deliveries");
      setDeliveries(response.data);
      setFilteredDeliveries(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />

      <main className="max-w-6xl mx-auto p-4 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bubble text-scoop-pink mb-2 flex items-center gap-2">
              <History /> Histórico de Entradas
            </h1>
            <p className="text-gray-500 font-hand text-xl">Consulte todas as movimentações de estoque</p>
          </div>

          {/* Barra de Pesquisa */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por fornecedor..." 
              className="w-full pl-10 p-3 rounded-full border-2 border-gray-100 focus:border-scoop-blue outline-none shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border-4 border-scoop-blue/10 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Carregando histórico...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="p-5">Data</th>
                    <th className="p-5">Fornecedor</th>
                    <th className="p-5 text-center">Itens</th>
                    <th className="p-5 text-right">Total</th>
                    <th className="p-5 text-center">Status</th>
                    <th className="p-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">Nenhum registro encontrado.</td>
                    </tr>
                  ) : (
                    filteredDeliveries.map((delivery) => (
                      <>
                        {/* Linha Principal da Entrega */}
                        <tr 
                          key={delivery.id} 
                          onClick={() => toggleRow(delivery.id)}
                          className="hover:bg-blue-50/30 transition cursor-pointer group"
                        >
                          <td className="p-5 text-gray-600 flex items-center gap-2">
                            <Calendar size={16} className="text-scoop-blue" />
                            {new Date(delivery.moment).toLocaleDateString('pt-BR')}
                            <span className="text-xs text-gray-400 ml-1">
                              {new Date(delivery.moment).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </td>
                          <td className="p-5 font-bold text-gray-700">
                            <div className="flex items-center gap-2">
                              <Truck size={16} className="text-gray-400"/>
                              {delivery.supplier?.name}
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                              {delivery.items?.length || 0}
                            </span>
                          </td>
                          <td className="p-5 text-right font-mono font-bold text-green-600">
                            R$ {delivery.total.toFixed(2)}
                          </td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              delivery.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {delivery.status === 'COMPLETED' ? 'Concluído' : delivery.status}
                            </span>
                          </td>
                          <td className="p-5 text-right text-gray-400 group-hover:text-scoop-blue">
                            {expandedRow === delivery.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </td>
                        </tr>

                        {/* Linha Expansível com Detalhes */}
                        {expandedRow === delivery.id && (
                          <tr className="bg-gray-50/50">
                            <td colSpan="6" className="p-4 sm:p-6 border-b border-gray-100 shadow-inner">
                              <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h4 className="font-bold text-sm text-gray-500 mb-3 flex items-center gap-2">
                                  <Package size={16}/> Itens da Entrega #{delivery.id}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  {delivery.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                      <div>
                                        <p className="font-bold text-gray-700 text-sm">{item.product?.name || "Produto Removido"}</p>
                                        <p className="text-xs text-gray-500">Qtd: {item.quantity} un.</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-gray-400">Custo Un.</p>
                                        <p className="font-mono font-bold text-scoop-pink text-sm">R$ {item.price.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                   <p className="text-sm text-gray-500">Subtotal dos Itens: <strong className="text-gray-800">R$ {delivery.total.toFixed(2)}</strong></p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}