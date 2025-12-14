import React from 'react'

export default function DevIndicator() {
  if (process.env.NODE_ENV === 'production') return null
  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, background: '#0b74de', color: 'white', padding: '6px 8px', borderRadius: 6, zIndex: 9999, fontSize: 12 }}>
      DEV: App mounted
    </div>
  )
}
