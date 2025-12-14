import React from 'react'

const TELEGRAM_LINK = 'https://t.me/your_telegram_group'; // Replace with your actual Telegram group or bot link

const InlineTelegramButton: React.FC = () => (
  <a
    href={TELEGRAM_LINK}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#229ED9',
      color: '#fff',
      textDecoration: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}
    aria-label="Chat on Telegram"
    title="Chat on Telegram"
  >
    <svg width="28" height="28" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="120" fill="#229ED9"/>
      <path d="M180.5 74.5L157.5 178.5C155.5 186.5 150.5 188.5 143.5 184.5L110.5 160.5L94.5 175.5C92.5 177.5 91 179 87.5 179L90.5 144.5L157.5 85.5C160.5 83 157.5 81.5 153.5 84.5L77.5 137.5L43.5 126.5C36.5 124.5 36.5 119.5 45.5 116.5L172.5 71.5C178.5 69.5 183.5 72.5 180.5 74.5Z" fill="white"/>
    </svg>
  </a>
)

export default InlineTelegramButton
