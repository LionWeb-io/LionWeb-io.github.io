---
title: Additional APIs
sidebar_position: 30
---

## Additional APIs

This module provides additional API endpoints not part of the LionWeb specifications but practically useful.


### Endpoints

#### `POST /additional/getNodeTree`

Given a list of node IDs, returns the tree of descendant node IDs for each input ID. 

- Accepts a `depthLimit` query parameter (optional)

#### `POST /additional/bulkImport`

Performs high-performance bulk import of new nodes into the repository. This endpoint is optimized for **massive ingestion** of data—suitable for tens or hundreds of thousands of nodes—and **bypasses** expensive validation and deduplication steps typical of standard `store` operations.

- Supports three formats for the request body:
  - JSON (`application/json`)
  - FlatBuffers (`application/flatbuffers`)
  - Protocol Buffers (`application/protobuf`)
- It is recommended to use **FlatBuffers** for optimal performance.
- All nodes must be new (no updates to existing nodes).
- Each tree can specify an attach point via:
  1. ID of an existing container node
  2. Containment (metapointer) where the tree will be appended
- If no attach point is specified, the node is considered a new partition
