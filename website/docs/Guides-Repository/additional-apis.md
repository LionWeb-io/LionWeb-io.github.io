---
title: Additional APIs
sidebar_position: 30
---

### Additional APIs

- `GET /additional/getNodes`: Given a node ID, returns a list of its descendants' IDs
- `POST /additional/bulkImport`: High-performance bulk import for non-existing nodes using JSON, FlatBuffer, or Protobuf

> `bulkImport` is optimized for massive ingestion (tens/hundreds of thousands of nodes), bypassing costly validation and deduplication checks done in `store`.