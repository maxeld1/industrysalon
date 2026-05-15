# Industry Salon Admin Setup

The admin portal is available at `/admin/`.

This site uses Decap CMS with the GitHub backend. Editors can update structured JSON files in `content/`, and the public site reads those files with `js/content.js`.

## Editable Content

- `content/site.json`: booking link, gift card link, phone, email, address, Instagram, and footer hours
- `content/services.json`: service categories, prices, homepage service highlights, and pricing note
- `content/stylists.json`: stylist names, levels, titles, images, Instagram links, and bios

## Authentication

The current CMS config points at `maxeld1/industrysalon` on the `master` branch.

For production use on GitHub Pages, Decap CMS still needs a GitHub authentication provider because GitHub OAuth cannot run from a static site by itself. The usual options are:

- Use Netlify Identity/Git Gateway and deploy the site through Netlify.
- Keep GitHub Pages and add an external Decap-compatible OAuth service.
- Give trusted editors GitHub access and use an OAuth bridge for the GitHub backend.

Until authentication is configured, `/admin/` will load the CMS interface but production login/publishing will not be complete.

## Local Testing

The CMS config includes `local_backend: true` for local development with Decap's local backend tooling.
