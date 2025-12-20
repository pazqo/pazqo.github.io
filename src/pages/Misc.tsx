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

      <section className={`rounded-16 overflow-hidden border ${
        theme === 'dark' ? 'border-jet' : 'border-gray-200'
      }`}>
        <SectionTitle className="p-4 pb-0">I live near here</SectionTitle>
        <figure className="h-64 md:h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10085.869453744042!2d8.532124293333093!3d47.364271177955416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sch!4v1731516444088!5m2!1sen!2sch"
            className={`w-full h-full border-none ${
              theme === 'dark' ? 'grayscale invert' : ''
            }`}
            loading="lazy"
            title="Location map"
          />
        </figure>
      </section>
    </>
  )
}
