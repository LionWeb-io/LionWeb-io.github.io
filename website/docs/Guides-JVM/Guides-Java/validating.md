---
title: Validation
sidebar_position: 45
---

# Validation

The LionWeb-JVM project includes a comprehensive validation framework located in the
`io.lionweb.utils` package. Validators return a `ValidationResult` containing zero or more
`Issue` objects, each with a severity level and a human-readable message.

## Issue Severity

Every `Issue` has an `IssueSeverity`:

| Severity | Meaning |
|----------|---------|
| `ERROR`  | The model or language is structurally invalid and cannot be used reliably. |
| `WARNING`| Something is unusual but may still be usable. |
| `INFO`   | Informational note, not a problem. |

## Validating a Language Definition

Use `LanguageValidator` to check that a language you have authored programmatically (or loaded
from JSON) is internally consistent — for example, that all feature types resolve, that IDs
are unique, and that required fields are populated.

```java
import io.lionweb.language.Language;
import io.lionweb.utils.Issue;
import io.lionweb.utils.LanguageValidator;
import io.lionweb.utils.ValidationResult;

LanguageValidator validator = new LanguageValidator();
ValidationResult result = validator.validate(myLanguage);

if (!result.isSuccessful()) {
    for (Issue issue : result.getIssues()) {
        System.out.println(issue.getSeverity() + ": " + issue.getMessage());
    }
}
```

`isSuccessful()` returns `true` when there are no ERROR-level issues.

## Validating a Node Tree

Use `NodeTreeValidator` to check the structural integrity of a model — for example, that
containment relationships are well-formed and that nodes have valid IDs.

```java
import io.lionweb.model.Node;
import io.lionweb.utils.NodeTreeValidator;
import io.lionweb.utils.ValidationResult;

NodeTreeValidator validator = new NodeTreeValidator();
ValidationResult result = validator.validate(rootNode);

if (!result.isSuccessful()) {
    result.getIssues().forEach(issue ->
        System.out.println(issue.getSeverity() + ": " + issue.getMessage()));
}
```

## Validating a Serialization Chunk

Use `ChunkValidator` when loading untrusted JSON files to verify that the chunk structure is
valid before attempting full deserialization.

```java
import io.lionweb.serialization.LowLevelJsonSerialization;
import io.lionweb.serialization.data.SerializationChunk;
import io.lionweb.utils.ChunkValidator;
import io.lionweb.utils.ValidationResult;

LowLevelJsonSerialization lowLevel = new LowLevelJsonSerialization();
SerializationChunk chunk = lowLevel.deserializeSerializationBlock(jsonFile);

ChunkValidator validator = new ChunkValidator();
ValidationResult result = validator.validate(chunk);

if (!result.isSuccessful()) {
    result.getIssues().forEach(System.out::println);
}
```

Use `PartitionChunkValidator` instead when the chunk is expected to contain exactly one
partition (a common constraint in repository interactions).

## Specific Validators

| Class | Validates |
|-------|-----------|
| `LanguageValidator` | Language definitions (concepts, features, IDs, keys) |
| `NodeTreeValidator` | Node tree structure and containment integrity |
| `ChunkValidator` | Raw `SerializationChunk` objects loaded from JSON |
| `PartitionChunkValidator` | Chunks expected to contain a single partition |

## Validation Utilities

`CommonChecks` provides reusable helper methods used internally by the validators above. You
can call these directly if you need to implement a custom validator by extending the `Validator`
base class.
