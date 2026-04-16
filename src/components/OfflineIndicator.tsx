import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { Wifi, WifiOff } from 'lucide-react'

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white px-4 py-3 flex items-center gap-2 z-40 shadow-lg">
      <WifiOff size={18} />
      <span className="text-sm font-semibold">Sin conexión - Los datos se guardan localmente</span>
    </div>
  )
}

export function OnlineStatus() {
  const isOnline = useOnlineStatus()

  return (
    <div className="flex items-center gap-1">
      {isOnline ? (
        <>
          <Wifi size={16} className="text-green-600" />
          <span className="text-xs text-green-600">En línea</span>
        </>
      ) : (
        <>
          <WifiOff size={16} className="text-orange-600" />
          <span className="text-xs text-orange-600">Sin conexión</span>
        </>
      )}
    </div>
  )
}
