import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-900/20 border-green-800 text-green-400"
      : type === "error"
      ? "bg-red-900/20 border-red-800 text-red-400"
      : "bg-blue-900/20 border-blue-800 text-blue-400";

  const Icon =
    type === "success" ? CheckCircle : type === "error" ? AlertCircle : Info;

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-inherit hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
