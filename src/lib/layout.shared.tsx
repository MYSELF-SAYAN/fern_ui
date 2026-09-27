import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Leaf } from 'lucide-react';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-bold tracking-tight text-neutral-900 dark:text-white">
          <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Leaf className="size-3.5" />
          </span>
          {appName}
        </span>
      ),
    },
    links: [
      {
        text: 'Components',
        url: '/components',
      },
      {
        text: 'Docs',
        url: '/docs',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

