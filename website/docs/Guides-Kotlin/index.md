---
id: index
title: Getting Started
sidebar_position: 1
---

## Getting Started with LionWeb Kotlin

The LionWeb Kotlin modules complement the LionWeb Java ones, adding adapters to make the life of Kotlin developers more convenient.

This guide will help you get started with LionWeb Kotlin, from installation to creating your first project.

## Prerequisites

- Java 8 or later

## Installation

Note that even if you want to use the 2023.1 specs you can use a recent version of LionWeb Kotlin. All versions supports also previous versions of the specs.

### Using Gradle

Add the following to your `build.gradle` or `build.gradle.kts`:

```kotlin
dependencies {
    implementation("io.lionweb.lionweb-kotlin:lionweb-kotlin-2024.1-core:0.4.2")
    implementation("io.lionweb.lionweb-kotlin:lionweb-kotlin-2024.1-repo-client:0.4.2")
}
```

### Using Maven

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>io.lionweb.lionweb-kotlin</groupId>
    <artifactId>lionweb-kotlin-2024.1-core</artifactId>
    <version>${lionwebVersion}</version>
</dependency>
<dependency>
    <groupId>io.lionweb.lionweb-kotlin</groupId>
    <artifactId>lionweb-kotlin-2024.1-repo-client</artifactId>
    <version>${lionwebVersion}</version>
</dependency>
```

## Usage Schema

The typical usage consists in:
* Authoring a new Language or retrieving it
* Build models (i.e., trees of LionWeb Nodes) according to the Language(s) defined or used
* Serialize/De-serialize models for storage and for interoperability with other tools
* Relay on a LionWeb-compliant repository for storing models and for real-time collaboration with other clients
