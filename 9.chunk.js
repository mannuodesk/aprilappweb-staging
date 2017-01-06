webpackJsonpac__name_([9],{

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

/***/ "./src/app/ui-elements/buttons/buttons.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Buttons = (function () {
    function Buttons() {
        this.checkboxModel = { left: false, middle: true, right: false };
        this.checkbox2Model = { left: false, middle: false, right: false };
        this.radioModel = 'Middle';
        this.radio2Model = 'Left';
    }
    Buttons = __decorate([
        core_1.Component({
            selector: '[buttons]',
            template: __webpack_require__("./src/app/ui-elements/buttons/buttons.template.html"),
            styles: [__webpack_require__("./src/app/ui-elements/buttons/buttons.style.scss")]
        }), 
        __metadata('design:paramtypes', [])
    ], Buttons);
    return Buttons;
}());
exports.Buttons = Buttons;


/***/ },

/***/ "./src/app/ui-elements/buttons/buttons.style.scss":
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ "./src/app/ui-elements/buttons/buttons.template.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"active breadcrumb-item\">UI Buttons</li>\r\n</ol>\r\n<h1 class=\"page-title\">Buttons - <span class=\"fw-semi-bold\">Styles</span></h1>\r\n<div class=\"row\">\r\n  <div class=\"col-xl-4 col-lg-6 col-xs-12\">\r\n    <section class=\"widget\" widget>\r\n      <header>\r\n        <h5>\r\n          Color <span class=\"fw-semi-bold\">Options</span>\r\n        </h5>\r\n        <div class=\"widget-controls\">\r\n          <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>\r\n          <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>\r\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n        </div>\r\n      </header>\r\n      <div class=\"widget-body\">\r\n        <p class=\"fs-mini text-muted\">\r\n          Use any of the available button classes to quickly create a styled button.\r\n          Semantically distinguishable beauty.\r\n        </p>\r\n        <p class=\"text-xs-center\">\r\n          <button class=\"btn btn-secondary width-100 mb-xs\" role=\"button\">\r\n            Secondary\r\n          </button>\r\n          <button class=\"btn btn-primary width-100 mb-xs\" role=\"button\">\r\n            Primary\r\n          </button>\r\n          <button class=\"btn btn-info width-100 mb-xs\" role=\"button\">\r\n            Info\r\n          </button>\r\n          <button class=\"btn btn-success width-100 mb-xs\" role=\"button\">\r\n            Success\r\n          </button>\r\n          <button class=\"btn btn-warning width-100 mb-xs\" role=\"button\">\r\n            Warning\r\n          </button>\r\n          <button class=\"btn btn-danger width-100 mb-xs\" role=\"button\">\r\n            Danger\r\n          </button>\r\n          <button class=\"btn btn-gray width-100 mb-xs\" role=\"button\">\r\n            Gray\r\n          </button>\r\n          <button class=\"btn btn-inverse width-100 mb-xs\" role=\"button\">\r\n            Inverse\r\n          </button>\r\n        </p>\r\n      </div>\r\n    </section>\r\n  </div>\r\n  <div class=\"col-xl-4 col-lg-6 col-xs-12\">\r\n    <section class=\"widget\" widget>\r\n      <header>\r\n        <h5>\r\n          Size <span class=\"fw-semi-bold\">Variants</span>\r\n        </h5>\r\n        <div class=\"widget-controls\">\r\n          <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>\r\n          <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>\r\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n        </div>\r\n      </header>\r\n      <div class=\"widget-body\">\r\n        <p class=\"fs-mini text-muted\">\r\n          Fancy larger or smaller buttons? Four separate sizes available for all use cases: from\r\n          tiny 10px button to large one.\r\n        </p>\r\n        <p class=\"mb-xs\">\r\n          <button type=\"button\" class=\"btn btn-primary btn-lg mb-xs\">Large button</button>\r\n          <button type=\"button\" class=\"btn btn-secondary btn-lg mb-xs\">Large button</button>\r\n        </p>\r\n        <p class=\"mb-xs\">\r\n          <button type=\"button\" class=\"btn btn-primary mb-xs\">Default button</button>\r\n          <button type=\"button\" class=\"btn btn-secondary mb-xs\">Default button</button>\r\n        </p>\r\n        <p class=\"mb-xs\">\r\n          <button type=\"button\" class=\"btn btn-primary btn-sm mb-xs\">Small button</button>\r\n          <button type=\"button\" class=\"btn btn-secondary btn-sm mb-xs\">Small button</button>\r\n        </p>\r\n        <p class=\"mb-xs\">\r\n          <button type=\"button\" class=\"btn btn-primary btn-xs mb-xs\">Tiny button</button>\r\n          <button type=\"button\" class=\"btn btn-secondary btn-xs mb-xs\">Tiny button</button>\r\n        </p>\r\n      </div>\r\n    </section>\r\n  </div>\r\n  <div class=\"col-xl-4 col-lg-6 col-xs-12\">\r\n    <section class=\"widget\" widget>\r\n      <header>\r\n        <h5>\r\n          Block <span class=\"fw-semi-bold\">Buttons</span>\r\n        </h5>\r\n        <div class=\"widget-controls\">\r\n          <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>\r\n          <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>\r\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n        </div>\r\n      </header>\r\n      <div class=\"widget-body\">\r\n        <p class=\"fs-mini text-muted\">\r\n          Create block level buttons - those that span the full width\r\n          of a parent— by adding <code>.btn-block</code>.\r\n          Great for menu & social buttons.\r\n        </p>\r\n        <p>\r\n          <button type=\"button\" class=\"btn btn-info btn-block\">Block Button</button>\r\n        </p>\r\n        <p>\r\n          <button type=\"button\" class=\"btn btn-secondary btn-block\">Show Menu &nbsp;&nbsp;&nbsp;<i class=\"fa fa-bars\"></i></button>\r\n        </p>\r\n        <p>\r\n          <button type=\"button\" class=\"btn btn-primary btn-block\"><i class=\"fa fa-facebook\"></i> Login mit Facebook</button>\r\n        </p>\r\n        <p>\r\n          <button type=\"button\" class=\"btn btn-warning btn-block\">Are you sure?</button>\r\n        </p>\r\n      </div>\r\n    </section>\r\n  </div>\r\n  <div class=\"col-xl-4 col-lg-6 col-xs-12\">\r\n    <section class=\"widget\" widget>\r\n      <header>\r\n        <h5>\r\n          Disabled <span class=\"fw-semi-bold\">Buttons</span>\r\n        </h5>\r\n        <div class=\"widget-controls\">\r\n          <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>\r\n          <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>\r\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n        </div>\r\n      </header>\r\n      <div class=\"widget-body\">\r\n        <p class=\"fs-mini text-muted\">\r\n          Make buttons look unclickable by fading them back 50%.\r\n          Add the <code>.disabled</code> class to <code>&lt;a&gt;</code> buttons.\r\n        </p>\r\n        <p>\r\n          <button type=\"button\" class=\"btn btn-primary\" disabled=\"disabled\">Primary button</button>\r\n          <button type=\"button\" class=\"btn btn-secondary\" disabled=\"disabled\">Button</button>\r\n        </p>\r\n        <p>\r\n          <a href=\"#\" class=\"btn btn-success btn-sm disabled\" role=\"button\">Primary link</a>\r\n          <a href=\"#\" class=\"btn btn-secondary btn-sm disabled\" role=\"button\">Link</a>\r\n        </p>\r\n      </div>\r\n    </section>\r\n  </div>\r\n  <div class=\"col-xl-4 col-lg-6 col-xs-12\">\r\n    <section class=\"widget\" widget>\r\n      <header>\r\n        <h5>\r\n          Button <span class=\"fw-semi-bold\">Groups</span>\r\n        </h5>\r\n        <div class=\"widget-controls\">\r\n          <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>\r\n          <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>\r\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n        </div>\r\n      </header>\r\n      <div class=\"widget-body\">\r\n        <p class=\"fs-mini text-muted\">\r\n          Group a series of buttons together on a single line with the button group.\r\n          Add on optional JavaScript radio and checkbox style behavior with Bootstrap buttons plugin.\r\n        </p>\r\n        <div class=\"btn-group\">\r\n          <button type=\"button\" class=\"btn btn-secondary\">Left</button>\r\n          <button type=\"button\" class=\"btn btn-secondary\">Middle</button>\r\n          <button type=\"button\" class=\"btn btn-secondary\">Right</button>\r\n        </div>\r\n        <div class=\"btn-toolbar\" role=\"toolbar\">\r\n          <div class=\"btn-group\">\r\n            <button type=\"button\" class=\"btn btn-secondary\">1</button>\r\n            <button type=\"button\" class=\"btn btn-secondary\">2</button>\r\n            <button type=\"button\" class=\"btn btn-secondary\">3</button>\r\n            <button type=\"button\" class=\"btn btn-secondary\">4</button>\r\n          </div>\r\n          <div class=\"btn-group\">\r\n            <button type=\"button\" class=\"btn btn-secondary\">5</button>\r\n            <button type=\"button\" class=\"btn btn-secondary\">6</button>\r\n            <button type=\"button\" class=\"btn btn-secondary\">7</button>\r\n          </div>\r\n          <div class=\"btn-group\">\r\n            <button type=\"button\" class=\"btn btn-secondary\">8</button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n  <div class=\"col-xl-4 col-lg-6 col-xs-12\">\r\n    <section class=\"widget\" widget>\r\n      <header>\r\n        <h5>\r\n          Button <span class=\"fw-semi-bold\">Dropdowns</span>\r\n        </h5>\r\n        <div class=\"widget-controls\">\r\n          <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>\r\n          <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>\r\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n        </div>\r\n      </header>\r\n      <div class=\"widget-body\">\r\n        <p class=\"fs-mini text-muted\">\r\n          Add dropdown menus to nearly anything with this simple plugin, including the buttons,\r\n          navbar, tabs, and pills.\r\n          Both solid & segmented dropdown options available.\r\n        </p>\r\n        <div class=\"mb-sm\">\r\n          <div class=\"btn-group\" dropdown>\r\n            <button id=\"dropdown-btn-one\" class=\"btn btn-danger\" dropdownToggle>\r\n              &nbsp; One &nbsp;\r\n              <i class=\"fa fa-caret-down\"></i>\r\n            </button>\r\n            <ul dropdownMenu role=\"menu\" aria-labelledby=\"dropdown-btn-one\">\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Another action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Something else here</a></li>\r\n              <li class=\"dropdown-divider\"></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Separated link</a></li>\r\n            </ul>\r\n          </div>\r\n          <div class=\"btn-group\" dropdown>\r\n            <button id=\"dropdown-btn-two\" class=\"btn btn-gray btn-sm\" dropdownToggle>\r\n              &nbsp; One &nbsp;\r\n              <i class=\"fa fa-caret-down\"></i>\r\n            </button>\r\n            <ul dropdownMenu role=\"menu\" aria-labelledby=\"dropdown-btn-two\">\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Another action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Something else here</a></li>\r\n              <li class=\"dropdown-divider\"></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Separated link</a></li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n        <div>\r\n          <div class=\"btn-group\" dropdown>\r\n            <button id=\"dropdown-btn-three\" class=\"btn btn-secondary\">Gray</button>\r\n            <button class=\"btn btn-secondary\" dropdownToggle>\r\n              <i class=\"fa fa-caret-down\"></i>\r\n            </button>\r\n            <ul dropdownMenu role=\"menu\" aria-labelledby=\"dropdown-btn-three\">\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Another action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Something else here</a></li>\r\n              <li class=\"dropdown-divider\"></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Separated link</a></li>\r\n            </ul>\r\n          </div>\r\n          <div class=\"btn-group\" dropdown>\r\n            <button id=\"dropdown-btn-four\" class=\"btn btn-gray btn-sm\">Gray</button>\r\n            <button class=\"btn btn-gray btn-sm\" dropdownToggle>\r\n              <i class=\"fa fa-caret-down\"></i>\r\n            </button>\r\n            <ul dropdownMenu role=\"menu\" aria-labelledby=\"dropdown-btn-four\">\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Another action</a></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Something else here</a></li>\r\n              <li class=\"dropdown-divider\"></li>\r\n              <li role=\"menuitem\"><a class=\"dropdown-item\" href=\"#\">Separated link</a></li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n</div>\r\n<section class=\"widget\" widget>\r\n  <header>\r\n    <h6>\r\n      Button <span class=\"fw-semi-bold\">Options</span>\r\n    </h6>\r\n    <div class=\"widget-controls\">\r\n      <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-up\"></i></a>\r\n      <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-chevron-down\"></i></a>\r\n      <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n    </div>\r\n  </header>\r\n  <div class=\"widget-body\">\r\n    <div class=\"row\">\r\n      <div class=\"col-xl-4 col-xs-12\">\r\n        <h4>\r\n          Button <span class=\"fw-semi-bold\">Checkboxes</span>\r\n        </h4>\r\n        <p class=\"fs-mini text-muted\">\r\n          Do more with buttons. Control button states or create groups of buttons for more components like toolbars.\r\n          Add <code>data-toggle=\"buttons\"</code> to a group of checkboxes for checkbox style toggling on btn-group.\r\n        </p>\r\n        <div class=\"mb-sm\">\r\n          <div class=\"btn-group\">\r\n            <label class=\"btn btn-gray\" btnCheckbox [(ngModel)]=\"checkboxModel.left\">\r\n              Left way\r\n            </label>\r\n            <label class=\"btn btn-gray\" btnCheckbox [(ngModel)]=\"checkboxModel.middle\">\r\n              Middle way\r\n            </label>\r\n            <label class=\"btn btn-gray\" btnCheckbox [(ngModel)]=\"checkboxModel.right\">\r\n              Right way\r\n            </label>\r\n          </div>\r\n        </div>\r\n        <div class=\"mb-sm\">\r\n          <div class=\"btn-group btn-group-sm\">\r\n            <label class=\"btn btn-secondary\" btnCheckbox [(ngModel)]=\"checkbox2Model.left\">\r\n              Left way\r\n            </label>\r\n            <label class=\"btn btn-secondary\" btnCheckbox [(ngModel)]=\"checkbox2Model.middle\">\r\n              Middle way\r\n            </label>\r\n            <label class=\"btn btn-secondary\" btnCheckbox [(ngModel)]=\"checkbox2Model.right\">\r\n              Right way\r\n            </label>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-xl-4 col-xs-12\">\r\n        <h4>\r\n          Button <span class=\"fw-semi-bold\">Radios</span>\r\n        </h4>\r\n        <p class=\"fs-mini text-muted\">\r\n          Do more with buttons. Control button states or create groups of buttons for more components like toolbars.\r\n          Add <code>data-toggle=\"buttons\"</code> to a group of radio inputs for radio style toggling on btn-group.\r\n        </p>\r\n        <div class=\"mb-sm\">\r\n          <div class=\"btn-group\">\r\n            <label class=\"btn btn-gray\" btnRadio=\"'Left'\" [(ngModel)]=\"radioModel\">\r\n              Left way\r\n            </label>\r\n            <label class=\"btn btn-gray\" btnRadio=\"'Middle'\" [(ngModel)]=\"radioModel\">\r\n              Middle way\r\n            </label>\r\n            <label class=\"btn btn-gray\" btnRadio=\"'Right'\" [(ngModel)]=\"radioModel\">\r\n              Right way\r\n            </label>\r\n          </div>\r\n        </div>\r\n        <div class=\"mb-sm\">\r\n          <div class=\"btn-group btn-group-sm\">\r\n            <label class=\"btn btn-secondary\" btnRadio=\"'Left'\" [(ngModel)]=\"radio2Model\">\r\n              Left way\r\n            </label>\r\n            <label class=\"btn btn-secondary\" btnRadio=\"'Middle'\" [(ngModel)]=\"radio2Model\">\r\n              Middle way\r\n            </label>\r\n            <label class=\"btn btn-secondary\" btnRadio=\"'Right'\" [(ngModel)]=\"radio2Model\">\r\n              Right way\r\n            </label>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-xl-4 col-xs-12\">\r\n        <h4>\r\n          Use with <span class=\"fw-semi-bold\">Icons</span>\r\n        </h4>\r\n        <p class=\"fs-mini text-muted\">\r\n          Fontawesome and Glyph- icons may be used in buttons, button groups for a toolbar, navigation, or prepended form inputs.\r\n          Let your buttons shine!\r\n        </p>\r\n        <p class=\"text-xs-center\">\r\n          <button class=\"btn btn-secondary width-100 mb-xs\" role=\"button\">\r\n            <i class=\"glyphicon glyphicon-tree-conifer text-success\"></i>\r\n            Forest\r\n          </button>\r\n          <button class=\"btn btn-secondary width-100 mb-xs\" role=\"button\">\r\n            <i class=\"fa fa-check text-danger\"></i>\r\n            Submit\r\n          </button>\r\n          <button class=\"btn btn-secondary width-100 mb-xs\" role=\"button\">\r\n            <i class=\"fa fa-facebook text-primary\"></i>\r\n            Login\r\n          </button>\r\n        </p>\r\n        <p class=\"text-xs-center\">\r\n          <button class=\"btn btn-inverse width-100 mb-xs\" role=\"button\">\r\n            <i class=\"fa fa-exclamation text-warning\"></i>\r\n            Error\r\n          </button>\r\n          <button class=\"btn btn-inverse width-100 mb-xs\" role=\"button\">\r\n            <i class=\"glyphicon glyphicon-globe text-info\"></i>\r\n            <span class=\"text-info\">Globe</span>\r\n          </button>\r\n          <button class=\"btn btn-inverse width-100 mb-xs\" role=\"button\">\r\n                                <span class=\"circle bg-white\">\r\n                                    <i class=\"fa fa-map-marker text-gray\"></i>\r\n                                </span>\r\n            Map\r\n          </button>\r\n        </p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n"

