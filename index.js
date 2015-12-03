var path = require('path');
var fs = require('fs');
var watch = require('watch');
var marked = require('marked');

var template = fs.readFileSync(path.join(__dirname, 'template'), 'utf8');

watchFiles();

function watchFiles() {
  watch.watchTree(__dirname, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
      // Finished walking the tree
    } else if (prev === null) {
      // f is a new file
      saveFile(f);
    } else if (curr.nlink === 0) {
      // f was removed
      console.log('file removed');
      //removeTemplate(f);
    } else {
      // f was changed
      saveFile(f);
    }
  });
}

function saveFile(file) {
  var ext = path.extname(file);
  if (ext === '.md') {
    var targetPath = file.replace(/\.md$/, '.html');
    var source = fs.readFileSync(file, 'utf8');
    var compiled = template.replace('@@content@@', marked(source));
    fs.writeFile(targetPath, compiled);
  }
}