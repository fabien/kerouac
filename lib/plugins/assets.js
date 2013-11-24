/**
 * Module dependencies.
 */
var path = require('path')
  , diveSync = require('diveSync')
  , copy = require('../middleware/copy');


exports = module.exports = function(dir, filter) {
  dir = dir || 'assets';
  filter = filter || function(file) { return true; };
  
  return function assets(site, pages) {
    var adir = path.resolve(process.cwd(), dir)
      , rfile;
  
    diveSync(adir, function(err, file) {
      if (err) { throw err; }
    
      rfile = path.relative(adir, file);
      if (filter(rfile)) {
        site.page(rfile, copy(file));
      }
    });
  }
}
