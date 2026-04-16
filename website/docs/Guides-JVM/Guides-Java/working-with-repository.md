---
title: Working with the LionWeb Repository
sidebar_position: 44
---

# Working with the LionWeb Server

Working with the [LionWeb Server](https://github.com/LionWeb-io/lionweb-server) we can store
and retrieve nodes. It is also a means to exchange models with other LionWeb-compliant
components. You can refer to the website of the LionWeb Server to learn how to start it.

This page provides an overview of how to interact with the server using the provided Java
client and outlines the basic concepts involved.

## Using Gradle

Add the following to your `build.gradle.kts`:

```kotlin
dependencies {
    // Previously added
    implementation("io.lionweb:lionweb-2024.1-core:$lionwebVersion")
    // Specific for working with the LionWeb Server
    implementation("io.lionweb:lionweb-2024.1-client:$lionwebVersion")
}
```

## Overview

The LionWeb Repository is a generic storage system designed to hold nodes conforming to the
LionWeb metamodel.

It provides two sets of APIs:

* **Bulk APIs**: store and retrieve entire partitions or large sub-trees.
* **Delta APIs**: currently under development; will support real-time collaboration.

The LionWeb Repository can also optionally support versioning.

This guide focuses on the Bulk APIs.

## Working with the Bulk APIs

The `LionWebClient` class (in `io.lionweb.client`) wraps the repository's REST API and supports:

- Creating and managing **partitions** (top-level model containers)
- Storing and retrieving **nodes**
- Multiple **LionWeb versions** (2023.1 and 2024.1)
- Hooks for **functional testing**

## Example Usage

The following example demonstrates how to:

1. Connect to a running LionWeb Repository
2. Register a language with the client
3. Create a partition node
4. Add children to that partition
5. Store and retrieve nodes

```java
import io.lionweb.LionWebVersion;
import io.lionweb.client.LionWebClient;
import io.lionweb.model.impl.DynamicNode;
import io.lionweb.model.ClassifierInstanceUtils;
import io.lionweb.model.Node;

LionWebClient client =
    new LionWebClient(LionWebVersion.v2024_1, "localhost", 3005, "myRepo");
client.getJsonSerialization().registerLanguage(PropertiesLanguage.propertiesLanguage);

DynamicNode p1 = new DynamicNode("p1", PropertiesLanguage.propertiesPartition);
client.createPartitions(client.getJsonSerialization().serializeNodesToJsonString(p1));

DynamicNode f1 = new DynamicNode("f1", PropertiesLanguage.propertiesFile);
ClassifierInstanceUtils.setPropertyValueByName(f1, "path", "my-path-1.txt");
DynamicNode f2 = new DynamicNode("f2", PropertiesLanguage.propertiesFile);
ClassifierInstanceUtils.setPropertyValueByName(f2, "path", "my-path-2.txt");
ClassifierInstanceUtils.addChild(p1, "files", f1);
ClassifierInstanceUtils.addChild(p1, "files", f2);

client.store(Collections.singletonList(p1));

List<Node> retrievedNodes = client.retrieve(Collections.singletonList("p1"), 10);
assertEquals(1, retrievedNodes.size());
assertEquals(p1, retrievedNodes.get(0));
```

### Creating partitions

The LionWeb Repository only allows creating partitions **without children**. Create the
partition first, then add children by invoking `store`:

```java
// Step 1: create the empty partition
client.createPartitions(client.getJsonSerialization().serializeNodesToJsonString(partition));

// Step 2: add children and store
partition.addChild(myContainment, childNode);
client.store(Collections.singletonList(partition));
```

## Error Handling

`LionWebClient` throws `RequestFailureException` (in `io.lionweb.client`) when the server
returns an error response. Wrap calls in a try/catch to handle network or server errors:

```java
import io.lionweb.client.RequestFailureException;

try {
    client.store(nodes);
} catch (RequestFailureException e) {
    System.err.println("Repository call failed: " + e.getMessage());
    // e.getResponseCode() returns the HTTP status code
}
```

## Testing with InMemoryServer

For unit and integration tests you can use `InMemoryServer`
(in `io.lionweb.client.inmemory`) — a fully in-memory implementation of the LionWeb bulk
protocol that does **not** require Docker or a running server:

```java
import io.lionweb.LionWebVersion;
import io.lionweb.client.LionWebClient;
import io.lionweb.client.inmemory.InMemoryServer;

InMemoryServer server = new InMemoryServer(LionWebVersion.v2024_1);
LionWebClient client = server.connectClient();
client.getJsonSerialization().registerLanguage(myLanguage);

// Create, store, and retrieve nodes exactly as you would with a real server
DynamicNode partition = new DynamicNode("part-1", myPartitionConcept);
client.createPartitions(client.getJsonSerialization().serializeNodesToJsonString(partition));
client.store(Collections.singletonList(partition));

List<Node> result = client.retrieve(Collections.singletonList("part-1"), Integer.MAX_VALUE);
assertEquals(partition, result.get(0));
```

`InMemoryServer` is also used internally by the `client-testing` module, which provides
additional utilities for writing functional tests against the LionWeb Server.
