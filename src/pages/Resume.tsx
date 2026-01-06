import { Star, Briefcase, FileText, Trophy, Wrench, Globe, Heart, GraduationCap, Monitor } from 'lucide-react'
import ArticleTitle from '../components/ui/ArticleTitle'
import SectionTitle from '../components/ui/SectionTitle'
import Timeline from '../components/ui/Timeline'
import TimelineItem from '../components/ui/TimelineItem'
import TagGroup from '../components/ui/TagGroup'
import { workExperience, education, onlineCourses, publications, achievements } from '../data/experience'
import { technicalSkills, languages, keyQualifications, interests } from '../data/skills'
import { useTheme } from '../context/ThemeContext'

const iconClass = "w-5 h-5 inline-block mr-2 -mt-1 text-orange-yellow-crayola"
const timelineIconClass = "w-6 h-6"

export default function Resume() {
  const { theme } = useTheme()

  return (
    <>
      <header>
        <ArticleTitle>Resume</ArticleTitle>
      </header>

      {/* Key Qualifications */}
      <section className="mb-8">
        <SectionTitle><Star className={iconClass} strokeWidth={1.5} />Key Qualifications</SectionTitle>
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
      <SectionTitle><Briefcase className={iconClass} strokeWidth={1.5} />Experience</SectionTitle>

      <Timeline title="Work Experience" icon={<Briefcase className={timelineIconClass} strokeWidth={1.5} />}>
        {workExperience.map((exp) => (
          <TimelineItem
            key={exp.title}
            title={exp.title}
            dateRange={exp.dateRange}
            description={exp.description}
          />
        ))}
      </Timeline>

      <Timeline title="Education" icon={<GraduationCap className={timelineIconClass} strokeWidth={1.5} />}>
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

      <Timeline title="Online Courses" icon={<Monitor className={timelineIconClass} strokeWidth={1.5} />}>
        {onlineCourses.map((course) => (
          <TimelineItem
            key={course.title}
            title={course.title}
            subtitle={course.provider}
            dateRange=""
          />
        ))}
      </Timeline>

      {/* Publications */}
      <section className="mb-8">
        <SectionTitle><FileText className={iconClass} strokeWidth={1.5} />Publications</SectionTitle>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-smoky-black' : 'bg-gray-50'}`}>
          <ul className="space-y-3">
            {publications.map((pub) => (
              <li key={pub.title} className={`text-fs-6 ${
                theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
              }`}>
                {pub.url ? (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-yellow-crayola hover:underline"
                  >
                    {pub.title}
                  </a>
                ) : (
                  <span className={theme === 'dark' ? 'text-white-2' : 'text-light-text'}>
                    {pub.title}
                  </span>
                )}
                <br />
                <span className="text-fs-7">{pub.venue}, {pub.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-8">
        <SectionTitle><Trophy className={iconClass} strokeWidth={1.5} />Achievements</SectionTitle>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-smoky-black' : 'bg-gray-50'}`}>
          <ul className="grid md:grid-cols-2 gap-2">
            {achievements.map((achievement) => (
              <li key={achievement.text} className={`flex items-start gap-2 text-fs-6 ${
                theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
              }`}>
                <span>{achievement.icon}</span>
                {achievement.url ? (
                  <a
                    href={achievement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-yellow-crayola hover:underline"
                  >
                    {achievement.text}
                  </a>
                ) : (
                  <span>{achievement.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Technical Skills */}
      <section className="mb-8">
        <SectionTitle><Wrench className={iconClass} strokeWidth={1.5} />Technical Skills</SectionTitle>
        {Object.entries(technicalSkills).map(([title, tags]) => (
          <TagGroup key={title} title={title} tags={tags} />
        ))}
      </section>

      {/* Language Skills */}
      <section className="mb-8">
        <SectionTitle><Globe className={iconClass} strokeWidth={1.5} />Language Skills</SectionTitle>
        <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-smoky-black' : 'bg-gray-50'}`}>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div key={lang.name} className={`flex text-fs-6 ${
                theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
              }`}>
                <span className={`w-24 font-medium ${
                  theme === 'dark' ? 'text-white-2' : 'text-light-text'
                }`}>
                  {lang.name}
                </span>
                <span className="italic">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interests */}
      <section>
        <SectionTitle><Heart className={iconClass} strokeWidth={1.5} />Various topics that catch my interest</SectionTitle>
        {Object.entries(interests).map(([title, tags]) => (
          <TagGroup key={title} title={title} tags={tags} />
        ))}
      </section>
    </>
  )
}
