var gulp = require('gulp');
var jsx = require('../index.js');
var rename = require('gulp-rename');
var fs = require('fs');

gulp.task('jsx', function() {

    var templatedata = JSON.parse(fs.readFileSync('./src/data.json'));

	var jsxoptions = {
		layout : './src/layouts/default.jsx',
		components : './src/components/shared.jsx'
	};
	
    gulp.src('./src/pages/*.jsx')
		.pipe( jsx( templatedata, jsxoptions ))
		.pipe( rename( function(path){
			path.extname = '.html';
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['jsx']);
