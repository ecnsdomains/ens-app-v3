'use client'

import { useEffect } from 'react'
import styled from 'styled-components'

// Extend Window interface for UnicornStudio
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean
      init: () => void
    }
  }
}

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`

export function UnicornBackground() {
  useEffect(() => {
    // Load Unicorn Studio script
    if (typeof window !== 'undefined' && !window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => {} }
      const script = document.createElement('script')
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init()
          window.UnicornStudio.isInitialized = true
        }
      }
      document.head.appendChild(script)
    }
  }, [])

  return (
    <BackgroundContainer>
      <div
        data-us-project="yWZ2Tbe094Fsjgy9NRnD"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
        }}
      />
    </BackgroundContainer>
  )
}

export default UnicornBackground
