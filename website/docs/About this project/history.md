---
sidebar_position: 14
title: History of the project
---

All of the initial participants have a history of working with or on [Jetbrains MPS](http://jetbrains.com/mps/), and we all appreciate its revolutionary approach of projectional editing. Most of us have also worked with [EMF](https://www.eclipse.org/modeling/emf/) and tools on top of it, in particular, [Xtext](https://www.eclipse.org/Xtext/). However, over the last few years, the need to run "something like MPS" in the browser has increased, and many of the LionWeb founders have started developing ideas and tools around web-based language workbenches:

* [Freon](https://www.freon4dsl.dev/) by Jos Warmer, Anneke Kleppe
* [MPSServer](https://github.com/Strumenta/MPSServer) by Strumenta. It is an http and websockets server that can be started from standard and headless MPS to permit interaction with MPS from outside it. It permits to read and modify models, trigger builds, get typesystem information, etc. There is also a TypeScript client library available on NPM. It is called [MPSServer-client](https://github.com/Strumenta/mpsserver-client)
* [WebEditKit](https://github.com/Strumenta/webeditkit) by Strumenta. It is a prototypal framework for defining projectional editors that can interact with MPS through MPSServer
* [Modelix](https://github.com/modelix) by itemis, an open Source platform for models on the Web
* [StarLasu](https://github.com/Strumenta/starlasu) by Strumenta. It is a set of libraries to define and work with ASTs in Kotlin, Java, Python, TypeScript. They have been used in production for years
* Markus' [vision paper](http://voelter.de/data/pub/APlatformForSystemsAndBusinessModeling.pdf) about the future of web-based language workbenches
* [MPS](http://jetbrains.com/mps/) itself; it should also be integrable into LionWeb-based systems.

These tools are independent and do not provide out-of-the-box interoperability. This is unfortunate because
* None of them provides everything that's needed for an LWB in the cloud
* Many aren't broken down into components that are exposed through a well-defined API and can be used independently
* Some provide similar functionality with different interfaces for the same kind of problem (M3 layer, model loading, e.g.)

The lack of interoperability discourages others from developing additional components. It is also hard to explain to potential users, customers, contributors, and funders why this small community hasn't been able to coordinate better. We have started LionWeb to fix these problem: 

:::info
**The LionWeb initiative aims to facilitate the community-based development of language engineering and modeling tools on the web.**