/***/ },

/***/ "./src/app/ui-elements/components/components.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Components = (function () {
    /* tslint:disable */
    function Components() {
        this.alerts = [
            {
                type: 'success',
                msg: '<span class="fw-semi-bold">Success:</span> You successfully read this important alert message.'
            },
            {
                type: 'info',
                msg: '<span class="fw-semi-bold">Info:</span> This alert needs your attention, but it\'s not super important.'
            },
            {
                type: 'warning',
                msg: '<span class="fw-semi-bold">Warning:</span> Best check yo self, you\'re not looking too good.'
            },
            {
                type: 'danger',
                msg: '<span class="fw-semi-bold">Danger:</span> Change this and that and try again.  ' +
                    '<a class="btn btn-default btn-xs pull-xs-right mr" href="#">Ignore</a>  ' +
                    '<a class="btn btn-danger btn-xs pull-xs-right mr-xs" href="#">Take this action</a>'
            }
        ];
    }
    /* tslint:enable */
    Components.prototype.addAlert = function () {
        this.alerts.push({ type: 'warning', msg: 'Another alert!' });
    };
    ;
    Components.prototype.closeAlert = function (index) {
        this.alerts.splice(index, 1);
    };
    ;
    Components.prototype.ngOnInit = function () {
        jQuery('#popover1, #popover2').popover();
    };
    Components = __decorate([
        core_1.Component({
            selector: '[components]',
            template: __webpack_require__("./src/app/ui-elements/components/components.template.html"),
            styles: [__webpack_require__("./src/app/ui-elements/components/components.style.scss")]
        }), 
        __metadata('design:paramtypes', [])
    ], Components);
    return Components;
}());
exports.Components = Components;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/ui-elements/components/components.style.scss":
/***/ function(module, exports) {

module.exports = ".tag.tag-pill {\n  padding: .4em .6em;\n  font-weight: 700; }\n"

/***/ },

/***/ "./src/app/ui-elements/components/components.template.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"active breadcrumb-item\">UI Components</li>\r\n</ol>\r\n<h1 class=\"page-title\">Components - <span class=\"fw-semi-bold\">Bootstrap</span></h1>\r\n<div data-ng-controller=\"UiComponentsDemoController\">\r\n  <section class=\"widget\" widget>\r\n    <header>\r\n      <h6>\r\n        Alert <span class=\"fw-semi-bold\">Messages</span>\r\n      </h6>\r\n      <div class=\"widget-controls\">\r\n        <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\r\n        <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\r\n        <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n      </div>\r\n    </header>\r\n    <div class=\"widget-body clearfix\">\r\n      <h3>Small <span class=\"fw-semi-bold\">Elements</span></h3>\r\n      <p class=\"mb-lg\">Gaining direct user attention on some matter. Add dismiss functionality to all alert messages with this plugin.</p>\r\n      <alert *ngFor=\"let alert of alerts; let i = index\" [type]=\"alert.type + ' alert-sm'\" (close)=\"closeAlert(i)\" dismissible=\"true\">\r\n        <div [innerHTML]=\"alert.msg\"></div>\r\n      </alert>\r\n      <button class='btn btn-secondary btn-sm pull-xs-right' (click)=\"addAlert()\">Add Alert</button>\r\n    </div>\r\n  </section>\r\n  <div class=\"row\">\r\n    <div class=\"col-lg-6 col-xs-12\">\r\n      <section class=\"widget\" widget>\r\n        <header>\r\n          <h6>\r\n            Labels & Badge <span class=\"fw-semi-bold\">Options</span>\r\n          </h6>\r\n          <div class=\"widget-controls\">\r\n            <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\r\n            <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\r\n            <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n          </div>\r\n        </header>\r\n        <div class=\"widget-body\">\r\n          <h3>Label <span class=\"fw-semi-bold\">Colors</span></h3>\r\n          <p>Just add the <code>.tag</code> class to inline element to create a tag.</p>\r\n          <p>\r\n            <span class=\"tag tag-default\">Default</span>\r\n            <span class=\"tag tag-primary\">Primary</span>\r\n            <span class=\"tag tag-info\">Info</span>\r\n            <span class=\"tag tag-success\">Success</span>\r\n            <span class=\"tag tag-warning\">Warning</span>\r\n            <span class=\"tag tag-danger\">Danger</span>\r\n          </p>\r\n          <h3>Label-pill <span class=\"fw-semi-bold\">Variations</span></h3>\r\n          <p>Same as tags, just add the <code>.tag.tag-pill</code> class to inline element to create a tag-pill.</p>\r\n          <p>\r\n            <button class=\"btn btn-primary\" type=\"button\">\r\n              Notifications &nbsp;&nbsp; <span class=\"tag tag-pill tag-white text-primary\">3</span>\r\n            </button>\r\n            <span class=\"tag tag-pill tag-danger\">01</span>\r\n            <span class=\"tag tag-pill tag-warning\">20</span>\r\n            <span class=\"tag tag-pill tag-success\">31</span>\r\n            <span class=\"tag tag-pill tag-info\">18</span>\r\n            <span class=\"tag tag-pill tag-primary\">41</span>\r\n          </p>\r\n        </div>\r\n      </section>\r\n    </div>\r\n    <div class=\"col-lg-6 col-xs-12\">\r\n      <section class=\"widget\" widget>\r\n        <header>\r\n          <h6>\r\n            Tooltips & Popover <span class=\"fw-semi-bold\">Variations</span>\r\n          </h6>\r\n          <div class=\"widget-controls\">\r\n            <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\r\n            <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\r\n            <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n          </div>\r\n        </header>\r\n        <div class=\"widget-body\">\r\n          <h3>Position <span class=\"fw-semi-bold\">Tooltips</span></h3>\r\n          <p>Stable four position options available:</p>\r\n          <div class=\"btn-toolbar\">\r\n            <a href=\"#\" class=\"btn btn-default\" tooltip=\"Tooltip on left\" tooltipPlacement=\"left\">On left\r\n            </a>\r\n            <a href=\"#\" class=\"btn btn-default\" tooltip=\"Tooltip on top\" tooltipPlacement=\"top\">On top\r\n            </a>\r\n            <a href=\"#\" class=\"btn btn-default\" tooltip=\"Tooltip on bottom\" tooltipPlacement=\"bottom\">On bottom\r\n            </a>\r\n            <a href=\"#\" class=\"btn btn-default\" tooltip=\"Tooltip on right\" tooltipPlacement=\"right\">On right\r\n            </a>\r\n          </div>\r\n          <h3>Popover <span class=\"fw-semi-bold\">Options</span></h3>\r\n          <p>Placing help text where needed:</p>\r\n          <div class=\"btn-toolbar\">\r\n            <button id=\"popover1\" type=\"button\" class=\"btn btn-default\" title=\"\"\r\n                    data-toggle=\"popover\"\r\n                    data-placement=\"left\"\r\n                    data-content=\"And here's some amazing content. It's very engaging. right?\">\r\n              Popover on left\r\n            </button>\r\n            <button id=\"popover2\" type=\"button\" class=\"btn btn-info\" title=\"A Title\"\r\n                    data-toggle=\"popover\"\r\n                    data-placement=\"top\"\r\n                    data-content=\"And here's some amazing content. It's very engaging. right?\">\r\n              Titled Popover\r\n            </button>\r\n          </div>\r\n          <h3><span class=\"fw-semi-bold\">Bootstrap</span> Modals</h3>\r\n          <p>Modals are streamlined, but flexible, dialog prompts with the minimum\r\n            required functionality and smart defaults.</p>\r\n          <div modal-component>\r\n          </div>\r\n        </div>\r\n      </section>\r\n    </div>\r\n  </div>\r\n  <section class=\"widget\" widget>\r\n    <header>\r\n      <h6>\r\n        Progress <span class=\"fw-semi-bold\">Bars</span>\r\n      </h6>\r\n      <div class=\"widget-controls\">\r\n        <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\r\n        <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\r\n        <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n      </div>\r\n    </header>\r\n    <div class=\"widget-body\">\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-4 col-xs-12\">\r\n          <h3>Progress Bar <span class=\"fw-semi-bold\">Colors</span></h3>\r\n          <p class=\"fs-mini text-muted\">Easily perceptible colored options for Bootstrap progress bars:</p>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-10 col-md-offset-1 col-xs-12\">\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-sm progress-danger\" value=\"100\" max=\"100\" style=\"width: 75%;\"></progress>\r\n              </div>\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-sm progress-warning\" value=\"100\" max=\"100\" style=\"width: 60%;\"></progress>\r\n              </div>\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-sm progress-success\" value=\"100\" max=\"100\" style=\"width: 45%;\"></progress>\r\n              </div>\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-sm progress-primary\" value=\"100\" max=\"100\" style=\"width: 30%;\"></progress>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"col-lg-4 col-xs-12\">\r\n          <h3>Progress Bar <span class=\"fw-semi-bold\">Sizes</span></h3>\r\n          <p class=\"fs-mini text-muted\">Three different sizes for all of possible use cases:</p>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-10 col-md-offset-1 col-xs-12\">\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-xs progress-bar-gray\" value=\"100\" max=\"100\" style=\"width: 60%;\"></progress>\r\n              </div>\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-sm progress-warning\" value=\"100\" max=\"100\" style=\"width: 60%;\"></progress>\r\n              </div>\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress progress-info\" value=\"100\" max=\"100\" style=\"width: 33%;\"></progress>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"col-lg-4 col-xs-12\">\r\n          <h3>More <span class=\"fw-semi-bold\">Options</span></h3>\r\n          <div class=\"alert alert-warning alert-sm\">Animated and containg text progress bars are not yet supported in Bootstrap 4</div>\r\n          <p class=\"text-muted fs-mini\">Animated, stripped and progress bars containing text:</p>\r\n          <div class=\"row\">\r\n            <div class=\"col-md-10 col-md-offset-1 col-xs-12\">\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-striped progress-animated progress-info\" value=\"100\" max=\"100\" style=\"width: 60%;\">\r\n                  $24 818\r\n                </progress>\r\n              </div>\r\n              <div class=\"bg-gray-lighter m-t-2\">\r\n                <progress class=\"progress progress-sm progress-striped progress-bar-gray-light\" value=\"100\" max=\"100\" style=\"width: 60%;\">\r\n                </progress>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </section>\r\n</div>\r\n"

/***/ },

/***/ "./src/app/ui-elements/components/modal-window/modal.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var ModalComponent = (function () {
    function ModalComponent() {
    }
    ModalComponent = __decorate([
        core_1.Component({
            selector: '[modal-component]',
            template: __webpack_require__("./src/app/ui-elements/components/modal-window/modal.template.html"),
            styles: [__webpack_require__("./src/app/ui-elements/components/modal-window/modal.style.scss")],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], ModalComponent);
    return ModalComponent;
}());
exports.ModalComponent = ModalComponent;


/***/ },

/***/ "./src/app/ui-elements/components/modal-window/modal.style.scss":
/***/ function(module, exports) {

module.exports = ".modal-body {\n  background: #eeeeee; }\n"

/***/ },

/***/ "./src/app/ui-elements/components/modal-window/modal.template.html":
/***/ function(module, exports) {

module.exports = "<button class=\"btn btn-gray\" (click)=\"myModal.open()\">\r\n  Launch demo modal\r\n</button>\r\n<modal #myModal>\r\n  <modal-header>\r\n    <h4 class=\"modal-title text-xs-center fw-bold mt\" id=\"myModalLabel18\">One more step</h4>\r\n    <p class=\"text-xs-center fs-mini text-muted mt-sm\">\r\n      We need a bit of your detailed information to proceed. US ticketing system requires\r\n      us to process and check your personal infromation before we can go.\r\n    </p>\r\n  </modal-header>\r\n  <modal-content>\r\n    <form>\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-8 col-xs-12\">\r\n          <div class=\"form-group\">\r\n            <input type=\"text\" class=\"form-control input-no-border\"\r\n                   placeholder=\"Name\">\r\n          </div>\r\n        </div>\r\n        <div class=\"col-lg-4 col-xs-12\">\r\n          <div class=\"form-group\">\r\n            <input type=\"text\" class=\"form-control input-no-border\"\r\n                   placeholder=\"Middle Name\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-12 col-xs-12\">\r\n          <div class=\"form-group\">\r\n            <input type=\"text\" class=\"form-control input-no-border\"\r\n                   placeholder=\"Address\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"row\">\r\n        <div class=\"col-lg-4 col-xs-12\">\r\n          <div class=\"form-group\">\r\n            <input type=\"text\" class=\"form-control input-no-border\"\r\n                   placeholder=\"City\">\r\n          </div>\r\n        </div>\r\n        <div class=\"col-lg-4 col-xs-12\">\r\n          <div class=\"form-group\">\r\n            <input type=\"text\" class=\"form-control input-no-border\"\r\n                   placeholder=\"Country\">\r\n          </div>\r\n        </div>\r\n        <div class=\"col-lg-4 col-xs-12\">\r\n          <div class=\"form-group\">\r\n            <input type=\"text\" class=\"form-control input-no-border\"\r\n                   placeholder=\"Zip\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </modal-content>\r\n  <modal-footer>\r\n    <button type=\"button\" class=\"btn btn-gray\" (click)=\"myModal.close()\">Close</button>\r\n    <button type=\"button\" class=\"btn btn-success\" (click)=\"myModal.close()\">Save changes</button>\r\n  </modal-footer>\r\n</modal>\r\n"

/***/ },

/***/ "./src/app/ui-elements/icons/icons.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Icons = (function () {
    function Icons() {
    }
    Icons = __decorate([
        core_1.Component({
            selector: '[ui-tabs-accordion]',
            template: __webpack_require__("./src/app/ui-elements/icons/icons.template.html"),
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [__webpack_require__("./src/app/ui-elements/icons/icons.style.scss")]
        }), 
        __metadata('design:paramtypes', [])
    ], Icons);
    return Icons;
}());
exports.Icons = Icons;


/***/ },

/***/ "./src/app/ui-elements/icons/icons.style.scss":
/***/ function(module, exports) {

module.exports = "/***********************************/\n/**           ICON LIST           **/\n/***********************************/\n.icon-list {\n  margin-top: 1rem; }\n\n.icon-list-item {\n  height: 32px;\n  font-size: 14px;\n  line-height: 32px; }\n  .icon-list-item > a {\n    color: #555555;\n    text-decoration: none; }\n  .icon-list-item .glyphicon,\n  .icon-list-item .fa {\n    width: 32px;\n    margin-right: 10px; }\n  .icon-list-item .glyphicon {\n    top: 10px; }\n  .icon-list-item:hover .glyphicon,\n  .icon-list-item:hover .fa {\n    font-size: 28px;\n    top: 2px; }\n  .icon-list-item:hover .fa {\n    vertical-align: -5px; }\n  .icon-list-item:hover .glyphicon {\n    vertical-align: -6px; }\n"

/***/ },

