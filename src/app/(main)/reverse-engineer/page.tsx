import { Metadata } from 'next';
import ReverseEngineerClient from './client';

export const metadata: Metadata = {
  title: 'Reverse Engineer Anything | ToolHive',
  description: 'Analyze any website URL or screenshot and instantly receive a complete design, tech stack, and SEO breakdown.',
};

export default function ReverseEngineerPage() {
  return <ReverseEngineerClient />;
}
