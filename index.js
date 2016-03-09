"use strict";

const vm = require("vm");
const babel = require('babel-core');
const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const fs = require('fs');    
const React = require('react');
const ReactDOMServer = require('react-dom/server');

    
const PLUGIN_NAME = 'gulp-jsx-templates';

/* this sandbox is an execution context for the JSX templates transpiled by babel */
var sandbox = new vm.createContext({ React });
/* an execution context for shaerd components */
var Shared = new vm.createContext({ React });


/* convert JSX to JS Function */
function JSXtoJS( input ){
	var transpiled;
	if( typeof input == "string" ){
		transpiled = babel.transform( input, { plugins : ['babel-plugin-transform-react-jsx'] } );
	}
	return {
		code : transpiled.code,
		execute( context ){
			return (new vm.Script(transpiled.code)).runInContext( context );
		}
	};
}

// plugin level function (dealing with files)
function compileJSX( data, options ){

	options = options || {};
	/* the data object will be available to components (layouts and pages) */
	sandbox.data = data;

	/* execute shared components first to make them available in every page/layout template */
	if( options.components ){
		JSXtoJS( fs.readFileSync( options.components, 'utf-8' ) ).execute( Shared );
		sandbox.Shared = Shared;
	}
	/* a "master" layout template */
	if( options.layout ){
		JSXtoJS( fs.readFileSync( options.layout, 'utf-8' ) ).execute( sandbox );
	}
		  

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
      if (file.isNull()) {
		  this.push(file);
		  return cb();
	  }
      if (file.isStream()) {
		  this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		  return cb();
      }
      if (file.isBuffer()) {
		  try {

			  // get the file name without extension
			  var fileName = file.relative.replace(/\.[^\.]+$/,'');
			  var props = {};
			  var html = '';
			  // compile JSX to JS and execute it in the sandbox
			  JSXtoJS( file.contents.toString() ).execute( sandbox );

			  // get data for this page
			  // @TODO: make it configurable
			  if( data.pages && data.pages[ fileName ] ){
				  props = data.pages[ fileName ];
			  }
			  // @TODO: make the Page component configurable?
			  // @TODO: make doctype string configurable?
			  if( sandbox.Page ){
				  html = '<!doctype html>' + ReactDOMServer.renderToStaticMarkup( sandbox.Page( props )  );
			  }

			  file.contents = new Buffer( html );
		  } catch (err) {
			  this.emit('error', new gutil.PluginError(PLUGIN_NAME, ''+ err));
		  }
      }


    // make sure the file goes through the next gulp plugin
    this.push(file);

    // tell the stream engine that we are done with this file
    cb();
  });

  // returning the file stream
  return stream;

};

// exporting the plugin main function
module.exports = compileJSX;
