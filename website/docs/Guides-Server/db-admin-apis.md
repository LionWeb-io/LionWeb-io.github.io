---
title: DB Admin APIs
sidebar_position: 20
---

## DB Admin APIs

These administrative endpoints manage the underlying PostgreSQL database and repositories for the LionWeb system. They are primarily intended for internal use and setup tasks.

### Endpoints

#### `POST /createDatabase`

Creates a new PostgreSQL database that will be used to store repositories.

- Does **not** require any parameters.
- Should be called **once** during system setup.
- Alternatively, the repository administrator could call the setup script from the command line

#### `POST /listRepositories`

Lists all currently configured repositories.

- Returns a list of objects, each including:
  - `name`: Repository name
  - `lionweb_version`: LionWeb version the repository is using
  - `history`: Whether historical data is stored

#### `POST /createRepository`

Creates a new repository in the database.

- Required query parameters:
  - `clientId`: A unique identifier for the client initiating the request
  - `repository`: Name of the repository to create
  - `lionWebVersion`: Version of LionWeb this repository supports
- Optional query parameter:
  - `history`: Boolean flag indicating whether to enable history tracking
- Fails if the repository already exists

#### `POST /deleteRepository`

Deletes an existing repository and its associated data.

- Required query parameters:
  - `clientId`: A unique identifier for the client
  - `repository`: Name of the repository to delete
- If the repository is not found, a `RepositoryNotFound` error is returned

### Notes

- These APIs are **not** part of the LionWeb specification and are intended for platform management.
