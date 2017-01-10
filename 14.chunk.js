webpackJsonpac__name_([14],{

/***/ "./node_modules/jquery-ui/ui/core.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__("./node_modules/jquery/dist/jquery.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};

}));


/***/ },

/***/ "./node_modules/jquery-ui/ui/mouse.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Mouse 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
			__webpack_require__("./node_modules/jquery/dist/jquery.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/widget.js")
		], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

return $.widget("ui.mouse", {
	version: "1.11.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." + this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegate ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
				return this._mouseUp(event);

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {
				return this._mouseUp( event );
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		mouseHandled = false;
		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

}));


/***/ },

/***/ "./node_modules/jquery-ui/ui/sortable.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Sortable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/sortable/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
			__webpack_require__("./node_modules/jquery/dist/jquery.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/core.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/mouse.js"),
			__webpack_require__("./node_modules/jquery-ui/ui/widget.js")
		], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.widget("ui.sortable", $.ui.mouse, {
	version: "1.11.4",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},

	_isOverAxis: function( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	},

	_isFloating: function( item ) {
		return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
	},

	_create: function() {
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		this._setHandleClassName();

		//We're ready to go
		this.ready = true;

	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "handle" ) {
			this._setHandleClassName();
		}
	},

	_setHandleClassName: function() {
		this.element.find( ".ui-sortable-handle" ).removeClass( "ui-sortable-handle" );
		$.each( this.items, function() {
			( this.instance.options.handle ?
				this.item.find( this.instance.options.handle ) : this.item )
				.addClass( "ui-sortable-handle" );
		});
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-sortable ui-sortable-disabled" )
			.find( ".ui-sortable-handle" )
				.removeClass( "ui-sortable-handle" );
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}

		return this;
	},

	_mouseCapture: function(event, overrideHandle) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type === "static") {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$(event.target).parents().each(function() {
			if($.data(this, that.widgetName + "-item") === that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + "-item") === that) {
			currentItem = $(event.target);
		}

		if(!currentItem) {
			return false;
		}
		if(this.options.handle && !overrideHandle) {
			$(this.options.handle, currentItem).find("*").addBack().each(function() {
				if(this === event.target) {
					validHandle = true;
				}
			});
			if(!validHandle) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] !== this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment) {
			this._setContainment();
		}

		if( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet = $( "<style>*{ cursor: "+o.cursor+" !important; }</style>" ).appendTo( body );
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) {
				this._storedOpacity = this.helper.css("opacity");
			}
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) {
				this._storedZIndex = this.helper.css("zIndex");
			}
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions) {
			this._cacheHelperProportions();
		}


		//Post "activate" events to possible containers
		if( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if(event.pageY - this.document.scrollTop() < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed);
				} else if(this.window.height() - (event.pageY - this.document.scrollTop()) < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed);
				}

				if(event.pageX - this.document.scrollLeft() < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed);
				} else if(this.window.width() - (event.pageX - this.document.scrollLeft()) < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed);
				}

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(this, event);
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}

		//Rearrange
		for (i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[i];
			itemElement = item.item[0];
			intersection = this._intersectsWithPointer(item);
			if (!intersection) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items from other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter between the outer and inner container.
			if (item.instance !== this.currentContainer) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if (itemElement !== this.currentItem[0] &&
				this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
				!$.contains(this.placeholder[0], itemElement) &&
				(this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		//Call callbacks
		this._trigger("sort", event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			$.ui.ddmanager.drop(this, event);
		}

		if(this.options.revert) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop);
			}
			this.reverting = true;
			$(this.helper).animate( animation, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper === "original") {
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) {
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			}
			if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
				this.helper.remove();
			}

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			str = [];
		o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
			if (res) {
				str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
			}
		});

		if(!str.length && o.key) {
			str.push(o.key + "=");
		}

		return str.join("&");

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			ret = [];

		o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t && ( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l && ( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			(this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) && // Right Half
				x2 - (this.helperProportions.width / 2) < r && // Left Half
				t < y1 + (this.helperProportions.height / 2) && // Bottom Half
				y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === "x") || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === "y") || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) {
			return false;
		}

		return this.floating ?
			( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this._setHandleClassName();
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if(connectWith && connected) {
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for ( j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
					}
				}
			}
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

		function addItems() {
			items.push( this );
		}
		for (i = queries.length - 1; i >= 0; i--){
			queries[i][0].each( addItems );
		}

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] === item.item[0]) {
					return false;
				}
			}
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
			connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for (j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				}
			}
		}

		for (i = queries.length - 1; i >= 0; i--) {
			targetData = queries[i][1];
			_queries = queries[i][0];

			for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				item = $(_queries[j]);

				item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			}
		}

	},

	refreshPositions: function(fast) {

		// Determine whether items are being displayed horizontally
		this.floating = this.items.length ?
			this.options.axis === "x" || this._isFloating( this.items[ 0 ].item ) :
			false;

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		var i, item, t, p;

		for (i = this.items.length - 1; i >= 0; i--){
			item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
				continue;
			}

			t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (i = this.containers.length - 1; i >= 0; i--){
				p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			}
		}

		return this;
	},

	_createPlaceholder: function(that) {
		that = that || this;
		var className,
			o = that.options;

		if(!o.placeholder || o.placeholder.constructor === String) {
			className = o.placeholder;
			o.placeholder = {
				element: function() {

					var nodeName = that.currentItem[0].nodeName.toLowerCase(),
						element = $( "<" + nodeName + ">", that.document[0] )
							.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
							.removeClass("ui-sortable-helper");

					if ( nodeName === "tbody" ) {
						that._createTrPlaceholder(
							that.currentItem.find( "tr" ).eq( 0 ),
							$( "<tr>", that.document[ 0 ] ).appendTo( element )
						);
					} else if ( nodeName === "tr" ) {
						that._createTrPlaceholder( that.currentItem, element );
					} else if ( nodeName === "img" ) {
						element.attr( "src", that.currentItem.attr( "src" ) );
					}

					if ( !className ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) {
						return;
					}

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
				}
			};
		}

		//Create the placeholder
		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);

	},

	_createTrPlaceholder: function( sourceTr, targetTr ) {
		var that = this;

		sourceTr.children().each(function() {
			$( "<td>&#160;</td>", that.document[ 0 ] )
				.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
				.appendTo( targetTr );
		});
	},

	_contactContainers: function(event) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, cur, nearBottom, floating, axis,
			innermostContainer = null,
			innermostIndex = null;

		// get innermost container that intersects with item
		for (i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0])) {
				continue;
			}

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
					continue;
				}

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) {
			return;
		}

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			if (!this.containers[innermostIndex].containerCache.over) {
				this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
				this.containers[innermostIndex].containerCache.over = 1;
			}
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || this._isFloating(this.currentItem);
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			axis = floating ? "clientX" : "clientY";

			for (j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
					continue;
				}
				if(this.items[j].item[0] === this.currentItem[0]) {
					continue;
				}

				cur = this.items[j].item.offset()[posProperty];
				nearBottom = false;
				if ( event[ axis ] - cur > this.items[ j ][ sizeProperty ] / 2 ) {
					nearBottom = true;
				}

				if ( Math.abs( event[ axis ] - cur ) < dist ) {
					dist = Math.abs( event[ axis ] - cur );
					itemWithLeastDistance = this.items[ j ];
					this.direction = nearBottom ? "up": "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
				return;
			}

			if(this.currentContainer === this.containers[innermostIndex]) {
				if ( !this.currentContainer.containerCache.over ) {
					this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash() );
					this.currentContainer.containerCache.over = 1;
				}
				return;
			}

			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
			this.currentContainer = this.containers[innermostIndex];

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

		//Add the helper to the DOM if that didn't happen already
		if(!helper.parents("body").length) {
			$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
		}

		if(helper[0] === this.currentItem[0]) {
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
		}

		if(!helper[0].style.width || o.forceHelperSize) {
			helper.width(this.currentItem.width());
		}
		if(!helper[0].style.height || o.forceHelperSize) {
			helper.height(this.currentItem.height());
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this information
		// with an ugly IE fix
		if( this.offsetParent[0] === this.document[0].body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if(o.containment === "parent") {
			o.containment = this.helper[0].parentNode;
		}
		if(o.containment === "document" || o.containment === "window") {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				o.containment === "document" ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left,
				(o.containment === "document" ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
			];
		}

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			ce = $(o.containment)[0];
			co = $(o.containment).offset();
			over = ($(ce).css("overflow") !== "hidden");

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
			scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition === "relative" && !(this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) {
					pageX = this.containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < this.containment[1]) {
					pageY = this.containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > this.containment[2]) {
					pageX = this.containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > this.containment[3]) {
					pageY = this.containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																// The absolute mouse position
				this.offset.click.top -													// Click offset (relative to the element)
				this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX -																// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter === this.counter) {
				this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
			}
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) {
			this.placeholder.before(this.currentItem);
		}
		this._noFinalSort = null;

		if(this.helper[0] === this.currentItem[0]) {
			for(i in this._storedCSS) {
				if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
					this._storedCSS[i] = "";
				}
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		}
		if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		function delayEvent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uiHash( instance ) );
			};
		}
		for (i = this.containers.length - 1; i >= 0; i--){
			if (!noPropagation) {
				delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
			}
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if(this._storedOpacity) {
			this.helper.css("opacity", this._storedOpacity);
		}
		if(this._storedZIndex) {
			this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
		}

		this.dragging = false;

		if(!noPropagation) {
			this._trigger("beforeStop", event, this._uiHash());
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if ( !this.cancelHelperRemoval ) {
			if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
				this.helper.remove();
			}
			this.helper = null;
		}

		if(!noPropagation) {
			for (i=0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			} //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return !this.cancelHelperRemoval;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});

}));


/***/ },

/***/ "./node_modules/jquery-ui/ui/widget.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__("./node_modules/jquery/dist/jquery.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

return $.widget;

}));


/***/ },

