import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import ServiceItem from '../components/ui/ServiceItem'
import { services } from '../data/services'
import { useTheme } from '../context/ThemeContext'

export default function About() {
  const { theme } = useTheme()

  return (
    <>
      <header>
        <ArticleTitle>About me</ArticleTitle>
      </header>

      <section className={`text-fs-6 font-light leading-relaxed mb-8 ${
        theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
      }`}>
        <p className="mb-4">
          I am an interdisciplinary Software Engineer with 10+ years of experience in Academia, Banking, Google. I am based in Zurich, Switzerland, but open to relocate for the right opportunity and the right location.
        </p>
        <p className="mb-4">
          I possess a strong analytical background, expertise in modern dev technologies, and innovative thought process.
          My unique blend of academic proficiency in Mathematics, practical experience in Data Engineering, keen business sense, and a problem-solving attitude positions me to excel in diverse environments.
        </p>
        <p>
          My time at Google gave me exposure to world-class engineering practices, large-scale distributed systems, and rigorous code review culture. Working in startups taught me to wear multiple hats, move fast, take ownership end-to-end, and deliver with limited resources. Together, these experiences allow me to bring both engineering excellence and pragmatic execution to any team.
        </p>
      </section>

      <section>
        <SectionTitle>What I'm doing</SectionTitle>
        <ul className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <ServiceItem
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </ul>
      </section>
    </>
  )
}
