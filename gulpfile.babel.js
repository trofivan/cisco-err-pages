import gulp from 'gulp';
import base64favicon from 'gulp-base64-favicon';
import concatCss from 'gulp-concat-css';
import uncss from 'gulp-uncss';
import cssmin from 'gulp-cssmin';
import stripCssComments from 'gulp-strip-css-comments';
import deleteLines from 'gulp-delete-lines';
import insertLines from 'gulp-insert-lines';
import inlineSource from 'gulp-inline-source';
import htmlmin from 'gulp-htmlmin';

gulp.task('build:css', () => {
  return gulp.src('src/css/*.css')
    .pipe(concatCss('style.min.css'))
    .pipe(uncss({
      html: ['src/index.html']
    }))
    .pipe(stripCssComments({
      preserve: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('.tmp/'))
});

gulp.task('build:html', () => {
  return gulp.src('./src/index.html')
    .pipe(base64favicon())
    .pipe(deleteLines({
      'filters': [
        /<link\s+rel=["']/i
      ]
    }))
    .pipe(insertLines({
      'before': /<\/head>$/,
      'lineBefore': '<link rel="stylesheet" type="text/css" href="./style.min.css" inline />'
    }))
    .pipe(gulp.dest('.tmp/'));
});

gulp.task('build', ['build:css', 'build:html'], () => {
  return gulp.src('.tmp/index.html')
    .pipe(inlineSource())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./build'));
});