/***/ "./node_modules/jquery.nestable/jquery.nestable.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */
;(function($, window, document, undefined)
{
    var hasTouch = 'ontouchstart' in document;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();

    var defaults = {
            listNodeName    : 'ol',
            itemNodeName    : 'li',
            rootClass       : 'dd',
            listClass       : 'dd-list',
            itemClass       : 'dd-item',
            dragClass       : 'dd-dragel',
            handleClass     : 'dd-handle',
            collapsedClass  : 'dd-collapsed',
            placeClass      : 'dd-placeholder',
            noDragClass     : 'dd-nodrag',
            emptyClass      : 'dd-empty',
            expandBtnHTML   : '<button data-action="expand" type="button">Expand</button>',
            collapseBtnHTML : '<button data-action="collapse" type="button">Collapse</button>',
            group           : 0,
            maxDepth        : 5,
            threshold       : 20
        };

    function Plugin(element, options)
    {
        this.w  = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function()
        {
            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function(k, el) {
                list.setParent($(el));
            });

            list.el.on('click', 'button', function(e) {
                if (list.dragEl) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item   = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });

            var onStartEvent = function(e)
            {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }

                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            var onMoveEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            var onEndEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener('touchstart', onStartEvent, false);
                window.addEventListener('touchmove', onMoveEvent, false);
                window.addEventListener('touchend', onEndEvent, false);
                window.addEventListener('touchcancel', onEndEvent, false);
            }

            list.el.on('mousedown', onStartEvent);
            list.w.on('mousemove', onMoveEvent);
            list.w.on('mouseup', onEndEvent);

        },

        serialize: function()
        {
            var data,
                depth = 0,
                list  = this;
                step  = function(level, depth)
                {
                    var array = [ ],
                        items = level.children(list.options.itemNodeName);
                    items.each(function()
                    {
                        var li   = $(this),
                            item = $.extend({}, li.data()),
                            sub  = li.children(list.options.listNodeName);
                        if (sub.length) {
                            item.children = step(sub, depth + 1);
                        }
                        array.push(item);
                    });
                    return array;
                };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function()
        {
            return this.serialize();
        },

        reset: function()
        {
            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.isTouch    = false;
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.hasNewRoot = false;
            this.pointEl    = null;
        },

        expandItem: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();
        },

        collapseItem: function(li)
        {
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }
        },

        expandAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.expandItem($(this));
            });
        },

        collapseAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.collapseItem($(this));
            });
        },

        setParent: function(li)
        {
            if (li.children(this.options.listNodeName).length) {
                li.prepend($(this.options.expandBtnHTML));
                li.prepend($(this.options.collapseBtnHTML));
            }
            li.children('[data-action="expand"]').hide();
        },

        unsetParent: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function(e)
        {
            var mouse    = this.mouse,
                target   = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function(e)
        {
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);

            this.dragEl.remove();
            this.el.trigger('change');
            if (this.hasNewRoot) {
                this.dragRootEl.trigger('change');
            }
            this.reset();
        },

        dragMove: function(e)
        {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx  = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            }
            else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                    parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                }
                else if (before) {
                    this.pointEl.before(this.placeEl);
                }
                else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function(params)
    {
        var lists  = this,
            retval = this;

        lists.each(function()
        {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(__webpack_provided_window_dot_jQuery || window.Zepto, window, document);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/messenger/build/js/messenger.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*! messenger 1.4.2 */
/*
 * This file begins the output concatenated into messenger.js
 *
 * It establishes the Messenger object while preserving whatever it was before
 * (for noConflict), and making it a callable function.
 */

(function(){
    var _prevMessenger = window.Messenger;
    var localMessenger;

    localMessenger = window.Messenger = function(){
        return localMessenger._call.apply(this, arguments);
    }

    window.Messenger.noConflict = function(){
        window.Messenger = _prevMessenger;

        return localMessenger;
    }
})();

/*
 * This file contains shims for when Underscore and Backbone
 * are not included.
 *
 * Portions taken from Underscore.js and Backbone.js
 * Both of which are Copyright (c) 2009-2013 Jeremy Ashkenas, DocumentCloud
 */
window.Messenger._ = (function() {
    if (window._)
        return window._

    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var push             = ArrayProto.push,
            slice            = ArrayProto.slice,
            concat           = ArrayProto.concat,
            toString         = ObjProto.toString,
            hasOwnProperty   = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
        nativeForEach      = ArrayProto.forEach,
        nativeMap          = ArrayProto.map,
        nativeReduce       = ArrayProto.reduce,
        nativeReduceRight  = ArrayProto.reduceRight,
        nativeFilter       = ArrayProto.filter,
        nativeEvery        = ArrayProto.every,
        nativeSome         = ArrayProto.some,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeLastIndexOf  = ArrayProto.lastIndexOf,
        nativeIsArray      = Array.isArray,
        nativeKeys         = Object.keys,
        nativeBind         = FuncProto.bind;

    // Create a safe reference to the Underscore object for use below.
    var _ = {};

    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
  
    var each = _.each = _.forEach = function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (_.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };

    _.result = function(object, property) {
        if (object == null) return null;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    };

    _.once = function(func) {
        var ran = false, memo;
        return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    _.filter = _.select = function(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
        each(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) results[results.length] = value;
        });
        return results;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    _.defaults = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] == null) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    _.extend = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    _.keys = nativeKeys || function(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
        return keys;
    };

    _.bind = function(func, context) {
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        var args = slice.call(arguments, 2);
        return function() {
            return func.apply(context, args.concat(slice.call(arguments)));
        };
    };

    _.isObject = function(obj) {
        return obj === Object(obj);
    };

    return _;
})();

window.Messenger.Events = (function() {
    if (window.Backbone && Backbone.Events) {
        return Backbone.Events;
    }

    var eventsShim = function() {
        var eventSplitter = /\s+/;

        var eventsApi = function(obj, action, name, rest) {
            if (!name) return true;
            if (typeof name === 'object') {
                for (var key in name) {
                    obj[action].apply(obj, [key, name[key]].concat(rest));
                }
            } else if (eventSplitter.test(name)) {
                var names = name.split(eventSplitter);
                for (var i = 0, l = names.length; i < l; i++) {
                    obj[action].apply(obj, [names[i]].concat(rest));
                }
            } else {
                return true;
            }
        };

        var triggerEvents = function(events, args) {
            var ev, i = -1, l = events.length;
            switch (args.length) {
            case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
            return;
            case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
            return;
            case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
            return;
            case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
            return;
            default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
            }
        };

        var Events = {

            on: function(name, callback, context) {
                if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
                this._events || (this._events = {});
                var list = this._events[name] || (this._events[name] = []);
                list.push({callback: callback, context: context, ctx: context || this});
                return this;
            },

            once: function(name, callback, context) {
                if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
                var self = this;
                var once = _.once(function() {
                    self.off(name, once);
                    callback.apply(this, arguments);
                });
                once._callback = callback;
                this.on(name, once, context);
                return this;
            },

            off: function(name, callback, context) {
                var list, ev, events, names, i, l, j, k;
                if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
                if (!name && !callback && !context) {
                    this._events = {};
                    return this;
                }

                names = name ? [name] : _.keys(this._events);
                for (i = 0, l = names.length; i < l; i++) {
                    name = names[i];
                    if (list = this._events[name]) {
                        events = [];
                        if (callback || context) {
                            for (j = 0, k = list.length; j < k; j++) {
                                ev = list[j];
                                if ((callback && callback !== ev.callback &&
                                                                 callback !== ev.callback._callback) ||
                                        (context && context !== ev.context)) {
                                    events.push(ev);
                                }
                            }
                        }
                        this._events[name] = events;
                    }
                }

                return this;
            },

            trigger: function(name) {
                if (!this._events) return this;
                var args = Array.prototype.slice.call(arguments, 1);
                if (!eventsApi(this, 'trigger', name, args)) return this;
                var events = this._events[name];
                var allEvents = this._events.all;
                if (events) triggerEvents(events, args);
                if (allEvents) triggerEvents(allEvents, arguments);
                return this;
            },

            listenTo: function(obj, name, callback) {
                var listeners = this._listeners || (this._listeners = {});
                var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
                listeners[id] = obj;
                obj.on(name, typeof name === 'object' ? this : callback, this);
                return this;
            },

            stopListening: function(obj, name, callback) {
                var listeners = this._listeners;
                if (!listeners) return;
                if (obj) {
                    obj.off(name, typeof name === 'object' ? this : callback, this);
                    if (!name && !callback) delete listeners[obj._listenerId];
                } else {
                    if (typeof name === 'object') callback = this;
                    for (var id in listeners) {
                        listeners[id].off(name, callback, this);
                    }
                    this._listeners = {};
                }
                return this;
            }
        };

        Events.bind   = Events.on;
        Events.unbind = Events.off;
        return Events;
    };
    return eventsShim();
})();

(function() {
  var $, ActionMessenger, BaseView, Events, RetryingMessage, _, _Message, _Messenger, _ref, _ref1, _ref2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  _ = (_ref = window._) != null ? _ref : window.Messenger._;

  Events = (_ref1 = typeof Backbone !== "undefined" && Backbone !== null ? Backbone.Events : void 0) != null ? _ref1 : window.Messenger.Events;

  BaseView = (function() {

    function BaseView(options) {
      $.extend(this, Events);
      if (_.isObject(options)) {
        if (options.el) {
          this.setElement(options.el);
        }
        this.model = options.model;
      }
      this.initialize.apply(this, arguments);
    }

    BaseView.prototype.setElement = function(el) {
      this.$el = $(el);
      return this.el = this.$el[0];
    };

    BaseView.prototype.delegateEvents = function(events) {
      var delegateEventSplitter, eventName, key, match, method, selector, _results;
      if (!(events || (events = _.result(this, "events")))) {
        return;
      }
      this.undelegateEvents();
      delegateEventSplitter = /^(\S+)\s*(.*)$/;
      _results = [];
      for (key in events) {
        method = events[key];
        if (!_.isFunction(method)) {
          method = this[events[key]];
        }
        if (!method) {
          throw new Error("Method \"" + events[key] + "\" does not exist");
        }
        match = key.match(delegateEventSplitter);
        eventName = match[1];
        selector = match[2];
        method = _.bind(method, this);
        eventName += ".delegateEvents" + this.cid;
        if (selector === '') {
          _results.push(this.jqon(eventName, method));
        } else {
          _results.push(this.jqon(eventName, selector, method));
        }
      }
      return _results;
    };

    BaseView.prototype.jqon = function(eventName, selector, method) {
      var _ref2;
      if (this.$el.on != null) {
        return (_ref2 = this.$el).on.apply(_ref2, arguments);
      } else {
        if (!(method != null)) {
          method = selector;
          selector = void 0;
        }
        if (selector != null) {
          return this.$el.delegate(selector, eventName, method);
        } else {
          return this.$el.bind(eventName, method);
        }
      }
    };

    BaseView.prototype.jqoff = function(eventName) {
      var _ref2;
      if (this.$el.off != null) {
        return (_ref2 = this.$el).off.apply(_ref2, arguments);
      } else {
        this.$el.undelegate();
        return this.$el.unbind(eventName);
      }
    };

    BaseView.prototype.undelegateEvents = function() {
      return this.jqoff(".delegateEvents" + this.cid);
    };

    BaseView.prototype.remove = function() {
      this.undelegateEvents();
      return this.$el.remove();
    };

    return BaseView;

  })();

  _Message = (function(_super) {

    __extends(_Message, _super);

    function _Message() {
      return _Message.__super__.constructor.apply(this, arguments);
    }

    _Message.prototype.defaults = {
      hideAfter: 10,
      scroll: true,
      closeButtonText: "&times;",
      escapeText: false
    };

    _Message.prototype.initialize = function(opts) {
      if (opts == null) {
        opts = {};
      }
      this.shown = false;
      this.rendered = false;
      this.messenger = opts.messenger;
      return this.options = $.extend({}, this.options, opts, this.defaults);
    };

    _Message.prototype.show = function() {
      var wasShown;
      if (!this.rendered) {
        this.render();
      }
      this.$message.removeClass('messenger-hidden');
      wasShown = this.shown;
      this.shown = true;
      if (!wasShown) {
        return this.trigger('show');
      }
    };

    _Message.prototype.hide = function() {
      var wasShown;
      if (!this.rendered) {
        return;
      }
      this.$message.addClass('messenger-hidden');
      wasShown = this.shown;
      this.shown = false;
      if (wasShown) {
        return this.trigger('hide');
      }
    };

    _Message.prototype.cancel = function() {
      return this.hide();
    };

    _Message.prototype.update = function(opts) {
      var _ref2,
        _this = this;
      if (_.isString(opts)) {
        opts = {
          message: opts
        };
      }
      $.extend(this.options, opts);
      this.lastUpdate = new Date();
      this.rendered = false;
      this.events = (_ref2 = this.options.events) != null ? _ref2 : {};
      this.render();
      this.actionsToEvents();
      this.delegateEvents();
      this.checkClickable();
      if (this.options.hideAfter) {
        this.$message.addClass('messenger-will-hide-after');
        if (this._hideTimeout != null) {
          clearTimeout(this._hideTimeout);
        }
        this._hideTimeout = setTimeout(function() {
          return _this.hide();
        }, this.options.hideAfter * 1000);
      } else {
        this.$message.removeClass('messenger-will-hide-after');
      }
      if (this.options.hideOnNavigate) {
        this.$message.addClass('messenger-will-hide-on-navigate');
        if ((typeof Backbone !== "undefined" && Backbone !== null ? Backbone.history : void 0) != null) {
          Backbone.history.on('route', function() {
            return _this.hide();
          });
        }
      } else {
        this.$message.removeClass('messenger-will-hide-on-navigate');
      }
      return this.trigger('update', this);
    };

    _Message.prototype.scrollTo = function() {
      if (!this.options.scroll) {
        return;
      }
      return $.scrollTo(this.$el, {
        duration: 400,
        offset: {
          left: 0,
          top: -20
        }
      });
    };

    _Message.prototype.timeSinceUpdate = function() {
      if (this.lastUpdate) {
        return (new Date) - this.lastUpdate;
      } else {
        return null;
      }
    };

    _Message.prototype.actionsToEvents = function() {
      var act, name, _ref2, _results,
        _this = this;
      _ref2 = this.options.actions;
      _results = [];
      for (name in _ref2) {
        act = _ref2[name];
        _results.push(this.events["click [data-action=\"" + name + "\"] a"] = (function(act) {
          return function(e) {
            e.preventDefault();
            e.stopPropagation();
            _this.trigger("action:" + name, act, e);
            return act.action.call(_this, e, _this);
          };
        })(act));
      }
      return _results;
    };

    _Message.prototype.checkClickable = function() {
      var evt, name, _ref2, _results;
      _ref2 = this.events;
      _results = [];
      for (name in _ref2) {
        evt = _ref2[name];
        if (name === 'click') {
          _results.push(this.$message.addClass('messenger-clickable'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    _Message.prototype.undelegateEvents = function() {
      var _ref2;
      _Message.__super__.undelegateEvents.apply(this, arguments);
      return (_ref2 = this.$message) != null ? _ref2.removeClass('messenger-clickable') : void 0;
    };

    _Message.prototype.parseActions = function() {
      var act, actions, n_act, name, _ref2, _ref3;
      actions = [];
      _ref2 = this.options.actions;
      for (name in _ref2) {
        act = _ref2[name];
        n_act = $.extend({}, act);
        n_act.name = name;
        if ((_ref3 = n_act.label) == null) {
          n_act.label = name;
        }
        actions.push(n_act);
      }
      return actions;
    };

    _Message.prototype.template = function(opts) {
      var $action, $actions, $cancel, $link, $message, $text, action, _i, _len, _ref2,
        _this = this;
      $message = $("<div class='messenger-message message alert " + opts.type + " message-" + opts.type + " alert-" + opts.type + "'>");
      if (opts.showCloseButton) {
        $cancel = $('<button type="button" class="messenger-close" data-dismiss="alert">');
        $cancel.html(opts.closeButtonText);
        $cancel.click(function() {
          _this.cancel();
          return true;
        });
        $message.append($cancel);
      }
      if (opts.escapeText) {
        $text = $('<div class="messenger-message-inner"></div>').text(opts.message);
      } else {
        $text = $("<div class=\"messenger-message-inner\">" + opts.message + "</div>");
      }
      $message.append($text);
      if (opts.actions.length) {
        $actions = $('<div class="messenger-actions">');
      }
      _ref2 = opts.actions;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        action = _ref2[_i];
        $action = $('<span>');
        $action.attr('data-action', "" + action.name);
        $link = $('<a>');
        $link.html(action.label);
        $action.append($('<span class="messenger-phrase">'));
        $action.append($link);
        $actions.append($action);
      }
      $message.append($actions);
      return $message;
    };

    _Message.prototype.render = function() {
      var opts;
      if (this.rendered) {
        return;
      }
      if (!this._hasSlot) {
        this.setElement(this.messenger._reserveMessageSlot(this));
        this._hasSlot = true;
      }
      opts = $.extend({}, this.options, {
        actions: this.parseActions()
      });
      this.$message = $(this.template(opts));
      this.$el.html(this.$message);
      this.shown = true;
      this.rendered = true;
      return this.trigger('render');
    };

    return _Message;

  })(BaseView);

  RetryingMessage = (function(_super) {

    __extends(RetryingMessage, _super);

    function RetryingMessage() {
      return RetryingMessage.__super__.constructor.apply(this, arguments);
    }

    RetryingMessage.prototype.initialize = function() {
      RetryingMessage.__super__.initialize.apply(this, arguments);
      return this._timers = {};
    };

    RetryingMessage.prototype.cancel = function() {
      this.clearTimers();
      this.hide();
      if ((this._actionInstance != null) && (this._actionInstance.abort != null)) {
        return this._actionInstance.abort();
      }
    };

    RetryingMessage.prototype.clearTimers = function() {
      var name, timer, _ref2, _ref3;
      _ref2 = this._timers;
      for (name in _ref2) {
        timer = _ref2[name];
        clearTimeout(timer);
      }
      this._timers = {};
      return (_ref3 = this.$message) != null ? _ref3.removeClass('messenger-retry-soon messenger-retry-later') : void 0;
    };

    RetryingMessage.prototype.render = function() {
      var action, name, _ref2, _results;
      RetryingMessage.__super__.render.apply(this, arguments);
      this.clearTimers();
      _ref2 = this.options.actions;
      _results = [];
      for (name in _ref2) {
        action = _ref2[name];
        if (action.auto) {
          _results.push(this.startCountdown(name, action));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    RetryingMessage.prototype.renderPhrase = function(action, time) {
      var phrase;
      phrase = action.phrase.replace('TIME', this.formatTime(time));
      return phrase;
    };

    RetryingMessage.prototype.formatTime = function(time) {
      var pluralize;
      pluralize = function(num, str) {
        num = Math.floor(num);
        if (num !== 1) {
          str = str + 's';
        }
        return 'in ' + num + ' ' + str;
      };
      if (Math.floor(time) === 0) {
        return 'now...';
      }
      if (time < 60) {
        return pluralize(time, 'second');
      }
      time /= 60;
      if (time < 60) {
        return pluralize(time, 'minute');
      }
      time /= 60;
      return pluralize(time, 'hour');
    };

    RetryingMessage.prototype.startCountdown = function(name, action) {
      var $phrase, remaining, tick, _ref2,
        _this = this;
      if (this._timers[name] != null) {
        return;
      }
      $phrase = this.$message.find("[data-action='" + name + "'] .messenger-phrase");
      remaining = (_ref2 = action.delay) != null ? _ref2 : 3;
      if (remaining <= 10) {
        this.$message.removeClass('messenger-retry-later');
        this.$message.addClass('messenger-retry-soon');
      } else {
        this.$message.removeClass('messenger-retry-soon');
        this.$message.addClass('messenger-retry-later');
      }
      tick = function() {
        var delta;
        $phrase.text(_this.renderPhrase(action, remaining));
        if (remaining > 0) {
          delta = Math.min(remaining, 1);
          remaining -= delta;
          return _this._timers[name] = setTimeout(tick, delta * 1000);
        } else {
          _this.$message.removeClass('messenger-retry-soon messenger-retry-later');
          delete _this._timers[name];
          return action.action();
        }
      };
      return tick();
    };

    return RetryingMessage;

  })(_Message);

  _Messenger = (function(_super) {

    __extends(_Messenger, _super);

    function _Messenger() {
      return _Messenger.__super__.constructor.apply(this, arguments);
    }

    _Messenger.prototype.tagName = 'ul';

    _Messenger.prototype.className = 'messenger';

    _Messenger.prototype.messageDefaults = {
      type: 'info'
    };

    _Messenger.prototype.initialize = function(options) {
      this.options = options != null ? options : {};
      this.history = [];
      return this.messageDefaults = $.extend({}, this.messageDefaults, this.options.messageDefaults);
    };

    _Messenger.prototype.render = function() {
      return this.updateMessageSlotClasses();
    };

    _Messenger.prototype.findById = function(id) {
      return _.filter(this.history, function(rec) {
        return rec.msg.options.id === id;
      });
    };

    _Messenger.prototype._reserveMessageSlot = function(msg) {
      var $slot, dmsg,
        _this = this;
      $slot = $('<li>');
      $slot.addClass('messenger-message-slot');
      this.$el.prepend($slot);
      this.history.push({
        msg: msg,
        $slot: $slot
      });
      this._enforceIdConstraint(msg);
      msg.on('update', function() {
        return _this._enforceIdConstraint(msg);
      });
      while (this.options.maxMessages && this.history.length > this.options.maxMessages) {
        dmsg = this.history.shift();
        dmsg.msg.remove();
        dmsg.$slot.remove();
      }
      return $slot;
    };

    _Messenger.prototype._enforceIdConstraint = function(msg) {
      var entry, _i, _len, _msg, _ref2;
      if (msg.options.id == null) {
        return;
      }
      _ref2 = this.history;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        entry = _ref2[_i];
        _msg = entry.msg;
        if ((_msg.options.id != null) && _msg.options.id === msg.options.id && msg !== _msg) {
          if (msg.options.singleton) {
            msg.hide();
            return;
          } else {
            _msg.hide();
          }
        }
      }
    };

    _Messenger.prototype.newMessage = function(opts) {
      var msg, _ref2, _ref3, _ref4,
        _this = this;
      if (opts == null) {
        opts = {};
      }
      opts.messenger = this;
      _Message = (_ref2 = (_ref3 = Messenger.themes[(_ref4 = opts.theme) != null ? _ref4 : this.options.theme]) != null ? _ref3.Message : void 0) != null ? _ref2 : RetryingMessage;
      msg = new _Message(opts);
      msg.on('show', function() {
        if (opts.scrollTo && _this.$el.css('position') !== 'fixed') {
          return msg.scrollTo();
        }
      });
      msg.on('hide show render', this.updateMessageSlotClasses, this);
      return msg;
    };

    _Messenger.prototype.updateMessageSlotClasses = function() {
      var anyShown, last, rec, willBeFirst, _i, _len, _ref2;
      willBeFirst = true;
      last = null;
      anyShown = false;
      _ref2 = this.history;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        rec = _ref2[_i];
        rec.$slot.removeClass('messenger-first messenger-last messenger-shown');
        if (rec.msg.shown && rec.msg.rendered) {
          rec.$slot.addClass('messenger-shown');
          anyShown = true;
          last = rec;
          if (willBeFirst) {
            willBeFirst = false;
            rec.$slot.addClass('messenger-first');
          }
        }
      }
      if (last != null) {
        last.$slot.addClass('messenger-last');
      }
      return this.$el["" + (anyShown ? 'remove' : 'add') + "Class"]('messenger-empty');
    };

    _Messenger.prototype.hideAll = function() {
      var rec, _i, _len, _ref2, _results;
      _ref2 = this.history;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        rec = _ref2[_i];
        _results.push(rec.msg.hide());
      }
      return _results;
    };

    _Messenger.prototype.post = function(opts) {
      var msg;
      if (_.isString(opts)) {
        opts = {
          message: opts
        };
      }
      opts = $.extend(true, {}, this.messageDefaults, opts);
      msg = this.newMessage(opts);
      msg.update(opts);
      return msg;
    };

    return _Messenger;

  })(BaseView);

  ActionMessenger = (function(_super) {

    __extends(ActionMessenger, _super);

    function ActionMessenger() {
      return ActionMessenger.__super__.constructor.apply(this, arguments);
    }

    ActionMessenger.prototype.doDefaults = {
      progressMessage: null,
      successMessage: null,
      errorMessage: "Error connecting to the server.",
      showSuccessWithoutError: true,
      retry: {
        auto: true,
        allow: true
      },
      action: $.ajax
    };

    ActionMessenger.prototype.hookBackboneAjax = function(msgr_opts) {
      var _ajax,
        _this = this;
      if (msgr_opts == null) {
        msgr_opts = {};
      }
      if (!(window.Backbone != null)) {
        throw 'Expected Backbone to be defined';
      }
      msgr_opts = _.defaults(msgr_opts, {
        id: 'BACKBONE_ACTION',
        errorMessage: false,
        successMessage: "Request completed successfully.",
        showSuccessWithoutError: false
      });
      _ajax = function(options) {
        var sync_msgr_opts;
        sync_msgr_opts = _.extend({}, msgr_opts, options.messenger);
        return _this["do"](sync_msgr_opts, options);
      };
      if (Backbone.ajax != null) {
        if (Backbone.ajax._withoutMessenger) {
          Backbone.ajax = Backbone.ajax._withoutMessenger;
        }
        if (!(msgr_opts.action != null) || msgr_opts.action === this.doDefaults.action) {
          msgr_opts.action = Backbone.ajax;
        }
        _ajax._withoutMessenger = Backbone.ajax;
        return Backbone.ajax = _ajax;
      } else {
        return Backbone.sync = _.wrap(Backbone.sync, function() {
          var args, _old_ajax, _old_sync;
          _old_sync = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          _old_ajax = $.ajax;
          $.ajax = _ajax;
          _old_sync.call.apply(_old_sync, [this].concat(__slice.call(args)));
          return $.ajax = _old_ajax;
        });
      }
    };

    ActionMessenger.prototype._getHandlerResponse = function(returnVal) {
      if (returnVal === false) {
        return false;
      }
      if (returnVal === true || !(returnVal != null)) {
        return true;
      }
      return returnVal;
    };

    ActionMessenger.prototype._parseEvents = function(events) {
      var desc, firstSpace, func, label, out, type, _ref2;
      if (events == null) {
        events = {};
      }
      out = {};
      for (label in events) {
        func = events[label];
        firstSpace = label.indexOf(' ');
        type = label.substring(0, firstSpace);
        desc = label.substring(firstSpace + 1);
        if ((_ref2 = out[type]) == null) {
          out[type] = {};
        }
        out[type][desc] = func;
      }
      return out;
    };

    ActionMessenger.prototype._normalizeResponse = function() {
      var data, elem, resp, type, xhr, _i, _len;
      resp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      type = null;
      xhr = null;
      data = null;
      for (_i = 0, _len = resp.length; _i < _len; _i++) {
        elem = resp[_i];
        if (elem === 'success' || elem === 'timeout' || elem === 'abort') {
          type = elem;
        } else if (((elem != null ? elem.readyState : void 0) != null) && ((elem != null ? elem.responseText : void 0) != null)) {
          xhr = elem;
        } else if (_.isObject(elem)) {
          data = elem;
        }
      }
      return [type, data, xhr];
    };

    ActionMessenger.prototype.run = function() {
      var args, events, getMessageText, handler, handlers, m_opts, msg, old, opts, type, _ref2,
        _this = this;
      m_opts = arguments[0], opts = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (opts == null) {
        opts = {};
      }
      m_opts = $.extend(true, {}, this.messageDefaults, this.doDefaults, m_opts != null ? m_opts : {});
      events = this._parseEvents(m_opts.events);
      getMessageText = function(type, xhr) {
        var message;
        message = m_opts[type + 'Message'];
        if (_.isFunction(message)) {
          return message.call(_this, type, xhr);
        }
        return message;
      };
      msg = (_ref2 = m_opts.messageInstance) != null ? _ref2 : this.newMessage(m_opts);
      if (m_opts.id != null) {
        msg.options.id = m_opts.id;
      }
      if (m_opts.progressMessage != null) {
        msg.update($.extend({}, m_opts, {
          message: getMessageText('progress', null),
          type: 'info'
        }));
      }
      handlers = {};
      _.each(['error', 'success'], function(type) {
        var originalHandler;
        originalHandler = opts[type];
        return handlers[type] = function() {
          var data, defaultOpts, handlerResp, msgOpts, reason, resp, responseOpts, xhr, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
          resp = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _ref3 = _this._normalizeResponse.apply(_this, resp), reason = _ref3[0], data = _ref3[1], xhr = _ref3[2];
          if (type === 'success' && !(msg.errorCount != null) && m_opts.showSuccessWithoutError === false) {
            m_opts['successMessage'] = null;
          }
          if (type === 'error') {
            if ((_ref4 = m_opts.errorCount) == null) {
              m_opts.errorCount = 0;
            }
            m_opts.errorCount += 1;
          }
          handlerResp = m_opts.returnsPromise ? resp[0] : typeof originalHandler === "function" ? originalHandler.apply(null, resp) : void 0;
          responseOpts = _this._getHandlerResponse(handlerResp);
          if (_.isString(responseOpts)) {
            responseOpts = {
              message: responseOpts
            };
          }
          if (type === 'error' && ((xhr != null ? xhr.status : void 0) === 0 || reason === 'abort')) {
            msg.hide();
            return;
          }
          if (type === 'error' && ((m_opts.ignoredErrorCodes != null) && (_ref5 = xhr != null ? xhr.status : void 0, __indexOf.call(m_opts.ignoredErrorCodes, _ref5) >= 0))) {
            msg.hide();
            return;
          }
          defaultOpts = {
            message: getMessageText(type, xhr),
            type: type,
            events: (_ref6 = events[type]) != null ? _ref6 : {},
            hideOnNavigate: type === 'success'
          };
          msgOpts = $.extend({}, m_opts, defaultOpts, responseOpts);
          if (typeof ((_ref7 = msgOpts.retry) != null ? _ref7.allow : void 0) === 'number') {
            msgOpts.retry.allow--;
          }
          if (type === 'error' && (xhr != null ? xhr.status : void 0) >= 500 && ((_ref8 = msgOpts.retry) != null ? _ref8.allow : void 0)) {
            if (msgOpts.retry.delay == null) {
              if (msgOpts.errorCount < 4) {
                msgOpts.retry.delay = 10;
              } else {
                msgOpts.retry.delay = 5 * 60;
              }
            }
            if (msgOpts.hideAfter) {
              if ((_ref9 = msgOpts._hideAfter) == null) {
                msgOpts._hideAfter = msgOpts.hideAfter;
              }
              msgOpts.hideAfter = msgOpts._hideAfter + msgOpts.retry.delay;
            }
            msgOpts._retryActions = true;
            msgOpts.actions = {
              retry: {
                label: 'retry now',
                phrase: 'Retrying TIME',
                auto: msgOpts.retry.auto,
                delay: msgOpts.retry.delay,
                action: function() {
                  msgOpts.messageInstance = msg;
                  return setTimeout(function() {
                    return _this["do"].apply(_this, [msgOpts, opts].concat(__slice.call(args)));
                  }, 0);
                }
              },
              cancel: {
                action: function() {
                  return msg.cancel();
                }
              }
            };
          } else if (msgOpts._retryActions) {
            delete msgOpts.actions.retry;
            delete msgOpts.actions.cancel;
            delete m_opts._retryActions;
          }
          msg.update(msgOpts);
          if (responseOpts && msgOpts.message) {
            Messenger(_.extend({}, _this.options, {
              instance: _this
            }));
            return msg.show();
          } else {
            return msg.hide();
          }
        };
      });
      if (!m_opts.returnsPromise) {
        for (type in handlers) {
          handler = handlers[type];
          old = opts[type];
          opts[type] = handler;
        }
      }
      msg._actionInstance = m_opts.action.apply(m_opts, [opts].concat(__slice.call(args)));
      if (m_opts.returnsPromise) {
        msg._actionInstance.then(handlers.success, handlers.error);
      }
      return msg;
    };

    ActionMessenger.prototype["do"] = ActionMessenger.prototype.run;

    ActionMessenger.prototype.ajax = function() {
      var args, m_opts;
      m_opts = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      m_opts.action = $.ajax;
      return this.run.apply(this, [m_opts].concat(__slice.call(args)));
    };

    ActionMessenger.prototype.expectPromise = function(action, m_opts) {
      m_opts = _.extend({}, m_opts, {
        action: action,
        returnsPromise: true
      });
      return this.run(m_opts);
    };

    ActionMessenger.prototype.error = function(m_opts) {
      if (m_opts == null) {
        m_opts = {};
      }
      if (typeof m_opts === 'string') {
        m_opts = {
          message: m_opts
        };
      }
      m_opts.type = 'error';
      return this.post(m_opts);
    };

    ActionMessenger.prototype.info = function(m_opts) {
      if (m_opts == null) {
        m_opts = {};
      }
      if (typeof m_opts === 'string') {
        m_opts = {
          message: m_opts
        };
      }
      m_opts.type = 'info';
      return this.post(m_opts);
    };

    ActionMessenger.prototype.success = function(m_opts) {
      if (m_opts == null) {
        m_opts = {};
      }
      if (typeof m_opts === 'string') {
        m_opts = {
          message: m_opts
        };
      }
      m_opts.type = 'success';
      return this.post(m_opts);
    };

    return ActionMessenger;

  })(_Messenger);

  $.fn.messenger = function() {
    var $el, args, func, instance, opts, _ref2, _ref3, _ref4;
    func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (func == null) {
      func = {};
    }
    $el = this;
    if (!(func != null) || !_.isString(func)) {
      opts = func;
      if (!($el.data('messenger') != null)) {
        _Messenger = (_ref2 = (_ref3 = Messenger.themes[opts.theme]) != null ? _ref3.Messenger : void 0) != null ? _ref2 : ActionMessenger;
        $el.data('messenger', instance = new _Messenger($.extend({
          el: $el
        }, opts)));
        instance.render();
      }
      return $el.data('messenger');
    } else {
      return (_ref4 = $el.data('messenger'))[func].apply(_ref4, args);
    }
  };

  window.Messenger._call = function(opts) {
    var $el, $parent, choosen_loc, chosen_loc, classes, defaultOpts, inst, loc, locations, _i, _len;
    defaultOpts = {
      extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
      theme: 'future',
      maxMessages: 9,
      parentLocations: ['body']
    };
    opts = $.extend(defaultOpts, $._messengerDefaults, Messenger.options, opts);
    if (opts.theme != null) {
      opts.extraClasses += " messenger-theme-" + opts.theme;
    }
    inst = opts.instance || Messenger.instance;
    if (opts.instance == null) {
      locations = opts.parentLocations;
      $parent = null;
      choosen_loc = null;
      for (_i = 0, _len = locations.length; _i < _len; _i++) {
        loc = locations[_i];
        $parent = $(loc);
        if ($parent.length) {
          chosen_loc = loc;
          break;
        }
      }
      if (!inst) {
        $el = $('<ul>');
        $parent.prepend($el);
        inst = $el.messenger(opts);
        inst._location = chosen_loc;
        Messenger.instance = inst;
      } else if (!$(inst._location).is($(chosen_loc))) {
        inst.$el.detach();
        $parent.prepend(inst.$el);
      }
    }
    if (inst._addedClasses != null) {
      inst.$el.removeClass(inst._addedClasses);
    }
    inst.$el.addClass(classes = "" + inst.className + " " + opts.extraClasses);
    inst._addedClasses = classes;
    return inst;
  };

  $.extend(Messenger, {
    Message: RetryingMessage,
    Messenger: ActionMessenger,
    themes: (_ref2 = Messenger.themes) != null ? _ref2 : {}
  });

  $.globalMessenger = window.Messenger = Messenger;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/ng2-ckeditor/lib/ckeditor.component.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
// Imports
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
/**
 * CKEditor component
 * Usage :
 *  <ckeditor [(ngModel)]="data" [config]="{...}" debounce="500"></ckeditor>
 */
var CKEditorComponent = (function () {
    /**
     * Constructor
     */
    function CKEditorComponent(zone) {
        this.change = new core_1.EventEmitter();
        this.ready = new core_1.EventEmitter();
        this.blur = new core_1.EventEmitter();
        this.focus = new core_1.EventEmitter();
        this._value = '';
        this.zone = zone;
    }
    Object.defineProperty(CKEditorComponent.prototype, "value", {
        get: function () { return this._value; },
        set: function (v) {
            if (v !== this._value) {
                this._value = v;
                this.onChange(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * On component destroy
     */
    CKEditorComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        if (this.instance) {
            setTimeout(function () {
                _this.instance.removeAllListeners();
                _this.instance.destroy();
                _this.instance = null;
            });
        }
    };
    /**
     * On component view init
     */
    CKEditorComponent.prototype.ngAfterViewInit = function () {
        // Configuration
        this.ckeditorInit(this.config || {});
    };
    /**
     * Value update process
     */
    CKEditorComponent.prototype.updateValue = function (value) {
        var _this = this;
        this.zone.run(function () {
            _this.value = value;
            _this.onChange(value);
            _this.onTouched();
            _this.change.emit(value);
        });
    };
    /**
     * CKEditor init
     */
    CKEditorComponent.prototype.ckeditorInit = function (config) {
        var _this = this;
        if (!CKEDITOR) {
            console.error('Please include CKEditor in your page');
            return;
        }
        // CKEditor replace textarea
        this.instance = CKEDITOR.replace(this.host.nativeElement, config);
        // Set initial value
        this.instance.setData(this.value);
        // listen for instanceReady event
        this.instance.on('instanceReady', function (evt) {
            // send the evt to the EventEmitter
            _this.ready.emit(evt);
        });
        // CKEditor change event
        this.instance.on('change', function () {
            _this.onTouched();
            var value = _this.instance.getData();
            // Debounce update
            if (_this.debounce) {
                if (_this.debounceTimeout)
                    clearTimeout(_this.debounceTimeout);
                _this.debounceTimeout = setTimeout(function () {
                    _this.updateValue(value);
                    _this.debounceTimeout = null;
                }, parseInt(_this.debounce));
            }
            else {
                _this.updateValue(value);
            }
        });
        // CKEditor blur event
        this.instance.on('blur', function (evt) {
            _this.blur.emit(evt);
        });
        // CKEditor focus event
        this.instance.on('focus', function (evt) {
            _this.focus.emit(evt);
        });
    };
    /**
     * Implements ControlValueAccessor
     */
    CKEditorComponent.prototype.writeValue = function (value) {
        this._value = value;
        if (this.instance)
            this.instance.setData(value);
    };
    CKEditorComponent.prototype.onChange = function (_) { };
    CKEditorComponent.prototype.onTouched = function () { };
    CKEditorComponent.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    CKEditorComponent.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    CKEditorComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ckeditor',
                    providers: [
                        {
                            provide: forms_1.NG_VALUE_ACCESSOR,
                            useExisting: core_1.forwardRef(function () { return CKEditorComponent; }),
                            multi: true
                        }
                    ],
                    template: "<textarea #host></textarea>",
                },] },
    ];
    /** @nocollapse */
    CKEditorComponent.ctorParameters = [
        { type: core_1.NgZone, },
    ];
    CKEditorComponent.propDecorators = {
        'config': [{ type: core_1.Input },],
        'debounce': [{ type: core_1.Input },],
        'change': [{ type: core_1.Output },],
        'ready': [{ type: core_1.Output },],
        'blur': [{ type: core_1.Output },],
        'focus': [{ type: core_1.Output },],
        'host': [{ type: core_1.ViewChild, args: ['host',] },],
        'value': [{ type: core_1.Input },],
    };
    return CKEditorComponent;
}());
exports.CKEditorComponent = CKEditorComponent;
//# sourceMappingURL=ckeditor.component.js.map

/***/ },

/***/ "./node_modules/ng2-ckeditor/lib/ckeditor.module.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var ckeditor_component_1 = __webpack_require__("./node_modules/ng2-ckeditor/lib/ckeditor.component.js");
/**
 * CKEditorModule
 */
var CKEditorModule = (function () {
    function CKEditorModule() {
    }
    CKEditorModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        ckeditor_component_1.CKEditorComponent,
                    ],
                    exports: [
                        ckeditor_component_1.CKEditorComponent,
                    ]
                },] },
    ];
    /** @nocollapse */
    CKEditorModule.ctorParameters = [];
    return CKEditorModule;
}());
exports.CKEditorModule = CKEditorModule;
//# sourceMappingURL=ckeditor.module.js.map

/***/ },

