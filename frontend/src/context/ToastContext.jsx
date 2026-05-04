import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const ToastContext = createContext(null);

function formatToastMessage(message) {
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    return message.map((item) => item?.msg || item?.detail || JSON.stringify(item)).join("; ");
  }
  if (message && typeof message === "object") {
    return message.detail || message.msg || JSON.stringify(message);
  }
  return "Something went wrong";
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message: formatToastMessage(message), type }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = toast.type === "error" ? XCircle : CheckCircle2;
          return (
            <div
              key={toast.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-soft"
            >
              <Icon className={toast.type === "error" ? "h-5 w-5 text-red-500" : "h-5 w-5 text-emerald-600"} />
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
