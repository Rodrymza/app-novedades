import { useState } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  placeholder?: string;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}

export function TextInputModal({
  open,
  title,
  message,
  placeholder = "",
  onCancel,
  onConfirm,
}: Props) {
  const [text, setText] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(text.trim());
    setText(""); // limpiamos el campo al cerrar
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>

        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              setText(""); // limpiamos al cancelar
              onCancel();
            }}
          >
            Cancelar
          </button>

          <button
            disabled={!text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