/***/ "./src/app/ui-elements/icons/icons.template.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"breadcrumb-item active\">UI Icons</li>\r\n</ol>\r\n<h1 class=\"page-title\">UI - <span class=\"fw-semi-bold\">Icons</span></h1>\r\n<tabset class=\"tab-content mb-lg\">\r\n  <tab heading=\"Glypicons\">\r\n    <h4>Built-in <span class=\"fw-semi-bold\">Glyphicons</span></h4>\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-asterisk\"></span>asterisk</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-plus\"></span>plus</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-euro\"></span>euro</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-minus\"></span>minus</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-cloud\"></span>cloud</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-envelope\"></span>envelope</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-pencil\"></span>pencil</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glass\"></span>glass</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-music\"></span>music</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-search\"></span>search</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-heart\"></span>heart</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-star\"></span>star</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-star-empty\"></span>star-empty</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-user\"></span>user</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-film\"></span>film</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-th-large\"></span>th-large</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-th\"></span>th</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-th-list\"></span>th-list</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-ok\"></span>ok</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-remove\"></span>remove</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-zoom-in\"></span>zoom-in</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-zoom-out\"></span>zoom-out</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-off\"></span>off</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-signal\"></span>signal</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-cog\"></span>cog</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-trash\"></span>trash</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-home\"></span>home</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-file\"></span>file</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-time\"></span>time</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-road\"></span>road</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-download-alt\"></span>download-alt</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-download\"></span>download</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-upload\"></span>upload</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-inbox\"></span>inbox</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-play-circle\"></span>play-circle</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-repeat\"></span>repeat</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-refresh\"></span>refresh</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-list-alt\"></span>list-alt</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-lock\"></span>lock</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-flag\"></span>flag</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-headphones\"></span>headphones</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-volume-off\"></span>volume-off</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-volume-down\"></span>volume-down</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-volume-up\"></span>volume-up</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-qrcode\"></span>qrcode</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-barcode\"></span>barcode</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-tag\"></span>tag</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-tags\"></span>tags</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-book\"></span>book</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-bookmark\"></span>bookmark</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-print\"></span>print</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-camera\"></span>camera</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-font\"></span>font</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-bold\"></span>bold</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-italic\"></span>italic</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-text-height\"></span>text-height</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-text-width\"></span>text-width</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-align-left\"></span>align-left</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-align-center\"></span>align-center</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-align-right\"></span>align-right</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-align-justify\"></span>align-justify</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-list\"></span>list</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-indent-left\"></span>indent-left</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-indent-right\"></span>indent-right</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-facetime-video\"></span>facetime-video</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-picture\"></span>picture</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-map-marker\"></span>map-marker</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-adjust\"></span>adjust</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-tint\"></span>tint</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-edit\"></span>edit</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-share\"></span>share</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-check\"></span>check</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-move\"></span>move</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-step-backward\"></span>step-backward</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-fast-backward\"></span>fast-backward</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-backward\"></span>backward</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-play\"></span>play</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-pause\"></span>pause</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-stop\"></span>stop</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-forward\"></span>forward</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-fast-forward\"></span>fast-forward</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-step-forward\"></span>step-forward</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-eject\"></span>eject</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-chevron-left\"></span>chevron-left</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-chevron-right\"></span>chevron-right</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-plus-sign\"></span>plus-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-minus-sign\"></span>minus-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-remove-sign\"></span>remove-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-ok-sign\"></span>ok-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-question-sign\"></span>question-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-info-sign\"></span>info-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-screenshot\"></span>screenshot</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-remove-circle\"></span>remove-circle</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-ok-circle\"></span>ok-circle</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-ban-circle\"></span>ban-circle</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-arrow-left\"></span>arrow-left</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-arrow-right\"></span>arrow-right</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-arrow-up\"></span>arrow-up</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-arrow-down\"></span>arrow-down</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-share-alt\"></span>share-alt</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-resize-full\"></span>resize-full</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-resize-small\"></span>resize-small</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-exclamation-sign\"></span>exclamation-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-gift\"></span>gift</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-leaf\"></span>leaf</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-fire\"></span>fire</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-eye-open\"></span>eye-open</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-eye-close\"></span>eye-close</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-warning-sign\"></span>warning-sign</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-plane\"></span>plane</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-calendar\"></span>calendar</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-random\"></span>random</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-comment\"></span>comment</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-magnet\"></span>magnet</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-chevron-up\"></span>chevron-up</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-chevron-down\"></span>chevron-down</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-retweet\"></span>retweet</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-shopping-cart\"></span>shopping-cart</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-folder-close\"></span>folder-close</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-folder-open\"></span>folder-open</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-resize-vertical\"></span>resize-vertical</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-resize-horizontal\"></span>resize-horizontal</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-hdd\"></span>hdd</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-bullhorn\"></span>bullhorn</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-bell\"></span>bell</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-certificate\"></span>certificate</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>thumbs-up</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-thumbs-down\"></span>thumbs-down</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-hand-right\"></span>hand-right</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-hand-left\"></span>hand-left</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-hand-top\"></span>hand-up</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-hand-down\"></span>hand-down</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-circle-arrow-right\"></span>circle-arrow-right</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-circle-arrow-left\"></span>circle-arrow-left</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-circle-arrow-top\"></span>circle-arrow-up</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-circle-arrow-down\"></span>circle-arrow-down</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-globe\"></span>globe</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-wrench\"></span>wrench</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-tasks\"></span>tasks</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-filter\"></span>filter</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-briefcase\"></span>briefcase</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-fullscreen\"></span>fullscreen</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-dashboard\"></span>dashboard</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-paperclip\"></span>paperclip</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-heart-empty\"></span>heart-empty</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-link\"></span>link</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-phone\"></span>phone</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-glyph-pushpin\"></span>pushpin</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-usd\"></span>usd</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-gbp\"></span>gbp</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-sort\"></span>sort</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-sort-by-alphabet\"></span>sort-by-alphabet</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-sort-by-alphabet-alt\"></span>sort-by-alphabet-alt</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-sort-by-order\"></span>sort-by-order</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-sort-by-order-alt\"></span>sort-by-order-alt</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-sort-by-attributes\"></span>sort-by-attributes</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-sort-by-attributes-alt\"></span>sort-by-attributes-alt</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-unchecked\"></span>unchecked</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-expand\"></span>expand</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-collapse\"></span>collapse-down</div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><span class=\"glyphicon glyphicon-collapse-top\"></span>collapse-up</div>\r\n    </div>\r\n  </tab>\r\n  <tab>\r\n    <template tabHeading>\r\n      FA 4.6.3 <span class=\"tag tag-danger\">new</span>\r\n    </template>\r\n    <h4>Awesome <span class=\"fw-semi-bold\">Font Awesome</span></h4>\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bed\"><i class=\"fa fa-bed\"></i> bed</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/university\"><i class=\"fa fa-bank\"></i> bank <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/behance\"><i class=\"fa fa-behance\"></i> behance</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/behance-square\"><i class=\"fa fa-behance-square\"></i> behance-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bomb\"><i class=\"fa fa-bomb\"></i> bomb</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/building\"><i class=\"fa fa-building\"></i> building</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/taxi\"><i class=\"fa fa-cab\"></i> cab <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/car\"><i class=\"fa fa-car\"></i> car</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/child\"><i class=\"fa fa-child\"></i> child</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle-o-notch\"><i class=\"fa fa-circle-o-notch\"></i> circle-o-notch</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle-thin\"><i class=\"fa fa-circle-thin\"></i> circle-thin</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/codepen\"><i class=\"fa fa-codepen\"></i> codepen</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cube\"><i class=\"fa fa-cube\"></i> cube</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cubes\"><i class=\"fa fa-cubes\"></i> cubes</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/database\"><i class=\"fa fa-database\"></i> database</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/delicious\"><i class=\"fa fa-delicious\"></i> delicious</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/deviantart\"><i class=\"fa fa-deviantart\"></i> deviantart</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/digg\"><i class=\"fa fa-digg\"></i> digg</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/drupal\"><i class=\"fa fa-drupal\"></i> drupal</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/empire\"><i class=\"fa fa-empire\"></i> empire</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/envelope-square\"><i class=\"fa fa-envelope-square\"></i> envelope-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/fax\"><i class=\"fa fa-fax\"></i> fax</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-archive-o\"><i class=\"fa fa-file-archive-o\"></i> file-archive-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-audio-o\"><i class=\"fa fa-file-audio-o\"></i> file-audio-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-code-o\"><i class=\"fa fa-file-code-o\"></i> file-code-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-excel-o\"><i class=\"fa fa-file-excel-o\"></i> file-excel-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-image-o\"></i> file-image-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-video-o\"><i class=\"fa fa-file-movie-o\"></i> file-movie-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-pdf-o\"><i class=\"fa fa-file-pdf-o\"></i> file-pdf-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-photo-o\"></i> file-photo-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-picture-o\"></i> file-picture-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-powerpoint-o\"><i class=\"fa fa-file-powerpoint-o\"></i> file-powerpoint-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-audio-o\"><i class=\"fa fa-file-sound-o\"></i> file-sound-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-video-o\"><i class=\"fa fa-file-video-o\"></i> file-video-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-word-o\"><i class=\"fa fa-file-word-o\"></i> file-word-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-archive-o\"><i class=\"fa fa-file-zip-o\"></i> file-zip-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/empire\"><i class=\"fa fa-ge\"></i> ge <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/git\"><i class=\"fa fa-git\"></i> git</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/git-square\"><i class=\"fa fa-git-square\"></i> git-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/google\"><i class=\"fa fa-google\"></i> google</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/graduation-cap\"><i class=\"fa fa-graduation-cap\"></i> graduation-cap</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/hacker-news\"><i class=\"fa fa-hacker-news\"></i> hacker-news</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/header\"><i class=\"fa fa-header\"></i> header</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/history\"><i class=\"fa fa-history\"></i> history</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/university\"><i class=\"fa fa-institution\"></i> institution <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/joomla\"><i class=\"fa fa-joomla\"></i> joomla</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/jsfiddle\"><i class=\"fa fa-jsfiddle\"></i> jsfiddle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/language\"><i class=\"fa fa-language\"></i> language</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-life-bouy\"></i> life-bouy <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-life-ring\"></i> life-ring</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-life-saver\"></i> life-saver <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/graduation-cap\"><i class=\"fa fa-mortar-board\"></i> mortar-board <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/openid\"><i class=\"fa fa-openid\"></i> openid</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane\"><i class=\"fa fa-paper-plane\"></i> paper-plane</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane-o\"><i class=\"fa fa-paper-plane-o\"></i> paper-plane-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paragraph\"><i class=\"fa fa-paragraph\"></i> paragraph</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paw\"><i class=\"fa fa-paw\"></i> paw</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pied-piper\"><i class=\"fa fa-pied-piper\"></i> pied-piper</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pied-piper-alt\"><i class=\"fa fa-pied-piper-alt\"></i> pied-piper-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pied-piper\"><i class=\"fa fa-pied-piper-square\"></i> pied-piper-square <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/qq\"><i class=\"fa fa-qq\"></i> qq</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rebel\"><i class=\"fa fa-ra\"></i> ra <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rebel\"><i class=\"fa fa-rebel\"></i> rebel</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/recycle\"><i class=\"fa fa-recycle\"></i> recycle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reddit\"><i class=\"fa fa-reddit\"></i> reddit</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reddit-square\"><i class=\"fa fa-reddit-square\"></i> reddit-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane\"><i class=\"fa fa-send\"></i> send <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane-o\"><i class=\"fa fa-send-o\"></i> send-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-alt\"><i class=\"fa fa-share-alt\"></i> share-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-alt-square\"><i class=\"fa fa-share-alt-square\"></i> share-alt-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/slack\"><i class=\"fa fa-slack\"></i> slack</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sliders\"><i class=\"fa fa-sliders\"></i> sliders</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/soundcloud\"><i class=\"fa fa-soundcloud\"></i> soundcloud</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/space-shuttle\"><i class=\"fa fa-space-shuttle\"></i> space-shuttle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/spoon\"><i class=\"fa fa-spoon\"></i> spoon</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/spotify\"><i class=\"fa fa-spotify\"></i> spotify</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/steam\"><i class=\"fa fa-steam\"></i> steam</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/steam-square\"><i class=\"fa fa-steam-square\"></i> steam-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stumbleupon\"><i class=\"fa fa-stumbleupon\"></i> stumbleupon</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stumbleupon-circle\"><i class=\"fa fa-stumbleupon-circle\"></i> stumbleupon-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-support\"></i> support <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/taxi\"><i class=\"fa fa-taxi\"></i> taxi</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tencent-weibo\"><i class=\"fa fa-tencent-weibo\"></i> tencent-weibo</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tree\"><i class=\"fa fa-tree\"></i> tree</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/university\"><i class=\"fa fa-university\"></i> university</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/vine\"><i class=\"fa fa-vine\"></i> vine</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/weixin\"><i class=\"fa fa-wechat\"></i> wechat <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/weixin\"><i class=\"fa fa-weixin\"></i> weixin</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/wordpress\"><i class=\"fa fa-wordpress\"></i> wordpress</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/yahoo\"><i class=\"fa fa-yahoo\"></i> yahoo</a></div>\r\n\r\n    </div>\r\n  </tab>\r\n  <tab heading=\"Web Application\" >\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/adjust\"><i class=\"fa fa-adjust\"></i> adjust</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/anchor\"><i class=\"fa fa-anchor\"></i> anchor</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/archive\"><i class=\"fa fa-archive\"></i> archive</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/arrows\"><i class=\"fa fa-arrows\"></i> arrows</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/arrows-h\"><i class=\"fa fa-arrows-h\"></i> arrows-h</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/arrows-v\"><i class=\"fa fa-arrows-v\"></i> arrows-v</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/asterisk\"><i class=\"fa fa-asterisk\"></i> asterisk</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/car\"><i class=\"fa fa-automobile\"></i> automobile <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/ban\"><i class=\"fa fa-ban\"></i> ban</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/university\"><i class=\"fa fa-bank\"></i> bank <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bar-chart-o\"><i class=\"fa fa-bar-chart-o\"></i> bar-chart-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/barcode\"><i class=\"fa fa-barcode\"></i> barcode</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bars\"><i class=\"fa fa-bars\"></i> bars</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/beer\"><i class=\"fa fa-beer\"></i> beer</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bell\"><i class=\"fa fa-bell\"></i> bell</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bell-o\"><i class=\"fa fa-bell-o\"></i> bell-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bolt\"><i class=\"fa fa-bolt\"></i> bolt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bomb\"><i class=\"fa fa-bomb\"></i> bomb</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/book\"><i class=\"fa fa-book\"></i> book</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bookmark\"><i class=\"fa fa-bookmark\"></i> bookmark</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bookmark-o\"><i class=\"fa fa-bookmark-o\"></i> bookmark-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/briefcase\"><i class=\"fa fa-briefcase\"></i> briefcase</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bug\"><i class=\"fa fa-bug\"></i> bug</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/building\"><i class=\"fa fa-building\"></i> building</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/building-o\"><i class=\"fa fa-building-o\"></i> building-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bullhorn\"><i class=\"fa fa-bullhorn\"></i> bullhorn</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bullseye\"><i class=\"fa fa-bullseye\"></i> bullseye</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/taxi\"><i class=\"fa fa-cab\"></i> cab <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/calendar\"><i class=\"fa fa-calendar\"></i> calendar</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/calendar-o\"><i class=\"fa fa-calendar-o\"></i> calendar-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/camera\"><i class=\"fa fa-camera\"></i> camera</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/camera-retro\"><i class=\"fa fa-camera-retro\"></i> camera-retro</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/car\"><i class=\"fa fa-car\"></i> car</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-down\"><i class=\"fa fa-caret-square-o-down\"></i> caret-square-o-down</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-left\"><i class=\"fa fa-caret-square-o-left\"></i> caret-square-o-left</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-right\"><i class=\"fa fa-caret-square-o-right\"></i> caret-square-o-right</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-up\"><i class=\"fa fa-caret-square-o-up\"></i> caret-square-o-up</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/certificate\"><i class=\"fa fa-certificate\"></i> certificate</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/check\"><i class=\"fa fa-check\"></i> check</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/check-circle\"><i class=\"fa fa-check-circle\"></i> check-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/check-circle-o\"><i class=\"fa fa-check-circle-o\"></i> check-circle-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/check-square\"><i class=\"fa fa-check-square\"></i> check-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/check-square-o\"><i class=\"fa fa-check-square-o\"></i> check-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/child\"><i class=\"fa fa-child\"></i> child</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle\"><i class=\"fa fa-circle\"></i> circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle-o\"><i class=\"fa fa-circle-o\"></i> circle-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle-o-notch\"><i class=\"fa fa-circle-o-notch\"></i> circle-o-notch</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle-thin\"><i class=\"fa fa-circle-thin\"></i> circle-thin</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/clock-o\"><i class=\"fa fa-clock-o\"></i> clock-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cloud\"><i class=\"fa fa-cloud\"></i> cloud</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cloud-download\"><i class=\"fa fa-cloud-download\"></i> cloud-download</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cloud-upload\"><i class=\"fa fa-cloud-upload\"></i> cloud-upload</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/code\"><i class=\"fa fa-code\"></i> code</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/code-fork\"><i class=\"fa fa-code-fork\"></i> code-fork</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/coffee\"><i class=\"fa fa-coffee\"></i> coffee</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cog\"><i class=\"fa fa-cog\"></i> cog</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cogs\"><i class=\"fa fa-cogs\"></i> cogs</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/comment\"><i class=\"fa fa-comment\"></i> comment</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/comment-o\"><i class=\"fa fa-comment-o\"></i> comment-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/comments\"><i class=\"fa fa-comments\"></i> comments</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/comments-o\"><i class=\"fa fa-comments-o\"></i> comments-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/compass\"><i class=\"fa fa-compass\"></i> compass</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/credit-card\"><i class=\"fa fa-credit-card\"></i> credit-card</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/crop\"><i class=\"fa fa-crop\"></i> crop</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/crosshairs\"><i class=\"fa fa-crosshairs\"></i> crosshairs</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cube\"><i class=\"fa fa-cube\"></i> cube</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cubes\"><i class=\"fa fa-cubes\"></i> cubes</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cutlery\"><i class=\"fa fa-cutlery\"></i> cutlery</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tachometer\"><i class=\"fa fa-dashboard\"></i> dashboard <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/database\"><i class=\"fa fa-database\"></i> database</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/desktop\"><i class=\"fa fa-desktop\"></i> desktop</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/dot-circle-o\"><i class=\"fa fa-dot-circle-o\"></i> dot-circle-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/download\"><i class=\"fa fa-download\"></i> download</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pencil-square-o\"><i class=\"fa fa-edit\"></i> edit <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/ellipsis-h\"><i class=\"fa fa-ellipsis-h\"></i> ellipsis-h</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/ellipsis-v\"><i class=\"fa fa-ellipsis-v\"></i> ellipsis-v</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/envelope\"><i class=\"fa fa-envelope\"></i> envelope</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/envelope-o\"><i class=\"fa fa-envelope-o\"></i> envelope-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/envelope-square\"><i class=\"fa fa-envelope-square\"></i> envelope-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/eraser\"><i class=\"fa fa-eraser\"></i> eraser</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/exchange\"><i class=\"fa fa-exchange\"></i> exchange</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/exclamation\"><i class=\"fa fa-exclamation\"></i> exclamation</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/exclamation-circle\"><i class=\"fa fa-exclamation-circle\"></i> exclamation-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/exclamation-triangle\"><i class=\"fa fa-exclamation-triangle\"></i> exclamation-triangle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/external-link\"><i class=\"fa fa-external-link\"></i> external-link</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/external-link-square\"><i class=\"fa fa-external-link-square\"></i> external-link-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/eye\"><i class=\"fa fa-eye\"></i> eye</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/eye-slash\"><i class=\"fa fa-eye-slash\"></i> eye-slash</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/fax\"><i class=\"fa fa-fax\"></i> fax</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/female\"><i class=\"fa fa-female\"></i> female</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/fighter-jet\"><i class=\"fa fa-fighter-jet\"></i> fighter-jet</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-archive-o\"><i class=\"fa fa-file-archive-o\"></i> file-archive-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-audio-o\"><i class=\"fa fa-file-audio-o\"></i> file-audio-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-code-o\"><i class=\"fa fa-file-code-o\"></i> file-code-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-excel-o\"><i class=\"fa fa-file-excel-o\"></i> file-excel-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-image-o\"></i> file-image-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-video-o\"><i class=\"fa fa-file-movie-o\"></i> file-movie-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-pdf-o\"><i class=\"fa fa-file-pdf-o\"></i> file-pdf-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-photo-o\"></i> file-photo-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-picture-o\"></i> file-picture-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-powerpoint-o\"><i class=\"fa fa-file-powerpoint-o\"></i> file-powerpoint-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-audio-o\"><i class=\"fa fa-file-sound-o\"></i> file-sound-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-video-o\"><i class=\"fa fa-file-video-o\"></i> file-video-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-word-o\"><i class=\"fa fa-file-word-o\"></i> file-word-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-archive-o\"><i class=\"fa fa-file-zip-o\"></i> file-zip-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/film\"><i class=\"fa fa-film\"></i> film</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/filter\"><i class=\"fa fa-filter\"></i> filter</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/fire\"><i class=\"fa fa-fire\"></i> fire</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/fire-extinguisher\"><i class=\"fa fa-fire-extinguisher\"></i> fire-extinguisher</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/flag\"><i class=\"fa fa-flag\"></i> flag</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/flag-checkered\"><i class=\"fa fa-flag-checkered\"></i> flag-checkered</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/flag-o\"><i class=\"fa fa-flag-o\"></i> flag-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bolt\"><i class=\"fa fa-flash\"></i> flash <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/flask\"><i class=\"fa fa-flask\"></i> flask</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/folder\"><i class=\"fa fa-folder\"></i> folder</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/folder-o\"><i class=\"fa fa-folder-o\"></i> folder-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/folder-open\"><i class=\"fa fa-folder-open\"></i> folder-open</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/folder-open-o\"><i class=\"fa fa-folder-open-o\"></i> folder-open-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/frown-o\"><i class=\"fa fa-frown-o\"></i> frown-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/gamepad\"><i class=\"fa fa-gamepad\"></i> gamepad</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/gavel\"><i class=\"fa fa-gavel\"></i> gavel</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cog\"><i class=\"fa fa-gear\"></i> gear <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cogs\"><i class=\"fa fa-gears\"></i> gears <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/gift\"><i class=\"fa fa-gift\"></i> gift</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/glass\"><i class=\"fa fa-glass\"></i> glass</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/globe\"><i class=\"fa fa-globe\"></i> globe</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/graduation-cap\"><i class=\"fa fa-graduation-cap\"></i> graduation-cap</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/users\"><i class=\"fa fa-group\"></i> group <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/hdd-o\"><i class=\"fa fa-hdd-o\"></i> hdd-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/headphones\"><i class=\"fa fa-headphones\"></i> headphones</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/heart\"><i class=\"fa fa-heart\"></i> heart</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/heart-o\"><i class=\"fa fa-heart-o\"></i> heart-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/history\"><i class=\"fa fa-history\"></i> history</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/home\"><i class=\"fa fa-home\"></i> home</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/picture-o\"><i class=\"fa fa-image\"></i> image <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/inbox\"><i class=\"fa fa-inbox\"></i> inbox</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/info\"><i class=\"fa fa-info\"></i> info</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/info-circle\"><i class=\"fa fa-info-circle\"></i> info-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/university\"><i class=\"fa fa-institution\"></i> institution <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/key\"><i class=\"fa fa-key\"></i> key</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/keyboard-o\"><i class=\"fa fa-keyboard-o\"></i> keyboard-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/language\"><i class=\"fa fa-language\"></i> language</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/laptop\"><i class=\"fa fa-laptop\"></i> laptop</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/leaf\"><i class=\"fa fa-leaf\"></i> leaf</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/gavel\"><i class=\"fa fa-legal\"></i> legal <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/lemon-o\"><i class=\"fa fa-lemon-o\"></i> lemon-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/level-down\"><i class=\"fa fa-level-down\"></i> level-down</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/level-up\"><i class=\"fa fa-level-up\"></i> level-up</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-life-bouy\"></i> life-bouy <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-life-ring\"></i> life-ring</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-life-saver\"></i> life-saver <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/lightbulb-o\"><i class=\"fa fa-lightbulb-o\"></i> lightbulb-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/location-arrow\"><i class=\"fa fa-location-arrow\"></i> location-arrow</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/lock\"><i class=\"fa fa-lock\"></i> lock</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/magic\"><i class=\"fa fa-magic\"></i> magic</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/magnet\"><i class=\"fa fa-magnet\"></i> magnet</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share\"><i class=\"fa fa-mail-forward\"></i> mail-forward <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reply\"><i class=\"fa fa-mail-reply\"></i> mail-reply <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reply-all\"><i class=\"fa fa-mail-reply-all\"></i> mail-reply-all <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/male\"><i class=\"fa fa-male\"></i> male</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/map-marker\"><i class=\"fa fa-map-marker\"></i> map-marker</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/meh-o\"><i class=\"fa fa-meh-o\"></i> meh-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/microphone\"><i class=\"fa fa-microphone\"></i> microphone</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/microphone-slash\"><i class=\"fa fa-microphone-slash\"></i> microphone-slash</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/minus\"><i class=\"fa fa-minus\"></i> minus</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/minus-circle\"><i class=\"fa fa-minus-circle\"></i> minus-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/minus-square\"><i class=\"fa fa-minus-square\"></i> minus-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/minus-square-o\"><i class=\"fa fa-minus-square-o\"></i> minus-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/mobile\"><i class=\"fa fa-mobile\"></i> mobile</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/mobile\"><i class=\"fa fa-mobile-phone\"></i> mobile-phone <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/money\"><i class=\"fa fa-money\"></i> money</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/moon-o\"><i class=\"fa fa-moon-o\"></i> moon-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/graduation-cap\"><i class=\"fa fa-mortar-board\"></i> mortar-board <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/music\"><i class=\"fa fa-music\"></i> music</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bars\"><i class=\"fa fa-navicon\"></i> navicon <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane\"><i class=\"fa fa-paper-plane\"></i> paper-plane</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane-o\"><i class=\"fa fa-paper-plane-o\"></i> paper-plane-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paw\"><i class=\"fa fa-paw\"></i> paw</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pencil\"><i class=\"fa fa-pencil\"></i> pencil</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pencil-square\"><i class=\"fa fa-pencil-square\"></i> pencil-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pencil-square-o\"><i class=\"fa fa-pencil-square-o\"></i> pencil-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/phone\"><i class=\"fa fa-phone\"></i> phone</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/phone-square\"><i class=\"fa fa-phone-square\"></i> phone-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/picture-o\"><i class=\"fa fa-photo\"></i> photo <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/picture-o\"><i class=\"fa fa-picture-o\"></i> picture-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plane\"><i class=\"fa fa-plane\"></i> plane</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plus\"><i class=\"fa fa-plus\"></i> plus</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plus-circle\"><i class=\"fa fa-plus-circle\"></i> plus-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plus-square\"><i class=\"fa fa-plus-square\"></i> plus-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plus-square-o\"><i class=\"fa fa-plus-square-o\"></i> plus-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/power-off\"><i class=\"fa fa-power-off\"></i> power-off</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/print\"><i class=\"fa fa-print\"></i> print</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/puzzle-piece\"><i class=\"fa fa-puzzle-piece\"></i> puzzle-piece</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/qrcode\"><i class=\"fa fa-qrcode\"></i> qrcode</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/question\"><i class=\"fa fa-question\"></i> question</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/question-circle\"><i class=\"fa fa-question-circle\"></i> question-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/quote-left\"><i class=\"fa fa-quote-left\"></i> quote-left</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/quote-right\"><i class=\"fa fa-quote-right\"></i> quote-right</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/random\"><i class=\"fa fa-random\"></i> random</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/recycle\"><i class=\"fa fa-recycle\"></i> recycle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/refresh\"><i class=\"fa fa-refresh\"></i> refresh</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bars\"><i class=\"fa fa-reorder\"></i> reorder <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reply\"><i class=\"fa fa-reply\"></i> reply</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reply-all\"><i class=\"fa fa-reply-all\"></i> reply-all</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/retweet\"><i class=\"fa fa-retweet\"></i> retweet</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/road\"><i class=\"fa fa-road\"></i> road</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rocket\"><i class=\"fa fa-rocket\"></i> rocket</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rss\"><i class=\"fa fa-rss\"></i> rss</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rss-square\"><i class=\"fa fa-rss-square\"></i> rss-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/search\"><i class=\"fa fa-search\"></i> search</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/search-minus\"><i class=\"fa fa-search-minus\"></i> search-minus</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/search-plus\"><i class=\"fa fa-search-plus\"></i> search-plus</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane\"><i class=\"fa fa-send\"></i> send <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paper-plane-o\"><i class=\"fa fa-send-o\"></i> send-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share\"><i class=\"fa fa-share\"></i> share</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-alt\"><i class=\"fa fa-share-alt\"></i> share-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-alt-square\"><i class=\"fa fa-share-alt-square\"></i> share-alt-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-square\"><i class=\"fa fa-share-square\"></i> share-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-square-o\"><i class=\"fa fa-share-square-o\"></i> share-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/shield\"><i class=\"fa fa-shield\"></i> shield</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/shopping-cart\"><i class=\"fa fa-shopping-cart\"></i> shopping-cart</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sign-in\"><i class=\"fa fa-sign-in\"></i> sign-in</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sign-out\"><i class=\"fa fa-sign-out\"></i> sign-out</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/signal\"><i class=\"fa fa-signal\"></i> signal</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sitemap\"><i class=\"fa fa-sitemap\"></i> sitemap</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sliders\"><i class=\"fa fa-sliders\"></i> sliders</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/smile-o\"><i class=\"fa fa-smile-o\"></i> smile-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort\"><i class=\"fa fa-sort\"></i> sort</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-alpha-asc\"><i class=\"fa fa-sort-alpha-asc\"></i> sort-alpha-asc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-alpha-desc\"><i class=\"fa fa-sort-alpha-desc\"></i> sort-alpha-desc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-amount-asc\"><i class=\"fa fa-sort-amount-asc\"></i> sort-amount-asc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-amount-desc\"><i class=\"fa fa-sort-amount-desc\"></i> sort-amount-desc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-asc\"><i class=\"fa fa-sort-asc\"></i> sort-asc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-desc\"><i class=\"fa fa-sort-desc\"></i> sort-desc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-desc\"><i class=\"fa fa-sort-down\"></i> sort-down <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-numeric-asc\"><i class=\"fa fa-sort-numeric-asc\"></i> sort-numeric-asc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-numeric-desc\"><i class=\"fa fa-sort-numeric-desc\"></i> sort-numeric-desc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort-asc\"><i class=\"fa fa-sort-up\"></i> sort-up <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/space-shuttle\"><i class=\"fa fa-space-shuttle\"></i> space-shuttle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/spinner\"><i class=\"fa fa-spinner\"></i> spinner</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/spoon\"><i class=\"fa fa-spoon\"></i> spoon</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/square\"><i class=\"fa fa-square\"></i> square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/square-o\"><i class=\"fa fa-square-o\"></i> square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/star\"><i class=\"fa fa-star\"></i> star</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/star-half\"><i class=\"fa fa-star-half\"></i> star-half</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/star-half-o\"><i class=\"fa fa-star-half-empty\"></i> star-half-empty <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/star-half-o\"><i class=\"fa fa-star-half-full\"></i> star-half-full <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/star-half-o\"><i class=\"fa fa-star-half-o\"></i> star-half-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/star-o\"><i class=\"fa fa-star-o\"></i> star-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/suitcase\"><i class=\"fa fa-suitcase\"></i> suitcase</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sun-o\"><i class=\"fa fa-sun-o\"></i> sun-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/life-ring\"><i class=\"fa fa-support\"></i> support <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tablet\"><i class=\"fa fa-tablet\"></i> tablet</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tachometer\"><i class=\"fa fa-tachometer\"></i> tachometer</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tag\"><i class=\"fa fa-tag\"></i> tag</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tags\"><i class=\"fa fa-tags\"></i> tags</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tasks\"><i class=\"fa fa-tasks\"></i> tasks</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/taxi\"><i class=\"fa fa-taxi\"></i> taxi</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/terminal\"><i class=\"fa fa-terminal\"></i> terminal</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/thumb-tack\"><i class=\"fa fa-thumb-tack\"></i> thumb-tack</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/thumbs-down\"><i class=\"fa fa-thumbs-down\"></i> thumbs-down</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/thumbs-o-down\"><i class=\"fa fa-thumbs-o-down\"></i> thumbs-o-down</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/thumbs-o-up\"><i class=\"fa fa-thumbs-o-up\"></i> thumbs-o-up</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/thumbs-up\"><i class=\"fa fa-thumbs-up\"></i> thumbs-up</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/ticket\"><i class=\"fa fa-ticket\"></i> ticket</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/times\"><i class=\"fa fa-times\"></i> times</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/times-circle\"><i class=\"fa fa-times-circle\"></i> times-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/times-circle-o\"><i class=\"fa fa-times-circle-o\"></i> times-circle-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tint\"><i class=\"fa fa-tint\"></i> tint</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-down\"><i class=\"fa fa-toggle-down\"></i> toggle-down <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-left\"><i class=\"fa fa-toggle-left\"></i> toggle-left <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-right\"><i class=\"fa fa-toggle-right\"></i> toggle-right <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/caret-square-o-up\"><i class=\"fa fa-toggle-up\"></i> toggle-up <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/trash-o\"><i class=\"fa fa-trash-o\"></i> trash-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tree\"><i class=\"fa fa-tree\"></i> tree</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/trophy\"><i class=\"fa fa-trophy\"></i> trophy</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/truck\"><i class=\"fa fa-truck\"></i> truck</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/umbrella\"><i class=\"fa fa-umbrella\"></i> umbrella</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/university\"><i class=\"fa fa-university\"></i> university</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/unlock\"><i class=\"fa fa-unlock\"></i> unlock</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/unlock-alt\"><i class=\"fa fa-unlock-alt\"></i> unlock-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/sort\"><i class=\"fa fa-unsorted\"></i> unsorted <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/upload\"><i class=\"fa fa-upload\"></i> upload</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/user\"><i class=\"fa fa-user\"></i> user</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/users\"><i class=\"fa fa-users\"></i> users</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/video-camera\"><i class=\"fa fa-video-camera\"></i> video-camera</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/volume-down\"><i class=\"fa fa-volume-down\"></i> volume-down</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/volume-off\"><i class=\"fa fa-volume-off\"></i> volume-off</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/volume-up\"><i class=\"fa fa-volume-up\"></i> volume-up</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/exclamation-triangle\"><i class=\"fa fa-warning\"></i> warning <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/wheelchair\"><i class=\"fa fa-wheelchair\"></i> wheelchair</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/wrench\"><i class=\"fa fa-wrench\"></i> wrench</a></div>\r\n\r\n    </div>\r\n  </tab>\r\n  <tab heading=\"Spinner\">\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle-o-notch\"><i class=\"fa fa-circle-o-notch\"></i> circle-o-notch</a></div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cog\"><i class=\"fa fa-cog\"></i> cog</a></div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/cog\"><i class=\"fa fa-gear\"></i> gear <span class=\"text-muted\">(alias)</span></a></div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/refresh\"><i class=\"fa fa-refresh\"></i> refresh</a></div>\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/spinner\"><i class=\"fa fa-spinner\"></i> spinner</a></div>\r\n    </div>\r\n  </tab>\r\n  <tab heading=\"Text Editor\">\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/align-center\"><i class=\"fa fa-align-center\"></i> align-center</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/align-justify\"><i class=\"fa fa-align-justify\"></i> align-justify</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/align-left\"><i class=\"fa fa-align-left\"></i> align-left</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/align-right\"><i class=\"fa fa-align-right\"></i> align-right</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bold\"><i class=\"fa fa-bold\"></i> bold</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/link\"><i class=\"fa fa-chain\"></i> chain <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/chain-broken\"><i class=\"fa fa-chain-broken\"></i> chain-broken</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/clipboard\"><i class=\"fa fa-clipboard\"></i> clipboard</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/columns\"><i class=\"fa fa-columns\"></i> columns</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/files-o\"><i class=\"fa fa-copy\"></i> copy <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/scissors\"><i class=\"fa fa-cut\"></i> cut <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/outdent\"><i class=\"fa fa-dedent\"></i> dedent <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/eraser\"><i class=\"fa fa-eraser\"></i> eraser</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file\"><i class=\"fa fa-file\"></i> file</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-o\"><i class=\"fa fa-file-o\"></i> file-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-text\"><i class=\"fa fa-file-text\"></i> file-text</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-text-o\"><i class=\"fa fa-file-text-o\"></i> file-text-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/files-o\"><i class=\"fa fa-files-o\"></i> files-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/floppy-o\"><i class=\"fa fa-floppy-o\"></i> floppy-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/font\"><i class=\"fa fa-font\"></i> font</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/header\"><i class=\"fa fa-header\"></i> header</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/indent\"><i class=\"fa fa-indent\"></i> indent</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/italic\"><i class=\"fa fa-italic\"></i> italic</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/link\"><i class=\"fa fa-link\"></i> link</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/list\"><i class=\"fa fa-list\"></i> list</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/list-alt\"><i class=\"fa fa-list-alt\"></i> list-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/list-ol\"><i class=\"fa fa-list-ol\"></i> list-ol</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/list-ul\"><i class=\"fa fa-list-ul\"></i> list-ul</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/outdent\"><i class=\"fa fa-outdent\"></i> outdent</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paperclip\"><i class=\"fa fa-paperclip\"></i> paperclip</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/paragraph\"><i class=\"fa fa-paragraph\"></i> paragraph</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/clipboard\"><i class=\"fa fa-paste\"></i> paste <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/repeat\"><i class=\"fa fa-repeat\"></i> repeat</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/undo\"><i class=\"fa fa-rotate-left\"></i> rotate-left <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/repeat\"><i class=\"fa fa-rotate-right\"></i> rotate-right <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/floppy-o\"><i class=\"fa fa-save\"></i> save <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/scissors\"><i class=\"fa fa-scissors\"></i> scissors</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/strikethrough\"><i class=\"fa fa-strikethrough\"></i> strikethrough</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/subscript\"><i class=\"fa fa-subscript\"></i> subscript</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/superscript\"><i class=\"fa fa-superscript\"></i> superscript</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/table\"><i class=\"fa fa-table\"></i> table</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/text-height\"><i class=\"fa fa-text-height\"></i> text-height</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/text-width\"><i class=\"fa fa-text-width\"></i> text-width</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/th\"><i class=\"fa fa-th\"></i> th</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/th-large\"><i class=\"fa fa-th-large\"></i> th-large</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/th-list\"><i class=\"fa fa-th-list\"></i> th-list</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/underline\"><i class=\"fa fa-underline\"></i> underline</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/undo\"><i class=\"fa fa-undo\"></i> undo</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/chain-broken\"><i class=\"fa fa-unlink\"></i> unlink <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n    </div>\r\n  </tab>\r\n  <tab heading=\"Brand\">\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/adn\"><i class=\"fa fa-adn\"></i> adn</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/android\"><i class=\"fa fa-android\"></i> android</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/apple\"><i class=\"fa fa-apple\"></i> apple</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/behance\"><i class=\"fa fa-behance\"></i> behance</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/behance-square\"><i class=\"fa fa-behance-square\"></i> behance-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bitbucket\"><i class=\"fa fa-bitbucket\"></i> bitbucket</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/bitbucket-square\"><i class=\"fa fa-bitbucket-square\"></i> bitbucket-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/btc\"><i class=\"fa fa-bitcoin\"></i> bitcoin <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/btc\"><i class=\"fa fa-btc\"></i> btc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/codepen\"><i class=\"fa fa-codepen\"></i> codepen</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/css3\"><i class=\"fa fa-css3\"></i> css3</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/delicious\"><i class=\"fa fa-delicious\"></i> delicious</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/deviantart\"><i class=\"fa fa-deviantart\"></i> deviantart</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/digg\"><i class=\"fa fa-digg\"></i> digg</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/dribbble\"><i class=\"fa fa-dribbble\"></i> dribbble</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/dropbox\"><i class=\"fa fa-dropbox\"></i> dropbox</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/drupal\"><i class=\"fa fa-drupal\"></i> drupal</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/empire\"><i class=\"fa fa-empire\"></i> empire</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/facebook\"><i class=\"fa fa-facebook\"></i> facebook</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/facebook-square\"><i class=\"fa fa-facebook-square\"></i> facebook-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/flickr\"><i class=\"fa fa-flickr\"></i> flickr</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/foursquare\"><i class=\"fa fa-foursquare\"></i> foursquare</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/empire\"><i class=\"fa fa-ge\"></i> ge <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/git\"><i class=\"fa fa-git\"></i> git</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/git-square\"><i class=\"fa fa-git-square\"></i> git-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/github\"><i class=\"fa fa-github\"></i> github</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/github-alt\"><i class=\"fa fa-github-alt\"></i> github-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/github-square\"><i class=\"fa fa-github-square\"></i> github-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/gittip\"><i class=\"fa fa-gittip\"></i> gittip</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/google\"><i class=\"fa fa-google\"></i> google</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/google-plus\"><i class=\"fa fa-google-plus\"></i> google-plus</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/google-plus-square\"><i class=\"fa fa-google-plus-square\"></i> google-plus-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/hacker-news\"><i class=\"fa fa-hacker-news\"></i> hacker-news</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/html5\"><i class=\"fa fa-html5\"></i> html5</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/instagram\"><i class=\"fa fa-instagram\"></i> instagram</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/joomla\"><i class=\"fa fa-joomla\"></i> joomla</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/jsfiddle\"><i class=\"fa fa-jsfiddle\"></i> jsfiddle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/linkedin\"><i class=\"fa fa-linkedin\"></i> linkedin</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/linkedin-square\"><i class=\"fa fa-linkedin-square\"></i> linkedin-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/linux\"><i class=\"fa fa-linux\"></i> linux</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/maxcdn\"><i class=\"fa fa-maxcdn\"></i> maxcdn</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/openid\"><i class=\"fa fa-openid\"></i> openid</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pagelines\"><i class=\"fa fa-pagelines\"></i> pagelines</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pied-piper\"><i class=\"fa fa-pied-piper\"></i> pied-piper</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pied-piper-alt\"><i class=\"fa fa-pied-piper-alt\"></i> pied-piper-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pied-piper\"><i class=\"fa fa-pied-piper-square\"></i> pied-piper-square <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pinterest\"><i class=\"fa fa-pinterest\"></i> pinterest</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pinterest-square\"><i class=\"fa fa-pinterest-square\"></i> pinterest-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/qq\"><i class=\"fa fa-qq\"></i> qq</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rebel\"><i class=\"fa fa-ra\"></i> ra <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rebel\"><i class=\"fa fa-rebel\"></i> rebel</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reddit\"><i class=\"fa fa-reddit\"></i> reddit</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/reddit-square\"><i class=\"fa fa-reddit-square\"></i> reddit-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/renren\"><i class=\"fa fa-renren\"></i> renren</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-alt\"><i class=\"fa fa-share-alt\"></i> share-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/share-alt-square\"><i class=\"fa fa-share-alt-square\"></i> share-alt-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/skype\"><i class=\"fa fa-skype\"></i> skype</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/slack\"><i class=\"fa fa-slack\"></i> slack</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/soundcloud\"><i class=\"fa fa-soundcloud\"></i> soundcloud</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/spotify\"><i class=\"fa fa-spotify\"></i> spotify</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stack-exchange\"><i class=\"fa fa-stack-exchange\"></i> stack-exchange</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stack-overflow\"><i class=\"fa fa-stack-overflow\"></i> stack-overflow</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/steam\"><i class=\"fa fa-steam\"></i> steam</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/steam-square\"><i class=\"fa fa-steam-square\"></i> steam-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stumbleupon\"><i class=\"fa fa-stumbleupon\"></i> stumbleupon</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stumbleupon-circle\"><i class=\"fa fa-stumbleupon-circle\"></i> stumbleupon-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tencent-weibo\"><i class=\"fa fa-tencent-weibo\"></i> tencent-weibo</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/trello\"><i class=\"fa fa-trello\"></i> trello</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tumblr\"><i class=\"fa fa-tumblr\"></i> tumblr</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/tumblr-square\"><i class=\"fa fa-tumblr-square\"></i> tumblr-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/twitter\"><i class=\"fa fa-twitter\"></i> twitter</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/twitter-square\"><i class=\"fa fa-twitter-square\"></i> twitter-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/vimeo-square\"><i class=\"fa fa-vimeo-square\"></i> vimeo-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/vine\"><i class=\"fa fa-vine\"></i> vine</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/vk\"><i class=\"fa fa-vk\"></i> vk</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/weixin\"><i class=\"fa fa-wechat\"></i> wechat <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/weibo\"><i class=\"fa fa-weibo\"></i> weibo</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/weixin\"><i class=\"fa fa-weixin\"></i> weixin</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/windows\"><i class=\"fa fa-windows\"></i> windows</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/wordpress\"><i class=\"fa fa-wordpress\"></i> wordpress</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/xing\"><i class=\"fa fa-xing\"></i> xing</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/xing-square\"><i class=\"fa fa-xing-square\"></i> xing-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/yahoo\"><i class=\"fa fa-yahoo\"></i> yahoo</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/youtube\"><i class=\"fa fa-youtube\"></i> youtube</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/youtube-play\"><i class=\"fa fa-youtube-play\"></i> youtube-play</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/youtube-square\"><i class=\"fa fa-youtube-square\"></i> youtube-square</a></div>\r\n\r\n    </div>\r\n  </tab>\r\n  <tab heading=\"Other\">\r\n    <h4>File Type <span class=\"fw-semi-bold\">Icons</span></h4>\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file\"><i class=\"fa fa-file\"></i> file</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-archive-o\"><i class=\"fa fa-file-archive-o\"></i> file-archive-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-audio-o\"><i class=\"fa fa-file-audio-o\"></i> file-audio-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-code-o\"><i class=\"fa fa-file-code-o\"></i> file-code-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-excel-o\"><i class=\"fa fa-file-excel-o\"></i> file-excel-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-image-o\"></i> file-image-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-video-o\"><i class=\"fa fa-file-movie-o\"></i> file-movie-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-o\"><i class=\"fa fa-file-o\"></i> file-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-pdf-o\"><i class=\"fa fa-file-pdf-o\"></i> file-pdf-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-photo-o\"></i> file-photo-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-image-o\"><i class=\"fa fa-file-picture-o\"></i> file-picture-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-powerpoint-o\"><i class=\"fa fa-file-powerpoint-o\"></i> file-powerpoint-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-audio-o\"><i class=\"fa fa-file-sound-o\"></i> file-sound-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-text\"><i class=\"fa fa-file-text\"></i> file-text</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-text-o\"><i class=\"fa fa-file-text-o\"></i> file-text-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-video-o\"><i class=\"fa fa-file-video-o\"></i> file-video-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-word-o\"><i class=\"fa fa-file-word-o\"></i> file-word-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/file-archive-o\"><i class=\"fa fa-file-zip-o\"></i> file-zip-o <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n    </div>\r\n    <h4>Form Control <span class=\"fw-semi-bold\">Icons</span></h4>\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/check-square\"><i class=\"fa fa-check-square\"></i> check-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/check-square-o\"><i class=\"fa fa-check-square-o\"></i> check-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle\"><i class=\"fa fa-circle\"></i> circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/circle-o\"><i class=\"fa fa-circle-o\"></i> circle-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/dot-circle-o\"><i class=\"fa fa-dot-circle-o\"></i> dot-circle-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/minus-square\"><i class=\"fa fa-minus-square\"></i> minus-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/minus-square-o\"><i class=\"fa fa-minus-square-o\"></i> minus-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plus-square\"><i class=\"fa fa-plus-square\"></i> plus-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plus-square-o\"><i class=\"fa fa-plus-square-o\"></i> plus-square-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/square\"><i class=\"fa fa-square\"></i> square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/square-o\"><i class=\"fa fa-square-o\"></i> square-o</a></div>\r\n\r\n    </div>\r\n    <h4>Currency <span class=\"fw-semi-bold\">Icons</span></h4>\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/btc\"><i class=\"fa fa-bitcoin\"></i> bitcoin <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/btc\"><i class=\"fa fa-btc\"></i> btc</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/jpy\"><i class=\"fa fa-cny\"></i> cny <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/usd\"><i class=\"fa fa-dollar\"></i> dollar <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/eur\"><i class=\"fa fa-eur\"></i> eur</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/eur\"><i class=\"fa fa-euro\"></i> euro <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/gbp\"><i class=\"fa fa-gbp\"></i> gbp</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/inr\"><i class=\"fa fa-inr\"></i> inr</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/jpy\"><i class=\"fa fa-jpy\"></i> jpy</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/krw\"><i class=\"fa fa-krw\"></i> krw</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/money\"><i class=\"fa fa-money\"></i> money</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/jpy\"><i class=\"fa fa-rmb\"></i> rmb <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rub\"><i class=\"fa fa-rouble\"></i> rouble <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rub\"><i class=\"fa fa-rub\"></i> rub</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/rub\"><i class=\"fa fa-ruble\"></i> ruble <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/inr\"><i class=\"fa fa-rupee\"></i> rupee <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/try\"><i class=\"fa fa-try\"></i> try</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/try\"><i class=\"fa fa-turkish-lira\"></i> turkish-lira <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/usd\"><i class=\"fa fa-usd\"></i> usd</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/krw\"><i class=\"fa fa-won\"></i> won <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/jpy\"><i class=\"fa fa-yen\"></i> yen <span class=\"text-muted\">(alias)</span></a></div>\r\n\r\n    </div>\r\n    <h4>Video Player <span class=\"fw-semi-bold\">Icons</span></h4>\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/arrows-alt\"><i class=\"fa fa-arrows-alt\"></i> arrows-alt</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/backward\"><i class=\"fa fa-backward\"></i> backward</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/compress\"><i class=\"fa fa-compress\"></i> compress</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/eject\"><i class=\"fa fa-eject\"></i> eject</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/expand\"><i class=\"fa fa-expand\"></i> expand</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/fast-backward\"><i class=\"fa fa-fast-backward\"></i> fast-backward</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/fast-forward\"><i class=\"fa fa-fast-forward\"></i> fast-forward</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/forward\"><i class=\"fa fa-forward\"></i> forward</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/pause\"><i class=\"fa fa-pause\"></i> pause</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/play\"><i class=\"fa fa-play\"></i> play</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/play-circle\"><i class=\"fa fa-play-circle\"></i> play-circle</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/play-circle-o\"><i class=\"fa fa-play-circle-o\"></i> play-circle-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/step-backward\"><i class=\"fa fa-step-backward\"></i> step-backward</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/step-forward\"><i class=\"fa fa-step-forward\"></i> step-forward</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stop\"><i class=\"fa fa-stop\"></i> stop</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/youtube-play\"><i class=\"fa fa-youtube-play\"></i> youtube-play</a></div>\r\n\r\n    </div>\r\n    <h4>Medical <span class=\"fw-semi-bold\">Icons</span></h4>\r\n    <div class=\"row icon-list\">\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/ambulance\"><i class=\"fa fa-ambulance\"></i> ambulance</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/h-square\"><i class=\"fa fa-h-square\"></i> h-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/hospital-o\"><i class=\"fa fa-hospital-o\"></i> hospital-o</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/medkit\"><i class=\"fa fa-medkit\"></i> medkit</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/plus-square\"><i class=\"fa fa-plus-square\"></i> plus-square</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/stethoscope\"><i class=\"fa fa-stethoscope\"></i> stethoscope</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/user-md\"><i class=\"fa fa-user-md\"></i> user-md</a></div>\r\n\r\n      <div class=\"icon-list-item col-lg-3 col-md-4 col-xs-12\"><a href=\"../icon/wheelchair\"><i class=\"fa fa-wheelchair\"></i> wheelchair</a></div>\r\n\r\n    </div>\r\n  </tab>\r\n</tabset>\r\n"

