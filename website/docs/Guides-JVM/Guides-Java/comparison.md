---
title: Nodes Comparison
sidebar_position: 46
---

# Nodes Comparison

The lionweb-java project provides model comparison through the `ModelComparator` class
(in `io.lionweb.utils`). It performs a **deep structural comparison** of two nodes, checking
properties, containments, references, and annotations recursively.

## Basic Comparison

```java
import io.lionweb.utils.ModelComparator;

ModelComparator comparator = new ModelComparator();
ModelComparator.ComparisonResult result = comparator.compare(nodeA, nodeB);

if (!result.areEquivalent()) {
    result.getDifferences().forEach(System.out::println);
}
```

`getDifferences()` returns a list of human-readable strings describing each discrepancy found.

## Quick Equivalence Check

For a simple yes/no answer, use the static helper:

```java
boolean same = ModelComparator.areEquivalent(nodeA, nodeB);
```

## Use in Tests

The most common use case is verifying that a round-trip through serialization and
deserialization produces an identical model:

```java
import io.lionweb.serialization.JsonSerialization;
import io.lionweb.serialization.SerializationProvider;
import io.lionweb.utils.ModelComparator;

JsonSerialization serialization = SerializationProvider.getStandardJsonSerialization();
serialization.enableDynamicNodes();

// Serialize to JSON and deserialize back
String json = serialization.serializeTreesToJsonString(original);
Node deserialized = serialization.deserializeToNodes(json).get(0);

// Assert structural equivalence
ModelComparator.ComparisonResult result = new ModelComparator().compare(original, deserialized);
assertTrue("Round-trip produced differences: " + result.getDifferences(),
           result.areEquivalent());
```

## What Gets Compared

The comparator performs a deep comparison across:

| Aspect | What is checked |
|--------|----------------|
| **Properties** | All property values defined by the classifier |
| **Containments** | Number of children and recursive comparison of each child |
| **References** | Number of references, referenced node IDs, resolve info |
| **Annotations** | Number of annotations and their structures |
| **Structure** | Parent-child relationships, concept/classifier assignments |

All differences are reported with contextual information: the node IDs involved, the feature
name, and (for lists) the index position.

## Comparing Annotation Instances

`ModelComparator` provides overloaded `compare()` methods for different element types:

```java
// Compare two Node objects
comparator.compare(nodeA, nodeB);

// Compare two AnnotationInstance objects
comparator.compare(annotationA, annotationB);

// Polymorphic — works for any ClassifierInstance
comparator.compare(instanceA, instanceB);
```

## ComparisonResult

`ComparisonResult` is a nested class within `ModelComparator`:

- `areEquivalent()` — returns `true` when no differences were found
- `getDifferences()` — returns a `List<String>` describing each difference
