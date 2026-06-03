---
title: Migrating to 1.4.x
sidebar_position: 46
---

# Migrating to 1.4.x

This guide covers all breaking changes introduced in versions 1.4.0, 1.4.1, and 1.4.2.

## 1.4.0

### Java 8 Support Removed

The minimum runtime is now **Java 11**. Tested and supported versions: 11, 17, 21, and 25.

Update your Gradle toolchain or `sourceCompatibility` accordingly:

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(11))
    }
}
```

### Protobuf Generated Classes Removed

The generated Protobuf message classes (`PBChunk`, `PBNode`, `PBBulkImport`, `PBContainment`,
`PBProperty`, `PBReference`, `PBMetaPointer`) have been removed. `ProtoBufSerialization` now
delegates entirely to `DirectProtoBufSerializer` / `DirectProtoBufDeserializer`.

**Action:** Remove any direct instantiation or import of the removed classes. The public
`ProtoBufSerialization` API surface is unchanged for standard serialization use cases.

If you used `ExtraProtoBufSerialization.serializeBulkImportToBytes`, it now uses
`DirectBulkImportSerializer` internally — the call signature is unchanged.

### `ReferenceValue` Mutators Removed

```java
// Removed — compile error:
referenceValue.setReferred(node);
referenceValue.setResolveInfo("hint");

// Use builder methods instead (available since earlier versions):
referenceValue = referenceValue.withReferred(node);
referenceValue = referenceValue.withResolveInfo("hint");
```

### `AbstractSerialization.DEFAULT_SERIALIZATION_FORMAT` Removed

```java
// Removed — compile error:
AbstractSerialization.DEFAULT_SERIALIZATION_FORMAT

// Use SerializationProvider instead:
AbstractSerialization serialization =
    SerializationProvider.getStandardJsonSerialization(LionWebVersion.v2024_1);
```

---

## 1.4.1

### `CommonChecks` Merged into `IdUtils`

If you called methods on `CommonChecks` directly, update the import to `IdUtils`:

```java
// Before:
import io.lionweb.utils.CommonChecks;
CommonChecks.checkValidId(id);

// After:
import io.lionweb.utils.IdUtils;
IdUtils.checkValidId(id);
```

---

## 1.4.2

### `LionWebClient` Renamed to `LionWebBulkClient`

The old class is marked `@Deprecated` and will be removed in a future release.

```java
// Before:
import io.lionweb.client.LionWebClient;
LionWebClient client = new LionWebClient(LionWebVersion.v2024_1, "localhost", 3005, "myRepo");

// After:
import io.lionweb.client.LionWebBulkClient;
LionWebBulkClient client = new LionWebBulkClient.Builder()
    .withVersion(LionWebVersion.v2024_1)
    .withHostname("localhost")
    .withPort(3005)
    .withRepository("myRepo")
    .build();
```

### `RequestFailureException` Renamed to `BulkRequestFailureException`

```java
// Before:
import io.lionweb.client.RequestFailureException;
} catch (RequestFailureException e) { ... }

// After:
import io.lionweb.client.BulkRequestFailureException;
} catch (BulkRequestFailureException e) { ... }
```

### Server Package Restructured

The server-side implementation class was replaced by `HTTPBulkServer`. If you embedded the old
server class directly, switch to `HTTPBulkServer` from `io.lionweb.server.bulk`.

### Kotlin: Deprecated APIs Removed

| Removed | Replacement |
|---|---|
| `lowLevelRepoClient` property on `LionWebClient` | Use `jRepoClient` directly |
| `LowLevelRepoClient` class | Removed; use `LionWebBulkClient` Java class |
| Kotlin-specific `ClassifierKey` | Use `io.lionweb.client.api.ClassifierKey` |
| Kotlin-specific `ClassifierResult` | Use `io.lionweb.client.api.ClassifierResult` |
