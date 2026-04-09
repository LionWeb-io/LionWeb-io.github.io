---
title: EMF Integration
sidebar_position: 48
---

# EMF Integration

The `lionweb-java-emf` module provides bidirectional conversion between LionWeb and the
Eclipse Modeling Framework (EMF/Ecore). This lets you:

- **Export** a LionWeb language (metamodel) to an Ecore `EPackage` for use in Eclipse tools.
- **Import** an existing Ecore `EPackage` as a LionWeb `Language`.
- **Export** LionWeb nodes to EMF `EObject` instances.
- **Import** EMF `EObject` instances as LionWeb nodes.

## Dependencies

```kotlin
dependencies {
    implementation("io.lionweb:lionweb-2024.1-core:$lionwebVersion")
    implementation("io.lionweb:lionweb-2024.1-emf:$lionwebVersion")
    // Required for LionCore built-in elements that have no Ecore equivalent
    implementation("io.lionweb:lionweb-2024.1-emf-builtins:$lionwebVersion")
}
```

## Exporting a Language to Ecore

Use `EMFMetamodelExporter` to convert a LionWeb `Language` into an Ecore `EPackage`:

```java
import io.lionweb.emf.EMFMetamodelExporter;
import io.lionweb.language.Language;
import org.eclipse.emf.ecore.EPackage;

Language myLanguage = ...; // your LionWeb language

EMFMetamodelExporter exporter = new EMFMetamodelExporter();
EPackage ePackage = exporter.exportLanguage(myLanguage);
```

To export multiple languages into a single EMF `Resource`:

```java
import org.eclipse.emf.ecore.resource.Resource;
import java.util.List;

Resource resource = exporter.exportResource(List.of(myLanguage, anotherLanguage));
```

## Importing a Language from Ecore

Use `EMFMetamodelImporter` to convert an Ecore `EPackage` into a LionWeb `Language`:

```java
import io.lionweb.emf.EMFMetamodelImporter;
import io.lionweb.language.Language;
import org.eclipse.emf.ecore.EPackage;

EPackage ePackage = ...; // your Ecore package

EMFMetamodelImporter importer = new EMFMetamodelImporter();
Language language = importer.importEPackage(ePackage);
```

To import all languages from a `Resource`:

```java
List<Language> languages = importer.importResource(resource);
```

## Exporting Nodes to EMF Objects

Use `EMFModelExporter` to convert LionWeb nodes into EMF `EObject` instances. You must first
set up the exporter with the language mapping (so it knows which `EClass` to use for each
`Concept`).

```java
import io.lionweb.emf.EMFModelExporter;
import io.lionweb.model.Node;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import java.util.List;

EMFModelExporter modelExporter = new EMFModelExporter();
Resource resource = modelExporter.exportResource(List.of(rootNode));
```

## Importing EMF Objects as Nodes

Use `EMFModelImporter` to convert EMF `EObject` instances back into LionWeb nodes:

```java
import io.lionweb.emf.EMFModelImporter;
import io.lionweb.model.Node;
import org.eclipse.emf.ecore.resource.Resource;
import java.util.List;

EMFModelImporter modelImporter = new EMFModelImporter();
List<Node> nodes = modelImporter.importResource(resource);
```

## About emf-builtins

Some LionCore built-in elements (such as `INamed`, `IKeyed`, and primitive types) have no
direct Ecore equivalent. The `emf-builtins` module provides a companion `EPackage` that
fills this gap:

- **nsURI**: `http://lionweb.io/lionweb-java/emf/core/builtins/2023.1`
- **Bundle-SymbolicName**: `io.lionweb.emf.builtins`

This package is automatically used by `EMFMetamodelExporter` and `EMFMetamodelImporter` when
they encounter LionCore built-in types, so you only need to add it as a dependency — no
further configuration is required.