/***/ "./node_modules/ng2-ckeditor/lib/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var ckeditor_module_1 = __webpack_require__("./node_modules/ng2-ckeditor/lib/ckeditor.module.js");
exports.CKEditorModule = ckeditor_module_1.CKEditorModule;
var ckeditor_component_1 = __webpack_require__("./node_modules/ng2-ckeditor/lib/ckeditor.component.js");
exports.CKEditorComponent = ckeditor_component_1.CKEditorComponent;
//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/ng2-modal/Modal.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Modal = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function Modal() {
        this.closeOnEscape = true;
        this.closeOnOutsideClick = true;
        this.hideCloseButton = false;
        // -------------------------------------------------------------------------
        // Outputs
        // -------------------------------------------------------------------------
        this.onOpen = new core_1.EventEmitter(false);
        this.onClose = new core_1.EventEmitter(false);
        this.onSubmit = new core_1.EventEmitter(false);
        // -------------------------------------------------------------------------
        // Public properties
        // -------------------------------------------------------------------------
        this.isOpened = false;
        this.createBackDrop();
    }
    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------
    Modal.prototype.ngOnDestroy = function () {
        document.body.className = document.body.className.replace(/modal-open\b/, "");
        if (this.backdropElement && this.backdropElement.parentNode === document.body)
            document.body.removeChild(this.backdropElement);
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    Modal.prototype.open = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.isOpened)
            return;
        this.isOpened = true;
        this.onOpen.emit(args);
        document.body.appendChild(this.backdropElement);
        window.setTimeout(function () { return _this.modalRoot.nativeElement.focus(); }, 0);
        document.body.className += " modal-open";
    };
    Modal.prototype.close = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (!this.isOpened)
            return;
        this.isOpened = false;
        this.onClose.emit(args);
        document.body.removeChild(this.backdropElement);
        document.body.className = document.body.className.replace(/modal-open\b/, "");
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    Modal.prototype.preventClosing = function (event) {
        event.stopPropagation();
    };
    Modal.prototype.createBackDrop = function () {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("modal-backdrop");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "modalClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Modal.prototype, "closeOnEscape", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Modal.prototype, "closeOnOutsideClick", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "hideCloseButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "cancelButtonLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Modal.prototype, "submitButtonLabel", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "onOpen", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "onClose", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Modal.prototype, "onSubmit", void 0);
    __decorate([
        core_1.ViewChild("modalRoot"), 
        __metadata('design:type', core_1.ElementRef)
    ], Modal.prototype, "modalRoot", void 0);
    Modal = __decorate([
        core_1.Component({
            selector: "modal",
            template: "\n<div class=\"modal\" \n     tabindex=\"-1\"\n     role=\"dialog\"\n     #modalRoot\n     (keydown.esc)=\"closeOnEscape ? close() : 0\"\n     [ngClass]=\"{ in: isOpened, fade: isOpened }\"\n     [ngStyle]=\"{ display: isOpened ? 'block' : 'none' }\"\n     (click)=\"closeOnOutsideClick ? close() : 0\">\n    <div [class]=\"'modal-dialog ' + modalClass\" (click)=\"preventClosing($event)\">\n        <div class=\"modal-content\" tabindex=\"0\" *ngIf=\"isOpened\">\n            <div class=\"modal-header\">\n                <button *ngIf=\"!hideCloseButton\" type=\"button\" class=\"close\" data-dismiss=\"modal\" [attr.aria-label]=\"cancelButtonLabel || 'Close'\" (click)=\"close()\"><span aria-hidden=\"true\">&times;</span></button>\n                <h4 class=\"modal-title\" *ngIf=\"title\">{{ title }}</h4>\n                <ng-content select=\"modal-header\"></ng-content>\n            </div>\n            <div class=\"modal-body\">\n                <ng-content select=\"modal-content\"></ng-content>\n            </div>\n            <div class=\"modal-footer\">\n                <ng-content select=\"modal-footer\"></ng-content>\n                <button *ngIf=\"cancelButtonLabel\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" (click)=\"close()\">{{ cancelButtonLabel }}</button>\n                <button *ngIf=\"submitButtonLabel\" type=\"button\" class=\"btn btn-primary\" (click)=\"onSubmit.emit(undefined)\">{{ submitButtonLabel }}</button>\n            </div>\n        </div>\n    </div>\n</div>\n"
        }), 
        __metadata('design:paramtypes', [])
    ], Modal);
    return Modal;
}());
exports.Modal = Modal;

//# sourceMappingURL=Modal.js.map


/***/ },

/***/ "./node_modules/ng2-modal/RouteModal.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var RouteModal = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RouteModal(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.closeOnEscape = true;
        this.closeOnOutsideClick = true;
        this.hideCloseButton = false;
        // -------------------------------------------------------------------------
        // Outputs
        // -------------------------------------------------------------------------
        this.onOpen = new core_1.EventEmitter(false);
        this.onClose = new core_1.EventEmitter(false);
        this.onSubmit = new core_1.EventEmitter(false);
        this.isOpened = false;
        this.createBackDrop();
    }
    // -------------------------------------------------------------------------
    // Lifecycle Methods
    // -------------------------------------------------------------------------
    RouteModal.prototype.ngOnInit = function () {
        this.open();
    };
    RouteModal.prototype.ngOnDestroy = function () {
        document.body.className = document.body.className.replace(/modal-open\b/, "");
        if (this.backdropElement && this.backdropElement.parentNode === document.body)
            document.body.removeChild(this.backdropElement);
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    RouteModal.prototype.open = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.isOpened)
            return;
        this.isOpened = true;
        this.onOpen.emit(args);
        document.body.appendChild(this.backdropElement);
        window.setTimeout(function () { return _this.modalRoot.nativeElement.focus(); }, 0);
        document.body.className += " modal-open";
    };
    RouteModal.prototype.close = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (!this.isOpened)
            return;
        this.isOpened = false;
        this.onClose.emit(args);
        document.body.className = document.body.className.replace(/modal-open\b/, "");
        if (this.cancelUrl) {
            var navigationExtras = { relativeTo: this.activatedRoute };
            if (this.cancelUrlExtras) {
                navigationExtras = Object.assign(this.cancelUrlExtras);
            }
            this.router.navigate(this.cancelUrl, navigationExtras);
        }
        else {
            window.history.back();
        }
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    RouteModal.prototype.preventClosing = function (event) {
        event.stopPropagation();
    };
    RouteModal.prototype.createBackDrop = function () {
        this.backdropElement = document.createElement("div");
        this.backdropElement.classList.add("modal-backdrop");
        this.backdropElement.classList.add("fade");
        this.backdropElement.classList.add("in");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RouteModal.prototype, "cancelUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "cancelUrlExtras", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "modalClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RouteModal.prototype, "closeOnEscape", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RouteModal.prototype, "closeOnOutsideClick", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "hideCloseButton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "cancelButtonLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouteModal.prototype, "submitButtonLabel", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "onOpen", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "onClose", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RouteModal.prototype, "onSubmit", void 0);
    __decorate([
        core_1.ViewChild("modalRoot"), 
        __metadata('design:type', core_1.ElementRef)
    ], RouteModal.prototype, "modalRoot", void 0);
    RouteModal = __decorate([
        core_1.Component({
            selector: "route-modal",
            template: "\n<div class=\"modal route-modal\" \n     tabindex=\"-1\"\n     role=\"dialog\"\n     #modalRoot\n     (keydown.esc)=\"closeOnEscape ? close() : 0\"\n     [ngClass]=\"{ in: isOpened, fade: isOpened }\"\n     [ngStyle]=\"{ display: isOpened ? 'block' : 'none' }\"\n     (click)=\"closeOnOutsideClick ? close() : 0\">\n    <div [class]=\"'modal-dialog ' + modalClass\" (click)=\"preventClosing($event)\">\n        <div class=\"modal-content\" tabindex=\"0\" *ngIf=\"isOpened\">\n            <div class=\"modal-header\">\n                <button *ngIf=\"!hideCloseButton\" type=\"button\" class=\"close\" data-dismiss=\"modal\" [attr.aria-label]=\"cancelButtonLabel || 'Close'\" (click)=\"close()\"><span aria-hidden=\"true\">&times;</span></button>\n                <h4 class=\"modal-title\" *ngIf=\"title\">{{ title }}</h4>\n                <ng-content select=\"modal-header\"></ng-content>\n            </div>\n            <div class=\"modal-body\">\n                <ng-content select=\"modal-content\"></ng-content>\n            </div>\n            <div class=\"modal-footer\">\n                <ng-content select=\"modal-footer\"></ng-content>\n                <button *ngIf=\"cancelButtonLabel\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" (click)=\"close()\">{{ cancelButtonLabel }}</button>\n                <button *ngIf=\"submitButtonLabel\" type=\"button\" class=\"btn btn-primary\" (click)=\"onSubmit.emit(undefined)\">{{ submitButtonLabel }}</button>\n            </div>\n        </div>\n    </div>\n</div>\n"
        }), 
        __metadata('design:paramtypes', [router_1.Router, router_1.ActivatedRoute])
    ], RouteModal);
    return RouteModal;
}());
exports.RouteModal = RouteModal;

//# sourceMappingURL=RouteModal.js.map


/***/ },

