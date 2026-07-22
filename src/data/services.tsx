import { FlaskConical, Code, BookOpen, Puzzle, Sparkles } from 'lucide-react'

const iconClass = "w-10 h-10"

export const services = [
  {
    icon: <FlaskConical className={iconClass} strokeWidth={1.5} />,
    title: 'Principal ML Engineer | RedHat',
    description: 'Working on vLLM and Inference Engineering with the llm-d team at RedHat.',
  },
  {
    icon: <Code className={iconClass} strokeWidth={1.5} />,
    title: 'Coding Puzzles',
    description: (
      <>
        I'm always active on <a href="https://projecteuler.net/" className="text-orange-yellow-crayola hover:underline" target="_blank" rel="noopener noreferrer">Project Euler</a> (170+ and counting) and on <a href="https://adventofcode.com/" className="text-orange-yellow-crayola hover:underline" target="_blank" rel="noopener noreferrer">AdventOfCode</a> (currently completed all challenges since 2015).
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
    description: (
      <>
        I love puzzles, from sudoku variations to mechanical puzzles. I even designed <a href="/ouroboros" className="text-orange-yellow-crayola hover:underline">Ouroboros</a>, which I presented at IPP 2026.
      </>
    ),
  },
  {
    icon: <Sparkles className={iconClass} strokeWidth={1.5} />,
    title: 'Vibe Coding',
    description: 'Building side projects and prototypes with AI assistance - letting the vibes guide the architecture.',
  },
]
