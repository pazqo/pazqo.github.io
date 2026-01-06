import { useTheme } from '../../context/ThemeContext'
import linkedinGamesData from '../../data/linkedinGames.json'

interface LinkedInGame {
  name: string
  plays: number
  winPct: number
  best: string
  streak: number
}

const games = linkedinGamesData as LinkedInGame[]

export default function LinkedInGamesTable() {
  const { theme } = useTheme()

  const gameUrls: Record<string, string> = {
    'Queens': 'https://www.linkedin.com/games/queens/',
    'Tango': 'https://www.linkedin.com/games/tango/',
    'Crossclimb': 'https://www.linkedin.com/games/crossclimb/',
    'Pinpoint': 'https://www.linkedin.com/games/pinpoint/',
    'Zip': 'https://www.linkedin.com/games/zip/',
    'Mini Sudoku': 'https://www.linkedin.com/games/mini-crossword/',
  }

  return (
    <table className={`mt-2 ml-4 text-xs border-collapse ${
      theme === 'dark' ? 'text-light-gray' : 'text-light-muted'
    }`}>
      <thead>
        <tr className={theme === 'dark' ? 'text-white-2' : 'text-light-text'}>
          <th className="text-left pr-3 pb-1 font-medium">Game</th>
          <th className="text-right px-2 pb-1 font-medium">Plays</th>
          <th className="text-right px-2 pb-1 font-medium">Win%</th>
          <th className="text-right px-2 pb-1 font-medium">Best</th>
          <th className="text-right pl-2 pb-1 font-medium">Streak</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game.name}>
            <td className="pr-3 py-px">
              <a
                href={gameUrls[game.name]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-yellow-crayola hover:underline"
              >
                {game.name}
              </a>
            </td>
            <td className="px-2 py-px text-right">{game.plays}</td>
            <td className="px-2 py-px text-right">{game.winPct}%</td>
            <td className="px-2 py-px text-right">{game.best}</td>
            <td className="pl-2 py-px text-right">{game.streak}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