/***/ },

/***/ "./src/app/ui-elements/list-groups/list-groups.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var ListGroups = (function () {
    function ListGroups() {
        this.sortOptions = {
            placeholder: 'list-group-item list-group-item-placeholder',
            forcePlaceholderSize: true
        };
        this.nest1Options = { group: 1 };
        this.nest2Options = { group: 1 };
    }
    ListGroups.prototype.ngOnInit = function () {
        jQuery('.list-group-sortable').sortable(this.sortOptions);
        jQuery('#nestable1').nestable(this.nest1Options);
        jQuery('#nestable2').nestable(this.nest2Options);
    };
    ListGroups = __decorate([
        core_1.Component({
            selector: '[ui-list-groups]',
            template: __webpack_require__("./src/app/ui-elements/list-groups/list-groups.template.html"),
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [__webpack_require__("./src/app/ui-elements/list-groups/list-groups.style.scss")]
        }), 
        __metadata('design:paramtypes', [])
    ], ListGroups);
    return ListGroups;
}());
exports.ListGroups = ListGroups;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/ui-elements/list-groups/list-groups.style.scss":
/***/ function(module, exports) {

module.exports = "@charset \"UTF-8\";\nbody {\n  overflow-x: visible; }\n\n/**\r\n * Nestable\r\n */\n.dd {\n  position: relative;\n  display: block;\n  margin: 0;\n  padding: 0;\n  max-width: 600px;\n  list-style: none;\n  font-size: 13px;\n  line-height: 20px; }\n\n.dd-list {\n  display: block;\n  position: relative;\n  margin: 0;\n  padding: 0;\n  list-style: none; }\n\n.dd-list .dd-list {\n  padding-left: 30px; }\n\n.dd-collapsed .dd-list {\n  display: none; }\n\n.dd-item,\n.dd-empty,\n.dd-placeholder {\n  display: block;\n  position: relative;\n  margin: 0;\n  padding: 0;\n  min-height: 20px;\n  font-size: 13px;\n  line-height: 20px; }\n\n.dd-handle {\n  display: block;\n  height: 30px;\n  margin: 5px 0;\n  padding: 5px 10px;\n  color: #555555;\n  text-decoration: none;\n  background: #fff;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-sizing: border-box; }\n\n.dd-item > button {\n  display: block;\n  position: relative;\n  cursor: pointer;\n  float: left;\n  width: 25px;\n  height: 20px;\n  margin: 5px 0;\n  padding: 0;\n  text-indent: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  border: 0;\n  background: transparent;\n  font-size: 12px;\n  line-height: 1;\n  text-align: center;\n  font-weight: bold;\n  color: #555555; }\n  .dd-item > button:focus, .dd-item > button:active {\n    outline: 0; }\n\n.dd-item > button:before {\n  content: '+';\n  display: block;\n  position: absolute;\n  width: 100%;\n  text-align: center;\n  text-indent: 0; }\n\n.dd-item > button[data-action=\"collapse\"]:before {\n  content: '-'; }\n\n.dd-placeholder,\n.dd-empty {\n  margin: 5px 0;\n  padding: 0;\n  min-height: 30px;\n  background: #ddd;\n  border: 1px dashed #999999;\n  box-sizing: border-box;\n  border-radius: 0.25rem; }\n\n.dd-empty {\n  border: 1px dashed #999999;\n  min-height: 100px;\n  background-size: 60px 60px;\n  background-position: 0 0, 30px 30px;\n  background-image: -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);\n  background-image: linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF), linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF); }\n\n.dd-dragel {\n  position: absolute;\n  pointer-events: none;\n  z-index: 9999; }\n\n.dd-dragel > .dd-item .dd-handle {\n  margin-top: 0; }\n\n.dd-dragel .dd-handle {\n  -webkit-box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);\n  box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1); }\n\n/**\r\n * Nestable Extras\r\n */\n.nestable-lists {\n  display: block;\n  clear: both;\n  padding: 30px 0;\n  width: 100%;\n  border: 0;\n  border-top: 2px solid #ddd;\n  border-bottom: 2px solid #ddd; }\n\n@media only screen and (min-width: 700px) {\n  .dd + .dd {\n    margin-left: 2%; } }\n\n.dd-hover > .dd-handle {\n  background: #2ea8e5 !important; }\n\n/**\r\n * Nestable Draggable Handles\r\n */\n.dd3-content {\n  display: block;\n  height: 30px;\n  margin: 5px 0;\n  padding: 5px 10px 5px 40px;\n  color: #333;\n  text-decoration: none;\n  font-weight: bold;\n  border: 1px solid #ccc;\n  background: #fafafa;\n  background: linear-gradient(top, #fafafa 0%, #eee 100%);\n  border-radius: 3px;\n  box-sizing: border-box; }\n\n.dd3-content:hover {\n  color: #2ea8e5;\n  background: #fff; }\n\n.dd-dragel > .dd3-item > .dd3-content {\n  margin: 0; }\n\n.dd3-item > button {\n  margin-left: 30px; }\n\n.dd3-handle {\n  position: absolute;\n  margin: 0;\n  left: 0;\n  top: 0;\n  cursor: pointer;\n  width: 30px;\n  text-indent: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  border: 1px solid #aaa;\n  background: #ddd;\n  background: -webkit-linear-gradient(top, #ddd 0%, #bbb 100%);\n  background: -moz-linear-gradient(top, #ddd 0%, #bbb 100%);\n  background: linear-gradient(top, #ddd 0%, #bbb 100%);\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0; }\n\n.dd3-handle:before {\n  content: '≡';\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 3px;\n  width: 100%;\n  text-align: center;\n  text-indent: 0;\n  color: #fff;\n  font-size: 20px;\n  font-weight: normal; }\n\n.dd3-handle:hover {\n  background: #ddd; }\n\n/***********************************/\n/**      LIST GROUP SORTABLE      **/\n/***********************************/\n.list-group-sortable > .list-group-item {\n  margin-bottom: 0;\n  border-radius: 0.25rem; }\n  .list-group-sortable > .list-group-item + .list-group-item {\n    margin-top: 0.5rem; }\n\n.list-group-sortable > .list-group-item-placeholder {\n  border: 1px dashed #999999;\n  background-color: #ddd; }\n\n.list-group-sortable:last-of-type > .list-group-item:last-child {\n  border-bottom: 1px solid #ddd; }\n"

/***/ },

