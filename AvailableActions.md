# Available GitHub Actions

Below are Actions suited for this project type (FastAPI backend, Next.js frontend):

## CI/CD
- **Node Lint & Build** (Next.js)
  ```yaml
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
  - run: npm ci
  - run: npm run lint
  - run: npm run build
  ```
- **Python Tests** (FastAPI)
  ```yaml
  - uses: actions/checkout@v4
  - uses: actions/setup-python@v5
    with:
      python-version: '3.12'
  - run: pip install -r backend/requirements.txt
  - run: pytest
  ```

## Quality & Security
- **CodeQL Analysis** for JavaScript/TypeScript and Python.
- **Dependabot** for npm and pip ecosystems to track security patches.
- **ESLint Action** to enforce lint rules on pull requests.

## Deployment
- **GitHub Pages Deploy** for docs/static exports from `/docs` or Next.js `out` directory.
- **Docker Build & Push** for containerized releases of the FastAPI service.

## Triggers
- `push` and `pull_request` for CI checks.
- Nightly `schedule` for dependency auditing and security scans.
