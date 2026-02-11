import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Search, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

// --- MÁSCARAS DE FORMATAÇÃO ---
const maskCPF = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskCEP = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

const maskPhone = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
};
// ------------------------------

export default function Checkout() {
  const { cart, totalValue, clearCart } = useCart();
  const navigate = useNavigate();
  const [loadingCep, setLoadingCep] = useState(false);
  
  // Estado do Formulário com novos campos
  const [formData, setFormData] = useState({
    name: "", 
    cpf: "", 
    email: "", 
    phone: "",
    cep: "", 
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: ""
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Aplica máscaras
    if (name === "cpf") value = maskCPF(value);
    if (name === "cep") value = maskCEP(value);
    if (name === "phone") value = maskPhone(value);

    setFormData({ ...formData, [name]: value });
  };

  // --- BUSCA DE CEP AUTOMÁTICA ---
  const handleBlurCep = async () => {
    // Remove traço para verificar se tem 8 números
    const cepLimpo = formData.cep.replace(/\D/g, "");

    if (cepLimpo.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
          }));
          // Foca no campo número após achar o endereço
          document.getElementById("numeroInput").focus();
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCep(false);
      }
    }
  };
  // ------------------------------

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    
    // Filtra itens que têm ID
    const itensValidos = cart.filter(item => item.id);


    if (itensValidos.length < cart.length) {
        console.error("⚠️ Itens inválidos detectados e removidos:", cart.filter(item => !item.id));
        alert("Alguns itens do seu carrinho estavam desatualizados e foram removidos. Por favor, revise seu pedido.");
    }

    if (itensValidos.length === 0) {
      return;
    }
    // ----------------------------------

    try {
        // 1. Monta o endereço em uma String única para salvar no banco
        const enderecoCompleto = `${formData.rua}, ${formData.numero} - ${formData.bairro}, ${formData.cidade} - ${formData.uf}`;
        
        // Se tiver complemento, adiciona
        const enderecoFinal = formData.complemento 
            ? `${enderecoCompleto} (${formData.complemento})` 
            : enderecoCompleto;

        // 2. Cria o payload com TODOS os dados que o Java espera
        const payload = {
            items: itensValidos.map(item => ({
                productId: item.id, 
                quantity: item.quantity,
                price: item.price
            })),
            // --- CAMPOS NOVOS ---
            address: enderecoFinal,
            phone: formData.phone
            // --------------------
        };

        console.log("📦 Payload enviado:", payload);

        const response = await api.post("/orders", payload);
        const novoPedido = response.data; 

        clearCart();

        navigate(`/payment/${novoPedido.id}`);

    } catch (error) {
        console.error("Erro no checkout:", error);
        // Mensagem de erro mais específica
        if (error.response && error.response.data) {
             alert(`Erro do Servidor: ${error.response.status}`);
        } else {
             alert("Erro ao processar. Verifique sua conexão e login.");
        }
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-scoop-bg flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bubble text-gray-400 mb-4">Sua sacola está vazia 🛒</h2>
            <button onClick={() => navigate("/")} className="text-scoop-blue font-bold hover:underline">Voltar para a Loja</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo: Formulário Completo */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-scoop-blue/20">
            <h2 className="text-2xl font-bubble text-scoop-pink mb-6 flex items-center gap-2">
                <MapPin className="text-scoop-blue" /> Dados de Entrega
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">NOME COMPLETO</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink outline-none transition" placeholder="Ex: Amanda Silva" />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-400 ml-1">CPF</label>
                        <input required name="cpf" value={formData.cpf} onChange={handleChange} maxLength={14} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink outline-none transition" placeholder="000.000.000-00" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 ml-1">CELULAR / WHATSAPP</label>
                            <input 
                                required 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                maxLength={15} 
                                className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink outline-none transition" 
                                placeholder="(11) 99999-9999" 
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 ml-1">TELEFONE</label>
                        <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink outline-none transition" placeholder="(00) 00000-0000" />
                    </div>

                    <div>   
                        <label className="text-xs font-bold text-gray-400 ml-1">EMAIL</label>
                        <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-pink outline-none transition" placeholder="cliente@email.com" />
                    </div>
                </div>

                <hr className="border-gray-100 my-4 border-dashed" />

                {/* Endereço */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 relative">
                        <label className="text-xs font-bold text-gray-400 ml-1">CEP</label>
                        <input 
                            required name="cep" 
                            value={formData.cep} 
                            onChange={handleChange} 
                            onBlur={handleBlurCep} // Busca ao sair do campo
                            maxLength={9}
                            className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-blue outline-none transition" 
                            placeholder="00000-000" 
                        />
                        <div className="absolute right-3 top-8 text-gray-400">
                            {loadingCep ? <Loader2 className="animate-spin w-5 h-5"/> : <Search className="w-5 h-5 opacity-50"/>}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">RUA / LOGRADOURO</label>
                        <input required name="rua" value={formData.rua} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-100 focus:bg-white focus:border-scoop-blue outline-none transition" placeholder="..." />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="text-xs font-bold text-gray-400 ml-1">NÚMERO</label>
                        <input id="numeroInput" required name="numero" value={formData.numero} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-blue outline-none transition" placeholder="123" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">BAIRRO</label>
                        <input required name="bairro" value={formData.bairro} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-100 focus:bg-white focus:border-scoop-blue outline-none transition" placeholder="..." />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                        <label className="text-xs font-bold text-gray-400 ml-1">CIDADE</label>
                        <input required name="cidade" value={formData.cidade} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-100 focus:bg-white focus:border-scoop-blue outline-none transition" placeholder="..." />
                    </div>
                    <div className="col-span-1">
                        <label className="text-xs font-bold text-gray-400 ml-1">UF</label>
                        <input required name="uf" value={formData.uf} onChange={handleChange} maxLength={2} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-100 text-center uppercase font-bold focus:bg-white focus:border-scoop-blue outline-none transition" placeholder="SP" />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">COMPLEMENTO (Opcional)</label>
                    <input name="complemento" value={formData.complemento} onChange={handleChange} className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-scoop-blue outline-none transition" placeholder="Apto 101, Bloco C..." />
                </div>
                
                <button type="submit" className="w-full bg-green-500 text-white font-bubble text-xl py-4 rounded-xl hover:bg-green-600 transition shadow-lg hover:-translate-y-1 active:scale-95 mt-6 flex justify-center items-center gap-2">
                    <CreditCard /> Ir para Pagamento
                </button>
            </form>
        </div>

        {/* Lado Direito: Resumo */}
        <div className="h-fit space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-500 mb-4 tracking-wider text-sm">RESUMO DO PEDIDO</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center border-b border-gray-50 pb-3 last:border-0">
                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100" alt="" />
                            <div className="flex-1">
                                <p className="font-bold text-gray-700 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.quantity}x ({item.option})</p>
                            </div>
                            <span className="font-bold text-scoop-blue text-sm">R$ {item.price}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-dashed border-gray-200">
                    <span className="text-lg font-bold text-gray-600">Total a pagar</span>
                    <span className="text-3xl font-bubble text-scoop-pink">R$ {totalValue.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-600 text-sm text-center">
                🔒 Pagamento 100% Seguro via PIX
            </div>
        </div>

      </div>
    </div>
  );
}