/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.slice(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );
;/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );
;/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {

'use strict';

var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );
;/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {

'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  var getComputedStyle = window.getComputedStyle;
  getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
      function( elem ) {
        return getComputedStyle( elem, null );
      } :
      function( elem ) {
        return elem.currentStyle;
      };

      return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
          logError( 'Style returned ' + style +
            '. Are you running this code in a hidden iframe on Firefox? ' +
            'See http://bit.ly/getsizebug1' );
        }
        return style;
      };
  })();

  // -------------------------- box sizing -------------------------- //

  boxSizingProp = getStyleProperty('boxSizing');

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox measures the inner-width
   */
  if ( boxSizingProp ) {
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style[ boxSizingProp ] = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );

    isBoxSizeOuter = getStyleSize( style.width ) === 200;
    body.removeChild( div );
  }

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( [ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );
;/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );
;/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {

'use strict';

var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );
;/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));
;/**
 * matchesSelector v1.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {

  'use strict';

  var matchesMethod = ( function() {
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( function() {
      return matchesSelector;
    });
  } else if ( typeof exports === 'object' ) {
    module.exports = matchesSelector;
  }
  else {
    // browser global
    window.matchesSelector = matchesSelector;
  }

})( Element.prototype );
;/**
 * Outlayer Item
 */

( function( window ) {

'use strict';

// ----- get style ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDash( str ) {
  return str.replace( /([A-Z])/g, function( $1 ){
    return '-' + $1.toLowerCase();
  });
}

// -------------------------- Outlayer definition -------------------------- //

function outlayerItemDefinition( EventEmitter, getSize, getStyleProperty ) {

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
  'transform',
  'transition',
  'transitionDuration',
  'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
  var cache = {};
  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
    var prop = prefixableProperties[i];
    var supportedProp = getStyleProperty( prop );
    if ( supportedProp && supportedProp !== prop ) {
      cache[ prop ] = supportedProp;
    }
  }
  return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EventEmitter
extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );
  var layoutOptions = this.layout.options;
  var isOriginLeft = layoutOptions.isOriginLeft;
  var isOriginTop = layoutOptions.isOriginTop;
  var x = parseInt( style[ isOriginLeft ? 'left' : 'right' ], 10 );
  var y = parseInt( style[ isOriginTop ? 'top' : 'bottom' ], 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  var layoutSize = this.layout.size;
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var layoutOptions = this.layout.options;
  var style = {};

  if ( layoutOptions.isOriginLeft ) {
    style.left = ( this.position.x + layoutSize.paddingLeft ) + 'px';
    // reset other property
    style.right = '';
  } else {
    style.right = ( this.position.x + layoutSize.paddingRight ) + 'px';
    style.left = '';
  }

  if ( layoutOptions.isOriginTop ) {
    style.top = ( this.position.y + layoutSize.paddingTop ) + 'px';
    style.bottom = '';
  } else {
    style.bottom = ( this.position.y + layoutSize.paddingBottom ) + 'px';
    style.top = '';
  }

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};


// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate(' + x + 'px, ' + y + 'px)';
  };


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  // flip cooridinates if origin on right or bottom
  var layoutOptions = this.layout.options;
  transX = layoutOptions.isOriginLeft ? transX : -transX;
  transY = layoutOptions.isOriginTop ? transY : -transY;
  transitionStyle.transform = translate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

var itemTransitionProperties = transformProperty && ( toDash( transformProperty ) +
  ',opacity' );

Item.prototype.enableTransition = function(/* style */) {
  // only enable if not already transitioning
  // bug in IE10 were re-setting transition style will prevent
  // transitionend event from triggering
  if ( this.isTransitioning ) {
    return;
  }

  // make transition: foo, bar, baz from style object
  // TODO uncomment this bit when IE10 bug is resolved
  // var transitionValue = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   transitionValue.push( toDash( prop ) );
  // }
  // enable transition styles
  // HACK always enable transform,opacity for IE10
  this.css({
    transitionProperty: itemTransitionProperties,
    transitionDuration: this.layout.options.transitionDuration
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform',
  '-moz-transform': 'transform',
  '-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  var _this = this;
  this.on( 'transitionEnd', function() {
    _this.removeElem();
    return true; // bind once
  });
  this.hide();
};

Item.prototype.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true
  });
};

Item.prototype.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: {
      opacity: function() {
        // check if still hidden
        // during transition, item may have been un-hidden
        if ( this.isHidden ) {
          this.css({ display: 'none' });
        }
      }
    }
  });
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'get-style-property/get-style-property'
    ],
    outlayerItemDefinition );
} else if (typeof exports === 'object') {
  // CommonJS
  module.exports = outlayerItemDefinition(
    require('wolfy87-eventemitter'),
    require('get-size'),
    require('desandro-get-style-property')
  );
} else {
  // browser global
  window.Outlayer = {};
  window.Outlayer.Item = outlayerItemDefinition(
    window.EventEmitter,
    window.getSize,
    window.getStyleProperty
  );
}

})( window );
;/*!
 * Outlayer v1.3.0
 * the brains and guts of a layout library
 * MIT license
 */

( function( window ) {

'use strict';

// ----- vars ----- //

var document = window.document;
var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}


var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

// http://stackoverflow.com/a/384380/182183
var isElement = ( typeof HTMLElement === 'function' || typeof HTMLElement === 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj === 'object' &&
      obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };

// index of helper cause IE8
var indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

function removeFrom( obj, ary ) {
  var index = indexOf( ary, obj );
  if ( index !== -1 ) {
    ary.splice( index, 1 );
  }
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDashed( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
}


function outlayerDefinition( eventie, docReady, EventEmitter, getSize, matchesSelector, Item ) {

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  // use element as selector string
  if ( typeof element === 'string' ) {
    element = document.querySelector( element );
  }

  // bail out if not proper element
  if ( !element || !isElement( element ) ) {
    if ( console ) {
      console.error( 'Bad ' + this.constructor.namespace + ' element: ' + element );
    }
    return;
  }

  this.element = element;

  // options
  this.options = extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isOriginLeft: true,
  isOriginTop: true,
  isResizeBound: true,
  isResizingContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

// inherit EventEmitter
extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
  extend( this.options, opts );
};

Outlayer.prototype._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  extend( this.element.style, this.options.containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
  // make array of elems
  elems = makeArray( elems );
  var itemSelector = this.options.itemSelector;
  var itemElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have an item selector
    if ( itemSelector ) {
      // filter siblings
      if ( matchesSelector( elem, itemSelector ) ) {
        itemElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( itemSelector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        itemElems.push( childElems[j] );
      }
    } else {
      itemElems.push( elem );
    }
  }

  return itemElems;
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
  this.getSize();
};


Outlayer.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
  var _this = this;
  function onItemsLayout() {
    _this.emitEvent( 'layoutComplete', [ _this, items ] );
  }

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    onItemsLayout();
    return;
  }

  // emit layoutComplete when done
  this._itemsOn( items, 'layout', onItemsLayout );

  var queue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var obj = queue[i];
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
  this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
  if ( !this.options.isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * trigger a callback for a collection of items events
 * @param {Array} items - Outlayer.Items
 * @param {String} eventName
 * @param {Function} callback
 */
Outlayer.prototype._itemsOn = function( items, eventName, callback ) {
  var doneCount = 0;
  var count = items.length;
  // event callback
  var _this = this;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      callback.call( _this );
    }
    return true; // bind once
  }
  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.on( eventName, tick );
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    removeFrom( elem, this.stamps );
    this.unignore( elem );
  }

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = makeArray( elems );
  return elems;
};

Outlayer.prototype._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
    var stamp = this.stamps[i];
    this._manageStamp( stamp );
  }
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
  if ( this.isResizeBound ) {
    eventie.unbind( window, 'resize', this );
  }
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
    delete _this.resizeTimeout;
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.hide();
  }
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
  if ( !elems || !elems.length ) {
    return;
  }
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
  elems = makeArray( elems );

  var removeItems = this.getItems( elems );
  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  this._itemsOn( removeItems, 'remove', function() {
    this.emitEvent( 'removeComplete', [ this, removeItems ] );
  });

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    removeFrom( item, this.items );
  }
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  function Layout() {
    Outlayer.apply( this, arguments );
  }
  // inherit Outlayer prototype, use Object.create if there
  if ( Object.create ) {
    Layout.prototype = Object.create( Outlayer.prototype );
  } else {
    extend( Layout.prototype, Outlayer.prototype );
  }
  // set contructor, used for namespace and Item
  Layout.prototype.constructor = Layout;

  Layout.defaults = extend( {}, Outlayer.defaults );
  // apply new options
  extend( Layout.defaults, options );
  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
  Layout.prototype.settings = {};

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = function LayoutItem() {
    Item.apply( this, arguments );
  };

  Layout.Item.prototype = new Item();

  // -------------------------- declarative -------------------------- //

  /**
   * allow user to initialize Outlayer via .js-namespace class
   * options are parsed from data-namespace-option attribute
   */
  docReady( function() {
    var dashedNamespace = toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new Layout( elem, options );
      // make available via $().data('layoutname')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'eventie/eventie',
      'doc-ready/doc-ready',
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'matches-selector/matches-selector',
      './item'
    ],
    outlayerDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = outlayerDefinition(
    require('eventie'),
    require('doc-ready'),
    require('wolfy87-eventemitter'),
    require('get-size'),
    require('desandro-matches-selector'),
    require('./item')
  );
} else {
  // browser global
  window.Outlayer = outlayerDefinition(
    window.eventie,
    window.docReady,
    window.EventEmitter,
    window.getSize,
    window.matchesSelector,
    window.Outlayer.Item
  );
}

})( window );
;/**
 * Rect
 * low-level utility class for basic geometry
 */

( function( window ) {

"use strict";

// -------------------------- Packery -------------------------- //

// global namespace
var Packery = window.Packery = function() {};

function rectDefinition() {

// -------------------------- Rect -------------------------- //

function Rect( props ) {
  // extend properties from defaults
  for ( var prop in Rect.defaults ) {
    this[ prop ] = Rect.defaults[ prop ];
  }

  for ( prop in props ) {
    this[ prop ] = props[ prop ];
  }

}

// make available
Packery.Rect = Rect;

Rect.defaults = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

/**
 * Determines whether or not this rectangle wholly encloses another rectangle or point.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.contains = function( rect ) {
  // points don't have width or height
  var otherWidth = rect.width || 0;
  var otherHeight = rect.height || 0;
  return this.x <= rect.x &&
    this.y <= rect.y &&
    this.x + this.width >= rect.x + otherWidth &&
    this.y + this.height >= rect.y + otherHeight;
};

/**
 * Determines whether or not the rectangle intersects with another.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.overlaps = function( rect ) {
  var thisRight = this.x + this.width;
  var thisBottom = this.y + this.height;
  var rectRight = rect.x + rect.width;
  var rectBottom = rect.y + rect.height;

  // http://stackoverflow.com/a/306332
  return this.x < rectRight &&
    thisRight > rect.x &&
    this.y < rectBottom &&
    thisBottom > rect.y;
};

/**
 * @param {Rect} rect - the overlapping rect
 * @returns {Array} freeRects - rects representing the area around the rect
**/
Rect.prototype.getMaximalFreeRects = function( rect ) {

  // if no intersection, return false
  if ( !this.overlaps( rect ) ) {
    return false;
  }

  var freeRects = [];
  var freeRect;

  var thisRight = this.x + this.width;
  var thisBottom = this.y + this.height;
  var rectRight = rect.x + rect.width;
  var rectBottom = rect.y + rect.height;

  // top
  if ( this.y < rect.y ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: rect.y - this.y
    });
    freeRects.push( freeRect );
  }

  // right
  if ( thisRight > rectRight ) {
    freeRect = new Rect({
      x: rectRight,
      y: this.y,
      width: thisRight - rectRight,
      height: this.height
    });
    freeRects.push( freeRect );
  }

  // bottom
  if ( thisBottom > rectBottom ) {
    freeRect = new Rect({
      x: this.x,
      y: rectBottom,
      width: this.width,
      height: thisBottom - rectBottom
    });
    freeRects.push( freeRect );
  }

  // left
  if ( this.x < rect.x ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: rect.x - this.x,
      height: this.height
    });
    freeRects.push( freeRect );
  }

  return freeRects;
};

Rect.prototype.canFit = function( rect ) {
  return this.width >= rect.width && this.height >= rect.height;
};

return Rect;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( rectDefinition );
} else {
  // browser global
  window.Packery = window.Packery || {};
  window.Packery.Rect = rectDefinition();
}

})( window );
;/**
 * Packer
 * bin-packing algorithm
 */

( function( window ) {

'use strict';

// -------------------------- Packer -------------------------- //

function packerDefinition( Rect ) {

/**
 * @param {Number} width
 * @param {Number} height
 * @param {String} sortDirection
 *   topLeft for vertical, leftTop for horizontal
 */
function Packer( width, height, sortDirection ) {
  this.width = width || 0;
  this.height = height || 0;
  this.sortDirection = sortDirection || 'downwardLeftToRight';

  this.reset();
}

Packer.prototype.reset = function() {
  this.spaces = [];
  this.newSpaces = [];

  var initialSpace = new Rect({
    x: 0,
    y: 0,
    width: this.width,
    height: this.height
  });

  this.spaces.push( initialSpace );
  // set sorter
  this.sorter = sorters[ this.sortDirection ] || sorters.downwardLeftToRight;
};

// change x and y of rect to fit with in Packer's available spaces
Packer.prototype.pack = function( rect ) {
  for ( var i=0, len = this.spaces.length; i < len; i++ ) {
    var space = this.spaces[i];
    if ( space.canFit( rect ) ) {
      this.placeInSpace( rect, space );
      break;
    }
  }
};

Packer.prototype.placeInSpace = function( rect, space ) {
  // place rect in space
  rect.x = space.x;
  rect.y = space.y;

  this.placed( rect );
};

// update spaces with placed rect
Packer.prototype.placed = function( rect ) {
  // update spaces
  var revisedSpaces = [];
  for ( var i=0, len = this.spaces.length; i < len; i++ ) {
    var space = this.spaces[i];
    var newSpaces = space.getMaximalFreeRects( rect );
    // add either the original space or the new spaces to the revised spaces
    if ( newSpaces ) {
      revisedSpaces.push.apply( revisedSpaces, newSpaces );
    } else {
      revisedSpaces.push( space );
    }
  }

  this.spaces = revisedSpaces;

  // remove redundant spaces
  Packer.mergeRects( this.spaces );

  this.spaces.sort( this.sorter );
};

// -------------------------- utility functions -------------------------- //

/**
 * Remove redundant rectangle from array of rectangles
 * @param {Array} rects: an array of Rects
 * @returns {Array} rects: an array of Rects
**/
Packer.mergeRects = function( rects ) {
  for ( var i=0, len = rects.length; i < len; i++ ) {
    var rect = rects[i];
    // skip over this rect if it was already removed
    if ( !rect ) {
      continue;
    }
    // clone rects we're testing, remove this rect
    var compareRects = rects.slice(0);
    // do not compare with self
    compareRects.splice( i, 1 );
    // compare this rect with others
    var removedCount = 0;
    for ( var j=0, jLen = compareRects.length; j < jLen; j++ ) {
      var compareRect = compareRects[j];
      // if this rect contains another,
      // remove that rect from test collection
      var indexAdjust = i > j ? 0 : 1;
      if ( rect.contains( compareRect ) ) {
        // console.log( 'current test rects:' + testRects.length, testRects );
        // console.log( i, j, indexAdjust, rect, compareRect );
        rects.splice( j + indexAdjust - removedCount, 1 );
        removedCount++;
      }
    }
  }

  return rects;
};


// -------------------------- sorters -------------------------- //

// functions for sorting rects in order
var sorters = {
  // top down, then left to right
  downwardLeftToRight: function( a, b ) {
    return a.y - b.y || a.x - b.x;
  },
  // left to right, then top down
  rightwardTopToBottom: function( a, b ) {
    return a.x - b.x || a.y - b.y;
  }
};


// --------------------------  -------------------------- //

return Packer;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [ './rect' ], packerDefinition );
} else {
  // browser global
  var Packery = window.Packery = window.Packery || {};
  Packery.Packer = packerDefinition( Packery.Rect );
}

})( window );
;/**
 * Packery Item Element
**/

( function( window ) {

'use strict';

// -------------------------- Item -------------------------- //

function itemDefinition( getStyleProperty, Outlayer, Rect ) {

var transformProperty = getStyleProperty('transform');

// sub-class Item
var Item = function PackeryItem() {
  Outlayer.Item.apply( this, arguments );
};

Item.prototype = new Outlayer.Item();

var protoCreate = Item.prototype._create;
Item.prototype._create = function() {
  // call default _create logic
  protoCreate.call( this );
  this.rect = new Rect();
  // rect used for placing, in drag or Packery.fit()
  this.placeRect = new Rect();
};

// -------------------------- drag -------------------------- //

Item.prototype.dragStart = function() {
  this.getPosition();
  this.removeTransitionStyles();
  // remove transform property from transition
  if ( this.isTransitioning && transformProperty ) {
    this.element.style[ transformProperty ] = 'none';
  }
  this.getSize();
  // create place rect, used for position when dragged then dropped
  // or when positioning
  this.isPlacing = true;
  this.needsPositioning = false;
  this.positionPlaceRect( this.position.x, this.position.y );
  this.isTransitioning = false;
  this.didDrag = false;
};

/**
 * handle item when it is dragged
 * @param {Number} x - horizontal position of dragged item
 * @param {Number} y - vertical position of dragged item
 */
Item.prototype.dragMove = function( x, y ) {
  this.didDrag = true;
  var packerySize = this.layout.size;
  x -= packerySize.paddingLeft;
  y -= packerySize.paddingTop;
  this.positionPlaceRect( x, y );
};

Item.prototype.dragStop = function() {
  this.getPosition();
  var isDiffX = this.position.x !== this.placeRect.x;
  var isDiffY = this.position.y !== this.placeRect.y;
  // set post-drag positioning flag
  this.needsPositioning = isDiffX || isDiffY;
  // reset flag
  this.didDrag = false;
};

// -------------------------- placing -------------------------- //

/**
 * position a rect that will occupy space in the packer
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} isMaxYContained
 */
Item.prototype.positionPlaceRect = function( x, y, isMaxYOpen ) {
  this.placeRect.x = this.getPlaceRectCoord( x, true );
  this.placeRect.y = this.getPlaceRectCoord( y, false, isMaxYOpen );
};

/**
 * get x/y coordinate for place rect
 * @param {Number} coord - x or y
 * @param {Boolean} isX
 * @param {Boolean} isMaxOpen - does not limit value to outer bound
 * @returns {Number} coord - processed x or y
 */
Item.prototype.getPlaceRectCoord = function( coord, isX, isMaxOpen ) {
  var measure = isX ? 'Width' : 'Height';
  var size = this.size[ 'outer' + measure ];
  var segment = this.layout[ isX ? 'columnWidth' : 'rowHeight' ];
  var parentSize = this.layout.size[ 'inner' + measure ];

  // additional parentSize calculations for Y
  if ( !isX ) {
    parentSize = Math.max( parentSize, this.layout.maxY );
    // prevent gutter from bumping up height when non-vertical grid
    if ( !this.layout.rowHeight ) {
      parentSize -= this.layout.gutter;
    }
  }

  var max;

  if ( segment ) {
    segment += this.layout.gutter;
    // allow for last column to reach the edge
    parentSize += isX ? this.layout.gutter : 0;
    // snap to closest segment
    coord = Math.round( coord / segment );
    // contain to outer bound
    // contain non-growing bound, allow growing bound to grow
    var mathMethod;
    if ( this.layout.options.isHorizontal ) {
      mathMethod = !isX ? 'floor' : 'ceil';
    } else {
      mathMethod = isX ? 'floor' : 'ceil';
    }
    var maxSegments = Math[ mathMethod ]( parentSize / segment );
    maxSegments -= Math.ceil( size / segment );
    max = maxSegments;
  } else {
    max = parentSize - size;
  }

  coord = isMaxOpen ? coord : Math.min( coord, max );
  coord *= segment || 1;

  return Math.max( 0, coord );
};

Item.prototype.copyPlaceRectPosition = function() {
  this.rect.x = this.placeRect.x;
  this.rect.y = this.placeRect.y;
};

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'get-style-property/get-style-property',
      'outlayer/outlayer',
      './rect'
    ],
    itemDefinition );
} else {
  // browser global
  window.Packery.Item = itemDefinition(
    window.getStyleProperty,
    window.Outlayer,
    window.Packery.Rect
  );
}

})( window );
;/*!
 * Packery v1.2.4
 * bin-packing layout library
 * http://packery.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://packery.metafizzy.co/license.html
 *
 * Non-commercial use is licensed under the GPL v3 License
 *
 * Copyright 2014 Metafizzy
 */

( function( window ) {

'use strict';

// -------------------------- Packery -------------------------- //

// used for AMD definition and requires
function packeryDefinition( classie, getSize, Outlayer, Rect, Packer, Item ) {

// create an Outlayer layout class
var Packery = Outlayer.create('packery');
Packery.Item = Item;

Packery.prototype._create = function() {
  // call super
  Outlayer.prototype._create.call( this );

  // initial properties
  this.packer = new Packer();

  // Left over from v1.0
  this.stamp( this.options.stamped );

  // create drag handlers
  var _this = this;
  this.handleDraggabilly = {
    dragStart: function( draggie ) {
      _this.itemDragStart( draggie.element );
    },
    dragMove: function( draggie ) {
      _this.itemDragMove( draggie.element, draggie.position.x, draggie.position.y );
    },
    dragEnd: function( draggie ) {
      _this.itemDragEnd( draggie.element );
    }
  };

  this.handleUIDraggable = {
    start: function handleUIDraggableStart( event ) {
      _this.itemDragStart( event.currentTarget );
    },
    drag: function handleUIDraggableDrag( event, ui ) {
      _this.itemDragMove( event.currentTarget, ui.position.left, ui.position.top );
    },
    stop: function handleUIDraggableStop( event ) {
      _this.itemDragEnd( event.currentTarget );
    }
  };

};


// ----- init & layout ----- //

/**
 * logic before any new layout
 */
Packery.prototype._resetLayout = function() {
  this.getSize();

  this._getMeasurements();

  // reset packer
  var packer = this.packer;
  // packer settings, if horizontal or vertical
  if ( this.options.isHorizontal ) {
    packer.width = Number.POSITIVE_INFINITY;
    packer.height = this.size.innerHeight + this.gutter;
    packer.sortDirection = 'rightwardTopToBottom';
  } else {
    packer.width = this.size.innerWidth + this.gutter;
    packer.height = Number.POSITIVE_INFINITY;
    packer.sortDirection = 'downwardLeftToRight';
  }

  packer.reset();

  // layout
  this.maxY = 0;
  this.maxX = 0;
};

/**
 * update columnWidth, rowHeight, & gutter
 * @private
 */
Packery.prototype._getMeasurements = function() {
  this._getMeasurement( 'columnWidth', 'width' );
  this._getMeasurement( 'rowHeight', 'height' );
  this._getMeasurement( 'gutter', 'width' );
};

Packery.prototype._getItemLayoutPosition = function( item ) {
  this._packItem( item );
  return item.rect;
};


/**
 * layout item in packer
 * @param {Packery.Item} item
 */
Packery.prototype._packItem = function( item ) {
  this._setRectSize( item.element, item.rect );
  // pack the rect in the packer
  this.packer.pack( item.rect );
  this._setMaxXY( item.rect );
};

/**
 * set max X and Y value, for size of container
 * @param {Packery.Rect} rect
 * @private
 */
Packery.prototype._setMaxXY = function( rect ) {
  this.maxX = Math.max( rect.x + rect.width, this.maxX );
  this.maxY = Math.max( rect.y + rect.height, this.maxY );
};

/**
 * set the width and height of a rect, applying columnWidth and rowHeight
 * @param {Element} elem
 * @param {Packery.Rect} rect
 */
Packery.prototype._setRectSize = function( elem, rect ) {
  var size = getSize( elem );
  var w = size.outerWidth;
  var h = size.outerHeight;
  // size for columnWidth and rowHeight, if available
  // only check if size is non-zero, #177
  if ( w || h ) {
    var colW = this.columnWidth + this.gutter;
    var rowH = this.rowHeight + this.gutter;
    w = this.columnWidth ? Math.ceil( w / colW ) * colW : w + this.gutter;
    h = this.rowHeight ? Math.ceil( h / rowH ) * rowH : h + this.gutter;
  }
  // rect must fit in packer
  rect.width = Math.min( w, this.packer.width );
  rect.height = Math.min( h, this.packer.height );
};

Packery.prototype._getContainerSize = function() {
  if ( this.options.isHorizontal ) {
    return {
      width: this.maxX - this.gutter
    };
  } else {
    return {
      height: this.maxY - this.gutter
    };
  }
};


// -------------------------- stamp -------------------------- //

/**
 * makes space for element
 * @param {Element} elem
 */
Packery.prototype._manageStamp = function( elem ) {

  var item = this.getItem( elem );
  var rect;
  if ( item && item.isPlacing ) {
    rect = item.placeRect;
  } else {
    var offset = this._getElementOffset( elem );
    rect = new Rect({
      x: this.options.isOriginLeft ? offset.left : offset.right,
      y: this.options.isOriginTop ? offset.top : offset.bottom
    });
  }

  this._setRectSize( elem, rect );
  // save its space in the packer
  this.packer.placed( rect );
  this._setMaxXY( rect );
};

// -------------------------- methods -------------------------- //

function verticalSorter( a, b ) {
  return a.position.y - b.position.y || a.position.x - b.position.x;
}

function horizontalSorter( a, b ) {
  return a.position.x - b.position.x || a.position.y - b.position.y;
}

Packery.prototype.sortItemsByPosition = function() {
  var sorter = this.options.isHorizontal ? horizontalSorter : verticalSorter;
  this.items.sort( sorter );
};

/**
 * Fit item element in its current position
 * Packery will position elements around it
 * useful for expanding elements
 *
 * @param {Element} elem
 * @param {Number} x - horizontal destination position, optional
 * @param {Number} y - vertical destination position, optional
 */
Packery.prototype.fit = function( elem, x, y ) {
  var item = this.getItem( elem );
  if ( !item ) {
    return;
  }

  // prepare internal properties
  this._getMeasurements();

  // stamp item to get it out of layout
  this.stamp( item.element );
  // required for positionPlaceRect
  item.getSize();
  // set placing flag
  item.isPlacing = true;
  // fall back to current position for fitting
  x = x === undefined ? item.rect.x: x;
  y = y === undefined ? item.rect.y: y;

  // position it best at its destination
  item.positionPlaceRect( x, y, true );

  this._bindFitEvents( item );
  item.moveTo( item.placeRect.x, item.placeRect.y );
  // layout everything else
  this.layout();

  // return back to regularly scheduled programming
  this.unstamp( item.element );
  this.sortItemsByPosition();
  // un set placing flag, back to normal
  item.isPlacing = false;
  // copy place rect position
  item.copyPlaceRectPosition();
};

/**
 * emit event when item is fit and other items are laid out
 * @param {Packery.Item} item
 * @private
 */
Packery.prototype._bindFitEvents = function( item ) {
  var _this = this;
  var ticks = 0;
  function tick() {
    ticks++;
    if ( ticks !== 2 ) {
      return;
    }
    _this.emitEvent( 'fitComplete', [ _this, item ] );
  }
  // when item is laid out
  item.on( 'layout', function() {
    tick();
    return true;
  });
  // when all items are laid out
  this.on( 'layoutComplete', function() {
    tick();
    return true;
  });
};

// -------------------------- resize -------------------------- //

// debounced, layout on resize
Packery.prototype.resize = function() {
  // don't trigger if size did not change
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  var innerSize = this.options.isHorizontal ? 'innerHeight' : 'innerWidth';
  if ( hasSizes && size[ innerSize ] === this.size[ innerSize ] ) {
    return;
  }

  this.layout();
};

// -------------------------- drag -------------------------- //

/**
 * handle an item drag start event
 * @param {Element} elem
 */
Packery.prototype.itemDragStart = function( elem ) {
  this.stamp( elem );
  var item = this.getItem( elem );
  if ( item ) {
    item.dragStart();
  }
};

/**
 * handle an item drag move event
 * @param {Element} elem
 * @param {Number} x - horizontal change in position
 * @param {Number} y - vertical change in position
 */
Packery.prototype.itemDragMove = function( elem, x, y ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.dragMove( x, y );
  }

  // debounce
  var _this = this;
  // debounce triggering layout
  function delayed() {
    _this.layout();
    delete _this.dragTimeout;
  }

  this.clearDragTimeout();

  this.dragTimeout = setTimeout( delayed, 40 );
};

Packery.prototype.clearDragTimeout = function() {
  if ( this.dragTimeout ) {
    clearTimeout( this.dragTimeout );
  }
};

/**
 * handle an item drag end event
 * @param {Element} elem
 */
Packery.prototype.itemDragEnd = function( elem ) {
  var item = this.getItem( elem );
  var itemDidDrag;
  if ( item ) {
    itemDidDrag = item.didDrag;
    item.dragStop();
  }
  // if elem didn't move, or if it doesn't need positioning
  // unignore and unstamp and call it a day
  if ( !item || ( !itemDidDrag && !item.needsPositioning ) ) {
    this.unstamp( elem );
    return;
  }
  // procced with dragged item

  classie.add( item.element, 'is-positioning-post-drag' );

  // save this var, as it could get reset in dragStart
  var onLayoutComplete = this._getDragEndLayoutComplete( elem, item );

  if ( item.needsPositioning ) {
    item.on( 'layout', onLayoutComplete );
    item.moveTo( item.placeRect.x, item.placeRect.y );
  } else if ( item ) {
    // item didn't need placement
    item.copyPlaceRectPosition();
  }

  this.clearDragTimeout();
  this.on( 'layoutComplete', onLayoutComplete );
  this.layout();

};

/**
 * get drag end callback
 * @param {Element} elem
 * @param {Packery.Item} item
 * @returns {Function} onLayoutComplete
 */
Packery.prototype._getDragEndLayoutComplete = function( elem, item ) {
  var itemNeedsPositioning = item && item.needsPositioning;
  var completeCount = 0;
  var asyncCount = itemNeedsPositioning ? 2 : 1;
  var _this = this;

  return function onLayoutComplete() {
    completeCount++;
    // don't proceed if not complete
    if ( completeCount !== asyncCount ) {
      return true;
    }
    // reset item
    if ( item ) {
      classie.remove( item.element, 'is-positioning-post-drag' );
      item.isPlacing = false;
      item.copyPlaceRectPosition();
    }

    _this.unstamp( elem );
    // only sort when item moved
    _this.sortItemsByPosition();

    // emit item drag event now that everything is done
    if ( itemNeedsPositioning ) {
      _this.emitEvent( 'dragItemPositioned', [ _this, item ] );
    }
    // listen once
    return true;
  };
};

/**
 * binds Draggabilly events
 * @param {Draggabilly} draggie
 */
Packery.prototype.bindDraggabillyEvents = function( draggie ) {
  draggie.on( 'dragStart', this.handleDraggabilly.dragStart );
  draggie.on( 'dragMove', this.handleDraggabilly.dragMove );
  draggie.on( 'dragEnd', this.handleDraggabilly.dragEnd );
};

/**
 * binds jQuery UI Draggable events
 * @param {jQuery} $elems
 */
Packery.prototype.bindUIDraggableEvents = function( $elems ) {
  $elems
    .on( 'dragstart', this.handleUIDraggable.start )
    .on( 'drag', this.handleUIDraggable.drag )
    .on( 'dragstop', this.handleUIDraggable.stop );
};

Packery.Rect = Rect;
Packery.Packer = Packer;

return Packery;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'classie/classie',
      'get-size/get-size',
      'outlayer/outlayer',
      './rect',
      './packer',
      './item'
    ],
    packeryDefinition );
} else {
  // browser global
  window.Packery = packeryDefinition(
    window.classie,
    window.getSize,
    window.Outlayer,
    window.Packery.Rect,
    window.Packery.Packer,
    window.Packery.Item
  );
}

})( window );
;/*
 * Copyright 2015 Small Batch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/* Web Font Loader v1.5.10 - (c) Adobe Systems, Google. License: Apache 2.0 */
;(function(window,document,undefined){var k=this;function l(a,b){var c=a.split("."),d=k;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}function aa(a,b,c){return a.call.apply(a.bind,arguments)}
function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function n(a,b,c){n=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return n.apply(null,arguments)}var q=Date.now||function(){return+new Date};function s(a,b){this.K=a;this.w=b||a;this.D=this.w.document}s.prototype.createElement=function(a,b,c){a=this.D.createElement(a);if(b)for(var d in b)b.hasOwnProperty(d)&&("style"==d?a.style.cssText=b[d]:a.setAttribute(d,b[d]));c&&a.appendChild(this.D.createTextNode(c));return a};function t(a,b,c){a=a.D.getElementsByTagName(b)[0];a||(a=document.documentElement);a&&a.lastChild&&a.insertBefore(c,a.lastChild)}function ca(a,b){function c(){a.D.body?b():setTimeout(c,0)}c()}
function u(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function v(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function w(a){var b=a.w.location.protocol;"about:"==b&&(b=a.K.location.protocol);return"https:"==b?"https:":"http:"}function x(a,b){var c=a.createElement("link",{rel:"stylesheet",href:b}),d=!1;c.onload=function(){d||(d=!0)};c.onerror=function(){d||(d=!0)};t(a,"head",c)}
function y(a,b,c,d){var e=a.D.getElementsByTagName("head")[0];if(e){var f=a.createElement("script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);window.setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function z(a,b,c,d){this.R=a;this.Z=b;this.Ba=c;this.ra=d}l("webfont.BrowserInfo",z);z.prototype.sa=function(){return this.R};z.prototype.hasWebFontSupport=z.prototype.sa;z.prototype.ta=function(){return this.Z};z.prototype.hasWebKitFallbackBug=z.prototype.ta;z.prototype.ua=function(){return this.Ba};z.prototype.hasWebKitMetricsBug=z.prototype.ua;z.prototype.qa=function(){return this.ra};z.prototype.hasNativeFontLoading=z.prototype.qa;function A(a,b,c,d){this.c=null!=a?a:null;this.g=null!=b?b:null;this.B=null!=c?c:null;this.e=null!=d?d:null}var da=/^([0-9]+)(?:[\._-]([0-9]+))?(?:[\._-]([0-9]+))?(?:[\._+-]?(.*))?$/;A.prototype.compare=function(a){return this.c>a.c||this.c===a.c&&this.g>a.g||this.c===a.c&&this.g===a.g&&this.B>a.B?1:this.c<a.c||this.c===a.c&&this.g<a.g||this.c===a.c&&this.g===a.g&&this.B<a.B?-1:0};A.prototype.toString=function(){return[this.c,this.g||"",this.B||"",this.e||""].join("")};
function B(a){a=da.exec(a);var b=null,c=null,d=null,e=null;a&&(null!==a[1]&&a[1]&&(b=parseInt(a[1],10)),null!==a[2]&&a[2]&&(c=parseInt(a[2],10)),null!==a[3]&&a[3]&&(d=parseInt(a[3],10)),null!==a[4]&&a[4]&&(e=/^[0-9]+$/.test(a[4])?parseInt(a[4],10):a[4]));return new A(b,c,d,e)};function C(a,b,c,d,e,f,g,h){this.P=a;this.ja=c;this.ya=e;this.ia=g;this.m=h}l("webfont.UserAgent",C);C.prototype.getName=function(){return this.P};C.prototype.getName=C.prototype.getName;C.prototype.oa=function(){return this.ja};C.prototype.getEngine=C.prototype.oa;C.prototype.pa=function(){return this.ya};C.prototype.getPlatform=C.prototype.pa;C.prototype.na=function(){return this.ia};C.prototype.getDocumentMode=C.prototype.na;C.prototype.ma=function(){return this.m};C.prototype.getBrowserInfo=C.prototype.ma;function D(a,b){this.a=a;this.k=b}var ea=new C("Unknown",0,"Unknown",0,"Unknown",0,void 0,new z(!1,!1,!1,!1));
D.prototype.parse=function(){var a;if(-1!=this.a.indexOf("MSIE")||-1!=this.a.indexOf("Trident/")){a=E(this);var b=B(F(this)),c=null,d=null,e=G(this.a,/Trident\/([\d\w\.]+)/,1),f=H(this.k),c=-1!=this.a.indexOf("MSIE")?B(G(this.a,/MSIE ([\d\w\.]+)/,1)):B(G(this.a,/rv:([\d\w\.]+)/,1));""!=e?(d="Trident",B(e)):d="Unknown";a=new C("MSIE",0,d,0,a,0,f,new z("Windows"==a&&6<=c.c||"Windows Phone"==a&&8<=b.c,!1,!1,!!this.k.fonts))}else if(-1!=this.a.indexOf("Opera"))a:if(a="Unknown",c=B(G(this.a,/Presto\/([\d\w\.]+)/,
1)),B(F(this)),b=H(this.k),null!==c.c?a="Presto":(-1!=this.a.indexOf("Gecko")&&(a="Gecko"),B(G(this.a,/rv:([^\)]+)/,1))),-1!=this.a.indexOf("Opera Mini/"))c=B(G(this.a,/Opera Mini\/([\d\.]+)/,1)),a=new C("OperaMini",0,a,0,E(this),0,b,new z(!1,!1,!1,!!this.k.fonts));else{if(-1!=this.a.indexOf("Version/")&&(c=B(G(this.a,/Version\/([\d\.]+)/,1)),null!==c.c)){a=new C("Opera",0,a,0,E(this),0,b,new z(10<=c.c,!1,!1,!!this.k.fonts));break a}c=B(G(this.a,/Opera[\/ ]([\d\.]+)/,1));a=null!==c.c?new C("Opera",
0,a,0,E(this),0,b,new z(10<=c.c,!1,!1,!!this.k.fonts)):new C("Opera",0,a,0,E(this),0,b,new z(!1,!1,!1,!!this.k.fonts))}else/OPR\/[\d.]+/.test(this.a)?a=I(this):/AppleWeb(K|k)it/.test(this.a)?a=I(this):-1!=this.a.indexOf("Gecko")?(a="Unknown",b=new A,B(F(this)),b=!1,-1!=this.a.indexOf("Firefox")?(a="Firefox",b=B(G(this.a,/Firefox\/([\d\w\.]+)/,1)),b=3<=b.c&&5<=b.g):-1!=this.a.indexOf("Mozilla")&&(a="Mozilla"),c=B(G(this.a,/rv:([^\)]+)/,1)),b||(b=1<c.c||1==c.c&&9<c.g||1==c.c&&9==c.g&&2<=c.B),a=new C(a,
0,"Gecko",0,E(this),0,H(this.k),new z(b,!1,!1,!!this.k.fonts))):a=ea;return a};function E(a){var b=G(a.a,/(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/,1);if(""!=b)return/BB\d{2}/.test(b)&&(b="BlackBerry"),b;a=G(a.a,/(Linux|Mac_PowerPC|Macintosh|Windows|CrOS|PlayStation|CrKey)/,1);return""!=a?("Mac_PowerPC"==a?a="Macintosh":"PlayStation"==a&&(a="Linux"),a):"Unknown"}
function F(a){var b=G(a.a,/(OS X|Windows NT|Android) ([^;)]+)/,2);if(b||(b=G(a.a,/Windows Phone( OS)? ([^;)]+)/,2))||(b=G(a.a,/(iPhone )?OS ([\d_]+)/,2)))return b;if(b=G(a.a,/(?:Linux|CrOS|CrKey) ([^;)]+)/,1))for(var b=b.split(/\s/),c=0;c<b.length;c+=1)if(/^[\d\._]+$/.test(b[c]))return b[c];return(a=G(a.a,/(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/,2))?a:"Unknown"}
function I(a){var b=E(a),c=B(F(a)),d=B(G(a.a,/AppleWeb(?:K|k)it\/([\d\.\+]+)/,1)),e="Unknown",f=new A,f="Unknown",g=!1;/OPR\/[\d.]+/.test(a.a)?e="Opera":-1!=a.a.indexOf("Chrome")||-1!=a.a.indexOf("CrMo")||-1!=a.a.indexOf("CriOS")?e="Chrome":/Silk\/\d/.test(a.a)?e="Silk":"BlackBerry"==b||"Android"==b?e="BuiltinBrowser":-1!=a.a.indexOf("PhantomJS")?e="PhantomJS":-1!=a.a.indexOf("Safari")?e="Safari":-1!=a.a.indexOf("AdobeAIR")?e="AdobeAIR":-1!=a.a.indexOf("PlayStation")&&(e="BuiltinBrowser");"BuiltinBrowser"==
e?f="Unknown":"Silk"==e?f=G(a.a,/Silk\/([\d\._]+)/,1):"Chrome"==e?f=G(a.a,/(Chrome|CrMo|CriOS)\/([\d\.]+)/,2):-1!=a.a.indexOf("Version/")?f=G(a.a,/Version\/([\d\.\w]+)/,1):"AdobeAIR"==e?f=G(a.a,/AdobeAIR\/([\d\.]+)/,1):"Opera"==e?f=G(a.a,/OPR\/([\d.]+)/,1):"PhantomJS"==e&&(f=G(a.a,/PhantomJS\/([\d.]+)/,1));f=B(f);g="AdobeAIR"==e?2<f.c||2==f.c&&5<=f.g:"BlackBerry"==b?10<=c.c:"Android"==b?2<c.c||2==c.c&&1<c.g:526<=d.c||525<=d.c&&13<=d.g;return new C(e,0,"AppleWebKit",0,b,0,H(a.k),new z(g,536>d.c||536==
d.c&&11>d.g,"iPhone"==b||"iPad"==b||"iPod"==b||"Macintosh"==b,!!a.k.fonts))}function G(a,b,c){return(a=a.match(b))&&a[c]?a[c]:""}function H(a){if(a.documentMode)return a.documentMode};function J(a){this.xa=a||"-"}J.prototype.e=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.xa)};function K(a,b){this.P=a;this.$=4;this.Q="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.Q=c[1],this.$=parseInt(c[2],10))}K.prototype.getName=function(){return this.P};function L(a){return a.Q+a.$}function fa(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ga(a,b,c,d,e){this.d=a;this.p=b;this.T=c;this.j="wf";this.h=new J("-");this.ha=!1!==d;this.C=!1!==e}function M(a){if(a.C){var b=v(a.p,a.h.e(a.j,"active")),c=[],d=[a.h.e(a.j,"loading")];b||c.push(a.h.e(a.j,"inactive"));u(a.p,c,d)}N(a,"inactive")}function N(a,b,c){if(a.ha&&a.T[b])if(c)a.T[b](c.getName(),L(c));else a.T[b]()};function ha(){this.A={}};function O(a,b){this.d=a;this.H=b;this.t=this.d.createElement("span",{"aria-hidden":"true"},this.H)}
function P(a,b){var c=a.t,d;d=[];for(var e=b.P.split(/,\s*/),f=0;f<e.length;f++){var g=e[f].replace(/['"]/g,"");-1==g.indexOf(" ")?d.push(g):d.push("'"+g+"'")}d=d.join(",");e="normal";"o"===b.Q?e="oblique":"i"===b.Q&&(e="italic");c.style.cssText="display:block;position:absolute;top:0px;left:0px;visibility:hidden;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+d+";"+("font-style:"+e+";font-weight:"+(b.$+"00")+";")}
function Q(a){t(a.d,"body",a.t)}O.prototype.remove=function(){var a=this.t;a.parentNode&&a.parentNode.removeChild(a)};function ja(a,b,c,d,e,f,g,h){this.aa=a;this.va=b;this.d=c;this.s=d;this.H=h||"BESbswy";this.m=e;this.J={};this.Y=f||3E3;this.da=g||null;this.G=this.F=null;a=new O(this.d,this.H);Q(a);for(var p in R)R.hasOwnProperty(p)&&(P(a,new K(R[p],L(this.s))),this.J[R[p]]=a.t.offsetWidth);a.remove()}var R={Ea:"serif",Da:"sans-serif",Ca:"monospace"};
ja.prototype.start=function(){this.F=new O(this.d,this.H);Q(this.F);this.G=new O(this.d,this.H);Q(this.G);this.za=q();P(this.F,new K(this.s.getName()+",serif",L(this.s)));P(this.G,new K(this.s.getName()+",sans-serif",L(this.s)));ka(this)};function la(a,b,c){for(var d in R)if(R.hasOwnProperty(d)&&b===a.J[R[d]]&&c===a.J[R[d]])return!0;return!1}
function ka(a){var b=a.F.t.offsetWidth,c=a.G.t.offsetWidth;b===a.J.serif&&c===a.J["sans-serif"]||a.m.Z&&la(a,b,c)?q()-a.za>=a.Y?a.m.Z&&la(a,b,c)&&(null===a.da||a.da.hasOwnProperty(a.s.getName()))?S(a,a.aa):S(a,a.va):ma(a):S(a,a.aa)}function ma(a){setTimeout(n(function(){ka(this)},a),25)}function S(a,b){a.F.remove();a.G.remove();b(a.s)};function T(a,b,c,d){this.d=b;this.u=c;this.U=0;this.fa=this.ca=!1;this.Y=d;this.m=a.m}function na(a,b,c,d,e){c=c||{};if(0===b.length&&e)M(a.u);else for(a.U+=b.length,e&&(a.ca=e),e=0;e<b.length;e++){var f=b[e],g=c[f.getName()],h=a.u,p=f;h.C&&u(h.p,[h.h.e(h.j,p.getName(),L(p).toString(),"loading")]);N(h,"fontloading",p);h=null;h=new ja(n(a.ka,a),n(a.la,a),a.d,f,a.m,a.Y,d,g);h.start()}}
T.prototype.ka=function(a){var b=this.u;b.C&&u(b.p,[b.h.e(b.j,a.getName(),L(a).toString(),"active")],[b.h.e(b.j,a.getName(),L(a).toString(),"loading"),b.h.e(b.j,a.getName(),L(a).toString(),"inactive")]);N(b,"fontactive",a);this.fa=!0;oa(this)};
T.prototype.la=function(a){var b=this.u;if(b.C){var c=v(b.p,b.h.e(b.j,a.getName(),L(a).toString(),"active")),d=[],e=[b.h.e(b.j,a.getName(),L(a).toString(),"loading")];c||d.push(b.h.e(b.j,a.getName(),L(a).toString(),"inactive"));u(b.p,d,e)}N(b,"fontinactive",a);oa(this)};function oa(a){0==--a.U&&a.ca&&(a.fa?(a=a.u,a.C&&u(a.p,[a.h.e(a.j,"active")],[a.h.e(a.j,"loading"),a.h.e(a.j,"inactive")]),N(a,"active")):M(a.u))};function U(a){this.K=a;this.v=new ha;this.Aa=new D(a.navigator.userAgent,a.document);this.a=this.Aa.parse();this.V=this.W=0;this.M=this.N=!0}
U.prototype.load=function(a){var b=a.context||this.K;this.d=new s(this.K,b);this.N=!1!==a.events;this.M=!1!==a.classes;var b=new ga(this.d,b.document.documentElement,a,this.N,this.M),c=[],d=a.timeout;b.C&&u(b.p,[b.h.e(b.j,"loading")]);N(b,"loading");var c=this.v,e=this.d,f=[],g;for(g in a)if(a.hasOwnProperty(g)){var h=c.A[g];h&&f.push(h(a[g],e))}c=f;this.V=this.W=c.length;a=new T(this.a,this.d,b,d);g=0;for(d=c.length;g<d;g++)e=c[g],e.L(this.a,n(this.wa,this,e,b,a))};
U.prototype.wa=function(a,b,c,d){var e=this;d?a.load(function(a,b,d){pa(e,c,a,b,d)}):(a=0==--this.W,this.V--,a&&0==this.V?M(b):(this.M||this.N)&&na(c,[],{},null,a))};function pa(a,b,c,d,e){var f=0==--a.W;(a.M||a.N)&&setTimeout(function(){na(b,c,d||null,e||null,f)},0)};function qa(a,b,c){this.S=a?a:b+ra;this.q=[];this.X=[];this.ga=c||""}var ra="//fonts.googleapis.com/css";qa.prototype.e=function(){if(0==this.q.length)throw Error("No fonts to load!");if(-1!=this.S.indexOf("kit="))return this.S;for(var a=this.q.length,b=[],c=0;c<a;c++)b.push(this.q[c].replace(/ /g,"+"));a=this.S+"?family="+b.join("%7C");0<this.X.length&&(a+="&subset="+this.X.join(","));0<this.ga.length&&(a+="&text="+encodeURIComponent(this.ga));return a};function sa(a){this.q=a;this.ea=[];this.O={}}
var ta={latin:"BESbswy",cyrillic:"&#1081;&#1103;&#1046;",greek:"&#945;&#946;&#931;",khmer:"&#x1780;&#x1781;&#x1782;",Hanuman:"&#x1780;&#x1781;&#x1782;"},ua={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},va={i:"i",italic:"i",n:"n",normal:"n"},wa=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
sa.prototype.parse=function(){for(var a=this.q.length,b=0;b<a;b++){var c=this.q[b].split(":"),d=c[0].replace(/\+/g," "),e=["n4"];if(2<=c.length){var f;var g=c[1];f=[];if(g)for(var g=g.split(","),h=g.length,p=0;p<h;p++){var m;m=g[p];if(m.match(/^[\w-]+$/)){m=wa.exec(m.toLowerCase());var r=void 0;if(null==m)r="";else{r=void 0;r=m[1];if(null==r||""==r)r="4";else var ia=ua[r],r=ia?ia:isNaN(r)?"4":r.substr(0,1);m=m[2];r=[null==m||""==m?"n":va[m],r].join("")}m=r}else m="";m&&f.push(m)}0<f.length&&(e=f);
3==c.length&&(c=c[2],f=[],c=c?c.split(","):f,0<c.length&&(c=ta[c[0]])&&(this.O[d]=c))}this.O[d]||(c=ta[d])&&(this.O[d]=c);for(c=0;c<e.length;c+=1)this.ea.push(new K(d,e[c]))}};function V(a,b){this.a=(new D(navigator.userAgent,document)).parse();this.d=a;this.f=b}var xa={Arimo:!0,Cousine:!0,Tinos:!0};V.prototype.L=function(a,b){b(a.m.R)};V.prototype.load=function(a){var b=this.d;"MSIE"==this.a.getName()&&1!=this.f.blocking?ca(b,n(this.ba,this,a)):this.ba(a)};
V.prototype.ba=function(a){for(var b=this.d,c=new qa(this.f.api,w(b),this.f.text),d=this.f.families,e=d.length,f=0;f<e;f++){var g=d[f].split(":");3==g.length&&c.X.push(g.pop());var h="";2==g.length&&""!=g[1]&&(h=":");c.q.push(g.join(h))}d=new sa(d);d.parse();x(b,c.e());a(d.ea,d.O,xa)};function W(a,b){this.d=a;this.f=b;this.o=[]}W.prototype.I=function(a){var b=this.d;return w(this.d)+(this.f.api||"//f.fontdeck.com/s/css/js/")+(b.w.location.hostname||b.K.location.hostname)+"/"+a+".js"};
W.prototype.L=function(a,b){var c=this.f.id,d=this.d.w,e=this;c?(d.__webfontfontdeckmodule__||(d.__webfontfontdeckmodule__={}),d.__webfontfontdeckmodule__[c]=function(a,c){for(var d=0,p=c.fonts.length;d<p;++d){var m=c.fonts[d];e.o.push(new K(m.name,fa("font-weight:"+m.weight+";font-style:"+m.style)))}b(a)},y(this.d,this.I(c),function(a){a&&b(!1)})):b(!1)};W.prototype.load=function(a){a(this.o)};function X(a,b){this.d=a;this.f=b;this.o=[]}X.prototype.I=function(a){var b=w(this.d);return(this.f.api||b+"//use.typekit.net")+"/"+a+".js"};X.prototype.L=function(a,b){var c=this.f.id,d=this.d.w,e=this;c?y(this.d,this.I(c),function(a){if(a)b(!1);else{if(d.Typekit&&d.Typekit.config&&d.Typekit.config.fn){a=d.Typekit.config.fn;for(var c=0;c<a.length;c+=2)for(var h=a[c],p=a[c+1],m=0;m<p.length;m++)e.o.push(new K(h,p[m]));try{d.Typekit.load({events:!1,classes:!1})}catch(r){}}b(!0)}},2E3):b(!1)};
X.prototype.load=function(a){a(this.o)};function Y(a,b){this.d=a;this.f=b;this.o=[]}Y.prototype.L=function(a,b){var c=this,d=c.f.projectId,e=c.f.version;if(d){var f=c.d.w;y(this.d,c.I(d,e),function(e){if(e)b(!1);else{if(f["__mti_fntLst"+d]&&(e=f["__mti_fntLst"+d]()))for(var h=0;h<e.length;h++)c.o.push(new K(e[h].fontfamily));b(a.m.R)}}).id="__MonotypeAPIScript__"+d}else b(!1)};Y.prototype.I=function(a,b){var c=w(this.d),d=(this.f.api||"fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return c+"//"+d+"/"+a+".js"+(b?"?v="+b:"")};
Y.prototype.load=function(a){a(this.o)};function Z(a,b){this.d=a;this.f=b}Z.prototype.load=function(a){var b,c,d=this.f.urls||[],e=this.f.families||[],f=this.f.testStrings||{};b=0;for(c=d.length;b<c;b++)x(this.d,d[b]);d=[];b=0;for(c=e.length;b<c;b++){var g=e[b].split(":");if(g[1])for(var h=g[1].split(","),p=0;p<h.length;p+=1)d.push(new K(g[0],h[p]));else d.push(new K(g[0]))}a(d,f)};Z.prototype.L=function(a,b){return b(a.m.R)};var $=new U(k);$.v.A.custom=function(a,b){return new Z(b,a)};$.v.A.fontdeck=function(a,b){return new W(b,a)};$.v.A.monotype=function(a,b){return new Y(b,a)};$.v.A.typekit=function(a,b){return new X(b,a)};$.v.A.google=function(a,b){return new V(b,a)};k.WebFont||(k.WebFont={},k.WebFont.load=n($.load,$),k.WebFontConfig&&$.load(k.WebFontConfig));})(this,document);

;$( function() {

	$(".post-placement").click( function() {
		window.location = $("a", this).attr("href");
	});

});;var bodyLI = [];

WebFontConfig = {
	google: {
		families: ['Alegreya+Sans:100,400,700,400italic,700italic']
	},
	active: function() {
		$("body.home ul").packery({
			itemSelector: 'li',
			gutter: 30
		});
		bodyLI = $('body.home ul li').get().reverse();
		fadeIn();
	}
}

function fadeIn() {
	var elem = bodyLI.pop();
	$(elem).addClass("state-loaded");
	if(bodyLI.length > 0) {
		window.setTimeout(fadeIn, 50);
	}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5qcyIsImNsYXNzaWUuanMiLCJnZXQtc3R5bGUtcHJvcGVydHkuanMiLCJnZXQtc2l6ZS5qcyIsImV2ZW50aWUuanMiLCJkb2MtcmVhZHkuanMiLCJFdmVudEVtaXR0ZXIuanMiLCJtYXRjaGVzLXNlbGVjdG9yLmpzIiwiaXRlbS5qcyIsIm91dGxheWVyLmpzIiwicmVjdC5qcyIsInBhY2tlci5qcyIsInBhY2tlcnkuanMiLCJpbmRleC5qcyIsImFwcC5qcyIsImluaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0M3blJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0N4ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NsaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDNS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDSDVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDSXJLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDeGRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0M5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGpRdWVyeSBKYXZhU2NyaXB0IExpYnJhcnkgdjIuMC4zXG4gKiBodHRwOi8vanF1ZXJ5LmNvbS9cbiAqXG4gKiBJbmNsdWRlcyBTaXp6bGUuanNcbiAqIGh0dHA6Ly9zaXp6bGVqcy5jb20vXG4gKlxuICogQ29weXJpZ2h0IDIwMDUsIDIwMTMgalF1ZXJ5IEZvdW5kYXRpb24sIEluYy4gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogRGF0ZTogMjAxMy0wNy0wM1QxMzozMFpcbiAqL1xuKGZ1bmN0aW9uKCB3aW5kb3csIHVuZGVmaW5lZCApIHtcblxuLy8gQ2FuJ3QgZG8gdGhpcyBiZWNhdXNlIHNldmVyYWwgYXBwcyBpbmNsdWRpbmcgQVNQLk5FVCB0cmFjZVxuLy8gdGhlIHN0YWNrIHZpYSBhcmd1bWVudHMuY2FsbGVyLmNhbGxlZSBhbmQgRmlyZWZveCBkaWVzIGlmXG4vLyB5b3UgdHJ5IHRvIHRyYWNlIHRocm91Z2ggXCJ1c2Ugc3RyaWN0XCIgY2FsbCBjaGFpbnMuICgjMTMzMzUpXG4vLyBTdXBwb3J0OiBGaXJlZm94IDE4K1xuLy9cInVzZSBzdHJpY3RcIjtcbnZhclxuXHQvLyBBIGNlbnRyYWwgcmVmZXJlbmNlIHRvIHRoZSByb290IGpRdWVyeShkb2N1bWVudClcblx0cm9vdGpRdWVyeSxcblxuXHQvLyBUaGUgZGVmZXJyZWQgdXNlZCBvbiBET00gcmVhZHlcblx0cmVhZHlMaXN0LFxuXG5cdC8vIFN1cHBvcnQ6IElFOVxuXHQvLyBGb3IgYHR5cGVvZiB4bWxOb2RlLm1ldGhvZGAgaW5zdGVhZCBvZiBgeG1sTm9kZS5tZXRob2QgIT09IHVuZGVmaW5lZGBcblx0Y29yZV9zdHJ1bmRlZmluZWQgPSB0eXBlb2YgdW5kZWZpbmVkLFxuXG5cdC8vIFVzZSB0aGUgY29ycmVjdCBkb2N1bWVudCBhY2NvcmRpbmdseSB3aXRoIHdpbmRvdyBhcmd1bWVudCAoc2FuZGJveClcblx0bG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24sXG5cdGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuXHRkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuXG5cdC8vIE1hcCBvdmVyIGpRdWVyeSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuXHRfalF1ZXJ5ID0gd2luZG93LmpRdWVyeSxcblxuXHQvLyBNYXAgb3ZlciB0aGUgJCBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuXHRfJCA9IHdpbmRvdy4kLFxuXG5cdC8vIFtbQ2xhc3NdXSAtPiB0eXBlIHBhaXJzXG5cdGNsYXNzMnR5cGUgPSB7fSxcblxuXHQvLyBMaXN0IG9mIGRlbGV0ZWQgZGF0YSBjYWNoZSBpZHMsIHNvIHdlIGNhbiByZXVzZSB0aGVtXG5cdGNvcmVfZGVsZXRlZElkcyA9IFtdLFxuXG5cdGNvcmVfdmVyc2lvbiA9IFwiMi4wLjNcIixcblxuXHQvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHNvbWUgY29yZSBtZXRob2RzXG5cdGNvcmVfY29uY2F0ID0gY29yZV9kZWxldGVkSWRzLmNvbmNhdCxcblx0Y29yZV9wdXNoID0gY29yZV9kZWxldGVkSWRzLnB1c2gsXG5cdGNvcmVfc2xpY2UgPSBjb3JlX2RlbGV0ZWRJZHMuc2xpY2UsXG5cdGNvcmVfaW5kZXhPZiA9IGNvcmVfZGVsZXRlZElkcy5pbmRleE9mLFxuXHRjb3JlX3RvU3RyaW5nID0gY2xhc3MydHlwZS50b1N0cmluZyxcblx0Y29yZV9oYXNPd24gPSBjbGFzczJ0eXBlLmhhc093blByb3BlcnR5LFxuXHRjb3JlX3RyaW0gPSBjb3JlX3ZlcnNpb24udHJpbSxcblxuXHQvLyBEZWZpbmUgYSBsb2NhbCBjb3B5IG9mIGpRdWVyeVxuXHRqUXVlcnkgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG5cdFx0Ly8gVGhlIGpRdWVyeSBvYmplY3QgaXMgYWN0dWFsbHkganVzdCB0aGUgaW5pdCBjb25zdHJ1Y3RvciAnZW5oYW5jZWQnXG5cdFx0cmV0dXJuIG5ldyBqUXVlcnkuZm4uaW5pdCggc2VsZWN0b3IsIGNvbnRleHQsIHJvb3RqUXVlcnkgKTtcblx0fSxcblxuXHQvLyBVc2VkIGZvciBtYXRjaGluZyBudW1iZXJzXG5cdGNvcmVfcG51bSA9IC9bKy1dPyg/OlxcZCpcXC58KVxcZCsoPzpbZUVdWystXT9cXGQrfCkvLnNvdXJjZSxcblxuXHQvLyBVc2VkIGZvciBzcGxpdHRpbmcgb24gd2hpdGVzcGFjZVxuXHRjb3JlX3Jub3R3aGl0ZSA9IC9cXFMrL2csXG5cblx0Ly8gQSBzaW1wbGUgd2F5IHRvIGNoZWNrIGZvciBIVE1MIHN0cmluZ3Ncblx0Ly8gUHJpb3JpdGl6ZSAjaWQgb3ZlciA8dGFnPiB0byBhdm9pZCBYU1MgdmlhIGxvY2F0aW9uLmhhc2ggKCM5NTIxKVxuXHQvLyBTdHJpY3QgSFRNTCByZWNvZ25pdGlvbiAoIzExMjkwOiBtdXN0IHN0YXJ0IHdpdGggPClcblx0cnF1aWNrRXhwciA9IC9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKnwjKFtcXHctXSopKSQvLFxuXG5cdC8vIE1hdGNoIGEgc3RhbmRhbG9uZSB0YWdcblx0cnNpbmdsZVRhZyA9IC9ePChcXHcrKVxccypcXC8/Pig/OjxcXC9cXDE+fCkkLyxcblxuXHQvLyBNYXRjaGVzIGRhc2hlZCBzdHJpbmcgZm9yIGNhbWVsaXppbmdcblx0cm1zUHJlZml4ID0gL14tbXMtLyxcblx0cmRhc2hBbHBoYSA9IC8tKFtcXGRhLXpdKS9naSxcblxuXHQvLyBVc2VkIGJ5IGpRdWVyeS5jYW1lbENhc2UgYXMgY2FsbGJhY2sgdG8gcmVwbGFjZSgpXG5cdGZjYW1lbENhc2UgPSBmdW5jdGlvbiggYWxsLCBsZXR0ZXIgKSB7XG5cdFx0cmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuXHR9LFxuXG5cdC8vIFRoZSByZWFkeSBldmVudCBoYW5kbGVyIGFuZCBzZWxmIGNsZWFudXAgbWV0aG9kXG5cdGNvbXBsZXRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjb21wbGV0ZWQsIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwibG9hZFwiLCBjb21wbGV0ZWQsIGZhbHNlICk7XG5cdFx0alF1ZXJ5LnJlYWR5KCk7XG5cdH07XG5cbmpRdWVyeS5mbiA9IGpRdWVyeS5wcm90b3R5cGUgPSB7XG5cdC8vIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgalF1ZXJ5IGJlaW5nIHVzZWRcblx0anF1ZXJ5OiBjb3JlX3ZlcnNpb24sXG5cblx0Y29uc3RydWN0b3I6IGpRdWVyeSxcblx0aW5pdDogZnVuY3Rpb24oIHNlbGVjdG9yLCBjb250ZXh0LCByb290alF1ZXJ5ICkge1xuXHRcdHZhciBtYXRjaCwgZWxlbTtcblxuXHRcdC8vIEhBTkRMRTogJChcIlwiKSwgJChudWxsKSwgJCh1bmRlZmluZWQpLCAkKGZhbHNlKVxuXHRcdGlmICggIXNlbGVjdG9yICkge1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIEhUTUwgc3RyaW5nc1xuXHRcdGlmICggdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0aWYgKCBzZWxlY3Rvci5jaGFyQXQoMCkgPT09IFwiPFwiICYmIHNlbGVjdG9yLmNoYXJBdCggc2VsZWN0b3IubGVuZ3RoIC0gMSApID09PSBcIj5cIiAmJiBzZWxlY3Rvci5sZW5ndGggPj0gMyApIHtcblx0XHRcdFx0Ly8gQXNzdW1lIHRoYXQgc3RyaW5ncyB0aGF0IHN0YXJ0IGFuZCBlbmQgd2l0aCA8PiBhcmUgSFRNTCBhbmQgc2tpcCB0aGUgcmVnZXggY2hlY2tcblx0XHRcdFx0bWF0Y2ggPSBbIG51bGwsIHNlbGVjdG9yLCBudWxsIF07XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hdGNoID0gcnF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYXRjaCBodG1sIG9yIG1ha2Ugc3VyZSBubyBjb250ZXh0IGlzIHNwZWNpZmllZCBmb3IgI2lkXG5cdFx0XHRpZiAoIG1hdGNoICYmIChtYXRjaFsxXSB8fCAhY29udGV4dCkgKSB7XG5cblx0XHRcdFx0Ly8gSEFORExFOiAkKGh0bWwpIC0+ICQoYXJyYXkpXG5cdFx0XHRcdGlmICggbWF0Y2hbMV0gKSB7XG5cdFx0XHRcdFx0Y29udGV4dCA9IGNvbnRleHQgaW5zdGFuY2VvZiBqUXVlcnkgPyBjb250ZXh0WzBdIDogY29udGV4dDtcblxuXHRcdFx0XHRcdC8vIHNjcmlwdHMgaXMgdHJ1ZSBmb3IgYmFjay1jb21wYXRcblx0XHRcdFx0XHRqUXVlcnkubWVyZ2UoIHRoaXMsIGpRdWVyeS5wYXJzZUhUTUwoXG5cdFx0XHRcdFx0XHRtYXRjaFsxXSxcblx0XHRcdFx0XHRcdGNvbnRleHQgJiYgY29udGV4dC5ub2RlVHlwZSA/IGNvbnRleHQub3duZXJEb2N1bWVudCB8fCBjb250ZXh0IDogZG9jdW1lbnQsXG5cdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0KSApO1xuXG5cdFx0XHRcdFx0Ly8gSEFORExFOiAkKGh0bWwsIHByb3BzKVxuXHRcdFx0XHRcdGlmICggcnNpbmdsZVRhZy50ZXN0KCBtYXRjaFsxXSApICYmIGpRdWVyeS5pc1BsYWluT2JqZWN0KCBjb250ZXh0ICkgKSB7XG5cdFx0XHRcdFx0XHRmb3IgKCBtYXRjaCBpbiBjb250ZXh0ICkge1xuXHRcdFx0XHRcdFx0XHQvLyBQcm9wZXJ0aWVzIG9mIGNvbnRleHQgYXJlIGNhbGxlZCBhcyBtZXRob2RzIGlmIHBvc3NpYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHRoaXNbIG1hdGNoIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzWyBtYXRjaCBdKCBjb250ZXh0WyBtYXRjaCBdICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gLi4uYW5kIG90aGVyd2lzZSBzZXQgYXMgYXR0cmlidXRlc1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuYXR0ciggbWF0Y2gsIGNvbnRleHRbIG1hdGNoIF0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0XHRcdC8vIEhBTkRMRTogJCgjaWQpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBtYXRjaFsyXSApO1xuXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgcGFyZW50Tm9kZSB0byBjYXRjaCB3aGVuIEJsYWNrYmVycnkgNC42IHJldHVybnNcblx0XHRcdFx0XHQvLyBub2RlcyB0aGF0IGFyZSBubyBsb25nZXIgaW4gdGhlIGRvY3VtZW50ICM2OTYzXG5cdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdC8vIEluamVjdCB0aGUgZWxlbWVudCBkaXJlY3RseSBpbnRvIHRoZSBqUXVlcnkgb2JqZWN0XG5cdFx0XHRcdFx0XHR0aGlzLmxlbmd0aCA9IDE7XG5cdFx0XHRcdFx0XHR0aGlzWzBdID0gZWxlbTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLmNvbnRleHQgPSBkb2N1bWVudDtcblx0XHRcdFx0XHR0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly8gSEFORExFOiAkKGV4cHIsICQoLi4uKSlcblx0XHRcdH0gZWxzZSBpZiAoICFjb250ZXh0IHx8IGNvbnRleHQuanF1ZXJ5ICkge1xuXHRcdFx0XHRyZXR1cm4gKCBjb250ZXh0IHx8IHJvb3RqUXVlcnkgKS5maW5kKCBzZWxlY3RvciApO1xuXG5cdFx0XHQvLyBIQU5ETEU6ICQoZXhwciwgY29udGV4dClcblx0XHRcdC8vICh3aGljaCBpcyBqdXN0IGVxdWl2YWxlbnQgdG86ICQoY29udGV4dCkuZmluZChleHByKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IoIGNvbnRleHQgKS5maW5kKCBzZWxlY3RvciApO1xuXHRcdFx0fVxuXG5cdFx0Ly8gSEFORExFOiAkKERPTUVsZW1lbnQpXG5cdFx0fSBlbHNlIGlmICggc2VsZWN0b3Iubm9kZVR5cGUgKSB7XG5cdFx0XHR0aGlzLmNvbnRleHQgPSB0aGlzWzBdID0gc2VsZWN0b3I7XG5cdFx0XHR0aGlzLmxlbmd0aCA9IDE7XG5cdFx0XHRyZXR1cm4gdGhpcztcblxuXHRcdC8vIEhBTkRMRTogJChmdW5jdGlvbilcblx0XHQvLyBTaG9ydGN1dCBmb3IgZG9jdW1lbnQgcmVhZHlcblx0XHR9IGVsc2UgaWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggc2VsZWN0b3IgKSApIHtcblx0XHRcdHJldHVybiByb290alF1ZXJ5LnJlYWR5KCBzZWxlY3RvciApO1xuXHRcdH1cblxuXHRcdGlmICggc2VsZWN0b3Iuc2VsZWN0b3IgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvci5zZWxlY3Rvcjtcblx0XHRcdHRoaXMuY29udGV4dCA9IHNlbGVjdG9yLmNvbnRleHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpRdWVyeS5tYWtlQXJyYXkoIHNlbGVjdG9yLCB0aGlzICk7XG5cdH0sXG5cblx0Ly8gU3RhcnQgd2l0aCBhbiBlbXB0eSBzZWxlY3RvclxuXHRzZWxlY3RvcjogXCJcIixcblxuXHQvLyBUaGUgZGVmYXVsdCBsZW5ndGggb2YgYSBqUXVlcnkgb2JqZWN0IGlzIDBcblx0bGVuZ3RoOiAwLFxuXG5cdHRvQXJyYXk6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjb3JlX3NsaWNlLmNhbGwoIHRoaXMgKTtcblx0fSxcblxuXHQvLyBHZXQgdGhlIE50aCBlbGVtZW50IGluIHRoZSBtYXRjaGVkIGVsZW1lbnQgc2V0IE9SXG5cdC8vIEdldCB0aGUgd2hvbGUgbWF0Y2hlZCBlbGVtZW50IHNldCBhcyBhIGNsZWFuIGFycmF5XG5cdGdldDogZnVuY3Rpb24oIG51bSApIHtcblx0XHRyZXR1cm4gbnVtID09IG51bGwgP1xuXG5cdFx0XHQvLyBSZXR1cm4gYSAnY2xlYW4nIGFycmF5XG5cdFx0XHR0aGlzLnRvQXJyYXkoKSA6XG5cblx0XHRcdC8vIFJldHVybiBqdXN0IHRoZSBvYmplY3Rcblx0XHRcdCggbnVtIDwgMCA/IHRoaXNbIHRoaXMubGVuZ3RoICsgbnVtIF0gOiB0aGlzWyBudW0gXSApO1xuXHR9LFxuXG5cdC8vIFRha2UgYW4gYXJyYXkgb2YgZWxlbWVudHMgYW5kIHB1c2ggaXQgb250byB0aGUgc3RhY2tcblx0Ly8gKHJldHVybmluZyB0aGUgbmV3IG1hdGNoZWQgZWxlbWVudCBzZXQpXG5cdHB1c2hTdGFjazogZnVuY3Rpb24oIGVsZW1zICkge1xuXG5cdFx0Ly8gQnVpbGQgYSBuZXcgalF1ZXJ5IG1hdGNoZWQgZWxlbWVudCBzZXRcblx0XHR2YXIgcmV0ID0galF1ZXJ5Lm1lcmdlKCB0aGlzLmNvbnN0cnVjdG9yKCksIGVsZW1zICk7XG5cblx0XHQvLyBBZGQgdGhlIG9sZCBvYmplY3Qgb250byB0aGUgc3RhY2sgKGFzIGEgcmVmZXJlbmNlKVxuXHRcdHJldC5wcmV2T2JqZWN0ID0gdGhpcztcblx0XHRyZXQuY29udGV4dCA9IHRoaXMuY29udGV4dDtcblxuXHRcdC8vIFJldHVybiB0aGUgbmV3bHktZm9ybWVkIGVsZW1lbnQgc2V0XG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHQvLyBFeGVjdXRlIGEgY2FsbGJhY2sgZm9yIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIG1hdGNoZWQgc2V0LlxuXHQvLyAoWW91IGNhbiBzZWVkIHRoZSBhcmd1bWVudHMgd2l0aCBhbiBhcnJheSBvZiBhcmdzLCBidXQgdGhpcyBpc1xuXHQvLyBvbmx5IHVzZWQgaW50ZXJuYWxseS4pXG5cdGVhY2g6IGZ1bmN0aW9uKCBjYWxsYmFjaywgYXJncyApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmVhY2goIHRoaXMsIGNhbGxiYWNrLCBhcmdzICk7XG5cdH0sXG5cblx0cmVhZHk6IGZ1bmN0aW9uKCBmbiApIHtcblx0XHQvLyBBZGQgdGhlIGNhbGxiYWNrXG5cdFx0alF1ZXJ5LnJlYWR5LnByb21pc2UoKS5kb25lKCBmbiApO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0c2xpY2U6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggY29yZV9zbGljZS5hcHBseSggdGhpcywgYXJndW1lbnRzICkgKTtcblx0fSxcblxuXHRmaXJzdDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZXEoIDAgKTtcblx0fSxcblxuXHRsYXN0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5lcSggLTEgKTtcblx0fSxcblxuXHRlcTogZnVuY3Rpb24oIGkgKSB7XG5cdFx0dmFyIGxlbiA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0aiA9ICtpICsgKCBpIDwgMCA/IGxlbiA6IDAgKTtcblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGogPj0gMCAmJiBqIDwgbGVuID8gWyB0aGlzW2pdIF0gOiBbXSApO1xuXHR9LFxuXG5cdG1hcDogZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggalF1ZXJ5Lm1hcCh0aGlzLCBmdW5jdGlvbiggZWxlbSwgaSApIHtcblx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKCBlbGVtLCBpLCBlbGVtICk7XG5cdFx0fSkpO1xuXHR9LFxuXG5cdGVuZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJldk9iamVjdCB8fCB0aGlzLmNvbnN0cnVjdG9yKG51bGwpO1xuXHR9LFxuXG5cdC8vIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cblx0Ly8gQmVoYXZlcyBsaWtlIGFuIEFycmF5J3MgbWV0aG9kLCBub3QgbGlrZSBhIGpRdWVyeSBtZXRob2QuXG5cdHB1c2g6IGNvcmVfcHVzaCxcblx0c29ydDogW10uc29ydCxcblx0c3BsaWNlOiBbXS5zcGxpY2Vcbn07XG5cbi8vIEdpdmUgdGhlIGluaXQgZnVuY3Rpb24gdGhlIGpRdWVyeSBwcm90b3R5cGUgZm9yIGxhdGVyIGluc3RhbnRpYXRpb25cbmpRdWVyeS5mbi5pbml0LnByb3RvdHlwZSA9IGpRdWVyeS5mbjtcblxualF1ZXJ5LmV4dGVuZCA9IGpRdWVyeS5mbi5leHRlbmQgPSBmdW5jdGlvbigpIHtcblx0dmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuXHRcdHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcblx0XHRpID0gMSxcblx0XHRsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuXHRcdGRlZXAgPSBmYWxzZTtcblxuXHQvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG5cdGlmICggdHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0ZGVlcCA9IHRhcmdldDtcblx0XHR0YXJnZXQgPSBhcmd1bWVudHNbMV0gfHwge307XG5cdFx0Ly8gc2tpcCB0aGUgYm9vbGVhbiBhbmQgdGhlIHRhcmdldFxuXHRcdGkgPSAyO1xuXHR9XG5cblx0Ly8gSGFuZGxlIGNhc2Ugd2hlbiB0YXJnZXQgaXMgYSBzdHJpbmcgb3Igc29tZXRoaW5nIChwb3NzaWJsZSBpbiBkZWVwIGNvcHkpXG5cdGlmICggdHlwZW9mIHRhcmdldCAhPT0gXCJvYmplY3RcIiAmJiAhalF1ZXJ5LmlzRnVuY3Rpb24odGFyZ2V0KSApIHtcblx0XHR0YXJnZXQgPSB7fTtcblx0fVxuXG5cdC8vIGV4dGVuZCBqUXVlcnkgaXRzZWxmIGlmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHBhc3NlZFxuXHRpZiAoIGxlbmd0aCA9PT0gaSApIHtcblx0XHR0YXJnZXQgPSB0aGlzO1xuXHRcdC0taTtcblx0fVxuXG5cdGZvciAoIDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdC8vIE9ubHkgZGVhbCB3aXRoIG5vbi1udWxsL3VuZGVmaW5lZCB2YWx1ZXNcblx0XHRpZiAoIChvcHRpb25zID0gYXJndW1lbnRzWyBpIF0pICE9IG51bGwgKSB7XG5cdFx0XHQvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG5cdFx0XHRmb3IgKCBuYW1lIGluIG9wdGlvbnMgKSB7XG5cdFx0XHRcdHNyYyA9IHRhcmdldFsgbmFtZSBdO1xuXHRcdFx0XHRjb3B5ID0gb3B0aW9uc1sgbmFtZSBdO1xuXG5cdFx0XHRcdC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3Bcblx0XHRcdFx0aWYgKCB0YXJnZXQgPT09IGNvcHkgKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcblx0XHRcdFx0aWYgKCBkZWVwICYmIGNvcHkgJiYgKCBqUXVlcnkuaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBqUXVlcnkuaXNBcnJheShjb3B5KSkgKSApIHtcblx0XHRcdFx0XHRpZiAoIGNvcHlJc0FycmF5ICkge1xuXHRcdFx0XHRcdFx0Y29weUlzQXJyYXkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGNsb25lID0gc3JjICYmIGpRdWVyeS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjbG9uZSA9IHNyYyAmJiBqUXVlcnkuaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG5cdFx0XHRcdFx0dGFyZ2V0WyBuYW1lIF0gPSBqUXVlcnkuZXh0ZW5kKCBkZWVwLCBjbG9uZSwgY29weSApO1xuXG5cdFx0XHRcdC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHRhcmdldFsgbmFtZSBdID0gY29weTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG5cdHJldHVybiB0YXJnZXQ7XG59O1xuXG5qUXVlcnkuZXh0ZW5kKHtcblx0Ly8gVW5pcXVlIGZvciBlYWNoIGNvcHkgb2YgalF1ZXJ5IG9uIHRoZSBwYWdlXG5cdGV4cGFuZG86IFwialF1ZXJ5XCIgKyAoIGNvcmVfdmVyc2lvbiArIE1hdGgucmFuZG9tKCkgKS5yZXBsYWNlKCAvXFxEL2csIFwiXCIgKSxcblxuXHRub0NvbmZsaWN0OiBmdW5jdGlvbiggZGVlcCApIHtcblx0XHRpZiAoIHdpbmRvdy4kID09PSBqUXVlcnkgKSB7XG5cdFx0XHR3aW5kb3cuJCA9IF8kO1xuXHRcdH1cblxuXHRcdGlmICggZGVlcCAmJiB3aW5kb3cualF1ZXJ5ID09PSBqUXVlcnkgKSB7XG5cdFx0XHR3aW5kb3cualF1ZXJ5ID0gX2pRdWVyeTtcblx0XHR9XG5cblx0XHRyZXR1cm4galF1ZXJ5O1xuXHR9LFxuXG5cdC8vIElzIHRoZSBET00gcmVhZHkgdG8gYmUgdXNlZD8gU2V0IHRvIHRydWUgb25jZSBpdCBvY2N1cnMuXG5cdGlzUmVhZHk6IGZhbHNlLFxuXG5cdC8vIEEgY291bnRlciB0byB0cmFjayBob3cgbWFueSBpdGVtcyB0byB3YWl0IGZvciBiZWZvcmVcblx0Ly8gdGhlIHJlYWR5IGV2ZW50IGZpcmVzLiBTZWUgIzY3ODFcblx0cmVhZHlXYWl0OiAxLFxuXG5cdC8vIEhvbGQgKG9yIHJlbGVhc2UpIHRoZSByZWFkeSBldmVudFxuXHRob2xkUmVhZHk6IGZ1bmN0aW9uKCBob2xkICkge1xuXHRcdGlmICggaG9sZCApIHtcblx0XHRcdGpRdWVyeS5yZWFkeVdhaXQrKztcblx0XHR9IGVsc2Uge1xuXHRcdFx0alF1ZXJ5LnJlYWR5KCB0cnVlICk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIEhhbmRsZSB3aGVuIHRoZSBET00gaXMgcmVhZHlcblx0cmVhZHk6IGZ1bmN0aW9uKCB3YWl0ICkge1xuXG5cdFx0Ly8gQWJvcnQgaWYgdGhlcmUgYXJlIHBlbmRpbmcgaG9sZHMgb3Igd2UncmUgYWxyZWFkeSByZWFkeVxuXHRcdGlmICggd2FpdCA9PT0gdHJ1ZSA/IC0talF1ZXJ5LnJlYWR5V2FpdCA6IGpRdWVyeS5pc1JlYWR5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFJlbWVtYmVyIHRoYXQgdGhlIERPTSBpcyByZWFkeVxuXHRcdGpRdWVyeS5pc1JlYWR5ID0gdHJ1ZTtcblxuXHRcdC8vIElmIGEgbm9ybWFsIERPTSBSZWFkeSBldmVudCBmaXJlZCwgZGVjcmVtZW50LCBhbmQgd2FpdCBpZiBuZWVkIGJlXG5cdFx0aWYgKCB3YWl0ICE9PSB0cnVlICYmIC0talF1ZXJ5LnJlYWR5V2FpdCA+IDAgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlcmUgYXJlIGZ1bmN0aW9ucyBib3VuZCwgdG8gZXhlY3V0ZVxuXHRcdHJlYWR5TGlzdC5yZXNvbHZlV2l0aCggZG9jdW1lbnQsIFsgalF1ZXJ5IF0gKTtcblxuXHRcdC8vIFRyaWdnZXIgYW55IGJvdW5kIHJlYWR5IGV2ZW50c1xuXHRcdGlmICggalF1ZXJ5LmZuLnRyaWdnZXIgKSB7XG5cdFx0XHRqUXVlcnkoIGRvY3VtZW50ICkudHJpZ2dlcihcInJlYWR5XCIpLm9mZihcInJlYWR5XCIpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBTZWUgdGVzdC91bml0L2NvcmUuanMgZm9yIGRldGFpbHMgY29uY2VybmluZyBpc0Z1bmN0aW9uLlxuXHQvLyBTaW5jZSB2ZXJzaW9uIDEuMywgRE9NIG1ldGhvZHMgYW5kIGZ1bmN0aW9ucyBsaWtlIGFsZXJ0XG5cdC8vIGFyZW4ndCBzdXBwb3J0ZWQuIFRoZXkgcmV0dXJuIGZhbHNlIG9uIElFICgjMjk2OCkuXG5cdGlzRnVuY3Rpb246IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS50eXBlKG9iaikgPT09IFwiZnVuY3Rpb25cIjtcblx0fSxcblxuXHRpc0FycmF5OiBBcnJheS5pc0FycmF5LFxuXG5cdGlzV2luZG93OiBmdW5jdGlvbiggb2JqICkge1xuXHRcdHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmogPT09IG9iai53aW5kb3c7XG5cdH0sXG5cblx0aXNOdW1lcmljOiBmdW5jdGlvbiggb2JqICkge1xuXHRcdHJldHVybiAhaXNOYU4oIHBhcnNlRmxvYXQob2JqKSApICYmIGlzRmluaXRlKCBvYmogKTtcblx0fSxcblxuXHR0eXBlOiBmdW5jdGlvbiggb2JqICkge1xuXHRcdGlmICggb2JqID09IG51bGwgKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKCBvYmogKTtcblx0XHR9XG5cdFx0Ly8gU3VwcG9ydDogU2FmYXJpIDw9IDUuMSAoZnVuY3Rpb25pc2ggUmVnRXhwKVxuXHRcdHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/XG5cdFx0XHRjbGFzczJ0eXBlWyBjb3JlX3RvU3RyaW5nLmNhbGwob2JqKSBdIHx8IFwib2JqZWN0XCIgOlxuXHRcdFx0dHlwZW9mIG9iajtcblx0fSxcblxuXHRpc1BsYWluT2JqZWN0OiBmdW5jdGlvbiggb2JqICkge1xuXHRcdC8vIE5vdCBwbGFpbiBvYmplY3RzOlxuXHRcdC8vIC0gQW55IG9iamVjdCBvciB2YWx1ZSB3aG9zZSBpbnRlcm5hbCBbW0NsYXNzXV0gcHJvcGVydHkgaXMgbm90IFwiW29iamVjdCBPYmplY3RdXCJcblx0XHQvLyAtIERPTSBub2Rlc1xuXHRcdC8vIC0gd2luZG93XG5cdFx0aWYgKCBqUXVlcnkudHlwZSggb2JqICkgIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8IGpRdWVyeS5pc1dpbmRvdyggb2JqICkgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gU3VwcG9ydDogRmlyZWZveCA8MjBcblx0XHQvLyBUaGUgdHJ5L2NhdGNoIHN1cHByZXNzZXMgZXhjZXB0aW9ucyB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIGFjY2Vzc1xuXHRcdC8vIHRoZSBcImNvbnN0cnVjdG9yXCIgcHJvcGVydHkgb2YgY2VydGFpbiBob3N0IG9iamVjdHMsIGllLiB8d2luZG93LmxvY2F0aW9ufFxuXHRcdC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTgxNDYyMlxuXHRcdHRyeSB7XG5cdFx0XHRpZiAoIG9iai5jb25zdHJ1Y3RvciAmJlxuXHRcdFx0XHRcdCFjb3JlX2hhc093bi5jYWxsKCBvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCBcImlzUHJvdG90eXBlT2ZcIiApICkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIGZ1bmN0aW9uIGhhc24ndCByZXR1cm5lZCBhbHJlYWR5LCB3ZSdyZSBjb25maWRlbnQgdGhhdFxuXHRcdC8vIHxvYmp8IGlzIGEgcGxhaW4gb2JqZWN0LCBjcmVhdGVkIGJ5IHt9IG9yIGNvbnN0cnVjdGVkIHdpdGggbmV3IE9iamVjdFxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0dmFyIG5hbWU7XG5cdFx0Zm9yICggbmFtZSBpbiBvYmogKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdGVycm9yOiBmdW5jdGlvbiggbXNnICkge1xuXHRcdHRocm93IG5ldyBFcnJvciggbXNnICk7XG5cdH0sXG5cblx0Ly8gZGF0YTogc3RyaW5nIG9mIGh0bWxcblx0Ly8gY29udGV4dCAob3B0aW9uYWwpOiBJZiBzcGVjaWZpZWQsIHRoZSBmcmFnbWVudCB3aWxsIGJlIGNyZWF0ZWQgaW4gdGhpcyBjb250ZXh0LCBkZWZhdWx0cyB0byBkb2N1bWVudFxuXHQvLyBrZWVwU2NyaXB0cyAob3B0aW9uYWwpOiBJZiB0cnVlLCB3aWxsIGluY2x1ZGUgc2NyaXB0cyBwYXNzZWQgaW4gdGhlIGh0bWwgc3RyaW5nXG5cdHBhcnNlSFRNTDogZnVuY3Rpb24oIGRhdGEsIGNvbnRleHQsIGtlZXBTY3JpcHRzICkge1xuXHRcdGlmICggIWRhdGEgfHwgdHlwZW9mIGRhdGEgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0aWYgKCB0eXBlb2YgY29udGV4dCA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0XHRrZWVwU2NyaXB0cyA9IGNvbnRleHQ7XG5cdFx0XHRjb250ZXh0ID0gZmFsc2U7XG5cdFx0fVxuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0dmFyIHBhcnNlZCA9IHJzaW5nbGVUYWcuZXhlYyggZGF0YSApLFxuXHRcdFx0c2NyaXB0cyA9ICFrZWVwU2NyaXB0cyAmJiBbXTtcblxuXHRcdC8vIFNpbmdsZSB0YWdcblx0XHRpZiAoIHBhcnNlZCApIHtcblx0XHRcdHJldHVybiBbIGNvbnRleHQuY3JlYXRlRWxlbWVudCggcGFyc2VkWzFdICkgXTtcblx0XHR9XG5cblx0XHRwYXJzZWQgPSBqUXVlcnkuYnVpbGRGcmFnbWVudCggWyBkYXRhIF0sIGNvbnRleHQsIHNjcmlwdHMgKTtcblxuXHRcdGlmICggc2NyaXB0cyApIHtcblx0XHRcdGpRdWVyeSggc2NyaXB0cyApLnJlbW92ZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkubWVyZ2UoIFtdLCBwYXJzZWQuY2hpbGROb2RlcyApO1xuXHR9LFxuXG5cdHBhcnNlSlNPTjogSlNPTi5wYXJzZSxcblxuXHQvLyBDcm9zcy1icm93c2VyIHhtbCBwYXJzaW5nXG5cdHBhcnNlWE1MOiBmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgeG1sLCB0bXA7XG5cdFx0aWYgKCAhZGF0YSB8fCB0eXBlb2YgZGF0YSAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdC8vIFN1cHBvcnQ6IElFOVxuXHRcdHRyeSB7XG5cdFx0XHR0bXAgPSBuZXcgRE9NUGFyc2VyKCk7XG5cdFx0XHR4bWwgPSB0bXAucGFyc2VGcm9tU3RyaW5nKCBkYXRhICwgXCJ0ZXh0L3htbFwiICk7XG5cdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHR4bWwgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0aWYgKCAheG1sIHx8IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJwYXJzZXJlcnJvclwiICkubGVuZ3RoICkge1xuXHRcdFx0alF1ZXJ5LmVycm9yKCBcIkludmFsaWQgWE1MOiBcIiArIGRhdGEgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHhtbDtcblx0fSxcblxuXHRub29wOiBmdW5jdGlvbigpIHt9LFxuXG5cdC8vIEV2YWx1YXRlcyBhIHNjcmlwdCBpbiBhIGdsb2JhbCBjb250ZXh0XG5cdGdsb2JhbEV2YWw6IGZ1bmN0aW9uKCBjb2RlICkge1xuXHRcdHZhciBzY3JpcHQsXG5cdFx0XHRcdGluZGlyZWN0ID0gZXZhbDtcblxuXHRcdGNvZGUgPSBqUXVlcnkudHJpbSggY29kZSApO1xuXG5cdFx0aWYgKCBjb2RlICkge1xuXHRcdFx0Ly8gSWYgdGhlIGNvZGUgaW5jbHVkZXMgYSB2YWxpZCwgcHJvbG9ndWUgcG9zaXRpb25cblx0XHRcdC8vIHN0cmljdCBtb2RlIHByYWdtYSwgZXhlY3V0ZSBjb2RlIGJ5IGluamVjdGluZyBhXG5cdFx0XHQvLyBzY3JpcHQgdGFnIGludG8gdGhlIGRvY3VtZW50LlxuXHRcdFx0aWYgKCBjb2RlLmluZGV4T2YoXCJ1c2Ugc3RyaWN0XCIpID09PSAxICkge1xuXHRcdFx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuXHRcdFx0XHRzY3JpcHQudGV4dCA9IGNvZGU7XG5cdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoIHNjcmlwdCApLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHNjcmlwdCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdC8vIE90aGVyd2lzZSwgYXZvaWQgdGhlIERPTSBub2RlIGNyZWF0aW9uLCBpbnNlcnRpb25cblx0XHRcdC8vIGFuZCByZW1vdmFsIGJ5IHVzaW5nIGFuIGluZGlyZWN0IGdsb2JhbCBldmFsXG5cdFx0XHRcdGluZGlyZWN0KCBjb2RlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8vIENvbnZlcnQgZGFzaGVkIHRvIGNhbWVsQ2FzZTsgdXNlZCBieSB0aGUgY3NzIGFuZCBkYXRhIG1vZHVsZXNcblx0Ly8gTWljcm9zb2Z0IGZvcmdvdCB0byBodW1wIHRoZWlyIHZlbmRvciBwcmVmaXggKCM5NTcyKVxuXHRjYW1lbENhc2U6IGZ1bmN0aW9uKCBzdHJpbmcgKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKCBybXNQcmVmaXgsIFwibXMtXCIgKS5yZXBsYWNlKCByZGFzaEFscGhhLCBmY2FtZWxDYXNlICk7XG5cdH0sXG5cblx0bm9kZU5hbWU6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdHJldHVybiBlbGVtLm5vZGVOYW1lICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXHR9LFxuXG5cdC8vIGFyZ3MgaXMgZm9yIGludGVybmFsIHVzYWdlIG9ubHlcblx0ZWFjaDogZnVuY3Rpb24oIG9iaiwgY2FsbGJhY2ssIGFyZ3MgKSB7XG5cdFx0dmFyIHZhbHVlLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRsZW5ndGggPSBvYmoubGVuZ3RoLFxuXHRcdFx0aXNBcnJheSA9IGlzQXJyYXlsaWtlKCBvYmogKTtcblxuXHRcdGlmICggYXJncyApIHtcblx0XHRcdGlmICggaXNBcnJheSApIHtcblx0XHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjYWxsYmFjay5hcHBseSggb2JqWyBpIF0sIGFyZ3MgKTtcblxuXHRcdFx0XHRcdGlmICggdmFsdWUgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCBpIGluIG9iaiApIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNhbGxiYWNrLmFwcGx5KCBvYmpbIGkgXSwgYXJncyApO1xuXG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEEgc3BlY2lhbCwgZmFzdCwgY2FzZSBmb3IgdGhlIG1vc3QgY29tbW9uIHVzZSBvZiBlYWNoXG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggaXNBcnJheSApIHtcblx0XHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjYWxsYmFjay5jYWxsKCBvYmpbIGkgXSwgaSwgb2JqWyBpIF0gKTtcblxuXHRcdFx0XHRcdGlmICggdmFsdWUgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKCBpIGluIG9iaiApIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNhbGxiYWNrLmNhbGwoIG9ialsgaSBdLCBpLCBvYmpbIGkgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9LFxuXG5cdHRyaW06IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdHJldHVybiB0ZXh0ID09IG51bGwgPyBcIlwiIDogY29yZV90cmltLmNhbGwoIHRleHQgKTtcblx0fSxcblxuXHQvLyByZXN1bHRzIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdG1ha2VBcnJheTogZnVuY3Rpb24oIGFyciwgcmVzdWx0cyApIHtcblx0XHR2YXIgcmV0ID0gcmVzdWx0cyB8fCBbXTtcblxuXHRcdGlmICggYXJyICE9IG51bGwgKSB7XG5cdFx0XHRpZiAoIGlzQXJyYXlsaWtlKCBPYmplY3QoYXJyKSApICkge1xuXHRcdFx0XHRqUXVlcnkubWVyZ2UoIHJldCxcblx0XHRcdFx0XHR0eXBlb2YgYXJyID09PSBcInN0cmluZ1wiID9cblx0XHRcdFx0XHRbIGFyciBdIDogYXJyXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb3JlX3B1c2guY2FsbCggcmV0LCBhcnIgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGluQXJyYXk6IGZ1bmN0aW9uKCBlbGVtLCBhcnIsIGkgKSB7XG5cdFx0cmV0dXJuIGFyciA9PSBudWxsID8gLTEgOiBjb3JlX2luZGV4T2YuY2FsbCggYXJyLCBlbGVtLCBpICk7XG5cdH0sXG5cblx0bWVyZ2U6IGZ1bmN0aW9uKCBmaXJzdCwgc2Vjb25kICkge1xuXHRcdHZhciBsID0gc2Vjb25kLmxlbmd0aCxcblx0XHRcdGkgPSBmaXJzdC5sZW5ndGgsXG5cdFx0XHRqID0gMDtcblxuXHRcdGlmICggdHlwZW9mIGwgPT09IFwibnVtYmVyXCIgKSB7XG5cdFx0XHRmb3IgKCA7IGogPCBsOyBqKysgKSB7XG5cdFx0XHRcdGZpcnN0WyBpKysgXSA9IHNlY29uZFsgaiBdO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aGlsZSAoIHNlY29uZFtqXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRmaXJzdFsgaSsrIF0gPSBzZWNvbmRbIGorKyBdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZpcnN0Lmxlbmd0aCA9IGk7XG5cblx0XHRyZXR1cm4gZmlyc3Q7XG5cdH0sXG5cblx0Z3JlcDogZnVuY3Rpb24oIGVsZW1zLCBjYWxsYmFjaywgaW52ICkge1xuXHRcdHZhciByZXRWYWwsXG5cdFx0XHRyZXQgPSBbXSxcblx0XHRcdGkgPSAwLFxuXHRcdFx0bGVuZ3RoID0gZWxlbXMubGVuZ3RoO1xuXHRcdGludiA9ICEhaW52O1xuXG5cdFx0Ly8gR28gdGhyb3VnaCB0aGUgYXJyYXksIG9ubHkgc2F2aW5nIHRoZSBpdGVtc1xuXHRcdC8vIHRoYXQgcGFzcyB0aGUgdmFsaWRhdG9yIGZ1bmN0aW9uXG5cdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRyZXRWYWwgPSAhIWNhbGxiYWNrKCBlbGVtc1sgaSBdLCBpICk7XG5cdFx0XHRpZiAoIGludiAhPT0gcmV0VmFsICkge1xuXHRcdFx0XHRyZXQucHVzaCggZWxlbXNbIGkgXSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0Ly8gYXJnIGlzIGZvciBpbnRlcm5hbCB1c2FnZSBvbmx5XG5cdG1hcDogZnVuY3Rpb24oIGVsZW1zLCBjYWxsYmFjaywgYXJnICkge1xuXHRcdHZhciB2YWx1ZSxcblx0XHRcdGkgPSAwLFxuXHRcdFx0bGVuZ3RoID0gZWxlbXMubGVuZ3RoLFxuXHRcdFx0aXNBcnJheSA9IGlzQXJyYXlsaWtlKCBlbGVtcyApLFxuXHRcdFx0cmV0ID0gW107XG5cblx0XHQvLyBHbyB0aHJvdWdoIHRoZSBhcnJheSwgdHJhbnNsYXRpbmcgZWFjaCBvZiB0aGUgaXRlbXMgdG8gdGhlaXJcblx0XHRpZiAoIGlzQXJyYXkgKSB7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0dmFsdWUgPSBjYWxsYmFjayggZWxlbXNbIGkgXSwgaSwgYXJnICk7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZSAhPSBudWxsICkge1xuXHRcdFx0XHRcdHJldFsgcmV0Lmxlbmd0aCBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEdvIHRocm91Z2ggZXZlcnkga2V5IG9uIHRoZSBvYmplY3QsXG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGkgaW4gZWxlbXMgKSB7XG5cdFx0XHRcdHZhbHVlID0gY2FsbGJhY2soIGVsZW1zWyBpIF0sIGksIGFyZyApO1xuXG5cdFx0XHRcdGlmICggdmFsdWUgIT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXRbIHJldC5sZW5ndGggXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmxhdHRlbiBhbnkgbmVzdGVkIGFycmF5c1xuXHRcdHJldHVybiBjb3JlX2NvbmNhdC5hcHBseSggW10sIHJldCApO1xuXHR9LFxuXG5cdC8vIEEgZ2xvYmFsIEdVSUQgY291bnRlciBmb3Igb2JqZWN0c1xuXHRndWlkOiAxLFxuXG5cdC8vIEJpbmQgYSBmdW5jdGlvbiB0byBhIGNvbnRleHQsIG9wdGlvbmFsbHkgcGFydGlhbGx5IGFwcGx5aW5nIGFueVxuXHQvLyBhcmd1bWVudHMuXG5cdHByb3h5OiBmdW5jdGlvbiggZm4sIGNvbnRleHQgKSB7XG5cdFx0dmFyIHRtcCwgYXJncywgcHJveHk7XG5cblx0XHRpZiAoIHR5cGVvZiBjb250ZXh0ID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0dG1wID0gZm5bIGNvbnRleHQgXTtcblx0XHRcdGNvbnRleHQgPSBmbjtcblx0XHRcdGZuID0gdG1wO1xuXHRcdH1cblxuXHRcdC8vIFF1aWNrIGNoZWNrIHRvIGRldGVybWluZSBpZiB0YXJnZXQgaXMgY2FsbGFibGUsIGluIHRoZSBzcGVjXG5cdFx0Ly8gdGhpcyB0aHJvd3MgYSBUeXBlRXJyb3IsIGJ1dCB3ZSB3aWxsIGp1c3QgcmV0dXJuIHVuZGVmaW5lZC5cblx0XHRpZiAoICFqUXVlcnkuaXNGdW5jdGlvbiggZm4gKSApIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gU2ltdWxhdGVkIGJpbmRcblx0XHRhcmdzID0gY29yZV9zbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKTtcblx0XHRwcm94eSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGZuLmFwcGx5KCBjb250ZXh0IHx8IHRoaXMsIGFyZ3MuY29uY2F0KCBjb3JlX3NsaWNlLmNhbGwoIGFyZ3VtZW50cyApICkgKTtcblx0XHR9O1xuXG5cdFx0Ly8gU2V0IHRoZSBndWlkIG9mIHVuaXF1ZSBoYW5kbGVyIHRvIHRoZSBzYW1lIG9mIG9yaWdpbmFsIGhhbmRsZXIsIHNvIGl0IGNhbiBiZSByZW1vdmVkXG5cdFx0cHJveHkuZ3VpZCA9IGZuLmd1aWQgPSBmbi5ndWlkIHx8IGpRdWVyeS5ndWlkKys7XG5cblx0XHRyZXR1cm4gcHJveHk7XG5cdH0sXG5cblx0Ly8gTXVsdGlmdW5jdGlvbmFsIG1ldGhvZCB0byBnZXQgYW5kIHNldCB2YWx1ZXMgb2YgYSBjb2xsZWN0aW9uXG5cdC8vIFRoZSB2YWx1ZS9zIGNhbiBvcHRpb25hbGx5IGJlIGV4ZWN1dGVkIGlmIGl0J3MgYSBmdW5jdGlvblxuXHRhY2Nlc3M6IGZ1bmN0aW9uKCBlbGVtcywgZm4sIGtleSwgdmFsdWUsIGNoYWluYWJsZSwgZW1wdHlHZXQsIHJhdyApIHtcblx0XHR2YXIgaSA9IDAsXG5cdFx0XHRsZW5ndGggPSBlbGVtcy5sZW5ndGgsXG5cdFx0XHRidWxrID0ga2V5ID09IG51bGw7XG5cblx0XHQvLyBTZXRzIG1hbnkgdmFsdWVzXG5cdFx0aWYgKCBqUXVlcnkudHlwZSgga2V5ICkgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0XHRjaGFpbmFibGUgPSB0cnVlO1xuXHRcdFx0Zm9yICggaSBpbiBrZXkgKSB7XG5cdFx0XHRcdGpRdWVyeS5hY2Nlc3MoIGVsZW1zLCBmbiwgaSwga2V5W2ldLCB0cnVlLCBlbXB0eUdldCwgcmF3ICk7XG5cdFx0XHR9XG5cblx0XHQvLyBTZXRzIG9uZSB2YWx1ZVxuXHRcdH0gZWxzZSBpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRjaGFpbmFibGUgPSB0cnVlO1xuXG5cdFx0XHRpZiAoICFqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcblx0XHRcdFx0cmF3ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBidWxrICkge1xuXHRcdFx0XHQvLyBCdWxrIG9wZXJhdGlvbnMgcnVuIGFnYWluc3QgdGhlIGVudGlyZSBzZXRcblx0XHRcdFx0aWYgKCByYXcgKSB7XG5cdFx0XHRcdFx0Zm4uY2FsbCggZWxlbXMsIHZhbHVlICk7XG5cdFx0XHRcdFx0Zm4gPSBudWxsO1xuXG5cdFx0XHRcdC8vIC4uLmV4Y2VwdCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvbiB2YWx1ZXNcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRidWxrID0gZm47XG5cdFx0XHRcdFx0Zm4gPSBmdW5jdGlvbiggZWxlbSwga2V5LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBidWxrLmNhbGwoIGpRdWVyeSggZWxlbSApLCB2YWx1ZSApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBmbiApIHtcblx0XHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0Zm4oIGVsZW1zW2ldLCBrZXksIHJhdyA/IHZhbHVlIDogdmFsdWUuY2FsbCggZWxlbXNbaV0sIGksIGZuKCBlbGVtc1tpXSwga2V5ICkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNoYWluYWJsZSA/XG5cdFx0XHRlbGVtcyA6XG5cblx0XHRcdC8vIEdldHNcblx0XHRcdGJ1bGsgP1xuXHRcdFx0XHRmbi5jYWxsKCBlbGVtcyApIDpcblx0XHRcdFx0bGVuZ3RoID8gZm4oIGVsZW1zWzBdLCBrZXkgKSA6IGVtcHR5R2V0O1xuXHR9LFxuXG5cdG5vdzogRGF0ZS5ub3csXG5cblx0Ly8gQSBtZXRob2QgZm9yIHF1aWNrbHkgc3dhcHBpbmcgaW4vb3V0IENTUyBwcm9wZXJ0aWVzIHRvIGdldCBjb3JyZWN0IGNhbGN1bGF0aW9ucy5cblx0Ly8gTm90ZTogdGhpcyBtZXRob2QgYmVsb25ncyB0byB0aGUgY3NzIG1vZHVsZSBidXQgaXQncyBuZWVkZWQgaGVyZSBmb3IgdGhlIHN1cHBvcnQgbW9kdWxlLlxuXHQvLyBJZiBzdXBwb3J0IGdldHMgbW9kdWxhcml6ZWQsIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBtb3ZlZCBiYWNrIHRvIHRoZSBjc3MgbW9kdWxlLlxuXHRzd2FwOiBmdW5jdGlvbiggZWxlbSwgb3B0aW9ucywgY2FsbGJhY2ssIGFyZ3MgKSB7XG5cdFx0dmFyIHJldCwgbmFtZSxcblx0XHRcdG9sZCA9IHt9O1xuXG5cdFx0Ly8gUmVtZW1iZXIgdGhlIG9sZCB2YWx1ZXMsIGFuZCBpbnNlcnQgdGhlIG5ldyBvbmVzXG5cdFx0Zm9yICggbmFtZSBpbiBvcHRpb25zICkge1xuXHRcdFx0b2xkWyBuYW1lIF0gPSBlbGVtLnN0eWxlWyBuYW1lIF07XG5cdFx0XHRlbGVtLnN0eWxlWyBuYW1lIF0gPSBvcHRpb25zWyBuYW1lIF07XG5cdFx0fVxuXG5cdFx0cmV0ID0gY2FsbGJhY2suYXBwbHkoIGVsZW0sIGFyZ3MgfHwgW10gKTtcblxuXHRcdC8vIFJldmVydCB0aGUgb2xkIHZhbHVlc1xuXHRcdGZvciAoIG5hbWUgaW4gb3B0aW9ucyApIHtcblx0XHRcdGVsZW0uc3R5bGVbIG5hbWUgXSA9IG9sZFsgbmFtZSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXQ7XG5cdH1cbn0pO1xuXG5qUXVlcnkucmVhZHkucHJvbWlzZSA9IGZ1bmN0aW9uKCBvYmogKSB7XG5cdGlmICggIXJlYWR5TGlzdCApIHtcblxuXHRcdHJlYWR5TGlzdCA9IGpRdWVyeS5EZWZlcnJlZCgpO1xuXG5cdFx0Ly8gQ2F0Y2ggY2FzZXMgd2hlcmUgJChkb2N1bWVudCkucmVhZHkoKSBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGJyb3dzZXIgZXZlbnQgaGFzIGFscmVhZHkgb2NjdXJyZWQuXG5cdFx0Ly8gd2Ugb25jZSB0cmllZCB0byB1c2UgcmVhZHlTdGF0ZSBcImludGVyYWN0aXZlXCIgaGVyZSwgYnV0IGl0IGNhdXNlZCBpc3N1ZXMgbGlrZSB0aGUgb25lXG5cdFx0Ly8gZGlzY292ZXJlZCBieSBDaHJpc1MgaGVyZTogaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTIyODIjY29tbWVudDoxNVxuXHRcdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiICkge1xuXHRcdFx0Ly8gSGFuZGxlIGl0IGFzeW5jaHJvbm91c2x5IHRvIGFsbG93IHNjcmlwdHMgdGhlIG9wcG9ydHVuaXR5IHRvIGRlbGF5IHJlYWR5XG5cdFx0XHRzZXRUaW1lb3V0KCBqUXVlcnkucmVhZHkgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFVzZSB0aGUgaGFuZHkgZXZlbnQgY2FsbGJhY2tcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiRE9NQ29udGVudExvYWRlZFwiLCBjb21wbGV0ZWQsIGZhbHNlICk7XG5cblx0XHRcdC8vIEEgZmFsbGJhY2sgdG8gd2luZG93Lm9ubG9hZCwgdGhhdCB3aWxsIGFsd2F5cyB3b3JrXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggXCJsb2FkXCIsIGNvbXBsZXRlZCwgZmFsc2UgKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlYWR5TGlzdC5wcm9taXNlKCBvYmogKTtcbn07XG5cbi8vIFBvcHVsYXRlIHRoZSBjbGFzczJ0eXBlIG1hcFxualF1ZXJ5LmVhY2goXCJCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0IEVycm9yXCIuc3BsaXQoXCIgXCIpLCBmdW5jdGlvbihpLCBuYW1lKSB7XG5cdGNsYXNzMnR5cGVbIFwiW29iamVjdCBcIiArIG5hbWUgKyBcIl1cIiBdID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xufSk7XG5cbmZ1bmN0aW9uIGlzQXJyYXlsaWtlKCBvYmogKSB7XG5cdHZhciBsZW5ndGggPSBvYmoubGVuZ3RoLFxuXHRcdHR5cGUgPSBqUXVlcnkudHlwZSggb2JqICk7XG5cblx0aWYgKCBqUXVlcnkuaXNXaW5kb3coIG9iaiApICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmICggb2JqLm5vZGVUeXBlID09PSAxICYmIGxlbmd0aCApIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiB0eXBlID09PSBcImFycmF5XCIgfHwgdHlwZSAhPT0gXCJmdW5jdGlvblwiICYmXG5cdFx0KCBsZW5ndGggPT09IDAgfHxcblx0XHR0eXBlb2YgbGVuZ3RoID09PSBcIm51bWJlclwiICYmIGxlbmd0aCA+IDAgJiYgKCBsZW5ndGggLSAxICkgaW4gb2JqICk7XG59XG5cbi8vIEFsbCBqUXVlcnkgb2JqZWN0cyBzaG91bGQgcG9pbnQgYmFjayB0byB0aGVzZVxucm9vdGpRdWVyeSA9IGpRdWVyeShkb2N1bWVudCk7XG4vKiFcbiAqIFNpenpsZSBDU1MgU2VsZWN0b3IgRW5naW5lIHYxLjkuNC1wcmVcbiAqIGh0dHA6Ly9zaXp6bGVqcy5jb20vXG4gKlxuICogQ29weXJpZ2h0IDIwMTMgalF1ZXJ5IEZvdW5kYXRpb24sIEluYy4gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogRGF0ZTogMjAxMy0wNi0wM1xuICovXG4oZnVuY3Rpb24oIHdpbmRvdywgdW5kZWZpbmVkICkge1xuXG52YXIgaSxcblx0c3VwcG9ydCxcblx0Y2FjaGVkcnVucyxcblx0RXhwcixcblx0Z2V0VGV4dCxcblx0aXNYTUwsXG5cdGNvbXBpbGUsXG5cdG91dGVybW9zdENvbnRleHQsXG5cdHNvcnRJbnB1dCxcblxuXHQvLyBMb2NhbCBkb2N1bWVudCB2YXJzXG5cdHNldERvY3VtZW50LFxuXHRkb2N1bWVudCxcblx0ZG9jRWxlbSxcblx0ZG9jdW1lbnRJc0hUTUwsXG5cdHJidWdneVFTQSxcblx0cmJ1Z2d5TWF0Y2hlcyxcblx0bWF0Y2hlcyxcblx0Y29udGFpbnMsXG5cblx0Ly8gSW5zdGFuY2Utc3BlY2lmaWMgZGF0YVxuXHRleHBhbmRvID0gXCJzaXp6bGVcIiArIC0obmV3IERhdGUoKSksXG5cdHByZWZlcnJlZERvYyA9IHdpbmRvdy5kb2N1bWVudCxcblx0ZGlycnVucyA9IDAsXG5cdGRvbmUgPSAwLFxuXHRjbGFzc0NhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0dG9rZW5DYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdGNvbXBpbGVyQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRoYXNEdXBsaWNhdGUgPSBmYWxzZSxcblx0c29ydE9yZGVyID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XHRyZXR1cm4gMDtcblx0fSxcblxuXHQvLyBHZW5lcmFsLXB1cnBvc2UgY29uc3RhbnRzXG5cdHN0cnVuZGVmaW5lZCA9IHR5cGVvZiB1bmRlZmluZWQsXG5cdE1BWF9ORUdBVElWRSA9IDEgPDwgMzEsXG5cblx0Ly8gSW5zdGFuY2UgbWV0aG9kc1xuXHRoYXNPd24gPSAoe30pLmhhc093blByb3BlcnR5LFxuXHRhcnIgPSBbXSxcblx0cG9wID0gYXJyLnBvcCxcblx0cHVzaF9uYXRpdmUgPSBhcnIucHVzaCxcblx0cHVzaCA9IGFyci5wdXNoLFxuXHRzbGljZSA9IGFyci5zbGljZSxcblx0Ly8gVXNlIGEgc3RyaXBwZWQtZG93biBpbmRleE9mIGlmIHdlIGNhbid0IHVzZSBhIG5hdGl2ZSBvbmVcblx0aW5kZXhPZiA9IGFyci5pbmRleE9mIHx8IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdGxlbiA9IHRoaXMubGVuZ3RoO1xuXHRcdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0aWYgKCB0aGlzW2ldID09PSBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9LFxuXG5cdGJvb2xlYW5zID0gXCJjaGVja2VkfHNlbGVjdGVkfGFzeW5jfGF1dG9mb2N1c3xhdXRvcGxheXxjb250cm9sc3xkZWZlcnxkaXNhYmxlZHxoaWRkZW58aXNtYXB8bG9vcHxtdWx0aXBsZXxvcGVufHJlYWRvbmx5fHJlcXVpcmVkfHNjb3BlZFwiLFxuXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcblxuXHQvLyBXaGl0ZXNwYWNlIGNoYXJhY3RlcnMgaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1zZWxlY3RvcnMvI3doaXRlc3BhY2Vcblx0d2hpdGVzcGFjZSA9IFwiW1xcXFx4MjBcXFxcdFxcXFxyXFxcXG5cXFxcZl1cIixcblx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1zeW50YXgvI2NoYXJhY3RlcnNcblx0Y2hhcmFjdGVyRW5jb2RpbmcgPSBcIig/OlxcXFxcXFxcLnxbXFxcXHctXXxbXlxcXFx4MDAtXFxcXHhhMF0pK1wiLFxuXG5cdC8vIExvb3NlbHkgbW9kZWxlZCBvbiBDU1MgaWRlbnRpZmllciBjaGFyYWN0ZXJzXG5cdC8vIEFuIHVucXVvdGVkIHZhbHVlIHNob3VsZCBiZSBhIENTUyBpZGVudGlmaWVyIGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtc2VsZWN0b3JzLyNhdHRyaWJ1dGUtc2VsZWN0b3JzXG5cdC8vIFByb3BlciBzeW50YXg6IGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCN2YWx1ZS1kZWYtaWRlbnRpZmllclxuXHRpZGVudGlmaWVyID0gY2hhcmFjdGVyRW5jb2RpbmcucmVwbGFjZSggXCJ3XCIsIFwidyNcIiApLFxuXG5cdC8vIEFjY2VwdGFibGUgb3BlcmF0b3JzIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jYXR0cmlidXRlLXNlbGVjdG9yc1xuXHRhdHRyaWJ1dGVzID0gXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKihcIiArIGNoYXJhY3RlckVuY29kaW5nICsgXCIpXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcIiooPzooWypeJHwhfl0/PSlcIiArIHdoaXRlc3BhY2UgKyBcIiooPzooWydcXFwiXSkoKD86XFxcXFxcXFwufFteXFxcXFxcXFxdKSo/KVxcXFwzfChcIiArIGlkZW50aWZpZXIgKyBcIil8KXwpXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXF1cIixcblxuXHQvLyBQcmVmZXIgYXJndW1lbnRzIHF1b3RlZCxcblx0Ly8gICB0aGVuIG5vdCBjb250YWluaW5nIHBzZXVkb3MvYnJhY2tldHMsXG5cdC8vICAgdGhlbiBhdHRyaWJ1dGUgc2VsZWN0b3JzL25vbi1wYXJlbnRoZXRpY2FsIGV4cHJlc3Npb25zLFxuXHQvLyAgIHRoZW4gYW55dGhpbmcgZWxzZVxuXHQvLyBUaGVzZSBwcmVmZXJlbmNlcyBhcmUgaGVyZSB0byByZWR1Y2UgdGhlIG51bWJlciBvZiBzZWxlY3RvcnNcblx0Ly8gICBuZWVkaW5nIHRva2VuaXplIGluIHRoZSBQU0VVRE8gcHJlRmlsdGVyXG5cdHBzZXVkb3MgPSBcIjooXCIgKyBjaGFyYWN0ZXJFbmNvZGluZyArIFwiKSg/OlxcXFwoKChbJ1xcXCJdKSgoPzpcXFxcXFxcXC58W15cXFxcXFxcXF0pKj8pXFxcXDN8KCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiICsgYXR0cmlidXRlcy5yZXBsYWNlKCAzLCA4ICkgKyBcIikqKXwuKilcXFxcKXwpXCIsXG5cblx0Ly8gTGVhZGluZyBhbmQgbm9uLWVzY2FwZWQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgY2FwdHVyaW5nIHNvbWUgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVycyBwcmVjZWRpbmcgdGhlIGxhdHRlclxuXHRydHJpbSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiK3woKD86XnxbXlxcXFxcXFxcXSkoPzpcXFxcXFxcXC4pKilcIiArIHdoaXRlc3BhY2UgKyBcIiskXCIsIFwiZ1wiICksXG5cblx0cmNvbW1hID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqLFwiICsgd2hpdGVzcGFjZSArIFwiKlwiICksXG5cdHJjb21iaW5hdG9ycyA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKihbPit+XXxcIiArIHdoaXRlc3BhY2UgKyBcIilcIiArIHdoaXRlc3BhY2UgKyBcIipcIiApLFxuXG5cdHJzaWJsaW5nID0gbmV3IFJlZ0V4cCggd2hpdGVzcGFjZSArIFwiKlsrfl1cIiApLFxuXHRyYXR0cmlidXRlUXVvdGVzID0gbmV3IFJlZ0V4cCggXCI9XCIgKyB3aGl0ZXNwYWNlICsgXCIqKFteXFxcXF0nXFxcIl0qKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFxdXCIsIFwiZ1wiICksXG5cblx0cnBzZXVkbyA9IG5ldyBSZWdFeHAoIHBzZXVkb3MgKSxcblx0cmlkZW50aWZpZXIgPSBuZXcgUmVnRXhwKCBcIl5cIiArIGlkZW50aWZpZXIgKyBcIiRcIiApLFxuXG5cdG1hdGNoRXhwciA9IHtcblx0XHRcIklEXCI6IG5ldyBSZWdFeHAoIFwiXiMoXCIgKyBjaGFyYWN0ZXJFbmNvZGluZyArIFwiKVwiICksXG5cdFx0XCJDTEFTU1wiOiBuZXcgUmVnRXhwKCBcIl5cXFxcLihcIiArIGNoYXJhY3RlckVuY29kaW5nICsgXCIpXCIgKSxcblx0XHRcIlRBR1wiOiBuZXcgUmVnRXhwKCBcIl4oXCIgKyBjaGFyYWN0ZXJFbmNvZGluZy5yZXBsYWNlKCBcIndcIiwgXCJ3KlwiICkgKyBcIilcIiApLFxuXHRcdFwiQVRUUlwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIGF0dHJpYnV0ZXMgKSxcblx0XHRcIlBTRVVET1wiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHBzZXVkb3MgKSxcblx0XHRcIkNISUxEXCI6IG5ldyBSZWdFeHAoIFwiXjoob25seXxmaXJzdHxsYXN0fG50aHxudGgtbGFzdCktKGNoaWxkfG9mLXR5cGUpKD86XFxcXChcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIiArIHdoaXRlc3BhY2UgKyBcIiooPzooWystXXwpXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKihcXFxcZCspfCkpXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KVwiLCBcImlcIiApLFxuXHRcdFwiYm9vbFwiOiBuZXcgUmVnRXhwKCBcIl4oPzpcIiArIGJvb2xlYW5zICsgXCIpJFwiLCBcImlcIiApLFxuXHRcdC8vIEZvciB1c2UgaW4gbGlicmFyaWVzIGltcGxlbWVudGluZyAuaXMoKVxuXHRcdC8vIFdlIHVzZSB0aGlzIGZvciBQT1MgbWF0Y2hpbmcgaW4gYHNlbGVjdGBcblx0XHRcIm5lZWRzQ29udGV4dFwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIipbPit+XXw6KGV2ZW58b2RkfGVxfGd0fGx0fG50aHxmaXJzdHxsYXN0KSg/OlxcXFwoXCIgK1xuXHRcdFx0d2hpdGVzcGFjZSArIFwiKigoPzotXFxcXGQpP1xcXFxkKilcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcKXwpKD89W14tXXwkKVwiLCBcImlcIiApXG5cdH0sXG5cblx0cm5hdGl2ZSA9IC9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sXG5cblx0Ly8gRWFzaWx5LXBhcnNlYWJsZS9yZXRyaWV2YWJsZSBJRCBvciBUQUcgb3IgQ0xBU1Mgc2VsZWN0b3JzXG5cdHJxdWlja0V4cHIgPSAvXig/OiMoW1xcdy1dKyl8KFxcdyspfFxcLihbXFx3LV0rKSkkLyxcblxuXHRyaW5wdXRzID0gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaSxcblx0cmhlYWRlciA9IC9eaFxcZCQvaSxcblxuXHRyZXNjYXBlID0gLyd8XFxcXC9nLFxuXG5cdC8vIENTUyBlc2NhcGVzIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCNlc2NhcGVkLWNoYXJhY3RlcnNcblx0cnVuZXNjYXBlID0gbmV3IFJlZ0V4cCggXCJcXFxcXFxcXChbXFxcXGRhLWZdezEsNn1cIiArIHdoaXRlc3BhY2UgKyBcIj98KFwiICsgd2hpdGVzcGFjZSArIFwiKXwuKVwiLCBcImlnXCIgKSxcblx0ZnVuZXNjYXBlID0gZnVuY3Rpb24oIF8sIGVzY2FwZWQsIGVzY2FwZWRXaGl0ZXNwYWNlICkge1xuXHRcdHZhciBoaWdoID0gXCIweFwiICsgZXNjYXBlZCAtIDB4MTAwMDA7XG5cdFx0Ly8gTmFOIG1lYW5zIG5vbi1jb2RlcG9pbnRcblx0XHQvLyBTdXBwb3J0OiBGaXJlZm94XG5cdFx0Ly8gV29ya2Fyb3VuZCBlcnJvbmVvdXMgbnVtZXJpYyBpbnRlcnByZXRhdGlvbiBvZiArXCIweFwiXG5cdFx0cmV0dXJuIGhpZ2ggIT09IGhpZ2ggfHwgZXNjYXBlZFdoaXRlc3BhY2UgP1xuXHRcdFx0ZXNjYXBlZCA6XG5cdFx0XHQvLyBCTVAgY29kZXBvaW50XG5cdFx0XHRoaWdoIDwgMCA/XG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggKyAweDEwMDAwICkgOlxuXHRcdFx0XHQvLyBTdXBwbGVtZW50YWwgUGxhbmUgY29kZXBvaW50IChzdXJyb2dhdGUgcGFpcilcblx0XHRcdFx0U3RyaW5nLmZyb21DaGFyQ29kZSggaGlnaCA+PiAxMCB8IDB4RDgwMCwgaGlnaCAmIDB4M0ZGIHwgMHhEQzAwICk7XG5cdH07XG5cbi8vIE9wdGltaXplIGZvciBwdXNoLmFwcGx5KCBfLCBOb2RlTGlzdCApXG50cnkge1xuXHRwdXNoLmFwcGx5KFxuXHRcdChhcnIgPSBzbGljZS5jYWxsKCBwcmVmZXJyZWREb2MuY2hpbGROb2RlcyApKSxcblx0XHRwcmVmZXJyZWREb2MuY2hpbGROb2Rlc1xuXHQpO1xuXHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMFxuXHQvLyBEZXRlY3Qgc2lsZW50bHkgZmFpbGluZyBwdXNoLmFwcGx5XG5cdGFyclsgcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMubGVuZ3RoIF0ubm9kZVR5cGU7XG59IGNhdGNoICggZSApIHtcblx0cHVzaCA9IHsgYXBwbHk6IGFyci5sZW5ndGggP1xuXG5cdFx0Ly8gTGV2ZXJhZ2Ugc2xpY2UgaWYgcG9zc2libGVcblx0XHRmdW5jdGlvbiggdGFyZ2V0LCBlbHMgKSB7XG5cdFx0XHRwdXNoX25hdGl2ZS5hcHBseSggdGFyZ2V0LCBzbGljZS5jYWxsKGVscykgKTtcblx0XHR9IDpcblxuXHRcdC8vIFN1cHBvcnQ6IElFPDlcblx0XHQvLyBPdGhlcndpc2UgYXBwZW5kIGRpcmVjdGx5XG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0dmFyIGogPSB0YXJnZXQubGVuZ3RoLFxuXHRcdFx0XHRpID0gMDtcblx0XHRcdC8vIENhbid0IHRydXN0IE5vZGVMaXN0Lmxlbmd0aFxuXHRcdFx0d2hpbGUgKCAodGFyZ2V0W2orK10gPSBlbHNbaSsrXSkgKSB7fVxuXHRcdFx0dGFyZ2V0Lmxlbmd0aCA9IGogLSAxO1xuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gU2l6emxlKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIG1hdGNoLCBlbGVtLCBtLCBub2RlVHlwZSxcblx0XHQvLyBRU0EgdmFyc1xuXHRcdGksIGdyb3Vwcywgb2xkLCBuaWQsIG5ld0NvbnRleHQsIG5ld1NlbGVjdG9yO1xuXG5cdGlmICggKCBjb250ZXh0ID8gY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgOiBwcmVmZXJyZWREb2MgKSAhPT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGNvbnRleHQgKTtcblx0fVxuXG5cdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHRpZiAoICFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHRpZiAoIChub2RlVHlwZSA9IGNvbnRleHQubm9kZVR5cGUpICE9PSAxICYmIG5vZGVUeXBlICE9PSA5ICkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdGlmICggZG9jdW1lbnRJc0hUTUwgJiYgIXNlZWQgKSB7XG5cblx0XHQvLyBTaG9ydGN1dHNcblx0XHRpZiAoIChtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyggc2VsZWN0b3IgKSkgKSB7XG5cdFx0XHQvLyBTcGVlZC11cDogU2l6emxlKFwiI0lEXCIpXG5cdFx0XHRpZiAoIChtID0gbWF0Y2hbMV0pICkge1xuXHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICk7XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgcGFyZW50Tm9kZSB0byBjYXRjaCB3aGVuIEJsYWNrYmVycnkgNC42IHJldHVybnNcblx0XHRcdFx0XHQvLyBub2RlcyB0aGF0IGFyZSBubyBsb25nZXIgaW4gdGhlIGRvY3VtZW50ICM2OTYzXG5cdFx0XHRcdFx0aWYgKCBlbGVtICYmIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVyZSBJRSwgT3BlcmEsIGFuZCBXZWJraXQgcmV0dXJuIGl0ZW1zXG5cdFx0XHRcdFx0XHQvLyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdGlmICggZWxlbS5pZCA9PT0gbSApIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQ29udGV4dCBpcyBub3QgYSBkb2N1bWVudFxuXHRcdFx0XHRcdGlmICggY29udGV4dC5vd25lckRvY3VtZW50ICYmIChlbGVtID0gY29udGV4dC5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBtICkpICYmXG5cdFx0XHRcdFx0XHRjb250YWlucyggY29udGV4dCwgZWxlbSApICYmIGVsZW0uaWQgPT09IG0gKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBTcGVlZC11cDogU2l6emxlKFwiVEFHXCIpXG5cdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFsyXSApIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggc2VsZWN0b3IgKSApO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0Ly8gU3BlZWQtdXA6IFNpenpsZShcIi5DTEFTU1wiKVxuXHRcdFx0fSBlbHNlIGlmICggKG0gPSBtYXRjaFszXSkgJiYgc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBtICkgKTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUVNBIHBhdGhcblx0XHRpZiAoIHN1cHBvcnQucXNhICYmICghcmJ1Z2d5UVNBIHx8ICFyYnVnZ3lRU0EudGVzdCggc2VsZWN0b3IgKSkgKSB7XG5cdFx0XHRuaWQgPSBvbGQgPSBleHBhbmRvO1xuXHRcdFx0bmV3Q29udGV4dCA9IGNvbnRleHQ7XG5cdFx0XHRuZXdTZWxlY3RvciA9IG5vZGVUeXBlID09PSA5ICYmIHNlbGVjdG9yO1xuXG5cdFx0XHQvLyBxU0Egd29ya3Mgc3RyYW5nZWx5IG9uIEVsZW1lbnQtcm9vdGVkIHF1ZXJpZXNcblx0XHRcdC8vIFdlIGNhbiB3b3JrIGFyb3VuZCB0aGlzIGJ5IHNwZWNpZnlpbmcgYW4gZXh0cmEgSUQgb24gdGhlIHJvb3Rcblx0XHRcdC8vIGFuZCB3b3JraW5nIHVwIGZyb20gdGhlcmUgKFRoYW5rcyB0byBBbmRyZXcgRHVwb250IGZvciB0aGUgdGVjaG5pcXVlKVxuXHRcdFx0Ly8gSUUgOCBkb2Vzbid0IHdvcmsgb24gb2JqZWN0IGVsZW1lbnRzXG5cdFx0XHRpZiAoIG5vZGVUeXBlID09PSAxICYmIGNvbnRleHQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJvYmplY3RcIiApIHtcblx0XHRcdFx0Z3JvdXBzID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cblx0XHRcdFx0aWYgKCAob2xkID0gY29udGV4dC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSkgKSB7XG5cdFx0XHRcdFx0bmlkID0gb2xkLnJlcGxhY2UoIHJlc2NhcGUsIFwiXFxcXCQmXCIgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb250ZXh0LnNldEF0dHJpYnV0ZSggXCJpZFwiLCBuaWQgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRuaWQgPSBcIltpZD0nXCIgKyBuaWQgKyBcIiddIFwiO1xuXG5cdFx0XHRcdGkgPSBncm91cHMubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRncm91cHNbaV0gPSBuaWQgKyB0b1NlbGVjdG9yKCBncm91cHNbaV0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXdDb250ZXh0ID0gcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiBjb250ZXh0LnBhcmVudE5vZGUgfHwgY29udGV4dDtcblx0XHRcdFx0bmV3U2VsZWN0b3IgPSBncm91cHMuam9pbihcIixcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbmV3U2VsZWN0b3IgKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cyxcblx0XHRcdFx0XHRcdG5ld0NvbnRleHQucXVlcnlTZWxlY3RvckFsbCggbmV3U2VsZWN0b3IgKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH0gY2F0Y2gocXNhRXJyb3IpIHtcblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAoICFvbGQgKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEFsbCBvdGhlcnNcblx0cmV0dXJuIHNlbGVjdCggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGtleS12YWx1ZSBjYWNoZXMgb2YgbGltaXRlZCBzaXplXG4gKiBAcmV0dXJucyB7RnVuY3Rpb24oc3RyaW5nLCBPYmplY3QpfSBSZXR1cm5zIHRoZSBPYmplY3QgZGF0YSBhZnRlciBzdG9yaW5nIGl0IG9uIGl0c2VsZiB3aXRoXG4gKlx0cHJvcGVydHkgbmFtZSB0aGUgKHNwYWNlLXN1ZmZpeGVkKSBzdHJpbmcgYW5kIChpZiB0aGUgY2FjaGUgaXMgbGFyZ2VyIHRoYW4gRXhwci5jYWNoZUxlbmd0aClcbiAqXHRkZWxldGluZyB0aGUgb2xkZXN0IGVudHJ5XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNhY2hlKCkge1xuXHR2YXIga2V5cyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGNhY2hlKCBrZXksIHZhbHVlICkge1xuXHRcdC8vIFVzZSAoa2V5ICsgXCIgXCIpIHRvIGF2b2lkIGNvbGxpc2lvbiB3aXRoIG5hdGl2ZSBwcm90b3R5cGUgcHJvcGVydGllcyAoc2VlIElzc3VlICMxNTcpXG5cdFx0aWYgKCBrZXlzLnB1c2goIGtleSArPSBcIiBcIiApID4gRXhwci5jYWNoZUxlbmd0aCApIHtcblx0XHRcdC8vIE9ubHkga2VlcCB0aGUgbW9zdCByZWNlbnQgZW50cmllc1xuXHRcdFx0ZGVsZXRlIGNhY2hlWyBrZXlzLnNoaWZ0KCkgXTtcblx0XHR9XG5cdFx0cmV0dXJuIChjYWNoZVsga2V5IF0gPSB2YWx1ZSk7XG5cdH1cblx0cmV0dXJuIGNhY2hlO1xufVxuXG4vKipcbiAqIE1hcmsgYSBmdW5jdGlvbiBmb3Igc3BlY2lhbCB1c2UgYnkgU2l6emxlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbWFya1xuICovXG5mdW5jdGlvbiBtYXJrRnVuY3Rpb24oIGZuICkge1xuXHRmblsgZXhwYW5kbyBdID0gdHJ1ZTtcblx0cmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgdGVzdGluZyB1c2luZyBhbiBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBQYXNzZWQgdGhlIGNyZWF0ZWQgZGl2IGFuZCBleHBlY3RzIGEgYm9vbGVhbiByZXN1bHRcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KCBmbiApIHtcblx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gISFmbiggZGl2ICk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZmluYWxseSB7XG5cdFx0Ly8gUmVtb3ZlIGZyb20gaXRzIHBhcmVudCBieSBkZWZhdWx0XG5cdFx0aWYgKCBkaXYucGFyZW50Tm9kZSApIHtcblx0XHRcdGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkaXYgKTtcblx0XHR9XG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0XHRkaXYgPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgc2FtZSBoYW5kbGVyIGZvciBhbGwgb2YgdGhlIHNwZWNpZmllZCBhdHRyc1xuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJzIFBpcGUtc2VwYXJhdGVkIGxpc3Qgb2YgYXR0cmlidXRlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBUaGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gKi9cbmZ1bmN0aW9uIGFkZEhhbmRsZSggYXR0cnMsIGhhbmRsZXIgKSB7XG5cdHZhciBhcnIgPSBhdHRycy5zcGxpdChcInxcIiksXG5cdFx0aSA9IGF0dHJzLmxlbmd0aDtcblxuXHR3aGlsZSAoIGktLSApIHtcblx0XHRFeHByLmF0dHJIYW5kbGVbIGFycltpXSBdID0gaGFuZGxlcjtcblx0fVxufVxuXG4vKipcbiAqIENoZWNrcyBkb2N1bWVudCBvcmRlciBvZiB0d28gc2libGluZ3NcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIGxlc3MgdGhhbiAwIGlmIGEgcHJlY2VkZXMgYiwgZ3JlYXRlciB0aGFuIDAgaWYgYSBmb2xsb3dzIGJcbiAqL1xuZnVuY3Rpb24gc2libGluZ0NoZWNrKCBhLCBiICkge1xuXHR2YXIgY3VyID0gYiAmJiBhLFxuXHRcdGRpZmYgPSBjdXIgJiYgYS5ub2RlVHlwZSA9PT0gMSAmJiBiLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHQoIH5iLnNvdXJjZUluZGV4IHx8IE1BWF9ORUdBVElWRSApIC1cblx0XHRcdCggfmEuc291cmNlSW5kZXggfHwgTUFYX05FR0FUSVZFICk7XG5cblx0Ly8gVXNlIElFIHNvdXJjZUluZGV4IGlmIGF2YWlsYWJsZSBvbiBib3RoIG5vZGVzXG5cdGlmICggZGlmZiApIHtcblx0XHRyZXR1cm4gZGlmZjtcblx0fVxuXG5cdC8vIENoZWNrIGlmIGIgZm9sbG93cyBhXG5cdGlmICggY3VyICkge1xuXHRcdHdoaWxlICggKGN1ciA9IGN1ci5uZXh0U2libGluZykgKSB7XG5cdFx0XHRpZiAoIGN1ciA9PT0gYiApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBhID8gMSA6IC0xO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgaW5wdXQgdHlwZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0UHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIG5hbWUgPT09IFwiaW5wdXRcIiAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBidXR0b25zXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25Qc2V1ZG8oIHR5cGUgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gKG5hbWUgPT09IFwiaW5wdXRcIiB8fCBuYW1lID09PSBcImJ1dHRvblwiKSAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBwb3NpdGlvbmFsc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZm4gKSB7XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oZnVuY3Rpb24oIGFyZ3VtZW50ICkge1xuXHRcdGFyZ3VtZW50ID0gK2FyZ3VtZW50O1xuXHRcdHJldHVybiBtYXJrRnVuY3Rpb24oZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMgKSB7XG5cdFx0XHR2YXIgaixcblx0XHRcdFx0bWF0Y2hJbmRleGVzID0gZm4oIFtdLCBzZWVkLmxlbmd0aCwgYXJndW1lbnQgKSxcblx0XHRcdFx0aSA9IG1hdGNoSW5kZXhlcy5sZW5ndGg7XG5cblx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIGZvdW5kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhlc1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggc2VlZFsgKGogPSBtYXRjaEluZGV4ZXNbaV0pIF0gKSB7XG5cdFx0XHRcdFx0c2VlZFtqXSA9ICEobWF0Y2hlc1tqXSA9IHNlZWRbal0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xufVxuXG4vKipcbiAqIERldGVjdCB4bWxcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsZW0gQW4gZWxlbWVudCBvciBhIGRvY3VtZW50XG4gKi9cbmlzWE1MID0gU2l6emxlLmlzWE1MID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdC8vIGRvY3VtZW50RWxlbWVudCBpcyB2ZXJpZmllZCBmb3IgY2FzZXMgd2hlcmUgaXQgZG9lc24ndCB5ZXQgZXhpc3Rcblx0Ly8gKHN1Y2ggYXMgbG9hZGluZyBpZnJhbWVzIGluIElFIC0gIzQ4MzMpXG5cdHZhciBkb2N1bWVudEVsZW1lbnQgPSBlbGVtICYmIChlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSkuZG9jdW1lbnRFbGVtZW50O1xuXHRyZXR1cm4gZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnRFbGVtZW50Lm5vZGVOYW1lICE9PSBcIkhUTUxcIiA6IGZhbHNlO1xufTtcblxuLy8gRXhwb3NlIHN1cHBvcnQgdmFycyBmb3IgY29udmVuaWVuY2VcbnN1cHBvcnQgPSBTaXp6bGUuc3VwcG9ydCA9IHt9O1xuXG4vKipcbiAqIFNldHMgZG9jdW1lbnQtcmVsYXRlZCB2YXJpYWJsZXMgb25jZSBiYXNlZCBvbiB0aGUgY3VycmVudCBkb2N1bWVudFxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gW2RvY10gQW4gZWxlbWVudCBvciBkb2N1bWVudCBvYmplY3QgdG8gdXNlIHRvIHNldCB0aGUgZG9jdW1lbnRcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqL1xuc2V0RG9jdW1lbnQgPSBTaXp6bGUuc2V0RG9jdW1lbnQgPSBmdW5jdGlvbiggbm9kZSApIHtcblx0dmFyIGRvYyA9IG5vZGUgPyBub2RlLm93bmVyRG9jdW1lbnQgfHwgbm9kZSA6IHByZWZlcnJlZERvYyxcblx0XHRwYXJlbnQgPSBkb2MuZGVmYXVsdFZpZXc7XG5cblx0Ly8gSWYgbm8gZG9jdW1lbnQgYW5kIGRvY3VtZW50RWxlbWVudCBpcyBhdmFpbGFibGUsIHJldHVyblxuXHRpZiAoIGRvYyA9PT0gZG9jdW1lbnQgfHwgZG9jLm5vZGVUeXBlICE9PSA5IHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50ICkge1xuXHRcdHJldHVybiBkb2N1bWVudDtcblx0fVxuXG5cdC8vIFNldCBvdXIgZG9jdW1lbnRcblx0ZG9jdW1lbnQgPSBkb2M7XG5cdGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuXG5cdC8vIFN1cHBvcnQgdGVzdHNcblx0ZG9jdW1lbnRJc0hUTUwgPSAhaXNYTUwoIGRvYyApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPjhcblx0Ly8gSWYgaWZyYW1lIGRvY3VtZW50IGlzIGFzc2lnbmVkIHRvIFwiZG9jdW1lbnRcIiB2YXJpYWJsZSBhbmQgaWYgaWZyYW1lIGhhcyBiZWVuIHJlbG9hZGVkLFxuXHQvLyBJRSB3aWxsIHRocm93IFwicGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIGFjY2Vzc2luZyBcImRvY3VtZW50XCIgdmFyaWFibGUsIHNlZSBqUXVlcnkgIzEzOTM2XG5cdC8vIElFNi04IGRvIG5vdCBzdXBwb3J0IHRoZSBkZWZhdWx0VmlldyBwcm9wZXJ0eSBzbyBwYXJlbnQgd2lsbCBiZSB1bmRlZmluZWRcblx0aWYgKCBwYXJlbnQgJiYgcGFyZW50LmF0dGFjaEV2ZW50ICYmIHBhcmVudCAhPT0gcGFyZW50LnRvcCApIHtcblx0XHRwYXJlbnQuYXR0YWNoRXZlbnQoIFwib25iZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRzZXREb2N1bWVudCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyogQXR0cmlidXRlc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gU3VwcG9ydDogSUU8OFxuXHQvLyBWZXJpZnkgdGhhdCBnZXRBdHRyaWJ1dGUgcmVhbGx5IHJldHVybnMgYXR0cmlidXRlcyBhbmQgbm90IHByb3BlcnRpZXMgKGV4Y2VwdGluZyBJRTggYm9vbGVhbnMpXG5cdHN1cHBvcnQuYXR0cmlidXRlcyA9IGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdGRpdi5jbGFzc05hbWUgPSBcImlcIjtcblx0XHRyZXR1cm4gIWRpdi5nZXRBdHRyaWJ1dGUoXCJjbGFzc05hbWVcIik7XG5cdH0pO1xuXG5cdC8qIGdldEVsZW1lbnQocylCeSpcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSByZXR1cm5zIG9ubHkgZWxlbWVudHNcblx0c3VwcG9ydC5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdGRpdi5hcHBlbmRDaGlsZCggZG9jLmNyZWF0ZUNvbW1lbnQoXCJcIikgKTtcblx0XHRyZXR1cm4gIWRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikubGVuZ3RoO1xuXHR9KTtcblxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIGNhbiBiZSB0cnVzdGVkXG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdGRpdi5pbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9J2EnPjwvZGl2PjxkaXYgY2xhc3M9J2EgaSc+PC9kaXY+XCI7XG5cblx0XHQvLyBTdXBwb3J0OiBTYWZhcmk8NFxuXHRcdC8vIENhdGNoIGNsYXNzIG92ZXItY2FjaGluZ1xuXHRcdGRpdi5maXJzdENoaWxkLmNsYXNzTmFtZSA9IFwiaVwiO1xuXHRcdC8vIFN1cHBvcnQ6IE9wZXJhPDEwXG5cdFx0Ly8gQ2F0Y2ggZ0VCQ04gZmFpbHVyZSB0byBmaW5kIG5vbi1sZWFkaW5nIGNsYXNzZXNcblx0XHRyZXR1cm4gZGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpXCIpLmxlbmd0aCA9PT0gMjtcblx0fSk7XG5cblx0Ly8gU3VwcG9ydDogSUU8MTBcblx0Ly8gQ2hlY2sgaWYgZ2V0RWxlbWVudEJ5SWQgcmV0dXJucyBlbGVtZW50cyBieSBuYW1lXG5cdC8vIFRoZSBicm9rZW4gZ2V0RWxlbWVudEJ5SWQgbWV0aG9kcyBkb24ndCBwaWNrIHVwIHByb2dyYW1hdGljYWxseS1zZXQgbmFtZXMsXG5cdC8vIHNvIHVzZSBhIHJvdW5kYWJvdXQgZ2V0RWxlbWVudHNCeU5hbWUgdGVzdFxuXHRzdXBwb3J0LmdldEJ5SWQgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdiApIHtcblx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBkaXYgKS5pZCA9IGV4cGFuZG87XG5cdFx0cmV0dXJuICFkb2MuZ2V0RWxlbWVudHNCeU5hbWUgfHwgIWRvYy5nZXRFbGVtZW50c0J5TmFtZSggZXhwYW5kbyApLmxlbmd0aDtcblx0fSk7XG5cblx0Ly8gSUQgZmluZCBhbmQgZmlsdGVyXG5cdGlmICggc3VwcG9ydC5nZXRCeUlkICkge1xuXHRcdEV4cHIuZmluZFtcIklEXCJdID0gZnVuY3Rpb24oIGlkLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gc3RydW5kZWZpbmVkICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cdFx0XHRcdC8vIENoZWNrIHBhcmVudE5vZGUgdG8gY2F0Y2ggd2hlbiBCbGFja2JlcnJ5IDQuNiByZXR1cm5zXG5cdFx0XHRcdC8vIG5vZGVzIHRoYXQgYXJlIG5vIGxvbmdlciBpbiB0aGUgZG9jdW1lbnQgIzY5NjNcblx0XHRcdFx0cmV0dXJuIG0gJiYgbS5wYXJlbnROb2RlID8gW21dIDogW107XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRFeHByLmZpbHRlcltcIklEXCJdID0gZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0dmFyIGF0dHJJZCA9IGlkLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBhdHRySWQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0Ly8gU3VwcG9ydDogSUU2Lzdcblx0XHQvLyBnZXRFbGVtZW50QnlJZCBpcyBub3QgcmVsaWFibGUgYXMgYSBmaW5kIHNob3J0Y3V0XG5cdFx0ZGVsZXRlIEV4cHIuZmluZFtcIklEXCJdO1xuXG5cdFx0RXhwci5maWx0ZXJbXCJJRFwiXSA9ICBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIG5vZGUgPSB0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGVOb2RlICE9PSBzdHJ1bmRlZmluZWQgJiYgZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIik7XG5cdFx0XHRcdHJldHVybiBub2RlICYmIG5vZGUudmFsdWUgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuXG5cdC8vIFRhZ1xuXHRFeHByLmZpbmRbXCJUQUdcIl0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlUYWdOYW1lID9cblx0XHRmdW5jdGlvbiggdGFnLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gc3RydW5kZWZpbmVkICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cdFx0XHR9XG5cdFx0fSA6XG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHR0bXAgPSBbXSxcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdHJlc3VsdHMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKTtcblxuXHRcdFx0Ly8gRmlsdGVyIG91dCBwb3NzaWJsZSBjb21tZW50c1xuXHRcdFx0aWYgKCB0YWcgPT09IFwiKlwiICkge1xuXHRcdFx0XHR3aGlsZSAoIChlbGVtID0gcmVzdWx0c1tpKytdKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHR0bXAucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0bXA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9O1xuXG5cdC8vIENsYXNzXG5cdEV4cHIuZmluZFtcIkNMQVNTXCJdID0gc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIGZ1bmN0aW9uKCBjbGFzc05hbWUsIGNvbnRleHQgKSB7XG5cdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICE9PSBzdHJ1bmRlZmluZWQgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBjbGFzc05hbWUgKTtcblx0XHR9XG5cdH07XG5cblx0LyogUVNBL21hdGNoZXNTZWxlY3RvclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gUVNBIGFuZCBtYXRjaGVzU2VsZWN0b3Igc3VwcG9ydFxuXG5cdC8vIG1hdGNoZXNTZWxlY3Rvcig6YWN0aXZlKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoSUU5L09wZXJhIDExLjUpXG5cdHJidWdneU1hdGNoZXMgPSBbXTtcblxuXHQvLyBxU2EoOmZvY3VzKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoQ2hyb21lIDIxKVxuXHQvLyBXZSBhbGxvdyB0aGlzIGJlY2F1c2Ugb2YgYSBidWcgaW4gSUU4LzkgdGhhdCB0aHJvd3MgYW4gZXJyb3Jcblx0Ly8gd2hlbmV2ZXIgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIGlzIGFjY2Vzc2VkIG9uIGFuIGlmcmFtZVxuXHQvLyBTbywgd2UgYWxsb3cgOmZvY3VzIHRvIHBhc3MgdGhyb3VnaCBRU0EgYWxsIHRoZSB0aW1lIHRvIGF2b2lkIHRoZSBJRSBlcnJvclxuXHQvLyBTZWUgaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTMzNzhcblx0cmJ1Z2d5UVNBID0gW107XG5cblx0aWYgKCAoc3VwcG9ydC5xc2EgPSBybmF0aXZlLnRlc3QoIGRvYy5xdWVyeVNlbGVjdG9yQWxsICkpICkge1xuXHRcdC8vIEJ1aWxkIFFTQSByZWdleFxuXHRcdC8vIFJlZ2V4IHN0cmF0ZWd5IGFkb3B0ZWQgZnJvbSBEaWVnbyBQZXJpbmlcblx0XHRhc3NlcnQoZnVuY3Rpb24oIGRpdiApIHtcblx0XHRcdC8vIFNlbGVjdCBpcyBzZXQgdG8gZW1wdHkgc3RyaW5nIG9uIHB1cnBvc2Vcblx0XHRcdC8vIFRoaXMgaXMgdG8gdGVzdCBJRSdzIHRyZWF0bWVudCBvZiBub3QgZXhwbGljaXRseVxuXHRcdFx0Ly8gc2V0dGluZyBhIGJvb2xlYW4gY29udGVudCBhdHRyaWJ1dGUsXG5cdFx0XHQvLyBzaW5jZSBpdHMgcHJlc2VuY2Ugc2hvdWxkIGJlIGVub3VnaFxuXHRcdFx0Ly8gaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTIzNTlcblx0XHRcdGRpdi5pbm5lckhUTUwgPSBcIjxzZWxlY3Q+PG9wdGlvbiBzZWxlY3RlZD0nJz48L29wdGlvbj48L3NlbGVjdD5cIjtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4XG5cdFx0XHQvLyBCb29sZWFuIGF0dHJpYnV0ZXMgYW5kIFwidmFsdWVcIiBhcmUgbm90IHRyZWF0ZWQgY29ycmVjdGx5XG5cdFx0XHRpZiAoICFkaXYucXVlcnlTZWxlY3RvckFsbChcIltzZWxlY3RlZF1cIikubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKig/OnZhbHVlfFwiICsgYm9vbGVhbnMgKyBcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXZWJraXQvT3BlcmEgLSA6Y2hlY2tlZCBzaG91bGQgcmV0dXJuIHNlbGVjdGVkIG9wdGlvbiBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdC8vIElFOCB0aHJvd3MgZXJyb3IgaGVyZSBhbmQgd2lsbCBub3Qgc2VlIGxhdGVyIHRlc3RzXG5cdFx0XHRpZiAoICFkaXYucXVlcnlTZWxlY3RvckFsbChcIjpjaGVja2VkXCIpLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goXCI6Y2hlY2tlZFwiKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBPcGVyYSAxMC0xMi9JRThcblx0XHRcdC8vIF49ICQ9ICo9IGFuZCBlbXB0eSB2YWx1ZXNcblx0XHRcdC8vIFNob3VsZCBub3Qgc2VsZWN0IGFueXRoaW5nXG5cdFx0XHQvLyBTdXBwb3J0OiBXaW5kb3dzIDggTmF0aXZlIEFwcHNcblx0XHRcdC8vIFRoZSB0eXBlIGF0dHJpYnV0ZSBpcyByZXN0cmljdGVkIGR1cmluZyAuaW5uZXJIVE1MIGFzc2lnbm1lbnRcblx0XHRcdHZhciBpbnB1dCA9IGRvYy5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG5cdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCBcImhpZGRlblwiICk7XG5cdFx0XHRkaXYuYXBwZW5kQ2hpbGQoIGlucHV0ICkuc2V0QXR0cmlidXRlKCBcInRcIiwgXCJcIiApO1xuXG5cdFx0XHRpZiAoIGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiW3RePScnXVwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlsqXiRdPVwiICsgd2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZGIDMuNSAtIDplbmFibGVkLzpkaXNhYmxlZCBhbmQgaGlkZGVuIGVsZW1lbnRzIChoaWRkZW4gZWxlbWVudHMgYXJlIHN0aWxsIGVuYWJsZWQpXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCI6ZW5hYmxlZFwiKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gT3BlcmEgMTAtMTEgZG9lcyBub3QgdGhyb3cgb24gcG9zdC1jb21tYSBpbnZhbGlkIHBzZXVkb3Ncblx0XHRcdGRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiKiw6eFwiKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKFwiLC4qOlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICggKHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yID0gcm5hdGl2ZS50ZXN0KCAobWF0Y2hlcyA9IGRvY0VsZW0ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1zTWF0Y2hlc1NlbGVjdG9yKSApKSApIHtcblxuXHRcdGFzc2VydChmdW5jdGlvbiggZGl2ICkge1xuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGl0J3MgcG9zc2libGUgdG8gZG8gbWF0Y2hlc1NlbGVjdG9yXG5cdFx0XHQvLyBvbiBhIGRpc2Nvbm5lY3RlZCBub2RlIChJRSA5KVxuXHRcdFx0c3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCA9IG1hdGNoZXMuY2FsbCggZGl2LCBcImRpdlwiICk7XG5cblx0XHRcdC8vIFRoaXMgc2hvdWxkIGZhaWwgd2l0aCBhbiBleGNlcHRpb25cblx0XHRcdC8vIEdlY2tvIGRvZXMgbm90IGVycm9yLCByZXR1cm5zIGZhbHNlIGluc3RlYWRcblx0XHRcdG1hdGNoZXMuY2FsbCggZGl2LCBcIltzIT0nJ106eFwiICk7XG5cdFx0XHRyYnVnZ3lNYXRjaGVzLnB1c2goIFwiIT1cIiwgcHNldWRvcyApO1xuXHRcdH0pO1xuXHR9XG5cblx0cmJ1Z2d5UVNBID0gcmJ1Z2d5UVNBLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lRU0Euam9pbihcInxcIikgKTtcblx0cmJ1Z2d5TWF0Y2hlcyA9IHJidWdneU1hdGNoZXMubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneU1hdGNoZXMuam9pbihcInxcIikgKTtcblxuXHQvKiBDb250YWluc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gRWxlbWVudCBjb250YWlucyBhbm90aGVyXG5cdC8vIFB1cnBvc2VmdWxseSBkb2VzIG5vdCBpbXBsZW1lbnQgaW5jbHVzaXZlIGRlc2NlbmRlbnRcblx0Ly8gQXMgaW4sIGFuIGVsZW1lbnQgZG9lcyBub3QgY29udGFpbiBpdHNlbGZcblx0Y29udGFpbnMgPSBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29udGFpbnMgKSB8fCBkb2NFbGVtLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID9cblx0XHRmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBhZG93biA9IGEubm9kZVR5cGUgPT09IDkgPyBhLmRvY3VtZW50RWxlbWVudCA6IGEsXG5cdFx0XHRcdGJ1cCA9IGIgJiYgYi5wYXJlbnROb2RlO1xuXHRcdFx0cmV0dXJuIGEgPT09IGJ1cCB8fCAhISggYnVwICYmIGJ1cC5ub2RlVHlwZSA9PT0gMSAmJiAoXG5cdFx0XHRcdGFkb3duLmNvbnRhaW5zID9cblx0XHRcdFx0XHRhZG93bi5jb250YWlucyggYnVwICkgOlxuXHRcdFx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gJiYgYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYnVwICkgJiAxNlxuXHRcdFx0KSk7XG5cdFx0fSA6XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGIgKSB7XG5cdFx0XHRcdHdoaWxlICggKGIgPSBiLnBhcmVudE5vZGUpICkge1xuXHRcdFx0XHRcdGlmICggYiA9PT0gYSApIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0LyogU29ydGluZ1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gRG9jdW1lbnQgb3JkZXIgc29ydGluZ1xuXHRzb3J0T3JkZXIgPSBkb2NFbGVtLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID9cblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cblx0XHQvLyBGbGFnIGZvciBkdXBsaWNhdGUgcmVtb3ZhbFxuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHR2YXIgY29tcGFyZSA9IGIuY29tcGFyZURvY3VtZW50UG9zaXRpb24gJiYgYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBiICk7XG5cblx0XHRpZiAoIGNvbXBhcmUgKSB7XG5cdFx0XHQvLyBEaXNjb25uZWN0ZWQgbm9kZXNcblx0XHRcdGlmICggY29tcGFyZSAmIDEgfHxcblx0XHRcdFx0KCFzdXBwb3J0LnNvcnREZXRhY2hlZCAmJiBiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBhICkgPT09IGNvbXBhcmUpICkge1xuXG5cdFx0XHRcdC8vIENob29zZSB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIHJlbGF0ZWQgdG8gb3VyIHByZWZlcnJlZCBkb2N1bWVudFxuXHRcdFx0XHRpZiAoIGEgPT09IGRvYyB8fCBjb250YWlucyhwcmVmZXJyZWREb2MsIGEpICkge1xuXHRcdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIGIgPT09IGRvYyB8fCBjb250YWlucyhwcmVmZXJyZWREb2MsIGIpICkge1xuXHRcdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTWFpbnRhaW4gb3JpZ2luYWwgb3JkZXJcblx0XHRcdFx0cmV0dXJuIHNvcnRJbnB1dCA/XG5cdFx0XHRcdFx0KCBpbmRleE9mLmNhbGwoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZi5jYWxsKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0XHQwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29tcGFyZSAmIDQgPyAtMSA6IDE7XG5cdFx0fVxuXG5cdFx0Ly8gTm90IGRpcmVjdGx5IGNvbXBhcmFibGUsIHNvcnQgb24gZXhpc3RlbmNlIG9mIG1ldGhvZFxuXHRcdHJldHVybiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID8gLTEgOiAxO1xuXHR9IDpcblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0dmFyIGN1cixcblx0XHRcdGkgPSAwLFxuXHRcdFx0YXVwID0gYS5wYXJlbnROb2RlLFxuXHRcdFx0YnVwID0gYi5wYXJlbnROb2RlLFxuXHRcdFx0YXAgPSBbIGEgXSxcblx0XHRcdGJwID0gWyBiIF07XG5cblx0XHQvLyBFeGl0IGVhcmx5IGlmIHRoZSBub2RlcyBhcmUgaWRlbnRpY2FsXG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXG5cdFx0Ly8gUGFyZW50bGVzcyBub2RlcyBhcmUgZWl0aGVyIGRvY3VtZW50cyBvciBkaXNjb25uZWN0ZWRcblx0XHR9IGVsc2UgaWYgKCAhYXVwIHx8ICFidXAgKSB7XG5cdFx0XHRyZXR1cm4gYSA9PT0gZG9jID8gLTEgOlxuXHRcdFx0XHRiID09PSBkb2MgPyAxIDpcblx0XHRcdFx0YXVwID8gLTEgOlxuXHRcdFx0XHRidXAgPyAxIDpcblx0XHRcdFx0c29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mLmNhbGwoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZi5jYWxsKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0MDtcblxuXHRcdC8vIElmIHRoZSBub2RlcyBhcmUgc2libGluZ3MsIHdlIGNhbiBkbyBhIHF1aWNrIGNoZWNrXG5cdFx0fSBlbHNlIGlmICggYXVwID09PSBidXAgKSB7XG5cdFx0XHRyZXR1cm4gc2libGluZ0NoZWNrKCBhLCBiICk7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXJ3aXNlIHdlIG5lZWQgZnVsbCBsaXN0cyBvZiB0aGVpciBhbmNlc3RvcnMgZm9yIGNvbXBhcmlzb25cblx0XHRjdXIgPSBhO1xuXHRcdHdoaWxlICggKGN1ciA9IGN1ci5wYXJlbnROb2RlKSApIHtcblx0XHRcdGFwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblx0XHRjdXIgPSBiO1xuXHRcdHdoaWxlICggKGN1ciA9IGN1ci5wYXJlbnROb2RlKSApIHtcblx0XHRcdGJwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblxuXHRcdC8vIFdhbGsgZG93biB0aGUgdHJlZSBsb29raW5nIGZvciBhIGRpc2NyZXBhbmN5XG5cdFx0d2hpbGUgKCBhcFtpXSA9PT0gYnBbaV0gKSB7XG5cdFx0XHRpKys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGkgP1xuXHRcdFx0Ly8gRG8gYSBzaWJsaW5nIGNoZWNrIGlmIHRoZSBub2RlcyBoYXZlIGEgY29tbW9uIGFuY2VzdG9yXG5cdFx0XHRzaWJsaW5nQ2hlY2soIGFwW2ldLCBicFtpXSApIDpcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlIG5vZGVzIGluIG91ciBkb2N1bWVudCBzb3J0IGZpcnN0XG5cdFx0XHRhcFtpXSA9PT0gcHJlZmVycmVkRG9jID8gLTEgOlxuXHRcdFx0YnBbaV0gPT09IHByZWZlcnJlZERvYyA/IDEgOlxuXHRcdFx0MDtcblx0fTtcblxuXHRyZXR1cm4gZG9jO1xufTtcblxuU2l6emxlLm1hdGNoZXMgPSBmdW5jdGlvbiggZXhwciwgZWxlbWVudHMgKSB7XG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIG51bGwsIG51bGwsIGVsZW1lbnRzICk7XG59O1xuXG5TaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIGVsZW0sIGV4cHIgKSB7XG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHRpZiAoICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKSAhPT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0fVxuXG5cdC8vIE1ha2Ugc3VyZSB0aGF0IGF0dHJpYnV0ZSBzZWxlY3RvcnMgYXJlIHF1b3RlZFxuXHRleHByID0gZXhwci5yZXBsYWNlKCByYXR0cmlidXRlUXVvdGVzLCBcIj0nJDEnXVwiICk7XG5cblx0aWYgKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdCggIXJidWdneU1hdGNoZXMgfHwgIXJidWdneU1hdGNoZXMudGVzdCggZXhwciApICkgJiZcblx0XHQoICFyYnVnZ3lRU0EgICAgIHx8ICFyYnVnZ3lRU0EudGVzdCggZXhwciApICkgKSB7XG5cblx0XHR0cnkge1xuXHRcdFx0dmFyIHJldCA9IG1hdGNoZXMuY2FsbCggZWxlbSwgZXhwciApO1xuXG5cdFx0XHQvLyBJRSA5J3MgbWF0Y2hlc1NlbGVjdG9yIHJldHVybnMgZmFsc2Ugb24gZGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0XHRpZiAoIHJldCB8fCBzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoIHx8XG5cdFx0XHRcdFx0Ly8gQXMgd2VsbCwgZGlzY29ubmVjdGVkIG5vZGVzIGFyZSBzYWlkIHRvIGJlIGluIGEgZG9jdW1lbnRcblx0XHRcdFx0XHQvLyBmcmFnbWVudCBpbiBJRSA5XG5cdFx0XHRcdFx0ZWxlbS5kb2N1bWVudCAmJiBlbGVtLmRvY3VtZW50Lm5vZGVUeXBlICE9PSAxMSApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9IGNhdGNoKGUpIHt9XG5cdH1cblxuXHRyZXR1cm4gU2l6emxlKCBleHByLCBkb2N1bWVudCwgbnVsbCwgW2VsZW1dICkubGVuZ3RoID4gMDtcbn07XG5cblNpenpsZS5jb250YWlucyA9IGZ1bmN0aW9uKCBjb250ZXh0LCBlbGVtICkge1xuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0aWYgKCAoIGNvbnRleHQub3duZXJEb2N1bWVudCB8fCBjb250ZXh0ICkgIT09IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdH1cblx0cmV0dXJuIGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICk7XG59O1xuXG5TaXp6bGUuYXR0ciA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0aWYgKCAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkgIT09IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdH1cblxuXHR2YXIgZm4gPSBFeHByLmF0dHJIYW5kbGVbIG5hbWUudG9Mb3dlckNhc2UoKSBdLFxuXHRcdC8vIERvbid0IGdldCBmb29sZWQgYnkgT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzIChqUXVlcnkgIzEzODA3KVxuXHRcdHZhbCA9IGZuICYmIGhhc093bi5jYWxsKCBFeHByLmF0dHJIYW5kbGUsIG5hbWUudG9Mb3dlckNhc2UoKSApID9cblx0XHRcdGZuKCBlbGVtLCBuYW1lLCAhZG9jdW1lbnRJc0hUTUwgKSA6XG5cdFx0XHR1bmRlZmluZWQ7XG5cblx0cmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID9cblx0XHRzdXBwb3J0LmF0dHJpYnV0ZXMgfHwgIWRvY3VtZW50SXNIVE1MID9cblx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lICkgOlxuXHRcdFx0KHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZShuYW1lKSkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdHZhbC52YWx1ZSA6XG5cdFx0XHRcdG51bGwgOlxuXHRcdHZhbDtcbn07XG5cblNpenpsZS5lcnJvciA9IGZ1bmN0aW9uKCBtc2cgKSB7XG5cdHRocm93IG5ldyBFcnJvciggXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIiArIG1zZyApO1xufTtcblxuLyoqXG4gKiBEb2N1bWVudCBzb3J0aW5nIGFuZCByZW1vdmluZyBkdXBsaWNhdGVzXG4gKiBAcGFyYW0ge0FycmF5TGlrZX0gcmVzdWx0c1xuICovXG5TaXp6bGUudW5pcXVlU29ydCA9IGZ1bmN0aW9uKCByZXN1bHRzICkge1xuXHR2YXIgZWxlbSxcblx0XHRkdXBsaWNhdGVzID0gW10sXG5cdFx0aiA9IDAsXG5cdFx0aSA9IDA7XG5cblx0Ly8gVW5sZXNzIHdlICprbm93KiB3ZSBjYW4gZGV0ZWN0IGR1cGxpY2F0ZXMsIGFzc3VtZSB0aGVpciBwcmVzZW5jZVxuXHRoYXNEdXBsaWNhdGUgPSAhc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzO1xuXHRzb3J0SW5wdXQgPSAhc3VwcG9ydC5zb3J0U3RhYmxlICYmIHJlc3VsdHMuc2xpY2UoIDAgKTtcblx0cmVzdWx0cy5zb3J0KCBzb3J0T3JkZXIgKTtcblxuXHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHR3aGlsZSAoIChlbGVtID0gcmVzdWx0c1tpKytdKSApIHtcblx0XHRcdGlmICggZWxlbSA9PT0gcmVzdWx0c1sgaSBdICkge1xuXHRcdFx0XHRqID0gZHVwbGljYXRlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0cmVzdWx0cy5zcGxpY2UoIGR1cGxpY2F0ZXNbIGogXSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGZvciByZXRyaWV2aW5nIHRoZSB0ZXh0IHZhbHVlIG9mIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICogQHBhcmFtIHtBcnJheXxFbGVtZW50fSBlbGVtXG4gKi9cbmdldFRleHQgPSBTaXp6bGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbm9kZSxcblx0XHRyZXQgPSBcIlwiLFxuXHRcdGkgPSAwLFxuXHRcdG5vZGVUeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRpZiAoICFub2RlVHlwZSApIHtcblx0XHQvLyBJZiBubyBub2RlVHlwZSwgdGhpcyBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheVxuXHRcdGZvciAoIDsgKG5vZGUgPSBlbGVtW2ldKTsgaSsrICkge1xuXHRcdFx0Ly8gRG8gbm90IHRyYXZlcnNlIGNvbW1lbnQgbm9kZXNcblx0XHRcdHJldCArPSBnZXRUZXh0KCBub2RlICk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEgKSB7XG5cdFx0Ly8gVXNlIHRleHRDb250ZW50IGZvciBlbGVtZW50c1xuXHRcdC8vIGlubmVyVGV4dCB1c2FnZSByZW1vdmVkIGZvciBjb25zaXN0ZW5jeSBvZiBuZXcgbGluZXMgKHNlZSAjMTExNTMpXG5cdFx0aWYgKCB0eXBlb2YgZWxlbS50ZXh0Q29udGVudCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLnRleHRDb250ZW50O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUcmF2ZXJzZSBpdHMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRyZXQgKz0gZ2V0VGV4dCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQgKSB7XG5cdFx0cmV0dXJuIGVsZW0ubm9kZVZhbHVlO1xuXHR9XG5cdC8vIERvIG5vdCBpbmNsdWRlIGNvbW1lbnQgb3IgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiBub2Rlc1xuXG5cdHJldHVybiByZXQ7XG59O1xuXG5FeHByID0gU2l6emxlLnNlbGVjdG9ycyA9IHtcblxuXHQvLyBDYW4gYmUgYWRqdXN0ZWQgYnkgdGhlIHVzZXJcblx0Y2FjaGVMZW5ndGg6IDUwLFxuXG5cdGNyZWF0ZVBzZXVkbzogbWFya0Z1bmN0aW9uLFxuXG5cdG1hdGNoOiBtYXRjaEV4cHIsXG5cblx0YXR0ckhhbmRsZToge30sXG5cblx0ZmluZDoge30sXG5cblx0cmVsYXRpdmU6IHtcblx0XHRcIj5cIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiIFwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIgfSxcblx0XHRcIitcIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCJ+XCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiIH1cblx0fSxcblxuXHRwcmVGaWx0ZXI6IHtcblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0bWF0Y2hbMV0gPSBtYXRjaFsxXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBnaXZlbiB2YWx1ZSB0byBtYXRjaFszXSB3aGV0aGVyIHF1b3RlZCBvciB1bnF1b3RlZFxuXHRcdFx0bWF0Y2hbM10gPSAoIG1hdGNoWzRdIHx8IG1hdGNoWzVdIHx8IFwiXCIgKS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHRpZiAoIG1hdGNoWzJdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWzNdID0gXCIgXCIgKyBtYXRjaFszXSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDQgKTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHQvKiBtYXRjaGVzIGZyb20gbWF0Y2hFeHByW1wiQ0hJTERcIl1cblx0XHRcdFx0MSB0eXBlIChvbmx5fG50aHwuLi4pXG5cdFx0XHRcdDIgd2hhdCAoY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0MyBhcmd1bWVudCAoZXZlbnxvZGR8XFxkKnxcXGQqbihbKy1dXFxkKyk/fC4uLilcblx0XHRcdFx0NCB4bi1jb21wb25lbnQgb2YgeG4reSBhcmd1bWVudCAoWystXT9cXGQqbnwpXG5cdFx0XHRcdDUgc2lnbiBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NiB4IG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ3IHNpZ24gb2YgeS1jb21wb25lbnRcblx0XHRcdFx0OCB5IG9mIHktY29tcG9uZW50XG5cdFx0XHQqL1xuXHRcdFx0bWF0Y2hbMV0gPSBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAoIG1hdGNoWzFdLnNsaWNlKCAwLCAzICkgPT09IFwibnRoXCIgKSB7XG5cdFx0XHRcdC8vIG50aC0qIHJlcXVpcmVzIGFyZ3VtZW50XG5cdFx0XHRcdGlmICggIW1hdGNoWzNdICkge1xuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbMF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG51bWVyaWMgeCBhbmQgeSBwYXJhbWV0ZXJzIGZvciBFeHByLmZpbHRlci5DSElMRFxuXHRcdFx0XHQvLyByZW1lbWJlciB0aGF0IGZhbHNlL3RydWUgY2FzdCByZXNwZWN0aXZlbHkgdG8gMC8xXG5cdFx0XHRcdG1hdGNoWzRdID0gKyggbWF0Y2hbNF0gPyBtYXRjaFs1XSArIChtYXRjaFs2XSB8fCAxKSA6IDIgKiAoIG1hdGNoWzNdID09PSBcImV2ZW5cIiB8fCBtYXRjaFszXSA9PT0gXCJvZGRcIiApICk7XG5cdFx0XHRcdG1hdGNoWzVdID0gKyggKCBtYXRjaFs3XSArIG1hdGNoWzhdICkgfHwgbWF0Y2hbM10gPT09IFwib2RkXCIgKTtcblxuXHRcdFx0Ly8gb3RoZXIgdHlwZXMgcHJvaGliaXQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFszXSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFswXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdHZhciBleGNlc3MsXG5cdFx0XHRcdHVucXVvdGVkID0gIW1hdGNoWzVdICYmIG1hdGNoWzJdO1xuXG5cdFx0XHRpZiAoIG1hdGNoRXhwcltcIkNISUxEXCJdLnRlc3QoIG1hdGNoWzBdICkgKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBY2NlcHQgcXVvdGVkIGFyZ3VtZW50cyBhcy1pc1xuXHRcdFx0aWYgKCBtYXRjaFszXSAmJiBtYXRjaFs0XSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRtYXRjaFsyXSA9IG1hdGNoWzRdO1xuXG5cdFx0XHQvLyBTdHJpcCBleGNlc3MgY2hhcmFjdGVycyBmcm9tIHVucXVvdGVkIGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggdW5xdW90ZWQgJiYgcnBzZXVkby50ZXN0KCB1bnF1b3RlZCApICYmXG5cdFx0XHRcdC8vIEdldCBleGNlc3MgZnJvbSB0b2tlbml6ZSAocmVjdXJzaXZlbHkpXG5cdFx0XHRcdChleGNlc3MgPSB0b2tlbml6ZSggdW5xdW90ZWQsIHRydWUgKSkgJiZcblx0XHRcdFx0Ly8gYWR2YW5jZSB0byB0aGUgbmV4dCBjbG9zaW5nIHBhcmVudGhlc2lzXG5cdFx0XHRcdChleGNlc3MgPSB1bnF1b3RlZC5pbmRleE9mKCBcIilcIiwgdW5xdW90ZWQubGVuZ3RoIC0gZXhjZXNzICkgLSB1bnF1b3RlZC5sZW5ndGgpICkge1xuXG5cdFx0XHRcdC8vIGV4Y2VzcyBpcyBhIG5lZ2F0aXZlIGluZGV4XG5cdFx0XHRcdG1hdGNoWzBdID0gbWF0Y2hbMF0uc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0XHRtYXRjaFsyXSA9IHVucXVvdGVkLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIG9ubHkgY2FwdHVyZXMgbmVlZGVkIGJ5IHRoZSBwc2V1ZG8gZmlsdGVyIG1ldGhvZCAodHlwZSBhbmQgYXJndW1lbnQpXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDMgKTtcblx0XHR9XG5cdH0sXG5cblx0ZmlsdGVyOiB7XG5cblx0XHRcIlRBR1wiOiBmdW5jdGlvbiggbm9kZU5hbWVTZWxlY3RvciApIHtcblx0XHRcdHZhciBub2RlTmFtZSA9IG5vZGVOYW1lU2VsZWN0b3IucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5vZGVOYW1lU2VsZWN0b3IgPT09IFwiKlwiID9cblx0XHRcdFx0ZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlOyB9IDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZTtcblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDTEFTU1wiOiBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdFx0dmFyIHBhdHRlcm4gPSBjbGFzc0NhY2hlWyBjbGFzc05hbWUgKyBcIiBcIiBdO1xuXG5cdFx0XHRyZXR1cm4gcGF0dGVybiB8fFxuXHRcdFx0XHQocGF0dGVybiA9IG5ldyBSZWdFeHAoIFwiKF58XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyBjbGFzc05hbWUgKyBcIihcIiArIHdoaXRlc3BhY2UgKyBcInwkKVwiICkpICYmXG5cdFx0XHRcdGNsYXNzQ2FjaGUoIGNsYXNzTmFtZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdCggdHlwZW9mIGVsZW0uY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW0uY2xhc3NOYW1lIHx8IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSAhPT0gc3RydW5kZWZpbmVkICYmIGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIiApO1xuXHRcdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0XCJBVFRSXCI6IGZ1bmN0aW9uKCBuYW1lLCBvcGVyYXRvciwgY2hlY2sgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBTaXp6bGUuYXR0ciggZWxlbSwgbmFtZSApO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIiE9XCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCAhb3BlcmF0b3IgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXN1bHQgKz0gXCJcIjtcblxuXHRcdFx0XHRyZXR1cm4gb3BlcmF0b3IgPT09IFwiPVwiID8gcmVzdWx0ID09PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiIT1cIiA/IHJlc3VsdCAhPT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIl49XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA9PT0gMCA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiKj1cIiA/IGNoZWNrICYmIHJlc3VsdC5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiQ9XCIgPyBjaGVjayAmJiByZXN1bHQuc2xpY2UoIC1jaGVjay5sZW5ndGggKSA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIn49XCIgPyAoIFwiIFwiICsgcmVzdWx0ICsgXCIgXCIgKS5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcInw9XCIgPyByZXN1bHQgPT09IGNoZWNrIHx8IHJlc3VsdC5zbGljZSggMCwgY2hlY2subGVuZ3RoICsgMSApID09PSBjaGVjayArIFwiLVwiIDpcblx0XHRcdFx0XHRmYWxzZTtcblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiQ0hJTERcIjogZnVuY3Rpb24oIHR5cGUsIHdoYXQsIGFyZ3VtZW50LCBmaXJzdCwgbGFzdCApIHtcblx0XHRcdHZhciBzaW1wbGUgPSB0eXBlLnNsaWNlKCAwLCAzICkgIT09IFwibnRoXCIsXG5cdFx0XHRcdGZvcndhcmQgPSB0eXBlLnNsaWNlKCAtNCApICE9PSBcImxhc3RcIixcblx0XHRcdFx0b2ZUeXBlID0gd2hhdCA9PT0gXCJvZi10eXBlXCI7XG5cblx0XHRcdHJldHVybiBmaXJzdCA9PT0gMSAmJiBsYXN0ID09PSAwID9cblxuXHRcdFx0XHQvLyBTaG9ydGN1dCBmb3IgOm50aC0qKG4pXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdHJldHVybiAhIWVsZW0ucGFyZW50Tm9kZTtcblx0XHRcdFx0fSA6XG5cblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgY2FjaGUsIG91dGVyQ2FjaGUsIG5vZGUsIGRpZmYsIG5vZGVJbmRleCwgc3RhcnQsXG5cdFx0XHRcdFx0XHRkaXIgPSBzaW1wbGUgIT09IGZvcndhcmQgPyBcIm5leHRTaWJsaW5nXCIgOiBcInByZXZpb3VzU2libGluZ1wiLFxuXHRcdFx0XHRcdFx0cGFyZW50ID0gZWxlbS5wYXJlbnROb2RlLFxuXHRcdFx0XHRcdFx0bmFtZSA9IG9mVHlwZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0XHR1c2VDYWNoZSA9ICF4bWwgJiYgIW9mVHlwZTtcblxuXHRcdFx0XHRcdGlmICggcGFyZW50ICkge1xuXG5cdFx0XHRcdFx0XHQvLyA6KGZpcnN0fGxhc3R8b25seSktKGNoaWxkfG9mLXR5cGUpXG5cdFx0XHRcdFx0XHRpZiAoIHNpbXBsZSApIHtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCBkaXIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bm9kZSA9IGVsZW07XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAobm9kZSA9IG5vZGVbIGRpciBdKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggb2ZUeXBlID8gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDogbm9kZS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQvLyBSZXZlcnNlIGRpcmVjdGlvbiBmb3IgOm9ubHktKiAoaWYgd2UgaGF2ZW4ndCB5ZXQgZG9uZSBzbylcblx0XHRcdFx0XHRcdFx0XHRzdGFydCA9IGRpciA9IHR5cGUgPT09IFwib25seVwiICYmICFzdGFydCAmJiBcIm5leHRTaWJsaW5nXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHN0YXJ0ID0gWyBmb3J3YXJkID8gcGFyZW50LmZpcnN0Q2hpbGQgOiBwYXJlbnQubGFzdENoaWxkIF07XG5cblx0XHRcdFx0XHRcdC8vIG5vbi14bWwgOm50aC1jaGlsZCguLi4pIHN0b3JlcyBjYWNoZSBkYXRhIG9uIGBwYXJlbnRgXG5cdFx0XHRcdFx0XHRpZiAoIGZvcndhcmQgJiYgdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdC8vIFNlZWsgYGVsZW1gIGZyb20gYSBwcmV2aW91c2x5LWNhY2hlZCBpbmRleFxuXHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gcGFyZW50WyBleHBhbmRvIF0gfHwgKHBhcmVudFsgZXhwYW5kbyBdID0ge30pO1xuXHRcdFx0XHRcdFx0XHRjYWNoZSA9IG91dGVyQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0bm9kZUluZGV4ID0gY2FjaGVbMF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbMV07XG5cdFx0XHRcdFx0XHRcdGRpZmYgPSBjYWNoZVswXSA9PT0gZGlycnVucyAmJiBjYWNoZVsyXTtcblx0XHRcdFx0XHRcdFx0bm9kZSA9IG5vZGVJbmRleCAmJiBwYXJlbnQuY2hpbGROb2Rlc1sgbm9kZUluZGV4IF07XG5cblx0XHRcdFx0XHRcdFx0d2hpbGUgKCAobm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEZhbGxiYWNrIHRvIHNlZWtpbmcgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0KGRpZmYgPSBub2RlSW5kZXggPSAwKSB8fCBzdGFydC5wb3AoKSkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBXaGVuIGZvdW5kLCBjYWNoZSBpbmRleGVzIG9uIGBwYXJlbnRgIGFuZCBicmVha1xuXHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiArK2RpZmYgJiYgbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgbm9kZUluZGV4LCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gVXNlIHByZXZpb3VzbHktY2FjaGVkIGVsZW1lbnQgaW5kZXggaWYgYXZhaWxhYmxlXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCB1c2VDYWNoZSAmJiAoY2FjaGUgPSAoZWxlbVsgZXhwYW5kbyBdIHx8IChlbGVtWyBleHBhbmRvIF0gPSB7fSkpWyB0eXBlIF0pICYmIGNhY2hlWzBdID09PSBkaXJydW5zICkge1xuXHRcdFx0XHRcdFx0XHRkaWZmID0gY2FjaGVbMV07XG5cblx0XHRcdFx0XHRcdC8vIHhtbCA6bnRoLWNoaWxkKC4uLikgb3IgOm50aC1sYXN0LWNoaWxkKC4uLikgb3IgOm50aCgtbGFzdCk/LW9mLXR5cGUoLi4uKVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gVXNlIHRoZSBzYW1lIGxvb3AgYXMgYWJvdmUgdG8gc2VlayBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCAobm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblx0XHRcdFx0XHRcdFx0XHQoZGlmZiA9IG5vZGVJbmRleCA9IDApIHx8IHN0YXJ0LnBvcCgpKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggKCBvZlR5cGUgPyBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOiBub2RlLm5vZGVUeXBlID09PSAxICkgJiYgKytkaWZmICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2FjaGUgdGhlIGluZGV4IG9mIGVhY2ggZW5jb3VudGVyZWQgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCB1c2VDYWNoZSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0KG5vZGVbIGV4cGFuZG8gXSB8fCAobm9kZVsgZXhwYW5kbyBdID0ge30pKVsgdHlwZSBdID0gWyBkaXJydW5zLCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEluY29ycG9yYXRlIHRoZSBvZmZzZXQsIHRoZW4gY2hlY2sgYWdhaW5zdCBjeWNsZSBzaXplXG5cdFx0XHRcdFx0XHRkaWZmIC09IGxhc3Q7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGlmZiA9PT0gZmlyc3QgfHwgKCBkaWZmICUgZmlyc3QgPT09IDAgJiYgZGlmZiAvIGZpcnN0ID49IDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBwc2V1ZG8sIGFyZ3VtZW50ICkge1xuXHRcdFx0Ly8gcHNldWRvLWNsYXNzIG5hbWVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI3BzZXVkby1jbGFzc2VzXG5cdFx0XHQvLyBQcmlvcml0aXplIGJ5IGNhc2Ugc2Vuc2l0aXZpdHkgaW4gY2FzZSBjdXN0b20gcHNldWRvcyBhcmUgYWRkZWQgd2l0aCB1cHBlcmNhc2UgbGV0dGVyc1xuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCBzZXRGaWx0ZXJzIGluaGVyaXRzIGZyb20gcHNldWRvc1xuXHRcdFx0dmFyIGFyZ3MsXG5cdFx0XHRcdGZuID0gRXhwci5wc2V1ZG9zWyBwc2V1ZG8gXSB8fCBFeHByLnNldEZpbHRlcnNbIHBzZXVkby50b0xvd2VyQ2FzZSgpIF0gfHxcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIiArIHBzZXVkbyApO1xuXG5cdFx0XHQvLyBUaGUgdXNlciBtYXkgdXNlIGNyZWF0ZVBzZXVkbyB0byBpbmRpY2F0ZSB0aGF0XG5cdFx0XHQvLyBhcmd1bWVudHMgYXJlIG5lZWRlZCB0byBjcmVhdGUgdGhlIGZpbHRlciBmdW5jdGlvblxuXHRcdFx0Ly8ganVzdCBhcyBTaXp6bGUgZG9lc1xuXHRcdFx0aWYgKCBmblsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRyZXR1cm4gZm4oIGFyZ3VtZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJ1dCBtYWludGFpbiBzdXBwb3J0IGZvciBvbGQgc2lnbmF0dXJlc1xuXHRcdFx0aWYgKCBmbi5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRhcmdzID0gWyBwc2V1ZG8sIHBzZXVkbywgXCJcIiwgYXJndW1lbnQgXTtcblx0XHRcdFx0cmV0dXJuIEV4cHIuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eSggcHNldWRvLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRcdFx0bWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0XHRcdFx0dmFyIGlkeCxcblx0XHRcdFx0XHRcdFx0bWF0Y2hlZCA9IGZuKCBzZWVkLCBhcmd1bWVudCApLFxuXHRcdFx0XHRcdFx0XHRpID0gbWF0Y2hlZC5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWR4ID0gaW5kZXhPZi5jYWxsKCBzZWVkLCBtYXRjaGVkW2ldICk7XG5cdFx0XHRcdFx0XHRcdHNlZWRbIGlkeCBdID0gISggbWF0Y2hlc1sgaWR4IF0gPSBtYXRjaGVkW2ldICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkgOlxuXHRcdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZuKCBlbGVtLCAwLCBhcmdzICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuO1xuXHRcdH1cblx0fSxcblxuXHRwc2V1ZG9zOiB7XG5cdFx0Ly8gUG90ZW50aWFsbHkgY29tcGxleCBwc2V1ZG9zXG5cdFx0XCJub3RcIjogbWFya0Z1bmN0aW9uKGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRcdC8vIFRyaW0gdGhlIHNlbGVjdG9yIHBhc3NlZCB0byBjb21waWxlXG5cdFx0XHQvLyB0byBhdm9pZCB0cmVhdGluZyBsZWFkaW5nIGFuZCB0cmFpbGluZ1xuXHRcdFx0Ly8gc3BhY2VzIGFzIGNvbWJpbmF0b3JzXG5cdFx0XHR2YXIgaW5wdXQgPSBbXSxcblx0XHRcdFx0cmVzdWx0cyA9IFtdLFxuXHRcdFx0XHRtYXRjaGVyID0gY29tcGlsZSggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApICk7XG5cblx0XHRcdHJldHVybiBtYXRjaGVyWyBleHBhbmRvIF0gP1xuXHRcdFx0XHRtYXJrRnVuY3Rpb24oZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMsIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgZWxlbSxcblx0XHRcdFx0XHRcdHVubWF0Y2hlZCA9IG1hdGNoZXIoIHNlZWQsIG51bGwsIHhtbCwgW10gKSxcblx0XHRcdFx0XHRcdGkgPSBzZWVkLmxlbmd0aDtcblxuXHRcdFx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIHVubWF0Y2hlZCBieSBgbWF0Y2hlcmBcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKGVsZW0gPSB1bm1hdGNoZWRbaV0pICkge1xuXHRcdFx0XHRcdFx0XHRzZWVkW2ldID0gIShtYXRjaGVzW2ldID0gZWxlbSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0aW5wdXRbMF0gPSBlbGVtO1xuXHRcdFx0XHRcdG1hdGNoZXIoIGlucHV0LCBudWxsLCB4bWwsIHJlc3VsdHMgKTtcblx0XHRcdFx0XHRyZXR1cm4gIXJlc3VsdHMucG9wKCk7XG5cdFx0XHRcdH07XG5cdFx0fSksXG5cblx0XHRcImhhc1wiOiBtYXJrRnVuY3Rpb24oZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gU2l6emxlKCBzZWxlY3RvciwgZWxlbSApLmxlbmd0aCA+IDA7XG5cdFx0XHR9O1xuXHRcdH0pLFxuXG5cdFx0XCJjb250YWluc1wiOiBtYXJrRnVuY3Rpb24oZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiAoIGVsZW0udGV4dENvbnRlbnQgfHwgZWxlbS5pbm5lclRleHQgfHwgZ2V0VGV4dCggZWxlbSApICkuaW5kZXhPZiggdGV4dCApID4gLTE7XG5cdFx0XHR9O1xuXHRcdH0pLFxuXG5cdFx0Ly8gXCJXaGV0aGVyIGFuIGVsZW1lbnQgaXMgcmVwcmVzZW50ZWQgYnkgYSA6bGFuZygpIHNlbGVjdG9yXG5cdFx0Ly8gaXMgYmFzZWQgc29sZWx5IG9uIHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWVcblx0XHQvLyBiZWluZyBlcXVhbCB0byB0aGUgaWRlbnRpZmllciBDLFxuXHRcdC8vIG9yIGJlZ2lubmluZyB3aXRoIHRoZSBpZGVudGlmaWVyIEMgaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgXCItXCIuXG5cdFx0Ly8gVGhlIG1hdGNoaW5nIG9mIEMgYWdhaW5zdCB0aGUgZWxlbWVudCdzIGxhbmd1YWdlIHZhbHVlIGlzIHBlcmZvcm1lZCBjYXNlLWluc2Vuc2l0aXZlbHkuXG5cdFx0Ly8gVGhlIGlkZW50aWZpZXIgQyBkb2VzIG5vdCBoYXZlIHRvIGJlIGEgdmFsaWQgbGFuZ3VhZ2UgbmFtZS5cIlxuXHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jbGFuZy1wc2V1ZG9cblx0XHRcImxhbmdcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggbGFuZyApIHtcblx0XHRcdC8vIGxhbmcgdmFsdWUgbXVzdCBiZSBhIHZhbGlkIGlkZW50aWZpZXJcblx0XHRcdGlmICggIXJpZGVudGlmaWVyLnRlc3QobGFuZyB8fCBcIlwiKSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBcInVuc3VwcG9ydGVkIGxhbmc6IFwiICsgbGFuZyApO1xuXHRcdFx0fVxuXHRcdFx0bGFuZyA9IGxhbmcucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgZWxlbUxhbmc7XG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRpZiAoIChlbGVtTGFuZyA9IGRvY3VtZW50SXNIVE1MID9cblx0XHRcdFx0XHRcdGVsZW0ubGFuZyA6XG5cdFx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZShcInhtbDpsYW5nXCIpIHx8IGVsZW0uZ2V0QXR0cmlidXRlKFwibGFuZ1wiKSkgKSB7XG5cblx0XHRcdFx0XHRcdGVsZW1MYW5nID0gZWxlbUxhbmcudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtTGFuZyA9PT0gbGFuZyB8fCBlbGVtTGFuZy5pbmRleE9mKCBsYW5nICsgXCItXCIgKSA9PT0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gd2hpbGUgKCAoZWxlbSA9IGVsZW0ucGFyZW50Tm9kZSkgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH0pLFxuXG5cdFx0Ly8gTWlzY2VsbGFuZW91c1xuXHRcdFwidGFyZ2V0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cdFx0XHRyZXR1cm4gaGFzaCAmJiBoYXNoLnNsaWNlKCAxICkgPT09IGVsZW0uaWQ7XG5cdFx0fSxcblxuXHRcdFwicm9vdFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBkb2NFbGVtO1xuXHRcdH0sXG5cblx0XHRcImZvY3VzXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgKCFkb2N1bWVudC5oYXNGb2N1cyB8fCBkb2N1bWVudC5oYXNGb2N1cygpKSAmJiAhIShlbGVtLnR5cGUgfHwgZWxlbS5ocmVmIHx8IH5lbGVtLnRhYkluZGV4KTtcblx0XHR9LFxuXG5cdFx0Ly8gQm9vbGVhbiBwcm9wZXJ0aWVzXG5cdFx0XCJlbmFibGVkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGZhbHNlO1xuXHRcdH0sXG5cblx0XHRcImRpc2FibGVkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IHRydWU7XG5cdFx0fSxcblxuXHRcdFwiY2hlY2tlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdC8vIEluIENTUzMsIDpjaGVja2VkIHNob3VsZCByZXR1cm4gYm90aCBjaGVja2VkIGFuZCBzZWxlY3RlZCBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdHZhciBub2RlTmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiAobm9kZU5hbWUgPT09IFwiaW5wdXRcIiAmJiAhIWVsZW0uY2hlY2tlZCkgfHwgKG5vZGVOYW1lID09PSBcIm9wdGlvblwiICYmICEhZWxlbS5zZWxlY3RlZCk7XG5cdFx0fSxcblxuXHRcdFwic2VsZWN0ZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHQvLyBBY2Nlc3NpbmcgdGhpcyBwcm9wZXJ0eSBtYWtlcyBzZWxlY3RlZC1ieS1kZWZhdWx0XG5cdFx0XHQvLyBvcHRpb25zIGluIFNhZmFyaSB3b3JrIHByb3Blcmx5XG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0ZWxlbS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtLnNlbGVjdGVkID09PSB0cnVlO1xuXHRcdH0sXG5cblx0XHQvLyBDb250ZW50c1xuXHRcdFwiZW1wdHlcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2VtcHR5LXBzZXVkb1xuXHRcdFx0Ly8gOmVtcHR5IGlzIG9ubHkgYWZmZWN0ZWQgYnkgZWxlbWVudCBub2RlcyBhbmQgY29udGVudCBub2RlcyhpbmNsdWRpbmcgdGV4dCgzKSwgY2RhdGEoNCkpLFxuXHRcdFx0Ly8gICBub3QgY29tbWVudCwgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbnMsIG9yIG90aGVyc1xuXHRcdFx0Ly8gVGhhbmtzIHRvIERpZWdvIFBlcmluaSBmb3IgdGhlIG5vZGVOYW1lIHNob3J0Y3V0XG5cdFx0XHQvLyAgIEdyZWF0ZXIgdGhhbiBcIkBcIiBtZWFucyBhbHBoYSBjaGFyYWN0ZXJzIChzcGVjaWZpY2FsbHkgbm90IHN0YXJ0aW5nIHdpdGggXCIjXCIgb3IgXCI/XCIpXG5cdFx0XHRmb3IgKCBlbGVtID0gZWxlbS5maXJzdENoaWxkOyBlbGVtOyBlbGVtID0gZWxlbS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVOYW1lID4gXCJAXCIgfHwgZWxlbS5ub2RlVHlwZSA9PT0gMyB8fCBlbGVtLm5vZGVUeXBlID09PSA0ICkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdFwicGFyZW50XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICFFeHByLnBzZXVkb3NbXCJlbXB0eVwiXSggZWxlbSApO1xuXHRcdH0sXG5cblx0XHQvLyBFbGVtZW50L2lucHV0IHR5cGVzXG5cdFx0XCJoZWFkZXJcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmhlYWRlci50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiaW5wdXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmlucHV0cy50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiYnV0dG9uXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW0udHlwZSA9PT0gXCJidXR0b25cIiB8fCBuYW1lID09PSBcImJ1dHRvblwiO1xuXHRcdH0sXG5cblx0XHRcInRleHRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgYXR0cjtcblx0XHRcdC8vIElFNiBhbmQgNyB3aWxsIG1hcCBlbGVtLnR5cGUgdG8gJ3RleHQnIGZvciBuZXcgSFRNTDUgdHlwZXMgKHNlYXJjaCwgZXRjKVxuXHRcdFx0Ly8gdXNlIGdldEF0dHJpYnV0ZSBpbnN0ZWFkIHRvIHRlc3QgdGhpcyBjYXNlXG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgJiZcblx0XHRcdFx0ZWxlbS50eXBlID09PSBcInRleHRcIiAmJlxuXHRcdFx0XHQoIChhdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKSA9PSBudWxsIHx8IGF0dHIudG9Mb3dlckNhc2UoKSA9PT0gZWxlbS50eXBlICk7XG5cdFx0fSxcblxuXHRcdC8vIFBvc2l0aW9uLWluLWNvbGxlY3Rpb25cblx0XHRcImZpcnN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gWyAwIF07XG5cdFx0fSksXG5cblx0XHRcImxhc3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyhmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gWyBsZW5ndGggLSAxIF07XG5cdFx0fSksXG5cblx0XHRcImVxXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHJldHVybiBbIGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQgXTtcblx0XHR9KSxcblxuXHRcdFwiZXZlblwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9KSxcblxuXHRcdFwib2RkXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0dmFyIGkgPSAxO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpICs9IDIgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0pLFxuXG5cdFx0XCJsdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7IC0taSA+PSAwOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSksXG5cblx0XHRcImd0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHZhciBpID0gYXJndW1lbnQgPCAwID8gYXJndW1lbnQgKyBsZW5ndGggOiBhcmd1bWVudDtcblx0XHRcdGZvciAoIDsgKytpIDwgbGVuZ3RoOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSlcblx0fVxufTtcblxuRXhwci5wc2V1ZG9zW1wibnRoXCJdID0gRXhwci5wc2V1ZG9zW1wiZXFcIl07XG5cbi8vIEFkZCBidXR0b24vaW5wdXQgdHlwZSBwc2V1ZG9zXG5mb3IgKCBpIGluIHsgcmFkaW86IHRydWUsIGNoZWNrYm94OiB0cnVlLCBmaWxlOiB0cnVlLCBwYXNzd29yZDogdHJ1ZSwgaW1hZ2U6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVJbnB1dFBzZXVkbyggaSApO1xufVxuZm9yICggaSBpbiB7IHN1Ym1pdDogdHJ1ZSwgcmVzZXQ6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVCdXR0b25Qc2V1ZG8oIGkgKTtcbn1cblxuLy8gRWFzeSBBUEkgZm9yIGNyZWF0aW5nIG5ldyBzZXRGaWx0ZXJzXG5mdW5jdGlvbiBzZXRGaWx0ZXJzKCkge31cbnNldEZpbHRlcnMucHJvdG90eXBlID0gRXhwci5maWx0ZXJzID0gRXhwci5wc2V1ZG9zO1xuRXhwci5zZXRGaWx0ZXJzID0gbmV3IHNldEZpbHRlcnMoKTtcblxuZnVuY3Rpb24gdG9rZW5pemUoIHNlbGVjdG9yLCBwYXJzZU9ubHkgKSB7XG5cdHZhciBtYXRjaGVkLCBtYXRjaCwgdG9rZW5zLCB0eXBlLFxuXHRcdHNvRmFyLCBncm91cHMsIHByZUZpbHRlcnMsXG5cdFx0Y2FjaGVkID0gdG9rZW5DYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggY2FjaGVkICkge1xuXHRcdHJldHVybiBwYXJzZU9ubHkgPyAwIDogY2FjaGVkLnNsaWNlKCAwICk7XG5cdH1cblxuXHRzb0ZhciA9IHNlbGVjdG9yO1xuXHRncm91cHMgPSBbXTtcblx0cHJlRmlsdGVycyA9IEV4cHIucHJlRmlsdGVyO1xuXG5cdHdoaWxlICggc29GYXIgKSB7XG5cblx0XHQvLyBDb21tYSBhbmQgZmlyc3QgcnVuXG5cdFx0aWYgKCAhbWF0Y2hlZCB8fCAobWF0Y2ggPSByY29tbWEuZXhlYyggc29GYXIgKSkgKSB7XG5cdFx0XHRpZiAoIG1hdGNoICkge1xuXHRcdFx0XHQvLyBEb24ndCBjb25zdW1lIHRyYWlsaW5nIGNvbW1hcyBhcyB2YWxpZFxuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaFswXS5sZW5ndGggKSB8fCBzb0Zhcjtcblx0XHRcdH1cblx0XHRcdGdyb3Vwcy5wdXNoKCB0b2tlbnMgPSBbXSApO1xuXHRcdH1cblxuXHRcdG1hdGNoZWQgPSBmYWxzZTtcblxuXHRcdC8vIENvbWJpbmF0b3JzXG5cdFx0aWYgKCAobWF0Y2ggPSByY29tYmluYXRvcnMuZXhlYyggc29GYXIgKSkgKSB7XG5cdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdHRva2Vucy5wdXNoKHtcblx0XHRcdFx0dmFsdWU6IG1hdGNoZWQsXG5cdFx0XHRcdC8vIENhc3QgZGVzY2VuZGFudCBjb21iaW5hdG9ycyB0byBzcGFjZVxuXHRcdFx0XHR0eXBlOiBtYXRjaFswXS5yZXBsYWNlKCBydHJpbSwgXCIgXCIgKVxuXHRcdFx0fSk7XG5cdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZpbHRlcnNcblx0XHRmb3IgKCB0eXBlIGluIEV4cHIuZmlsdGVyICkge1xuXHRcdFx0aWYgKCAobWF0Y2ggPSBtYXRjaEV4cHJbIHR5cGUgXS5leGVjKCBzb0ZhciApKSAmJiAoIXByZUZpbHRlcnNbIHR5cGUgXSB8fFxuXHRcdFx0XHQobWF0Y2ggPSBwcmVGaWx0ZXJzWyB0eXBlIF0oIG1hdGNoICkpKSApIHtcblx0XHRcdFx0bWF0Y2hlZCA9IG1hdGNoLnNoaWZ0KCk7XG5cdFx0XHRcdHRva2Vucy5wdXNoKHtcblx0XHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblx0XHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRcdG1hdGNoZXM6IG1hdGNoXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggIW1hdGNoZWQgKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgaW52YWxpZCBleGNlc3Ncblx0Ly8gaWYgd2UncmUganVzdCBwYXJzaW5nXG5cdC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3Igb3IgcmV0dXJuIHRva2Vuc1xuXHRyZXR1cm4gcGFyc2VPbmx5ID9cblx0XHRzb0Zhci5sZW5ndGggOlxuXHRcdHNvRmFyID9cblx0XHRcdFNpenpsZS5lcnJvciggc2VsZWN0b3IgKSA6XG5cdFx0XHQvLyBDYWNoZSB0aGUgdG9rZW5zXG5cdFx0XHR0b2tlbkNhY2hlKCBzZWxlY3RvciwgZ3JvdXBzICkuc2xpY2UoIDAgKTtcbn1cblxuZnVuY3Rpb24gdG9TZWxlY3RvciggdG9rZW5zICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRzZWxlY3RvciA9IFwiXCI7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdHNlbGVjdG9yICs9IHRva2Vuc1tpXS52YWx1ZTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0b3I7XG59XG5cbmZ1bmN0aW9uIGFkZENvbWJpbmF0b3IoIG1hdGNoZXIsIGNvbWJpbmF0b3IsIGJhc2UgKSB7XG5cdHZhciBkaXIgPSBjb21iaW5hdG9yLmRpcixcblx0XHRjaGVja05vbkVsZW1lbnRzID0gYmFzZSAmJiBkaXIgPT09IFwicGFyZW50Tm9kZVwiLFxuXHRcdGRvbmVOYW1lID0gZG9uZSsrO1xuXG5cdHJldHVybiBjb21iaW5hdG9yLmZpcnN0ID9cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGNsb3Nlc3QgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0d2hpbGUgKCAoZWxlbSA9IGVsZW1bIGRpciBdKSApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSA6XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGFsbCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudHNcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIGRhdGEsIGNhY2hlLCBvdXRlckNhY2hlLFxuXHRcdFx0XHRkaXJrZXkgPSBkaXJydW5zICsgXCIgXCIgKyBkb25lTmFtZTtcblxuXHRcdFx0Ly8gV2UgY2FuJ3Qgc2V0IGFyYml0cmFyeSBkYXRhIG9uIFhNTCBub2Rlcywgc28gdGhleSBkb24ndCBiZW5lZml0IGZyb20gZGlyIGNhY2hpbmdcblx0XHRcdGlmICggeG1sICkge1xuXHRcdFx0XHR3aGlsZSAoIChlbGVtID0gZWxlbVsgZGlyIF0pICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aGlsZSAoIChlbGVtID0gZWxlbVsgZGlyIF0pICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IGVsZW1bIGV4cGFuZG8gXSB8fCAoZWxlbVsgZXhwYW5kbyBdID0ge30pO1xuXHRcdFx0XHRcdFx0aWYgKCAoY2FjaGUgPSBvdXRlckNhY2hlWyBkaXIgXSkgJiYgY2FjaGVbMF0gPT09IGRpcmtleSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAoZGF0YSA9IGNhY2hlWzFdKSA9PT0gdHJ1ZSB8fCBkYXRhID09PSBjYWNoZWRydW5zICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBkYXRhID09PSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjYWNoZSA9IG91dGVyQ2FjaGVbIGRpciBdID0gWyBkaXJrZXkgXTtcblx0XHRcdFx0XHRcdFx0Y2FjaGVbMV0gPSBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB8fCBjYWNoZWRydW5zO1xuXHRcdFx0XHRcdFx0XHRpZiAoIGNhY2hlWzFdID09PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICkge1xuXHRyZXR1cm4gbWF0Y2hlcnMubGVuZ3RoID4gMSA/XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBpID0gbWF0Y2hlcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggIW1hdGNoZXJzW2ldKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gOlxuXHRcdG1hdGNoZXJzWzBdO1xufVxuXG5mdW5jdGlvbiBjb25kZW5zZSggdW5tYXRjaGVkLCBtYXAsIGZpbHRlciwgY29udGV4dCwgeG1sICkge1xuXHR2YXIgZWxlbSxcblx0XHRuZXdVbm1hdGNoZWQgPSBbXSxcblx0XHRpID0gMCxcblx0XHRsZW4gPSB1bm1hdGNoZWQubGVuZ3RoLFxuXHRcdG1hcHBlZCA9IG1hcCAhPSBudWxsO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKGVsZW0gPSB1bm1hdGNoZWRbaV0pICkge1xuXHRcdFx0aWYgKCAhZmlsdGVyIHx8IGZpbHRlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdG5ld1VubWF0Y2hlZC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdGlmICggbWFwcGVkICkge1xuXHRcdFx0XHRcdG1hcC5wdXNoKCBpICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbmV3VW5tYXRjaGVkO1xufVxuXG5mdW5jdGlvbiBzZXRNYXRjaGVyKCBwcmVGaWx0ZXIsIHNlbGVjdG9yLCBtYXRjaGVyLCBwb3N0RmlsdGVyLCBwb3N0RmluZGVyLCBwb3N0U2VsZWN0b3IgKSB7XG5cdGlmICggcG9zdEZpbHRlciAmJiAhcG9zdEZpbHRlclsgZXhwYW5kbyBdICkge1xuXHRcdHBvc3RGaWx0ZXIgPSBzZXRNYXRjaGVyKCBwb3N0RmlsdGVyICk7XG5cdH1cblx0aWYgKCBwb3N0RmluZGVyICYmICFwb3N0RmluZGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbmRlciA9IHNldE1hdGNoZXIoIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApO1xuXHR9XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oZnVuY3Rpb24oIHNlZWQsIHJlc3VsdHMsIGNvbnRleHQsIHhtbCApIHtcblx0XHR2YXIgdGVtcCwgaSwgZWxlbSxcblx0XHRcdHByZU1hcCA9IFtdLFxuXHRcdFx0cG9zdE1hcCA9IFtdLFxuXHRcdFx0cHJlZXhpc3RpbmcgPSByZXN1bHRzLmxlbmd0aCxcblxuXHRcdFx0Ly8gR2V0IGluaXRpYWwgZWxlbWVudHMgZnJvbSBzZWVkIG9yIGNvbnRleHRcblx0XHRcdGVsZW1zID0gc2VlZCB8fCBtdWx0aXBsZUNvbnRleHRzKCBzZWxlY3RvciB8fCBcIipcIiwgY29udGV4dC5ub2RlVHlwZSA/IFsgY29udGV4dCBdIDogY29udGV4dCwgW10gKSxcblxuXHRcdFx0Ly8gUHJlZmlsdGVyIHRvIGdldCBtYXRjaGVyIGlucHV0LCBwcmVzZXJ2aW5nIGEgbWFwIGZvciBzZWVkLXJlc3VsdHMgc3luY2hyb25pemF0aW9uXG5cdFx0XHRtYXRjaGVySW4gPSBwcmVGaWx0ZXIgJiYgKCBzZWVkIHx8ICFzZWxlY3RvciApID9cblx0XHRcdFx0Y29uZGVuc2UoIGVsZW1zLCBwcmVNYXAsIHByZUZpbHRlciwgY29udGV4dCwgeG1sICkgOlxuXHRcdFx0XHRlbGVtcyxcblxuXHRcdFx0bWF0Y2hlck91dCA9IG1hdGNoZXIgP1xuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGEgcG9zdEZpbmRlciwgb3IgZmlsdGVyZWQgc2VlZCwgb3Igbm9uLXNlZWQgcG9zdEZpbHRlciBvciBwcmVleGlzdGluZyByZXN1bHRzLFxuXHRcdFx0XHRwb3N0RmluZGVyIHx8ICggc2VlZCA/IHByZUZpbHRlciA6IHByZWV4aXN0aW5nIHx8IHBvc3RGaWx0ZXIgKSA/XG5cblx0XHRcdFx0XHQvLyAuLi5pbnRlcm1lZGlhdGUgcHJvY2Vzc2luZyBpcyBuZWNlc3Nhcnlcblx0XHRcdFx0XHRbXSA6XG5cblx0XHRcdFx0XHQvLyAuLi5vdGhlcndpc2UgdXNlIHJlc3VsdHMgZGlyZWN0bHlcblx0XHRcdFx0XHRyZXN1bHRzIDpcblx0XHRcdFx0bWF0Y2hlckluO1xuXG5cdFx0Ly8gRmluZCBwcmltYXJ5IG1hdGNoZXNcblx0XHRpZiAoIG1hdGNoZXIgKSB7XG5cdFx0XHRtYXRjaGVyKCBtYXRjaGVySW4sIG1hdGNoZXJPdXQsIGNvbnRleHQsIHhtbCApO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHBvc3RGaWx0ZXJcblx0XHRpZiAoIHBvc3RGaWx0ZXIgKSB7XG5cdFx0XHR0ZW1wID0gY29uZGVuc2UoIG1hdGNoZXJPdXQsIHBvc3RNYXAgKTtcblx0XHRcdHBvc3RGaWx0ZXIoIHRlbXAsIFtdLCBjb250ZXh0LCB4bWwgKTtcblxuXHRcdFx0Ly8gVW4tbWF0Y2ggZmFpbGluZyBlbGVtZW50cyBieSBtb3ZpbmcgdGhlbSBiYWNrIHRvIG1hdGNoZXJJblxuXHRcdFx0aSA9IHRlbXAubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggKGVsZW0gPSB0ZW1wW2ldKSApIHtcblx0XHRcdFx0XHRtYXRjaGVyT3V0WyBwb3N0TWFwW2ldIF0gPSAhKG1hdGNoZXJJblsgcG9zdE1hcFtpXSBdID0gZWxlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgfHwgcHJlRmlsdGVyICkge1xuXHRcdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cdFx0XHRcdFx0Ly8gR2V0IHRoZSBmaW5hbCBtYXRjaGVyT3V0IGJ5IGNvbmRlbnNpbmcgdGhpcyBpbnRlcm1lZGlhdGUgaW50byBwb3N0RmluZGVyIGNvbnRleHRzXG5cdFx0XHRcdFx0dGVtcCA9IFtdO1xuXHRcdFx0XHRcdGkgPSBtYXRjaGVyT3V0Lmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKGVsZW0gPSBtYXRjaGVyT3V0W2ldKSApIHtcblx0XHRcdFx0XHRcdFx0Ly8gUmVzdG9yZSBtYXRjaGVySW4gc2luY2UgZWxlbSBpcyBub3QgeWV0IGEgZmluYWwgbWF0Y2hcblx0XHRcdFx0XHRcdFx0dGVtcC5wdXNoKCAobWF0Y2hlckluW2ldID0gZWxlbSkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cG9zdEZpbmRlciggbnVsbCwgKG1hdGNoZXJPdXQgPSBbXSksIHRlbXAsIHhtbCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTW92ZSBtYXRjaGVkIGVsZW1lbnRzIGZyb20gc2VlZCB0byByZXN1bHRzIHRvIGtlZXAgdGhlbSBzeW5jaHJvbml6ZWRcblx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRpZiAoIChlbGVtID0gbWF0Y2hlck91dFtpXSkgJiZcblx0XHRcdFx0XHRcdCh0ZW1wID0gcG9zdEZpbmRlciA/IGluZGV4T2YuY2FsbCggc2VlZCwgZWxlbSApIDogcHJlTWFwW2ldKSA+IC0xICkge1xuXG5cdFx0XHRcdFx0XHRzZWVkW3RlbXBdID0gIShyZXN1bHRzW3RlbXBdID0gZWxlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBBZGQgZWxlbWVudHMgdG8gcmVzdWx0cywgdGhyb3VnaCBwb3N0RmluZGVyIGlmIGRlZmluZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlck91dCA9IGNvbmRlbnNlKFxuXHRcdFx0XHRtYXRjaGVyT3V0ID09PSByZXN1bHRzID9cblx0XHRcdFx0XHRtYXRjaGVyT3V0LnNwbGljZSggcHJlZXhpc3RpbmcsIG1hdGNoZXJPdXQubGVuZ3RoICkgOlxuXHRcdFx0XHRcdG1hdGNoZXJPdXRcblx0XHRcdCk7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsIHJlc3VsdHMsIG1hdGNoZXJPdXQsIHhtbCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgbWF0Y2hlck91dCApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciBjaGVja0NvbnRleHQsIG1hdGNoZXIsIGosXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRsZWFkaW5nUmVsYXRpdmUgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbMF0udHlwZSBdLFxuXHRcdGltcGxpY2l0UmVsYXRpdmUgPSBsZWFkaW5nUmVsYXRpdmUgfHwgRXhwci5yZWxhdGl2ZVtcIiBcIl0sXG5cdFx0aSA9IGxlYWRpbmdSZWxhdGl2ZSA/IDEgOiAwLFxuXG5cdFx0Ly8gVGhlIGZvdW5kYXRpb25hbCBtYXRjaGVyIGVuc3VyZXMgdGhhdCBlbGVtZW50cyBhcmUgcmVhY2hhYmxlIGZyb20gdG9wLWxldmVsIGNvbnRleHQocylcblx0XHRtYXRjaENvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBjaGVja0NvbnRleHQ7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoQW55Q29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGluZGV4T2YuY2FsbCggY2hlY2tDb250ZXh0LCBlbGVtICkgPiAtMTtcblx0XHR9LCBpbXBsaWNpdFJlbGF0aXZlLCB0cnVlICksXG5cdFx0bWF0Y2hlcnMgPSBbIGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRyZXR1cm4gKCAhbGVhZGluZ1JlbGF0aXZlICYmICggeG1sIHx8IGNvbnRleHQgIT09IG91dGVybW9zdENvbnRleHQgKSApIHx8IChcblx0XHRcdFx0KGNoZWNrQ29udGV4dCA9IGNvbnRleHQpLm5vZGVUeXBlID9cblx0XHRcdFx0XHRtYXRjaENvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApIDpcblx0XHRcdFx0XHRtYXRjaEFueUNvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApICk7XG5cdFx0fSBdO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKG1hdGNoZXIgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbaV0udHlwZSBdKSApIHtcblx0XHRcdG1hdGNoZXJzID0gWyBhZGRDb21iaW5hdG9yKGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLCBtYXRjaGVyKSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaGVyID0gRXhwci5maWx0ZXJbIHRva2Vuc1tpXS50eXBlIF0uYXBwbHkoIG51bGwsIHRva2Vuc1tpXS5tYXRjaGVzICk7XG5cblx0XHRcdC8vIFJldHVybiBzcGVjaWFsIHVwb24gc2VlaW5nIGEgcG9zaXRpb25hbCBtYXRjaGVyXG5cdFx0XHRpZiAoIG1hdGNoZXJbIGV4cGFuZG8gXSApIHtcblx0XHRcdFx0Ly8gRmluZCB0aGUgbmV4dCByZWxhdGl2ZSBvcGVyYXRvciAoaWYgYW55KSBmb3IgcHJvcGVyIGhhbmRsaW5nXG5cdFx0XHRcdGogPSArK2k7XG5cdFx0XHRcdGZvciAoIDsgaiA8IGxlbjsgaisrICkge1xuXHRcdFx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgdG9rZW5zW2pdLnR5cGUgXSApIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc2V0TWF0Y2hlcihcblx0XHRcdFx0XHRpID4gMSAmJiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSxcblx0XHRcdFx0XHRpID4gMSAmJiB0b1NlbGVjdG9yKFxuXHRcdFx0XHRcdFx0Ly8gSWYgdGhlIHByZWNlZGluZyB0b2tlbiB3YXMgYSBkZXNjZW5kYW50IGNvbWJpbmF0b3IsIGluc2VydCBhbiBpbXBsaWNpdCBhbnktZWxlbWVudCBgKmBcblx0XHRcdFx0XHRcdHRva2Vucy5zbGljZSggMCwgaSAtIDEgKS5jb25jYXQoeyB2YWx1ZTogdG9rZW5zWyBpIC0gMiBdLnR5cGUgPT09IFwiIFwiID8gXCIqXCIgOiBcIlwiIH0pXG5cdFx0XHRcdFx0KS5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksXG5cdFx0XHRcdFx0bWF0Y2hlcixcblx0XHRcdFx0XHRpIDwgaiAmJiBtYXRjaGVyRnJvbVRva2VucyggdG9rZW5zLnNsaWNlKCBpLCBqICkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIG1hdGNoZXJGcm9tVG9rZW5zKCAodG9rZW5zID0gdG9rZW5zLnNsaWNlKCBqICkpICksXG5cdFx0XHRcdFx0aiA8IGxlbiAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0bWF0Y2hlcnMucHVzaCggbWF0Y2hlciApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzKCBlbGVtZW50TWF0Y2hlcnMsIHNldE1hdGNoZXJzICkge1xuXHQvLyBBIGNvdW50ZXIgdG8gc3BlY2lmeSB3aGljaCBlbGVtZW50IGlzIGN1cnJlbnRseSBiZWluZyBtYXRjaGVkXG5cdHZhciBtYXRjaGVyQ2FjaGVkUnVucyA9IDAsXG5cdFx0YnlTZXQgPSBzZXRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdGJ5RWxlbWVudCA9IGVsZW1lbnRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdHN1cGVyTWF0Y2hlciA9IGZ1bmN0aW9uKCBzZWVkLCBjb250ZXh0LCB4bWwsIHJlc3VsdHMsIGV4cGFuZENvbnRleHQgKSB7XG5cdFx0XHR2YXIgZWxlbSwgaiwgbWF0Y2hlcixcblx0XHRcdFx0c2V0TWF0Y2hlZCA9IFtdLFxuXHRcdFx0XHRtYXRjaGVkQ291bnQgPSAwLFxuXHRcdFx0XHRpID0gXCIwXCIsXG5cdFx0XHRcdHVubWF0Y2hlZCA9IHNlZWQgJiYgW10sXG5cdFx0XHRcdG91dGVybW9zdCA9IGV4cGFuZENvbnRleHQgIT0gbnVsbCxcblx0XHRcdFx0Y29udGV4dEJhY2t1cCA9IG91dGVybW9zdENvbnRleHQsXG5cdFx0XHRcdC8vIFdlIG11c3QgYWx3YXlzIGhhdmUgZWl0aGVyIHNlZWQgZWxlbWVudHMgb3IgY29udGV4dFxuXHRcdFx0XHRlbGVtcyA9IHNlZWQgfHwgYnlFbGVtZW50ICYmIEV4cHIuZmluZFtcIlRBR1wiXSggXCIqXCIsIGV4cGFuZENvbnRleHQgJiYgY29udGV4dC5wYXJlbnROb2RlIHx8IGNvbnRleHQgKSxcblx0XHRcdFx0Ly8gVXNlIGludGVnZXIgZGlycnVucyBpZmYgdGhpcyBpcyB0aGUgb3V0ZXJtb3N0IG1hdGNoZXJcblx0XHRcdFx0ZGlycnVuc1VuaXF1ZSA9IChkaXJydW5zICs9IGNvbnRleHRCYWNrdXAgPT0gbnVsbCA/IDEgOiBNYXRoLnJhbmRvbSgpIHx8IDAuMSk7XG5cblx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRvdXRlcm1vc3RDb250ZXh0ID0gY29udGV4dCAhPT0gZG9jdW1lbnQgJiYgY29udGV4dDtcblx0XHRcdFx0Y2FjaGVkcnVucyA9IG1hdGNoZXJDYWNoZWRSdW5zO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgZWxlbWVudHMgcGFzc2luZyBlbGVtZW50TWF0Y2hlcnMgZGlyZWN0bHkgdG8gcmVzdWx0c1xuXHRcdFx0Ly8gS2VlcCBgaWAgYSBzdHJpbmcgaWYgdGhlcmUgYXJlIG5vIGVsZW1lbnRzIHNvIGBtYXRjaGVkQ291bnRgIHdpbGwgYmUgXCIwMFwiIGJlbG93XG5cdFx0XHRmb3IgKCA7IChlbGVtID0gZWxlbXNbaV0pICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBieUVsZW1lbnQgJiYgZWxlbSApIHtcblx0XHRcdFx0XHRqID0gMDtcblx0XHRcdFx0XHR3aGlsZSAoIChtYXRjaGVyID0gZWxlbWVudE1hdGNoZXJzW2orK10pICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0XHRcdGRpcnJ1bnMgPSBkaXJydW5zVW5pcXVlO1xuXHRcdFx0XHRcdFx0Y2FjaGVkcnVucyA9ICsrbWF0Y2hlckNhY2hlZFJ1bnM7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhY2sgdW5tYXRjaGVkIGVsZW1lbnRzIGZvciBzZXQgZmlsdGVyc1xuXHRcdFx0XHRpZiAoIGJ5U2V0ICkge1xuXHRcdFx0XHRcdC8vIFRoZXkgd2lsbCBoYXZlIGdvbmUgdGhyb3VnaCBhbGwgcG9zc2libGUgbWF0Y2hlcnNcblx0XHRcdFx0XHRpZiAoIChlbGVtID0gIW1hdGNoZXIgJiYgZWxlbSkgKSB7XG5cdFx0XHRcdFx0XHRtYXRjaGVkQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMZW5ndGhlbiB0aGUgYXJyYXkgZm9yIGV2ZXJ5IGVsZW1lbnQsIG1hdGNoZWQgb3Igbm90XG5cdFx0XHRcdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0XHRcdFx0dW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gQXBwbHkgc2V0IGZpbHRlcnMgdG8gdW5tYXRjaGVkIGVsZW1lbnRzXG5cdFx0XHRtYXRjaGVkQ291bnQgKz0gaTtcblx0XHRcdGlmICggYnlTZXQgJiYgaSAhPT0gbWF0Y2hlZENvdW50ICkge1xuXHRcdFx0XHRqID0gMDtcblx0XHRcdFx0d2hpbGUgKCAobWF0Y2hlciA9IHNldE1hdGNoZXJzW2orK10pICkge1xuXHRcdFx0XHRcdG1hdGNoZXIoIHVubWF0Y2hlZCwgc2V0TWF0Y2hlZCwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRcdFx0Ly8gUmVpbnRlZ3JhdGUgZWxlbWVudCBtYXRjaGVzIHRvIGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3Igc29ydGluZ1xuXHRcdFx0XHRcdGlmICggbWF0Y2hlZENvdW50ID4gMCApIHtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICEodW5tYXRjaGVkW2ldIHx8IHNldE1hdGNoZWRbaV0pICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldE1hdGNoZWRbaV0gPSBwb3AuY2FsbCggcmVzdWx0cyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRGlzY2FyZCBpbmRleCBwbGFjZWhvbGRlciB2YWx1ZXMgdG8gZ2V0IG9ubHkgYWN0dWFsIG1hdGNoZXNcblx0XHRcdFx0XHRzZXRNYXRjaGVkID0gY29uZGVuc2UoIHNldE1hdGNoZWQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBtYXRjaGVzIHRvIHJlc3VsdHNcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2V0TWF0Y2hlZCApO1xuXG5cdFx0XHRcdC8vIFNlZWRsZXNzIHNldCBtYXRjaGVzIHN1Y2NlZWRpbmcgbXVsdGlwbGUgc3VjY2Vzc2Z1bCBtYXRjaGVycyBzdGlwdWxhdGUgc29ydGluZ1xuXHRcdFx0XHRpZiAoIG91dGVybW9zdCAmJiAhc2VlZCAmJiBzZXRNYXRjaGVkLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHQoIG1hdGNoZWRDb3VudCArIHNldE1hdGNoZXJzLmxlbmd0aCApID4gMSApIHtcblxuXHRcdFx0XHRcdFNpenpsZS51bmlxdWVTb3J0KCByZXN1bHRzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gT3ZlcnJpZGUgbWFuaXB1bGF0aW9uIG9mIGdsb2JhbHMgYnkgbmVzdGVkIG1hdGNoZXJzXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0QmFja3VwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5tYXRjaGVkO1xuXHRcdH07XG5cblx0cmV0dXJuIGJ5U2V0ID9cblx0XHRtYXJrRnVuY3Rpb24oIHN1cGVyTWF0Y2hlciApIDpcblx0XHRzdXBlck1hdGNoZXI7XG59XG5cbmNvbXBpbGUgPSBTaXp6bGUuY29tcGlsZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgZ3JvdXAgLyogSW50ZXJuYWwgVXNlIE9ubHkgKi8gKSB7XG5cdHZhciBpLFxuXHRcdHNldE1hdGNoZXJzID0gW10sXG5cdFx0ZWxlbWVudE1hdGNoZXJzID0gW10sXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggIWNhY2hlZCApIHtcblx0XHQvLyBHZW5lcmF0ZSBhIGZ1bmN0aW9uIG9mIHJlY3Vyc2l2ZSBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjaGVjayBlYWNoIGVsZW1lbnRcblx0XHRpZiAoICFncm91cCApIHtcblx0XHRcdGdyb3VwID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0fVxuXHRcdGkgPSBncm91cC5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRjYWNoZWQgPSBtYXRjaGVyRnJvbVRva2VucyggZ3JvdXBbaV0gKTtcblx0XHRcdGlmICggY2FjaGVkWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHNldE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhY2hlIHRoZSBjb21waWxlZCBmdW5jdGlvblxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGUoIHNlbGVjdG9yLCBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSApO1xuXHR9XG5cdHJldHVybiBjYWNoZWQ7XG59O1xuXG5mdW5jdGlvbiBtdWx0aXBsZUNvbnRleHRzKCBzZWxlY3RvciwgY29udGV4dHMsIHJlc3VsdHMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHRzW2ldLCByZXN1bHRzICk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdCggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBpLCB0b2tlbnMsIHRva2VuLCB0eXBlLCBmaW5kLFxuXHRcdG1hdGNoID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cblx0aWYgKCAhc2VlZCApIHtcblx0XHQvLyBUcnkgdG8gbWluaW1pemUgb3BlcmF0aW9ucyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBncm91cFxuXHRcdGlmICggbWF0Y2gubGVuZ3RoID09PSAxICkge1xuXG5cdFx0XHQvLyBUYWtlIGEgc2hvcnRjdXQgYW5kIHNldCB0aGUgY29udGV4dCBpZiB0aGUgcm9vdCBzZWxlY3RvciBpcyBhbiBJRFxuXHRcdFx0dG9rZW5zID0gbWF0Y2hbMF0gPSBtYXRjaFswXS5zbGljZSggMCApO1xuXHRcdFx0aWYgKCB0b2tlbnMubGVuZ3RoID4gMiAmJiAodG9rZW4gPSB0b2tlbnNbMF0pLnR5cGUgPT09IFwiSURcIiAmJlxuXHRcdFx0XHRcdHN1cHBvcnQuZ2V0QnlJZCAmJiBjb250ZXh0Lm5vZGVUeXBlID09PSA5ICYmIGRvY3VtZW50SXNIVE1MICYmXG5cdFx0XHRcdFx0RXhwci5yZWxhdGl2ZVsgdG9rZW5zWzFdLnR5cGUgXSApIHtcblxuXHRcdFx0XHRjb250ZXh0ID0gKCBFeHByLmZpbmRbXCJJRFwiXSggdG9rZW4ubWF0Y2hlc1swXS5yZXBsYWNlKHJ1bmVzY2FwZSwgZnVuZXNjYXBlKSwgY29udGV4dCApIHx8IFtdIClbMF07XG5cdFx0XHRcdGlmICggIWNvbnRleHQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zbGljZSggdG9rZW5zLnNoaWZ0KCkudmFsdWUubGVuZ3RoICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZldGNoIGEgc2VlZCBzZXQgZm9yIHJpZ2h0LXRvLWxlZnQgbWF0Y2hpbmdcblx0XHRcdGkgPSBtYXRjaEV4cHJbXCJuZWVkc0NvbnRleHRcIl0udGVzdCggc2VsZWN0b3IgKSA/IDAgOiB0b2tlbnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdHRva2VuID0gdG9rZW5zW2ldO1xuXG5cdFx0XHRcdC8vIEFib3J0IGlmIHdlIGhpdCBhIGNvbWJpbmF0b3Jcblx0XHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyAodHlwZSA9IHRva2VuLnR5cGUpIF0gKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCAoZmluZCA9IEV4cHIuZmluZFsgdHlwZSBdKSApIHtcblx0XHRcdFx0XHQvLyBTZWFyY2gsIGV4cGFuZGluZyBjb250ZXh0IGZvciBsZWFkaW5nIHNpYmxpbmcgY29tYmluYXRvcnNcblx0XHRcdFx0XHRpZiAoIChzZWVkID0gZmluZChcblx0XHRcdFx0XHRcdHRva2VuLm1hdGNoZXNbMF0ucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKSxcblx0XHRcdFx0XHRcdHJzaWJsaW5nLnRlc3QoIHRva2Vuc1swXS50eXBlICkgJiYgY29udGV4dC5wYXJlbnROb2RlIHx8IGNvbnRleHRcblx0XHRcdFx0XHQpKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gSWYgc2VlZCBpcyBlbXB0eSBvciBubyB0b2tlbnMgcmVtYWluLCB3ZSBjYW4gcmV0dXJuIGVhcmx5XG5cdFx0XHRcdFx0XHR0b2tlbnMuc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0XHRzZWxlY3RvciA9IHNlZWQubGVuZ3RoICYmIHRvU2VsZWN0b3IoIHRva2VucyApO1xuXHRcdFx0XHRcdFx0aWYgKCAhc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNlZWQgKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENvbXBpbGUgYW5kIGV4ZWN1dGUgYSBmaWx0ZXJpbmcgZnVuY3Rpb25cblx0Ly8gUHJvdmlkZSBgbWF0Y2hgIHRvIGF2b2lkIHJldG9rZW5pemF0aW9uIGlmIHdlIG1vZGlmaWVkIHRoZSBzZWxlY3RvciBhYm92ZVxuXHRjb21waWxlKCBzZWxlY3RvciwgbWF0Y2ggKShcblx0XHRzZWVkLFxuXHRcdGNvbnRleHQsXG5cdFx0IWRvY3VtZW50SXNIVE1MLFxuXHRcdHJlc3VsdHMsXG5cdFx0cnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKVxuXHQpO1xuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuLy8gT25lLXRpbWUgYXNzaWdubWVudHNcblxuLy8gU29ydCBzdGFiaWxpdHlcbnN1cHBvcnQuc29ydFN0YWJsZSA9IGV4cGFuZG8uc3BsaXQoXCJcIikuc29ydCggc29ydE9yZGVyICkuam9pbihcIlwiKSA9PT0gZXhwYW5kbztcblxuLy8gU3VwcG9ydDogQ2hyb21lPDE0XG4vLyBBbHdheXMgYXNzdW1lIGR1cGxpY2F0ZXMgaWYgdGhleSBhcmVuJ3QgcGFzc2VkIHRvIHRoZSBjb21wYXJpc29uIGZ1bmN0aW9uXG5zdXBwb3J0LmRldGVjdER1cGxpY2F0ZXMgPSBoYXNEdXBsaWNhdGU7XG5cbi8vIEluaXRpYWxpemUgYWdhaW5zdCB0aGUgZGVmYXVsdCBkb2N1bWVudFxuc2V0RG9jdW1lbnQoKTtcblxuLy8gU3VwcG9ydDogV2Via2l0PDUzNy4zMiAtIFNhZmFyaSA2LjAuMy9DaHJvbWUgMjUgKGZpeGVkIGluIENocm9tZSAyNylcbi8vIERldGFjaGVkIG5vZGVzIGNvbmZvdW5kaW5nbHkgZm9sbG93ICplYWNoIG90aGVyKlxuc3VwcG9ydC5zb3J0RGV0YWNoZWQgPSBhc3NlcnQoZnVuY3Rpb24oIGRpdjEgKSB7XG5cdC8vIFNob3VsZCByZXR1cm4gMSwgYnV0IHJldHVybnMgNCAoZm9sbG93aW5nKVxuXHRyZXR1cm4gZGl2MS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSApICYgMTtcbn0pO1xuXG4vLyBTdXBwb3J0OiBJRTw4XG4vLyBQcmV2ZW50IGF0dHJpYnV0ZS9wcm9wZXJ0eSBcImludGVycG9sYXRpb25cIlxuLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM2NDI5JTI4VlMuODUlMjkuYXNweFxuaWYgKCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdGRpdi5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyMnPjwvYT5cIjtcblx0cmV0dXJuIGRpdi5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI1wiIDtcbn0pICkge1xuXHRhZGRIYW5kbGUoIFwidHlwZXxocmVmfGhlaWdodHx3aWR0aFwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0eXBlXCIgPyAxIDogMiApO1xuXHRcdH1cblx0fSk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBkZWZhdWx0VmFsdWUgaW4gcGxhY2Ugb2YgZ2V0QXR0cmlidXRlKFwidmFsdWVcIilcbmlmICggIXN1cHBvcnQuYXR0cmlidXRlcyB8fCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdGRpdi5pbm5lckhUTUwgPSBcIjxpbnB1dC8+XCI7XG5cdGRpdi5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBcIlwiICk7XG5cdHJldHVybiBkaXYuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiApID09PSBcIlwiO1xufSkgKSB7XG5cdGFkZEhhbmRsZSggXCJ2YWx1ZVwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kZWZhdWx0VmFsdWU7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGdldEF0dHJpYnV0ZU5vZGUgdG8gZmV0Y2ggYm9vbGVhbnMgd2hlbiBnZXRBdHRyaWJ1dGUgbGllc1xuaWYgKCAhYXNzZXJ0KGZ1bmN0aW9uKCBkaXYgKSB7XG5cdHJldHVybiBkaXYuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIikgPT0gbnVsbDtcbn0pICkge1xuXHRhZGRIYW5kbGUoIGJvb2xlYW5zLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0dmFyIHZhbDtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiAodmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkpICYmIHZhbC5zcGVjaWZpZWQgP1xuXHRcdFx0XHR2YWwudmFsdWUgOlxuXHRcdFx0XHRlbGVtWyBuYW1lIF0gPT09IHRydWUgPyBuYW1lLnRvTG93ZXJDYXNlKCkgOiBudWxsO1xuXHRcdH1cblx0fSk7XG59XG5cbmpRdWVyeS5maW5kID0gU2l6emxlO1xualF1ZXJ5LmV4cHIgPSBTaXp6bGUuc2VsZWN0b3JzO1xualF1ZXJ5LmV4cHJbXCI6XCJdID0galF1ZXJ5LmV4cHIucHNldWRvcztcbmpRdWVyeS51bmlxdWUgPSBTaXp6bGUudW5pcXVlU29ydDtcbmpRdWVyeS50ZXh0ID0gU2l6emxlLmdldFRleHQ7XG5qUXVlcnkuaXNYTUxEb2MgPSBTaXp6bGUuaXNYTUw7XG5qUXVlcnkuY29udGFpbnMgPSBTaXp6bGUuY29udGFpbnM7XG5cblxufSkoIHdpbmRvdyApO1xuLy8gU3RyaW5nIHRvIE9iamVjdCBvcHRpb25zIGZvcm1hdCBjYWNoZVxudmFyIG9wdGlvbnNDYWNoZSA9IHt9O1xuXG4vLyBDb252ZXJ0IFN0cmluZy1mb3JtYXR0ZWQgb3B0aW9ucyBpbnRvIE9iamVjdC1mb3JtYXR0ZWQgb25lcyBhbmQgc3RvcmUgaW4gY2FjaGVcbmZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnMoIG9wdGlvbnMgKSB7XG5cdHZhciBvYmplY3QgPSBvcHRpb25zQ2FjaGVbIG9wdGlvbnMgXSA9IHt9O1xuXHRqUXVlcnkuZWFjaCggb3B0aW9ucy5tYXRjaCggY29yZV9ybm90d2hpdGUgKSB8fCBbXSwgZnVuY3Rpb24oIF8sIGZsYWcgKSB7XG5cdFx0b2JqZWN0WyBmbGFnIF0gPSB0cnVlO1xuXHR9KTtcblx0cmV0dXJuIG9iamVjdDtcbn1cblxuLypcbiAqIENyZWF0ZSBhIGNhbGxiYWNrIGxpc3QgdXNpbmcgdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICpcbiAqXHRvcHRpb25zOiBhbiBvcHRpb25hbCBsaXN0IG9mIHNwYWNlLXNlcGFyYXRlZCBvcHRpb25zIHRoYXQgd2lsbCBjaGFuZ2UgaG93XG4gKlx0XHRcdHRoZSBjYWxsYmFjayBsaXN0IGJlaGF2ZXMgb3IgYSBtb3JlIHRyYWRpdGlvbmFsIG9wdGlvbiBvYmplY3RcbiAqXG4gKiBCeSBkZWZhdWx0IGEgY2FsbGJhY2sgbGlzdCB3aWxsIGFjdCBsaWtlIGFuIGV2ZW50IGNhbGxiYWNrIGxpc3QgYW5kIGNhbiBiZVxuICogXCJmaXJlZFwiIG11bHRpcGxlIHRpbWVzLlxuICpcbiAqIFBvc3NpYmxlIG9wdGlvbnM6XG4gKlxuICpcdG9uY2U6XHRcdFx0d2lsbCBlbnN1cmUgdGhlIGNhbGxiYWNrIGxpc3QgY2FuIG9ubHkgYmUgZmlyZWQgb25jZSAobGlrZSBhIERlZmVycmVkKVxuICpcbiAqXHRtZW1vcnk6XHRcdFx0d2lsbCBrZWVwIHRyYWNrIG9mIHByZXZpb3VzIHZhbHVlcyBhbmQgd2lsbCBjYWxsIGFueSBjYWxsYmFjayBhZGRlZFxuICpcdFx0XHRcdFx0YWZ0ZXIgdGhlIGxpc3QgaGFzIGJlZW4gZmlyZWQgcmlnaHQgYXdheSB3aXRoIHRoZSBsYXRlc3QgXCJtZW1vcml6ZWRcIlxuICpcdFx0XHRcdFx0dmFsdWVzIChsaWtlIGEgRGVmZXJyZWQpXG4gKlxuICpcdHVuaXF1ZTpcdFx0XHR3aWxsIGVuc3VyZSBhIGNhbGxiYWNrIGNhbiBvbmx5IGJlIGFkZGVkIG9uY2UgKG5vIGR1cGxpY2F0ZSBpbiB0aGUgbGlzdClcbiAqXG4gKlx0c3RvcE9uRmFsc2U6XHRpbnRlcnJ1cHQgY2FsbGluZ3Mgd2hlbiBhIGNhbGxiYWNrIHJldHVybnMgZmFsc2VcbiAqXG4gKi9cbmpRdWVyeS5DYWxsYmFja3MgPSBmdW5jdGlvbiggb3B0aW9ucyApIHtcblxuXHQvLyBDb252ZXJ0IG9wdGlvbnMgZnJvbSBTdHJpbmctZm9ybWF0dGVkIHRvIE9iamVjdC1mb3JtYXR0ZWQgaWYgbmVlZGVkXG5cdC8vICh3ZSBjaGVjayBpbiBjYWNoZSBmaXJzdClcblx0b3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiID9cblx0XHQoIG9wdGlvbnNDYWNoZVsgb3B0aW9ucyBdIHx8IGNyZWF0ZU9wdGlvbnMoIG9wdGlvbnMgKSApIDpcblx0XHRqUXVlcnkuZXh0ZW5kKCB7fSwgb3B0aW9ucyApO1xuXG5cdHZhciAvLyBMYXN0IGZpcmUgdmFsdWUgKGZvciBub24tZm9yZ2V0dGFibGUgbGlzdHMpXG5cdFx0bWVtb3J5LFxuXHRcdC8vIEZsYWcgdG8ga25vdyBpZiBsaXN0IHdhcyBhbHJlYWR5IGZpcmVkXG5cdFx0ZmlyZWQsXG5cdFx0Ly8gRmxhZyB0byBrbm93IGlmIGxpc3QgaXMgY3VycmVudGx5IGZpcmluZ1xuXHRcdGZpcmluZyxcblx0XHQvLyBGaXJzdCBjYWxsYmFjayB0byBmaXJlICh1c2VkIGludGVybmFsbHkgYnkgYWRkIGFuZCBmaXJlV2l0aClcblx0XHRmaXJpbmdTdGFydCxcblx0XHQvLyBFbmQgb2YgdGhlIGxvb3Agd2hlbiBmaXJpbmdcblx0XHRmaXJpbmdMZW5ndGgsXG5cdFx0Ly8gSW5kZXggb2YgY3VycmVudGx5IGZpcmluZyBjYWxsYmFjayAobW9kaWZpZWQgYnkgcmVtb3ZlIGlmIG5lZWRlZClcblx0XHRmaXJpbmdJbmRleCxcblx0XHQvLyBBY3R1YWwgY2FsbGJhY2sgbGlzdFxuXHRcdGxpc3QgPSBbXSxcblx0XHQvLyBTdGFjayBvZiBmaXJlIGNhbGxzIGZvciByZXBlYXRhYmxlIGxpc3RzXG5cdFx0c3RhY2sgPSAhb3B0aW9ucy5vbmNlICYmIFtdLFxuXHRcdC8vIEZpcmUgY2FsbGJhY2tzXG5cdFx0ZmlyZSA9IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0bWVtb3J5ID0gb3B0aW9ucy5tZW1vcnkgJiYgZGF0YTtcblx0XHRcdGZpcmVkID0gdHJ1ZTtcblx0XHRcdGZpcmluZ0luZGV4ID0gZmlyaW5nU3RhcnQgfHwgMDtcblx0XHRcdGZpcmluZ1N0YXJ0ID0gMDtcblx0XHRcdGZpcmluZ0xlbmd0aCA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0ZmlyaW5nID0gdHJ1ZTtcblx0XHRcdGZvciAoIDsgbGlzdCAmJiBmaXJpbmdJbmRleCA8IGZpcmluZ0xlbmd0aDsgZmlyaW5nSW5kZXgrKyApIHtcblx0XHRcdFx0aWYgKCBsaXN0WyBmaXJpbmdJbmRleCBdLmFwcGx5KCBkYXRhWyAwIF0sIGRhdGFbIDEgXSApID09PSBmYWxzZSAmJiBvcHRpb25zLnN0b3BPbkZhbHNlICkge1xuXHRcdFx0XHRcdG1lbW9yeSA9IGZhbHNlOyAvLyBUbyBwcmV2ZW50IGZ1cnRoZXIgY2FsbHMgdXNpbmcgYWRkXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZpcmluZyA9IGZhbHNlO1xuXHRcdFx0aWYgKCBsaXN0ICkge1xuXHRcdFx0XHRpZiAoIHN0YWNrICkge1xuXHRcdFx0XHRcdGlmICggc3RhY2subGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0ZmlyZSggc3RhY2suc2hpZnQoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggbWVtb3J5ICkge1xuXHRcdFx0XHRcdGxpc3QgPSBbXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWxmLmRpc2FibGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gQWN0dWFsIENhbGxiYWNrcyBvYmplY3Rcblx0XHRzZWxmID0ge1xuXHRcdFx0Ly8gQWRkIGEgY2FsbGJhY2sgb3IgYSBjb2xsZWN0aW9uIG9mIGNhbGxiYWNrcyB0byB0aGUgbGlzdFxuXHRcdFx0YWRkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBsaXN0ICkge1xuXHRcdFx0XHRcdC8vIEZpcnN0LCB3ZSBzYXZlIHRoZSBjdXJyZW50IGxlbmd0aFxuXHRcdFx0XHRcdHZhciBzdGFydCA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHRcdChmdW5jdGlvbiBhZGQoIGFyZ3MgKSB7XG5cdFx0XHRcdFx0XHRqUXVlcnkuZWFjaCggYXJncywgZnVuY3Rpb24oIF8sIGFyZyApIHtcblx0XHRcdFx0XHRcdFx0dmFyIHR5cGUgPSBqUXVlcnkudHlwZSggYXJnICk7XG5cdFx0XHRcdFx0XHRcdGlmICggdHlwZSA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICggIW9wdGlvbnMudW5pcXVlIHx8ICFzZWxmLmhhcyggYXJnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsaXN0LnB1c2goIGFyZyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggYXJnICYmIGFyZy5sZW5ndGggJiYgdHlwZSAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNwZWN0IHJlY3Vyc2l2ZWx5XG5cdFx0XHRcdFx0XHRcdFx0YWRkKCBhcmcgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSkoIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRcdC8vIERvIHdlIG5lZWQgdG8gYWRkIHRoZSBjYWxsYmFja3MgdG8gdGhlXG5cdFx0XHRcdFx0Ly8gY3VycmVudCBmaXJpbmcgYmF0Y2g/XG5cdFx0XHRcdFx0aWYgKCBmaXJpbmcgKSB7XG5cdFx0XHRcdFx0XHRmaXJpbmdMZW5ndGggPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0XHQvLyBXaXRoIG1lbW9yeSwgaWYgd2UncmUgbm90IGZpcmluZyB0aGVuXG5cdFx0XHRcdFx0Ly8gd2Ugc2hvdWxkIGNhbGwgcmlnaHQgYXdheVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIG1lbW9yeSApIHtcblx0XHRcdFx0XHRcdGZpcmluZ1N0YXJ0ID0gc3RhcnQ7XG5cdFx0XHRcdFx0XHRmaXJlKCBtZW1vcnkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gUmVtb3ZlIGEgY2FsbGJhY2sgZnJvbSB0aGUgbGlzdFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBsaXN0ICkge1xuXHRcdFx0XHRcdGpRdWVyeS5lYWNoKCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBfLCBhcmcgKSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5kZXg7XG5cdFx0XHRcdFx0XHR3aGlsZSggKCBpbmRleCA9IGpRdWVyeS5pbkFycmF5KCBhcmcsIGxpc3QsIGluZGV4ICkgKSA+IC0xICkge1xuXHRcdFx0XHRcdFx0XHRsaXN0LnNwbGljZSggaW5kZXgsIDEgKTtcblx0XHRcdFx0XHRcdFx0Ly8gSGFuZGxlIGZpcmluZyBpbmRleGVzXG5cdFx0XHRcdFx0XHRcdGlmICggZmlyaW5nICkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPD0gZmlyaW5nTGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmlyaW5nTGVuZ3RoLS07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPD0gZmlyaW5nSW5kZXggKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmaXJpbmdJbmRleC0tO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblx0XHRcdC8vIENoZWNrIGlmIGEgZ2l2ZW4gY2FsbGJhY2sgaXMgaW4gdGhlIGxpc3QuXG5cdFx0XHQvLyBJZiBubyBhcmd1bWVudCBpcyBnaXZlbiwgcmV0dXJuIHdoZXRoZXIgb3Igbm90IGxpc3QgaGFzIGNhbGxiYWNrcyBhdHRhY2hlZC5cblx0XHRcdGhhczogZnVuY3Rpb24oIGZuICkge1xuXHRcdFx0XHRyZXR1cm4gZm4gPyBqUXVlcnkuaW5BcnJheSggZm4sIGxpc3QgKSA+IC0xIDogISEoIGxpc3QgJiYgbGlzdC5sZW5ndGggKTtcblx0XHRcdH0sXG5cdFx0XHQvLyBSZW1vdmUgYWxsIGNhbGxiYWNrcyBmcm9tIHRoZSBsaXN0XG5cdFx0XHRlbXB0eTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxpc3QgPSBbXTtcblx0XHRcdFx0ZmlyaW5nTGVuZ3RoID0gMDtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gSGF2ZSB0aGUgbGlzdCBkbyBub3RoaW5nIGFueW1vcmVcblx0XHRcdGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsaXN0ID0gc3RhY2sgPSBtZW1vcnkgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSxcblx0XHRcdC8vIElzIGl0IGRpc2FibGVkP1xuXHRcdFx0ZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gIWxpc3Q7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gTG9jayB0aGUgbGlzdCBpbiBpdHMgY3VycmVudCBzdGF0ZVxuXHRcdFx0bG9jazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHN0YWNrID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRpZiAoICFtZW1vcnkgKSB7XG5cdFx0XHRcdFx0c2VsZi5kaXNhYmxlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gSXMgaXQgbG9ja2VkP1xuXHRcdFx0bG9ja2VkOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuICFzdGFjaztcblx0XHRcdH0sXG5cdFx0XHQvLyBDYWxsIGFsbCBjYWxsYmFja3Mgd2l0aCB0aGUgZ2l2ZW4gY29udGV4dCBhbmQgYXJndW1lbnRzXG5cdFx0XHRmaXJlV2l0aDogZnVuY3Rpb24oIGNvbnRleHQsIGFyZ3MgKSB7XG5cdFx0XHRcdGlmICggbGlzdCAmJiAoICFmaXJlZCB8fCBzdGFjayApICkge1xuXHRcdFx0XHRcdGFyZ3MgPSBhcmdzIHx8IFtdO1xuXHRcdFx0XHRcdGFyZ3MgPSBbIGNvbnRleHQsIGFyZ3Muc2xpY2UgPyBhcmdzLnNsaWNlKCkgOiBhcmdzIF07XG5cdFx0XHRcdFx0aWYgKCBmaXJpbmcgKSB7XG5cdFx0XHRcdFx0XHRzdGFjay5wdXNoKCBhcmdzICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpcmUoIGFyZ3MgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gQ2FsbCBhbGwgdGhlIGNhbGxiYWNrcyB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHNcblx0XHRcdGZpcmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLmZpcmVXaXRoKCB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gVG8ga25vdyBpZiB0aGUgY2FsbGJhY2tzIGhhdmUgYWxyZWFkeSBiZWVuIGNhbGxlZCBhdCBsZWFzdCBvbmNlXG5cdFx0XHRmaXJlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAhIWZpcmVkO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0cmV0dXJuIHNlbGY7XG59O1xualF1ZXJ5LmV4dGVuZCh7XG5cblx0RGVmZXJyZWQ6IGZ1bmN0aW9uKCBmdW5jICkge1xuXHRcdHZhciB0dXBsZXMgPSBbXG5cdFx0XHRcdC8vIGFjdGlvbiwgYWRkIGxpc3RlbmVyLCBsaXN0ZW5lciBsaXN0LCBmaW5hbCBzdGF0ZVxuXHRcdFx0XHRbIFwicmVzb2x2ZVwiLCBcImRvbmVcIiwgalF1ZXJ5LkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLCBcInJlc29sdmVkXCIgXSxcblx0XHRcdFx0WyBcInJlamVjdFwiLCBcImZhaWxcIiwgalF1ZXJ5LkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLCBcInJlamVjdGVkXCIgXSxcblx0XHRcdFx0WyBcIm5vdGlmeVwiLCBcInByb2dyZXNzXCIsIGpRdWVyeS5DYWxsYmFja3MoXCJtZW1vcnlcIikgXVxuXHRcdFx0XSxcblx0XHRcdHN0YXRlID0gXCJwZW5kaW5nXCIsXG5cdFx0XHRwcm9taXNlID0ge1xuXHRcdFx0XHRzdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHN0YXRlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbHdheXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRlZmVycmVkLmRvbmUoIGFyZ3VtZW50cyApLmZhaWwoIGFyZ3VtZW50cyApO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aGVuOiBmdW5jdGlvbiggLyogZm5Eb25lLCBmbkZhaWwsIGZuUHJvZ3Jlc3MgKi8gKSB7XG5cdFx0XHRcdFx0dmFyIGZucyA9IGFyZ3VtZW50cztcblx0XHRcdFx0XHRyZXR1cm4galF1ZXJ5LkRlZmVycmVkKGZ1bmN0aW9uKCBuZXdEZWZlciApIHtcblx0XHRcdFx0XHRcdGpRdWVyeS5lYWNoKCB0dXBsZXMsIGZ1bmN0aW9uKCBpLCB0dXBsZSApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGFjdGlvbiA9IHR1cGxlWyAwIF0sXG5cdFx0XHRcdFx0XHRcdFx0Zm4gPSBqUXVlcnkuaXNGdW5jdGlvbiggZm5zWyBpIF0gKSAmJiBmbnNbIGkgXTtcblx0XHRcdFx0XHRcdFx0Ly8gZGVmZXJyZWRbIGRvbmUgfCBmYWlsIHwgcHJvZ3Jlc3MgXSBmb3IgZm9yd2FyZGluZyBhY3Rpb25zIHRvIG5ld0RlZmVyXG5cdFx0XHRcdFx0XHRcdGRlZmVycmVkWyB0dXBsZVsxXSBdKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciByZXR1cm5lZCA9IGZuICYmIGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIHJldHVybmVkICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCByZXR1cm5lZC5wcm9taXNlICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm5lZC5wcm9taXNlKClcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmRvbmUoIG5ld0RlZmVyLnJlc29sdmUgKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQuZmFpbCggbmV3RGVmZXIucmVqZWN0IClcblx0XHRcdFx0XHRcdFx0XHRcdFx0LnByb2dyZXNzKCBuZXdEZWZlci5ub3RpZnkgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0bmV3RGVmZXJbIGFjdGlvbiArIFwiV2l0aFwiIF0oIHRoaXMgPT09IHByb21pc2UgPyBuZXdEZWZlci5wcm9taXNlKCkgOiB0aGlzLCBmbiA/IFsgcmV0dXJuZWQgXSA6IGFyZ3VtZW50cyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGZucyA9IG51bGw7XG5cdFx0XHRcdFx0fSkucHJvbWlzZSgpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQvLyBHZXQgYSBwcm9taXNlIGZvciB0aGlzIGRlZmVycmVkXG5cdFx0XHRcdC8vIElmIG9iaiBpcyBwcm92aWRlZCwgdGhlIHByb21pc2UgYXNwZWN0IGlzIGFkZGVkIHRvIHRoZSBvYmplY3Rcblx0XHRcdFx0cHJvbWlzZTogZnVuY3Rpb24oIG9iaiApIHtcblx0XHRcdFx0XHRyZXR1cm4gb2JqICE9IG51bGwgPyBqUXVlcnkuZXh0ZW5kKCBvYmosIHByb21pc2UgKSA6IHByb21pc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRkZWZlcnJlZCA9IHt9O1xuXG5cdFx0Ly8gS2VlcCBwaXBlIGZvciBiYWNrLWNvbXBhdFxuXHRcdHByb21pc2UucGlwZSA9IHByb21pc2UudGhlbjtcblxuXHRcdC8vIEFkZCBsaXN0LXNwZWNpZmljIG1ldGhvZHNcblx0XHRqUXVlcnkuZWFjaCggdHVwbGVzLCBmdW5jdGlvbiggaSwgdHVwbGUgKSB7XG5cdFx0XHR2YXIgbGlzdCA9IHR1cGxlWyAyIF0sXG5cdFx0XHRcdHN0YXRlU3RyaW5nID0gdHVwbGVbIDMgXTtcblxuXHRcdFx0Ly8gcHJvbWlzZVsgZG9uZSB8IGZhaWwgfCBwcm9ncmVzcyBdID0gbGlzdC5hZGRcblx0XHRcdHByb21pc2VbIHR1cGxlWzFdIF0gPSBsaXN0LmFkZDtcblxuXHRcdFx0Ly8gSGFuZGxlIHN0YXRlXG5cdFx0XHRpZiAoIHN0YXRlU3RyaW5nICkge1xuXHRcdFx0XHRsaXN0LmFkZChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBzdGF0ZSA9IFsgcmVzb2x2ZWQgfCByZWplY3RlZCBdXG5cdFx0XHRcdFx0c3RhdGUgPSBzdGF0ZVN0cmluZztcblxuXHRcdFx0XHQvLyBbIHJlamVjdF9saXN0IHwgcmVzb2x2ZV9saXN0IF0uZGlzYWJsZTsgcHJvZ3Jlc3NfbGlzdC5sb2NrXG5cdFx0XHRcdH0sIHR1cGxlc1sgaSBeIDEgXVsgMiBdLmRpc2FibGUsIHR1cGxlc1sgMiBdWyAyIF0ubG9jayApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBkZWZlcnJlZFsgcmVzb2x2ZSB8IHJlamVjdCB8IG5vdGlmeSBdXG5cdFx0XHRkZWZlcnJlZFsgdHVwbGVbMF0gXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkZWZlcnJlZFsgdHVwbGVbMF0gKyBcIldpdGhcIiBdKCB0aGlzID09PSBkZWZlcnJlZCA/IHByb21pc2UgOiB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9O1xuXHRcdFx0ZGVmZXJyZWRbIHR1cGxlWzBdICsgXCJXaXRoXCIgXSA9IGxpc3QuZmlyZVdpdGg7XG5cdFx0fSk7XG5cblx0XHQvLyBNYWtlIHRoZSBkZWZlcnJlZCBhIHByb21pc2Vcblx0XHRwcm9taXNlLnByb21pc2UoIGRlZmVycmVkICk7XG5cblx0XHQvLyBDYWxsIGdpdmVuIGZ1bmMgaWYgYW55XG5cdFx0aWYgKCBmdW5jICkge1xuXHRcdFx0ZnVuYy5jYWxsKCBkZWZlcnJlZCwgZGVmZXJyZWQgKTtcblx0XHR9XG5cblx0XHQvLyBBbGwgZG9uZSFcblx0XHRyZXR1cm4gZGVmZXJyZWQ7XG5cdH0sXG5cblx0Ly8gRGVmZXJyZWQgaGVscGVyXG5cdHdoZW46IGZ1bmN0aW9uKCBzdWJvcmRpbmF0ZSAvKiAsIC4uLiwgc3Vib3JkaW5hdGVOICovICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdHJlc29sdmVWYWx1ZXMgPSBjb3JlX3NsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuXHRcdFx0bGVuZ3RoID0gcmVzb2x2ZVZhbHVlcy5sZW5ndGgsXG5cblx0XHRcdC8vIHRoZSBjb3VudCBvZiB1bmNvbXBsZXRlZCBzdWJvcmRpbmF0ZXNcblx0XHRcdHJlbWFpbmluZyA9IGxlbmd0aCAhPT0gMSB8fCAoIHN1Ym9yZGluYXRlICYmIGpRdWVyeS5pc0Z1bmN0aW9uKCBzdWJvcmRpbmF0ZS5wcm9taXNlICkgKSA/IGxlbmd0aCA6IDAsXG5cblx0XHRcdC8vIHRoZSBtYXN0ZXIgRGVmZXJyZWQuIElmIHJlc29sdmVWYWx1ZXMgY29uc2lzdCBvZiBvbmx5IGEgc2luZ2xlIERlZmVycmVkLCBqdXN0IHVzZSB0aGF0LlxuXHRcdFx0ZGVmZXJyZWQgPSByZW1haW5pbmcgPT09IDEgPyBzdWJvcmRpbmF0ZSA6IGpRdWVyeS5EZWZlcnJlZCgpLFxuXG5cdFx0XHQvLyBVcGRhdGUgZnVuY3Rpb24gZm9yIGJvdGggcmVzb2x2ZSBhbmQgcHJvZ3Jlc3MgdmFsdWVzXG5cdFx0XHR1cGRhdGVGdW5jID0gZnVuY3Rpb24oIGksIGNvbnRleHRzLCB2YWx1ZXMgKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHRcdFx0Y29udGV4dHNbIGkgXSA9IHRoaXM7XG5cdFx0XHRcdFx0dmFsdWVzWyBpIF0gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGNvcmVfc2xpY2UuY2FsbCggYXJndW1lbnRzICkgOiB2YWx1ZTtcblx0XHRcdFx0XHRpZiggdmFsdWVzID09PSBwcm9ncmVzc1ZhbHVlcyApIHtcblx0XHRcdFx0XHRcdGRlZmVycmVkLm5vdGlmeVdpdGgoIGNvbnRleHRzLCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhKCAtLXJlbWFpbmluZyApICkge1xuXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZVdpdGgoIGNvbnRleHRzLCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9LFxuXG5cdFx0XHRwcm9ncmVzc1ZhbHVlcywgcHJvZ3Jlc3NDb250ZXh0cywgcmVzb2x2ZUNvbnRleHRzO1xuXG5cdFx0Ly8gYWRkIGxpc3RlbmVycyB0byBEZWZlcnJlZCBzdWJvcmRpbmF0ZXM7IHRyZWF0IG90aGVycyBhcyByZXNvbHZlZFxuXHRcdGlmICggbGVuZ3RoID4gMSApIHtcblx0XHRcdHByb2dyZXNzVmFsdWVzID0gbmV3IEFycmF5KCBsZW5ndGggKTtcblx0XHRcdHByb2dyZXNzQ29udGV4dHMgPSBuZXcgQXJyYXkoIGxlbmd0aCApO1xuXHRcdFx0cmVzb2x2ZUNvbnRleHRzID0gbmV3IEFycmF5KCBsZW5ndGggKTtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIHJlc29sdmVWYWx1ZXNbIGkgXSAmJiBqUXVlcnkuaXNGdW5jdGlvbiggcmVzb2x2ZVZhbHVlc1sgaSBdLnByb21pc2UgKSApIHtcblx0XHRcdFx0XHRyZXNvbHZlVmFsdWVzWyBpIF0ucHJvbWlzZSgpXG5cdFx0XHRcdFx0XHQuZG9uZSggdXBkYXRlRnVuYyggaSwgcmVzb2x2ZUNvbnRleHRzLCByZXNvbHZlVmFsdWVzICkgKVxuXHRcdFx0XHRcdFx0LmZhaWwoIGRlZmVycmVkLnJlamVjdCApXG5cdFx0XHRcdFx0XHQucHJvZ3Jlc3MoIHVwZGF0ZUZ1bmMoIGksIHByb2dyZXNzQ29udGV4dHMsIHByb2dyZXNzVmFsdWVzICkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQtLXJlbWFpbmluZztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGlmIHdlJ3JlIG5vdCB3YWl0aW5nIG9uIGFueXRoaW5nLCByZXNvbHZlIHRoZSBtYXN0ZXJcblx0XHRpZiAoICFyZW1haW5pbmcgKSB7XG5cdFx0XHRkZWZlcnJlZC5yZXNvbHZlV2l0aCggcmVzb2x2ZUNvbnRleHRzLCByZXNvbHZlVmFsdWVzICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0fVxufSk7XG5qUXVlcnkuc3VwcG9ydCA9IChmdW5jdGlvbiggc3VwcG9ydCApIHtcblx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLFxuXHRcdGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuXHRcdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0c2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKSxcblx0XHRvcHQgPSBzZWxlY3QuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikgKTtcblxuXHQvLyBGaW5pc2ggZWFybHkgaW4gbGltaXRlZCBlbnZpcm9ubWVudHNcblx0aWYgKCAhaW5wdXQudHlwZSApIHtcblx0XHRyZXR1cm4gc3VwcG9ydDtcblx0fVxuXG5cdGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XG5cblx0Ly8gU3VwcG9ydDogU2FmYXJpIDUuMSwgaU9TIDUuMSwgQW5kcm9pZCA0LngsIEFuZHJvaWQgMi4zXG5cdC8vIENoZWNrIHRoZSBkZWZhdWx0IGNoZWNrYm94L3JhZGlvIHZhbHVlIChcIlwiIG9uIG9sZCBXZWJLaXQ7IFwib25cIiBlbHNld2hlcmUpXG5cdHN1cHBvcnQuY2hlY2tPbiA9IGlucHV0LnZhbHVlICE9PSBcIlwiO1xuXG5cdC8vIE11c3QgYWNjZXNzIHRoZSBwYXJlbnQgdG8gbWFrZSBhbiBvcHRpb24gc2VsZWN0IHByb3Blcmx5XG5cdC8vIFN1cHBvcnQ6IElFOSwgSUUxMFxuXHRzdXBwb3J0Lm9wdFNlbGVjdGVkID0gb3B0LnNlbGVjdGVkO1xuXG5cdC8vIFdpbGwgYmUgZGVmaW5lZCBsYXRlclxuXHRzdXBwb3J0LnJlbGlhYmxlTWFyZ2luUmlnaHQgPSB0cnVlO1xuXHRzdXBwb3J0LmJveFNpemluZ1JlbGlhYmxlID0gdHJ1ZTtcblx0c3VwcG9ydC5waXhlbFBvc2l0aW9uID0gZmFsc2U7XG5cblx0Ly8gTWFrZSBzdXJlIGNoZWNrZWQgc3RhdHVzIGlzIHByb3Blcmx5IGNsb25lZFxuXHQvLyBTdXBwb3J0OiBJRTksIElFMTBcblx0aW5wdXQuY2hlY2tlZCA9IHRydWU7XG5cdHN1cHBvcnQubm9DbG9uZUNoZWNrZWQgPSBpbnB1dC5jbG9uZU5vZGUoIHRydWUgKS5jaGVja2VkO1xuXG5cdC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBvcHRpb25zIGluc2lkZSBkaXNhYmxlZCBzZWxlY3RzIGFyZW4ndCBtYXJrZWQgYXMgZGlzYWJsZWRcblx0Ly8gKFdlYktpdCBtYXJrcyB0aGVtIGFzIGRpc2FibGVkKVxuXHRzZWxlY3QuZGlzYWJsZWQgPSB0cnVlO1xuXHRzdXBwb3J0Lm9wdERpc2FibGVkID0gIW9wdC5kaXNhYmxlZDtcblxuXHQvLyBDaGVjayBpZiBhbiBpbnB1dCBtYWludGFpbnMgaXRzIHZhbHVlIGFmdGVyIGJlY29taW5nIGEgcmFkaW9cblx0Ly8gU3VwcG9ydDogSUU5LCBJRTEwXG5cdGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuXHRpbnB1dC52YWx1ZSA9IFwidFwiO1xuXHRpbnB1dC50eXBlID0gXCJyYWRpb1wiO1xuXHRzdXBwb3J0LnJhZGlvVmFsdWUgPSBpbnB1dC52YWx1ZSA9PT0gXCJ0XCI7XG5cblx0Ly8gIzExMjE3IC0gV2ViS2l0IGxvc2VzIGNoZWNrIHdoZW4gdGhlIG5hbWUgaXMgYWZ0ZXIgdGhlIGNoZWNrZWQgYXR0cmlidXRlXG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJjaGVja2VkXCIsIFwidFwiICk7XG5cdGlucHV0LnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwidFwiICk7XG5cblx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG5cblx0Ly8gU3VwcG9ydDogU2FmYXJpIDUuMSwgQW5kcm9pZCA0LngsIEFuZHJvaWQgMi4zXG5cdC8vIG9sZCBXZWJLaXQgZG9lc24ndCBjbG9uZSBjaGVja2VkIHN0YXRlIGNvcnJlY3RseSBpbiBmcmFnbWVudHNcblx0c3VwcG9ydC5jaGVja0Nsb25lID0gZnJhZ21lbnQuY2xvbmVOb2RlKCB0cnVlICkuY2xvbmVOb2RlKCB0cnVlICkubGFzdENoaWxkLmNoZWNrZWQ7XG5cblx0Ly8gU3VwcG9ydDogRmlyZWZveCwgQ2hyb21lLCBTYWZhcmlcblx0Ly8gQmV3YXJlIG9mIENTUCByZXN0cmljdGlvbnMgKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL1NlY3VyaXR5L0NTUClcblx0c3VwcG9ydC5mb2N1c2luQnViYmxlcyA9IFwib25mb2N1c2luXCIgaW4gd2luZG93O1xuXG5cdGRpdi5zdHlsZS5iYWNrZ3JvdW5kQ2xpcCA9IFwiY29udGVudC1ib3hcIjtcblx0ZGl2LmNsb25lTm9kZSggdHJ1ZSApLnN0eWxlLmJhY2tncm91bmRDbGlwID0gXCJcIjtcblx0c3VwcG9ydC5jbGVhckNsb25lU3R5bGUgPSBkaXYuc3R5bGUuYmFja2dyb3VuZENsaXAgPT09IFwiY29udGVudC1ib3hcIjtcblxuXHQvLyBSdW4gdGVzdHMgdGhhdCBuZWVkIGEgYm9keSBhdCBkb2MgcmVhZHlcblx0alF1ZXJ5KGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250YWluZXIsIG1hcmdpbkRpdixcblx0XHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3gsIEFuZHJvaWQgMi4zIChQcmVmaXhlZCBib3gtc2l6aW5nIHZlcnNpb25zKS5cblx0XHRcdGRpdlJlc2V0ID0gXCJwYWRkaW5nOjA7bWFyZ2luOjA7Ym9yZGVyOjA7ZGlzcGxheTpibG9jazstd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3g7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O2JveC1zaXppbmc6Y29udGVudC1ib3hcIixcblx0XHRcdGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbIDAgXTtcblxuXHRcdGlmICggIWJvZHkgKSB7XG5cdFx0XHQvLyBSZXR1cm4gZm9yIGZyYW1lc2V0IGRvY3MgdGhhdCBkb24ndCBoYXZlIGEgYm9keVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0Y29udGFpbmVyLnN0eWxlLmNzc1RleHQgPSBcImJvcmRlcjowO3dpZHRoOjA7aGVpZ2h0OjA7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDotOTk5OXB4O21hcmdpbi10b3A6MXB4XCI7XG5cblx0XHQvLyBDaGVjayBib3gtc2l6aW5nIGFuZCBtYXJnaW4gYmVoYXZpb3IuXG5cdFx0Ym9keS5hcHBlbmRDaGlsZCggY29udGFpbmVyICkuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdGRpdi5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3gsIEFuZHJvaWQgMi4zIChQcmVmaXhlZCBib3gtc2l6aW5nIHZlcnNpb25zKS5cblx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IFwiLXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6MXB4O2JvcmRlcjoxcHg7ZGlzcGxheTpibG9jazt3aWR0aDo0cHg7bWFyZ2luLXRvcDoxJTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MSVcIjtcblxuXHRcdC8vIFdvcmthcm91bmQgZmFpbGluZyBib3hTaXppbmcgdGVzdCBkdWUgdG8gb2Zmc2V0V2lkdGggcmV0dXJuaW5nIHdyb25nIHZhbHVlXG5cdFx0Ly8gd2l0aCBzb21lIG5vbi0xIHZhbHVlcyBvZiBib2R5IHpvb20sIHRpY2tldCAjMTM1NDNcblx0XHRqUXVlcnkuc3dhcCggYm9keSwgYm9keS5zdHlsZS56b29tICE9IG51bGwgPyB7IHpvb206IDEgfSA6IHt9LCBmdW5jdGlvbigpIHtcblx0XHRcdHN1cHBvcnQuYm94U2l6aW5nID0gZGl2Lm9mZnNldFdpZHRoID09PSA0O1xuXHRcdH0pO1xuXG5cdFx0Ly8gVXNlIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlIGJlY2F1c2UganNkb20gb24gbm9kZS5qcyB3aWxsIGJyZWFrIHdpdGhvdXQgaXQuXG5cdFx0aWYgKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSApIHtcblx0XHRcdHN1cHBvcnQucGl4ZWxQb3NpdGlvbiA9ICggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGRpdiwgbnVsbCApIHx8IHt9ICkudG9wICE9PSBcIjElXCI7XG5cdFx0XHRzdXBwb3J0LmJveFNpemluZ1JlbGlhYmxlID0gKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZGl2LCBudWxsICkgfHwgeyB3aWR0aDogXCI0cHhcIiB9ICkud2lkdGggPT09IFwiNHB4XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQgMi4zXG5cdFx0XHQvLyBDaGVjayBpZiBkaXYgd2l0aCBleHBsaWNpdCB3aWR0aCBhbmQgbm8gbWFyZ2luLXJpZ2h0IGluY29ycmVjdGx5XG5cdFx0XHQvLyBnZXRzIGNvbXB1dGVkIG1hcmdpbi1yaWdodCBiYXNlZCBvbiB3aWR0aCBvZiBjb250YWluZXIuICgjMzMzMylcblx0XHRcdC8vIFdlYktpdCBCdWcgMTMzNDMgLSBnZXRDb21wdXRlZFN0eWxlIHJldHVybnMgd3JvbmcgdmFsdWUgZm9yIG1hcmdpbi1yaWdodFxuXHRcdFx0bWFyZ2luRGl2ID0gZGl2LmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpICk7XG5cdFx0XHRtYXJnaW5EaXYuc3R5bGUuY3NzVGV4dCA9IGRpdi5zdHlsZS5jc3NUZXh0ID0gZGl2UmVzZXQ7XG5cdFx0XHRtYXJnaW5EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBtYXJnaW5EaXYuc3R5bGUud2lkdGggPSBcIjBcIjtcblx0XHRcdGRpdi5zdHlsZS53aWR0aCA9IFwiMXB4XCI7XG5cblx0XHRcdHN1cHBvcnQucmVsaWFibGVNYXJnaW5SaWdodCA9XG5cdFx0XHRcdCFwYXJzZUZsb2F0KCAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBtYXJnaW5EaXYsIG51bGwgKSB8fCB7fSApLm1hcmdpblJpZ2h0ICk7XG5cdFx0fVxuXG5cdFx0Ym9keS5yZW1vdmVDaGlsZCggY29udGFpbmVyICk7XG5cdH0pO1xuXG5cdHJldHVybiBzdXBwb3J0O1xufSkoIHt9ICk7XG5cbi8qXG5cdEltcGxlbWVudGF0aW9uIFN1bW1hcnlcblxuXHQxLiBFbmZvcmNlIEFQSSBzdXJmYWNlIGFuZCBzZW1hbnRpYyBjb21wYXRpYmlsaXR5IHdpdGggMS45LnggYnJhbmNoXG5cdDIuIEltcHJvdmUgdGhlIG1vZHVsZSdzIG1haW50YWluYWJpbGl0eSBieSByZWR1Y2luZyB0aGUgc3RvcmFnZVxuXHRcdHBhdGhzIHRvIGEgc2luZ2xlIG1lY2hhbmlzbS5cblx0My4gVXNlIHRoZSBzYW1lIHNpbmdsZSBtZWNoYW5pc20gdG8gc3VwcG9ydCBcInByaXZhdGVcIiBhbmQgXCJ1c2VyXCIgZGF0YS5cblx0NC4gX05ldmVyXyBleHBvc2UgXCJwcml2YXRlXCIgZGF0YSB0byB1c2VyIGNvZGUgKFRPRE86IERyb3AgX2RhdGEsIF9yZW1vdmVEYXRhKVxuXHQ1LiBBdm9pZCBleHBvc2luZyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIG9uIHVzZXIgb2JqZWN0cyAoZWcuIGV4cGFuZG8gcHJvcGVydGllcylcblx0Ni4gUHJvdmlkZSBhIGNsZWFyIHBhdGggZm9yIGltcGxlbWVudGF0aW9uIHVwZ3JhZGUgdG8gV2Vha01hcCBpbiAyMDE0XG4qL1xudmFyIGRhdGFfdXNlciwgZGF0YV9wcml2LFxuXHRyYnJhY2UgPSAvKD86XFx7W1xcc1xcU10qXFx9fFxcW1tcXHNcXFNdKlxcXSkkLyxcblx0cm11bHRpRGFzaCA9IC8oW0EtWl0pL2c7XG5cbmZ1bmN0aW9uIERhdGEoKSB7XG5cdC8vIFN1cHBvcnQ6IEFuZHJvaWQgPCA0LFxuXHQvLyBPbGQgV2ViS2l0IGRvZXMgbm90IGhhdmUgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zL2ZyZWV6ZSBtZXRob2QsXG5cdC8vIHJldHVybiBuZXcgZW1wdHkgb2JqZWN0IGluc3RlYWQgd2l0aCBubyBbW3NldF1dIGFjY2Vzc29yXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggdGhpcy5jYWNoZSA9IHt9LCAwLCB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB7fTtcblx0XHR9XG5cdH0pO1xuXG5cdHRoaXMuZXhwYW5kbyA9IGpRdWVyeS5leHBhbmRvICsgTWF0aC5yYW5kb20oKTtcbn1cblxuRGF0YS51aWQgPSAxO1xuXG5EYXRhLmFjY2VwdHMgPSBmdW5jdGlvbiggb3duZXIgKSB7XG5cdC8vIEFjY2VwdHMgb25seTpcblx0Ly8gIC0gTm9kZVxuXHQvLyAgICAtIE5vZGUuRUxFTUVOVF9OT0RFXG5cdC8vICAgIC0gTm9kZS5ET0NVTUVOVF9OT0RFXG5cdC8vICAtIE9iamVjdFxuXHQvLyAgICAtIEFueVxuXHRyZXR1cm4gb3duZXIubm9kZVR5cGUgP1xuXHRcdG93bmVyLm5vZGVUeXBlID09PSAxIHx8IG93bmVyLm5vZGVUeXBlID09PSA5IDogdHJ1ZTtcbn07XG5cbkRhdGEucHJvdG90eXBlID0ge1xuXHRrZXk6IGZ1bmN0aW9uKCBvd25lciApIHtcblx0XHQvLyBXZSBjYW4gYWNjZXB0IGRhdGEgZm9yIG5vbi1lbGVtZW50IG5vZGVzIGluIG1vZGVybiBicm93c2Vycyxcblx0XHQvLyBidXQgd2Ugc2hvdWxkIG5vdCwgc2VlICM4MzM1LlxuXHRcdC8vIEFsd2F5cyByZXR1cm4gdGhlIGtleSBmb3IgYSBmcm96ZW4gb2JqZWN0LlxuXHRcdGlmICggIURhdGEuYWNjZXB0cyggb3duZXIgKSApIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdHZhciBkZXNjcmlwdG9yID0ge30sXG5cdFx0XHQvLyBDaGVjayBpZiB0aGUgb3duZXIgb2JqZWN0IGFscmVhZHkgaGFzIGEgY2FjaGUga2V5XG5cdFx0XHR1bmxvY2sgPSBvd25lclsgdGhpcy5leHBhbmRvIF07XG5cblx0XHQvLyBJZiBub3QsIGNyZWF0ZSBvbmVcblx0XHRpZiAoICF1bmxvY2sgKSB7XG5cdFx0XHR1bmxvY2sgPSBEYXRhLnVpZCsrO1xuXG5cdFx0XHQvLyBTZWN1cmUgaXQgaW4gYSBub24tZW51bWVyYWJsZSwgbm9uLXdyaXRhYmxlIHByb3BlcnR5XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRkZXNjcmlwdG9yWyB0aGlzLmV4cGFuZG8gXSA9IHsgdmFsdWU6IHVubG9jayB9O1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggb3duZXIsIGRlc2NyaXB0b3IgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydDogQW5kcm9pZCA8IDRcblx0XHRcdC8vIEZhbGxiYWNrIHRvIGEgbGVzcyBzZWN1cmUgZGVmaW5pdGlvblxuXHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRcdGRlc2NyaXB0b3JbIHRoaXMuZXhwYW5kbyBdID0gdW5sb2NrO1xuXHRcdFx0XHRqUXVlcnkuZXh0ZW5kKCBvd25lciwgZGVzY3JpcHRvciApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEVuc3VyZSB0aGUgY2FjaGUgb2JqZWN0XG5cdFx0aWYgKCAhdGhpcy5jYWNoZVsgdW5sb2NrIF0gKSB7XG5cdFx0XHR0aGlzLmNhY2hlWyB1bmxvY2sgXSA9IHt9O1xuXHRcdH1cblxuXHRcdHJldHVybiB1bmxvY2s7XG5cdH0sXG5cdHNldDogZnVuY3Rpb24oIG93bmVyLCBkYXRhLCB2YWx1ZSApIHtcblx0XHR2YXIgcHJvcCxcblx0XHRcdC8vIFRoZXJlIG1heSBiZSBhbiB1bmxvY2sgYXNzaWduZWQgdG8gdGhpcyBub2RlLFxuXHRcdFx0Ly8gaWYgdGhlcmUgaXMgbm8gZW50cnkgZm9yIHRoaXMgXCJvd25lclwiLCBjcmVhdGUgb25lIGlubGluZVxuXHRcdFx0Ly8gYW5kIHNldCB0aGUgdW5sb2NrIGFzIHRob3VnaCBhbiBvd25lciBlbnRyeSBoYWQgYWx3YXlzIGV4aXN0ZWRcblx0XHRcdHVubG9jayA9IHRoaXMua2V5KCBvd25lciApLFxuXHRcdFx0Y2FjaGUgPSB0aGlzLmNhY2hlWyB1bmxvY2sgXTtcblxuXHRcdC8vIEhhbmRsZTogWyBvd25lciwga2V5LCB2YWx1ZSBdIGFyZ3Ncblx0XHRpZiAoIHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0Y2FjaGVbIGRhdGEgXSA9IHZhbHVlO1xuXG5cdFx0Ly8gSGFuZGxlOiBbIG93bmVyLCB7IHByb3BlcnRpZXMgfSBdIGFyZ3Ncblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRnJlc2ggYXNzaWdubWVudHMgYnkgb2JqZWN0IGFyZSBzaGFsbG93IGNvcGllZFxuXHRcdFx0aWYgKCBqUXVlcnkuaXNFbXB0eU9iamVjdCggY2FjaGUgKSApIHtcblx0XHRcdFx0alF1ZXJ5LmV4dGVuZCggdGhpcy5jYWNoZVsgdW5sb2NrIF0sIGRhdGEgKTtcblx0XHRcdC8vIE90aGVyd2lzZSwgY29weSB0aGUgcHJvcGVydGllcyBvbmUtYnktb25lIHRvIHRoZSBjYWNoZSBvYmplY3Rcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoIHByb3AgaW4gZGF0YSApIHtcblx0XHRcdFx0XHRjYWNoZVsgcHJvcCBdID0gZGF0YVsgcHJvcCBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBjYWNoZTtcblx0fSxcblx0Z2V0OiBmdW5jdGlvbiggb3duZXIsIGtleSApIHtcblx0XHQvLyBFaXRoZXIgYSB2YWxpZCBjYWNoZSBpcyBmb3VuZCwgb3Igd2lsbCBiZSBjcmVhdGVkLlxuXHRcdC8vIE5ldyBjYWNoZXMgd2lsbCBiZSBjcmVhdGVkIGFuZCB0aGUgdW5sb2NrIHJldHVybmVkLFxuXHRcdC8vIGFsbG93aW5nIGRpcmVjdCBhY2Nlc3MgdG8gdGhlIG5ld2x5IGNyZWF0ZWRcblx0XHQvLyBlbXB0eSBkYXRhIG9iamVjdC4gQSB2YWxpZCBvd25lciBvYmplY3QgbXVzdCBiZSBwcm92aWRlZC5cblx0XHR2YXIgY2FjaGUgPSB0aGlzLmNhY2hlWyB0aGlzLmtleSggb3duZXIgKSBdO1xuXG5cdFx0cmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkID9cblx0XHRcdGNhY2hlIDogY2FjaGVbIGtleSBdO1xuXHR9LFxuXHRhY2Nlc3M6IGZ1bmN0aW9uKCBvd25lciwga2V5LCB2YWx1ZSApIHtcblx0XHR2YXIgc3RvcmVkO1xuXHRcdC8vIEluIGNhc2VzIHdoZXJlIGVpdGhlcjpcblx0XHQvL1xuXHRcdC8vICAgMS4gTm8ga2V5IHdhcyBzcGVjaWZpZWRcblx0XHQvLyAgIDIuIEEgc3RyaW5nIGtleSB3YXMgc3BlY2lmaWVkLCBidXQgbm8gdmFsdWUgcHJvdmlkZWRcblx0XHQvL1xuXHRcdC8vIFRha2UgdGhlIFwicmVhZFwiIHBhdGggYW5kIGFsbG93IHRoZSBnZXQgbWV0aG9kIHRvIGRldGVybWluZVxuXHRcdC8vIHdoaWNoIHZhbHVlIHRvIHJldHVybiwgcmVzcGVjdGl2ZWx5IGVpdGhlcjpcblx0XHQvL1xuXHRcdC8vICAgMS4gVGhlIGVudGlyZSBjYWNoZSBvYmplY3Rcblx0XHQvLyAgIDIuIFRoZSBkYXRhIHN0b3JlZCBhdCB0aGUga2V5XG5cdFx0Ly9cblx0XHRpZiAoIGtleSA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHRcdCgoa2V5ICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpICYmIHZhbHVlID09PSB1bmRlZmluZWQpICkge1xuXG5cdFx0XHRzdG9yZWQgPSB0aGlzLmdldCggb3duZXIsIGtleSApO1xuXG5cdFx0XHRyZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRzdG9yZWQgOiB0aGlzLmdldCggb3duZXIsIGpRdWVyeS5jYW1lbENhc2Uoa2V5KSApO1xuXHRcdH1cblxuXHRcdC8vIFsqXVdoZW4gdGhlIGtleSBpcyBub3QgYSBzdHJpbmcsIG9yIGJvdGggYSBrZXkgYW5kIHZhbHVlXG5cdFx0Ly8gYXJlIHNwZWNpZmllZCwgc2V0IG9yIGV4dGVuZCAoZXhpc3Rpbmcgb2JqZWN0cykgd2l0aCBlaXRoZXI6XG5cdFx0Ly9cblx0XHQvLyAgIDEuIEFuIG9iamVjdCBvZiBwcm9wZXJ0aWVzXG5cdFx0Ly8gICAyLiBBIGtleSBhbmQgdmFsdWVcblx0XHQvL1xuXHRcdHRoaXMuc2V0KCBvd25lciwga2V5LCB2YWx1ZSApO1xuXG5cdFx0Ly8gU2luY2UgdGhlIFwic2V0XCIgcGF0aCBjYW4gaGF2ZSB0d28gcG9zc2libGUgZW50cnkgcG9pbnRzXG5cdFx0Ly8gcmV0dXJuIHRoZSBleHBlY3RlZCBkYXRhIGJhc2VkIG9uIHdoaWNoIHBhdGggd2FzIHRha2VuWypdXG5cdFx0cmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IGtleTtcblx0fSxcblx0cmVtb3ZlOiBmdW5jdGlvbiggb3duZXIsIGtleSApIHtcblx0XHR2YXIgaSwgbmFtZSwgY2FtZWwsXG5cdFx0XHR1bmxvY2sgPSB0aGlzLmtleSggb3duZXIgKSxcblx0XHRcdGNhY2hlID0gdGhpcy5jYWNoZVsgdW5sb2NrIF07XG5cblx0XHRpZiAoIGtleSA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0dGhpcy5jYWNoZVsgdW5sb2NrIF0gPSB7fTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBTdXBwb3J0IGFycmF5IG9yIHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb2Yga2V5c1xuXHRcdFx0aWYgKCBqUXVlcnkuaXNBcnJheSgga2V5ICkgKSB7XG5cdFx0XHRcdC8vIElmIFwibmFtZVwiIGlzIGFuIGFycmF5IG9mIGtleXMuLi5cblx0XHRcdFx0Ly8gV2hlbiBkYXRhIGlzIGluaXRpYWxseSBjcmVhdGVkLCB2aWEgKFwia2V5XCIsIFwidmFsXCIpIHNpZ25hdHVyZSxcblx0XHRcdFx0Ly8ga2V5cyB3aWxsIGJlIGNvbnZlcnRlZCB0byBjYW1lbENhc2UuXG5cdFx0XHRcdC8vIFNpbmNlIHRoZXJlIGlzIG5vIHdheSB0byB0ZWxsIF9ob3dfIGEga2V5IHdhcyBhZGRlZCwgcmVtb3ZlXG5cdFx0XHRcdC8vIGJvdGggcGxhaW4ga2V5IGFuZCBjYW1lbENhc2Uga2V5LiAjMTI3ODZcblx0XHRcdFx0Ly8gVGhpcyB3aWxsIG9ubHkgcGVuYWxpemUgdGhlIGFycmF5IGFyZ3VtZW50IHBhdGguXG5cdFx0XHRcdG5hbWUgPSBrZXkuY29uY2F0KCBrZXkubWFwKCBqUXVlcnkuY2FtZWxDYXNlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNhbWVsID0galF1ZXJ5LmNhbWVsQ2FzZSgga2V5ICk7XG5cdFx0XHRcdC8vIFRyeSB0aGUgc3RyaW5nIGFzIGEga2V5IGJlZm9yZSBhbnkgbWFuaXB1bGF0aW9uXG5cdFx0XHRcdGlmICgga2V5IGluIGNhY2hlICkge1xuXHRcdFx0XHRcdG5hbWUgPSBbIGtleSwgY2FtZWwgXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBJZiBhIGtleSB3aXRoIHRoZSBzcGFjZXMgZXhpc3RzLCB1c2UgaXQuXG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCBjcmVhdGUgYW4gYXJyYXkgYnkgbWF0Y2hpbmcgbm9uLXdoaXRlc3BhY2Vcblx0XHRcdFx0XHRuYW1lID0gY2FtZWw7XG5cdFx0XHRcdFx0bmFtZSA9IG5hbWUgaW4gY2FjaGUgP1xuXHRcdFx0XHRcdFx0WyBuYW1lIF0gOiAoIG5hbWUubWF0Y2goIGNvcmVfcm5vdHdoaXRlICkgfHwgW10gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpID0gbmFtZS5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0ZGVsZXRlIGNhY2hlWyBuYW1lWyBpIF0gXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGhhc0RhdGE6IGZ1bmN0aW9uKCBvd25lciApIHtcblx0XHRyZXR1cm4gIWpRdWVyeS5pc0VtcHR5T2JqZWN0KFxuXHRcdFx0dGhpcy5jYWNoZVsgb3duZXJbIHRoaXMuZXhwYW5kbyBdIF0gfHwge31cblx0XHQpO1xuXHR9LFxuXHRkaXNjYXJkOiBmdW5jdGlvbiggb3duZXIgKSB7XG5cdFx0aWYgKCBvd25lclsgdGhpcy5leHBhbmRvIF0gKSB7XG5cdFx0XHRkZWxldGUgdGhpcy5jYWNoZVsgb3duZXJbIHRoaXMuZXhwYW5kbyBdIF07XG5cdFx0fVxuXHR9XG59O1xuXG4vLyBUaGVzZSBtYXkgYmUgdXNlZCB0aHJvdWdob3V0IHRoZSBqUXVlcnkgY29yZSBjb2RlYmFzZVxuZGF0YV91c2VyID0gbmV3IERhdGEoKTtcbmRhdGFfcHJpdiA9IG5ldyBEYXRhKCk7XG5cblxualF1ZXJ5LmV4dGVuZCh7XG5cdGFjY2VwdERhdGE6IERhdGEuYWNjZXB0cyxcblxuXHRoYXNEYXRhOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4gZGF0YV91c2VyLmhhc0RhdGEoIGVsZW0gKSB8fCBkYXRhX3ByaXYuaGFzRGF0YSggZWxlbSApO1xuXHR9LFxuXG5cdGRhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBkYXRhICkge1xuXHRcdHJldHVybiBkYXRhX3VzZXIuYWNjZXNzKCBlbGVtLCBuYW1lLCBkYXRhICk7XG5cdH0sXG5cblx0cmVtb3ZlRGF0YTogZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cdFx0ZGF0YV91c2VyLnJlbW92ZSggZWxlbSwgbmFtZSApO1xuXHR9LFxuXG5cdC8vIFRPRE86IE5vdyB0aGF0IGFsbCBjYWxscyB0byBfZGF0YSBhbmQgX3JlbW92ZURhdGEgaGF2ZSBiZWVuIHJlcGxhY2VkXG5cdC8vIHdpdGggZGlyZWN0IGNhbGxzIHRvIGRhdGFfcHJpdiBtZXRob2RzLCB0aGVzZSBjYW4gYmUgZGVwcmVjYXRlZC5cblx0X2RhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBkYXRhICkge1xuXHRcdHJldHVybiBkYXRhX3ByaXYuYWNjZXNzKCBlbGVtLCBuYW1lLCBkYXRhICk7XG5cdH0sXG5cblx0X3JlbW92ZURhdGE6IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXHRcdGRhdGFfcHJpdi5yZW1vdmUoIGVsZW0sIG5hbWUgKTtcblx0fVxufSk7XG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXHRkYXRhOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblx0XHR2YXIgYXR0cnMsIG5hbWUsXG5cdFx0XHRlbGVtID0gdGhpc1sgMCBdLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRkYXRhID0gbnVsbDtcblxuXHRcdC8vIEdldHMgYWxsIHZhbHVlc1xuXHRcdGlmICgga2V5ID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRpZiAoIHRoaXMubGVuZ3RoICkge1xuXHRcdFx0XHRkYXRhID0gZGF0YV91c2VyLmdldCggZWxlbSApO1xuXG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSAmJiAhZGF0YV9wcml2LmdldCggZWxlbSwgXCJoYXNEYXRhQXR0cnNcIiApICkge1xuXHRcdFx0XHRcdGF0dHJzID0gZWxlbS5hdHRyaWJ1dGVzO1xuXHRcdFx0XHRcdGZvciAoIDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRcdFx0bmFtZSA9IGF0dHJzWyBpIF0ubmFtZTtcblxuXHRcdFx0XHRcdFx0aWYgKCBuYW1lLmluZGV4T2YoIFwiZGF0YS1cIiApID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHRuYW1lID0galF1ZXJ5LmNhbWVsQ2FzZSggbmFtZS5zbGljZSg1KSApO1xuXHRcdFx0XHRcdFx0XHRkYXRhQXR0ciggZWxlbSwgbmFtZSwgZGF0YVsgbmFtZSBdICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGFfcHJpdi5zZXQoIGVsZW0sIFwiaGFzRGF0YUF0dHJzXCIsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9XG5cblx0XHQvLyBTZXRzIG11bHRpcGxlIHZhbHVlc1xuXHRcdGlmICggdHlwZW9mIGtleSA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRhdGFfdXNlci5zZXQoIHRoaXMsIGtleSApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpRdWVyeS5hY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdHZhciBkYXRhLFxuXHRcdFx0XHRjYW1lbEtleSA9IGpRdWVyeS5jYW1lbENhc2UoIGtleSApO1xuXG5cdFx0XHQvLyBUaGUgY2FsbGluZyBqUXVlcnkgb2JqZWN0IChlbGVtZW50IG1hdGNoZXMpIGlzIG5vdCBlbXB0eVxuXHRcdFx0Ly8gKGFuZCB0aGVyZWZvcmUgaGFzIGFuIGVsZW1lbnQgYXBwZWFycyBhdCB0aGlzWyAwIF0pIGFuZCB0aGVcblx0XHRcdC8vIGB2YWx1ZWAgcGFyYW1ldGVyIHdhcyBub3QgdW5kZWZpbmVkLiBBbiBlbXB0eSBqUXVlcnkgb2JqZWN0XG5cdFx0XHQvLyB3aWxsIHJlc3VsdCBpbiBgdW5kZWZpbmVkYCBmb3IgZWxlbSA9IHRoaXNbIDAgXSB3aGljaCB3aWxsXG5cdFx0XHQvLyB0aHJvdyBhbiBleGNlcHRpb24gaWYgYW4gYXR0ZW1wdCB0byByZWFkIGEgZGF0YSBjYWNoZSBpcyBtYWRlLlxuXHRcdFx0aWYgKCBlbGVtICYmIHZhbHVlID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdC8vIEF0dGVtcHQgdG8gZ2V0IGRhdGEgZnJvbSB0aGUgY2FjaGVcblx0XHRcdFx0Ly8gd2l0aCB0aGUga2V5IGFzLWlzXG5cdFx0XHRcdGRhdGEgPSBkYXRhX3VzZXIuZ2V0KCBlbGVtLCBrZXkgKTtcblx0XHRcdFx0aWYgKCBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIGdldCBkYXRhIGZyb20gdGhlIGNhY2hlXG5cdFx0XHRcdC8vIHdpdGggdGhlIGtleSBjYW1lbGl6ZWRcblx0XHRcdFx0ZGF0YSA9IGRhdGFfdXNlci5nZXQoIGVsZW0sIGNhbWVsS2V5ICk7XG5cdFx0XHRcdGlmICggZGF0YSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBcImRpc2NvdmVyXCIgdGhlIGRhdGEgaW5cblx0XHRcdFx0Ly8gSFRNTDUgY3VzdG9tIGRhdGEtKiBhdHRyc1xuXHRcdFx0XHRkYXRhID0gZGF0YUF0dHIoIGVsZW0sIGNhbWVsS2V5LCB1bmRlZmluZWQgKTtcblx0XHRcdFx0aWYgKCBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBXZSB0cmllZCByZWFsbHkgaGFyZCwgYnV0IHRoZSBkYXRhIGRvZXNuJ3QgZXhpc3QuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IHRoZSBkYXRhLi4uXG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIEZpcnN0LCBhdHRlbXB0IHRvIHN0b3JlIGEgY29weSBvciByZWZlcmVuY2Ugb2YgYW55XG5cdFx0XHRcdC8vIGRhdGEgdGhhdCBtaWdodCd2ZSBiZWVuIHN0b3JlIHdpdGggYSBjYW1lbENhc2VkIGtleS5cblx0XHRcdFx0dmFyIGRhdGEgPSBkYXRhX3VzZXIuZ2V0KCB0aGlzLCBjYW1lbEtleSApO1xuXG5cdFx0XHRcdC8vIEZvciBIVE1MNSBkYXRhLSogYXR0cmlidXRlIGludGVyb3AsIHdlIGhhdmUgdG9cblx0XHRcdFx0Ly8gc3RvcmUgcHJvcGVydHkgbmFtZXMgd2l0aCBkYXNoZXMgaW4gYSBjYW1lbENhc2UgZm9ybS5cblx0XHRcdFx0Ly8gVGhpcyBtaWdodCBub3QgYXBwbHkgdG8gYWxsIHByb3BlcnRpZXMuLi4qXG5cdFx0XHRcdGRhdGFfdXNlci5zZXQoIHRoaXMsIGNhbWVsS2V5LCB2YWx1ZSApO1xuXG5cdFx0XHRcdC8vICouLi4gSW4gdGhlIGNhc2Ugb2YgcHJvcGVydGllcyB0aGF0IG1pZ2h0IF9hY3R1YWxseV9cblx0XHRcdFx0Ly8gaGF2ZSBkYXNoZXMsIHdlIG5lZWQgdG8gYWxzbyBzdG9yZSBhIGNvcHkgb2YgdGhhdFxuXHRcdFx0XHQvLyB1bmNoYW5nZWQgcHJvcGVydHkuXG5cdFx0XHRcdGlmICgga2V5LmluZGV4T2YoXCItXCIpICE9PSAtMSAmJiBkYXRhICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0ZGF0YV91c2VyLnNldCggdGhpcywga2V5LCB2YWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LCBudWxsLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEsIG51bGwsIHRydWUgKTtcblx0fSxcblxuXHRyZW1vdmVEYXRhOiBmdW5jdGlvbigga2V5ICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRkYXRhX3VzZXIucmVtb3ZlKCB0aGlzLCBrZXkgKTtcblx0XHR9KTtcblx0fVxufSk7XG5cbmZ1bmN0aW9uIGRhdGFBdHRyKCBlbGVtLCBrZXksIGRhdGEgKSB7XG5cdHZhciBuYW1lO1xuXG5cdC8vIElmIG5vdGhpbmcgd2FzIGZvdW5kIGludGVybmFsbHksIHRyeSB0byBmZXRjaCBhbnlcblx0Ly8gZGF0YSBmcm9tIHRoZSBIVE1MNSBkYXRhLSogYXR0cmlidXRlXG5cdGlmICggZGF0YSA9PT0gdW5kZWZpbmVkICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0bmFtZSA9IFwiZGF0YS1cIiArIGtleS5yZXBsYWNlKCBybXVsdGlEYXNoLCBcIi0kMVwiICkudG9Mb3dlckNhc2UoKTtcblx0XHRkYXRhID0gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKTtcblxuXHRcdGlmICggdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRkYXRhID0gZGF0YSA9PT0gXCJ0cnVlXCIgPyB0cnVlIDpcblx0XHRcdFx0XHRkYXRhID09PSBcImZhbHNlXCIgPyBmYWxzZSA6XG5cdFx0XHRcdFx0ZGF0YSA9PT0gXCJudWxsXCIgPyBudWxsIDpcblx0XHRcdFx0XHQvLyBPbmx5IGNvbnZlcnQgdG8gYSBudW1iZXIgaWYgaXQgZG9lc24ndCBjaGFuZ2UgdGhlIHN0cmluZ1xuXHRcdFx0XHRcdCtkYXRhICsgXCJcIiA9PT0gZGF0YSA/ICtkYXRhIDpcblx0XHRcdFx0XHRyYnJhY2UudGVzdCggZGF0YSApID8gSlNPTi5wYXJzZSggZGF0YSApIDpcblx0XHRcdFx0XHRkYXRhO1xuXHRcdFx0fSBjYXRjaCggZSApIHt9XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBzZXQgdGhlIGRhdGEgc28gaXQgaXNuJ3QgY2hhbmdlZCBsYXRlclxuXHRcdFx0ZGF0YV91c2VyLnNldCggZWxlbSwga2V5LCBkYXRhICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGEgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBkYXRhO1xufVxualF1ZXJ5LmV4dGVuZCh7XG5cdHF1ZXVlOiBmdW5jdGlvbiggZWxlbSwgdHlwZSwgZGF0YSApIHtcblx0XHR2YXIgcXVldWU7XG5cblx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHR0eXBlID0gKCB0eXBlIHx8IFwiZnhcIiApICsgXCJxdWV1ZVwiO1xuXHRcdFx0cXVldWUgPSBkYXRhX3ByaXYuZ2V0KCBlbGVtLCB0eXBlICk7XG5cblx0XHRcdC8vIFNwZWVkIHVwIGRlcXVldWUgYnkgZ2V0dGluZyBvdXQgcXVpY2tseSBpZiB0aGlzIGlzIGp1c3QgYSBsb29rdXBcblx0XHRcdGlmICggZGF0YSApIHtcblx0XHRcdFx0aWYgKCAhcXVldWUgfHwgalF1ZXJ5LmlzQXJyYXkoIGRhdGEgKSApIHtcblx0XHRcdFx0XHRxdWV1ZSA9IGRhdGFfcHJpdi5hY2Nlc3MoIGVsZW0sIHR5cGUsIGpRdWVyeS5tYWtlQXJyYXkoZGF0YSkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRxdWV1ZS5wdXNoKCBkYXRhICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBxdWV1ZSB8fCBbXTtcblx0XHR9XG5cdH0sXG5cblx0ZGVxdWV1ZTogZnVuY3Rpb24oIGVsZW0sIHR5cGUgKSB7XG5cdFx0dHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xuXG5cdFx0dmFyIHF1ZXVlID0galF1ZXJ5LnF1ZXVlKCBlbGVtLCB0eXBlICksXG5cdFx0XHRzdGFydExlbmd0aCA9IHF1ZXVlLmxlbmd0aCxcblx0XHRcdGZuID0gcXVldWUuc2hpZnQoKSxcblx0XHRcdGhvb2tzID0galF1ZXJ5Ll9xdWV1ZUhvb2tzKCBlbGVtLCB0eXBlICksXG5cdFx0XHRuZXh0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGpRdWVyeS5kZXF1ZXVlKCBlbGVtLCB0eXBlICk7XG5cdFx0XHR9O1xuXG5cdFx0Ly8gSWYgdGhlIGZ4IHF1ZXVlIGlzIGRlcXVldWVkLCBhbHdheXMgcmVtb3ZlIHRoZSBwcm9ncmVzcyBzZW50aW5lbFxuXHRcdGlmICggZm4gPT09IFwiaW5wcm9ncmVzc1wiICkge1xuXHRcdFx0Zm4gPSBxdWV1ZS5zaGlmdCgpO1xuXHRcdFx0c3RhcnRMZW5ndGgtLTtcblx0XHR9XG5cblx0XHRpZiAoIGZuICkge1xuXG5cdFx0XHQvLyBBZGQgYSBwcm9ncmVzcyBzZW50aW5lbCB0byBwcmV2ZW50IHRoZSBmeCBxdWV1ZSBmcm9tIGJlaW5nXG5cdFx0XHQvLyBhdXRvbWF0aWNhbGx5IGRlcXVldWVkXG5cdFx0XHRpZiAoIHR5cGUgPT09IFwiZnhcIiApIHtcblx0XHRcdFx0cXVldWUudW5zaGlmdCggXCJpbnByb2dyZXNzXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gY2xlYXIgdXAgdGhlIGxhc3QgcXVldWUgc3RvcCBmdW5jdGlvblxuXHRcdFx0ZGVsZXRlIGhvb2tzLnN0b3A7XG5cdFx0XHRmbi5jYWxsKCBlbGVtLCBuZXh0LCBob29rcyApO1xuXHRcdH1cblxuXHRcdGlmICggIXN0YXJ0TGVuZ3RoICYmIGhvb2tzICkge1xuXHRcdFx0aG9va3MuZW1wdHkuZmlyZSgpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBub3QgaW50ZW5kZWQgZm9yIHB1YmxpYyBjb25zdW1wdGlvbiAtIGdlbmVyYXRlcyBhIHF1ZXVlSG9va3Mgb2JqZWN0LCBvciByZXR1cm5zIHRoZSBjdXJyZW50IG9uZVxuXHRfcXVldWVIb29rczogZnVuY3Rpb24oIGVsZW0sIHR5cGUgKSB7XG5cdFx0dmFyIGtleSA9IHR5cGUgKyBcInF1ZXVlSG9va3NcIjtcblx0XHRyZXR1cm4gZGF0YV9wcml2LmdldCggZWxlbSwga2V5ICkgfHwgZGF0YV9wcml2LmFjY2VzcyggZWxlbSwga2V5LCB7XG5cdFx0XHRlbXB0eTogalF1ZXJ5LkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLmFkZChmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGF0YV9wcml2LnJlbW92ZSggZWxlbSwgWyB0eXBlICsgXCJxdWV1ZVwiLCBrZXkgXSApO1xuXHRcdFx0fSlcblx0XHR9KTtcblx0fVxufSk7XG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXHRxdWV1ZTogZnVuY3Rpb24oIHR5cGUsIGRhdGEgKSB7XG5cdFx0dmFyIHNldHRlciA9IDI7XG5cblx0XHRpZiAoIHR5cGVvZiB0eXBlICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0ZGF0YSA9IHR5cGU7XG5cdFx0XHR0eXBlID0gXCJmeFwiO1xuXHRcdFx0c2V0dGVyLS07XG5cdFx0fVxuXG5cdFx0aWYgKCBhcmd1bWVudHMubGVuZ3RoIDwgc2V0dGVyICkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5xdWV1ZSggdGhpc1swXSwgdHlwZSApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhID09PSB1bmRlZmluZWQgP1xuXHRcdFx0dGhpcyA6XG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBxdWV1ZSA9IGpRdWVyeS5xdWV1ZSggdGhpcywgdHlwZSwgZGF0YSApO1xuXG5cdFx0XHRcdC8vIGVuc3VyZSBhIGhvb2tzIGZvciB0aGlzIHF1ZXVlXG5cdFx0XHRcdGpRdWVyeS5fcXVldWVIb29rcyggdGhpcywgdHlwZSApO1xuXG5cdFx0XHRcdGlmICggdHlwZSA9PT0gXCJmeFwiICYmIHF1ZXVlWzBdICE9PSBcImlucHJvZ3Jlc3NcIiApIHtcblx0XHRcdFx0XHRqUXVlcnkuZGVxdWV1ZSggdGhpcywgdHlwZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fSxcblx0ZGVxdWV1ZTogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeS5kZXF1ZXVlKCB0aGlzLCB0eXBlICk7XG5cdFx0fSk7XG5cdH0sXG5cdC8vIEJhc2VkIG9mZiBvZiB0aGUgcGx1Z2luIGJ5IENsaW50IEhlbGZlcnMsIHdpdGggcGVybWlzc2lvbi5cblx0Ly8gaHR0cDovL2JsaW5kc2lnbmFscy5jb20vaW5kZXgucGhwLzIwMDkvMDcvanF1ZXJ5LWRlbGF5L1xuXHRkZWxheTogZnVuY3Rpb24oIHRpbWUsIHR5cGUgKSB7XG5cdFx0dGltZSA9IGpRdWVyeS5meCA/IGpRdWVyeS5meC5zcGVlZHNbIHRpbWUgXSB8fCB0aW1lIDogdGltZTtcblx0XHR0eXBlID0gdHlwZSB8fCBcImZ4XCI7XG5cblx0XHRyZXR1cm4gdGhpcy5xdWV1ZSggdHlwZSwgZnVuY3Rpb24oIG5leHQsIGhvb2tzICkge1xuXHRcdFx0dmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCBuZXh0LCB0aW1lICk7XG5cdFx0XHRob29rcy5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNsZWFyVGltZW91dCggdGltZW91dCApO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fSxcblx0Y2xlYXJRdWV1ZTogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVldWUoIHR5cGUgfHwgXCJmeFwiLCBbXSApO1xuXHR9LFxuXHQvLyBHZXQgYSBwcm9taXNlIHJlc29sdmVkIHdoZW4gcXVldWVzIG9mIGEgY2VydGFpbiB0eXBlXG5cdC8vIGFyZSBlbXB0aWVkIChmeCBpcyB0aGUgdHlwZSBieSBkZWZhdWx0KVxuXHRwcm9taXNlOiBmdW5jdGlvbiggdHlwZSwgb2JqICkge1xuXHRcdHZhciB0bXAsXG5cdFx0XHRjb3VudCA9IDEsXG5cdFx0XHRkZWZlciA9IGpRdWVyeS5EZWZlcnJlZCgpLFxuXHRcdFx0ZWxlbWVudHMgPSB0aGlzLFxuXHRcdFx0aSA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0cmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICEoIC0tY291bnQgKSApIHtcblx0XHRcdFx0XHRkZWZlci5yZXNvbHZlV2l0aCggZWxlbWVudHMsIFsgZWxlbWVudHMgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0aWYgKCB0eXBlb2YgdHlwZSAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdG9iaiA9IHR5cGU7XG5cdFx0XHR0eXBlID0gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHR0eXBlID0gdHlwZSB8fCBcImZ4XCI7XG5cblx0XHR3aGlsZSggaS0tICkge1xuXHRcdFx0dG1wID0gZGF0YV9wcml2LmdldCggZWxlbWVudHNbIGkgXSwgdHlwZSArIFwicXVldWVIb29rc1wiICk7XG5cdFx0XHRpZiAoIHRtcCAmJiB0bXAuZW1wdHkgKSB7XG5cdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdHRtcC5lbXB0eS5hZGQoIHJlc29sdmUgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmVzb2x2ZSgpO1xuXHRcdHJldHVybiBkZWZlci5wcm9taXNlKCBvYmogKTtcblx0fVxufSk7XG52YXIgbm9kZUhvb2ssIGJvb2xIb29rLFxuXHRyY2xhc3MgPSAvW1xcdFxcclxcblxcZl0vZyxcblx0cnJldHVybiA9IC9cXHIvZyxcblx0cmZvY3VzYWJsZSA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2k7XG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXHRhdHRyOiBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5hY2Nlc3MoIHRoaXMsIGpRdWVyeS5hdHRyLCBuYW1lLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgKTtcblx0fSxcblxuXHRyZW1vdmVBdHRyOiBmdW5jdGlvbiggbmFtZSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5LnJlbW92ZUF0dHIoIHRoaXMsIG5hbWUgKTtcblx0XHR9KTtcblx0fSxcblxuXHRwcm9wOiBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5hY2Nlc3MoIHRoaXMsIGpRdWVyeS5wcm9wLCBuYW1lLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgKTtcblx0fSxcblxuXHRyZW1vdmVQcm9wOiBmdW5jdGlvbiggbmFtZSApIHtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbIGpRdWVyeS5wcm9wRml4WyBuYW1lIF0gfHwgbmFtZSBdO1xuXHRcdH0pO1xuXHR9LFxuXG5cdGFkZENsYXNzOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGNsYXNzZXMsIGVsZW0sIGN1ciwgY2xhenosIGosXG5cdFx0XHRpID0gMCxcblx0XHRcdGxlbiA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0cHJvY2VlZCA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZTtcblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCBqICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5hZGRDbGFzcyggdmFsdWUuY2FsbCggdGhpcywgaiwgdGhpcy5jbGFzc05hbWUgKSApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCBwcm9jZWVkICkge1xuXHRcdFx0Ly8gVGhlIGRpc2p1bmN0aW9uIGhlcmUgaXMgZm9yIGJldHRlciBjb21wcmVzc2liaWxpdHkgKHNlZSByZW1vdmVDbGFzcylcblx0XHRcdGNsYXNzZXMgPSAoIHZhbHVlIHx8IFwiXCIgKS5tYXRjaCggY29yZV9ybm90d2hpdGUgKSB8fCBbXTtcblxuXHRcdFx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdGVsZW0gPSB0aGlzWyBpIF07XG5cdFx0XHRcdGN1ciA9IGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgKCBlbGVtLmNsYXNzTmFtZSA/XG5cdFx0XHRcdFx0KCBcIiBcIiArIGVsZW0uY2xhc3NOYW1lICsgXCIgXCIgKS5yZXBsYWNlKCByY2xhc3MsIFwiIFwiICkgOlxuXHRcdFx0XHRcdFwiIFwiXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCBjdXIgKSB7XG5cdFx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdFx0d2hpbGUgKCAoY2xhenogPSBjbGFzc2VzW2orK10pICkge1xuXHRcdFx0XHRcdFx0aWYgKCBjdXIuaW5kZXhPZiggXCIgXCIgKyBjbGF6eiArIFwiIFwiICkgPCAwICkge1xuXHRcdFx0XHRcdFx0XHRjdXIgKz0gY2xhenogKyBcIiBcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBqUXVlcnkudHJpbSggY3VyICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHJlbW92ZUNsYXNzOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGNsYXNzZXMsIGVsZW0sIGN1ciwgY2xhenosIGosXG5cdFx0XHRpID0gMCxcblx0XHRcdGxlbiA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0cHJvY2VlZCA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oIGogKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLnJlbW92ZUNsYXNzKCB2YWx1ZS5jYWxsKCB0aGlzLCBqLCB0aGlzLmNsYXNzTmFtZSApICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aWYgKCBwcm9jZWVkICkge1xuXHRcdFx0Y2xhc3NlcyA9ICggdmFsdWUgfHwgXCJcIiApLm1hdGNoKCBjb3JlX3Jub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0ZWxlbSA9IHRoaXNbIGkgXTtcblx0XHRcdFx0Ly8gVGhpcyBleHByZXNzaW9uIGlzIGhlcmUgZm9yIGJldHRlciBjb21wcmVzc2liaWxpdHkgKHNlZSBhZGRDbGFzcylcblx0XHRcdFx0Y3VyID0gZWxlbS5ub2RlVHlwZSA9PT0gMSAmJiAoIGVsZW0uY2xhc3NOYW1lID9cblx0XHRcdFx0XHQoIFwiIFwiICsgZWxlbS5jbGFzc05hbWUgKyBcIiBcIiApLnJlcGxhY2UoIHJjbGFzcywgXCIgXCIgKSA6XG5cdFx0XHRcdFx0XCJcIlxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmICggY3VyICkge1xuXHRcdFx0XHRcdGogPSAwO1xuXHRcdFx0XHRcdHdoaWxlICggKGNsYXp6ID0gY2xhc3Nlc1tqKytdKSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSAqYWxsKiBpbnN0YW5jZXNcblx0XHRcdFx0XHRcdHdoaWxlICggY3VyLmluZGV4T2YoIFwiIFwiICsgY2xhenogKyBcIiBcIiApID49IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGN1ciA9IGN1ci5yZXBsYWNlKCBcIiBcIiArIGNsYXp6ICsgXCIgXCIsIFwiIFwiICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsZW0uY2xhc3NOYW1lID0gdmFsdWUgPyBqUXVlcnkudHJpbSggY3VyICkgOiBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0dG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uKCB2YWx1ZSwgc3RhdGVWYWwgKSB7XG5cdFx0dmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cblx0XHRpZiAoIHR5cGVvZiBzdGF0ZVZhbCA9PT0gXCJib29sZWFuXCIgJiYgdHlwZSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBzdGF0ZVZhbCA/IHRoaXMuYWRkQ2xhc3MoIHZhbHVlICkgOiB0aGlzLnJlbW92ZUNsYXNzKCB2YWx1ZSApO1xuXHRcdH1cblxuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS50b2dnbGVDbGFzcyggdmFsdWUuY2FsbCh0aGlzLCBpLCB0aGlzLmNsYXNzTmFtZSwgc3RhdGVWYWwpLCBzdGF0ZVZhbCApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdGlmICggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0Ly8gdG9nZ2xlIGluZGl2aWR1YWwgY2xhc3MgbmFtZXNcblx0XHRcdFx0dmFyIGNsYXNzTmFtZSxcblx0XHRcdFx0XHRpID0gMCxcblx0XHRcdFx0XHRzZWxmID0galF1ZXJ5KCB0aGlzICksXG5cdFx0XHRcdFx0Y2xhc3NOYW1lcyA9IHZhbHVlLm1hdGNoKCBjb3JlX3Jub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0XHRcdHdoaWxlICggKGNsYXNzTmFtZSA9IGNsYXNzTmFtZXNbIGkrKyBdKSApIHtcblx0XHRcdFx0XHQvLyBjaGVjayBlYWNoIGNsYXNzTmFtZSBnaXZlbiwgc3BhY2Ugc2VwYXJhdGVkIGxpc3Rcblx0XHRcdFx0XHRpZiAoIHNlbGYuaGFzQ2xhc3MoIGNsYXNzTmFtZSApICkge1xuXHRcdFx0XHRcdFx0c2VsZi5yZW1vdmVDbGFzcyggY2xhc3NOYW1lICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGYuYWRkQ2xhc3MoIGNsYXNzTmFtZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBUb2dnbGUgd2hvbGUgY2xhc3MgbmFtZVxuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gY29yZV9zdHJ1bmRlZmluZWQgfHwgdHlwZSA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0XHRcdGlmICggdGhpcy5jbGFzc05hbWUgKSB7XG5cdFx0XHRcdFx0Ly8gc3RvcmUgY2xhc3NOYW1lIGlmIHNldFxuXHRcdFx0XHRcdGRhdGFfcHJpdi5zZXQoIHRoaXMsIFwiX19jbGFzc05hbWVfX1wiLCB0aGlzLmNsYXNzTmFtZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGVsZW1lbnQgaGFzIGEgY2xhc3MgbmFtZSBvciBpZiB3ZSdyZSBwYXNzZWQgXCJmYWxzZVwiLFxuXHRcdFx0XHQvLyB0aGVuIHJlbW92ZSB0aGUgd2hvbGUgY2xhc3NuYW1lIChpZiB0aGVyZSB3YXMgb25lLCB0aGUgYWJvdmUgc2F2ZWQgaXQpLlxuXHRcdFx0XHQvLyBPdGhlcndpc2UgYnJpbmcgYmFjayB3aGF0ZXZlciB3YXMgcHJldmlvdXNseSBzYXZlZCAoaWYgYW55dGhpbmcpLFxuXHRcdFx0XHQvLyBmYWxsaW5nIGJhY2sgdG8gdGhlIGVtcHR5IHN0cmluZyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG5cdFx0XHRcdHRoaXMuY2xhc3NOYW1lID0gdGhpcy5jbGFzc05hbWUgfHwgdmFsdWUgPT09IGZhbHNlID8gXCJcIiA6IGRhdGFfcHJpdi5nZXQoIHRoaXMsIFwiX19jbGFzc05hbWVfX1wiICkgfHwgXCJcIjtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRoYXNDbGFzczogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciBjbGFzc05hbWUgPSBcIiBcIiArIHNlbGVjdG9yICsgXCIgXCIsXG5cdFx0XHRpID0gMCxcblx0XHRcdGwgPSB0aGlzLmxlbmd0aDtcblx0XHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRpZiAoIHRoaXNbaV0ubm9kZVR5cGUgPT09IDEgJiYgKFwiIFwiICsgdGhpc1tpXS5jbGFzc05hbWUgKyBcIiBcIikucmVwbGFjZShyY2xhc3MsIFwiIFwiKS5pbmRleE9mKCBjbGFzc05hbWUgKSA+PSAwICkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblx0dmFsOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIGhvb2tzLCByZXQsIGlzRnVuY3Rpb24sXG5cdFx0XHRlbGVtID0gdGhpc1swXTtcblxuXHRcdGlmICggIWFyZ3VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHRcdGhvb2tzID0galF1ZXJ5LnZhbEhvb2tzWyBlbGVtLnR5cGUgXSB8fCBqUXVlcnkudmFsSG9va3NbIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBdO1xuXG5cdFx0XHRcdGlmICggaG9va3MgJiYgXCJnZXRcIiBpbiBob29rcyAmJiAocmV0ID0gaG9va3MuZ2V0KCBlbGVtLCBcInZhbHVlXCIgKSkgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0ID0gZWxlbS52YWx1ZTtcblxuXHRcdFx0XHRyZXR1cm4gdHlwZW9mIHJldCA9PT0gXCJzdHJpbmdcIiA/XG5cdFx0XHRcdFx0Ly8gaGFuZGxlIG1vc3QgY29tbW9uIHN0cmluZyBjYXNlc1xuXHRcdFx0XHRcdHJldC5yZXBsYWNlKHJyZXR1cm4sIFwiXCIpIDpcblx0XHRcdFx0XHQvLyBoYW5kbGUgY2FzZXMgd2hlcmUgdmFsdWUgaXMgbnVsbC91bmRlZiBvciBudW1iZXJcblx0XHRcdFx0XHRyZXQgPT0gbnVsbCA/IFwiXCIgOiByZXQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpc0Z1bmN0aW9uID0galF1ZXJ5LmlzRnVuY3Rpb24oIHZhbHVlICk7XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCBpICkge1xuXHRcdFx0dmFyIHZhbDtcblxuXHRcdFx0aWYgKCB0aGlzLm5vZGVUeXBlICE9PSAxICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggaXNGdW5jdGlvbiApIHtcblx0XHRcdFx0dmFsID0gdmFsdWUuY2FsbCggdGhpcywgaSwgalF1ZXJ5KCB0aGlzICkudmFsKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhbCA9IHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmVhdCBudWxsL3VuZGVmaW5lZCBhcyBcIlwiOyBjb252ZXJ0IG51bWJlcnMgdG8gc3RyaW5nXG5cdFx0XHRpZiAoIHZhbCA9PSBudWxsICkge1xuXHRcdFx0XHR2YWwgPSBcIlwiO1xuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdFx0dmFsICs9IFwiXCI7XG5cdFx0XHR9IGVsc2UgaWYgKCBqUXVlcnkuaXNBcnJheSggdmFsICkgKSB7XG5cdFx0XHRcdHZhbCA9IGpRdWVyeS5tYXAodmFsLCBmdW5jdGlvbiAoIHZhbHVlICkge1xuXHRcdFx0XHRcdHJldHVybiB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlICsgXCJcIjtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGhvb2tzID0galF1ZXJ5LnZhbEhvb2tzWyB0aGlzLnR5cGUgXSB8fCBqUXVlcnkudmFsSG9va3NbIHRoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBdO1xuXG5cdFx0XHQvLyBJZiBzZXQgcmV0dXJucyB1bmRlZmluZWQsIGZhbGwgYmFjayB0byBub3JtYWwgc2V0dGluZ1xuXHRcdFx0aWYgKCAhaG9va3MgfHwgIShcInNldFwiIGluIGhvb2tzKSB8fCBob29rcy5zZXQoIHRoaXMsIHZhbCwgXCJ2YWx1ZVwiICkgPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXHR2YWxIb29rczoge1xuXHRcdG9wdGlvbjoge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0Ly8gYXR0cmlidXRlcy52YWx1ZSBpcyB1bmRlZmluZWQgaW4gQmxhY2tiZXJyeSA0LjcgYnV0XG5cdFx0XHRcdC8vIHVzZXMgLnZhbHVlLiBTZWUgIzY5MzJcblx0XHRcdFx0dmFyIHZhbCA9IGVsZW0uYXR0cmlidXRlcy52YWx1ZTtcblx0XHRcdFx0cmV0dXJuICF2YWwgfHwgdmFsLnNwZWNpZmllZCA/IGVsZW0udmFsdWUgOiBlbGVtLnRleHQ7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzZWxlY3Q6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSwgb3B0aW9uLFxuXHRcdFx0XHRcdG9wdGlvbnMgPSBlbGVtLm9wdGlvbnMsXG5cdFx0XHRcdFx0aW5kZXggPSBlbGVtLnNlbGVjdGVkSW5kZXgsXG5cdFx0XHRcdFx0b25lID0gZWxlbS50eXBlID09PSBcInNlbGVjdC1vbmVcIiB8fCBpbmRleCA8IDAsXG5cdFx0XHRcdFx0dmFsdWVzID0gb25lID8gbnVsbCA6IFtdLFxuXHRcdFx0XHRcdG1heCA9IG9uZSA/IGluZGV4ICsgMSA6IG9wdGlvbnMubGVuZ3RoLFxuXHRcdFx0XHRcdGkgPSBpbmRleCA8IDAgP1xuXHRcdFx0XHRcdFx0bWF4IDpcblx0XHRcdFx0XHRcdG9uZSA/IGluZGV4IDogMDtcblxuXHRcdFx0XHQvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBzZWxlY3RlZCBvcHRpb25zXG5cdFx0XHRcdGZvciAoIDsgaSA8IG1heDsgaSsrICkge1xuXHRcdFx0XHRcdG9wdGlvbiA9IG9wdGlvbnNbIGkgXTtcblxuXHRcdFx0XHRcdC8vIElFNi05IGRvZXNuJ3QgdXBkYXRlIHNlbGVjdGVkIGFmdGVyIGZvcm0gcmVzZXQgKCMyNTUxKVxuXHRcdFx0XHRcdGlmICggKCBvcHRpb24uc2VsZWN0ZWQgfHwgaSA9PT0gaW5kZXggKSAmJlxuXHRcdFx0XHRcdFx0XHQvLyBEb24ndCByZXR1cm4gb3B0aW9ucyB0aGF0IGFyZSBkaXNhYmxlZCBvciBpbiBhIGRpc2FibGVkIG9wdGdyb3VwXG5cdFx0XHRcdFx0XHRcdCggalF1ZXJ5LnN1cHBvcnQub3B0RGlzYWJsZWQgPyAhb3B0aW9uLmRpc2FibGVkIDogb3B0aW9uLmdldEF0dHJpYnV0ZShcImRpc2FibGVkXCIpID09PSBudWxsICkgJiZcblx0XHRcdFx0XHRcdFx0KCAhb3B0aW9uLnBhcmVudE5vZGUuZGlzYWJsZWQgfHwgIWpRdWVyeS5ub2RlTmFtZSggb3B0aW9uLnBhcmVudE5vZGUsIFwib3B0Z3JvdXBcIiApICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIEdldCB0aGUgc3BlY2lmaWMgdmFsdWUgZm9yIHRoZSBvcHRpb25cblx0XHRcdFx0XHRcdHZhbHVlID0galF1ZXJ5KCBvcHRpb24gKS52YWwoKTtcblxuXHRcdFx0XHRcdFx0Ly8gV2UgZG9uJ3QgbmVlZCBhbiBhcnJheSBmb3Igb25lIHNlbGVjdHNcblx0XHRcdFx0XHRcdGlmICggb25lICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIE11bHRpLVNlbGVjdHMgcmV0dXJuIGFuIGFycmF5XG5cdFx0XHRcdFx0XHR2YWx1ZXMucHVzaCggdmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdmFsdWVzO1xuXHRcdFx0fSxcblxuXHRcdFx0c2V0OiBmdW5jdGlvbiggZWxlbSwgdmFsdWUgKSB7XG5cdFx0XHRcdHZhciBvcHRpb25TZXQsIG9wdGlvbixcblx0XHRcdFx0XHRvcHRpb25zID0gZWxlbS5vcHRpb25zLFxuXHRcdFx0XHRcdHZhbHVlcyA9IGpRdWVyeS5tYWtlQXJyYXkoIHZhbHVlICksXG5cdFx0XHRcdFx0aSA9IG9wdGlvbnMubGVuZ3RoO1xuXG5cdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdG9wdGlvbiA9IG9wdGlvbnNbIGkgXTtcblx0XHRcdFx0XHRpZiAoIChvcHRpb24uc2VsZWN0ZWQgPSBqUXVlcnkuaW5BcnJheSggalF1ZXJ5KG9wdGlvbikudmFsKCksIHZhbHVlcyApID49IDApICkge1xuXHRcdFx0XHRcdFx0b3B0aW9uU2V0ID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmb3JjZSBicm93c2VycyB0byBiZWhhdmUgY29uc2lzdGVudGx5IHdoZW4gbm9uLW1hdGNoaW5nIHZhbHVlIGlzIHNldFxuXHRcdFx0XHRpZiAoICFvcHRpb25TZXQgKSB7XG5cdFx0XHRcdFx0ZWxlbS5zZWxlY3RlZEluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZhbHVlcztcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0YXR0cjogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlICkge1xuXHRcdHZhciBob29rcywgcmV0LFxuXHRcdFx0blR5cGUgPSBlbGVtLm5vZGVUeXBlO1xuXG5cdFx0Ly8gZG9uJ3QgZ2V0L3NldCBhdHRyaWJ1dGVzIG9uIHRleHQsIGNvbW1lbnQgYW5kIGF0dHJpYnV0ZSBub2Rlc1xuXHRcdGlmICggIWVsZW0gfHwgblR5cGUgPT09IDMgfHwgblR5cGUgPT09IDggfHwgblR5cGUgPT09IDIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRmFsbGJhY2sgdG8gcHJvcCB3aGVuIGF0dHJpYnV0ZXMgYXJlIG5vdCBzdXBwb3J0ZWRcblx0XHRpZiAoIHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSA9PT0gY29yZV9zdHJ1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5LnByb3AoIGVsZW0sIG5hbWUsIHZhbHVlICk7XG5cdFx0fVxuXG5cdFx0Ly8gQWxsIGF0dHJpYnV0ZXMgYXJlIGxvd2VyY2FzZVxuXHRcdC8vIEdyYWIgbmVjZXNzYXJ5IGhvb2sgaWYgb25lIGlzIGRlZmluZWRcblx0XHRpZiAoIG5UeXBlICE9PSAxIHx8ICFqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKSApIHtcblx0XHRcdG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRob29rcyA9IGpRdWVyeS5hdHRySG9va3NbIG5hbWUgXSB8fFxuXHRcdFx0XHQoIGpRdWVyeS5leHByLm1hdGNoLmJvb2wudGVzdCggbmFtZSApID8gYm9vbEhvb2sgOiBub2RlSG9vayApO1xuXHRcdH1cblxuXHRcdGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0aWYgKCB2YWx1ZSA9PT0gbnVsbCApIHtcblx0XHRcdFx0alF1ZXJ5LnJlbW92ZUF0dHIoIGVsZW0sIG5hbWUgKTtcblxuXHRcdFx0fSBlbHNlIGlmICggaG9va3MgJiYgXCJzZXRcIiBpbiBob29rcyAmJiAocmV0ID0gaG9va3Muc2V0KCBlbGVtLCB2YWx1ZSwgbmFtZSApKSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSggbmFtZSwgdmFsdWUgKyBcIlwiICk7XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAoIGhvb2tzICYmIFwiZ2V0XCIgaW4gaG9va3MgJiYgKHJldCA9IGhvb2tzLmdldCggZWxlbSwgbmFtZSApKSAhPT0gbnVsbCApIHtcblx0XHRcdHJldHVybiByZXQ7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0ID0galF1ZXJ5LmZpbmQuYXR0ciggZWxlbSwgbmFtZSApO1xuXG5cdFx0XHQvLyBOb24tZXhpc3RlbnQgYXR0cmlidXRlcyByZXR1cm4gbnVsbCwgd2Ugbm9ybWFsaXplIHRvIHVuZGVmaW5lZFxuXHRcdFx0cmV0dXJuIHJldCA9PSBudWxsID9cblx0XHRcdFx0dW5kZWZpbmVkIDpcblx0XHRcdFx0cmV0O1xuXHRcdH1cblx0fSxcblxuXHRyZW1vdmVBdHRyOiBmdW5jdGlvbiggZWxlbSwgdmFsdWUgKSB7XG5cdFx0dmFyIG5hbWUsIHByb3BOYW1lLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRhdHRyTmFtZXMgPSB2YWx1ZSAmJiB2YWx1ZS5tYXRjaCggY29yZV9ybm90d2hpdGUgKTtcblxuXHRcdGlmICggYXR0ck5hbWVzICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHR3aGlsZSAoIChuYW1lID0gYXR0ck5hbWVzW2krK10pICkge1xuXHRcdFx0XHRwcm9wTmFtZSA9IGpRdWVyeS5wcm9wRml4WyBuYW1lIF0gfHwgbmFtZTtcblxuXHRcdFx0XHQvLyBCb29sZWFuIGF0dHJpYnV0ZXMgZ2V0IHNwZWNpYWwgdHJlYXRtZW50ICgjMTA4NzApXG5cdFx0XHRcdGlmICggalF1ZXJ5LmV4cHIubWF0Y2guYm9vbC50ZXN0KCBuYW1lICkgKSB7XG5cdFx0XHRcdFx0Ly8gU2V0IGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgdG8gZmFsc2Vcblx0XHRcdFx0XHRlbGVtWyBwcm9wTmFtZSBdID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtLnJlbW92ZUF0dHJpYnV0ZSggbmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRhdHRySG9va3M6IHtcblx0XHR0eXBlOiB7XG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCAhalF1ZXJ5LnN1cHBvcnQucmFkaW9WYWx1ZSAmJiB2YWx1ZSA9PT0gXCJyYWRpb1wiICYmIGpRdWVyeS5ub2RlTmFtZShlbGVtLCBcImlucHV0XCIpICkge1xuXHRcdFx0XHRcdC8vIFNldHRpbmcgdGhlIHR5cGUgb24gYSByYWRpbyBidXR0b24gYWZ0ZXIgdGhlIHZhbHVlIHJlc2V0cyB0aGUgdmFsdWUgaW4gSUU2LTlcblx0XHRcdFx0XHQvLyBSZXNldCB2YWx1ZSB0byBkZWZhdWx0IGluIGNhc2UgdHlwZSBpcyBzZXQgYWZ0ZXIgdmFsdWUgZHVyaW5nIGNyZWF0aW9uXG5cdFx0XHRcdFx0dmFyIHZhbCA9IGVsZW0udmFsdWU7XG5cdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCB2YWx1ZSApO1xuXHRcdFx0XHRcdGlmICggdmFsICkge1xuXHRcdFx0XHRcdFx0ZWxlbS52YWx1ZSA9IHZhbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdHByb3BGaXg6IHtcblx0XHRcImZvclwiOiBcImh0bWxGb3JcIixcblx0XHRcImNsYXNzXCI6IFwiY2xhc3NOYW1lXCJcblx0fSxcblxuXHRwcm9wOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgdmFsdWUgKSB7XG5cdFx0dmFyIHJldCwgaG9va3MsIG5vdHhtbCxcblx0XHRcdG5UeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRcdC8vIGRvbid0IGdldC9zZXQgcHJvcGVydGllcyBvbiB0ZXh0LCBjb21tZW50IGFuZCBhdHRyaWJ1dGUgbm9kZXNcblx0XHRpZiAoICFlbGVtIHx8IG5UeXBlID09PSAzIHx8IG5UeXBlID09PSA4IHx8IG5UeXBlID09PSAyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5vdHhtbCA9IG5UeXBlICE9PSAxIHx8ICFqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKTtcblxuXHRcdGlmICggbm90eG1sICkge1xuXHRcdFx0Ly8gRml4IG5hbWUgYW5kIGF0dGFjaCBob29rc1xuXHRcdFx0bmFtZSA9IGpRdWVyeS5wcm9wRml4WyBuYW1lIF0gfHwgbmFtZTtcblx0XHRcdGhvb2tzID0galF1ZXJ5LnByb3BIb29rc1sgbmFtZSBdO1xuXHRcdH1cblxuXHRcdGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiBob29rcyAmJiBcInNldFwiIGluIGhvb2tzICYmIChyZXQgPSBob29rcy5zZXQoIGVsZW0sIHZhbHVlLCBuYW1lICkpICE9PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRyZXQgOlxuXHRcdFx0XHQoIGVsZW1bIG5hbWUgXSA9IHZhbHVlICk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGhvb2tzICYmIFwiZ2V0XCIgaW4gaG9va3MgJiYgKHJldCA9IGhvb2tzLmdldCggZWxlbSwgbmFtZSApKSAhPT0gbnVsbCA/XG5cdFx0XHRcdHJldCA6XG5cdFx0XHRcdGVsZW1bIG5hbWUgXTtcblx0XHR9XG5cdH0sXG5cblx0cHJvcEhvb2tzOiB7XG5cdFx0dGFiSW5kZXg6IHtcblx0XHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLmhhc0F0dHJpYnV0ZSggXCJ0YWJpbmRleFwiICkgfHwgcmZvY3VzYWJsZS50ZXN0KCBlbGVtLm5vZGVOYW1lICkgfHwgZWxlbS5ocmVmID9cblx0XHRcdFx0XHRlbGVtLnRhYkluZGV4IDpcblx0XHRcdFx0XHQtMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pO1xuXG4vLyBIb29rcyBmb3IgYm9vbGVhbiBhdHRyaWJ1dGVzXG5ib29sSG9vayA9IHtcblx0c2V0OiBmdW5jdGlvbiggZWxlbSwgdmFsdWUsIG5hbWUgKSB7XG5cdFx0aWYgKCB2YWx1ZSA9PT0gZmFsc2UgKSB7XG5cdFx0XHQvLyBSZW1vdmUgYm9vbGVhbiBhdHRyaWJ1dGVzIHdoZW4gc2V0IHRvIGZhbHNlXG5cdFx0XHRqUXVlcnkucmVtb3ZlQXR0ciggZWxlbSwgbmFtZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSggbmFtZSwgbmFtZSApO1xuXHRcdH1cblx0XHRyZXR1cm4gbmFtZTtcblx0fVxufTtcbmpRdWVyeS5lYWNoKCBqUXVlcnkuZXhwci5tYXRjaC5ib29sLnNvdXJjZS5tYXRjaCggL1xcdysvZyApLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblx0dmFyIGdldHRlciA9IGpRdWVyeS5leHByLmF0dHJIYW5kbGVbIG5hbWUgXSB8fCBqUXVlcnkuZmluZC5hdHRyO1xuXG5cdGpRdWVyeS5leHByLmF0dHJIYW5kbGVbIG5hbWUgXSA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBpc1hNTCApIHtcblx0XHR2YXIgZm4gPSBqUXVlcnkuZXhwci5hdHRySGFuZGxlWyBuYW1lIF0sXG5cdFx0XHRyZXQgPSBpc1hNTCA/XG5cdFx0XHRcdHVuZGVmaW5lZCA6XG5cdFx0XHRcdC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG5cdFx0XHRcdC8vIFRlbXBvcmFyaWx5IGRpc2FibGUgdGhpcyBoYW5kbGVyIHRvIGNoZWNrIGV4aXN0ZW5jZVxuXHRcdFx0XHQoalF1ZXJ5LmV4cHIuYXR0ckhhbmRsZVsgbmFtZSBdID0gdW5kZWZpbmVkKSAhPVxuXHRcdFx0XHRcdGdldHRlciggZWxlbSwgbmFtZSwgaXNYTUwgKSA/XG5cblx0XHRcdFx0XHRuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0XHRcdG51bGw7XG5cblx0XHQvLyBSZXN0b3JlIGhhbmRsZXJcblx0XHRqUXVlcnkuZXhwci5hdHRySGFuZGxlWyBuYW1lIF0gPSBmbjtcblxuXHRcdHJldHVybiByZXQ7XG5cdH07XG59KTtcblxuLy8gU3VwcG9ydDogSUU5K1xuLy8gU2VsZWN0ZWRuZXNzIGZvciBhbiBvcHRpb24gaW4gYW4gb3B0Z3JvdXAgY2FuIGJlIGluYWNjdXJhdGVcbmlmICggIWpRdWVyeS5zdXBwb3J0Lm9wdFNlbGVjdGVkICkge1xuXHRqUXVlcnkucHJvcEhvb2tzLnNlbGVjdGVkID0ge1xuXHRcdGdldDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgcGFyZW50ID0gZWxlbS5wYXJlbnROb2RlO1xuXHRcdFx0aWYgKCBwYXJlbnQgJiYgcGFyZW50LnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdHBhcmVudC5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH07XG59XG5cbmpRdWVyeS5lYWNoKFtcblx0XCJ0YWJJbmRleFwiLFxuXHRcInJlYWRPbmx5XCIsXG5cdFwibWF4TGVuZ3RoXCIsXG5cdFwiY2VsbFNwYWNpbmdcIixcblx0XCJjZWxsUGFkZGluZ1wiLFxuXHRcInJvd1NwYW5cIixcblx0XCJjb2xTcGFuXCIsXG5cdFwidXNlTWFwXCIsXG5cdFwiZnJhbWVCb3JkZXJcIixcblx0XCJjb250ZW50RWRpdGFibGVcIlxuXSwgZnVuY3Rpb24oKSB7XG5cdGpRdWVyeS5wcm9wRml4WyB0aGlzLnRvTG93ZXJDYXNlKCkgXSA9IHRoaXM7XG59KTtcblxuLy8gUmFkaW9zIGFuZCBjaGVja2JveGVzIGdldHRlci9zZXR0ZXJcbmpRdWVyeS5lYWNoKFsgXCJyYWRpb1wiLCBcImNoZWNrYm94XCIgXSwgZnVuY3Rpb24oKSB7XG5cdGpRdWVyeS52YWxIb29rc1sgdGhpcyBdID0ge1xuXHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlICkge1xuXHRcdFx0aWYgKCBqUXVlcnkuaXNBcnJheSggdmFsdWUgKSApIHtcblx0XHRcdFx0cmV0dXJuICggZWxlbS5jaGVja2VkID0galF1ZXJ5LmluQXJyYXkoIGpRdWVyeShlbGVtKS52YWwoKSwgdmFsdWUgKSA+PSAwICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRpZiAoICFqUXVlcnkuc3VwcG9ydC5jaGVja09uICkge1xuXHRcdGpRdWVyeS52YWxIb29rc1sgdGhpcyBdLmdldCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0Ly8gU3VwcG9ydDogV2Via2l0XG5cdFx0XHQvLyBcIlwiIGlzIHJldHVybmVkIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgdmFsdWUgaXNuJ3Qgc3BlY2lmaWVkXG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSA9PT0gbnVsbCA/IFwib25cIiA6IGVsZW0udmFsdWU7XG5cdFx0fTtcblx0fVxufSk7XG52YXIgcmtleUV2ZW50ID0gL15rZXkvLFxuXHRybW91c2VFdmVudCA9IC9eKD86bW91c2V8Y29udGV4dG1lbnUpfGNsaWNrLyxcblx0cmZvY3VzTW9ycGggPSAvXig/OmZvY3VzaW5mb2N1c3xmb2N1c291dGJsdXIpJC8sXG5cdHJ0eXBlbmFtZXNwYWNlID0gL14oW14uXSopKD86XFwuKC4rKXwpJC87XG5cbmZ1bmN0aW9uIHJldHVyblRydWUoKSB7XG5cdHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZXR1cm5GYWxzZSgpIHtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzYWZlQWN0aXZlRWxlbWVudCgpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0fSBjYXRjaCAoIGVyciApIHsgfVxufVxuXG4vKlxuICogSGVscGVyIGZ1bmN0aW9ucyBmb3IgbWFuYWdpbmcgZXZlbnRzIC0tIG5vdCBwYXJ0IG9mIHRoZSBwdWJsaWMgaW50ZXJmYWNlLlxuICogUHJvcHMgdG8gRGVhbiBFZHdhcmRzJyBhZGRFdmVudCBsaWJyYXJ5IGZvciBtYW55IG9mIHRoZSBpZGVhcy5cbiAqL1xualF1ZXJ5LmV2ZW50ID0ge1xuXG5cdGdsb2JhbDoge30sXG5cblx0YWRkOiBmdW5jdGlvbiggZWxlbSwgdHlwZXMsIGhhbmRsZXIsIGRhdGEsIHNlbGVjdG9yICkge1xuXG5cdFx0dmFyIGhhbmRsZU9iakluLCBldmVudEhhbmRsZSwgdG1wLFxuXHRcdFx0ZXZlbnRzLCB0LCBoYW5kbGVPYmosXG5cdFx0XHRzcGVjaWFsLCBoYW5kbGVycywgdHlwZSwgbmFtZXNwYWNlcywgb3JpZ1R5cGUsXG5cdFx0XHRlbGVtRGF0YSA9IGRhdGFfcHJpdi5nZXQoIGVsZW0gKTtcblxuXHRcdC8vIERvbid0IGF0dGFjaCBldmVudHMgdG8gbm9EYXRhIG9yIHRleHQvY29tbWVudCBub2RlcyAoYnV0IGFsbG93IHBsYWluIG9iamVjdHMpXG5cdFx0aWYgKCAhZWxlbURhdGEgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsbGVyIGNhbiBwYXNzIGluIGFuIG9iamVjdCBvZiBjdXN0b20gZGF0YSBpbiBsaWV1IG9mIHRoZSBoYW5kbGVyXG5cdFx0aWYgKCBoYW5kbGVyLmhhbmRsZXIgKSB7XG5cdFx0XHRoYW5kbGVPYmpJbiA9IGhhbmRsZXI7XG5cdFx0XHRoYW5kbGVyID0gaGFuZGxlT2JqSW4uaGFuZGxlcjtcblx0XHRcdHNlbGVjdG9yID0gaGFuZGxlT2JqSW4uc2VsZWN0b3I7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIHRoYXQgdGhlIGhhbmRsZXIgaGFzIGEgdW5pcXVlIElELCB1c2VkIHRvIGZpbmQvcmVtb3ZlIGl0IGxhdGVyXG5cdFx0aWYgKCAhaGFuZGxlci5ndWlkICkge1xuXHRcdFx0aGFuZGxlci5ndWlkID0galF1ZXJ5Lmd1aWQrKztcblx0XHR9XG5cblx0XHQvLyBJbml0IHRoZSBlbGVtZW50J3MgZXZlbnQgc3RydWN0dXJlIGFuZCBtYWluIGhhbmRsZXIsIGlmIHRoaXMgaXMgdGhlIGZpcnN0XG5cdFx0aWYgKCAhKGV2ZW50cyA9IGVsZW1EYXRhLmV2ZW50cykgKSB7XG5cdFx0XHRldmVudHMgPSBlbGVtRGF0YS5ldmVudHMgPSB7fTtcblx0XHR9XG5cdFx0aWYgKCAhKGV2ZW50SGFuZGxlID0gZWxlbURhdGEuaGFuZGxlKSApIHtcblx0XHRcdGV2ZW50SGFuZGxlID0gZWxlbURhdGEuaGFuZGxlID0gZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdC8vIERpc2NhcmQgdGhlIHNlY29uZCBldmVudCBvZiBhIGpRdWVyeS5ldmVudC50cmlnZ2VyKCkgYW5kXG5cdFx0XHRcdC8vIHdoZW4gYW4gZXZlbnQgaXMgY2FsbGVkIGFmdGVyIGEgcGFnZSBoYXMgdW5sb2FkZWRcblx0XHRcdFx0cmV0dXJuIHR5cGVvZiBqUXVlcnkgIT09IGNvcmVfc3RydW5kZWZpbmVkICYmICghZSB8fCBqUXVlcnkuZXZlbnQudHJpZ2dlcmVkICE9PSBlLnR5cGUpID9cblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQuZGlzcGF0Y2guYXBwbHkoIGV2ZW50SGFuZGxlLmVsZW0sIGFyZ3VtZW50cyApIDpcblx0XHRcdFx0XHR1bmRlZmluZWQ7XG5cdFx0XHR9O1xuXHRcdFx0Ly8gQWRkIGVsZW0gYXMgYSBwcm9wZXJ0eSBvZiB0aGUgaGFuZGxlIGZuIHRvIHByZXZlbnQgYSBtZW1vcnkgbGVhayB3aXRoIElFIG5vbi1uYXRpdmUgZXZlbnRzXG5cdFx0XHRldmVudEhhbmRsZS5lbGVtID0gZWxlbTtcblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgbXVsdGlwbGUgZXZlbnRzIHNlcGFyYXRlZCBieSBhIHNwYWNlXG5cdFx0dHlwZXMgPSAoIHR5cGVzIHx8IFwiXCIgKS5tYXRjaCggY29yZV9ybm90d2hpdGUgKSB8fCBbXCJcIl07XG5cdFx0dCA9IHR5cGVzLmxlbmd0aDtcblx0XHR3aGlsZSAoIHQtLSApIHtcblx0XHRcdHRtcCA9IHJ0eXBlbmFtZXNwYWNlLmV4ZWMoIHR5cGVzW3RdICkgfHwgW107XG5cdFx0XHR0eXBlID0gb3JpZ1R5cGUgPSB0bXBbMV07XG5cdFx0XHRuYW1lc3BhY2VzID0gKCB0bXBbMl0gfHwgXCJcIiApLnNwbGl0KCBcIi5cIiApLnNvcnQoKTtcblxuXHRcdFx0Ly8gVGhlcmUgKm11c3QqIGJlIGEgdHlwZSwgbm8gYXR0YWNoaW5nIG5hbWVzcGFjZS1vbmx5IGhhbmRsZXJzXG5cdFx0XHRpZiAoICF0eXBlICkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgZXZlbnQgY2hhbmdlcyBpdHMgdHlwZSwgdXNlIHRoZSBzcGVjaWFsIGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgY2hhbmdlZCB0eXBlXG5cdFx0XHRzcGVjaWFsID0galF1ZXJ5LmV2ZW50LnNwZWNpYWxbIHR5cGUgXSB8fCB7fTtcblxuXHRcdFx0Ly8gSWYgc2VsZWN0b3IgZGVmaW5lZCwgZGV0ZXJtaW5lIHNwZWNpYWwgZXZlbnQgYXBpIHR5cGUsIG90aGVyd2lzZSBnaXZlbiB0eXBlXG5cdFx0XHR0eXBlID0gKCBzZWxlY3RvciA/IHNwZWNpYWwuZGVsZWdhdGVUeXBlIDogc3BlY2lhbC5iaW5kVHlwZSApIHx8IHR5cGU7XG5cblx0XHRcdC8vIFVwZGF0ZSBzcGVjaWFsIGJhc2VkIG9uIG5ld2x5IHJlc2V0IHR5cGVcblx0XHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXG5cdFx0XHQvLyBoYW5kbGVPYmogaXMgcGFzc2VkIHRvIGFsbCBldmVudCBoYW5kbGVyc1xuXHRcdFx0aGFuZGxlT2JqID0galF1ZXJ5LmV4dGVuZCh7XG5cdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdG9yaWdUeXBlOiBvcmlnVHlwZSxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0aGFuZGxlcjogaGFuZGxlcixcblx0XHRcdFx0Z3VpZDogaGFuZGxlci5ndWlkLFxuXHRcdFx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0XHRcdG5lZWRzQ29udGV4dDogc2VsZWN0b3IgJiYgalF1ZXJ5LmV4cHIubWF0Y2gubmVlZHNDb250ZXh0LnRlc3QoIHNlbGVjdG9yICksXG5cdFx0XHRcdG5hbWVzcGFjZTogbmFtZXNwYWNlcy5qb2luKFwiLlwiKVxuXHRcdFx0fSwgaGFuZGxlT2JqSW4gKTtcblxuXHRcdFx0Ly8gSW5pdCB0aGUgZXZlbnQgaGFuZGxlciBxdWV1ZSBpZiB3ZSdyZSB0aGUgZmlyc3Rcblx0XHRcdGlmICggIShoYW5kbGVycyA9IGV2ZW50c1sgdHlwZSBdKSApIHtcblx0XHRcdFx0aGFuZGxlcnMgPSBldmVudHNbIHR5cGUgXSA9IFtdO1xuXHRcdFx0XHRoYW5kbGVycy5kZWxlZ2F0ZUNvdW50ID0gMDtcblxuXHRcdFx0XHQvLyBPbmx5IHVzZSBhZGRFdmVudExpc3RlbmVyIGlmIHRoZSBzcGVjaWFsIGV2ZW50cyBoYW5kbGVyIHJldHVybnMgZmFsc2Vcblx0XHRcdFx0aWYgKCAhc3BlY2lhbC5zZXR1cCB8fCBzcGVjaWFsLnNldHVwLmNhbGwoIGVsZW0sIGRhdGEsIG5hbWVzcGFjZXMsIGV2ZW50SGFuZGxlICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdFx0XHRcdFx0ZWxlbS5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBldmVudEhhbmRsZSwgZmFsc2UgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzcGVjaWFsLmFkZCApIHtcblx0XHRcdFx0c3BlY2lhbC5hZGQuY2FsbCggZWxlbSwgaGFuZGxlT2JqICk7XG5cblx0XHRcdFx0aWYgKCAhaGFuZGxlT2JqLmhhbmRsZXIuZ3VpZCApIHtcblx0XHRcdFx0XHRoYW5kbGVPYmouaGFuZGxlci5ndWlkID0gaGFuZGxlci5ndWlkO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCB0byB0aGUgZWxlbWVudCdzIGhhbmRsZXIgbGlzdCwgZGVsZWdhdGVzIGluIGZyb250XG5cdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRoYW5kbGVycy5zcGxpY2UoIGhhbmRsZXJzLmRlbGVnYXRlQ291bnQrKywgMCwgaGFuZGxlT2JqICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoYW5kbGVycy5wdXNoKCBoYW5kbGVPYmogKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gS2VlcCB0cmFjayBvZiB3aGljaCBldmVudHMgaGF2ZSBldmVyIGJlZW4gdXNlZCwgZm9yIGV2ZW50IG9wdGltaXphdGlvblxuXHRcdFx0alF1ZXJ5LmV2ZW50Lmdsb2JhbFsgdHlwZSBdID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBOdWxsaWZ5IGVsZW0gdG8gcHJldmVudCBtZW1vcnkgbGVha3MgaW4gSUVcblx0XHRlbGVtID0gbnVsbDtcblx0fSxcblxuXHQvLyBEZXRhY2ggYW4gZXZlbnQgb3Igc2V0IG9mIGV2ZW50cyBmcm9tIGFuIGVsZW1lbnRcblx0cmVtb3ZlOiBmdW5jdGlvbiggZWxlbSwgdHlwZXMsIGhhbmRsZXIsIHNlbGVjdG9yLCBtYXBwZWRUeXBlcyApIHtcblxuXHRcdHZhciBqLCBvcmlnQ291bnQsIHRtcCxcblx0XHRcdGV2ZW50cywgdCwgaGFuZGxlT2JqLFxuXHRcdFx0c3BlY2lhbCwgaGFuZGxlcnMsIHR5cGUsIG5hbWVzcGFjZXMsIG9yaWdUeXBlLFxuXHRcdFx0ZWxlbURhdGEgPSBkYXRhX3ByaXYuaGFzRGF0YSggZWxlbSApICYmIGRhdGFfcHJpdi5nZXQoIGVsZW0gKTtcblxuXHRcdGlmICggIWVsZW1EYXRhIHx8ICEoZXZlbnRzID0gZWxlbURhdGEuZXZlbnRzKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBPbmNlIGZvciBlYWNoIHR5cGUubmFtZXNwYWNlIGluIHR5cGVzOyB0eXBlIG1heSBiZSBvbWl0dGVkXG5cdFx0dHlwZXMgPSAoIHR5cGVzIHx8IFwiXCIgKS5tYXRjaCggY29yZV9ybm90d2hpdGUgKSB8fCBbXCJcIl07XG5cdFx0dCA9IHR5cGVzLmxlbmd0aDtcblx0XHR3aGlsZSAoIHQtLSApIHtcblx0XHRcdHRtcCA9IHJ0eXBlbmFtZXNwYWNlLmV4ZWMoIHR5cGVzW3RdICkgfHwgW107XG5cdFx0XHR0eXBlID0gb3JpZ1R5cGUgPSB0bXBbMV07XG5cdFx0XHRuYW1lc3BhY2VzID0gKCB0bXBbMl0gfHwgXCJcIiApLnNwbGl0KCBcIi5cIiApLnNvcnQoKTtcblxuXHRcdFx0Ly8gVW5iaW5kIGFsbCBldmVudHMgKG9uIHRoaXMgbmFtZXNwYWNlLCBpZiBwcm92aWRlZCkgZm9yIHRoZSBlbGVtZW50XG5cdFx0XHRpZiAoICF0eXBlICkge1xuXHRcdFx0XHRmb3IgKCB0eXBlIGluIGV2ZW50cyApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCBlbGVtLCB0eXBlICsgdHlwZXNbIHQgXSwgaGFuZGxlciwgc2VsZWN0b3IsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsWyB0eXBlIF0gfHwge307XG5cdFx0XHR0eXBlID0gKCBzZWxlY3RvciA/IHNwZWNpYWwuZGVsZWdhdGVUeXBlIDogc3BlY2lhbC5iaW5kVHlwZSApIHx8IHR5cGU7XG5cdFx0XHRoYW5kbGVycyA9IGV2ZW50c1sgdHlwZSBdIHx8IFtdO1xuXHRcdFx0dG1wID0gdG1wWzJdICYmIG5ldyBSZWdFeHAoIFwiKF58XFxcXC4pXCIgKyBuYW1lc3BhY2VzLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKSArIFwiKFxcXFwufCQpXCIgKTtcblxuXHRcdFx0Ly8gUmVtb3ZlIG1hdGNoaW5nIGV2ZW50c1xuXHRcdFx0b3JpZ0NvdW50ID0gaiA9IGhhbmRsZXJzLmxlbmd0aDtcblx0XHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0XHRoYW5kbGVPYmogPSBoYW5kbGVyc1sgaiBdO1xuXG5cdFx0XHRcdGlmICggKCBtYXBwZWRUeXBlcyB8fCBvcmlnVHlwZSA9PT0gaGFuZGxlT2JqLm9yaWdUeXBlICkgJiZcblx0XHRcdFx0XHQoICFoYW5kbGVyIHx8IGhhbmRsZXIuZ3VpZCA9PT0gaGFuZGxlT2JqLmd1aWQgKSAmJlxuXHRcdFx0XHRcdCggIXRtcCB8fCB0bXAudGVzdCggaGFuZGxlT2JqLm5hbWVzcGFjZSApICkgJiZcblx0XHRcdFx0XHQoICFzZWxlY3RvciB8fCBzZWxlY3RvciA9PT0gaGFuZGxlT2JqLnNlbGVjdG9yIHx8IHNlbGVjdG9yID09PSBcIioqXCIgJiYgaGFuZGxlT2JqLnNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aGFuZGxlcnMuc3BsaWNlKCBqLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIGhhbmRsZU9iai5zZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdGhhbmRsZXJzLmRlbGVnYXRlQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBzcGVjaWFsLnJlbW92ZSApIHtcblx0XHRcdFx0XHRcdHNwZWNpYWwucmVtb3ZlLmNhbGwoIGVsZW0sIGhhbmRsZU9iaiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZW1vdmUgZ2VuZXJpYyBldmVudCBoYW5kbGVyIGlmIHdlIHJlbW92ZWQgc29tZXRoaW5nIGFuZCBubyBtb3JlIGhhbmRsZXJzIGV4aXN0XG5cdFx0XHQvLyAoYXZvaWRzIHBvdGVudGlhbCBmb3IgZW5kbGVzcyByZWN1cnNpb24gZHVyaW5nIHJlbW92YWwgb2Ygc3BlY2lhbCBldmVudCBoYW5kbGVycylcblx0XHRcdGlmICggb3JpZ0NvdW50ICYmICFoYW5kbGVycy5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggIXNwZWNpYWwudGVhcmRvd24gfHwgc3BlY2lhbC50ZWFyZG93bi5jYWxsKCBlbGVtLCBuYW1lc3BhY2VzLCBlbGVtRGF0YS5oYW5kbGUgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5LnJlbW92ZUV2ZW50KCBlbGVtLCB0eXBlLCBlbGVtRGF0YS5oYW5kbGUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRlbGV0ZSBldmVudHNbIHR5cGUgXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgdGhlIGV4cGFuZG8gaWYgaXQncyBubyBsb25nZXIgdXNlZFxuXHRcdGlmICggalF1ZXJ5LmlzRW1wdHlPYmplY3QoIGV2ZW50cyApICkge1xuXHRcdFx0ZGVsZXRlIGVsZW1EYXRhLmhhbmRsZTtcblx0XHRcdGRhdGFfcHJpdi5yZW1vdmUoIGVsZW0sIFwiZXZlbnRzXCIgKTtcblx0XHR9XG5cdH0sXG5cblx0dHJpZ2dlcjogZnVuY3Rpb24oIGV2ZW50LCBkYXRhLCBlbGVtLCBvbmx5SGFuZGxlcnMgKSB7XG5cblx0XHR2YXIgaSwgY3VyLCB0bXAsIGJ1YmJsZVR5cGUsIG9udHlwZSwgaGFuZGxlLCBzcGVjaWFsLFxuXHRcdFx0ZXZlbnRQYXRoID0gWyBlbGVtIHx8IGRvY3VtZW50IF0sXG5cdFx0XHR0eXBlID0gY29yZV9oYXNPd24uY2FsbCggZXZlbnQsIFwidHlwZVwiICkgPyBldmVudC50eXBlIDogZXZlbnQsXG5cdFx0XHRuYW1lc3BhY2VzID0gY29yZV9oYXNPd24uY2FsbCggZXZlbnQsIFwibmFtZXNwYWNlXCIgKSA/IGV2ZW50Lm5hbWVzcGFjZS5zcGxpdChcIi5cIikgOiBbXTtcblxuXHRcdGN1ciA9IHRtcCA9IGVsZW0gPSBlbGVtIHx8IGRvY3VtZW50O1xuXG5cdFx0Ly8gRG9uJ3QgZG8gZXZlbnRzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcblx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBmb2N1cy9ibHVyIG1vcnBocyB0byBmb2N1c2luL291dDsgZW5zdXJlIHdlJ3JlIG5vdCBmaXJpbmcgdGhlbSByaWdodCBub3dcblx0XHRpZiAoIHJmb2N1c01vcnBoLnRlc3QoIHR5cGUgKyBqUXVlcnkuZXZlbnQudHJpZ2dlcmVkICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlLmluZGV4T2YoXCIuXCIpID49IDAgKSB7XG5cdFx0XHQvLyBOYW1lc3BhY2VkIHRyaWdnZXI7IGNyZWF0ZSBhIHJlZ2V4cCB0byBtYXRjaCBldmVudCB0eXBlIGluIGhhbmRsZSgpXG5cdFx0XHRuYW1lc3BhY2VzID0gdHlwZS5zcGxpdChcIi5cIik7XG5cdFx0XHR0eXBlID0gbmFtZXNwYWNlcy5zaGlmdCgpO1xuXHRcdFx0bmFtZXNwYWNlcy5zb3J0KCk7XG5cdFx0fVxuXHRcdG9udHlwZSA9IHR5cGUuaW5kZXhPZihcIjpcIikgPCAwICYmIFwib25cIiArIHR5cGU7XG5cblx0XHQvLyBDYWxsZXIgY2FuIHBhc3MgaW4gYSBqUXVlcnkuRXZlbnQgb2JqZWN0LCBPYmplY3QsIG9yIGp1c3QgYW4gZXZlbnQgdHlwZSBzdHJpbmdcblx0XHRldmVudCA9IGV2ZW50WyBqUXVlcnkuZXhwYW5kbyBdID9cblx0XHRcdGV2ZW50IDpcblx0XHRcdG5ldyBqUXVlcnkuRXZlbnQoIHR5cGUsIHR5cGVvZiBldmVudCA9PT0gXCJvYmplY3RcIiAmJiBldmVudCApO1xuXG5cdFx0Ly8gVHJpZ2dlciBiaXRtYXNrOiAmIDEgZm9yIG5hdGl2ZSBoYW5kbGVyczsgJiAyIGZvciBqUXVlcnkgKGFsd2F5cyB0cnVlKVxuXHRcdGV2ZW50LmlzVHJpZ2dlciA9IG9ubHlIYW5kbGVycyA/IDIgOiAzO1xuXHRcdGV2ZW50Lm5hbWVzcGFjZSA9IG5hbWVzcGFjZXMuam9pbihcIi5cIik7XG5cdFx0ZXZlbnQubmFtZXNwYWNlX3JlID0gZXZlbnQubmFtZXNwYWNlID9cblx0XHRcdG5ldyBSZWdFeHAoIFwiKF58XFxcXC4pXCIgKyBuYW1lc3BhY2VzLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKSArIFwiKFxcXFwufCQpXCIgKSA6XG5cdFx0XHRudWxsO1xuXG5cdFx0Ly8gQ2xlYW4gdXAgdGhlIGV2ZW50IGluIGNhc2UgaXQgaXMgYmVpbmcgcmV1c2VkXG5cdFx0ZXZlbnQucmVzdWx0ID0gdW5kZWZpbmVkO1xuXHRcdGlmICggIWV2ZW50LnRhcmdldCApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IGVsZW07XG5cdFx0fVxuXG5cdFx0Ly8gQ2xvbmUgYW55IGluY29taW5nIGRhdGEgYW5kIHByZXBlbmQgdGhlIGV2ZW50LCBjcmVhdGluZyB0aGUgaGFuZGxlciBhcmcgbGlzdFxuXHRcdGRhdGEgPSBkYXRhID09IG51bGwgP1xuXHRcdFx0WyBldmVudCBdIDpcblx0XHRcdGpRdWVyeS5tYWtlQXJyYXkoIGRhdGEsIFsgZXZlbnQgXSApO1xuXG5cdFx0Ly8gQWxsb3cgc3BlY2lhbCBldmVudHMgdG8gZHJhdyBvdXRzaWRlIHRoZSBsaW5lc1xuXHRcdHNwZWNpYWwgPSBqUXVlcnkuZXZlbnQuc3BlY2lhbFsgdHlwZSBdIHx8IHt9O1xuXHRcdGlmICggIW9ubHlIYW5kbGVycyAmJiBzcGVjaWFsLnRyaWdnZXIgJiYgc3BlY2lhbC50cmlnZ2VyLmFwcGx5KCBlbGVtLCBkYXRhICkgPT09IGZhbHNlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSBldmVudCBwcm9wYWdhdGlvbiBwYXRoIGluIGFkdmFuY2UsIHBlciBXM0MgZXZlbnRzIHNwZWMgKCM5OTUxKVxuXHRcdC8vIEJ1YmJsZSB1cCB0byBkb2N1bWVudCwgdGhlbiB0byB3aW5kb3c7IHdhdGNoIGZvciBhIGdsb2JhbCBvd25lckRvY3VtZW50IHZhciAoIzk3MjQpXG5cdFx0aWYgKCAhb25seUhhbmRsZXJzICYmICFzcGVjaWFsLm5vQnViYmxlICYmICFqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSApIHtcblxuXHRcdFx0YnViYmxlVHlwZSA9IHNwZWNpYWwuZGVsZWdhdGVUeXBlIHx8IHR5cGU7XG5cdFx0XHRpZiAoICFyZm9jdXNNb3JwaC50ZXN0KCBidWJibGVUeXBlICsgdHlwZSApICkge1xuXHRcdFx0XHRjdXIgPSBjdXIucGFyZW50Tm9kZTtcblx0XHRcdH1cblx0XHRcdGZvciAoIDsgY3VyOyBjdXIgPSBjdXIucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0ZXZlbnRQYXRoLnB1c2goIGN1ciApO1xuXHRcdFx0XHR0bXAgPSBjdXI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE9ubHkgYWRkIHdpbmRvdyBpZiB3ZSBnb3QgdG8gZG9jdW1lbnQgKGUuZy4sIG5vdCBwbGFpbiBvYmogb3IgZGV0YWNoZWQgRE9NKVxuXHRcdFx0aWYgKCB0bXAgPT09IChlbGVtLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQpICkge1xuXHRcdFx0XHRldmVudFBhdGgucHVzaCggdG1wLmRlZmF1bHRWaWV3IHx8IHRtcC5wYXJlbnRXaW5kb3cgfHwgd2luZG93ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmlyZSBoYW5kbGVycyBvbiB0aGUgZXZlbnQgcGF0aFxuXHRcdGkgPSAwO1xuXHRcdHdoaWxlICggKGN1ciA9IGV2ZW50UGF0aFtpKytdKSAmJiAhZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSApIHtcblxuXHRcdFx0ZXZlbnQudHlwZSA9IGkgPiAxID9cblx0XHRcdFx0YnViYmxlVHlwZSA6XG5cdFx0XHRcdHNwZWNpYWwuYmluZFR5cGUgfHwgdHlwZTtcblxuXHRcdFx0Ly8galF1ZXJ5IGhhbmRsZXJcblx0XHRcdGhhbmRsZSA9ICggZGF0YV9wcml2LmdldCggY3VyLCBcImV2ZW50c1wiICkgfHwge30gKVsgZXZlbnQudHlwZSBdICYmIGRhdGFfcHJpdi5nZXQoIGN1ciwgXCJoYW5kbGVcIiApO1xuXHRcdFx0aWYgKCBoYW5kbGUgKSB7XG5cdFx0XHRcdGhhbmRsZS5hcHBseSggY3VyLCBkYXRhICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE5hdGl2ZSBoYW5kbGVyXG5cdFx0XHRoYW5kbGUgPSBvbnR5cGUgJiYgY3VyWyBvbnR5cGUgXTtcblx0XHRcdGlmICggaGFuZGxlICYmIGpRdWVyeS5hY2NlcHREYXRhKCBjdXIgKSAmJiBoYW5kbGUuYXBwbHkgJiYgaGFuZGxlLmFwcGx5KCBjdXIsIGRhdGEgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGV2ZW50LnR5cGUgPSB0eXBlO1xuXG5cdFx0Ly8gSWYgbm9ib2R5IHByZXZlbnRlZCB0aGUgZGVmYXVsdCBhY3Rpb24sIGRvIGl0IG5vd1xuXHRcdGlmICggIW9ubHlIYW5kbGVycyAmJiAhZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgKSB7XG5cblx0XHRcdGlmICggKCFzcGVjaWFsLl9kZWZhdWx0IHx8IHNwZWNpYWwuX2RlZmF1bHQuYXBwbHkoIGV2ZW50UGF0aC5wb3AoKSwgZGF0YSApID09PSBmYWxzZSkgJiZcblx0XHRcdFx0alF1ZXJ5LmFjY2VwdERhdGEoIGVsZW0gKSApIHtcblxuXHRcdFx0XHQvLyBDYWxsIGEgbmF0aXZlIERPTSBtZXRob2Qgb24gdGhlIHRhcmdldCB3aXRoIHRoZSBzYW1lIG5hbWUgbmFtZSBhcyB0aGUgZXZlbnQuXG5cdFx0XHRcdC8vIERvbid0IGRvIGRlZmF1bHQgYWN0aW9ucyBvbiB3aW5kb3csIHRoYXQncyB3aGVyZSBnbG9iYWwgdmFyaWFibGVzIGJlICgjNjE3MClcblx0XHRcdFx0aWYgKCBvbnR5cGUgJiYgalF1ZXJ5LmlzRnVuY3Rpb24oIGVsZW1bIHR5cGUgXSApICYmICFqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSApIHtcblxuXHRcdFx0XHRcdC8vIERvbid0IHJlLXRyaWdnZXIgYW4gb25GT08gZXZlbnQgd2hlbiB3ZSBjYWxsIGl0cyBGT08oKSBtZXRob2Rcblx0XHRcdFx0XHR0bXAgPSBlbGVtWyBvbnR5cGUgXTtcblxuXHRcdFx0XHRcdGlmICggdG1wICkge1xuXHRcdFx0XHRcdFx0ZWxlbVsgb250eXBlIF0gPSBudWxsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFByZXZlbnQgcmUtdHJpZ2dlcmluZyBvZiB0aGUgc2FtZSBldmVudCwgc2luY2Ugd2UgYWxyZWFkeSBidWJibGVkIGl0IGFib3ZlXG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXJlZCA9IHR5cGU7XG5cdFx0XHRcdFx0ZWxlbVsgdHlwZSBdKCk7XG5cdFx0XHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXJlZCA9IHVuZGVmaW5lZDtcblxuXHRcdFx0XHRcdGlmICggdG1wICkge1xuXHRcdFx0XHRcdFx0ZWxlbVsgb250eXBlIF0gPSB0bXA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGV2ZW50LnJlc3VsdDtcblx0fSxcblxuXHRkaXNwYXRjaDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gTWFrZSBhIHdyaXRhYmxlIGpRdWVyeS5FdmVudCBmcm9tIHRoZSBuYXRpdmUgZXZlbnQgb2JqZWN0XG5cdFx0ZXZlbnQgPSBqUXVlcnkuZXZlbnQuZml4KCBldmVudCApO1xuXG5cdFx0dmFyIGksIGosIHJldCwgbWF0Y2hlZCwgaGFuZGxlT2JqLFxuXHRcdFx0aGFuZGxlclF1ZXVlID0gW10sXG5cdFx0XHRhcmdzID0gY29yZV9zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcblx0XHRcdGhhbmRsZXJzID0gKCBkYXRhX3ByaXYuZ2V0KCB0aGlzLCBcImV2ZW50c1wiICkgfHwge30gKVsgZXZlbnQudHlwZSBdIHx8IFtdLFxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsWyBldmVudC50eXBlIF0gfHwge307XG5cblx0XHQvLyBVc2UgdGhlIGZpeC1lZCBqUXVlcnkuRXZlbnQgcmF0aGVyIHRoYW4gdGhlIChyZWFkLW9ubHkpIG5hdGl2ZSBldmVudFxuXHRcdGFyZ3NbMF0gPSBldmVudDtcblx0XHRldmVudC5kZWxlZ2F0ZVRhcmdldCA9IHRoaXM7XG5cblx0XHQvLyBDYWxsIHRoZSBwcmVEaXNwYXRjaCBob29rIGZvciB0aGUgbWFwcGVkIHR5cGUsIGFuZCBsZXQgaXQgYmFpbCBpZiBkZXNpcmVkXG5cdFx0aWYgKCBzcGVjaWFsLnByZURpc3BhdGNoICYmIHNwZWNpYWwucHJlRGlzcGF0Y2guY2FsbCggdGhpcywgZXZlbnQgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIGhhbmRsZXJzXG5cdFx0aGFuZGxlclF1ZXVlID0galF1ZXJ5LmV2ZW50LmhhbmRsZXJzLmNhbGwoIHRoaXMsIGV2ZW50LCBoYW5kbGVycyApO1xuXG5cdFx0Ly8gUnVuIGRlbGVnYXRlcyBmaXJzdDsgdGhleSBtYXkgd2FudCB0byBzdG9wIHByb3BhZ2F0aW9uIGJlbmVhdGggdXNcblx0XHRpID0gMDtcblx0XHR3aGlsZSAoIChtYXRjaGVkID0gaGFuZGxlclF1ZXVlWyBpKysgXSkgJiYgIWV2ZW50LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkgKSB7XG5cdFx0XHRldmVudC5jdXJyZW50VGFyZ2V0ID0gbWF0Y2hlZC5lbGVtO1xuXG5cdFx0XHRqID0gMDtcblx0XHRcdHdoaWxlICggKGhhbmRsZU9iaiA9IG1hdGNoZWQuaGFuZGxlcnNbIGorKyBdKSAmJiAhZXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKSApIHtcblxuXHRcdFx0XHQvLyBUcmlnZ2VyZWQgZXZlbnQgbXVzdCBlaXRoZXIgMSkgaGF2ZSBubyBuYW1lc3BhY2UsIG9yXG5cdFx0XHRcdC8vIDIpIGhhdmUgbmFtZXNwYWNlKHMpIGEgc3Vic2V0IG9yIGVxdWFsIHRvIHRob3NlIGluIHRoZSBib3VuZCBldmVudCAoYm90aCBjYW4gaGF2ZSBubyBuYW1lc3BhY2UpLlxuXHRcdFx0XHRpZiAoICFldmVudC5uYW1lc3BhY2VfcmUgfHwgZXZlbnQubmFtZXNwYWNlX3JlLnRlc3QoIGhhbmRsZU9iai5uYW1lc3BhY2UgKSApIHtcblxuXHRcdFx0XHRcdGV2ZW50LmhhbmRsZU9iaiA9IGhhbmRsZU9iajtcblx0XHRcdFx0XHRldmVudC5kYXRhID0gaGFuZGxlT2JqLmRhdGE7XG5cblx0XHRcdFx0XHRyZXQgPSAoIChqUXVlcnkuZXZlbnQuc3BlY2lhbFsgaGFuZGxlT2JqLm9yaWdUeXBlIF0gfHwge30pLmhhbmRsZSB8fCBoYW5kbGVPYmouaGFuZGxlciApXG5cdFx0XHRcdFx0XHRcdC5hcHBseSggbWF0Y2hlZC5lbGVtLCBhcmdzICk7XG5cblx0XHRcdFx0XHRpZiAoIHJldCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoZXZlbnQucmVzdWx0ID0gcmV0KSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhbGwgdGhlIHBvc3REaXNwYXRjaCBob29rIGZvciB0aGUgbWFwcGVkIHR5cGVcblx0XHRpZiAoIHNwZWNpYWwucG9zdERpc3BhdGNoICkge1xuXHRcdFx0c3BlY2lhbC5wb3N0RGlzcGF0Y2guY2FsbCggdGhpcywgZXZlbnQgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZXZlbnQucmVzdWx0O1xuXHR9LFxuXG5cdGhhbmRsZXJzOiBmdW5jdGlvbiggZXZlbnQsIGhhbmRsZXJzICkge1xuXHRcdHZhciBpLCBtYXRjaGVzLCBzZWwsIGhhbmRsZU9iaixcblx0XHRcdGhhbmRsZXJRdWV1ZSA9IFtdLFxuXHRcdFx0ZGVsZWdhdGVDb3VudCA9IGhhbmRsZXJzLmRlbGVnYXRlQ291bnQsXG5cdFx0XHRjdXIgPSBldmVudC50YXJnZXQ7XG5cblx0XHQvLyBGaW5kIGRlbGVnYXRlIGhhbmRsZXJzXG5cdFx0Ly8gQmxhY2staG9sZSBTVkcgPHVzZT4gaW5zdGFuY2UgdHJlZXMgKCMxMzE4MClcblx0XHQvLyBBdm9pZCBub24tbGVmdC1jbGljayBidWJibGluZyBpbiBGaXJlZm94ICgjMzg2MSlcblx0XHRpZiAoIGRlbGVnYXRlQ291bnQgJiYgY3VyLm5vZGVUeXBlICYmICghZXZlbnQuYnV0dG9uIHx8IGV2ZW50LnR5cGUgIT09IFwiY2xpY2tcIikgKSB7XG5cblx0XHRcdGZvciAoIDsgY3VyICE9PSB0aGlzOyBjdXIgPSBjdXIucGFyZW50Tm9kZSB8fCB0aGlzICkge1xuXG5cdFx0XHRcdC8vIERvbid0IHByb2Nlc3MgY2xpY2tzIG9uIGRpc2FibGVkIGVsZW1lbnRzICgjNjkxMSwgIzgxNjUsICMxMTM4MiwgIzExNzY0KVxuXHRcdFx0XHRpZiAoIGN1ci5kaXNhYmxlZCAhPT0gdHJ1ZSB8fCBldmVudC50eXBlICE9PSBcImNsaWNrXCIgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlcyA9IFtdO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgZGVsZWdhdGVDb3VudDsgaSsrICkge1xuXHRcdFx0XHRcdFx0aGFuZGxlT2JqID0gaGFuZGxlcnNbIGkgXTtcblxuXHRcdFx0XHRcdFx0Ly8gRG9uJ3QgY29uZmxpY3Qgd2l0aCBPYmplY3QucHJvdG90eXBlIHByb3BlcnRpZXMgKCMxMzIwMylcblx0XHRcdFx0XHRcdHNlbCA9IGhhbmRsZU9iai5zZWxlY3RvciArIFwiIFwiO1xuXG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXNbIHNlbCBdID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0XHRcdG1hdGNoZXNbIHNlbCBdID0gaGFuZGxlT2JqLm5lZWRzQ29udGV4dCA/XG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5KCBzZWwsIHRoaXMgKS5pbmRleCggY3VyICkgPj0gMCA6XG5cdFx0XHRcdFx0XHRcdFx0alF1ZXJ5LmZpbmQoIHNlbCwgdGhpcywgbnVsbCwgWyBjdXIgXSApLmxlbmd0aDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlc1sgc2VsIF0gKSB7XG5cdFx0XHRcdFx0XHRcdG1hdGNoZXMucHVzaCggaGFuZGxlT2JqICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggbWF0Y2hlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRoYW5kbGVyUXVldWUucHVzaCh7IGVsZW06IGN1ciwgaGFuZGxlcnM6IG1hdGNoZXMgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIHRoZSByZW1haW5pbmcgKGRpcmVjdGx5LWJvdW5kKSBoYW5kbGVyc1xuXHRcdGlmICggZGVsZWdhdGVDb3VudCA8IGhhbmRsZXJzLmxlbmd0aCApIHtcblx0XHRcdGhhbmRsZXJRdWV1ZS5wdXNoKHsgZWxlbTogdGhpcywgaGFuZGxlcnM6IGhhbmRsZXJzLnNsaWNlKCBkZWxlZ2F0ZUNvdW50ICkgfSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhhbmRsZXJRdWV1ZTtcblx0fSxcblxuXHQvLyBJbmNsdWRlcyBzb21lIGV2ZW50IHByb3BzIHNoYXJlZCBieSBLZXlFdmVudCBhbmQgTW91c2VFdmVudFxuXHRwcm9wczogXCJhbHRLZXkgYnViYmxlcyBjYW5jZWxhYmxlIGN0cmxLZXkgY3VycmVudFRhcmdldCBldmVudFBoYXNlIG1ldGFLZXkgcmVsYXRlZFRhcmdldCBzaGlmdEtleSB0YXJnZXQgdGltZVN0YW1wIHZpZXcgd2hpY2hcIi5zcGxpdChcIiBcIiksXG5cblx0Zml4SG9va3M6IHt9LFxuXG5cdGtleUhvb2tzOiB7XG5cdFx0cHJvcHM6IFwiY2hhciBjaGFyQ29kZSBrZXkga2V5Q29kZVwiLnNwbGl0KFwiIFwiKSxcblx0XHRmaWx0ZXI6IGZ1bmN0aW9uKCBldmVudCwgb3JpZ2luYWwgKSB7XG5cblx0XHRcdC8vIEFkZCB3aGljaCBmb3Iga2V5IGV2ZW50c1xuXHRcdFx0aWYgKCBldmVudC53aGljaCA9PSBudWxsICkge1xuXHRcdFx0XHRldmVudC53aGljaCA9IG9yaWdpbmFsLmNoYXJDb2RlICE9IG51bGwgPyBvcmlnaW5hbC5jaGFyQ29kZSA6IG9yaWdpbmFsLmtleUNvZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBldmVudDtcblx0XHR9XG5cdH0sXG5cblx0bW91c2VIb29rczoge1xuXHRcdHByb3BzOiBcImJ1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgc2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudFwiLnNwbGl0KFwiIFwiKSxcblx0XHRmaWx0ZXI6IGZ1bmN0aW9uKCBldmVudCwgb3JpZ2luYWwgKSB7XG5cdFx0XHR2YXIgZXZlbnREb2MsIGRvYywgYm9keSxcblx0XHRcdFx0YnV0dG9uID0gb3JpZ2luYWwuYnV0dG9uO1xuXG5cdFx0XHQvLyBDYWxjdWxhdGUgcGFnZVgvWSBpZiBtaXNzaW5nIGFuZCBjbGllbnRYL1kgYXZhaWxhYmxlXG5cdFx0XHRpZiAoIGV2ZW50LnBhZ2VYID09IG51bGwgJiYgb3JpZ2luYWwuY2xpZW50WCAhPSBudWxsICkge1xuXHRcdFx0XHRldmVudERvYyA9IGV2ZW50LnRhcmdldC5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuXHRcdFx0XHRkb2MgPSBldmVudERvYy5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0XHRcdGJvZHkgPSBldmVudERvYy5ib2R5O1xuXG5cdFx0XHRcdGV2ZW50LnBhZ2VYID0gb3JpZ2luYWwuY2xpZW50WCArICggZG9jICYmIGRvYy5zY3JvbGxMZWZ0IHx8IGJvZHkgJiYgYm9keS5zY3JvbGxMZWZ0IHx8IDAgKSAtICggZG9jICYmIGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkgJiYgYm9keS5jbGllbnRMZWZ0IHx8IDAgKTtcblx0XHRcdFx0ZXZlbnQucGFnZVkgPSBvcmlnaW5hbC5jbGllbnRZICsgKCBkb2MgJiYgZG9jLnNjcm9sbFRvcCAgfHwgYm9keSAmJiBib2R5LnNjcm9sbFRvcCAgfHwgMCApIC0gKCBkb2MgJiYgZG9jLmNsaWVudFRvcCAgfHwgYm9keSAmJiBib2R5LmNsaWVudFRvcCAgfHwgMCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgd2hpY2ggZm9yIGNsaWNrOiAxID09PSBsZWZ0OyAyID09PSBtaWRkbGU7IDMgPT09IHJpZ2h0XG5cdFx0XHQvLyBOb3RlOiBidXR0b24gaXMgbm90IG5vcm1hbGl6ZWQsIHNvIGRvbid0IHVzZSBpdFxuXHRcdFx0aWYgKCAhZXZlbnQud2hpY2ggJiYgYnV0dG9uICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGV2ZW50LndoaWNoID0gKCBidXR0b24gJiAxID8gMSA6ICggYnV0dG9uICYgMiA/IDMgOiAoIGJ1dHRvbiAmIDQgPyAyIDogMCApICkgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGV2ZW50O1xuXHRcdH1cblx0fSxcblxuXHRmaXg6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIGV2ZW50WyBqUXVlcnkuZXhwYW5kbyBdICkge1xuXHRcdFx0cmV0dXJuIGV2ZW50O1xuXHRcdH1cblxuXHRcdC8vIENyZWF0ZSBhIHdyaXRhYmxlIGNvcHkgb2YgdGhlIGV2ZW50IG9iamVjdCBhbmQgbm9ybWFsaXplIHNvbWUgcHJvcGVydGllc1xuXHRcdHZhciBpLCBwcm9wLCBjb3B5LFxuXHRcdFx0dHlwZSA9IGV2ZW50LnR5cGUsXG5cdFx0XHRvcmlnaW5hbEV2ZW50ID0gZXZlbnQsXG5cdFx0XHRmaXhIb29rID0gdGhpcy5maXhIb29rc1sgdHlwZSBdO1xuXG5cdFx0aWYgKCAhZml4SG9vayApIHtcblx0XHRcdHRoaXMuZml4SG9va3NbIHR5cGUgXSA9IGZpeEhvb2sgPVxuXHRcdFx0XHRybW91c2VFdmVudC50ZXN0KCB0eXBlICkgPyB0aGlzLm1vdXNlSG9va3MgOlxuXHRcdFx0XHRya2V5RXZlbnQudGVzdCggdHlwZSApID8gdGhpcy5rZXlIb29rcyA6XG5cdFx0XHRcdHt9O1xuXHRcdH1cblx0XHRjb3B5ID0gZml4SG9vay5wcm9wcyA/IHRoaXMucHJvcHMuY29uY2F0KCBmaXhIb29rLnByb3BzICkgOiB0aGlzLnByb3BzO1xuXG5cdFx0ZXZlbnQgPSBuZXcgalF1ZXJ5LkV2ZW50KCBvcmlnaW5hbEV2ZW50ICk7XG5cblx0XHRpID0gY29weS5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRwcm9wID0gY29weVsgaSBdO1xuXHRcdFx0ZXZlbnRbIHByb3AgXSA9IG9yaWdpbmFsRXZlbnRbIHByb3AgXTtcblx0XHR9XG5cblx0XHQvLyBTdXBwb3J0OiBDb3Jkb3ZhIDIuNSAoV2ViS2l0KSAoIzEzMjU1KVxuXHRcdC8vIEFsbCBldmVudHMgc2hvdWxkIGhhdmUgYSB0YXJnZXQ7IENvcmRvdmEgZGV2aWNlcmVhZHkgZG9lc24ndFxuXHRcdGlmICggIWV2ZW50LnRhcmdldCApIHtcblx0XHRcdGV2ZW50LnRhcmdldCA9IGRvY3VtZW50O1xuXHRcdH1cblxuXHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA2LjArLCBDaHJvbWUgPCAyOFxuXHRcdC8vIFRhcmdldCBzaG91bGQgbm90IGJlIGEgdGV4dCBub2RlICgjNTA0LCAjMTMxNDMpXG5cdFx0aWYgKCBldmVudC50YXJnZXQubm9kZVR5cGUgPT09IDMgKSB7XG5cdFx0XHRldmVudC50YXJnZXQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZml4SG9vay5maWx0ZXI/IGZpeEhvb2suZmlsdGVyKCBldmVudCwgb3JpZ2luYWxFdmVudCApIDogZXZlbnQ7XG5cdH0sXG5cblx0c3BlY2lhbDoge1xuXHRcdGxvYWQ6IHtcblx0XHRcdC8vIFByZXZlbnQgdHJpZ2dlcmVkIGltYWdlLmxvYWQgZXZlbnRzIGZyb20gYnViYmxpbmcgdG8gd2luZG93LmxvYWRcblx0XHRcdG5vQnViYmxlOiB0cnVlXG5cdFx0fSxcblx0XHRmb2N1czoge1xuXHRcdFx0Ly8gRmlyZSBuYXRpdmUgZXZlbnQgaWYgcG9zc2libGUgc28gYmx1ci9mb2N1cyBzZXF1ZW5jZSBpcyBjb3JyZWN0XG5cdFx0XHR0cmlnZ2VyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCB0aGlzICE9PSBzYWZlQWN0aXZlRWxlbWVudCgpICYmIHRoaXMuZm9jdXMgKSB7XG5cdFx0XHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGRlbGVnYXRlVHlwZTogXCJmb2N1c2luXCJcblx0XHR9LFxuXHRcdGJsdXI6IHtcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIHRoaXMgPT09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgdGhpcy5ibHVyICkge1xuXHRcdFx0XHRcdHRoaXMuYmx1cigpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGRlbGVnYXRlVHlwZTogXCJmb2N1c291dFwiXG5cdFx0fSxcblx0XHRjbGljazoge1xuXHRcdFx0Ly8gRm9yIGNoZWNrYm94LCBmaXJlIG5hdGl2ZSBldmVudCBzbyBjaGVja2VkIHN0YXRlIHdpbGwgYmUgcmlnaHRcblx0XHRcdHRyaWdnZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIHRoaXMudHlwZSA9PT0gXCJjaGVja2JveFwiICYmIHRoaXMuY2xpY2sgJiYgalF1ZXJ5Lm5vZGVOYW1lKCB0aGlzLCBcImlucHV0XCIgKSApIHtcblx0XHRcdFx0XHR0aGlzLmNsaWNrKCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBGb3IgY3Jvc3MtYnJvd3NlciBjb25zaXN0ZW5jeSwgZG9uJ3QgZmlyZSBuYXRpdmUgLmNsaWNrKCkgb24gbGlua3Ncblx0XHRcdF9kZWZhdWx0OiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdHJldHVybiBqUXVlcnkubm9kZU5hbWUoIGV2ZW50LnRhcmdldCwgXCJhXCIgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0YmVmb3JldW5sb2FkOiB7XG5cdFx0XHRwb3N0RGlzcGF0Y2g6IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBGaXJlZm94IDIwK1xuXHRcdFx0XHQvLyBGaXJlZm94IGRvZXNuJ3QgYWxlcnQgaWYgdGhlIHJldHVyblZhbHVlIGZpZWxkIGlzIG5vdCBzZXQuXG5cdFx0XHRcdGlmICggZXZlbnQucmVzdWx0ICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQub3JpZ2luYWxFdmVudC5yZXR1cm5WYWx1ZSA9IGV2ZW50LnJlc3VsdDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRzaW11bGF0ZTogZnVuY3Rpb24oIHR5cGUsIGVsZW0sIGV2ZW50LCBidWJibGUgKSB7XG5cdFx0Ly8gUGlnZ3liYWNrIG9uIGEgZG9ub3IgZXZlbnQgdG8gc2ltdWxhdGUgYSBkaWZmZXJlbnQgb25lLlxuXHRcdC8vIEZha2Ugb3JpZ2luYWxFdmVudCB0byBhdm9pZCBkb25vcidzIHN0b3BQcm9wYWdhdGlvbiwgYnV0IGlmIHRoZVxuXHRcdC8vIHNpbXVsYXRlZCBldmVudCBwcmV2ZW50cyBkZWZhdWx0IHRoZW4gd2UgZG8gdGhlIHNhbWUgb24gdGhlIGRvbm9yLlxuXHRcdHZhciBlID0galF1ZXJ5LmV4dGVuZChcblx0XHRcdG5ldyBqUXVlcnkuRXZlbnQoKSxcblx0XHRcdGV2ZW50LFxuXHRcdFx0e1xuXHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRpc1NpbXVsYXRlZDogdHJ1ZSxcblx0XHRcdFx0b3JpZ2luYWxFdmVudDoge31cblx0XHRcdH1cblx0XHQpO1xuXHRcdGlmICggYnViYmxlICkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnRyaWdnZXIoIGUsIG51bGwsIGVsZW0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LmRpc3BhdGNoLmNhbGwoIGVsZW0sIGUgKTtcblx0XHR9XG5cdFx0aWYgKCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH1cbn07XG5cbmpRdWVyeS5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uKCBlbGVtLCB0eXBlLCBoYW5kbGUgKSB7XG5cdGlmICggZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyICkge1xuXHRcdGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgaGFuZGxlLCBmYWxzZSApO1xuXHR9XG59O1xuXG5qUXVlcnkuRXZlbnQgPSBmdW5jdGlvbiggc3JjLCBwcm9wcyApIHtcblx0Ly8gQWxsb3cgaW5zdGFudGlhdGlvbiB3aXRob3V0IHRoZSAnbmV3JyBrZXl3b3JkXG5cdGlmICggISh0aGlzIGluc3RhbmNlb2YgalF1ZXJ5LkV2ZW50KSApIHtcblx0XHRyZXR1cm4gbmV3IGpRdWVyeS5FdmVudCggc3JjLCBwcm9wcyApO1xuXHR9XG5cblx0Ly8gRXZlbnQgb2JqZWN0XG5cdGlmICggc3JjICYmIHNyYy50eXBlICkge1xuXHRcdHRoaXMub3JpZ2luYWxFdmVudCA9IHNyYztcblx0XHR0aGlzLnR5cGUgPSBzcmMudHlwZTtcblxuXHRcdC8vIEV2ZW50cyBidWJibGluZyB1cCB0aGUgZG9jdW1lbnQgbWF5IGhhdmUgYmVlbiBtYXJrZWQgYXMgcHJldmVudGVkXG5cdFx0Ly8gYnkgYSBoYW5kbGVyIGxvd2VyIGRvd24gdGhlIHRyZWU7IHJlZmxlY3QgdGhlIGNvcnJlY3QgdmFsdWUuXG5cdFx0dGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQgPSAoIHNyYy5kZWZhdWx0UHJldmVudGVkIHx8XG5cdFx0XHRzcmMuZ2V0UHJldmVudERlZmF1bHQgJiYgc3JjLmdldFByZXZlbnREZWZhdWx0KCkgKSA/IHJldHVyblRydWUgOiByZXR1cm5GYWxzZTtcblxuXHQvLyBFdmVudCB0eXBlXG5cdH0gZWxzZSB7XG5cdFx0dGhpcy50eXBlID0gc3JjO1xuXHR9XG5cblx0Ly8gUHV0IGV4cGxpY2l0bHkgcHJvdmlkZWQgcHJvcGVydGllcyBvbnRvIHRoZSBldmVudCBvYmplY3Rcblx0aWYgKCBwcm9wcyApIHtcblx0XHRqUXVlcnkuZXh0ZW5kKCB0aGlzLCBwcm9wcyApO1xuXHR9XG5cblx0Ly8gQ3JlYXRlIGEgdGltZXN0YW1wIGlmIGluY29taW5nIGV2ZW50IGRvZXNuJ3QgaGF2ZSBvbmVcblx0dGhpcy50aW1lU3RhbXAgPSBzcmMgJiYgc3JjLnRpbWVTdGFtcCB8fCBqUXVlcnkubm93KCk7XG5cblx0Ly8gTWFyayBpdCBhcyBmaXhlZFxuXHR0aGlzWyBqUXVlcnkuZXhwYW5kbyBdID0gdHJ1ZTtcbn07XG5cbi8vIGpRdWVyeS5FdmVudCBpcyBiYXNlZCBvbiBET00zIEV2ZW50cyBhcyBzcGVjaWZpZWQgYnkgdGhlIEVDTUFTY3JpcHQgTGFuZ3VhZ2UgQmluZGluZ1xuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMy9XRC1ET00tTGV2ZWwtMy1FdmVudHMtMjAwMzAzMzEvZWNtYS1zY3JpcHQtYmluZGluZy5odG1sXG5qUXVlcnkuRXZlbnQucHJvdG90eXBlID0ge1xuXHRpc0RlZmF1bHRQcmV2ZW50ZWQ6IHJldHVybkZhbHNlLFxuXHRpc1Byb3BhZ2F0aW9uU3RvcHBlZDogcmV0dXJuRmFsc2UsXG5cdGlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkOiByZXR1cm5GYWxzZSxcblxuXHRwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGUgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG5cblx0XHR0aGlzLmlzRGVmYXVsdFByZXZlbnRlZCA9IHJldHVyblRydWU7XG5cblx0XHRpZiAoIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH0sXG5cdHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGUgPSB0aGlzLm9yaWdpbmFsRXZlbnQ7XG5cblx0XHR0aGlzLmlzUHJvcGFnYXRpb25TdG9wcGVkID0gcmV0dXJuVHJ1ZTtcblxuXHRcdGlmICggZSAmJiBlLnN0b3BQcm9wYWdhdGlvbiApIHtcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHR9LFxuXHRzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSByZXR1cm5UcnVlO1xuXHRcdHRoaXMuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH1cbn07XG5cbi8vIENyZWF0ZSBtb3VzZWVudGVyL2xlYXZlIGV2ZW50cyB1c2luZyBtb3VzZW92ZXIvb3V0IGFuZCBldmVudC10aW1lIGNoZWNrc1xuLy8gU3VwcG9ydDogQ2hyb21lIDE1K1xualF1ZXJ5LmVhY2goe1xuXHRtb3VzZWVudGVyOiBcIm1vdXNlb3ZlclwiLFxuXHRtb3VzZWxlYXZlOiBcIm1vdXNlb3V0XCJcbn0sIGZ1bmN0aW9uKCBvcmlnLCBmaXggKSB7XG5cdGpRdWVyeS5ldmVudC5zcGVjaWFsWyBvcmlnIF0gPSB7XG5cdFx0ZGVsZWdhdGVUeXBlOiBmaXgsXG5cdFx0YmluZFR5cGU6IGZpeCxcblxuXHRcdGhhbmRsZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyIHJldCxcblx0XHRcdFx0dGFyZ2V0ID0gdGhpcyxcblx0XHRcdFx0cmVsYXRlZCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQsXG5cdFx0XHRcdGhhbmRsZU9iaiA9IGV2ZW50LmhhbmRsZU9iajtcblxuXHRcdFx0Ly8gRm9yIG1vdXNlbnRlci9sZWF2ZSBjYWxsIHRoZSBoYW5kbGVyIGlmIHJlbGF0ZWQgaXMgb3V0c2lkZSB0aGUgdGFyZ2V0LlxuXHRcdFx0Ly8gTkI6IE5vIHJlbGF0ZWRUYXJnZXQgaWYgdGhlIG1vdXNlIGxlZnQvZW50ZXJlZCB0aGUgYnJvd3NlciB3aW5kb3dcblx0XHRcdGlmICggIXJlbGF0ZWQgfHwgKHJlbGF0ZWQgIT09IHRhcmdldCAmJiAhalF1ZXJ5LmNvbnRhaW5zKCB0YXJnZXQsIHJlbGF0ZWQgKSkgKSB7XG5cdFx0XHRcdGV2ZW50LnR5cGUgPSBoYW5kbGVPYmoub3JpZ1R5cGU7XG5cdFx0XHRcdHJldCA9IGhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRcdFx0ZXZlbnQudHlwZSA9IGZpeDtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fVxuXHR9O1xufSk7XG5cbi8vIENyZWF0ZSBcImJ1YmJsaW5nXCIgZm9jdXMgYW5kIGJsdXIgZXZlbnRzXG4vLyBTdXBwb3J0OiBGaXJlZm94LCBDaHJvbWUsIFNhZmFyaVxuaWYgKCAhalF1ZXJ5LnN1cHBvcnQuZm9jdXNpbkJ1YmJsZXMgKSB7XG5cdGpRdWVyeS5lYWNoKHsgZm9jdXM6IFwiZm9jdXNpblwiLCBibHVyOiBcImZvY3Vzb3V0XCIgfSwgZnVuY3Rpb24oIG9yaWcsIGZpeCApIHtcblxuXHRcdC8vIEF0dGFjaCBhIHNpbmdsZSBjYXB0dXJpbmcgaGFuZGxlciB3aGlsZSBzb21lb25lIHdhbnRzIGZvY3VzaW4vZm9jdXNvdXRcblx0XHR2YXIgYXR0YWNoZXMgPSAwLFxuXHRcdFx0aGFuZGxlciA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LnNpbXVsYXRlKCBmaXgsIGV2ZW50LnRhcmdldCwgalF1ZXJ5LmV2ZW50LmZpeCggZXZlbnQgKSwgdHJ1ZSApO1xuXHRcdFx0fTtcblxuXHRcdGpRdWVyeS5ldmVudC5zcGVjaWFsWyBmaXggXSA9IHtcblx0XHRcdHNldHVwOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBhdHRhY2hlcysrID09PSAwICkge1xuXHRcdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIG9yaWcsIGhhbmRsZXIsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHRlYXJkb3duOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAtLWF0dGFjaGVzID09PSAwICkge1xuXHRcdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIG9yaWcsIGhhbmRsZXIsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufVxuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblxuXHRvbjogZnVuY3Rpb24oIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4sIC8qSU5URVJOQUwqLyBvbmUgKSB7XG5cdFx0dmFyIG9yaWdGbiwgdHlwZTtcblxuXHRcdC8vIFR5cGVzIGNhbiBiZSBhIG1hcCBvZiB0eXBlcy9oYW5kbGVyc1xuXHRcdGlmICggdHlwZW9mIHR5cGVzID09PSBcIm9iamVjdFwiICkge1xuXHRcdFx0Ly8gKCB0eXBlcy1PYmplY3QsIHNlbGVjdG9yLCBkYXRhIClcblx0XHRcdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHQvLyAoIHR5cGVzLU9iamVjdCwgZGF0YSApXG5cdFx0XHRcdGRhdGEgPSBkYXRhIHx8IHNlbGVjdG9yO1xuXHRcdFx0XHRzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHRcdGZvciAoIHR5cGUgaW4gdHlwZXMgKSB7XG5cdFx0XHRcdHRoaXMub24oIHR5cGUsIHNlbGVjdG9yLCBkYXRhLCB0eXBlc1sgdHlwZSBdLCBvbmUgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdGlmICggZGF0YSA9PSBudWxsICYmIGZuID09IG51bGwgKSB7XG5cdFx0XHQvLyAoIHR5cGVzLCBmbiApXG5cdFx0XHRmbiA9IHNlbGVjdG9yO1xuXHRcdFx0ZGF0YSA9IHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuXHRcdH0gZWxzZSBpZiAoIGZuID09IG51bGwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0Ly8gKCB0eXBlcywgc2VsZWN0b3IsIGZuIClcblx0XHRcdFx0Zm4gPSBkYXRhO1xuXHRcdFx0XHRkYXRhID0gdW5kZWZpbmVkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gKCB0eXBlcywgZGF0YSwgZm4gKVxuXHRcdFx0XHRmbiA9IGRhdGE7XG5cdFx0XHRcdGRhdGEgPSBzZWxlY3Rvcjtcblx0XHRcdFx0c2VsZWN0b3IgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICggZm4gPT09IGZhbHNlICkge1xuXHRcdFx0Zm4gPSByZXR1cm5GYWxzZTtcblx0XHR9IGVsc2UgaWYgKCAhZm4gKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cblx0XHRpZiAoIG9uZSA9PT0gMSApIHtcblx0XHRcdG9yaWdGbiA9IGZuO1xuXHRcdFx0Zm4gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdC8vIENhbiB1c2UgYW4gZW1wdHkgc2V0LCBzaW5jZSBldmVudCBjb250YWlucyB0aGUgaW5mb1xuXHRcdFx0XHRqUXVlcnkoKS5vZmYoIGV2ZW50ICk7XG5cdFx0XHRcdHJldHVybiBvcmlnRm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdFx0fTtcblx0XHRcdC8vIFVzZSBzYW1lIGd1aWQgc28gY2FsbGVyIGNhbiByZW1vdmUgdXNpbmcgb3JpZ0ZuXG5cdFx0XHRmbi5ndWlkID0gb3JpZ0ZuLmd1aWQgfHwgKCBvcmlnRm4uZ3VpZCA9IGpRdWVyeS5ndWlkKysgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQuYWRkKCB0aGlzLCB0eXBlcywgZm4sIGRhdGEsIHNlbGVjdG9yICk7XG5cdFx0fSk7XG5cdH0sXG5cdG9uZTogZnVuY3Rpb24oIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4gKSB7XG5cdFx0cmV0dXJuIHRoaXMub24oIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4sIDEgKTtcblx0fSxcblx0b2ZmOiBmdW5jdGlvbiggdHlwZXMsIHNlbGVjdG9yLCBmbiApIHtcblx0XHR2YXIgaGFuZGxlT2JqLCB0eXBlO1xuXHRcdGlmICggdHlwZXMgJiYgdHlwZXMucHJldmVudERlZmF1bHQgJiYgdHlwZXMuaGFuZGxlT2JqICkge1xuXHRcdFx0Ly8gKCBldmVudCApICBkaXNwYXRjaGVkIGpRdWVyeS5FdmVudFxuXHRcdFx0aGFuZGxlT2JqID0gdHlwZXMuaGFuZGxlT2JqO1xuXHRcdFx0alF1ZXJ5KCB0eXBlcy5kZWxlZ2F0ZVRhcmdldCApLm9mZihcblx0XHRcdFx0aGFuZGxlT2JqLm5hbWVzcGFjZSA/IGhhbmRsZU9iai5vcmlnVHlwZSArIFwiLlwiICsgaGFuZGxlT2JqLm5hbWVzcGFjZSA6IGhhbmRsZU9iai5vcmlnVHlwZSxcblx0XHRcdFx0aGFuZGxlT2JqLnNlbGVjdG9yLFxuXHRcdFx0XHRoYW5kbGVPYmouaGFuZGxlclxuXHRcdFx0KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHRpZiAoIHR5cGVvZiB0eXBlcyA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdC8vICggdHlwZXMtb2JqZWN0IFssIHNlbGVjdG9yXSApXG5cdFx0XHRmb3IgKCB0eXBlIGluIHR5cGVzICkge1xuXHRcdFx0XHR0aGlzLm9mZiggdHlwZSwgc2VsZWN0b3IsIHR5cGVzWyB0eXBlIF0gKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblx0XHRpZiAoIHNlbGVjdG9yID09PSBmYWxzZSB8fCB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiApIHtcblx0XHRcdC8vICggdHlwZXMgWywgZm5dIClcblx0XHRcdGZuID0gc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKCBmbiA9PT0gZmFsc2UgKSB7XG5cdFx0XHRmbiA9IHJldHVybkZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5LmV2ZW50LnJlbW92ZSggdGhpcywgdHlwZXMsIGZuLCBzZWxlY3RvciApO1xuXHRcdH0pO1xuXHR9LFxuXG5cdHRyaWdnZXI6IGZ1bmN0aW9uKCB0eXBlLCBkYXRhICkge1xuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlciggdHlwZSwgZGF0YSwgdGhpcyApO1xuXHRcdH0pO1xuXHR9LFxuXHR0cmlnZ2VySGFuZGxlcjogZnVuY3Rpb24oIHR5cGUsIGRhdGEgKSB7XG5cdFx0dmFyIGVsZW0gPSB0aGlzWzBdO1xuXHRcdGlmICggZWxlbSApIHtcblx0XHRcdHJldHVybiBqUXVlcnkuZXZlbnQudHJpZ2dlciggdHlwZSwgZGF0YSwgZWxlbSwgdHJ1ZSApO1xuXHRcdH1cblx0fVxufSk7XG52YXIgaXNTaW1wbGUgPSAvXi5bXjojXFxbXFwuLF0qJC8sXG5cdHJwYXJlbnRzcHJldiA9IC9eKD86cGFyZW50c3xwcmV2KD86VW50aWx8QWxsKSkvLFxuXHRybmVlZHNDb250ZXh0ID0galF1ZXJ5LmV4cHIubWF0Y2gubmVlZHNDb250ZXh0LFxuXHQvLyBtZXRob2RzIGd1YXJhbnRlZWQgdG8gcHJvZHVjZSBhIHVuaXF1ZSBzZXQgd2hlbiBzdGFydGluZyBmcm9tIGEgdW5pcXVlIHNldFxuXHRndWFyYW50ZWVkVW5pcXVlID0ge1xuXHRcdGNoaWxkcmVuOiB0cnVlLFxuXHRcdGNvbnRlbnRzOiB0cnVlLFxuXHRcdG5leHQ6IHRydWUsXG5cdFx0cHJldjogdHJ1ZVxuXHR9O1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0ZmluZDogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHZhciBpLFxuXHRcdFx0cmV0ID0gW10sXG5cdFx0XHRzZWxmID0gdGhpcyxcblx0XHRcdGxlbiA9IHNlbGYubGVuZ3RoO1xuXG5cdFx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGpRdWVyeSggc2VsZWN0b3IgKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkuY29udGFpbnMoIHNlbGZbIGkgXSwgdGhpcyApICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KSApO1xuXHRcdH1cblxuXHRcdGZvciAoIGkgPSAwOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRqUXVlcnkuZmluZCggc2VsZWN0b3IsIHNlbGZbIGkgXSwgcmV0ICk7XG5cdFx0fVxuXG5cdFx0Ly8gTmVlZGVkIGJlY2F1c2UgJCggc2VsZWN0b3IsIGNvbnRleHQgKSBiZWNvbWVzICQoIGNvbnRleHQgKS5maW5kKCBzZWxlY3RvciApXG5cdFx0cmV0ID0gdGhpcy5wdXNoU3RhY2soIGxlbiA+IDEgPyBqUXVlcnkudW5pcXVlKCByZXQgKSA6IHJldCApO1xuXHRcdHJldC5zZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgPyB0aGlzLnNlbGVjdG9yICsgXCIgXCIgKyBzZWxlY3RvciA6IHNlbGVjdG9yO1xuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0aGFzOiBmdW5jdGlvbiggdGFyZ2V0ICkge1xuXHRcdHZhciB0YXJnZXRzID0galF1ZXJ5KCB0YXJnZXQsIHRoaXMgKSxcblx0XHRcdGwgPSB0YXJnZXRzLmxlbmd0aDtcblxuXHRcdHJldHVybiB0aGlzLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdGZvciAoIDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkuY29udGFpbnMoIHRoaXMsIHRhcmdldHNbaV0gKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdG5vdDogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggd2lubm93KHRoaXMsIHNlbGVjdG9yIHx8IFtdLCB0cnVlKSApO1xuXHR9LFxuXG5cdGZpbHRlcjogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggd2lubm93KHRoaXMsIHNlbGVjdG9yIHx8IFtdLCBmYWxzZSkgKTtcblx0fSxcblxuXHRpczogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdHJldHVybiAhIXdpbm5vdyhcblx0XHRcdHRoaXMsXG5cblx0XHRcdC8vIElmIHRoaXMgaXMgYSBwb3NpdGlvbmFsL3JlbGF0aXZlIHNlbGVjdG9yLCBjaGVjayBtZW1iZXJzaGlwIGluIHRoZSByZXR1cm5lZCBzZXRcblx0XHRcdC8vIHNvICQoXCJwOmZpcnN0XCIpLmlzKFwicDpsYXN0XCIpIHdvbid0IHJldHVybiB0cnVlIGZvciBhIGRvYyB3aXRoIHR3byBcInBcIi5cblx0XHRcdHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiAmJiBybmVlZHNDb250ZXh0LnRlc3QoIHNlbGVjdG9yICkgP1xuXHRcdFx0XHRqUXVlcnkoIHNlbGVjdG9yICkgOlxuXHRcdFx0XHRzZWxlY3RvciB8fCBbXSxcblx0XHRcdGZhbHNlXG5cdFx0KS5sZW5ndGg7XG5cdH0sXG5cblx0Y2xvc2VzdDogZnVuY3Rpb24oIHNlbGVjdG9ycywgY29udGV4dCApIHtcblx0XHR2YXIgY3VyLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRsID0gdGhpcy5sZW5ndGgsXG5cdFx0XHRtYXRjaGVkID0gW10sXG5cdFx0XHRwb3MgPSAoIHJuZWVkc0NvbnRleHQudGVzdCggc2VsZWN0b3JzICkgfHwgdHlwZW9mIHNlbGVjdG9ycyAhPT0gXCJzdHJpbmdcIiApID9cblx0XHRcdFx0alF1ZXJ5KCBzZWxlY3RvcnMsIGNvbnRleHQgfHwgdGhpcy5jb250ZXh0ICkgOlxuXHRcdFx0XHQwO1xuXG5cdFx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0Zm9yICggY3VyID0gdGhpc1tpXTsgY3VyICYmIGN1ciAhPT0gY29udGV4dDsgY3VyID0gY3VyLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdC8vIEFsd2F5cyBza2lwIGRvY3VtZW50IGZyYWdtZW50c1xuXHRcdFx0XHRpZiAoIGN1ci5ub2RlVHlwZSA8IDExICYmIChwb3MgP1xuXHRcdFx0XHRcdHBvcy5pbmRleChjdXIpID4gLTEgOlxuXG5cdFx0XHRcdFx0Ly8gRG9uJ3QgcGFzcyBub24tZWxlbWVudHMgdG8gU2l6emxlXG5cdFx0XHRcdFx0Y3VyLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdFx0XHRqUXVlcnkuZmluZC5tYXRjaGVzU2VsZWN0b3IoY3VyLCBzZWxlY3RvcnMpKSApIHtcblxuXHRcdFx0XHRcdGN1ciA9IG1hdGNoZWQucHVzaCggY3VyICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIG1hdGNoZWQubGVuZ3RoID4gMSA/IGpRdWVyeS51bmlxdWUoIG1hdGNoZWQgKSA6IG1hdGNoZWQgKTtcblx0fSxcblxuXHQvLyBEZXRlcm1pbmUgdGhlIHBvc2l0aW9uIG9mIGFuIGVsZW1lbnQgd2l0aGluXG5cdC8vIHRoZSBtYXRjaGVkIHNldCBvZiBlbGVtZW50c1xuXHRpbmRleDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHQvLyBObyBhcmd1bWVudCwgcmV0dXJuIGluZGV4IGluIHBhcmVudFxuXHRcdGlmICggIWVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gKCB0aGlzWyAwIF0gJiYgdGhpc1sgMCBdLnBhcmVudE5vZGUgKSA/IHRoaXMuZmlyc3QoKS5wcmV2QWxsKCkubGVuZ3RoIDogLTE7XG5cdFx0fVxuXG5cdFx0Ly8gaW5kZXggaW4gc2VsZWN0b3Jcblx0XHRpZiAoIHR5cGVvZiBlbGVtID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIGNvcmVfaW5kZXhPZi5jYWxsKCBqUXVlcnkoIGVsZW0gKSwgdGhpc1sgMCBdICk7XG5cdFx0fVxuXG5cdFx0Ly8gTG9jYXRlIHRoZSBwb3NpdGlvbiBvZiB0aGUgZGVzaXJlZCBlbGVtZW50XG5cdFx0cmV0dXJuIGNvcmVfaW5kZXhPZi5jYWxsKCB0aGlzLFxuXG5cdFx0XHQvLyBJZiBpdCByZWNlaXZlcyBhIGpRdWVyeSBvYmplY3QsIHRoZSBmaXJzdCBlbGVtZW50IGlzIHVzZWRcblx0XHRcdGVsZW0uanF1ZXJ5ID8gZWxlbVsgMCBdIDogZWxlbVxuXHRcdCk7XG5cdH0sXG5cblx0YWRkOiBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQgKSB7XG5cdFx0dmFyIHNldCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiA/XG5cdFx0XHRcdGpRdWVyeSggc2VsZWN0b3IsIGNvbnRleHQgKSA6XG5cdFx0XHRcdGpRdWVyeS5tYWtlQXJyYXkoIHNlbGVjdG9yICYmIHNlbGVjdG9yLm5vZGVUeXBlID8gWyBzZWxlY3RvciBdIDogc2VsZWN0b3IgKSxcblx0XHRcdGFsbCA9IGpRdWVyeS5tZXJnZSggdGhpcy5nZXQoKSwgc2V0ICk7XG5cblx0XHRyZXR1cm4gdGhpcy5wdXNoU3RhY2soIGpRdWVyeS51bmlxdWUoYWxsKSApO1xuXHR9LFxuXG5cdGFkZEJhY2s6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRyZXR1cm4gdGhpcy5hZGQoIHNlbGVjdG9yID09IG51bGwgP1xuXHRcdFx0dGhpcy5wcmV2T2JqZWN0IDogdGhpcy5wcmV2T2JqZWN0LmZpbHRlcihzZWxlY3Rvcilcblx0XHQpO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gc2libGluZyggY3VyLCBkaXIgKSB7XG5cdHdoaWxlICggKGN1ciA9IGN1cltkaXJdKSAmJiBjdXIubm9kZVR5cGUgIT09IDEgKSB7fVxuXG5cdHJldHVybiBjdXI7XG59XG5cbmpRdWVyeS5lYWNoKHtcblx0cGFyZW50OiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgcGFyZW50ID0gZWxlbS5wYXJlbnROb2RlO1xuXHRcdHJldHVybiBwYXJlbnQgJiYgcGFyZW50Lm5vZGVUeXBlICE9PSAxMSA/IHBhcmVudCA6IG51bGw7XG5cdH0sXG5cdHBhcmVudHM6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBqUXVlcnkuZGlyKCBlbGVtLCBcInBhcmVudE5vZGVcIiApO1xuXHR9LFxuXHRwYXJlbnRzVW50aWw6IGZ1bmN0aW9uKCBlbGVtLCBpLCB1bnRpbCApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmRpciggZWxlbSwgXCJwYXJlbnROb2RlXCIsIHVudGlsICk7XG5cdH0sXG5cdG5leHQ6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBzaWJsaW5nKCBlbGVtLCBcIm5leHRTaWJsaW5nXCIgKTtcblx0fSxcblx0cHJldjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIHNpYmxpbmcoIGVsZW0sIFwicHJldmlvdXNTaWJsaW5nXCIgKTtcblx0fSxcblx0bmV4dEFsbDogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5kaXIoIGVsZW0sIFwibmV4dFNpYmxpbmdcIiApO1xuXHR9LFxuXHRwcmV2QWxsOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmRpciggZWxlbSwgXCJwcmV2aW91c1NpYmxpbmdcIiApO1xuXHR9LFxuXHRuZXh0VW50aWw6IGZ1bmN0aW9uKCBlbGVtLCBpLCB1bnRpbCApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmRpciggZWxlbSwgXCJuZXh0U2libGluZ1wiLCB1bnRpbCApO1xuXHR9LFxuXHRwcmV2VW50aWw6IGZ1bmN0aW9uKCBlbGVtLCBpLCB1bnRpbCApIHtcblx0XHRyZXR1cm4galF1ZXJ5LmRpciggZWxlbSwgXCJwcmV2aW91c1NpYmxpbmdcIiwgdW50aWwgKTtcblx0fSxcblx0c2libGluZ3M6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiBqUXVlcnkuc2libGluZyggKCBlbGVtLnBhcmVudE5vZGUgfHwge30gKS5maXJzdENoaWxkLCBlbGVtICk7XG5cdH0sXG5cdGNoaWxkcmVuOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4galF1ZXJ5LnNpYmxpbmcoIGVsZW0uZmlyc3RDaGlsZCApO1xuXHR9LFxuXHRjb250ZW50czogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGVsZW0uY29udGVudERvY3VtZW50IHx8IGpRdWVyeS5tZXJnZSggW10sIGVsZW0uY2hpbGROb2RlcyApO1xuXHR9XG59LCBmdW5jdGlvbiggbmFtZSwgZm4gKSB7XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHVudGlsLCBzZWxlY3RvciApIHtcblx0XHR2YXIgbWF0Y2hlZCA9IGpRdWVyeS5tYXAoIHRoaXMsIGZuLCB1bnRpbCApO1xuXG5cdFx0aWYgKCBuYW1lLnNsaWNlKCAtNSApICE9PSBcIlVudGlsXCIgKSB7XG5cdFx0XHRzZWxlY3RvciA9IHVudGlsO1xuXHRcdH1cblxuXHRcdGlmICggc2VsZWN0b3IgJiYgdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0bWF0Y2hlZCA9IGpRdWVyeS5maWx0ZXIoIHNlbGVjdG9yLCBtYXRjaGVkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzLmxlbmd0aCA+IDEgKSB7XG5cdFx0XHQvLyBSZW1vdmUgZHVwbGljYXRlc1xuXHRcdFx0aWYgKCAhZ3VhcmFudGVlZFVuaXF1ZVsgbmFtZSBdICkge1xuXHRcdFx0XHRqUXVlcnkudW5pcXVlKCBtYXRjaGVkICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJldmVyc2Ugb3JkZXIgZm9yIHBhcmVudHMqIGFuZCBwcmV2LWRlcml2YXRpdmVzXG5cdFx0XHRpZiAoIHJwYXJlbnRzcHJldi50ZXN0KCBuYW1lICkgKSB7XG5cdFx0XHRcdG1hdGNoZWQucmV2ZXJzZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggbWF0Y2hlZCApO1xuXHR9O1xufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXHRmaWx0ZXI6IGZ1bmN0aW9uKCBleHByLCBlbGVtcywgbm90ICkge1xuXHRcdHZhciBlbGVtID0gZWxlbXNbIDAgXTtcblxuXHRcdGlmICggbm90ICkge1xuXHRcdFx0ZXhwciA9IFwiOm5vdChcIiArIGV4cHIgKyBcIilcIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gZWxlbXMubGVuZ3RoID09PSAxICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgP1xuXHRcdFx0alF1ZXJ5LmZpbmQubWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBleHByICkgPyBbIGVsZW0gXSA6IFtdIDpcblx0XHRcdGpRdWVyeS5maW5kLm1hdGNoZXMoIGV4cHIsIGpRdWVyeS5ncmVwKCBlbGVtcywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLm5vZGVUeXBlID09PSAxO1xuXHRcdFx0fSkpO1xuXHR9LFxuXG5cdGRpcjogZnVuY3Rpb24oIGVsZW0sIGRpciwgdW50aWwgKSB7XG5cdFx0dmFyIG1hdGNoZWQgPSBbXSxcblx0XHRcdHRydW5jYXRlID0gdW50aWwgIT09IHVuZGVmaW5lZDtcblxuXHRcdHdoaWxlICggKGVsZW0gPSBlbGVtWyBkaXIgXSkgJiYgZWxlbS5ub2RlVHlwZSAhPT0gOSApIHtcblx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0aWYgKCB0cnVuY2F0ZSAmJiBqUXVlcnkoIGVsZW0gKS5pcyggdW50aWwgKSApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRtYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hdGNoZWQ7XG5cdH0sXG5cblx0c2libGluZzogZnVuY3Rpb24oIG4sIGVsZW0gKSB7XG5cdFx0dmFyIG1hdGNoZWQgPSBbXTtcblxuXHRcdGZvciAoIDsgbjsgbiA9IG4ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRpZiAoIG4ubm9kZVR5cGUgPT09IDEgJiYgbiAhPT0gZWxlbSApIHtcblx0XHRcdFx0bWF0Y2hlZC5wdXNoKCBuICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1hdGNoZWQ7XG5cdH1cbn0pO1xuXG4vLyBJbXBsZW1lbnQgdGhlIGlkZW50aWNhbCBmdW5jdGlvbmFsaXR5IGZvciBmaWx0ZXIgYW5kIG5vdFxuZnVuY3Rpb24gd2lubm93KCBlbGVtZW50cywgcXVhbGlmaWVyLCBub3QgKSB7XG5cdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIHF1YWxpZmllciApICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ3JlcCggZWxlbWVudHMsIGZ1bmN0aW9uKCBlbGVtLCBpICkge1xuXHRcdFx0LyoganNoaW50IC1XMDE4ICovXG5cdFx0XHRyZXR1cm4gISFxdWFsaWZpZXIuY2FsbCggZWxlbSwgaSwgZWxlbSApICE9PSBub3Q7XG5cdFx0fSk7XG5cblx0fVxuXG5cdGlmICggcXVhbGlmaWVyLm5vZGVUeXBlICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ3JlcCggZWxlbWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICggZWxlbSA9PT0gcXVhbGlmaWVyICkgIT09IG5vdDtcblx0XHR9KTtcblxuXHR9XG5cblx0aWYgKCB0eXBlb2YgcXVhbGlmaWVyID09PSBcInN0cmluZ1wiICkge1xuXHRcdGlmICggaXNTaW1wbGUudGVzdCggcXVhbGlmaWVyICkgKSB7XG5cdFx0XHRyZXR1cm4galF1ZXJ5LmZpbHRlciggcXVhbGlmaWVyLCBlbGVtZW50cywgbm90ICk7XG5cdFx0fVxuXG5cdFx0cXVhbGlmaWVyID0galF1ZXJ5LmZpbHRlciggcXVhbGlmaWVyLCBlbGVtZW50cyApO1xuXHR9XG5cblx0cmV0dXJuIGpRdWVyeS5ncmVwKCBlbGVtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuICggY29yZV9pbmRleE9mLmNhbGwoIHF1YWxpZmllciwgZWxlbSApID49IDAgKSAhPT0gbm90O1xuXHR9KTtcbn1cbnZhciByeGh0bWxUYWcgPSAvPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbXFx3Ol0rKVtePl0qKVxcLz4vZ2ksXG5cdHJ0YWdOYW1lID0gLzwoW1xcdzpdKykvLFxuXHRyaHRtbCA9IC88fCYjP1xcdys7Lyxcblx0cm5vSW5uZXJodG1sID0gLzwoPzpzY3JpcHR8c3R5bGV8bGluaykvaSxcblx0bWFuaXB1bGF0aW9uX3JjaGVja2FibGVUeXBlID0gL14oPzpjaGVja2JveHxyYWRpbykkL2ksXG5cdC8vIGNoZWNrZWQ9XCJjaGVja2VkXCIgb3IgY2hlY2tlZFxuXHRyY2hlY2tlZCA9IC9jaGVja2VkXFxzKig/OltePV18PVxccyouY2hlY2tlZC4pL2ksXG5cdHJzY3JpcHRUeXBlID0gL14kfFxcLyg/OmphdmF8ZWNtYSlzY3JpcHQvaSxcblx0cnNjcmlwdFR5cGVNYXNrZWQgPSAvXnRydWVcXC8oLiopLyxcblx0cmNsZWFuU2NyaXB0ID0gL15cXHMqPCEoPzpcXFtDREFUQVxcW3wtLSl8KD86XFxdXFxdfC0tKT5cXHMqJC9nLFxuXG5cdC8vIFdlIGhhdmUgdG8gY2xvc2UgdGhlc2UgdGFncyB0byBzdXBwb3J0IFhIVE1MICgjMTMyMDApXG5cdHdyYXBNYXAgPSB7XG5cblx0XHQvLyBTdXBwb3J0OiBJRSA5XG5cdFx0b3B0aW9uOiBbIDEsIFwiPHNlbGVjdCBtdWx0aXBsZT0nbXVsdGlwbGUnPlwiLCBcIjwvc2VsZWN0PlwiIF0sXG5cblx0XHR0aGVhZDogWyAxLCBcIjx0YWJsZT5cIiwgXCI8L3RhYmxlPlwiIF0sXG5cdFx0Y29sOiBbIDIsIFwiPHRhYmxlPjxjb2xncm91cD5cIiwgXCI8L2NvbGdyb3VwPjwvdGFibGU+XCIgXSxcblx0XHR0cjogWyAyLCBcIjx0YWJsZT48dGJvZHk+XCIsIFwiPC90Ym9keT48L3RhYmxlPlwiIF0sXG5cdFx0dGQ6IFsgMywgXCI8dGFibGU+PHRib2R5Pjx0cj5cIiwgXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIiBdLFxuXG5cdFx0X2RlZmF1bHQ6IFsgMCwgXCJcIiwgXCJcIiBdXG5cdH07XG5cbi8vIFN1cHBvcnQ6IElFIDlcbndyYXBNYXAub3B0Z3JvdXAgPSB3cmFwTWFwLm9wdGlvbjtcblxud3JhcE1hcC50Ym9keSA9IHdyYXBNYXAudGZvb3QgPSB3cmFwTWFwLmNvbGdyb3VwID0gd3JhcE1hcC5jYXB0aW9uID0gd3JhcE1hcC50aGVhZDtcbndyYXBNYXAudGggPSB3cmFwTWFwLnRkO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0dGV4dDogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHJldHVybiBqUXVlcnkuYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdGpRdWVyeS50ZXh0KCB0aGlzICkgOlxuXHRcdFx0XHR0aGlzLmVtcHR5KCkuYXBwZW5kKCAoIHRoaXNbIDAgXSAmJiB0aGlzWyAwIF0ub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCApLmNyZWF0ZVRleHROb2RlKCB2YWx1ZSApICk7XG5cdFx0fSwgbnVsbCwgdmFsdWUsIGFyZ3VtZW50cy5sZW5ndGggKTtcblx0fSxcblxuXHRhcHBlbmQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmRvbU1hbmlwKCBhcmd1bWVudHMsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0aWYgKCB0aGlzLm5vZGVUeXBlID09PSAxIHx8IHRoaXMubm9kZVR5cGUgPT09IDExIHx8IHRoaXMubm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSBtYW5pcHVsYXRpb25UYXJnZXQoIHRoaXMsIGVsZW0gKTtcblx0XHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKCBlbGVtICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0cHJlcGVuZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZG9tTWFuaXAoIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMubm9kZVR5cGUgPT09IDEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gMTEgfHwgdGhpcy5ub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0dmFyIHRhcmdldCA9IG1hbmlwdWxhdGlvblRhcmdldCggdGhpcywgZWxlbSApO1xuXHRcdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKCBlbGVtLCB0YXJnZXQuZmlyc3RDaGlsZCApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGJlZm9yZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZG9tTWFuaXAoIGFyZ3VtZW50cywgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRpZiAoIHRoaXMucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggZWxlbSwgdGhpcyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdGFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5kb21NYW5pcCggYXJndW1lbnRzLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdGlmICggdGhpcy5wYXJlbnROb2RlICkge1xuXHRcdFx0XHR0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCBlbGVtLCB0aGlzLm5leHRTaWJsaW5nICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0Ly8ga2VlcERhdGEgaXMgZm9yIGludGVybmFsIHVzZSBvbmx5LS1kbyBub3QgZG9jdW1lbnRcblx0cmVtb3ZlOiBmdW5jdGlvbiggc2VsZWN0b3IsIGtlZXBEYXRhICkge1xuXHRcdHZhciBlbGVtLFxuXHRcdFx0ZWxlbXMgPSBzZWxlY3RvciA/IGpRdWVyeS5maWx0ZXIoIHNlbGVjdG9yLCB0aGlzICkgOiB0aGlzLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRmb3IgKCA7IChlbGVtID0gZWxlbXNbaV0pICE9IG51bGw7IGkrKyApIHtcblx0XHRcdGlmICggIWtlZXBEYXRhICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdGpRdWVyeS5jbGVhbkRhdGEoIGdldEFsbCggZWxlbSApICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRpZiAoIGtlZXBEYXRhICYmIGpRdWVyeS5jb250YWlucyggZWxlbS5vd25lckRvY3VtZW50LCBlbGVtICkgKSB7XG5cdFx0XHRcdFx0c2V0R2xvYmFsRXZhbCggZ2V0QWxsKCBlbGVtLCBcInNjcmlwdFwiICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRlbXB0eTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGVsZW0sXG5cdFx0XHRpID0gMDtcblxuXHRcdGZvciAoIDsgKGVsZW0gPSB0aGlzW2ldKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cblx0XHRcdFx0Ly8gUHJldmVudCBtZW1vcnkgbGVha3Ncblx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggZ2V0QWxsKCBlbGVtLCBmYWxzZSApICk7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIGFueSByZW1haW5pbmcgbm9kZXNcblx0XHRcdFx0ZWxlbS50ZXh0Q29udGVudCA9IFwiXCI7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Y2xvbmU6IGZ1bmN0aW9uKCBkYXRhQW5kRXZlbnRzLCBkZWVwRGF0YUFuZEV2ZW50cyApIHtcblx0XHRkYXRhQW5kRXZlbnRzID0gZGF0YUFuZEV2ZW50cyA9PSBudWxsID8gZmFsc2UgOiBkYXRhQW5kRXZlbnRzO1xuXHRcdGRlZXBEYXRhQW5kRXZlbnRzID0gZGVlcERhdGFBbmRFdmVudHMgPT0gbnVsbCA/IGRhdGFBbmRFdmVudHMgOiBkZWVwRGF0YUFuZEV2ZW50cztcblxuXHRcdHJldHVybiB0aGlzLm1hcCggZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGpRdWVyeS5jbG9uZSggdGhpcywgZGF0YUFuZEV2ZW50cywgZGVlcERhdGFBbmRFdmVudHMgKTtcblx0XHR9KTtcblx0fSxcblxuXHRodG1sOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5hY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdHZhciBlbGVtID0gdGhpc1sgMCBdIHx8IHt9LFxuXHRcdFx0XHRpID0gMCxcblx0XHRcdFx0bCA9IHRoaXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW0uaW5uZXJIVE1MO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZWUgaWYgd2UgY2FuIHRha2UgYSBzaG9ydGN1dCBhbmQganVzdCB1c2UgaW5uZXJIVE1MXG5cdFx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAhcm5vSW5uZXJodG1sLnRlc3QoIHZhbHVlICkgJiZcblx0XHRcdFx0IXdyYXBNYXBbICggcnRhZ05hbWUuZXhlYyggdmFsdWUgKSB8fCBbIFwiXCIsIFwiXCIgXSApWyAxIF0udG9Mb3dlckNhc2UoKSBdICkge1xuXG5cdFx0XHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZSggcnhodG1sVGFnLCBcIjwkMT48LyQyPlwiICk7XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0XHRlbGVtID0gdGhpc1sgaSBdIHx8IHt9O1xuXG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgZWxlbWVudCBub2RlcyBhbmQgcHJldmVudCBtZW1vcnkgbGVha3Ncblx0XHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5LmNsZWFuRGF0YSggZ2V0QWxsKCBlbGVtLCBmYWxzZSApICk7XG5cdFx0XHRcdFx0XHRcdGVsZW0uaW5uZXJIVE1MID0gdmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0ZWxlbSA9IDA7XG5cblx0XHRcdFx0Ly8gSWYgdXNpbmcgaW5uZXJIVE1MIHRocm93cyBhbiBleGNlcHRpb24sIHVzZSB0aGUgZmFsbGJhY2sgbWV0aG9kXG5cdFx0XHRcdH0gY2F0Y2goIGUgKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGVsZW0gKSB7XG5cdFx0XHRcdHRoaXMuZW1wdHkoKS5hcHBlbmQoIHZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSwgbnVsbCwgdmFsdWUsIGFyZ3VtZW50cy5sZW5ndGggKTtcblx0fSxcblxuXHRyZXBsYWNlV2l0aDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHQvLyBTbmFwc2hvdCB0aGUgRE9NIGluIGNhc2UgLmRvbU1hbmlwIHN3ZWVwcyBzb21ldGhpbmcgcmVsZXZhbnQgaW50byBpdHMgZnJhZ21lbnRcblx0XHRcdGFyZ3MgPSBqUXVlcnkubWFwKCB0aGlzLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIFsgZWxlbS5uZXh0U2libGluZywgZWxlbS5wYXJlbnROb2RlIF07XG5cdFx0XHR9KSxcblx0XHRcdGkgPSAwO1xuXG5cdFx0Ly8gTWFrZSB0aGUgY2hhbmdlcywgcmVwbGFjaW5nIGVhY2ggY29udGV4dCBlbGVtZW50IHdpdGggdGhlIG5ldyBjb250ZW50XG5cdFx0dGhpcy5kb21NYW5pcCggYXJndW1lbnRzLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBuZXh0ID0gYXJnc1sgaSsrIF0sXG5cdFx0XHRcdHBhcmVudCA9IGFyZ3NbIGkrKyBdO1xuXG5cdFx0XHRpZiAoIHBhcmVudCApIHtcblx0XHRcdFx0Ly8gRG9uJ3QgdXNlIHRoZSBzbmFwc2hvdCBuZXh0IGlmIGl0IGhhcyBtb3ZlZCAoIzEzODEwKVxuXHRcdFx0XHRpZiAoIG5leHQgJiYgbmV4dC5wYXJlbnROb2RlICE9PSBwYXJlbnQgKSB7XG5cdFx0XHRcdFx0bmV4dCA9IHRoaXMubmV4dFNpYmxpbmc7XG5cdFx0XHRcdH1cblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdHBhcmVudC5pbnNlcnRCZWZvcmUoIGVsZW0sIG5leHQgKTtcblx0XHRcdH1cblx0XHQvLyBBbGxvdyBuZXcgY29udGVudCB0byBpbmNsdWRlIGVsZW1lbnRzIGZyb20gdGhlIGNvbnRleHQgc2V0XG5cdFx0fSwgdHJ1ZSApO1xuXG5cdFx0Ly8gRm9yY2UgcmVtb3ZhbCBpZiB0aGVyZSB3YXMgbm8gbmV3IGNvbnRlbnQgKGUuZy4sIGZyb20gZW1wdHkgYXJndW1lbnRzKVxuXHRcdHJldHVybiBpID8gdGhpcyA6IHRoaXMucmVtb3ZlKCk7XG5cdH0sXG5cblx0ZGV0YWNoOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVtb3ZlKCBzZWxlY3RvciwgdHJ1ZSApO1xuXHR9LFxuXG5cdGRvbU1hbmlwOiBmdW5jdGlvbiggYXJncywgY2FsbGJhY2ssIGFsbG93SW50ZXJzZWN0aW9uICkge1xuXG5cdFx0Ly8gRmxhdHRlbiBhbnkgbmVzdGVkIGFycmF5c1xuXHRcdGFyZ3MgPSBjb3JlX2NvbmNhdC5hcHBseSggW10sIGFyZ3MgKTtcblxuXHRcdHZhciBmcmFnbWVudCwgZmlyc3QsIHNjcmlwdHMsIGhhc1NjcmlwdHMsIG5vZGUsIGRvYyxcblx0XHRcdGkgPSAwLFxuXHRcdFx0bCA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0c2V0ID0gdGhpcyxcblx0XHRcdGlOb0Nsb25lID0gbCAtIDEsXG5cdFx0XHR2YWx1ZSA9IGFyZ3NbIDAgXSxcblx0XHRcdGlzRnVuY3Rpb24gPSBqUXVlcnkuaXNGdW5jdGlvbiggdmFsdWUgKTtcblxuXHRcdC8vIFdlIGNhbid0IGNsb25lTm9kZSBmcmFnbWVudHMgdGhhdCBjb250YWluIGNoZWNrZWQsIGluIFdlYktpdFxuXHRcdGlmICggaXNGdW5jdGlvbiB8fCAhKCBsIDw9IDEgfHwgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiIHx8IGpRdWVyeS5zdXBwb3J0LmNoZWNrQ2xvbmUgfHwgIXJjaGVja2VkLnRlc3QoIHZhbHVlICkgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0XHR2YXIgc2VsZiA9IHNldC5lcSggaW5kZXggKTtcblx0XHRcdFx0aWYgKCBpc0Z1bmN0aW9uICkge1xuXHRcdFx0XHRcdGFyZ3NbIDAgXSA9IHZhbHVlLmNhbGwoIHRoaXMsIGluZGV4LCBzZWxmLmh0bWwoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYuZG9tTWFuaXAoIGFyZ3MsIGNhbGxiYWNrLCBhbGxvd0ludGVyc2VjdGlvbiApO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKCBsICkge1xuXHRcdFx0ZnJhZ21lbnQgPSBqUXVlcnkuYnVpbGRGcmFnbWVudCggYXJncywgdGhpc1sgMCBdLm93bmVyRG9jdW1lbnQsIGZhbHNlLCAhYWxsb3dJbnRlcnNlY3Rpb24gJiYgdGhpcyApO1xuXHRcdFx0Zmlyc3QgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG5cdFx0XHRpZiAoIGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoID09PSAxICkge1xuXHRcdFx0XHRmcmFnbWVudCA9IGZpcnN0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGZpcnN0ICkge1xuXHRcdFx0XHRzY3JpcHRzID0galF1ZXJ5Lm1hcCggZ2V0QWxsKCBmcmFnbWVudCwgXCJzY3JpcHRcIiApLCBkaXNhYmxlU2NyaXB0ICk7XG5cdFx0XHRcdGhhc1NjcmlwdHMgPSBzY3JpcHRzLmxlbmd0aDtcblxuXHRcdFx0XHQvLyBVc2UgdGhlIG9yaWdpbmFsIGZyYWdtZW50IGZvciB0aGUgbGFzdCBpdGVtIGluc3RlYWQgb2YgdGhlIGZpcnN0IGJlY2F1c2UgaXQgY2FuIGVuZCB1cFxuXHRcdFx0XHQvLyBiZWluZyBlbXB0aWVkIGluY29ycmVjdGx5IGluIGNlcnRhaW4gc2l0dWF0aW9ucyAoIzgwNzApLlxuXHRcdFx0XHRmb3IgKCA7IGkgPCBsOyBpKysgKSB7XG5cdFx0XHRcdFx0bm9kZSA9IGZyYWdtZW50O1xuXG5cdFx0XHRcdFx0aWYgKCBpICE9PSBpTm9DbG9uZSApIHtcblx0XHRcdFx0XHRcdG5vZGUgPSBqUXVlcnkuY2xvbmUoIG5vZGUsIHRydWUsIHRydWUgKTtcblxuXHRcdFx0XHRcdFx0Ly8gS2VlcCByZWZlcmVuY2VzIHRvIGNsb25lZCBzY3JpcHRzIGZvciBsYXRlciByZXN0b3JhdGlvblxuXHRcdFx0XHRcdFx0aWYgKCBoYXNTY3JpcHRzICkge1xuXHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBRdFdlYktpdFxuXHRcdFx0XHRcdFx0XHQvLyBqUXVlcnkubWVyZ2UgYmVjYXVzZSBjb3JlX3B1c2guYXBwbHkoXywgYXJyYXlsaWtlKSB0aHJvd3Ncblx0XHRcdFx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCBzY3JpcHRzLCBnZXRBbGwoIG5vZGUsIFwic2NyaXB0XCIgKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoIHRoaXNbIGkgXSwgbm9kZSwgaSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBoYXNTY3JpcHRzICkge1xuXHRcdFx0XHRcdGRvYyA9IHNjcmlwdHNbIHNjcmlwdHMubGVuZ3RoIC0gMSBdLm93bmVyRG9jdW1lbnQ7XG5cblx0XHRcdFx0XHQvLyBSZWVuYWJsZSBzY3JpcHRzXG5cdFx0XHRcdFx0alF1ZXJ5Lm1hcCggc2NyaXB0cywgcmVzdG9yZVNjcmlwdCApO1xuXG5cdFx0XHRcdFx0Ly8gRXZhbHVhdGUgZXhlY3V0YWJsZSBzY3JpcHRzIG9uIGZpcnN0IGRvY3VtZW50IGluc2VydGlvblxuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgaGFzU2NyaXB0czsgaSsrICkge1xuXHRcdFx0XHRcdFx0bm9kZSA9IHNjcmlwdHNbIGkgXTtcblx0XHRcdFx0XHRcdGlmICggcnNjcmlwdFR5cGUudGVzdCggbm9kZS50eXBlIHx8IFwiXCIgKSAmJlxuXHRcdFx0XHRcdFx0XHQhZGF0YV9wcml2LmFjY2Vzcyggbm9kZSwgXCJnbG9iYWxFdmFsXCIgKSAmJiBqUXVlcnkuY29udGFpbnMoIGRvYywgbm9kZSApICkge1xuXG5cdFx0XHRcdFx0XHRcdGlmICggbm9kZS5zcmMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gSG9wZSBhamF4IGlzIGF2YWlsYWJsZS4uLlxuXHRcdFx0XHRcdFx0XHRcdGpRdWVyeS5fZXZhbFVybCggbm9kZS5zcmMgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkuZ2xvYmFsRXZhbCggbm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKCByY2xlYW5TY3JpcHQsIFwiXCIgKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn0pO1xuXG5qUXVlcnkuZWFjaCh7XG5cdGFwcGVuZFRvOiBcImFwcGVuZFwiLFxuXHRwcmVwZW5kVG86IFwicHJlcGVuZFwiLFxuXHRpbnNlcnRCZWZvcmU6IFwiYmVmb3JlXCIsXG5cdGluc2VydEFmdGVyOiBcImFmdGVyXCIsXG5cdHJlcGxhY2VBbGw6IFwicmVwbGFjZVdpdGhcIlxufSwgZnVuY3Rpb24oIG5hbWUsIG9yaWdpbmFsICkge1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHR2YXIgZWxlbXMsXG5cdFx0XHRyZXQgPSBbXSxcblx0XHRcdGluc2VydCA9IGpRdWVyeSggc2VsZWN0b3IgKSxcblx0XHRcdGxhc3QgPSBpbnNlcnQubGVuZ3RoIC0gMSxcblx0XHRcdGkgPSAwO1xuXG5cdFx0Zm9yICggOyBpIDw9IGxhc3Q7IGkrKyApIHtcblx0XHRcdGVsZW1zID0gaSA9PT0gbGFzdCA/IHRoaXMgOiB0aGlzLmNsb25lKCB0cnVlICk7XG5cdFx0XHRqUXVlcnkoIGluc2VydFsgaSBdIClbIG9yaWdpbmFsIF0oIGVsZW1zICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFF0V2ViS2l0XG5cdFx0XHQvLyAuZ2V0KCkgYmVjYXVzZSBjb3JlX3B1c2guYXBwbHkoXywgYXJyYXlsaWtlKSB0aHJvd3Ncblx0XHRcdGNvcmVfcHVzaC5hcHBseSggcmV0LCBlbGVtcy5nZXQoKSApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnB1c2hTdGFjayggcmV0ICk7XG5cdH07XG59KTtcblxualF1ZXJ5LmV4dGVuZCh7XG5cdGNsb25lOiBmdW5jdGlvbiggZWxlbSwgZGF0YUFuZEV2ZW50cywgZGVlcERhdGFBbmRFdmVudHMgKSB7XG5cdFx0dmFyIGksIGwsIHNyY0VsZW1lbnRzLCBkZXN0RWxlbWVudHMsXG5cdFx0XHRjbG9uZSA9IGVsZW0uY2xvbmVOb2RlKCB0cnVlICksXG5cdFx0XHRpblBhZ2UgPSBqUXVlcnkuY29udGFpbnMoIGVsZW0ub3duZXJEb2N1bWVudCwgZWxlbSApO1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgPj0gOVxuXHRcdC8vIEZpeCBDbG9uaW5nIGlzc3Vlc1xuXHRcdGlmICggIWpRdWVyeS5zdXBwb3J0Lm5vQ2xvbmVDaGVja2VkICYmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBlbGVtLm5vZGVUeXBlID09PSAxMSApICYmICFqUXVlcnkuaXNYTUxEb2MoIGVsZW0gKSApIHtcblxuXHRcdFx0Ly8gV2UgZXNjaGV3IFNpenpsZSBoZXJlIGZvciBwZXJmb3JtYW5jZSByZWFzb25zOiBodHRwOi8vanNwZXJmLmNvbS9nZXRhbGwtdnMtc2l6emxlLzJcblx0XHRcdGRlc3RFbGVtZW50cyA9IGdldEFsbCggY2xvbmUgKTtcblx0XHRcdHNyY0VsZW1lbnRzID0gZ2V0QWxsKCBlbGVtICk7XG5cblx0XHRcdGZvciAoIGkgPSAwLCBsID0gc3JjRWxlbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRmaXhJbnB1dCggc3JjRWxlbWVudHNbIGkgXSwgZGVzdEVsZW1lbnRzWyBpIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDb3B5IHRoZSBldmVudHMgZnJvbSB0aGUgb3JpZ2luYWwgdG8gdGhlIGNsb25lXG5cdFx0aWYgKCBkYXRhQW5kRXZlbnRzICkge1xuXHRcdFx0aWYgKCBkZWVwRGF0YUFuZEV2ZW50cyApIHtcblx0XHRcdFx0c3JjRWxlbWVudHMgPSBzcmNFbGVtZW50cyB8fCBnZXRBbGwoIGVsZW0gKTtcblx0XHRcdFx0ZGVzdEVsZW1lbnRzID0gZGVzdEVsZW1lbnRzIHx8IGdldEFsbCggY2xvbmUgKTtcblxuXHRcdFx0XHRmb3IgKCBpID0gMCwgbCA9IHNyY0VsZW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdFx0XHRjbG9uZUNvcHlFdmVudCggc3JjRWxlbWVudHNbIGkgXSwgZGVzdEVsZW1lbnRzWyBpIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xvbmVDb3B5RXZlbnQoIGVsZW0sIGNsb25lICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUHJlc2VydmUgc2NyaXB0IGV2YWx1YXRpb24gaGlzdG9yeVxuXHRcdGRlc3RFbGVtZW50cyA9IGdldEFsbCggY2xvbmUsIFwic2NyaXB0XCIgKTtcblx0XHRpZiAoIGRlc3RFbGVtZW50cy5sZW5ndGggPiAwICkge1xuXHRcdFx0c2V0R2xvYmFsRXZhbCggZGVzdEVsZW1lbnRzLCAhaW5QYWdlICYmIGdldEFsbCggZWxlbSwgXCJzY3JpcHRcIiApICk7XG5cdFx0fVxuXG5cdFx0Ly8gUmV0dXJuIHRoZSBjbG9uZWQgc2V0XG5cdFx0cmV0dXJuIGNsb25lO1xuXHR9LFxuXG5cdGJ1aWxkRnJhZ21lbnQ6IGZ1bmN0aW9uKCBlbGVtcywgY29udGV4dCwgc2NyaXB0cywgc2VsZWN0aW9uICkge1xuXHRcdHZhciBlbGVtLCB0bXAsIHRhZywgd3JhcCwgY29udGFpbnMsIGosXG5cdFx0XHRpID0gMCxcblx0XHRcdGwgPSBlbGVtcy5sZW5ndGgsXG5cdFx0XHRmcmFnbWVudCA9IGNvbnRleHQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuXHRcdFx0bm9kZXMgPSBbXTtcblxuXHRcdGZvciAoIDsgaSA8IGw7IGkrKyApIHtcblx0XHRcdGVsZW0gPSBlbGVtc1sgaSBdO1xuXG5cdFx0XHRpZiAoIGVsZW0gfHwgZWxlbSA9PT0gMCApIHtcblxuXHRcdFx0XHQvLyBBZGQgbm9kZXMgZGlyZWN0bHlcblx0XHRcdFx0aWYgKCBqUXVlcnkudHlwZSggZWxlbSApID09PSBcIm9iamVjdFwiICkge1xuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IFF0V2ViS2l0XG5cdFx0XHRcdFx0Ly8galF1ZXJ5Lm1lcmdlIGJlY2F1c2UgY29yZV9wdXNoLmFwcGx5KF8sIGFycmF5bGlrZSkgdGhyb3dzXG5cdFx0XHRcdFx0alF1ZXJ5Lm1lcmdlKCBub2RlcywgZWxlbS5ub2RlVHlwZSA/IFsgZWxlbSBdIDogZWxlbSApO1xuXG5cdFx0XHRcdC8vIENvbnZlcnQgbm9uLWh0bWwgaW50byBhIHRleHQgbm9kZVxuXHRcdFx0XHR9IGVsc2UgaWYgKCAhcmh0bWwudGVzdCggZWxlbSApICkge1xuXHRcdFx0XHRcdG5vZGVzLnB1c2goIGNvbnRleHQuY3JlYXRlVGV4dE5vZGUoIGVsZW0gKSApO1xuXG5cdFx0XHRcdC8vIENvbnZlcnQgaHRtbCBpbnRvIERPTSBub2Rlc1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRtcCA9IHRtcCB8fCBmcmFnbWVudC5hcHBlbmRDaGlsZCggY29udGV4dC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpICk7XG5cblx0XHRcdFx0XHQvLyBEZXNlcmlhbGl6ZSBhIHN0YW5kYXJkIHJlcHJlc2VudGF0aW9uXG5cdFx0XHRcdFx0dGFnID0gKCBydGFnTmFtZS5leGVjKCBlbGVtICkgfHwgW1wiXCIsIFwiXCJdIClbIDEgXS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdHdyYXAgPSB3cmFwTWFwWyB0YWcgXSB8fCB3cmFwTWFwLl9kZWZhdWx0O1xuXHRcdFx0XHRcdHRtcC5pbm5lckhUTUwgPSB3cmFwWyAxIF0gKyBlbGVtLnJlcGxhY2UoIHJ4aHRtbFRhZywgXCI8JDE+PC8kMj5cIiApICsgd3JhcFsgMiBdO1xuXG5cdFx0XHRcdFx0Ly8gRGVzY2VuZCB0aHJvdWdoIHdyYXBwZXJzIHRvIHRoZSByaWdodCBjb250ZW50XG5cdFx0XHRcdFx0aiA9IHdyYXBbIDAgXTtcblx0XHRcdFx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdFx0XHRcdHRtcCA9IHRtcC5sYXN0Q2hpbGQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogUXRXZWJLaXRcblx0XHRcdFx0XHQvLyBqUXVlcnkubWVyZ2UgYmVjYXVzZSBjb3JlX3B1c2guYXBwbHkoXywgYXJyYXlsaWtlKSB0aHJvd3Ncblx0XHRcdFx0XHRqUXVlcnkubWVyZ2UoIG5vZGVzLCB0bXAuY2hpbGROb2RlcyApO1xuXG5cdFx0XHRcdFx0Ly8gUmVtZW1iZXIgdGhlIHRvcC1sZXZlbCBjb250YWluZXJcblx0XHRcdFx0XHR0bXAgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuXG5cdFx0XHRcdFx0Ly8gRml4ZXMgIzEyMzQ2XG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogV2Via2l0LCBJRVxuXHRcdFx0XHRcdHRtcC50ZXh0Q29udGVudCA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgd3JhcHBlciBmcm9tIGZyYWdtZW50XG5cdFx0ZnJhZ21lbnQudGV4dENvbnRlbnQgPSBcIlwiO1xuXG5cdFx0aSA9IDA7XG5cdFx0d2hpbGUgKCAoZWxlbSA9IG5vZGVzWyBpKysgXSkgKSB7XG5cblx0XHRcdC8vICM0MDg3IC0gSWYgb3JpZ2luIGFuZCBkZXN0aW5hdGlvbiBlbGVtZW50cyBhcmUgdGhlIHNhbWUsIGFuZCB0aGlzIGlzXG5cdFx0XHQvLyB0aGF0IGVsZW1lbnQsIGRvIG5vdCBkbyBhbnl0aGluZ1xuXHRcdFx0aWYgKCBzZWxlY3Rpb24gJiYgalF1ZXJ5LmluQXJyYXkoIGVsZW0sIHNlbGVjdGlvbiApICE9PSAtMSApIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnRhaW5zID0galF1ZXJ5LmNvbnRhaW5zKCBlbGVtLm93bmVyRG9jdW1lbnQsIGVsZW0gKTtcblxuXHRcdFx0Ly8gQXBwZW5kIHRvIGZyYWdtZW50XG5cdFx0XHR0bXAgPSBnZXRBbGwoIGZyYWdtZW50LmFwcGVuZENoaWxkKCBlbGVtICksIFwic2NyaXB0XCIgKTtcblxuXHRcdFx0Ly8gUHJlc2VydmUgc2NyaXB0IGV2YWx1YXRpb24gaGlzdG9yeVxuXHRcdFx0aWYgKCBjb250YWlucyApIHtcblx0XHRcdFx0c2V0R2xvYmFsRXZhbCggdG1wICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENhcHR1cmUgZXhlY3V0YWJsZXNcblx0XHRcdGlmICggc2NyaXB0cyApIHtcblx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdHdoaWxlICggKGVsZW0gPSB0bXBbIGorKyBdKSApIHtcblx0XHRcdFx0XHRpZiAoIHJzY3JpcHRUeXBlLnRlc3QoIGVsZW0udHlwZSB8fCBcIlwiICkgKSB7XG5cdFx0XHRcdFx0XHRzY3JpcHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZnJhZ21lbnQ7XG5cdH0sXG5cblx0Y2xlYW5EYXRhOiBmdW5jdGlvbiggZWxlbXMgKSB7XG5cdFx0dmFyIGRhdGEsIGVsZW0sIGV2ZW50cywgdHlwZSwga2V5LCBqLFxuXHRcdFx0c3BlY2lhbCA9IGpRdWVyeS5ldmVudC5zcGVjaWFsLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRmb3IgKCA7IChlbGVtID0gZWxlbXNbIGkgXSkgIT09IHVuZGVmaW5lZDsgaSsrICkge1xuXHRcdFx0aWYgKCBEYXRhLmFjY2VwdHMoIGVsZW0gKSApIHtcblx0XHRcdFx0a2V5ID0gZWxlbVsgZGF0YV9wcml2LmV4cGFuZG8gXTtcblxuXHRcdFx0XHRpZiAoIGtleSAmJiAoZGF0YSA9IGRhdGFfcHJpdi5jYWNoZVsga2V5IF0pICkge1xuXHRcdFx0XHRcdGV2ZW50cyA9IE9iamVjdC5rZXlzKCBkYXRhLmV2ZW50cyB8fCB7fSApO1xuXHRcdFx0XHRcdGlmICggZXZlbnRzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdGZvciAoIGogPSAwOyAodHlwZSA9IGV2ZW50c1tqXSkgIT09IHVuZGVmaW5lZDsgaisrICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHNwZWNpYWxbIHR5cGUgXSApIHtcblx0XHRcdFx0XHRcdFx0XHRqUXVlcnkuZXZlbnQucmVtb3ZlKCBlbGVtLCB0eXBlICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyBhIHNob3J0Y3V0IHRvIGF2b2lkIGpRdWVyeS5ldmVudC5yZW1vdmUncyBvdmVyaGVhZFxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGpRdWVyeS5yZW1vdmVFdmVudCggZWxlbSwgdHlwZSwgZGF0YS5oYW5kbGUgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIGRhdGFfcHJpdi5jYWNoZVsga2V5IF0gKSB7XG5cdFx0XHRcdFx0XHQvLyBEaXNjYXJkIGFueSByZW1haW5pbmcgYHByaXZhdGVgIGRhdGFcblx0XHRcdFx0XHRcdGRlbGV0ZSBkYXRhX3ByaXYuY2FjaGVbIGtleSBdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gRGlzY2FyZCBhbnkgcmVtYWluaW5nIGB1c2VyYCBkYXRhXG5cdFx0XHRkZWxldGUgZGF0YV91c2VyLmNhY2hlWyBlbGVtWyBkYXRhX3VzZXIuZXhwYW5kbyBdIF07XG5cdFx0fVxuXHR9LFxuXG5cdF9ldmFsVXJsOiBmdW5jdGlvbiggdXJsICkge1xuXHRcdHJldHVybiBqUXVlcnkuYWpheCh7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHRkYXRhVHlwZTogXCJzY3JpcHRcIixcblx0XHRcdGFzeW5jOiBmYWxzZSxcblx0XHRcdGdsb2JhbDogZmFsc2UsXG5cdFx0XHRcInRocm93c1wiOiB0cnVlXG5cdFx0fSk7XG5cdH1cbn0pO1xuXG4vLyBTdXBwb3J0OiAxLnggY29tcGF0aWJpbGl0eVxuLy8gTWFuaXB1bGF0aW5nIHRhYmxlcyByZXF1aXJlcyBhIHRib2R5XG5mdW5jdGlvbiBtYW5pcHVsYXRpb25UYXJnZXQoIGVsZW0sIGNvbnRlbnQgKSB7XG5cdHJldHVybiBqUXVlcnkubm9kZU5hbWUoIGVsZW0sIFwidGFibGVcIiApICYmXG5cdFx0alF1ZXJ5Lm5vZGVOYW1lKCBjb250ZW50Lm5vZGVUeXBlID09PSAxID8gY29udGVudCA6IGNvbnRlbnQuZmlyc3RDaGlsZCwgXCJ0clwiICkgP1xuXG5cdFx0ZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdIHx8XG5cdFx0XHRlbGVtLmFwcGVuZENoaWxkKCBlbGVtLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRib2R5XCIpICkgOlxuXHRcdGVsZW07XG59XG5cbi8vIFJlcGxhY2UvcmVzdG9yZSB0aGUgdHlwZSBhdHRyaWJ1dGUgb2Ygc2NyaXB0IGVsZW1lbnRzIGZvciBzYWZlIERPTSBtYW5pcHVsYXRpb25cbmZ1bmN0aW9uIGRpc2FibGVTY3JpcHQoIGVsZW0gKSB7XG5cdGVsZW0udHlwZSA9IChlbGVtLmdldEF0dHJpYnV0ZShcInR5cGVcIikgIT09IG51bGwpICsgXCIvXCIgKyBlbGVtLnR5cGU7XG5cdHJldHVybiBlbGVtO1xufVxuZnVuY3Rpb24gcmVzdG9yZVNjcmlwdCggZWxlbSApIHtcblx0dmFyIG1hdGNoID0gcnNjcmlwdFR5cGVNYXNrZWQuZXhlYyggZWxlbS50eXBlICk7XG5cblx0aWYgKCBtYXRjaCApIHtcblx0XHRlbGVtLnR5cGUgPSBtYXRjaFsgMSBdO1xuXHR9IGVsc2Uge1xuXHRcdGVsZW0ucmVtb3ZlQXR0cmlidXRlKFwidHlwZVwiKTtcblx0fVxuXG5cdHJldHVybiBlbGVtO1xufVxuXG4vLyBNYXJrIHNjcmlwdHMgYXMgaGF2aW5nIGFscmVhZHkgYmVlbiBldmFsdWF0ZWRcbmZ1bmN0aW9uIHNldEdsb2JhbEV2YWwoIGVsZW1zLCByZWZFbGVtZW50cyApIHtcblx0dmFyIGwgPSBlbGVtcy5sZW5ndGgsXG5cdFx0aSA9IDA7XG5cblx0Zm9yICggOyBpIDwgbDsgaSsrICkge1xuXHRcdGRhdGFfcHJpdi5zZXQoXG5cdFx0XHRlbGVtc1sgaSBdLCBcImdsb2JhbEV2YWxcIiwgIXJlZkVsZW1lbnRzIHx8IGRhdGFfcHJpdi5nZXQoIHJlZkVsZW1lbnRzWyBpIF0sIFwiZ2xvYmFsRXZhbFwiIClcblx0XHQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNsb25lQ29weUV2ZW50KCBzcmMsIGRlc3QgKSB7XG5cdHZhciBpLCBsLCB0eXBlLCBwZGF0YU9sZCwgcGRhdGFDdXIsIHVkYXRhT2xkLCB1ZGF0YUN1ciwgZXZlbnRzO1xuXG5cdGlmICggZGVzdC5ub2RlVHlwZSAhPT0gMSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyAxLiBDb3B5IHByaXZhdGUgZGF0YTogZXZlbnRzLCBoYW5kbGVycywgZXRjLlxuXHRpZiAoIGRhdGFfcHJpdi5oYXNEYXRhKCBzcmMgKSApIHtcblx0XHRwZGF0YU9sZCA9IGRhdGFfcHJpdi5hY2Nlc3MoIHNyYyApO1xuXHRcdHBkYXRhQ3VyID0gZGF0YV9wcml2LnNldCggZGVzdCwgcGRhdGFPbGQgKTtcblx0XHRldmVudHMgPSBwZGF0YU9sZC5ldmVudHM7XG5cblx0XHRpZiAoIGV2ZW50cyApIHtcblx0XHRcdGRlbGV0ZSBwZGF0YUN1ci5oYW5kbGU7XG5cdFx0XHRwZGF0YUN1ci5ldmVudHMgPSB7fTtcblxuXHRcdFx0Zm9yICggdHlwZSBpbiBldmVudHMgKSB7XG5cdFx0XHRcdGZvciAoIGkgPSAwLCBsID0gZXZlbnRzWyB0eXBlIF0ubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuXHRcdFx0XHRcdGpRdWVyeS5ldmVudC5hZGQoIGRlc3QsIHR5cGUsIGV2ZW50c1sgdHlwZSBdWyBpIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIDIuIENvcHkgdXNlciBkYXRhXG5cdGlmICggZGF0YV91c2VyLmhhc0RhdGEoIHNyYyApICkge1xuXHRcdHVkYXRhT2xkID0gZGF0YV91c2VyLmFjY2Vzcyggc3JjICk7XG5cdFx0dWRhdGFDdXIgPSBqUXVlcnkuZXh0ZW5kKCB7fSwgdWRhdGFPbGQgKTtcblxuXHRcdGRhdGFfdXNlci5zZXQoIGRlc3QsIHVkYXRhQ3VyICk7XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBnZXRBbGwoIGNvbnRleHQsIHRhZyApIHtcblx0dmFyIHJldCA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPyBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgfHwgXCIqXCIgKSA6XG5cdFx0XHRjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwgPyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRhZyB8fCBcIipcIiApIDpcblx0XHRcdFtdO1xuXG5cdHJldHVybiB0YWcgPT09IHVuZGVmaW5lZCB8fCB0YWcgJiYgalF1ZXJ5Lm5vZGVOYW1lKCBjb250ZXh0LCB0YWcgKSA/XG5cdFx0alF1ZXJ5Lm1lcmdlKCBbIGNvbnRleHQgXSwgcmV0ICkgOlxuXHRcdHJldDtcbn1cblxuLy8gU3VwcG9ydDogSUUgPj0gOVxuZnVuY3Rpb24gZml4SW5wdXQoIHNyYywgZGVzdCApIHtcblx0dmFyIG5vZGVOYW1lID0gZGVzdC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdC8vIEZhaWxzIHRvIHBlcnNpc3QgdGhlIGNoZWNrZWQgc3RhdGUgb2YgYSBjbG9uZWQgY2hlY2tib3ggb3IgcmFkaW8gYnV0dG9uLlxuXHRpZiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgJiYgbWFuaXB1bGF0aW9uX3JjaGVja2FibGVUeXBlLnRlc3QoIHNyYy50eXBlICkgKSB7XG5cdFx0ZGVzdC5jaGVja2VkID0gc3JjLmNoZWNrZWQ7XG5cblx0Ly8gRmFpbHMgdG8gcmV0dXJuIHRoZSBzZWxlY3RlZCBvcHRpb24gdG8gdGhlIGRlZmF1bHQgc2VsZWN0ZWQgc3RhdGUgd2hlbiBjbG9uaW5nIG9wdGlvbnNcblx0fSBlbHNlIGlmICggbm9kZU5hbWUgPT09IFwiaW5wdXRcIiB8fCBub2RlTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiICkge1xuXHRcdGRlc3QuZGVmYXVsdFZhbHVlID0gc3JjLmRlZmF1bHRWYWx1ZTtcblx0fVxufVxualF1ZXJ5LmZuLmV4dGVuZCh7XG5cdHdyYXBBbGw6IGZ1bmN0aW9uKCBodG1sICkge1xuXHRcdHZhciB3cmFwO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggaHRtbCApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaSApIHtcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkud3JhcEFsbCggaHRtbC5jYWxsKHRoaXMsIGkpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXNbIDAgXSApIHtcblxuXHRcdFx0Ly8gVGhlIGVsZW1lbnRzIHRvIHdyYXAgdGhlIHRhcmdldCBhcm91bmRcblx0XHRcdHdyYXAgPSBqUXVlcnkoIGh0bWwsIHRoaXNbIDAgXS5vd25lckRvY3VtZW50ICkuZXEoIDAgKS5jbG9uZSggdHJ1ZSApO1xuXG5cdFx0XHRpZiAoIHRoaXNbIDAgXS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHR3cmFwLmluc2VydEJlZm9yZSggdGhpc1sgMCBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHdyYXAubWFwKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IHRoaXM7XG5cblx0XHRcdFx0d2hpbGUgKCBlbGVtLmZpcnN0RWxlbWVudENoaWxkICkge1xuXHRcdFx0XHRcdGVsZW0gPSBlbGVtLmZpcnN0RWxlbWVudENoaWxkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGVsZW07XG5cdFx0XHR9KS5hcHBlbmQoIHRoaXMgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHR3cmFwSW5uZXI6IGZ1bmN0aW9uKCBodG1sICkge1xuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIGh0bWwgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLndyYXBJbm5lciggaHRtbC5jYWxsKHRoaXMsIGkpICk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGYgPSBqUXVlcnkoIHRoaXMgKSxcblx0XHRcdFx0Y29udGVudHMgPSBzZWxmLmNvbnRlbnRzKCk7XG5cblx0XHRcdGlmICggY29udGVudHMubGVuZ3RoICkge1xuXHRcdFx0XHRjb250ZW50cy53cmFwQWxsKCBodG1sICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlbGYuYXBwZW5kKCBodG1sICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0d3JhcDogZnVuY3Rpb24oIGh0bWwgKSB7XG5cdFx0dmFyIGlzRnVuY3Rpb24gPSBqUXVlcnkuaXNGdW5jdGlvbiggaHRtbCApO1xuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiggaSApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLndyYXBBbGwoIGlzRnVuY3Rpb24gPyBodG1sLmNhbGwodGhpcywgaSkgOiBodG1sICk7XG5cdFx0fSk7XG5cdH0sXG5cblx0dW53cmFwOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5wYXJlbnQoKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhalF1ZXJ5Lm5vZGVOYW1lKCB0aGlzLCBcImJvZHlcIiApICkge1xuXHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5yZXBsYWNlV2l0aCggdGhpcy5jaGlsZE5vZGVzICk7XG5cdFx0XHR9XG5cdFx0fSkuZW5kKCk7XG5cdH1cbn0pO1xudmFyIGN1ckNTUywgaWZyYW1lLFxuXHQvLyBzd2FwcGFibGUgaWYgZGlzcGxheSBpcyBub25lIG9yIHN0YXJ0cyB3aXRoIHRhYmxlIGV4Y2VwdCBcInRhYmxlXCIsIFwidGFibGUtY2VsbFwiLCBvciBcInRhYmxlLWNhcHRpb25cIlxuXHQvLyBzZWUgaGVyZSBmb3IgZGlzcGxheSB2YWx1ZXM6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvQ1NTL2Rpc3BsYXlcblx0cmRpc3BsYXlzd2FwID0gL14obm9uZXx0YWJsZSg/IS1jW2VhXSkuKykvLFxuXHRybWFyZ2luID0gL15tYXJnaW4vLFxuXHRybnVtc3BsaXQgPSBuZXcgUmVnRXhwKCBcIl4oXCIgKyBjb3JlX3BudW0gKyBcIikoLiopJFwiLCBcImlcIiApLFxuXHRybnVtbm9ucHggPSBuZXcgUmVnRXhwKCBcIl4oXCIgKyBjb3JlX3BudW0gKyBcIikoPyFweClbYS16JV0rJFwiLCBcImlcIiApLFxuXHRycmVsTnVtID0gbmV3IFJlZ0V4cCggXCJeKFsrLV0pPShcIiArIGNvcmVfcG51bSArIFwiKVwiLCBcImlcIiApLFxuXHRlbGVtZGlzcGxheSA9IHsgQk9EWTogXCJibG9ja1wiIH0sXG5cblx0Y3NzU2hvdyA9IHsgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgZGlzcGxheTogXCJibG9ja1wiIH0sXG5cdGNzc05vcm1hbFRyYW5zZm9ybSA9IHtcblx0XHRsZXR0ZXJTcGFjaW5nOiAwLFxuXHRcdGZvbnRXZWlnaHQ6IDQwMFxuXHR9LFxuXG5cdGNzc0V4cGFuZCA9IFsgXCJUb3BcIiwgXCJSaWdodFwiLCBcIkJvdHRvbVwiLCBcIkxlZnRcIiBdLFxuXHRjc3NQcmVmaXhlcyA9IFsgXCJXZWJraXRcIiwgXCJPXCIsIFwiTW96XCIsIFwibXNcIiBdO1xuXG4vLyByZXR1cm4gYSBjc3MgcHJvcGVydHkgbWFwcGVkIHRvIGEgcG90ZW50aWFsbHkgdmVuZG9yIHByZWZpeGVkIHByb3BlcnR5XG5mdW5jdGlvbiB2ZW5kb3JQcm9wTmFtZSggc3R5bGUsIG5hbWUgKSB7XG5cblx0Ly8gc2hvcnRjdXQgZm9yIG5hbWVzIHRoYXQgYXJlIG5vdCB2ZW5kb3IgcHJlZml4ZWRcblx0aWYgKCBuYW1lIGluIHN0eWxlICkge1xuXHRcdHJldHVybiBuYW1lO1xuXHR9XG5cblx0Ly8gY2hlY2sgZm9yIHZlbmRvciBwcmVmaXhlZCBuYW1lc1xuXHR2YXIgY2FwTmFtZSA9IG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpLFxuXHRcdG9yaWdOYW1lID0gbmFtZSxcblx0XHRpID0gY3NzUHJlZml4ZXMubGVuZ3RoO1xuXG5cdHdoaWxlICggaS0tICkge1xuXHRcdG5hbWUgPSBjc3NQcmVmaXhlc1sgaSBdICsgY2FwTmFtZTtcblx0XHRpZiAoIG5hbWUgaW4gc3R5bGUgKSB7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb3JpZ05hbWU7XG59XG5cbmZ1bmN0aW9uIGlzSGlkZGVuKCBlbGVtLCBlbCApIHtcblx0Ly8gaXNIaWRkZW4gbWlnaHQgYmUgY2FsbGVkIGZyb20galF1ZXJ5I2ZpbHRlciBmdW5jdGlvbjtcblx0Ly8gaW4gdGhhdCBjYXNlLCBlbGVtZW50IHdpbGwgYmUgc2Vjb25kIGFyZ3VtZW50XG5cdGVsZW0gPSBlbCB8fCBlbGVtO1xuXHRyZXR1cm4galF1ZXJ5LmNzcyggZWxlbSwgXCJkaXNwbGF5XCIgKSA9PT0gXCJub25lXCIgfHwgIWpRdWVyeS5jb250YWlucyggZWxlbS5vd25lckRvY3VtZW50LCBlbGVtICk7XG59XG5cbi8vIE5PVEU6IHdlJ3ZlIGluY2x1ZGVkIHRoZSBcIndpbmRvd1wiIGluIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlXG4vLyBiZWNhdXNlIGpzZG9tIG9uIG5vZGUuanMgd2lsbCBicmVhayB3aXRob3V0IGl0LlxuZnVuY3Rpb24gZ2V0U3R5bGVzKCBlbGVtICkge1xuXHRyZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGVsZW0sIG51bGwgKTtcbn1cblxuZnVuY3Rpb24gc2hvd0hpZGUoIGVsZW1lbnRzLCBzaG93ICkge1xuXHR2YXIgZGlzcGxheSwgZWxlbSwgaGlkZGVuLFxuXHRcdHZhbHVlcyA9IFtdLFxuXHRcdGluZGV4ID0gMCxcblx0XHRsZW5ndGggPSBlbGVtZW50cy5sZW5ndGg7XG5cblx0Zm9yICggOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRlbGVtID0gZWxlbWVudHNbIGluZGV4IF07XG5cdFx0aWYgKCAhZWxlbS5zdHlsZSApIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdHZhbHVlc1sgaW5kZXggXSA9IGRhdGFfcHJpdi5nZXQoIGVsZW0sIFwib2xkZGlzcGxheVwiICk7XG5cdFx0ZGlzcGxheSA9IGVsZW0uc3R5bGUuZGlzcGxheTtcblx0XHRpZiAoIHNob3cgKSB7XG5cdFx0XHQvLyBSZXNldCB0aGUgaW5saW5lIGRpc3BsYXkgb2YgdGhpcyBlbGVtZW50IHRvIGxlYXJuIGlmIGl0IGlzXG5cdFx0XHQvLyBiZWluZyBoaWRkZW4gYnkgY2FzY2FkZWQgcnVsZXMgb3Igbm90XG5cdFx0XHRpZiAoICF2YWx1ZXNbIGluZGV4IF0gJiYgZGlzcGxheSA9PT0gXCJub25lXCIgKSB7XG5cdFx0XHRcdGVsZW0uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldCBlbGVtZW50cyB3aGljaCBoYXZlIGJlZW4gb3ZlcnJpZGRlbiB3aXRoIGRpc3BsYXk6IG5vbmVcblx0XHRcdC8vIGluIGEgc3R5bGVzaGVldCB0byB3aGF0ZXZlciB0aGUgZGVmYXVsdCBicm93c2VyIHN0eWxlIGlzXG5cdFx0XHQvLyBmb3Igc3VjaCBhbiBlbGVtZW50XG5cdFx0XHRpZiAoIGVsZW0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIiAmJiBpc0hpZGRlbiggZWxlbSApICkge1xuXHRcdFx0XHR2YWx1ZXNbIGluZGV4IF0gPSBkYXRhX3ByaXYuYWNjZXNzKCBlbGVtLCBcIm9sZGRpc3BsYXlcIiwgY3NzX2RlZmF1bHREaXNwbGF5KGVsZW0ubm9kZU5hbWUpICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKCAhdmFsdWVzWyBpbmRleCBdICkge1xuXHRcdFx0XHRoaWRkZW4gPSBpc0hpZGRlbiggZWxlbSApO1xuXG5cdFx0XHRcdGlmICggZGlzcGxheSAmJiBkaXNwbGF5ICE9PSBcIm5vbmVcIiB8fCAhaGlkZGVuICkge1xuXHRcdFx0XHRcdGRhdGFfcHJpdi5zZXQoIGVsZW0sIFwib2xkZGlzcGxheVwiLCBoaWRkZW4gPyBkaXNwbGF5IDogalF1ZXJ5LmNzcyhlbGVtLCBcImRpc3BsYXlcIikgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFNldCB0aGUgZGlzcGxheSBvZiBtb3N0IG9mIHRoZSBlbGVtZW50cyBpbiBhIHNlY29uZCBsb29wXG5cdC8vIHRvIGF2b2lkIHRoZSBjb25zdGFudCByZWZsb3dcblx0Zm9yICggaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRlbGVtID0gZWxlbWVudHNbIGluZGV4IF07XG5cdFx0aWYgKCAhZWxlbS5zdHlsZSApIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRpZiAoICFzaG93IHx8IGVsZW0uc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgfHwgZWxlbS5zdHlsZS5kaXNwbGF5ID09PSBcIlwiICkge1xuXHRcdFx0ZWxlbS5zdHlsZS5kaXNwbGF5ID0gc2hvdyA/IHZhbHVlc1sgaW5kZXggXSB8fCBcIlwiIDogXCJub25lXCI7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRzO1xufVxuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0Y3NzOiBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5hY2Nlc3MoIHRoaXMsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCB2YWx1ZSApIHtcblx0XHRcdHZhciBzdHlsZXMsIGxlbixcblx0XHRcdFx0bWFwID0ge30sXG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHRpZiAoIGpRdWVyeS5pc0FycmF5KCBuYW1lICkgKSB7XG5cdFx0XHRcdHN0eWxlcyA9IGdldFN0eWxlcyggZWxlbSApO1xuXHRcdFx0XHRsZW4gPSBuYW1lLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0XHRtYXBbIG5hbWVbIGkgXSBdID0galF1ZXJ5LmNzcyggZWxlbSwgbmFtZVsgaSBdLCBmYWxzZSwgc3R5bGVzICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/XG5cdFx0XHRcdGpRdWVyeS5zdHlsZSggZWxlbSwgbmFtZSwgdmFsdWUgKSA6XG5cdFx0XHRcdGpRdWVyeS5jc3MoIGVsZW0sIG5hbWUgKTtcblx0XHR9LCBuYW1lLCB2YWx1ZSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgKTtcblx0fSxcblx0c2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNob3dIaWRlKCB0aGlzLCB0cnVlICk7XG5cdH0sXG5cdGhpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzaG93SGlkZSggdGhpcyApO1xuXHR9LFxuXHR0b2dnbGU6IGZ1bmN0aW9uKCBzdGF0ZSApIHtcblx0XHRpZiAoIHR5cGVvZiBzdGF0ZSA9PT0gXCJib29sZWFuXCIgKSB7XG5cdFx0XHRyZXR1cm4gc3RhdGUgPyB0aGlzLnNob3coKSA6IHRoaXMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIGlzSGlkZGVuKCB0aGlzICkgKSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXHQvLyBBZGQgaW4gc3R5bGUgcHJvcGVydHkgaG9va3MgZm9yIG92ZXJyaWRpbmcgdGhlIGRlZmF1bHRcblx0Ly8gYmVoYXZpb3Igb2YgZ2V0dGluZyBhbmQgc2V0dGluZyBhIHN0eWxlIHByb3BlcnR5XG5cdGNzc0hvb2tzOiB7XG5cdFx0b3BhY2l0eToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiggZWxlbSwgY29tcHV0ZWQgKSB7XG5cdFx0XHRcdGlmICggY29tcHV0ZWQgKSB7XG5cdFx0XHRcdFx0Ly8gV2Ugc2hvdWxkIGFsd2F5cyBnZXQgYSBudW1iZXIgYmFjayBmcm9tIG9wYWNpdHlcblx0XHRcdFx0XHR2YXIgcmV0ID0gY3VyQ1NTKCBlbGVtLCBcIm9wYWNpdHlcIiApO1xuXHRcdFx0XHRcdHJldHVybiByZXQgPT09IFwiXCIgPyBcIjFcIiA6IHJldDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvLyBEb24ndCBhdXRvbWF0aWNhbGx5IGFkZCBcInB4XCIgdG8gdGhlc2UgcG9zc2libHktdW5pdGxlc3MgcHJvcGVydGllc1xuXHRjc3NOdW1iZXI6IHtcblx0XHRcImNvbHVtbkNvdW50XCI6IHRydWUsXG5cdFx0XCJmaWxsT3BhY2l0eVwiOiB0cnVlLFxuXHRcdFwiZm9udFdlaWdodFwiOiB0cnVlLFxuXHRcdFwibGluZUhlaWdodFwiOiB0cnVlLFxuXHRcdFwib3BhY2l0eVwiOiB0cnVlLFxuXHRcdFwib3JkZXJcIjogdHJ1ZSxcblx0XHRcIm9ycGhhbnNcIjogdHJ1ZSxcblx0XHRcIndpZG93c1wiOiB0cnVlLFxuXHRcdFwiekluZGV4XCI6IHRydWUsXG5cdFx0XCJ6b29tXCI6IHRydWVcblx0fSxcblxuXHQvLyBBZGQgaW4gcHJvcGVydGllcyB3aG9zZSBuYW1lcyB5b3Ugd2lzaCB0byBmaXggYmVmb3JlXG5cdC8vIHNldHRpbmcgb3IgZ2V0dGluZyB0aGUgdmFsdWVcblx0Y3NzUHJvcHM6IHtcblx0XHQvLyBub3JtYWxpemUgZmxvYXQgY3NzIHByb3BlcnR5XG5cdFx0XCJmbG9hdFwiOiBcImNzc0Zsb2F0XCJcblx0fSxcblxuXHQvLyBHZXQgYW5kIHNldCB0aGUgc3R5bGUgcHJvcGVydHkgb24gYSBET00gTm9kZVxuXHRzdHlsZTogZnVuY3Rpb24oIGVsZW0sIG5hbWUsIHZhbHVlLCBleHRyYSApIHtcblx0XHQvLyBEb24ndCBzZXQgc3R5bGVzIG9uIHRleHQgYW5kIGNvbW1lbnQgbm9kZXNcblx0XHRpZiAoICFlbGVtIHx8IGVsZW0ubm9kZVR5cGUgPT09IDMgfHwgZWxlbS5ub2RlVHlwZSA9PT0gOCB8fCAhZWxlbS5zdHlsZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIHJpZ2h0IG5hbWVcblx0XHR2YXIgcmV0LCB0eXBlLCBob29rcyxcblx0XHRcdG9yaWdOYW1lID0galF1ZXJ5LmNhbWVsQ2FzZSggbmFtZSApLFxuXHRcdFx0c3R5bGUgPSBlbGVtLnN0eWxlO1xuXG5cdFx0bmFtZSA9IGpRdWVyeS5jc3NQcm9wc1sgb3JpZ05hbWUgXSB8fCAoIGpRdWVyeS5jc3NQcm9wc1sgb3JpZ05hbWUgXSA9IHZlbmRvclByb3BOYW1lKCBzdHlsZSwgb3JpZ05hbWUgKSApO1xuXG5cdFx0Ly8gZ2V0cyBob29rIGZvciB0aGUgcHJlZml4ZWQgdmVyc2lvblxuXHRcdC8vIGZvbGxvd2VkIGJ5IHRoZSB1bnByZWZpeGVkIHZlcnNpb25cblx0XHRob29rcyA9IGpRdWVyeS5jc3NIb29rc1sgbmFtZSBdIHx8IGpRdWVyeS5jc3NIb29rc1sgb3JpZ05hbWUgXTtcblxuXHRcdC8vIENoZWNrIGlmIHdlJ3JlIHNldHRpbmcgYSB2YWx1ZVxuXHRcdGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cblx0XHRcdC8vIGNvbnZlcnQgcmVsYXRpdmUgbnVtYmVyIHN0cmluZ3MgKCs9IG9yIC09KSB0byByZWxhdGl2ZSBudW1iZXJzLiAjNzM0NVxuXHRcdFx0aWYgKCB0eXBlID09PSBcInN0cmluZ1wiICYmIChyZXQgPSBycmVsTnVtLmV4ZWMoIHZhbHVlICkpICkge1xuXHRcdFx0XHR2YWx1ZSA9ICggcmV0WzFdICsgMSApICogcmV0WzJdICsgcGFyc2VGbG9hdCggalF1ZXJ5LmNzcyggZWxlbSwgbmFtZSApICk7XG5cdFx0XHRcdC8vIEZpeGVzIGJ1ZyAjOTIzN1xuXHRcdFx0XHR0eXBlID0gXCJudW1iZXJcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgTmFOIGFuZCBudWxsIHZhbHVlcyBhcmVuJ3Qgc2V0LiBTZWU6ICM3MTE2XG5cdFx0XHRpZiAoIHZhbHVlID09IG51bGwgfHwgdHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpc05hTiggdmFsdWUgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBhIG51bWJlciB3YXMgcGFzc2VkIGluLCBhZGQgJ3B4JyB0byB0aGUgKGV4Y2VwdCBmb3IgY2VydGFpbiBDU1MgcHJvcGVydGllcylcblx0XHRcdGlmICggdHlwZSA9PT0gXCJudW1iZXJcIiAmJiAhalF1ZXJ5LmNzc051bWJlclsgb3JpZ05hbWUgXSApIHtcblx0XHRcdFx0dmFsdWUgKz0gXCJweFwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGaXhlcyAjODkwOCwgaXQgY2FuIGJlIGRvbmUgbW9yZSBjb3JyZWN0bHkgYnkgc3BlY2lmeWluZyBzZXR0ZXJzIGluIGNzc0hvb2tzLFxuXHRcdFx0Ly8gYnV0IGl0IHdvdWxkIG1lYW4gdG8gZGVmaW5lIGVpZ2h0IChmb3IgZXZlcnkgcHJvYmxlbWF0aWMgcHJvcGVydHkpIGlkZW50aWNhbCBmdW5jdGlvbnNcblx0XHRcdGlmICggIWpRdWVyeS5zdXBwb3J0LmNsZWFyQ2xvbmVTdHlsZSAmJiB2YWx1ZSA9PT0gXCJcIiAmJiBuYW1lLmluZGV4T2YoXCJiYWNrZ3JvdW5kXCIpID09PSAwICkge1xuXHRcdFx0XHRzdHlsZVsgbmFtZSBdID0gXCJpbmhlcml0XCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGEgaG9vayB3YXMgcHJvdmlkZWQsIHVzZSB0aGF0IHZhbHVlLCBvdGhlcndpc2UganVzdCBzZXQgdGhlIHNwZWNpZmllZCB2YWx1ZVxuXHRcdFx0aWYgKCAhaG9va3MgfHwgIShcInNldFwiIGluIGhvb2tzKSB8fCAodmFsdWUgPSBob29rcy5zZXQoIGVsZW0sIHZhbHVlLCBleHRyYSApKSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRzdHlsZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSWYgYSBob29rIHdhcyBwcm92aWRlZCBnZXQgdGhlIG5vbi1jb21wdXRlZCB2YWx1ZSBmcm9tIHRoZXJlXG5cdFx0XHRpZiAoIGhvb2tzICYmIFwiZ2V0XCIgaW4gaG9va3MgJiYgKHJldCA9IGhvb2tzLmdldCggZWxlbSwgZmFsc2UsIGV4dHJhICkpICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE90aGVyd2lzZSBqdXN0IGdldCB0aGUgdmFsdWUgZnJvbSB0aGUgc3R5bGUgb2JqZWN0XG5cdFx0XHRyZXR1cm4gc3R5bGVbIG5hbWUgXTtcblx0XHR9XG5cdH0sXG5cblx0Y3NzOiBmdW5jdGlvbiggZWxlbSwgbmFtZSwgZXh0cmEsIHN0eWxlcyApIHtcblx0XHR2YXIgdmFsLCBudW0sIGhvb2tzLFxuXHRcdFx0b3JpZ05hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBuYW1lICk7XG5cblx0XHQvLyBNYWtlIHN1cmUgdGhhdCB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIHJpZ2h0IG5hbWVcblx0XHRuYW1lID0galF1ZXJ5LmNzc1Byb3BzWyBvcmlnTmFtZSBdIHx8ICggalF1ZXJ5LmNzc1Byb3BzWyBvcmlnTmFtZSBdID0gdmVuZG9yUHJvcE5hbWUoIGVsZW0uc3R5bGUsIG9yaWdOYW1lICkgKTtcblxuXHRcdC8vIGdldHMgaG9vayBmb3IgdGhlIHByZWZpeGVkIHZlcnNpb25cblx0XHQvLyBmb2xsb3dlZCBieSB0aGUgdW5wcmVmaXhlZCB2ZXJzaW9uXG5cdFx0aG9va3MgPSBqUXVlcnkuY3NzSG9va3NbIG5hbWUgXSB8fCBqUXVlcnkuY3NzSG9va3NbIG9yaWdOYW1lIF07XG5cblx0XHQvLyBJZiBhIGhvb2sgd2FzIHByb3ZpZGVkIGdldCB0aGUgY29tcHV0ZWQgdmFsdWUgZnJvbSB0aGVyZVxuXHRcdGlmICggaG9va3MgJiYgXCJnZXRcIiBpbiBob29rcyApIHtcblx0XHRcdHZhbCA9IGhvb2tzLmdldCggZWxlbSwgdHJ1ZSwgZXh0cmEgKTtcblx0XHR9XG5cblx0XHQvLyBPdGhlcndpc2UsIGlmIGEgd2F5IHRvIGdldCB0aGUgY29tcHV0ZWQgdmFsdWUgZXhpc3RzLCB1c2UgdGhhdFxuXHRcdGlmICggdmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHR2YWwgPSBjdXJDU1MoIGVsZW0sIG5hbWUsIHN0eWxlcyApO1xuXHRcdH1cblxuXHRcdC8vY29udmVydCBcIm5vcm1hbFwiIHRvIGNvbXB1dGVkIHZhbHVlXG5cdFx0aWYgKCB2YWwgPT09IFwibm9ybWFsXCIgJiYgbmFtZSBpbiBjc3NOb3JtYWxUcmFuc2Zvcm0gKSB7XG5cdFx0XHR2YWwgPSBjc3NOb3JtYWxUcmFuc2Zvcm1bIG5hbWUgXTtcblx0XHR9XG5cblx0XHQvLyBSZXR1cm4sIGNvbnZlcnRpbmcgdG8gbnVtYmVyIGlmIGZvcmNlZCBvciBhIHF1YWxpZmllciB3YXMgcHJvdmlkZWQgYW5kIHZhbCBsb29rcyBudW1lcmljXG5cdFx0aWYgKCBleHRyYSA9PT0gXCJcIiB8fCBleHRyYSApIHtcblx0XHRcdG51bSA9IHBhcnNlRmxvYXQoIHZhbCApO1xuXHRcdFx0cmV0dXJuIGV4dHJhID09PSB0cnVlIHx8IGpRdWVyeS5pc051bWVyaWMoIG51bSApID8gbnVtIHx8IDAgOiB2YWw7XG5cdFx0fVxuXHRcdHJldHVybiB2YWw7XG5cdH1cbn0pO1xuXG5jdXJDU1MgPSBmdW5jdGlvbiggZWxlbSwgbmFtZSwgX2NvbXB1dGVkICkge1xuXHR2YXIgd2lkdGgsIG1pbldpZHRoLCBtYXhXaWR0aCxcblx0XHRjb21wdXRlZCA9IF9jb21wdXRlZCB8fCBnZXRTdHlsZXMoIGVsZW0gKSxcblxuXHRcdC8vIFN1cHBvcnQ6IElFOVxuXHRcdC8vIGdldFByb3BlcnR5VmFsdWUgaXMgb25seSBuZWVkZWQgZm9yIC5jc3MoJ2ZpbHRlcicpIGluIElFOSwgc2VlICMxMjUzN1xuXHRcdHJldCA9IGNvbXB1dGVkID8gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSggbmFtZSApIHx8IGNvbXB1dGVkWyBuYW1lIF0gOiB1bmRlZmluZWQsXG5cdFx0c3R5bGUgPSBlbGVtLnN0eWxlO1xuXG5cdGlmICggY29tcHV0ZWQgKSB7XG5cblx0XHRpZiAoIHJldCA9PT0gXCJcIiAmJiAhalF1ZXJ5LmNvbnRhaW5zKCBlbGVtLm93bmVyRG9jdW1lbnQsIGVsZW0gKSApIHtcblx0XHRcdHJldCA9IGpRdWVyeS5zdHlsZSggZWxlbSwgbmFtZSApO1xuXHRcdH1cblxuXHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA1LjFcblx0XHQvLyBBIHRyaWJ1dGUgdG8gdGhlIFwiYXdlc29tZSBoYWNrIGJ5IERlYW4gRWR3YXJkc1wiXG5cdFx0Ly8gU2FmYXJpIDUuMS43IChhdCBsZWFzdCkgcmV0dXJucyBwZXJjZW50YWdlIGZvciBhIGxhcmdlciBzZXQgb2YgdmFsdWVzLCBidXQgd2lkdGggc2VlbXMgdG8gYmUgcmVsaWFibHkgcGl4ZWxzXG5cdFx0Ly8gdGhpcyBpcyBhZ2FpbnN0IHRoZSBDU1NPTSBkcmFmdCBzcGVjOiBodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3NvbS8jcmVzb2x2ZWQtdmFsdWVzXG5cdFx0aWYgKCBybnVtbm9ucHgudGVzdCggcmV0ICkgJiYgcm1hcmdpbi50ZXN0KCBuYW1lICkgKSB7XG5cblx0XHRcdC8vIFJlbWVtYmVyIHRoZSBvcmlnaW5hbCB2YWx1ZXNcblx0XHRcdHdpZHRoID0gc3R5bGUud2lkdGg7XG5cdFx0XHRtaW5XaWR0aCA9IHN0eWxlLm1pbldpZHRoO1xuXHRcdFx0bWF4V2lkdGggPSBzdHlsZS5tYXhXaWR0aDtcblxuXHRcdFx0Ly8gUHV0IGluIHRoZSBuZXcgdmFsdWVzIHRvIGdldCBhIGNvbXB1dGVkIHZhbHVlIG91dFxuXHRcdFx0c3R5bGUubWluV2lkdGggPSBzdHlsZS5tYXhXaWR0aCA9IHN0eWxlLndpZHRoID0gcmV0O1xuXHRcdFx0cmV0ID0gY29tcHV0ZWQud2lkdGg7XG5cblx0XHRcdC8vIFJldmVydCB0aGUgY2hhbmdlZCB2YWx1ZXNcblx0XHRcdHN0eWxlLndpZHRoID0gd2lkdGg7XG5cdFx0XHRzdHlsZS5taW5XaWR0aCA9IG1pbldpZHRoO1xuXHRcdFx0c3R5bGUubWF4V2lkdGggPSBtYXhXaWR0aDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufTtcblxuXG5mdW5jdGlvbiBzZXRQb3NpdGl2ZU51bWJlciggZWxlbSwgdmFsdWUsIHN1YnRyYWN0ICkge1xuXHR2YXIgbWF0Y2hlcyA9IHJudW1zcGxpdC5leGVjKCB2YWx1ZSApO1xuXHRyZXR1cm4gbWF0Y2hlcyA/XG5cdFx0Ly8gR3VhcmQgYWdhaW5zdCB1bmRlZmluZWQgXCJzdWJ0cmFjdFwiLCBlLmcuLCB3aGVuIHVzZWQgYXMgaW4gY3NzSG9va3Ncblx0XHRNYXRoLm1heCggMCwgbWF0Y2hlc1sgMSBdIC0gKCBzdWJ0cmFjdCB8fCAwICkgKSArICggbWF0Y2hlc1sgMiBdIHx8IFwicHhcIiApIDpcblx0XHR2YWx1ZTtcbn1cblxuZnVuY3Rpb24gYXVnbWVudFdpZHRoT3JIZWlnaHQoIGVsZW0sIG5hbWUsIGV4dHJhLCBpc0JvcmRlckJveCwgc3R5bGVzICkge1xuXHR2YXIgaSA9IGV4dHJhID09PSAoIGlzQm9yZGVyQm94ID8gXCJib3JkZXJcIiA6IFwiY29udGVudFwiICkgP1xuXHRcdC8vIElmIHdlIGFscmVhZHkgaGF2ZSB0aGUgcmlnaHQgbWVhc3VyZW1lbnQsIGF2b2lkIGF1Z21lbnRhdGlvblxuXHRcdDQgOlxuXHRcdC8vIE90aGVyd2lzZSBpbml0aWFsaXplIGZvciBob3Jpem9udGFsIG9yIHZlcnRpY2FsIHByb3BlcnRpZXNcblx0XHRuYW1lID09PSBcIndpZHRoXCIgPyAxIDogMCxcblxuXHRcdHZhbCA9IDA7XG5cblx0Zm9yICggOyBpIDwgNDsgaSArPSAyICkge1xuXHRcdC8vIGJvdGggYm94IG1vZGVscyBleGNsdWRlIG1hcmdpbiwgc28gYWRkIGl0IGlmIHdlIHdhbnQgaXRcblx0XHRpZiAoIGV4dHJhID09PSBcIm1hcmdpblwiICkge1xuXHRcdFx0dmFsICs9IGpRdWVyeS5jc3MoIGVsZW0sIGV4dHJhICsgY3NzRXhwYW5kWyBpIF0sIHRydWUsIHN0eWxlcyApO1xuXHRcdH1cblxuXHRcdGlmICggaXNCb3JkZXJCb3ggKSB7XG5cdFx0XHQvLyBib3JkZXItYm94IGluY2x1ZGVzIHBhZGRpbmcsIHNvIHJlbW92ZSBpdCBpZiB3ZSB3YW50IGNvbnRlbnRcblx0XHRcdGlmICggZXh0cmEgPT09IFwiY29udGVudFwiICkge1xuXHRcdFx0XHR2YWwgLT0galF1ZXJ5LmNzcyggZWxlbSwgXCJwYWRkaW5nXCIgKyBjc3NFeHBhbmRbIGkgXSwgdHJ1ZSwgc3R5bGVzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGF0IHRoaXMgcG9pbnQsIGV4dHJhIGlzbid0IGJvcmRlciBub3IgbWFyZ2luLCBzbyByZW1vdmUgYm9yZGVyXG5cdFx0XHRpZiAoIGV4dHJhICE9PSBcIm1hcmdpblwiICkge1xuXHRcdFx0XHR2YWwgLT0galF1ZXJ5LmNzcyggZWxlbSwgXCJib3JkZXJcIiArIGNzc0V4cGFuZFsgaSBdICsgXCJXaWR0aFwiLCB0cnVlLCBzdHlsZXMgKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gYXQgdGhpcyBwb2ludCwgZXh0cmEgaXNuJ3QgY29udGVudCwgc28gYWRkIHBhZGRpbmdcblx0XHRcdHZhbCArPSBqUXVlcnkuY3NzKCBlbGVtLCBcInBhZGRpbmdcIiArIGNzc0V4cGFuZFsgaSBdLCB0cnVlLCBzdHlsZXMgKTtcblxuXHRcdFx0Ly8gYXQgdGhpcyBwb2ludCwgZXh0cmEgaXNuJ3QgY29udGVudCBub3IgcGFkZGluZywgc28gYWRkIGJvcmRlclxuXHRcdFx0aWYgKCBleHRyYSAhPT0gXCJwYWRkaW5nXCIgKSB7XG5cdFx0XHRcdHZhbCArPSBqUXVlcnkuY3NzKCBlbGVtLCBcImJvcmRlclwiICsgY3NzRXhwYW5kWyBpIF0gKyBcIldpZHRoXCIsIHRydWUsIHN0eWxlcyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIGdldFdpZHRoT3JIZWlnaHQoIGVsZW0sIG5hbWUsIGV4dHJhICkge1xuXG5cdC8vIFN0YXJ0IHdpdGggb2Zmc2V0IHByb3BlcnR5LCB3aGljaCBpcyBlcXVpdmFsZW50IHRvIHRoZSBib3JkZXItYm94IHZhbHVlXG5cdHZhciB2YWx1ZUlzQm9yZGVyQm94ID0gdHJ1ZSxcblx0XHR2YWwgPSBuYW1lID09PSBcIndpZHRoXCIgPyBlbGVtLm9mZnNldFdpZHRoIDogZWxlbS5vZmZzZXRIZWlnaHQsXG5cdFx0c3R5bGVzID0gZ2V0U3R5bGVzKCBlbGVtICksXG5cdFx0aXNCb3JkZXJCb3ggPSBqUXVlcnkuc3VwcG9ydC5ib3hTaXppbmcgJiYgalF1ZXJ5LmNzcyggZWxlbSwgXCJib3hTaXppbmdcIiwgZmFsc2UsIHN0eWxlcyApID09PSBcImJvcmRlci1ib3hcIjtcblxuXHQvLyBzb21lIG5vbi1odG1sIGVsZW1lbnRzIHJldHVybiB1bmRlZmluZWQgZm9yIG9mZnNldFdpZHRoLCBzbyBjaGVjayBmb3IgbnVsbC91bmRlZmluZWRcblx0Ly8gc3ZnIC0gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjQ5Mjg1XG5cdC8vIE1hdGhNTCAtIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTQ5MTY2OFxuXHRpZiAoIHZhbCA8PSAwIHx8IHZhbCA9PSBudWxsICkge1xuXHRcdC8vIEZhbGwgYmFjayB0byBjb21wdXRlZCB0aGVuIHVuY29tcHV0ZWQgY3NzIGlmIG5lY2Vzc2FyeVxuXHRcdHZhbCA9IGN1ckNTUyggZWxlbSwgbmFtZSwgc3R5bGVzICk7XG5cdFx0aWYgKCB2YWwgPCAwIHx8IHZhbCA9PSBudWxsICkge1xuXHRcdFx0dmFsID0gZWxlbS5zdHlsZVsgbmFtZSBdO1xuXHRcdH1cblxuXHRcdC8vIENvbXB1dGVkIHVuaXQgaXMgbm90IHBpeGVscy4gU3RvcCBoZXJlIGFuZCByZXR1cm4uXG5cdFx0aWYgKCBybnVtbm9ucHgudGVzdCh2YWwpICkge1xuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9XG5cblx0XHQvLyB3ZSBuZWVkIHRoZSBjaGVjayBmb3Igc3R5bGUgaW4gY2FzZSBhIGJyb3dzZXIgd2hpY2ggcmV0dXJucyB1bnJlbGlhYmxlIHZhbHVlc1xuXHRcdC8vIGZvciBnZXRDb21wdXRlZFN0eWxlIHNpbGVudGx5IGZhbGxzIGJhY2sgdG8gdGhlIHJlbGlhYmxlIGVsZW0uc3R5bGVcblx0XHR2YWx1ZUlzQm9yZGVyQm94ID0gaXNCb3JkZXJCb3ggJiYgKCBqUXVlcnkuc3VwcG9ydC5ib3hTaXppbmdSZWxpYWJsZSB8fCB2YWwgPT09IGVsZW0uc3R5bGVbIG5hbWUgXSApO1xuXG5cdFx0Ly8gTm9ybWFsaXplIFwiXCIsIGF1dG8sIGFuZCBwcmVwYXJlIGZvciBleHRyYVxuXHRcdHZhbCA9IHBhcnNlRmxvYXQoIHZhbCApIHx8IDA7XG5cdH1cblxuXHQvLyB1c2UgdGhlIGFjdGl2ZSBib3gtc2l6aW5nIG1vZGVsIHRvIGFkZC9zdWJ0cmFjdCBpcnJlbGV2YW50IHN0eWxlc1xuXHRyZXR1cm4gKCB2YWwgK1xuXHRcdGF1Z21lbnRXaWR0aE9ySGVpZ2h0KFxuXHRcdFx0ZWxlbSxcblx0XHRcdG5hbWUsXG5cdFx0XHRleHRyYSB8fCAoIGlzQm9yZGVyQm94ID8gXCJib3JkZXJcIiA6IFwiY29udGVudFwiICksXG5cdFx0XHR2YWx1ZUlzQm9yZGVyQm94LFxuXHRcdFx0c3R5bGVzXG5cdFx0KVxuXHQpICsgXCJweFwiO1xufVxuXG4vLyBUcnkgdG8gZGV0ZXJtaW5lIHRoZSBkZWZhdWx0IGRpc3BsYXkgdmFsdWUgb2YgYW4gZWxlbWVudFxuZnVuY3Rpb24gY3NzX2RlZmF1bHREaXNwbGF5KCBub2RlTmFtZSApIHtcblx0dmFyIGRvYyA9IGRvY3VtZW50LFxuXHRcdGRpc3BsYXkgPSBlbGVtZGlzcGxheVsgbm9kZU5hbWUgXTtcblxuXHRpZiAoICFkaXNwbGF5ICkge1xuXHRcdGRpc3BsYXkgPSBhY3R1YWxEaXNwbGF5KCBub2RlTmFtZSwgZG9jICk7XG5cblx0XHQvLyBJZiB0aGUgc2ltcGxlIHdheSBmYWlscywgcmVhZCBmcm9tIGluc2lkZSBhbiBpZnJhbWVcblx0XHRpZiAoIGRpc3BsYXkgPT09IFwibm9uZVwiIHx8ICFkaXNwbGF5ICkge1xuXHRcdFx0Ly8gVXNlIHRoZSBhbHJlYWR5LWNyZWF0ZWQgaWZyYW1lIGlmIHBvc3NpYmxlXG5cdFx0XHRpZnJhbWUgPSAoIGlmcmFtZSB8fFxuXHRcdFx0XHRqUXVlcnkoXCI8aWZyYW1lIGZyYW1lYm9yZGVyPScwJyB3aWR0aD0nMCcgaGVpZ2h0PScwJy8+XCIpXG5cdFx0XHRcdC5jc3MoIFwiY3NzVGV4dFwiLCBcImRpc3BsYXk6YmxvY2sgIWltcG9ydGFudFwiIClcblx0XHRcdCkuYXBwZW5kVG8oIGRvYy5kb2N1bWVudEVsZW1lbnQgKTtcblxuXHRcdFx0Ly8gQWx3YXlzIHdyaXRlIGEgbmV3IEhUTUwgc2tlbGV0b24gc28gV2Via2l0IGFuZCBGaXJlZm94IGRvbid0IGNob2tlIG9uIHJldXNlXG5cdFx0XHRkb2MgPSAoIGlmcmFtZVswXS5jb250ZW50V2luZG93IHx8IGlmcmFtZVswXS5jb250ZW50RG9jdW1lbnQgKS5kb2N1bWVudDtcblx0XHRcdGRvYy53cml0ZShcIjwhZG9jdHlwZSBodG1sPjxodG1sPjxib2R5PlwiKTtcblx0XHRcdGRvYy5jbG9zZSgpO1xuXG5cdFx0XHRkaXNwbGF5ID0gYWN0dWFsRGlzcGxheSggbm9kZU5hbWUsIGRvYyApO1xuXHRcdFx0aWZyYW1lLmRldGFjaCgpO1xuXHRcdH1cblxuXHRcdC8vIFN0b3JlIHRoZSBjb3JyZWN0IGRlZmF1bHQgZGlzcGxheVxuXHRcdGVsZW1kaXNwbGF5WyBub2RlTmFtZSBdID0gZGlzcGxheTtcblx0fVxuXG5cdHJldHVybiBkaXNwbGF5O1xufVxuXG4vLyBDYWxsZWQgT05MWSBmcm9tIHdpdGhpbiBjc3NfZGVmYXVsdERpc3BsYXlcbmZ1bmN0aW9uIGFjdHVhbERpc3BsYXkoIG5hbWUsIGRvYyApIHtcblx0dmFyIGVsZW0gPSBqUXVlcnkoIGRvYy5jcmVhdGVFbGVtZW50KCBuYW1lICkgKS5hcHBlbmRUbyggZG9jLmJvZHkgKSxcblx0XHRkaXNwbGF5ID0galF1ZXJ5LmNzcyggZWxlbVswXSwgXCJkaXNwbGF5XCIgKTtcblx0ZWxlbS5yZW1vdmUoKTtcblx0cmV0dXJuIGRpc3BsYXk7XG59XG5cbmpRdWVyeS5lYWNoKFsgXCJoZWlnaHRcIiwgXCJ3aWR0aFwiIF0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuXHRqUXVlcnkuY3NzSG9va3NbIG5hbWUgXSA9IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtLCBjb21wdXRlZCwgZXh0cmEgKSB7XG5cdFx0XHRpZiAoIGNvbXB1dGVkICkge1xuXHRcdFx0XHQvLyBjZXJ0YWluIGVsZW1lbnRzIGNhbiBoYXZlIGRpbWVuc2lvbiBpbmZvIGlmIHdlIGludmlzaWJseSBzaG93IHRoZW1cblx0XHRcdFx0Ly8gaG93ZXZlciwgaXQgbXVzdCBoYXZlIGEgY3VycmVudCBkaXNwbGF5IHN0eWxlIHRoYXQgd291bGQgYmVuZWZpdCBmcm9tIHRoaXNcblx0XHRcdFx0cmV0dXJuIGVsZW0ub2Zmc2V0V2lkdGggPT09IDAgJiYgcmRpc3BsYXlzd2FwLnRlc3QoIGpRdWVyeS5jc3MoIGVsZW0sIFwiZGlzcGxheVwiICkgKSA/XG5cdFx0XHRcdFx0alF1ZXJ5LnN3YXAoIGVsZW0sIGNzc1Nob3csIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGdldFdpZHRoT3JIZWlnaHQoIGVsZW0sIG5hbWUsIGV4dHJhICk7XG5cdFx0XHRcdFx0fSkgOlxuXHRcdFx0XHRcdGdldFdpZHRoT3JIZWlnaHQoIGVsZW0sIG5hbWUsIGV4dHJhICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHNldDogZnVuY3Rpb24oIGVsZW0sIHZhbHVlLCBleHRyYSApIHtcblx0XHRcdHZhciBzdHlsZXMgPSBleHRyYSAmJiBnZXRTdHlsZXMoIGVsZW0gKTtcblx0XHRcdHJldHVybiBzZXRQb3NpdGl2ZU51bWJlciggZWxlbSwgdmFsdWUsIGV4dHJhID9cblx0XHRcdFx0YXVnbWVudFdpZHRoT3JIZWlnaHQoXG5cdFx0XHRcdFx0ZWxlbSxcblx0XHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRcdGV4dHJhLFxuXHRcdFx0XHRcdGpRdWVyeS5zdXBwb3J0LmJveFNpemluZyAmJiBqUXVlcnkuY3NzKCBlbGVtLCBcImJveFNpemluZ1wiLCBmYWxzZSwgc3R5bGVzICkgPT09IFwiYm9yZGVyLWJveFwiLFxuXHRcdFx0XHRcdHN0eWxlc1xuXHRcdFx0XHQpIDogMFxuXHRcdFx0KTtcblx0XHR9XG5cdH07XG59KTtcblxuLy8gVGhlc2UgaG9va3MgY2Fubm90IGJlIGFkZGVkIHVudGlsIERPTSByZWFkeSBiZWNhdXNlIHRoZSBzdXBwb3J0IHRlc3Rcbi8vIGZvciBpdCBpcyBub3QgcnVuIHVudGlsIGFmdGVyIERPTSByZWFkeVxualF1ZXJ5KGZ1bmN0aW9uKCkge1xuXHQvLyBTdXBwb3J0OiBBbmRyb2lkIDIuM1xuXHRpZiAoICFqUXVlcnkuc3VwcG9ydC5yZWxpYWJsZU1hcmdpblJpZ2h0ICkge1xuXHRcdGpRdWVyeS5jc3NIb29rcy5tYXJnaW5SaWdodCA9IHtcblx0XHRcdGdldDogZnVuY3Rpb24oIGVsZW0sIGNvbXB1dGVkICkge1xuXHRcdFx0XHRpZiAoIGNvbXB1dGVkICkge1xuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IEFuZHJvaWQgMi4zXG5cdFx0XHRcdFx0Ly8gV2ViS2l0IEJ1ZyAxMzM0MyAtIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyB3cm9uZyB2YWx1ZSBmb3IgbWFyZ2luLXJpZ2h0XG5cdFx0XHRcdFx0Ly8gV29yayBhcm91bmQgYnkgdGVtcG9yYXJpbHkgc2V0dGluZyBlbGVtZW50IGRpc3BsYXkgdG8gaW5saW5lLWJsb2NrXG5cdFx0XHRcdFx0cmV0dXJuIGpRdWVyeS5zd2FwKCBlbGVtLCB7IFwiZGlzcGxheVwiOiBcImlubGluZS1ibG9ja1wiIH0sXG5cdFx0XHRcdFx0XHRjdXJDU1MsIFsgZWxlbSwgXCJtYXJnaW5SaWdodFwiIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBXZWJraXQgYnVnOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MjkwODRcblx0Ly8gZ2V0Q29tcHV0ZWRTdHlsZSByZXR1cm5zIHBlcmNlbnQgd2hlbiBzcGVjaWZpZWQgZm9yIHRvcC9sZWZ0L2JvdHRvbS9yaWdodFxuXHQvLyByYXRoZXIgdGhhbiBtYWtlIHRoZSBjc3MgbW9kdWxlIGRlcGVuZCBvbiB0aGUgb2Zmc2V0IG1vZHVsZSwgd2UganVzdCBjaGVjayBmb3IgaXQgaGVyZVxuXHRpZiAoICFqUXVlcnkuc3VwcG9ydC5waXhlbFBvc2l0aW9uICYmIGpRdWVyeS5mbi5wb3NpdGlvbiApIHtcblx0XHRqUXVlcnkuZWFjaCggWyBcInRvcFwiLCBcImxlZnRcIiBdLCBmdW5jdGlvbiggaSwgcHJvcCApIHtcblx0XHRcdGpRdWVyeS5jc3NIb29rc1sgcHJvcCBdID0ge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCBlbGVtLCBjb21wdXRlZCApIHtcblx0XHRcdFx0XHRpZiAoIGNvbXB1dGVkICkge1xuXHRcdFx0XHRcdFx0Y29tcHV0ZWQgPSBjdXJDU1MoIGVsZW0sIHByb3AgKTtcblx0XHRcdFx0XHRcdC8vIGlmIGN1ckNTUyByZXR1cm5zIHBlcmNlbnRhZ2UsIGZhbGxiYWNrIHRvIG9mZnNldFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJudW1ub25weC50ZXN0KCBjb21wdXRlZCApID9cblx0XHRcdFx0XHRcdFx0alF1ZXJ5KCBlbGVtICkucG9zaXRpb24oKVsgcHJvcCBdICsgXCJweFwiIDpcblx0XHRcdFx0XHRcdFx0Y29tcHV0ZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9XG5cbn0pO1xuXG5pZiAoIGpRdWVyeS5leHByICYmIGpRdWVyeS5leHByLmZpbHRlcnMgKSB7XG5cdGpRdWVyeS5leHByLmZpbHRlcnMuaGlkZGVuID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0Ly8gU3VwcG9ydDogT3BlcmEgPD0gMTIuMTJcblx0XHQvLyBPcGVyYSByZXBvcnRzIG9mZnNldFdpZHRocyBhbmQgb2Zmc2V0SGVpZ2h0cyBsZXNzIHRoYW4gemVybyBvbiBzb21lIGVsZW1lbnRzXG5cdFx0cmV0dXJuIGVsZW0ub2Zmc2V0V2lkdGggPD0gMCAmJiBlbGVtLm9mZnNldEhlaWdodCA8PSAwO1xuXHR9O1xuXG5cdGpRdWVyeS5leHByLmZpbHRlcnMudmlzaWJsZSA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHJldHVybiAhalF1ZXJ5LmV4cHIuZmlsdGVycy5oaWRkZW4oIGVsZW0gKTtcblx0fTtcbn1cblxuLy8gVGhlc2UgaG9va3MgYXJlIHVzZWQgYnkgYW5pbWF0ZSB0byBleHBhbmQgcHJvcGVydGllc1xualF1ZXJ5LmVhY2goe1xuXHRtYXJnaW46IFwiXCIsXG5cdHBhZGRpbmc6IFwiXCIsXG5cdGJvcmRlcjogXCJXaWR0aFwiXG59LCBmdW5jdGlvbiggcHJlZml4LCBzdWZmaXggKSB7XG5cdGpRdWVyeS5jc3NIb29rc1sgcHJlZml4ICsgc3VmZml4IF0gPSB7XG5cdFx0ZXhwYW5kOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0XHR2YXIgaSA9IDAsXG5cdFx0XHRcdGV4cGFuZGVkID0ge30sXG5cblx0XHRcdFx0Ly8gYXNzdW1lcyBhIHNpbmdsZSBudW1iZXIgaWYgbm90IGEgc3RyaW5nXG5cdFx0XHRcdHBhcnRzID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUuc3BsaXQoXCIgXCIpIDogWyB2YWx1ZSBdO1xuXG5cdFx0XHRmb3IgKCA7IGkgPCA0OyBpKysgKSB7XG5cdFx0XHRcdGV4cGFuZGVkWyBwcmVmaXggKyBjc3NFeHBhbmRbIGkgXSArIHN1ZmZpeCBdID1cblx0XHRcdFx0XHRwYXJ0c1sgaSBdIHx8IHBhcnRzWyBpIC0gMiBdIHx8IHBhcnRzWyAwIF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBleHBhbmRlZDtcblx0XHR9XG5cdH07XG5cblx0aWYgKCAhcm1hcmdpbi50ZXN0KCBwcmVmaXggKSApIHtcblx0XHRqUXVlcnkuY3NzSG9va3NbIHByZWZpeCArIHN1ZmZpeCBdLnNldCA9IHNldFBvc2l0aXZlTnVtYmVyO1xuXHR9XG59KTtcbnZhciByMjAgPSAvJTIwL2csXG5cdHJicmFja2V0ID0gL1xcW1xcXSQvLFxuXHRyQ1JMRiA9IC9cXHI/XFxuL2csXG5cdHJzdWJtaXR0ZXJUeXBlcyA9IC9eKD86c3VibWl0fGJ1dHRvbnxpbWFnZXxyZXNldHxmaWxlKSQvaSxcblx0cnN1Ym1pdHRhYmxlID0gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8a2V5Z2VuKS9pO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0c2VyaWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4galF1ZXJ5LnBhcmFtKCB0aGlzLnNlcmlhbGl6ZUFycmF5KCkgKTtcblx0fSxcblx0c2VyaWFsaXplQXJyYXk6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gQ2FuIGFkZCBwcm9wSG9vayBmb3IgXCJlbGVtZW50c1wiIHRvIGZpbHRlciBvciBhZGQgZm9ybSBlbGVtZW50c1xuXHRcdFx0dmFyIGVsZW1lbnRzID0galF1ZXJ5LnByb3AoIHRoaXMsIFwiZWxlbWVudHNcIiApO1xuXHRcdFx0cmV0dXJuIGVsZW1lbnRzID8galF1ZXJ5Lm1ha2VBcnJheSggZWxlbWVudHMgKSA6IHRoaXM7XG5cdFx0fSlcblx0XHQuZmlsdGVyKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgdHlwZSA9IHRoaXMudHlwZTtcblx0XHRcdC8vIFVzZSAuaXMoXCI6ZGlzYWJsZWRcIikgc28gdGhhdCBmaWVsZHNldFtkaXNhYmxlZF0gd29ya3Ncblx0XHRcdHJldHVybiB0aGlzLm5hbWUgJiYgIWpRdWVyeSggdGhpcyApLmlzKCBcIjpkaXNhYmxlZFwiICkgJiZcblx0XHRcdFx0cnN1Ym1pdHRhYmxlLnRlc3QoIHRoaXMubm9kZU5hbWUgKSAmJiAhcnN1Ym1pdHRlclR5cGVzLnRlc3QoIHR5cGUgKSAmJlxuXHRcdFx0XHQoIHRoaXMuY2hlY2tlZCB8fCAhbWFuaXB1bGF0aW9uX3JjaGVja2FibGVUeXBlLnRlc3QoIHR5cGUgKSApO1xuXHRcdH0pXG5cdFx0Lm1hcChmdW5jdGlvbiggaSwgZWxlbSApe1xuXHRcdFx0dmFyIHZhbCA9IGpRdWVyeSggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRyZXR1cm4gdmFsID09IG51bGwgP1xuXHRcdFx0XHRudWxsIDpcblx0XHRcdFx0alF1ZXJ5LmlzQXJyYXkoIHZhbCApID9cblx0XHRcdFx0XHRqUXVlcnkubWFwKCB2YWwsIGZ1bmN0aW9uKCB2YWwgKXtcblx0XHRcdFx0XHRcdHJldHVybiB7IG5hbWU6IGVsZW0ubmFtZSwgdmFsdWU6IHZhbC5yZXBsYWNlKCByQ1JMRiwgXCJcXHJcXG5cIiApIH07XG5cdFx0XHRcdFx0fSkgOlxuXHRcdFx0XHRcdHsgbmFtZTogZWxlbS5uYW1lLCB2YWx1ZTogdmFsLnJlcGxhY2UoIHJDUkxGLCBcIlxcclxcblwiICkgfTtcblx0XHR9KS5nZXQoKTtcblx0fVxufSk7XG5cbi8vU2VyaWFsaXplIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMgb3IgYSBzZXQgb2Zcbi8va2V5L3ZhbHVlcyBpbnRvIGEgcXVlcnkgc3RyaW5nXG5qUXVlcnkucGFyYW0gPSBmdW5jdGlvbiggYSwgdHJhZGl0aW9uYWwgKSB7XG5cdHZhciBwcmVmaXgsXG5cdFx0cyA9IFtdLFxuXHRcdGFkZCA9IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXHRcdFx0Ly8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG5cdFx0XHR2YWx1ZSA9IGpRdWVyeS5pc0Z1bmN0aW9uKCB2YWx1ZSApID8gdmFsdWUoKSA6ICggdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZSApO1xuXHRcdFx0c1sgcy5sZW5ndGggXSA9IGVuY29kZVVSSUNvbXBvbmVudCgga2V5ICkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKTtcblx0XHR9O1xuXG5cdC8vIFNldCB0cmFkaXRpb25hbCB0byB0cnVlIGZvciBqUXVlcnkgPD0gMS4zLjIgYmVoYXZpb3IuXG5cdGlmICggdHJhZGl0aW9uYWwgPT09IHVuZGVmaW5lZCApIHtcblx0XHR0cmFkaXRpb25hbCA9IGpRdWVyeS5hamF4U2V0dGluZ3MgJiYgalF1ZXJ5LmFqYXhTZXR0aW5ncy50cmFkaXRpb25hbDtcblx0fVxuXG5cdC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMuXG5cdGlmICggalF1ZXJ5LmlzQXJyYXkoIGEgKSB8fCAoIGEuanF1ZXJ5ICYmICFqUXVlcnkuaXNQbGFpbk9iamVjdCggYSApICkgKSB7XG5cdFx0Ly8gU2VyaWFsaXplIHRoZSBmb3JtIGVsZW1lbnRzXG5cdFx0alF1ZXJ5LmVhY2goIGEsIGZ1bmN0aW9uKCkge1xuXHRcdFx0YWRkKCB0aGlzLm5hbWUsIHRoaXMudmFsdWUgKTtcblx0XHR9KTtcblxuXHR9IGVsc2Uge1xuXHRcdC8vIElmIHRyYWRpdGlvbmFsLCBlbmNvZGUgdGhlIFwib2xkXCIgd2F5ICh0aGUgd2F5IDEuMy4yIG9yIG9sZGVyXG5cdFx0Ly8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG5cdFx0Zm9yICggcHJlZml4IGluIGEgKSB7XG5cdFx0XHRidWlsZFBhcmFtcyggcHJlZml4LCBhWyBwcmVmaXggXSwgdHJhZGl0aW9uYWwsIGFkZCApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgcmVzdWx0aW5nIHNlcmlhbGl6YXRpb25cblx0cmV0dXJuIHMuam9pbiggXCImXCIgKS5yZXBsYWNlKCByMjAsIFwiK1wiICk7XG59O1xuXG5mdW5jdGlvbiBidWlsZFBhcmFtcyggcHJlZml4LCBvYmosIHRyYWRpdGlvbmFsLCBhZGQgKSB7XG5cdHZhciBuYW1lO1xuXG5cdGlmICggalF1ZXJ5LmlzQXJyYXkoIG9iaiApICkge1xuXHRcdC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuXHRcdGpRdWVyeS5lYWNoKCBvYmosIGZ1bmN0aW9uKCBpLCB2ICkge1xuXHRcdFx0aWYgKCB0cmFkaXRpb25hbCB8fCByYnJhY2tldC50ZXN0KCBwcmVmaXggKSApIHtcblx0XHRcdFx0Ly8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuXHRcdFx0XHRhZGQoIHByZWZpeCwgdiApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBJdGVtIGlzIG5vbi1zY2FsYXIgKGFycmF5IG9yIG9iamVjdCksIGVuY29kZSBpdHMgbnVtZXJpYyBpbmRleC5cblx0XHRcdFx0YnVpbGRQYXJhbXMoIHByZWZpeCArIFwiW1wiICsgKCB0eXBlb2YgdiA9PT0gXCJvYmplY3RcIiA/IGkgOiBcIlwiICkgKyBcIl1cIiwgdiwgdHJhZGl0aW9uYWwsIGFkZCApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH0gZWxzZSBpZiAoICF0cmFkaXRpb25hbCAmJiBqUXVlcnkudHlwZSggb2JqICkgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0Ly8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuXHRcdGZvciAoIG5hbWUgaW4gb2JqICkge1xuXHRcdFx0YnVpbGRQYXJhbXMoIHByZWZpeCArIFwiW1wiICsgbmFtZSArIFwiXVwiLCBvYmpbIG5hbWUgXSwgdHJhZGl0aW9uYWwsIGFkZCApO1xuXHRcdH1cblxuXHR9IGVsc2Uge1xuXHRcdC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cblx0XHRhZGQoIHByZWZpeCwgb2JqICk7XG5cdH1cbn1cbmpRdWVyeS5lYWNoKCAoXCJibHVyIGZvY3VzIGZvY3VzaW4gZm9jdXNvdXQgbG9hZCByZXNpemUgc2Nyb2xsIHVubG9hZCBjbGljayBkYmxjbGljayBcIiArXG5cdFwibW91c2Vkb3duIG1vdXNldXAgbW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmUgXCIgK1xuXHRcImNoYW5nZSBzZWxlY3Qgc3VibWl0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgZXJyb3IgY29udGV4dG1lbnVcIikuc3BsaXQoXCIgXCIpLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblxuXHQvLyBIYW5kbGUgZXZlbnQgYmluZGluZ1xuXHRqUXVlcnkuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBkYXRhLCBmbiApIHtcblx0XHRyZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDAgP1xuXHRcdFx0dGhpcy5vbiggbmFtZSwgbnVsbCwgZGF0YSwgZm4gKSA6XG5cdFx0XHR0aGlzLnRyaWdnZXIoIG5hbWUgKTtcblx0fTtcbn0pO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0aG92ZXI6IGZ1bmN0aW9uKCBmbk92ZXIsIGZuT3V0ICkge1xuXHRcdHJldHVybiB0aGlzLm1vdXNlZW50ZXIoIGZuT3ZlciApLm1vdXNlbGVhdmUoIGZuT3V0IHx8IGZuT3ZlciApO1xuXHR9LFxuXG5cdGJpbmQ6IGZ1bmN0aW9uKCB0eXBlcywgZGF0YSwgZm4gKSB7XG5cdFx0cmV0dXJuIHRoaXMub24oIHR5cGVzLCBudWxsLCBkYXRhLCBmbiApO1xuXHR9LFxuXHR1bmJpbmQ6IGZ1bmN0aW9uKCB0eXBlcywgZm4gKSB7XG5cdFx0cmV0dXJuIHRoaXMub2ZmKCB0eXBlcywgbnVsbCwgZm4gKTtcblx0fSxcblxuXHRkZWxlZ2F0ZTogZnVuY3Rpb24oIHNlbGVjdG9yLCB0eXBlcywgZGF0YSwgZm4gKSB7XG5cdFx0cmV0dXJuIHRoaXMub24oIHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4gKTtcblx0fSxcblx0dW5kZWxlZ2F0ZTogZnVuY3Rpb24oIHNlbGVjdG9yLCB0eXBlcywgZm4gKSB7XG5cdFx0Ly8gKCBuYW1lc3BhY2UgKSBvciAoIHNlbGVjdG9yLCB0eXBlcyBbLCBmbl0gKVxuXHRcdHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gdGhpcy5vZmYoIHNlbGVjdG9yLCBcIioqXCIgKSA6IHRoaXMub2ZmKCB0eXBlcywgc2VsZWN0b3IgfHwgXCIqKlwiLCBmbiApO1xuXHR9XG59KTtcbnZhclxuXHQvLyBEb2N1bWVudCBsb2NhdGlvblxuXHRhamF4TG9jUGFydHMsXG5cdGFqYXhMb2NhdGlvbixcblxuXHRhamF4X25vbmNlID0galF1ZXJ5Lm5vdygpLFxuXG5cdGFqYXhfcnF1ZXJ5ID0gL1xcPy8sXG5cdHJoYXNoID0gLyMuKiQvLFxuXHRydHMgPSAvKFs/Jl0pXz1bXiZdKi8sXG5cdHJoZWFkZXJzID0gL14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopJC9tZyxcblx0Ly8gIzc2NTMsICM4MTI1LCAjODE1MjogbG9jYWwgcHJvdG9jb2wgZGV0ZWN0aW9uXG5cdHJsb2NhbFByb3RvY29sID0gL14oPzphYm91dHxhcHB8YXBwLXN0b3JhZ2V8ListZXh0ZW5zaW9ufGZpbGV8cmVzfHdpZGdldCk6JC8sXG5cdHJub0NvbnRlbnQgPSAvXig/OkdFVHxIRUFEKSQvLFxuXHRycHJvdG9jb2wgPSAvXlxcL1xcLy8sXG5cdHJ1cmwgPSAvXihbXFx3ListXSs6KSg/OlxcL1xcLyhbXlxcLz8jOl0qKSg/OjooXFxkKyl8KXwpLyxcblxuXHQvLyBLZWVwIGEgY29weSBvZiB0aGUgb2xkIGxvYWQgbWV0aG9kXG5cdF9sb2FkID0galF1ZXJ5LmZuLmxvYWQsXG5cblx0LyogUHJlZmlsdGVyc1xuXHQgKiAxKSBUaGV5IGFyZSB1c2VmdWwgdG8gaW50cm9kdWNlIGN1c3RvbSBkYXRhVHlwZXMgKHNlZSBhamF4L2pzb25wLmpzIGZvciBhbiBleGFtcGxlKVxuXHQgKiAyKSBUaGVzZSBhcmUgY2FsbGVkOlxuXHQgKiAgICAtIEJFRk9SRSBhc2tpbmcgZm9yIGEgdHJhbnNwb3J0XG5cdCAqICAgIC0gQUZURVIgcGFyYW0gc2VyaWFsaXphdGlvbiAocy5kYXRhIGlzIGEgc3RyaW5nIGlmIHMucHJvY2Vzc0RhdGEgaXMgdHJ1ZSlcblx0ICogMykga2V5IGlzIHRoZSBkYXRhVHlwZVxuXHQgKiA0KSB0aGUgY2F0Y2hhbGwgc3ltYm9sIFwiKlwiIGNhbiBiZSB1c2VkXG5cdCAqIDUpIGV4ZWN1dGlvbiB3aWxsIHN0YXJ0IHdpdGggdHJhbnNwb3J0IGRhdGFUeXBlIGFuZCBUSEVOIGNvbnRpbnVlIGRvd24gdG8gXCIqXCIgaWYgbmVlZGVkXG5cdCAqL1xuXHRwcmVmaWx0ZXJzID0ge30sXG5cblx0LyogVHJhbnNwb3J0cyBiaW5kaW5nc1xuXHQgKiAxKSBrZXkgaXMgdGhlIGRhdGFUeXBlXG5cdCAqIDIpIHRoZSBjYXRjaGFsbCBzeW1ib2wgXCIqXCIgY2FuIGJlIHVzZWRcblx0ICogMykgc2VsZWN0aW9uIHdpbGwgc3RhcnQgd2l0aCB0cmFuc3BvcnQgZGF0YVR5cGUgYW5kIFRIRU4gZ28gdG8gXCIqXCIgaWYgbmVlZGVkXG5cdCAqL1xuXHR0cmFuc3BvcnRzID0ge30sXG5cblx0Ly8gQXZvaWQgY29tbWVudC1wcm9sb2cgY2hhciBzZXF1ZW5jZSAoIzEwMDk4KTsgbXVzdCBhcHBlYXNlIGxpbnQgYW5kIGV2YWRlIGNvbXByZXNzaW9uXG5cdGFsbFR5cGVzID0gXCIqL1wiLmNvbmNhdChcIipcIik7XG5cbi8vICM4MTM4LCBJRSBtYXkgdGhyb3cgYW4gZXhjZXB0aW9uIHdoZW4gYWNjZXNzaW5nXG4vLyBhIGZpZWxkIGZyb20gd2luZG93LmxvY2F0aW9uIGlmIGRvY3VtZW50LmRvbWFpbiBoYXMgYmVlbiBzZXRcbnRyeSB7XG5cdGFqYXhMb2NhdGlvbiA9IGxvY2F0aW9uLmhyZWY7XG59IGNhdGNoKCBlICkge1xuXHQvLyBVc2UgdGhlIGhyZWYgYXR0cmlidXRlIG9mIGFuIEEgZWxlbWVudFxuXHQvLyBzaW5jZSBJRSB3aWxsIG1vZGlmeSBpdCBnaXZlbiBkb2N1bWVudC5sb2NhdGlvblxuXHRhamF4TG9jYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApO1xuXHRhamF4TG9jYXRpb24uaHJlZiA9IFwiXCI7XG5cdGFqYXhMb2NhdGlvbiA9IGFqYXhMb2NhdGlvbi5ocmVmO1xufVxuXG4vLyBTZWdtZW50IGxvY2F0aW9uIGludG8gcGFydHNcbmFqYXhMb2NQYXJ0cyA9IHJ1cmwuZXhlYyggYWpheExvY2F0aW9uLnRvTG93ZXJDYXNlKCkgKSB8fCBbXTtcblxuLy8gQmFzZSBcImNvbnN0cnVjdG9yXCIgZm9yIGpRdWVyeS5hamF4UHJlZmlsdGVyIGFuZCBqUXVlcnkuYWpheFRyYW5zcG9ydFxuZnVuY3Rpb24gYWRkVG9QcmVmaWx0ZXJzT3JUcmFuc3BvcnRzKCBzdHJ1Y3R1cmUgKSB7XG5cblx0Ly8gZGF0YVR5cGVFeHByZXNzaW9uIGlzIG9wdGlvbmFsIGFuZCBkZWZhdWx0cyB0byBcIipcIlxuXHRyZXR1cm4gZnVuY3Rpb24oIGRhdGFUeXBlRXhwcmVzc2lvbiwgZnVuYyApIHtcblxuXHRcdGlmICggdHlwZW9mIGRhdGFUeXBlRXhwcmVzc2lvbiAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGZ1bmMgPSBkYXRhVHlwZUV4cHJlc3Npb247XG5cdFx0XHRkYXRhVHlwZUV4cHJlc3Npb24gPSBcIipcIjtcblx0XHR9XG5cblx0XHR2YXIgZGF0YVR5cGUsXG5cdFx0XHRpID0gMCxcblx0XHRcdGRhdGFUeXBlcyA9IGRhdGFUeXBlRXhwcmVzc2lvbi50b0xvd2VyQ2FzZSgpLm1hdGNoKCBjb3JlX3Jub3R3aGl0ZSApIHx8IFtdO1xuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggZnVuYyApICkge1xuXHRcdFx0Ly8gRm9yIGVhY2ggZGF0YVR5cGUgaW4gdGhlIGRhdGFUeXBlRXhwcmVzc2lvblxuXHRcdFx0d2hpbGUgKCAoZGF0YVR5cGUgPSBkYXRhVHlwZXNbaSsrXSkgKSB7XG5cdFx0XHRcdC8vIFByZXBlbmQgaWYgcmVxdWVzdGVkXG5cdFx0XHRcdGlmICggZGF0YVR5cGVbMF0gPT09IFwiK1wiICkge1xuXHRcdFx0XHRcdGRhdGFUeXBlID0gZGF0YVR5cGUuc2xpY2UoIDEgKSB8fCBcIipcIjtcblx0XHRcdFx0XHQoc3RydWN0dXJlWyBkYXRhVHlwZSBdID0gc3RydWN0dXJlWyBkYXRhVHlwZSBdIHx8IFtdKS51bnNoaWZ0KCBmdW5jICk7XG5cblx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGFwcGVuZFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdChzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gPSBzdHJ1Y3R1cmVbIGRhdGFUeXBlIF0gfHwgW10pLnB1c2goIGZ1bmMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuLy8gQmFzZSBpbnNwZWN0aW9uIGZ1bmN0aW9uIGZvciBwcmVmaWx0ZXJzIGFuZCB0cmFuc3BvcnRzXG5mdW5jdGlvbiBpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggc3RydWN0dXJlLCBvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIGpxWEhSICkge1xuXG5cdHZhciBpbnNwZWN0ZWQgPSB7fSxcblx0XHRzZWVraW5nVHJhbnNwb3J0ID0gKCBzdHJ1Y3R1cmUgPT09IHRyYW5zcG9ydHMgKTtcblxuXHRmdW5jdGlvbiBpbnNwZWN0KCBkYXRhVHlwZSApIHtcblx0XHR2YXIgc2VsZWN0ZWQ7XG5cdFx0aW5zcGVjdGVkWyBkYXRhVHlwZSBdID0gdHJ1ZTtcblx0XHRqUXVlcnkuZWFjaCggc3RydWN0dXJlWyBkYXRhVHlwZSBdIHx8IFtdLCBmdW5jdGlvbiggXywgcHJlZmlsdGVyT3JGYWN0b3J5ICkge1xuXHRcdFx0dmFyIGRhdGFUeXBlT3JUcmFuc3BvcnQgPSBwcmVmaWx0ZXJPckZhY3RvcnkoIG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucywganFYSFIgKTtcblx0XHRcdGlmKCB0eXBlb2YgZGF0YVR5cGVPclRyYW5zcG9ydCA9PT0gXCJzdHJpbmdcIiAmJiAhc2Vla2luZ1RyYW5zcG9ydCAmJiAhaW5zcGVjdGVkWyBkYXRhVHlwZU9yVHJhbnNwb3J0IF0gKSB7XG5cdFx0XHRcdG9wdGlvbnMuZGF0YVR5cGVzLnVuc2hpZnQoIGRhdGFUeXBlT3JUcmFuc3BvcnQgKTtcblx0XHRcdFx0aW5zcGVjdCggZGF0YVR5cGVPclRyYW5zcG9ydCApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9IGVsc2UgaWYgKCBzZWVraW5nVHJhbnNwb3J0ICkge1xuXHRcdFx0XHRyZXR1cm4gISggc2VsZWN0ZWQgPSBkYXRhVHlwZU9yVHJhbnNwb3J0ICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHNlbGVjdGVkO1xuXHR9XG5cblx0cmV0dXJuIGluc3BlY3QoIG9wdGlvbnMuZGF0YVR5cGVzWyAwIF0gKSB8fCAhaW5zcGVjdGVkWyBcIipcIiBdICYmIGluc3BlY3QoIFwiKlwiICk7XG59XG5cbi8vIEEgc3BlY2lhbCBleHRlbmQgZm9yIGFqYXggb3B0aW9uc1xuLy8gdGhhdCB0YWtlcyBcImZsYXRcIiBvcHRpb25zIChub3QgdG8gYmUgZGVlcCBleHRlbmRlZClcbi8vIEZpeGVzICM5ODg3XG5mdW5jdGlvbiBhamF4RXh0ZW5kKCB0YXJnZXQsIHNyYyApIHtcblx0dmFyIGtleSwgZGVlcCxcblx0XHRmbGF0T3B0aW9ucyA9IGpRdWVyeS5hamF4U2V0dGluZ3MuZmxhdE9wdGlvbnMgfHwge307XG5cblx0Zm9yICgga2V5IGluIHNyYyApIHtcblx0XHRpZiAoIHNyY1sga2V5IF0gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdCggZmxhdE9wdGlvbnNbIGtleSBdID8gdGFyZ2V0IDogKCBkZWVwIHx8IChkZWVwID0ge30pICkgKVsga2V5IF0gPSBzcmNbIGtleSBdO1xuXHRcdH1cblx0fVxuXHRpZiAoIGRlZXAgKSB7XG5cdFx0alF1ZXJ5LmV4dGVuZCggdHJ1ZSwgdGFyZ2V0LCBkZWVwICk7XG5cdH1cblxuXHRyZXR1cm4gdGFyZ2V0O1xufVxuXG5qUXVlcnkuZm4ubG9hZCA9IGZ1bmN0aW9uKCB1cmwsIHBhcmFtcywgY2FsbGJhY2sgKSB7XG5cdGlmICggdHlwZW9mIHVybCAhPT0gXCJzdHJpbmdcIiAmJiBfbG9hZCApIHtcblx0XHRyZXR1cm4gX2xvYWQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHR9XG5cblx0dmFyIHNlbGVjdG9yLCB0eXBlLCByZXNwb25zZSxcblx0XHRzZWxmID0gdGhpcyxcblx0XHRvZmYgPSB1cmwuaW5kZXhPZihcIiBcIik7XG5cblx0aWYgKCBvZmYgPj0gMCApIHtcblx0XHRzZWxlY3RvciA9IHVybC5zbGljZSggb2ZmICk7XG5cdFx0dXJsID0gdXJsLnNsaWNlKCAwLCBvZmYgKTtcblx0fVxuXG5cdC8vIElmIGl0J3MgYSBmdW5jdGlvblxuXHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBwYXJhbXMgKSApIHtcblxuXHRcdC8vIFdlIGFzc3VtZSB0aGF0IGl0J3MgdGhlIGNhbGxiYWNrXG5cdFx0Y2FsbGJhY2sgPSBwYXJhbXM7XG5cdFx0cGFyYW1zID0gdW5kZWZpbmVkO1xuXG5cdC8vIE90aGVyd2lzZSwgYnVpbGQgYSBwYXJhbSBzdHJpbmdcblx0fSBlbHNlIGlmICggcGFyYW1zICYmIHR5cGVvZiBwYXJhbXMgPT09IFwib2JqZWN0XCIgKSB7XG5cdFx0dHlwZSA9IFwiUE9TVFwiO1xuXHR9XG5cblx0Ly8gSWYgd2UgaGF2ZSBlbGVtZW50cyB0byBtb2RpZnksIG1ha2UgdGhlIHJlcXVlc3Rcblx0aWYgKCBzZWxmLmxlbmd0aCA+IDAgKSB7XG5cdFx0alF1ZXJ5LmFqYXgoe1xuXHRcdFx0dXJsOiB1cmwsXG5cblx0XHRcdC8vIGlmIFwidHlwZVwiIHZhcmlhYmxlIGlzIHVuZGVmaW5lZCwgdGhlbiBcIkdFVFwiIG1ldGhvZCB3aWxsIGJlIHVzZWRcblx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRkYXRhVHlwZTogXCJodG1sXCIsXG5cdFx0XHRkYXRhOiBwYXJhbXNcblx0XHR9KS5kb25lKGZ1bmN0aW9uKCByZXNwb25zZVRleHQgKSB7XG5cblx0XHRcdC8vIFNhdmUgcmVzcG9uc2UgZm9yIHVzZSBpbiBjb21wbGV0ZSBjYWxsYmFja1xuXHRcdFx0cmVzcG9uc2UgPSBhcmd1bWVudHM7XG5cblx0XHRcdHNlbGYuaHRtbCggc2VsZWN0b3IgP1xuXG5cdFx0XHRcdC8vIElmIGEgc2VsZWN0b3Igd2FzIHNwZWNpZmllZCwgbG9jYXRlIHRoZSByaWdodCBlbGVtZW50cyBpbiBhIGR1bW15IGRpdlxuXHRcdFx0XHQvLyBFeGNsdWRlIHNjcmlwdHMgdG8gYXZvaWQgSUUgJ1Blcm1pc3Npb24gRGVuaWVkJyBlcnJvcnNcblx0XHRcdFx0alF1ZXJ5KFwiPGRpdj5cIikuYXBwZW5kKCBqUXVlcnkucGFyc2VIVE1MKCByZXNwb25zZVRleHQgKSApLmZpbmQoIHNlbGVjdG9yICkgOlxuXG5cdFx0XHRcdC8vIE90aGVyd2lzZSB1c2UgdGhlIGZ1bGwgcmVzdWx0XG5cdFx0XHRcdHJlc3BvbnNlVGV4dCApO1xuXG5cdFx0fSkuY29tcGxldGUoIGNhbGxiYWNrICYmIGZ1bmN0aW9uKCBqcVhIUiwgc3RhdHVzICkge1xuXHRcdFx0c2VsZi5lYWNoKCBjYWxsYmFjaywgcmVzcG9uc2UgfHwgWyBqcVhIUi5yZXNwb25zZVRleHQsIHN0YXR1cywganFYSFIgXSApO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vLyBBdHRhY2ggYSBidW5jaCBvZiBmdW5jdGlvbnMgZm9yIGhhbmRsaW5nIGNvbW1vbiBBSkFYIGV2ZW50c1xualF1ZXJ5LmVhY2goIFsgXCJhamF4U3RhcnRcIiwgXCJhamF4U3RvcFwiLCBcImFqYXhDb21wbGV0ZVwiLCBcImFqYXhFcnJvclwiLCBcImFqYXhTdWNjZXNzXCIsIFwiYWpheFNlbmRcIiBdLCBmdW5jdGlvbiggaSwgdHlwZSApe1xuXHRqUXVlcnkuZm5bIHR5cGUgXSA9IGZ1bmN0aW9uKCBmbiApe1xuXHRcdHJldHVybiB0aGlzLm9uKCB0eXBlLCBmbiApO1xuXHR9O1xufSk7XG5cbmpRdWVyeS5leHRlbmQoe1xuXG5cdC8vIENvdW50ZXIgZm9yIGhvbGRpbmcgdGhlIG51bWJlciBvZiBhY3RpdmUgcXVlcmllc1xuXHRhY3RpdmU6IDAsXG5cblx0Ly8gTGFzdC1Nb2RpZmllZCBoZWFkZXIgY2FjaGUgZm9yIG5leHQgcmVxdWVzdFxuXHRsYXN0TW9kaWZpZWQ6IHt9LFxuXHRldGFnOiB7fSxcblxuXHRhamF4U2V0dGluZ3M6IHtcblx0XHR1cmw6IGFqYXhMb2NhdGlvbixcblx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdGlzTG9jYWw6IHJsb2NhbFByb3RvY29sLnRlc3QoIGFqYXhMb2NQYXJ0c1sgMSBdICksXG5cdFx0Z2xvYmFsOiB0cnVlLFxuXHRcdHByb2Nlc3NEYXRhOiB0cnVlLFxuXHRcdGFzeW5jOiB0cnVlLFxuXHRcdGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiLFxuXHRcdC8qXG5cdFx0dGltZW91dDogMCxcblx0XHRkYXRhOiBudWxsLFxuXHRcdGRhdGFUeXBlOiBudWxsLFxuXHRcdHVzZXJuYW1lOiBudWxsLFxuXHRcdHBhc3N3b3JkOiBudWxsLFxuXHRcdGNhY2hlOiBudWxsLFxuXHRcdHRocm93czogZmFsc2UsXG5cdFx0dHJhZGl0aW9uYWw6IGZhbHNlLFxuXHRcdGhlYWRlcnM6IHt9LFxuXHRcdCovXG5cblx0XHRhY2NlcHRzOiB7XG5cdFx0XHRcIipcIjogYWxsVHlwZXMsXG5cdFx0XHR0ZXh0OiBcInRleHQvcGxhaW5cIixcblx0XHRcdGh0bWw6IFwidGV4dC9odG1sXCIsXG5cdFx0XHR4bWw6IFwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLFxuXHRcdFx0anNvbjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHRcIlxuXHRcdH0sXG5cblx0XHRjb250ZW50czoge1xuXHRcdFx0eG1sOiAveG1sLyxcblx0XHRcdGh0bWw6IC9odG1sLyxcblx0XHRcdGpzb246IC9qc29uL1xuXHRcdH0sXG5cblx0XHRyZXNwb25zZUZpZWxkczoge1xuXHRcdFx0eG1sOiBcInJlc3BvbnNlWE1MXCIsXG5cdFx0XHR0ZXh0OiBcInJlc3BvbnNlVGV4dFwiLFxuXHRcdFx0anNvbjogXCJyZXNwb25zZUpTT05cIlxuXHRcdH0sXG5cblx0XHQvLyBEYXRhIGNvbnZlcnRlcnNcblx0XHQvLyBLZXlzIHNlcGFyYXRlIHNvdXJjZSAob3IgY2F0Y2hhbGwgXCIqXCIpIGFuZCBkZXN0aW5hdGlvbiB0eXBlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG5cdFx0Y29udmVydGVyczoge1xuXG5cdFx0XHQvLyBDb252ZXJ0IGFueXRoaW5nIHRvIHRleHRcblx0XHRcdFwiKiB0ZXh0XCI6IFN0cmluZyxcblxuXHRcdFx0Ly8gVGV4dCB0byBodG1sICh0cnVlID0gbm8gdHJhbnNmb3JtYXRpb24pXG5cdFx0XHRcInRleHQgaHRtbFwiOiB0cnVlLFxuXG5cdFx0XHQvLyBFdmFsdWF0ZSB0ZXh0IGFzIGEganNvbiBleHByZXNzaW9uXG5cdFx0XHRcInRleHQganNvblwiOiBqUXVlcnkucGFyc2VKU09OLFxuXG5cdFx0XHQvLyBQYXJzZSB0ZXh0IGFzIHhtbFxuXHRcdFx0XCJ0ZXh0IHhtbFwiOiBqUXVlcnkucGFyc2VYTUxcblx0XHR9LFxuXG5cdFx0Ly8gRm9yIG9wdGlvbnMgdGhhdCBzaG91bGRuJ3QgYmUgZGVlcCBleHRlbmRlZDpcblx0XHQvLyB5b3UgY2FuIGFkZCB5b3VyIG93biBjdXN0b20gb3B0aW9ucyBoZXJlIGlmXG5cdFx0Ly8gYW5kIHdoZW4geW91IGNyZWF0ZSBvbmUgdGhhdCBzaG91bGRuJ3QgYmVcblx0XHQvLyBkZWVwIGV4dGVuZGVkIChzZWUgYWpheEV4dGVuZClcblx0XHRmbGF0T3B0aW9uczoge1xuXHRcdFx0dXJsOiB0cnVlLFxuXHRcdFx0Y29udGV4dDogdHJ1ZVxuXHRcdH1cblx0fSxcblxuXHQvLyBDcmVhdGVzIGEgZnVsbCBmbGVkZ2VkIHNldHRpbmdzIG9iamVjdCBpbnRvIHRhcmdldFxuXHQvLyB3aXRoIGJvdGggYWpheFNldHRpbmdzIGFuZCBzZXR0aW5ncyBmaWVsZHMuXG5cdC8vIElmIHRhcmdldCBpcyBvbWl0dGVkLCB3cml0ZXMgaW50byBhamF4U2V0dGluZ3MuXG5cdGFqYXhTZXR1cDogZnVuY3Rpb24oIHRhcmdldCwgc2V0dGluZ3MgKSB7XG5cdFx0cmV0dXJuIHNldHRpbmdzID9cblxuXHRcdFx0Ly8gQnVpbGRpbmcgYSBzZXR0aW5ncyBvYmplY3Rcblx0XHRcdGFqYXhFeHRlbmQoIGFqYXhFeHRlbmQoIHRhcmdldCwgalF1ZXJ5LmFqYXhTZXR0aW5ncyApLCBzZXR0aW5ncyApIDpcblxuXHRcdFx0Ly8gRXh0ZW5kaW5nIGFqYXhTZXR0aW5nc1xuXHRcdFx0YWpheEV4dGVuZCggalF1ZXJ5LmFqYXhTZXR0aW5ncywgdGFyZ2V0ICk7XG5cdH0sXG5cblx0YWpheFByZWZpbHRlcjogYWRkVG9QcmVmaWx0ZXJzT3JUcmFuc3BvcnRzKCBwcmVmaWx0ZXJzICksXG5cdGFqYXhUcmFuc3BvcnQ6IGFkZFRvUHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cyApLFxuXG5cdC8vIE1haW4gbWV0aG9kXG5cdGFqYXg6IGZ1bmN0aW9uKCB1cmwsIG9wdGlvbnMgKSB7XG5cblx0XHQvLyBJZiB1cmwgaXMgYW4gb2JqZWN0LCBzaW11bGF0ZSBwcmUtMS41IHNpZ25hdHVyZVxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gXCJvYmplY3RcIiApIHtcblx0XHRcdG9wdGlvbnMgPSB1cmw7XG5cdFx0XHR1cmwgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gRm9yY2Ugb3B0aW9ucyB0byBiZSBhbiBvYmplY3Rcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdHZhciB0cmFuc3BvcnQsXG5cdFx0XHQvLyBVUkwgd2l0aG91dCBhbnRpLWNhY2hlIHBhcmFtXG5cdFx0XHRjYWNoZVVSTCxcblx0XHRcdC8vIFJlc3BvbnNlIGhlYWRlcnNcblx0XHRcdHJlc3BvbnNlSGVhZGVyc1N0cmluZyxcblx0XHRcdHJlc3BvbnNlSGVhZGVycyxcblx0XHRcdC8vIHRpbWVvdXQgaGFuZGxlXG5cdFx0XHR0aW1lb3V0VGltZXIsXG5cdFx0XHQvLyBDcm9zcy1kb21haW4gZGV0ZWN0aW9uIHZhcnNcblx0XHRcdHBhcnRzLFxuXHRcdFx0Ly8gVG8ga25vdyBpZiBnbG9iYWwgZXZlbnRzIGFyZSB0byBiZSBkaXNwYXRjaGVkXG5cdFx0XHRmaXJlR2xvYmFscyxcblx0XHRcdC8vIExvb3AgdmFyaWFibGVcblx0XHRcdGksXG5cdFx0XHQvLyBDcmVhdGUgdGhlIGZpbmFsIG9wdGlvbnMgb2JqZWN0XG5cdFx0XHRzID0galF1ZXJ5LmFqYXhTZXR1cCgge30sIG9wdGlvbnMgKSxcblx0XHRcdC8vIENhbGxiYWNrcyBjb250ZXh0XG5cdFx0XHRjYWxsYmFja0NvbnRleHQgPSBzLmNvbnRleHQgfHwgcyxcblx0XHRcdC8vIENvbnRleHQgZm9yIGdsb2JhbCBldmVudHMgaXMgY2FsbGJhY2tDb250ZXh0IGlmIGl0IGlzIGEgRE9NIG5vZGUgb3IgalF1ZXJ5IGNvbGxlY3Rpb25cblx0XHRcdGdsb2JhbEV2ZW50Q29udGV4dCA9IHMuY29udGV4dCAmJiAoIGNhbGxiYWNrQ29udGV4dC5ub2RlVHlwZSB8fCBjYWxsYmFja0NvbnRleHQuanF1ZXJ5ICkgP1xuXHRcdFx0XHRqUXVlcnkoIGNhbGxiYWNrQ29udGV4dCApIDpcblx0XHRcdFx0alF1ZXJ5LmV2ZW50LFxuXHRcdFx0Ly8gRGVmZXJyZWRzXG5cdFx0XHRkZWZlcnJlZCA9IGpRdWVyeS5EZWZlcnJlZCgpLFxuXHRcdFx0Y29tcGxldGVEZWZlcnJlZCA9IGpRdWVyeS5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSxcblx0XHRcdC8vIFN0YXR1cy1kZXBlbmRlbnQgY2FsbGJhY2tzXG5cdFx0XHRzdGF0dXNDb2RlID0gcy5zdGF0dXNDb2RlIHx8IHt9LFxuXHRcdFx0Ly8gSGVhZGVycyAodGhleSBhcmUgc2VudCBhbGwgYXQgb25jZSlcblx0XHRcdHJlcXVlc3RIZWFkZXJzID0ge30sXG5cdFx0XHRyZXF1ZXN0SGVhZGVyc05hbWVzID0ge30sXG5cdFx0XHQvLyBUaGUganFYSFIgc3RhdGVcblx0XHRcdHN0YXRlID0gMCxcblx0XHRcdC8vIERlZmF1bHQgYWJvcnQgbWVzc2FnZVxuXHRcdFx0c3RyQWJvcnQgPSBcImNhbmNlbGVkXCIsXG5cdFx0XHQvLyBGYWtlIHhoclxuXHRcdFx0anFYSFIgPSB7XG5cdFx0XHRcdHJlYWR5U3RhdGU6IDAsXG5cblx0XHRcdFx0Ly8gQnVpbGRzIGhlYWRlcnMgaGFzaHRhYmxlIGlmIG5lZWRlZFxuXHRcdFx0XHRnZXRSZXNwb25zZUhlYWRlcjogZnVuY3Rpb24oIGtleSApIHtcblx0XHRcdFx0XHR2YXIgbWF0Y2g7XG5cdFx0XHRcdFx0aWYgKCBzdGF0ZSA9PT0gMiApIHtcblx0XHRcdFx0XHRcdGlmICggIXJlc3BvbnNlSGVhZGVycyApIHtcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2VIZWFkZXJzID0ge307XG5cdFx0XHRcdFx0XHRcdHdoaWxlICggKG1hdGNoID0gcmhlYWRlcnMuZXhlYyggcmVzcG9uc2VIZWFkZXJzU3RyaW5nICkpICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlSGVhZGVyc1sgbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSBdID0gbWF0Y2hbIDIgXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWF0Y2ggPSByZXNwb25zZUhlYWRlcnNbIGtleS50b0xvd2VyQ2FzZSgpIF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBtYXRjaCA9PSBudWxsID8gbnVsbCA6IG1hdGNoO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIFJhdyBzdHJpbmdcblx0XHRcdFx0Z2V0QWxsUmVzcG9uc2VIZWFkZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gc3RhdGUgPT09IDIgPyByZXNwb25zZUhlYWRlcnNTdHJpbmcgOiBudWxsO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIENhY2hlcyB0aGUgaGVhZGVyXG5cdFx0XHRcdHNldFJlcXVlc3RIZWFkZXI6IGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApIHtcblx0XHRcdFx0XHR2YXIgbG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0aWYgKCAhc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRuYW1lID0gcmVxdWVzdEhlYWRlcnNOYW1lc1sgbG5hbWUgXSA9IHJlcXVlc3RIZWFkZXJzTmFtZXNbIGxuYW1lIF0gfHwgbmFtZTtcblx0XHRcdFx0XHRcdHJlcXVlc3RIZWFkZXJzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gT3ZlcnJpZGVzIHJlc3BvbnNlIGNvbnRlbnQtdHlwZSBoZWFkZXJcblx0XHRcdFx0b3ZlcnJpZGVNaW1lVHlwZTogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAhc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRzLm1pbWVUeXBlID0gdHlwZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gU3RhdHVzLWRlcGVuZGVudCBjYWxsYmFja3Ncblx0XHRcdFx0c3RhdHVzQ29kZTogZnVuY3Rpb24oIG1hcCApIHtcblx0XHRcdFx0XHR2YXIgY29kZTtcblx0XHRcdFx0XHRpZiAoIG1hcCApIHtcblx0XHRcdFx0XHRcdGlmICggc3RhdGUgPCAyICkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKCBjb2RlIGluIG1hcCApIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBMYXp5LWFkZCB0aGUgbmV3IGNhbGxiYWNrIGluIGEgd2F5IHRoYXQgcHJlc2VydmVzIG9sZCBvbmVzXG5cdFx0XHRcdFx0XHRcdFx0c3RhdHVzQ29kZVsgY29kZSBdID0gWyBzdGF0dXNDb2RlWyBjb2RlIF0sIG1hcFsgY29kZSBdIF07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vIEV4ZWN1dGUgdGhlIGFwcHJvcHJpYXRlIGNhbGxiYWNrc1xuXHRcdFx0XHRcdFx0XHRqcVhIUi5hbHdheXMoIG1hcFsganFYSFIuc3RhdHVzIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gQ2FuY2VsIHRoZSByZXF1ZXN0XG5cdFx0XHRcdGFib3J0OiBmdW5jdGlvbiggc3RhdHVzVGV4dCApIHtcblx0XHRcdFx0XHR2YXIgZmluYWxUZXh0ID0gc3RhdHVzVGV4dCB8fCBzdHJBYm9ydDtcblx0XHRcdFx0XHRpZiAoIHRyYW5zcG9ydCApIHtcblx0XHRcdFx0XHRcdHRyYW5zcG9ydC5hYm9ydCggZmluYWxUZXh0ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRvbmUoIDAsIGZpbmFsVGV4dCApO1xuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0Ly8gQXR0YWNoIGRlZmVycmVkc1xuXHRcdGRlZmVycmVkLnByb21pc2UoIGpxWEhSICkuY29tcGxldGUgPSBjb21wbGV0ZURlZmVycmVkLmFkZDtcblx0XHRqcVhIUi5zdWNjZXNzID0ganFYSFIuZG9uZTtcblx0XHRqcVhIUi5lcnJvciA9IGpxWEhSLmZhaWw7XG5cblx0XHQvLyBSZW1vdmUgaGFzaCBjaGFyYWN0ZXIgKCM3NTMxOiBhbmQgc3RyaW5nIHByb21vdGlvbilcblx0XHQvLyBBZGQgcHJvdG9jb2wgaWYgbm90IHByb3ZpZGVkIChwcmVmaWx0ZXJzIG1pZ2h0IGV4cGVjdCBpdClcblx0XHQvLyBIYW5kbGUgZmFsc3kgdXJsIGluIHRoZSBzZXR0aW5ncyBvYmplY3QgKCMxMDA5MzogY29uc2lzdGVuY3kgd2l0aCBvbGQgc2lnbmF0dXJlKVxuXHRcdC8vIFdlIGFsc28gdXNlIHRoZSB1cmwgcGFyYW1ldGVyIGlmIGF2YWlsYWJsZVxuXHRcdHMudXJsID0gKCAoIHVybCB8fCBzLnVybCB8fCBhamF4TG9jYXRpb24gKSArIFwiXCIgKS5yZXBsYWNlKCByaGFzaCwgXCJcIiApXG5cdFx0XHQucmVwbGFjZSggcnByb3RvY29sLCBhamF4TG9jUGFydHNbIDEgXSArIFwiLy9cIiApO1xuXG5cdFx0Ly8gQWxpYXMgbWV0aG9kIG9wdGlvbiB0byB0eXBlIGFzIHBlciB0aWNrZXQgIzEyMDA0XG5cdFx0cy50eXBlID0gb3B0aW9ucy5tZXRob2QgfHwgb3B0aW9ucy50eXBlIHx8IHMubWV0aG9kIHx8IHMudHlwZTtcblxuXHRcdC8vIEV4dHJhY3QgZGF0YVR5cGVzIGxpc3Rcblx0XHRzLmRhdGFUeXBlcyA9IGpRdWVyeS50cmltKCBzLmRhdGFUeXBlIHx8IFwiKlwiICkudG9Mb3dlckNhc2UoKS5tYXRjaCggY29yZV9ybm90d2hpdGUgKSB8fCBbXCJcIl07XG5cblx0XHQvLyBBIGNyb3NzLWRvbWFpbiByZXF1ZXN0IGlzIGluIG9yZGVyIHdoZW4gd2UgaGF2ZSBhIHByb3RvY29sOmhvc3Q6cG9ydCBtaXNtYXRjaFxuXHRcdGlmICggcy5jcm9zc0RvbWFpbiA9PSBudWxsICkge1xuXHRcdFx0cGFydHMgPSBydXJsLmV4ZWMoIHMudXJsLnRvTG93ZXJDYXNlKCkgKTtcblx0XHRcdHMuY3Jvc3NEb21haW4gPSAhISggcGFydHMgJiZcblx0XHRcdFx0KCBwYXJ0c1sgMSBdICE9PSBhamF4TG9jUGFydHNbIDEgXSB8fCBwYXJ0c1sgMiBdICE9PSBhamF4TG9jUGFydHNbIDIgXSB8fFxuXHRcdFx0XHRcdCggcGFydHNbIDMgXSB8fCAoIHBhcnRzWyAxIF0gPT09IFwiaHR0cDpcIiA/IFwiODBcIiA6IFwiNDQzXCIgKSApICE9PVxuXHRcdFx0XHRcdFx0KCBhamF4TG9jUGFydHNbIDMgXSB8fCAoIGFqYXhMb2NQYXJ0c1sgMSBdID09PSBcImh0dHA6XCIgPyBcIjgwXCIgOiBcIjQ0M1wiICkgKSApXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIENvbnZlcnQgZGF0YSBpZiBub3QgYWxyZWFkeSBhIHN0cmluZ1xuXHRcdGlmICggcy5kYXRhICYmIHMucHJvY2Vzc0RhdGEgJiYgdHlwZW9mIHMuZGF0YSAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHMuZGF0YSA9IGpRdWVyeS5wYXJhbSggcy5kYXRhLCBzLnRyYWRpdGlvbmFsICk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgcHJlZmlsdGVyc1xuXHRcdGluc3BlY3RQcmVmaWx0ZXJzT3JUcmFuc3BvcnRzKCBwcmVmaWx0ZXJzLCBzLCBvcHRpb25zLCBqcVhIUiApO1xuXG5cdFx0Ly8gSWYgcmVxdWVzdCB3YXMgYWJvcnRlZCBpbnNpZGUgYSBwcmVmaWx0ZXIsIHN0b3AgdGhlcmVcblx0XHRpZiAoIHN0YXRlID09PSAyICkge1xuXHRcdFx0cmV0dXJuIGpxWEhSO1xuXHRcdH1cblxuXHRcdC8vIFdlIGNhbiBmaXJlIGdsb2JhbCBldmVudHMgYXMgb2Ygbm93IGlmIGFza2VkIHRvXG5cdFx0ZmlyZUdsb2JhbHMgPSBzLmdsb2JhbDtcblxuXHRcdC8vIFdhdGNoIGZvciBhIG5ldyBzZXQgb2YgcmVxdWVzdHNcblx0XHRpZiAoIGZpcmVHbG9iYWxzICYmIGpRdWVyeS5hY3RpdmUrKyA9PT0gMCApIHtcblx0XHRcdGpRdWVyeS5ldmVudC50cmlnZ2VyKFwiYWpheFN0YXJ0XCIpO1xuXHRcdH1cblxuXHRcdC8vIFVwcGVyY2FzZSB0aGUgdHlwZVxuXHRcdHMudHlwZSA9IHMudHlwZS50b1VwcGVyQ2FzZSgpO1xuXG5cdFx0Ly8gRGV0ZXJtaW5lIGlmIHJlcXVlc3QgaGFzIGNvbnRlbnRcblx0XHRzLmhhc0NvbnRlbnQgPSAhcm5vQ29udGVudC50ZXN0KCBzLnR5cGUgKTtcblxuXHRcdC8vIFNhdmUgdGhlIFVSTCBpbiBjYXNlIHdlJ3JlIHRveWluZyB3aXRoIHRoZSBJZi1Nb2RpZmllZC1TaW5jZVxuXHRcdC8vIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciBsYXRlciBvblxuXHRcdGNhY2hlVVJMID0gcy51cmw7XG5cblx0XHQvLyBNb3JlIG9wdGlvbnMgaGFuZGxpbmcgZm9yIHJlcXVlc3RzIHdpdGggbm8gY29udGVudFxuXHRcdGlmICggIXMuaGFzQ29udGVudCApIHtcblxuXHRcdFx0Ly8gSWYgZGF0YSBpcyBhdmFpbGFibGUsIGFwcGVuZCBkYXRhIHRvIHVybFxuXHRcdFx0aWYgKCBzLmRhdGEgKSB7XG5cdFx0XHRcdGNhY2hlVVJMID0gKCBzLnVybCArPSAoIGFqYXhfcnF1ZXJ5LnRlc3QoIGNhY2hlVVJMICkgPyBcIiZcIiA6IFwiP1wiICkgKyBzLmRhdGEgKTtcblx0XHRcdFx0Ly8gIzk2ODI6IHJlbW92ZSBkYXRhIHNvIHRoYXQgaXQncyBub3QgdXNlZCBpbiBhbiBldmVudHVhbCByZXRyeVxuXHRcdFx0XHRkZWxldGUgcy5kYXRhO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgYW50aS1jYWNoZSBpbiB1cmwgaWYgbmVlZGVkXG5cdFx0XHRpZiAoIHMuY2FjaGUgPT09IGZhbHNlICkge1xuXHRcdFx0XHRzLnVybCA9IHJ0cy50ZXN0KCBjYWNoZVVSTCApID9cblxuXHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSAnXycgcGFyYW1ldGVyLCBzZXQgaXRzIHZhbHVlXG5cdFx0XHRcdFx0Y2FjaGVVUkwucmVwbGFjZSggcnRzLCBcIiQxXz1cIiArIGFqYXhfbm9uY2UrKyApIDpcblxuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSBhZGQgb25lIHRvIHRoZSBlbmRcblx0XHRcdFx0XHRjYWNoZVVSTCArICggYWpheF9ycXVlcnkudGVzdCggY2FjaGVVUkwgKSA/IFwiJlwiIDogXCI/XCIgKSArIFwiXz1cIiArIGFqYXhfbm9uY2UrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIElmLU1vZGlmaWVkLVNpbmNlIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciwgaWYgaW4gaWZNb2RpZmllZCBtb2RlLlxuXHRcdGlmICggcy5pZk1vZGlmaWVkICkge1xuXHRcdFx0aWYgKCBqUXVlcnkubGFzdE1vZGlmaWVkWyBjYWNoZVVSTCBdICkge1xuXHRcdFx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKCBcIklmLU1vZGlmaWVkLVNpbmNlXCIsIGpRdWVyeS5sYXN0TW9kaWZpZWRbIGNhY2hlVVJMIF0gKTtcblx0XHRcdH1cblx0XHRcdGlmICggalF1ZXJ5LmV0YWdbIGNhY2hlVVJMIF0gKSB7XG5cdFx0XHRcdGpxWEhSLnNldFJlcXVlc3RIZWFkZXIoIFwiSWYtTm9uZS1NYXRjaFwiLCBqUXVlcnkuZXRhZ1sgY2FjaGVVUkwgXSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgY29ycmVjdCBoZWFkZXIsIGlmIGRhdGEgaXMgYmVpbmcgc2VudFxuXHRcdGlmICggcy5kYXRhICYmIHMuaGFzQ29udGVudCAmJiBzLmNvbnRlbnRUeXBlICE9PSBmYWxzZSB8fCBvcHRpb25zLmNvbnRlbnRUeXBlICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggXCJDb250ZW50LVR5cGVcIiwgcy5jb250ZW50VHlwZSApO1xuXHRcdH1cblxuXHRcdC8vIFNldCB0aGUgQWNjZXB0cyBoZWFkZXIgZm9yIHRoZSBzZXJ2ZXIsIGRlcGVuZGluZyBvbiB0aGUgZGF0YVR5cGVcblx0XHRqcVhIUi5zZXRSZXF1ZXN0SGVhZGVyKFxuXHRcdFx0XCJBY2NlcHRcIixcblx0XHRcdHMuZGF0YVR5cGVzWyAwIF0gJiYgcy5hY2NlcHRzWyBzLmRhdGFUeXBlc1swXSBdID9cblx0XHRcdFx0cy5hY2NlcHRzWyBzLmRhdGFUeXBlc1swXSBdICsgKCBzLmRhdGFUeXBlc1sgMCBdICE9PSBcIipcIiA/IFwiLCBcIiArIGFsbFR5cGVzICsgXCI7IHE9MC4wMVwiIDogXCJcIiApIDpcblx0XHRcdFx0cy5hY2NlcHRzWyBcIipcIiBdXG5cdFx0KTtcblxuXHRcdC8vIENoZWNrIGZvciBoZWFkZXJzIG9wdGlvblxuXHRcdGZvciAoIGkgaW4gcy5oZWFkZXJzICkge1xuXHRcdFx0anFYSFIuc2V0UmVxdWVzdEhlYWRlciggaSwgcy5oZWFkZXJzWyBpIF0gKTtcblx0XHR9XG5cblx0XHQvLyBBbGxvdyBjdXN0b20gaGVhZGVycy9taW1ldHlwZXMgYW5kIGVhcmx5IGFib3J0XG5cdFx0aWYgKCBzLmJlZm9yZVNlbmQgJiYgKCBzLmJlZm9yZVNlbmQuY2FsbCggY2FsbGJhY2tDb250ZXh0LCBqcVhIUiwgcyApID09PSBmYWxzZSB8fCBzdGF0ZSA9PT0gMiApICkge1xuXHRcdFx0Ly8gQWJvcnQgaWYgbm90IGRvbmUgYWxyZWFkeSBhbmQgcmV0dXJuXG5cdFx0XHRyZXR1cm4ganFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHQvLyBhYm9ydGluZyBpcyBubyBsb25nZXIgYSBjYW5jZWxsYXRpb25cblx0XHRzdHJBYm9ydCA9IFwiYWJvcnRcIjtcblxuXHRcdC8vIEluc3RhbGwgY2FsbGJhY2tzIG9uIGRlZmVycmVkc1xuXHRcdGZvciAoIGkgaW4geyBzdWNjZXNzOiAxLCBlcnJvcjogMSwgY29tcGxldGU6IDEgfSApIHtcblx0XHRcdGpxWEhSWyBpIF0oIHNbIGkgXSApO1xuXHRcdH1cblxuXHRcdC8vIEdldCB0cmFuc3BvcnRcblx0XHR0cmFuc3BvcnQgPSBpbnNwZWN0UHJlZmlsdGVyc09yVHJhbnNwb3J0cyggdHJhbnNwb3J0cywgcywgb3B0aW9ucywganFYSFIgKTtcblxuXHRcdC8vIElmIG5vIHRyYW5zcG9ydCwgd2UgYXV0by1hYm9ydFxuXHRcdGlmICggIXRyYW5zcG9ydCApIHtcblx0XHRcdGRvbmUoIC0xLCBcIk5vIFRyYW5zcG9ydFwiICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpxWEhSLnJlYWR5U3RhdGUgPSAxO1xuXG5cdFx0XHQvLyBTZW5kIGdsb2JhbCBldmVudFxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIFwiYWpheFNlbmRcIiwgWyBqcVhIUiwgcyBdICk7XG5cdFx0XHR9XG5cdFx0XHQvLyBUaW1lb3V0XG5cdFx0XHRpZiAoIHMuYXN5bmMgJiYgcy50aW1lb3V0ID4gMCApIHtcblx0XHRcdFx0dGltZW91dFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRqcVhIUi5hYm9ydChcInRpbWVvdXRcIik7XG5cdFx0XHRcdH0sIHMudGltZW91dCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRzdGF0ZSA9IDE7XG5cdFx0XHRcdHRyYW5zcG9ydC5zZW5kKCByZXF1ZXN0SGVhZGVycywgZG9uZSApO1xuXHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRcdC8vIFByb3BhZ2F0ZSBleGNlcHRpb24gYXMgZXJyb3IgaWYgbm90IGRvbmVcblx0XHRcdFx0aWYgKCBzdGF0ZSA8IDIgKSB7XG5cdFx0XHRcdFx0ZG9uZSggLTEsIGUgKTtcblx0XHRcdFx0Ly8gU2ltcGx5IHJldGhyb3cgb3RoZXJ3aXNlXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhbGxiYWNrIGZvciB3aGVuIGV2ZXJ5dGhpbmcgaXMgZG9uZVxuXHRcdGZ1bmN0aW9uIGRvbmUoIHN0YXR1cywgbmF0aXZlU3RhdHVzVGV4dCwgcmVzcG9uc2VzLCBoZWFkZXJzICkge1xuXHRcdFx0dmFyIGlzU3VjY2Vzcywgc3VjY2VzcywgZXJyb3IsIHJlc3BvbnNlLCBtb2RpZmllZCxcblx0XHRcdFx0c3RhdHVzVGV4dCA9IG5hdGl2ZVN0YXR1c1RleHQ7XG5cblx0XHRcdC8vIENhbGxlZCBvbmNlXG5cdFx0XHRpZiAoIHN0YXRlID09PSAyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0YXRlIGlzIFwiZG9uZVwiIG5vd1xuXHRcdFx0c3RhdGUgPSAyO1xuXG5cdFx0XHQvLyBDbGVhciB0aW1lb3V0IGlmIGl0IGV4aXN0c1xuXHRcdFx0aWYgKCB0aW1lb3V0VGltZXIgKSB7XG5cdFx0XHRcdGNsZWFyVGltZW91dCggdGltZW91dFRpbWVyICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERlcmVmZXJlbmNlIHRyYW5zcG9ydCBmb3IgZWFybHkgZ2FyYmFnZSBjb2xsZWN0aW9uXG5cdFx0XHQvLyAobm8gbWF0dGVyIGhvdyBsb25nIHRoZSBqcVhIUiBvYmplY3Qgd2lsbCBiZSB1c2VkKVxuXHRcdFx0dHJhbnNwb3J0ID0gdW5kZWZpbmVkO1xuXG5cdFx0XHQvLyBDYWNoZSByZXNwb25zZSBoZWFkZXJzXG5cdFx0XHRyZXNwb25zZUhlYWRlcnNTdHJpbmcgPSBoZWFkZXJzIHx8IFwiXCI7XG5cblx0XHRcdC8vIFNldCByZWFkeVN0YXRlXG5cdFx0XHRqcVhIUi5yZWFkeVN0YXRlID0gc3RhdHVzID4gMCA/IDQgOiAwO1xuXG5cdFx0XHQvLyBEZXRlcm1pbmUgaWYgc3VjY2Vzc2Z1bFxuXHRcdFx0aXNTdWNjZXNzID0gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQ7XG5cblx0XHRcdC8vIEdldCByZXNwb25zZSBkYXRhXG5cdFx0XHRpZiAoIHJlc3BvbnNlcyApIHtcblx0XHRcdFx0cmVzcG9uc2UgPSBhamF4SGFuZGxlUmVzcG9uc2VzKCBzLCBqcVhIUiwgcmVzcG9uc2VzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbnZlcnQgbm8gbWF0dGVyIHdoYXQgKHRoYXQgd2F5IHJlc3BvbnNlWFhYIGZpZWxkcyBhcmUgYWx3YXlzIHNldClcblx0XHRcdHJlc3BvbnNlID0gYWpheENvbnZlcnQoIHMsIHJlc3BvbnNlLCBqcVhIUiwgaXNTdWNjZXNzICk7XG5cblx0XHRcdC8vIElmIHN1Y2Nlc3NmdWwsIGhhbmRsZSB0eXBlIGNoYWluaW5nXG5cdFx0XHRpZiAoIGlzU3VjY2VzcyApIHtcblxuXHRcdFx0XHQvLyBTZXQgdGhlIElmLU1vZGlmaWVkLVNpbmNlIGFuZC9vciBJZi1Ob25lLU1hdGNoIGhlYWRlciwgaWYgaW4gaWZNb2RpZmllZCBtb2RlLlxuXHRcdFx0XHRpZiAoIHMuaWZNb2RpZmllZCApIHtcblx0XHRcdFx0XHRtb2RpZmllZCA9IGpxWEhSLmdldFJlc3BvbnNlSGVhZGVyKFwiTGFzdC1Nb2RpZmllZFwiKTtcblx0XHRcdFx0XHRpZiAoIG1vZGlmaWVkICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5Lmxhc3RNb2RpZmllZFsgY2FjaGVVUkwgXSA9IG1vZGlmaWVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtb2RpZmllZCA9IGpxWEhSLmdldFJlc3BvbnNlSGVhZGVyKFwiZXRhZ1wiKTtcblx0XHRcdFx0XHRpZiAoIG1vZGlmaWVkICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5LmV0YWdbIGNhY2hlVVJMIF0gPSBtb2RpZmllZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBpZiBubyBjb250ZW50XG5cdFx0XHRcdGlmICggc3RhdHVzID09PSAyMDQgfHwgcy50eXBlID09PSBcIkhFQURcIiApIHtcblx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gXCJub2NvbnRlbnRcIjtcblxuXHRcdFx0XHQvLyBpZiBub3QgbW9kaWZpZWRcblx0XHRcdFx0fSBlbHNlIGlmICggc3RhdHVzID09PSAzMDQgKSB7XG5cdFx0XHRcdFx0c3RhdHVzVGV4dCA9IFwibm90bW9kaWZpZWRcIjtcblxuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGRhdGEsIGxldCdzIGNvbnZlcnQgaXRcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0dXNUZXh0ID0gcmVzcG9uc2Uuc3RhdGU7XG5cdFx0XHRcdFx0c3VjY2VzcyA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdFx0ZXJyb3IgPSByZXNwb25zZS5lcnJvcjtcblx0XHRcdFx0XHRpc1N1Y2Nlc3MgPSAhZXJyb3I7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFdlIGV4dHJhY3QgZXJyb3IgZnJvbSBzdGF0dXNUZXh0XG5cdFx0XHRcdC8vIHRoZW4gbm9ybWFsaXplIHN0YXR1c1RleHQgYW5kIHN0YXR1cyBmb3Igbm9uLWFib3J0c1xuXHRcdFx0XHRlcnJvciA9IHN0YXR1c1RleHQ7XG5cdFx0XHRcdGlmICggc3RhdHVzIHx8ICFzdGF0dXNUZXh0ICkge1xuXHRcdFx0XHRcdHN0YXR1c1RleHQgPSBcImVycm9yXCI7XG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPCAwICkge1xuXHRcdFx0XHRcdFx0c3RhdHVzID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2V0IGRhdGEgZm9yIHRoZSBmYWtlIHhociBvYmplY3Rcblx0XHRcdGpxWEhSLnN0YXR1cyA9IHN0YXR1cztcblx0XHRcdGpxWEhSLnN0YXR1c1RleHQgPSAoIG5hdGl2ZVN0YXR1c1RleHQgfHwgc3RhdHVzVGV4dCApICsgXCJcIjtcblxuXHRcdFx0Ly8gU3VjY2Vzcy9FcnJvclxuXHRcdFx0aWYgKCBpc1N1Y2Nlc3MgKSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBjYWxsYmFja0NvbnRleHQsIFsgc3VjY2Vzcywgc3RhdHVzVGV4dCwganFYSFIgXSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0V2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0LCBlcnJvciBdICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0YXR1cy1kZXBlbmRlbnQgY2FsbGJhY2tzXG5cdFx0XHRqcVhIUi5zdGF0dXNDb2RlKCBzdGF0dXNDb2RlICk7XG5cdFx0XHRzdGF0dXNDb2RlID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRpZiAoIGZpcmVHbG9iYWxzICkge1xuXHRcdFx0XHRnbG9iYWxFdmVudENvbnRleHQudHJpZ2dlciggaXNTdWNjZXNzID8gXCJhamF4U3VjY2Vzc1wiIDogXCJhamF4RXJyb3JcIixcblx0XHRcdFx0XHRbIGpxWEhSLCBzLCBpc1N1Y2Nlc3MgPyBzdWNjZXNzIDogZXJyb3IgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb21wbGV0ZVxuXHRcdFx0Y29tcGxldGVEZWZlcnJlZC5maXJlV2l0aCggY2FsbGJhY2tDb250ZXh0LCBbIGpxWEhSLCBzdGF0dXNUZXh0IF0gKTtcblxuXHRcdFx0aWYgKCBmaXJlR2xvYmFscyApIHtcblx0XHRcdFx0Z2xvYmFsRXZlbnRDb250ZXh0LnRyaWdnZXIoIFwiYWpheENvbXBsZXRlXCIsIFsganFYSFIsIHMgXSApO1xuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIGdsb2JhbCBBSkFYIGNvdW50ZXJcblx0XHRcdFx0aWYgKCAhKCAtLWpRdWVyeS5hY3RpdmUgKSApIHtcblx0XHRcdFx0XHRqUXVlcnkuZXZlbnQudHJpZ2dlcihcImFqYXhTdG9wXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGpxWEhSO1xuXHR9LFxuXG5cdGdldEpTT046IGZ1bmN0aW9uKCB1cmwsIGRhdGEsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiBqUXVlcnkuZ2V0KCB1cmwsIGRhdGEsIGNhbGxiYWNrLCBcImpzb25cIiApO1xuXHR9LFxuXG5cdGdldFNjcmlwdDogZnVuY3Rpb24oIHVybCwgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5nZXQoIHVybCwgdW5kZWZpbmVkLCBjYWxsYmFjaywgXCJzY3JpcHRcIiApO1xuXHR9XG59KTtcblxualF1ZXJ5LmVhY2goIFsgXCJnZXRcIiwgXCJwb3N0XCIgXSwgZnVuY3Rpb24oIGksIG1ldGhvZCApIHtcblx0alF1ZXJ5WyBtZXRob2QgXSA9IGZ1bmN0aW9uKCB1cmwsIGRhdGEsIGNhbGxiYWNrLCB0eXBlICkge1xuXHRcdC8vIHNoaWZ0IGFyZ3VtZW50cyBpZiBkYXRhIGFyZ3VtZW50IHdhcyBvbWl0dGVkXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggZGF0YSApICkge1xuXHRcdFx0dHlwZSA9IHR5cGUgfHwgY2FsbGJhY2s7XG5cdFx0XHRjYWxsYmFjayA9IGRhdGE7XG5cdFx0XHRkYXRhID0gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBqUXVlcnkuYWpheCh7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHR5cGU6IG1ldGhvZCxcblx0XHRcdGRhdGFUeXBlOiB0eXBlLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHN1Y2Nlc3M6IGNhbGxiYWNrXG5cdFx0fSk7XG5cdH07XG59KTtcblxuLyogSGFuZGxlcyByZXNwb25zZXMgdG8gYW4gYWpheCByZXF1ZXN0OlxuICogLSBmaW5kcyB0aGUgcmlnaHQgZGF0YVR5cGUgKG1lZGlhdGVzIGJldHdlZW4gY29udGVudC10eXBlIGFuZCBleHBlY3RlZCBkYXRhVHlwZSlcbiAqIC0gcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyByZXNwb25zZVxuICovXG5mdW5jdGlvbiBhamF4SGFuZGxlUmVzcG9uc2VzKCBzLCBqcVhIUiwgcmVzcG9uc2VzICkge1xuXG5cdHZhciBjdCwgdHlwZSwgZmluYWxEYXRhVHlwZSwgZmlyc3REYXRhVHlwZSxcblx0XHRjb250ZW50cyA9IHMuY29udGVudHMsXG5cdFx0ZGF0YVR5cGVzID0gcy5kYXRhVHlwZXM7XG5cblx0Ly8gUmVtb3ZlIGF1dG8gZGF0YVR5cGUgYW5kIGdldCBjb250ZW50LXR5cGUgaW4gdGhlIHByb2Nlc3Ncblx0d2hpbGUoIGRhdGFUeXBlc1sgMCBdID09PSBcIipcIiApIHtcblx0XHRkYXRhVHlwZXMuc2hpZnQoKTtcblx0XHRpZiAoIGN0ID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRjdCA9IHMubWltZVR5cGUgfHwganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIik7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgd2UncmUgZGVhbGluZyB3aXRoIGEga25vd24gY29udGVudC10eXBlXG5cdGlmICggY3QgKSB7XG5cdFx0Zm9yICggdHlwZSBpbiBjb250ZW50cyApIHtcblx0XHRcdGlmICggY29udGVudHNbIHR5cGUgXSAmJiBjb250ZW50c1sgdHlwZSBdLnRlc3QoIGN0ICkgKSB7XG5cdFx0XHRcdGRhdGFUeXBlcy51bnNoaWZ0KCB0eXBlICk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENoZWNrIHRvIHNlZSBpZiB3ZSBoYXZlIGEgcmVzcG9uc2UgZm9yIHRoZSBleHBlY3RlZCBkYXRhVHlwZVxuXHRpZiAoIGRhdGFUeXBlc1sgMCBdIGluIHJlc3BvbnNlcyApIHtcblx0XHRmaW5hbERhdGFUeXBlID0gZGF0YVR5cGVzWyAwIF07XG5cdH0gZWxzZSB7XG5cdFx0Ly8gVHJ5IGNvbnZlcnRpYmxlIGRhdGFUeXBlc1xuXHRcdGZvciAoIHR5cGUgaW4gcmVzcG9uc2VzICkge1xuXHRcdFx0aWYgKCAhZGF0YVR5cGVzWyAwIF0gfHwgcy5jb252ZXJ0ZXJzWyB0eXBlICsgXCIgXCIgKyBkYXRhVHlwZXNbMF0gXSApIHtcblx0XHRcdFx0ZmluYWxEYXRhVHlwZSA9IHR5cGU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCAhZmlyc3REYXRhVHlwZSApIHtcblx0XHRcdFx0Zmlyc3REYXRhVHlwZSA9IHR5cGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIE9yIGp1c3QgdXNlIGZpcnN0IG9uZVxuXHRcdGZpbmFsRGF0YVR5cGUgPSBmaW5hbERhdGFUeXBlIHx8IGZpcnN0RGF0YVR5cGU7XG5cdH1cblxuXHQvLyBJZiB3ZSBmb3VuZCBhIGRhdGFUeXBlXG5cdC8vIFdlIGFkZCB0aGUgZGF0YVR5cGUgdG8gdGhlIGxpc3QgaWYgbmVlZGVkXG5cdC8vIGFuZCByZXR1cm4gdGhlIGNvcnJlc3BvbmRpbmcgcmVzcG9uc2Vcblx0aWYgKCBmaW5hbERhdGFUeXBlICkge1xuXHRcdGlmICggZmluYWxEYXRhVHlwZSAhPT0gZGF0YVR5cGVzWyAwIF0gKSB7XG5cdFx0XHRkYXRhVHlwZXMudW5zaGlmdCggZmluYWxEYXRhVHlwZSApO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzcG9uc2VzWyBmaW5hbERhdGFUeXBlIF07XG5cdH1cbn1cblxuLyogQ2hhaW4gY29udmVyc2lvbnMgZ2l2ZW4gdGhlIHJlcXVlc3QgYW5kIHRoZSBvcmlnaW5hbCByZXNwb25zZVxuICogQWxzbyBzZXRzIHRoZSByZXNwb25zZVhYWCBmaWVsZHMgb24gdGhlIGpxWEhSIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGFqYXhDb252ZXJ0KCBzLCByZXNwb25zZSwganFYSFIsIGlzU3VjY2VzcyApIHtcblx0dmFyIGNvbnYyLCBjdXJyZW50LCBjb252LCB0bXAsIHByZXYsXG5cdFx0Y29udmVydGVycyA9IHt9LFxuXHRcdC8vIFdvcmsgd2l0aCBhIGNvcHkgb2YgZGF0YVR5cGVzIGluIGNhc2Ugd2UgbmVlZCB0byBtb2RpZnkgaXQgZm9yIGNvbnZlcnNpb25cblx0XHRkYXRhVHlwZXMgPSBzLmRhdGFUeXBlcy5zbGljZSgpO1xuXG5cdC8vIENyZWF0ZSBjb252ZXJ0ZXJzIG1hcCB3aXRoIGxvd2VyY2FzZWQga2V5c1xuXHRpZiAoIGRhdGFUeXBlc1sgMSBdICkge1xuXHRcdGZvciAoIGNvbnYgaW4gcy5jb252ZXJ0ZXJzICkge1xuXHRcdFx0Y29udmVydGVyc1sgY29udi50b0xvd2VyQ2FzZSgpIF0gPSBzLmNvbnZlcnRlcnNbIGNvbnYgXTtcblx0XHR9XG5cdH1cblxuXHRjdXJyZW50ID0gZGF0YVR5cGVzLnNoaWZ0KCk7XG5cblx0Ly8gQ29udmVydCB0byBlYWNoIHNlcXVlbnRpYWwgZGF0YVR5cGVcblx0d2hpbGUgKCBjdXJyZW50ICkge1xuXG5cdFx0aWYgKCBzLnJlc3BvbnNlRmllbGRzWyBjdXJyZW50IF0gKSB7XG5cdFx0XHRqcVhIUlsgcy5yZXNwb25zZUZpZWxkc1sgY3VycmVudCBdIF0gPSByZXNwb25zZTtcblx0XHR9XG5cblx0XHQvLyBBcHBseSB0aGUgZGF0YUZpbHRlciBpZiBwcm92aWRlZFxuXHRcdGlmICggIXByZXYgJiYgaXNTdWNjZXNzICYmIHMuZGF0YUZpbHRlciApIHtcblx0XHRcdHJlc3BvbnNlID0gcy5kYXRhRmlsdGVyKCByZXNwb25zZSwgcy5kYXRhVHlwZSApO1xuXHRcdH1cblxuXHRcdHByZXYgPSBjdXJyZW50O1xuXHRcdGN1cnJlbnQgPSBkYXRhVHlwZXMuc2hpZnQoKTtcblxuXHRcdGlmICggY3VycmVudCApIHtcblxuXHRcdC8vIFRoZXJlJ3Mgb25seSB3b3JrIHRvIGRvIGlmIGN1cnJlbnQgZGF0YVR5cGUgaXMgbm9uLWF1dG9cblx0XHRcdGlmICggY3VycmVudCA9PT0gXCIqXCIgKSB7XG5cblx0XHRcdFx0Y3VycmVudCA9IHByZXY7XG5cblx0XHRcdC8vIENvbnZlcnQgcmVzcG9uc2UgaWYgcHJldiBkYXRhVHlwZSBpcyBub24tYXV0byBhbmQgZGlmZmVycyBmcm9tIGN1cnJlbnRcblx0XHRcdH0gZWxzZSBpZiAoIHByZXYgIT09IFwiKlwiICYmIHByZXYgIT09IGN1cnJlbnQgKSB7XG5cblx0XHRcdFx0Ly8gU2VlayBhIGRpcmVjdCBjb252ZXJ0ZXJcblx0XHRcdFx0Y29udiA9IGNvbnZlcnRlcnNbIHByZXYgKyBcIiBcIiArIGN1cnJlbnQgXSB8fCBjb252ZXJ0ZXJzWyBcIiogXCIgKyBjdXJyZW50IF07XG5cblx0XHRcdFx0Ly8gSWYgbm9uZSBmb3VuZCwgc2VlayBhIHBhaXJcblx0XHRcdFx0aWYgKCAhY29udiApIHtcblx0XHRcdFx0XHRmb3IgKCBjb252MiBpbiBjb252ZXJ0ZXJzICkge1xuXG5cdFx0XHRcdFx0XHQvLyBJZiBjb252MiBvdXRwdXRzIGN1cnJlbnRcblx0XHRcdFx0XHRcdHRtcCA9IGNvbnYyLnNwbGl0KCBcIiBcIiApO1xuXHRcdFx0XHRcdFx0aWYgKCB0bXBbIDEgXSA9PT0gY3VycmVudCApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBJZiBwcmV2IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYWNjZXB0ZWQgaW5wdXRcblx0XHRcdFx0XHRcdFx0Y29udiA9IGNvbnZlcnRlcnNbIHByZXYgKyBcIiBcIiArIHRtcFsgMCBdIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRjb252ZXJ0ZXJzWyBcIiogXCIgKyB0bXBbIDAgXSBdO1xuXHRcdFx0XHRcdFx0XHRpZiAoIGNvbnYgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ29uZGVuc2UgZXF1aXZhbGVuY2UgY29udmVydGVyc1xuXHRcdFx0XHRcdFx0XHRcdGlmICggY29udiA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnYgPSBjb252ZXJ0ZXJzWyBjb252MiBdO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCBpbnNlcnQgdGhlIGludGVybWVkaWF0ZSBkYXRhVHlwZVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIGNvbnZlcnRlcnNbIGNvbnYyIF0gIT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50ID0gdG1wWyAwIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhVHlwZXMudW5zaGlmdCggdG1wWyAxIF0gKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBcHBseSBjb252ZXJ0ZXIgKGlmIG5vdCBhbiBlcXVpdmFsZW5jZSlcblx0XHRcdFx0aWYgKCBjb252ICE9PSB0cnVlICkge1xuXG5cdFx0XHRcdFx0Ly8gVW5sZXNzIGVycm9ycyBhcmUgYWxsb3dlZCB0byBidWJibGUsIGNhdGNoIGFuZCByZXR1cm4gdGhlbVxuXHRcdFx0XHRcdGlmICggY29udiAmJiBzWyBcInRocm93c1wiIF0gKSB7XG5cdFx0XHRcdFx0XHRyZXNwb25zZSA9IGNvbnYoIHJlc3BvbnNlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gY29udiggcmVzcG9uc2UgKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4geyBzdGF0ZTogXCJwYXJzZXJlcnJvclwiLCBlcnJvcjogY29udiA/IGUgOiBcIk5vIGNvbnZlcnNpb24gZnJvbSBcIiArIHByZXYgKyBcIiB0byBcIiArIGN1cnJlbnQgfTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4geyBzdGF0ZTogXCJzdWNjZXNzXCIsIGRhdGE6IHJlc3BvbnNlIH07XG59XG4vLyBJbnN0YWxsIHNjcmlwdCBkYXRhVHlwZVxualF1ZXJ5LmFqYXhTZXR1cCh7XG5cdGFjY2VwdHM6IHtcblx0XHRzY3JpcHQ6IFwidGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9lY21hc2NyaXB0LCBhcHBsaWNhdGlvbi94LWVjbWFzY3JpcHRcIlxuXHR9LFxuXHRjb250ZW50czoge1xuXHRcdHNjcmlwdDogLyg/OmphdmF8ZWNtYSlzY3JpcHQvXG5cdH0sXG5cdGNvbnZlcnRlcnM6IHtcblx0XHRcInRleHQgc2NyaXB0XCI6IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdFx0alF1ZXJ5Lmdsb2JhbEV2YWwoIHRleHQgKTtcblx0XHRcdHJldHVybiB0ZXh0O1xuXHRcdH1cblx0fVxufSk7XG5cbi8vIEhhbmRsZSBjYWNoZSdzIHNwZWNpYWwgY2FzZSBhbmQgY3Jvc3NEb21haW5cbmpRdWVyeS5hamF4UHJlZmlsdGVyKCBcInNjcmlwdFwiLCBmdW5jdGlvbiggcyApIHtcblx0aWYgKCBzLmNhY2hlID09PSB1bmRlZmluZWQgKSB7XG5cdFx0cy5jYWNoZSA9IGZhbHNlO1xuXHR9XG5cdGlmICggcy5jcm9zc0RvbWFpbiApIHtcblx0XHRzLnR5cGUgPSBcIkdFVFwiO1xuXHR9XG59KTtcblxuLy8gQmluZCBzY3JpcHQgdGFnIGhhY2sgdHJhbnNwb3J0XG5qUXVlcnkuYWpheFRyYW5zcG9ydCggXCJzY3JpcHRcIiwgZnVuY3Rpb24oIHMgKSB7XG5cdC8vIFRoaXMgdHJhbnNwb3J0IG9ubHkgZGVhbHMgd2l0aCBjcm9zcyBkb21haW4gcmVxdWVzdHNcblx0aWYgKCBzLmNyb3NzRG9tYWluICkge1xuXHRcdHZhciBzY3JpcHQsIGNhbGxiYWNrO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZW5kOiBmdW5jdGlvbiggXywgY29tcGxldGUgKSB7XG5cdFx0XHRcdHNjcmlwdCA9IGpRdWVyeShcIjxzY3JpcHQ+XCIpLnByb3Aoe1xuXHRcdFx0XHRcdGFzeW5jOiB0cnVlLFxuXHRcdFx0XHRcdGNoYXJzZXQ6IHMuc2NyaXB0Q2hhcnNldCxcblx0XHRcdFx0XHRzcmM6IHMudXJsXG5cdFx0XHRcdH0pLm9uKFxuXHRcdFx0XHRcdFwibG9hZCBlcnJvclwiLFxuXHRcdFx0XHRcdGNhbGxiYWNrID0gZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdFx0XHRcdHNjcmlwdC5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrID0gbnVsbDtcblx0XHRcdFx0XHRcdGlmICggZXZ0ICkge1xuXHRcdFx0XHRcdFx0XHRjb21wbGV0ZSggZXZ0LnR5cGUgPT09IFwiZXJyb3JcIiA/IDQwNCA6IDIwMCwgZXZ0LnR5cGUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoIHNjcmlwdFsgMCBdICk7XG5cdFx0XHR9LFxuXHRcdFx0YWJvcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIGNhbGxiYWNrICkge1xuXHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9XG59KTtcbnZhciBvbGRDYWxsYmFja3MgPSBbXSxcblx0cmpzb25wID0gLyg9KVxcPyg/PSZ8JCl8XFw/XFw/LztcblxuLy8gRGVmYXVsdCBqc29ucCBzZXR0aW5nc1xualF1ZXJ5LmFqYXhTZXR1cCh7XG5cdGpzb25wOiBcImNhbGxiYWNrXCIsXG5cdGpzb25wQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjYWxsYmFjayA9IG9sZENhbGxiYWNrcy5wb3AoKSB8fCAoIGpRdWVyeS5leHBhbmRvICsgXCJfXCIgKyAoIGFqYXhfbm9uY2UrKyApICk7XG5cdFx0dGhpc1sgY2FsbGJhY2sgXSA9IHRydWU7XG5cdFx0cmV0dXJuIGNhbGxiYWNrO1xuXHR9XG59KTtcblxuLy8gRGV0ZWN0LCBub3JtYWxpemUgb3B0aW9ucyBhbmQgaW5zdGFsbCBjYWxsYmFja3MgZm9yIGpzb25wIHJlcXVlc3RzXG5qUXVlcnkuYWpheFByZWZpbHRlciggXCJqc29uIGpzb25wXCIsIGZ1bmN0aW9uKCBzLCBvcmlnaW5hbFNldHRpbmdzLCBqcVhIUiApIHtcblxuXHR2YXIgY2FsbGJhY2tOYW1lLCBvdmVyd3JpdHRlbiwgcmVzcG9uc2VDb250YWluZXIsXG5cdFx0anNvblByb3AgPSBzLmpzb25wICE9PSBmYWxzZSAmJiAoIHJqc29ucC50ZXN0KCBzLnVybCApID9cblx0XHRcdFwidXJsXCIgOlxuXHRcdFx0dHlwZW9mIHMuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJiAhKCBzLmNvbnRlbnRUeXBlIHx8IFwiXCIgKS5pbmRleE9mKFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpICYmIHJqc29ucC50ZXN0KCBzLmRhdGEgKSAmJiBcImRhdGFcIlxuXHRcdCk7XG5cblx0Ly8gSGFuZGxlIGlmZiB0aGUgZXhwZWN0ZWQgZGF0YSB0eXBlIGlzIFwianNvbnBcIiBvciB3ZSBoYXZlIGEgcGFyYW1ldGVyIHRvIHNldFxuXHRpZiAoIGpzb25Qcm9wIHx8IHMuZGF0YVR5cGVzWyAwIF0gPT09IFwianNvbnBcIiApIHtcblxuXHRcdC8vIEdldCBjYWxsYmFjayBuYW1lLCByZW1lbWJlcmluZyBwcmVleGlzdGluZyB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggaXRcblx0XHRjYWxsYmFja05hbWUgPSBzLmpzb25wQ2FsbGJhY2sgPSBqUXVlcnkuaXNGdW5jdGlvbiggcy5qc29ucENhbGxiYWNrICkgP1xuXHRcdFx0cy5qc29ucENhbGxiYWNrKCkgOlxuXHRcdFx0cy5qc29ucENhbGxiYWNrO1xuXG5cdFx0Ly8gSW5zZXJ0IGNhbGxiYWNrIGludG8gdXJsIG9yIGZvcm0gZGF0YVxuXHRcdGlmICgganNvblByb3AgKSB7XG5cdFx0XHRzWyBqc29uUHJvcCBdID0gc1sganNvblByb3AgXS5yZXBsYWNlKCByanNvbnAsIFwiJDFcIiArIGNhbGxiYWNrTmFtZSApO1xuXHRcdH0gZWxzZSBpZiAoIHMuanNvbnAgIT09IGZhbHNlICkge1xuXHRcdFx0cy51cmwgKz0gKCBhamF4X3JxdWVyeS50ZXN0KCBzLnVybCApID8gXCImXCIgOiBcIj9cIiApICsgcy5qc29ucCArIFwiPVwiICsgY2FsbGJhY2tOYW1lO1xuXHRcdH1cblxuXHRcdC8vIFVzZSBkYXRhIGNvbnZlcnRlciB0byByZXRyaWV2ZSBqc29uIGFmdGVyIHNjcmlwdCBleGVjdXRpb25cblx0XHRzLmNvbnZlcnRlcnNbXCJzY3JpcHQganNvblwiXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhcmVzcG9uc2VDb250YWluZXIgKSB7XG5cdFx0XHRcdGpRdWVyeS5lcnJvciggY2FsbGJhY2tOYW1lICsgXCIgd2FzIG5vdCBjYWxsZWRcIiApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlQ29udGFpbmVyWyAwIF07XG5cdFx0fTtcblxuXHRcdC8vIGZvcmNlIGpzb24gZGF0YVR5cGVcblx0XHRzLmRhdGFUeXBlc1sgMCBdID0gXCJqc29uXCI7XG5cblx0XHQvLyBJbnN0YWxsIGNhbGxiYWNrXG5cdFx0b3ZlcndyaXR0ZW4gPSB3aW5kb3dbIGNhbGxiYWNrTmFtZSBdO1xuXHRcdHdpbmRvd1sgY2FsbGJhY2tOYW1lIF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlc3BvbnNlQ29udGFpbmVyID0gYXJndW1lbnRzO1xuXHRcdH07XG5cblx0XHQvLyBDbGVhbi11cCBmdW5jdGlvbiAoZmlyZXMgYWZ0ZXIgY29udmVydGVycylcblx0XHRqcVhIUi5hbHdheXMoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBSZXN0b3JlIHByZWV4aXN0aW5nIHZhbHVlXG5cdFx0XHR3aW5kb3dbIGNhbGxiYWNrTmFtZSBdID0gb3ZlcndyaXR0ZW47XG5cblx0XHRcdC8vIFNhdmUgYmFjayBhcyBmcmVlXG5cdFx0XHRpZiAoIHNbIGNhbGxiYWNrTmFtZSBdICkge1xuXHRcdFx0XHQvLyBtYWtlIHN1cmUgdGhhdCByZS11c2luZyB0aGUgb3B0aW9ucyBkb2Vzbid0IHNjcmV3IHRoaW5ncyBhcm91bmRcblx0XHRcdFx0cy5qc29ucENhbGxiYWNrID0gb3JpZ2luYWxTZXR0aW5ncy5qc29ucENhbGxiYWNrO1xuXG5cdFx0XHRcdC8vIHNhdmUgdGhlIGNhbGxiYWNrIG5hbWUgZm9yIGZ1dHVyZSB1c2Vcblx0XHRcdFx0b2xkQ2FsbGJhY2tzLnB1c2goIGNhbGxiYWNrTmFtZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDYWxsIGlmIGl0IHdhcyBhIGZ1bmN0aW9uIGFuZCB3ZSBoYXZlIGEgcmVzcG9uc2Vcblx0XHRcdGlmICggcmVzcG9uc2VDb250YWluZXIgJiYgalF1ZXJ5LmlzRnVuY3Rpb24oIG92ZXJ3cml0dGVuICkgKSB7XG5cdFx0XHRcdG92ZXJ3cml0dGVuKCByZXNwb25zZUNvbnRhaW5lclsgMCBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHJlc3BvbnNlQ29udGFpbmVyID0gb3ZlcndyaXR0ZW4gPSB1bmRlZmluZWQ7XG5cdFx0fSk7XG5cblx0XHQvLyBEZWxlZ2F0ZSB0byBzY3JpcHRcblx0XHRyZXR1cm4gXCJzY3JpcHRcIjtcblx0fVxufSk7XG5qUXVlcnkuYWpheFNldHRpbmdzLnhociA9IGZ1bmN0aW9uKCkge1xuXHR0cnkge1xuXHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0fSBjYXRjaCggZSApIHt9XG59O1xuXG52YXIgeGhyU3VwcG9ydGVkID0galF1ZXJ5LmFqYXhTZXR0aW5ncy54aHIoKSxcblx0eGhyU3VjY2Vzc1N0YXR1cyA9IHtcblx0XHQvLyBmaWxlIHByb3RvY29sIGFsd2F5cyB5aWVsZHMgc3RhdHVzIGNvZGUgMCwgYXNzdW1lIDIwMFxuXHRcdDA6IDIwMCxcblx0XHQvLyBTdXBwb3J0OiBJRTlcblx0XHQvLyAjMTQ1MDogc29tZXRpbWVzIElFIHJldHVybnMgMTIyMyB3aGVuIGl0IHNob3VsZCBiZSAyMDRcblx0XHQxMjIzOiAyMDRcblx0fSxcblx0Ly8gU3VwcG9ydDogSUU5XG5cdC8vIFdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiBvdXRib3VuZCB4aHIgYW5kIGFib3J0IHRoZW0gbWFudWFsbHlcblx0Ly8gYmVjYXVzZSBJRSBpcyBub3Qgc21hcnQgZW5vdWdoIHRvIGRvIGl0IGFsbCBieSBpdHNlbGZcblx0eGhySWQgPSAwLFxuXHR4aHJDYWxsYmFja3MgPSB7fTtcblxuaWYgKCB3aW5kb3cuQWN0aXZlWE9iamVjdCApIHtcblx0alF1ZXJ5KCB3aW5kb3cgKS5vbiggXCJ1bmxvYWRcIiwgZnVuY3Rpb24oKSB7XG5cdFx0Zm9yKCB2YXIga2V5IGluIHhockNhbGxiYWNrcyApIHtcblx0XHRcdHhockNhbGxiYWNrc1sga2V5IF0oKTtcblx0XHR9XG5cdFx0eGhyQ2FsbGJhY2tzID0gdW5kZWZpbmVkO1xuXHR9KTtcbn1cblxualF1ZXJ5LnN1cHBvcnQuY29ycyA9ICEheGhyU3VwcG9ydGVkICYmICggXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB4aHJTdXBwb3J0ZWQgKTtcbmpRdWVyeS5zdXBwb3J0LmFqYXggPSB4aHJTdXBwb3J0ZWQgPSAhIXhoclN1cHBvcnRlZDtcblxualF1ZXJ5LmFqYXhUcmFuc3BvcnQoZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdHZhciBjYWxsYmFjaztcblx0Ly8gQ3Jvc3MgZG9tYWluIG9ubHkgYWxsb3dlZCBpZiBzdXBwb3J0ZWQgdGhyb3VnaCBYTUxIdHRwUmVxdWVzdFxuXHRpZiAoIGpRdWVyeS5zdXBwb3J0LmNvcnMgfHwgeGhyU3VwcG9ydGVkICYmICFvcHRpb25zLmNyb3NzRG9tYWluICkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZW5kOiBmdW5jdGlvbiggaGVhZGVycywgY29tcGxldGUgKSB7XG5cdFx0XHRcdHZhciBpLCBpZCxcblx0XHRcdFx0XHR4aHIgPSBvcHRpb25zLnhocigpO1xuXHRcdFx0XHR4aHIub3Blbiggb3B0aW9ucy50eXBlLCBvcHRpb25zLnVybCwgb3B0aW9ucy5hc3luYywgb3B0aW9ucy51c2VybmFtZSwgb3B0aW9ucy5wYXNzd29yZCApO1xuXHRcdFx0XHQvLyBBcHBseSBjdXN0b20gZmllbGRzIGlmIHByb3ZpZGVkXG5cdFx0XHRcdGlmICggb3B0aW9ucy54aHJGaWVsZHMgKSB7XG5cdFx0XHRcdFx0Zm9yICggaSBpbiBvcHRpb25zLnhockZpZWxkcyApIHtcblx0XHRcdFx0XHRcdHhoclsgaSBdID0gb3B0aW9ucy54aHJGaWVsZHNbIGkgXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gT3ZlcnJpZGUgbWltZSB0eXBlIGlmIG5lZWRlZFxuXHRcdFx0XHRpZiAoIG9wdGlvbnMubWltZVR5cGUgJiYgeGhyLm92ZXJyaWRlTWltZVR5cGUgKSB7XG5cdFx0XHRcdFx0eGhyLm92ZXJyaWRlTWltZVR5cGUoIG9wdGlvbnMubWltZVR5cGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBYLVJlcXVlc3RlZC1XaXRoIGhlYWRlclxuXHRcdFx0XHQvLyBGb3IgY3Jvc3MtZG9tYWluIHJlcXVlc3RzLCBzZWVpbmcgYXMgY29uZGl0aW9ucyBmb3IgYSBwcmVmbGlnaHQgYXJlXG5cdFx0XHRcdC8vIGFraW4gdG8gYSBqaWdzYXcgcHV6emxlLCB3ZSBzaW1wbHkgbmV2ZXIgc2V0IGl0IHRvIGJlIHN1cmUuXG5cdFx0XHRcdC8vIChpdCBjYW4gYWx3YXlzIGJlIHNldCBvbiBhIHBlci1yZXF1ZXN0IGJhc2lzIG9yIGV2ZW4gdXNpbmcgYWpheFNldHVwKVxuXHRcdFx0XHQvLyBGb3Igc2FtZS1kb21haW4gcmVxdWVzdHMsIHdvbid0IGNoYW5nZSBoZWFkZXIgaWYgYWxyZWFkeSBwcm92aWRlZC5cblx0XHRcdFx0aWYgKCAhb3B0aW9ucy5jcm9zc0RvbWFpbiAmJiAhaGVhZGVyc1tcIlgtUmVxdWVzdGVkLVdpdGhcIl0gKSB7XG5cdFx0XHRcdFx0aGVhZGVyc1tcIlgtUmVxdWVzdGVkLVdpdGhcIl0gPSBcIlhNTEh0dHBSZXF1ZXN0XCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gU2V0IGhlYWRlcnNcblx0XHRcdFx0Zm9yICggaSBpbiBoZWFkZXJzICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBpLCBoZWFkZXJzWyBpIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBDYWxsYmFja1xuXHRcdFx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKCB0eXBlICkge1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmICggY2FsbGJhY2sgKSB7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSB4aHJDYWxsYmFja3NbIGlkIF07XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrID0geGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0aWYgKCB0eXBlID09PSBcImFib3J0XCIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0eGhyLmFib3J0KCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIHR5cGUgPT09IFwiZXJyb3JcIiApIHtcblx0XHRcdFx0XHRcdFx0XHRjb21wbGV0ZShcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGZpbGUgcHJvdG9jb2wgYWx3YXlzIHlpZWxkcyBzdGF0dXMgMCwgYXNzdW1lIDQwNFxuXHRcdFx0XHRcdFx0XHRcdFx0eGhyLnN0YXR1cyB8fCA0MDQsXG5cdFx0XHRcdFx0XHRcdFx0XHR4aHIuc3RhdHVzVGV4dFxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29tcGxldGUoXG5cdFx0XHRcdFx0XHRcdFx0XHR4aHJTdWNjZXNzU3RhdHVzWyB4aHIuc3RhdHVzIF0gfHwgeGhyLnN0YXR1cyxcblx0XHRcdFx0XHRcdFx0XHRcdHhoci5zdGF0dXNUZXh0LFxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUU5XG5cdFx0XHRcdFx0XHRcdFx0XHQvLyAjMTE0MjY6IFdoZW4gcmVxdWVzdGluZyBiaW5hcnkgZGF0YSwgSUU5IHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBvbiBhbnkgYXR0ZW1wdCB0byBhY2Nlc3MgcmVzcG9uc2VUZXh0XG5cdFx0XHRcdFx0XHRcdFx0XHR0eXBlb2YgeGhyLnJlc3BvbnNlVGV4dCA9PT0gXCJzdHJpbmdcIiA/IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGV4dDogeGhyLnJlc3BvbnNlVGV4dFxuXHRcdFx0XHRcdFx0XHRcdFx0fSA6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdFx0XHRcdHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQvLyBMaXN0ZW4gdG8gZXZlbnRzXG5cdFx0XHRcdHhoci5vbmxvYWQgPSBjYWxsYmFjaygpO1xuXHRcdFx0XHR4aHIub25lcnJvciA9IGNhbGxiYWNrKFwiZXJyb3JcIik7XG5cdFx0XHRcdC8vIENyZWF0ZSB0aGUgYWJvcnQgY2FsbGJhY2tcblx0XHRcdFx0Y2FsbGJhY2sgPSB4aHJDYWxsYmFja3NbKCBpZCA9IHhocklkKysgKV0gPSBjYWxsYmFjayhcImFib3J0XCIpO1xuXHRcdFx0XHQvLyBEbyBzZW5kIHRoZSByZXF1ZXN0XG5cdFx0XHRcdC8vIFRoaXMgbWF5IHJhaXNlIGFuIGV4Y2VwdGlvbiB3aGljaCBpcyBhY3R1YWxseVxuXHRcdFx0XHQvLyBoYW5kbGVkIGluIGpRdWVyeS5hamF4IChzbyBubyB0cnkvY2F0Y2ggaGVyZSlcblx0XHRcdFx0eGhyLnNlbmQoIG9wdGlvbnMuaGFzQ29udGVudCAmJiBvcHRpb25zLmRhdGEgfHwgbnVsbCApO1xuXHRcdFx0fSxcblx0XHRcdGFib3J0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBjYWxsYmFjayApIHtcblx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSk7XG52YXIgZnhOb3csIHRpbWVySWQsXG5cdHJmeHR5cGVzID0gL14oPzp0b2dnbGV8c2hvd3xoaWRlKSQvLFxuXHRyZnhudW0gPSBuZXcgUmVnRXhwKCBcIl4oPzooWystXSk9fCkoXCIgKyBjb3JlX3BudW0gKyBcIikoW2EteiVdKikkXCIsIFwiaVwiICksXG5cdHJydW4gPSAvcXVldWVIb29rcyQvLFxuXHRhbmltYXRpb25QcmVmaWx0ZXJzID0gWyBkZWZhdWx0UHJlZmlsdGVyIF0sXG5cdHR3ZWVuZXJzID0ge1xuXHRcdFwiKlwiOiBbZnVuY3Rpb24oIHByb3AsIHZhbHVlICkge1xuXHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5jcmVhdGVUd2VlbiggcHJvcCwgdmFsdWUgKSxcblx0XHRcdFx0dGFyZ2V0ID0gdHdlZW4uY3VyKCksXG5cdFx0XHRcdHBhcnRzID0gcmZ4bnVtLmV4ZWMoIHZhbHVlICksXG5cdFx0XHRcdHVuaXQgPSBwYXJ0cyAmJiBwYXJ0c1sgMyBdIHx8ICggalF1ZXJ5LmNzc051bWJlclsgcHJvcCBdID8gXCJcIiA6IFwicHhcIiApLFxuXG5cdFx0XHRcdC8vIFN0YXJ0aW5nIHZhbHVlIGNvbXB1dGF0aW9uIGlzIHJlcXVpcmVkIGZvciBwb3RlbnRpYWwgdW5pdCBtaXNtYXRjaGVzXG5cdFx0XHRcdHN0YXJ0ID0gKCBqUXVlcnkuY3NzTnVtYmVyWyBwcm9wIF0gfHwgdW5pdCAhPT0gXCJweFwiICYmICt0YXJnZXQgKSAmJlxuXHRcdFx0XHRcdHJmeG51bS5leGVjKCBqUXVlcnkuY3NzKCB0d2Vlbi5lbGVtLCBwcm9wICkgKSxcblx0XHRcdFx0c2NhbGUgPSAxLFxuXHRcdFx0XHRtYXhJdGVyYXRpb25zID0gMjA7XG5cblx0XHRcdGlmICggc3RhcnQgJiYgc3RhcnRbIDMgXSAhPT0gdW5pdCApIHtcblx0XHRcdFx0Ly8gVHJ1c3QgdW5pdHMgcmVwb3J0ZWQgYnkgalF1ZXJ5LmNzc1xuXHRcdFx0XHR1bml0ID0gdW5pdCB8fCBzdGFydFsgMyBdO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSB1cGRhdGUgdGhlIHR3ZWVuIHByb3BlcnRpZXMgbGF0ZXIgb25cblx0XHRcdFx0cGFydHMgPSBwYXJ0cyB8fCBbXTtcblxuXHRcdFx0XHQvLyBJdGVyYXRpdmVseSBhcHByb3hpbWF0ZSBmcm9tIGEgbm9uemVybyBzdGFydGluZyBwb2ludFxuXHRcdFx0XHRzdGFydCA9ICt0YXJnZXQgfHwgMTtcblxuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0Ly8gSWYgcHJldmlvdXMgaXRlcmF0aW9uIHplcm9lZCBvdXQsIGRvdWJsZSB1bnRpbCB3ZSBnZXQgKnNvbWV0aGluZypcblx0XHRcdFx0XHQvLyBVc2UgYSBzdHJpbmcgZm9yIGRvdWJsaW5nIGZhY3RvciBzbyB3ZSBkb24ndCBhY2NpZGVudGFsbHkgc2VlIHNjYWxlIGFzIHVuY2hhbmdlZCBiZWxvd1xuXHRcdFx0XHRcdHNjYWxlID0gc2NhbGUgfHwgXCIuNVwiO1xuXG5cdFx0XHRcdFx0Ly8gQWRqdXN0IGFuZCBhcHBseVxuXHRcdFx0XHRcdHN0YXJ0ID0gc3RhcnQgLyBzY2FsZTtcblx0XHRcdFx0XHRqUXVlcnkuc3R5bGUoIHR3ZWVuLmVsZW0sIHByb3AsIHN0YXJ0ICsgdW5pdCApO1xuXG5cdFx0XHRcdC8vIFVwZGF0ZSBzY2FsZSwgdG9sZXJhdGluZyB6ZXJvIG9yIE5hTiBmcm9tIHR3ZWVuLmN1cigpXG5cdFx0XHRcdC8vIEFuZCBicmVha2luZyB0aGUgbG9vcCBpZiBzY2FsZSBpcyB1bmNoYW5nZWQgb3IgcGVyZmVjdCwgb3IgaWYgd2UndmUganVzdCBoYWQgZW5vdWdoXG5cdFx0XHRcdH0gd2hpbGUgKCBzY2FsZSAhPT0gKHNjYWxlID0gdHdlZW4uY3VyKCkgLyB0YXJnZXQpICYmIHNjYWxlICE9PSAxICYmIC0tbWF4SXRlcmF0aW9ucyApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBVcGRhdGUgdHdlZW4gcHJvcGVydGllc1xuXHRcdFx0aWYgKCBwYXJ0cyApIHtcblx0XHRcdFx0c3RhcnQgPSB0d2Vlbi5zdGFydCA9ICtzdGFydCB8fCArdGFyZ2V0IHx8IDA7XG5cdFx0XHRcdHR3ZWVuLnVuaXQgPSB1bml0O1xuXHRcdFx0XHQvLyBJZiBhICs9Ly09IHRva2VuIHdhcyBwcm92aWRlZCwgd2UncmUgZG9pbmcgYSByZWxhdGl2ZSBhbmltYXRpb25cblx0XHRcdFx0dHdlZW4uZW5kID0gcGFydHNbIDEgXSA/XG5cdFx0XHRcdFx0c3RhcnQgKyAoIHBhcnRzWyAxIF0gKyAxICkgKiBwYXJ0c1sgMiBdIDpcblx0XHRcdFx0XHQrcGFydHNbIDIgXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHR3ZWVuO1xuXHRcdH1dXG5cdH07XG5cbi8vIEFuaW1hdGlvbnMgY3JlYXRlZCBzeW5jaHJvbm91c2x5IHdpbGwgcnVuIHN5bmNocm9ub3VzbHlcbmZ1bmN0aW9uIGNyZWF0ZUZ4Tm93KCkge1xuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdGZ4Tm93ID0gdW5kZWZpbmVkO1xuXHR9KTtcblx0cmV0dXJuICggZnhOb3cgPSBqUXVlcnkubm93KCkgKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVHdlZW4oIHZhbHVlLCBwcm9wLCBhbmltYXRpb24gKSB7XG5cdHZhciB0d2Vlbixcblx0XHRjb2xsZWN0aW9uID0gKCB0d2VlbmVyc1sgcHJvcCBdIHx8IFtdICkuY29uY2F0KCB0d2VlbmVyc1sgXCIqXCIgXSApLFxuXHRcdGluZGV4ID0gMCxcblx0XHRsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblx0Zm9yICggOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKyApIHtcblx0XHRpZiAoICh0d2VlbiA9IGNvbGxlY3Rpb25bIGluZGV4IF0uY2FsbCggYW5pbWF0aW9uLCBwcm9wLCB2YWx1ZSApKSApIHtcblxuXHRcdFx0Ly8gd2UncmUgZG9uZSB3aXRoIHRoaXMgcHJvcGVydHlcblx0XHRcdHJldHVybiB0d2Vlbjtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gQW5pbWF0aW9uKCBlbGVtLCBwcm9wZXJ0aWVzLCBvcHRpb25zICkge1xuXHR2YXIgcmVzdWx0LFxuXHRcdHN0b3BwZWQsXG5cdFx0aW5kZXggPSAwLFxuXHRcdGxlbmd0aCA9IGFuaW1hdGlvblByZWZpbHRlcnMubGVuZ3RoLFxuXHRcdGRlZmVycmVkID0galF1ZXJ5LkRlZmVycmVkKCkuYWx3YXlzKCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGRvbid0IG1hdGNoIGVsZW0gaW4gdGhlIDphbmltYXRlZCBzZWxlY3RvclxuXHRcdFx0ZGVsZXRlIHRpY2suZWxlbTtcblx0XHR9KSxcblx0XHR0aWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHN0b3BwZWQgKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBjdXJyZW50VGltZSA9IGZ4Tm93IHx8IGNyZWF0ZUZ4Tm93KCksXG5cdFx0XHRcdHJlbWFpbmluZyA9IE1hdGgubWF4KCAwLCBhbmltYXRpb24uc3RhcnRUaW1lICsgYW5pbWF0aW9uLmR1cmF0aW9uIC0gY3VycmVudFRpbWUgKSxcblx0XHRcdFx0Ly8gYXJjaGFpYyBjcmFzaCBidWcgd29uJ3QgYWxsb3cgdXMgdG8gdXNlIDEgLSAoIDAuNSB8fCAwICkgKCMxMjQ5Nylcblx0XHRcdFx0dGVtcCA9IHJlbWFpbmluZyAvIGFuaW1hdGlvbi5kdXJhdGlvbiB8fCAwLFxuXHRcdFx0XHRwZXJjZW50ID0gMSAtIHRlbXAsXG5cdFx0XHRcdGluZGV4ID0gMCxcblx0XHRcdFx0bGVuZ3RoID0gYW5pbWF0aW9uLnR3ZWVucy5sZW5ndGg7XG5cblx0XHRcdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdFx0XHRhbmltYXRpb24udHdlZW5zWyBpbmRleCBdLnJ1biggcGVyY2VudCApO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWZlcnJlZC5ub3RpZnlXaXRoKCBlbGVtLCBbIGFuaW1hdGlvbiwgcGVyY2VudCwgcmVtYWluaW5nIF0pO1xuXG5cdFx0XHRpZiAoIHBlcmNlbnQgPCAxICYmIGxlbmd0aCApIHtcblx0XHRcdFx0cmV0dXJuIHJlbWFpbmluZztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmVXaXRoKCBlbGVtLCBbIGFuaW1hdGlvbiBdICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGFuaW1hdGlvbiA9IGRlZmVycmVkLnByb21pc2Uoe1xuXHRcdFx0ZWxlbTogZWxlbSxcblx0XHRcdHByb3BzOiBqUXVlcnkuZXh0ZW5kKCB7fSwgcHJvcGVydGllcyApLFxuXHRcdFx0b3B0czogalF1ZXJ5LmV4dGVuZCggdHJ1ZSwgeyBzcGVjaWFsRWFzaW5nOiB7fSB9LCBvcHRpb25zICksXG5cdFx0XHRvcmlnaW5hbFByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG5cdFx0XHRvcmlnaW5hbE9wdGlvbnM6IG9wdGlvbnMsXG5cdFx0XHRzdGFydFRpbWU6IGZ4Tm93IHx8IGNyZWF0ZUZ4Tm93KCksXG5cdFx0XHRkdXJhdGlvbjogb3B0aW9ucy5kdXJhdGlvbixcblx0XHRcdHR3ZWVuczogW10sXG5cdFx0XHRjcmVhdGVUd2VlbjogZnVuY3Rpb24oIHByb3AsIGVuZCApIHtcblx0XHRcdFx0dmFyIHR3ZWVuID0galF1ZXJ5LlR3ZWVuKCBlbGVtLCBhbmltYXRpb24ub3B0cywgcHJvcCwgZW5kLFxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uLm9wdHMuc3BlY2lhbEVhc2luZ1sgcHJvcCBdIHx8IGFuaW1hdGlvbi5vcHRzLmVhc2luZyApO1xuXHRcdFx0XHRhbmltYXRpb24udHdlZW5zLnB1c2goIHR3ZWVuICk7XG5cdFx0XHRcdHJldHVybiB0d2Vlbjtcblx0XHRcdH0sXG5cdFx0XHRzdG9wOiBmdW5jdGlvbiggZ290b0VuZCApIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gMCxcblx0XHRcdFx0XHQvLyBpZiB3ZSBhcmUgZ29pbmcgdG8gdGhlIGVuZCwgd2Ugd2FudCB0byBydW4gYWxsIHRoZSB0d2VlbnNcblx0XHRcdFx0XHQvLyBvdGhlcndpc2Ugd2Ugc2tpcCB0aGlzIHBhcnRcblx0XHRcdFx0XHRsZW5ndGggPSBnb3RvRW5kID8gYW5pbWF0aW9uLnR3ZWVucy5sZW5ndGggOiAwO1xuXHRcdFx0XHRpZiAoIHN0b3BwZWQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RvcHBlZCA9IHRydWU7XG5cdFx0XHRcdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdFx0XHRcdGFuaW1hdGlvbi50d2VlbnNbIGluZGV4IF0ucnVuKCAxICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyByZXNvbHZlIHdoZW4gd2UgcGxheWVkIHRoZSBsYXN0IGZyYW1lXG5cdFx0XHRcdC8vIG90aGVyd2lzZSwgcmVqZWN0XG5cdFx0XHRcdGlmICggZ290b0VuZCApIHtcblx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlV2l0aCggZWxlbSwgWyBhbmltYXRpb24sIGdvdG9FbmQgXSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdFdpdGgoIGVsZW0sIFsgYW5pbWF0aW9uLCBnb3RvRW5kIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcztcblx0XHRcdH1cblx0XHR9KSxcblx0XHRwcm9wcyA9IGFuaW1hdGlvbi5wcm9wcztcblxuXHRwcm9wRmlsdGVyKCBwcm9wcywgYW5pbWF0aW9uLm9wdHMuc3BlY2lhbEVhc2luZyApO1xuXG5cdGZvciAoIDsgaW5kZXggPCBsZW5ndGggOyBpbmRleCsrICkge1xuXHRcdHJlc3VsdCA9IGFuaW1hdGlvblByZWZpbHRlcnNbIGluZGV4IF0uY2FsbCggYW5pbWF0aW9uLCBlbGVtLCBwcm9wcywgYW5pbWF0aW9uLm9wdHMgKTtcblx0XHRpZiAoIHJlc3VsdCApIHtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHR9XG5cblx0alF1ZXJ5Lm1hcCggcHJvcHMsIGNyZWF0ZVR3ZWVuLCBhbmltYXRpb24gKTtcblxuXHRpZiAoIGpRdWVyeS5pc0Z1bmN0aW9uKCBhbmltYXRpb24ub3B0cy5zdGFydCApICkge1xuXHRcdGFuaW1hdGlvbi5vcHRzLnN0YXJ0LmNhbGwoIGVsZW0sIGFuaW1hdGlvbiApO1xuXHR9XG5cblx0alF1ZXJ5LmZ4LnRpbWVyKFxuXHRcdGpRdWVyeS5leHRlbmQoIHRpY2ssIHtcblx0XHRcdGVsZW06IGVsZW0sXG5cdFx0XHRhbmltOiBhbmltYXRpb24sXG5cdFx0XHRxdWV1ZTogYW5pbWF0aW9uLm9wdHMucXVldWVcblx0XHR9KVxuXHQpO1xuXG5cdC8vIGF0dGFjaCBjYWxsYmFja3MgZnJvbSBvcHRpb25zXG5cdHJldHVybiBhbmltYXRpb24ucHJvZ3Jlc3MoIGFuaW1hdGlvbi5vcHRzLnByb2dyZXNzIClcblx0XHQuZG9uZSggYW5pbWF0aW9uLm9wdHMuZG9uZSwgYW5pbWF0aW9uLm9wdHMuY29tcGxldGUgKVxuXHRcdC5mYWlsKCBhbmltYXRpb24ub3B0cy5mYWlsIClcblx0XHQuYWx3YXlzKCBhbmltYXRpb24ub3B0cy5hbHdheXMgKTtcbn1cblxuZnVuY3Rpb24gcHJvcEZpbHRlciggcHJvcHMsIHNwZWNpYWxFYXNpbmcgKSB7XG5cdHZhciBpbmRleCwgbmFtZSwgZWFzaW5nLCB2YWx1ZSwgaG9va3M7XG5cblx0Ly8gY2FtZWxDYXNlLCBzcGVjaWFsRWFzaW5nIGFuZCBleHBhbmQgY3NzSG9vayBwYXNzXG5cdGZvciAoIGluZGV4IGluIHByb3BzICkge1xuXHRcdG5hbWUgPSBqUXVlcnkuY2FtZWxDYXNlKCBpbmRleCApO1xuXHRcdGVhc2luZyA9IHNwZWNpYWxFYXNpbmdbIG5hbWUgXTtcblx0XHR2YWx1ZSA9IHByb3BzWyBpbmRleCBdO1xuXHRcdGlmICggalF1ZXJ5LmlzQXJyYXkoIHZhbHVlICkgKSB7XG5cdFx0XHRlYXNpbmcgPSB2YWx1ZVsgMSBdO1xuXHRcdFx0dmFsdWUgPSBwcm9wc1sgaW5kZXggXSA9IHZhbHVlWyAwIF07XG5cdFx0fVxuXG5cdFx0aWYgKCBpbmRleCAhPT0gbmFtZSApIHtcblx0XHRcdHByb3BzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdGRlbGV0ZSBwcm9wc1sgaW5kZXggXTtcblx0XHR9XG5cblx0XHRob29rcyA9IGpRdWVyeS5jc3NIb29rc1sgbmFtZSBdO1xuXHRcdGlmICggaG9va3MgJiYgXCJleHBhbmRcIiBpbiBob29rcyApIHtcblx0XHRcdHZhbHVlID0gaG9va3MuZXhwYW5kKCB2YWx1ZSApO1xuXHRcdFx0ZGVsZXRlIHByb3BzWyBuYW1lIF07XG5cblx0XHRcdC8vIG5vdCBxdWl0ZSAkLmV4dGVuZCwgdGhpcyB3b250IG92ZXJ3cml0ZSBrZXlzIGFscmVhZHkgcHJlc2VudC5cblx0XHRcdC8vIGFsc28gLSByZXVzaW5nICdpbmRleCcgZnJvbSBhYm92ZSBiZWNhdXNlIHdlIGhhdmUgdGhlIGNvcnJlY3QgXCJuYW1lXCJcblx0XHRcdGZvciAoIGluZGV4IGluIHZhbHVlICkge1xuXHRcdFx0XHRpZiAoICEoIGluZGV4IGluIHByb3BzICkgKSB7XG5cdFx0XHRcdFx0cHJvcHNbIGluZGV4IF0gPSB2YWx1ZVsgaW5kZXggXTtcblx0XHRcdFx0XHRzcGVjaWFsRWFzaW5nWyBpbmRleCBdID0gZWFzaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNwZWNpYWxFYXNpbmdbIG5hbWUgXSA9IGVhc2luZztcblx0XHR9XG5cdH1cbn1cblxualF1ZXJ5LkFuaW1hdGlvbiA9IGpRdWVyeS5leHRlbmQoIEFuaW1hdGlvbiwge1xuXG5cdHR3ZWVuZXI6IGZ1bmN0aW9uKCBwcm9wcywgY2FsbGJhY2sgKSB7XG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggcHJvcHMgKSApIHtcblx0XHRcdGNhbGxiYWNrID0gcHJvcHM7XG5cdFx0XHRwcm9wcyA9IFsgXCIqXCIgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cHJvcHMgPSBwcm9wcy5zcGxpdChcIiBcIik7XG5cdFx0fVxuXG5cdFx0dmFyIHByb3AsXG5cdFx0XHRpbmRleCA9IDAsXG5cdFx0XHRsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cblx0XHRmb3IgKCA7IGluZGV4IDwgbGVuZ3RoIDsgaW5kZXgrKyApIHtcblx0XHRcdHByb3AgPSBwcm9wc1sgaW5kZXggXTtcblx0XHRcdHR3ZWVuZXJzWyBwcm9wIF0gPSB0d2VlbmVyc1sgcHJvcCBdIHx8IFtdO1xuXHRcdFx0dHdlZW5lcnNbIHByb3AgXS51bnNoaWZ0KCBjYWxsYmFjayApO1xuXHRcdH1cblx0fSxcblxuXHRwcmVmaWx0ZXI6IGZ1bmN0aW9uKCBjYWxsYmFjaywgcHJlcGVuZCApIHtcblx0XHRpZiAoIHByZXBlbmQgKSB7XG5cdFx0XHRhbmltYXRpb25QcmVmaWx0ZXJzLnVuc2hpZnQoIGNhbGxiYWNrICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFuaW1hdGlvblByZWZpbHRlcnMucHVzaCggY2FsbGJhY2sgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiBkZWZhdWx0UHJlZmlsdGVyKCBlbGVtLCBwcm9wcywgb3B0cyApIHtcblx0LyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuXHR2YXIgcHJvcCwgdmFsdWUsIHRvZ2dsZSwgdHdlZW4sIGhvb2tzLCBvbGRmaXJlLFxuXHRcdGFuaW0gPSB0aGlzLFxuXHRcdG9yaWcgPSB7fSxcblx0XHRzdHlsZSA9IGVsZW0uc3R5bGUsXG5cdFx0aGlkZGVuID0gZWxlbS5ub2RlVHlwZSAmJiBpc0hpZGRlbiggZWxlbSApLFxuXHRcdGRhdGFTaG93ID0gZGF0YV9wcml2LmdldCggZWxlbSwgXCJmeHNob3dcIiApO1xuXG5cdC8vIGhhbmRsZSBxdWV1ZTogZmFsc2UgcHJvbWlzZXNcblx0aWYgKCAhb3B0cy5xdWV1ZSApIHtcblx0XHRob29rcyA9IGpRdWVyeS5fcXVldWVIb29rcyggZWxlbSwgXCJmeFwiICk7XG5cdFx0aWYgKCBob29rcy51bnF1ZXVlZCA9PSBudWxsICkge1xuXHRcdFx0aG9va3MudW5xdWV1ZWQgPSAwO1xuXHRcdFx0b2xkZmlyZSA9IGhvb2tzLmVtcHR5LmZpcmU7XG5cdFx0XHRob29rcy5lbXB0eS5maXJlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggIWhvb2tzLnVucXVldWVkICkge1xuXHRcdFx0XHRcdG9sZGZpcmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdFx0aG9va3MudW5xdWV1ZWQrKztcblxuXHRcdGFuaW0uYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gZG9pbmcgdGhpcyBtYWtlcyBzdXJlIHRoYXQgdGhlIGNvbXBsZXRlIGhhbmRsZXIgd2lsbCBiZSBjYWxsZWRcblx0XHRcdC8vIGJlZm9yZSB0aGlzIGNvbXBsZXRlc1xuXHRcdFx0YW5pbS5hbHdheXMoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGhvb2tzLnVucXVldWVkLS07XG5cdFx0XHRcdGlmICggIWpRdWVyeS5xdWV1ZSggZWxlbSwgXCJmeFwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGhvb2tzLmVtcHR5LmZpcmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBoZWlnaHQvd2lkdGggb3ZlcmZsb3cgcGFzc1xuXHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgJiYgKCBcImhlaWdodFwiIGluIHByb3BzIHx8IFwid2lkdGhcIiBpbiBwcm9wcyApICkge1xuXHRcdC8vIE1ha2Ugc3VyZSB0aGF0IG5vdGhpbmcgc25lYWtzIG91dFxuXHRcdC8vIFJlY29yZCBhbGwgMyBvdmVyZmxvdyBhdHRyaWJ1dGVzIGJlY2F1c2UgSUU5LTEwIGRvIG5vdFxuXHRcdC8vIGNoYW5nZSB0aGUgb3ZlcmZsb3cgYXR0cmlidXRlIHdoZW4gb3ZlcmZsb3dYIGFuZFxuXHRcdC8vIG92ZXJmbG93WSBhcmUgc2V0IHRvIHRoZSBzYW1lIHZhbHVlXG5cdFx0b3B0cy5vdmVyZmxvdyA9IFsgc3R5bGUub3ZlcmZsb3csIHN0eWxlLm92ZXJmbG93WCwgc3R5bGUub3ZlcmZsb3dZIF07XG5cblx0XHQvLyBTZXQgZGlzcGxheSBwcm9wZXJ0eSB0byBpbmxpbmUtYmxvY2sgZm9yIGhlaWdodC93aWR0aFxuXHRcdC8vIGFuaW1hdGlvbnMgb24gaW5saW5lIGVsZW1lbnRzIHRoYXQgYXJlIGhhdmluZyB3aWR0aC9oZWlnaHQgYW5pbWF0ZWRcblx0XHRpZiAoIGpRdWVyeS5jc3MoIGVsZW0sIFwiZGlzcGxheVwiICkgPT09IFwiaW5saW5lXCIgJiZcblx0XHRcdFx0alF1ZXJ5LmNzcyggZWxlbSwgXCJmbG9hdFwiICkgPT09IFwibm9uZVwiICkge1xuXG5cdFx0XHRzdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcblx0XHR9XG5cdH1cblxuXHRpZiAoIG9wdHMub3ZlcmZsb3cgKSB7XG5cdFx0c3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuXHRcdGFuaW0uYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0c3R5bGUub3ZlcmZsb3cgPSBvcHRzLm92ZXJmbG93WyAwIF07XG5cdFx0XHRzdHlsZS5vdmVyZmxvd1ggPSBvcHRzLm92ZXJmbG93WyAxIF07XG5cdFx0XHRzdHlsZS5vdmVyZmxvd1kgPSBvcHRzLm92ZXJmbG93WyAyIF07XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8vIHNob3cvaGlkZSBwYXNzXG5cdGZvciAoIHByb3AgaW4gcHJvcHMgKSB7XG5cdFx0dmFsdWUgPSBwcm9wc1sgcHJvcCBdO1xuXHRcdGlmICggcmZ4dHlwZXMuZXhlYyggdmFsdWUgKSApIHtcblx0XHRcdGRlbGV0ZSBwcm9wc1sgcHJvcCBdO1xuXHRcdFx0dG9nZ2xlID0gdG9nZ2xlIHx8IHZhbHVlID09PSBcInRvZ2dsZVwiO1xuXHRcdFx0aWYgKCB2YWx1ZSA9PT0gKCBoaWRkZW4gPyBcImhpZGVcIiA6IFwic2hvd1wiICkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgZGF0YVNob3cgbGVmdCBvdmVyIGZyb20gYSBzdG9wcGVkIGhpZGUgb3Igc2hvdyBhbmQgd2UgYXJlIGdvaW5nIHRvIHByb2NlZWQgd2l0aCBzaG93LCB3ZSBzaG91bGQgcHJldGVuZCB0byBiZSBoaWRkZW5cblx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gXCJzaG93XCIgJiYgZGF0YVNob3cgJiYgZGF0YVNob3dbIHByb3AgXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGhpZGRlbiA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG9yaWdbIHByb3AgXSA9IGRhdGFTaG93ICYmIGRhdGFTaG93WyBwcm9wIF0gfHwgalF1ZXJ5LnN0eWxlKCBlbGVtLCBwcm9wICk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhalF1ZXJ5LmlzRW1wdHlPYmplY3QoIG9yaWcgKSApIHtcblx0XHRpZiAoIGRhdGFTaG93ICkge1xuXHRcdFx0aWYgKCBcImhpZGRlblwiIGluIGRhdGFTaG93ICkge1xuXHRcdFx0XHRoaWRkZW4gPSBkYXRhU2hvdy5oaWRkZW47XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGFTaG93ID0gZGF0YV9wcml2LmFjY2VzcyggZWxlbSwgXCJmeHNob3dcIiwge30gKTtcblx0XHR9XG5cblx0XHQvLyBzdG9yZSBzdGF0ZSBpZiBpdHMgdG9nZ2xlIC0gZW5hYmxlcyAuc3RvcCgpLnRvZ2dsZSgpIHRvIFwicmV2ZXJzZVwiXG5cdFx0aWYgKCB0b2dnbGUgKSB7XG5cdFx0XHRkYXRhU2hvdy5oaWRkZW4gPSAhaGlkZGVuO1xuXHRcdH1cblx0XHRpZiAoIGhpZGRlbiApIHtcblx0XHRcdGpRdWVyeSggZWxlbSApLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YW5pbS5kb25lKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRqUXVlcnkoIGVsZW0gKS5oaWRlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0YW5pbS5kb25lKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHByb3A7XG5cblx0XHRcdGRhdGFfcHJpdi5yZW1vdmUoIGVsZW0sIFwiZnhzaG93XCIgKTtcblx0XHRcdGZvciAoIHByb3AgaW4gb3JpZyApIHtcblx0XHRcdFx0alF1ZXJ5LnN0eWxlKCBlbGVtLCBwcm9wLCBvcmlnWyBwcm9wIF0gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRmb3IgKCBwcm9wIGluIG9yaWcgKSB7XG5cdFx0XHR0d2VlbiA9IGNyZWF0ZVR3ZWVuKCBoaWRkZW4gPyBkYXRhU2hvd1sgcHJvcCBdIDogMCwgcHJvcCwgYW5pbSApO1xuXG5cdFx0XHRpZiAoICEoIHByb3AgaW4gZGF0YVNob3cgKSApIHtcblx0XHRcdFx0ZGF0YVNob3dbIHByb3AgXSA9IHR3ZWVuLnN0YXJ0O1xuXHRcdFx0XHRpZiAoIGhpZGRlbiApIHtcblx0XHRcdFx0XHR0d2Vlbi5lbmQgPSB0d2Vlbi5zdGFydDtcblx0XHRcdFx0XHR0d2Vlbi5zdGFydCA9IHByb3AgPT09IFwid2lkdGhcIiB8fCBwcm9wID09PSBcImhlaWdodFwiID8gMSA6IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gVHdlZW4oIGVsZW0sIG9wdGlvbnMsIHByb3AsIGVuZCwgZWFzaW5nICkge1xuXHRyZXR1cm4gbmV3IFR3ZWVuLnByb3RvdHlwZS5pbml0KCBlbGVtLCBvcHRpb25zLCBwcm9wLCBlbmQsIGVhc2luZyApO1xufVxualF1ZXJ5LlR3ZWVuID0gVHdlZW47XG5cblR3ZWVuLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IFR3ZWVuLFxuXHRpbml0OiBmdW5jdGlvbiggZWxlbSwgb3B0aW9ucywgcHJvcCwgZW5kLCBlYXNpbmcsIHVuaXQgKSB7XG5cdFx0dGhpcy5lbGVtID0gZWxlbTtcblx0XHR0aGlzLnByb3AgPSBwcm9wO1xuXHRcdHRoaXMuZWFzaW5nID0gZWFzaW5nIHx8IFwic3dpbmdcIjtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHRoaXMuc3RhcnQgPSB0aGlzLm5vdyA9IHRoaXMuY3VyKCk7XG5cdFx0dGhpcy5lbmQgPSBlbmQ7XG5cdFx0dGhpcy51bml0ID0gdW5pdCB8fCAoIGpRdWVyeS5jc3NOdW1iZXJbIHByb3AgXSA/IFwiXCIgOiBcInB4XCIgKTtcblx0fSxcblx0Y3VyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaG9va3MgPSBUd2Vlbi5wcm9wSG9va3NbIHRoaXMucHJvcCBdO1xuXG5cdFx0cmV0dXJuIGhvb2tzICYmIGhvb2tzLmdldCA/XG5cdFx0XHRob29rcy5nZXQoIHRoaXMgKSA6XG5cdFx0XHRUd2Vlbi5wcm9wSG9va3MuX2RlZmF1bHQuZ2V0KCB0aGlzICk7XG5cdH0sXG5cdHJ1bjogZnVuY3Rpb24oIHBlcmNlbnQgKSB7XG5cdFx0dmFyIGVhc2VkLFxuXHRcdFx0aG9va3MgPSBUd2Vlbi5wcm9wSG9va3NbIHRoaXMucHJvcCBdO1xuXG5cdFx0aWYgKCB0aGlzLm9wdGlvbnMuZHVyYXRpb24gKSB7XG5cdFx0XHR0aGlzLnBvcyA9IGVhc2VkID0galF1ZXJ5LmVhc2luZ1sgdGhpcy5lYXNpbmcgXShcblx0XHRcdFx0cGVyY2VudCwgdGhpcy5vcHRpb25zLmR1cmF0aW9uICogcGVyY2VudCwgMCwgMSwgdGhpcy5vcHRpb25zLmR1cmF0aW9uXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBvcyA9IGVhc2VkID0gcGVyY2VudDtcblx0XHR9XG5cdFx0dGhpcy5ub3cgPSAoIHRoaXMuZW5kIC0gdGhpcy5zdGFydCApICogZWFzZWQgKyB0aGlzLnN0YXJ0O1xuXG5cdFx0aWYgKCB0aGlzLm9wdGlvbnMuc3RlcCApIHtcblx0XHRcdHRoaXMub3B0aW9ucy5zdGVwLmNhbGwoIHRoaXMuZWxlbSwgdGhpcy5ub3csIHRoaXMgKTtcblx0XHR9XG5cblx0XHRpZiAoIGhvb2tzICYmIGhvb2tzLnNldCApIHtcblx0XHRcdGhvb2tzLnNldCggdGhpcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRUd2Vlbi5wcm9wSG9va3MuX2RlZmF1bHQuc2V0KCB0aGlzICk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59O1xuXG5Ud2Vlbi5wcm90b3R5cGUuaW5pdC5wcm90b3R5cGUgPSBUd2Vlbi5wcm90b3R5cGU7XG5cblR3ZWVuLnByb3BIb29rcyA9IHtcblx0X2RlZmF1bHQ6IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCB0d2VlbiApIHtcblx0XHRcdHZhciByZXN1bHQ7XG5cblx0XHRcdGlmICggdHdlZW4uZWxlbVsgdHdlZW4ucHJvcCBdICE9IG51bGwgJiZcblx0XHRcdFx0KCF0d2Vlbi5lbGVtLnN0eWxlIHx8IHR3ZWVuLmVsZW0uc3R5bGVbIHR3ZWVuLnByb3AgXSA9PSBudWxsKSApIHtcblx0XHRcdFx0cmV0dXJuIHR3ZWVuLmVsZW1bIHR3ZWVuLnByb3AgXTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcGFzc2luZyBhbiBlbXB0eSBzdHJpbmcgYXMgYSAzcmQgcGFyYW1ldGVyIHRvIC5jc3Mgd2lsbCBhdXRvbWF0aWNhbGx5XG5cdFx0XHQvLyBhdHRlbXB0IGEgcGFyc2VGbG9hdCBhbmQgZmFsbGJhY2sgdG8gYSBzdHJpbmcgaWYgdGhlIHBhcnNlIGZhaWxzXG5cdFx0XHQvLyBzbywgc2ltcGxlIHZhbHVlcyBzdWNoIGFzIFwiMTBweFwiIGFyZSBwYXJzZWQgdG8gRmxvYXQuXG5cdFx0XHQvLyBjb21wbGV4IHZhbHVlcyBzdWNoIGFzIFwicm90YXRlKDFyYWQpXCIgYXJlIHJldHVybmVkIGFzIGlzLlxuXHRcdFx0cmVzdWx0ID0galF1ZXJ5LmNzcyggdHdlZW4uZWxlbSwgdHdlZW4ucHJvcCwgXCJcIiApO1xuXHRcdFx0Ly8gRW1wdHkgc3RyaW5ncywgbnVsbCwgdW5kZWZpbmVkIGFuZCBcImF1dG9cIiBhcmUgY29udmVydGVkIHRvIDAuXG5cdFx0XHRyZXR1cm4gIXJlc3VsdCB8fCByZXN1bHQgPT09IFwiYXV0b1wiID8gMCA6IHJlc3VsdDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oIHR3ZWVuICkge1xuXHRcdFx0Ly8gdXNlIHN0ZXAgaG9vayBmb3IgYmFjayBjb21wYXQgLSB1c2UgY3NzSG9vayBpZiBpdHMgdGhlcmUgLSB1c2UgLnN0eWxlIGlmIGl0c1xuXHRcdFx0Ly8gYXZhaWxhYmxlIGFuZCB1c2UgcGxhaW4gcHJvcGVydGllcyB3aGVyZSBhdmFpbGFibGVcblx0XHRcdGlmICggalF1ZXJ5LmZ4LnN0ZXBbIHR3ZWVuLnByb3AgXSApIHtcblx0XHRcdFx0alF1ZXJ5LmZ4LnN0ZXBbIHR3ZWVuLnByb3AgXSggdHdlZW4gKTtcblx0XHRcdH0gZWxzZSBpZiAoIHR3ZWVuLmVsZW0uc3R5bGUgJiYgKCB0d2Vlbi5lbGVtLnN0eWxlWyBqUXVlcnkuY3NzUHJvcHNbIHR3ZWVuLnByb3AgXSBdICE9IG51bGwgfHwgalF1ZXJ5LmNzc0hvb2tzWyB0d2Vlbi5wcm9wIF0gKSApIHtcblx0XHRcdFx0alF1ZXJ5LnN0eWxlKCB0d2Vlbi5lbGVtLCB0d2Vlbi5wcm9wLCB0d2Vlbi5ub3cgKyB0d2Vlbi51bml0ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0d2Vlbi5lbGVtWyB0d2Vlbi5wcm9wIF0gPSB0d2Vlbi5ub3c7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4vLyBTdXBwb3J0OiBJRTlcbi8vIFBhbmljIGJhc2VkIGFwcHJvYWNoIHRvIHNldHRpbmcgdGhpbmdzIG9uIGRpc2Nvbm5lY3RlZCBub2Rlc1xuXG5Ud2Vlbi5wcm9wSG9va3Muc2Nyb2xsVG9wID0gVHdlZW4ucHJvcEhvb2tzLnNjcm9sbExlZnQgPSB7XG5cdHNldDogZnVuY3Rpb24oIHR3ZWVuICkge1xuXHRcdGlmICggdHdlZW4uZWxlbS5ub2RlVHlwZSAmJiB0d2Vlbi5lbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHR0d2Vlbi5lbGVtWyB0d2Vlbi5wcm9wIF0gPSB0d2Vlbi5ub3c7XG5cdFx0fVxuXHR9XG59O1xuXG5qUXVlcnkuZWFjaChbIFwidG9nZ2xlXCIsIFwic2hvd1wiLCBcImhpZGVcIiBdLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblx0dmFyIGNzc0ZuID0galF1ZXJ5LmZuWyBuYW1lIF07XG5cdGpRdWVyeS5mblsgbmFtZSBdID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXHRcdHJldHVybiBzcGVlZCA9PSBudWxsIHx8IHR5cGVvZiBzcGVlZCA9PT0gXCJib29sZWFuXCIgP1xuXHRcdFx0Y3NzRm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApIDpcblx0XHRcdHRoaXMuYW5pbWF0ZSggZ2VuRngoIG5hbWUsIHRydWUgKSwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKTtcblx0fTtcbn0pO1xuXG5qUXVlcnkuZm4uZXh0ZW5kKHtcblx0ZmFkZVRvOiBmdW5jdGlvbiggc3BlZWQsIHRvLCBlYXNpbmcsIGNhbGxiYWNrICkge1xuXG5cdFx0Ly8gc2hvdyBhbnkgaGlkZGVuIGVsZW1lbnRzIGFmdGVyIHNldHRpbmcgb3BhY2l0eSB0byAwXG5cdFx0cmV0dXJuIHRoaXMuZmlsdGVyKCBpc0hpZGRlbiApLmNzcyggXCJvcGFjaXR5XCIsIDAgKS5zaG93KClcblxuXHRcdFx0Ly8gYW5pbWF0ZSB0byB0aGUgdmFsdWUgc3BlY2lmaWVkXG5cdFx0XHQuZW5kKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IHRvIH0sIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICk7XG5cdH0sXG5cdGFuaW1hdGU6IGZ1bmN0aW9uKCBwcm9wLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApIHtcblx0XHR2YXIgZW1wdHkgPSBqUXVlcnkuaXNFbXB0eU9iamVjdCggcHJvcCApLFxuXHRcdFx0b3B0YWxsID0galF1ZXJ5LnNwZWVkKCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApLFxuXHRcdFx0ZG9BbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gT3BlcmF0ZSBvbiBhIGNvcHkgb2YgcHJvcCBzbyBwZXItcHJvcGVydHkgZWFzaW5nIHdvbid0IGJlIGxvc3Rcblx0XHRcdFx0dmFyIGFuaW0gPSBBbmltYXRpb24oIHRoaXMsIGpRdWVyeS5leHRlbmQoIHt9LCBwcm9wICksIG9wdGFsbCApO1xuXG5cdFx0XHRcdC8vIEVtcHR5IGFuaW1hdGlvbnMsIG9yIGZpbmlzaGluZyByZXNvbHZlcyBpbW1lZGlhdGVseVxuXHRcdFx0XHRpZiAoIGVtcHR5IHx8IGRhdGFfcHJpdi5nZXQoIHRoaXMsIFwiZmluaXNoXCIgKSApIHtcblx0XHRcdFx0XHRhbmltLnN0b3AoIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGRvQW5pbWF0aW9uLmZpbmlzaCA9IGRvQW5pbWF0aW9uO1xuXG5cdFx0cmV0dXJuIGVtcHR5IHx8IG9wdGFsbC5xdWV1ZSA9PT0gZmFsc2UgP1xuXHRcdFx0dGhpcy5lYWNoKCBkb0FuaW1hdGlvbiApIDpcblx0XHRcdHRoaXMucXVldWUoIG9wdGFsbC5xdWV1ZSwgZG9BbmltYXRpb24gKTtcblx0fSxcblx0c3RvcDogZnVuY3Rpb24oIHR5cGUsIGNsZWFyUXVldWUsIGdvdG9FbmQgKSB7XG5cdFx0dmFyIHN0b3BRdWV1ZSA9IGZ1bmN0aW9uKCBob29rcyApIHtcblx0XHRcdHZhciBzdG9wID0gaG9va3Muc3RvcDtcblx0XHRcdGRlbGV0ZSBob29rcy5zdG9wO1xuXHRcdFx0c3RvcCggZ290b0VuZCApO1xuXHRcdH07XG5cblx0XHRpZiAoIHR5cGVvZiB0eXBlICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0Z290b0VuZCA9IGNsZWFyUXVldWU7XG5cdFx0XHRjbGVhclF1ZXVlID0gdHlwZTtcblx0XHRcdHR5cGUgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdGlmICggY2xlYXJRdWV1ZSAmJiB0eXBlICE9PSBmYWxzZSApIHtcblx0XHRcdHRoaXMucXVldWUoIHR5cGUgfHwgXCJmeFwiLCBbXSApO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGVxdWV1ZSA9IHRydWUsXG5cdFx0XHRcdGluZGV4ID0gdHlwZSAhPSBudWxsICYmIHR5cGUgKyBcInF1ZXVlSG9va3NcIixcblx0XHRcdFx0dGltZXJzID0galF1ZXJ5LnRpbWVycyxcblx0XHRcdFx0ZGF0YSA9IGRhdGFfcHJpdi5nZXQoIHRoaXMgKTtcblxuXHRcdFx0aWYgKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCBkYXRhWyBpbmRleCBdICYmIGRhdGFbIGluZGV4IF0uc3RvcCApIHtcblx0XHRcdFx0XHRzdG9wUXVldWUoIGRhdGFbIGluZGV4IF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yICggaW5kZXggaW4gZGF0YSApIHtcblx0XHRcdFx0XHRpZiAoIGRhdGFbIGluZGV4IF0gJiYgZGF0YVsgaW5kZXggXS5zdG9wICYmIHJydW4udGVzdCggaW5kZXggKSApIHtcblx0XHRcdFx0XHRcdHN0b3BRdWV1ZSggZGF0YVsgaW5kZXggXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKCBpbmRleCA9IHRpbWVycy5sZW5ndGg7IGluZGV4LS07ICkge1xuXHRcdFx0XHRpZiAoIHRpbWVyc1sgaW5kZXggXS5lbGVtID09PSB0aGlzICYmICh0eXBlID09IG51bGwgfHwgdGltZXJzWyBpbmRleCBdLnF1ZXVlID09PSB0eXBlKSApIHtcblx0XHRcdFx0XHR0aW1lcnNbIGluZGV4IF0uYW5pbS5zdG9wKCBnb3RvRW5kICk7XG5cdFx0XHRcdFx0ZGVxdWV1ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdHRpbWVycy5zcGxpY2UoIGluZGV4LCAxICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gc3RhcnQgdGhlIG5leHQgaW4gdGhlIHF1ZXVlIGlmIHRoZSBsYXN0IHN0ZXAgd2Fzbid0IGZvcmNlZFxuXHRcdFx0Ly8gdGltZXJzIGN1cnJlbnRseSB3aWxsIGNhbGwgdGhlaXIgY29tcGxldGUgY2FsbGJhY2tzLCB3aGljaCB3aWxsIGRlcXVldWVcblx0XHRcdC8vIGJ1dCBvbmx5IGlmIHRoZXkgd2VyZSBnb3RvRW5kXG5cdFx0XHRpZiAoIGRlcXVldWUgfHwgIWdvdG9FbmQgKSB7XG5cdFx0XHRcdGpRdWVyeS5kZXF1ZXVlKCB0aGlzLCB0eXBlICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdGZpbmlzaDogZnVuY3Rpb24oIHR5cGUgKSB7XG5cdFx0aWYgKCB0eXBlICE9PSBmYWxzZSApIHtcblx0XHRcdHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpbmRleCxcblx0XHRcdFx0ZGF0YSA9IGRhdGFfcHJpdi5nZXQoIHRoaXMgKSxcblx0XHRcdFx0cXVldWUgPSBkYXRhWyB0eXBlICsgXCJxdWV1ZVwiIF0sXG5cdFx0XHRcdGhvb2tzID0gZGF0YVsgdHlwZSArIFwicXVldWVIb29rc1wiIF0sXG5cdFx0XHRcdHRpbWVycyA9IGpRdWVyeS50aW1lcnMsXG5cdFx0XHRcdGxlbmd0aCA9IHF1ZXVlID8gcXVldWUubGVuZ3RoIDogMDtcblxuXHRcdFx0Ly8gZW5hYmxlIGZpbmlzaGluZyBmbGFnIG9uIHByaXZhdGUgZGF0YVxuXHRcdFx0ZGF0YS5maW5pc2ggPSB0cnVlO1xuXG5cdFx0XHQvLyBlbXB0eSB0aGUgcXVldWUgZmlyc3Rcblx0XHRcdGpRdWVyeS5xdWV1ZSggdGhpcywgdHlwZSwgW10gKTtcblxuXHRcdFx0aWYgKCBob29rcyAmJiBob29rcy5zdG9wICkge1xuXHRcdFx0XHRob29rcy5zdG9wLmNhbGwoIHRoaXMsIHRydWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbG9vayBmb3IgYW55IGFjdGl2ZSBhbmltYXRpb25zLCBhbmQgZmluaXNoIHRoZW1cblx0XHRcdGZvciAoIGluZGV4ID0gdGltZXJzLmxlbmd0aDsgaW5kZXgtLTsgKSB7XG5cdFx0XHRcdGlmICggdGltZXJzWyBpbmRleCBdLmVsZW0gPT09IHRoaXMgJiYgdGltZXJzWyBpbmRleCBdLnF1ZXVlID09PSB0eXBlICkge1xuXHRcdFx0XHRcdHRpbWVyc1sgaW5kZXggXS5hbmltLnN0b3AoIHRydWUgKTtcblx0XHRcdFx0XHR0aW1lcnMuc3BsaWNlKCBpbmRleCwgMSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGxvb2sgZm9yIGFueSBhbmltYXRpb25zIGluIHRoZSBvbGQgcXVldWUgYW5kIGZpbmlzaCB0aGVtXG5cdFx0XHRmb3IgKCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrICkge1xuXHRcdFx0XHRpZiAoIHF1ZXVlWyBpbmRleCBdICYmIHF1ZXVlWyBpbmRleCBdLmZpbmlzaCApIHtcblx0XHRcdFx0XHRxdWV1ZVsgaW5kZXggXS5maW5pc2guY2FsbCggdGhpcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHR1cm4gb2ZmIGZpbmlzaGluZyBmbGFnXG5cdFx0XHRkZWxldGUgZGF0YS5maW5pc2g7XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG4vLyBHZW5lcmF0ZSBwYXJhbWV0ZXJzIHRvIGNyZWF0ZSBhIHN0YW5kYXJkIGFuaW1hdGlvblxuZnVuY3Rpb24gZ2VuRngoIHR5cGUsIGluY2x1ZGVXaWR0aCApIHtcblx0dmFyIHdoaWNoLFxuXHRcdGF0dHJzID0geyBoZWlnaHQ6IHR5cGUgfSxcblx0XHRpID0gMDtcblxuXHQvLyBpZiB3ZSBpbmNsdWRlIHdpZHRoLCBzdGVwIHZhbHVlIGlzIDEgdG8gZG8gYWxsIGNzc0V4cGFuZCB2YWx1ZXMsXG5cdC8vIGlmIHdlIGRvbid0IGluY2x1ZGUgd2lkdGgsIHN0ZXAgdmFsdWUgaXMgMiB0byBza2lwIG92ZXIgTGVmdCBhbmQgUmlnaHRcblx0aW5jbHVkZVdpZHRoID0gaW5jbHVkZVdpZHRoPyAxIDogMDtcblx0Zm9yKCA7IGkgPCA0IDsgaSArPSAyIC0gaW5jbHVkZVdpZHRoICkge1xuXHRcdHdoaWNoID0gY3NzRXhwYW5kWyBpIF07XG5cdFx0YXR0cnNbIFwibWFyZ2luXCIgKyB3aGljaCBdID0gYXR0cnNbIFwicGFkZGluZ1wiICsgd2hpY2ggXSA9IHR5cGU7XG5cdH1cblxuXHRpZiAoIGluY2x1ZGVXaWR0aCApIHtcblx0XHRhdHRycy5vcGFjaXR5ID0gYXR0cnMud2lkdGggPSB0eXBlO1xuXHR9XG5cblx0cmV0dXJuIGF0dHJzO1xufVxuXG4vLyBHZW5lcmF0ZSBzaG9ydGN1dHMgZm9yIGN1c3RvbSBhbmltYXRpb25zXG5qUXVlcnkuZWFjaCh7XG5cdHNsaWRlRG93bjogZ2VuRngoXCJzaG93XCIpLFxuXHRzbGlkZVVwOiBnZW5GeChcImhpZGVcIiksXG5cdHNsaWRlVG9nZ2xlOiBnZW5GeChcInRvZ2dsZVwiKSxcblx0ZmFkZUluOiB7IG9wYWNpdHk6IFwic2hvd1wiIH0sXG5cdGZhZGVPdXQ6IHsgb3BhY2l0eTogXCJoaWRlXCIgfSxcblx0ZmFkZVRvZ2dsZTogeyBvcGFjaXR5OiBcInRvZ2dsZVwiIH1cbn0sIGZ1bmN0aW9uKCBuYW1lLCBwcm9wcyApIHtcblx0alF1ZXJ5LmZuWyBuYW1lIF0gPSBmdW5jdGlvbiggc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKSB7XG5cdFx0cmV0dXJuIHRoaXMuYW5pbWF0ZSggcHJvcHMsIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICk7XG5cdH07XG59KTtcblxualF1ZXJ5LnNwZWVkID0gZnVuY3Rpb24oIHNwZWVkLCBlYXNpbmcsIGZuICkge1xuXHR2YXIgb3B0ID0gc3BlZWQgJiYgdHlwZW9mIHNwZWVkID09PSBcIm9iamVjdFwiID8galF1ZXJ5LmV4dGVuZCgge30sIHNwZWVkICkgOiB7XG5cdFx0Y29tcGxldGU6IGZuIHx8ICFmbiAmJiBlYXNpbmcgfHxcblx0XHRcdGpRdWVyeS5pc0Z1bmN0aW9uKCBzcGVlZCApICYmIHNwZWVkLFxuXHRcdGR1cmF0aW9uOiBzcGVlZCxcblx0XHRlYXNpbmc6IGZuICYmIGVhc2luZyB8fCBlYXNpbmcgJiYgIWpRdWVyeS5pc0Z1bmN0aW9uKCBlYXNpbmcgKSAmJiBlYXNpbmdcblx0fTtcblxuXHRvcHQuZHVyYXRpb24gPSBqUXVlcnkuZngub2ZmID8gMCA6IHR5cGVvZiBvcHQuZHVyYXRpb24gPT09IFwibnVtYmVyXCIgPyBvcHQuZHVyYXRpb24gOlxuXHRcdG9wdC5kdXJhdGlvbiBpbiBqUXVlcnkuZnguc3BlZWRzID8galF1ZXJ5LmZ4LnNwZWVkc1sgb3B0LmR1cmF0aW9uIF0gOiBqUXVlcnkuZnguc3BlZWRzLl9kZWZhdWx0O1xuXG5cdC8vIG5vcm1hbGl6ZSBvcHQucXVldWUgLSB0cnVlL3VuZGVmaW5lZC9udWxsIC0+IFwiZnhcIlxuXHRpZiAoIG9wdC5xdWV1ZSA9PSBudWxsIHx8IG9wdC5xdWV1ZSA9PT0gdHJ1ZSApIHtcblx0XHRvcHQucXVldWUgPSBcImZ4XCI7XG5cdH1cblxuXHQvLyBRdWV1ZWluZ1xuXHRvcHQub2xkID0gb3B0LmNvbXBsZXRlO1xuXG5cdG9wdC5jb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggalF1ZXJ5LmlzRnVuY3Rpb24oIG9wdC5vbGQgKSApIHtcblx0XHRcdG9wdC5vbGQuY2FsbCggdGhpcyApO1xuXHRcdH1cblxuXHRcdGlmICggb3B0LnF1ZXVlICkge1xuXHRcdFx0alF1ZXJ5LmRlcXVldWUoIHRoaXMsIG9wdC5xdWV1ZSApO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gb3B0O1xufTtcblxualF1ZXJ5LmVhc2luZyA9IHtcblx0bGluZWFyOiBmdW5jdGlvbiggcCApIHtcblx0XHRyZXR1cm4gcDtcblx0fSxcblx0c3dpbmc6IGZ1bmN0aW9uKCBwICkge1xuXHRcdHJldHVybiAwLjUgLSBNYXRoLmNvcyggcCpNYXRoLlBJICkgLyAyO1xuXHR9XG59O1xuXG5qUXVlcnkudGltZXJzID0gW107XG5qUXVlcnkuZnggPSBUd2Vlbi5wcm90b3R5cGUuaW5pdDtcbmpRdWVyeS5meC50aWNrID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0aW1lcixcblx0XHR0aW1lcnMgPSBqUXVlcnkudGltZXJzLFxuXHRcdGkgPSAwO1xuXG5cdGZ4Tm93ID0galF1ZXJ5Lm5vdygpO1xuXG5cdGZvciAoIDsgaSA8IHRpbWVycy5sZW5ndGg7IGkrKyApIHtcblx0XHR0aW1lciA9IHRpbWVyc1sgaSBdO1xuXHRcdC8vIENoZWNrcyB0aGUgdGltZXIgaGFzIG5vdCBhbHJlYWR5IGJlZW4gcmVtb3ZlZFxuXHRcdGlmICggIXRpbWVyKCkgJiYgdGltZXJzWyBpIF0gPT09IHRpbWVyICkge1xuXHRcdFx0dGltZXJzLnNwbGljZSggaS0tLCAxICk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCAhdGltZXJzLmxlbmd0aCApIHtcblx0XHRqUXVlcnkuZnguc3RvcCgpO1xuXHR9XG5cdGZ4Tm93ID0gdW5kZWZpbmVkO1xufTtcblxualF1ZXJ5LmZ4LnRpbWVyID0gZnVuY3Rpb24oIHRpbWVyICkge1xuXHRpZiAoIHRpbWVyKCkgJiYgalF1ZXJ5LnRpbWVycy5wdXNoKCB0aW1lciApICkge1xuXHRcdGpRdWVyeS5meC5zdGFydCgpO1xuXHR9XG59O1xuXG5qUXVlcnkuZnguaW50ZXJ2YWwgPSAxMztcblxualF1ZXJ5LmZ4LnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICggIXRpbWVySWQgKSB7XG5cdFx0dGltZXJJZCA9IHNldEludGVydmFsKCBqUXVlcnkuZngudGljaywgalF1ZXJ5LmZ4LmludGVydmFsICk7XG5cdH1cbn07XG5cbmpRdWVyeS5meC5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdGNsZWFySW50ZXJ2YWwoIHRpbWVySWQgKTtcblx0dGltZXJJZCA9IG51bGw7XG59O1xuXG5qUXVlcnkuZnguc3BlZWRzID0ge1xuXHRzbG93OiA2MDAsXG5cdGZhc3Q6IDIwMCxcblx0Ly8gRGVmYXVsdCBzcGVlZFxuXHRfZGVmYXVsdDogNDAwXG59O1xuXG4vLyBCYWNrIENvbXBhdCA8MS44IGV4dGVuc2lvbiBwb2ludFxualF1ZXJ5LmZ4LnN0ZXAgPSB7fTtcblxuaWYgKCBqUXVlcnkuZXhwciAmJiBqUXVlcnkuZXhwci5maWx0ZXJzICkge1xuXHRqUXVlcnkuZXhwci5maWx0ZXJzLmFuaW1hdGVkID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0cmV0dXJuIGpRdWVyeS5ncmVwKGpRdWVyeS50aW1lcnMsIGZ1bmN0aW9uKCBmbiApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBmbi5lbGVtO1xuXHRcdH0pLmxlbmd0aDtcblx0fTtcbn1cbmpRdWVyeS5mbi5vZmZzZXQgPSBmdW5jdGlvbiggb3B0aW9ucyApIHtcblx0aWYgKCBhcmd1bWVudHMubGVuZ3RoICkge1xuXHRcdHJldHVybiBvcHRpb25zID09PSB1bmRlZmluZWQgP1xuXHRcdFx0dGhpcyA6XG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oIGkgKSB7XG5cdFx0XHRcdGpRdWVyeS5vZmZzZXQuc2V0T2Zmc2V0KCB0aGlzLCBvcHRpb25zLCBpICk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdHZhciBkb2NFbGVtLCB3aW4sXG5cdFx0ZWxlbSA9IHRoaXNbIDAgXSxcblx0XHRib3ggPSB7IHRvcDogMCwgbGVmdDogMCB9LFxuXHRcdGRvYyA9IGVsZW0gJiYgZWxlbS5vd25lckRvY3VtZW50O1xuXG5cdGlmICggIWRvYyApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudDtcblxuXHQvLyBNYWtlIHN1cmUgaXQncyBub3QgYSBkaXNjb25uZWN0ZWQgRE9NIG5vZGVcblx0aWYgKCAhalF1ZXJ5LmNvbnRhaW5zKCBkb2NFbGVtLCBlbGVtICkgKSB7XG5cdFx0cmV0dXJuIGJveDtcblx0fVxuXG5cdC8vIElmIHdlIGRvbid0IGhhdmUgZ0JDUiwganVzdCB1c2UgMCwwIHJhdGhlciB0aGFuIGVycm9yXG5cdC8vIEJsYWNrQmVycnkgNSwgaU9TIDMgKG9yaWdpbmFsIGlQaG9uZSlcblx0aWYgKCB0eXBlb2YgZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgIT09IGNvcmVfc3RydW5kZWZpbmVkICkge1xuXHRcdGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdH1cblx0d2luID0gZ2V0V2luZG93KCBkb2MgKTtcblx0cmV0dXJuIHtcblx0XHR0b3A6IGJveC50b3AgKyB3aW4ucGFnZVlPZmZzZXQgLSBkb2NFbGVtLmNsaWVudFRvcCxcblx0XHRsZWZ0OiBib3gubGVmdCArIHdpbi5wYWdlWE9mZnNldCAtIGRvY0VsZW0uY2xpZW50TGVmdFxuXHR9O1xufTtcblxualF1ZXJ5Lm9mZnNldCA9IHtcblxuXHRzZXRPZmZzZXQ6IGZ1bmN0aW9uKCBlbGVtLCBvcHRpb25zLCBpICkge1xuXHRcdHZhciBjdXJQb3NpdGlvbiwgY3VyTGVmdCwgY3VyQ1NTVG9wLCBjdXJUb3AsIGN1ck9mZnNldCwgY3VyQ1NTTGVmdCwgY2FsY3VsYXRlUG9zaXRpb24sXG5cdFx0XHRwb3NpdGlvbiA9IGpRdWVyeS5jc3MoIGVsZW0sIFwicG9zaXRpb25cIiApLFxuXHRcdFx0Y3VyRWxlbSA9IGpRdWVyeSggZWxlbSApLFxuXHRcdFx0cHJvcHMgPSB7fTtcblxuXHRcdC8vIFNldCBwb3NpdGlvbiBmaXJzdCwgaW4tY2FzZSB0b3AvbGVmdCBhcmUgc2V0IGV2ZW4gb24gc3RhdGljIGVsZW1cblx0XHRpZiAoIHBvc2l0aW9uID09PSBcInN0YXRpY1wiICkge1xuXHRcdFx0ZWxlbS5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcblx0XHR9XG5cblx0XHRjdXJPZmZzZXQgPSBjdXJFbGVtLm9mZnNldCgpO1xuXHRcdGN1ckNTU1RvcCA9IGpRdWVyeS5jc3MoIGVsZW0sIFwidG9wXCIgKTtcblx0XHRjdXJDU1NMZWZ0ID0galF1ZXJ5LmNzcyggZWxlbSwgXCJsZWZ0XCIgKTtcblx0XHRjYWxjdWxhdGVQb3NpdGlvbiA9ICggcG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIiB8fCBwb3NpdGlvbiA9PT0gXCJmaXhlZFwiICkgJiYgKCBjdXJDU1NUb3AgKyBjdXJDU1NMZWZ0ICkuaW5kZXhPZihcImF1dG9cIikgPiAtMTtcblxuXHRcdC8vIE5lZWQgdG8gYmUgYWJsZSB0byBjYWxjdWxhdGUgcG9zaXRpb24gaWYgZWl0aGVyIHRvcCBvciBsZWZ0IGlzIGF1dG8gYW5kIHBvc2l0aW9uIGlzIGVpdGhlciBhYnNvbHV0ZSBvciBmaXhlZFxuXHRcdGlmICggY2FsY3VsYXRlUG9zaXRpb24gKSB7XG5cdFx0XHRjdXJQb3NpdGlvbiA9IGN1ckVsZW0ucG9zaXRpb24oKTtcblx0XHRcdGN1clRvcCA9IGN1clBvc2l0aW9uLnRvcDtcblx0XHRcdGN1ckxlZnQgPSBjdXJQb3NpdGlvbi5sZWZ0O1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1clRvcCA9IHBhcnNlRmxvYXQoIGN1ckNTU1RvcCApIHx8IDA7XG5cdFx0XHRjdXJMZWZ0ID0gcGFyc2VGbG9hdCggY3VyQ1NTTGVmdCApIHx8IDA7XG5cdFx0fVxuXG5cdFx0aWYgKCBqUXVlcnkuaXNGdW5jdGlvbiggb3B0aW9ucyApICkge1xuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMuY2FsbCggZWxlbSwgaSwgY3VyT2Zmc2V0ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBvcHRpb25zLnRvcCAhPSBudWxsICkge1xuXHRcdFx0cHJvcHMudG9wID0gKCBvcHRpb25zLnRvcCAtIGN1ck9mZnNldC50b3AgKSArIGN1clRvcDtcblx0XHR9XG5cdFx0aWYgKCBvcHRpb25zLmxlZnQgIT0gbnVsbCApIHtcblx0XHRcdHByb3BzLmxlZnQgPSAoIG9wdGlvbnMubGVmdCAtIGN1ck9mZnNldC5sZWZ0ICkgKyBjdXJMZWZ0O1xuXHRcdH1cblxuXHRcdGlmICggXCJ1c2luZ1wiIGluIG9wdGlvbnMgKSB7XG5cdFx0XHRvcHRpb25zLnVzaW5nLmNhbGwoIGVsZW0sIHByb3BzICk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VyRWxlbS5jc3MoIHByb3BzICk7XG5cdFx0fVxuXHR9XG59O1xuXG5cbmpRdWVyeS5mbi5leHRlbmQoe1xuXG5cdHBvc2l0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoICF0aGlzWyAwIF0gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIG9mZnNldFBhcmVudCwgb2Zmc2V0LFxuXHRcdFx0ZWxlbSA9IHRoaXNbIDAgXSxcblx0XHRcdHBhcmVudE9mZnNldCA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XG5cblx0XHQvLyBGaXhlZCBlbGVtZW50cyBhcmUgb2Zmc2V0IGZyb20gd2luZG93IChwYXJlbnRPZmZzZXQgPSB7dG9wOjAsIGxlZnQ6IDB9LCBiZWNhdXNlIGl0IGlzIGl0J3Mgb25seSBvZmZzZXQgcGFyZW50XG5cdFx0aWYgKCBqUXVlcnkuY3NzKCBlbGVtLCBcInBvc2l0aW9uXCIgKSA9PT0gXCJmaXhlZFwiICkge1xuXHRcdFx0Ly8gV2UgYXNzdW1lIHRoYXQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGlzIGF2YWlsYWJsZSB3aGVuIGNvbXB1dGVkIHBvc2l0aW9uIGlzIGZpeGVkXG5cdFx0XHRvZmZzZXQgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEdldCAqcmVhbCogb2Zmc2V0UGFyZW50XG5cdFx0XHRvZmZzZXRQYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudCgpO1xuXG5cdFx0XHQvLyBHZXQgY29ycmVjdCBvZmZzZXRzXG5cdFx0XHRvZmZzZXQgPSB0aGlzLm9mZnNldCgpO1xuXHRcdFx0aWYgKCAhalF1ZXJ5Lm5vZGVOYW1lKCBvZmZzZXRQYXJlbnRbIDAgXSwgXCJodG1sXCIgKSApIHtcblx0XHRcdFx0cGFyZW50T2Zmc2V0ID0gb2Zmc2V0UGFyZW50Lm9mZnNldCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgb2Zmc2V0UGFyZW50IGJvcmRlcnNcblx0XHRcdHBhcmVudE9mZnNldC50b3AgKz0galF1ZXJ5LmNzcyggb2Zmc2V0UGFyZW50WyAwIF0sIFwiYm9yZGVyVG9wV2lkdGhcIiwgdHJ1ZSApO1xuXHRcdFx0cGFyZW50T2Zmc2V0LmxlZnQgKz0galF1ZXJ5LmNzcyggb2Zmc2V0UGFyZW50WyAwIF0sIFwiYm9yZGVyTGVmdFdpZHRoXCIsIHRydWUgKTtcblx0XHR9XG5cblx0XHQvLyBTdWJ0cmFjdCBwYXJlbnQgb2Zmc2V0cyBhbmQgZWxlbWVudCBtYXJnaW5zXG5cdFx0cmV0dXJuIHtcblx0XHRcdHRvcDogb2Zmc2V0LnRvcCAtIHBhcmVudE9mZnNldC50b3AgLSBqUXVlcnkuY3NzKCBlbGVtLCBcIm1hcmdpblRvcFwiLCB0cnVlICksXG5cdFx0XHRsZWZ0OiBvZmZzZXQubGVmdCAtIHBhcmVudE9mZnNldC5sZWZ0IC0galF1ZXJ5LmNzcyggZWxlbSwgXCJtYXJnaW5MZWZ0XCIsIHRydWUgKVxuXHRcdH07XG5cdH0sXG5cblx0b2Zmc2V0UGFyZW50OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgb2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQgfHwgZG9jRWxlbTtcblxuXHRcdFx0d2hpbGUgKCBvZmZzZXRQYXJlbnQgJiYgKCAhalF1ZXJ5Lm5vZGVOYW1lKCBvZmZzZXRQYXJlbnQsIFwiaHRtbFwiICkgJiYgalF1ZXJ5LmNzcyggb2Zmc2V0UGFyZW50LCBcInBvc2l0aW9uXCIpID09PSBcInN0YXRpY1wiICkgKSB7XG5cdFx0XHRcdG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvZmZzZXRQYXJlbnQgfHwgZG9jRWxlbTtcblx0XHR9KTtcblx0fVxufSk7XG5cblxuLy8gQ3JlYXRlIHNjcm9sbExlZnQgYW5kIHNjcm9sbFRvcCBtZXRob2RzXG5qUXVlcnkuZWFjaCgge3Njcm9sbExlZnQ6IFwicGFnZVhPZmZzZXRcIiwgc2Nyb2xsVG9wOiBcInBhZ2VZT2Zmc2V0XCJ9LCBmdW5jdGlvbiggbWV0aG9kLCBwcm9wICkge1xuXHR2YXIgdG9wID0gXCJwYWdlWU9mZnNldFwiID09PSBwcm9wO1xuXG5cdGpRdWVyeS5mblsgbWV0aG9kIF0gPSBmdW5jdGlvbiggdmFsICkge1xuXHRcdHJldHVybiBqUXVlcnkuYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggZWxlbSwgbWV0aG9kLCB2YWwgKSB7XG5cdFx0XHR2YXIgd2luID0gZ2V0V2luZG93KCBlbGVtICk7XG5cblx0XHRcdGlmICggdmFsID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdHJldHVybiB3aW4gPyB3aW5bIHByb3AgXSA6IGVsZW1bIG1ldGhvZCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHdpbiApIHtcblx0XHRcdFx0d2luLnNjcm9sbFRvKFxuXHRcdFx0XHRcdCF0b3AgPyB2YWwgOiB3aW5kb3cucGFnZVhPZmZzZXQsXG5cdFx0XHRcdFx0dG9wID8gdmFsIDogd2luZG93LnBhZ2VZT2Zmc2V0XG5cdFx0XHRcdCk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1bIG1ldGhvZCBdID0gdmFsO1xuXHRcdFx0fVxuXHRcdH0sIG1ldGhvZCwgdmFsLCBhcmd1bWVudHMubGVuZ3RoLCBudWxsICk7XG5cdH07XG59KTtcblxuZnVuY3Rpb24gZ2V0V2luZG93KCBlbGVtICkge1xuXHRyZXR1cm4galF1ZXJ5LmlzV2luZG93KCBlbGVtICkgPyBlbGVtIDogZWxlbS5ub2RlVHlwZSA9PT0gOSAmJiBlbGVtLmRlZmF1bHRWaWV3O1xufVxuLy8gQ3JlYXRlIGlubmVySGVpZ2h0LCBpbm5lcldpZHRoLCBoZWlnaHQsIHdpZHRoLCBvdXRlckhlaWdodCBhbmQgb3V0ZXJXaWR0aCBtZXRob2RzXG5qUXVlcnkuZWFjaCggeyBIZWlnaHQ6IFwiaGVpZ2h0XCIsIFdpZHRoOiBcIndpZHRoXCIgfSwgZnVuY3Rpb24oIG5hbWUsIHR5cGUgKSB7XG5cdGpRdWVyeS5lYWNoKCB7IHBhZGRpbmc6IFwiaW5uZXJcIiArIG5hbWUsIGNvbnRlbnQ6IHR5cGUsIFwiXCI6IFwib3V0ZXJcIiArIG5hbWUgfSwgZnVuY3Rpb24oIGRlZmF1bHRFeHRyYSwgZnVuY05hbWUgKSB7XG5cdFx0Ly8gbWFyZ2luIGlzIG9ubHkgZm9yIG91dGVySGVpZ2h0LCBvdXRlcldpZHRoXG5cdFx0alF1ZXJ5LmZuWyBmdW5jTmFtZSBdID0gZnVuY3Rpb24oIG1hcmdpbiwgdmFsdWUgKSB7XG5cdFx0XHR2YXIgY2hhaW5hYmxlID0gYXJndW1lbnRzLmxlbmd0aCAmJiAoIGRlZmF1bHRFeHRyYSB8fCB0eXBlb2YgbWFyZ2luICE9PSBcImJvb2xlYW5cIiApLFxuXHRcdFx0XHRleHRyYSA9IGRlZmF1bHRFeHRyYSB8fCAoIG1hcmdpbiA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gdHJ1ZSA/IFwibWFyZ2luXCIgOiBcImJvcmRlclwiICk7XG5cblx0XHRcdHJldHVybiBqUXVlcnkuYWNjZXNzKCB0aGlzLCBmdW5jdGlvbiggZWxlbSwgdHlwZSwgdmFsdWUgKSB7XG5cdFx0XHRcdHZhciBkb2M7XG5cblx0XHRcdFx0aWYgKCBqUXVlcnkuaXNXaW5kb3coIGVsZW0gKSApIHtcblx0XHRcdFx0XHQvLyBBcyBvZiA1LzgvMjAxMiB0aGlzIHdpbGwgeWllbGQgaW5jb3JyZWN0IHJlc3VsdHMgZm9yIE1vYmlsZSBTYWZhcmksIGJ1dCB0aGVyZVxuXHRcdFx0XHRcdC8vIGlzbid0IGEgd2hvbGUgbG90IHdlIGNhbiBkby4gU2VlIHB1bGwgcmVxdWVzdCBhdCB0aGlzIFVSTCBmb3IgZGlzY3Vzc2lvbjpcblx0XHRcdFx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9wdWxsLzc2NFxuXHRcdFx0XHRcdHJldHVybiBlbGVtLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFsgXCJjbGllbnRcIiArIG5hbWUgXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEdldCBkb2N1bWVudCB3aWR0aCBvciBoZWlnaHRcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdGRvYyA9IGVsZW0uZG9jdW1lbnRFbGVtZW50O1xuXG5cdFx0XHRcdFx0Ly8gRWl0aGVyIHNjcm9sbFtXaWR0aC9IZWlnaHRdIG9yIG9mZnNldFtXaWR0aC9IZWlnaHRdIG9yIGNsaWVudFtXaWR0aC9IZWlnaHRdLFxuXHRcdFx0XHRcdC8vIHdoaWNoZXZlciBpcyBncmVhdGVzdFxuXHRcdFx0XHRcdHJldHVybiBNYXRoLm1heChcblx0XHRcdFx0XHRcdGVsZW0uYm9keVsgXCJzY3JvbGxcIiArIG5hbWUgXSwgZG9jWyBcInNjcm9sbFwiICsgbmFtZSBdLFxuXHRcdFx0XHRcdFx0ZWxlbS5ib2R5WyBcIm9mZnNldFwiICsgbmFtZSBdLCBkb2NbIFwib2Zmc2V0XCIgKyBuYW1lIF0sXG5cdFx0XHRcdFx0XHRkb2NbIFwiY2xpZW50XCIgKyBuYW1lIF1cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgP1xuXHRcdFx0XHRcdC8vIEdldCB3aWR0aCBvciBoZWlnaHQgb24gdGhlIGVsZW1lbnQsIHJlcXVlc3RpbmcgYnV0IG5vdCBmb3JjaW5nIHBhcnNlRmxvYXRcblx0XHRcdFx0XHRqUXVlcnkuY3NzKCBlbGVtLCB0eXBlLCBleHRyYSApIDpcblxuXHRcdFx0XHRcdC8vIFNldCB3aWR0aCBvciBoZWlnaHQgb24gdGhlIGVsZW1lbnRcblx0XHRcdFx0XHRqUXVlcnkuc3R5bGUoIGVsZW0sIHR5cGUsIHZhbHVlLCBleHRyYSApO1xuXHRcdFx0fSwgdHlwZSwgY2hhaW5hYmxlID8gbWFyZ2luIDogdW5kZWZpbmVkLCBjaGFpbmFibGUsIG51bGwgKTtcblx0XHR9O1xuXHR9KTtcbn0pO1xuLy8gTGltaXQgc2NvcGUgcG9sbHV0aW9uIGZyb20gYW55IGRlcHJlY2F0ZWQgQVBJXG4vLyAoZnVuY3Rpb24oKSB7XG5cbi8vIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgY29udGFpbmVkIGluIHRoZSBtYXRjaGVkIGVsZW1lbnQgc2V0XG5qUXVlcnkuZm4uc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5sZW5ndGg7XG59O1xuXG5qUXVlcnkuZm4uYW5kU2VsZiA9IGpRdWVyeS5mbi5hZGRCYWNrO1xuXG4vLyB9KSgpO1xuaWYgKCB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZSAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIgKSB7XG5cdC8vIEV4cG9zZSBqUXVlcnkgYXMgbW9kdWxlLmV4cG9ydHMgaW4gbG9hZGVycyB0aGF0IGltcGxlbWVudCB0aGUgTm9kZVxuXHQvLyBtb2R1bGUgcGF0dGVybiAoaW5jbHVkaW5nIGJyb3dzZXJpZnkpLiBEbyBub3QgY3JlYXRlIHRoZSBnbG9iYWwsIHNpbmNlXG5cdC8vIHRoZSB1c2VyIHdpbGwgYmUgc3RvcmluZyBpdCB0aGVtc2VsdmVzIGxvY2FsbHksIGFuZCBnbG9iYWxzIGFyZSBmcm93bmVkXG5cdC8vIHVwb24gaW4gdGhlIE5vZGUgbW9kdWxlIHdvcmxkLlxuXHRtb2R1bGUuZXhwb3J0cyA9IGpRdWVyeTtcbn0gZWxzZSB7XG5cdC8vIFJlZ2lzdGVyIGFzIGEgbmFtZWQgQU1EIG1vZHVsZSwgc2luY2UgalF1ZXJ5IGNhbiBiZSBjb25jYXRlbmF0ZWQgd2l0aCBvdGhlclxuXHQvLyBmaWxlcyB0aGF0IG1heSB1c2UgZGVmaW5lLCBidXQgbm90IHZpYSBhIHByb3BlciBjb25jYXRlbmF0aW9uIHNjcmlwdCB0aGF0XG5cdC8vIHVuZGVyc3RhbmRzIGFub255bW91cyBBTUQgbW9kdWxlcy4gQSBuYW1lZCBBTUQgaXMgc2FmZXN0IGFuZCBtb3N0IHJvYnVzdFxuXHQvLyB3YXkgdG8gcmVnaXN0ZXIuIExvd2VyY2FzZSBqcXVlcnkgaXMgdXNlZCBiZWNhdXNlIEFNRCBtb2R1bGUgbmFtZXMgYXJlXG5cdC8vIGRlcml2ZWQgZnJvbSBmaWxlIG5hbWVzLCBhbmQgalF1ZXJ5IGlzIG5vcm1hbGx5IGRlbGl2ZXJlZCBpbiBhIGxvd2VyY2FzZVxuXHQvLyBmaWxlIG5hbWUuIERvIHRoaXMgYWZ0ZXIgY3JlYXRpbmcgdGhlIGdsb2JhbCBzbyB0aGF0IGlmIGFuIEFNRCBtb2R1bGUgd2FudHNcblx0Ly8gdG8gY2FsbCBub0NvbmZsaWN0IHRvIGhpZGUgdGhpcyB2ZXJzaW9uIG9mIGpRdWVyeSwgaXQgd2lsbCB3b3JrLlxuXHRpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXHRcdGRlZmluZSggXCJqcXVlcnlcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGpRdWVyeTsgfSApO1xuXHR9XG59XG5cbi8vIElmIHRoZXJlIGlzIGEgd2luZG93IG9iamVjdCwgdGhhdCBhdCBsZWFzdCBoYXMgYSBkb2N1bWVudCBwcm9wZXJ0eSxcbi8vIGRlZmluZSBqUXVlcnkgYW5kICQgaWRlbnRpZmllcnNcbmlmICggdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ID09PSBcIm9iamVjdFwiICkge1xuXHR3aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSBqUXVlcnk7XG59XG5cbn0pKCB3aW5kb3cgKTtcbiIsIi8qIVxuICogY2xhc3NpZSB2MS4wLjFcbiAqIGNsYXNzIGhlbHBlciBmdW5jdGlvbnNcbiAqIGZyb20gYm9uem8gaHR0cHM6Ly9naXRodWIuY29tL2RlZC9ib256b1xuICogTUlUIGxpY2Vuc2VcbiAqIFxuICogY2xhc3NpZS5oYXMoIGVsZW0sICdteS1jbGFzcycgKSAtPiB0cnVlL2ZhbHNlXG4gKiBjbGFzc2llLmFkZCggZWxlbSwgJ215LW5ldy1jbGFzcycgKVxuICogY2xhc3NpZS5yZW1vdmUoIGVsZW0sICdteS11bndhbnRlZC1jbGFzcycgKVxuICogY2xhc3NpZS50b2dnbGUoIGVsZW0sICdteS1jbGFzcycgKVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSAqL1xuLypnbG9iYWwgZGVmaW5lOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3cgKSB7XG5cbid1c2Ugc3RyaWN0JztcblxuLy8gY2xhc3MgaGVscGVyIGZ1bmN0aW9ucyBmcm9tIGJvbnpvIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvYm9uem9cblxuZnVuY3Rpb24gY2xhc3NSZWcoIGNsYXNzTmFtZSApIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccyspXCIgKyBjbGFzc05hbWUgKyBcIihcXFxccyt8JClcIik7XG59XG5cbi8vIGNsYXNzTGlzdCBzdXBwb3J0IGZvciBjbGFzcyBtYW5hZ2VtZW50XG4vLyBhbHRobyB0byBiZSBmYWlyLCB0aGUgYXBpIHN1Y2tzIGJlY2F1c2UgaXQgd29uJ3QgYWNjZXB0IG11bHRpcGxlIGNsYXNzZXMgYXQgb25jZVxudmFyIGhhc0NsYXNzLCBhZGRDbGFzcywgcmVtb3ZlQ2xhc3M7XG5cbmlmICggJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICkge1xuICBoYXNDbGFzcyA9IGZ1bmN0aW9uKCBlbGVtLCBjICkge1xuICAgIHJldHVybiBlbGVtLmNsYXNzTGlzdC5jb250YWlucyggYyApO1xuICB9O1xuICBhZGRDbGFzcyA9IGZ1bmN0aW9uKCBlbGVtLCBjICkge1xuICAgIGVsZW0uY2xhc3NMaXN0LmFkZCggYyApO1xuICB9O1xuICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKCBlbGVtLCBjICkge1xuICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSggYyApO1xuICB9O1xufVxuZWxzZSB7XG4gIGhhc0NsYXNzID0gZnVuY3Rpb24oIGVsZW0sIGMgKSB7XG4gICAgcmV0dXJuIGNsYXNzUmVnKCBjICkudGVzdCggZWxlbS5jbGFzc05hbWUgKTtcbiAgfTtcbiAgYWRkQ2xhc3MgPSBmdW5jdGlvbiggZWxlbSwgYyApIHtcbiAgICBpZiAoICFoYXNDbGFzcyggZWxlbSwgYyApICkge1xuICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgJyArIGM7XG4gICAgfVxuICB9O1xuICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKCBlbGVtLCBjICkge1xuICAgIGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUucmVwbGFjZSggY2xhc3NSZWcoIGMgKSwgJyAnICk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKCBlbGVtLCBjICkge1xuICB2YXIgZm4gPSBoYXNDbGFzcyggZWxlbSwgYyApID8gcmVtb3ZlQ2xhc3MgOiBhZGRDbGFzcztcbiAgZm4oIGVsZW0sIGMgKTtcbn1cblxudmFyIGNsYXNzaWUgPSB7XG4gIC8vIGZ1bGwgbmFtZXNcbiAgaGFzQ2xhc3M6IGhhc0NsYXNzLFxuICBhZGRDbGFzczogYWRkQ2xhc3MsXG4gIHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzcyxcbiAgdG9nZ2xlQ2xhc3M6IHRvZ2dsZUNsYXNzLFxuICAvLyBzaG9ydCBuYW1lc1xuICBoYXM6IGhhc0NsYXNzLFxuICBhZGQ6IGFkZENsYXNzLFxuICByZW1vdmU6IHJlbW92ZUNsYXNzLFxuICB0b2dnbGU6IHRvZ2dsZUNsYXNzXG59O1xuXG4vLyB0cmFuc3BvcnRcbmlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAvLyBBTURcbiAgZGVmaW5lKCBjbGFzc2llICk7XG59IGVsc2UgaWYgKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKSB7XG4gIC8vIENvbW1vbkpTXG4gIG1vZHVsZS5leHBvcnRzID0gY2xhc3NpZTtcbn0gZWxzZSB7XG4gIC8vIGJyb3dzZXIgZ2xvYmFsXG4gIHdpbmRvdy5jbGFzc2llID0gY2xhc3NpZTtcbn1cblxufSkoIHdpbmRvdyApO1xuIiwiLyohXG4gKiBnZXRTdHlsZVByb3BlcnR5IHYxLjAuNFxuICogb3JpZ2luYWwgYnkga2FuZ2F4XG4gKiBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9mZWF0dXJlLXRlc3RpbmctY3NzLXByb3BlcnRpZXMvXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUgKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIGV4cG9ydHM6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJlZml4ZXMgPSAnV2Via2l0IE1veiBtcyBNcyBPJy5zcGxpdCgnICcpO1xudmFyIGRvY0VsZW1TdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcblxuZnVuY3Rpb24gZ2V0U3R5bGVQcm9wZXJ0eSggcHJvcE5hbWUgKSB7XG4gIGlmICggIXByb3BOYW1lICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIHRlc3Qgc3RhbmRhcmQgcHJvcGVydHkgZmlyc3RcbiAgaWYgKCB0eXBlb2YgZG9jRWxlbVN0eWxlWyBwcm9wTmFtZSBdID09PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gcHJvcE5hbWU7XG4gIH1cblxuICAvLyBjYXBpdGFsaXplXG4gIHByb3BOYW1lID0gcHJvcE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wTmFtZS5zbGljZSgxKTtcblxuICAvLyB0ZXN0IHZlbmRvciBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gIHZhciBwcmVmaXhlZDtcbiAgZm9yICggdmFyIGk9MCwgbGVuID0gcHJlZml4ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgcHJlZml4ZWQgPSBwcmVmaXhlc1tpXSArIHByb3BOYW1lO1xuICAgIGlmICggdHlwZW9mIGRvY0VsZW1TdHlsZVsgcHJlZml4ZWQgXSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICByZXR1cm4gcHJlZml4ZWQ7XG4gICAgfVxuICB9XG59XG5cbi8vIHRyYW5zcG9ydFxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gIC8vIEFNRFxuICBkZWZpbmUoIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBnZXRTdHlsZVByb3BlcnR5O1xuICB9KTtcbn0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcbiAgLy8gQ29tbW9uSlMgZm9yIENvbXBvbmVudFxuICBtb2R1bGUuZXhwb3J0cyA9IGdldFN0eWxlUHJvcGVydHk7XG59IGVsc2Uge1xuICAvLyBicm93c2VyIGdsb2JhbFxuICB3aW5kb3cuZ2V0U3R5bGVQcm9wZXJ0eSA9IGdldFN0eWxlUHJvcGVydHk7XG59XG5cbn0pKCB3aW5kb3cgKTtcbiIsIi8qIVxuICogZ2V0U2l6ZSB2MS4yLjJcbiAqIG1lYXN1cmUgc2l6ZSBvZiBlbGVtZW50c1xuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKmpzaGludCBicm93c2VyOiB0cnVlLCBzdHJpY3Q6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUgKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIGV4cG9ydHM6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgY29uc29sZTogZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCB1bmRlZmluZWQgKSB7XG5cbid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaGVscGVycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vLyBnZXQgYSBudW1iZXIgZnJvbSBhIHN0cmluZywgbm90IGEgcGVyY2VudGFnZVxuZnVuY3Rpb24gZ2V0U3R5bGVTaXplKCB2YWx1ZSApIHtcbiAgdmFyIG51bSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XG4gIC8vIG5vdCBhIHBlcmNlbnQgbGlrZSAnMTAwJScsIGFuZCBhIG51bWJlclxuICB2YXIgaXNWYWxpZCA9IHZhbHVlLmluZGV4T2YoJyUnKSA9PT0gLTEgJiYgIWlzTmFOKCBudW0gKTtcbiAgcmV0dXJuIGlzVmFsaWQgJiYgbnVtO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIGxvZ0Vycm9yID0gdHlwZW9mIGNvbnNvbGUgPT09ICd1bmRlZmluZWQnID8gbm9vcCA6XG4gIGZ1bmN0aW9uKCBtZXNzYWdlICkge1xuICAgIGNvbnNvbGUuZXJyb3IoIG1lc3NhZ2UgKTtcbiAgfTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWVhc3VyZW1lbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnZhciBtZWFzdXJlbWVudHMgPSBbXG4gICdwYWRkaW5nTGVmdCcsXG4gICdwYWRkaW5nUmlnaHQnLFxuICAncGFkZGluZ1RvcCcsXG4gICdwYWRkaW5nQm90dG9tJyxcbiAgJ21hcmdpbkxlZnQnLFxuICAnbWFyZ2luUmlnaHQnLFxuICAnbWFyZ2luVG9wJyxcbiAgJ21hcmdpbkJvdHRvbScsXG4gICdib3JkZXJMZWZ0V2lkdGgnLFxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJUb3BXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCdcbl07XG5cbmZ1bmN0aW9uIGdldFplcm9TaXplKCkge1xuICB2YXIgc2l6ZSA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgaW5uZXJXaWR0aDogMCxcbiAgICBpbm5lckhlaWdodDogMCxcbiAgICBvdXRlcldpZHRoOiAwLFxuICAgIG91dGVySGVpZ2h0OiAwXG4gIH07XG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IG1lYXN1cmVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgc2l6ZVsgbWVhc3VyZW1lbnQgXSA9IDA7XG4gIH1cbiAgcmV0dXJuIHNpemU7XG59XG5cblxuXG5mdW5jdGlvbiBkZWZpbmVHZXRTaXplKCBnZXRTdHlsZVByb3BlcnR5ICkge1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBzZXR1cCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG52YXIgaXNTZXR1cCA9IGZhbHNlO1xuXG52YXIgZ2V0U3R5bGUsIGJveFNpemluZ1Byb3AsIGlzQm94U2l6ZU91dGVyO1xuXG4vKipcbiAqIHNldHVwIHZhcnMgYW5kIGZ1bmN0aW9uc1xuICogZG8gaXQgb24gaW5pdGlhbCBnZXRTaXplKCksIHJhdGhlciB0aGFuIG9uIHNjcmlwdCBsb2FkXG4gKiBGb3IgRmlyZWZveCBidWcgaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTQ4Mzk3XG4gKi9cbmZ1bmN0aW9uIHNldHVwKCkge1xuICAvLyBzZXR1cCBvbmNlXG4gIGlmICggaXNTZXR1cCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaXNTZXR1cCA9IHRydWU7XG5cbiAgdmFyIGdldENvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZTtcbiAgZ2V0U3R5bGUgPSAoIGZ1bmN0aW9uKCkge1xuICAgIHZhciBnZXRTdHlsZUZuID0gZ2V0Q29tcHV0ZWRTdHlsZSA/XG4gICAgICBmdW5jdGlvbiggZWxlbSApIHtcbiAgICAgICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoIGVsZW0sIG51bGwgKTtcbiAgICAgIH0gOlxuICAgICAgZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgICAgIHJldHVybiBlbGVtLmN1cnJlbnRTdHlsZTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiBnZXRTdHlsZSggZWxlbSApIHtcbiAgICAgICAgdmFyIHN0eWxlID0gZ2V0U3R5bGVGbiggZWxlbSApO1xuICAgICAgICBpZiAoICFzdHlsZSApIHtcbiAgICAgICAgICBsb2dFcnJvciggJ1N0eWxlIHJldHVybmVkICcgKyBzdHlsZSArXG4gICAgICAgICAgICAnLiBBcmUgeW91IHJ1bm5pbmcgdGhpcyBjb2RlIGluIGEgaGlkZGVuIGlmcmFtZSBvbiBGaXJlZm94PyAnICtcbiAgICAgICAgICAgICdTZWUgaHR0cDovL2JpdC5seS9nZXRzaXplYnVnMScgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJveCBzaXppbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICBib3hTaXppbmdQcm9wID0gZ2V0U3R5bGVQcm9wZXJ0eSgnYm94U2l6aW5nJyk7XG5cbiAgLyoqXG4gICAqIFdlYktpdCBtZWFzdXJlcyB0aGUgb3V0ZXItd2lkdGggb24gc3R5bGUud2lkdGggb24gYm9yZGVyLWJveCBlbGVtc1xuICAgKiBJRSAmIEZpcmVmb3ggbWVhc3VyZXMgdGhlIGlubmVyLXdpZHRoXG4gICAqL1xuICBpZiAoIGJveFNpemluZ1Byb3AgKSB7XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5zdHlsZS53aWR0aCA9ICcyMDBweCc7XG4gICAgZGl2LnN0eWxlLnBhZGRpbmcgPSAnMXB4IDJweCAzcHggNHB4JztcbiAgICBkaXYuc3R5bGUuYm9yZGVyU3R5bGUgPSAnc29saWQnO1xuICAgIGRpdi5zdHlsZS5ib3JkZXJXaWR0aCA9ICcxcHggMnB4IDNweCA0cHgnO1xuICAgIGRpdi5zdHlsZVsgYm94U2l6aW5nUHJvcCBdID0gJ2JvcmRlci1ib3gnO1xuXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICBib2R5LmFwcGVuZENoaWxkKCBkaXYgKTtcbiAgICB2YXIgc3R5bGUgPSBnZXRTdHlsZSggZGl2ICk7XG5cbiAgICBpc0JveFNpemVPdXRlciA9IGdldFN0eWxlU2l6ZSggc3R5bGUud2lkdGggKSA9PT0gMjAwO1xuICAgIGJvZHkucmVtb3ZlQ2hpbGQoIGRpdiApO1xuICB9XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZ2V0U2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBnZXRTaXplKCBlbGVtICkge1xuICBzZXR1cCgpO1xuXG4gIC8vIHVzZSBxdWVyeVNlbGV0b3IgaWYgZWxlbSBpcyBzdHJpbmdcbiAgaWYgKCB0eXBlb2YgZWxlbSA9PT0gJ3N0cmluZycgKSB7XG4gICAgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGVsZW0gKTtcbiAgfVxuXG4gIC8vIGRvIG5vdCBwcm9jZWVkIG9uIG5vbi1vYmplY3RzXG4gIGlmICggIWVsZW0gfHwgdHlwZW9mIGVsZW0gIT09ICdvYmplY3QnIHx8ICFlbGVtLm5vZGVUeXBlICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBzdHlsZSA9IGdldFN0eWxlKCBlbGVtICk7XG5cbiAgLy8gaWYgaGlkZGVuLCBldmVyeXRoaW5nIGlzIDBcbiAgaWYgKCBzdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgKSB7XG4gICAgcmV0dXJuIGdldFplcm9TaXplKCk7XG4gIH1cblxuICB2YXIgc2l6ZSA9IHt9O1xuICBzaXplLndpZHRoID0gZWxlbS5vZmZzZXRXaWR0aDtcbiAgc2l6ZS5oZWlnaHQgPSBlbGVtLm9mZnNldEhlaWdodDtcblxuICB2YXIgaXNCb3JkZXJCb3ggPSBzaXplLmlzQm9yZGVyQm94ID0gISEoIGJveFNpemluZ1Byb3AgJiZcbiAgICBzdHlsZVsgYm94U2l6aW5nUHJvcCBdICYmIHN0eWxlWyBib3hTaXppbmdQcm9wIF0gPT09ICdib3JkZXItYm94JyApO1xuXG4gIC8vIGdldCBhbGwgbWVhc3VyZW1lbnRzXG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IG1lYXN1cmVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgdmFyIHZhbHVlID0gc3R5bGVbIG1lYXN1cmVtZW50IF07XG4gICAgdmFsdWUgPSBtdW5nZU5vblBpeGVsKCBlbGVtLCB2YWx1ZSApO1xuICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KCB2YWx1ZSApO1xuICAgIC8vIGFueSAnYXV0bycsICdtZWRpdW0nIHZhbHVlIHdpbGwgYmUgMFxuICAgIHNpemVbIG1lYXN1cmVtZW50IF0gPSAhaXNOYU4oIG51bSApID8gbnVtIDogMDtcbiAgfVxuXG4gIHZhciBwYWRkaW5nV2lkdGggPSBzaXplLnBhZGRpbmdMZWZ0ICsgc2l6ZS5wYWRkaW5nUmlnaHQ7XG4gIHZhciBwYWRkaW5nSGVpZ2h0ID0gc2l6ZS5wYWRkaW5nVG9wICsgc2l6ZS5wYWRkaW5nQm90dG9tO1xuICB2YXIgbWFyZ2luV2lkdGggPSBzaXplLm1hcmdpbkxlZnQgKyBzaXplLm1hcmdpblJpZ2h0O1xuICB2YXIgbWFyZ2luSGVpZ2h0ID0gc2l6ZS5tYXJnaW5Ub3AgKyBzaXplLm1hcmdpbkJvdHRvbTtcbiAgdmFyIGJvcmRlcldpZHRoID0gc2l6ZS5ib3JkZXJMZWZ0V2lkdGggKyBzaXplLmJvcmRlclJpZ2h0V2lkdGg7XG4gIHZhciBib3JkZXJIZWlnaHQgPSBzaXplLmJvcmRlclRvcFdpZHRoICsgc2l6ZS5ib3JkZXJCb3R0b21XaWR0aDtcblxuICB2YXIgaXNCb3JkZXJCb3hTaXplT3V0ZXIgPSBpc0JvcmRlckJveCAmJiBpc0JveFNpemVPdXRlcjtcblxuICAvLyBvdmVyd3JpdGUgd2lkdGggYW5kIGhlaWdodCBpZiB3ZSBjYW4gZ2V0IGl0IGZyb20gc3R5bGVcbiAgdmFyIHN0eWxlV2lkdGggPSBnZXRTdHlsZVNpemUoIHN0eWxlLndpZHRoICk7XG4gIGlmICggc3R5bGVXaWR0aCAhPT0gZmFsc2UgKSB7XG4gICAgc2l6ZS53aWR0aCA9IHN0eWxlV2lkdGggK1xuICAgICAgLy8gYWRkIHBhZGRpbmcgYW5kIGJvcmRlciB1bmxlc3MgaXQncyBhbHJlYWR5IGluY2x1ZGluZyBpdFxuICAgICAgKCBpc0JvcmRlckJveFNpemVPdXRlciA/IDAgOiBwYWRkaW5nV2lkdGggKyBib3JkZXJXaWR0aCApO1xuICB9XG5cbiAgdmFyIHN0eWxlSGVpZ2h0ID0gZ2V0U3R5bGVTaXplKCBzdHlsZS5oZWlnaHQgKTtcbiAgaWYgKCBzdHlsZUhlaWdodCAhPT0gZmFsc2UgKSB7XG4gICAgc2l6ZS5oZWlnaHQgPSBzdHlsZUhlaWdodCArXG4gICAgICAvLyBhZGQgcGFkZGluZyBhbmQgYm9yZGVyIHVubGVzcyBpdCdzIGFscmVhZHkgaW5jbHVkaW5nIGl0XG4gICAgICAoIGlzQm9yZGVyQm94U2l6ZU91dGVyID8gMCA6IHBhZGRpbmdIZWlnaHQgKyBib3JkZXJIZWlnaHQgKTtcbiAgfVxuXG4gIHNpemUuaW5uZXJXaWR0aCA9IHNpemUud2lkdGggLSAoIHBhZGRpbmdXaWR0aCArIGJvcmRlcldpZHRoICk7XG4gIHNpemUuaW5uZXJIZWlnaHQgPSBzaXplLmhlaWdodCAtICggcGFkZGluZ0hlaWdodCArIGJvcmRlckhlaWdodCApO1xuXG4gIHNpemUub3V0ZXJXaWR0aCA9IHNpemUud2lkdGggKyBtYXJnaW5XaWR0aDtcbiAgc2l6ZS5vdXRlckhlaWdodCA9IHNpemUuaGVpZ2h0ICsgbWFyZ2luSGVpZ2h0O1xuXG4gIHJldHVybiBzaXplO1xufVxuXG4vLyBJRTggcmV0dXJucyBwZXJjZW50IHZhbHVlcywgbm90IHBpeGVsc1xuLy8gdGFrZW4gZnJvbSBqUXVlcnkncyBjdXJDU1NcbmZ1bmN0aW9uIG11bmdlTm9uUGl4ZWwoIGVsZW0sIHZhbHVlICkge1xuICAvLyBJRTggYW5kIGhhcyBwZXJjZW50IHZhbHVlXG4gIGlmICggd2luZG93LmdldENvbXB1dGVkU3R5bGUgfHwgdmFsdWUuaW5kZXhPZignJScpID09PSAtMSApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHN0eWxlID0gZWxlbS5zdHlsZTtcbiAgLy8gUmVtZW1iZXIgdGhlIG9yaWdpbmFsIHZhbHVlc1xuICB2YXIgbGVmdCA9IHN0eWxlLmxlZnQ7XG4gIHZhciBycyA9IGVsZW0ucnVudGltZVN0eWxlO1xuICB2YXIgcnNMZWZ0ID0gcnMgJiYgcnMubGVmdDtcblxuICAvLyBQdXQgaW4gdGhlIG5ldyB2YWx1ZXMgdG8gZ2V0IGEgY29tcHV0ZWQgdmFsdWUgb3V0XG4gIGlmICggcnNMZWZ0ICkge1xuICAgIHJzLmxlZnQgPSBlbGVtLmN1cnJlbnRTdHlsZS5sZWZ0O1xuICB9XG4gIHN0eWxlLmxlZnQgPSB2YWx1ZTtcbiAgdmFsdWUgPSBzdHlsZS5waXhlbExlZnQ7XG5cbiAgLy8gUmV2ZXJ0IHRoZSBjaGFuZ2VkIHZhbHVlc1xuICBzdHlsZS5sZWZ0ID0gbGVmdDtcbiAgaWYgKCByc0xlZnQgKSB7XG4gICAgcnMubGVmdCA9IHJzTGVmdDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxucmV0dXJuIGdldFNpemU7XG5cbn1cblxuLy8gdHJhbnNwb3J0XG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgLy8gQU1EIGZvciBSZXF1aXJlSlNcbiAgZGVmaW5lKCBbICdnZXQtc3R5bGUtcHJvcGVydHkvZ2V0LXN0eWxlLXByb3BlcnR5JyBdLCBkZWZpbmVHZXRTaXplICk7XG59IGVsc2UgaWYgKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKSB7XG4gIC8vIENvbW1vbkpTIGZvciBDb21wb25lbnRcbiAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVHZXRTaXplKCByZXF1aXJlKCdkZXNhbmRyby1nZXQtc3R5bGUtcHJvcGVydHknKSApO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LmdldFNpemUgPSBkZWZpbmVHZXRTaXplKCB3aW5kb3cuZ2V0U3R5bGVQcm9wZXJ0eSApO1xufVxuXG59KSggd2luZG93ICk7XG4iLCIvKiFcbiAqIGV2ZW50aWUgdjEuMC42XG4gKiBldmVudCBiaW5kaW5nIGhlbHBlclxuICogICBldmVudGllLmJpbmQoIGVsZW0sICdjbGljaycsIG15Rm4gKVxuICogICBldmVudGllLnVuYmluZCggZWxlbSwgJ2NsaWNrJywgbXlGbiApXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUgKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG52YXIgYmluZCA9IGZ1bmN0aW9uKCkge307XG5cbmZ1bmN0aW9uIGdldElFRXZlbnQoIG9iaiApIHtcbiAgdmFyIGV2ZW50ID0gd2luZG93LmV2ZW50O1xuICAvLyBhZGQgZXZlbnQudGFyZ2V0XG4gIGV2ZW50LnRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50IHx8IG9iajtcbiAgcmV0dXJuIGV2ZW50O1xufVxuXG5pZiAoIGRvY0VsZW0uYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uYXR0YWNoRXZlbnQgKSB7XG4gIGJpbmQgPSBmdW5jdGlvbiggb2JqLCB0eXBlLCBmbiApIHtcbiAgICBvYmpbIHR5cGUgKyBmbiBdID0gZm4uaGFuZGxlRXZlbnQgP1xuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKCBmbiwgZXZlbnQgKTtcbiAgICAgIH0gOlxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudCA9IGdldElFRXZlbnQoIG9iaiApO1xuICAgICAgICBmbi5jYWxsKCBvYmosIGV2ZW50ICk7XG4gICAgICB9O1xuICAgIG9iai5hdHRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICB9O1xufVxuXG52YXIgdW5iaW5kID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKCBkb2NFbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBmbiwgZmFsc2UgKTtcbiAgfTtcbn0gZWxzZSBpZiAoIGRvY0VsZW0uZGV0YWNoRXZlbnQgKSB7XG4gIHVuYmluZCA9IGZ1bmN0aW9uKCBvYmosIHR5cGUsIGZuICkge1xuICAgIG9iai5kZXRhY2hFdmVudCggXCJvblwiICsgdHlwZSwgb2JqWyB0eXBlICsgZm4gXSApO1xuICAgIHRyeSB7XG4gICAgICBkZWxldGUgb2JqWyB0eXBlICsgZm4gXTtcbiAgICB9IGNhdGNoICggZXJyICkge1xuICAgICAgLy8gY2FuJ3QgZGVsZXRlIHdpbmRvdyBvYmplY3QgcHJvcGVydGllc1xuICAgICAgb2JqWyB0eXBlICsgZm4gXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG59XG5cbnZhciBldmVudGllID0ge1xuICBiaW5kOiBiaW5kLFxuICB1bmJpbmQ6IHVuYmluZFxufTtcblxuLy8gLS0tLS0gbW9kdWxlIGRlZmluaXRpb24gLS0tLS0gLy9cblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gIC8vIEFNRFxuICBkZWZpbmUoIGV2ZW50aWUgKTtcbn0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcbiAgLy8gQ29tbW9uSlNcbiAgbW9kdWxlLmV4cG9ydHMgPSBldmVudGllO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LmV2ZW50aWUgPSBldmVudGllO1xufVxuXG59KSggd2luZG93ICk7XG4iLCIvKiFcbiAqIGRvY1JlYWR5IHYxLjAuNFxuICogQ3Jvc3MgYnJvd3NlciBET01Db250ZW50TG9hZGVkIGV2ZW50IGVtaXR0ZXJcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgc3RyaWN0OiB0cnVlLCB1bmRlZjogdHJ1ZSwgdW51c2VkOiB0cnVlKi9cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4vLyBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB0byBiZSB0cmlnZ2VyZWQgb24gcmVhZHlcbnZhciBxdWV1ZSA9IFtdO1xuXG5mdW5jdGlvbiBkb2NSZWFkeSggZm4gKSB7XG4gIC8vIHRocm93IG91dCBub24tZnVuY3Rpb25zXG4gIGlmICggdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICggZG9jUmVhZHkuaXNSZWFkeSApIHtcbiAgICAvLyByZWFkeSBub3csIGhpdCBpdFxuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcXVldWUgZnVuY3Rpb24gd2hlbiByZWFkeVxuICAgIHF1ZXVlLnB1c2goIGZuICk7XG4gIH1cbn1cblxuZG9jUmVhZHkuaXNSZWFkeSA9IGZhbHNlO1xuXG4vLyB0cmlnZ2VyZWQgb24gdmFyaW91cyBkb2MgcmVhZHkgZXZlbnRzXG5mdW5jdGlvbiBvblJlYWR5KCBldmVudCApIHtcbiAgLy8gYmFpbCBpZiBhbHJlYWR5IHRyaWdnZXJlZCBvciBJRTggZG9jdW1lbnQgaXMgbm90IHJlYWR5IGp1c3QgeWV0XG4gIHZhciBpc0lFOE5vdFJlYWR5ID0gZXZlbnQudHlwZSA9PT0gJ3JlYWR5c3RhdGVjaGFuZ2UnICYmIGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdjb21wbGV0ZSc7XG4gIGlmICggZG9jUmVhZHkuaXNSZWFkeSB8fCBpc0lFOE5vdFJlYWR5ICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyaWdnZXIoKTtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlcigpIHtcbiAgZG9jUmVhZHkuaXNSZWFkeSA9IHRydWU7XG4gIC8vIHByb2Nlc3MgcXVldWVcbiAgZm9yICggdmFyIGk9MCwgbGVuID0gcXVldWUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIGZuID0gcXVldWVbaV07XG4gICAgZm4oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZpbmVEb2NSZWFkeSggZXZlbnRpZSApIHtcbiAgLy8gdHJpZ2dlciByZWFkeSBpZiBwYWdlIGlzIHJlYWR5XG4gIGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyApIHtcbiAgICB0cmlnZ2VyKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbGlzdGVuIGZvciBldmVudHNcbiAgICBldmVudGllLmJpbmQoIGRvY3VtZW50LCAnRE9NQ29udGVudExvYWRlZCcsIG9uUmVhZHkgKTtcbiAgICBldmVudGllLmJpbmQoIGRvY3VtZW50LCAncmVhZHlzdGF0ZWNoYW5nZScsIG9uUmVhZHkgKTtcbiAgICBldmVudGllLmJpbmQoIHdpbmRvdywgJ2xvYWQnLCBvblJlYWR5ICk7XG4gIH1cblxuICByZXR1cm4gZG9jUmVhZHk7XG59XG5cbi8vIHRyYW5zcG9ydFxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gIC8vIEFNRFxuICBkZWZpbmUoIFsgJ2V2ZW50aWUvZXZlbnRpZScgXSwgZGVmaW5lRG9jUmVhZHkgKTtcbn0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVEb2NSZWFkeSggcmVxdWlyZSgnZXZlbnRpZScpICk7XG59IGVsc2Uge1xuICAvLyBicm93c2VyIGdsb2JhbFxuICB3aW5kb3cuZG9jUmVhZHkgPSBkZWZpbmVEb2NSZWFkeSggd2luZG93LmV2ZW50aWUgKTtcbn1cblxufSkoIHdpbmRvdyApO1xuIiwiLyohXG4gKiBFdmVudEVtaXR0ZXIgdjQuMi4xMSAtIGdpdC5pby9lZVxuICogVW5saWNlbnNlIC0gaHR0cDovL3VubGljZW5zZS5vcmcvXG4gKiBPbGl2ZXIgQ2FsZHdlbGwgLSBodHRwOi8vb2xpLm1lLnVrL1xuICogQHByZXNlcnZlXG4gKi9cblxuOyhmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIG1hbmFnaW5nIGV2ZW50cy5cbiAgICAgKiBDYW4gYmUgZXh0ZW5kZWQgdG8gcHJvdmlkZSBldmVudCBmdW5jdGlvbmFsaXR5IGluIG90aGVyIGNsYXNzZXMuXG4gICAgICpcbiAgICAgKiBAY2xhc3MgRXZlbnRFbWl0dGVyIE1hbmFnZXMgZXZlbnQgcmVnaXN0ZXJpbmcgYW5kIGVtaXR0aW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHt9XG5cbiAgICAvLyBTaG9ydGN1dHMgdG8gaW1wcm92ZSBzcGVlZCBhbmQgc2l6ZVxuICAgIHZhciBwcm90byA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGU7XG4gICAgdmFyIGV4cG9ydHMgPSB0aGlzO1xuICAgIHZhciBvcmlnaW5hbEdsb2JhbFZhbHVlID0gZXhwb3J0cy5FdmVudEVtaXR0ZXI7XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyB0aGUgaW5kZXggb2YgdGhlIGxpc3RlbmVyIGZvciB0aGUgZXZlbnQgaW4gaXRzIHN0b3JhZ2UgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IGxpc3RlbmVycyBBcnJheSBvZiBsaXN0ZW5lcnMgdG8gc2VhcmNoIHRocm91Z2guXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGxvb2sgZm9yLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gSW5kZXggb2YgdGhlIHNwZWNpZmllZCBsaXN0ZW5lciwgLTEgaWYgbm90IGZvdW5kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVycywgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsaWFzIGEgbWV0aG9kIHdoaWxlIGtlZXBpbmcgdGhlIGNvbnRleHQgY29ycmVjdCwgdG8gYWxsb3cgZm9yIG92ZXJ3cml0aW5nIG9mIHRhcmdldCBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGFsaWFzZWQgbWV0aG9kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWxpYXMobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWxpYXNDbG9zdXJlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbbmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsaXN0ZW5lciBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaWxsIGluaXRpYWxpc2UgdGhlIGV2ZW50IG9iamVjdCBhbmQgbGlzdGVuZXIgYXJyYXlzIGlmIHJlcXVpcmVkLlxuICAgICAqIFdpbGwgcmV0dXJuIGFuIG9iamVjdCBpZiB5b3UgdXNlIGEgcmVnZXggc2VhcmNoLiBUaGUgb2JqZWN0IGNvbnRhaW5zIGtleXMgZm9yIGVhY2ggbWF0Y2hlZCBldmVudC4gU28gL2JhW3J6XS8gbWlnaHQgcmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGJhciBhbmQgYmF6LiBCdXQgb25seSBpZiB5b3UgaGF2ZSBlaXRoZXIgZGVmaW5lZCB0aGVtIHdpdGggZGVmaW5lRXZlbnQgb3IgYWRkZWQgc29tZSBsaXN0ZW5lcnMgdG8gdGhlbS5cbiAgICAgKiBFYWNoIHByb3BlcnR5IGluIHRoZSBvYmplY3QgcmVzcG9uc2UgaXMgYW4gYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbltdfE9iamVjdH0gQWxsIGxpc3RlbmVyIGZ1bmN0aW9ucyBmb3IgdGhlIGV2ZW50LlxuICAgICAqL1xuICAgIHByb3RvLmdldExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldExpc3RlbmVycyhldnQpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgY29uY2F0ZW5hdGVkIGFycmF5IG9mIGFsbCBtYXRjaGluZyBldmVudHMgaWZcbiAgICAgICAgLy8gdGhlIHNlbGVjdG9yIGlzIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgICAgICBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Vba2V5XSA9IGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gZXZlbnRzW2V2dF0gfHwgKGV2ZW50c1tldnRdID0gW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIGxpc3Qgb2YgbGlzdGVuZXIgb2JqZWN0cyBhbmQgZmxhdHRlbnMgaXQgaW50byBhIGxpc3Qgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3RbXX0gbGlzdGVuZXJzIFJhdyBsaXN0ZW5lciBvYmplY3RzLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW119IEp1c3QgdGhlIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKi9cbiAgICBwcm90by5mbGF0dGVuTGlzdGVuZXJzID0gZnVuY3Rpb24gZmxhdHRlbkxpc3RlbmVycyhsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGZsYXRMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZmxhdExpc3RlbmVycy5wdXNoKGxpc3RlbmVyc1tpXS5saXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmxhdExpc3RlbmVycztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgcmVxdWVzdGVkIGxpc3RlbmVycyB2aWEgZ2V0TGlzdGVuZXJzIGJ1dCB3aWxsIGFsd2F5cyByZXR1cm4gdGhlIHJlc3VsdHMgaW5zaWRlIGFuIG9iamVjdC4gVGhpcyBpcyBtYWlubHkgZm9yIGludGVybmFsIHVzZSBidXQgb3RoZXJzIG1heSBmaW5kIGl0IHVzZWZ1bC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBpbiBhbiBvYmplY3QuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzQXNPYmplY3QgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnNBc09iamVjdChldnQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzKGV2dCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBpZiAobGlzdGVuZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICByZXNwb25zZVtldnRdID0gbGlzdGVuZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8IGxpc3RlbmVycztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogVGhlIGxpc3RlbmVyIHdpbGwgbm90IGJlIGFkZGVkIGlmIGl0IGlzIGEgZHVwbGljYXRlLlxuICAgICAqIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgaXQgaXMgY2FsbGVkLlxuICAgICAqIElmIHlvdSBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lIHRoZW4gdGhlIGxpc3RlbmVyIHdpbGwgYmUgYWRkZWQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGxpc3RlbmVySXNXcmFwcGVkID0gdHlwZW9mIGxpc3RlbmVyID09PSAnb2JqZWN0JztcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzW2tleV0sIGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnNba2V5XS5wdXNoKGxpc3RlbmVySXNXcmFwcGVkID8gbGlzdGVuZXIgOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgICAgICAgb25jZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBhZGRMaXN0ZW5lclxuICAgICAqL1xuICAgIHByb3RvLm9uID0gYWxpYXMoJ2FkZExpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBTZW1pLWFsaWFzIG9mIGFkZExpc3RlbmVyLiBJdCB3aWxsIGFkZCBhIGxpc3RlbmVyIHRoYXQgd2lsbCBiZVxuICAgICAqIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBhZnRlciBpdHMgZmlyc3QgZXhlY3V0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRPbmNlTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRPbmNlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihldnQsIHtcbiAgICAgICAgICAgIGxpc3RlbmVyOiBsaXN0ZW5lcixcbiAgICAgICAgICAgIG9uY2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZE9uY2VMaXN0ZW5lci5cbiAgICAgKi9cbiAgICBwcm90by5vbmNlID0gYWxpYXMoJ2FkZE9uY2VMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhbiBldmVudCBuYW1lLiBUaGlzIGlzIHJlcXVpcmVkIGlmIHlvdSB3YW50IHRvIHVzZSBhIHJlZ2V4IHRvIGFkZCBhIGxpc3RlbmVyIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBJZiB5b3UgZG9uJ3QgZG8gdGhpcyB0aGVuIGhvdyBkbyB5b3UgZXhwZWN0IGl0IHRvIGtub3cgd2hhdCBldmVudCB0byBhZGQgdG8/IFNob3VsZCBpdCBqdXN0IGFkZCB0byBldmVyeSBwb3NzaWJsZSBtYXRjaCBmb3IgYSByZWdleD8gTm8uIFRoYXQgaXMgc2NhcnkgYW5kIGJhZC5cbiAgICAgKiBZb3UgbmVlZCB0byB0ZWxsIGl0IHdoYXQgZXZlbnQgbmFtZXMgc2hvdWxkIGJlIG1hdGNoZWQgYnkgYSByZWdleC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gY3JlYXRlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50ID0gZnVuY3Rpb24gZGVmaW5lRXZlbnQoZXZ0KSB7XG4gICAgICAgIHRoaXMuZ2V0TGlzdGVuZXJzKGV2dCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2VzIGRlZmluZUV2ZW50IHRvIGRlZmluZSBtdWx0aXBsZSBldmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBldnRzIEFuIGFycmF5IG9mIGV2ZW50IG5hbWVzIHRvIGRlZmluZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5kZWZpbmVFdmVudHMgPSBmdW5jdGlvbiBkZWZpbmVFdmVudHMoZXZ0cykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2dHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lRXZlbnQoZXZ0c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmdW5jdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogV2hlbiBwYXNzZWQgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUsIGl0IHdpbGwgcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIgZnJvbS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gcmVtb3ZlIGZyb20gdGhlIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnNba2V5XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiByZW1vdmVMaXN0ZW5lclxuICAgICAqL1xuICAgIHByb3RvLm9mZiA9IGFsaWFzKCdyZW1vdmVMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy4gWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIGFkZGVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIGFkZCB0aGUgYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKiBZZWFoLCB0aGlzIGZ1bmN0aW9uIGRvZXMgcXVpdGUgYSBiaXQuIFRoYXQncyBwcm9iYWJseSBhIGJhZCB0aGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byBhZGQgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gYWRkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZExpc3RlbmVycyA9IGZ1bmN0aW9uIGFkZExpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuICAgICAgICAvLyBQYXNzIHRocm91Z2ggdG8gbWFuaXB1bGF0ZUxpc3RlbmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKGZhbHNlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgbGlzdGVuZXJzIGluIGJ1bGsgdXNpbmcgdGhlIG1hbmlwdWxhdGVMaXN0ZW5lcnMgbWV0aG9kLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVycyBmcm9tIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnModHJ1ZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFZGl0cyBsaXN0ZW5lcnMgaW4gYnVsay4gVGhlIGFkZExpc3RlbmVycyBhbmQgcmVtb3ZlTGlzdGVuZXJzIG1ldGhvZHMgYm90aCB1c2UgdGhpcyB0byBkbyB0aGVpciBqb2IuIFlvdSBzaG91bGQgcmVhbGx5IHVzZSB0aG9zZSBpbnN0ZWFkLCB0aGlzIGlzIGEgbGl0dGxlIGxvd2VyIGxldmVsLlxuICAgICAqIFRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGRldGVybWluZSBpZiB0aGUgbGlzdGVuZXJzIGFyZSByZW1vdmVkICh0cnVlKSBvciBhZGRlZCAoZmFsc2UpLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkL3JlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIGFkZGVkL3JlbW92ZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWFuaXB1bGF0ZSB0aGUgbGlzdGVuZXJzIG9mIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVtb3ZlIFRydWUgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIGxpc3RlbmVycywgZmFsc2UgaWYgeW91IHdhbnQgdG8gYWRkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxSZWdFeHB9IGV2dCBBbiBldmVudCBuYW1lIGlmIHlvdSB3aWxsIHBhc3MgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIG5leHQuIEFuIG9iamVjdCBpZiB5b3Ugd2lzaCB0byBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gYWRkL3JlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5tYW5pcHVsYXRlTGlzdGVuZXJzID0gZnVuY3Rpb24gbWFuaXB1bGF0ZUxpc3RlbmVycyhyZW1vdmUsIGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIHZhciBzaW5nbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVyIDogdGhpcy5hZGRMaXN0ZW5lcjtcbiAgICAgICAgdmFyIG11bHRpcGxlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lcnMgOiB0aGlzLmFkZExpc3RlbmVycztcblxuICAgICAgICAvLyBJZiBldnQgaXMgYW4gb2JqZWN0IHRoZW4gcGFzcyBlYWNoIG9mIGl0cyBwcm9wZXJ0aWVzIHRvIHRoaXMgbWV0aG9kXG4gICAgICAgIGlmICh0eXBlb2YgZXZ0ID09PSAnb2JqZWN0JyAmJiAhKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZ0Lmhhc093blByb3BlcnR5KGkpICYmICh2YWx1ZSA9IGV2dFtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGFzcyB0aGUgc2luZ2xlIGxpc3RlbmVyIHN0cmFpZ2h0IHRocm91Z2ggdG8gdGhlIHNpbmd1bGFyIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGUuY2FsbCh0aGlzLCBpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgcGFzcyBiYWNrIHRvIHRoZSBtdWx0aXBsZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGUuY2FsbCh0aGlzLCBpLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBTbyBldnQgbXVzdCBiZSBhIHN0cmluZ1xuICAgICAgICAgICAgLy8gQW5kIGxpc3RlbmVycyBtdXN0IGJlIGFuIGFycmF5IG9mIGxpc3RlbmVyc1xuICAgICAgICAgICAgLy8gTG9vcCBvdmVyIGl0IGFuZCBwYXNzIGVhY2ggb25lIHRvIHRoZSBtdWx0aXBsZSBtZXRob2RcbiAgICAgICAgICAgIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGV2dCwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBsaXN0ZW5lcnMgZnJvbSBhIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYW4gZXZlbnQgdGhlbiBhbGwgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKiBUaGF0IG1lYW5zIGV2ZXJ5IGV2ZW50IHdpbGwgYmUgZW1wdGllZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ2V4IHRvIHJlbW92ZSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IFtldnRdIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvci4gV2lsbCByZW1vdmUgZnJvbSBldmVyeSBldmVudCBpZiBub3QgcGFzc2VkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gcmVtb3ZlRXZlbnQoZXZ0KSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIGV2dDtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIC8vIFJlbW92ZSBkaWZmZXJlbnQgdGhpbmdzIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUgb2YgZXZ0XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbZXZ0XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgZXZlbnRzIG1hdGNoaW5nIHRoZSByZWdleC5cbiAgICAgICAgICAgIGZvciAoa2V5IGluIGV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBldnQudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBldmVudHNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBpbiBhbGwgZXZlbnRzXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUV2ZW50LlxuICAgICAqXG4gICAgICogQWRkZWQgdG8gbWlycm9yIHRoZSBub2RlIEFQSS5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBhbGlhcygncmVtb3ZlRXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IG9mIHlvdXIgY2hvaWNlLlxuICAgICAqIFdoZW4gZW1pdHRlZCwgZXZlcnkgbGlzdGVuZXIgYXR0YWNoZWQgdG8gdGhhdCBldmVudCB3aWxsIGJlIGV4ZWN1dGVkLlxuICAgICAqIElmIHlvdSBwYXNzIHRoZSBvcHRpb25hbCBhcmd1bWVudCBhcnJheSB0aGVuIHRob3NlIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCB0byBldmVyeSBsaXN0ZW5lciB1cG9uIGV4ZWN1dGlvbi5cbiAgICAgKiBCZWNhdXNlIGl0IHVzZXMgYGFwcGx5YCwgeW91ciBhcnJheSBvZiBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgYXMgaWYgeW91IHdyb3RlIHRoZW0gb3V0IHNlcGFyYXRlbHkuXG4gICAgICogU28gdGhleSB3aWxsIG5vdCBhcnJpdmUgd2l0aGluIHRoZSBhcnJheSBvbiB0aGUgb3RoZXIgc2lkZSwgdGhleSB3aWxsIGJlIHNlcGFyYXRlLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIHRvIGVtaXQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZW1pdCBhbmQgZXhlY3V0ZSBsaXN0ZW5lcnMgZm9yLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFthcmdzXSBPcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggbGlzdGVuZXIuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZW1pdEV2ZW50ID0gZnVuY3Rpb24gZW1pdEV2ZW50KGV2dCwgYXJncykge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXI7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBpID0gbGlzdGVuZXJzW2tleV0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgc2hhbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgZWl0aGVyIHdpdGggYSBiYXNpYyBjYWxsIG9yIGFuIGFwcGx5IGlmIHRoZXJlIGlzIGFuIGFyZ3MgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNba2V5XVtpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25jZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gbGlzdGVuZXIubGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBlbWl0RXZlbnRcbiAgICAgKi9cbiAgICBwcm90by50cmlnZ2VyID0gYWxpYXMoJ2VtaXRFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogU3VidGx5IGRpZmZlcmVudCBmcm9tIGVtaXRFdmVudCBpbiB0aGF0IGl0IHdpbGwgcGFzcyBpdHMgYXJndW1lbnRzIG9uIHRvIHRoZSBsaXN0ZW5lcnMsIGFzIG9wcG9zZWQgdG8gdGFraW5nIGEgc2luZ2xlIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwYXNzIG9uLlxuICAgICAqIEFzIHdpdGggZW1pdEV2ZW50LCB5b3UgY2FuIHBhc3MgYSByZWdleCBpbiBwbGFjZSBvZiB0aGUgZXZlbnQgbmFtZSB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0gey4uLip9IE9wdGlvbmFsIGFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2dCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXRFdmVudChldnQsIGFyZ3MpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZiBhXG4gICAgICogbGlzdGVuZXJzIHJldHVybiB2YWx1ZSBtYXRjaGVzIHRoZSBvbmUgc2V0IGhlcmUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWRcbiAgICAgKiBhZnRlciBleGVjdXRpb24uIFRoaXMgdmFsdWUgZGVmYXVsdHMgdG8gdHJ1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIG5ldyB2YWx1ZSB0byBjaGVjayBmb3Igd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnNldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIHNldE9uY2VSZXR1cm5WYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9vbmNlUmV0dXJuVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdCB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuIElmXG4gICAgICogdGhlIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGlzIG9uZSB0aGVuIGl0IHNob3VsZCBiZSByZW1vdmVkXG4gICAgICogYXV0b21hdGljYWxseS4gSXQgd2lsbCByZXR1cm4gdHJ1ZSBieSBkZWZhdWx0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7KnxCb29sZWFufSBUaGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBmb3Igb3IgdGhlIGRlZmF1bHQsIHRydWUuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIF9nZXRPbmNlUmV0dXJuVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdfb25jZVJldHVyblZhbHVlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbmNlUmV0dXJuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBldmVudHMgb2JqZWN0IGFuZCBjcmVhdGVzIG9uZSBpZiByZXF1aXJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGV2ZW50cyBzdG9yYWdlIG9iamVjdC5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90by5fZ2V0RXZlbnRzID0gZnVuY3Rpb24gX2dldEV2ZW50cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cyB8fCAodGhpcy5fZXZlbnRzID0ge30pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXZlcnRzIHRoZSBnbG9iYWwge0BsaW5rIEV2ZW50RW1pdHRlcn0gdG8gaXRzIHByZXZpb3VzIHZhbHVlIGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoaXMgdmVyc2lvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBOb24gY29uZmxpY3RpbmcgRXZlbnRFbWl0dGVyIGNsYXNzLlxuICAgICAqL1xuICAgIEV2ZW50RW1pdHRlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBvcmlnaW5hbEdsb2JhbFZhbHVlO1xuICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgIH07XG5cbiAgICAvLyBFeHBvc2UgdGhlIGNsYXNzIGVpdGhlciB2aWEgQU1ELCBDb21tb25KUyBvciB0aGUgZ2xvYmFsIG9iamVjdFxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyl7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG4gICAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIi8qKlxuICogbWF0Y2hlc1NlbGVjdG9yIHYxLjAuMlxuICogbWF0Y2hlc1NlbGVjdG9yKCBlbGVtZW50LCAnLnNlbGVjdG9yJyApXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSAqL1xuLypnbG9iYWwgZGVmaW5lOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSAqL1xuXG4oIGZ1bmN0aW9uKCBFbGVtUHJvdG8gKSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBtYXRjaGVzTWV0aG9kID0gKCBmdW5jdGlvbigpIHtcbiAgICAvLyBjaGVjayB1bi1wcmVmaXhlZFxuICAgIGlmICggRWxlbVByb3RvLm1hdGNoZXNTZWxlY3RvciApIHtcbiAgICAgIHJldHVybiAnbWF0Y2hlc1NlbGVjdG9yJztcbiAgICB9XG4gICAgLy8gY2hlY2sgdmVuZG9yIHByZWZpeGVzXG4gICAgdmFyIHByZWZpeGVzID0gWyAnd2Via2l0JywgJ21veicsICdtcycsICdvJyBdO1xuXG4gICAgZm9yICggdmFyIGk9MCwgbGVuID0gcHJlZml4ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgICB2YXIgbWV0aG9kID0gcHJlZml4ICsgJ01hdGNoZXNTZWxlY3Rvcic7XG4gICAgICBpZiAoIEVsZW1Qcm90b1sgbWV0aG9kIF0gKSB7XG4gICAgICAgIHJldHVybiBtZXRob2Q7XG4gICAgICB9XG4gICAgfVxuICB9KSgpO1xuXG4gIC8vIC0tLS0tIG1hdGNoIC0tLS0tIC8vXG5cbiAgZnVuY3Rpb24gbWF0Y2goIGVsZW0sIHNlbGVjdG9yICkge1xuICAgIHJldHVybiBlbGVtWyBtYXRjaGVzTWV0aG9kIF0oIHNlbGVjdG9yICk7XG4gIH1cblxuICAvLyAtLS0tLSBhcHBlbmRUb0ZyYWdtZW50IC0tLS0tIC8vXG5cbiAgZnVuY3Rpb24gY2hlY2tQYXJlbnQoIGVsZW0gKSB7XG4gICAgLy8gbm90IG5lZWRlZCBpZiBhbHJlYWR5IGhhcyBwYXJlbnRcbiAgICBpZiAoIGVsZW0ucGFyZW50Tm9kZSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBlbGVtICk7XG4gIH1cblxuICAvLyAtLS0tLSBxdWVyeSAtLS0tLSAvL1xuXG4gIC8vIGZhbGwgYmFjayB0byB1c2luZyBRU0FcbiAgLy8gdGh4IEBqb25hdGhhbnRuZWFsIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzMwNjI5NTVcbiAgZnVuY3Rpb24gcXVlcnkoIGVsZW0sIHNlbGVjdG9yICkge1xuICAgIC8vIGFwcGVuZCB0byBmcmFnbWVudCBpZiBubyBwYXJlbnRcbiAgICBjaGVja1BhcmVudCggZWxlbSApO1xuXG4gICAgLy8gbWF0Y2ggZWxlbSB3aXRoIGFsbCBzZWxlY3RlZCBlbGVtcyBvZiBwYXJlbnRcbiAgICB2YXIgZWxlbXMgPSBlbGVtLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKTtcbiAgICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBlbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICAgIC8vIHJldHVybiB0cnVlIGlmIG1hdGNoXG4gICAgICBpZiAoIGVsZW1zW2ldID09PSBlbGVtICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gb3RoZXJ3aXNlIHJldHVybiBmYWxzZVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIC0tLS0tIG1hdGNoQ2hpbGQgLS0tLS0gLy9cblxuICBmdW5jdGlvbiBtYXRjaENoaWxkKCBlbGVtLCBzZWxlY3RvciApIHtcbiAgICBjaGVja1BhcmVudCggZWxlbSApO1xuICAgIHJldHVybiBtYXRjaCggZWxlbSwgc2VsZWN0b3IgKTtcbiAgfVxuXG4gIC8vIC0tLS0tIG1hdGNoZXNTZWxlY3RvciAtLS0tLSAvL1xuXG4gIHZhciBtYXRjaGVzU2VsZWN0b3I7XG5cbiAgaWYgKCBtYXRjaGVzTWV0aG9kICkge1xuICAgIC8vIElFOSBzdXBwb3J0cyBtYXRjaGVzU2VsZWN0b3IsIGJ1dCBkb2Vzbid0IHdvcmsgb24gb3JwaGFuZWQgZWxlbXNcbiAgICAvLyBjaGVjayBmb3IgdGhhdFxuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgc3VwcG9ydHNPcnBoYW5zID0gbWF0Y2goIGRpdiwgJ2RpdicgKTtcbiAgICBtYXRjaGVzU2VsZWN0b3IgPSBzdXBwb3J0c09ycGhhbnMgPyBtYXRjaCA6IG1hdGNoQ2hpbGQ7XG4gIH0gZWxzZSB7XG4gICAgbWF0Y2hlc1NlbGVjdG9yID0gcXVlcnk7XG4gIH1cblxuICAvLyB0cmFuc3BvcnRcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBtYXRjaGVzU2VsZWN0b3I7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXNTZWxlY3RvcjtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5tYXRjaGVzU2VsZWN0b3IgPSBtYXRjaGVzU2VsZWN0b3I7XG4gIH1cblxufSkoIEVsZW1lbnQucHJvdG90eXBlICk7XG4iLCIvKipcbiAqIFBhY2tlcnkgSXRlbSBFbGVtZW50XG4qKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEl0ZW0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gaXRlbURlZmluaXRpb24oIGdldFN0eWxlUHJvcGVydHksIE91dGxheWVyLCBSZWN0ICkge1xuXG52YXIgdHJhbnNmb3JtUHJvcGVydHkgPSBnZXRTdHlsZVByb3BlcnR5KCd0cmFuc2Zvcm0nKTtcblxuLy8gc3ViLWNsYXNzIEl0ZW1cbnZhciBJdGVtID0gZnVuY3Rpb24gUGFja2VyeUl0ZW0oKSB7XG4gIE91dGxheWVyLkl0ZW0uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xufTtcblxuSXRlbS5wcm90b3R5cGUgPSBuZXcgT3V0bGF5ZXIuSXRlbSgpO1xuXG52YXIgcHJvdG9DcmVhdGUgPSBJdGVtLnByb3RvdHlwZS5fY3JlYXRlO1xuSXRlbS5wcm90b3R5cGUuX2NyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBjYWxsIGRlZmF1bHQgX2NyZWF0ZSBsb2dpY1xuICBwcm90b0NyZWF0ZS5jYWxsKCB0aGlzICk7XG4gIHRoaXMucmVjdCA9IG5ldyBSZWN0KCk7XG4gIC8vIHJlY3QgdXNlZCBmb3IgcGxhY2luZywgaW4gZHJhZyBvciBQYWNrZXJ5LmZpdCgpXG4gIHRoaXMucGxhY2VSZWN0ID0gbmV3IFJlY3QoKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRyYWcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuSXRlbS5wcm90b3R5cGUuZHJhZ1N0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZ2V0UG9zaXRpb24oKTtcbiAgdGhpcy5yZW1vdmVUcmFuc2l0aW9uU3R5bGVzKCk7XG4gIC8vIHJlbW92ZSB0cmFuc2Zvcm0gcHJvcGVydHkgZnJvbSB0cmFuc2l0aW9uXG4gIGlmICggdGhpcy5pc1RyYW5zaXRpb25pbmcgJiYgdHJhbnNmb3JtUHJvcGVydHkgKSB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlWyB0cmFuc2Zvcm1Qcm9wZXJ0eSBdID0gJ25vbmUnO1xuICB9XG4gIHRoaXMuZ2V0U2l6ZSgpO1xuICAvLyBjcmVhdGUgcGxhY2UgcmVjdCwgdXNlZCBmb3IgcG9zaXRpb24gd2hlbiBkcmFnZ2VkIHRoZW4gZHJvcHBlZFxuICAvLyBvciB3aGVuIHBvc2l0aW9uaW5nXG4gIHRoaXMuaXNQbGFjaW5nID0gdHJ1ZTtcbiAgdGhpcy5uZWVkc1Bvc2l0aW9uaW5nID0gZmFsc2U7XG4gIHRoaXMucG9zaXRpb25QbGFjZVJlY3QoIHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICk7XG4gIHRoaXMuaXNUcmFuc2l0aW9uaW5nID0gZmFsc2U7XG4gIHRoaXMuZGlkRHJhZyA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiBoYW5kbGUgaXRlbSB3aGVuIGl0IGlzIGRyYWdnZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gaG9yaXpvbnRhbCBwb3NpdGlvbiBvZiBkcmFnZ2VkIGl0ZW1cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gdmVydGljYWwgcG9zaXRpb24gb2YgZHJhZ2dlZCBpdGVtXG4gKi9cbkl0ZW0ucHJvdG90eXBlLmRyYWdNb3ZlID0gZnVuY3Rpb24oIHgsIHkgKSB7XG4gIHRoaXMuZGlkRHJhZyA9IHRydWU7XG4gIHZhciBwYWNrZXJ5U2l6ZSA9IHRoaXMubGF5b3V0LnNpemU7XG4gIHggLT0gcGFja2VyeVNpemUucGFkZGluZ0xlZnQ7XG4gIHkgLT0gcGFja2VyeVNpemUucGFkZGluZ1RvcDtcbiAgdGhpcy5wb3NpdGlvblBsYWNlUmVjdCggeCwgeSApO1xufTtcblxuSXRlbS5wcm90b3R5cGUuZHJhZ1N0b3AgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5nZXRQb3NpdGlvbigpO1xuICB2YXIgaXNEaWZmWCA9IHRoaXMucG9zaXRpb24ueCAhPT0gdGhpcy5wbGFjZVJlY3QueDtcbiAgdmFyIGlzRGlmZlkgPSB0aGlzLnBvc2l0aW9uLnkgIT09IHRoaXMucGxhY2VSZWN0Lnk7XG4gIC8vIHNldCBwb3N0LWRyYWcgcG9zaXRpb25pbmcgZmxhZ1xuICB0aGlzLm5lZWRzUG9zaXRpb25pbmcgPSBpc0RpZmZYIHx8IGlzRGlmZlk7XG4gIC8vIHJlc2V0IGZsYWdcbiAgdGhpcy5kaWREcmFnID0gZmFsc2U7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBwbGFjaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogcG9zaXRpb24gYSByZWN0IHRoYXQgd2lsbCBvY2N1cHkgc3BhY2UgaW4gdGhlIHBhY2tlclxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzTWF4WUNvbnRhaW5lZFxuICovXG5JdGVtLnByb3RvdHlwZS5wb3NpdGlvblBsYWNlUmVjdCA9IGZ1bmN0aW9uKCB4LCB5LCBpc01heFlPcGVuICkge1xuICB0aGlzLnBsYWNlUmVjdC54ID0gdGhpcy5nZXRQbGFjZVJlY3RDb29yZCggeCwgdHJ1ZSApO1xuICB0aGlzLnBsYWNlUmVjdC55ID0gdGhpcy5nZXRQbGFjZVJlY3RDb29yZCggeSwgZmFsc2UsIGlzTWF4WU9wZW4gKTtcbn07XG5cbi8qKlxuICogZ2V0IHgveSBjb29yZGluYXRlIGZvciBwbGFjZSByZWN0XG4gKiBAcGFyYW0ge051bWJlcn0gY29vcmQgLSB4IG9yIHlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNYXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzTWF4T3BlbiAtIGRvZXMgbm90IGxpbWl0IHZhbHVlIHRvIG91dGVyIGJvdW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBjb29yZCAtIHByb2Nlc3NlZCB4IG9yIHlcbiAqL1xuSXRlbS5wcm90b3R5cGUuZ2V0UGxhY2VSZWN0Q29vcmQgPSBmdW5jdGlvbiggY29vcmQsIGlzWCwgaXNNYXhPcGVuICkge1xuICB2YXIgbWVhc3VyZSA9IGlzWCA/ICdXaWR0aCcgOiAnSGVpZ2h0JztcbiAgdmFyIHNpemUgPSB0aGlzLnNpemVbICdvdXRlcicgKyBtZWFzdXJlIF07XG4gIHZhciBzZWdtZW50ID0gdGhpcy5sYXlvdXRbIGlzWCA/ICdjb2x1bW5XaWR0aCcgOiAncm93SGVpZ2h0JyBdO1xuICB2YXIgcGFyZW50U2l6ZSA9IHRoaXMubGF5b3V0LnNpemVbICdpbm5lcicgKyBtZWFzdXJlIF07XG5cbiAgLy8gYWRkaXRpb25hbCBwYXJlbnRTaXplIGNhbGN1bGF0aW9ucyBmb3IgWVxuICBpZiAoICFpc1ggKSB7XG4gICAgcGFyZW50U2l6ZSA9IE1hdGgubWF4KCBwYXJlbnRTaXplLCB0aGlzLmxheW91dC5tYXhZICk7XG4gICAgLy8gcHJldmVudCBndXR0ZXIgZnJvbSBidW1waW5nIHVwIGhlaWdodCB3aGVuIG5vbi12ZXJ0aWNhbCBncmlkXG4gICAgaWYgKCAhdGhpcy5sYXlvdXQucm93SGVpZ2h0ICkge1xuICAgICAgcGFyZW50U2l6ZSAtPSB0aGlzLmxheW91dC5ndXR0ZXI7XG4gICAgfVxuICB9XG5cbiAgdmFyIG1heDtcblxuICBpZiAoIHNlZ21lbnQgKSB7XG4gICAgc2VnbWVudCArPSB0aGlzLmxheW91dC5ndXR0ZXI7XG4gICAgLy8gYWxsb3cgZm9yIGxhc3QgY29sdW1uIHRvIHJlYWNoIHRoZSBlZGdlXG4gICAgcGFyZW50U2l6ZSArPSBpc1ggPyB0aGlzLmxheW91dC5ndXR0ZXIgOiAwO1xuICAgIC8vIHNuYXAgdG8gY2xvc2VzdCBzZWdtZW50XG4gICAgY29vcmQgPSBNYXRoLnJvdW5kKCBjb29yZCAvIHNlZ21lbnQgKTtcbiAgICAvLyBjb250YWluIHRvIG91dGVyIGJvdW5kXG4gICAgLy8gY29udGFpbiBub24tZ3Jvd2luZyBib3VuZCwgYWxsb3cgZ3Jvd2luZyBib3VuZCB0byBncm93XG4gICAgdmFyIG1hdGhNZXRob2Q7XG4gICAgaWYgKCB0aGlzLmxheW91dC5vcHRpb25zLmlzSG9yaXpvbnRhbCApIHtcbiAgICAgIG1hdGhNZXRob2QgPSAhaXNYID8gJ2Zsb29yJyA6ICdjZWlsJztcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0aE1ldGhvZCA9IGlzWCA/ICdmbG9vcicgOiAnY2VpbCc7XG4gICAgfVxuICAgIHZhciBtYXhTZWdtZW50cyA9IE1hdGhbIG1hdGhNZXRob2QgXSggcGFyZW50U2l6ZSAvIHNlZ21lbnQgKTtcbiAgICBtYXhTZWdtZW50cyAtPSBNYXRoLmNlaWwoIHNpemUgLyBzZWdtZW50ICk7XG4gICAgbWF4ID0gbWF4U2VnbWVudHM7XG4gIH0gZWxzZSB7XG4gICAgbWF4ID0gcGFyZW50U2l6ZSAtIHNpemU7XG4gIH1cblxuICBjb29yZCA9IGlzTWF4T3BlbiA/IGNvb3JkIDogTWF0aC5taW4oIGNvb3JkLCBtYXggKTtcbiAgY29vcmQgKj0gc2VnbWVudCB8fCAxO1xuXG4gIHJldHVybiBNYXRoLm1heCggMCwgY29vcmQgKTtcbn07XG5cbkl0ZW0ucHJvdG90eXBlLmNvcHlQbGFjZVJlY3RQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJlY3QueCA9IHRoaXMucGxhY2VSZWN0Lng7XG4gIHRoaXMucmVjdC55ID0gdGhpcy5wbGFjZVJlY3QueTtcbn07XG5cbnJldHVybiBJdGVtO1xuXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHRyYW5zcG9ydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgLy8gQU1EXG4gIGRlZmluZSggW1xuICAgICAgJ2dldC1zdHlsZS1wcm9wZXJ0eS9nZXQtc3R5bGUtcHJvcGVydHknLFxuICAgICAgJ291dGxheWVyL291dGxheWVyJyxcbiAgICAgICcuL3JlY3QnXG4gICAgXSxcbiAgICBpdGVtRGVmaW5pdGlvbiApO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LlBhY2tlcnkuSXRlbSA9IGl0ZW1EZWZpbml0aW9uKFxuICAgIHdpbmRvdy5nZXRTdHlsZVByb3BlcnR5LFxuICAgIHdpbmRvdy5PdXRsYXllcixcbiAgICB3aW5kb3cuUGFja2VyeS5SZWN0XG4gICk7XG59XG5cbn0pKCB3aW5kb3cgKTtcbiIsIi8qIVxuICogT3V0bGF5ZXIgdjEuMy4wXG4gKiB0aGUgYnJhaW5zIGFuZCBndXRzIG9mIGEgbGF5b3V0IGxpYnJhcnlcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tIHZhcnMgLS0tLS0gLy9cblxudmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xudmFyIGNvbnNvbGUgPSB3aW5kb3cuY29uc29sZTtcbnZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5O1xudmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBoZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGV4dGVuZCBvYmplY3RzXG5mdW5jdGlvbiBleHRlbmQoIGEsIGIgKSB7XG4gIGZvciAoIHZhciBwcm9wIGluIGIgKSB7XG4gICAgYVsgcHJvcCBdID0gYlsgcHJvcCBdO1xuICB9XG4gIHJldHVybiBhO1xufVxuXG5cbnZhciBvYmpUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5mdW5jdGlvbiBpc0FycmF5KCBvYmogKSB7XG4gIHJldHVybiBvYmpUb1N0cmluZy5jYWxsKCBvYmogKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLy8gdHVybiBlbGVtZW50IG9yIG5vZGVMaXN0IGludG8gYW4gYXJyYXlcbmZ1bmN0aW9uIG1ha2VBcnJheSggb2JqICkge1xuICB2YXIgYXJ5ID0gW107XG4gIGlmICggaXNBcnJheSggb2JqICkgKSB7XG4gICAgLy8gdXNlIG9iamVjdCBpZiBhbHJlYWR5IGFuIGFycmF5XG4gICAgYXJ5ID0gb2JqO1xuICB9IGVsc2UgaWYgKCBvYmogJiYgdHlwZW9mIG9iai5sZW5ndGggPT09ICdudW1iZXInICkge1xuICAgIC8vIGNvbnZlcnQgbm9kZUxpc3QgdG8gYXJyYXlcbiAgICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgICBhcnkucHVzaCggb2JqW2ldICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGFycmF5IG9mIHNpbmdsZSBpbmRleFxuICAgIGFyeS5wdXNoKCBvYmogKTtcbiAgfVxuICByZXR1cm4gYXJ5O1xufVxuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODQzODAvMTgyMTgzXG52YXIgaXNFbGVtZW50ID0gKCB0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIEhUTUxFbGVtZW50ID09PSAnb2JqZWN0JyApID9cbiAgZnVuY3Rpb24gaXNFbGVtZW50RE9NMiggb2JqICkge1xuICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgfSA6XG4gIGZ1bmN0aW9uIGlzRWxlbWVudFF1aXJreSggb2JqICkge1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG9iai5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygb2JqLm5vZGVOYW1lID09PSAnc3RyaW5nJztcbiAgfTtcblxuLy8gaW5kZXggb2YgaGVscGVyIGNhdXNlIElFOFxudmFyIGluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA/IGZ1bmN0aW9uKCBhcnksIG9iaiApIHtcbiAgICByZXR1cm4gYXJ5LmluZGV4T2YoIG9iaiApO1xuICB9IDogZnVuY3Rpb24oIGFyeSwgb2JqICkge1xuICAgIGZvciAoIHZhciBpPTAsIGxlbiA9IGFyeS5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICAgIGlmICggYXJ5W2ldID09PSBvYmogKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbmZ1bmN0aW9uIHJlbW92ZUZyb20oIG9iaiwgYXJ5ICkge1xuICB2YXIgaW5kZXggPSBpbmRleE9mKCBhcnksIG9iaiApO1xuICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICBhcnkuc3BsaWNlKCBpbmRleCwgMSApO1xuICB9XG59XG5cbi8vIGh0dHA6Ly9qYW1lc3JvYmVydHMubmFtZS9ibG9nLzIwMTAvMDIvMjIvc3RyaW5nLWZ1bmN0aW9ucy1mb3ItamF2YXNjcmlwdC10cmltLXRvLWNhbWVsLWNhc2UtdG8tZGFzaGVkLWFuZC10by11bmRlcnNjb3JlL1xuZnVuY3Rpb24gdG9EYXNoZWQoIHN0ciApIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKCAvKC4pKFtBLVpdKS9nLCBmdW5jdGlvbiggbWF0Y2gsICQxLCAkMiApIHtcbiAgICByZXR1cm4gJDEgKyAnLScgKyAkMjtcbiAgfSkudG9Mb3dlckNhc2UoKTtcbn1cblxuXG5mdW5jdGlvbiBvdXRsYXllckRlZmluaXRpb24oIGV2ZW50aWUsIGRvY1JlYWR5LCBFdmVudEVtaXR0ZXIsIGdldFNpemUsIG1hdGNoZXNTZWxlY3RvciwgSXRlbSApIHtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gT3V0bGF5ZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZ2xvYmFsbHkgdW5pcXVlIGlkZW50aWZpZXJzXG52YXIgR1VJRCA9IDA7XG4vLyBpbnRlcm5hbCBzdG9yZSBvZiBhbGwgT3V0bGF5ZXIgaW50YW5jZXNcbnZhciBpbnN0YW5jZXMgPSB7fTtcblxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudCwgU3RyaW5nfSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE91dGxheWVyKCBlbGVtZW50LCBvcHRpb25zICkge1xuICAvLyB1c2UgZWxlbWVudCBhcyBzZWxlY3RvciBzdHJpbmdcbiAgaWYgKCB0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycgKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGVsZW1lbnQgKTtcbiAgfVxuXG4gIC8vIGJhaWwgb3V0IGlmIG5vdCBwcm9wZXIgZWxlbWVudFxuICBpZiAoICFlbGVtZW50IHx8ICFpc0VsZW1lbnQoIGVsZW1lbnQgKSApIHtcbiAgICBpZiAoIGNvbnNvbGUgKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCAnQmFkICcgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWVzcGFjZSArICcgZWxlbWVudDogJyArIGVsZW1lbnQgKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuICAvLyBvcHRpb25zXG4gIHRoaXMub3B0aW9ucyA9IGV4dGVuZCgge30sIHRoaXMuY29uc3RydWN0b3IuZGVmYXVsdHMgKTtcbiAgdGhpcy5vcHRpb24oIG9wdGlvbnMgKTtcblxuICAvLyBhZGQgaWQgZm9yIE91dGxheWVyLmdldEZyb21FbGVtZW50XG4gIHZhciBpZCA9ICsrR1VJRDtcbiAgdGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRCA9IGlkOyAvLyBleHBhbmRvXG4gIGluc3RhbmNlc1sgaWQgXSA9IHRoaXM7IC8vIGFzc29jaWF0ZSB2aWEgaWRcblxuICAvLyBraWNrIGl0IG9mZlxuICB0aGlzLl9jcmVhdGUoKTtcblxuICBpZiAoIHRoaXMub3B0aW9ucy5pc0luaXRMYXlvdXQgKSB7XG4gICAgdGhpcy5sYXlvdXQoKTtcbiAgfVxufVxuXG4vLyBzZXR0aW5ncyBhcmUgZm9yIGludGVybmFsIHVzZSBvbmx5XG5PdXRsYXllci5uYW1lc3BhY2UgPSAnb3V0bGF5ZXInO1xuT3V0bGF5ZXIuSXRlbSA9IEl0ZW07XG5cbi8vIGRlZmF1bHQgb3B0aW9uc1xuT3V0bGF5ZXIuZGVmYXVsdHMgPSB7XG4gIGNvbnRhaW5lclN0eWxlOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgfSxcbiAgaXNJbml0TGF5b3V0OiB0cnVlLFxuICBpc09yaWdpbkxlZnQ6IHRydWUsXG4gIGlzT3JpZ2luVG9wOiB0cnVlLFxuICBpc1Jlc2l6ZUJvdW5kOiB0cnVlLFxuICBpc1Jlc2l6aW5nQ29udGFpbmVyOiB0cnVlLFxuICAvLyBpdGVtIG9wdGlvbnNcbiAgdHJhbnNpdGlvbkR1cmF0aW9uOiAnMC40cycsXG4gIGhpZGRlblN0eWxlOiB7XG4gICAgb3BhY2l0eTogMCxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjAwMSknXG4gIH0sXG4gIHZpc2libGVTdHlsZToge1xuICAgIG9wYWNpdHk6IDEsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknXG4gIH1cbn07XG5cbi8vIGluaGVyaXQgRXZlbnRFbWl0dGVyXG5leHRlbmQoIE91dGxheWVyLnByb3RvdHlwZSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSApO1xuXG4vKipcbiAqIHNldCBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICovXG5PdXRsYXllci5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24oIG9wdHMgKSB7XG4gIGV4dGVuZCggdGhpcy5vcHRpb25zLCBvcHRzICk7XG59O1xuXG5PdXRsYXllci5wcm90b3R5cGUuX2NyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBnZXQgaXRlbXMgZnJvbSBjaGlsZHJlblxuICB0aGlzLnJlbG9hZEl0ZW1zKCk7XG4gIC8vIGVsZW1lbnRzIHRoYXQgYWZmZWN0IGxheW91dCwgYnV0IGFyZSBub3QgbGFpZCBvdXRcbiAgdGhpcy5zdGFtcHMgPSBbXTtcbiAgdGhpcy5zdGFtcCggdGhpcy5vcHRpb25zLnN0YW1wICk7XG4gIC8vIHNldCBjb250YWluZXIgc3R5bGVcbiAgZXh0ZW5kKCB0aGlzLmVsZW1lbnQuc3R5bGUsIHRoaXMub3B0aW9ucy5jb250YWluZXJTdHlsZSApO1xuXG4gIC8vIGJpbmQgcmVzaXplIG1ldGhvZFxuICBpZiAoIHRoaXMub3B0aW9ucy5pc1Jlc2l6ZUJvdW5kICkge1xuICAgIHRoaXMuYmluZFJlc2l6ZSgpO1xuICB9XG59O1xuXG4vLyBnb2VzIHRocm91Z2ggYWxsIGNoaWxkcmVuIGFnYWluIGFuZCBnZXRzIGJyaWNrcyBpbiBwcm9wZXIgb3JkZXJcbk91dGxheWVyLnByb3RvdHlwZS5yZWxvYWRJdGVtcyA9IGZ1bmN0aW9uKCkge1xuICAvLyBjb2xsZWN0aW9uIG9mIGl0ZW0gZWxlbWVudHNcbiAgdGhpcy5pdGVtcyA9IHRoaXMuX2l0ZW1pemUoIHRoaXMuZWxlbWVudC5jaGlsZHJlbiApO1xufTtcblxuXG4vKipcbiAqIHR1cm4gZWxlbWVudHMgaW50byBPdXRsYXllci5JdGVtcyB0byBiZSB1c2VkIGluIGxheW91dFxuICogQHBhcmFtIHtBcnJheSBvciBOb2RlTGlzdCBvciBIVE1MRWxlbWVudH0gZWxlbXNcbiAqIEByZXR1cm5zIHtBcnJheX0gaXRlbXMgLSBjb2xsZWN0aW9uIG9mIG5ldyBPdXRsYXllciBJdGVtc1xuICovXG5PdXRsYXllci5wcm90b3R5cGUuX2l0ZW1pemUgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG5cbiAgdmFyIGl0ZW1FbGVtcyA9IHRoaXMuX2ZpbHRlckZpbmRJdGVtRWxlbWVudHMoIGVsZW1zICk7XG4gIHZhciBJdGVtID0gdGhpcy5jb25zdHJ1Y3Rvci5JdGVtO1xuXG4gIC8vIGNyZWF0ZSBuZXcgT3V0bGF5ZXIgSXRlbXMgZm9yIGNvbGxlY3Rpb25cbiAgdmFyIGl0ZW1zID0gW107XG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IGl0ZW1FbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgZWxlbSA9IGl0ZW1FbGVtc1tpXTtcbiAgICB2YXIgaXRlbSA9IG5ldyBJdGVtKCBlbGVtLCB0aGlzICk7XG4gICAgaXRlbXMucHVzaCggaXRlbSApO1xuICB9XG5cbiAgcmV0dXJuIGl0ZW1zO1xufTtcblxuLyoqXG4gKiBnZXQgaXRlbSBlbGVtZW50cyB0byBiZSB1c2VkIGluIGxheW91dFxuICogQHBhcmFtIHtBcnJheSBvciBOb2RlTGlzdCBvciBIVE1MRWxlbWVudH0gZWxlbXNcbiAqIEByZXR1cm5zIHtBcnJheX0gaXRlbXMgLSBpdGVtIGVsZW1lbnRzXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5fZmlsdGVyRmluZEl0ZW1FbGVtZW50cyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgLy8gbWFrZSBhcnJheSBvZiBlbGVtc1xuICBlbGVtcyA9IG1ha2VBcnJheSggZWxlbXMgKTtcbiAgdmFyIGl0ZW1TZWxlY3RvciA9IHRoaXMub3B0aW9ucy5pdGVtU2VsZWN0b3I7XG4gIHZhciBpdGVtRWxlbXMgPSBbXTtcblxuICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBlbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgZWxlbSA9IGVsZW1zW2ldO1xuICAgIC8vIGNoZWNrIHRoYXQgZWxlbSBpcyBhbiBhY3R1YWwgZWxlbWVudFxuICAgIGlmICggIWlzRWxlbWVudCggZWxlbSApICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIGZpbHRlciAmIGZpbmQgaXRlbXMgaWYgd2UgaGF2ZSBhbiBpdGVtIHNlbGVjdG9yXG4gICAgaWYgKCBpdGVtU2VsZWN0b3IgKSB7XG4gICAgICAvLyBmaWx0ZXIgc2libGluZ3NcbiAgICAgIGlmICggbWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBpdGVtU2VsZWN0b3IgKSApIHtcbiAgICAgICAgaXRlbUVsZW1zLnB1c2goIGVsZW0gKTtcbiAgICAgIH1cbiAgICAgIC8vIGZpbmQgY2hpbGRyZW5cbiAgICAgIHZhciBjaGlsZEVsZW1zID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCBpdGVtU2VsZWN0b3IgKTtcbiAgICAgIC8vIGNvbmNhdCBjaGlsZEVsZW1zIHRvIGZpbHRlckZvdW5kIGFycmF5XG4gICAgICBmb3IgKCB2YXIgaj0wLCBqTGVuID0gY2hpbGRFbGVtcy5sZW5ndGg7IGogPCBqTGVuOyBqKysgKSB7XG4gICAgICAgIGl0ZW1FbGVtcy5wdXNoKCBjaGlsZEVsZW1zW2pdICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZW1FbGVtcy5wdXNoKCBlbGVtICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZW1FbGVtcztcbn07XG5cbi8qKlxuICogZ2V0dGVyIG1ldGhvZCBmb3IgZ2V0dGluZyBpdGVtIGVsZW1lbnRzXG4gKiBAcmV0dXJucyB7QXJyYXl9IGVsZW1zIC0gY29sbGVjdGlvbiBvZiBpdGVtIGVsZW1lbnRzXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5nZXRJdGVtRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGVsZW1zID0gW107XG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IHRoaXMuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgZWxlbXMucHVzaCggdGhpcy5pdGVtc1tpXS5lbGVtZW50ICk7XG4gIH1cbiAgcmV0dXJuIGVsZW1zO1xufTtcblxuLy8gLS0tLS0gaW5pdCAmIGxheW91dCAtLS0tLSAvL1xuXG4vKipcbiAqIGxheXMgb3V0IGFsbCBpdGVtc1xuICovXG5PdXRsYXllci5wcm90b3R5cGUubGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3Jlc2V0TGF5b3V0KCk7XG4gIHRoaXMuX21hbmFnZVN0YW1wcygpO1xuXG4gIC8vIGRvbid0IGFuaW1hdGUgZmlyc3QgbGF5b3V0XG4gIHZhciBpc0luc3RhbnQgPSB0aGlzLm9wdGlvbnMuaXNMYXlvdXRJbnN0YW50ICE9PSB1bmRlZmluZWQgP1xuICAgIHRoaXMub3B0aW9ucy5pc0xheW91dEluc3RhbnQgOiAhdGhpcy5faXNMYXlvdXRJbml0ZWQ7XG4gIHRoaXMubGF5b3V0SXRlbXMoIHRoaXMuaXRlbXMsIGlzSW5zdGFudCApO1xuXG4gIC8vIGZsYWcgZm9yIGluaXRhbGl6ZWRcbiAgdGhpcy5faXNMYXlvdXRJbml0ZWQgPSB0cnVlO1xufTtcblxuLy8gX2luaXQgaXMgYWxpYXMgZm9yIGxheW91dFxuT3V0bGF5ZXIucHJvdG90eXBlLl9pbml0ID0gT3V0bGF5ZXIucHJvdG90eXBlLmxheW91dDtcblxuLyoqXG4gKiBsb2dpYyBiZWZvcmUgYW55IG5ldyBsYXlvdXRcbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLl9yZXNldExheW91dCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmdldFNpemUoKTtcbn07XG5cblxuT3V0bGF5ZXIucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zaXplID0gZ2V0U2l6ZSggdGhpcy5lbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIGdldCBtZWFzdXJlbWVudCBmcm9tIG9wdGlvbiwgZm9yIGNvbHVtbldpZHRoLCByb3dIZWlnaHQsIGd1dHRlclxuICogaWYgb3B0aW9uIGlzIFN0cmluZyAtPiBnZXQgZWxlbWVudCBmcm9tIHNlbGVjdG9yIHN0cmluZywgJiBnZXQgc2l6ZSBvZiBlbGVtZW50XG4gKiBpZiBvcHRpb24gaXMgRWxlbWVudCAtPiBnZXQgc2l6ZSBvZiBlbGVtZW50XG4gKiBlbHNlIHVzZSBvcHRpb24gYXMgYSBudW1iZXJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVhc3VyZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzaXplIC0gd2lkdGggb3IgaGVpZ2h0XG4gKiBAcHJpdmF0ZVxuICovXG5PdXRsYXllci5wcm90b3R5cGUuX2dldE1lYXN1cmVtZW50ID0gZnVuY3Rpb24oIG1lYXN1cmVtZW50LCBzaXplICkge1xuICB2YXIgb3B0aW9uID0gdGhpcy5vcHRpb25zWyBtZWFzdXJlbWVudCBdO1xuICB2YXIgZWxlbTtcbiAgaWYgKCAhb3B0aW9uICkge1xuICAgIC8vIGRlZmF1bHQgdG8gMFxuICAgIHRoaXNbIG1lYXN1cmVtZW50IF0gPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIHVzZSBvcHRpb24gYXMgYW4gZWxlbWVudFxuICAgIGlmICggdHlwZW9mIG9wdGlvbiA9PT0gJ3N0cmluZycgKSB7XG4gICAgICBlbGVtID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoIG9wdGlvbiApO1xuICAgIH0gZWxzZSBpZiAoIGlzRWxlbWVudCggb3B0aW9uICkgKSB7XG4gICAgICBlbGVtID0gb3B0aW9uO1xuICAgIH1cbiAgICAvLyB1c2Ugc2l6ZSBvZiBlbGVtZW50LCBpZiBlbGVtZW50XG4gICAgdGhpc1sgbWVhc3VyZW1lbnQgXSA9IGVsZW0gPyBnZXRTaXplKCBlbGVtIClbIHNpemUgXSA6IG9wdGlvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBsYXlvdXQgYSBjb2xsZWN0aW9uIG9mIGl0ZW0gZWxlbWVudHNcbiAqIEBhcGkgcHVibGljXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5sYXlvdXRJdGVtcyA9IGZ1bmN0aW9uKCBpdGVtcywgaXNJbnN0YW50ICkge1xuICBpdGVtcyA9IHRoaXMuX2dldEl0ZW1zRm9yTGF5b3V0KCBpdGVtcyApO1xuXG4gIHRoaXMuX2xheW91dEl0ZW1zKCBpdGVtcywgaXNJbnN0YW50ICk7XG5cbiAgdGhpcy5fcG9zdExheW91dCgpO1xufTtcblxuLyoqXG4gKiBnZXQgdGhlIGl0ZW1zIHRvIGJlIGxhaWQgb3V0XG4gKiB5b3UgbWF5IHdhbnQgdG8gc2tpcCBvdmVyIHNvbWUgaXRlbXNcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zXG4gKiBAcmV0dXJucyB7QXJyYXl9IGl0ZW1zXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5fZ2V0SXRlbXNGb3JMYXlvdXQgPSBmdW5jdGlvbiggaXRlbXMgKSB7XG4gIHZhciBsYXlvdXRJdGVtcyA9IFtdO1xuICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgIGlmICggIWl0ZW0uaXNJZ25vcmVkICkge1xuICAgICAgbGF5b3V0SXRlbXMucHVzaCggaXRlbSApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGF5b3V0SXRlbXM7XG59O1xuXG4vKipcbiAqIGxheW91dCBpdGVtc1xuICogQHBhcmFtIHtBcnJheX0gaXRlbXNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNJbnN0YW50XG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5fbGF5b3V0SXRlbXMgPSBmdW5jdGlvbiggaXRlbXMsIGlzSW5zdGFudCApIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgZnVuY3Rpb24gb25JdGVtc0xheW91dCgpIHtcbiAgICBfdGhpcy5lbWl0RXZlbnQoICdsYXlvdXRDb21wbGV0ZScsIFsgX3RoaXMsIGl0ZW1zIF0gKTtcbiAgfVxuXG4gIGlmICggIWl0ZW1zIHx8ICFpdGVtcy5sZW5ndGggKSB7XG4gICAgLy8gbm8gaXRlbXMsIGVtaXQgZXZlbnQgd2l0aCBlbXB0eSBhcnJheVxuICAgIG9uSXRlbXNMYXlvdXQoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBlbWl0IGxheW91dENvbXBsZXRlIHdoZW4gZG9uZVxuICB0aGlzLl9pdGVtc09uKCBpdGVtcywgJ2xheW91dCcsIG9uSXRlbXNMYXlvdXQgKTtcblxuICB2YXIgcXVldWUgPSBbXTtcblxuICBmb3IgKCB2YXIgaT0wLCBsZW4gPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgIC8vIGdldCB4L3kgb2JqZWN0IGZyb20gbWV0aG9kXG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5fZ2V0SXRlbUxheW91dFBvc2l0aW9uKCBpdGVtICk7XG4gICAgLy8gZW5xdWV1ZVxuICAgIHBvc2l0aW9uLml0ZW0gPSBpdGVtO1xuICAgIHBvc2l0aW9uLmlzSW5zdGFudCA9IGlzSW5zdGFudCB8fCBpdGVtLmlzTGF5b3V0SW5zdGFudDtcbiAgICBxdWV1ZS5wdXNoKCBwb3NpdGlvbiApO1xuICB9XG5cbiAgdGhpcy5fcHJvY2Vzc0xheW91dFF1ZXVlKCBxdWV1ZSApO1xufTtcblxuLyoqXG4gKiBnZXQgaXRlbSBsYXlvdXQgcG9zaXRpb25cbiAqIEBwYXJhbSB7T3V0bGF5ZXIuSXRlbX0gaXRlbVxuICogQHJldHVybnMge09iamVjdH0geCBhbmQgeSBwb3NpdGlvblxuICovXG5PdXRsYXllci5wcm90b3R5cGUuX2dldEl0ZW1MYXlvdXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCAvKiBpdGVtICovICkge1xuICByZXR1cm4ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xufTtcblxuLyoqXG4gKiBpdGVyYXRlIG92ZXIgYXJyYXkgYW5kIHBvc2l0aW9uIGVhY2ggaXRlbVxuICogUmVhc29uIGJlaW5nIC0gc2VwYXJhdGluZyB0aGlzIGxvZ2ljIHByZXZlbnRzICdsYXlvdXQgaW52YWxpZGF0aW9uJ1xuICogdGh4IEBwYXVsX2lyaXNoXG4gKiBAcGFyYW0ge0FycmF5fSBxdWV1ZVxuICovXG5PdXRsYXllci5wcm90b3R5cGUuX3Byb2Nlc3NMYXlvdXRRdWV1ZSA9IGZ1bmN0aW9uKCBxdWV1ZSApIHtcbiAgZm9yICggdmFyIGk9MCwgbGVuID0gcXVldWUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIG9iaiA9IHF1ZXVlW2ldO1xuICAgIHRoaXMuX3Bvc2l0aW9uSXRlbSggb2JqLml0ZW0sIG9iai54LCBvYmoueSwgb2JqLmlzSW5zdGFudCApO1xuICB9XG59O1xuXG4vKipcbiAqIFNldHMgcG9zaXRpb24gb2YgaXRlbSBpbiBET01cbiAqIEBwYXJhbSB7T3V0bGF5ZXIuSXRlbX0gaXRlbVxuICogQHBhcmFtIHtOdW1iZXJ9IHggLSBob3Jpem9udGFsIHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0geSAtIHZlcnRpY2FsIHBvc2l0aW9uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzSW5zdGFudCAtIGRpc2FibGVzIHRyYW5zaXRpb25zXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5fcG9zaXRpb25JdGVtID0gZnVuY3Rpb24oIGl0ZW0sIHgsIHksIGlzSW5zdGFudCApIHtcbiAgaWYgKCBpc0luc3RhbnQgKSB7XG4gICAgLy8gaWYgbm90IHRyYW5zaXRpb24sIGp1c3Qgc2V0IENTU1xuICAgIGl0ZW0uZ29UbyggeCwgeSApO1xuICB9IGVsc2Uge1xuICAgIGl0ZW0ubW92ZVRvKCB4LCB5ICk7XG4gIH1cbn07XG5cbi8qKlxuICogQW55IGxvZ2ljIHlvdSB3YW50IHRvIGRvIGFmdGVyIGVhY2ggbGF5b3V0LFxuICogaS5lLiBzaXplIHRoZSBjb250YWluZXJcbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLl9wb3N0TGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmVzaXplQ29udGFpbmVyKCk7XG59O1xuXG5PdXRsYXllci5wcm90b3R5cGUucmVzaXplQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMub3B0aW9ucy5pc1Jlc2l6aW5nQ29udGFpbmVyICkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgc2l6ZSA9IHRoaXMuX2dldENvbnRhaW5lclNpemUoKTtcbiAgaWYgKCBzaXplICkge1xuICAgIHRoaXMuX3NldENvbnRhaW5lck1lYXN1cmUoIHNpemUud2lkdGgsIHRydWUgKTtcbiAgICB0aGlzLl9zZXRDb250YWluZXJNZWFzdXJlKCBzaXplLmhlaWdodCwgZmFsc2UgKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZXRzIHdpZHRoIG9yIGhlaWdodCBvZiBjb250YWluZXIgaWYgcmV0dXJuZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IHNpemVcbiAqICAgQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gKiAgIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLl9nZXRDb250YWluZXJTaXplID0gbm9vcDtcblxuLyoqXG4gKiBAcGFyYW0ge051bWJlcn0gbWVhc3VyZSAtIHNpemUgb2Ygd2lkdGggb3IgaGVpZ2h0XG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzV2lkdGhcbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLl9zZXRDb250YWluZXJNZWFzdXJlID0gZnVuY3Rpb24oIG1lYXN1cmUsIGlzV2lkdGggKSB7XG4gIGlmICggbWVhc3VyZSA9PT0gdW5kZWZpbmVkICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBlbGVtU2l6ZSA9IHRoaXMuc2l6ZTtcbiAgLy8gYWRkIHBhZGRpbmcgYW5kIGJvcmRlciB3aWR0aCBpZiBib3JkZXIgYm94XG4gIGlmICggZWxlbVNpemUuaXNCb3JkZXJCb3ggKSB7XG4gICAgbWVhc3VyZSArPSBpc1dpZHRoID8gZWxlbVNpemUucGFkZGluZ0xlZnQgKyBlbGVtU2l6ZS5wYWRkaW5nUmlnaHQgK1xuICAgICAgZWxlbVNpemUuYm9yZGVyTGVmdFdpZHRoICsgZWxlbVNpemUuYm9yZGVyUmlnaHRXaWR0aCA6XG4gICAgICBlbGVtU2l6ZS5wYWRkaW5nQm90dG9tICsgZWxlbVNpemUucGFkZGluZ1RvcCArXG4gICAgICBlbGVtU2l6ZS5ib3JkZXJUb3BXaWR0aCArIGVsZW1TaXplLmJvcmRlckJvdHRvbVdpZHRoO1xuICB9XG5cbiAgbWVhc3VyZSA9IE1hdGgubWF4KCBtZWFzdXJlLCAwICk7XG4gIHRoaXMuZWxlbWVudC5zdHlsZVsgaXNXaWR0aCA/ICd3aWR0aCcgOiAnaGVpZ2h0JyBdID0gbWVhc3VyZSArICdweCc7XG59O1xuXG4vKipcbiAqIHRyaWdnZXIgYSBjYWxsYmFjayBmb3IgYSBjb2xsZWN0aW9uIG9mIGl0ZW1zIGV2ZW50c1xuICogQHBhcmFtIHtBcnJheX0gaXRlbXMgLSBPdXRsYXllci5JdGVtc1xuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLl9pdGVtc09uID0gZnVuY3Rpb24oIGl0ZW1zLCBldmVudE5hbWUsIGNhbGxiYWNrICkge1xuICB2YXIgZG9uZUNvdW50ID0gMDtcbiAgdmFyIGNvdW50ID0gaXRlbXMubGVuZ3RoO1xuICAvLyBldmVudCBjYWxsYmFja1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuICBmdW5jdGlvbiB0aWNrKCkge1xuICAgIGRvbmVDb3VudCsrO1xuICAgIGlmICggZG9uZUNvdW50ID09PSBjb3VudCApIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwoIF90aGlzICk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlOyAvLyBiaW5kIG9uY2VcbiAgfVxuICAvLyBiaW5kIGNhbGxiYWNrXG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgIHZhciBpdGVtID0gaXRlbXNbaV07XG4gICAgaXRlbS5vbiggZXZlbnROYW1lLCB0aWNrICk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGlnbm9yZSAmIHN0YW1wcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5cbi8qKlxuICoga2VlcCBpdGVtIGluIGNvbGxlY3Rpb24sIGJ1dCBkbyBub3QgbGF5IGl0IG91dFxuICogaWdub3JlZCBpdGVtcyBkbyBub3QgZ2V0IHNraXBwZWQgaW4gbGF5b3V0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLmlnbm9yZSA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSggZWxlbSApO1xuICBpZiAoIGl0ZW0gKSB7XG4gICAgaXRlbS5pc0lnbm9yZWQgPSB0cnVlO1xuICB9XG59O1xuXG4vKipcbiAqIHJldHVybiBpdGVtIHRvIGxheW91dCBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLnVuaWdub3JlID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIHZhciBpdGVtID0gdGhpcy5nZXRJdGVtKCBlbGVtICk7XG4gIGlmICggaXRlbSApIHtcbiAgICBkZWxldGUgaXRlbS5pc0lnbm9yZWQ7XG4gIH1cbn07XG5cbi8qKlxuICogYWRkcyBlbGVtZW50cyB0byBzdGFtcHNcbiAqIEBwYXJhbSB7Tm9kZUxpc3QsIEFycmF5LCBFbGVtZW50LCBvciBTdHJpbmd9IGVsZW1zXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5zdGFtcCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgZWxlbXMgPSB0aGlzLl9maW5kKCBlbGVtcyApO1xuICBpZiAoICFlbGVtcyApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLnN0YW1wcyA9IHRoaXMuc3RhbXBzLmNvbmNhdCggZWxlbXMgKTtcbiAgLy8gaWdub3JlXG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgIHZhciBlbGVtID0gZWxlbXNbaV07XG4gICAgdGhpcy5pZ25vcmUoIGVsZW0gKTtcbiAgfVxufTtcblxuLyoqXG4gKiByZW1vdmVzIGVsZW1lbnRzIHRvIHN0YW1wc1xuICogQHBhcmFtIHtOb2RlTGlzdCwgQXJyYXksIG9yIEVsZW1lbnR9IGVsZW1zXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS51bnN0YW1wID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICBlbGVtcyA9IHRoaXMuX2ZpbmQoIGVsZW1zICk7XG4gIGlmICggIWVsZW1zICl7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yICggdmFyIGk9MCwgbGVuID0gZWxlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIGVsZW0gPSBlbGVtc1tpXTtcbiAgICAvLyBmaWx0ZXIgb3V0IHJlbW92ZWQgc3RhbXAgZWxlbWVudHNcbiAgICByZW1vdmVGcm9tKCBlbGVtLCB0aGlzLnN0YW1wcyApO1xuICAgIHRoaXMudW5pZ25vcmUoIGVsZW0gKTtcbiAgfVxuXG59O1xuXG4vKipcbiAqIGZpbmRzIGNoaWxkIGVsZW1lbnRzXG4gKiBAcGFyYW0ge05vZGVMaXN0LCBBcnJheSwgRWxlbWVudCwgb3IgU3RyaW5nfSBlbGVtc1xuICogQHJldHVybnMge0FycmF5fSBlbGVtc1xuICovXG5PdXRsYXllci5wcm90b3R5cGUuX2ZpbmQgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIGlmICggIWVsZW1zICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBpZiBzdHJpbmcsIHVzZSBhcmd1bWVudCBhcyBzZWxlY3RvciBzdHJpbmdcbiAgaWYgKCB0eXBlb2YgZWxlbXMgPT09ICdzdHJpbmcnICkge1xuICAgIGVsZW1zID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGVsZW1zICk7XG4gIH1cbiAgZWxlbXMgPSBtYWtlQXJyYXkoIGVsZW1zICk7XG4gIHJldHVybiBlbGVtcztcbn07XG5cbk91dGxheWVyLnByb3RvdHlwZS5fbWFuYWdlU3RhbXBzID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMuc3RhbXBzIHx8ICF0aGlzLnN0YW1wcy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fZ2V0Qm91bmRpbmdSZWN0KCk7XG5cbiAgZm9yICggdmFyIGk9MCwgbGVuID0gdGhpcy5zdGFtcHMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIHN0YW1wID0gdGhpcy5zdGFtcHNbaV07XG4gICAgdGhpcy5fbWFuYWdlU3RhbXAoIHN0YW1wICk7XG4gIH1cbn07XG5cbi8vIHVwZGF0ZSBib3VuZGluZ0xlZnQgLyBUb3Bcbk91dGxheWVyLnByb3RvdHlwZS5fZ2V0Qm91bmRpbmdSZWN0ID0gZnVuY3Rpb24oKSB7XG4gIC8vIGdldCBib3VuZGluZyByZWN0IGZvciBjb250YWluZXIgZWxlbWVudFxuICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgdGhpcy5fYm91bmRpbmdSZWN0ID0ge1xuICAgIGxlZnQ6IGJvdW5kaW5nUmVjdC5sZWZ0ICsgc2l6ZS5wYWRkaW5nTGVmdCArIHNpemUuYm9yZGVyTGVmdFdpZHRoLFxuICAgIHRvcDogYm91bmRpbmdSZWN0LnRvcCArIHNpemUucGFkZGluZ1RvcCArIHNpemUuYm9yZGVyVG9wV2lkdGgsXG4gICAgcmlnaHQ6IGJvdW5kaW5nUmVjdC5yaWdodCAtICggc2l6ZS5wYWRkaW5nUmlnaHQgKyBzaXplLmJvcmRlclJpZ2h0V2lkdGggKSxcbiAgICBib3R0b206IGJvdW5kaW5nUmVjdC5ib3R0b20gLSAoIHNpemUucGFkZGluZ0JvdHRvbSArIHNpemUuYm9yZGVyQm90dG9tV2lkdGggKVxuICB9O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHN0YW1wXG4qKi9cbk91dGxheWVyLnByb3RvdHlwZS5fbWFuYWdlU3RhbXAgPSBub29wO1xuXG4vKipcbiAqIGdldCB4L3kgcG9zaXRpb24gb2YgZWxlbWVudCByZWxhdGl2ZSB0byBjb250YWluZXIgZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvZmZzZXQgLSBoYXMgbGVmdCwgdG9wLCByaWdodCwgYm90dG9tXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5fZ2V0RWxlbWVudE9mZnNldCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICB2YXIgYm91bmRpbmdSZWN0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHRoaXNSZWN0ID0gdGhpcy5fYm91bmRpbmdSZWN0O1xuICB2YXIgc2l6ZSA9IGdldFNpemUoIGVsZW0gKTtcbiAgdmFyIG9mZnNldCA9IHtcbiAgICBsZWZ0OiBib3VuZGluZ1JlY3QubGVmdCAtIHRoaXNSZWN0LmxlZnQgLSBzaXplLm1hcmdpbkxlZnQsXG4gICAgdG9wOiBib3VuZGluZ1JlY3QudG9wIC0gdGhpc1JlY3QudG9wIC0gc2l6ZS5tYXJnaW5Ub3AsXG4gICAgcmlnaHQ6IHRoaXNSZWN0LnJpZ2h0IC0gYm91bmRpbmdSZWN0LnJpZ2h0IC0gc2l6ZS5tYXJnaW5SaWdodCxcbiAgICBib3R0b206IHRoaXNSZWN0LmJvdHRvbSAtIGJvdW5kaW5nUmVjdC5ib3R0b20gLSBzaXplLm1hcmdpbkJvdHRvbVxuICB9O1xuICByZXR1cm4gb2Zmc2V0O1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gcmVzaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGVuYWJsZSBldmVudCBoYW5kbGVycyBmb3IgbGlzdGVuZXJzXG4vLyBpLmUuIHJlc2l6ZSAtPiBvbnJlc2l6ZVxuT3V0bGF5ZXIucHJvdG90eXBlLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB2YXIgbWV0aG9kID0gJ29uJyArIGV2ZW50LnR5cGU7XG4gIGlmICggdGhpc1sgbWV0aG9kIF0gKSB7XG4gICAgdGhpc1sgbWV0aG9kIF0oIGV2ZW50ICk7XG4gIH1cbn07XG5cbi8qKlxuICogQmluZCBsYXlvdXQgdG8gd2luZG93IHJlc2l6aW5nXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5iaW5kUmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIC8vIGJpbmQganVzdCBvbmUgbGlzdGVuZXJcbiAgaWYgKCB0aGlzLmlzUmVzaXplQm91bmQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGV2ZW50aWUuYmluZCggd2luZG93LCAncmVzaXplJywgdGhpcyApO1xuICB0aGlzLmlzUmVzaXplQm91bmQgPSB0cnVlO1xufTtcblxuLyoqXG4gKiBVbmJpbmQgbGF5b3V0IHRvIHdpbmRvdyByZXNpemluZ1xuICovXG5PdXRsYXllci5wcm90b3R5cGUudW5iaW5kUmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIGlmICggdGhpcy5pc1Jlc2l6ZUJvdW5kICkge1xuICAgIGV2ZW50aWUudW5iaW5kKCB3aW5kb3csICdyZXNpemUnLCB0aGlzICk7XG4gIH1cbiAgdGhpcy5pc1Jlc2l6ZUJvdW5kID0gZmFsc2U7XG59O1xuXG4vLyBvcmlnaW5hbCBkZWJvdW5jZSBieSBKb2huIEhhbm5cbi8vIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tL2luZGV4LnBocC8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuXG4vLyB0aGlzIGZpcmVzIGV2ZXJ5IHJlc2l6ZVxuT3V0bGF5ZXIucHJvdG90eXBlLm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIGlmICggdGhpcy5yZXNpemVUaW1lb3V0ICkge1xuICAgIGNsZWFyVGltZW91dCggdGhpcy5yZXNpemVUaW1lb3V0ICk7XG4gIH1cblxuICB2YXIgX3RoaXMgPSB0aGlzO1xuICBmdW5jdGlvbiBkZWxheWVkKCkge1xuICAgIF90aGlzLnJlc2l6ZSgpO1xuICAgIGRlbGV0ZSBfdGhpcy5yZXNpemVUaW1lb3V0O1xuICB9XG5cbiAgdGhpcy5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCggZGVsYXllZCwgMTAwICk7XG59O1xuXG4vLyBkZWJvdW5jZWQsIGxheW91dCBvbiByZXNpemVcbk91dGxheWVyLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgLy8gZG9uJ3QgdHJpZ2dlciBpZiBzaXplIGRpZCBub3QgY2hhbmdlXG4gIC8vIG9yIGlmIHJlc2l6ZSB3YXMgdW5ib3VuZC4gU2VlICM5XG4gIGlmICggIXRoaXMuaXNSZXNpemVCb3VuZCB8fCAhdGhpcy5uZWVkc1Jlc2l6ZUxheW91dCgpICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMubGF5b3V0KCk7XG59O1xuXG4vKipcbiAqIGNoZWNrIGlmIGxheW91dCBpcyBuZWVkZWQgcG9zdCBsYXlvdXRcbiAqIEByZXR1cm5zIEJvb2xlYW5cbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLm5lZWRzUmVzaXplTGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzaXplID0gZ2V0U2l6ZSggdGhpcy5lbGVtZW50ICk7XG4gIC8vIGNoZWNrIHRoYXQgdGhpcy5zaXplIGFuZCBzaXplIGFyZSB0aGVyZVxuICAvLyBJRTggdHJpZ2dlcnMgcmVzaXplIG9uIGJvZHkgc2l6ZSBjaGFuZ2UsIHNvIHRoZXkgbWlnaHQgbm90IGJlXG4gIHZhciBoYXNTaXplcyA9IHRoaXMuc2l6ZSAmJiBzaXplO1xuICByZXR1cm4gaGFzU2l6ZXMgJiYgc2l6ZS5pbm5lcldpZHRoICE9PSB0aGlzLnNpemUuaW5uZXJXaWR0aDtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG1ldGhvZHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLyoqXG4gKiBhZGQgaXRlbXMgdG8gT3V0bGF5ZXIgaW5zdGFuY2VcbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgRWxlbWVudH0gZWxlbXNcbiAqIEByZXR1cm5zIHtBcnJheX0gaXRlbXMgLSBPdXRsYXllci5JdGVtc1xuKiovXG5PdXRsYXllci5wcm90b3R5cGUuYWRkSXRlbXMgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHZhciBpdGVtcyA9IHRoaXMuX2l0ZW1pemUoIGVsZW1zICk7XG4gIC8vIGFkZCBpdGVtcyB0byBjb2xsZWN0aW9uXG4gIGlmICggaXRlbXMubGVuZ3RoICkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmNvbmNhdCggaXRlbXMgKTtcbiAgfVxuICByZXR1cm4gaXRlbXM7XG59O1xuXG4vKipcbiAqIExheW91dCBuZXdseS1hcHBlbmRlZCBpdGVtIGVsZW1lbnRzXG4gKiBAcGFyYW0ge0FycmF5IG9yIE5vZGVMaXN0IG9yIEVsZW1lbnR9IGVsZW1zXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5hcHBlbmRlZCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgdmFyIGl0ZW1zID0gdGhpcy5hZGRJdGVtcyggZWxlbXMgKTtcbiAgaWYgKCAhaXRlbXMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBsYXlvdXQgYW5kIHJldmVhbCBqdXN0IHRoZSBuZXcgaXRlbXNcbiAgdGhpcy5sYXlvdXRJdGVtcyggaXRlbXMsIHRydWUgKTtcbiAgdGhpcy5yZXZlYWwoIGl0ZW1zICk7XG59O1xuXG4vKipcbiAqIExheW91dCBwcmVwZW5kZWQgZWxlbWVudHNcbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgRWxlbWVudH0gZWxlbXNcbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLnByZXBlbmRlZCA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgdmFyIGl0ZW1zID0gdGhpcy5faXRlbWl6ZSggZWxlbXMgKTtcbiAgaWYgKCAhaXRlbXMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBhZGQgaXRlbXMgdG8gYmVnaW5uaW5nIG9mIGNvbGxlY3Rpb25cbiAgdmFyIHByZXZpb3VzSXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKDApO1xuICB0aGlzLml0ZW1zID0gaXRlbXMuY29uY2F0KCBwcmV2aW91c0l0ZW1zICk7XG4gIC8vIHN0YXJ0IG5ldyBsYXlvdXRcbiAgdGhpcy5fcmVzZXRMYXlvdXQoKTtcbiAgdGhpcy5fbWFuYWdlU3RhbXBzKCk7XG4gIC8vIGxheW91dCBuZXcgc3R1ZmYgd2l0aG91dCB0cmFuc2l0aW9uXG4gIHRoaXMubGF5b3V0SXRlbXMoIGl0ZW1zLCB0cnVlICk7XG4gIHRoaXMucmV2ZWFsKCBpdGVtcyApO1xuICAvLyBsYXlvdXQgcHJldmlvdXMgaXRlbXNcbiAgdGhpcy5sYXlvdXRJdGVtcyggcHJldmlvdXNJdGVtcyApO1xufTtcblxuLyoqXG4gKiByZXZlYWwgYSBjb2xsZWN0aW9uIG9mIGl0ZW1zXG4gKiBAcGFyYW0ge0FycmF5IG9mIE91dGxheWVyLkl0ZW1zfSBpdGVtc1xuICovXG5PdXRsYXllci5wcm90b3R5cGUucmV2ZWFsID0gZnVuY3Rpb24oIGl0ZW1zICkge1xuICB2YXIgbGVuID0gaXRlbXMgJiYgaXRlbXMubGVuZ3RoO1xuICBpZiAoICFsZW4gKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAoIHZhciBpPTA7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgIGl0ZW0ucmV2ZWFsKCk7XG4gIH1cbn07XG5cbi8qKlxuICogaGlkZSBhIGNvbGxlY3Rpb24gb2YgaXRlbXNcbiAqIEBwYXJhbSB7QXJyYXkgb2YgT3V0bGF5ZXIuSXRlbXN9IGl0ZW1zXG4gKi9cbk91dGxheWVyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oIGl0ZW1zICkge1xuICB2YXIgbGVuID0gaXRlbXMgJiYgaXRlbXMubGVuZ3RoO1xuICBpZiAoICFsZW4gKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAoIHZhciBpPTA7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgIGl0ZW0uaGlkZSgpO1xuICB9XG59O1xuXG4vKipcbiAqIGdldCBPdXRsYXllci5JdGVtLCBnaXZlbiBhbiBFbGVtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7T3V0bGF5ZXIuSXRlbX0gaXRlbVxuICovXG5PdXRsYXllci5wcm90b3R5cGUuZ2V0SXRlbSA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICAvLyBsb29wIHRocm91Z2ggaXRlbXMgdG8gZ2V0IHRoZSBvbmUgdGhhdCBtYXRjaGVzXG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IHRoaXMuaXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLml0ZW1zW2ldO1xuICAgIGlmICggaXRlbS5lbGVtZW50ID09PSBlbGVtICkge1xuICAgICAgLy8gcmV0dXJuIGl0ZW1cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBnZXQgY29sbGVjdGlvbiBvZiBPdXRsYXllci5JdGVtcywgZ2l2ZW4gRWxlbWVudHNcbiAqIEBwYXJhbSB7QXJyYXl9IGVsZW1zXG4gKiBAcmV0dXJucyB7QXJyYXl9IGl0ZW1zIC0gT3V0bGF5ZXIuSXRlbXNcbiAqL1xuT3V0bGF5ZXIucHJvdG90eXBlLmdldEl0ZW1zID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICBpZiAoICFlbGVtcyB8fCAhZWxlbXMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgaXRlbXMgPSBbXTtcbiAgZm9yICggdmFyIGk9MCwgbGVuID0gZWxlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIGVsZW0gPSBlbGVtc1tpXTtcbiAgICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSggZWxlbSApO1xuICAgIGlmICggaXRlbSApIHtcbiAgICAgIGl0ZW1zLnB1c2goIGl0ZW0gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXRlbXM7XG59O1xuXG4vKipcbiAqIHJlbW92ZSBlbGVtZW50KHMpIGZyb20gaW5zdGFuY2UgYW5kIERPTVxuICogQHBhcmFtIHtBcnJheSBvciBOb2RlTGlzdCBvciBFbGVtZW50fSBlbGVtc1xuICovXG5PdXRsYXllci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICBlbGVtcyA9IG1ha2VBcnJheSggZWxlbXMgKTtcblxuICB2YXIgcmVtb3ZlSXRlbXMgPSB0aGlzLmdldEl0ZW1zKCBlbGVtcyApO1xuICAvLyBiYWlsIGlmIG5vIGl0ZW1zIHRvIHJlbW92ZVxuICBpZiAoICFyZW1vdmVJdGVtcyB8fCAhcmVtb3ZlSXRlbXMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2l0ZW1zT24oIHJlbW92ZUl0ZW1zLCAncmVtb3ZlJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbWl0RXZlbnQoICdyZW1vdmVDb21wbGV0ZScsIFsgdGhpcywgcmVtb3ZlSXRlbXMgXSApO1xuICB9KTtcblxuICBmb3IgKCB2YXIgaT0wLCBsZW4gPSByZW1vdmVJdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcbiAgICB2YXIgaXRlbSA9IHJlbW92ZUl0ZW1zW2ldO1xuICAgIGl0ZW0ucmVtb3ZlKCk7XG4gICAgLy8gcmVtb3ZlIGl0ZW0gZnJvbSBjb2xsZWN0aW9uXG4gICAgcmVtb3ZlRnJvbSggaXRlbSwgdGhpcy5pdGVtcyApO1xuICB9XG59O1xuXG4vLyAtLS0tLSBkZXN0cm95IC0tLS0tIC8vXG5cbi8vIHJlbW92ZSBhbmQgZGlzYWJsZSBPdXRsYXllciBpbnN0YW5jZVxuT3V0bGF5ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgLy8gY2xlYW4gdXAgZHluYW1pYyBzdHlsZXNcbiAgdmFyIHN0eWxlID0gdGhpcy5lbGVtZW50LnN0eWxlO1xuICBzdHlsZS5oZWlnaHQgPSAnJztcbiAgc3R5bGUucG9zaXRpb24gPSAnJztcbiAgc3R5bGUud2lkdGggPSAnJztcbiAgLy8gZGVzdHJveSBpdGVtc1xuICBmb3IgKCB2YXIgaT0wLCBsZW4gPSB0aGlzLml0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcbiAgICBpdGVtLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHRoaXMudW5iaW5kUmVzaXplKCk7XG5cbiAgdmFyIGlkID0gdGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRDtcbiAgZGVsZXRlIGluc3RhbmNlc1sgaWQgXTsgLy8gcmVtb3ZlIHJlZmVyZW5jZSB0byBpbnN0YW5jZSBieSBpZFxuICBkZWxldGUgdGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRDtcbiAgLy8gcmVtb3ZlIGRhdGEgZm9yIGpRdWVyeVxuICBpZiAoIGpRdWVyeSApIHtcbiAgICBqUXVlcnkucmVtb3ZlRGF0YSggdGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLm5hbWVzcGFjZSApO1xuICB9XG5cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRhdGEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLyoqXG4gKiBnZXQgT3V0bGF5ZXIgaW5zdGFuY2UgZnJvbSBlbGVtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqIEByZXR1cm5zIHtPdXRsYXllcn1cbiAqL1xuT3V0bGF5ZXIuZGF0YSA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICB2YXIgaWQgPSBlbGVtICYmIGVsZW0ub3V0bGF5ZXJHVUlEO1xuICByZXR1cm4gaWQgJiYgaW5zdGFuY2VzWyBpZCBdO1xufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjcmVhdGUgT3V0bGF5ZXIgY2xhc3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLyoqXG4gKiBjcmVhdGUgYSBsYXlvdXQgY2xhc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqL1xuT3V0bGF5ZXIuY3JlYXRlID0gZnVuY3Rpb24oIG5hbWVzcGFjZSwgb3B0aW9ucyApIHtcbiAgLy8gc3ViLWNsYXNzIE91dGxheWVyXG4gIGZ1bmN0aW9uIExheW91dCgpIHtcbiAgICBPdXRsYXllci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gIH1cbiAgLy8gaW5oZXJpdCBPdXRsYXllciBwcm90b3R5cGUsIHVzZSBPYmplY3QuY3JlYXRlIGlmIHRoZXJlXG4gIGlmICggT2JqZWN0LmNyZWF0ZSApIHtcbiAgICBMYXlvdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggT3V0bGF5ZXIucHJvdG90eXBlICk7XG4gIH0gZWxzZSB7XG4gICAgZXh0ZW5kKCBMYXlvdXQucHJvdG90eXBlLCBPdXRsYXllci5wcm90b3R5cGUgKTtcbiAgfVxuICAvLyBzZXQgY29udHJ1Y3RvciwgdXNlZCBmb3IgbmFtZXNwYWNlIGFuZCBJdGVtXG4gIExheW91dC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMYXlvdXQ7XG5cbiAgTGF5b3V0LmRlZmF1bHRzID0gZXh0ZW5kKCB7fSwgT3V0bGF5ZXIuZGVmYXVsdHMgKTtcbiAgLy8gYXBwbHkgbmV3IG9wdGlvbnNcbiAgZXh0ZW5kKCBMYXlvdXQuZGVmYXVsdHMsIG9wdGlvbnMgKTtcbiAgLy8ga2VlcCBwcm90b3R5cGUuc2V0dGluZ3MgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IChQYWNrZXJ5IHYxLjIuMClcbiAgTGF5b3V0LnByb3RvdHlwZS5zZXR0aW5ncyA9IHt9O1xuXG4gIExheW91dC5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cbiAgTGF5b3V0LmRhdGEgPSBPdXRsYXllci5kYXRhO1xuXG4gIC8vIHN1Yi1jbGFzcyBJdGVtXG4gIExheW91dC5JdGVtID0gZnVuY3Rpb24gTGF5b3V0SXRlbSgpIHtcbiAgICBJdGVtLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgfTtcblxuICBMYXlvdXQuSXRlbS5wcm90b3R5cGUgPSBuZXcgSXRlbSgpO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRlY2xhcmF0aXZlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLyoqXG4gICAqIGFsbG93IHVzZXIgdG8gaW5pdGlhbGl6ZSBPdXRsYXllciB2aWEgLmpzLW5hbWVzcGFjZSBjbGFzc1xuICAgKiBvcHRpb25zIGFyZSBwYXJzZWQgZnJvbSBkYXRhLW5hbWVzcGFjZS1vcHRpb24gYXR0cmlidXRlXG4gICAqL1xuICBkb2NSZWFkeSggZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhc2hlZE5hbWVzcGFjZSA9IHRvRGFzaGVkKCBuYW1lc3BhY2UgKTtcbiAgICB2YXIgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmpzLScgKyBkYXNoZWROYW1lc3BhY2UgKTtcbiAgICB2YXIgZGF0YUF0dHIgPSAnZGF0YS0nICsgZGFzaGVkTmFtZXNwYWNlICsgJy1vcHRpb25zJztcblxuICAgIGZvciAoIHZhciBpPTAsIGxlbiA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgICAgdmFyIGVsZW0gPSBlbGVtc1tpXTtcbiAgICAgIHZhciBhdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoIGRhdGFBdHRyICk7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIHRyeSB7XG4gICAgICAgIG9wdGlvbnMgPSBhdHRyICYmIEpTT04ucGFyc2UoIGF0dHIgKTtcbiAgICAgIH0gY2F0Y2ggKCBlcnJvciApIHtcbiAgICAgICAgLy8gbG9nIGVycm9yLCBkbyBub3QgaW5pdGlhbGl6ZVxuICAgICAgICBpZiAoIGNvbnNvbGUgKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvciggJ0Vycm9yIHBhcnNpbmcgJyArIGRhdGFBdHRyICsgJyBvbiAnICtcbiAgICAgICAgICAgIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArICggZWxlbS5pZCA/ICcjJyArIGVsZW0uaWQgOiAnJyApICsgJzogJyArXG4gICAgICAgICAgICBlcnJvciApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8gaW5pdGlhbGl6ZVxuICAgICAgdmFyIGluc3RhbmNlID0gbmV3IExheW91dCggZWxlbSwgb3B0aW9ucyApO1xuICAgICAgLy8gbWFrZSBhdmFpbGFibGUgdmlhICQoKS5kYXRhKCdsYXlvdXRuYW1lJylcbiAgICAgIGlmICggalF1ZXJ5ICkge1xuICAgICAgICBqUXVlcnkuZGF0YSggZWxlbSwgbmFtZXNwYWNlLCBpbnN0YW5jZSApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0galF1ZXJ5IGJyaWRnZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gIC8vIG1ha2UgaW50byBqUXVlcnkgcGx1Z2luXG4gIGlmICggalF1ZXJ5ICYmIGpRdWVyeS5icmlkZ2V0ICkge1xuICAgIGpRdWVyeS5icmlkZ2V0KCBuYW1lc3BhY2UsIExheW91dCApO1xuICB9XG5cbiAgcmV0dXJuIExheW91dDtcbn07XG5cbi8vIC0tLS0tIGZpbiAtLS0tLSAvL1xuXG4vLyBiYWNrIGluIGdsb2JhbFxuT3V0bGF5ZXIuSXRlbSA9IEl0ZW07XG5cbnJldHVybiBPdXRsYXllcjtcblxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB0cmFuc3BvcnQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gIC8vIEFNRFxuICBkZWZpbmUoIFtcbiAgICAgICdldmVudGllL2V2ZW50aWUnLFxuICAgICAgJ2RvYy1yZWFkeS9kb2MtcmVhZHknLFxuICAgICAgJ2V2ZW50RW1pdHRlci9FdmVudEVtaXR0ZXInLFxuICAgICAgJ2dldC1zaXplL2dldC1zaXplJyxcbiAgICAgICdtYXRjaGVzLXNlbGVjdG9yL21hdGNoZXMtc2VsZWN0b3InLFxuICAgICAgJy4vaXRlbSdcbiAgICBdLFxuICAgIG91dGxheWVyRGVmaW5pdGlvbiApO1xufSBlbHNlIGlmICggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuICAvLyBDb21tb25KU1xuICBtb2R1bGUuZXhwb3J0cyA9IG91dGxheWVyRGVmaW5pdGlvbihcbiAgICByZXF1aXJlKCdldmVudGllJyksXG4gICAgcmVxdWlyZSgnZG9jLXJlYWR5JyksXG4gICAgcmVxdWlyZSgnd29sZnk4Ny1ldmVudGVtaXR0ZXInKSxcbiAgICByZXF1aXJlKCdnZXQtc2l6ZScpLFxuICAgIHJlcXVpcmUoJ2Rlc2FuZHJvLW1hdGNoZXMtc2VsZWN0b3InKSxcbiAgICByZXF1aXJlKCcuL2l0ZW0nKVxuICApO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93Lk91dGxheWVyID0gb3V0bGF5ZXJEZWZpbml0aW9uKFxuICAgIHdpbmRvdy5ldmVudGllLFxuICAgIHdpbmRvdy5kb2NSZWFkeSxcbiAgICB3aW5kb3cuRXZlbnRFbWl0dGVyLFxuICAgIHdpbmRvdy5nZXRTaXplLFxuICAgIHdpbmRvdy5tYXRjaGVzU2VsZWN0b3IsXG4gICAgd2luZG93Lk91dGxheWVyLkl0ZW1cbiAgKTtcbn1cblxufSkoIHdpbmRvdyApO1xuIiwiLyoqXG4gKiBSZWN0XG4gKiBsb3ctbGV2ZWwgdXRpbGl0eSBjbGFzcyBmb3IgYmFzaWMgZ2VvbWV0cnlcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3cgKSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQYWNrZXJ5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGdsb2JhbCBuYW1lc3BhY2VcbnZhciBQYWNrZXJ5ID0gd2luZG93LlBhY2tlcnkgPSBmdW5jdGlvbigpIHt9O1xuXG5mdW5jdGlvbiByZWN0RGVmaW5pdGlvbigpIHtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUmVjdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBSZWN0KCBwcm9wcyApIHtcbiAgLy8gZXh0ZW5kIHByb3BlcnRpZXMgZnJvbSBkZWZhdWx0c1xuICBmb3IgKCB2YXIgcHJvcCBpbiBSZWN0LmRlZmF1bHRzICkge1xuICAgIHRoaXNbIHByb3AgXSA9IFJlY3QuZGVmYXVsdHNbIHByb3AgXTtcbiAgfVxuXG4gIGZvciAoIHByb3AgaW4gcHJvcHMgKSB7XG4gICAgdGhpc1sgcHJvcCBdID0gcHJvcHNbIHByb3AgXTtcbiAgfVxuXG59XG5cbi8vIG1ha2UgYXZhaWxhYmxlXG5QYWNrZXJ5LlJlY3QgPSBSZWN0O1xuXG5SZWN0LmRlZmF1bHRzID0ge1xuICB4OiAwLFxuICB5OiAwLFxuICB3aWR0aDogMCxcbiAgaGVpZ2h0OiAwXG59O1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBvciBub3QgdGhpcyByZWN0YW5nbGUgd2hvbGx5IGVuY2xvc2VzIGFub3RoZXIgcmVjdGFuZ2xlIG9yIHBvaW50LlxuICogQHBhcmFtIHtSZWN0fSByZWN0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbioqL1xuUmVjdC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiggcmVjdCApIHtcbiAgLy8gcG9pbnRzIGRvbid0IGhhdmUgd2lkdGggb3IgaGVpZ2h0XG4gIHZhciBvdGhlcldpZHRoID0gcmVjdC53aWR0aCB8fCAwO1xuICB2YXIgb3RoZXJIZWlnaHQgPSByZWN0LmhlaWdodCB8fCAwO1xuICByZXR1cm4gdGhpcy54IDw9IHJlY3QueCAmJlxuICAgIHRoaXMueSA8PSByZWN0LnkgJiZcbiAgICB0aGlzLnggKyB0aGlzLndpZHRoID49IHJlY3QueCArIG90aGVyV2lkdGggJiZcbiAgICB0aGlzLnkgKyB0aGlzLmhlaWdodCA+PSByZWN0LnkgKyBvdGhlckhlaWdodDtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgcmVjdGFuZ2xlIGludGVyc2VjdHMgd2l0aCBhbm90aGVyLlxuICogQHBhcmFtIHtSZWN0fSByZWN0XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbioqL1xuUmVjdC5wcm90b3R5cGUub3ZlcmxhcHMgPSBmdW5jdGlvbiggcmVjdCApIHtcbiAgdmFyIHRoaXNSaWdodCA9IHRoaXMueCArIHRoaXMud2lkdGg7XG4gIHZhciB0aGlzQm90dG9tID0gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XG4gIHZhciByZWN0UmlnaHQgPSByZWN0LnggKyByZWN0LndpZHRoO1xuICB2YXIgcmVjdEJvdHRvbSA9IHJlY3QueSArIHJlY3QuaGVpZ2h0O1xuXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMwNjMzMlxuICByZXR1cm4gdGhpcy54IDwgcmVjdFJpZ2h0ICYmXG4gICAgdGhpc1JpZ2h0ID4gcmVjdC54ICYmXG4gICAgdGhpcy55IDwgcmVjdEJvdHRvbSAmJlxuICAgIHRoaXNCb3R0b20gPiByZWN0Lnk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7UmVjdH0gcmVjdCAtIHRoZSBvdmVybGFwcGluZyByZWN0XG4gKiBAcmV0dXJucyB7QXJyYXl9IGZyZWVSZWN0cyAtIHJlY3RzIHJlcHJlc2VudGluZyB0aGUgYXJlYSBhcm91bmQgdGhlIHJlY3RcbioqL1xuUmVjdC5wcm90b3R5cGUuZ2V0TWF4aW1hbEZyZWVSZWN0cyA9IGZ1bmN0aW9uKCByZWN0ICkge1xuXG4gIC8vIGlmIG5vIGludGVyc2VjdGlvbiwgcmV0dXJuIGZhbHNlXG4gIGlmICggIXRoaXMub3ZlcmxhcHMoIHJlY3QgKSApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgZnJlZVJlY3RzID0gW107XG4gIHZhciBmcmVlUmVjdDtcblxuICB2YXIgdGhpc1JpZ2h0ID0gdGhpcy54ICsgdGhpcy53aWR0aDtcbiAgdmFyIHRoaXNCb3R0b20gPSB0aGlzLnkgKyB0aGlzLmhlaWdodDtcbiAgdmFyIHJlY3RSaWdodCA9IHJlY3QueCArIHJlY3Qud2lkdGg7XG4gIHZhciByZWN0Qm90dG9tID0gcmVjdC55ICsgcmVjdC5oZWlnaHQ7XG5cbiAgLy8gdG9wXG4gIGlmICggdGhpcy55IDwgcmVjdC55ICkge1xuICAgIGZyZWVSZWN0ID0gbmV3IFJlY3Qoe1xuICAgICAgeDogdGhpcy54LFxuICAgICAgeTogdGhpcy55LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHJlY3QueSAtIHRoaXMueVxuICAgIH0pO1xuICAgIGZyZWVSZWN0cy5wdXNoKCBmcmVlUmVjdCApO1xuICB9XG5cbiAgLy8gcmlnaHRcbiAgaWYgKCB0aGlzUmlnaHQgPiByZWN0UmlnaHQgKSB7XG4gICAgZnJlZVJlY3QgPSBuZXcgUmVjdCh7XG4gICAgICB4OiByZWN0UmlnaHQsXG4gICAgICB5OiB0aGlzLnksXG4gICAgICB3aWR0aDogdGhpc1JpZ2h0IC0gcmVjdFJpZ2h0LFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxuICAgIH0pO1xuICAgIGZyZWVSZWN0cy5wdXNoKCBmcmVlUmVjdCApO1xuICB9XG5cbiAgLy8gYm90dG9tXG4gIGlmICggdGhpc0JvdHRvbSA+IHJlY3RCb3R0b20gKSB7XG4gICAgZnJlZVJlY3QgPSBuZXcgUmVjdCh7XG4gICAgICB4OiB0aGlzLngsXG4gICAgICB5OiByZWN0Qm90dG9tLFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXNCb3R0b20gLSByZWN0Qm90dG9tXG4gICAgfSk7XG4gICAgZnJlZVJlY3RzLnB1c2goIGZyZWVSZWN0ICk7XG4gIH1cblxuICAvLyBsZWZ0XG4gIGlmICggdGhpcy54IDwgcmVjdC54ICkge1xuICAgIGZyZWVSZWN0ID0gbmV3IFJlY3Qoe1xuICAgICAgeDogdGhpcy54LFxuICAgICAgeTogdGhpcy55LFxuICAgICAgd2lkdGg6IHJlY3QueCAtIHRoaXMueCxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHRcbiAgICB9KTtcbiAgICBmcmVlUmVjdHMucHVzaCggZnJlZVJlY3QgKTtcbiAgfVxuXG4gIHJldHVybiBmcmVlUmVjdHM7XG59O1xuXG5SZWN0LnByb3RvdHlwZS5jYW5GaXQgPSBmdW5jdGlvbiggcmVjdCApIHtcbiAgcmV0dXJuIHRoaXMud2lkdGggPj0gcmVjdC53aWR0aCAmJiB0aGlzLmhlaWdodCA+PSByZWN0LmhlaWdodDtcbn07XG5cbnJldHVybiBSZWN0O1xuXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHRyYW5zcG9ydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgLy8gQU1EXG4gIGRlZmluZSggcmVjdERlZmluaXRpb24gKTtcbn0gZWxzZSB7XG4gIC8vIGJyb3dzZXIgZ2xvYmFsXG4gIHdpbmRvdy5QYWNrZXJ5ID0gd2luZG93LlBhY2tlcnkgfHwge307XG4gIHdpbmRvdy5QYWNrZXJ5LlJlY3QgPSByZWN0RGVmaW5pdGlvbigpO1xufVxuXG59KSggd2luZG93ICk7XG4iLCIvKipcbiAqIFBhY2tlclxuICogYmluLXBhY2tpbmcgYWxnb3JpdGhtXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93ICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBhY2tlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBwYWNrZXJEZWZpbml0aW9uKCBSZWN0ICkge1xuXG4vKipcbiAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICogQHBhcmFtIHtTdHJpbmd9IHNvcnREaXJlY3Rpb25cbiAqICAgdG9wTGVmdCBmb3IgdmVydGljYWwsIGxlZnRUb3AgZm9yIGhvcml6b250YWxcbiAqL1xuZnVuY3Rpb24gUGFja2VyKCB3aWR0aCwgaGVpZ2h0LCBzb3J0RGlyZWN0aW9uICkge1xuICB0aGlzLndpZHRoID0gd2lkdGggfHwgMDtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgMDtcbiAgdGhpcy5zb3J0RGlyZWN0aW9uID0gc29ydERpcmVjdGlvbiB8fCAnZG93bndhcmRMZWZ0VG9SaWdodCc7XG5cbiAgdGhpcy5yZXNldCgpO1xufVxuXG5QYWNrZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VzID0gW107XG4gIHRoaXMubmV3U3BhY2VzID0gW107XG5cbiAgdmFyIGluaXRpYWxTcGFjZSA9IG5ldyBSZWN0KHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxuICB9KTtcblxuICB0aGlzLnNwYWNlcy5wdXNoKCBpbml0aWFsU3BhY2UgKTtcbiAgLy8gc2V0IHNvcnRlclxuICB0aGlzLnNvcnRlciA9IHNvcnRlcnNbIHRoaXMuc29ydERpcmVjdGlvbiBdIHx8IHNvcnRlcnMuZG93bndhcmRMZWZ0VG9SaWdodDtcbn07XG5cbi8vIGNoYW5nZSB4IGFuZCB5IG9mIHJlY3QgdG8gZml0IHdpdGggaW4gUGFja2VyJ3MgYXZhaWxhYmxlIHNwYWNlc1xuUGFja2VyLnByb3RvdHlwZS5wYWNrID0gZnVuY3Rpb24oIHJlY3QgKSB7XG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IHRoaXMuc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgIHZhciBzcGFjZSA9IHRoaXMuc3BhY2VzW2ldO1xuICAgIGlmICggc3BhY2UuY2FuRml0KCByZWN0ICkgKSB7XG4gICAgICB0aGlzLnBsYWNlSW5TcGFjZSggcmVjdCwgc3BhY2UgKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufTtcblxuUGFja2VyLnByb3RvdHlwZS5wbGFjZUluU3BhY2UgPSBmdW5jdGlvbiggcmVjdCwgc3BhY2UgKSB7XG4gIC8vIHBsYWNlIHJlY3QgaW4gc3BhY2VcbiAgcmVjdC54ID0gc3BhY2UueDtcbiAgcmVjdC55ID0gc3BhY2UueTtcblxuICB0aGlzLnBsYWNlZCggcmVjdCApO1xufTtcblxuLy8gdXBkYXRlIHNwYWNlcyB3aXRoIHBsYWNlZCByZWN0XG5QYWNrZXIucHJvdG90eXBlLnBsYWNlZCA9IGZ1bmN0aW9uKCByZWN0ICkge1xuICAvLyB1cGRhdGUgc3BhY2VzXG4gIHZhciByZXZpc2VkU3BhY2VzID0gW107XG4gIGZvciAoIHZhciBpPTAsIGxlbiA9IHRoaXMuc3BhY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgIHZhciBzcGFjZSA9IHRoaXMuc3BhY2VzW2ldO1xuICAgIHZhciBuZXdTcGFjZXMgPSBzcGFjZS5nZXRNYXhpbWFsRnJlZVJlY3RzKCByZWN0ICk7XG4gICAgLy8gYWRkIGVpdGhlciB0aGUgb3JpZ2luYWwgc3BhY2Ugb3IgdGhlIG5ldyBzcGFjZXMgdG8gdGhlIHJldmlzZWQgc3BhY2VzXG4gICAgaWYgKCBuZXdTcGFjZXMgKSB7XG4gICAgICByZXZpc2VkU3BhY2VzLnB1c2guYXBwbHkoIHJldmlzZWRTcGFjZXMsIG5ld1NwYWNlcyApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXZpc2VkU3BhY2VzLnB1c2goIHNwYWNlICk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5zcGFjZXMgPSByZXZpc2VkU3BhY2VzO1xuXG4gIC8vIHJlbW92ZSByZWR1bmRhbnQgc3BhY2VzXG4gIFBhY2tlci5tZXJnZVJlY3RzKCB0aGlzLnNwYWNlcyApO1xuXG4gIHRoaXMuc3BhY2VzLnNvcnQoIHRoaXMuc29ydGVyICk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB1dGlsaXR5IGZ1bmN0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vKipcbiAqIFJlbW92ZSByZWR1bmRhbnQgcmVjdGFuZ2xlIGZyb20gYXJyYXkgb2YgcmVjdGFuZ2xlc1xuICogQHBhcmFtIHtBcnJheX0gcmVjdHM6IGFuIGFycmF5IG9mIFJlY3RzXG4gKiBAcmV0dXJucyB7QXJyYXl9IHJlY3RzOiBhbiBhcnJheSBvZiBSZWN0c1xuKiovXG5QYWNrZXIubWVyZ2VSZWN0cyA9IGZ1bmN0aW9uKCByZWN0cyApIHtcbiAgZm9yICggdmFyIGk9MCwgbGVuID0gcmVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIHJlY3QgPSByZWN0c1tpXTtcbiAgICAvLyBza2lwIG92ZXIgdGhpcyByZWN0IGlmIGl0IHdhcyBhbHJlYWR5IHJlbW92ZWRcbiAgICBpZiAoICFyZWN0ICkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vIGNsb25lIHJlY3RzIHdlJ3JlIHRlc3RpbmcsIHJlbW92ZSB0aGlzIHJlY3RcbiAgICB2YXIgY29tcGFyZVJlY3RzID0gcmVjdHMuc2xpY2UoMCk7XG4gICAgLy8gZG8gbm90IGNvbXBhcmUgd2l0aCBzZWxmXG4gICAgY29tcGFyZVJlY3RzLnNwbGljZSggaSwgMSApO1xuICAgIC8vIGNvbXBhcmUgdGhpcyByZWN0IHdpdGggb3RoZXJzXG4gICAgdmFyIHJlbW92ZWRDb3VudCA9IDA7XG4gICAgZm9yICggdmFyIGo9MCwgakxlbiA9IGNvbXBhcmVSZWN0cy5sZW5ndGg7IGogPCBqTGVuOyBqKysgKSB7XG4gICAgICB2YXIgY29tcGFyZVJlY3QgPSBjb21wYXJlUmVjdHNbal07XG4gICAgICAvLyBpZiB0aGlzIHJlY3QgY29udGFpbnMgYW5vdGhlcixcbiAgICAgIC8vIHJlbW92ZSB0aGF0IHJlY3QgZnJvbSB0ZXN0IGNvbGxlY3Rpb25cbiAgICAgIHZhciBpbmRleEFkanVzdCA9IGkgPiBqID8gMCA6IDE7XG4gICAgICBpZiAoIHJlY3QuY29udGFpbnMoIGNvbXBhcmVSZWN0ICkgKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnY3VycmVudCB0ZXN0IHJlY3RzOicgKyB0ZXN0UmVjdHMubGVuZ3RoLCB0ZXN0UmVjdHMgKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coIGksIGosIGluZGV4QWRqdXN0LCByZWN0LCBjb21wYXJlUmVjdCApO1xuICAgICAgICByZWN0cy5zcGxpY2UoIGogKyBpbmRleEFkanVzdCAtIHJlbW92ZWRDb3VudCwgMSApO1xuICAgICAgICByZW1vdmVkQ291bnQrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVjdHM7XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHNvcnRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZnVuY3Rpb25zIGZvciBzb3J0aW5nIHJlY3RzIGluIG9yZGVyXG52YXIgc29ydGVycyA9IHtcbiAgLy8gdG9wIGRvd24sIHRoZW4gbGVmdCB0byByaWdodFxuICBkb3dud2FyZExlZnRUb1JpZ2h0OiBmdW5jdGlvbiggYSwgYiApIHtcbiAgICByZXR1cm4gYS55IC0gYi55IHx8IGEueCAtIGIueDtcbiAgfSxcbiAgLy8gbGVmdCB0byByaWdodCwgdGhlbiB0b3AgZG93blxuICByaWdodHdhcmRUb3BUb0JvdHRvbTogZnVuY3Rpb24oIGEsIGIgKSB7XG4gICAgcmV0dXJuIGEueCAtIGIueCB8fCBhLnkgLSBiLnk7XG4gIH1cbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnJldHVybiBQYWNrZXI7XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gdHJhbnNwb3J0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbmlmICggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAvLyBBTURcbiAgZGVmaW5lKCBbICcuL3JlY3QnIF0sIHBhY2tlckRlZmluaXRpb24gKTtcbn0gZWxzZSB7XG4gIC8vIGJyb3dzZXIgZ2xvYmFsXG4gIHZhciBQYWNrZXJ5ID0gd2luZG93LlBhY2tlcnkgPSB3aW5kb3cuUGFja2VyeSB8fCB7fTtcbiAgUGFja2VyeS5QYWNrZXIgPSBwYWNrZXJEZWZpbml0aW9uKCBQYWNrZXJ5LlJlY3QgKTtcbn1cblxufSkoIHdpbmRvdyApO1xuIiwiLyohXG4gKiBQYWNrZXJ5IHYxLjIuNFxuICogYmluLXBhY2tpbmcgbGF5b3V0IGxpYnJhcnlcbiAqIGh0dHA6Ly9wYWNrZXJ5Lm1ldGFmaXp6eS5jb1xuICpcbiAqIENvbW1lcmNpYWwgdXNlIHJlcXVpcmVzIG9uZS10aW1lIHB1cmNoYXNlIG9mIGEgY29tbWVyY2lhbCBsaWNlbnNlXG4gKiBodHRwOi8vcGFja2VyeS5tZXRhZml6enkuY28vbGljZW5zZS5odG1sXG4gKlxuICogTm9uLWNvbW1lcmNpYWwgdXNlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBHUEwgdjMgTGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAyMDE0IE1ldGFmaXp6eVxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQYWNrZXJ5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIHVzZWQgZm9yIEFNRCBkZWZpbml0aW9uIGFuZCByZXF1aXJlc1xuZnVuY3Rpb24gcGFja2VyeURlZmluaXRpb24oIGNsYXNzaWUsIGdldFNpemUsIE91dGxheWVyLCBSZWN0LCBQYWNrZXIsIEl0ZW0gKSB7XG5cbi8vIGNyZWF0ZSBhbiBPdXRsYXllciBsYXlvdXQgY2xhc3NcbnZhciBQYWNrZXJ5ID0gT3V0bGF5ZXIuY3JlYXRlKCdwYWNrZXJ5Jyk7XG5QYWNrZXJ5Lkl0ZW0gPSBJdGVtO1xuXG5QYWNrZXJ5LnByb3RvdHlwZS5fY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIC8vIGNhbGwgc3VwZXJcbiAgT3V0bGF5ZXIucHJvdG90eXBlLl9jcmVhdGUuY2FsbCggdGhpcyApO1xuXG4gIC8vIGluaXRpYWwgcHJvcGVydGllc1xuICB0aGlzLnBhY2tlciA9IG5ldyBQYWNrZXIoKTtcblxuICAvLyBMZWZ0IG92ZXIgZnJvbSB2MS4wXG4gIHRoaXMuc3RhbXAoIHRoaXMub3B0aW9ucy5zdGFtcGVkICk7XG5cbiAgLy8gY3JlYXRlIGRyYWcgaGFuZGxlcnNcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdGhpcy5oYW5kbGVEcmFnZ2FiaWxseSA9IHtcbiAgICBkcmFnU3RhcnQ6IGZ1bmN0aW9uKCBkcmFnZ2llICkge1xuICAgICAgX3RoaXMuaXRlbURyYWdTdGFydCggZHJhZ2dpZS5lbGVtZW50ICk7XG4gICAgfSxcbiAgICBkcmFnTW92ZTogZnVuY3Rpb24oIGRyYWdnaWUgKSB7XG4gICAgICBfdGhpcy5pdGVtRHJhZ01vdmUoIGRyYWdnaWUuZWxlbWVudCwgZHJhZ2dpZS5wb3NpdGlvbi54LCBkcmFnZ2llLnBvc2l0aW9uLnkgKTtcbiAgICB9LFxuICAgIGRyYWdFbmQ6IGZ1bmN0aW9uKCBkcmFnZ2llICkge1xuICAgICAgX3RoaXMuaXRlbURyYWdFbmQoIGRyYWdnaWUuZWxlbWVudCApO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLmhhbmRsZVVJRHJhZ2dhYmxlID0ge1xuICAgIHN0YXJ0OiBmdW5jdGlvbiBoYW5kbGVVSURyYWdnYWJsZVN0YXJ0KCBldmVudCApIHtcbiAgICAgIF90aGlzLml0ZW1EcmFnU3RhcnQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKTtcbiAgICB9LFxuICAgIGRyYWc6IGZ1bmN0aW9uIGhhbmRsZVVJRHJhZ2dhYmxlRHJhZyggZXZlbnQsIHVpICkge1xuICAgICAgX3RoaXMuaXRlbURyYWdNb3ZlKCBldmVudC5jdXJyZW50VGFyZ2V0LCB1aS5wb3NpdGlvbi5sZWZ0LCB1aS5wb3NpdGlvbi50b3AgKTtcbiAgICB9LFxuICAgIHN0b3A6IGZ1bmN0aW9uIGhhbmRsZVVJRHJhZ2dhYmxlU3RvcCggZXZlbnQgKSB7XG4gICAgICBfdGhpcy5pdGVtRHJhZ0VuZCggZXZlbnQuY3VycmVudFRhcmdldCApO1xuICAgIH1cbiAgfTtcblxufTtcblxuXG4vLyAtLS0tLSBpbml0ICYgbGF5b3V0IC0tLS0tIC8vXG5cbi8qKlxuICogbG9naWMgYmVmb3JlIGFueSBuZXcgbGF5b3V0XG4gKi9cblBhY2tlcnkucHJvdG90eXBlLl9yZXNldExheW91dCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmdldFNpemUoKTtcblxuICB0aGlzLl9nZXRNZWFzdXJlbWVudHMoKTtcblxuICAvLyByZXNldCBwYWNrZXJcbiAgdmFyIHBhY2tlciA9IHRoaXMucGFja2VyO1xuICAvLyBwYWNrZXIgc2V0dGluZ3MsIGlmIGhvcml6b250YWwgb3IgdmVydGljYWxcbiAgaWYgKCB0aGlzLm9wdGlvbnMuaXNIb3Jpem9udGFsICkge1xuICAgIHBhY2tlci53aWR0aCA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBwYWNrZXIuaGVpZ2h0ID0gdGhpcy5zaXplLmlubmVySGVpZ2h0ICsgdGhpcy5ndXR0ZXI7XG4gICAgcGFja2VyLnNvcnREaXJlY3Rpb24gPSAncmlnaHR3YXJkVG9wVG9Cb3R0b20nO1xuICB9IGVsc2Uge1xuICAgIHBhY2tlci53aWR0aCA9IHRoaXMuc2l6ZS5pbm5lcldpZHRoICsgdGhpcy5ndXR0ZXI7XG4gICAgcGFja2VyLmhlaWdodCA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBwYWNrZXIuc29ydERpcmVjdGlvbiA9ICdkb3dud2FyZExlZnRUb1JpZ2h0JztcbiAgfVxuXG4gIHBhY2tlci5yZXNldCgpO1xuXG4gIC8vIGxheW91dFxuICB0aGlzLm1heFkgPSAwO1xuICB0aGlzLm1heFggPSAwO1xufTtcblxuLyoqXG4gKiB1cGRhdGUgY29sdW1uV2lkdGgsIHJvd0hlaWdodCwgJiBndXR0ZXJcbiAqIEBwcml2YXRlXG4gKi9cblBhY2tlcnkucHJvdG90eXBlLl9nZXRNZWFzdXJlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fZ2V0TWVhc3VyZW1lbnQoICdjb2x1bW5XaWR0aCcsICd3aWR0aCcgKTtcbiAgdGhpcy5fZ2V0TWVhc3VyZW1lbnQoICdyb3dIZWlnaHQnLCAnaGVpZ2h0JyApO1xuICB0aGlzLl9nZXRNZWFzdXJlbWVudCggJ2d1dHRlcicsICd3aWR0aCcgKTtcbn07XG5cblBhY2tlcnkucHJvdG90eXBlLl9nZXRJdGVtTGF5b3V0UG9zaXRpb24gPSBmdW5jdGlvbiggaXRlbSApIHtcbiAgdGhpcy5fcGFja0l0ZW0oIGl0ZW0gKTtcbiAgcmV0dXJuIGl0ZW0ucmVjdDtcbn07XG5cblxuLyoqXG4gKiBsYXlvdXQgaXRlbSBpbiBwYWNrZXJcbiAqIEBwYXJhbSB7UGFja2VyeS5JdGVtfSBpdGVtXG4gKi9cblBhY2tlcnkucHJvdG90eXBlLl9wYWNrSXRlbSA9IGZ1bmN0aW9uKCBpdGVtICkge1xuICB0aGlzLl9zZXRSZWN0U2l6ZSggaXRlbS5lbGVtZW50LCBpdGVtLnJlY3QgKTtcbiAgLy8gcGFjayB0aGUgcmVjdCBpbiB0aGUgcGFja2VyXG4gIHRoaXMucGFja2VyLnBhY2soIGl0ZW0ucmVjdCApO1xuICB0aGlzLl9zZXRNYXhYWSggaXRlbS5yZWN0ICk7XG59O1xuXG4vKipcbiAqIHNldCBtYXggWCBhbmQgWSB2YWx1ZSwgZm9yIHNpemUgb2YgY29udGFpbmVyXG4gKiBAcGFyYW0ge1BhY2tlcnkuUmVjdH0gcmVjdFxuICogQHByaXZhdGVcbiAqL1xuUGFja2VyeS5wcm90b3R5cGUuX3NldE1heFhZID0gZnVuY3Rpb24oIHJlY3QgKSB7XG4gIHRoaXMubWF4WCA9IE1hdGgubWF4KCByZWN0LnggKyByZWN0LndpZHRoLCB0aGlzLm1heFggKTtcbiAgdGhpcy5tYXhZID0gTWF0aC5tYXgoIHJlY3QueSArIHJlY3QuaGVpZ2h0LCB0aGlzLm1heFkgKTtcbn07XG5cbi8qKlxuICogc2V0IHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIGEgcmVjdCwgYXBwbHlpbmcgY29sdW1uV2lkdGggYW5kIHJvd0hlaWdodFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcGFyYW0ge1BhY2tlcnkuUmVjdH0gcmVjdFxuICovXG5QYWNrZXJ5LnByb3RvdHlwZS5fc2V0UmVjdFNpemUgPSBmdW5jdGlvbiggZWxlbSwgcmVjdCApIHtcbiAgdmFyIHNpemUgPSBnZXRTaXplKCBlbGVtICk7XG4gIHZhciB3ID0gc2l6ZS5vdXRlcldpZHRoO1xuICB2YXIgaCA9IHNpemUub3V0ZXJIZWlnaHQ7XG4gIC8vIHNpemUgZm9yIGNvbHVtbldpZHRoIGFuZCByb3dIZWlnaHQsIGlmIGF2YWlsYWJsZVxuICAvLyBvbmx5IGNoZWNrIGlmIHNpemUgaXMgbm9uLXplcm8sICMxNzdcbiAgaWYgKCB3IHx8IGggKSB7XG4gICAgdmFyIGNvbFcgPSB0aGlzLmNvbHVtbldpZHRoICsgdGhpcy5ndXR0ZXI7XG4gICAgdmFyIHJvd0ggPSB0aGlzLnJvd0hlaWdodCArIHRoaXMuZ3V0dGVyO1xuICAgIHcgPSB0aGlzLmNvbHVtbldpZHRoID8gTWF0aC5jZWlsKCB3IC8gY29sVyApICogY29sVyA6IHcgKyB0aGlzLmd1dHRlcjtcbiAgICBoID0gdGhpcy5yb3dIZWlnaHQgPyBNYXRoLmNlaWwoIGggLyByb3dIICkgKiByb3dIIDogaCArIHRoaXMuZ3V0dGVyO1xuICB9XG4gIC8vIHJlY3QgbXVzdCBmaXQgaW4gcGFja2VyXG4gIHJlY3Qud2lkdGggPSBNYXRoLm1pbiggdywgdGhpcy5wYWNrZXIud2lkdGggKTtcbiAgcmVjdC5oZWlnaHQgPSBNYXRoLm1pbiggaCwgdGhpcy5wYWNrZXIuaGVpZ2h0ICk7XG59O1xuXG5QYWNrZXJ5LnByb3RvdHlwZS5fZ2V0Q29udGFpbmVyU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIHRoaXMub3B0aW9ucy5pc0hvcml6b250YWwgKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiB0aGlzLm1heFggLSB0aGlzLmd1dHRlclxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogdGhpcy5tYXhZIC0gdGhpcy5ndXR0ZXJcbiAgICB9O1xuICB9XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHN0YW1wIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogbWFrZXMgc3BhY2UgZm9yIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxuICovXG5QYWNrZXJ5LnByb3RvdHlwZS5fbWFuYWdlU3RhbXAgPSBmdW5jdGlvbiggZWxlbSApIHtcblxuICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSggZWxlbSApO1xuICB2YXIgcmVjdDtcbiAgaWYgKCBpdGVtICYmIGl0ZW0uaXNQbGFjaW5nICkge1xuICAgIHJlY3QgPSBpdGVtLnBsYWNlUmVjdDtcbiAgfSBlbHNlIHtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fZ2V0RWxlbWVudE9mZnNldCggZWxlbSApO1xuICAgIHJlY3QgPSBuZXcgUmVjdCh7XG4gICAgICB4OiB0aGlzLm9wdGlvbnMuaXNPcmlnaW5MZWZ0ID8gb2Zmc2V0LmxlZnQgOiBvZmZzZXQucmlnaHQsXG4gICAgICB5OiB0aGlzLm9wdGlvbnMuaXNPcmlnaW5Ub3AgPyBvZmZzZXQudG9wIDogb2Zmc2V0LmJvdHRvbVxuICAgIH0pO1xuICB9XG5cbiAgdGhpcy5fc2V0UmVjdFNpemUoIGVsZW0sIHJlY3QgKTtcbiAgLy8gc2F2ZSBpdHMgc3BhY2UgaW4gdGhlIHBhY2tlclxuICB0aGlzLnBhY2tlci5wbGFjZWQoIHJlY3QgKTtcbiAgdGhpcy5fc2V0TWF4WFkoIHJlY3QgKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG1ldGhvZHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gdmVydGljYWxTb3J0ZXIoIGEsIGIgKSB7XG4gIHJldHVybiBhLnBvc2l0aW9uLnkgLSBiLnBvc2l0aW9uLnkgfHwgYS5wb3NpdGlvbi54IC0gYi5wb3NpdGlvbi54O1xufVxuXG5mdW5jdGlvbiBob3Jpem9udGFsU29ydGVyKCBhLCBiICkge1xuICByZXR1cm4gYS5wb3NpdGlvbi54IC0gYi5wb3NpdGlvbi54IHx8IGEucG9zaXRpb24ueSAtIGIucG9zaXRpb24ueTtcbn1cblxuUGFja2VyeS5wcm90b3R5cGUuc29ydEl0ZW1zQnlQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc29ydGVyID0gdGhpcy5vcHRpb25zLmlzSG9yaXpvbnRhbCA/IGhvcml6b250YWxTb3J0ZXIgOiB2ZXJ0aWNhbFNvcnRlcjtcbiAgdGhpcy5pdGVtcy5zb3J0KCBzb3J0ZXIgKTtcbn07XG5cbi8qKlxuICogRml0IGl0ZW0gZWxlbWVudCBpbiBpdHMgY3VycmVudCBwb3NpdGlvblxuICogUGFja2VyeSB3aWxsIHBvc2l0aW9uIGVsZW1lbnRzIGFyb3VuZCBpdFxuICogdXNlZnVsIGZvciBleHBhbmRpbmcgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gaG9yaXpvbnRhbCBkZXN0aW5hdGlvbiBwb3NpdGlvbiwgb3B0aW9uYWxcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gdmVydGljYWwgZGVzdGluYXRpb24gcG9zaXRpb24sIG9wdGlvbmFsXG4gKi9cblBhY2tlcnkucHJvdG90eXBlLmZpdCA9IGZ1bmN0aW9uKCBlbGVtLCB4LCB5ICkge1xuICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSggZWxlbSApO1xuICBpZiAoICFpdGVtICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIHByZXBhcmUgaW50ZXJuYWwgcHJvcGVydGllc1xuICB0aGlzLl9nZXRNZWFzdXJlbWVudHMoKTtcblxuICAvLyBzdGFtcCBpdGVtIHRvIGdldCBpdCBvdXQgb2YgbGF5b3V0XG4gIHRoaXMuc3RhbXAoIGl0ZW0uZWxlbWVudCApO1xuICAvLyByZXF1aXJlZCBmb3IgcG9zaXRpb25QbGFjZVJlY3RcbiAgaXRlbS5nZXRTaXplKCk7XG4gIC8vIHNldCBwbGFjaW5nIGZsYWdcbiAgaXRlbS5pc1BsYWNpbmcgPSB0cnVlO1xuICAvLyBmYWxsIGJhY2sgdG8gY3VycmVudCBwb3NpdGlvbiBmb3IgZml0dGluZ1xuICB4ID0geCA9PT0gdW5kZWZpbmVkID8gaXRlbS5yZWN0Lng6IHg7XG4gIHkgPSB5ID09PSB1bmRlZmluZWQgPyBpdGVtLnJlY3QueTogeTtcblxuICAvLyBwb3NpdGlvbiBpdCBiZXN0IGF0IGl0cyBkZXN0aW5hdGlvblxuICBpdGVtLnBvc2l0aW9uUGxhY2VSZWN0KCB4LCB5LCB0cnVlICk7XG5cbiAgdGhpcy5fYmluZEZpdEV2ZW50cyggaXRlbSApO1xuICBpdGVtLm1vdmVUbyggaXRlbS5wbGFjZVJlY3QueCwgaXRlbS5wbGFjZVJlY3QueSApO1xuICAvLyBsYXlvdXQgZXZlcnl0aGluZyBlbHNlXG4gIHRoaXMubGF5b3V0KCk7XG5cbiAgLy8gcmV0dXJuIGJhY2sgdG8gcmVndWxhcmx5IHNjaGVkdWxlZCBwcm9ncmFtbWluZ1xuICB0aGlzLnVuc3RhbXAoIGl0ZW0uZWxlbWVudCApO1xuICB0aGlzLnNvcnRJdGVtc0J5UG9zaXRpb24oKTtcbiAgLy8gdW4gc2V0IHBsYWNpbmcgZmxhZywgYmFjayB0byBub3JtYWxcbiAgaXRlbS5pc1BsYWNpbmcgPSBmYWxzZTtcbiAgLy8gY29weSBwbGFjZSByZWN0IHBvc2l0aW9uXG4gIGl0ZW0uY29weVBsYWNlUmVjdFBvc2l0aW9uKCk7XG59O1xuXG4vKipcbiAqIGVtaXQgZXZlbnQgd2hlbiBpdGVtIGlzIGZpdCBhbmQgb3RoZXIgaXRlbXMgYXJlIGxhaWQgb3V0XG4gKiBAcGFyYW0ge1BhY2tlcnkuSXRlbX0gaXRlbVxuICogQHByaXZhdGVcbiAqL1xuUGFja2VyeS5wcm90b3R5cGUuX2JpbmRGaXRFdmVudHMgPSBmdW5jdGlvbiggaXRlbSApIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdmFyIHRpY2tzID0gMDtcbiAgZnVuY3Rpb24gdGljaygpIHtcbiAgICB0aWNrcysrO1xuICAgIGlmICggdGlja3MgIT09IDIgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIF90aGlzLmVtaXRFdmVudCggJ2ZpdENvbXBsZXRlJywgWyBfdGhpcywgaXRlbSBdICk7XG4gIH1cbiAgLy8gd2hlbiBpdGVtIGlzIGxhaWQgb3V0XG4gIGl0ZW0ub24oICdsYXlvdXQnLCBmdW5jdGlvbigpIHtcbiAgICB0aWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuICAvLyB3aGVuIGFsbCBpdGVtcyBhcmUgbGFpZCBvdXRcbiAgdGhpcy5vbiggJ2xheW91dENvbXBsZXRlJywgZnVuY3Rpb24oKSB7XG4gICAgdGljaygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHJlc2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vLyBkZWJvdW5jZWQsIGxheW91dCBvbiByZXNpemVcblBhY2tlcnkucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBkb24ndCB0cmlnZ2VyIGlmIHNpemUgZGlkIG5vdCBjaGFuZ2VcbiAgdmFyIHNpemUgPSBnZXRTaXplKCB0aGlzLmVsZW1lbnQgKTtcbiAgLy8gY2hlY2sgdGhhdCB0aGlzLnNpemUgYW5kIHNpemUgYXJlIHRoZXJlXG4gIC8vIElFOCB0cmlnZ2VycyByZXNpemUgb24gYm9keSBzaXplIGNoYW5nZSwgc28gdGhleSBtaWdodCBub3QgYmVcbiAgdmFyIGhhc1NpemVzID0gdGhpcy5zaXplICYmIHNpemU7XG4gIHZhciBpbm5lclNpemUgPSB0aGlzLm9wdGlvbnMuaXNIb3Jpem9udGFsID8gJ2lubmVySGVpZ2h0JyA6ICdpbm5lcldpZHRoJztcbiAgaWYgKCBoYXNTaXplcyAmJiBzaXplWyBpbm5lclNpemUgXSA9PT0gdGhpcy5zaXplWyBpbm5lclNpemUgXSApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLmxheW91dCgpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZHJhZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vKipcbiAqIGhhbmRsZSBhbiBpdGVtIGRyYWcgc3RhcnQgZXZlbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxuICovXG5QYWNrZXJ5LnByb3RvdHlwZS5pdGVtRHJhZ1N0YXJ0ID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIHRoaXMuc3RhbXAoIGVsZW0gKTtcbiAgdmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW0oIGVsZW0gKTtcbiAgaWYgKCBpdGVtICkge1xuICAgIGl0ZW0uZHJhZ1N0YXJ0KCk7XG4gIH1cbn07XG5cbi8qKlxuICogaGFuZGxlIGFuIGl0ZW0gZHJhZyBtb3ZlIGV2ZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gaG9yaXpvbnRhbCBjaGFuZ2UgaW4gcG9zaXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gdmVydGljYWwgY2hhbmdlIGluIHBvc2l0aW9uXG4gKi9cblBhY2tlcnkucHJvdG90eXBlLml0ZW1EcmFnTW92ZSA9IGZ1bmN0aW9uKCBlbGVtLCB4LCB5ICkge1xuICB2YXIgaXRlbSA9IHRoaXMuZ2V0SXRlbSggZWxlbSApO1xuICBpZiAoIGl0ZW0gKSB7XG4gICAgaXRlbS5kcmFnTW92ZSggeCwgeSApO1xuICB9XG5cbiAgLy8gZGVib3VuY2VcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgLy8gZGVib3VuY2UgdHJpZ2dlcmluZyBsYXlvdXRcbiAgZnVuY3Rpb24gZGVsYXllZCgpIHtcbiAgICBfdGhpcy5sYXlvdXQoKTtcbiAgICBkZWxldGUgX3RoaXMuZHJhZ1RpbWVvdXQ7XG4gIH1cblxuICB0aGlzLmNsZWFyRHJhZ1RpbWVvdXQoKTtcblxuICB0aGlzLmRyYWdUaW1lb3V0ID0gc2V0VGltZW91dCggZGVsYXllZCwgNDAgKTtcbn07XG5cblBhY2tlcnkucHJvdG90eXBlLmNsZWFyRHJhZ1RpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCB0aGlzLmRyYWdUaW1lb3V0ICkge1xuICAgIGNsZWFyVGltZW91dCggdGhpcy5kcmFnVGltZW91dCApO1xuICB9XG59O1xuXG4vKipcbiAqIGhhbmRsZSBhbiBpdGVtIGRyYWcgZW5kIGV2ZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqL1xuUGFja2VyeS5wcm90b3R5cGUuaXRlbURyYWdFbmQgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW0oIGVsZW0gKTtcbiAgdmFyIGl0ZW1EaWREcmFnO1xuICBpZiAoIGl0ZW0gKSB7XG4gICAgaXRlbURpZERyYWcgPSBpdGVtLmRpZERyYWc7XG4gICAgaXRlbS5kcmFnU3RvcCgpO1xuICB9XG4gIC8vIGlmIGVsZW0gZGlkbid0IG1vdmUsIG9yIGlmIGl0IGRvZXNuJ3QgbmVlZCBwb3NpdGlvbmluZ1xuICAvLyB1bmlnbm9yZSBhbmQgdW5zdGFtcCBhbmQgY2FsbCBpdCBhIGRheVxuICBpZiAoICFpdGVtIHx8ICggIWl0ZW1EaWREcmFnICYmICFpdGVtLm5lZWRzUG9zaXRpb25pbmcgKSApIHtcbiAgICB0aGlzLnVuc3RhbXAoIGVsZW0gKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gcHJvY2NlZCB3aXRoIGRyYWdnZWQgaXRlbVxuXG4gIGNsYXNzaWUuYWRkKCBpdGVtLmVsZW1lbnQsICdpcy1wb3NpdGlvbmluZy1wb3N0LWRyYWcnICk7XG5cbiAgLy8gc2F2ZSB0aGlzIHZhciwgYXMgaXQgY291bGQgZ2V0IHJlc2V0IGluIGRyYWdTdGFydFxuICB2YXIgb25MYXlvdXRDb21wbGV0ZSA9IHRoaXMuX2dldERyYWdFbmRMYXlvdXRDb21wbGV0ZSggZWxlbSwgaXRlbSApO1xuXG4gIGlmICggaXRlbS5uZWVkc1Bvc2l0aW9uaW5nICkge1xuICAgIGl0ZW0ub24oICdsYXlvdXQnLCBvbkxheW91dENvbXBsZXRlICk7XG4gICAgaXRlbS5tb3ZlVG8oIGl0ZW0ucGxhY2VSZWN0LngsIGl0ZW0ucGxhY2VSZWN0LnkgKTtcbiAgfSBlbHNlIGlmICggaXRlbSApIHtcbiAgICAvLyBpdGVtIGRpZG4ndCBuZWVkIHBsYWNlbWVudFxuICAgIGl0ZW0uY29weVBsYWNlUmVjdFBvc2l0aW9uKCk7XG4gIH1cblxuICB0aGlzLmNsZWFyRHJhZ1RpbWVvdXQoKTtcbiAgdGhpcy5vbiggJ2xheW91dENvbXBsZXRlJywgb25MYXlvdXRDb21wbGV0ZSApO1xuICB0aGlzLmxheW91dCgpO1xuXG59O1xuXG4vKipcbiAqIGdldCBkcmFnIGVuZCBjYWxsYmFja1xuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcGFyYW0ge1BhY2tlcnkuSXRlbX0gaXRlbVxuICogQHJldHVybnMge0Z1bmN0aW9ufSBvbkxheW91dENvbXBsZXRlXG4gKi9cblBhY2tlcnkucHJvdG90eXBlLl9nZXREcmFnRW5kTGF5b3V0Q29tcGxldGUgPSBmdW5jdGlvbiggZWxlbSwgaXRlbSApIHtcbiAgdmFyIGl0ZW1OZWVkc1Bvc2l0aW9uaW5nID0gaXRlbSAmJiBpdGVtLm5lZWRzUG9zaXRpb25pbmc7XG4gIHZhciBjb21wbGV0ZUNvdW50ID0gMDtcbiAgdmFyIGFzeW5jQ291bnQgPSBpdGVtTmVlZHNQb3NpdGlvbmluZyA/IDIgOiAxO1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHJldHVybiBmdW5jdGlvbiBvbkxheW91dENvbXBsZXRlKCkge1xuICAgIGNvbXBsZXRlQ291bnQrKztcbiAgICAvLyBkb24ndCBwcm9jZWVkIGlmIG5vdCBjb21wbGV0ZVxuICAgIGlmICggY29tcGxldGVDb3VudCAhPT0gYXN5bmNDb3VudCApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyByZXNldCBpdGVtXG4gICAgaWYgKCBpdGVtICkge1xuICAgICAgY2xhc3NpZS5yZW1vdmUoIGl0ZW0uZWxlbWVudCwgJ2lzLXBvc2l0aW9uaW5nLXBvc3QtZHJhZycgKTtcbiAgICAgIGl0ZW0uaXNQbGFjaW5nID0gZmFsc2U7XG4gICAgICBpdGVtLmNvcHlQbGFjZVJlY3RQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIF90aGlzLnVuc3RhbXAoIGVsZW0gKTtcbiAgICAvLyBvbmx5IHNvcnQgd2hlbiBpdGVtIG1vdmVkXG4gICAgX3RoaXMuc29ydEl0ZW1zQnlQb3NpdGlvbigpO1xuXG4gICAgLy8gZW1pdCBpdGVtIGRyYWcgZXZlbnQgbm93IHRoYXQgZXZlcnl0aGluZyBpcyBkb25lXG4gICAgaWYgKCBpdGVtTmVlZHNQb3NpdGlvbmluZyApIHtcbiAgICAgIF90aGlzLmVtaXRFdmVudCggJ2RyYWdJdGVtUG9zaXRpb25lZCcsIFsgX3RoaXMsIGl0ZW0gXSApO1xuICAgIH1cbiAgICAvLyBsaXN0ZW4gb25jZVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufTtcblxuLyoqXG4gKiBiaW5kcyBEcmFnZ2FiaWxseSBldmVudHNcbiAqIEBwYXJhbSB7RHJhZ2dhYmlsbHl9IGRyYWdnaWVcbiAqL1xuUGFja2VyeS5wcm90b3R5cGUuYmluZERyYWdnYWJpbGx5RXZlbnRzID0gZnVuY3Rpb24oIGRyYWdnaWUgKSB7XG4gIGRyYWdnaWUub24oICdkcmFnU3RhcnQnLCB0aGlzLmhhbmRsZURyYWdnYWJpbGx5LmRyYWdTdGFydCApO1xuICBkcmFnZ2llLm9uKCAnZHJhZ01vdmUnLCB0aGlzLmhhbmRsZURyYWdnYWJpbGx5LmRyYWdNb3ZlICk7XG4gIGRyYWdnaWUub24oICdkcmFnRW5kJywgdGhpcy5oYW5kbGVEcmFnZ2FiaWxseS5kcmFnRW5kICk7XG59O1xuXG4vKipcbiAqIGJpbmRzIGpRdWVyeSBVSSBEcmFnZ2FibGUgZXZlbnRzXG4gKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW1zXG4gKi9cblBhY2tlcnkucHJvdG90eXBlLmJpbmRVSURyYWdnYWJsZUV2ZW50cyA9IGZ1bmN0aW9uKCAkZWxlbXMgKSB7XG4gICRlbGVtc1xuICAgIC5vbiggJ2RyYWdzdGFydCcsIHRoaXMuaGFuZGxlVUlEcmFnZ2FibGUuc3RhcnQgKVxuICAgIC5vbiggJ2RyYWcnLCB0aGlzLmhhbmRsZVVJRHJhZ2dhYmxlLmRyYWcgKVxuICAgIC5vbiggJ2RyYWdzdG9wJywgdGhpcy5oYW5kbGVVSURyYWdnYWJsZS5zdG9wICk7XG59O1xuXG5QYWNrZXJ5LlJlY3QgPSBSZWN0O1xuUGFja2VyeS5QYWNrZXIgPSBQYWNrZXI7XG5cbnJldHVybiBQYWNrZXJ5O1xuXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHRyYW5zcG9ydCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgLy8gQU1EXG4gIGRlZmluZSggW1xuICAgICAgJ2NsYXNzaWUvY2xhc3NpZScsXG4gICAgICAnZ2V0LXNpemUvZ2V0LXNpemUnLFxuICAgICAgJ291dGxheWVyL291dGxheWVyJyxcbiAgICAgICcuL3JlY3QnLFxuICAgICAgJy4vcGFja2VyJyxcbiAgICAgICcuL2l0ZW0nXG4gICAgXSxcbiAgICBwYWNrZXJ5RGVmaW5pdGlvbiApO1xufSBlbHNlIHtcbiAgLy8gYnJvd3NlciBnbG9iYWxcbiAgd2luZG93LlBhY2tlcnkgPSBwYWNrZXJ5RGVmaW5pdGlvbihcbiAgICB3aW5kb3cuY2xhc3NpZSxcbiAgICB3aW5kb3cuZ2V0U2l6ZSxcbiAgICB3aW5kb3cuT3V0bGF5ZXIsXG4gICAgd2luZG93LlBhY2tlcnkuUmVjdCxcbiAgICB3aW5kb3cuUGFja2VyeS5QYWNrZXIsXG4gICAgd2luZG93LlBhY2tlcnkuSXRlbVxuICApO1xufVxuXG59KSggd2luZG93ICk7XG4iLCIvKlxuICogQ29weXJpZ2h0IDIwMTUgU21hbGwgQmF0Y2gsIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuLyogV2ViIEZvbnQgTG9hZGVyIHYxLjUuMTAgLSAoYykgQWRvYmUgU3lzdGVtcywgR29vZ2xlLiBMaWNlbnNlOiBBcGFjaGUgMi4wICovXG47KGZ1bmN0aW9uKHdpbmRvdyxkb2N1bWVudCx1bmRlZmluZWQpe3ZhciBrPXRoaXM7ZnVuY3Rpb24gbChhLGIpe3ZhciBjPWEuc3BsaXQoXCIuXCIpLGQ9aztjWzBdaW4gZHx8IWQuZXhlY1NjcmlwdHx8ZC5leGVjU2NyaXB0KFwidmFyIFwiK2NbMF0pO2Zvcih2YXIgZTtjLmxlbmd0aCYmKGU9Yy5zaGlmdCgpKTspYy5sZW5ndGh8fHZvaWQgMD09PWI/ZD1kW2VdP2RbZV06ZFtlXT17fTpkW2VdPWJ9ZnVuY3Rpb24gYWEoYSxiLGMpe3JldHVybiBhLmNhbGwuYXBwbHkoYS5iaW5kLGFyZ3VtZW50cyl9XG5mdW5jdGlvbiBiYShhLGIsYyl7aWYoIWEpdGhyb3cgRXJyb3IoKTtpZigyPGFyZ3VtZW50cy5sZW5ndGgpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO0FycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGMsZCk7cmV0dXJuIGEuYXBwbHkoYixjKX19cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiBuKGEsYixjKXtuPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJiYtMSE9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQudG9TdHJpbmcoKS5pbmRleE9mKFwibmF0aXZlIGNvZGVcIik/YWE6YmE7cmV0dXJuIG4uYXBwbHkobnVsbCxhcmd1bWVudHMpfXZhciBxPURhdGUubm93fHxmdW5jdGlvbigpe3JldHVybituZXcgRGF0ZX07ZnVuY3Rpb24gcyhhLGIpe3RoaXMuSz1hO3RoaXMudz1ifHxhO3RoaXMuRD10aGlzLncuZG9jdW1lbnR9cy5wcm90b3R5cGUuY3JlYXRlRWxlbWVudD1mdW5jdGlvbihhLGIsYyl7YT10aGlzLkQuY3JlYXRlRWxlbWVudChhKTtpZihiKWZvcih2YXIgZCBpbiBiKWIuaGFzT3duUHJvcGVydHkoZCkmJihcInN0eWxlXCI9PWQ/YS5zdHlsZS5jc3NUZXh0PWJbZF06YS5zZXRBdHRyaWJ1dGUoZCxiW2RdKSk7YyYmYS5hcHBlbmRDaGlsZCh0aGlzLkQuY3JlYXRlVGV4dE5vZGUoYykpO3JldHVybiBhfTtmdW5jdGlvbiB0KGEsYixjKXthPWEuRC5nZXRFbGVtZW50c0J5VGFnTmFtZShiKVswXTthfHwoYT1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO2EmJmEubGFzdENoaWxkJiZhLmluc2VydEJlZm9yZShjLGEubGFzdENoaWxkKX1mdW5jdGlvbiBjYShhLGIpe2Z1bmN0aW9uIGMoKXthLkQuYm9keT9iKCk6c2V0VGltZW91dChjLDApfWMoKX1cbmZ1bmN0aW9uIHUoYSxiLGMpe2I9Ynx8W107Yz1jfHxbXTtmb3IodmFyIGQ9YS5jbGFzc05hbWUuc3BsaXQoL1xccysvKSxlPTA7ZTxiLmxlbmd0aDtlKz0xKXtmb3IodmFyIGY9ITEsZz0wO2c8ZC5sZW5ndGg7Zys9MSlpZihiW2VdPT09ZFtnXSl7Zj0hMDticmVha31mfHxkLnB1c2goYltlXSl9Yj1bXTtmb3IoZT0wO2U8ZC5sZW5ndGg7ZSs9MSl7Zj0hMTtmb3IoZz0wO2c8Yy5sZW5ndGg7Zys9MSlpZihkW2VdPT09Y1tnXSl7Zj0hMDticmVha31mfHxiLnB1c2goZFtlXSl9YS5jbGFzc05hbWU9Yi5qb2luKFwiIFwiKS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpLnJlcGxhY2UoL15cXHMrfFxccyskLyxcIlwiKX1mdW5jdGlvbiB2KGEsYil7Zm9yKHZhciBjPWEuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyksZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKylpZihjW2RdPT1iKXJldHVybiEwO3JldHVybiExfVxuZnVuY3Rpb24gdyhhKXt2YXIgYj1hLncubG9jYXRpb24ucHJvdG9jb2w7XCJhYm91dDpcIj09YiYmKGI9YS5LLmxvY2F0aW9uLnByb3RvY29sKTtyZXR1cm5cImh0dHBzOlwiPT1iP1wiaHR0cHM6XCI6XCJodHRwOlwifWZ1bmN0aW9uIHgoYSxiKXt2YXIgYz1hLmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIse3JlbDpcInN0eWxlc2hlZXRcIixocmVmOmJ9KSxkPSExO2Mub25sb2FkPWZ1bmN0aW9uKCl7ZHx8KGQ9ITApfTtjLm9uZXJyb3I9ZnVuY3Rpb24oKXtkfHwoZD0hMCl9O3QoYSxcImhlYWRcIixjKX1cbmZ1bmN0aW9uIHkoYSxiLGMsZCl7dmFyIGU9YS5ELmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtpZihlKXt2YXIgZj1hLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIix7c3JjOmJ9KSxnPSExO2Yub25sb2FkPWYub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7Z3x8dGhpcy5yZWFkeVN0YXRlJiZcImxvYWRlZFwiIT10aGlzLnJlYWR5U3RhdGUmJlwiY29tcGxldGVcIiE9dGhpcy5yZWFkeVN0YXRlfHwoZz0hMCxjJiZjKG51bGwpLGYub25sb2FkPWYub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsXCJIRUFEXCI9PWYucGFyZW50Tm9kZS50YWdOYW1lJiZlLnJlbW92ZUNoaWxkKGYpKX07ZS5hcHBlbmRDaGlsZChmKTt3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe2d8fChnPSEwLGMmJmMoRXJyb3IoXCJTY3JpcHQgbG9hZCB0aW1lb3V0XCIpKSl9LGR8fDVFMyk7cmV0dXJuIGZ9cmV0dXJuIG51bGx9O2Z1bmN0aW9uIHooYSxiLGMsZCl7dGhpcy5SPWE7dGhpcy5aPWI7dGhpcy5CYT1jO3RoaXMucmE9ZH1sKFwid2ViZm9udC5Ccm93c2VySW5mb1wiLHopO3oucHJvdG90eXBlLnNhPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuUn07ei5wcm90b3R5cGUuaGFzV2ViRm9udFN1cHBvcnQ9ei5wcm90b3R5cGUuc2E7ei5wcm90b3R5cGUudGE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5afTt6LnByb3RvdHlwZS5oYXNXZWJLaXRGYWxsYmFja0J1Zz16LnByb3RvdHlwZS50YTt6LnByb3RvdHlwZS51YT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkJhfTt6LnByb3RvdHlwZS5oYXNXZWJLaXRNZXRyaWNzQnVnPXoucHJvdG90eXBlLnVhO3oucHJvdG90eXBlLnFhPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmF9O3oucHJvdG90eXBlLmhhc05hdGl2ZUZvbnRMb2FkaW5nPXoucHJvdG90eXBlLnFhO2Z1bmN0aW9uIEEoYSxiLGMsZCl7dGhpcy5jPW51bGwhPWE/YTpudWxsO3RoaXMuZz1udWxsIT1iP2I6bnVsbDt0aGlzLkI9bnVsbCE9Yz9jOm51bGw7dGhpcy5lPW51bGwhPWQ/ZDpudWxsfXZhciBkYT0vXihbMC05XSspKD86W1xcLl8tXShbMC05XSspKT8oPzpbXFwuXy1dKFswLTldKykpPyg/OltcXC5fKy1dPyguKikpPyQvO0EucHJvdG90eXBlLmNvbXBhcmU9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYz5hLmN8fHRoaXMuYz09PWEuYyYmdGhpcy5nPmEuZ3x8dGhpcy5jPT09YS5jJiZ0aGlzLmc9PT1hLmcmJnRoaXMuQj5hLkI/MTp0aGlzLmM8YS5jfHx0aGlzLmM9PT1hLmMmJnRoaXMuZzxhLmd8fHRoaXMuYz09PWEuYyYmdGhpcy5nPT09YS5nJiZ0aGlzLkI8YS5CPy0xOjB9O0EucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuW3RoaXMuYyx0aGlzLmd8fFwiXCIsdGhpcy5CfHxcIlwiLHRoaXMuZXx8XCJcIl0uam9pbihcIlwiKX07XG5mdW5jdGlvbiBCKGEpe2E9ZGEuZXhlYyhhKTt2YXIgYj1udWxsLGM9bnVsbCxkPW51bGwsZT1udWxsO2EmJihudWxsIT09YVsxXSYmYVsxXSYmKGI9cGFyc2VJbnQoYVsxXSwxMCkpLG51bGwhPT1hWzJdJiZhWzJdJiYoYz1wYXJzZUludChhWzJdLDEwKSksbnVsbCE9PWFbM10mJmFbM10mJihkPXBhcnNlSW50KGFbM10sMTApKSxudWxsIT09YVs0XSYmYVs0XSYmKGU9L15bMC05XSskLy50ZXN0KGFbNF0pP3BhcnNlSW50KGFbNF0sMTApOmFbNF0pKTtyZXR1cm4gbmV3IEEoYixjLGQsZSl9O2Z1bmN0aW9uIEMoYSxiLGMsZCxlLGYsZyxoKXt0aGlzLlA9YTt0aGlzLmphPWM7dGhpcy55YT1lO3RoaXMuaWE9Zzt0aGlzLm09aH1sKFwid2ViZm9udC5Vc2VyQWdlbnRcIixDKTtDLnByb3RvdHlwZS5nZXROYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuUH07Qy5wcm90b3R5cGUuZ2V0TmFtZT1DLnByb3RvdHlwZS5nZXROYW1lO0MucHJvdG90eXBlLm9hPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuamF9O0MucHJvdG90eXBlLmdldEVuZ2luZT1DLnByb3RvdHlwZS5vYTtDLnByb3RvdHlwZS5wYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnlhfTtDLnByb3RvdHlwZS5nZXRQbGF0Zm9ybT1DLnByb3RvdHlwZS5wYTtDLnByb3RvdHlwZS5uYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlhfTtDLnByb3RvdHlwZS5nZXREb2N1bWVudE1vZGU9Qy5wcm90b3R5cGUubmE7Qy5wcm90b3R5cGUubWE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tfTtDLnByb3RvdHlwZS5nZXRCcm93c2VySW5mbz1DLnByb3RvdHlwZS5tYTtmdW5jdGlvbiBEKGEsYil7dGhpcy5hPWE7dGhpcy5rPWJ9dmFyIGVhPW5ldyBDKFwiVW5rbm93blwiLDAsXCJVbmtub3duXCIsMCxcIlVua25vd25cIiwwLHZvaWQgMCxuZXcgeighMSwhMSwhMSwhMSkpO1xuRC5wcm90b3R5cGUucGFyc2U9ZnVuY3Rpb24oKXt2YXIgYTtpZigtMSE9dGhpcy5hLmluZGV4T2YoXCJNU0lFXCIpfHwtMSE9dGhpcy5hLmluZGV4T2YoXCJUcmlkZW50L1wiKSl7YT1FKHRoaXMpO3ZhciBiPUIoRih0aGlzKSksYz1udWxsLGQ9bnVsbCxlPUcodGhpcy5hLC9UcmlkZW50XFwvKFtcXGRcXHdcXC5dKykvLDEpLGY9SCh0aGlzLmspLGM9LTEhPXRoaXMuYS5pbmRleE9mKFwiTVNJRVwiKT9CKEcodGhpcy5hLC9NU0lFIChbXFxkXFx3XFwuXSspLywxKSk6QihHKHRoaXMuYSwvcnY6KFtcXGRcXHdcXC5dKykvLDEpKTtcIlwiIT1lPyhkPVwiVHJpZGVudFwiLEIoZSkpOmQ9XCJVbmtub3duXCI7YT1uZXcgQyhcIk1TSUVcIiwwLGQsMCxhLDAsZixuZXcgeihcIldpbmRvd3NcIj09YSYmNjw9Yy5jfHxcIldpbmRvd3MgUGhvbmVcIj09YSYmODw9Yi5jLCExLCExLCEhdGhpcy5rLmZvbnRzKSl9ZWxzZSBpZigtMSE9dGhpcy5hLmluZGV4T2YoXCJPcGVyYVwiKSlhOmlmKGE9XCJVbmtub3duXCIsYz1CKEcodGhpcy5hLC9QcmVzdG9cXC8oW1xcZFxcd1xcLl0rKS8sXG4xKSksQihGKHRoaXMpKSxiPUgodGhpcy5rKSxudWxsIT09Yy5jP2E9XCJQcmVzdG9cIjooLTEhPXRoaXMuYS5pbmRleE9mKFwiR2Vja29cIikmJihhPVwiR2Vja29cIiksQihHKHRoaXMuYSwvcnY6KFteXFwpXSspLywxKSkpLC0xIT10aGlzLmEuaW5kZXhPZihcIk9wZXJhIE1pbmkvXCIpKWM9QihHKHRoaXMuYSwvT3BlcmEgTWluaVxcLyhbXFxkXFwuXSspLywxKSksYT1uZXcgQyhcIk9wZXJhTWluaVwiLDAsYSwwLEUodGhpcyksMCxiLG5ldyB6KCExLCExLCExLCEhdGhpcy5rLmZvbnRzKSk7ZWxzZXtpZigtMSE9dGhpcy5hLmluZGV4T2YoXCJWZXJzaW9uL1wiKSYmKGM9QihHKHRoaXMuYSwvVmVyc2lvblxcLyhbXFxkXFwuXSspLywxKSksbnVsbCE9PWMuYykpe2E9bmV3IEMoXCJPcGVyYVwiLDAsYSwwLEUodGhpcyksMCxiLG5ldyB6KDEwPD1jLmMsITEsITEsISF0aGlzLmsuZm9udHMpKTticmVhayBhfWM9QihHKHRoaXMuYSwvT3BlcmFbXFwvIF0oW1xcZFxcLl0rKS8sMSkpO2E9bnVsbCE9PWMuYz9uZXcgQyhcIk9wZXJhXCIsXG4wLGEsMCxFKHRoaXMpLDAsYixuZXcgeigxMDw9Yy5jLCExLCExLCEhdGhpcy5rLmZvbnRzKSk6bmV3IEMoXCJPcGVyYVwiLDAsYSwwLEUodGhpcyksMCxiLG5ldyB6KCExLCExLCExLCEhdGhpcy5rLmZvbnRzKSl9ZWxzZS9PUFJcXC9bXFxkLl0rLy50ZXN0KHRoaXMuYSk/YT1JKHRoaXMpOi9BcHBsZVdlYihLfGspaXQvLnRlc3QodGhpcy5hKT9hPUkodGhpcyk6LTEhPXRoaXMuYS5pbmRleE9mKFwiR2Vja29cIik/KGE9XCJVbmtub3duXCIsYj1uZXcgQSxCKEYodGhpcykpLGI9ITEsLTEhPXRoaXMuYS5pbmRleE9mKFwiRmlyZWZveFwiKT8oYT1cIkZpcmVmb3hcIixiPUIoRyh0aGlzLmEsL0ZpcmVmb3hcXC8oW1xcZFxcd1xcLl0rKS8sMSkpLGI9Mzw9Yi5jJiY1PD1iLmcpOi0xIT10aGlzLmEuaW5kZXhPZihcIk1vemlsbGFcIikmJihhPVwiTW96aWxsYVwiKSxjPUIoRyh0aGlzLmEsL3J2OihbXlxcKV0rKS8sMSkpLGJ8fChiPTE8Yy5jfHwxPT1jLmMmJjk8Yy5nfHwxPT1jLmMmJjk9PWMuZyYmMjw9Yy5CKSxhPW5ldyBDKGEsXG4wLFwiR2Vja29cIiwwLEUodGhpcyksMCxIKHRoaXMuayksbmV3IHooYiwhMSwhMSwhIXRoaXMuay5mb250cykpKTphPWVhO3JldHVybiBhfTtmdW5jdGlvbiBFKGEpe3ZhciBiPUcoYS5hLC8oaVBvZHxpUGFkfGlQaG9uZXxBbmRyb2lkfFdpbmRvd3MgUGhvbmV8QkJcXGR7Mn18QmxhY2tCZXJyeSkvLDEpO2lmKFwiXCIhPWIpcmV0dXJuL0JCXFxkezJ9Ly50ZXN0KGIpJiYoYj1cIkJsYWNrQmVycnlcIiksYjthPUcoYS5hLC8oTGludXh8TWFjX1Bvd2VyUEN8TWFjaW50b3NofFdpbmRvd3N8Q3JPU3xQbGF5U3RhdGlvbnxDcktleSkvLDEpO3JldHVyblwiXCIhPWE/KFwiTWFjX1Bvd2VyUENcIj09YT9hPVwiTWFjaW50b3NoXCI6XCJQbGF5U3RhdGlvblwiPT1hJiYoYT1cIkxpbnV4XCIpLGEpOlwiVW5rbm93blwifVxuZnVuY3Rpb24gRihhKXt2YXIgYj1HKGEuYSwvKE9TIFh8V2luZG93cyBOVHxBbmRyb2lkKSAoW147KV0rKS8sMik7aWYoYnx8KGI9RyhhLmEsL1dpbmRvd3MgUGhvbmUoIE9TKT8gKFteOyldKykvLDIpKXx8KGI9RyhhLmEsLyhpUGhvbmUgKT9PUyAoW1xcZF9dKykvLDIpKSlyZXR1cm4gYjtpZihiPUcoYS5hLC8oPzpMaW51eHxDck9TfENyS2V5KSAoW147KV0rKS8sMSkpZm9yKHZhciBiPWIuc3BsaXQoL1xccy8pLGM9MDtjPGIubGVuZ3RoO2MrPTEpaWYoL15bXFxkXFwuX10rJC8udGVzdChiW2NdKSlyZXR1cm4gYltjXTtyZXR1cm4oYT1HKGEuYSwvKEJCXFxkezJ9fEJsYWNrQmVycnkpLio/VmVyc2lvblxcLyhbXlxcc10qKS8sMikpP2E6XCJVbmtub3duXCJ9XG5mdW5jdGlvbiBJKGEpe3ZhciBiPUUoYSksYz1CKEYoYSkpLGQ9QihHKGEuYSwvQXBwbGVXZWIoPzpLfGspaXRcXC8oW1xcZFxcLlxcK10rKS8sMSkpLGU9XCJVbmtub3duXCIsZj1uZXcgQSxmPVwiVW5rbm93blwiLGc9ITE7L09QUlxcL1tcXGQuXSsvLnRlc3QoYS5hKT9lPVwiT3BlcmFcIjotMSE9YS5hLmluZGV4T2YoXCJDaHJvbWVcIil8fC0xIT1hLmEuaW5kZXhPZihcIkNyTW9cIil8fC0xIT1hLmEuaW5kZXhPZihcIkNyaU9TXCIpP2U9XCJDaHJvbWVcIjovU2lsa1xcL1xcZC8udGVzdChhLmEpP2U9XCJTaWxrXCI6XCJCbGFja0JlcnJ5XCI9PWJ8fFwiQW5kcm9pZFwiPT1iP2U9XCJCdWlsdGluQnJvd3NlclwiOi0xIT1hLmEuaW5kZXhPZihcIlBoYW50b21KU1wiKT9lPVwiUGhhbnRvbUpTXCI6LTEhPWEuYS5pbmRleE9mKFwiU2FmYXJpXCIpP2U9XCJTYWZhcmlcIjotMSE9YS5hLmluZGV4T2YoXCJBZG9iZUFJUlwiKT9lPVwiQWRvYmVBSVJcIjotMSE9YS5hLmluZGV4T2YoXCJQbGF5U3RhdGlvblwiKSYmKGU9XCJCdWlsdGluQnJvd3NlclwiKTtcIkJ1aWx0aW5Ccm93c2VyXCI9PVxuZT9mPVwiVW5rbm93blwiOlwiU2lsa1wiPT1lP2Y9RyhhLmEsL1NpbGtcXC8oW1xcZFxcLl9dKykvLDEpOlwiQ2hyb21lXCI9PWU/Zj1HKGEuYSwvKENocm9tZXxDck1vfENyaU9TKVxcLyhbXFxkXFwuXSspLywyKTotMSE9YS5hLmluZGV4T2YoXCJWZXJzaW9uL1wiKT9mPUcoYS5hLC9WZXJzaW9uXFwvKFtcXGRcXC5cXHddKykvLDEpOlwiQWRvYmVBSVJcIj09ZT9mPUcoYS5hLC9BZG9iZUFJUlxcLyhbXFxkXFwuXSspLywxKTpcIk9wZXJhXCI9PWU/Zj1HKGEuYSwvT1BSXFwvKFtcXGQuXSspLywxKTpcIlBoYW50b21KU1wiPT1lJiYoZj1HKGEuYSwvUGhhbnRvbUpTXFwvKFtcXGQuXSspLywxKSk7Zj1CKGYpO2c9XCJBZG9iZUFJUlwiPT1lPzI8Zi5jfHwyPT1mLmMmJjU8PWYuZzpcIkJsYWNrQmVycnlcIj09Yj8xMDw9Yy5jOlwiQW5kcm9pZFwiPT1iPzI8Yy5jfHwyPT1jLmMmJjE8Yy5nOjUyNjw9ZC5jfHw1MjU8PWQuYyYmMTM8PWQuZztyZXR1cm4gbmV3IEMoZSwwLFwiQXBwbGVXZWJLaXRcIiwwLGIsMCxIKGEuayksbmV3IHooZyw1MzY+ZC5jfHw1MzY9PVxuZC5jJiYxMT5kLmcsXCJpUGhvbmVcIj09Ynx8XCJpUGFkXCI9PWJ8fFwiaVBvZFwiPT1ifHxcIk1hY2ludG9zaFwiPT1iLCEhYS5rLmZvbnRzKSl9ZnVuY3Rpb24gRyhhLGIsYyl7cmV0dXJuKGE9YS5tYXRjaChiKSkmJmFbY10/YVtjXTpcIlwifWZ1bmN0aW9uIEgoYSl7aWYoYS5kb2N1bWVudE1vZGUpcmV0dXJuIGEuZG9jdW1lbnRNb2RlfTtmdW5jdGlvbiBKKGEpe3RoaXMueGE9YXx8XCItXCJ9Si5wcm90b3R5cGUuZT1mdW5jdGlvbihhKXtmb3IodmFyIGI9W10sYz0wO2M8YXJndW1lbnRzLmxlbmd0aDtjKyspYi5wdXNoKGFyZ3VtZW50c1tjXS5yZXBsYWNlKC9bXFxXX10rL2csXCJcIikudG9Mb3dlckNhc2UoKSk7cmV0dXJuIGIuam9pbih0aGlzLnhhKX07ZnVuY3Rpb24gSyhhLGIpe3RoaXMuUD1hO3RoaXMuJD00O3RoaXMuUT1cIm5cIjt2YXIgYz0oYnx8XCJuNFwiKS5tYXRjaCgvXihbbmlvXSkoWzEtOV0pJC9pKTtjJiYodGhpcy5RPWNbMV0sdGhpcy4kPXBhcnNlSW50KGNbMl0sMTApKX1LLnByb3RvdHlwZS5nZXROYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuUH07ZnVuY3Rpb24gTChhKXtyZXR1cm4gYS5RK2EuJH1mdW5jdGlvbiBmYShhKXt2YXIgYj00LGM9XCJuXCIsZD1udWxsO2EmJigoZD1hLm1hdGNoKC8obm9ybWFsfG9ibGlxdWV8aXRhbGljKS9pKSkmJmRbMV0mJihjPWRbMV0uc3Vic3RyKDAsMSkudG9Mb3dlckNhc2UoKSksKGQ9YS5tYXRjaCgvKFsxLTldMDB8bm9ybWFsfGJvbGQpL2kpKSYmZFsxXSYmKC9ib2xkL2kudGVzdChkWzFdKT9iPTc6L1sxLTldMDAvLnRlc3QoZFsxXSkmJihiPXBhcnNlSW50KGRbMV0uc3Vic3RyKDAsMSksMTApKSkpO3JldHVybiBjK2J9O2Z1bmN0aW9uIGdhKGEsYixjLGQsZSl7dGhpcy5kPWE7dGhpcy5wPWI7dGhpcy5UPWM7dGhpcy5qPVwid2ZcIjt0aGlzLmg9bmV3IEooXCItXCIpO3RoaXMuaGE9ITEhPT1kO3RoaXMuQz0hMSE9PWV9ZnVuY3Rpb24gTShhKXtpZihhLkMpe3ZhciBiPXYoYS5wLGEuaC5lKGEuaixcImFjdGl2ZVwiKSksYz1bXSxkPVthLmguZShhLmosXCJsb2FkaW5nXCIpXTtifHxjLnB1c2goYS5oLmUoYS5qLFwiaW5hY3RpdmVcIikpO3UoYS5wLGMsZCl9TihhLFwiaW5hY3RpdmVcIil9ZnVuY3Rpb24gTihhLGIsYyl7aWYoYS5oYSYmYS5UW2JdKWlmKGMpYS5UW2JdKGMuZ2V0TmFtZSgpLEwoYykpO2Vsc2UgYS5UW2JdKCl9O2Z1bmN0aW9uIGhhKCl7dGhpcy5BPXt9fTtmdW5jdGlvbiBPKGEsYil7dGhpcy5kPWE7dGhpcy5IPWI7dGhpcy50PXRoaXMuZC5jcmVhdGVFbGVtZW50KFwic3BhblwiLHtcImFyaWEtaGlkZGVuXCI6XCJ0cnVlXCJ9LHRoaXMuSCl9XG5mdW5jdGlvbiBQKGEsYil7dmFyIGM9YS50LGQ7ZD1bXTtmb3IodmFyIGU9Yi5QLnNwbGl0KC8sXFxzKi8pLGY9MDtmPGUubGVuZ3RoO2YrKyl7dmFyIGc9ZVtmXS5yZXBsYWNlKC9bJ1wiXS9nLFwiXCIpOy0xPT1nLmluZGV4T2YoXCIgXCIpP2QucHVzaChnKTpkLnB1c2goXCInXCIrZytcIidcIil9ZD1kLmpvaW4oXCIsXCIpO2U9XCJub3JtYWxcIjtcIm9cIj09PWIuUT9lPVwib2JsaXF1ZVwiOlwiaVwiPT09Yi5RJiYoZT1cIml0YWxpY1wiKTtjLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDowcHg7bGVmdDowcHg7dmlzaWJpbGl0eTpoaWRkZW47Zm9udC1zaXplOjMwMHB4O3dpZHRoOmF1dG87aGVpZ2h0OmF1dG87bGluZS1oZWlnaHQ6bm9ybWFsO21hcmdpbjowO3BhZGRpbmc6MDtmb250LXZhcmlhbnQ6bm9ybWFsO3doaXRlLXNwYWNlOm5vd3JhcDtmb250LWZhbWlseTpcIitkK1wiO1wiKyhcImZvbnQtc3R5bGU6XCIrZStcIjtmb250LXdlaWdodDpcIisoYi4kK1wiMDBcIikrXCI7XCIpfVxuZnVuY3Rpb24gUShhKXt0KGEuZCxcImJvZHlcIixhLnQpfU8ucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbigpe3ZhciBhPXRoaXMudDthLnBhcmVudE5vZGUmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKX07ZnVuY3Rpb24gamEoYSxiLGMsZCxlLGYsZyxoKXt0aGlzLmFhPWE7dGhpcy52YT1iO3RoaXMuZD1jO3RoaXMucz1kO3RoaXMuSD1ofHxcIkJFU2Jzd3lcIjt0aGlzLm09ZTt0aGlzLko9e307dGhpcy5ZPWZ8fDNFMzt0aGlzLmRhPWd8fG51bGw7dGhpcy5HPXRoaXMuRj1udWxsO2E9bmV3IE8odGhpcy5kLHRoaXMuSCk7UShhKTtmb3IodmFyIHAgaW4gUilSLmhhc093blByb3BlcnR5KHApJiYoUChhLG5ldyBLKFJbcF0sTCh0aGlzLnMpKSksdGhpcy5KW1JbcF1dPWEudC5vZmZzZXRXaWR0aCk7YS5yZW1vdmUoKX12YXIgUj17RWE6XCJzZXJpZlwiLERhOlwic2Fucy1zZXJpZlwiLENhOlwibW9ub3NwYWNlXCJ9O1xuamEucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dGhpcy5GPW5ldyBPKHRoaXMuZCx0aGlzLkgpO1EodGhpcy5GKTt0aGlzLkc9bmV3IE8odGhpcy5kLHRoaXMuSCk7USh0aGlzLkcpO3RoaXMuemE9cSgpO1AodGhpcy5GLG5ldyBLKHRoaXMucy5nZXROYW1lKCkrXCIsc2VyaWZcIixMKHRoaXMucykpKTtQKHRoaXMuRyxuZXcgSyh0aGlzLnMuZ2V0TmFtZSgpK1wiLHNhbnMtc2VyaWZcIixMKHRoaXMucykpKTtrYSh0aGlzKX07ZnVuY3Rpb24gbGEoYSxiLGMpe2Zvcih2YXIgZCBpbiBSKWlmKFIuaGFzT3duUHJvcGVydHkoZCkmJmI9PT1hLkpbUltkXV0mJmM9PT1hLkpbUltkXV0pcmV0dXJuITA7cmV0dXJuITF9XG5mdW5jdGlvbiBrYShhKXt2YXIgYj1hLkYudC5vZmZzZXRXaWR0aCxjPWEuRy50Lm9mZnNldFdpZHRoO2I9PT1hLkouc2VyaWYmJmM9PT1hLkpbXCJzYW5zLXNlcmlmXCJdfHxhLm0uWiYmbGEoYSxiLGMpP3EoKS1hLnphPj1hLlk/YS5tLlomJmxhKGEsYixjKSYmKG51bGw9PT1hLmRhfHxhLmRhLmhhc093blByb3BlcnR5KGEucy5nZXROYW1lKCkpKT9TKGEsYS5hYSk6UyhhLGEudmEpOm1hKGEpOlMoYSxhLmFhKX1mdW5jdGlvbiBtYShhKXtzZXRUaW1lb3V0KG4oZnVuY3Rpb24oKXtrYSh0aGlzKX0sYSksMjUpfWZ1bmN0aW9uIFMoYSxiKXthLkYucmVtb3ZlKCk7YS5HLnJlbW92ZSgpO2IoYS5zKX07ZnVuY3Rpb24gVChhLGIsYyxkKXt0aGlzLmQ9Yjt0aGlzLnU9Yzt0aGlzLlU9MDt0aGlzLmZhPXRoaXMuY2E9ITE7dGhpcy5ZPWQ7dGhpcy5tPWEubX1mdW5jdGlvbiBuYShhLGIsYyxkLGUpe2M9Y3x8e307aWYoMD09PWIubGVuZ3RoJiZlKU0oYS51KTtlbHNlIGZvcihhLlUrPWIubGVuZ3RoLGUmJihhLmNhPWUpLGU9MDtlPGIubGVuZ3RoO2UrKyl7dmFyIGY9YltlXSxnPWNbZi5nZXROYW1lKCldLGg9YS51LHA9ZjtoLkMmJnUoaC5wLFtoLmguZShoLmoscC5nZXROYW1lKCksTChwKS50b1N0cmluZygpLFwibG9hZGluZ1wiKV0pO04oaCxcImZvbnRsb2FkaW5nXCIscCk7aD1udWxsO2g9bmV3IGphKG4oYS5rYSxhKSxuKGEubGEsYSksYS5kLGYsYS5tLGEuWSxkLGcpO2guc3RhcnQoKX19XG5ULnByb3RvdHlwZS5rYT1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnU7Yi5DJiZ1KGIucCxbYi5oLmUoYi5qLGEuZ2V0TmFtZSgpLEwoYSkudG9TdHJpbmcoKSxcImFjdGl2ZVwiKV0sW2IuaC5lKGIuaixhLmdldE5hbWUoKSxMKGEpLnRvU3RyaW5nKCksXCJsb2FkaW5nXCIpLGIuaC5lKGIuaixhLmdldE5hbWUoKSxMKGEpLnRvU3RyaW5nKCksXCJpbmFjdGl2ZVwiKV0pO04oYixcImZvbnRhY3RpdmVcIixhKTt0aGlzLmZhPSEwO29hKHRoaXMpfTtcblQucHJvdG90eXBlLmxhPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMudTtpZihiLkMpe3ZhciBjPXYoYi5wLGIuaC5lKGIuaixhLmdldE5hbWUoKSxMKGEpLnRvU3RyaW5nKCksXCJhY3RpdmVcIikpLGQ9W10sZT1bYi5oLmUoYi5qLGEuZ2V0TmFtZSgpLEwoYSkudG9TdHJpbmcoKSxcImxvYWRpbmdcIildO2N8fGQucHVzaChiLmguZShiLmosYS5nZXROYW1lKCksTChhKS50b1N0cmluZygpLFwiaW5hY3RpdmVcIikpO3UoYi5wLGQsZSl9TihiLFwiZm9udGluYWN0aXZlXCIsYSk7b2EodGhpcyl9O2Z1bmN0aW9uIG9hKGEpezA9PS0tYS5VJiZhLmNhJiYoYS5mYT8oYT1hLnUsYS5DJiZ1KGEucCxbYS5oLmUoYS5qLFwiYWN0aXZlXCIpXSxbYS5oLmUoYS5qLFwibG9hZGluZ1wiKSxhLmguZShhLmosXCJpbmFjdGl2ZVwiKV0pLE4oYSxcImFjdGl2ZVwiKSk6TShhLnUpKX07ZnVuY3Rpb24gVShhKXt0aGlzLks9YTt0aGlzLnY9bmV3IGhhO3RoaXMuQWE9bmV3IEQoYS5uYXZpZ2F0b3IudXNlckFnZW50LGEuZG9jdW1lbnQpO3RoaXMuYT10aGlzLkFhLnBhcnNlKCk7dGhpcy5WPXRoaXMuVz0wO3RoaXMuTT10aGlzLk49ITB9XG5VLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3ZhciBiPWEuY29udGV4dHx8dGhpcy5LO3RoaXMuZD1uZXcgcyh0aGlzLkssYik7dGhpcy5OPSExIT09YS5ldmVudHM7dGhpcy5NPSExIT09YS5jbGFzc2VzO3ZhciBiPW5ldyBnYSh0aGlzLmQsYi5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsYSx0aGlzLk4sdGhpcy5NKSxjPVtdLGQ9YS50aW1lb3V0O2IuQyYmdShiLnAsW2IuaC5lKGIuaixcImxvYWRpbmdcIildKTtOKGIsXCJsb2FkaW5nXCIpO3ZhciBjPXRoaXMudixlPXRoaXMuZCxmPVtdLGc7Zm9yKGcgaW4gYSlpZihhLmhhc093blByb3BlcnR5KGcpKXt2YXIgaD1jLkFbZ107aCYmZi5wdXNoKGgoYVtnXSxlKSl9Yz1mO3RoaXMuVj10aGlzLlc9Yy5sZW5ndGg7YT1uZXcgVCh0aGlzLmEsdGhpcy5kLGIsZCk7Zz0wO2ZvcihkPWMubGVuZ3RoO2c8ZDtnKyspZT1jW2ddLGUuTCh0aGlzLmEsbih0aGlzLndhLHRoaXMsZSxiLGEpKX07XG5VLnByb3RvdHlwZS53YT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT10aGlzO2Q/YS5sb2FkKGZ1bmN0aW9uKGEsYixkKXtwYShlLGMsYSxiLGQpfSk6KGE9MD09LS10aGlzLlcsdGhpcy5WLS0sYSYmMD09dGhpcy5WP00oYik6KHRoaXMuTXx8dGhpcy5OKSYmbmEoYyxbXSx7fSxudWxsLGEpKX07ZnVuY3Rpb24gcGEoYSxiLGMsZCxlKXt2YXIgZj0wPT0tLWEuVzsoYS5NfHxhLk4pJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bmEoYixjLGR8fG51bGwsZXx8bnVsbCxmKX0sMCl9O2Z1bmN0aW9uIHFhKGEsYixjKXt0aGlzLlM9YT9hOmIrcmE7dGhpcy5xPVtdO3RoaXMuWD1bXTt0aGlzLmdhPWN8fFwiXCJ9dmFyIHJhPVwiLy9mb250cy5nb29nbGVhcGlzLmNvbS9jc3NcIjtxYS5wcm90b3R5cGUuZT1mdW5jdGlvbigpe2lmKDA9PXRoaXMucS5sZW5ndGgpdGhyb3cgRXJyb3IoXCJObyBmb250cyB0byBsb2FkIVwiKTtpZigtMSE9dGhpcy5TLmluZGV4T2YoXCJraXQ9XCIpKXJldHVybiB0aGlzLlM7Zm9yKHZhciBhPXRoaXMucS5sZW5ndGgsYj1bXSxjPTA7YzxhO2MrKyliLnB1c2godGhpcy5xW2NdLnJlcGxhY2UoLyAvZyxcIitcIikpO2E9dGhpcy5TK1wiP2ZhbWlseT1cIitiLmpvaW4oXCIlN0NcIik7MDx0aGlzLlgubGVuZ3RoJiYoYSs9XCImc3Vic2V0PVwiK3RoaXMuWC5qb2luKFwiLFwiKSk7MDx0aGlzLmdhLmxlbmd0aCYmKGErPVwiJnRleHQ9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuZ2EpKTtyZXR1cm4gYX07ZnVuY3Rpb24gc2EoYSl7dGhpcy5xPWE7dGhpcy5lYT1bXTt0aGlzLk89e319XG52YXIgdGE9e2xhdGluOlwiQkVTYnN3eVwiLGN5cmlsbGljOlwiJiMxMDgxOyYjMTEwMzsmIzEwNDY7XCIsZ3JlZWs6XCImIzk0NTsmIzk0NjsmIzkzMTtcIixraG1lcjpcIiYjeDE3ODA7JiN4MTc4MTsmI3gxNzgyO1wiLEhhbnVtYW46XCImI3gxNzgwOyYjeDE3ODE7JiN4MTc4MjtcIn0sdWE9e3RoaW46XCIxXCIsZXh0cmFsaWdodDpcIjJcIixcImV4dHJhLWxpZ2h0XCI6XCIyXCIsdWx0cmFsaWdodDpcIjJcIixcInVsdHJhLWxpZ2h0XCI6XCIyXCIsbGlnaHQ6XCIzXCIscmVndWxhcjpcIjRcIixib29rOlwiNFwiLG1lZGl1bTpcIjVcIixcInNlbWktYm9sZFwiOlwiNlwiLHNlbWlib2xkOlwiNlwiLFwiZGVtaS1ib2xkXCI6XCI2XCIsZGVtaWJvbGQ6XCI2XCIsYm9sZDpcIjdcIixcImV4dHJhLWJvbGRcIjpcIjhcIixleHRyYWJvbGQ6XCI4XCIsXCJ1bHRyYS1ib2xkXCI6XCI4XCIsdWx0cmFib2xkOlwiOFwiLGJsYWNrOlwiOVwiLGhlYXZ5OlwiOVwiLGw6XCIzXCIscjpcIjRcIixiOlwiN1wifSx2YT17aTpcImlcIixpdGFsaWM6XCJpXCIsbjpcIm5cIixub3JtYWw6XCJuXCJ9LHdhPS9eKHRoaW58KD86KD86ZXh0cmF8dWx0cmEpLT8pP2xpZ2h0fHJlZ3VsYXJ8Ym9va3xtZWRpdW18KD86KD86c2VtaXxkZW1pfGV4dHJhfHVsdHJhKS0/KT9ib2xkfGJsYWNrfGhlYXZ5fGx8cnxifFsxLTldMDApPyhufGl8bm9ybWFsfGl0YWxpYyk/JC87XG5zYS5wcm90b3R5cGUucGFyc2U9ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5xLmxlbmd0aCxiPTA7YjxhO2IrKyl7dmFyIGM9dGhpcy5xW2JdLnNwbGl0KFwiOlwiKSxkPWNbMF0ucmVwbGFjZSgvXFwrL2csXCIgXCIpLGU9W1wibjRcIl07aWYoMjw9Yy5sZW5ndGgpe3ZhciBmO3ZhciBnPWNbMV07Zj1bXTtpZihnKWZvcih2YXIgZz1nLnNwbGl0KFwiLFwiKSxoPWcubGVuZ3RoLHA9MDtwPGg7cCsrKXt2YXIgbTttPWdbcF07aWYobS5tYXRjaCgvXltcXHctXSskLykpe209d2EuZXhlYyhtLnRvTG93ZXJDYXNlKCkpO3ZhciByPXZvaWQgMDtpZihudWxsPT1tKXI9XCJcIjtlbHNle3I9dm9pZCAwO3I9bVsxXTtpZihudWxsPT1yfHxcIlwiPT1yKXI9XCI0XCI7ZWxzZSB2YXIgaWE9dWFbcl0scj1pYT9pYTppc05hTihyKT9cIjRcIjpyLnN1YnN0cigwLDEpO209bVsyXTtyPVtudWxsPT1tfHxcIlwiPT1tP1wiblwiOnZhW21dLHJdLmpvaW4oXCJcIil9bT1yfWVsc2UgbT1cIlwiO20mJmYucHVzaChtKX0wPGYubGVuZ3RoJiYoZT1mKTtcbjM9PWMubGVuZ3RoJiYoYz1jWzJdLGY9W10sYz1jP2Muc3BsaXQoXCIsXCIpOmYsMDxjLmxlbmd0aCYmKGM9dGFbY1swXV0pJiYodGhpcy5PW2RdPWMpKX10aGlzLk9bZF18fChjPXRhW2RdKSYmKHRoaXMuT1tkXT1jKTtmb3IoYz0wO2M8ZS5sZW5ndGg7Yys9MSl0aGlzLmVhLnB1c2gobmV3IEsoZCxlW2NdKSl9fTtmdW5jdGlvbiBWKGEsYil7dGhpcy5hPShuZXcgRChuYXZpZ2F0b3IudXNlckFnZW50LGRvY3VtZW50KSkucGFyc2UoKTt0aGlzLmQ9YTt0aGlzLmY9Yn12YXIgeGE9e0FyaW1vOiEwLENvdXNpbmU6ITAsVGlub3M6ITB9O1YucHJvdG90eXBlLkw9ZnVuY3Rpb24oYSxiKXtiKGEubS5SKX07Vi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhKXt2YXIgYj10aGlzLmQ7XCJNU0lFXCI9PXRoaXMuYS5nZXROYW1lKCkmJjEhPXRoaXMuZi5ibG9ja2luZz9jYShiLG4odGhpcy5iYSx0aGlzLGEpKTp0aGlzLmJhKGEpfTtcblYucHJvdG90eXBlLmJhPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj10aGlzLmQsYz1uZXcgcWEodGhpcy5mLmFwaSx3KGIpLHRoaXMuZi50ZXh0KSxkPXRoaXMuZi5mYW1pbGllcyxlPWQubGVuZ3RoLGY9MDtmPGU7ZisrKXt2YXIgZz1kW2ZdLnNwbGl0KFwiOlwiKTszPT1nLmxlbmd0aCYmYy5YLnB1c2goZy5wb3AoKSk7dmFyIGg9XCJcIjsyPT1nLmxlbmd0aCYmXCJcIiE9Z1sxXSYmKGg9XCI6XCIpO2MucS5wdXNoKGcuam9pbihoKSl9ZD1uZXcgc2EoZCk7ZC5wYXJzZSgpO3goYixjLmUoKSk7YShkLmVhLGQuTyx4YSl9O2Z1bmN0aW9uIFcoYSxiKXt0aGlzLmQ9YTt0aGlzLmY9Yjt0aGlzLm89W119Vy5wcm90b3R5cGUuST1mdW5jdGlvbihhKXt2YXIgYj10aGlzLmQ7cmV0dXJuIHcodGhpcy5kKSsodGhpcy5mLmFwaXx8XCIvL2YuZm9udGRlY2suY29tL3MvY3NzL2pzL1wiKSsoYi53LmxvY2F0aW9uLmhvc3RuYW1lfHxiLksubG9jYXRpb24uaG9zdG5hbWUpK1wiL1wiK2ErXCIuanNcIn07XG5XLnByb3RvdHlwZS5MPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5mLmlkLGQ9dGhpcy5kLncsZT10aGlzO2M/KGQuX193ZWJmb250Zm9udGRlY2ttb2R1bGVfX3x8KGQuX193ZWJmb250Zm9udGRlY2ttb2R1bGVfXz17fSksZC5fX3dlYmZvbnRmb250ZGVja21vZHVsZV9fW2NdPWZ1bmN0aW9uKGEsYyl7Zm9yKHZhciBkPTAscD1jLmZvbnRzLmxlbmd0aDtkPHA7KytkKXt2YXIgbT1jLmZvbnRzW2RdO2Uuby5wdXNoKG5ldyBLKG0ubmFtZSxmYShcImZvbnQtd2VpZ2h0OlwiK20ud2VpZ2h0K1wiO2ZvbnQtc3R5bGU6XCIrbS5zdHlsZSkpKX1iKGEpfSx5KHRoaXMuZCx0aGlzLkkoYyksZnVuY3Rpb24oYSl7YSYmYighMSl9KSk6YighMSl9O1cucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7YSh0aGlzLm8pfTtmdW5jdGlvbiBYKGEsYil7dGhpcy5kPWE7dGhpcy5mPWI7dGhpcy5vPVtdfVgucHJvdG90eXBlLkk9ZnVuY3Rpb24oYSl7dmFyIGI9dyh0aGlzLmQpO3JldHVybih0aGlzLmYuYXBpfHxiK1wiLy91c2UudHlwZWtpdC5uZXRcIikrXCIvXCIrYStcIi5qc1wifTtYLnByb3RvdHlwZS5MPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5mLmlkLGQ9dGhpcy5kLncsZT10aGlzO2M/eSh0aGlzLmQsdGhpcy5JKGMpLGZ1bmN0aW9uKGEpe2lmKGEpYighMSk7ZWxzZXtpZihkLlR5cGVraXQmJmQuVHlwZWtpdC5jb25maWcmJmQuVHlwZWtpdC5jb25maWcuZm4pe2E9ZC5UeXBla2l0LmNvbmZpZy5mbjtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrPTIpZm9yKHZhciBoPWFbY10scD1hW2MrMV0sbT0wO208cC5sZW5ndGg7bSsrKWUuby5wdXNoKG5ldyBLKGgscFttXSkpO3RyeXtkLlR5cGVraXQubG9hZCh7ZXZlbnRzOiExLGNsYXNzZXM6ITF9KX1jYXRjaChyKXt9fWIoITApfX0sMkUzKTpiKCExKX07XG5YLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe2EodGhpcy5vKX07ZnVuY3Rpb24gWShhLGIpe3RoaXMuZD1hO3RoaXMuZj1iO3RoaXMubz1bXX1ZLnByb3RvdHlwZS5MPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxkPWMuZi5wcm9qZWN0SWQsZT1jLmYudmVyc2lvbjtpZihkKXt2YXIgZj1jLmQudzt5KHRoaXMuZCxjLkkoZCxlKSxmdW5jdGlvbihlKXtpZihlKWIoITEpO2Vsc2V7aWYoZltcIl9fbXRpX2ZudExzdFwiK2RdJiYoZT1mW1wiX19tdGlfZm50THN0XCIrZF0oKSkpZm9yKHZhciBoPTA7aDxlLmxlbmd0aDtoKyspYy5vLnB1c2gobmV3IEsoZVtoXS5mb250ZmFtaWx5KSk7YihhLm0uUil9fSkuaWQ9XCJfX01vbm90eXBlQVBJU2NyaXB0X19cIitkfWVsc2UgYighMSl9O1kucHJvdG90eXBlLkk9ZnVuY3Rpb24oYSxiKXt2YXIgYz13KHRoaXMuZCksZD0odGhpcy5mLmFwaXx8XCJmYXN0LmZvbnRzLm5ldC9qc2FwaVwiKS5yZXBsYWNlKC9eLipodHRwKHM/KTooXFwvXFwvKT8vLFwiXCIpO3JldHVybiBjK1wiLy9cIitkK1wiL1wiK2ErXCIuanNcIisoYj9cIj92PVwiK2I6XCJcIil9O1xuWS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhKXthKHRoaXMubyl9O2Z1bmN0aW9uIFooYSxiKXt0aGlzLmQ9YTt0aGlzLmY9Yn1aLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3ZhciBiLGMsZD10aGlzLmYudXJsc3x8W10sZT10aGlzLmYuZmFtaWxpZXN8fFtdLGY9dGhpcy5mLnRlc3RTdHJpbmdzfHx7fTtiPTA7Zm9yKGM9ZC5sZW5ndGg7YjxjO2IrKyl4KHRoaXMuZCxkW2JdKTtkPVtdO2I9MDtmb3IoYz1lLmxlbmd0aDtiPGM7YisrKXt2YXIgZz1lW2JdLnNwbGl0KFwiOlwiKTtpZihnWzFdKWZvcih2YXIgaD1nWzFdLnNwbGl0KFwiLFwiKSxwPTA7cDxoLmxlbmd0aDtwKz0xKWQucHVzaChuZXcgSyhnWzBdLGhbcF0pKTtlbHNlIGQucHVzaChuZXcgSyhnWzBdKSl9YShkLGYpfTtaLnByb3RvdHlwZS5MPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGIoYS5tLlIpfTt2YXIgJD1uZXcgVShrKTskLnYuQS5jdXN0b209ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IFooYixhKX07JC52LkEuZm9udGRlY2s9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IFcoYixhKX07JC52LkEubW9ub3R5cGU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IFkoYixhKX07JC52LkEudHlwZWtpdD1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgWChiLGEpfTskLnYuQS5nb29nbGU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IFYoYixhKX07ay5XZWJGb250fHwoay5XZWJGb250PXt9LGsuV2ViRm9udC5sb2FkPW4oJC5sb2FkLCQpLGsuV2ViRm9udENvbmZpZyYmJC5sb2FkKGsuV2ViRm9udENvbmZpZykpO30pKHRoaXMsZG9jdW1lbnQpO1xuXG4iLCIkKCBmdW5jdGlvbigpIHtcblx0XHRcblx0JChcIi5wb3N0LXBsYWNlbWVudFwiKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uID0gJChcImFcIiwgdGhpcykuYXR0cihcImhyZWZcIik7XG5cdH0pO1xuXG59KTsiLCJ2YXIgYm9keUxJID0gW107XG5cbldlYkZvbnRDb25maWcgPSB7XG5cdGdvb2dsZToge1xuXHRcdGZhbWlsaWVzOiBbJ0FsZWdyZXlhK1NhbnM6MTAwLDQwMCw3MDAsNDAwaXRhbGljLDcwMGl0YWxpYyddXG5cdH0sXG5cdGFjdGl2ZTogZnVuY3Rpb24oKSB7XG5cdFx0JChcImJvZHkuaG9tZSB1bFwiKS5wYWNrZXJ5KHtcblx0XHRcdGl0ZW1TZWxlY3RvcjogJ2xpJyxcblx0XHRcdGd1dHRlcjogMzBcblx0XHR9KTtcblx0XHRib2R5TEkgPSAkKCdib2R5LmhvbWUgdWwgbGknKS5nZXQoKS5yZXZlcnNlKCk7XG5cdFx0ZmFkZUluKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZmFkZUluKCkge1xuXHR2YXIgZWxlbSA9IGJvZHlMSS5wb3AoKTtcblx0JChlbGVtKS5hZGRDbGFzcyhcInN0YXRlLWxvYWRlZFwiKTtcblx0aWYoYm9keUxJLmxlbmd0aCA+IDApIHtcblx0XHR3aW5kb3cuc2V0VGltZW91dChmYWRlSW4sIDUwKTtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
