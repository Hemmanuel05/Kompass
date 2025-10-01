export interface KaitoProject {
  id: string;
  name: string;
  status: 'pre-tge' | 'active-campaign' | 'post-tge';
  description?: string;
  category?: string;
  rewards?: string;
  requirements?: string;
  twitter?: string;
  website?: string;
  lastUpdated: string;
  source: string;
}

export const kaitoProjects: KaitoProject[] = [
  {
    id: 'infinex',
    name: 'Infinex',
    status: 'active-campaign',
    description: 'Cross-chain defi platform running the "YapRun" campaign.',
    category: 'DeFi',
    rewards: '$6M across 4 seasons (Season 1: $900K). Patron NFT holders get enhanced multipliers.',
    requirements: 'Participate in the YapRun campaign on Kaito.',
    twitter: '@infinex_app',
    website: 'https://infinex.io',
    lastUpdated: '2025-09-27',
    source: 'project-leaderboards'
  },
  {
    id: 'bybit partnership',
    name: 'Bybit Partnership',
    status: 'active-campaign',
    description: 'Kaito x Bybit collaboration focused on content around traditional finance concepts on crypto.',
    category: 'TradFi',
    rewards: '$1M deposit bonuses + $100K yapper rewards',
    requirements: 'Create quality content about Bybit, xStocks, CFD, TradFi. Must have >250 yaps, 5000 sKaito, or 1 Yapybara NFT.',
    twitter: '@Bybit_Official',
    website: 'https://www.bybit.com',
    lastUpdated: '2025-09-27',
    source: 'project-leaderboards'
  },
  {
    id: 'monad',
    name: 'Monad',
    status: 'pre-tge',
    description: 'A high-performance L1 blockchain designed for parallel execution, aiming to increase throughput.',
    category: 'L1 Blockchain',
    twitter: '@monad_xyz',
    website: 'https://monad.xyz',
    lastUpdated: '2025-09-26',
    source: 'pre-tge-arena'
  },
    {
    id: 'theoriq',
    name: 'Theoriq',
    status: 'pre-tge',
    description: 'An AI-powered ecosystem for decentralized knowledge and prediction markets.',
    category: 'AI',
    twitter: '@Theoriq_AI',
    website: 'https://theoriq.ai',
    lastUpdated: '2025-09-25',
    source: 'pre-tge-arena'
  },
];

export const findProjectByName = (name: string): KaitoProject | undefined => {
  if (!name) return undefined;
  const lowerCaseName = name.toLowerCase().trim();
  if (!lowerCaseName) return undefined;
  return kaitoProjects.find(p => p.id.includes(lowerCaseName) || p.name.toLowerCase().includes(lowerCaseName));
};