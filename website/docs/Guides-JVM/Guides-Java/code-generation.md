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

---

## End-to-End Walkthrough

This section shows the full workflow: providing a language definition, what the plugin
generates, and how to use the generated code.

### 1. Provide a Language Definition

Place your language JSON files in `src/main/lionweb/` (or the directory configured in
`languagesDirectory`). These are standard LionWeb serialization chunks containing a `Language`
node and its child `Concept`, `Property`, and `Containment` nodes.

The simplest way to produce this file is to author the language programmatically and then
serialize it with `JsonSerialization.saveLanguageToFile(language, file)`. A file for a simple
Task/TaskList language looks like:

```json
{
  "serializationFormatVersion": "2024.1",
  "languages": [
    { "key": "LionCore-M3",       "version": "2024.1" },
    { "key": "LionCore-builtins", "version": "2024.1" }
  ],
  "nodes": [
    {
      "id": "task-list-language",
      "classifier": { "language": "LionCore-M3", "version": "2024.1", "key": "Language" },
      "properties": [
        { "property": { "language": "LionCore-builtins", "version": "2024.1", "key": "LionCore-builtins-INamed-name" }, "value": "TaskList" },
        { "property": { "language": "LionCore-M3",       "version": "2024.1", "key": "Language-version"             }, "value": "1" },
        { "property": { "language": "LionCore-M3",       "version": "2024.1", "key": "IKeyed-key"                   }, "value": "TaskList" }
      ],
      "containments": [
        { "containment": { "language": "LionCore-M3", "version": "2024.1", "key": "Language-entities" },
          "children": ["task-list-concept", "task-concept"] }
      ],
      "references": [], "annotations": [], "parent": null
    }
    // ... TaskList concept, Task concept, their features ...
  ]
}
```

### 2. What Gets Generated

Running `./gradlew generateLWLanguages generateLWNodeClasses` produces two kinds of files
under `build/generated-lionweb/`:

**Language singleton** — one per language (`TaskListLanguage.java`):

```java
package com.example;

import io.lionweb.language.Concept;
import io.lionweb.language.Containment;
import io.lionweb.language.Language;
import io.lionweb.language.Property;

public class TaskListLanguage extends Language {

    public static final TaskListLanguage INSTANCE = new TaskListLanguage();

    public static final Concept TASK_LIST = INSTANCE.getConceptByName("TaskList");
    public static final Concept TASK      = INSTANCE.getConceptByName("Task");

    public static final Property    TASK_NAME  = (Property)    TASK.getFeatureByName("name");
    public static final Containment TASK_TASKS = (Containment) TASK_LIST.getFeatureByName("tasks");

    private TaskListLanguage() {
        // Reconstructed from the JSON definition
    }
}
```

**Typed node class** — one per `Concept` or `Interface` (`Task.java`):

```java
package com.example;

import io.lionweb.model.ClassifierInstanceUtils;
import io.lionweb.model.impl.DynamicNode;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class Task extends DynamicNode {

    public Task(@Nonnull String id) {
        super(id, TaskListLanguage.TASK);
    }

    @Nullable
    public String getName() {
        return (String) ClassifierInstanceUtils.getPropertyValueByName(this, "name");
    }

    public void setName(@Nullable String value) {
        ClassifierInstanceUtils.setPropertyValueByName(this, "name", value);
    }
}
```

### 3. Using the Generated Classes

Once generated, you can use the typed classes directly instead of the generic `DynamicNode`
API:

```java
import com.example.Task;
import com.example.TaskListLanguage;
import io.lionweb.serialization.JsonSerialization;
import io.lionweb.serialization.SerializationProvider;

// Create nodes using the typed API
Task task1 = new Task("task-1");
task1.setName("Buy milk");

Task task2 = new Task("task-2");
task2.setName("Write report");

// Serialize — register the generated language first
JsonSerialization serialization = SerializationProvider.getStandardJsonSerialization();
serialization.registerLanguage(TaskListLanguage.INSTANCE);
String json = serialization.serializeTreesToJsonString(task1);

// Deserialize — register a custom instantiator for the Task concept
serialization.getInstantiator().registerCustomDeserializer(
    TaskListLanguage.TASK.getID(),
    (classifier, serializedInstance, nodesByID, propertyValues) ->
        new Task(serializedInstance.getID()));

Task deserialized = (Task) serialization.deserializeToNodes(json).get(0);
System.out.println(deserialized.getName()); // "Buy milk"
```

This is equivalent to the heterogeneous API shown in [Working with Nodes](./working-with-nodes),
but the accessor methods are generated for you automatically instead of being written by hand.