/***/ "./node_modules/ng2-modal/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var Modal_1 = __webpack_require__("./node_modules/ng2-modal/Modal.js");
var RouteModal_1 = __webpack_require__("./node_modules/ng2-modal/RouteModal.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
__export(__webpack_require__("./node_modules/ng2-modal/Modal.js"));
__export(__webpack_require__("./node_modules/ng2-modal/RouteModal.js"));
var ModalHeader = (function () {
    function ModalHeader() {
    }
    ModalHeader = __decorate([
        core_1.Component({
            selector: "modal-header",
            template: "<ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [])
    ], ModalHeader);
    return ModalHeader;
}());
exports.ModalHeader = ModalHeader;
var ModalContent = (function () {
    function ModalContent() {
    }
    ModalContent = __decorate([
        core_1.Component({
            selector: "modal-content",
            template: "<ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [])
    ], ModalContent);
    return ModalContent;
}());
exports.ModalContent = ModalContent;
var ModalFooter = (function () {
    function ModalFooter() {
    }
    ModalFooter = __decorate([
        core_1.Component({
            selector: "modal-footer",
            template: "<ng-content></ng-content>"
        }), 
        __metadata('design:paramtypes', [])
    ], ModalFooter);
    return ModalFooter;
}());
exports.ModalFooter = ModalFooter;
var ModalModule = (function () {
    function ModalModule() {
    }
    ModalModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                Modal_1.Modal,
                RouteModal_1.RouteModal,
                ModalHeader,
                ModalContent,
                ModalFooter,
            ],
            exports: [
                Modal_1.Modal,
                RouteModal_1.RouteModal,
                ModalHeader,
                ModalContent,
                ModalFooter,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], ModalModule);
    return ModalModule;
}());
exports.ModalModule = ModalModule;

//# sourceMappingURL=index.js.map


/***/ },

/***/ "./node_modules/ng2-select2/ng2-select2.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var select2_component_1 = __webpack_require__("./node_modules/ng2-select2/src/select2.component.js");
var select2_component_2 = __webpack_require__("./node_modules/ng2-select2/src/select2.component.js");
exports.Select2Component = select2_component_2.Select2Component;
var Select2Module = (function () {
    function Select2Module() {
    }
    Select2Module = __decorate([
        core_1.NgModule({
            exports: [select2_component_1.Select2Component],
            declarations: [select2_component_1.Select2Component],
            providers: [select2_component_1.Select2Component]
        }), 
        __metadata('design:paramtypes', [])
    ], Select2Module);
    return Select2Module;
}());
exports.Select2Module = Select2Module;


/***/ },

/***/ "./node_modules/ng2-select2/src/select2.component.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Select2Component = (function () {
    function Select2Component() {
        this.valueChanged = new core_1.EventEmitter();
        this.blur = new core_1.EventEmitter();
    }
    Select2Component.prototype.ngAfterViewInit = function () {
	console.log(this.data);
        if (this.data) {
            var that_1 = this;
            this.element = jQuery(this.selector.nativeElement);
            this.element.select2({
                data: this.data,
                templateResult: this.templateResult,
                templateSelection: this.templateSelection,
                theme: (this.theme) ? this.theme : 'default',
                width: (this.width) ? this.width : 'resolve'
            });
            if (typeof this.value !== 'undefined') {
                this.element.val(that_1.value).trigger('change');
            }
            this.element.on('select2:select', function (e) {
                that_1.valueChanged.emit({
                    value: that_1.selector.nativeElement.value
                });
            });
        }
    };
    Select2Component.prototype.ngOnDestroy = function () {
        this.element.off("select2:select");
    };
    __decorate([
        core_1.ViewChild('selector'), 
        __metadata('design:type', core_1.ElementRef)
    ], Select2Component.prototype, "selector", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], Select2Component.prototype, "data", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Select2Component.prototype, "value", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Select2Component.prototype, "valueChanged", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Select2Component.prototype, "blur", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Select2Component.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Select2Component.prototype, "theme", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], Select2Component.prototype, "templateSelection", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], Select2Component.prototype, "templateResult", void 0);
    Select2Component = __decorate([
        core_1.Component({
            selector: 'select2',
            template: '<select #selector></select>',
            styles: ["\n    .select2-container {\n    box-sizing: border-box;\n    display: inline-block;\n    margin: 0;\n    position: relative;\n    vertical-align: middle;\n    min-width: 100px; }\n.select2-container .select2-selection--single {\n    box-sizing: border-box;\n    cursor: pointer;\n    display: block;\n    height: 28px;\n    user-select: none;\n    -webkit-user-select: none; }\n.select2-container .select2-selection--single .select2-selection__rendered {\n    display: block;\n    padding-left: 8px;\n    padding-right: 20px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n.select2-container .select2-selection--single .select2-selection__clear {\n    position: relative; }\n.select2-container[dir=\"rtl\"] .select2-selection--single .select2-selection__rendered {\n    padding-right: 8px;\n    padding-left: 20px; }\n.select2-container .select2-selection--multiple {\n    box-sizing: border-box;\n    cursor: pointer;\n    display: block;\n    min-height: 32px;\n    user-select: none;\n    -webkit-user-select: none; }\n.select2-container .select2-selection--multiple .select2-selection__rendered {\n    display: inline-block;\n    overflow: hidden;\n    padding-left: 8px;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n.select2-container .select2-search--inline {\n    float: left; }\n.select2-container .select2-search--inline .select2-search__field {\n    box-sizing: border-box;\n    border: none;\n    font-size: 100%;\n    margin-top: 5px;\n    padding: 0; }\n.select2-container .select2-search--inline .select2-search__field::-webkit-search-cancel-button {\n    -webkit-appearance: none; }\n\n.select2-dropdown {\n    background-color: white;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    box-sizing: border-box;\n    display: block;\n    position: absolute;\n    left: -100000px;\n    width: 100%;\n    z-index: 1051; }\n\n.select2-results {\n    display: block; }\n\n.select2-results__options {\n    list-style: none;\n    margin: 0;\n    padding: 0; }\n\n.select2-results__option {\n    padding: 6px;\n    user-select: none;\n    -webkit-user-select: none; }\n.select2-results__option[aria-selected] {\n    cursor: pointer; }\n\n.select2-container--open .select2-dropdown {\n    left: 0; }\n\n.select2-container--open .select2-dropdown--above {\n    border-bottom: none;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0; }\n\n.select2-container--open .select2-dropdown--below {\n    border-top: none;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.select2-search--dropdown {\n    display: block;\n    padding: 4px; }\n.select2-search--dropdown .select2-search__field {\n    padding: 4px;\n    width: 100%;\n    box-sizing: border-box; }\n.select2-search--dropdown .select2-search__field::-webkit-search-cancel-button {\n    -webkit-appearance: none; }\n.select2-search--dropdown.select2-search--hide {\n    display: none; }\n\n.select2-close-mask {\n    border: 0;\n    margin: 0;\n    padding: 0;\n    display: block;\n    position: fixed;\n    left: 0;\n    top: 0;\n    min-height: 100%;\n    min-width: 100%;\n    height: auto;\n    width: auto;\n    opacity: 0;\n    z-index: 99;\n    background-color: #fff;\n    filter: alpha(opacity=0); }\n\n.select2-hidden-accessible {\n    border: 0 !important;\n    clip: rect(0 0 0 0) !important;\n    height: 1px !important;\n    margin: -1px !important;\n    overflow: hidden !important;\n    padding: 0 !important;\n    position: absolute !important;\n    width: 1px !important; }\n\n.select2-container--default .select2-selection--single {\n    background-color: #fff;\n    border: 1px solid #aaa;\n    border-radius: 4px; }\n.select2-container--default .select2-selection--single .select2-selection__rendered {\n    color: #444;\n    line-height: 28px; }\n.select2-container--default .select2-selection--single .select2-selection__clear {\n    cursor: pointer;\n    float: right;\n    font-weight: bold; }\n.select2-container--default .select2-selection--single .select2-selection__placeholder {\n    color: #999; }\n.select2-container--default .select2-selection--single .select2-selection__arrow {\n    height: 26px;\n    position: absolute;\n    top: 1px;\n    right: 1px;\n    width: 20px; }\n.select2-container--default .select2-selection--single .select2-selection__arrow b {\n    border-color: #888 transparent transparent transparent;\n    border-style: solid;\n    border-width: 5px 4px 0 4px;\n    height: 0;\n    left: 50%;\n    margin-left: -4px;\n    margin-top: -2px;\n    position: absolute;\n    top: 50%;\n    width: 0; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--single .select2-selection__clear {\n    float: left; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow {\n    left: 1px;\n    right: auto; }\n\n.select2-container--default.select2-container--disabled .select2-selection--single {\n    background-color: #eee;\n    cursor: default; }\n.select2-container--default.select2-container--disabled .select2-selection--single .select2-selection__clear {\n    display: none; }\n\n.select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {\n    border-color: transparent transparent #888 transparent;\n    border-width: 0 4px 5px 4px; }\n\n.select2-container--default .select2-selection--multiple {\n    background-color: white;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: text; }\n.select2-container--default .select2-selection--multiple .select2-selection__rendered {\n    box-sizing: border-box;\n    list-style: none;\n    margin: 0;\n    padding: 0 5px;\n    width: 100%; }\n.select2-container--default .select2-selection--multiple .select2-selection__rendered li {\n    list-style: none; }\n.select2-container--default .select2-selection--multiple .select2-selection__placeholder {\n    color: #999;\n    margin-top: 5px;\n    float: left; }\n.select2-container--default .select2-selection--multiple .select2-selection__clear {\n    cursor: pointer;\n    float: right;\n    font-weight: bold;\n    margin-top: 5px;\n    margin-right: 10px; }\n.select2-container--default .select2-selection--multiple .select2-selection__choice {\n    background-color: #e4e4e4;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: default;\n    float: left;\n    margin-right: 5px;\n    margin-top: 5px;\n    padding: 0 5px; }\n.select2-container--default .select2-selection--multiple .select2-selection__choice__remove {\n    color: #999;\n    cursor: pointer;\n    display: inline-block;\n    font-weight: bold;\n    margin-right: 2px; }\n.select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {\n    color: #333; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice, .select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__placeholder, .select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-search--inline {\n    float: right; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n    margin-left: 5px;\n    margin-right: auto; }\n\n.select2-container--default[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice__remove {\n    margin-left: 2px;\n    margin-right: auto; }\n\n.select2-container--default.select2-container--focus .select2-selection--multiple {\n    border: solid black 1px;\n    outline: 0; }\n\n.select2-container--default.select2-container--disabled .select2-selection--multiple {\n    background-color: #eee;\n    cursor: default; }\n\n.select2-container--default.select2-container--disabled .select2-selection__choice__remove {\n    display: none; }\n\n.select2-container--default.select2-container--open.select2-container--above .select2-selection--single, .select2-container--default.select2-container--open.select2-container--above .select2-selection--multiple {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple {\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0; }\n\n.select2-container--default .select2-search--dropdown .select2-search__field {\n    border: 1px solid #aaa; }\n\n.select2-container--default .select2-search--inline .select2-search__field {\n    background: transparent;\n    border: none;\n    outline: 0;\n    box-shadow: none;\n    -webkit-appearance: textfield; }\n\n.select2-container--default .select2-results > .select2-results__options {\n    max-height: 200px;\n    overflow-y: auto; }\n\n.select2-container--default .select2-results__option[role=group] {\n    padding: 0; }\n\n.select2-container--default .select2-results__option[aria-disabled=true] {\n    color: #999; }\n\n.select2-container--default .select2-results__option[aria-selected=true] {\n    background-color: #ddd; }\n\n.select2-container--default .select2-results__option .select2-results__option {\n    padding-left: 1em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__group {\n    padding-left: 0; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -1em;\n    padding-left: 2em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -2em;\n    padding-left: 3em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -3em;\n    padding-left: 4em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -4em;\n    padding-left: 5em; }\n.select2-container--default .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n    margin-left: -5em;\n    padding-left: 6em; }\n\n.select2-container--default .select2-results__option--highlighted[aria-selected] {\n    background-color: #5897fb;\n    color: white; }\n\n.select2-container--default .select2-results__group {\n    cursor: default;\n    display: block;\n    padding: 6px; }\n\n.select2-container--classic .select2-selection--single {\n    background-color: #f7f7f7;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    outline: 0;\n    background-image: -webkit-linear-gradient(top, white 50%, #eeeeee 100%);\n    background-image: -o-linear-gradient(top, white 50%, #eeeeee 100%);\n    background-image: linear-gradient(to bottom, white 50%, #eeeeee 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFFFFFF', endColorstr='#FFEEEEEE', GradientType=0); }\n.select2-container--classic .select2-selection--single:focus {\n    border: 1px solid #5897fb; }\n.select2-container--classic .select2-selection--single .select2-selection__rendered {\n    color: #444;\n    line-height: 28px; }\n.select2-container--classic .select2-selection--single .select2-selection__clear {\n    cursor: pointer;\n    float: right;\n    font-weight: bold;\n    margin-right: 10px; }\n.select2-container--classic .select2-selection--single .select2-selection__placeholder {\n    color: #999; }\n.select2-container--classic .select2-selection--single .select2-selection__arrow {\n    background-color: #ddd;\n    border: none;\n    border-left: 1px solid #aaa;\n    border-top-right-radius: 4px;\n    border-bottom-right-radius: 4px;\n    height: 26px;\n    position: absolute;\n    top: 1px;\n    right: 1px;\n    width: 20px;\n    background-image: -webkit-linear-gradient(top, #eeeeee 50%, #cccccc 100%);\n    background-image: -o-linear-gradient(top, #eeeeee 50%, #cccccc 100%);\n    background-image: linear-gradient(to bottom, #eeeeee 50%, #cccccc 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFEEEEEE', endColorstr='#FFCCCCCC', GradientType=0); }\n.select2-container--classic .select2-selection--single .select2-selection__arrow b {\n    border-color: #888 transparent transparent transparent;\n    border-style: solid;\n    border-width: 5px 4px 0 4px;\n    height: 0;\n    left: 50%;\n    margin-left: -4px;\n    margin-top: -2px;\n    position: absolute;\n    top: 50%;\n    width: 0; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--single .select2-selection__clear {\n    float: left; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow {\n    border: none;\n    border-right: 1px solid #aaa;\n    border-radius: 0;\n    border-top-left-radius: 4px;\n    border-bottom-left-radius: 4px;\n    left: 1px;\n    right: auto; }\n\n.select2-container--classic.select2-container--open .select2-selection--single {\n    border: 1px solid #5897fb; }\n.select2-container--classic.select2-container--open .select2-selection--single .select2-selection__arrow {\n    background: transparent;\n    border: none; }\n.select2-container--classic.select2-container--open .select2-selection--single .select2-selection__arrow b {\n    border-color: transparent transparent #888 transparent;\n    border-width: 0 4px 5px 4px; }\n\n.select2-container--classic.select2-container--open.select2-container--above .select2-selection--single {\n    border-top: none;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n    background-image: -webkit-linear-gradient(top, white 0%, #eeeeee 50%);\n    background-image: -o-linear-gradient(top, white 0%, #eeeeee 50%);\n    background-image: linear-gradient(to bottom, white 0%, #eeeeee 50%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFFFFFF', endColorstr='#FFEEEEEE', GradientType=0); }\n\n.select2-container--classic.select2-container--open.select2-container--below .select2-selection--single {\n    border-bottom: none;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n    background-image: -webkit-linear-gradient(top, #eeeeee 50%, white 100%);\n    background-image: -o-linear-gradient(top, #eeeeee 50%, white 100%);\n    background-image: linear-gradient(to bottom, #eeeeee 50%, white 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFEEEEEE', endColorstr='#FFFFFFFF', GradientType=0); }\n\n.select2-container--classic .select2-selection--multiple {\n    background-color: white;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: text;\n    outline: 0; }\n.select2-container--classic .select2-selection--multiple:focus {\n    border: 1px solid #5897fb; }\n.select2-container--classic .select2-selection--multiple .select2-selection__rendered {\n    list-style: none;\n    margin: 0;\n    padding: 0 5px; }\n.select2-container--classic .select2-selection--multiple .select2-selection__clear {\n    display: none; }\n.select2-container--classic .select2-selection--multiple .select2-selection__choice {\n    background-color: #e4e4e4;\n    border: 1px solid #aaa;\n    border-radius: 4px;\n    cursor: default;\n    float: left;\n    margin-right: 5px;\n    margin-top: 5px;\n    padding: 0 5px; }\n.select2-container--classic .select2-selection--multiple .select2-selection__choice__remove {\n    color: #888;\n    cursor: pointer;\n    display: inline-block;\n    font-weight: bold;\n    margin-right: 2px; }\n.select2-container--classic .select2-selection--multiple .select2-selection__choice__remove:hover {\n    color: #555; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n    float: right; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n    margin-left: 5px;\n    margin-right: auto; }\n\n.select2-container--classic[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice__remove {\n    margin-left: 2px;\n    margin-right: auto; }\n\n.select2-container--classic.select2-container--open .select2-selection--multiple {\n    border: 1px solid #5897fb; }\n\n.select2-container--classic.select2-container--open.select2-container--above .select2-selection--multiple {\n    border-top: none;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0; }\n\n.select2-container--classic.select2-container--open.select2-container--below .select2-selection--multiple {\n    border-bottom: none;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0; }\n\n.select2-container--classic .select2-search--dropdown .select2-search__field {\n    border: 1px solid #aaa;\n    outline: 0; }\n\n.select2-container--classic .select2-search--inline .select2-search__field {\n    outline: 0;\n    box-shadow: none; }\n\n.select2-container--classic .select2-dropdown {\n    background-color: white;\n    border: 1px solid transparent; }\n\n.select2-container--classic .select2-dropdown--above {\n    border-bottom: none; }\n\n.select2-container--classic .select2-dropdown--below {\n    border-top: none; }\n\n.select2-container--classic .select2-results > .select2-results__options {\n    max-height: 200px;\n    overflow-y: auto; }\n\n.select2-container--classic .select2-results__option[role=group] {\n    padding: 0; }\n\n.select2-container--classic .select2-results__option[aria-disabled=true] {\n    color: grey; }\n\n.select2-container--classic .select2-results__option--highlighted[aria-selected] {\n    background-color: #3875d7;\n    color: white; }\n\n.select2-container--classic .select2-results__group {\n    cursor: default;\n    display: block;\n    padding: 6px; }\n\n.select2-container--classic.select2-container--open .select2-dropdown {\n    border-color: #5897fb; }\n\n    "],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], Select2Component);
    return Select2Component;
}());
exports.Select2Component = Select2Component;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/layout/widget/widget.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Widget = (function () {
    function Widget(el) {
        this.$el = jQuery(el.nativeElement);
        jQuery.fn.widgster.Constructor.DEFAULTS.bodySelector = '.widget-body';
        /*
         When widget is closed remove its parent if it is .col-*
         */
        jQuery(document).on('close.widgster', function (e) {
            var $colWrap = jQuery(e.target)
                .closest('.content > .row > [class*="col-"]:not(.widget-container)');
            // remove colWrap only if there are no more widgets inside
            if (!$colWrap.find('.widget').not(e.target).length) {
                $colWrap.remove();
            }
        });
    }
    Widget.prototype.ngOnInit = function () {
        this.$el.widgster();
    };
    Widget = __decorate([
        core_1.Directive({
            selector: '[widget]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], Widget);
    return Widget;
    var _a;
}());
exports.Widget = Widget;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/layout/widget/widget.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var widget_directive_1 = __webpack_require__("./src/app/layout/widget/widget.directive.ts");
var WidgetModule = (function () {
    function WidgetModule() {
    }
    WidgetModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [widget_directive_1.Widget],
            exports: [widget_directive_1.Widget]
        }), 
        __metadata('design:paramtypes', [])
    ], WidgetModule);
    return WidgetModule;
}());
exports.WidgetModule = WidgetModule;


/***/ },

/***/ "./src/app/models/ArticleCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Created by Ideofuzion on 8/4/2016.
 */
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var ArticleCard = (function (_super) {
    __extends(ArticleCard, _super);
    function ArticleCard(_titleText, _articleText) {
        _super.call(this);
        this.articleText = _articleText;
        this.titleText = _titleText;
    }
    ArticleCard.prototype.GetTitleText = function () { return this.titleText; };
    ArticleCard.prototype.GetArticleText = function () { return this.articleText; };
    return ArticleCard;
}(Serializable));
exports.ArticleCard = ArticleCard;


/***/ },

/***/ "./src/app/models/Card.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Created by Ideofuzion on 8/4/2016.
 */
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var Card = (function (_super) {
    __extends(Card, _super);
    function Card(_type, _card) {
        _super.call(this);
        this.type = _type;
        this.card = _card;
    }
    Card.prototype.GetType = function () { return this.type; };
    Card.prototype.GetCard = function () { return this.card; };
    return Card;
}(Serializable));
exports.Card = Card;


/***/ },

/***/ "./src/app/models/CardAddButton.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Created by Ideofuzion on 8/4/2016.
 */
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var CardAddButton = (function (_super) {
    __extends(CardAddButton, _super);
    function CardAddButton(_buttonname, _urlblockname, _blockId, _addButtonId) {
        _super.call(this);
        this.buttonname = _buttonname;
        this.urlblockname = _urlblockname;
        this._blockId = _blockId;
        this._addButtonId = _addButtonId;
    }
    CardAddButton.prototype.GetName = function () { return this.buttonname; };
    CardAddButton.prototype.GetUrlBlock = function () { return this.urlblockname; };
    CardAddButton.prototype.GetBlockId = function () { return this._blockId; };
    CardAddButton.prototype.GetAddButtonId = function () { return this._addButtonId; };
    return CardAddButton;
}(Serializable));
exports.CardAddButton = CardAddButton;


/***/ },

/***/ "./src/app/models/GalleryCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var GalleryCard = (function (_super) {
    __extends(GalleryCard, _super);
    function GalleryCard(_pictureUrl, _title, _description, _url, _cardAddButton, _indexId) {
        _super.call(this);
        this.pictureUrl = _pictureUrl;
        this.title = _title;
        this.description = _description;
        this.url = _url;
        this.cardAddButton = _cardAddButton;
        this.indexId = _indexId;
    }
    GalleryCard.prototype.GetPictureUrl = function () { return this.pictureUrl; };
    GalleryCard.prototype.GetTitle = function () { return this.title; };
    GalleryCard.prototype.GetDescription = function () { return this.description; };
    GalleryCard.prototype.GetUrl = function () { return this.url; };
    GalleryCard.prototype.GetCardAddButton = function () { return this.cardAddButton; };
    GalleryCard.prototype.GetIndexId = function () { return this.indexId; };
    return GalleryCard;
}(Serializable));
exports.GalleryCard = GalleryCard;


/***/ },

/***/ "./src/app/models/ImageCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var ImageCard = (function (_super) {
    __extends(ImageCard, _super);
    function ImageCard(_pictureUrl, _quickReplyButton) {
        _super.call(this);
        this.pictureUrl = _pictureUrl;
        this.quickReplyButton = _quickReplyButton;
    }
    ImageCard.prototype.GetPictureUrl = function () { return this.pictureUrl; };
    ImageCard.prototype.GetCardQuickReplyButton = function () { return this.quickReplyButton; };
    return ImageCard;
}(Serializable));
exports.ImageCard = ImageCard;


/***/ },

/***/ "./src/app/models/TextCard.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var Serializable = (function () {
    function Serializable() {
    }
    Serializable.prototype.fillFromJSON = function (json) {
        var jsonObj = JSON.parse(json).array.forEach(function (element) {
            console.log(element);
        });
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName];
        }
    };
    return Serializable;
}());
exports.Serializable = Serializable;
var TextCard = (function (_super) {
    __extends(TextCard, _super);
    function TextCard(_text, _cardAddButton, _quickReplyButton) {
        _super.call(this);
        this.randomText = _text;
        this.cardAddButton = _cardAddButton;
        this.quickReplyButton = _quickReplyButton;
    }
    TextCard.prototype.GetText = function () { return this.randomText; };
    TextCard.prototype.GetCardAddButton = function () { return this.cardAddButton; };
    TextCard.prototype.GetCardQuickReplyButton = function () { return this.quickReplyButton; };
    return TextCard;
}(Serializable));
exports.TextCard = TextCard;


/***/ },

