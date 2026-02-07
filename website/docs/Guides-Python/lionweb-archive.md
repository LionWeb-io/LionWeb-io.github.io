---
title: LionWeb Archive
sidebar_position: 46
---
# LionWeb Archive

The LionWeb Python package includes support for interacting with LionWeb Archives (`.lwa`). These archives are ZIP files containing multiple serialization chunks, typically using Protocol Buffers.

> **Note:** Currently, the library supports **reading** archives only. Support for creating archives is not yet implemented.

## Loading an Archive

To load the entire content of an archive into memory at once, use `load_archive`. This will return a list of all `SerializationChunk` objects found within the file.

```python
from lionweb.serialization.archive import load_archive

# Load all chunks into a list
chunks = load_archive("path/to/archive.lwa")

for chunk in chunks:
    print(f"Loaded chunk with {len(chunk.nodes)} nodes")
```

## Processing an Archive

For large archives, or when you wish to process data incrementally, use `process_archive`. This function iterates through the archive entries and invokes a callback function for each chunk found.

### Function Signature

```python
def process_archive(
    filename: str | PathLike,
    chunk_processor: Callable[[int, int, "SerializationChunk"], None]
) -> None:
    ...
```

* **filename**: Path to the `.lwa` file.
* **chunk_processor**: A callback function that receives:
    * `index` (int): The current chunk index (0-based).
    * `total` (int): The total number of files/chunks in the archive.
    * `chunk` (SerializationChunk): The deserialized data chunk.

### Example

```python
from lionweb.serialization.archive import process_archive

def my_processor(index, total, chunk):
    print(f"Processing chunk {index + 1}/{total}")
    # Handle the chunk data here
    # ...

# Process the archive without loading everything into memory at once
process_archive("path/to/large_archive.lwa", my_processor)
```