/***/ "./src/app/ui-elements/list-groups/list-groups.template.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"breadcrumb-item active\">UI List Groups</li>\r\n</ol>\r\n<h1 class=\"page-title\">Lists - <span class=\"fw-semi-bold\">Sortable Groups</span></h1>\r\n<section class=\"widget\" widget>\r\n  <header>\r\n    <h4>\r\n      Grouped <span class=\"fw-semi-bold\">Lists</span>\r\n    </h4>\r\n    <div class=\"widget-controls\">\r\n      <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\r\n      <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\r\n      <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n    </div>\r\n  </header>\r\n  <div class=\"widget-body\">\r\n    <h3>Closest <span class=\"fw-semi-bold\">Stars</span></h3>\r\n    <p>Try to play around with this list. Are you ready to pass an exam on astronomy? </p>\r\n    <ul class=\"list-group list-group-sortable mt-lg\">\r\n      <li class=\"list-group-item\">\r\n        <i class=\"fa fa-sort\"></i>\r\n        <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</a>\r\n        &nbsp;&nbsp;&nbsp; 03 &nbsp;&nbsp;&nbsp;\r\n        Barnard's Star\r\n      </li>\r\n      <li class=\"list-group-item\">\r\n        <i class=\"fa fa-sort\"></i>\r\n        <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</a>\r\n        &nbsp;&nbsp;&nbsp; 01 &nbsp;&nbsp;&nbsp;\r\n        The Sun\r\n      </li>\r\n      <li class=\"list-group-item\">\r\n        <i class=\"fa fa-sort\"></i>\r\n        <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</a>\r\n        &nbsp;&nbsp;&nbsp; 04 &nbsp;&nbsp;&nbsp;\r\n        Wolf 359\r\n      </li>\r\n      <li class=\"list-group-item\">\r\n        <i class=\"fa fa-sort\"></i>\r\n        <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</a>\r\n        &nbsp;&nbsp;&nbsp; 02 &nbsp;&nbsp;&nbsp;\r\n        Proxima Centauri\r\n      </li>\r\n      <li class=\"list-group-item\">\r\n        <i class=\"fa fa-sort\"></i>\r\n        <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</a>\r\n        &nbsp;&nbsp;&nbsp; 05 &nbsp;&nbsp;&nbsp;\r\n        Lalande 21185\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</section>\r\n<section class=\"widget mt-lg\" widget>\r\n  <header>\r\n    <h4>\r\n      List <span class=\"fw-semi-bold\">Groups</span>\r\n    </h4>\r\n    <div class=\"widget-controls\">\r\n      <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\r\n      <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\r\n      <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n    </div>\r\n  </header>\r\n  <div class=\"widget-body\">\r\n    <h3>Nestable <span class=\"fw-semi-bold\">List</span></h3>\r\n    <p class=\"fs-mini\">There is a scientific theory that you can arrange this list in such way that there will\r\n      be no more saddness\r\n      in the whole world. Can you? Touch devices supported</p>\r\n    <div class=\"row\">\r\n      <div class=\"col-lg-6 mt-lg col-xs-12\">\r\n        <div class=\"dd\" id=\"nestable1\">\r\n          <ol class=\"dd-list\">\r\n            <li class=\"dd-item\" data-id=\"1\">\r\n              <div class=\"dd-handle\">Item 1</div>\r\n            </li>\r\n            <li class=\"dd-item\" data-id=\"2\">\r\n              <div class=\"dd-handle\">Item 2</div>\r\n              <ol class=\"dd-list\">\r\n                <li class=\"dd-item\" data-id=\"3\"><div class=\"dd-handle\">Item 3</div></li>\r\n                <li class=\"dd-item\" data-id=\"4\"><div class=\"dd-handle\">Item 4</div></li>\r\n                <li class=\"dd-item\" data-id=\"5\">\r\n                  <div class=\"dd-handle\">Item 5</div>\r\n                  <ol class=\"dd-list\">\r\n                    <li class=\"dd-item\" data-id=\"6\"><div class=\"dd-handle\">Item 6</div></li>\r\n                    <li class=\"dd-item\" data-id=\"7\"><div class=\"dd-handle\">Item 7</div></li>\r\n                    <li class=\"dd-item\" data-id=\"8\"><div class=\"dd-handle\">Item 8</div></li>\r\n                  </ol>\r\n                </li>\r\n                <li class=\"dd-item\" data-id=\"9\"><div class=\"dd-handle\">Item 9</div></li>\r\n              </ol>\r\n            </li>\r\n          </ol>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-lg-6 mt-lg col-xs-12\">\r\n        <div class=\"dd\" id=\"nestable2\">\r\n          <ol class=\"dd-list\">\r\n            <li class=\"dd-item\" data-id=\"13\">\r\n              <div class=\"dd-handle\">Item 13</div>\r\n            </li>\r\n            <li class=\"dd-item\" data-id=\"14\">\r\n              <div class=\"dd-handle\">Item 14</div>\r\n            </li>\r\n            <li class=\"dd-item\" data-id=\"15\">\r\n              <div class=\"dd-handle\">Item 15</div>\r\n              <ol class=\"dd-list\">\r\n                <li class=\"dd-item\" data-id=\"16\"><div class=\"dd-handle\">Item 16</div></li>\r\n                <li class=\"dd-item\" data-id=\"17\"><div class=\"dd-handle\">Item 17</div></li>\r\n                <li class=\"dd-item\" data-id=\"18\"><div class=\"dd-handle\">Item 18</div></li>\r\n              </ol>\r\n            </li>\r\n          </ol>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n"

