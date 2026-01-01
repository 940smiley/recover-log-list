'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (typeof window === 'undefined') return
        if (!('serviceWorker' in navigator)) return

        navigator.serviceWorker
            .register('/sw.js')
            .catch((error) => console.error('Service worker registration failed', error))
    }, [])

    return null
}
