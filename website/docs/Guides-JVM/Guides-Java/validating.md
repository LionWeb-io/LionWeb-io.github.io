---
title: Validation
sidebar_position: 45
---

# Validation

The LionWeb-JVM project includes a comprehensive validation framework located in the `io.lionweb.utils` package. Here's an overview of all validation-related features:

## Introduction

### **ValidationResult**
Represents the outcome of validation operations, containing information about any issues found during validation.

### **Issue**
Represents individual validation problems or concerns detected during the validation process.

Each issue has an _Issue Severity_. The severity levels are error, warning, and info.

## Specific Validators

### **ChunkValidator**
Validates `SerializationChunks` of data, ensuring they meet structural and semantic requirements.

### **NodeTreeValidator**
Validates the structure and integrity of node trees within the model hierarchy.

###  **PartitionChunkValidator**
Specialized validator for validating `SerializationChunks` supposed to contain a single partition.

### **LanguageValidator**
Validates language definitions, checking that language structures conform to expected patterns and rules.

## Validation Utilities

Notable mention for **CommonChecks**: it provides a collection of common validation checks that can be reused across different validation scenarios.
