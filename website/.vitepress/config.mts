import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Mittss',
  description: 'Lightweight, extendable event emitter / pubsub.',
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

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],

    footer: {
      message: 'MIT License.',
      copyright: 'Copyright © 2025-present nnecec',
    },
  },
})
