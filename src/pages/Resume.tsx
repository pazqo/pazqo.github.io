import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import Timeline from '../components/ui/Timeline'
import TimelineItem from '../components/ui/TimelineItem'
import SkillBar from '../components/ui/SkillBar'
import TagGroup from '../components/ui/TagGroup'
import ContentCard from '../components/ui/ContentCard'
import { workExperience, education, onlineCourses } from '../data/experience'
import { programmingSkills, languages, keyQualifications, interests } from '../data/skills'
import { useTheme } from '../context/ThemeContext'

export default function Resume() {
  const { theme } = useTheme()

  return (
    <>
      <header>
        <ArticleTitle>Resume</ArticleTitle>
      </header>

      {/* Key Qualifications */}
      <section className="mb-8">
        <SectionTitle>Key Qualifications</SectionTitle>
        <ul className={`text-fs-6 font-light leading-relaxed pl-4 space-y-2 ${
          theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
        }`}>
          {keyQualifications.map((qual, idx) => (
            <li key={idx} className="list-disc list-inside">
              {qual}
            </li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <SectionTitle>Experience</SectionTitle>

      <Timeline title="Work Experience">
        {workExperience.map((exp) => (
          <TimelineItem
            key={exp.title}
            title={exp.title}
            dateRange={exp.dateRange}
            description={exp.description}
          />
        ))}
      </Timeline>

      <Timeline title="Education">
        {education.map((edu) => (
          <TimelineItem
            key={edu.title}
            title={edu.title}
            subtitle={edu.subtitle}
            dateRange={edu.dateRange}
            description={edu.description}
          />
        ))}
      </Timeline>

      <Timeline title="Independent Education - Online Courses">
        {onlineCourses.map((course) => (
          <TimelineItem
            key={course.title}
            title={course.title}
            subtitle={course.provider}
            dateRange=""
          />
        ))}
      </Timeline>

      {/* Programming Skills */}
      <section className="mb-8">
        <SectionTitle>My Programming Skills</SectionTitle>
        <ContentCard>
          <ul className="grid md:grid-cols-2 gap-x-8">
            {programmingSkills.map((skill) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                percentage={skill.percentage}
              />
            ))}
          </ul>
        </ContentCard>
      </section>

      {/* Language Skills */}
      <section className="mb-8">
        <SectionTitle>Language Skills</SectionTitle>
        <ContentCard>
          <div className="space-y-3">
            {languages.map((lang) => (
              <div key={lang.name} className={`flex text-fs-7 font-light ${
                theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
              }`}>
                <h5 className={`w-24 font-medium ${
                  theme === 'dark' ? 'text-white-2' : 'text-light-text'
                }`}>
                  {lang.name}
                </h5>
                <p className="italic">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        </ContentCard>
      </section>

      {/* Interests */}
      <section>
        <SectionTitle>Various topics that catch my interest</SectionTitle>
        {Object.entries(interests).map(([title, tags]) => (
          <TagGroup key={title} title={title} tags={tags} />
        ))}
      </section>
    </>
  )
}
