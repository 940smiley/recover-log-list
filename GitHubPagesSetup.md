# GitHub Pages Setup

1. **Enable Pages**: In repository settings, choose GitHub Pages source as `Deploy from a branch`. Select `main` and `/docs` (recommended) or root.
2. **Docs layout**: Create a `/docs` folder for marketing/guide pages. Include an `index.md` as entrypoint and optional `assets/` for images.
3. **Theme**: Use `minimal` or `cayman` via `_config.yml`:
   ```yaml
   theme: minimal
   plugins:
     - jekyll-seo-tag
   ```
4. **Custom domain**: Add `CNAME` file under `/docs` with your domain; point DNS `CNAME` record to `<username>.github.io`.
5. **CI/CD suggestion**: Add a GitHub Actions workflow that builds frontend docs or static exports and commits to `/docs` for Pages. Trigger on `push` to `main`.
6. **Verification**: After enabling, wait a few minutes then open the published URL. Check console/network for mixed-content warnings.
