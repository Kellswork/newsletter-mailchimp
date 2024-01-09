import Image from 'next/image'
import { Inter } from 'next/font/google'
import Newsletter from '@/components/newsletter'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Newsletter/>
  )
}
