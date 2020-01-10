# junit-to-md

![npm](https://img.shields.io/npm/v/junit-to-md?style=for-the-badge)

A utility to convert JUnit test result output to a markdown format that is intended for a GitHub check summary or text area.

To install:

```
npm install -g junit-to-md
```

To generate a summary section:

```
junit-to-md summary
```

To generate a text section:

```
junit-to-md text
```

Note: execute the command in the root folder of the project where tests have been executed. It will search through sub-folders to find any JUnit test results.
