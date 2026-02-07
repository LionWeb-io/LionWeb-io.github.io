---
title: Code Generation
sidebar_position: 47
---

# Code Generation

The `lionweb-jvm` ecosystem provides tooling to generate strongly-typed Java classes from your LionWeb language definitions (JSON). This is similar to the Python binding generation but integrated into the JVM build process via Gradle.

# LionWeb Gradle Plugin

The `io.lionweb` Gradle plugin automates the generation of Java source code from LionWeb language definitions and packages language JSON files into your JAR artifacts.

## Apply the Plugin

To use the plugin, apply it in your `build.gradle.kts` (Kotlin DSL) or `build.gradle` (Groovy DSL).

You can find the latest version at [https://plugins.gradle.org/plugin/io.lionweb](https://plugins.gradle.org/plugin/io.lionweb).

### Kotlin DSL

```kotlin
plugins {
    id("io.lionweb") version "VERSION"
}
```

### Groovy DSL

```groovy
plugins {
    id "io.lionweb" version "VERSION"
}
```

## Configuration

The plugin exposes a `lionweb` extension block to configure input/output directories and generation settings.

### Example Configuration

```kotlin
lionweb {
    // Where to look for language definitions. Defaults to src/main/lionweb.
    languagesDirectory.set(layout.projectDirectory.dir("src/main/lionweb"))

    // Base package for generated code.
    defaultPackageName.set("com.example.languages")

    // Map specific language IDs to specific Java packages.
    languagesSpecificPackages.set(mapOf(
        "com_example_mylanguage_id" to "com.example.mylanguage"
    ))

    // Output directory for generated Java sources. Defaults to build/generated-lionweb.
    generationDirectory.set(layout.buildDirectory.dir("generated-lionweb"))

    // Force the Language Class to have a specific name (Key: Language ID).
    languagesClassNames.set(mapOf(
        "com.example.mylanguage" to "MyLanguage"
    ))

    // Restrict generation to specific languages (by Name, ID, or Key).
    // Useful if some languages in the folder are just dependencies.
    languagesToGenerate.set(setOf("MyLanguage"))

    // Map LionWeb primitive type IDs to fully qualified Java classes.
    primitiveTypes.set(mapOf(
        "com.example.types.Instant" to "java.time.Instant"
    ))

    // Map external classifiers (not generated here) to their Java implementation classes.
    mappings.set(mapOf(
        "com.example.other.MyConcept" to "com.example.other.MyConceptImpl"
    ))
}
```

### Settings Reference

* **`languagesDirectory`**: The directory containing your LionWeb language definitions (recursively scanned for `.json` files). Defaults to `src/main/lionweb`.
* **`generationDirectory`**: The target folder where generated Java sources will be written. Defaults to `build/generated-lionweb`.
* **`defaultPackageName`**: The base Java package name for generated code. This is required unless every language found has an explicit entry in `languagesSpecificPackages`.
* **`languagesSpecificPackages`**: A map where keys are LionWeb Language IDs and values are specific Java package names.
* **`languagesClassNames`**: A map where keys are LionWeb Language IDs and values are the desired simple names for the generated `Language` class (e.g., `MyLanguage`).
* **`languagesToGenerate`**: A set of strings (Language IDs, Names, or Keys) to restrict generation. If specified, only matching languages are generated; others are treated as dependencies.
* **`primitiveTypes`**: A map linking LionWeb PrimitiveType IDs to fully qualified Java class names (e.g., `java.lang.String` or `java.time.Instant`).
* **`mappings`**: A map linking fully qualified LionWeb classifier names to existing Java classes. This is used when your language references concepts generated elsewhere.

## Tasks

The plugin registers two primary tasks:

1.  **`generateLWLanguages`**: Generates the singleton `Language` class definition for each language.
2.  **`generateLWNodeClasses`**: Generates the strongly-typed Java classes for Concepts, Interfaces, and Enumerations.

### Task Behavior

Both tasks operate with the following logic:
* **Input Scanning**: They recursively read language files (`.json`) from the configured `languagesDirectory`.
* **Dependency Resolution**: They scan the `compileClasspath` for JARs containing LionWeb modules (in `META-INF/lionweb/*.json`) to resolve dependencies.
* **Output**: Generated files are written to the `generationDirectory`.

## Compilation Integration

If the `java` plugin is applied, the LionWeb plugin automatically adds the `generationDirectory` to the `main` source set and adds the `lionweb-java-core` dependency to the implementation.

If you need to configure this manually, you can add the output directory to your source set:

```kotlin
sourceSets.named("main") {
    java.srcDir(lionweb.generationDirectory)
}
```

## Limitations

* **Protobuf Support**: While the plugin may detect `.pb` files, processing them is currently unsupported and will raise an exception.
* **Structured Data Types**: Generation of code for Structured Data Types is not yet implemented.
* **Extended Concepts**: Generating node classes that extend other concepts is currently limited or under development in specific generators.