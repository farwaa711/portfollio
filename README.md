# Farwa Ali — Cybersecurity Portfolio

A responsive, static HTML/CSS/JavaScript portfolio built around Farwa's actual cybersecurity work.

## Included
- Professional profile image
- SOC L1-focused hero and project sections
- Brute-force authentication investigation case study
- PortSwigger lab evidence gallery with filters and full-screen viewer
- Links to GitHub and LinkedIn
- Mobile navigation with outside-tap and Escape-to-close behavior
- Responsive dark theme with subtle motion and reduced-motion support
- Touch-friendly evidence filters and accessible image viewer
- No frameworks or build step required

## Interaction checks
- Navigation links scroll to existing sections and close the mobile menu.
- Evidence filters show matching screenshots; selecting a screenshot opens the image viewer.
- The image viewer closes from its close control, backdrop, or Escape key.
- Animations respect the device reduced-motion preference.

## Run locally
Open `index.html` in a browser.

For a more reliable local preview, use any static server, for example:
- VS Code Live Server
- Python's built-in HTTP server: `python -m http.server`

## Publish
This site can be deployed to GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static web host.

## Notes
The SOC investigation is explicitly presented as a simulated training investigation. The site does not claim professional employment or real-client incident response experience.
