import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import { useTheme } from '../context/ThemeContext'

export default function Misc() {
  const { theme } = useTheme()

  return (
    <>
      <header>
        <ArticleTitle>Misc</ArticleTitle>
      </header>

      <section className={`rounded-16 overflow-hidden border mb-8 ${
        theme === 'dark' ? 'border-jet' : 'border-gray-200'
      }`}>
        <SectionTitle className="p-4 pb-0">Personal Achievements / Things that make me proud</SectionTitle>
        <p className={`p-4 text-fs-6 ${
          theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
        }`}>
          TBD
        </p>
      </section>

    </>
  )
}
