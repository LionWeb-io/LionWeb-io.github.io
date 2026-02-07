---
title: Nodes Comparison
sidebar_position: 46
---

# Nodes Comparison

The lionweb-java project provides comprehensive model comparison capabilities through the `io.lionweb.utils.ModelComparator` class.

The `ModelComparator` enables detailed comparison of models, nodes, and classifier instances to identify structural and semantic differences between them.

## Comparison Methods

The `ModelComparator` provides several overloaded `compare()` methods for different types of elements:

- **Node Comparison**: Compare two `Node` objects
- **AnnotationInstance Comparison**: Compare two `AnnotationInstance` objects
- **ClassifierInstance Comparison**: Compare two `ClassifierInstance` objects (polymorphic)

## Static Equivalence Checking

Convenience methods for quick equivalence checks:

- `areEquivalent(ClassifierInstance<?> a, ClassifierInstance<?> b)`: Check if two classifier instances are equivalent
- `areEquivalent(List<A> as, List<B> bs)`: Check if two lists of classifier instances are equivalent

## ComparisonResult

The `ComparisonResult` class encapsulates the outcome of a comparison operation:

### Key Features

- **Difference Tracking**: Maintains a list of all detected differences
- **Equivalence Check**: Provides `areEquivalent()` method that returns `true` when no differences exist
- **Detailed Reporting**: Contains methods to mark specific types of differences

### Types of Differences Detected

1. **ID Differences**: Different node IDs
2. **Concept Differences**: Different concept/classifier assignments
3. **Property Value Differences**: Different values for properties
4. **Containment Differences**: Different numbers or values of child nodes
5. **Reference Differences**: Different reference targets or resolve information
6. **Annotation Differences**: Different numbers or values of annotations
7. **Incompatibility**: When instances cannot be compared (different types)

## Comparison Aspects

The `ModelComparator` performs deep comparison across multiple dimensions:

### 1. **Properties**
Compares all property values defined by the classifier, identifying any discrepancies in property data.

### 2. **References**
Compares reference values including:
- Number of references
- Referenced node IDs
- Resolve information for each reference

### 3. **Containments**
Compares child nodes including:
- Number of children in each containment
- Recursive comparison of child node structures

### 4. **Annotations**
Compares annotations including:
- Number of annotations
- Annotation IDs and structures

### 5. **Structure**
Validates structural consistency including:
- Parent-child relationships
- Concept/classifier assignments
- Node hierarchy

## Use Cases

- **Testing**: Verify that model transformations produce expected results
- **Validation**: Ensure model consistency across operations
- **Debugging**: Identify unexpected changes in models
- **Serialization/Deserialization**: Verify round-trip integrity
- **Version Control**: Compare model versions to detect changes

## Context Information

All differences are reported with contextual information including:
- Location in the model hierarchy
- Node IDs involved
- Specific feature or property names
- Index positions for list elements
