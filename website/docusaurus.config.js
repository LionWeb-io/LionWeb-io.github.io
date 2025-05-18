// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LionWeb',
  tagline: 'Language Interfaces on the Web',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://lionweb-io.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'lionweb-io',
  projectName: 'LionWeb-io.github.io',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, this is a required field.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/lionweb-io/LionWeb-io.github.io/tree/main/website/',
          routeBasePath: '/', // Set docs as the root
        },
        blog: false,
        pages: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'LionWeb',
      logo: {
        alt: 'LionWeb Logo',
        src: 'img/lionweb-logo.png',
      },
      items: [
        {
          label: 'Java references',
          href: 'https://lionweb.io/lionweb-java/api/index.html',
          position: 'left',
          target: '_blank',
        },
        {
          href: 'https://github.com/lionweb-io',
          label: 'LionWeb on GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LionWeb. Built with Docusaurus.`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['python', 'java', 'typescript', 'kotlin', 'csharp'],
    },
    trailingSlash: true,
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
};

module.exports = config; 