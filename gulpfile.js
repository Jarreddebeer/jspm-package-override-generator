var gulp = require('gulp')
  , connect = require('connect')
  , watch = require('gulp-watch')
  , serveStatic = require('serve-static')
  , livereload = require('gulp-livereload');

gulp.task('server', function(next) {
    var server = connect();
    server.use(serveStatic('public')).listen(7007, next);
});

gulp.task('watch', ['server'], function() {
    var server = livereload();
    gulp.watch('public/**').on('change', function(file) {
        server.changed(file.path);
    });
});

gulp.task('default', ['server', 'watch']);
