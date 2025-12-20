import { useState } from 'react'
import { Mail, MapPin, Linkedin, ChevronDown } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from './ThemeToggle'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { theme } = useTheme()

  return (
    <aside className={`rounded-20 p-4 md:p-8 shadow-shadow-1 border mb-4 lg:mb-0 lg:sticky lg:top-16 lg:w-72 transition-all duration-500 overflow-hidden ${
      theme === 'dark'
        ? 'bg-eerie-black-2 border-jet'
        : 'bg-light-card border-gray-200'
    } ${isExpanded ? 'max-h-[600px]' : 'max-h-28 md:max-h-44 lg:max-h-none'}`}>

      {/* Basic Info */}
      <div className="flex items-center gap-4 lg:flex-col lg:text-center relative">
        <figure className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-onyx flex-shrink-0">
          <img
            src="/images/pazqog.jpg"
            alt="Stefano Pascolutti"
            className="w-full h-full object-cover rounded-full"
          />
        </figure>

        <div className="flex-1 lg:w-full">
          <h1 className={`text-fs-3 md:text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-white-2' : 'text-light-text'
          }`}>
            Stefano pazqo Pascolutti
          </h1>
          <p className={`text-fs-8 md:text-xs font-light px-3 py-1 rounded-lg w-fit lg:mx-auto ${
            theme === 'dark' ? 'bg-onyx text-white-1' : 'bg-gray-100 text-light-text'
          }`}>
            AI/ML Researcher, Math PhD, Puzzler
          </p>
        </div>

        {/* Mobile expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute -top-4 -right-4 md:-top-8 md:-right-8 rounded-bl-2xl rounded-tr-20 p-2 md:p-3 shadow-shadow-2 transition-all lg:hidden ${
            theme === 'dark'
              ? 'bg-gradient-jet text-orange-yellow-crayola'
              : 'bg-gray-100 text-light-accent'
          }`}
        >
          <span className="hidden md:block text-fs-8">Show Contacts</span>
          <ChevronDown className={`w-4 h-4 md:hidden transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable Contact Info */}
      <div className={`transition-all duration-500 lg:opacity-100 lg:visible ${
        isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible lg:opacity-100 lg:visible'
      }`}>
        <div className={`w-full h-px my-4 ${theme === 'dark' ? 'bg-jet' : 'bg-gray-200'}`} />

        <ul className="space-y-4">
          <li className="flex items-center gap-4">
            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-shadow-1 ${
              theme === 'dark'
                ? 'bg-border-gradient-onyx text-orange-yellow-crayola'
                : 'bg-gray-100 text-light-accent'
            }`}>
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className={`text-fs-8 uppercase ${theme === 'dark' ? 'text-light-gray-70' : 'text-light-muted'}`}>
                Email
              </p>
              <a
                href="mailto:pazqop@gmail.com"
                className={`text-fs-7 ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}
              >
                pazqop@gmail.com
              </a>
            </div>
          </li>

          <li className="flex items-center gap-4">
            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-shadow-1 ${
              theme === 'dark'
                ? 'bg-border-gradient-onyx text-orange-yellow-crayola'
                : 'bg-gray-100 text-light-accent'
            }`}>
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className={`text-fs-8 uppercase ${theme === 'dark' ? 'text-light-gray-70' : 'text-light-muted'}`}>
                Location
              </p>
              <address className={`text-fs-7 not-italic ${theme === 'dark' ? 'text-white-2' : 'text-light-text'}`}>
                Zurich, CH
              </address>
            </div>
          </li>
        </ul>

        <div className={`w-full h-px my-4 ${theme === 'dark' ? 'bg-jet' : 'bg-gray-200'}`} />

        {/* Social Links + Theme Toggle */}
        <div className="flex items-center justify-between">
          <ul className="flex gap-4">
            <li>
              <a
                href="https://www.linkedin.com/in/pazqo/"
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-light-gray-70 hover:text-light-gray'
                    : 'text-light-muted hover:text-light-text'
                }`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
