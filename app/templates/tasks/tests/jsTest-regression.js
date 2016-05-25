/* global module */
module.exports = function(gulp, $) {
  return function() {
    'use strict';

    var stream = gulp.src('./test/scripts/visualRegression/main.js')
    .pipe($.phantomcss({
      screenshots: './test/screenshots/pass',
      failures: './test/screenshots/failures',
      results: './test/screenshots/results',
      breakOnError: false
    }))
    .pipe($.notify({
      onLast: true,
      message: 'Done analyzing CSS for visual regression. Run gulp build for not found errors.'
    }));

    return stream;
  };
};