/***/ "./src/app/services/BotTrainingService.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
var BotTrainingService = (function () {
    //baseUrl:string = "http://localhost/";
    function BotTrainingService(http) {
        this.http = http;
        this.baseUrl = "https://aprilappserver-staging.azurewebsites.net/";
    }
    BotTrainingService.prototype.getAllGroups = function (type) {
        return this.http.get(this.baseUrl + 'groups/getGroupsBlocks/' + type)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.getAlBlocks = function () {
        return this.http.get(this.baseUrl + 'blocks/getAllBlocks')
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.getAllResponseMessages = function (blockId) {
        return this.http.get(this.baseUrl + 'blocks/getResponseMessagesOfBlock/' + blockId)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteGroup = function (Id) {
        return this.http.get(this.baseUrl + 'groups/deleteOrderById/' + Id)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateTitleText = function (Id, Text, indexId, type) {
        return this.http.get(this.baseUrl + 'responsemessage/updateTitle/' + Id + '/' + indexId + '/' + type + '/' + Text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateRandomTitleText = function (Id, text, indexId) {
        return this.http.get(this.baseUrl + 'responsemessage/updateRandomTitle/' + Id + '/' + indexId + '/' + text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateArticleText = function (Id, Text) {
        var body = JSON.stringify({ "responseMessageId": Id, "text": Text });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/updateArticle", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateDescriptionText = function (Id, Text, indexId) {
        return this.http.get(this.baseUrl + 'responsemessage/updateDescription/' + Id + '/' + indexId + '/' + Text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.updateUrlText = function (Id, Text, indexId) {
        return this.http.get(this.baseUrl + 'responsemessage/updateUrl/' + Id + '/' + indexId + '/' + Text)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteBlock = function (Id) {
        return this.http.get(this.baseUrl + 'blocks/deleteBlock/' + Id)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteResponseMessage = function (Id) {
        return this.http.get(this.baseUrl + 'responsemessage/deleteResponseMessage/' + Id)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteAddButton = function (AddButtonId, ParentId, type) {
        return this.http.get(this.baseUrl + 'responsemessage/deleteAddButton/' + ParentId + '/' + AddButtonId + '/' + type)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.deleteQuickReply = function (AddButtonId, ParentId) {
        return this.http.get(this.baseUrl + 'responsemessage/deleteQuickReply/' + ParentId + '/' + AddButtonId)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addRandomText = function (Id, count) {
        return this.http.get(this.baseUrl + 'responsemessage/addTextRandom/' + Id + '/' + count)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addGroup = function (group, type) {
        var body = JSON.stringify({ "name": group, "type": type, "description": group });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "groups/addGroup", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addBlocks = function (block, type, groupId) {
        var body = JSON.stringify({ "name": block, "type": type, "description": block, "_groupId": groupId });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "blocks/addBlock", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addResponseMessage = function (data, type, blockId) {
        var body = JSON.stringify({ "data": data, "type": type, "_blockId": blockId });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/addResponseMessage", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addGalleryCard = function (data, responseMessageId) {
        var body = JSON.stringify({ "data": data, "responseMessageId": responseMessageId });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/addGalleryCard", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addAddButton = function (responseMessageId, data, type, index) {
        var body = JSON.stringify({ "data": data, "responseMessageId": responseMessageId, "type": type, "index": index });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "responsemessage/addAddButton", body, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.addQuickReply = function (responseMessageId, buttonName, _blockId, count) {
        return this.http.get(this.baseUrl + 'responsemessage/addQuickReply/' + responseMessageId + '/' + buttonName + '/' + _blockId + '/' + count)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService.prototype.getPictureUrl = function (file, Id, type, indexId) {
        var formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("responseMessageId", Id);
        formData.append("type", type);
        formData.append("indexId", indexId);
        //let body = JSON.stringify({ "name":group, "type":type, "description":group });
        var options = new http_1.RequestOptions({ method: 'post' });
        return this.http.post(this.baseUrl + "usercode/uploadPicture", formData, options)
            .map(function (res) { return res.json(); });
    };
    BotTrainingService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], BotTrainingService);
    return BotTrainingService;
    var _a;
}());
exports.BotTrainingService = BotTrainingService;


/***/ },

/***/ "./src/app/specific/specific.component.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"breadcrumb-item active\">Specific Groups and Topics</li>\r\n</ol>\r\n<h1 class=\"page-title\">Lists - <span class=\"fw-semi-bold\">Specific Groups for BOT</span></h1>\r\n<section class=\"widget widget2\" widget>\r\n  <header>\r\n    <h4>\r\n      Specific Group Lists\r\n    </h4>\r\n  </header>\r\n  <div class=\"widget-body\">\r\n    <div class=\"row\">\r\n        <div class=\"col-md-6 col-sm-12 col-lg-6 col-xs-12 divseparator\">\r\n          <ul class=\"list-group list-group-sortable mt-lg\">\r\n          <li class=\"list-group-item\" *ngFor=\"let blockGroups of blockGroupsModel\" id={{blockGroups.group._id}}>\r\n              <i class=\"fa fa-sort\"></i>\r\n              <a class=\"close\" *ngIf=\"blockGroups.group.isLocked == true\"><i class=\"fa fa-lock\" aria-hidden=\"true\"></i></a>\r\n              <a href=\"#\" class=\"close\" *ngIf=\"blockGroups.group.isLocked == false\"  (click)=\"deleteGroup(blockGroups.group._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              &nbsp;&nbsp;&nbsp; {{blockGroups.group.order}} &nbsp;&nbsp;&nbsp;\r\n              {{blockGroups.group.name}}\r\n              <div class=\"row blocksdiv\">\r\n                  <div id=\"block{{block._id}}\" class=\"blockbtns\" *ngFor=\"let block of blockGroups.blocks\" (click)=\"blockDetail(block._id)\">\r\n                    {{block.name}}\r\n                  </div>\r\n                <div *ngIf=\"blockGroups.group.isLocked == false\" class=\"addBlock{{blockGroups.group._id}} blockbtns addBlock2\" (click)=\"addBlock(blockGroups.group._id)\">\r\n                  <i class=\"fa fa-plus\" aria-hidden=\"true\"></i> Add Block\r\n                </div>\r\n                <div class=\"saveBlock{{blockGroups.group._id}}\"  style=\"display:none\">\r\n                  <div class=\"input-group\">\r\n                    <input id=\"blockText{{blockGroups.group._id}}\" type=\"text\" class=\"form-control\" [(ngModel)]=\"blockName\" placeholder=\"Block Name\"/>\r\n                    <div class=\"input-group-btn\">\r\n                      <button type=\"button\" (click)=\"saveBlock(blockGroups.group._id)\" class=\"btn\"><i class=\"fa fa-plus\"></i></button>\r\n                    </div>  \r\n                  </div>  \r\n                </div>\r\n              </div>\r\n          </li>\r\n              \r\n          </ul>\r\n          <div class=\"row GroupBtn\">\r\n                  <p>\r\n                      <button type=\"button\" (click)=\"toggleDivs(1)\" class=\"btn btn-info btn-block\">Add Specific Group</button>\r\n                  </p>\r\n              </div>\r\n          <div class=\"row GroupForm\">\r\n              <div class=\"form-group\">\r\n                    <div class=\"input-group\">\r\n                      <input type=\"text\"  [(ngModel)]=\"GroupText\" class=\"form-control\" id=\"bar\">\r\n                      <div class=\"input-group-btn\">\r\n                        <button type=\"button\" (click)=\"toggleDivs(2)\" class=\"btn\"><i class=\"fa fa-plus\"></i></button>\r\n                        <button type=\"button\" (click)=\"refreshTextBox()\" class=\"btn btn-primary\"><i class=\"fa fa-refresh\"></i></button>\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n          </div>\r\n          <div id=\"emptyGroup\" style=\"display:none\" class=\"form-group\">\r\n                  <div class=\"alert alert-danger alert-sm\">\r\n                    <span class=\"fw-semi-bold\">Danger:</span> Please Enter Group Name.\r\n                  </div>\r\n          </div>\r\n      </div>\r\n      <div class=\"col-md-6 col-sm-12 col-lg-6 col-xs-12 rmdiv\" style=\"display:none\">\r\n        <div class=\"row\">\r\n          <div class=\"col-md-4 col-lg-4 col-xs-6 col-sm-4\">\r\n            <h4>\r\n              {{popBlockName}}\r\n            </h4>\r\n            <input id=\"popBlockIdd\" type=\"text\" value=\"{{popBlockId}}\" style=\"visibility:hidden\"/>\r\n          \r\n          </div>\r\n          <div *ngIf=\"isLocked == false\" class=\"col-md-4 col-lg-4 col-xs-6 col-sm-4 offset-md-4\">\r\n            <button class=\"btn btn-danger col-md-12 col-lg-12\" (click)=\"deleteBlock(popBlock._id)\">Delete Block ?</button>\r\n          </div>\r\n        </div>\r\n        <ul class=\"list-group list-group-sortable2 mt-lg\">\r\n          <div *ngFor=\"let card of cardArray; let i = index\">\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'gallery'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row table galleryHorizontalRow\">\r\n                \r\n                <div class=\"galleryColumns galleryColumns{{card._id}}\" *ngFor=\"let galleryCard of card.data\">\r\n                  <div class=\"card\">\r\n                    <div class=\"image col-md-12 col-lg-12 col-xs-12 col-sm-1\">\r\n                      <div class=\"image-inner\">\r\n                        <input accept=\"image/*\" [(ngModel)]=\"galleryImageFile\" type=\"file\" id=\"galleryImage{{galleryCard.indexId}}\" (change)=\"populateGalleryImage($event, card._id, card._blockId, galleryCard.indexId)\" style=\"visibility: hidden;\" name=\"files\" title=\"Load File\" />\r\n                        <div id=\"galleryImageBtn{{galleryCard.indexId}}\" *ngIf=\"galleryCard.pictureUrl == ''\">\r\n                          <button (click)=\"openGalleryImage(galleryCard.indexId)\" class=\"button-image col-xs-12 col-sm-12 btn-gray button-image--replace button-image--replace-gallery\">\r\n                            <span class=\"button-image__title\"><i class=\"fa fa-camera\" aria-hidden=\"true\"></i><br/>Upload Image</span>\r\n                          </button>\r\n                        </div>\r\n                        <div id=\"galleryImageDiv{{galleryCard.indexId}}\" *ngIf=\"galleryCard.pictureUrl != ''\" [ngStyle]=\"{ 'background-image': 'url(' + galleryCard.pictureUrl + ')'}\"></div>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"contenttitle\">\r\n                        <textarea id=\"galleryCardTitle{{galleryCard.indexId}}\" maxlength=\"80\" placeholder=\"title\" (change)=\"updateTitleGalleryCard(card._id, galleryCard.indexId)\">{{galleryCard.title}}</textarea>\r\n                      </div>\r\n                      <div class=\"contentbody contenttitle\">\r\n                        <textarea id=\"galleryCardDescription{{galleryCard.indexId}}\" maxlength=\"80\" placeholder=\"description\" (change)=\"updateDescriptionGalleryCard(card._id, galleryCard.indexId)\">{{galleryCard.description}}</textarea>\r\n                      </div>\r\n                      <div class=\"contenturl contenttitle\">\r\n                        <input id=\"galleryCardUrl{{galleryCard.indexId}}\" value=\"{{galleryCard.url}}\" type=\"url\" placeholder=\"Url\" (change)=\"updateUrlGalleryCard(card._id, galleryCard.indexId)\"/>\r\n                      </div>\r\n                      <div *ngFor=\"let addButton of galleryCard.cardAddButton\">\r\n                        <div class=\"addbuttonResultList\">\r\n                          <a href=\"#\" class=\"close\" (click)=\"deleteAddButton(addButton._addButtonId, galleryCard.indexId, 'gallery')\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n                          <label>{{addButton.buttonname}}</label>\r\n                          <p>{{addButton.urlblockname}}</p>\r\n                        </div>\r\n                      </div>\r\n                      <div class=\"addbutton\" *ngIf=\"galleryCard.cardAddButton.length != 3\" (click)=\"myModal.open();addButton(galleryCard.indexId, 'gallery', 'addButton')\">\r\n                        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n                        Add Button\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"top-buttons\">\r\n                      <div class=\"button-remove\">\r\n                        remove\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n                <div class=\"galleryColumns galleryColumns{{card._id}}\">\r\n                  <div class=\"card add\" (click)=\"addGalleryCard(card._id, card._blockId)\">\r\n\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </li>\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'text'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row\">\r\n                <div class=\"col-md-6 col-lg-6 col-xs-12 col-sm-12\">\r\n                  <div class=\"card\">\r\n                    <div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"contenttitle textcard randomTextCard\" *ngFor=\"let text of card.data.randomText; let j = index\">\r\n                        <textarea id=\"textCardTitle{{card._id}}{{text.indexId}}\" *ngIf = \"j!=0\" maxlength=\"80\" placeholder=\"title\" (change)=\"updateTitleRandomTextCard(card._id, text.indexId)\">{{text.text}}</textarea>\r\n                      </div>\r\n                      <div class=\"addbutton\" style=\"border-radius: 0px;\" (click)=\"addTextRandom(card._id)\">\r\n                          <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n                          Add Text Box\r\n                      </div>\r\n                      <div *ngFor=\"let addButton of card.data.cardAddButton\">\r\n                        <div class=\"addbuttonResultList\">\r\n                          <a href=\"#\" class=\"close\" (click)=\"deleteAddButton(addButton._addButtonId, card._id, 'text')\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n                          <label>{{addButton.buttonname}}</label>\r\n                          <p>{{addButton.urlblockname}}</p>\r\n                        </div>\r\n                      </div>\r\n                      <div *ngIf=\"card.data.cardAddButton.length != 3\">\r\n                        <div class=\"addbutton\" *ngIf=\"card.data.quickReplyButton.length == 0\" (click)=\"myModal.open();addButton(card._id, 'text','addButton')\">\r\n                          <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n                          Add Button \r\n                        </div>\r\n                        <div class=\"or\" *ngIf=\"card.data.cardAddButton.length == 0 && card.data.quickReplyButton.length == 0\">\r\n                          Or\r\n                        </div>\r\n                        <div class=\"addbutton addquickreply\" *ngIf=\"card.data.cardAddButton.length == 0\" (click)=\"yourModal.open();addButton(card._id, 'text','addQuick')\">\r\n                          <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n                          Add Quick Reply \r\n                        </div>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"top-buttons\">\r\n                      <div class=\"button-remove\">\r\n                        remove\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"row blocksdivAddQuickReply\">\r\n                \r\n                    <div class=\"addQuickReplyList addQuickReplyListDisplay\" *ngFor=\"let addButton of card.data.quickReplyButton\">\r\n                      <a href=\"#\" class=\"close\" (click)=\"deleteQuickReply(addButton._addButtonId, card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\">&#10007;</a>\r\n                       <label>{{addButton.buttonname}}</label>\r\n                       <p>{{addButton.urlblockname}}</p>\r\n                    </div>       \r\n                \r\n              </div>\r\n            </li>\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'image'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row\">\r\n                <div class=\"col-md-6 col-lg-6 col-xs-12 col-sm-12\">\r\n                  <div class=\"card\">\r\n                    <div class=\"image col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"image-inner2\">\r\n                        <input accept=\"image/*\" type=\"file\" id=\"singleImage{{card._id}}\" (change)=\"populateSingleImage($event, card._id, card._blockId)\" style=\"visibility: hidden;\" name=\"files\" title=\"Load File\" />\r\n                        <div id=\"singleImageBtn{{card._id}}\" *ngIf=\"card.data.pictureUrl == ''\">\r\n                          <button (click)=\"openSingleImage(card._id)\" class=\"button-image button-image2 col-xs-12 col-sm-12 btn-gray button-image--replace button-image--replace-gallery\">\r\n                            <span class=\"button-image__title\"><i class=\"fa fa-camera\" aria-hidden=\"true\"></i><br/>Upload Image</span>\r\n                          </button>\r\n                        </div>\r\n                        <div id=\"singleImageDiv{{card._id}}\" *ngIf=\"card.data.pictureUrl != ''\" [ngStyle]=\"{ 'background-image': 'url(' + card.data.pictureUrl + ')'}\"></div>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"addbutton addquickreply addquickreply2\" (click)=\"yourModal.open();addButton(card._id, 'image','addQuick')\">\r\n                        <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n                        Add Quick Reply \r\n                      </div>\r\n                    </div>\r\n                    <div class=\"top-buttons\">\r\n                      <div class=\"button-remove\">\r\n                        remove\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"row blocksdivAddQuickReply\">\r\n                \r\n                    <div class=\"addQuickReplyList addQuickReplyListDisplay\" *ngFor=\"let addButton of card.data.quickReplyButton\">\r\n                      <a href=\"#\" class=\"close\" (click)=\"deleteQuickReply(addButton._addButtonId, card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\">&#10007;</a>\r\n                       <label>{{addButton.buttonname}}</label>\r\n                       <p>{{addButton.urlblockname}}</p>\r\n                    </div>       \r\n                \r\n              </div>\r\n            </li>\r\n            <li class=\"list-group-item\" *ngIf=\"card.type == 'article'\" id=\"{{card._id}}\">\r\n              <a href=\"#\" class=\"close\" (click)=\"deleteResponseMessage(card._id)\" data-dismiss=\"alert\" aria-hidden=\"true\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>\r\n              <div class=\"row\">\r\n                <!--<div class=\"col-md-6 col-lg-6 col-xs-12 col-sm-12\">-->\r\n                  <div class=\"card col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                    <div class=\"card-content col-md-12 col-lg-12 col-xs-12 col-sm-12\">\r\n                      <div class=\"contenttitle textcard\">\r\n                        <textarea id=\"articleCardTitle{{card._id}}\" maxlength=\"80\" placeholder=\"title\" (change)=\"updateTitleArticleCard(card._id)\">{{card.data.text}}</textarea>\r\n                      </div>\r\n                      <ckeditor\r\n                        [(ngModel)]=\"ckeditorContent[i]\"\r\n                        [config]=\"{toolbarGroups: [{'name':'basicstyles','groups':['basicstyles']},{'name':'links','groups':['links']}], removeButtons: 'Subscript,Superscript'}\"\r\n                        (change)=\"onChange($event, card._id)\"\r\n                        (ready)=\"onReady($event, i, card._id)\"\r\n                        (focus)=\"onFocus($event, i)\"\r\n                        (blur)=\"onBlur($event, card._id, i)\"\r\n                        debounce=\"500\">\r\n                      </ckeditor>\r\n                    </div>\r\n                      \r\n                  </div>\r\n                <!--</div>-->\r\n              </div>\r\n            </li>\r\n          </div>\r\n        </ul>\r\n        <div class=\"row topmargin\" style=\"padding-left:11%\">\r\n          <div class=\"col-md-3 col-lg-3\">\r\n            <legend>\r\n              <span>Add a Card</span>\r\n            </legend>\r\n          </div>\r\n        </div>\r\n        <div class=\"row\" style=\"padding-left:11%\">\r\n          <div class=\"col-md-12 col-lg-12\">\r\n            <div class=\"btn-group\">\r\n              <button type=\"button\" (click)=\"addCard(1)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i><br/>Gallery</button>\r\n              <button type=\"button\" (click)=\"addCard(2)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-file-text-o\" aria-hidden=\"true\"></i><br/>Text Card</button>\r\n              <button type=\"button\" (click)=\"addCard(3)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i><br/>Image</button>\r\n              <button type=\"button\" (click)=\"addCard(4)\" class=\"btn width-100 mb-xs\"><i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i><br/>Article</button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-md-6 col-sm-12 col-lg-6 col-xs-12 articleEditor\" style=\"display:none\">\r\n        \r\n      </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n <modal #myModal>\r\n  <modal-header>\r\n    <h4 class=\"modal-title text-xs-center fw-bold mt\" id=\"myModalLabel18\">Add Buttons to Response</h4>\r\n    <input id=\"buttonName\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonName\" placeholder=\"Enter Button Name\" style=\"width:88%;margin-left:5%;\"/>\r\n  </modal-header>\r\n  <modal-content>\r\n   <div class=\"col-md-12 col-lg-12\">\r\n      <ul class=\"addButtonList\">\r\n        <li (click)=\"modalChangeTab(1)\" id=\"blockBtn\" class=\"addButtonListItem modalliactive\"><a class=\"modalliitem\">Blocks</a></li>\r\n        <li (click)=\"modalChangeTab(2)\" id=\"urlBtn\" class=\"addButtonListItem\"><a class=\"modalliitem\">Url</a></li>\r\n      </ul>\r\n      <div class=\"modalContent\">\r\n        <div id=\"blockContent\" class=\"row modalContentActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <select class=\"form-control\" [(ngModel)]=\"AddButtonBlock\" name=\"blocksdd\" id=\"simple-select\">\r\n                  <option selected=\"selected\" value=\"0\">Select Block</option>\r\n                  <option *ngFor=\"let card of select2GroupedData\" value=\"{{card.id}}\">{{card.text}}</option>\r\n                  \r\n                </select>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"addButtonPost(1)\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>    \r\n        <div id=\"urlContent\" class=\"row modalContentDeActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <input id=\"urlContentData\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonUrl\" placeholder=\"Enter Url\"/>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"addButtonPost(2)\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div id=\"articleContent\" class=\"row modalContentDeActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <input id=\"urlContentData\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonUrl\" placeholder=\"Enter Url\"/>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"addButtonPost(2)\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n  </div>\r\n  </modal-content>\r\n  <modal-footer>\r\n  </modal-footer>\r\n</modal>\r\n<modal #yourModal>\r\n  <modal-header>\r\n    <h4 class=\"modal-title text-xs-center fw-bold mt\" id=\"myModalLabel18\">Add Quick Reply to Response</h4>\r\n    <input id=\"buttonName\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonName\" placeholder=\"Enter Button Name\" style=\"width:88%;margin-left:5%;\"/>\r\n  </modal-header>\r\n  <modal-content>\r\n   <div class=\"col-md-12 col-lg-12\">\r\n      <ul class=\"addButtonList\">\r\n        <li id=\"blockBtn\" class=\"addButtonListItem\"><a class=\"modalliitem\" style=\"padding: 0em 6em;\">Blocks</a></li>\r\n      </ul>\r\n      <div class=\"modalContent\">\r\n        <div id=\"blockContent\" class=\"row modalContentActive\">\r\n          <div class=\"col-md-12 col-xs-12\">\r\n            <div class=\"form-group row\">\r\n              <div class=\"col-md-12\">\r\n                <select class=\"form-control\" [(ngModel)]=\"AddButtonBlock\" name=\"blocksdd\" id=\"simple-select\">\r\n                  <option selected=\"selected\" value=\"0\">Select Block</option>\r\n                  <option *ngFor=\"let card of select2GroupedData\" value=\"{{card.id}}\">{{card.text}}</option>   \r\n                </select>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button type=\"button\" class=\"btn btn-success btn-block\" (click)=\"addButtonPost(1)\">Save</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n  </div>\r\n  </modal-content>\r\n  <modal-footer>\r\n  </modal-footer>\r\n</modal>\r\n<modal #articleModal>\r\n  <modal-header>\r\n    <h4 class=\"modal-title text-xs-center fw-bold mt\" id=\"myModalLabel18\">Add Quick Reply to Response</h4>\r\n    <input id=\"buttonName\" type=\"text\" class=\"form-control\" [(ngModel)]=\"AddButtonName\" placeholder=\"Enter Button Name\" style=\"width:88%;margin-left:5%;\"/>\r\n  </modal-header>\r\n  <modal-content>\r\n   <div class=\"col-md-12 col-lg-12\">\r\n      <ul class=\"addButtonList\">\r\n        <li id=\"blockBtn\" class=\"addButtonListItem\"><a class=\"modalliitem\" style=\"padding: 0em 6em;\">Blocks</a></li>\r\n      </ul>\r\n      <div class=\"modalContent\">\r\n        \r\n      </div>\r\n  </div>\r\n  </modal-content>\r\n  <modal-footer>\r\n  </modal-footer>\r\n</modal>\r\n\r\n\r\n\r\n"

/***/ },

/***/ "./src/app/specific/specific.component.scss":
/***/ function(module, exports) {

module.exports = "@charset \"UTF-8\";\n@import url(\"https://fonts.googleapis.com/css?family=Open+Sans\");\nbody {\n  overflow-x: visible; }\n\n/*! Select2 Bootstrap Theme v0.1.0-beta.9 | MIT License | github.com/select2/select2-bootstrap-theme */\n.select2-container--bootstrap {\n  display: block;\n  /*------------------------------------*      #COMMON STYLES\n  \\*------------------------------------*/\n  /**\n   * Search field in the Select2 dropdown.\n   */\n  /**\n   * No outline for all search fields - in the dropdown\n   * and inline in multi Select2s.\n   */\n  /**\n   * Adjust Select2's choices hover and selected styles to match\n   * Bootstrap 3's default dropdown styles.\n   *\n   * @see http://getbootstrap.com/components/#dropdowns\n   */\n  /**\n   * Clear the selection.\n   */\n  /**\n   * Address disabled Select2 styles.\n   *\n   * @see https://select2.github.io/examples.html#disabled\n   * @see http://getbootstrap.com/css/#forms-control-disabled\n   */\n  /*------------------------------------*      #DROPDOWN\n  \\*------------------------------------*/\n  /**\n   * Dropdown border color and box-shadow.\n   */\n  /**\n   * Limit the dropdown height.\n   */\n  /*------------------------------------*      #SINGLE SELECT2\n  \\*------------------------------------*/\n  /*------------------------------------*    #MULTIPLE SELECT2\n  \\*------------------------------------*/\n  /**\n   * Address Bootstrap control sizing classes\n   *\n   * 1. Reset Bootstrap defaults.\n   * 2. Adjust the dropdown arrow button icon position.\n   *\n   * @see http://getbootstrap.com/css/#forms-control-sizes\n   */\n  /* 1 */\n  /*------------------------------------*    #RTL SUPPORT\n  \\*------------------------------------*/ }\n  .select2-container--bootstrap .select2-selection {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    background-color: #fff;\n    border: 1px solid rgba(0, 0, 0, 0.15);\n    border-radius: 0.25rem;\n    color: #555555;\n    font-size: 1rem;\n    outline: 0; }\n    .select2-container--bootstrap .select2-selection.form-control {\n      border-radius: 0.25rem; }\n  .select2-container--bootstrap .select2-search--dropdown .select2-search__field {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    background-color: #fff;\n    border: 1px solid rgba(0, 0, 0, 0.15);\n    border-radius: 0.25rem;\n    color: #555555;\n    font-size: 1rem; }\n  .select2-container--bootstrap .select2-search__field {\n    outline: 0;\n    /* Firefox 18- */\n    /**\n     * Firefox 19+\n     *\n     * @see http://stackoverflow.com/questions/24236240/color-for-styled-placeholder-text-is-muted-in-firefox\n     */ }\n    .select2-container--bootstrap .select2-search__field::-webkit-input-placeholder {\n      color: #999; }\n    .select2-container--bootstrap .select2-search__field:-moz-placeholder {\n      color: #999; }\n    .select2-container--bootstrap .select2-search__field::-moz-placeholder {\n      color: #999;\n      opacity: 1; }\n    .select2-container--bootstrap .select2-search__field:-ms-input-placeholder {\n      color: #999; }\n  .select2-container--bootstrap .select2-results__option {\n    padding: 6px 12px;\n    /**\n     * Disabled results.\n     *\n     * @see https://select2.github.io/examples.html#disabled-results\n     */\n    /**\n     * Hover state.\n     */\n    /**\n     * Selected state.\n     */ }\n    .select2-container--bootstrap .select2-results__option[role=group] {\n      padding: 0; }\n    .select2-container--bootstrap .select2-results__option[aria-disabled=true] {\n      color: #999999;\n      cursor: not-allowed; }\n    .select2-container--bootstrap .select2-results__option[aria-selected=true] {\n      background-color: #f5f5f5;\n      color: #272727; }\n    .select2-container--bootstrap .select2-results__option--highlighted[aria-selected] {\n      background-color: #5d8fc2;\n      color: #fff; }\n    .select2-container--bootstrap .select2-results__option .select2-results__option {\n      padding: 6px 12px; }\n      .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__group {\n        padding-left: 0; }\n      .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option {\n        margin-left: -12px;\n        padding-left: 24px; }\n        .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n          margin-left: -24px;\n          padding-left: 36px; }\n          .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n            margin-left: -36px;\n            padding-left: 48px; }\n            .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n              margin-left: -48px;\n              padding-left: 60px; }\n              .select2-container--bootstrap .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option .select2-results__option {\n                margin-left: -60px;\n                padding-left: 72px; }\n  .select2-container--bootstrap .select2-results__group {\n    color: #999999;\n    display: block;\n    padding: 6px 12px;\n    font-size: 0.875rem;\n    line-height: 1.5;\n    white-space: nowrap; }\n  .select2-container--bootstrap.select2-container--focus .select2-selection, .select2-container--bootstrap.select2-container--open .select2-selection {\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(77, 144, 254, 0.6);\n    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n    border-color: #4D90FE; }\n  .select2-container--bootstrap.select2-container--open {\n    /**\n     * Make the dropdown arrow point up while the dropdown is visible.\n     */\n    /**\n     * Handle border radii of the container when the dropdown is showing.\n     */ }\n    .select2-container--bootstrap.select2-container--open .select2-selection .select2-selection__arrow b {\n      border-color: transparent transparent #999 transparent;\n      border-width: 0 4px 4px 4px; }\n    .select2-container--bootstrap.select2-container--open.select2-container--below .select2-selection {\n      border-bottom-right-radius: 0;\n      border-bottom-left-radius: 0;\n      border-bottom-color: transparent; }\n    .select2-container--bootstrap.select2-container--open.select2-container--above .select2-selection {\n      border-top-right-radius: 0;\n      border-top-left-radius: 0;\n      border-top-color: transparent; }\n  .select2-container--bootstrap .select2-selection__clear {\n    color: #999;\n    cursor: pointer;\n    float: right;\n    font-weight: bold;\n    margin-right: 10px; }\n    .select2-container--bootstrap .select2-selection__clear:hover {\n      color: #f8f8f8; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection {\n    border-color: rgba(0, 0, 0, 0.15);\n    box-shadow: none; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection,\n  .select2-container--bootstrap.select2-container--disabled .select2-search__field {\n    cursor: not-allowed; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection,\n  .select2-container--bootstrap.select2-container--disabled .select2-selection--multiple .select2-selection__choice {\n    background-color: #eeeeee; }\n  .select2-container--bootstrap.select2-container--disabled .select2-selection__clear,\n  .select2-container--bootstrap.select2-container--disabled .select2-selection--multiple .select2-selection__choice__remove {\n    display: none; }\n  .select2-container--bootstrap .select2-dropdown {\n    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n    border-color: #4D90FE;\n    overflow-x: hidden;\n    margin-top: -1px; }\n    .select2-container--bootstrap .select2-dropdown--above {\n      box-shadow: 0px -6px 12px rgba(0, 0, 0, 0.175);\n      margin-top: 1px; }\n  .select2-container--bootstrap .select2-results > .select2-results__options {\n    max-height: 200px;\n    overflow-y: auto; }\n  .select2-container--bootstrap .select2-selection--single {\n    height: 35px;\n    line-height: 1.5;\n    padding: 6px 24px 6px 12px;\n    /**\n     * Adjust the single Select2's dropdown arrow button appearance.\n     */ }\n    .select2-container--bootstrap .select2-selection--single .select2-selection__arrow {\n      position: absolute;\n      bottom: 0;\n      right: 12px;\n      top: 0;\n      width: 4px; }\n      .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b {\n        border-color: #999 transparent transparent transparent;\n        border-style: solid;\n        border-width: 4px 4px 0 4px;\n        height: 0;\n        left: 0;\n        margin-left: -4px;\n        margin-top: -2px;\n        position: absolute;\n        top: 50%;\n        width: 0; }\n    .select2-container--bootstrap .select2-selection--single .select2-selection__rendered {\n      color: #555555;\n      padding: 0; }\n    .select2-container--bootstrap .select2-selection--single .select2-selection__placeholder {\n      color: #999; }\n  .select2-container--bootstrap .select2-selection--multiple {\n    min-height: 35px;\n    padding: 0;\n    height: auto;\n    /**\n     * Make Multi Select2's choices match Bootstrap 3's default button styles.\n     */\n    /**\n     * Minus 2px borders.\n     */\n    /**\n     * Clear the selection.\n     */ }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__rendered {\n      box-sizing: border-box;\n      display: block;\n      line-height: 1.5;\n      list-style: none;\n      margin: 0;\n      overflow: hidden;\n      padding: 0;\n      width: 100%;\n      text-overflow: ellipsis;\n      white-space: nowrap; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__placeholder {\n      color: #999;\n      float: left;\n      margin-top: 5px; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {\n      color: #555555;\n      background: #f8f8f8;\n      border: 1px solid transparent;\n      border-radius: 0.25rem;\n      cursor: default;\n      float: left;\n      margin: 5px 0 0 6px;\n      padding: 0 6px; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {\n      background: transparent;\n      padding: 0 12px;\n      height: 33px;\n      line-height: 1.5;\n      margin-top: 0;\n      min-width: 5em; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice__remove {\n      color: #999;\n      cursor: pointer;\n      display: inline-block;\n      font-weight: bold;\n      margin-right: 3px; }\n      .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice__remove:hover {\n        color: #f8f8f8; }\n    .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear {\n      margin-top: 6px; }\n  .select2-container--bootstrap .select2-selection--single.input-sm,\n  .input-group-sm .select2-container--bootstrap .select2-selection--single,\n  .form-group-sm .select2-container--bootstrap .select2-selection--single {\n    border-radius: 0.2rem;\n    font-size: 0.875rem;\n    height: 1.8125rem;\n    line-height: 1.5;\n    padding: 5px 22px 5px 10px;\n    /* 2 */ }\n    .select2-container--bootstrap .select2-selection--single.input-sm .select2-selection__arrow b,\n    .input-group-sm .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b,\n    .form-group-sm .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b {\n      margin-left: -5px; }\n  .select2-container--bootstrap .select2-selection--multiple.input-sm,\n  .input-group-sm .select2-container--bootstrap .select2-selection--multiple,\n  .form-group-sm .select2-container--bootstrap .select2-selection--multiple {\n    min-height: 1.8125rem;\n    border-radius: 0.2rem; }\n    .select2-container--bootstrap .select2-selection--multiple.input-sm .select2-selection__choice,\n    .input-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice,\n    .form-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {\n      font-size: 0.875rem;\n      line-height: 1.5;\n      margin: 4px 0 0 5px;\n      padding: 0 5px; }\n    .select2-container--bootstrap .select2-selection--multiple.input-sm .select2-search--inline .select2-search__field,\n    .input-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field,\n    .form-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {\n      padding: 0 10px;\n      font-size: 0.875rem;\n      height: -0.1875rem;\n      line-height: 1.5; }\n    .select2-container--bootstrap .select2-selection--multiple.input-sm .select2-selection__clear,\n    .input-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear,\n    .form-group-sm .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear {\n      margin-top: 5px; }\n  .select2-container--bootstrap .select2-selection--single.input-lg,\n  .input-group-lg .select2-container--bootstrap .select2-selection--single,\n  .form-group-lg .select2-container--bootstrap .select2-selection--single {\n    border-radius: 0.3rem;\n    font-size: 1.25rem;\n    height: 3.16667rem;\n    line-height: 1.33333;\n    padding: 10px 28px 10px 16px;\n    /* 1 */ }\n    .select2-container--bootstrap .select2-selection--single.input-lg .select2-selection__arrow,\n    .input-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow,\n    .form-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow {\n      width: 4px; }\n      .select2-container--bootstrap .select2-selection--single.input-lg .select2-selection__arrow b,\n      .input-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b,\n      .form-group-lg .select2-container--bootstrap .select2-selection--single .select2-selection__arrow b {\n        border-width: 4px 4px 0 4px;\n        margin-left: -4px;\n        margin-left: -10px;\n        margin-top: -2px; }\n  .select2-container--bootstrap .select2-selection--multiple.input-lg,\n  .input-group-lg .select2-container--bootstrap .select2-selection--multiple,\n  .form-group-lg .select2-container--bootstrap .select2-selection--multiple {\n    min-height: 3.16667rem;\n    border-radius: 0.3rem; }\n    .select2-container--bootstrap .select2-selection--multiple.input-lg .select2-selection__choice,\n    .input-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice,\n    .form-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {\n      font-size: 1.25rem;\n      line-height: 1.33333;\n      border-radius: 0.25rem;\n      margin: 9px 0 0 8px;\n      padding: 0 10px; }\n    .select2-container--bootstrap .select2-selection--multiple.input-lg .select2-search--inline .select2-search__field,\n    .input-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field,\n    .form-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {\n      padding: 0 16px;\n      font-size: 1.25rem;\n      height: 1.16667rem;\n      line-height: 1.33333; }\n    .select2-container--bootstrap .select2-selection--multiple.input-lg .select2-selection__clear,\n    .input-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear,\n    .form-group-lg .select2-container--bootstrap .select2-selection--multiple .select2-selection__clear {\n      margin-top: 10px; }\n  .select2-container--bootstrap .select2-selection.input-lg.select2-container--open .select2-selection--single {\n    /**\n     * Make the dropdown arrow point up while the dropdown is visible.\n     */ }\n    .select2-container--bootstrap .select2-selection.input-lg.select2-container--open .select2-selection--single .select2-selection__arrow b {\n      border-color: transparent transparent #999 transparent;\n      border-width: 0 4px 4px 4px; }\n  .input-group-lg .select2-container--bootstrap .select2-selection.select2-container--open .select2-selection--single {\n    /**\n     * Make the dropdown arrow point up while the dropdown is visible.\n     */ }\n    .input-group-lg .select2-container--bootstrap .select2-selection.select2-container--open .select2-selection--single .select2-selection__arrow b {\n      border-color: transparent transparent #999 transparent;\n      border-width: 0 4px 4px 4px; }\n  .select2-container--bootstrap[dir=\"rtl\"] {\n    /**\n     * Single Select2\n     *\n     * 1. Makes sure that .select2-selection__placeholder is positioned\n     *    correctly.\n     */\n    /**\n     * Multiple Select2\n     */ }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single {\n      padding-left: 24px;\n      padding-right: 12px; }\n      .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__rendered {\n        padding-right: 0;\n        padding-left: 0;\n        text-align: right;\n        /* 1 */ }\n      .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__clear {\n        float: left; }\n      .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow {\n        left: 12px;\n        right: auto; }\n        .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--single .select2-selection__arrow b {\n          margin-left: 0; }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice,\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__placeholder {\n      float: right; }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice {\n      margin-left: 0;\n      margin-right: 6px; }\n    .select2-container--bootstrap[dir=\"rtl\"] .select2-selection--multiple .select2-selection__choice__remove {\n      margin-left: 2px;\n      margin-right: auto; }\n\n/*------------------------------------*  #ADDITIONAL GOODIES\n\\*------------------------------------*/\n/**\n * Address Bootstrap's validation states\n *\n * If a Select2 widget parent has one of Bootstrap's validation state modifier\n * classes, adjust Select2's border colors and focus states accordingly.\n * You may apply said classes to the Select2 dropdown (body > .select2-container)\n * via JavaScript match Bootstraps' to make its styles match.\n *\n * @see http://getbootstrap.com/css/#forms-control-validation\n */\n.has-warning .select2-dropdown,\n.has-warning .select2-selection {\n  border-color: #8a6d3b; }\n\n.has-warning .select2-container--focus .select2-selection,\n.has-warning .select2-container--open .select2-selection {\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n  border-color: #66512c; }\n\n.has-warning.select2-drop-active {\n  border-color: #66512c; }\n  .has-warning.select2-drop-active.select2-drop.select2-drop-above {\n    border-top-color: #66512c; }\n\n.has-error .select2-dropdown,\n.has-error .select2-selection {\n  border-color: #a94442; }\n\n.has-error .select2-container--focus .select2-selection,\n.has-error .select2-container--open .select2-selection {\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n  border-color: #843534; }\n\n.has-error.select2-drop-active {\n  border-color: #843534; }\n  .has-error.select2-drop-active.select2-drop.select2-drop-above {\n    border-top-color: #843534; }\n\n.has-success .select2-dropdown,\n.has-success .select2-selection {\n  border-color: #3c763d; }\n\n.has-success .select2-container--focus .select2-selection,\n.has-success .select2-container--open .select2-selection {\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n  border-color: #2b542c; }\n\n.has-success.select2-drop-active {\n  border-color: #2b542c; }\n  .has-success.select2-drop-active.select2-drop.select2-drop-above {\n    border-top-color: #2b542c; }\n\n/**\n * Select2 widgets in Bootstrap Input Groups\n *\n * When Select2 widgets are combined with other elements using Bootstraps\n * \"Input Group\" component, we don't want specific edges of the Select2\n * container to have a border-radius.\n *\n * Use .select2-bootstrap-prepend and .select2-bootstrap-append on\n * a Bootstrap 3 .input-group to let the contained Select2 widget know which\n * edges should not be rounded as they are directly followed by another element.\n *\n * @see http://getbootstrap.com/components/#input-groups\n */\n/**\n * Mimick Bootstraps .input-group .form-control styles.\n *\n * @see https://github.com/twbs/bootstrap/blob/master/less/input-groups.less\n */\n.input-group .select2-container--bootstrap {\n  display: table;\n  table-layout: fixed;\n  position: relative;\n  z-index: 2;\n  float: left;\n  width: 100%;\n  margin-bottom: 0;\n  /**\n   * Adjust z-index like Bootstrap does to show the focus-box-shadow\n   * above appended buttons in .input-group and .form-group.\n   */ }\n  .input-group .select2-container--bootstrap.select2-container--open, .input-group .select2-container--bootstrap.select2-container--focus {\n    z-index: 3; }\n\n.input-group.select2-bootstrap-prepend .select2-container--bootstrap .select2-selection {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.input-group.select2-bootstrap-append .select2-container--bootstrap .select2-selection {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n/**\n * Adjust alignment of Bootstrap buttons in Bootstrap Input Groups to address\n * Multi Select2's height which - depending on how many elements have been selected -\n * may grow taller than its initial size.\n *\n * @see http://getbootstrap.com/components/#input-groups\n */\n.select2-bootstrap-append .select2-container--bootstrap,\n.select2-bootstrap-append .input-group-btn,\n.select2-bootstrap-append .input-group-btn .btn,\n.select2-bootstrap-prepend .select2-container--bootstrap,\n.select2-bootstrap-prepend .input-group-btn,\n.select2-bootstrap-prepend .input-group-btn .btn {\n  vertical-align: top; }\n\n/**\n * Temporary fix for https://github.com/select2/select2-bootstrap-theme/issues/9\n *\n * Provides `!important` for certain properties of the class applied to the\n * original `<select>` element to hide it.\n *\n * @see https://github.com/select2/select2/pull/3301\n * @see https://github.com/fk/select2/commit/31830c7b32cb3d8e1b12d5b434dee40a6e753ada\n */\n.form-control.select2-hidden-accessible {\n  position: absolute !important;\n  width: 1px !important; }\n\n/**\n * Display override for inline forms\n */\n.form-inline .select2-container--bootstrap {\n  display: inline-block; }\n\n.md-editor {\n  display: block;\n  border: 1px solid #ddd; }\n\n.md-editor .md-footer, .md-editor > .md-header {\n  display: block;\n  padding: 6px 4px;\n  background: #f5f5f5; }\n\n.md-editor > .md-header {\n  margin: 0; }\n\n.md-editor > .md-preview {\n  background: #fff;\n  border-top: 1px dashed #ddd;\n  border-bottom: 1px dashed #ddd;\n  min-height: 10px;\n  overflow: auto; }\n\n.md-editor > textarea {\n  font-family: Menlo,Monaco,Consolas,\"Courier New\",monospace;\n  font-size: 14px;\n  outline: 0;\n  margin: 0;\n  display: block;\n  padding: 0;\n  width: 100%;\n  border: 0;\n  border-top: 1px dashed #ddd;\n  border-bottom: 1px dashed #ddd;\n  border-radius: 0;\n  box-shadow: none;\n  background: #eee; }\n\n.md-editor > textarea:focus {\n  box-shadow: none;\n  background: #fff; }\n\n.md-editor.active {\n  border-color: #66afe9;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n\n.md-editor .md-controls {\n  float: right;\n  padding: 3px; }\n\n.md-editor .md-controls .md-control {\n  right: 5px;\n  color: #bebebe;\n  padding: 3px 3px 3px 10px; }\n\n.md-editor .md-controls .md-control:hover {\n  color: #333; }\n\n.md-editor.md-fullscreen-mode {\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 99999;\n  padding: 60px 30px 15px;\n  background: #fff !important;\n  border: 0 !important; }\n\n.md-editor.md-fullscreen-mode .md-footer {\n  display: none; }\n\n.md-editor.md-fullscreen-mode .md-input, .md-editor.md-fullscreen-mode .md-preview {\n  margin: 0 auto !important;\n  height: 100% !important;\n  font-size: 20px !important;\n  padding: 20px !important;\n  color: #999;\n  line-height: 1.6em !important;\n  resize: none !important;\n  box-shadow: none !important;\n  background: #fff !important;\n  border: 0 !important; }\n\n.md-editor.md-fullscreen-mode .md-preview {\n  color: #333;\n  overflow: auto; }\n\n.md-editor.md-fullscreen-mode .md-input:focus, .md-editor.md-fullscreen-mode .md-input:hover {\n  color: #333;\n  background: #fff !important; }\n\n.md-editor.md-fullscreen-mode .md-header {\n  background: 0 0;\n  text-align: center;\n  position: fixed;\n  width: 100%;\n  top: 20px; }\n\n.md-editor.md-fullscreen-mode .btn-group {\n  float: none; }\n\n.md-editor.md-fullscreen-mode .btn {\n  border: 0;\n  background: 0 0;\n  color: #b3b3b3; }\n\n.md-editor.md-fullscreen-mode .btn.active, .md-editor.md-fullscreen-mode .btn:active, .md-editor.md-fullscreen-mode .btn:focus, .md-editor.md-fullscreen-mode .btn:hover {\n  box-shadow: none;\n  color: #333; }\n\n.md-editor.md-fullscreen-mode .md-fullscreen-controls {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  text-align: right;\n  z-index: 1002;\n  display: block; }\n\n.md-editor.md-fullscreen-mode .md-fullscreen-controls a {\n  color: #b3b3b3;\n  clear: right;\n  margin: 10px;\n  width: 30px;\n  height: 30px;\n  text-align: center; }\n\n.md-editor.md-fullscreen-mode .md-fullscreen-controls a:hover {\n  color: #333;\n  text-decoration: none; }\n\n.md-editor.md-fullscreen-mode .md-editor {\n  height: 100% !important;\n  position: relative; }\n\n.md-editor .md-fullscreen-controls {\n  display: none; }\n\n.md-nooverflow {\n  overflow: hidden;\n  position: fixed;\n  width: 100%; }\n\n/**\r\n * Nestable\r\n */\nhtml body {\n  font-family: 'Open Sans', sans-serif; }\n\n.widget2 {\n  background-color: #eeeeee !important; }\n\n.dd {\n  position: relative;\n  display: block;\n  margin: 0;\n  padding: 0;\n  max-width: 600px;\n  list-style: none;\n  font-size: 13px;\n  line-height: 20px; }\n\n.dd-list {\n  display: block;\n  position: relative;\n  margin: 0;\n  padding: 0;\n  list-style: none; }\n\n.dd-list .dd-list {\n  padding-left: 30px; }\n\n.dd-collapsed .dd-list {\n  display: none; }\n\n.dd-item,\n.dd-empty,\n.dd-placeholder {\n  display: block;\n  position: relative;\n  margin: 0;\n  padding: 0;\n  min-height: 20px;\n  font-size: 13px;\n  line-height: 20px; }\n\n.dd-handle {\n  display: block;\n  height: 30px;\n  margin: 5px 0;\n  padding: 5px 10px;\n  color: #555555;\n  text-decoration: none;\n  background: #fff;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-sizing: border-box; }\n\n.dd-item > button {\n  display: block;\n  position: relative;\n  cursor: pointer;\n  float: left;\n  width: 25px;\n  height: 20px;\n  margin: 5px 0;\n  padding: 0;\n  text-indent: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  border: 0;\n  background: transparent;\n  font-size: 12px;\n  line-height: 1;\n  text-align: center;\n  font-weight: bold;\n  color: #555555; }\n  .dd-item > button:focus, .dd-item > button:active {\n    outline: 0; }\n\n.dd-item > button:before {\n  content: '+';\n  display: block;\n  position: absolute;\n  width: 100%;\n  text-align: center;\n  text-indent: 0; }\n\n.dd-item > button[data-action=\"collapse\"]:before {\n  content: '-'; }\n\n.dd-placeholder,\n.dd-empty {\n  margin: 5px 0;\n  padding: 0;\n  min-height: 30px;\n  background: #ddd;\n  border: 1px dashed #999999;\n  box-sizing: border-box;\n  border-radius: 0.25rem; }\n\n.dd-empty {\n  border: 1px dashed #999999;\n  min-height: 100px;\n  background-size: 60px 60px;\n  background-position: 0 0, 30px 30px;\n  background-image: -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);\n  background-image: linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF), linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF); }\n\n.dd-dragel {\n  position: absolute;\n  pointer-events: none;\n  z-index: 9999; }\n\n.dd-dragel > .dd-item .dd-handle {\n  margin-top: 0; }\n\n.dd-dragel .dd-handle {\n  -webkit-box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);\n  box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1); }\n\n/**\r\n * Nestable Extras\r\n */\n.nestable-lists {\n  display: block;\n  clear: both;\n  padding: 30px 0;\n  width: 100%;\n  border: 0;\n  border-top: 2px solid #ddd;\n  border-bottom: 2px solid #ddd; }\n\n@media only screen and (min-width: 700px) {\n  .dd + .dd {\n    margin-left: 2%; } }\n\n.dd-hover > .dd-handle {\n  background: #2ea8e5 !important; }\n\n/**\r\n * Nestable Draggable Handles\r\n */\n.dd3-content {\n  display: block;\n  height: 30px;\n  margin: 5px 0;\n  padding: 5px 10px 5px 40px;\n  color: #333;\n  text-decoration: none;\n  font-weight: bold;\n  border: 1px solid #ccc;\n  background: #fafafa;\n  background: linear-gradient(top, #fafafa 0%, #eee 100%);\n  border-radius: 3px;\n  box-sizing: border-box; }\n\n.dd3-content:hover {\n  color: #2ea8e5;\n  background: #fff; }\n\n.dd-dragel > .dd3-item > .dd3-content {\n  margin: 0; }\n\n.dd3-item > button {\n  margin-left: 30px; }\n\n.dd3-handle {\n  position: absolute;\n  margin: 0;\n  left: 0;\n  top: 0;\n  cursor: pointer;\n  width: 30px;\n  text-indent: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  border: 1px solid #aaa;\n  background: #ddd;\n  background: -webkit-linear-gradient(top, #ddd 0%, #bbb 100%);\n  background: -moz-linear-gradient(top, #ddd 0%, #bbb 100%);\n  background: linear-gradient(top, #ddd 0%, #bbb 100%);\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.dd3-handle:before {\n  content: '≡';\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 3px;\n  width: 100%;\n  text-align: center;\n  text-indent: 0;\n  color: #fff;\n  font-size: 20px;\n  font-weight: normal; }\n\n.button-ver2.trash-popup {\n  position: absolute;\n  z-index: 10000;\n  background-color: #fff;\n  color: black;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);\n  border: 1px solid rgba(0, 0, 0, 0.12);\n  border-radius: 50%;\n  transform: scale(0.3);\n  opacity: 0;\n  transition: transform 0.2s cubic-bezier(0.2, 0.7, 0.5, 1), opacity 0.2s cubic-bezier(0.2, 0.7, 0.5, 1); }\n\n.mini:hover {\n  display: block; }\n\n.trash-popup {\n  top: -6px;\n  right: -6px;\n  left: auto; }\n\n.button-ver2 {\n  width: 20px;\n  height: 20px; }\n\n.button-ver2 {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor: pointer; }\n\n.blocksdiv {\n  padding-top: 2%;\n  padding-left: 15%; }\n\n.divseparator {\n  border-right: 1px solid #eeeeee; }\n\n.list-group-item {\n  font-weight: bold; }\n\nlegend {\n  border-bottom: 0px solid #e5e5e5; }\n\n.blockbtns {\n  font-size: 12px;\n  padding-top: 7px;\n  height: 35px;\n  margin-right: 2%;\n  width: 25%;\n  border: 1px solid #a6a6a6;\n  border-radius: 10%;\n  text-align: center;\n  background-color: #a6a6a6;\n  font-weight: normal;\n  color: white;\n  cursor: pointer;\n  margin-bottom: 2%;\n  position: relative;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\n.dd3-handle:hover {\n  background: #ddd; }\n\n.GroupBtn {\n  padding-left: 3%;\n  padding-top: 3%; }\n\n.GroupForm {\n  padding-left: 3%;\n  padding-top: 3%; }\n\n/***********************************/\n/**      LIST GROUP SORTABLE      **/\n/***********************************/\n.list-group-sortable > .list-group-item {\n  margin-bottom: 0;\n  border-radius: 0.25rem; }\n  .list-group-sortable > .list-group-item + .list-group-item {\n    margin-top: 0.5rem; }\n\n.list-group-sortable > .list-group-item-placeholder {\n  border: 1px dashed #999999;\n  background-color: #ddd; }\n\n.list-group-sortable:last-of-type > .list-group-item:last-child {\n  border-bottom: 1px solid #ddd; }\n\n.list-group-sortable2 > .list-group-item {\n  margin-bottom: 0;\n  border-radius: 0.25rem; }\n  .list-group-sortable2 > .list-group-item + .list-group-item {\n    margin-top: 0.5rem; }\n\n.list-group-sortable2 > .list-group-item-placeholder {\n  border: 1px dashed #999999;\n  background-color: #ddd; }\n\n.list-group-sortable2:last-of-type > .list-group-item:last-child {\n  border-bottom: 1px solid #ddd; }\n\n.image-inner div {\n  height: 144px;\n  background-position: 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  transition: opacity .1s;\n  background-color: #fff;\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px; }\n\n.card-content .content {\n  padding: 3px; }\n\n.contenttitle textarea {\n  height: 54px;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.4;\n  top: -1px;\n  color: #1d1d1d;\n  padding: 2px 6px 0 !important; }\n\n.contenttitle textarea {\n  width: 100%;\n  display: block;\n  padding: 3px 6px 0;\n  background-color: #eee;\n  border: 1px solid transparent;\n  resize: none;\n  transition: border-color .1s;\n  margin: 0;\n  overflow: hidden;\n  white-space: inherit; }\n\n.contenttitle input {\n  width: 100%;\n  display: block;\n  padding: 3px 6px 0;\n  background-color: #eee;\n  border: 1px solid transparent;\n  resize: none;\n  transition: border-color .1s;\n  margin: 0;\n  overflow: hidden;\n  white-space: inherit;\n  font-weight: 600; }\n\ninput:focus {\n  outline: none !important;\n  border: 1px solid #5dc4bf;\n  box-shadow: 0 0 10px #719ECE;\n  border-radius: 7px; }\n\n.image-inner {\n  border-bottom: 1px solid #fff; }\n\n.image-inner2 div {\n  height: 144px;\n  background-position: 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  transition: opacity .1s;\n  background-color: #fff;\n  border-radius: 7px; }\n\ntextarea:focus {\n  outline: none !important;\n  border: 1px solid #5dc4bf;\n  box-shadow: 0 0 10px #719ECE;\n  border-radius: 7px; }\n\n.addbutton {\n  background-color: #eee;\n  font-size: 14px;\n  font-weight: normal;\n  color: #a6a6a6;\n  text-align: center;\n  line-height: 48px;\n  height: 49px;\n  cursor: pointer;\n  text-transform: uppercase;\n  border-bottom-left-radius: 7px;\n  border-bottom-right-radius: 7px; }\n\n::-webkit-input-placeholder {\n  text-align: center; }\n\n.btn-gray {\n  background-color: #eee;\n  border-color: #fff;\n  color: #a6a6a6; }\n\n.list-group-sortable .list-group-item {\n  font-weight: normal;\n  color: #a6a6a6; }\n\n.button-image--replace {\n  background-color: #eee;\n  color: #a6a6a6;\n  font-weight: normal;\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px;\n  background-position: center 51px;\n  width: 100%;\n  height: 144px !important;\n  top: 0 !important;\n  margin: 0;\n  line-height: 65px !important;\n  display: inline-block !important;\n  padding: 0;\n  border: none;\n  outline: none; }\n\n.button-image__title {\n  color: #a6a6a6;\n  font-size: 16px;\n  position: static !important;\n  display: inline-block !important;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: bottom;\n  line-height: 1.43; }\n\n:-moz-placeholder {\n  /* Firefox 18- */\n  text-align: center; }\n\n::-moz-placeholder {\n  /* Firefox 19+ */\n  text-align: center; }\n\n:-ms-input-placeholder {\n  text-align: center; }\n\n.topmargin {\n  margin-top: 5%; }\n\n.button-image:hover {\n  opacity: 1;\n  color: #555555;\n  background-color: #c4c4c4;\n  border-color: #fff; }\n\n.addbutton:hover {\n  opacity: 1;\n  color: #555555;\n  background-color: #c4c4c4;\n  border-color: #fff; }\n\n.contenturl {\n  border-bottom: 1px solid #fff; }\n\n.top-buttons {\n  position: absolute;\n  right: -8px;\n  top: -28px;\n  height: 27px;\n  width: 271px;\n  text-align: right;\n  opacity: 1;\n  transition: opacity .1s;\n  -webkit-transition: opacity .1s;\n  white-space: nowrap;\n  padding: 0 4px 0 0;\n  z-index: 10; }\n\n.button-remove {\n  top: 21px;\n  left: 238px;\n  position: absolute;\n  margin: 0;\n  width: 32px;\n  height: 32px;\n  background: #fff none;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 16px;\n  transform: scale(0.3);\n  opacity: 0;\n  transition: opacity 0.2s cubic-bezier(0.2, 0.7, 0.5, 1), transform 0.2s cubic-bezier(0.2, 0.7, 0.5, 1); }\n\n.top-buttons .button.remove::before {\n  content: \"\";\n  position: absolute;\n  background: url(assets/img/download.png) 50% no-repeat;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 31px;\n  opacity: .3;\n  transition: opasity 60ms; }\n\n.card.add::after {\n  content: \" \";\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  vertical-align: middle;\n  background: url(assets/img/plus.png) no-repeat 50%;\n  opacity: .3; }\n\n.card.add {\n  width: 85%;\n  margin-top: 8%;\n  height: 333px;\n  line-height: 333px;\n  text-align: center;\n  cursor: pointer;\n  border: 1px solid;\n  border-color: #fff;\n  background-color: #eee; }\n\n.textcard textarea {\n  background-color: white;\n  border: 1px solid #ddd;\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px; }\n\n.list-group-sortable2 .list-group-item {\n  cursor: move;\n  margin: 5px; }\n\n.or {\n  height: 24px;\n  font-size: 12px;\n  line-height: 24px;\n  text-align: center;\n  color: #a6a6a6;\n  text-transform: uppercase; }\n\n.addquickreply {\n  border-radius: 20px;\n  height: 40px;\n  line-height: 40px; }\n\n.addquickreply {\n  font-size: 14px;\n  font-weight: normal;\n  text-align: center;\n  padding: 0;\n  outline: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-transform: uppercase;\n  border-bottom-color: rgba(0, 0, 0, 0.17);\n  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.13);\n  transition: box-shadow 80ms ease 0s,border-top-color 80ms ease 0s,border-right-color 80ms ease 0s,border-bottom-color 80ms ease 0s,border-left-color 80ms ease 0s,background-color 80ms ease 0s; }\n\n.button-image2 {\n  border-radius: 7px; }\n\n.addquickreply2 {\n  margin-top: 5%; }\n\n.btn-info {\n  background-color: #a6a6a6;\n  border-color: #a6a6a6; }\n\n.galleryHorizontalRow {\n  display: -webkit-inline-box;\n  overflow-x: scroll;\n  padding-bottom: 10%; }\n\n.galleryColumns {\n  width: 50%; }\n\n.galleryHorizontalRow::-webkit-scrollbar {\n  width: 2px;\n  height: 5px; }\n\n.galleryHorizontalRow::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n  border-radius: 7px; }\n\n.galleryHorizontalRow::-webkit-scrollbar-thumb {\n  border-radius: 7px;\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); }\n\n.list-group-item {\n  border-bottom: 1px solid #ddd !important; }\n\n.addBlock2 {\n  background-color: #eee;\n  border-color: #fff;\n  color: #a6a6a6; }\n\n.blockactive {\n  background-color: #053748; }\n\n.addButtonList {\n  padding: 0;\n  list-style: none;\n  display: table;\n  table-layout: fixed;\n  width: 100%; }\n\n.addButtonListItem {\n  display: inline;\n  display: table-cell;\n  padding: 0em 4.5em;\n  cursor: pointer; }\n\n.modalliactive {\n  border: 1px solid #ddd;\n  border-bottom: none;\n  border-top-left-radius: 5px;\n  border-top-right-radius: 5px;\n  background-color: #ddd; }\n\n.modalliitem {\n  font-weight: 600;\n  font-size: 14px;\n  color: #a6a6a6; }\n\n.modal-dialog {\n  max-width: 400px !important;\n  margin: 30px auto; }\n\n.modalContentActive {\n  display: block; }\n\n.modalContentDeActive {\n  display: none; }\n\n/**\r\n * select2\r\n */\n.select2-container .select2-choice abbr {\n  background: url(\"assets/select2/select2.png\") right top no-repeat; }\n\n.select2-container .select2-choice .select2-arrow b {\n  background: url(\"assets/select2/select2.png\") no-repeat 0 1px; }\n\n.select2-search input {\n  background: #fff url(\"assets/select2/select2.png\") no-repeat 100% -22px;\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, -webkit-gradient(linear, left bottom, left top, color-stop(0.85, #fff), color-stop(0.99, #eee));\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, -webkit-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, -moz-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat 100% -22px, linear-gradient(to bottom, #fff 85%, #eee 99%) 0 0; }\n\nhtml[dir=\"rtl\"] .select2-search input {\n  background: #fff url(\"assets/select2/select2.png\") no-repeat -37px -22px;\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, -webkit-gradient(linear, left bottom, left top, color-stop(0.85, #fff), color-stop(0.99, #eee));\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, -webkit-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, -moz-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2.png\") no-repeat -37px -22px, linear-gradient(to bottom, #fff 85%, #eee 99%) 0 0; }\n\n.select2-search-choice-close {\n  background: url(\"assets/select2/select2.png\") right top no-repeat; }\n\n.select2-search input.select2-active {\n  background: #fff url(\"assets/select2/select2-spinner.gif\") no-repeat 100%;\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, -webkit-gradient(linear, left bottom, left top, color-stop(0.85, #fff), color-stop(0.99, #eee));\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, -webkit-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, -moz-linear-gradient(center bottom, #fff 85%, #eee 99%);\n  background: url(\"assets/select2/select2-spinner.gif\") no-repeat 100%, linear-gradient(to bottom, #fff 85%, #eee 99%) 0 0; }\n\n.select2-more-results.select2-active {\n  background: #f4f4f4 url(\"assets/select2/select2-spinner.gif\") no-repeat 100%; }\n\n.select2-container-multi .select2-choices .select2-search-field input.select2-active {\n  background: #fff url(\"assets/select2/select2-spinner.gif\") no-repeat 100% !important; }\n\n.select2-container .select2-selection--single .select2-selection__rendered {\n  color: #555555;\n  padding: 0; }\n\n.addbuttonResultList {\n  background-color: #eeeeee;\n  text-align: center;\n  margin-bottom: -13px; }\n\n.addQuickReplyList {\n  background-color: #eeeeee;\n  text-align: center;\n  margin-bottom: -13px; }\n\n.modalError {\n  border: 1px solid red; }\n\n.addQuickReplyListDisplay {\n  padding: 3px 3% 0 3%;\n  height: 55px;\n  margin-right: 2%;\n  border: 1px solid #053748;\n  border-radius: 10%;\n  text-align: center;\n  font-weight: normal;\n  color: black;\n  cursor: pointer;\n  margin-bottom: 2%;\n  position: relative;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);\n  background-color: white;\n  transition: padding .1s; }\n\n.blocksdivAddQuickReply {\n  padding-top: 2%;\n  padding-left: 7%; }\n\n.articleEditor {\n  padding: 2%; }\n\n.md-editor > textarea {\n  background-color: white; }\n"

/***/ },

/***/ "./src/app/specific/specific.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var BotTrainingService_1 = __webpack_require__("./src/app/services/BotTrainingService.ts");
var Card_1 = __webpack_require__("./src/app/models/Card.ts");
var ImageCard_1 = __webpack_require__("./src/app/models/ImageCard.ts");
var TextCard_1 = __webpack_require__("./src/app/models/TextCard.ts");
var GalleryCard_1 = __webpack_require__("./src/app/models/GalleryCard.ts");
var CardAddButton_1 = __webpack_require__("./src/app/models/CardAddButton.ts");
var ArticleCard_1 = __webpack_require__("./src/app/models/ArticleCard.ts");
var core_2 = __webpack_require__("./node_modules/@angular/core/index.js");
var ng2_modal_1 = __webpack_require__("./node_modules/ng2-modal/index.js");
//select2GroupedData: Select2OptionData[] = [];
var Specific = (function () {
    function Specific(_botTrainingService, _rootNode) {
        this._botTrainingService = _botTrainingService;
        this._rootNode = _rootNode;
        this.select2GroupedData = [];
        this.GroupText = "";
        this.groups = [];
        this.blockGroupsModel = [];
        this.popBlockName = "Block Name";
        this.AddButtonBlock = "";
        this.AddButtonName = "";
        this.AddButtonUrl = "";
        this.addButtonResponseMessageType = "";
        this.articleText = "";
        this.ckeditorContent = [];
        this.sortOptions = {
            placeholder: 'list-group-item list-group-item-placeholder',
            forcePlaceholderSize: true
        };
        this.nest1Options = { group: 1 };
        this.nest2Options = { group: 1 };
        this.galleryCardArray = [];
        this.cardArray = [];
        this.populateGroups();
        this.populateBlocksDropdown();
    }
    Specific.prototype.updateTitleRandomTextCard = function (responseMessageId, i) {
        this._botTrainingService.updateRandomTitleText(responseMessageId, jQuery('#textCardTitle' + responseMessageId + i).val(), i).subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Specific.prototype.addTextRandom = function (responseMessageId) {
        var _this = this;
        var count = jQuery('.randomTextCard').length + 1;
        this._botTrainingService.addRandomText(responseMessageId, count).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(_this.popBlock._id);
            }
        });
    };
    Specific.prototype.onReady = function (event, i, responseMessageId) {
        //alert(i);
        for (var j = 0; j < this.cardArray.length; j++) {
            if (this.cardArray[j]._id == responseMessageId) {
                var text = this.cardArray[j].data.articleText.replace('\n\n', '');
                this.ckeditorContent[i] = text;
            }
        }
    };
    Specific.prototype.onFocus = function (event, i) {
    };
    Specific.prototype.deleteQuickReply = function (addButtonId, parentId) {
        var _this = this;
        this._botTrainingService.deleteQuickReply(addButtonId, parentId).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(_this.popBlock._id);
            }
        });
    };
    Specific.prototype.deleteAddButton = function (addButtonId, parentId, type) {
        var _this = this;
        this._botTrainingService.deleteAddButton(addButtonId, parentId, type).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(_this.popBlock._id);
            }
        });
    };
    Specific.prototype.deleteResponseMessage = function (resMesId) {
        var _this = this;
        this._botTrainingService.deleteResponseMessage(resMesId).subscribe(function (a) {
            if (a.code == 200) {
                for (var i = 0; i < _this.cardArray.length; i++) {
                    var obj = _this.cardArray[i];
                    if (obj._id == resMesId) {
                        _this.cardArray.splice(i, 1);
                    }
                }
            }
        });
    };
    Specific.prototype.populateBlocksDropdown = function () {
        var _this = this;
        this._botTrainingService.getAllGroups('Specific').subscribe(function (a) {
            if (a.code == 200) {
                for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                    if (_this.blockGroupsModel[i].blocks.length > 0) {
                        for (var j = 0; j < _this.blockGroupsModel[i].blocks.length; j++) {
                            _this.select2GroupedData.push({ id: _this.blockGroupsModel[i].blocks[j]._id, text: _this.blockGroupsModel[i].blocks[j].name });
                        }
                    }
                }
            }
        });
    };
    Specific.prototype.addButtonPost = function (val) {
        var _this = this;
        if (val == 1) {
            var count = 0;
            var blockname = "";
            for (var i = 0; i < this.select2GroupedData.length; i++) {
                if (this.select2GroupedData[i].id == this.AddButtonBlock) {
                    blockname = this.select2GroupedData[i].text;
                }
            }
            if (this.responseMessageDiff == 'addButton') {
                var cardAddButton = new CardAddButton_1.CardAddButton(this.AddButtonName, blockname, this.AddButtonBlock, "");
                count = jQuery('.addbuttonResultList').length;
            }
            else {
                //Add Quick Reply
                var cardAddButton = new CardAddButton_1.CardAddButton(this.AddButtonName, blockname, this.AddButtonBlock, "");
                count = jQuery('.addQuickReplyList').length;
            }
            if (this.AddButtonBlock != "" && this.AddButtonName != "") {
                jQuery('#buttonName').removeClass('modalError');
                jQuery('#simple-select').removeClass('modalError');
                if (this.responseMessageDiff == 'addButton') {
                    this._botTrainingService.addAddButton(this.addButtonResponseMessageId, cardAddButton, this.addButtonResponseMessageType, count).subscribe(function (a) {
                        if (a.code == 200) {
                            _this.AddButtonName = "";
                            _this.AddButtonBlock = "";
                            _this.blockDetail(_this.popBlock._id);
                            _this.modalComponent.close();
                        }
                    });
                }
                else {
                    this._botTrainingService.addQuickReply(this.addButtonResponseMessageId, cardAddButton, this.addButtonResponseMessageType, count).subscribe(function (a) {
                        if (a.code == 200) {
                            _this.AddButtonName = "";
                            _this.AddButtonBlock = "";
                            _this.blockDetail(_this.popBlock._id);
                            _this.modalComponent2.close();
                        }
                    });
                }
            }
            else {
                jQuery('#buttonName').addClass('modalError');
                jQuery('#simple-select').addClass('modalError');
            }
        }
        else {
            var cardAddButton = new CardAddButton_1.CardAddButton(this.AddButtonName, this.AddButtonUrl, "", "");
            if (this.AddButtonUrl != "" && this.AddButtonName != "") {
                jQuery('#buttonName').removeClass('modalError');
                jQuery('#urlContentData').removeClass('modalError');
                this._botTrainingService.addAddButton(this.addButtonResponseMessageId, cardAddButton, this.addButtonResponseMessageType, jQuery('.addbuttonResultList').length).subscribe(function (a) {
                    if (a.code == 200) {
                        _this.AddButtonName = "";
                        _this.AddButtonUrl = "";
                        _this.blockDetail(_this.popBlock._id);
                        _this.modalComponent.close();
                    }
                });
            }
            else {
                jQuery('#buttonName').addClass('modalError');
                jQuery('#urlContentData').addClass('modalError');
            }
        }
    };
    Specific.prototype.addButton = function (responseMessageId, type, diff) {
        this.responseMessageDiff = diff;
        if (diff == 'addButton') {
            //jQuery('#urlBtn').show();
            //jQuery('#blockBtn').addClass('modalliactive');
            jQuery('#blockContent').css('display', 'block');
            jQuery('#quickReplyContent').css('display', 'none');
        }
        else {
            jQuery('#blockContent').css('display', 'none');
            jQuery('#quickReplyContent').css('display', 'block');
        }
        this.addButtonResponseMessageType = type;
        this.addButtonResponseMessageId = responseMessageId;
    };
    Specific.prototype.getSelect2DefaultList = function () {
        return this.select2GroupedData;
    };
    Specific.prototype.modalChangeTab = function (val) {
        if (val == 2) {
            jQuery('#blockBtn').removeClass('modalliactive');
            jQuery('#urlBtn').addClass('modalliactive');
            jQuery('#blockContent').removeClass('modalContentActive');
            jQuery('#blockContent').addClass('modalContentDeActive');
            jQuery('#urlContent').addClass('modalContentActive');
            jQuery('#urlContent').removeClass('modalContentDeActive');
        }
        else {
            jQuery('#blockBtn').addClass('modalliactive');
            jQuery('#urlBtn').removeClass('modalliactive');
            jQuery('#blockContent').addClass('modalContentActive');
            jQuery('#blockContent').removeClass('modalContentDeActive');
            jQuery('#urlContent').removeClass('modalContentActive');
            jQuery('#urlContent').addClass('modalContentDeActive');
        }
    };
    //Card Functions
    Specific.prototype.onChange = function (event, responseMessageId) {
    };
    Specific.prototype.onBlur = function (event, responseMessageId, i) {
        console.log(this.ckeditorContent[i]);
        this._botTrainingService.updateArticleText(responseMessageId, this.ckeditorContent[i]).subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Specific.prototype.updateTitleArticleCard = function (responseMessageId) {
        this._botTrainingService.updateTitleText(responseMessageId, jQuery('#articleCardTitle' + responseMessageId).val(), 0, 'article').subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Specific.prototype.updateTitleTextCard = function (responseMessageId) {
        this._botTrainingService.updateTitleText(responseMessageId, jQuery('#textCardTitle' + responseMessageId).val(), 0, 'text').subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Specific.prototype.updateTitleGalleryCard = function (responseMessageId, indexId) {
        this._botTrainingService.updateTitleText(responseMessageId, jQuery('#galleryCardTitle' + indexId).val(), indexId, 'gallery').subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Specific.prototype.updateDescriptionGalleryCard = function (responseMessageId, indexId) {
        this._botTrainingService.updateDescriptionText(responseMessageId, jQuery('#galleryCardDescription' + indexId).val(), indexId).subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Specific.prototype.updateUrlGalleryCard = function (responseMessageId, indexId) {
        this._botTrainingService.updateUrlText(responseMessageId, jQuery('#galleryCardUrl' + indexId).val(), indexId).subscribe(function (a) {
            if (a.code == 200) {
            }
        });
    };
    Specific.prototype.openGalleryImage = function (Id) {
        jQuery('#galleryImage' + Id).click();
    };
    Specific.prototype.openSingleImage = function (Id) {
        jQuery('#singleImage' + Id).click();
    };
    Specific.prototype.populateGalleryImage = function (event, responseMessageId, blockId, indexId) {
        var _this = this;
        var file = event.target.files[0];
        this._botTrainingService.getPictureUrl(file, responseMessageId, "gallery", indexId).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(blockId);
            }
        });
    };
    Specific.prototype.populateSingleImage = function (event, responseMessageId, blockId) {
        var _this = this;
        var file = event.target.files[0];
        this._botTrainingService.getPictureUrl(file, responseMessageId, "image", -1).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(blockId);
            }
        });
    };
    ///
    Specific.prototype.addBlock = function (Id) {
        jQuery('.addBlock' + Id).hide();
        jQuery('.saveBlock' + Id).show();
    };
    Specific.prototype.addGalleryCard = function (resMesId, blockId) {
        var _this = this;
        this.galleryCard = new GalleryCard_1.GalleryCard("", "", "", "", [], jQuery('.galleryColumns' + resMesId).length);
        //this.card = new Card("gallery", this.galleryCard);
        this._botTrainingService.addGalleryCard(this.galleryCard, resMesId).subscribe(function (a) {
            if (a.code == 200) {
                _this.blockDetail(blockId);
            }
        });
    };
    Specific.prototype.saveBlock = function (Id) {
        var _this = this;
        jQuery('#blockText' + Id).css('border', '1px solid rgba(0, 0, 0, 0.15);');
        if (this.blockName != "" && this.blockName !== undefined) {
            this._botTrainingService.addBlocks(this.blockName, 'Specific', Id).subscribe(function (a) {
                if (a.code == 200) {
                    jQuery('.addBlock' + Id).show();
                    jQuery('.saveBlock' + Id).hide();
                    _this.blockName = "";
                    _this.addedBlock = a.data;
                    for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                        if (_this.blockGroupsModel[i].group._id == Id) {
                            _this.blockGroupsModel[i].blocks.push(_this.addedBlock);
                            break;
                        }
                    }
                }
            });
        }
        else {
            jQuery('#blockText' + Id).css('border', '1px solid red');
        }
    };
    Specific.prototype.deleteBlock = function (Id) {
        var _this = this;
        jQuery('.rmdiv').hide();
        this._botTrainingService.deleteBlock(Id)
            .subscribe(function (a) {
            if (a.code == 200) {
                for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                    for (var j = 0; j < _this.blockGroupsModel[i].blocks.length; j++) {
                        if (_this.blockGroupsModel[i].blocks[j]._id == Id) {
                            _this.blockGroupsModel[i].blocks.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        });
    };
    Specific.prototype.blockDetail = function (Id) {
        this.ckeditorContent = [];
        jQuery('.blockbtns').removeClass("blockactive");
        jQuery('#block' + Id).addClass("blockactive");
        this.populateResponseMessages(Id);
    };
    Specific.prototype.populateResponseMessages = function (Id) {
        var _this = this;
        this._botTrainingService.getAllResponseMessages(Id).subscribe(function (a) {
            if (a.code == 200) {
                _this.cardArray = [];
                _this.popBlock = a.data.block;
                _this.cardArray = a.data.responseMessages;
                _this.popBlockName = _this.popBlock.name;
                _this.isLocked = _this.popBlock.isLocked;
                jQuery('.rmdiv').show();
                console.log(a);
            }
        });
    };
    Specific.prototype.addCard = function (val) {
        var _this = this;
        if (val == 1) {
            //Gallery
            this.galleryCard = new GalleryCard_1.GalleryCard("", "", "", "", [], 1);
            this.card = new Card_1.Card("gallery", this.galleryCard);
            var galleryCardArray = [];
            galleryCardArray.push(this.galleryCard);
            this._botTrainingService.addResponseMessage(galleryCardArray, "gallery", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
        else if (val == 2) {
            //TextCard
            var obj = {
                'indexId': 1,
                'text': ''
            };
            var tempArray = [];
            tempArray.push(obj);
            this.textCard = new TextCard_1.TextCard(tempArray, [], []);
            this.card = new Card_1.Card("text", this.textCard);
            this._botTrainingService.addResponseMessage(this.textCard, "text", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
        else if (val == 3) {
            //Image
            this.imageCard = new ImageCard_1.ImageCard("", []);
            this.card = new Card_1.Card("image", this.imageCard);
            this._botTrainingService.addResponseMessage(this.imageCard, "image", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
        else if (val == 4) {
            //Article
            this.articleCard = new ArticleCard_1.ArticleCard("", "");
            this.card = new Card_1.Card("image", this.articleCard);
            this._botTrainingService.addResponseMessage(this.articleCard, "article", this.popBlock._id).subscribe(function (a) {
                if (a.code == 200) {
                    _this.cardArray.push(a.data);
                }
            });
        }
    };
    Specific.prototype.ngOnInit = function () {
        jQuery('.nav-tabs').on('shown.bs.tab', 'a', function (e) {
            if (e.relatedTarget) {
                jQuery(e.relatedTarget).removeClass('active');
            }
        });
        var oldIndex;
        jQuery('#popover2').popover();
        jQuery('.GroupBtn').show();
        jQuery('.GroupForm').hide();
        jQuery('.list-group-sortable').sortable(this.sortOptions);
        jQuery('.list-group-sortable2').sortable(this.sortOptions);
        jQuery('#nestable1').nestable(this.nest1Options);
        jQuery('#nestable2').nestable(this.nest2Options);
        jQuery(".list-group-sortable").sortable({
            start: function (event, ui) {
                oldIndex = ui.item.index() + 1;
                jQuery(this).attr('data-previndex', ui.item[0].id);
            },
            update: function (e, ui) {
                // gets the new and old index then removes the temporary attribute
                var newIndex = ui.item.index() + 1;
                var groupId = jQuery(this).attr('data-previndex');
                jQuery.post("http://aprilappserver.azurewebsites.net/groups/setOrderOfGroups", {
                    oldIndex: oldIndex,
                    newIndex: newIndex,
                    groupId: groupId
                }, function (data, status) {
                });
                jQuery(this).removeAttr('data-previndex');
            }
        });
        //sorting of response messages
        jQuery(".list-group-sortable2").sortable({
            start: function (event, ui) {
                oldIndex = ui.item.index() + 1;
                var array = ui.item[0].childNodes;
                var id;
                array.forEach(function (entry) {
                    if (entry.id !== undefined) {
                        id = entry.id;
                    }
                });
                jQuery(this).attr('data-previndex', id);
            },
            update: function (e, ui) {
                // gets the new and old index then removes the temporary attribute
                var newIndex = ui.item.index() + 1;
                var groupId = jQuery(this).attr('data-previndex');
                jQuery.post("http://aprilappserver.azurewebsites.net/responsemessage/sortingOfResponseMessages", {
                    oldIndex: oldIndex,
                    newIndex: newIndex,
                    groupId: groupId
                }, function (data, status) {
                });
                jQuery(this).removeAttr('data-previndex');
            }
        });
    };
    Specific.prototype.toggleDivs = function (val) {
        var _this = this;
        if (val == 1) {
            jQuery('.GroupBtn').fadeOut("slow");
            jQuery('.GroupForm').fadeIn("slow");
        }
        else {
            jQuery('#emptyGroup').hide();
            if (this.GroupText != "") {
                this._botTrainingService.addGroup(this.GroupText, 'Specific').subscribe(function (a) {
                    if (a.code == 200) {
                        _this.populateGroups();
                        _this.GroupText = "";
                    }
                });
            }
            else {
                jQuery('#emptyGroup').fadeIn("slow");
            }
        }
    };
    Specific.prototype.populateGroups = function () {
        var _this = this;
        this._botTrainingService.getAllGroups('Specific')
            .subscribe(function (a) {
            if (a.code == 200) {
                _this.blockGroupsModel = a.data;
                _this.blockGroupsModel.sort(function (a, b) {
                    return a.group.order - b.group.order;
                });
                if (_this.blockGroupsModel.length != 0) {
                    for (var i = 0; i < _this.blockGroupsModel.length; i++) {
                        if (_this.blockGroupsModel[i].blocks.length > 0) {
                            _this.popBlock = _this.blockGroupsModel[i].blocks[0];
                            _this.popBlockId = _this.popBlock._id;
                            break;
                        }
                    }
                }
                console.log(a);
            }
        });
    };
    Specific.prototype.deleteGroup = function (val) {
        var _this = this;
        this._botTrainingService.deleteGroup(val)
            .subscribe(function (a) {
            if (a.code == 200) {
                _this.populateGroups();
            }
        });
    };
    Specific.prototype.refreshTextBox = function () {
        this.GroupText = "";
    };
    __decorate([
        core_1.ViewChild('myModal'), 
        __metadata('design:type', (typeof (_a = typeof ng2_modal_1.Modal !== 'undefined' && ng2_modal_1.Modal) === 'function' && _a) || Object)
    ], Specific.prototype, "modalComponent", void 0);
    __decorate([
        core_1.ViewChild('yourModal'), 
        __metadata('design:type', (typeof (_b = typeof ng2_modal_1.Modal !== 'undefined' && ng2_modal_1.Modal) === 'function' && _b) || Object)
    ], Specific.prototype, "modalComponent2", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], Specific.prototype, "GroupText", void 0);
    Specific = __decorate([
        core_1.Component({
            selector: '[specific]',
            template: __webpack_require__("./src/app/specific/specific.component.html"),
            providers: [BotTrainingService_1.BotTrainingService],
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [__webpack_require__("./src/app/specific/specific.component.scss"), './../forms/elements/elements.style.css']
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof BotTrainingService_1.BotTrainingService !== 'undefined' && BotTrainingService_1.BotTrainingService) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _d) || Object])
    ], Specific);
    return Specific;
    var _a, _b, _c, _d;
}());
exports.Specific = Specific;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/specific/specific.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
__webpack_require__("./node_modules/messenger/build/js/messenger.js");
__webpack_require__("./node_modules/jquery-ui/ui/sortable.js");
__webpack_require__("./node_modules/jquery.nestable/jquery.nestable.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var ng2_bootstrap_1 = __webpack_require__("./node_modules/ng2-bootstrap/ng2-bootstrap.js");
var ng2_bootstrap_2 = __webpack_require__("./node_modules/ng2-bootstrap/ng2-bootstrap.js");
var ng2_bootstrap_3 = __webpack_require__("./node_modules/ng2-bootstrap/ng2-bootstrap.js");
var ng2_modal_1 = __webpack_require__("./node_modules/ng2-modal/index.js");
var specific_component_1 = __webpack_require__("./src/app/specific/specific.component.ts");
var widget_module_1 = __webpack_require__("./src/app/layout/widget/widget.module.ts");
var ng2_select2_1 = __webpack_require__("./node_modules/ng2-select2/ng2-select2.js");
var ng2_ckeditor_1 = __webpack_require__("./node_modules/ng2-ckeditor/lib/index.js");
exports.routes = [
    { path: '', component: specific_component_1.Specific, pathMatch: 'full' }
];
var UiElementsModule = (function () {
    function UiElementsModule() {
    }
    UiElementsModule.routes = exports.routes;
    UiElementsModule = __decorate([
        core_1.NgModule({
            declarations: [
                // Components / Directives/ Pipes
                specific_component_1.Specific
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule.forChild(exports.routes),
                ng2_bootstrap_1.AlertModule,
                widget_module_1.WidgetModule,
                ng2_bootstrap_1.TooltipModule,
                ng2_modal_1.ModalModule,
                ng2_bootstrap_2.ButtonsModule,
                ng2_bootstrap_2.DropdownModule,
                ng2_bootstrap_3.TabsModule,
                ng2_bootstrap_3.AccordionModule,
                ng2_select2_1.Select2Module,
                ng2_ckeditor_1.CKEditorModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], UiElementsModule);
    return UiElementsModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UiElementsModule;


/***/ }

});
//# sourceMappingURL=14.map