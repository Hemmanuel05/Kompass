import React from 'react';

export enum Feature {
  ClarityHelper = 'ClarityHelper',
  ThreadHelper = 'ThreadHelper',
  ReplyCraft = 'ReplyCraft',
  ConversationContinuator = 'ConversationContinuator',
  ContentIdeas = 'ContentIdeas',
  PostReflection = 'PostReflection',
  ConversationFinder = 'ConversationFinder',
  VoiceTracker = 'VoiceTracker',
  KaitoProjectHelper = 'KaitoProjectHelper',
  CryptoMarketCommentary = 'CryptoMarketCommentary',
  ImpressionFarmer = 'ImpressionFarmer',
  InspiredOriginal = 'InspiredOriginal',
  ProjectDataFetcher = 'ProjectDataFetcher',
}

export interface FeatureConfig {
  id: Feature;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}