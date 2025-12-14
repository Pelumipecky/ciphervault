import React from 'react'

const SmartsuppButton: React.FC = () => {
  const handleClick = () => {
    const s = (window as any).smartsupp
    // Try common ways to open Smartsupp widget; this is best-effort.
    try {
      if (typeof s === 'function') {
        s('open')
        return
      }
      if (s && typeof s.reveal === 'function') {
        s.reveal()
        return
      }
      // Fallback: focus any smartsupp widget root if present
      const el = document.querySelector('[id^="smartsupp"]') || document.querySelector('.smartsupp-launcher')
      if (el && (el as HTMLElement).click) (el as HTMLElement).click()
    } catch (e) {
      // ignore
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Open live chat"
      title="Open chat"
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#6C63FF',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C7.03 3 3 6.58 3 11.07c0 2.66 1.53 5.06 3.96 6.62L6 21l3.7-1.02c.92.27 1.9.42 2.96.42 4.97 0 9-3.58 9-8.07S16.97 3 12 3z" fill="white"/>
        <path d="M8.5 10.5h7v1h-7z" fill="#6C63FF" opacity="0.0"/>
      </svg>
    </button>
  )
}

export default SmartsuppButton
