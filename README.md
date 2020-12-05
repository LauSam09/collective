[![LauSam09](https://circleci.com/gh/LauSam09/collective.svg?style=shield)](https://app.circleci.com/pipelines/github/LauSam09/collective)
[![dependencies Status](https://david-dm.org/atom/atom/status.svg)](https://david-dm.org/atom/atom)

# Collective

Collective is an application for storing and sharing a shopping list for a household with live-syncing capabilities and can also work offline as an SPA.

See application hosted [here](https://collective-293516.ew.r.appspot.com/).

> Anyone can authenticate, but in order to use the application you must be assigned to a `group` which is currently a manual process.

# Technologies

## Architecture

- React
- Redux
- Google Firestore
- Google App Engine
  - `gcloud app deploy --version=X-Y-Z`

## Development

- TypeScript
- ESLint
- Prettier

# Authentication

- OAuth2 authentication. Supported providers:
  - Google

# Multi-tenancy

Data access is limited through [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started).
