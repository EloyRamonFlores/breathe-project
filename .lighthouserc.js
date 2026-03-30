module.exports = {
  ci: {
    collect: {
      staticDistDir: '.next',
      url: [
        'http://localhost:3000/en',
        'http://localhost:3000/en/check',
        'http://localhost:3000/en/country/united-states',
        'http://localhost:3000/en/countries',
        'http://localhost:3000/en/learn',
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
