# GitHub Pages Setup

## Enable Pages
1. Open the repository settings on GitHub.
2. Navigate to **Pages**.
3. Set **Source** to `Deploy from a branch`.
4. Choose branch: `main` (or your default) and folder: `/docs` (recommended) or `/`.
5. Save and wait for the green status badge.

## Recommended Structure
```
/docs
├─ index.md           # Landing page with screenshots and quick links
├─ api.md             # Backend endpoint overview
├─ architecture.md    # Data flow and component maps
└─ changelog.md       # Latest release notes
```

## Theme & Styling
- Use the **minimal** GitHub Pages theme for quick setup.
- Add a `_config.yml` to `/docs` with:
  ```yml
  title: Collectibles Log Book
  theme: minima
  markdown: kramdown
  ```

## Custom Domain (Optional)
1. Add a `CNAME` file inside `/docs` containing your domain (e.g., `collectibles.example.com`).
2. Create DNS records: `CNAME` pointing to `<username>.github.io`.
3. Enable **Enforce HTTPS** in Pages settings.

## CI/CD Deployment Flow
- Add a workflow that builds the frontend and exports docs to `/docs` on pushes to `main`.
- Publish the `/docs` folder using the `actions/upload-pages-artifact` and `actions/deploy-pages` actions.
- Example trigger: `on: { push: { branches: [main] }, workflow_dispatch: {} }`.

## Tips
- Keep screenshots up to date by running frontend locally and capturing key pages.
- If the API is private, redact secrets and show mock responses in the docs.
- Link the live Pages site in the README under a **Docs** or **GitHub Pages** section.
