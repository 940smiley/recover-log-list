import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Collectibles Log Book',
    description: 'Manage your collectibles with AI and Cloud integration',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#2563eb" />
            </head>
            <body className={inter.className}>
                <ServiceWorkerRegister />
                <div className="flex">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 ml-64 p-8 bg-transparent">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}