/***/ },

/***/ "./src/app/ui-elements/notifications/messenger/messenger.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var MessengerDemo = (function () {
    function MessengerDemo() {
    }
    MessengerDemo.prototype.initializationCode = function () {
        /* tslint:disable */
        (function () {
            var $, flatMessage, spinnerTemplate, LocationSelector, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) { for (var key in parent) {
                if (__hasProp.call(parent, key)) {
                    child[key] = parent[key];
                }
            } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
            LocationSelector = function ($el) {
                this.$el = $el;
                this.$el.on('click', '.bit', this.handleClick.bind(this));
            };
            LocationSelector.prototype.className = 'location-selector';
            LocationSelector.prototype.handleClick = function (e) {
                var $bit;
                $bit = jQuery(e.target);
                return this.$el.trigger('update', [$bit.attr('data-position').split(' ')]);
            };
            jQuery.fn.locationSelector = function () {
                var loc;
                loc = new LocationSelector(this);
                jQuery(this).addClass(loc.className);
                return jQuery(this);
            };
            spinnerTemplate = '<div class="messenger-spinner">\n    <span class="messenger-spinner-side messenger-spinner-side-left">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n    <span class="messenger-spinner-side messenger-spinner-side-right">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n</div>';
            /* tslint:enable */
            flatMessage = (function (_super) {
                __extends(flatMessage, _super);
                function flatMessage() {
                    /* tslint:disable */
                    return flatMessage['__super__'].constructor.apply(this, arguments);
                    /* tslint:enable */
                }
                flatMessage.prototype.template = function (opts) {
                    var $message;
                    /* tslint:disable */
                    $message = flatMessage['__super__'].template.apply(this, arguments);
                    /* tslint:enable */
                    $message.append(jQuery(spinnerTemplate));
                    return $message;
                };
                return flatMessage;
                /* tslint:disable */
            })(window['Messenger'].Message);
            window['Messenger'].themes.air = {
                Message: flatMessage
            };
            /* tslint:enable */
        }).call(window);
    };
    MessengerDemo.prototype.render = function () {
        this.initializationCode();
        var theme = 'air';
        jQuery.globalMessenger({ theme: theme });
        Messenger.options = { theme: theme };
        Messenger().post('Thanks for checking out Messenger!');
        var loc = ['bottom', 'right'];
        var $lsel = jQuery('.location-selector');
        var update = function () {
            var classes = 'messenger-fixed';
            for (var i = 0; i < loc.length; i++) {
                classes += ' messenger-on-' + loc[i];
            }
            jQuery.globalMessenger({ extraClasses: classes, theme: theme });
            Messenger.options = { extraClasses: classes, theme: theme };
        };
        update();
        $lsel.locationSelector()
            .on('update', function (e, pos) {
            loc = pos;
            update();
        });
        jQuery('#show-error-message').on('click', function () {
            var i;
            i = 0;
            Messenger().run({
                errorMessage: 'Error destroying alien planet',
                successMessage: 'Alien planet destroyed!',
                action: function (opts) {
                    if (++i < 3) {
                        return opts.error({
                            status: 500,
                            readyState: 0,
                            responseText: 0
                        });
                    }
                    else {
                        return opts.success();
                    }
                }
            });
            return false;
        });
        jQuery('#show-info-message').on('click', function () {
            var msg = Messenger().post({
                message: 'Launching thermonuclear war...',
                actions: {
                    cancel: {
                        label: 'cancel launch',
                        action: function () {
                            return msg.update({
                                message: 'Thermonuclear war averted',
                                type: 'success',
                                actions: false
                            });
                        }
                    }
                }
            });
            return false;
        });
        jQuery('#show-success-message').on('click', function () {
            Messenger().post({
                message: 'Showing success message was successful!',
                type: 'success',
                showCloseButton: true
            });
            return false;
        });
    };
    MessengerDemo.prototype.ngOnInit = function () {
        this.render();
    };
    MessengerDemo = __decorate([
        core_1.Directive({
            selector: '[messenger-demo]'
        }), 
        __metadata('design:paramtypes', [])
    ], MessengerDemo);
    return MessengerDemo;
}());
exports.MessengerDemo = MessengerDemo;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/ui-elements/notifications/notifications.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Notifications = (function () {
    function Notifications() {
    }
    Notifications = __decorate([
        core_1.Component({
            selector: '[ui-components]',
            template: __webpack_require__("./src/app/ui-elements/notifications/notifications.template.html"),
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [__webpack_require__("./src/app/ui-elements/notifications/notifications.style.scss")]
        }), 
        __metadata('design:paramtypes', [])
    ], Notifications);
    return Notifications;
}());
exports.Notifications = Notifications;


/***/ },

