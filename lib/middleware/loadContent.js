var fs = require('fs')
  , utils = require('../utils')
  , extname = require('path').extname

module.exports = function(path) {
  
  return function loadContent(page, next) {
    var site = page.site
      , ext = extname(path);
    
    fs.readFile(path, 'utf8', function(err, str) {
      if (err) { return next(err); }
      
      var data = str
        , fm ='';
      
      // check for front matter
      if ('---' === str.slice(0, 3)) {
        var eol = '\n';
        if ('---\r\n' === str.slice(0, 5)) {
          eol = '\r\n'; // Windows
          str = str.substr(5);
        } else {
          eol = '\n'; // UNIX
          str = str.substr(4);
        }
        
        var i = str.indexOf(eol)
          , line;
        while (-1 != i) {
          line = str.slice(0, i + eol.length);
          str = str.substr(i + eol.length);
          
          if ('---' === line.slice(0, 3)) {
            break;
          } else {
            fm += line;
          }
          
          i = str.indexOf(eol);
        }
        data = str;
        
        var obj = site.fm(fm);
        if (obj) utils.merge(page.locals, obj);
        if (obj.layout) { page.layout = obj.layout; }
      }
      
      var opts = { engine: ext };
      utils.merge(opts, site.locals);
      utils.merge(opts, page.locals);

      site.render(data, opts, function(err, out) {
        page.locals.content = out;
        next();
      }, false);
    });
  }
}
