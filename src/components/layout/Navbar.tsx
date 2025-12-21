import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const navItems = [
  { path: '/', label: 'About' },
  { path: '/resume', label: 'Resume' },
  // { path: '/misc', label: 'Misc' },
  { path: '/puzzles', label: 'Puzzles' },
  { path: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const { theme } = useTheme()

  return (
    <nav className={`fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:top-0 lg:left-auto lg:right-0 lg:w-auto rounded-t-xl lg:rounded-bl-20 lg:rounded-tr-20 shadow-shadow-2 lg:shadow-none backdrop-blur-md z-10 ${
      theme === 'dark'
        ? 'bg-onyx/75 border border-jet'
        : 'bg-white/75 border border-gray-200'
    }`}>
      <ul className="flex justify-center items-center gap-2 md:gap-5 lg:gap-8 px-3 lg:px-5">
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) => `
                block py-4 lg:py-5 px-2 text-fs-8 md:text-fs-7 lg:text-fs-6 font-medium transition-colors
                ${isActive
                  ? 'text-orange-yellow-crayola'
                  : theme === 'dark'
                    ? 'text-light-gray hover:text-light-gray-70'
                    : 'text-light-muted hover:text-light-text'
                }
              `}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