/***/ "./src/app/ui-elements/notifications/notifications.style.scss":
/***/ function(module, exports) {

module.exports = "/* line 4, ../../src/sass/messenger.sass */\nul.messenger {\n  margin: 0;\n  padding: 0; }\n\n/* line 8, ../../src/sass/messenger.sass */\nul.messenger > li {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n/* line 14, ../../src/sass/messenger.sass */\nul.messenger.messenger-empty {\n  display: none; }\n\n/* line 17, ../../src/sass/messenger.sass */\nul.messenger .messenger-message {\n  overflow: hidden;\n  *zoom: 1; }\n\n/* line 20, ../../src/sass/messenger.sass */\nul.messenger .messenger-message.messenger-hidden {\n  display: none; }\n\n/* line 23, ../../src/sass/messenger.sass */\nul.messenger .messenger-message .messenger-phrase, ul.messenger .messenger-message .messenger-actions a {\n  padding-right: 5px; }\n\n/* line 26, ../../src/sass/messenger.sass */\nul.messenger .messenger-message .messenger-actions {\n  float: right; }\n\n/* line 29, ../../src/sass/messenger.sass */\nul.messenger .messenger-message .messenger-actions a {\n  cursor: pointer;\n  text-decoration: underline; }\n\n/* line 33, ../../src/sass/messenger.sass */\nul.messenger .messenger-message ul, ul.messenger .messenger-message ol {\n  margin: 10px 18px 0; }\n\n/* line 36, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed {\n  position: fixed;\n  z-index: 10000; }\n\n/* line 40, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed .messenger-message {\n  min-width: 0;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n\n/* line 45, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed .message .messenger-actions {\n  float: left; }\n\n/* line 48, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed.messenger-on-top {\n  top: 20px; }\n\n/* line 51, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed.messenger-on-bottom {\n  bottom: 20px; }\n\n/* line 54, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed.messenger-on-top, ul.messenger.messenger-fixed.messenger-on-bottom {\n  left: 50%;\n  width: 800px;\n  margin-left: -400px; }\n\n@media (max-width: 960px) {\n  /* line 54, ../../src/sass/messenger.sass */\n  ul.messenger.messenger-fixed.messenger-on-top, ul.messenger.messenger-fixed.messenger-on-bottom {\n    left: 10%;\n    width: 80%;\n    margin-left: 0px; } }\n\n/* line 64, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed.messenger-on-top.messenger-on-right, ul.messenger.messenger-fixed.messenger-on-bottom.messenger-on-right {\n  right: 20px;\n  left: auto; }\n\n/* line 68, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed.messenger-on-top.messenger-on-left, ul.messenger.messenger-fixed.messenger-on-bottom.messenger-on-left {\n  left: 20px;\n  margin-left: 0px; }\n\n/* line 72, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed.messenger-on-right, ul.messenger.messenger-fixed.messenger-on-left {\n  width: 350px; }\n\n/* line 75, ../../src/sass/messenger.sass */\nul.messenger.messenger-fixed.messenger-on-right .messenger-actions, ul.messenger.messenger-fixed.messenger-on-left .messenger-actions {\n  float: left; }\n\n/* line 78, ../../src/sass/messenger.sass */\nul.messenger .messenger-spinner {\n  display: none; }\n\n/* line 81, ../../src/sass/messenger.sass */\nul.messenger .messenger-clickable {\n  cursor: pointer; }\n\n/***********************/\n/*      Messenger      */\n/***********************/\n@-webkit-keyframes ui-spinner-rotate-right {\n  /* line 64, ../../src/sass/messenger-spinner.scss */\n  0% {\n    -webkit-transform: rotate(0deg); }\n  /* line 65, ../../src/sass/messenger-spinner.scss */\n  25% {\n    -webkit-transform: rotate(180deg); }\n  /* line 66, ../../src/sass/messenger-spinner.scss */\n  50% {\n    -webkit-transform: rotate(180deg); }\n  /* line 67, ../../src/sass/messenger-spinner.scss */\n  75% {\n    -webkit-transform: rotate(360deg); }\n  /* line 68, ../../src/sass/messenger-spinner.scss */\n  100% {\n    -webkit-transform: rotate(360deg); } }\n\n@-webkit-keyframes ui-spinner-rotate-left {\n  /* line 72, ../../src/sass/messenger-spinner.scss */\n  0% {\n    -webkit-transform: rotate(0deg); }\n  /* line 73, ../../src/sass/messenger-spinner.scss */\n  25% {\n    -webkit-transform: rotate(0deg); }\n  /* line 74, ../../src/sass/messenger-spinner.scss */\n  50% {\n    -webkit-transform: rotate(180deg); }\n  /* line 75, ../../src/sass/messenger-spinner.scss */\n  75% {\n    -webkit-transform: rotate(180deg); }\n  /* line 76, ../../src/sass/messenger-spinner.scss */\n  100% {\n    -webkit-transform: rotate(360deg); } }\n\n@-moz-keyframes ui-spinner-rotate-right {\n  /* line 80, ../../src/sass/messenger-spinner.scss */\n  0% {\n    -moz-transform: rotate(0deg); }\n  /* line 81, ../../src/sass/messenger-spinner.scss */\n  25% {\n    -moz-transform: rotate(180deg); }\n  /* line 82, ../../src/sass/messenger-spinner.scss */\n  50% {\n    -moz-transform: rotate(180deg); }\n  /* line 83, ../../src/sass/messenger-spinner.scss */\n  75% {\n    -moz-transform: rotate(360deg); }\n  /* line 84, ../../src/sass/messenger-spinner.scss */\n  100% {\n    -moz-transform: rotate(360deg); } }\n\n@-moz-keyframes ui-spinner-rotate-left {\n  /* line 88, ../../src/sass/messenger-spinner.scss */\n  0% {\n    -moz-transform: rotate(0deg); }\n  /* line 89, ../../src/sass/messenger-spinner.scss */\n  25% {\n    -moz-transform: rotate(0deg); }\n  /* line 90, ../../src/sass/messenger-spinner.scss */\n  50% {\n    -moz-transform: rotate(180deg); }\n  /* line 91, ../../src/sass/messenger-spinner.scss */\n  75% {\n    -moz-transform: rotate(180deg); }\n  /* line 92, ../../src/sass/messenger-spinner.scss */\n  100% {\n    -moz-transform: rotate(360deg); } }\n\n@keyframes ui-spinner-rotate-right {\n  /* line 96, ../../src/sass/messenger-spinner.scss */\n  0% {\n    transform: rotate(0deg); }\n  /* line 97, ../../src/sass/messenger-spinner.scss */\n  25% {\n    transform: rotate(180deg); }\n  /* line 98, ../../src/sass/messenger-spinner.scss */\n  50% {\n    transform: rotate(180deg); }\n  /* line 99, ../../src/sass/messenger-spinner.scss */\n  75% {\n    transform: rotate(360deg); }\n  /* line 100, ../../src/sass/messenger-spinner.scss */\n  100% {\n    transform: rotate(360deg); } }\n\n@keyframes ui-spinner-rotate-left {\n  /* line 104, ../../src/sass/messenger-spinner.scss */\n  0% {\n    transform: rotate(0deg); }\n  /* line 105, ../../src/sass/messenger-spinner.scss */\n  25% {\n    transform: rotate(0deg); }\n  /* line 106, ../../src/sass/messenger-spinner.scss */\n  50% {\n    transform: rotate(180deg); }\n  /* line 107, ../../src/sass/messenger-spinner.scss */\n  75% {\n    transform: rotate(180deg); }\n  /* line 108, ../../src/sass/messenger-spinner.scss */\n  100% {\n    transform: rotate(360deg); } }\n\n/* line 116, ../../src/sass/messenger-spinner.scss */\n.messenger-spinner {\n  position: relative;\n  border-radius: 100%; }\n\n/* line 120, ../../src/sass/messenger-spinner.scss */\nul.messenger.messenger-spinner-active .messenger-spinner .messenger-spinner {\n  display: block; }\n\n/* line 124, ../../src/sass/messenger-spinner.scss */\n.messenger-spinner .messenger-spinner-side {\n  width: 50%;\n  height: 100%;\n  overflow: hidden;\n  position: absolute; }\n\n/* line 130, ../../src/sass/messenger-spinner.scss */\n.messenger-spinner .messenger-spinner-side .messenger-spinner-fill {\n  border-radius: 999px;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  -webkit-animation-iteration-count: infinite;\n  -moz-animation-iteration-count: infinite;\n  -ms-animation-iteration-count: infinite;\n  -o-animation-iteration-count: infinite;\n  animation-iteration-count: infinite;\n  -webkit-animation-timing-function: linear;\n  -moz-animation-timing-function: linear;\n  -ms-animation-timing-function: linear;\n  -o-animation-timing-function: linear;\n  animation-timing-function: linear; }\n\n/* line 140, ../../src/sass/messenger-spinner.scss */\n.messenger-spinner .messenger-spinner-side-left {\n  left: 0; }\n\n/* line 143, ../../src/sass/messenger-spinner.scss */\n.messenger-spinner .messenger-spinner-side-left .messenger-spinner-fill {\n  left: 100%;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n  -webkit-animation-name: ui-spinner-rotate-left;\n  -moz-animation-name: ui-spinner-rotate-left;\n  -ms-animation-name: ui-spinner-rotate-left;\n  -o-animation-name: ui-spinner-rotate-left;\n  animation-name: ui-spinner-rotate-left;\n  -webkit-transform-origin: 0 50%;\n  -moz-transform-origin: 0 50%;\n  -ms-transform-origin: 0 50%;\n  -o-transform-origin: 0 50%;\n  transform-origin: 0 50%; }\n\n/* line 152, ../../src/sass/messenger-spinner.scss */\n.messenger-spinner .messenger-spinner-side-right {\n  left: 50%; }\n\n/* line 155, ../../src/sass/messenger-spinner.scss */\n.messenger-spinner .messenger-spinner-side-right .messenger-spinner-fill {\n  left: -100%;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  -webkit-animation-name: ui-spinner-rotate-right;\n  -moz-animation-name: ui-spinner-rotate-right;\n  -ms-animation-name: ui-spinner-rotate-right;\n  -o-animation-name: ui-spinner-rotate-right;\n  animation-name: ui-spinner-rotate-right;\n  -webkit-transform-origin: 100% 50%;\n  -moz-transform-origin: 100% 50%;\n  -ms-transform-origin: 100% 50%;\n  -o-transform-origin: 100% 50%;\n  transform-origin: 100% 50%; }\n\n/* line 16, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air {\n  user-select: none;\n  font-family: \"Raleway\", sans-serif; }\n\n/* line 20, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message {\n  -webkit-transition: background-color 0.4s;\n  -moz-transition: background-color 0.4s;\n  -o-transition: background-color 0.4s;\n  transition: background-color 0.4s;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  -ms-border-radius: 5px;\n  -o-border-radius: 5px;\n  border-radius: 5px;\n  -webkit-box-shadow: inset 0 0 0 1px white, inset 0 2px white, 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.2);\n  -moz-box-shadow: inset 0 0 0 1px white, inset 0 2px white, 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.2);\n  box-shadow: inset 0 0 0 1px white, inset 0 2px white, 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.2);\n  border: 0px;\n  background-color: rgba(255, 255, 255, 0.8);\n  position: relative;\n  margin-bottom: 1em;\n  font-size: 13px;\n  color: #666666;\n  font-weight: 500;\n  padding: 10px 30px 11px 46px; }\n\n/* line 33, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message:hover {\n  background-color: white; }\n\n/* line 36, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-close {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  color: #888888;\n  opacity: 1;\n  font-weight: bold;\n  display: block;\n  font-size: 20px;\n  line-height: 20px;\n  padding: 8px 10px 7px 7px;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none; }\n\n/* line 52, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-close:hover {\n  color: #444444; }\n\n/* line 55, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-close:active {\n  color: #222222; }\n\n/* line 58, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-actions {\n  float: none;\n  margin-top: 10px; }\n\n/* line 62, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-actions a {\n  -webkit-box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 1px rgba(255, 255, 255, 0.05);\n  -moz-box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 1px rgba(255, 255, 255, 0.05);\n  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 1px rgba(255, 255, 255, 0.05);\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  -ms-border-radius: 4px;\n  -o-border-radius: 4px;\n  border-radius: 4px;\n  text-decoration: none;\n  display: inline-block;\n  padding: 10px;\n  color: #888888;\n  margin-right: 10px;\n  padding: 3px 10px 5px;\n  text-transform: capitalize; }\n\n/* line 73, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-actions a:hover {\n  -webkit-box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 1px rgba(255, 255, 255, 0.15);\n  -moz-box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 1px rgba(255, 255, 255, 0.15);\n  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 1px rgba(255, 255, 255, 0.15);\n  color: #444444; }\n\n/* line 77, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-actions a:active {\n  -webkit-box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.18), inset 0px 1px rgba(0, 0, 0, 0.05);\n  -moz-box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.18), inset 0px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.18), inset 0px 1px rgba(0, 0, 0, 0.05);\n  background: rgba(0, 0, 0, 0.04);\n  color: #444444; }\n\n/* line 82, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-actions .messenger-phrase {\n  display: none; }\n\n/* line 85, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message .messenger-message-inner:before {\n  -webkit-box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);\n  -moz-box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);\n  box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);\n  -webkit-border-radius: 50%;\n  -moz-border-radius: 50%;\n  -ms-border-radius: 50%;\n  -o-border-radius: 50%;\n  border-radius: 50%;\n  position: absolute;\n  left: 17px;\n  display: block;\n  content: \" \";\n  top: 50%;\n  margin-top: -8px;\n  height: 13px;\n  width: 13px;\n  z-index: 20; }\n\n/* line 99, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message.alert-success .messenger-message-inner:before {\n  background-color: #5fca4a; }\n\n/* line 32, ../../src/sass/messenger-spinner.scss */\nul.messenger-theme-air .messenger-message.alert-error.messenger-retry-soon .messenger-spinner {\n  width: 24px;\n  height: 24px;\n  background: transparent; }\n\n/* line 37, ../../src/sass/messenger-spinner.scss */\nul.messenger-theme-air .messenger-message.alert-error.messenger-retry-soon .messenger-spinner .messenger-spinner-side .messenger-spinner-fill {\n  background: #dd6a45;\n  -webkit-animation-duration: 20s;\n  -moz-animation-duration: 20s;\n  -ms-animation-duration: 20s;\n  -o-animation-duration: 20s;\n  animation-duration: 20s;\n  opacity: 1; }\n\n/* line 45, ../../src/sass/messenger-spinner.scss */\nul.messenger-theme-air .messenger-message.alert-error.messenger-retry-soon .messenger-spinner:after {\n  content: \"\";\n  background: white;\n  position: absolute;\n  width: 19px;\n  height: 19px;\n  border-radius: 50%;\n  top: 2px;\n  left: 2px;\n  display: block; }\n\n/* line 32, ../../src/sass/messenger-spinner.scss */\nul.messenger-theme-air .messenger-message.alert-error.messenger-retry-later .messenger-spinner {\n  width: 24px;\n  height: 24px;\n  background: transparent; }\n\n/* line 37, ../../src/sass/messenger-spinner.scss */\nul.messenger-theme-air .messenger-message.alert-error.messenger-retry-later .messenger-spinner .messenger-spinner-side .messenger-spinner-fill {\n  background: #dd6a45;\n  -webkit-animation-duration: 600s;\n  -moz-animation-duration: 600s;\n  -ms-animation-duration: 600s;\n  -o-animation-duration: 600s;\n  animation-duration: 600s;\n  opacity: 1; }\n\n/* line 45, ../../src/sass/messenger-spinner.scss */\nul.messenger-theme-air .messenger-message.alert-error.messenger-retry-later .messenger-spinner:after {\n  content: \"\";\n  background: white;\n  position: absolute;\n  width: 19px;\n  height: 19px;\n  border-radius: 50%;\n  top: 2px;\n  left: 2px;\n  display: block; }\n\n/* line 109, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message.alert-error .messenger-message-inner:before {\n  background-color: #dd6a45; }\n\n/* line 113, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-message.alert-info .messenger-message-inner:before {\n  background-color: #61c4b8; }\n\n/* line 116, ../../src/sass/messenger-theme-air.sass */\nul.messenger-theme-air .messenger-spinner {\n  display: block;\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  margin-top: -13px;\n  z-index: 999;\n  height: 24px;\n  width: 24px;\n  z-index: 10; }\n\nul.messenger-theme-air .messenger-message {\n  background-color: #fff; }\n\n.location-selector {\n  width: 100%;\n  height: 220px;\n  border: 1px dashed #bbb;\n  background-color: #fff;\n  position: relative; }\n\n.location-selector .bit {\n  background-color: #eeeeee;\n  transition: background-color 0.15s ease-in-out;\n  cursor: pointer;\n  position: absolute; }\n\n.location-selector .bit:hover {\n  background-color: #ddd; }\n\n.location-selector .bit.top, .location-selector .bit.bottom {\n  height: 25%;\n  width: 40%;\n  margin: 0 30%; }\n\n.location-selector .bit.top {\n  top: 0; }\n\n.location-selector .bit.bottom {\n  bottom: 0; }\n\n.location-selector .bit.right, .location-selector .bit.left {\n  height: 20%;\n  width: 20%;\n  margin-left: 0;\n  margin-right: 0; }\n\n.location-selector .bit.right {\n  right: 0; }\n\n.location-selector .bit.left {\n  left: 0; }\n"

/***/ },

