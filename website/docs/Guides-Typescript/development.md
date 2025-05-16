---
sidebar_position: 10
---

Development relies on the following tools being installed:

* Node.js: JavaScript runtime
* NPM (bundled with Node.js)
* (optional) PlantUML. An IDE plugin such as the one for IntelliJ IDEA also does the trick.

Note that development tends to be done against the latest LTS (or even more recent) versions of Node.js and NPM.

## Main commands

Run the following command to setup the project:

```shell
npm run clean
npm install
npm run setup
```
Run the following command to **build** each of the packages:

```shell
# Build the project
npm run build
```

This includes cleaning up and installing any NPM (dev) dependencies.

The preceding commands can also be run as follows:

```shell
npm run initialize
```

The following command statically _style_-checks the source code in all the packages:

```shell
# Run lint
npm run lint
```

*Note* that this does not catch TypeScript compilation errors!
(That's because linting only does parsing, not full compilation.)

Run the following command to run the tests:

```shell
# Run the tests
npm run test
```

### Code style

All the code in this repository is written in TypeScript, with the following code style conventions:

* Indentation is: **4 spaces**.

* **No semicolons** (`;`s).
    This is slightly controversial, but I (=Meinte Boersma) simply hate semicolons as a statement separator that's virtually always unnecessary.
    The TypeScript compiler simply adds them back in the appropriate places when transpiling to JavaScript.

* Use **"FP-lite"**, meaning using `Array.map` and such functions over more imperative ways to compute results.

We use prettier with parameters defined in `.prettierrc`.
*Note* that currently we don't automatically run `prettier` over the source code.


### Containerized development environment

If you prefer not to install the development dependencies on your machine, you can use our containerized development environment for the LionCore TypeScript project. This environment provides a consistent and isolated development environment that is easy to set up and use. To get started, follow the instructions in our [containerized development environment guide](./documentation/dev-environment.md). However, you can streamline the process by running the following command:

```shell
docker run -it --rm --net host --name working-container -v ${PWD}:/work indamutsa/lionweb-devenv:v1.0.0 /bin/zsh
```

- `docker run`: Initiates a new container.
- `-it`: Enables interactive mode with a pseudo-TTY.
- `--rm`: Removes container after exit.
- `--net host`: Shares the host's network.
- `--name working-container`: Names the container.
- `-v ${PWD}:/work`: Maps host's current directory to `/work` in the container.
- `indamutsa/lionweb-devenv:v1.0.0`: Specifies the Docker image.
- `/bin/zsh`: Starts a Zsh shell inside the container.