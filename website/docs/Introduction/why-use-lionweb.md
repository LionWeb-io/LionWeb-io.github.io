---
title: Why Use LionWeb?
sidebar_position: 30
---

# LionWeb: When It Makes Sense to Use It

## Interoperability Across Modeling Tools
LionWeb is useful when multiple tools need to work with the same models. If each tool implements LionWeb support, they can interoperate at several levels:
- exchanging models,
- reusing existing LionWeb-compatible components.

This removes the need for bespoke integrations. It’s especially relevant in domains with long toolchains and mixed vendors, like model-based systems engineering (MBSE). A practical example is enabling different SysML 2 tools to work on the same models using LionWeb.

## Building Real-time Collaboration in Editors
Because the data model and structure are standardized, and thanks to the _delta-protocol_ editors built for different purposes can work together. 

This is particularly useful when different kinds of users want to use different editors or simply when multiple people are working on the same model at the same time.

## Using LionWeb Server Capabilities
LionWeb isn’t limited to file formats. The server provides features that keep expanding. For instance, upcoming support for _Derived Models_ will offer new capabilities.

## Model Exchange Through Serialization
You can use LionWeb purely as an exchange format. This is useful when constructing language-engineering pipelines. Each step of the pipeline can:
1. read a model in LionWeb format,
2. transform or analyze it,
3. save the result back in LionWeb format.

Subsequent steps—possibly implemented in different tools—can consume those files. Some tools might compute metrics, others generate dashboards, and others continue the transformation pipeline. This use-case is described in this article: [A Pipeline Approach to Language Migrations](https://www.infoq.com/articles/pipeline-language-migrations/).
