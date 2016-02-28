import gulp from 'gulp';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';

gulp.task('js', () =>
  gulp.src('src/js/entry.js')
  .pipe(webpack({
    module: {
      loaders: [
        { test : /\.js$/, exclude: /node_modules/, loader: 'babel' }
      ]
    },
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('dist')));

gulp.task('html', () =>
  gulp.src('src/html/*.html')
  .pipe(gulp.dest('dist')));

gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);

gulp.task('dist', ['js', 'html']);

gulp.task('serve', ['dist'], () => {
  gulp.watch(['src/**/*.js', '!**/.*'], ['js-watch']);
  gulp.watch(['src/**/*.html', '!**/.*'], ['html-watch']);

  browserSync({
    server: { baseDir: 'dist' },
    notify: false
  });
});

gulp.task('default', ['serve']);
