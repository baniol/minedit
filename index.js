var watch = require('watch');

var config = require('./config');

var Minedit = require('./lib/minedit');
var minedit = new Minedit(config);

switch (process.argv[2]) {
  case "compile":
    return minedit.compile();
  case "sitemap":
    return minedit.generateSiteMap();
  default:
    return minedit.watch();
}

function getTree() {
  var walkDir = require('./lib/walkdir');
  walkDir.walkDir(path.join(__dirname, 'site'), function (err, tree) {
    var t = walkDir.getMap(tree);
    compileTree(t);
  });
}

function compileTree(sitemap) {
  writeCompiled(sitemap, path.join(targetDir, 'sitemap.html'), '.md');
}

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
  else if (path.basename(file) === config.mainTemplate) {
    console.log(file);
    compileAll();
  }
}


function compileAll() {
  recursive(sourceDir, [], function (err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function (f) {
      if (path.basename(f) !== config.mainTemplate)
        saveFile(f);
    });
  });
}
