---
title: Running the LionWeb JVM Server
sidebar_position: 10
---

# Running the LionWeb JVM Server

The `server` module provides a self-contained LionWeb repository server distributed as a single
shadow JAR. It requires no external database and exposes three services in a single process:

| Service | Default Port | Purpose |
|---|---|---|
| HTTP Bulk API | 9239 | REST endpoints for batch model operations |
| WebSocket Delta API | 9240 | Real-time incremental changes |
| Web UI Dashboard | 9241 | Browser-based inspection tool (optional) |

The data store is held in memory, backed by `InMemoryServer` from the client module. The server is
suitable for development, testing, and production workloads that fit in memory.

## Getting the Server

### Building from Source

```bash
./gradlew :server:shadowJar
# Output: server/build/libs/server-<version>-all.jar
```

### Maven Central

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.lionweb:lionweb-2024.1-server:<version>")
}
```

The shadow JAR (`server-<version>-all.jar`) is the self-contained artifact for standalone
deployment.

## Starting the Server

### Default (Bulk + Delta only)

```bash
java -jar server-<version>-all.jar
```

This starts the HTTP Bulk API on port 9239 and the WebSocket Delta API on port 9240.

### With the Web UI Dashboard

```bash
java -jar server-<version>-all.jar --web-ui
```

Adds the browser-based dashboard on port 9241.

### All CLI Flags

| Flag | Default | Description |
|---|---|---|
| `--http-port` | `9239` | HTTP Bulk API port |
| `--ws-port` | `9240` | WebSocket Delta API port |
| `--web-ui` | _(disabled)_ | Enable the Web UI Dashboard |
| `--web-port` | `9241` | Web UI Dashboard port |
| `--repository` | `repo` | Default repository name |

Example — custom ports with the Web UI:

```bash
java -jar server-<version>-all.jar \
  --http-port 8080 \
  --ws-port 8081 \
  --web-ui \
  --web-port 8082 \
  --repository myproject
```

## HTTP Bulk API (port 9239)

All endpoints accept `POST` requests (unless noted) and expect/return JSON serialized according
to the LionWeb serialization format. Include `?repository=<name>` as a query parameter to
address a specific repository.

| Endpoint | Purpose |
|---|---|
| `POST /bulk/ids` | Generate unique IDs |
| `POST /bulk/listPartitions` | List all partition nodes |
| `POST /bulk/createPartitions` | Create new partitions from a serialization chunk |
| `POST /bulk/deletePartitions` | Delete partitions by ID |
| `POST /bulk/store` | Store or update nodes |
| `POST /bulk/retrieve` | Retrieve nodes by ID and depth |
| `GET /inspection/nodesByClassifier` | Classify node inventory by classifier |
| `GET /inspection/nodesByLanguage` | Group nodes by language |
| `POST /createRepository` | Create a named repository |
| `POST /deleteRepository` | Delete a repository |
| `POST /listRepositories` | List all repositories |

GZIP-compressed request bodies are accepted. CORS headers are enabled for all endpoints.

### Connecting a Java Client

```java
import io.lionweb.LionWebVersion;
import io.lionweb.client.LionWebBulkClient;

LionWebBulkClient client = new LionWebBulkClient.Builder()
    .withVersion(LionWebVersion.v2024_1)
    .withHostname("localhost")
    .withPort(9239)
    .withRepository("repo")
    .build();
```

## WebSocket Delta API (port 9240)

The Delta API uses the [LionWeb Delta protocol](https://lionweb.io/specification/delta/delta-api.html)
over WebSocket.

```
ws://localhost:9240
```

Clients sign on to receive a `participationId`, then subscribe to specific partitions to receive
targeted event notifications. See the [Delta Protocol Guide](./Guides-Java/delta-protocol) for the
full message catalogue and code examples.

## Web UI Dashboard (port 9241)

Enabled with `--web-ui`. Open `http://localhost:9241` in a browser to see:

- **Live message log**: all commands, queries, and events flowing through the server
- **Node inventory**: nodes grouped by classifier, updated in real time
- **Repository overview**: all repositories and their partitions

The dashboard is built with Svelte and bundled inside the shadow JAR — no separate installation
is required.
