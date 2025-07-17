# IRCS Certification Microsite

A high-performance, optimized microsite for the Information Release and Compliance Specialist (IRCS) certification program.

## 🚀 Project Overview

This microsite is built with Astro and deployed on Cloudflare Pages, featuring:

- Highly optimized performance (90+ PageSpeed score)
- Responsive design with Tailwind CSS
- Contact form with Cloudflare Turnstile protection
- D1 database integration for form storage
- Comprehensive SEO optimizations

## ✨ Technology Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **Form Protection**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)

## � Project Structure

```text
/
├── public/            # Static assets (images, favicons)
├── src/
│   ├── components/    # UI components
│   │   └── ui/        # Base UI components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page routes and API endpoints
│   │   └── api/       # API routes for form handling
│   ├── scripts/       # Client & server scripts
│   └── styles/        # Global styles
├── astro.config.mjs   # Astro configuration
└── wrangler.json      # Cloudflare configuration
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
