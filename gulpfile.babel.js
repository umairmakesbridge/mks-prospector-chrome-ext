import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import rimraf from 'rimraf';

const plugins = loadPlugins();

import popupWebpackConfig from './popup/webpack.config';
import eventWebpackConfig from './event/webpack.config';
import contentWebpackConfig from './content/webpack.config';

gulp.task('popup-js', ['clean'], (cb) => {
  webpack(popupWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('event-js', ['clean'], (cb) => {
  webpack(eventWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});


gulp.task('copy-content-js', ['clean'], () => {
  return gulp.src('content.js')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-background-js', ['clean'], () => {
  return gulp.src('background.js')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-jquery-min-js', ['clean'], () => {
  return gulp.src('assets/jquery.min.js')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-highlight-min-js', ['clean'], () => {
  return gulp.src('assets/jquery.highlight.js')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-gmail-js', ['clean'], () => {
  return gulp.src('assets/gmail.js')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-makesbridge_plugin-css', ['clean'], () => {
  return gulp.src('assets/makesbridge_plugin.css')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-plugin_font_icon-css', ['clean'], () => {
  return gulp.src('assets/plugin_font_icon.css')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-animate-css', ['clean'], () => {
  return gulp.src('assets/animate.css')
    .pipe(gulp.dest('./build'));
});
gulp.task('copy-images', ['clean'], () => {
  return gulp.src('assets/img/*.*')
    .pipe(gulp.dest('./build/img'));
});
gulp.task('copy-font', ['clean'], () => {
  return gulp.src('assets/plugin_icon/*.*')
    .pipe(gulp.dest('./build/fonts/plugin_icon'));
});

gulp.task('main-js', ['clean'], (cb) => {
  webpack(contentWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('popup-html', ['clean'], () => {
  return gulp.src('popup/src/index.html')
    .pipe(plugins.rename('popup.html'))
    .pipe(gulp.dest('./build'))
});

gulp.task('copy-manifest', ['clean'], () => {
  return gulp.src('manifest.json')
    .pipe(gulp.dest('./build'));
});

gulp.task('clean', (cb) => {
  rimraf('./build', cb);
});

gulp.task('build', ['copy-manifest',
                    'popup-js',
                    'popup-html',
                    'event-js',
                    'copy-content-js',
                    'copy-background-js',
                    'main-js',
                    'copy-jquery-min-js',
                    'copy-gmail-js',
                    'copy-highlight-min-js',
                    'copy-makesbridge_plugin-css',
                    'copy-images',
                    'copy-plugin_font_icon-css',
                    'copy-font',
                    'copy-animate-css'
                  ]);

gulp.task('watch', ['default'], () => {
  gulp.watch('popup/**/*', ['build']);
  gulp.watch('content/**/*', ['build']);
  gulp.watch('event/**/*', ['build']);
});

gulp.task('default', ['build']);
