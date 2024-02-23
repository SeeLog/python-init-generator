# Python init Generator - Visual Studio Code Extension

## What is this?

This extension generates Python `__init__.py` file(s) respectively and recursively.

## Demo & How to use

![Gif](https://github.com/SeeLog/python-init-generator/blob/demo_gif/demo.gif?raw=true)

### From the Command Palette

1. Open your workspace or directory.
2. Press `Ctrl(Cmd) + Shift + P`
3. Just select `Python init Generator: Generate __init__.py`
4. Happy!

### From the File Explorer menu

1. Select a file or folder.
   1. When selecting a file, its parent directory will be used as a starting point.
2. Mouse right click and select: `Generate __init__.py from here`.

## Configuration

- `pythonInitGenerator.ignoreDirectories`: Regex pattern to ignore directories.
  Example:

  ```json
  {
    "pythonInitGenerator.ignoreDirectories": ["\\bdata\\b", "share", "local"]
  }
  ```

  Note that values are treated as regex patterns so you need to escape special characters.

## License

MIT

## History

YYYY.mm.dd(Timezone)
2024.02.24(JST) Add the new feature to ignore directories. (Thanks @sisoe24 [#17](https://github.com/SeeLog/python-init-generator/pull/17))

2023.01.08(JST) Add the new ability to create init files from the context menu. (Thanks @sisoe24 [#8](https://github.com/SeeLog/python-init-generator/pull/8))

2021.06.05(JST) Fix windows path problem. (See also [#5](https://github.com/SeeLog/python-init-generator/pull/5))

2021.06.04(JST) Fix [#1](https://github.com/SeeLog/python-init-generator/issues/1), sorry it took so long to fix.

2019.10.03(JST) First release
