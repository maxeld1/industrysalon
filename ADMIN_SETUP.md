# Industry Salon Admin Setup

The admin portal is available at `/admin/`.

This site uses Decap CMS with Netlify Identity and Git Gateway. Editors can update structured JSON files in `content/`, and the public site reads those files with `js/content.js`.

## Editable Content

- `content/site.json`: booking link, gift card link, phone, email, address, Instagram, and footer hours
- `content/services.json`: service categories, prices, homepage service highlights, and pricing note
- `content/stylists.json`: stylist names, levels, titles, images, Instagram links, and bios

## Production Login Setup

The repo is configured for a client-friendly login through Netlify Identity and Git Gateway:

1. Create a Netlify project connected to `maxeld1/industrysalon`.
2. Use the included `netlify.toml`; it publishes the repo root with no build command.
3. In Netlify, enable Identity.
4. Set registration to Invite only.
5. Enable Git Gateway.
6. Invite the client from Netlify Identity.
7. Have them accept the invite and use `https://industrysalonlounge.com/admin/`.

Netlify Git Gateway allows invited Identity users to edit site content without GitHub accounts or direct repository access.

If the domain still points to GitHub Pages, the admin screen can load, but client login/publishing will not work. The live domain needs to point to the Netlify site for Netlify Identity endpoints to be available.

## Local Testing

The CMS config includes `local_backend: true` for local development with Decap's local backend tooling.

Run Decap's local backend in one terminal:

```sh
npx decap-server
```

Run a local static server in another terminal:

```sh
python3 -m http.server 4173
```

Then open:

```txt
http://localhost:4173/admin/
```
