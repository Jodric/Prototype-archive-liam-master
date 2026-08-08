import { useGame } from '../store/useGame'

/** Bulles facon notification de smartphone, comme dans la maquette du couloir. */
export default function Notifications() {
  const notifications = useGame((s) => s.notifications)

  return (
    <div className="notifs">
      {notifications.map((n) => (
        <div key={n.id} className={`notif notif--${n.type || 'info'}`}>
          <span className="notif__icone">{n.type === 'alerte' ? '▲' : '▣'}</span>
          <div>
            <strong>{n.titre}</strong>
            <p>{n.corps}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
