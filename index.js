var path = require('path');
var fs = require('fs');
var recursive = require('recursive-readdir');
var watch = require('watch');
var marked = require('marked');
var mkdirp = require('mkdirp');
var config;
try {
  config = require('./config');
} catch (e) {
  config = {};
}

var sourceDir = config.sourceDir ||  path.join(__dirname, 'sources');
var targetDir = config.targetDir || path.join(__dirname, 'site');

compileAll();
watchFiles();

var mainTemplate = 'main.html';

function watchFiles() {
  watch.watchTree(__dirname, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
    } else if (prev === null) {
      saveFile(f, true);
    } else if (curr.nlink === 0) {
      console.log('file ' + f + ' removed');
    } else {
      saveFile(f);
    }
  });
}

function getTemplate() {
  return fs.readFileSync(path.join(__dirname, 'templates', mainTemplate), 'utf8');
}

function saveFile(file, newFile) {
  var message = newFile ? 'A new file has been added: ' + file : 'File: ' + file + ' has been updated';
  console.log(message);
  var ext = path.extname(file);
  if (ext === '.md' || ext === '.css') {
    var targetFile = ext === '.md' ? file.replace(/\.md$/, '.html') : file;
    var diff = path.relative(sourceDir, targetFile);
    var targetPath = path.join(targetDir, diff);
    var source = fs.readFileSync(file, 'utf8');
    var dirName = path.dirname(targetPath);
    mkdirp(dirName, function (err) {
      if (err) console.error(err)
      //else console.log('New site directory created!')
      writeCompiled(source, targetPath, ext);
    });
  }
  else if (path.basename(file) === mainTemplate) {
    console.log(file);
    compileAll();
  }
}

function writeCompiled(source, targetPath, ext) {
  var template = getTemplate();
  var compiled = ext === '.md' ? template.replace('@@content@@', marked(source)) : source;
  fs.writeFile(targetPath, compiled);
}

function compileAll() {
  recursive(sourceDir, [], function(err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function (f) {
      if (path.basename(f) !== mainTemplate)
        saveFile(f);
    });
  });
}
