import type { Metadata } from 'next'
import { Lexend_Deca } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Onboarding from '@/components/Onboarding'

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-lexend-deca',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Havaia - Experiencias en Buenos Aires para la comunidad israelí',
  description: 'Descubrí Buenos Aires con la comunidad israelí que ya la vive. Experiencias curadas, grupos personalizados y anfitriones verificados.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={lexendDeca.variable} dir="ltr">
      <body className={lexendDeca.className}>
        <Providers>
          {children}
          <Onboarding />
        </Providers>
      </body>
    </html>
  )
}

