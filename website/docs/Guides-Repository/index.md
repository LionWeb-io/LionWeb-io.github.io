---
id: index
title: Welcome
sidebar_position: 1
---

# LionWeb Repository

The **LionWeb Repository** is the reference implementation of a storage server for LionWeb-compliant models. It is built in **TypeScript**, runs on **Node.js**, and stores data in a **PostgreSQL** database. It supports the [LionWeb specification](https://lionweb.io) and provides robust APIs for bulk operations, inspection, language registration, and administrative setup.

---

## Overview

- Language-agnostic LionWeb model repository (i.e., it works with all LionWeb languages)
- Built with Node.js and TypeScript
- Persists models using PostgreSQL (via Docker or local installation)
- Interacts via a set of REST-based including **Bulk APIs**, **DB Admin APIs**, **Additional APIs**, and **Inspection APIs**

## Modes

The repository server can run in two distinct modes:

1. **Setup mode**: Applies the configuration to set up repositories and initialize database state
2. **Run mode**: Starts the server and listens for client requests

## PostgreSQL Configuration

The repository uses PostgreSQL (tested with version `16.1`). You can quickly start a PostgreSQL instance via Docker:

```bash
docker pull postgres:16.1
docker run --shm-size=1g -d --name lionwebrepodb -p 5432:5432 -e POSTGRES_PASSWORD=lionweb postgres:16.1
```

Configuration details (user, DB name, port) are defined in the `.env` file. `pgAdmin 4` is commonly used to inspect the database manually.

![Database Schema](/img/database-schema.svg)

### Run the server

You can run the server from the sources:

```bash
cd packages/server
npm run dev-run
```

> Ensure PostgreSQL is running and accessible before starting the server.

However you may want typically run it through Docker.

You can use a prebuilt Docker image of the repository:

```bash
# Latest version
docker pull ghcr.io/lionweb-io/lionweb-repository:latest

# Specific release version
docker pull ghcr.io/lionweb-io/lionweb-repository:release-lionweb-repository-0.1.1
```

### Run tests:

```bash
npm run test
```

## Authentication

The repository can be secured by specifying a **token** in the configuration. When enabled, all incoming HTTP requests must include this token in the `Authorization` header.

For more reliable security we suggest using a reverse OAuth proxy in front of the LionWeb Repository (e.g., Supertokens, Authentik, Keycloak)

## Client Library

A **JavaScript/TypeScript client** for the LionWeb Repository exists within the same project but is **not yet published**. To use it:

1. Clone the repository
2. Build the project locally
3. Install the client locally via `npm link` or path reference

Publication to npm is expected in the near future.
