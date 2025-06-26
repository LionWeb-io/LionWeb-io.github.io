---
title: Bulk APIs
sidebar_position: 10
---

### Bulk APIs

The Bulk API is the primary mechanism for interacting with the LionWeb server. All endpoints use `POST` requests and accept/return JSON payloads. Below are the currently supported endpoints, including request details, validation, and response semantics.

### `POST /bulk/create`

**Purpose:** Create one or more **top-level (partition) nodes** in the repository.

**Request body:**
- A `LionWebJsonChunk` containing one or more nodes.

**Validation:**
- Nodes **must not** have a parent.
- Nodes **must not** contain children.
- Nodes **must not** have annotations.

**Returns:**
- `200 OK` if partitions were created
- `412 Precondition Failed` if any rule is violated

---

### `POST /bulk/listPartitions`

**Purpose:** Return the list of all top-level partition nodes in a repository.

**Request body:**
- None

**Returns:**
- A `ListPartitionsResponse` object
  - `chunk`: a `LionWebJsonChunk` containing partition nodes (no children/annotations)
  - `success`: `true|false`
  - `messages`: list of info or error messages

---

### `POST /bulk/deletePartition`

**Purpose:** Delete one or more partitions from the repository.

**Request body:**
- An array of node IDs to delete.

**Returns:**
- A `DeletePartitionsResponse` with status and messages

---

### `POST /bulk/ids`

**Purpose:** Get a batch of globally unique IDs.

**Query parameter:**
- `count` (optional, default = maximum safe integer): number of IDs to generate

**Returns:**
- JSON with list of `count` UUID strings guaranteed to be unique

---

### `POST /bulk/store`

**Purpose:** Store one or more nodes (and their descendants) into the repository.

**Request body:**
- A `LionWebJsonChunk`

**Validation:**
- Repository version must match `lionWebVersion` in the chunk
- Nodes must pass:
  - syntax validation
  - reference validation

**Returns:**
- A `StoreResponse` with `success` flag and validation results
- `412 Precondition Failed` on error

> Note: This endpoint **does not create new partitions**. Only existing ones may be modified.

---

### `POST /bulk/retrieve`

**Purpose:** Retrieve one or more nodes and their subtrees to a specified depth.

**Request body:**
```json
{
  "ids": ["node-id-1", "node-id-2", ...]
}
```

**Query parameter:**
- `depthLimit` (optional): How deep to retrieve descendants
  - `0`: only requested node metadata
  - `1`: include direct children
  - `Infinity` (default): full subtree

**Returns:**
- A `LionWebJsonChunk` with requested nodes and their children (up to `depthLimit`)
- `412 Precondition Failed` if parameters are incorrect

---

## Common Response Structure

Most bulk API responses return:

```json
{
  "success": true,
  "chunk": { ... },
  "messages": [
    { "kind": "Info|Error|Warning", "message": "text..." }
  ]
}
```

## Error Codes

- `200 OK` – Request succeeded
- `412 Precondition Failed` – Invalid input, parameter missing, version mismatch, or validation failure

## Notes

- All endpoints require the repository to be correctly initialized.
- All requests must include the correct repository identifier, typically derived from the URL or configuration.
- When authentication is enabled, a valid token must be included in the `Authorization` header.
