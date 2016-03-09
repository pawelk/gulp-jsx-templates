Use the power of React's JSX to generate static pages
-------

Install
--------

Once the project is stable enough it'll be published on NPM. For now you need to clone the repo.


Setting up the layout, components and page templates:
-----

**layouts/default.jsx**

	var Layout = props => <html>
		<head>
			<title>{ props.title ? props.title : 'Hello' }</title>
		</head>
		<body>
			<Shared.Nav pages={ data.pages } active={ props.active } />
			{ props.children }
		</body>
	</html>;


**pages/index.jsx**

    var Page = (props) => (
		<Layout active="index" title={ props.title }>
			<div>
				<h1>{ props.title }</h1>
				<Shared.ChildComponent>Shared component</Shared.ChildComponent>
			</div>
		</Layout>
	);


**components/shared.jsx**

	var ChildComponent = props => <span>Shared child component { props.children }</span>;

	var Nav = props => {
		var pages = Object.keys( props.pages );
		return (<nav>
			<ul>
			{ pages.map( page => <li key={ page }>
				<a href={ `${page}.html` } className={ props.active == page ? "active" : ""}>{ props.pages[ page ].title }</a>
			</li> )}
			</ul>
		</nav>);
	};
		
**data.json**

     { 
		"pages" : {
			"index" : {
				"title" : "Index page"
			},
			"about" : {
				"title" : "About page"
			}
		}
    }


Compiling using gulp
--------------------

**gulpfile.js**

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


The result
----------

**index.html**

    <!doctype html>
    <html>
      <head>
        <title>
          Index page
        </title>
      </head>
      <body>
        <nav>
          <ul>
            <li>
              <a href="index.html" class="active">
                Index page
              </a>
            </li>
            <li>
              <a href="about.html" class="">
                About page
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <h1>
            Index page
          </h1>
          <span>
            Shared child component Test
          </span>
        </div>
      </body>
    </html>
