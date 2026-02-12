import { useState, useEffect } from "react";
import { Truck, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", cnpj: "", contactPhone: "", contactEmail: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data);
    } catch (err) {
      console.error("Erro ao buscar fornecedores", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/suppliers", form);
      setForm({ name: "", cnpj: "", contactPhone: "", contactEmail: "" }); // Limpa form
      fetchSuppliers(); // Recarrega lista
    } catch {
      setError("Erro ao cadastrar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja remover este fornecedor?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch {
      alert("Erro ao deletar.");
    }
  };

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />

      <main className="max-w-6xl mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bubble text-scoop-pink mb-2 flex items-center gap-2">
          <Truck /> Gestão de Fornecedores
        </h1>
        <p className="text-gray-500 font-hand text-xl mb-8">Cadastre parceiros e empresas</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORMULÁRIO DE CADASTRO */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-scoop-blue/20 h-fit">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Novo Fornecedor</h2>
            {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 flex gap-2"><AlertCircle size={16}/> {error}</div>}
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Empresa / Nome</label>
                <input 
                  type="text" required 
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">CNPJ</label>
                <input 
                  type="text" required 
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none"
                  value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Telefone</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none"
                    value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none"
                    value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})}
                  />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-scoop-blue text-white font-bold py-3 rounded-xl hover:bg-cyan-600 transition flex justify-center">
                {loading ? <Loader2 className="animate-spin"/> : "Cadastrar"}
              </button>
            </form>
          </div>

          {/* LISTA DE FORNECEDORES */}
          <div className="lg:col-span-2 space-y-4">
            {suppliers.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300">
                <p className="text-gray-400 text-lg">Nenhum fornecedor cadastrado ainda.</p>
              </div>
            ) : (
              suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{supplier.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">CNPJ: {supplier.cnpj}</p>
                    <div className="flex gap-4 mt-1 text-xs text-scoop-blue font-medium">
                      {supplier.contactEmail && <span>📧 {supplier.contactEmail}</span>}
                      {supplier.contactPhone && <span>📞 {supplier.contactPhone}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}