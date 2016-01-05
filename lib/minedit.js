var path = require('path');
var fs = require('fs');
var recursive = require('recursive-readdir');
var marked = require('marked');
var mkdirp = require('mkdirp');

module.exports = Minedit;

function Minedit(config) {
  if (!config) throw Error('No confguration file provided!');
  this.config = config;
}

Minedit.prototype.compile = function () {
  var self = this;
  recursive(this.config.sourceDir, [], function (err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function (f) {
      if (path.basename(f) !== self.config.mainTemplate)
        self.saveFile(f);
    });
  });
};

Minedit.prototype.saveFile = function (file, newFileFlag) {
  var self = this;
  var message = newFileFlag ? 'A new file has been added: ' + file : 'File: ' + file + ' has been updated';
  console.log(message);
  var ext = path.extname(file);
  if (ext === '.md' || ext === '.css') {
    var targetFile = ext === '.md' ? file.replace(/\.md$/, '.html') : file;
    var diff = path.relative(this.config.sourceDir, targetFile);
    var targetPath = path.join(this.config.targetDir, diff);
    var source = fs.readFileSync(file, 'utf8');
    var dirName = path.dirname(targetPath);
    mkdirp(dirName, function (err) {
      if (err) console.error(err);
      self.writeCompiled(source, targetPath, ext);
    });
  }
  else if (path.basename(file) === this.config.mainTemplate) {
    this.compile();
  }
};

Minedit.prototype.writeCompiled = function (source, targetPath, ext) {
  var template = this.getTemplate();
  var compiled = ext === '.md' ? template.replace('@@content@@', marked(source)) : source;
  fs.writeFile(targetPath, compiled);
}

Minedit.prototype.getTemplate = function () {
  return fs.readFileSync(path.join(__dirname, '..', 'templates', this.config.mainTemplate), 'utf8');
}
