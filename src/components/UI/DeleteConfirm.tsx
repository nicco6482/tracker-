import { Trash2 } from 'lucide-react'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirm({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-backdrop">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 text-center animate-modal">

        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-500" strokeWidth={1.8} />
        </div>

        <h2 className="text-base font-bold text-slate-900 mb-1">Eliminar gasto</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
