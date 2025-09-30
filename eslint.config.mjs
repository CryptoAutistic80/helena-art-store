import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:frontend',
              onlyDependOnLibsWithTags: ['scope:frontend', 'scope:shared'],
            },
            {
              sourceTag: 'scope:backend',
              onlyDependOnLibsWithTags: ['scope:backend', 'scope:shared'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'layer:controller',
              onlyDependOnLibsWithTags: ['layer:controller', 'layer:service', 'layer:dto', 'layer:util', 'scope:shared'],
            },
            {
              sourceTag: 'layer:service',
              onlyDependOnLibsWithTags: ['layer:service', 'layer:repository', 'layer:dto', 'layer:util', 'scope:shared'],
            },
            {
              sourceTag: 'layer:repository',
              onlyDependOnLibsWithTags: ['layer:repository', 'layer:schema', 'layer:util', 'scope:shared'],
            },
            {
              sourceTag: 'layer:schema',
              onlyDependOnLibsWithTags: ['layer:schema', 'layer:util', 'scope:shared'],
            },
            {
              sourceTag: 'layer:dto',
              onlyDependOnLibsWithTags: ['layer:dto', 'layer:util', 'scope:shared'],
            },
            {
              sourceTag: 'layer:ui',
              onlyDependOnLibsWithTags: ['layer:ui', 'layer:util', 'scope:shared'],
            },
            {
              sourceTag: 'layer:util',
              onlyDependOnLibsWithTags: ['layer:util', 'scope:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {},
  },
];
