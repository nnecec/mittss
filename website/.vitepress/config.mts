import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Mittss',
  description: 'Lightweight, extendable event emitter / pubsub.',
  titleTemplate: ':title - Mittss',
  base: process.env.NODE_ENV === 'production' ? '/mittss/' : '/',
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/get-started' },
    ],

    sidebar: [
      { text: 'Get started', link: '/get-started' },
      { text: 'Usage', link: '/usage' },
      { text: 'API', link: '/api' },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/nnecec/mittss' }],

    footer: {
      message: 'MIT License.',
      copyright: 'Copyright © 2025-present nnecec',
    },

    editLink: {
      pattern: 'https://github.com/nnecec/mittss/edit/main/website/:path',
    },

    search: {
      provider: 'local',
    },
  },
  lastUpdated: true,
})
