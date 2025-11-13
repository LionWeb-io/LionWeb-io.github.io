---
title: Features
sidebar_position: 33
---

# LionWeb Feature Matrix

This page provides a comprehensive overview of the features available across different LionWeb implementations and integrations. Whether you're looking to serialize models, work with language definitions, or connect to a repository server, this matrix will help you choose the right implementation for your needs.

## Understanding the Symbols

Throughout these tables, you'll see the following symbols:
- ✅ **Fully Supported** - The feature is implemented and ready to use
- 🏗️ **Under Construction** - The feature is currently being developed
- ❓ **Status Unknown** - We need to verify the current status of this feature
- ➖ **Not Applicable** - This feature doesn't apply to this implementation or integration

## LionWeb Implementations

LionWeb implementations are available in five programming languages, each providing core functionality for working with LionWeb models and languages. These libraries form the foundation for building language workbenches, model transformations, and other language engineering tools.

The table below shows which features are available in each language implementation:

| **Feature**                                         | **LW C#** | **LW Java** | **LW Kotlin** | **LW TypeScript** | **LW Python** |
|-----------------------------------------------------|:---------:|:-----------:|:-------------:|:-----------------:|:-------------:|
| M1 (model) de/serializer from/to LW JSON            |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| M2 (language) de/serializer from/to LW JSON         |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| M1 (model) de/serializer from/to LW Protobuf        |     ➖     |      ✅      |       ✅       |         ✅         |       ✅       |
| M2 (language) de/serializer from/to LW Protobuf     |     ➖     |      ✅      |       ✅       |         ✅         |       ✅       |
| Language agnostic (Reflective) API to CRUD LW nodes |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| Language specific API to CRUD LW nodes              |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| Bulk protocol Client                                |     ❓     |      ✅      |       ✅       |         ✅         |       ✅       |
| Delta protocol Client                               |     🏗     |      🏗️      |       ➖       |         🏗         |       ➖       |

### Key Features Explained

**M1 and M2 Serialization**: All implementations support both model (M1) and language (M2) serialization to and from LionWeb JSON format and [Protobuf](https://protobuf.dev/) format, enabling seamless data exchange between different tools and platforms.

**API Approaches**: Each implementation offers two complementary APIs:
- **Reflective API**: Work with any LionWeb model dynamically without generated code
- **Language-specific API**: Use strongly-typed, generated code for compile-time safety and better IDE support

**Protocol Support**: The Bulk protocol allows efficient retrieval and storage of large model partitions. The Delta protocol, currently under development for C#, Typescript, and Java, will enable incremental synchronization of model changes.

## LionWeb Integrations

| **Feature**                  | **MPS** | **EMF** |   **Freon**   | **Rascal** | **Modelix** | **LW Repository** | **Starlasu** |
|------------------------------|:-------:|:-------:|:-------------:|:----------:|:-----------:|:-----------------:|:------------:|
| Depends on LW implementation | LW Java | LW Java | LW TypeScript |   LW Java  |      ❓      |   LW TypeScript   | LW Java      |
| Export to LW M1 (model)      |    ✅    |    ✅    |       ✅       |      ✅     |      ✅      |         ➖         |   ✅    |
| Export to LW M2 (language)   |    ✅    |    ✅    |       ✅       |      ❓     |      ❓      |         ➖         |   ✅    |
| Import from LW M1 (model)    |    ✅    |    ✅    |       ✅       |      ✅     |      ✅      |         ➖         |   ✅    |
| Import from LW M2 (language) |    ❓    |    ✅    |       ✅       |      ✅     |      ❓      |         ➖         |   ✅    |
| Bulk protocol Server         |    ❓    |    ➖    |       ➖       |      ➖     |      ✅      |         ✅         |   ➖    |
| Bulk protocol Client         |    ➖    |    ➖    |       ❓       |      ➖     |      ➖      |         ➖         |   ➖    |
| Delta protocol Server        |    ➖    |    ➖    |       ➖       |      ➖     |      ➖      |         🏗️         |   ➖    |
| Delta protocol Client        |    ➖    |    ➖    |       ➖       |      ➖     |      ➖      |         ➖         |   ➖    |

### Integration Highlights

**MPS and EMF**: The most mature integrations, supporting both model and language import/export. These make it possible to exchange data between JetBrains MPS and Eclipse Modeling Framework projects.

**Freon**: A TypeScript-based language workbench with comprehensive LionWeb support for both models and languages.

**Rascal**: A meta-programming language and toolkit with strong model import/export capabilities.

**Modelix and LW Repository**: These act as server-side repositories, implementing the Bulk protocol to store and serve LionWeb models. The LW Repository is actively developing Delta protocol support for real-time collaborative editing scenarios.

**Starlasu**: This is a family of frameworks for processing textual languages (such as SQL, RPG, COBOL, and many others). More at [Starlasu](https://starlasu.strumenta.com/).

## Contributing

Notice something missing or incorrect? The LionWeb project is community-driven, and we welcome contributions. If you've implemented a feature or know the status of one marked with ❓, please let us know or submit a pull request to update this documentation.
