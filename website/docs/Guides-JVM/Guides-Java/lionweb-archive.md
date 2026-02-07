---
title: LionWeb Archive
sidebar_position: 48
---

# LionWeb Archive

The LionWeb Archive (`.lwa`) is a compressed format for storing LionWeb models. It consists of a standard ZIP file containing one or more "chunks" of model data, typically serialized using Protocol Buffers (protobuf) for efficiency.

While JSON is excellent for human readability and debugging, the Archive format is preferred for:
* **Large models**: Reducing file size and I/O time.
* **Streaming**: Processing data chunk-by-chunk without loading the entire model into memory.

## Reading an Archive

To read a `.lwa` file in the JVM ecosystem, you typically combine standard Java `ZipInputStream` handling with the `ProtobufSerialization` class provided by `lionweb-java`.

### Dependencies

Ensure you have the core LionWeb Java library and the Protocol Buffers library in your dependencies.

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.lionweb:lionweb-2024-1-core:<LionWeb JVM version>")
    implementation("io.lionweb:lionweb-2024.1-extensions:<LionWeb JVM version>")
}
```

### Loading Code Example

Below is an example of how to iterate through an archive and deserialize chunks.

```java
import io.lionweb.lionweb.java.serialization.ProtobufSerialization;
import io.lionweb.lionweb.java.serialization.SerializationChunk;
import io.lionweb.lionweb.java.LionWebVersion;
import java.io.FileInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public void loadArchive(String path) throws Exception {
    // 1. Create the deserializer (configured for the specific LionWeb version)
    ProtobufSerialization protobufSerialization = new ProtobufSerialization(LionWebVersion.V2023_1);

    // 2. Open the ZIP file
    try (ZipInputStream zis = new ZipInputStream(new FileInputStream(path))) {
        ZipEntry entry;
        while ((entry = zis.getNextEntry()) != null) {
            // We assume every file in the zip is a protobuf chunk
            if (!entry.isDirectory()) {
                // 3. Read the bytes of the current entry
                byte[] bytes = zis.readAllBytes();

                // 4. Deserialize the chunk
                SerializationChunk chunk = protobufSerialization.deserializeChunkFromBytes(bytes);

                System.out.println("Loaded chunk with " + chunk.getNodes().size() + " nodes");
                
                // Process the nodes here...
            }
        }
    }
}
```

## Writing an Archive

Creating an archive involves serializing your nodes into chunks using `ProtobufSerialization` and writing them as entries into a `ZipOutputStream`.

```java
// Example pseudo-code for writing
try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream("output.lwa"))) {
    // Serialize a list of nodes to a chunk
    SerializationChunk chunk = protobufSerialization.serializeNodesToChunk(myNodes);
    
    // Create a zip entry
    ZipEntry entry = new ZipEntry("chunk_0.pb");
    zos.putNextEntry(entry);
    
    // Write bytes
    zos.write(protobufSerialization.serializeChunkToBytes(chunk));
    zos.closeEntry();
}
```