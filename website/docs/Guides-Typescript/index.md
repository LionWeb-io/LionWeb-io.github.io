---
id: index
title: Getting started with LionWeb Typescript
sidebar_position: 1
---

LionWeb Typescript is a Typescript implementation of the LionWeb specification, providing libraries for working with languages and models in the LionWeb ecosystem.

This guide will help you get started with LionWeb Typescript, from installation to creating your first project.

If you are instead using Java, Kotlin, Python, or C# please look for the corresponding bindings.

## What is LionWeb?

LionWeb is a specification for model-based software engineering that provides:
- A common format for exchanging models
- Protocols for making components interoperable
- Tools for working with models, most notably repositories
- Integration with existing modeling tools

## Features

- Support for the definition nodes and languages
- Serialization and deserialization in JSON
- Client-side implementation of the LionWeb bulk protocol, with support for delta coming soon
- Support for both 2023.1 and 2024.1 specifications

## Installation

```
npm add @lionweb/core @lionweb/utilities
```

## Usage Schema

The typical usage consists in:
* Authoring a new Language or retrieving it
* Build models (i.e., trees of LionWeb Nodes) according to the Language(s) defined or used
* Serialize/De-serialize models for storage and for interoperability with other tools
* Relay on a LionWeb-compliant repository for storing models and for real-time collaboration with other clients
