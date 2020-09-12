# Collective
Collective is an offline-first oauth2 (google provider) shopping list with live-syncing capabilities.

# Technologies
* React frontend
  * TypeScript
* Firebase database allowing real-time synchronisation with google authentication
* OAuth2 authentication (google login) - needs to be limited (see [auth](#authentication))

# Authentication
Can potentially limit entirely through firebase rules removing the need for a backend: https://firebase.google.com/docs/rules/rules-and-auth. E.g. add rules limiting to 

This has the benefit of allowing
built-in OAuth for firebase (https://firebase.google.com/docs/auth/web/google-signin).

# Synchronisation
Firebase handles synchronisation similarly to couchdb through listeners (https://firebase.google.com/docs/firestore/query-data/listen).
It isn't however offline-first, and the offline performance isn't great when unable to sync for extended periods of time.

Investigate multitenancy (https://cloud.google.com/datastore/docs/concepts/multitenancy) as a solution to synchronising only relevant data. Could organise tenants by household.