/***/ "./src/app/ui-elements/notifications/notifications.template.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"breadcrumb-item active\">UI Notifications</li>\r\n</ol>\r\n<h1 class=\"page-title\">Messages - <span class=\"fw-semi-bold\">Notifications</span></h1>\r\n<section class=\"widget\" messenger-demo widget>\r\n  <header>\r\n    <h6>\r\n      Messenger\r\n    </h6>\r\n    <div class=\"widget-controls\">\r\n      <a title=\"Properties\" href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\r\n      <a data-widgster=\"expand\" title=\"Expand\" href=\"#\"><i class=\"glyphicon glyphicon-plus\"></i></a>\r\n      <a data-widgster=\"collapse\" title=\"Collapse\" href=\"#\"><i class=\"glyphicon glyphicon-minus\"></i></a>\r\n      <a data-widgster=\"close\" title=\"Close\" href=\"#\"><i class=\"glyphicon glyphicon-remove\"></i></a>\r\n    </div>\r\n  </header>\r\n  <div class=\"widget-body\">\r\n    <div class=\"row\">\r\n      <div class=\"col-lg-4 col-xs-12\">\r\n        <h5 class=\"m-t-1\">Layout options</h5>\r\n        <p>There are few position options available for notifications. You can click any of them\r\n          to change notifications position:</p>\r\n        <div class=\"location-selector\">\r\n          <div class=\"bit top left\" data-position=\"top left\"></div>\r\n          <div class=\"bit top right\" data-position=\"top right\"></div>\r\n          <div class=\"bit top\" data-position=\"top\"></div>\r\n          <div class=\"bit bottom left\" data-position=\"bottom left\"></div>\r\n          <div class=\"bit bottom right\" data-position=\"bottom right\"></div>\r\n          <div class=\"bit bottom\" data-position=\"bottom\"></div>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-lg-4 col-xs-12\">\r\n        <h5 class=\"m-t-1\">Notification Types</h5>\r\n        <p>Different types of notifications for lost of use cases. Custom classes are also supported.</p>\r\n        <p><a class=\"btn btn-info\" id=\"show-info-message\" href=\"#\">Info Message</a></p>\r\n        <p><a class=\"btn btn-danger\" id=\"show-error-message\" href=\"#\">Error + Retry Message</a></p>\r\n        <p><a class=\"btn btn-success\" id=\"show-success-message\" href=\"#\">Success Message</a></p>\r\n      </div>\r\n      <div class=\"col-lg-4 col-xs-12\">\r\n        <h5 class=\"m-t-1\">Dead Simple Usage</h5>\r\n        <p>Just few lines of code to instantiate a notifications object. Does not require passing any options:</p>\r\n        <pre><code>Messenger().post(\"Thanks for checking out Messenger!\");</code></pre>\r\n        <p>More complex example:</p>\r\n        <pre>\r\n          <code>\r\nMessenger().post( {{ '{' }}\r\n  message: 'There was an explosion while processing your request.',\r\n  type: 'error',\r\n  showCloseButton: true\r\n{{ '}' }});\r\n          </code>\r\n        </pre>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n"

/***/ },

/***/ "./src/app/ui-elements/tabs-accordion/tabs-accordion.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var TabsAccordion = (function () {
    function TabsAccordion() {
    }
    TabsAccordion.prototype.ngOnInit = function () {
        jQuery('.nav-tabs').on('shown.bs.tab', 'a', function (e) {
            if (e.relatedTarget) {
                jQuery(e.relatedTarget).removeClass('active');
            }
        });
    };
    TabsAccordion = __decorate([
        core_1.Component({
            selector: '[ui-tabs-accordion]',
            template: __webpack_require__("./src/app/ui-elements/tabs-accordion/tabs-accordion.template.html")
        }), 
        __metadata('design:paramtypes', [])
    ], TabsAccordion);
    return TabsAccordion;
}());
exports.TabsAccordion = TabsAccordion;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/ui-elements/tabs-accordion/tabs-accordion.template.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"breadcrumb-item active\">UI Tabs & Accordion</li>\r\n</ol>\r\n<h1 class=\"page-title\">Tabs & Accordion - <span class=\"fw-semi-bold\">Components</span></h1>\r\n<div class=\"row mb-lg\">\r\n  <div class=\"col-lg-6 col-xs-12\">\r\n    <div class=\"clearfix\">\r\n      <ul class=\"nav nav-tabs pull-xs-left\" id=\"myTab\" role=\"tablist\">\r\n        <li class=\"nav-item\">\r\n          <a class=\"nav-link active\" id=\"home-tab\" data-toggle=\"tab\" href=\"#basic\" role=\"tab\" aria-controls=\"basic\" aria-expanded=\"true\">Basic</a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n          <a class=\"nav-link\" id=\"profile-tab\" data-toggle=\"tab\" href=\"#assumtion\" role=\"tab\" aria-controls=\"assumtion\" aria-expanded=\"false\">Assumtion</a>\r\n        </li>\r\n        <li class=\"nav-item dropdown\">\r\n          <a class=\"nav-link dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n            Dropdown <b class=\"caret\"></b>\r\n          </a>\r\n          <div class=\"dropdown-menu\">\r\n            <a class=\"dropdown-item\" id=\"dropdown1-tab\" href=\"#dropdown1\" role=\"tab\" data-toggle=\"tab\" aria-controls=\"dropdown1\" aria-expanded=\"false\">@fat</a>\r\n            <a class=\"dropdown-item\" id=\"dropdown2-tab\" href=\"#dropdown2\" role=\"tab\" data-toggle=\"tab\" aria-controls=\"dropdown2\" aria-expanded=\"false\">@mdo</a>\r\n          </div>\r\n        </li>\r\n      </ul>\r\n    </div>\r\n    <div class=\"tab-content mb-lg\" id=\"myTabContent\">\r\n      <div role=\"tabpanel\" class=\"tab-pane active in clearfix\" id=\"basic\" aria-labelledby=\"basic-tab\" aria-expanded=\"true\">\r\n        <h3>Tabs-enabled widget</h3>\r\n        <p>You will never know exactly how something will go until you try it.</p>\r\n        <p>You can think three hundred times and still have no precise result. If you see\r\n          attractive girl all you need to do is to go and ask her to give you her phone. You don’t\r\n          need to think about HOW it can turn out. All you have to do is to GO and DO IT. It\r\n          should be super-fast and easy. No hesitation. You ask me: “What to do with these\r\n          fearful thoughts preventing me from doing that?” The answer is to ignore them, because\r\n          they can’t disappear immediately.</p>\r\n        <p>The same thing is for startups and ideas. If you have an idea right away after it appears in your mind you should go and make a first step to implement it. </p>\r\n        <div class=\"pull-xs-right\">\r\n          <button class=\"btn btn-inverse\">Cancel</button>\r\n          <button class=\"btn btn-primary\">Some button</button>\r\n        </div>\r\n      </div>\r\n      <div class=\"tab-pane\" id=\"assumtion\" role=\"tabpanel\" aria-labelledby=\"assumtion-tab\" aria-expanded=\"false\">\r\n        <p>Why don't use Lore Ipsum? I think if some one says don't use lore ipsum it's very controversial\r\n          point. I think the opposite actually. Everyone knows what is lore ipsum - it is easy to understand if text is lore ipsum.</p>\r\n        <div class=\"clearfix\">\r\n          <div class=\"btn-toolbar\">\r\n            <a class=\"btn btn-default\" href=\"#\">&nbsp;&nbsp;Check&nbsp;&nbsp;</a>\r\n            <a class=\"btn btn-primary\" href=\"#\">&nbsp;&nbsp;Dance?&nbsp;&nbsp;</a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"tab-pane\" id=\"dropdown1\" role=\"tabpanel\" aria-labelledby=\"dropdown1-tab\" aria-expanded=\"false\">\r\n        <p> If you will think too much it will sink in the swamp of never implemented plans and\r\n          ideas or will just go away or will be implemented by someone else.</p>\r\n        <p><strong>5 months of doing everything to achieve nothing.</strong></p>\r\n        <p>You'll automatically skip - because you know - it's just non-informative stub. But what if there some text like this one?</p>\r\n      </div>\r\n      <div class=\"tab-pane\" id=\"dropdown2\" role=\"tabpanel\" aria-labelledby=\"dropdown2-tab\" aria-expanded=\"false\">\r\n        <blockquote class=\"blockquote-sm blockquote mb-xs\">\r\n          Plan it? Make it!\r\n        </blockquote>\r\n        <p>The same thing is for startups and ideas. If you have an idea right away after it appears\r\n          in your mind you should go and make a first step to implement it.</p>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"col-lg-6 col-xs-12\">\r\n    <div class=\"row\">\r\n      <div class=\"col-xs-12\">\r\n       <div class=\"tabbable tabs-left mb-lg\">\r\n      <ul id=\"tabs2\" class=\"nav nav-tabs\">\r\n        <li class=\"nav-item\"><a class=\"nav-link\" href=\"#tab12\" data-toggle=\"tab\">Basic</a></li>\r\n        <li class=\"nav-item\"><a class=\"nav-link active\" href=\"#tab22\" data-toggle=\"tab\">Assumtion</a></li>\r\n        <li class=\"nav-item\"><a class=\"nav-link\" href=\"#tab32\"  data-toggle=\"tab\">Works</a></li>\r\n      </ul>\r\n      <div id=\"tabs2c\" class=\"tab-content\">\r\n        <div class=\"tab-pane\" id=\"tab12\">\r\n          <p>\r\n            I had an idea named Great Work. It was a service aimed to help people find their passion.\r\n            Yes I know it sound crazy and super naïve but I worked on that. I started to work on\r\n            planning, graphics, presentations, pictures, descriptions, articles, investments and so on.\r\n            I worked on everything but not the project itself.\r\n          </p>\r\n        </div>\r\n        <div class=\"tab-pane active\" id=\"tab22\">\r\n          <p>Why don't use Lore Ipsum? I think if some one says don't use lore ipsum it's very controversial\r\n            point. I think the opposite actually. Everyone knows what is lore ipsum - it is easy to understand if text is lore ipsum.</p>\r\n          <div class=\"clearfix\">\r\n            <div class=\"btn-toolbar\">\r\n              <a class=\"btn btn-danger\" href=\"#\">&nbsp;&nbsp;Check&nbsp;&nbsp;</a>\r\n              <a class=\"btn btn-secondary\" href=\"#\">&nbsp;&nbsp;Dance?&nbsp;&nbsp;</a>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"tab-pane\" id=\"tab32\">\r\n          <p> If you will think too much it will sink in the swamp of never implemented plans and\r\n            ideas or will just go away or will be implemented by someone else.</p>\r\n          <p><strong>5 months of doing everything to achieve nothing.</strong></p>\r\n          <p>You'll automatically skip - because you know - it's just non-informative stub. But what if there some text like this one?</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-xs-12\">\r\n        <div class=\"tabbable tabs-right\">\r\n      <ul id=\"tabs3\" class=\"nav nav-tabs\">\r\n        <li class=\"nav-item\"><a class=\"nav-link active\" href=\"#tab13\" data-toggle=\"tab\">Basic</a></li>\r\n        <li class=\"nav-item\"><a class=\"nav-link\" href=\"#tab23\" data-toggle=\"tab\">Assumtion</a></li>\r\n        <li class=\"nav-item\"><a class=\"nav-link\" href=\"#tab33\"  data-toggle=\"tab\">Works</a></li>\r\n      </ul>\r\n      <div id=\"tabs3c\" class=\"tab-content\">\r\n        <div class=\"tab-pane\" id=\"tab13\">\r\n          <p>\r\n            I had an idea named Great Work. It was a service aimed to help people find their passion.\r\n            Yes I know it sound crazy and super naïve but I worked on that. I started to work on\r\n            planning, graphics, presentations, pictures, descriptions, articles, investments and so on.\r\n            I worked on everything but not the project itself.\r\n          </p>\r\n        </div>\r\n        <div class=\"tab-pane\" id=\"tab23\">\r\n          <p>Why don't use Lore Ipsum? I think if some one says don't use lore ipsum it's very controversial\r\n            point. I think the opposite actually. Everyone knows what is lore ipsum - it is easy to understand if text is lore ipsum.</p>\r\n          <div class=\"clearfix\">\r\n            <div class=\"btn-toolbar\">\r\n              <a class=\"btn btn-primary\" href=\"#\">&nbsp;&nbsp;Check&nbsp;&nbsp;</a>\r\n              <a class=\"btn btn-default\" href=\"#\">&nbsp;&nbsp;Dance?&nbsp;&nbsp;</a>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"tab-pane active\" id=\"tab33\">\r\n          <p> If you will think too much it will sink in the swamp of never implemented plans and\r\n            ideas or will just go away or will be implemented by someone else.</p>\r\n          <p><strong>5 months of doing everything to achieve nothing.</strong></p>\r\n          <p>You'll automatically skip - because you know - it's just non-informative stub. But what if there some text like this one?</p>\r\n        </div>\r\n      </div>\r\n    </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-lg-6 col-xs-12\">\r\n    <accordion [closeOthers]=\"true\" class=\"mb-lg show\" id=\"accordion\">\r\n      <accordion-group isOpen=\"true\">\r\n        <div accordion-heading>\r\n            Collapsible Group Item\r\n            <i class=\"fa fa-angle-down pull-xs-right\"></i>\r\n        </div>\r\n        <div>\r\n          Get base styles and flexible support for collapsible components like accordions and navigation.\r\n          Using the collapse plugin, we built a simple accordion by extending the panel component.\r\n        </div>\r\n      </accordion-group>\r\n      <accordion-group>\r\n        <div accordion-heading>\r\n            Random from the Web\r\n            <i class=\"fa fa-angle-down pull-xs-right\"></i>\r\n        </div>\r\n        <div>\r\n          <p><span class=\"fw-semi-bold\">Light Blue</span> - is a next generation admin template based on the latest Metro design. There are few reasons we want to tell you, why we have created it: We didn't like the darkness of most of admin templates, so we created this light one. We didn't like the high contrast of most of admin templates, so we created this unobtrusive one. We searched for a\r\n            solution of how to make widgets look like real widgets, so we decided that deep background - is what makes widgets look real.\r\n          </p>\r\n          <p class=\"no-margin text-muted\"><em>- Some One</em></p>\r\n        </div>\r\n      </accordion-group>\r\n      <accordion-group>\r\n        <div accordion-heading>\r\n            Check It\r\n            <i class=\"fa fa-angle-down pull-xs-right\"></i>\r\n        </div>\r\n        <div>\r\n          Why don't use Lore Ipsum? I think if some one says don't use lore ipsum it's very controversial point. I think the opposite actually.\r\n        </div>\r\n      </accordion-group>\r\n    </accordion>\r\n  </div>\r\n  <div class=\"col-lg-6 col-xs-12\">\r\n    <accordion [closeOthers]=\"true\" class=\"mb-lg show\" id=\"accordion2\">\r\n      <accordion-group>\r\n        <div accordion-heading>\r\n              Collapsible Group Item\r\n              <i class=\"fa fa-angle-down pull-xs-right\"></i>\r\n        </div>\r\n            Get base styles and flexible support for collapsible components like accordions and navigation.\r\n            Using the collapse plugin, we built a simple accordion by extending the panel component.\r\n      </accordion-group>\r\n      <accordion-group>\r\n        <div accordion-heading>\r\n              Normal Text Insertion\r\n              <i class=\"fa fa-angle-down pull-xs-right\"></i>\r\n        </div>\r\n            <p>Why don't use Lore Ipsum? I think if some one says don't use lore ipsum it's very\r\n              controversial point. I think the opposite actually. Everyone knows what is lore ipsum\r\n              - it is easy to understand if text is lore ipsum. You'll automatically skip -\r\n              because you know - it's just non-informative stub. But what if there some text like\r\n              this one? You start to read it! But the goal of this text is different. The goal is\r\n              the example. So a bit of Lore Ipsum is always very good practice. Keep it in mind!</p>\r\n      </accordion-group>\r\n      <accordion-group>\r\n        <div accordion-heading>\r\n              Check It\r\n              <i class=\"fa fa-angle-down pull-xs-right\"></i>\r\n        </div>\r\n            Why don't use Lore Ipsum? I think if some one says don't use lore ipsum it's very controversial point. I think the opposite actually.\r\n      </accordion-group>\r\n    </accordion>\r\n  </div>\r\n</div>\r\n"

/***/ },

/***/ "./src/app/ui-elements/ui-elements.module.ts":
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
var components_component_1 = __webpack_require__("./src/app/ui-elements/components/components.component.ts");
var widget_module_1 = __webpack_require__("./src/app/layout/widget/widget.module.ts");
var modal_component_1 = __webpack_require__("./src/app/ui-elements/components/modal-window/modal.component.ts");
var buttons_component_1 = __webpack_require__("./src/app/ui-elements/buttons/buttons.component.ts");
var notifications_component_1 = __webpack_require__("./src/app/ui-elements/notifications/notifications.component.ts");
var icons_component_1 = __webpack_require__("./src/app/ui-elements/icons/icons.component.ts");
var tabs_accordion_component_1 = __webpack_require__("./src/app/ui-elements/tabs-accordion/tabs-accordion.component.ts");
var list_groups_component_1 = __webpack_require__("./src/app/ui-elements/list-groups/list-groups.component.ts");
var messenger_directive_1 = __webpack_require__("./src/app/ui-elements/notifications/messenger/messenger.directive.ts");
exports.routes = [
    { path: '', redirectTo: 'components', pathMatch: 'full' },
    { path: 'components', component: components_component_1.Components },
    { path: 'buttons', component: buttons_component_1.Buttons },
    { path: 'notifications', component: notifications_component_1.Notifications },
    { path: 'icons', component: icons_component_1.Icons },
    { path: 'tabs-accordion', component: tabs_accordion_component_1.TabsAccordion },
    { path: 'list-groups', component: list_groups_component_1.ListGroups },
];
var UiElementsModule = (function () {
    function UiElementsModule() {
    }
    UiElementsModule.routes = exports.routes;
    UiElementsModule = __decorate([
        core_1.NgModule({
            declarations: [
                // Components / Directives/ Pipes
                components_component_1.Components,
                buttons_component_1.Buttons,
                modal_component_1.ModalComponent,
                notifications_component_1.Notifications,
                messenger_directive_1.MessengerDemo,
                icons_component_1.Icons,
                tabs_accordion_component_1.TabsAccordion,
                list_groups_component_1.ListGroups
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
                ng2_bootstrap_3.AccordionModule
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
//# sourceMappingURL=9.map