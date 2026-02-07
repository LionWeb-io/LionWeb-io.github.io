---
title: Generating code from a LionWeb Language
sidebar_position: 45
---
# Generating Python Classes

The `lionweb` package includes a CLI tool, `lionweb-gen`, to generate Python bindings (classes, language definitions, and deserializers) from LionWeb language definition files (JSON).

## Installation

You typically create a Python virtual environment and install the package there:

```bash
python3 -m venv venv
source venv/bin/activate
pip install lionweb
```

## CLI Usage

The general syntax for the generator is:

```bash
lionweb-gen [OPTIONS] LIONWEB_LANGUAGE OUTPUT
```

### Arguments

* `LIONWEB_LANGUAGE`: Path to the existing LionWeb language file (JSON).
* `OUTPUT`: Path to the output directory where Python files will be generated.

### Options

| Option | Shorthand | Description |
| :--- | :--- | :--- |
| `--dependencies` | `-d` | Path to a LionWeb language file necessary to use as dependencies to open the target languages. Can be specified multiple times. |
| `--language-packages` | `--lp` | Maps a language ID or name to the Python package that provides it. Format: `LANG=PACKAGE` (e.g., `MyLang=myapp.lang`). |
| `--primitive-types` | `--pt` | Maps a primitive type ID or name to the Python type that provides it. Format: `PRIMITIVE_TYPE=QUALIFIED_NAME` (e.g., `String=str`). |
| `--lionweb-version` | `--lwv` | LionWeb version to use for processing. Defaults to `2023.1`. |
| `--help` | | Show the help message and exit. |

## Examples

### SysML2 Generation Example

Below is an example of generating bindings for SysML2, utilizing dependencies and type mappings.

1. **Clean previous generation**
   ```bash
   rm -Rf sysml2py/kerml/
   rm -Rf sysml2py/sysml/
   rm -Rf sysml2py/types/
   ```

2. **Generate Base Types**
   ```bash
   lionweb-gen ../models/types_lionweb.json sysml2py/types
   ```

3. **Generate KerML (depends on types)**
   ```bash
   lionweb-gen ../models/kerml_lionweb_lionweb.json \
     -d ../models/types_lionweb.json \
     sysml2py/kerml \
     --lp types=sysml2py.types \
     --pt String=str --pt Boolean=bool --pt Integer=int --pt Real=float
   ```

4. **Generate SysML (depends on types)**
   ```bash
   lionweb-gen ../models/SysML_lionweb_lionweb.json \
     -d ../models/types_lionweb.json \
     sysml2py/sysml \
     --lp types=sysml2py.types \
     --pt String=str --pt Boolean=bool --pt Integer=int --pt Real=float
   ```

## Generated Output

The tool generates the following files in the specified output directory:

* **`language.py`**: Defines the `Language` instance, including all Concepts, Interfaces, Enumerations, and their features.
* **`deserializer.py`**: Contains the `register_deserializers` function to register custom deserializers for the language's concepts.
* **`__init__.py`**: Exports all generated classes for easy importing.
* **Node Classes**: A separate Python file for every Concept, Interface, and Enumeration (e.g., `my_concept.py`). These classes include type-hinted getters and setters for properties, containments, and references.