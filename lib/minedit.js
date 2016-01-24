'use strict';

var path = require('path');
var fs = require('fs');
var recursive = require('recursive-readdir');
var marked = require('marked');
var mkdirp = require('mkdirp');

class Minedit {

  constructor(config) {
    if (!config) throw Error('No confguration file provided!');
    this.config = config;
  }

  compile() {
    recursive(this.config.sourceDir, [], (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach((f) => {
        if (path.basename(f) !== this.config.mainTemplate)
          this.saveFile(f);
      });
    });
    this.copyAssets();
  }

  saveFile(file, newFileFlag) {
    var message = newFileFlag ? `A new file has been added: ${file}` : `File: ${file} has been updated`;
    console.log(message);
    var ext = path.extname(file);
    if (ext === '.md') {
      var targetFile = ext === '.md' ? file.replace(/\.md$/, '.html') : file;
      var diff = path.relative(this.config.sourceDir, targetFile);
      var targetPath = path.join(this.config.targetDir, diff);
      var source = fs.readFileSync(file, 'utf8');
      var dirName = path.dirname(targetPath);
      mkdirp(dirName, (err) => {
        if (err) console.error(err);
        this.writeCompiled(source, targetPath, ext);
      });
    }
    else if (path.basename(file) === this.config.mainTemplate) {
      this.compile();
    }
  }

  writeCompiled(source, targetPath, ext) {
    var template = this.getTemplate();
    var compiled = ext === '.md' ? template.replace('@@content@@', marked(source)) : source;
    fs.writeFile(targetPath, compiled);
  }

  getTemplate() {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', this.config.mainTemplate), 'utf8');
  }

  copyAssets() {
    this.config.copyAssets.forEach((el) => {
      var targetDir = path.resolve(el.target);
      mkdirp(targetDir, (err) => {
        if (err) console.error(err);
        this.copyFile(path.resolve(el.source), path.resolve(path.join(targetDir, path.basename(el.source))));
      });
    });
  }

  clear(cb) {
    this.clearDir(this.config.targetDir, false, cb);
  }

  displayConfig() {
    fs.createReadStream('config.json').pipe(process.stdout);
  }

  displaySourcePath() {
    return path.resolve(this.config.sourceDir);
  }

  // @TODO check : http://stackoverflow.com/a/14387791 for error handling
  copyFile(source, target) {
    fs.createReadStream(source).pipe(fs.createWriteStream(target));
  }
}

module.exports = Minedit;

