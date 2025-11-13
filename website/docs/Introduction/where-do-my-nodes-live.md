---
title: Where LionWeb Nodes and Languages Live?
sidebar_position: 33
---

# Where LionWeb Nodes and Languages Live?

## In-Memory Only
Nodes can exist purely in memory. This is typical for short-lived operations:
- a batch process creates some nodes,
- performs analysis or transformation,
- produces an artifact (e.g., a report),
- discards the nodes when the operation ends.

In this scenario, nodes are regular in-memory objects created through any LionWeb library, without persistence.

## Persistent Repository
The most common setup is to store nodes in a persistent repository.  
A repository:
- keeps nodes and partitions over time,
- offers services for accessing, querying, and modifying data,
- acts as the authoritative storage for tools that rely on shared models.

This is the scenario most LionWeb-based systems eventually adopt.

## Files on Disk (JSON or Protobuf)
Nodes can also be persisted as files:
- JSON is supported by all LionWeb libraries.
- Protobuf is supported by most libraries.

You can:
- store each partition in its own file, or
- use the archive format (a ZIP container holding multiple encoded partitions).

The archive format is currently available in the Java and Python implementations.  
It groups multiple partitions and languages into a single compressed file containing protobuf-encoded data.

## Storing Languages
Languages are nodes too. All storage mechanisms described above apply to languages the same way they apply to regular nodes.

Some considerations:
- A specialized editor might embed a language definition directly.
- A language might be shipped as a file alongside the tool.
- A language may also be constructed programmatically when the editor starts.

These choices depend on how dynamic the language needs to be and how the tool is distributed.