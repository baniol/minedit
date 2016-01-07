# MinEdit

> Minedi is a minimal markdown to html static page generator. 

## General description

The script reads recursively the source folder and converts them into html files into the target folder.

__It doesn't provide a server for serving generated html files__.

## Installation and setup

> The script uses javascript ECMAScript 2015. Make sure you have installed appropriate Node.js version!

* `npm install` & `bower install`
* Copy `config.exmple.json` to `config.json`.

### Config file

```
{
  "sourceDir": "./sources",
  "targetDir": "./public",
  "mainTemplate": "main.html",
  "copyAssets": [
    {
      "source": "./sources/styles/styles.css",
      "target": "./public/styles/"
    },
    {
      "source": "./bower_components/github-markdown-css/github-markdown.css",
      "target": "./public/styles/"
    }
  ]
}
```

* `sourceDir` - directory with source markdown files (must have `md` extension). May contain nested folders.
* `targetDir` - target directory for compiled html files.
* `copyAssets` - collection of assets (css, images) to be copied to the target directory. 

### Html template

You can alter the general look of the pages by modyfying the `templates/main.html` file.

### Generating html files.

After editing, adding or removing files in the source directory run `npm start` in the project directory.

### Global `minedit` command
 
To be able to compile markdown files from the source folder with a global `minedit` command, run `npm link` in the minedit project folder.

### Displaying the config

In order to display the configuration run `minedit config`.

To display the path to the source files run `minedit sources`.