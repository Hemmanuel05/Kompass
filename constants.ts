import { Feature, FeatureConfig } from './types';
import ContentClarityHelper from './components/features/ContentClarityHelper';
import ThreadHelper from './components/features/ThreadHelper';
import ReplyCraft from './components/features/ReplyCraft';
import ConversationContinuator from './components/features/ConversationContinuator';
import ContentIdeas from './components/features/ContentIdeas';
import PostReflection from './components/features/PostReflection';
import ConversationFinder from './components/features/ConversationFinder';
import WritingVoiceTracker from './components/features/WritingVoiceTracker';
import KaitoProjectHelper from './components/features/KaitoProjectHelper';
import CryptoMarketCommentary from './components/features/CryptoMarketCommentary';
import ImpressionFarmer from './components/features/ImpressionFarmer';
import InspiredOriginalGenerator from './components/features/InspiredOriginalGenerator';
import ProjectDataFetcher from './components/features/ProjectDataFetcher';

import MessageCircleIcon from './components/icons/MessageCircleIcon';
import ListIcon from './components/icons/ListIcon';
import ReplyIcon from './components/icons/ReplyIcon';
import CornerDownRightIcon from './components/icons/CornerDownRightIcon';
import LightbulbIcon from './components/icons/LightbulbIcon';
import BarChartIcon from './components/icons/BarChartIcon';
import SearchIcon from './components/icons/SearchIcon';
import UserIcon from './components/icons/UserIcon';
import TrendingUpIcon from './components/icons/TrendingUpIcon';
import FileTextIcon from './components/icons/FileTextIcon';
import FlameIcon from './components/icons/FlameIcon';
import ShuffleIcon from './components/icons/ShuffleIcon';
import DatabaseIcon from './components/icons/DatabaseIcon';


export const FEATURES: FeatureConfig[] = [
  {
    id: Feature.ClarityHelper,
    title: 'Content Feedback Helper',
    description: "Get honest feedback on your draft. Checks for clarity, authenticity, and algorithm friendliness, including Tweepcred and its potential for likes and retweets.",
    icon: MessageCircleIcon,
    component: ContentClarityHelper,
  },
  {
    id: Feature.ThreadHelper,
    title: 'Thread Architect',
    description: "Structure threads for optimal engagement based on algorithm behavior",
    icon: ListIcon,
    component: ThreadHelper,
  },
  {
    id: Feature.ReplyCraft,
    title: 'Natural Reply Helper',
    description: "Stuck on how to reply? Paste the original post, add an image if there is one, and get some natural-sounding ideas.",
    icon: ReplyIcon,
    component: ReplyCraft,
  },
  {
    id: Feature.ConversationContinuator,
    title: 'Conversation Continuator',
    description: "Stuck after they've replied? Paste the conversation history to get natural, value-add follow-up ideas.",
    icon: CornerDownRightIcon,
    component: ConversationContinuator,
  },
  {
    id: Feature.ContentIdeas,
    title: 'Topic Explorer',
    description: "Find content angles optimized for X's engagement algorithm",
    icon: LightbulbIcon,
    component: ContentIdeas,
  },
  {
    id: Feature.PostReflection,
    title: 'Performance Analyzer',
    description: "Manually enter your post's performance metrics to get an analysis based on algorithm weights for likes, retweets, and replies.",
    icon: BarChartIcon,
    component: PostReflection,
  },
  {
    id: Feature.ConversationFinder,
    title: 'Algorithm-Aware Conversation Finder',
    description: "Find discussions where your contributions could get liked and retweeted",
    icon: SearchIcon,
    component: ConversationFinder,
  },
  {
    id: Feature.VoiceTracker,
    title: 'Authentic Voice Monitor',
    description: "Maintain an authentic voice to build long term account reputation (Tweepcred)",
    icon: UserIcon,
    component: WritingVoiceTracker,
  },
  {
    id: Feature.KaitoProjectHelper,
    title: 'Project Research Helper',
    description: "Organize your thoughts about crypto projects and find interesting angles to write about. Definitely not promising you'll get rich or famous, just makes the research and writing process a bit easier.",
    icon: TrendingUpIcon,
    component: KaitoProjectHelper,
  },
  {
    id: Feature.ProjectDataFetcher,
    title: 'Live Project Fetcher',
    description: 'Use an AI agent to fetch a fresh list of active projects and campaigns directly from the Kaito leaderboards.',
    icon: DatabaseIcon,
    component: ProjectDataFetcher,
  },
  {
    id: Feature.CryptoMarketCommentary,
    title: 'Crypto Market Commentary Generator',
    description: 'Generate insightful commentary on recent news by adding analytical frameworks, historical context, and contrarian perspectives.',
    icon: FileTextIcon,
    component: CryptoMarketCommentary,
  },
  {
    id: Feature.ImpressionFarmer,
    title: 'Impression Farming Reply Generator',
    description: 'Craft viral replies for mega-accounts and trending content to maximize impressions and drive engagement.',
    icon: FlameIcon,
    component: ImpressionFarmer,
  },
  {
    id: Feature.InspiredOriginal,
    title: 'Inspired Original Content Generator',
    description: "Transform a smart follower's post into a unique, original piece of content that bypasses AI detection and maximizes engagement.",
    icon: ShuffleIcon,
    component: InspiredOriginalGenerator,
  },
];