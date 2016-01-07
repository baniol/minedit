var config = require('./config');

var Minedit = require('./lib/minedit');
var minedit = new Minedit(config);

switch (process.argv[2]) {
  case 'sitemap':
    // @TODO to be implemented
    return minedit.generateSiteMap();
  case 'copy':
    return minedit.copyAssets();
  case 'clear':
    return minedit.clear();
  case 'config':
    return minedit.displayConfig();
  case 'sources':
    console.log('Source files path: ' + minedit.displaySourcePath());
    break;
  default:
    return minedit.compile();
}

//function getTree() {
//  var walkDir = require('./lib/walkdir');
//  walkDir.walkDir(path.join(__dirname, 'site'), function (err, tree) {
//    var t = walkDir.getMap(tree);
//    compileTree(t);
//  });
//}
//function compileTree(sitemap) {
//  writeCompiled(sitemap, path.join(targetDir, 'sitemap.html'), '.md');
//}
