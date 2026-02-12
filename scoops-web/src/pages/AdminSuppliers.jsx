import { useState, useEffect } from "react";
import { Truck, Trash2, Loader2, AlertCircle, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Estado para o botão salvar
  
  // Estado do formulário
  const [form, setForm] = useState({ 
    name: "", 
    cnpj: "", 
    contactPhone: "", 
    contactEmail: "" 
  });
  
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/suppliers");
      setSuppliers(response.data);
    } catch (err) {
      console.error("Erro ao buscar fornecedores", err);
      // Evita mostrar erro na tela se for apenas lista vazia ou erro temporário silencioso
      if(err.response?.status !== 404) {
          setError("Não foi possível carregar a lista de fornecedores.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- MÁSCARAS (Formatam visualmente o que o usuário vê) ---
  const maskCNPJ = (value) => {
    return value
      .replace(/\D/g, "") // Remove letras
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18); // Limita tamanho
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2")
      .substring(0, 15);
  };

  // Função genérica para atualizar os inputs com máscara
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cnpj") value = maskCNPJ(value);
    if (name === "contactPhone") value = maskPhone(value);

    setForm({ ...form, [name]: value });
  };

  // --- ENVIO DO FORMULÁRIO ---
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // 1. Limpeza de Dados (Sanitização)
    // Removemos tudo que não é número para enviar "limpo" ao backend
    const cleanCnpj = form.cnpj.replace(/\D/g, ""); 
    const cleanPhone = form.contactPhone.replace(/\D/g, "");

    // 2. Validações Frontend
    if (!form.name.trim()) {
        setError("O nome da empresa é obrigatório.");
        setSubmitting(false);
        return;
    }

    if (cleanCnpj.length !== 14) {
      setError("O CNPJ deve conter exatamente 14 números.");
      setSubmitting(false);
      return;
    }

    if (form.contactEmail && (!form.contactEmail.includes("@") || !form.contactEmail.includes("."))) {
      setError("Digite um e-mail válido.");
      setSubmitting(false);
      return;
    }

    // 3. Monta o Objeto para Envio
    // O Backend receberá o CNPJ puro (apenas números), evitando erro 400 se ele validar formato
    const payload = {
      name: form.name,
      cnpj: cleanCnpj, // Envia '12345678000190'
      phone: cleanPhone, 
      email: form.contactEmail,
    };

    try {
      await api.post("/suppliers", payload);
      
      // Sucesso!
      alert("Fornecedor cadastrado com sucesso!");
      setForm({ name: "", cnpj: "", contactPhone: "", contactEmail: "" }); // Limpa form
      fetchSuppliers(); // Atualiza a tabela
    } catch (err) {
      console.error(err);
      // Tenta pegar a mensagem de erro específica do backend
      const msg = err.response?.data?.message || err.response?.data || "Erro ao cadastrar. Verifique se o CNPJ já existe.";
      setError(typeof msg === 'string' ? msg : "Erro desconhecido ao salvar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja remover este fornecedor?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch {
      alert("Erro ao deletar. Verifique se existem entregas vinculadas a este fornecedor.");
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
          
          {/* --- FORMULÁRIO DE CADASTRO --- */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-scoop-blue/20 h-fit">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Save size={20} className="text-scoop-blue"/> Novo Fornecedor
            </h2>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-start gap-2 border border-red-100 animate-pulse">
                    <AlertCircle size={16} className="mt-0.5 shrink-0"/> 
                    <span>{error}</span>
                </div>
            )}
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Empresa / Nome *</label>
                <input 
                  type="text" required name="name"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none transition"
                  placeholder="Ex: Sorvetes LTDA"
                  value={form.name} onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">CNPJ *</label>
                <input 
                  type="text" required name="cnpj"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none transition font-mono"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj} onChange={handleChange}
                  maxLength={18} // Limita caracteres com a máscara
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Telefone</label>
                  <input 
                    type="text" name="contactPhone"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none transition"
                    placeholder="(99) 99999-9999"
                    value={form.contactPhone} onChange={handleChange}
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                  <input 
                    type="email" name="contactEmail"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-scoop-blue focus:outline-none transition"
                    placeholder="contato@empresa.com"
                    value={form.contactEmail} onChange={handleChange}
                  />
                </div>
              </div>

              <button 
                disabled={submitting} 
                className="w-full bg-scoop-blue text-white font-bold py-3 rounded-xl hover:bg-cyan-600 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? <Loader2 className="animate-spin"/> : "Cadastrar Fornecedor"}
              </button>
            </form>
          </div>

          {/* --- LISTA DE FORNECEDORES --- */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
                <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-scoop-pink" size={30}/></div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300">
                <p className="text-gray-400 text-lg">Nenhum fornecedor cadastrado ainda.</p>
              </div>
            ) : (
              suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition group">
                  <div>
                    <h3 className="font-bold text-lg text-gray-700 group-hover:text-scoop-blue transition">{supplier.name}</h3>
                    
                    {/* Exibimos o CNPJ formatado se o backend devolver limpo */}
                    <p className="text-sm text-gray-500 font-mono bg-gray-100 w-fit px-2 py-0.5 rounded text-xs mt-1">
                        CNPJ: {supplier.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-xs text-gray-400 font-medium">
                      {supplier.contactEmail && <span className="flex items-center gap-1">📧 {supplier.contactEmail}</span>}
                      {supplier.contactPhone && <span className="flex items-center gap-1">📞 {supplier.contactPhone}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(supplier.id)}
                    className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Excluir fornecedor"
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