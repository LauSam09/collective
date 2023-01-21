[![LauSam09](https://circleci.com/gh/LauSam09/collective.svg?style=shield)](https://app.circleci.com/pipelines/github/LauSam09/collective)
![release](https://img.shields.io/github/v/release/LauSam09/collective)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Collective

Collective is an application for households to share their shopping list and recipes in real-time.

### Deployment

First time setup:

1. First time setup only - install the [google cloud SDK](https://cloud.google.com/sdk/docs/install) and initialise the environment by running `gcloud init`, selecting the relevant appengine project
2. Create a production build by running `npm run build`
3. Run `gcloud app deploy --version MAJOR-MINOR-PATCH`
