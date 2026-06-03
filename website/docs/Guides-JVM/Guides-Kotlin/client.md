---
title: Working with the repository
sidebar_position: 30
---

## Working with the Repository

The `LionWebClient` Kotlin class provides a convenient high-level interface for interacting with a LionWeb-compliant repository. It allows you to programmatically create, retrieve, store, and manipulate LionWeb nodes using familiar object-oriented patterns.

It is essentially a wrapper around the same class defined in LionWeb Java. However it offers additional methods and an API that is slightly more convenient for Kotlin developers.

> **Note:** Since 1.4.2, the underlying Java class is `LionWebBulkClient` (formerly
> `LionWebClient`). The Kotlin wrapper API is unchanged, but if you import the Java class
> directly, update your imports accordingly.

### Repository Setup

- **Create a repository**:
  ```kotlin
  client.createRepository("myRepo", LionWebVersion.v2024_1)
  ```

- **Delete a repository**:
  ```kotlin
  client.deleteRepository("myRepo")
  ```

- **List all repositories**:
  ```kotlin
  val repos = client.listRepositories()
  ```

### Partition Management

- **Create a partition** (a root node with no parent):
  ```kotlin
  client.createPartition(myRootNode)
  ```

- **Delete a partition**:
  ```kotlin
  client.deletePartition("partition-id")
  ```

- **List all partition IDs**:
  ```kotlin
  val ids = client.getPartitionIDs()
  ```

### Node Retrieval

- **Retrieve a node and its entire subtree**:
  ```kotlin
  val node = client.retrieve("node-id")
  ```

- **Retrieve multiple nodes up to a given depth**:
  ```kotlin
  val nodes = client.retrieve(listOf("id1", "id2"), limit = 3)
  ```

- **Check if a node exists**:
  ```kotlin
  val exists = client.isNodeExisting("node-id")
  ```

- **Get the parent ID of a node**:
  ```kotlin
  val parentId = client.getParentId("node-id")
  ```

### Storing Data

- **Store a node and its subtree**:
  ```kotlin
  client.storeTree(myNode)
  ```

- **Store multiple nodes**:
  ```kotlin
  client.storeTrees(listOf(node1, node2))
  ```

### Modifying the Model

These APIs permit individual changes to nodes in the LionWeb Repository. As of 1.4.1, a proper
`DeltaClient` is available for fine-grained real-time control. For direct delta usage, see the
[Delta Protocol Guide](../Guides-Java/delta-protocol).

- **Append a node to a containment**:
  ```kotlin
  client.appendTree(child, containerId, "containmentName", containmentIndex)
  ```

- **Add an annotation**:
  ```kotlin
  client.appendAnnotation(annotationInstance, targetId)
  ```

- **Clear a containment**:
  ```kotlin
  client.clearContainment(containerId, "containmentName")
  ```

- **Set a property value**:
  ```kotlin
  client.setProperty(node, "propertyName", "newValue")
  ```

- **Manage references**:
  ```kotlin
  client.setSingleReference(target, container, MyNode::someRef)
  client.addReference(target, container, MyNode::someRef)
  ```

### Advanced Operations

- **Retrieve a tree of nodes starting from a node**:
  ```kotlin
  val tree = client.nodeTree("root-id")
  ```

- **Perform a bulk import**:
  ```kotlin
  client.bulkImport(myBulkImport, TransferFormat.FLATBUFFERS)
  ```

- **Inspect node usage by classifier**:
  ```kotlin
  val classifierMap = client.nodesByClassifier()
  ```

- **List children in a containment**:
  ```kotlin
  val childIds = client.childrenInContainment(containerId, "containmentName")
  ```

### Notes

- Retrieval modes allow control over performance vs completeness:
  - `SINGLE_NODE` fetches only the node.
  - `ENTIRE_SUBTREE` fetches the full structure beneath a node.
- Proxy nodes are placeholders and should be resolved before use.
- The client ensures repository consistency but does not handle concurrent updates atomically.
