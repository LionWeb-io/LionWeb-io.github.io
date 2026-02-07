---
title: Authoring Languages
sidebar_position: 10
---

# Authoring Languages

LionWeb is an open initiative to enable **interoperability among language engineering tools**.

While most language definitions are created using high-level tools like MPS, Freon, or StarLasu, LionWeb also supports **programmatic language definition** — including through the **Kotlin API** provided by the LionWeb Kotlin libraries.

This approach is useful when:

- Prototyping or testing language definitions
- Creating small or generated languages dynamically
- Using Kotlin-based tooling to generate or manipulate metamodels

---

## Authoring Languages Programmatically in Kotlin 

Using the LionWeb Kotlin API, a language can be constructed through code using a fluent and type-safe DSL built around `lwLanguage` and related functions.

Below is an example that defines a small language called `"Properties"`, with three concepts:

- `PropertiesPartition` (marked as a partition)
- `PropertiesFile`
- `Property`

It models a structure where a partition contains multiple files, and each file contains multiple properties.

The fluent API take care of the boring details like assigning IDs and keys as needed.

---

## Example: Properties Language in Kotlin

```kotlin
import io.lionweb.lioncore.java.language.Concept
import io.lionweb.lioncore.java.language.LionCoreBuiltins
import io.lionweb.lioncore.java.serialization.SerializationProvider
import io.lionweb.lioncore.kotlin.Multiplicity
import io.lionweb.lioncore.kotlin.createConcept
import io.lionweb.lioncore.kotlin.createContainment
import io.lionweb.lioncore.kotlin.lwLanguage
import java.io.File

val propertiesPartition: Concept
val propertiesFile: Concept
val property: Concept
val propertiesLanguage =
    lwLanguage("Properties").apply {
        propertiesPartition = createConcept("PropertiesPartition")
        propertiesFile = createConcept("PropertiesFile")
        property = createConcept("Property")

        propertiesPartition.isPartition = true
        propertiesPartition.createContainment("files", propertiesFile, Multiplicity.ZERO_TO_MANY)
        propertiesFile.createContainment("properties", property, Multiplicity.ZERO_TO_MANY)
        property.addImplementedInterface(LionCoreBuiltins.getINamed())
    }

fun main(args: Array<String>) {
    // Save the language to file
    File("properties-language.json").writeText(SerializationProvider.getStandardJsonSerialization().serializeTreesToJsonString(propertiesLanguage))
}
```

## Deriving Languages from Node subclasses

In LionWeb Kotlin, you can also create Node subclasses and then derive a language from their structure, without having to write it manually. For this, look into the next section.