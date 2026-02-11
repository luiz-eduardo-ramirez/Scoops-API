import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pixCode, setPixCode] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPix = async () => {
      try {
        setError("");
        
        // Chama o endpoint para gerar o Pix real
        const res = await api.post(`/orders/${id}/pix`);
        
        setPixCode(res.data.code);
        setTotal(Number(res.data.total));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erro ao gerar o pagamento. Tente recarregar a página.");
        setLoading(false);
      }
    };

    fetchPix();
  }, [id]);

  const copyToClipboard = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    alert("Código PIX copiado!");
  };

  // --- TELA DE CARREGAMENTO ---
  if (loading) return (
    <div className="min-h-screen bg-scoop-bg flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-scoop-pink w-12 h-12" />
        <p className="font-bubble text-scoop-blue text-xl">Gerando seu QR Code...</p>
    </div>
  );

  // --- TELA DE ERRO ---
  if (error || !id) return (
    <div className="min-h-screen bg-scoop-bg flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
            <p className="text-red-500 font-bold mb-4">{error || "Pedido inválido"}</p>
            <button 
                onClick={() => navigate("/")} 
                className="bg-scoop-blue text-white px-6 py-2 rounded-full font-bold hover:bg-cyan-600 transition"
            >
                Voltar para a Loja
            </button>
        </div>
    </div>
  );

  // --- TELA PRINCIPAL (SUCESSO) ---
  return (
    <div className="min-h-screen bg-scoop-bg pb-10">
      <Navbar />
      
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border-4 border-scoop-blue/20 text-center relative overflow-hidden">
        
        {/* Decoração de fundo */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-scoop-pink to-scoop-blue"></div>

        <div className="flex justify-center mb-4 text-green-500">
            <CheckCircle size={64} className="drop-shadow-sm" />
        </div>
        
        <h1 className="text-3xl font-bubble text-scoop-pink mb-2">Pedido #{id} Confirmado!</h1>
        <p className="text-gray-500 mb-6 font-medium">Agora é só pagar para liberar a magia ✨</p>

        {/* Card do QR Code */}
        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center gap-4 mb-6">
            <span className="text-xs font-bold text-scoop-blue uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                Escaneie o QR Code
            </span>
            
            <div className="p-3 bg-white rounded-xl shadow-sm">
                <QRCodeCanvas value={pixCode} size={200} />
            </div>

            <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Valor Total</p>
                <p className="font-bubble text-3xl text-scoop-pink">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </p>
            </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
            <button 
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 bg-scoop-blue text-white font-bold py-3 rounded-xl hover:bg-cyan-600 transition shadow-md active:scale-95 group"
            >
                <Copy size={20} className="group-hover:rotate-12 transition"/>
                Copiar Código Pix
            </button>

            <button 
                onClick={() => navigate("/orders")}
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-scoop-pink font-bold py-2 transition text-sm hover:bg-gray-50 rounded-xl"
            >
                <ArrowLeft size={16} />
                Ver meus pedidos
            </button>
        </div>
      </div>
    </div>
  );
}