---
title: Inspection APIs
sidebar_position: 50
---

## Inspection APIs

The Inspection APIs provide efficient read-only access to the distribution of nodes in a repository, categorized by classifier or language. These APIs are intended for diagnostic, statistical, or analytical purposes and are efficient.

### Endpoints

#### `GET /inspection/nodesByClassifier`

Returns the list of classifiers used in the repository, along with node IDs that instantiate them.

- **Query Parameters:**
  - `limit` (optional): Limits the number of node IDs returned per classifier.

- **Returns:** An array of objects:
  ```json
  [
    {
      "language": "language-id",
      "classifier": "classifier-id",
      "ids": ["node-id-1", "node-id-2", "..."],
      "size": totalCount
    },
    ...
  ]
  ```

- **Use Case:** Useful to analyze how many nodes are instances of each concept in a language.

#### `GET /inspection/nodesByLanguage`

Returns the list of languages used in the repository, along with node IDs grouped per language.

- **Query Parameters:**
  - `limit` (optional): Limits the number of node IDs returned per language.

- **Returns:** An array of objects:
  ```json
  [
    {
      "language": "language-id",
      "ids": ["node-id-1", "node-id-2", "..."],
      "size": totalCount
    },
    ...
  ]
  ```

- **Use Case:** Useful to inspect how widely each language is used within a repository.

### Notes

- These APIs are designed for speed and minimal resource usage.
- The full list of node IDs can be large; use the `limit` parameter to reduce response size if needed.
