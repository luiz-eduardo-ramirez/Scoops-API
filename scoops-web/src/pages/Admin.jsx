import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Scoops");
  
  // Estado simplificado para apenas UM arquivo
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (category === "Scoops") {
      setPrice("60.00");
    } else {
      setPrice("");
    }
  }, [category]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    if (!name || !price || !file) {
      setStatus({ type: "error", message: "Preencha nome, preço e escolha uma foto!" });
      setLoading(false);
      return;
    }

    try {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("file", file);

  // Use a URL completa da porta 5000 (Management)
  await api.post("/products", formData);
  

      setStatus({ type: "success", message: "Produto criado com sucesso! 🎉" });
      
      // Limpeza dos campos
      setName("");
      setDescription("");
      setFile(null); 
      setPreview(null);
      if(category !== "Scoops") setPrice(""); 

    } catch (error) {
      console.error("Erro ao salvar:", error);
      setStatus({ type: "error", message: "Erro ao conectar com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />

      <main className="max-w-5xl mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bubble text-scoop-pink mb-2">Painel de Controle 🛠️</h1>
        <p className="text-gray-500 font-hand text-xl mb-8">Adicione novos itens para a vitrine</p>

        {status.message && (
          <div className={`p-4 mb-6 rounded-xl flex items-center gap-2 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            {status.message}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-8 border-4 border-scoop-blue/20">
          <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
            <Plus className="text-scoop-blue" /> Novo Produto
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LADO ESQUERDO: TEXTOS */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Nome do Produto</label>
                <input 
                  value={name} onChange={e => setName(e.target.value)}
                  type="text" placeholder="Ex: Scoop Místico" 
                  className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink focus:outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Categoria</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink focus:outline-none cursor-pointer"
                  >
                    <option value="Scoops">Scoops</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Papelaria">Papelaria</option>
                    <option value="Beleza">Beleza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">Preço (R$)</label>
                  <input 
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                    type="number" 
                    disabled={category === "Scoops"}
                    className={`w-full p-3 rounded-xl border-2 transition focus:outline-none 
                      ${category === "Scoops" ? "bg-gray-200 text-gray-500" : "bg-gray-50 border-gray-100 focus:border-scoop-pink"}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Descrição</label>
                <textarea 
                  value={description} onChange={e => setDescription(e.target.value)}
                  rows="4" className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink focus:outline-none"
                ></textarea>
              </div>
            </div>

            {/* LADO DIREITO: UMA FOTO DESTAQUE */}
            <div className="flex flex-col gap-4">
              <label className="block text-sm font-bold text-gray-500">Foto do Produto</label>
              
              <div className="relative h-64 border-4 border-dashed border-scoop-blue/30 rounded-3xl hover:bg-gray-50 transition cursor-pointer flex items-center justify-center overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                />
                
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={48} className="mb-2" />
                    <span className="text-sm font-bold">Clique para selecionar</span>
                    <span className="text-xs">PNG ou JPG até 5MB</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-center text-gray-400 font-medium">Esta imagem aparecerá na vitrine principal.</p>
            </div>

            <div className="lg:col-span-3">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bubble text-xl py-4 rounded-2xl transition shadow-lg flex justify-center items-center gap-2 active:scale-[0.98] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-scoop-blue hover:bg-cyan-500'}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Publicar na Loja 🚀"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}