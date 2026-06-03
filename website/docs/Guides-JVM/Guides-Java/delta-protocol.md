---
title: Delta Protocol
sidebar_position: 45
---

# Delta Protocol

The LionWeb Delta protocol enables real-time, incremental model synchronisation between multiple
clients through a WebSocket connection.

| Protocol | Transport | Use case |
|---|---|---|
| Bulk | HTTP REST | Snapshots — retrieve or replace entire partitions |
| Delta | WebSocket | Streams — receive individual mutation events as they happen |

Use the Delta protocol when multiple tools need to observe or apply changes to the same model
concurrently, without re-fetching full snapshots.

## Gradle Dependency

The `DeltaClient` is part of the same client artifact as the bulk APIs — no additional dependency
is required:

```kotlin
dependencies {
    implementation("io.lionweb:lionweb-2024.1-client:$lionwebVersion")
}
```

## Connecting to the Server

```java
import io.lionweb.client.delta.DeltaClient;
import io.lionweb.server.delta.WebSocketDeltaChannel;
import java.net.URI;

// WebSocketDeltaChannel requires the lionweb-2024.1-server artifact on the classpath
WebSocketDeltaChannel channel =
    new WebSocketDeltaChannel(URI.create("ws://localhost:9240"));
channel.connectBlocking();

DeltaClient client = new DeltaClient(channel, "my-tool-client");
```

`WebSocketDeltaChannel` is provided by the `server` module (`lionweb-2024.1-server`). When writing
code that should work with any transport (e.g. for testing), depend on `DeltaChannel` from the
`client` module instead.

## Participation Lifecycle

### Signing On

```java
client.sendSignOnRequest();
String participationId = client.getParticipationId();
```

`sendSignOnRequest()` sends a `SignOnRequest` and waits for a `SignOnResponse`. The server assigns
a `participationId` that uniquely identifies this client session. Store it for reconnection.

### Subscribing to Partition Lifecycle Events

```java
// Receive PartitionAdded / PartitionDeleted events
client.sendListAndSubscribePartitionsRequest();
```

### Subscribing to Partition Content Events

```java
// Receive node-level mutation events for a specific partition
client.sendSubscribeToPartitionContentsRequest(partitionId);
```

The server only broadcasts events to clients that have subscribed to the relevant partition,
keeping traffic minimal.

### Reconnecting

If the WebSocket connection drops, recreate the channel and call:

```java
// lastReceivedSequenceNumber is the sequence number of the last event received
client.sendReconnectRequest(participationId, lastReceivedSequenceNumber);
```

### Signing Off

```java
client.sendSignOffRequest();
channel.closeBlocking();
```

## Message Types

### Queries (Synchronous Request / Response)

Queries block the calling thread until the server responds.

| Request | Response | Description |
|---|---|---|
| `SignOnRequest` | `SignOnResponse` | Register a new participation |
| `ReconnectRequest` | `ReconnectResponse` | Resume a previous participation |
| `SignOffRequest` | `SignOffResponse` | Terminate a participation |
| `ListPartitionsRequest` | `ListPartitionsResponse` | List available partitions |
| `ListAndSubscribePartitionsRequest` | `ListAndSubscribePartitionsResponse` | List partitions and subscribe to lifecycle events |
| `SubscribeToPartitionContentsRequest` | `SubscribeToPartitionContentsResponse` | Subscribe to content events for one partition |
| `UnsubscribeFromPartitionContentsRequest` | `UnsubscribeFromPartitionContentsResponse` | Unsubscribe from content events |
| `GetAvailableIdsRequest` | `GetAvailableIdsResponse` | Request a batch of unique IDs from the server |

All query classes are in `io.lionweb.client.delta.messages.queries`.

### Commands (Client → Server Mutations)

Commands are fire-and-forget messages that mutate the server-side model. The server broadcasts
corresponding events to subscribed clients.

**Partitions** (`io.lionweb.client.delta.messages.commands.partitions`):

| Command | Description |
|---|---|
| `AddPartition` | Create a new partition |
| `DeletePartition` | Remove a partition |

**Children** (`io.lionweb.client.delta.messages.commands.children`):

| Command | Description |
|---|---|
| `AddChild` | Add a child node to a containment |
| `DeleteChild` | Remove a child node |
| `MoveChildInSameContainment` | Reorder within the same containment |
| `MoveChildFromOtherContainment` | Move from one containment to another |
| `MoveChildFromOtherContainmentInSameParent` | Move between containments in the same parent |
| `ReplaceChild` | Replace a child with a different node |

**Properties** (`io.lionweb.client.delta.messages.commands.properties`):

