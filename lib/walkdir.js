var fs = require('fs');
var path = require('path');

var root = '/Users/marcinbaniowski/Projects/minedit/site/';
/**
 * Goes through the root directory  
 * and returns json object with its structure. 
 *
 * @param {String} dir Path to the root directory.
 * @param {Function} done Callback
 */
var walkDir = function(dir, done) {
  var self = this;
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }
    var pending = list.length;
    if(!pending) {
      return done(null, results);
    }
    list.forEach(function(file) {
      var dfile = path.join(dir, file);
      var el = {};
      // @TODO - root?
      var fid = path.join(dir.replace(root, ''), file);
      el.filename = file;
      el.path = fid;
      fs.stat(dfile, function(err, stat) {
        if(err) {
          throw err;
        }
        if(stat.isDirectory()) {
          return walkDir(dfile, function(err, res) {
            el.children = res;
            results.push(el);
            !--pending && done(null, results);
          });
        }
        results.push(el);
        !--pending && done(null, results);
      });
    });
  });
};

var str = '';
var getMap = function (tree) {
  str += '<ul>';
  tree.forEach(function (el) {
    var fpath = el.path.replace(root, '');
    if (el.children) {
      str += '<li>'+el.filename+'</li>';
      getMap(el.children)
    }
    else str += '<li><a href="'+fpath+'">'+el.filename+'</a></li>';
  });
  str += '</ul>';
  return str;
};

exports.walkDir = walkDir;
exports.getMap = getMap;