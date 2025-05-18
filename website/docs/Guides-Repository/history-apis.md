---
title: History APIs
sidebar_position: 40
---

## History APIs

These endpoints enable querying of historical repository states by specifying a particular version (`repoVersion`). They support retrieval of partitions and nodes as they existed at a given point in time. These APIs follow the LionWeb Bulk API patterns and are primarily intended for analytical or auditing use.

### Endpoints

#### `POST /history/listPartitions`

Returns all top-level (partition) nodes that existed at a given repository version. These are nodes without parents.

- **Query Parameters:**
  - `repoVersion` (optional): The historical version to retrieve. If not specified, uses the latest (`FOREVER`).

- **Body:** No body is required.

- **Returns:** A list of partition node summaries.

#### `POST /history/retrieve`

Retrieves one or more nodes (and their contents) as they were at a specified historical version, up to a certain depth.

- **Body:**
  ```json
  {
    "ids": ["node-id-1", "node-id-2", "..."]
  }
  ```

- **Query Parameters:**
  - `depthLimit` (optional): The level of nested parts to include. Defaults to the maximum possible.
  - `repoVersion` (optional): The repository version to retrieve. Defaults to the latest (`FOREVER`).

- **Returns:** A nested structure of nodes, matching the version and depth specified.

### Notes

- These endpoints do **not** modify the repository in any way—they are **read-only** and safe for analytics and audits.
