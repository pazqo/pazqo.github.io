export const workExperience = [
  {
    title: 'Senior Research Engineer @ inait',
    dateRange: 'Jun 2025 — Present',
    description: (
      <>
        Refactored legacy components to lower technical debt and streamline model integration.
        Ported data pipelines to Dagster, improving reliability and maintainability.
        Optimized portfolio optimization workflows, cutting latency with caching/parallelization.
      </>
    ),
  },
  {
    title: 'Senior Research Engineer @ Giotto.ai',
    dateRange: 'Aug 2024 — Jan 2025',
    description: (
      <>
        Achieved 11th place (Gold Medal 🥇) in <a href="https://www.kaggle.com/competitions/arc-prize-2024/overview" className="text-orange-yellow-crayola hover:underline" target="_blank" rel="noopener noreferrer">Kaggle's ARC-AGI 2024</a> competition.
        Led a team on verification and feedback for generated solutions, improving model reliability.
        R&D on hybrid multi-modal models for automated reasoning and problem solving.
      </>
    ),
  },
  {
    title: 'Senior Software Engineer @ Google',
    dateRange: 'Jan 2020 — Jun 2024',
    description: (
      <>
        Improved Local Shopping Quality by enhancing query understanding and retrieval models.
        Key contributor to DMA-compliant redesign of Shopping retrieval, enabling integration of local product results into Organic Search.
        Contributed to large-scale distributed systems design, aligning with product and infra teams.
        Conducted 100+ technical interviews and design reviews.
      </>
    ),
  },
  {
    title: 'AI Lead @ UniCredit R&D',
    dateRange: 'Oct 2013 — Nov 2019',
    description: (
      <>
        Career progression: Data Scientist → ML/AI Engineer → AI Lead.
        Developed and deployed NLP-powered full-stack applications for internal analytics and client-facing solutions.
        Built ML pipelines for text processing, classification, and evaluation.
        Managed a team of 5 engineers, leading delivery of AI/ML applications into production.
      </>
    ),
  },
  {
    title: 'Riemann Fellowship @ Riemann Center, Hannover',
    dateRange: 'Oct 2012 — Jan 2013',
    description: 'Research on Moduli Spaces of Curves.',
  },
]

export const publications = [
  {
    title: 'An affine open covering of Mg for g ≤ 5',
    venue: 'Geometriae Dedicata, vol. 158, pp. 61–68',
    year: '2012',
    url: 'https://link.springer.com/article/10.1007/s10711-011-9619-y',
  },
  {
    title: 'Hermes: A distributed-messaging tool for NLP',
    venue: 'IEEE BigData 2016, Washington D.C., USA',
    year: '2016',
  },
  {
    title: 'GarNLP: A NLP pipeline for garnishment documents',
    venue: 'Information Systems Frontiers, vol. 23, pp. 101–114',
    year: '2019',
    url: 'https://link.springer.com/article/10.1007/s10796-020-10005-6',
  },
]

export const achievements = [
  { icon: '🥇', text: "Gold Medal ARC AGI '24 (11th place)", url: 'https://www.kaggle.com/competitions/arc-prize-2024/leaderboard' },
  { icon: '⭐', text: 'Advent of Code: 524 stars (2015-2025)', url: 'https://adventofcode.com' },
  { icon: '🧮', text: 'Project Euler: 165+ problems solved', url: 'https://projecteuler.net/profile/pazqo.png' },
  { icon: '🧩', text: 'Logic Masters: 840+ puzzles solved', url: 'https://logic-masters.de/Raetselportal/Benutzer/geloest.php?name=pazqo' },
  { icon: '🏆', text: 'ABI Innovation Award 2018 (payments optimization)', url: "https://bancaforte.it/video/uc-balance-di-unicredit-vince-il-premio-abi-innovazione-2018-RB83117j" },
  { icon: '📚', text: 'INdAM Fellowship recipient (Bachelor & Master)' },
]

export const education = [
  {
    title: 'Ph.D. in Mathematics',
    subtitle: 'La Sapienza - Roma',
    dateRange: 'Oct 2007 - Dec 2011',
    description: (
      <em>Boundaries of the moduli space of hyperelliptic curves with a level 2 structure</em>
    ),
    extra: 'Algebraic Geometry, Director: Prof. R. Salvati Manni',
  },
  {
    title: 'Master Degree',
    subtitle: 'Università degli Studi di Udine',
    dateRange: 'Oct 2004 - Dec 2006',
    description: (
      <>
        <em>On several variables Chebyshev Polynomials</em>, Number Theory, Advisor: Prof. P. Corvaja<br />
        110/110 cum Laude
      </>
    ),
  },
  {
    title: 'Bachelor Degree',
    subtitle: 'Università degli Studi di Udine',
    dateRange: 'Sep 2001 - Oct 2004',
    description: (
      <>
        <em>Some remarks about a pursuing problem</em>, Calculus, Advisor: Prof. F. Zanolin<br />
        110/110 cum Laude
      </>
    ),
  },
]

export const onlineCourses = [
  { title: 'Building Multimodal Search and RAG', provider: 'Weaviate + Deeplearning.AI' },
  { title: 'Generative AI with LLMs', provider: 'AWS + Deeplearning.AI + Coursera' },
  { title: 'Introduction to Computer Vision and Image Processing', provider: 'IBM + Coursera' },
  { title: 'iOS Mobile Application Development', provider: 'Meta + Coursera' },
  { title: 'Functional Programming Principles in Scala', provider: 'Coursera' },
  { title: 'An Introduction to Interactive Programming in Python', provider: 'Coursera' },
  { title: 'Algorithms: Design and Analysis, Part 1 & 2', provider: 'Coursera' },
]
