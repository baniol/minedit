var path = require('path');
var fs = require('fs');
var recursive = require('recursive-readdir');
var watch = require('watch');
var marked = require('marked');
var mkdirp = require('mkdirp');

var template = fs.readFileSync(path.join(__dirname, 'sources/template'), 'utf8');

var sourceDir = path.join(__dirname, 'sources');
var targetDir = path.join(__dirname, 'site');

compileAll();
watchFiles();

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

function saveFile(file, newFile) {
  var message = newFile ? 'A new file has been added: ' + file : 'File: ' + file + ' has been updated';
  console.log(message);
  var ext = path.extname(file);
  if (ext === '.md') {
    var targetFile = file.replace(/\.md$/, '.html');
    var diff = path.relative(sourceDir, targetFile);
    var targetPath = path.join(targetDir, diff);
    var source = fs.readFileSync(file, 'utf8');
    var dirName = path.dirname(targetPath);
    mkdirp(dirName, function (err) {
      if (err) console.error(err)
      else console.log('New site directory created!')
      writeCompiled(source, targetPath);
    });
  }
}

function writeCompiled(source, targetPath) {
    var compiled = template.replace('@@content@@', marked(source));
    fs.writeFile(targetPath, compiled);
}

function compileAll() {
  recursive(sourceDir, [], (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach(function (f) {
      saveFile(f);
    });
  });
}