| Command | Description |
|---|---|
| `AddProperty` | Set a property value for the first time |
| `ChangeProperty` | Update an existing property value |
| `DeleteProperty` | Clear a property value |

**References** (`io.lionweb.client.delta.messages.commands.references`):

| Command | Description |
|---|---|
| `AddReference` | Add a reference value |
| `ChangeReference` | Update a reference value |
| `DeleteReference` | Remove a reference value |

**Annotations** (`io.lionweb.client.delta.messages.commands.annotations`):

| Command | Description |
|---|---|
| `AddAnnotation` | Attach an annotation to a node |
| `DeleteAnnotation` | Remove an annotation |
| `MoveAnnotationInSameParent` | Reorder annotations on the same node |
| `MoveAnnotationFromOtherParent` | Move an annotation to a different node |

**Classifier** (`io.lionweb.client.delta.messages.commands`):

| Command | Description |
|---|---|
| `ChangeClassifier` | Change the classifier (concept) of a node |

### Events (Server → Client Broadcasts)

Events mirror commands. The server sends them to all clients subscribed to the affected partition.

| Event | Triggered by |
|---|---|
| `PartitionAdded` | `AddPartition` command or partition lifecycle subscription |
| `PartitionDeleted` | `DeletePartition` command |
| `ChildAdded` | `AddChild` |
| `ChildDeleted` | `DeleteChild` |
| `ChildMovedInSameContainment` | `MoveChildInSameContainment` |
| `ChildMovedFromOtherContainment` | `MoveChildFromOtherContainment` |
| `ChildMovedFromOtherContainmentInSameParent` | `MoveChildFromOtherContainmentInSameParent` |
| `ChildReplaced` | `ReplaceChild` |
| `PropertyAdded` | `AddProperty` |
| `PropertyChanged` | `ChangeProperty` |
| `PropertyDeleted` | `DeleteProperty` |
| `ReferenceAdded` | `AddReference` |
| `ReferenceChanged` | `ChangeReference` |
| `ReferenceDeleted` | `DeleteReference` |
| `AnnotationAdded` | `AddAnnotation` |
| `AnnotationDeleted` | `DeleteAnnotation` |
| `AnnotationMovedInSameParent` | `MoveAnnotationInSameParent` |
| `AnnotationMovedFromOtherParent` | `MoveAnnotationFromOtherParent` |
| `ClassifierChanged` | `ChangeClassifier` |
| `ErrorEvent` | Server-side processing failure |

All event classes are in `io.lionweb.client.delta.messages.events` and its sub-packages.

## Monitoring Local Nodes

`DeltaClient` can track a local node tree and automatically send commands when the nodes change:

```java
// After retrieving the partition via the Bulk API:
client.monitorPartition(partitionNode);
```

When a monitored node is mutated locally (e.g. a property is set), `DeltaClient` sends the
corresponding command to the server. When the client receives an event from the server (from
another participant), it applies the change to the monitored node automatically.

`DeltaClient` implements `DeltaEventReceiver` and is registered on the channel automatically.

## Error Handling

When the server encounters a processing error it sends an `ErrorEvent`. `DeltaClient` throws
`ErrorEventReceivedException` (in `io.lionweb.client.delta`) so callers can catch it:

```java
import io.lionweb.client.delta.ErrorEventReceivedException;

try {
    client.signOn();
} catch (ErrorEventReceivedException e) {
    System.err.println("Delta error: " + e.getErrorEvent().getErrorCode());
}
```

Known error codes are defined in `StandardErrorCode`.

## Testing with InMemoryDeltaChannel

For unit tests that do not require a running server, use `InMemoryDeltaChannel`:

```java
import io.lionweb.LionWebVersion;
import io.lionweb.client.api.HistorySupport;
import io.lionweb.client.api.RepositoryConfiguration;
import io.lionweb.client.delta.DeltaChannel;
import io.lionweb.client.delta.DeltaClient;
import io.lionweb.client.delta.InMemoryDeltaChannel;
import io.lionweb.client.inmemory.InMemoryServer;

// Set up an in-memory server with a repository
InMemoryServer server = new InMemoryServer();
server.createRepository(
    new RepositoryConfiguration("MyRepo", LionWebVersion.v2024_1, HistorySupport.DISABLED));

// Create a channel and wire it to the server — no network involved
DeltaChannel channel = new InMemoryDeltaChannel();
server.monitorDeltaChannel("MyRepo", channel);

DeltaClient client = new DeltaClient(channel, "test-client");
client.sendSignOnRequest();
// Commands sent through the channel are processed by the server in-process
```

`InMemoryServer.monitorDeltaChannel()` wires the channel directly to the server, so tests run
without network overhead.
