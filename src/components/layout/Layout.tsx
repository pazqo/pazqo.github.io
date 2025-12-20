import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useTheme } from '../../context/ThemeContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme()

  return (
    <main className={`min-h-screen p-3 pb-20 md:p-4 md:pb-24 lg:pb-4 ${
      theme === 'dark' ? 'bg-smoky-black' : 'bg-light-bg'
    }`}>
      <div className="max-w-[1200px] mx-auto lg:flex lg:items-start lg:gap-6">
        <Sidebar />
        <div className="lg:flex-1 lg:relative">
          <Navbar />
          <article className={`rounded-20 p-4 md:p-8 shadow-shadow-1 border animate-fade ${
            theme === 'dark'
              ? 'bg-eerie-black-2 border-jet'
              : 'bg-light-card border-gray-200'
          }`}>
            {children}
          </article>
        </div>
      </div>
    </main>
  )
}
