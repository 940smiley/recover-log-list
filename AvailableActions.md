# Available GitHub Actions

## Recommended Workflows

### Frontend Lint & Build
- **Purpose**: Ensure Next.js code compiles and passes linting.
- **Trigger**: `push`, `pull_request` to `main`.
- **Key Actions**: `actions/checkout`, `actions/setup-node`, `npm ci`, `npm run lint`, `npm run build`.

```yml
name: frontend
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  lint-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: frontend
      - run: npm run lint
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
```

### Backend Tests
- **Purpose**: Run FastAPI/unit tests and catch regressions.
- **Trigger**: `push`, `pull_request`.
- **Key Actions**: `actions/setup-python`, install `backend/requirements.txt`, run `pytest`.

```yml
name: backend
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: pytest
        working-directory: backend
```

### Security & Dependency Audit
- **Purpose**: Detect vulnerable dependencies.
- **Trigger**: weekly schedule.
- **Key Actions**: `npm audit`, `pip-audit` (or `pip install pip-audit`).

```yml
name: security-audit
on:
  schedule:
    - cron: '0 5 * * 1'
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
        working-directory: frontend
      - run: npm audit --production
        working-directory: frontend
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install pip-audit
      - run: pip-audit -r backend/requirements.txt
```

### Artifact Build (Optional)
- **Purpose**: Build production-ready frontend bundle and backend wheel or Docker image.
- **Key Actions**: `docker/build-push-action` or `npm run build` + archive.

## Notes
- Cache dependencies with `actions/cache` for faster builds.
- Use environment variables such as `NEXT_PUBLIC_API_BASE_URL` in workflow `env` blocks when building the frontend.
- Add branch protection to require the frontend and backend jobs before merging.
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
