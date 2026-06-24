import { Metadata } from 'next';
import StartupGeneratorClient from './client';

export const metadata: Metadata = {
  title: 'Startup Generator | ToolHive',
  description: 'Generate a complete startup kit from your idea in under 60 seconds.',
};

export default function StartupGeneratorPage() {
  return <StartupGeneratorClient />;
}
