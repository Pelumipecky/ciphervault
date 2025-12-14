// src/components/ui/SmartsuppWidget.tsx
import React, { useEffect } from 'react'

const SMARTSUPP_KEY = '10876c3f5a49136bdcbaa00ea358ae20809c164b'

const SmartsuppWidget: React.FC = () => {
  useEffect(() => {
    // set the key on the global object as the original snippet does
    ;(window as any)._smartsupp = (window as any)._smartsupp || {}
    ;(window as any)._smartsupp.key = SMARTSUPP_KEY

    // Avoid injecting the loader twice
    if ((window as any).smartsupp) return

    const d = document
    const s = d.getElementsByTagName('script')[0]
    const c = d.createElement('script')
    c.type = 'text/javascript'
    c.charset = 'utf-8'
    c.async = true
    c.src = 'https://www.smartsuppchat.com/loader.js?'
    s.parentNode?.insertBefore(c, s)

    return () => {
      // cleanup: remove injected script if present
      if (c.parentNode) c.parentNode.removeChild(c)
    }
  }, [])

  return (
    <noscript>
      Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a>
    </noscript>
  )
}

export default SmartsuppWidget
