import { useState, useEffect } from "react";
import { ClipboardList, Plus, Package, Truck, Loader2, CheckCircle, AlertCircle, Trash2, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AdminDeliveries() {
  // Dados do Servidor
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveriesHistory, setDeliveriesHistory] = useState([]);

  // Estado do Formulário Atual
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [cartItems, setCartItems] = useState([]); // Itens sendo adicionados agora
  
  // Estado do Item sendo digitado
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: 1,
    price: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchBaseData();
    fetchHistory();
  }, []);

  const fetchBaseData = async () => {
    try {
      const [supRes, prodRes] = await Promise.all([
        api.get("/suppliers"),
        api.get("/products")
      ]);
      setSuppliers(supRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados base", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get("/deliveries");
      setDeliveriesHistory(res.data);
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
    }
  };

  // Adiciona um item à lista temporária (antes de salvar)
  const addItemToDraft = () => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.price) {
      alert("Preencha os dados do item!");
      return;
    }

    const productRef = products.find(p => p.id === currentItem.productId);

    const newItem = {
      ...currentItem,
      productName: productRef?.name || "Desconhecido",
      total: currentItem.quantity * parseFloat(currentItem.price),
      tempId: Date.now() // ID temporário para remoção da lista
    };

    setCartItems([...cartItems, newItem]);
    
    // Reseta apenas os campos do item, mantém o fornecedor
    setCurrentItem({ productId: "", quantity: 1, price: "" });
  };

  const removeItemFromDraft = (tempId) => {
    setCartItems(cartItems.filter(item => item.tempId !== tempId));
  };

  // Envia tudo para o Backend
  const handleFinalizeDelivery = async () => {
    if (!selectedSupplier || cartItems.length === 0) {
      setStatus({ type: "error", message: "Selecione um fornecedor e adicione itens!" });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Monta o JSON igual ao DTO do C#
      const payload = {
        supplierId: parseInt(selectedSupplier),
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      };

      await api.post("/deliveries", payload);

      setStatus({ type: "success", message: "Entrega registrada com sucesso! 🎉" });
      
      // Limpa tudo
      setCartItems([]);
      setSelectedSupplier("");
      fetchHistory(); // Atualiza a tabela lá embaixo

    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Erro ao salvar entrega." });
    } finally {
      setLoading(false);
    }
  };

  const totalDraftValue = cartItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />

      <main className="max-w-6xl mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bubble text-scoop-pink mb-2 flex items-center gap-2">
          <ClipboardList /> Registro de Entregas
        </h1>
        
        {status.message && (
          <div className={`p-4 mb-6 rounded-xl flex items-center gap-2 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- ÁREA DE CADASTRO (ESQUERDA) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Selecionar Fornecedor */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-scoop-blue/20">
              <h2 className="font-bold text-gray-600 mb-4 flex items-center gap-2"><Truck size={18}/> 1. Escolha o Fornecedor</h2>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border focus:border-scoop-blue outline-none"
                value={selectedSupplier}
                onChange={e => setSelectedSupplier(e.target.value)}
              >
                <option value="">Selecione um fornecedor...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} (CNPJ: {s.cnpj})</option>)}
              </select>
            </div>

            {/* 2. Adicionar Itens */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-scoop-blue/20">
              <h2 className="font-bold text-gray-600 mb-4 flex items-center gap-2"><Package size={18}/> 2. Adicionar Produtos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="text-xs uppercase text-gray-400 font-bold">Produto</label>
                  <select 
                    className="w-full p-2 bg-gray-50 rounded-lg border outline-none"
                    value={currentItem.productId}
                    onChange={e => setCurrentItem({...currentItem, productId: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-bold">Qtd.</label>
                  <input 
                    type="number" min="1"
                    className="w-full p-2 bg-gray-50 rounded-lg border outline-none"
                    value={currentItem.quantity}
                    onChange={e => setCurrentItem({...currentItem, quantity: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-bold">Custo Un. (R$)</label>
                  <input 
                    type="number" step="0.01"
                    className="w-full p-2 bg-gray-50 rounded-lg border outline-none"
                    value={currentItem.price}
                    onChange={e => setCurrentItem({...currentItem, price: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={addItemToDraft}
                className="mt-4 w-full bg-gray-100 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <Plus size={16}/> Adicionar à Lista
              </button>
            </div>

            {/* 3. Lista de Itens (Draft) */}
            {cartItems.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-scoop-pink/20">
                <h2 className="font-bold text-scoop-pink mb-4 flex justify-between items-center">
                  <span>Itens da Entrega</span>
                  <span className="text-lg">Total: R$ {totalDraftValue.toFixed(2)}</span>
                </h2>
                
                <div className="space-y-2 mb-6">
                  {cartItems.map(item => (
                    <div key={item.tempId} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-700">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.quantity}x R$ {item.price} un.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-gray-600">R$ {item.total.toFixed(2)}</span>
                        <button onClick={() => removeItemFromDraft(item.tempId)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleFinalizeDelivery}
                  disabled={loading}
                  className="w-full bg-scoop-pink text-white font-bold py-4 rounded-xl hover:bg-pink-500 transition shadow-lg flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Finalizar Entrada de Estoque</>}
                </button>
              </div>
            )}
          </div>

          {/* --- HISTÓRICO (DIREITA) --- */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-24">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-600">Histórico de Entregas</h3>
              </div>
              <div className="max-h-[500px] overflow-y-auto p-2 space-y-2">
                {deliveriesHistory.length === 0 ? (
                  <p className="text-center text-gray-400 p-4 text-sm">Sem histórico.</p>
                ) : (
                  deliveriesHistory.map(d => (
                    <div key={d.id} className="p-3 border rounded-xl hover:bg-gray-50 transition">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{new Date(d.moment).toLocaleDateString()}</span>
                        <span className="font-bold text-green-600">R$ {d.total.toFixed(2)}</span>
                      </div>
                      <p className="font-bold text-sm text-gray-700">{d.supplier?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{d.items?.length || 0} itens</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}