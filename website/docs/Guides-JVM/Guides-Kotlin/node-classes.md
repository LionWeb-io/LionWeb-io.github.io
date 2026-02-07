---
title: Creating custom node classes
sidebar_position: 20
---

# Creating and Working with Nodes in LionWeb

LionWeb provides a flexible and language-agnostic model for working with models (or trees, or ASTs: let's consider these as synonyms in this context). 

The main component is the [Node](https://lionweb.io/lionweb-java/api/io/lionweb/lioncore/java/model/Node.html).

When working with LionWeb nodes in Kotlin, there are **two complementary approaches** depending on your needs:

1. **Homogeneous nodes**, using generic, universal APIs which work with all form of nodes. When choosing this approach, we may want to consider `DynamicNode`.
2. **Heterogeneous nodes**, using language-specific, statically-typed Java classes, defined for a certain LionWeb language and just that one.

Regarding homogeneous nodes (a.k.a. using DynamicNode), just refer to the documentation for LionWeb Java.

For heterogeneous nodes instead, we can lever Kotlin-specific APIs.

## Example: creating custom Node sub-classes in Kotlin

You can define your own Kotlin classes by extending `BaseNode` and declaring features (properties, containments, references) through helper functions like `property`, `multipleContainment`, etc.


```kotlin
import io.lionweb.lioncore.kotlin.BaseNode
import io.lionweb.lioncore.kotlin.Implementation

interface Named {
    val name: String?
}

class Tenant : BaseNode(), Named {
    override var name: String? by property("name")
    val users = multipleContainment<User>("users")
    val directories = multipleContainment<Directory>("directories")

    override fun calculateID(): String? = "tenant-${name!!}"
}

class User : BaseNode(), Named {
    // Note that this means users should be unique across all tenants
    override fun calculateID(): String? = "user-${name!!}"

    override var name: String? by property("name")

    var password: String? by property("password")
}

abstract class File : BaseNode(), Named {
    override var name: String? by property("name")

    override fun calculateID(): String {
        val base =
            if (parent == null) {
                "ROOT_"
            } else {
                parent.id!!
            }
        return "${base}___${(name ?: throw IllegalStateException("Cannot calculate ID if name is not set")).replace('.', '_')}"
    }

    @Implementation
    val path: String
        get() {
            return if (this.parent is File) {
                "${(parent as File).path}/$name!!"
            } else {
                name!!
            }
        }
}

class Directory(id: String? = null) : File() {
    init {
        this.id = id
    }

    val files = multipleContainment<File>("files")
}

class TextFile() : File() {
    var contents: String? by property("contents")

    @Implementation
    val numberOfLines: Int?
        get() = contents?.lines()?.size
}
```

You can then associate node classes with corresponding concepts, if they have been created programmatically or loaded from an existing language:

```kotlin
registerMapping(Tenant::class, TenantConcept)
registerMapping(User::class, UserConcept)
registerMapping(File::class, FileConcept)
registerMapping(Directory::class, DirectoryConcept)
registerMapping(TextFile::class, TextFileConcept)
```       

This registers the mapping in the MetamodelRegistry, so LionWeb can match Kotlin classes to their concepts when serializing or deserializing nodes.

Here's a full example that:
 * Creates a language dynamically
 * Registers concept mappings
 * Builds a model
 * Serializes and deserializes it
 * Automatically reuses the Kotlin node classes

```kotlin
import io.lionweb.lioncore.java.language.Concept
import io.lionweb.lioncore.java.language.LionCoreBuiltins
import io.lionweb.lioncore.java.model.impl.DynamicNode
import io.lionweb.lioncore.java.serialization.SerializationProvider
import io.lionweb.lioncore.kotlin.MetamodelRegistry
import io.lionweb.lioncore.kotlin.MetamodelRegistry.registerMapping
import io.lionweb.lioncore.kotlin.Multiplicity
import io.lionweb.lioncore.kotlin.createConcept
import io.lionweb.lioncore.kotlin.createContainment
import io.lionweb.lioncore.kotlin.createProperty
import io.lionweb.lioncore.kotlin.lwLanguage
import kotlin.test.assertTrue

fun main(args: Array<String>) {
    val tenantConcept: Concept
    val userConcept: Concept
    val fileConcept: Concept
    val directoryConcept: Concept
    val textFileConcept: Concept
    val organizationLanguage =
        lwLanguage("Organization").apply {
            tenantConcept = createConcept("Tenant").apply {
                isPartition = true
                addImplementedInterface(LionCoreBuiltins.getINamed())
            }
            userConcept = createConcept("User").apply {
                addImplementedInterface(LionCoreBuiltins.getINamed())
                createProperty("password", LionCoreBuiltins.getString())
            }
            fileConcept = createConcept("File").apply {
                isAbstract = true
                addImplementedInterface(LionCoreBuiltins.getINamed())
            }
            directoryConcept = createConcept("Directory").apply {
                extendedConcept = fileConcept
            }
            textFileConcept = createConcept("TextFile").apply {
                extendedConcept = fileConcept
                createProperty("contents", LionCoreBuiltins.getString())
            }

            tenantConcept.createContainment("users", userConcept, Multiplicity.ZERO_TO_MANY)
            tenantConcept.createContainment("directories", directoryConcept, Multiplicity.ZERO_TO_MANY)

            directoryConcept.createContainment("files", fileConcept, Multiplicity.ZERO_TO_MANY)
        }

    registerMapping(Tenant::class, tenantConcept)
    registerMapping(User::class, userConcept)
    registerMapping(File::class, fileConcept)
    registerMapping(Directory::class, directoryConcept)
    registerMapping(TextFile::class, textFileConcept)

    val tenant1 = Tenant().apply {
        name = "My Tenant"
        users.add(User().apply {
            name = "Gino"
            password = "FerraraBiciclette87"
        })
        directories.add(Directory().apply {
            name = "root"
            files.add(TextFile().apply {
                name = "foo.json"
                contents = "{}"
            })
        })
    }

    val jsonSerialization = SerializationProvider.getStandardJsonSerialization()
    val tenant1Serialized = jsonSerialization.serializeTreeToJsonString(tenant1)

    jsonSerialization.enableDynamicNodes()
    var deserializedTenant1 = jsonSerialization.deserializeToNodes(tenant1Serialized).first()
    assertTrue(deserializedTenant1 is DynamicNode)

    MetamodelRegistry.prepareJsonSerialization(jsonSerialization)

    deserializedTenant1 = jsonSerialization.deserializeToNodes(tenant1Serialized).first()
    assertTrue(deserializedTenant1 is Tenant)
}
```

## Automatically Deriving Languages from Kotlin Classes

Instead of manually defining the language, you can derive the entire language structure from your node subclasses:

```kotlin
val organizationLanguage = lwLanguage(
    "Organization",
    Tenant::class, User::class, File::class,
    Directory::class, TextFile::class
)
```

LionWeb will:
 * Inspect the properties and containments declared with property, multipleContainment, etc.
 * Derive the corresponding LionWeb concepts and features
 * Automatically register mappings

This is ideal for quick prototyping and avoids duplication.

Here there is the complete example:

```kotlin
import io.lionweb.lioncore.java.model.impl.DynamicNode
import io.lionweb.lioncore.java.serialization.SerializationProvider
import io.lionweb.lioncore.kotlin.MetamodelRegistry
import io.lionweb.lioncore.kotlin.lwLanguage
import kotlin.test.assertTrue

fun main(args: Array<String>) {
    val organizationLanguage =
        lwLanguage("Organization", Tenant::class, User::class, File::class,
            Directory::class, TextFile::class)
    val tenantConcept = organizationLanguage.getConceptByName("Tenant")!!
    val userConcept = organizationLanguage.getConceptByName("User")!!
    val fileConcept = organizationLanguage.getConceptByName("File")!!
    val directoryConcept = organizationLanguage.getConceptByName("Directory")!!
    val textFileConcept = organizationLanguage.getConceptByName("TextFile")!!

    val tenant1 = Tenant().apply {
        name = "My Tenant"
        users.add(User().apply {
            name = "Gino"
            password = "FerraraBiciclette87"
        })
        directories.add(Directory().apply {
            name = "root"
            files.add(TextFile().apply {
                name = "foo.json"
                contents = "{}"
            })
        })
    }

    val jsonSerialization = SerializationProvider.getStandardJsonSerialization()
    val tenant1Serialized = jsonSerialization.serializeTreeToJsonString(tenant1)

    jsonSerialization.enableDynamicNodes()
    var deserializedTenant1 = jsonSerialization.deserializeToNodes(tenant1Serialized).first()
    assertTrue(deserializedTenant1 is DynamicNode)

    MetamodelRegistry.prepareJsonSerialization(jsonSerialization)

    deserializedTenant1 = jsonSerialization.deserializeToNodes(tenant1Serialized).first()
    assertTrue(deserializedTenant1 is Tenant)
}
```

## Key Features and Mechanisms

| Feature                          | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| `BaseNode`                       | Superclass for all custom nodes                                            |
| `property(...)`                  | Declares a LionWeb property tied to a Kotlin property                      |
| `multipleContainment(...)`      | Declares a multi-valued containment reference                              |
| `calculateID()`                  | Override to auto-assign node IDs                                           |
| `@Implementation`               | Marks a Kotlin property as *implementation-only*, not part of the metamodel |
| `registerMapping(...)`          | Binds a Kotlin class to a LionWeb concept                                  |
| `lwLanguage("Name", classes...)`| Derives a full language from node classes                                  |

---

## Summary

You have **two options** when working with node classes in Kotlin:

- **Manual mapping**:
  - Define your language programmatically
  - Register mappings with `registerMapping`
  - Use full control over the language definition

- **Auto-derive from node classes**:
  - Write node subclasses using `BaseNode` and helpers
  - Use `lwLanguage(...)` to derive the metamodel

This dual approach lets you choose the right balance between **flexibility** and **convenience**.