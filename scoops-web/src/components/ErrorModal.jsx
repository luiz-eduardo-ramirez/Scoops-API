import { XCircle } from "lucide-react";

export default function ErrorModal({ open, onClose, title, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">

      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">

        <div className="flex flex-col items-center text-center gap-3">

          <XCircle size={48} className="text-red-400" />

          <h3 className="text-xl font-bold text-gray-800">
            {title}
          </h3>

          <p className="text-gray-500 text-sm">
            {message}
          </p>

          <button
            onClick={onClose}
            className="mt-4 w-full bg-gradient-to-r from-scoop-pink to-scoop-purple text-white py-2 rounded-xl hover:brightness-110 transition active:scale-95"
          >
            Entendi
          </button>

        </div>

      </div>
    </div>
  );
}
