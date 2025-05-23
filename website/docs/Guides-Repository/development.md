---
title: Development
sidebar_position: 2
---

## Project Structure

| Folder               | Description                                                           |
|----------------------|-----------------------------------------------------------------------|
| `packages/server`    | The main repository server and API logic                             |
| `packages/dbadmin`   | Initializes and configures the database schema                       |
| `packages/common`    | Shared utility functions                                              |
| `packages/bulkapi`   | Implements the LionWeb Bulk API as per specification                 |
| `packages/additionalapi` | Implements extra APIs outside the LionWeb spec                  |
| `packages/inspection`| APIs to inspect repository contents                                  |
| `packages/languages` | (Placeholder) Future support for language management                 |
| `packages/test`      | Automated tests for the core components                              |

## Building and Running

### Build the code:

```bash
npm install
npm run build
npm run lint
```

### Run the server:

```bash
cd packages/server
npm run dev-run
```

> Ensure PostgreSQL is running and accessible before starting the server.

### Run tests:

```bash
npm run test
```

## 🛠 Releasing

To publish a new release:

```bash
./scripts/tag-and-release-docker-image.sh
```

For detailed instructions, refer to [`scripts/README.md`](scripts/README.md).
