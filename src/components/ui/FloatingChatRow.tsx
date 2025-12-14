import React from 'react'
import InlineWhatsAppButton from './InlineWhatsAppButton'
import InlineTelegramButton from './InlineTelegramButton'
import SmartsuppButton from './SmartsuppButton'

const FloatingChatRow: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      left: 24,
      bottom: 24,
      zIndex: 9999,
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }}>
      <SmartsuppButton />
      <InlineWhatsAppButton />
      <InlineTelegramButton />
    </div>
  )
}

export default FloatingChatRow
