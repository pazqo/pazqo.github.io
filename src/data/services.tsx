import { FlaskConical, Code, BookOpen, Puzzle, Sparkles } from 'lucide-react'

const iconClass = "w-10 h-10"

export const services = [
  {
    icon: <FlaskConical className={iconClass} strokeWidth={1.5} />,
    title: 'Research Engineer | inait',
    description: 'Building testing frameworks for timeseries forecasting experiments at inait, a Lausanne-based neuroscience and AI company.',
  },
  {
    icon: <Code className={iconClass} strokeWidth={1.5} />,
    title: 'Coding Puzzles',
    description: (
      <>
        I'm always active on <a href="https://projecteuler.net/" className="text-orange-yellow-crayola hover:underline" target="_blank" rel="noopener noreferrer">Project Euler</a> (140+ and counting) and on <a href="https://adventofcode.com/" className="text-orange-yellow-crayola hover:underline" target="_blank" rel="noopener noreferrer">AdventOfCode</a> (currently completed all challenges since 2015).
      </>
    ),
  },
  {
    icon: <BookOpen className={iconClass} strokeWidth={1.5} />,
    title: 'Learning',
    description: "I'm constantly learning stuff, from new programming languages (e.g. Rust) to new AI architectures or languages (e.g. Japanese)",
  },
  {
    icon: <Puzzle className={iconClass} strokeWidth={1.5} />,
    title: 'Everything Puzzles',
    description: 'I love puzzles, from sudoku variations to mechanical puzzles.',
  },
  {
    icon: <Sparkles className={iconClass} strokeWidth={1.5} />,
    title: 'Vibe Coding',
    description: 'Building side projects and prototypes with AI assistance - letting the vibes guide the architecture.',
  },
]
