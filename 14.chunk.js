webpackJsonpac__name_([14],{

/***/ "./node_modules/bootstrap_calendar/bootstrap_calendar/js/bootstrap_calendar.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*
    bootstrap_calendar by bic.cat (http://bic.cat) & xero (http://xero.nu)
    https://github.com/xero/bootstrap_calendar
    released open source under the Apache License
*/
(function($){
    $.fn.calendar = function(options) {
        
        var args = $.extend({}, $.fn.calendar.defaults, options);
        
        this.each(function(){
            
            var calendar;
            var lblDaysMonth;
            var lblTextMonth = $('<div class="visualmonthyear"></div>');

            var calendar_id = "cal_" + Math.floor(Math.random()*99999).toString(36);

            var events = args.events;
            
            var days;
            if ( typeof args.days != "undefined" )
                days = args.days;
            else
                days = ["S", "M", "T", "W", "T", "F", "S"];

            var months;
            if ( typeof args.months != "undefined" )
                months = args.months;
            else
                months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            var show_days;
            if ( typeof args.show_days != "undefined" )
                show_days = args.show_days;
            else
                show_days = true;

            var popover_options;
            if ( args.popover_options != "undefined" )
                popover_options = args.popover_options;
            else
                popover_options = {placement: 'top'};

            var tooltip_options;
            if ( typeof args.tooltip_options != "undefined" )
                tooltip_options = args.tooltip_options;
            else
                tooltip_options = {placement: 'top'};

            var req_ajax;
            if ( typeof args.req_ajax != "undefined" )
                req_ajax = args.req_ajax;
            else
                req_ajax = false;

            var elem = $(this);
            showCalendar();
                    
            /*** functions ***/
            
            //display
            function showCalendar(){

                //days of month label
                lblDaysMonth = $('<table class="daysmonth table table">');

                list_week();
                    
                //date calculation object
                var dateObj = new Date();
                //check for date input
                var dateText = elem.val();
                if (dateText!= ""){
                    if (validateDate(dateText)){
                        var dateTextArray = dateText.split("/");
                        //two digit years
                        if(dateTextArray[2].length == 2){
                            if (dateTextArray[2].charAt(0)=="0"){
                                dateTextArray[2] = dateTextArray[2].substring(1);
                            }
                            dateTextArray[2] = parseInt(dateTextArray[2]);
                            if (dateTextArray[2] < 50)
                                dateTextArray[2] += 2000;
                        }
                        dateObj = new Date(dateTextArray[2], dateTextArray[1]-1, dateTextArray[0])
                    }
                }
                    
                //current month & year
                var month = dateObj.getMonth();
                var year = dateObj.getFullYear();
                showDaysOfMonth(month, year);
                    
                    
                //next/previous month controls
                var btnNextMonth = $('<td><i class="icon-arrow-right"></i></td>');
                btnNextMonth.click(function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    month = (month + 1) % 12;
                    if (month==0)
                        year++;
                    change_month(month, year);
                });
                var btnPrevMonth = $('<td><i class="icon-arrow-left"></i></td>');
                btnPrevMonth.click(function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    month = (month - 1);
                    if (month==-1){
                        year--;
                        month = 11;
                    }   
                    change_month(month, year);
                });
                $('.icon-arrow-left').css('cursor', 'pointer');
                $('.icon-arrow-right').css('cursor', 'pointer');

                //current year & month label
                var lblDate = $('<table class="table header"><tr></tr></table>');
                var lblDateControl = $('<td colspan=5 class="year span6"></td>');
                lblDate.append(btnPrevMonth);
                lblDate.append(lblDateControl);
                lblDate.append(btnNextMonth);
                lblDateControl.append(lblTextMonth);

                calendar = $('<div class="calendar" id="' +calendar_id +'" ></div>');
                calendar.prepend(lblDate);
                //calendar.append(lblWeek);
                //lblDaysMonth.prepend(lblWeek);
                calendar.append(lblDaysMonth);
                    
                //render calendar
                elem.append(calendar);
                
                check_events(month, year);
            }
            
            function change_month(month, year){
                lblDaysMonth.empty();
                list_week();
                showDaysOfMonth(month, year);
                check_events(month, year);
            }       

            //week
            function list_week(){
                if ( show_days != false ){
                    var lblWeek = $('<tr class="week_days" >');
                    var insertCode = '';
                    $(days).each(function(key, value){
                        insertCode += '<td';
                        if (key==0){
                            insertCode += ' class="first"';
                        }
                        if (key==6){
                            insertCode += ' class="last"';
                        }
                        insertCode += ">" + value + '</td>';
                    });
                    insertCode += '</tr>';
                    lblWeek.append(insertCode);

                    lblDaysMonth.append(lblWeek);
                }
            }
                    
            function showDaysOfMonth(month, year){
                //console.log("show (month, year): ", month, " ", year)
                lblTextMonth.text(months[month] + " " + year);
                
                //days of month
                var day_counter = 1;
                

                var firstDay = calculateWeekday(1, month, year);
                var lastDaymonth = lastDay(month,year);
                
                var next_month = month + 1;
                
                var lblDaysMonth_string = "";
                
                //render first row of week
                for (var i=0; i<7; i++){
                    if (i < firstDay){
                        var dayCode = "";
                        if (i == 0)
                            dayCode += "<tr>";
                        //if the day of the week is less than the number of the first day of the week do not put anything in the cell
                        dayCode += '<td class="invalid';
                        if (i == 0)
                            dayCode += " first";
                        dayCode += '"></td>';
                    } else {
                        var dayCode = "";
                        if (i == 0)
                            dayCode += '<tr>';
                        dayCode += '<td id="' + calendar_id + '_' + day_counter + "_" +  next_month  + "_" + year + '" ';
                        if (i == 0)
                            dayCode += ' class="first"';
                        if (i == 6)
                            dayCode += ' class="last"';
                        dayCode += '><a>' + day_counter + '</a></span>';
                        if (i == 6)
                            dayCode += '</tr>';
                        day_counter++;
                    }
                    lblDaysMonth_string += dayCode
                }
                
                //rest of month
                var currentWeekDay = 1;
                while (day_counter <= lastDaymonth){
                    var dayCode = "";
                    if (currentWeekDay % 7 == 1)
                        dayCode += "<tr>";
                    dayCode += '<td id="' + calendar_id + '_' + day_counter + "_" +  next_month  + "_" + year + '" ';
                    //start of week
                    if (currentWeekDay % 7 == 1)
                        dayCode += ' class="first"';
                    //end of week
                    if (currentWeekDay % 7 == 0)
                        dayCode += ' class="last"';
                    dayCode += '><a>' + day_counter + '</a></td>';
                    if (currentWeekDay % 7 == 0)
                        dayCode += "</tr>";
                    day_counter++;
                    currentWeekDay++;
                    lblDaysMonth_string += dayCode
                }
                
                //fill empty days
                currentWeekDay--;
                if (currentWeekDay%7!=0){
                    dayCode = "";
                    for (var i=(currentWeekDay%7)+1; i<=7; i++){
                        var dayCode = "";
                        dayCode += '<td class="invalid';
                        if (i==7)
                            dayCode += ' last'
                        dayCode += '"></td>';
                        if (i==7)
                            dayCode += '</tr>'
                        lblDaysMonth_string += dayCode
                    }
                }
                
                lblDaysMonth.append( lblDaysMonth_string );
            }
            //calcuation number of days in week
            function calculateWeekday(day,month,year){
                var dateObj = new Date(year, month, day);
                var numDay = dateObj.getDay();
                return numDay;
            }
            
            //date validation
            function checkdate (m, d, y) {
                // function by http://kevin.vanzonneveld.net
                // extracted from the manual phpjs.org libraries at http://www.desarrolloweb.com/manuales/manual-librerias-phpjs.html
                return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
            }
            
            //calculate last day of month for a given year
            function lastDay(month,year){ 
                var last_day=28; 
                while (checkdate(month+1,last_day + 1,year)){ 
                    last_day++; 
                } 
                return last_day; 
            } 
            
            function validateDate(date){
                var dateArray = date.split("/");
                if (dateArray.length!=3)
                    return false;
                return checkdate(dateArray[1], dateArray[0], dateArray[2]);
            }

            function check_events(month, year){
                if (req_ajax != false){
                    $.ajax({
                        type: req_ajax.type,
                        url: req_ajax.url,
                        data: { month: month + 1, year: year },
                        dataType: 'json'
                    }).done(function( data ) {

                        events = [];

                        $.each(data, function(k,v){
                            events.push(data[k]);
                        });

                        markEvents(month, year);

                    });
                } else {
                    markEvents(month, year);
                }
            }
            
            function markEvents(month, year){
                var t_month = month + 1;
                
                for(var i=0; i< events.length; i++) {
                    
                    if ( events[i][0].split('/')[1] == t_month && events[i][0].split('/')[2] == year ){

                        $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") ).addClass('event');
                        
                        $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('data-original-title', events[i][1]);
                        
                        //bg
                        if ( events[i][3] )
                            $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") ).css('background', events[i][3]);
                        
                        //link
                        if ( events[i][2] == '' || events[i][2] == '#' ){
                            if ( events[i][4] != '' ){
                                $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('data-trigger', 'manual');
                                $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).addClass('manual_popover');
                            } else {
                                $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('href', 'javascript:false;');
                            }
                        } else {
                            $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('href', events[i][2]);
                        }


                        //tooltip vs popover
                        if ( events[i][4] ){
                            $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") ).addClass('event_popover');
                            $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('rel', 'popover');
                            $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('data-content', events[i][4]);
                        } else {
                            $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") ).addClass('event_tooltip');
                            $('#' + calendar_id + '_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('rel', 'tooltip');
                        }
                    }
                }
                
                $('#' + calendar_id + ' ' + '.event_tooltip a').tooltip(tooltip_options);
                $('#' + calendar_id + ' ' + '.event_popover a').popover(popover_options);

                $('.manual_popover').click( function(){
                    $(this).popover('toggle');
                } );
            }
            
        /*** --functions-- ***/
            
        });
        return this;
    };
})(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/d3/d3.js":
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;!function() {
  var d3 = {
    version: "3.5.17"
  };
  var d3_arraySlice = [].slice, d3_array = function(list) {
    return d3_arraySlice.call(list);
  };
  var d3_document = this.document;
  function d3_documentElement(node) {
    return node && (node.ownerDocument || node.document || node).documentElement;
  }
  function d3_window(node) {
    return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
  }
  if (d3_document) {
    try {
      d3_array(d3_document.documentElement.childNodes)[0].nodeType;
    } catch (e) {
      d3_array = function(list) {
        var i = list.length, array = new Array(i);
        while (i--) array[i] = list[i];
        return array;
      };
    }
  }
  if (!Date.now) Date.now = function() {
    return +new Date();
  };
  if (d3_document) {
    try {
      d3_document.createElement("DIV").style.setProperty("opacity", 0, "");
    } catch (error) {
      var d3_element_prototype = this.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = this.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
      d3_element_prototype.setAttribute = function(name, value) {
        d3_element_setAttribute.call(this, name, value + "");
      };
      d3_element_prototype.setAttributeNS = function(space, local, value) {
        d3_element_setAttributeNS.call(this, space, local, value + "");
      };
      d3_style_prototype.setProperty = function(name, value, priority) {
        d3_style_setProperty.call(this, name, value + "", priority);
      };
    }
  }
  d3.ascending = d3_ascending;
  function d3_ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  d3.descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };
  d3.min = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }
    return a;
  };
  d3.max = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
  };
  d3.extent = function(array, f) {
    var i = -1, n = array.length, a, b, c;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }
    return [ a, c ];
  };
  function d3_number(x) {
    return x === null ? NaN : +x;
  }
  function d3_numeric(x) {
    return !isNaN(x);
  }
  d3.sum = function(array, f) {
    var s = 0, n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = +array[i])) s += a;
    } else {
      while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a;
    }
    return s;
  };
  d3.mean = function(array, f) {
    var s = 0, n = array.length, a, i = -1, j = n;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a; else --j;
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a; else --j;
    }
    if (j) return s / j;
  };
  d3.quantile = function(values, p) {
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };
  d3.median = function(array, f) {
    var numbers = [], n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a);
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a);
    }
    if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), .5);
  };
  d3.variance = function(array, f) {
    var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0;
    if (arguments.length === 1) {
      while (++i < n) {
        if (d3_numeric(a = d3_number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    } else {
      while (++i < n) {
        if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }
    if (j > 1) return s / (j - 1);
  };
  d3.deviation = function() {
    var v = d3.variance.apply(this, arguments);
    return v ? Math.sqrt(v) : v;
  };
  function d3_bisector(compare) {
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
        }
        return lo;
      }
    };
  }
  var d3_bisect = d3_bisector(d3_ascending);
  d3.bisectLeft = d3_bisect.left;
  d3.bisect = d3.bisectRight = d3_bisect.right;
  d3.bisector = function(f) {
    return d3_bisector(f.length === 1 ? function(d, x) {
      return d3_ascending(f(d), x);
    } : f);
  };
  d3.shuffle = function(array, i0, i1) {
    if ((m = arguments.length) < 3) {
      i1 = array.length;
      if (m < 2) i0 = 0;
    }
    var m = i1 - i0, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
    }
    return array;
  };
  d3.permute = function(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  };
  d3.pairs = function(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
    return pairs;
  };
  d3.transpose = function(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = d3.min(matrix, d3_transposeLength), transpose = new Array(m); ++i < m; ) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n; ) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  };
  function d3_transposeLength(d) {
    return d.length;
  }
  d3.zip = function() {
    return d3.transpose(arguments);
  };
  d3.keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };
  d3.values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };
  d3.entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({
      key: key,
      value: map[key]
    });
    return entries;
  };
  d3.merge = function(arrays) {
    var n = arrays.length, m, i = -1, j = 0, merged, array;
    while (++i < n) j += arrays[i].length;
    merged = new Array(j);
    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }
    return merged;
  };
  var abs = Math.abs;
  d3.range = function(start, stop, step) {
    if (arguments.length < 3) {
      step = 1;
      if (arguments.length < 2) {
        stop = start;
        start = 0;
      }
    }
    if ((stop - start) / step === Infinity) throw new Error("infinite range");
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
    start *= k, stop *= k, step *= k;
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
    return range;
  };
  function d3_range_integerScale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }
  function d3_class(ctor, properties) {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  }
  d3.map = function(object, f) {
    var map = new d3_Map();
    if (object instanceof d3_Map) {
      object.forEach(function(key, value) {
        map.set(key, value);
      });
    } else if (Array.isArray(object)) {
      var i = -1, n = object.length, o;
      if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    } else {
      for (var key in object) map.set(key, object[key]);
    }
    return map;
  };
  function d3_Map() {
    this._ = Object.create(null);
  }
  var d3_map_proto = "__proto__", d3_map_zero = "\x00";
  d3_class(d3_Map, {
    has: d3_map_has,
    get: function(key) {
      return this._[d3_map_escape(key)];
    },
    set: function(key, value) {
      return this._[d3_map_escape(key)] = value;
    },
    remove: d3_map_remove,
    keys: d3_map_keys,
    values: function() {
      var values = [];
      for (var key in this._) values.push(this._[key]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var key in this._) entries.push({
        key: d3_map_unescape(key),
        value: this._[key]
      });
      return entries;
    },
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
    }
  });
  function d3_map_escape(key) {
    return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
  }
  function d3_map_unescape(key) {
    return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
  }
  function d3_map_has(key) {
    return d3_map_escape(key) in this._;
  }
  function d3_map_remove(key) {
    return (key = d3_map_escape(key)) in this._ && delete this._[key];
  }
  function d3_map_keys() {
    var keys = [];
    for (var key in this._) keys.push(d3_map_unescape(key));
    return keys;
  }
  function d3_map_size() {
    var size = 0;
    for (var key in this._) ++size;
    return size;
  }
  function d3_map_empty() {
    for (var key in this._) return false;
    return true;
  }
  d3.nest = function() {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
          values.push(object);
        } else {
          valuesByKey.set(keyValue, [ object ]);
        }
      }
      if (mapType) {
        object = mapType();
        setter = function(keyValue, values) {
          object.set(keyValue, map(mapType, values, depth));
        };
      } else {
        object = {};
        setter = function(keyValue, values) {
          object[keyValue] = map(mapType, values, depth);
        };
      }
      valuesByKey.forEach(setter);
      return object;
    }
    function entries(map, depth) {
      if (depth >= keys.length) return map;
      var array = [], sortKey = sortKeys[depth++];
      map.forEach(function(key, keyMap) {
        array.push({
          key: key,
          values: entries(keyMap, depth)
        });
      });
      return sortKey ? array.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }
    nest.map = function(array, mapType) {
      return map(mapType, array, 0);
    };
    nest.entries = function(array) {
      return entries(map(d3.map, array, 0), 0);
    };
    nest.key = function(d) {
      keys.push(d);
      return nest;
    };
    nest.sortKeys = function(order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    };
    nest.sortValues = function(order) {
      sortValues = order;
      return nest;
    };
    nest.rollup = function(f) {
      rollup = f;
      return nest;
    };
    return nest;
  };
  d3.set = function(array) {
    var set = new d3_Set();
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
    return set;
  };
  function d3_Set() {
    this._ = Object.create(null);
  }
  d3_class(d3_Set, {
    has: d3_map_has,
    add: function(key) {
      this._[d3_map_escape(key += "")] = true;
      return key;
    },
    remove: d3_map_remove,
    values: d3_map_keys,
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key));
    }
  });
  d3.behavior = {};
  function d3_identity(d) {
    return d;
  }
  d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
      var prefixName = d3_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }
  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
  function d3_noop() {}
  d3.dispatch = function() {
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    return dispatch;
  };
  function d3_dispatch() {}
  d3_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."), name = "";
    if (i >= 0) {
      name = type.slice(i + 1);
      type = type.slice(0, i);
    }
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };
  function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = new d3_Map();
    function event() {
      var z = listeners, i = -1, n = z.length, l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }
    event.on = function(name, listener) {
      var l = listenerByName.get(name), i;
      if (arguments.length < 2) return l && l.on;
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }
      if (listener) listeners.push(listenerByName.set(name, {
        on: listener
      }));
      return dispatch;
    };
    return event;
  }
  d3.event = null;
  function d3_eventPreventDefault() {
    d3.event.preventDefault();
  }
  function d3_eventSource() {
    var e = d3.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }
  function d3_eventDispatch(target) {
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 = e1.sourceEvent = d3.event;
          e1.target = target;
          d3.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          d3.event = e0;
        }
      };
    };
    return dispatch;
  }
  d3.requote = function(s) {
    return s.replace(d3_requote_re, "\\$&");
  };
  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  var d3_subclass = {}.__proto__ ? function(object, prototype) {
    object.__proto__ = prototype;
  } : function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };
  function d3_selection(groups) {
    d3_subclass(groups, d3_selectionPrototype);
    return groups;
  }
  var d3_select = function(s, n) {
    return n.querySelector(s);
  }, d3_selectAll = function(s, n) {
    return n.querySelectorAll(s);
  }, d3_selectMatches = function(n, s) {
    var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, "matchesSelector")];
    d3_selectMatches = function(n, s) {
      return d3_selectMatcher.call(n, s);
    };
    return d3_selectMatches(n, s);
  };
  if (typeof Sizzle === "function") {
    d3_select = function(s, n) {
      return Sizzle(s, n)[0] || null;
    };
    d3_selectAll = Sizzle;
    d3_selectMatches = Sizzle.matchesSelector;
  }
  d3.selection = function() {
    return d3.select(d3_document.documentElement);
  };
  var d3_selectionPrototype = d3.selection.prototype = [];
  d3_selectionPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, group, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_select(selector, this);
    };
  }
  d3_selectionPrototype.selectAll = function(selector) {
    var subgroups = [], subgroup, node;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_selectAll(selector, this);
    };
  }
  var d3_nsXhtml = "http://www.w3.org/1999/xhtml";
  var d3_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: d3_nsXhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  d3.ns = {
    prefix: d3_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return d3_nsPrefix.hasOwnProperty(prefix) ? {
        space: d3_nsPrefix[prefix],
        local: name
      } : name;
    }
  };
  d3_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node();
        name = d3.ns.qualify(name);
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
      }
      for (value in name) this.each(d3_selection_attr(value, name[value]));
      return this;
    }
    return this.each(d3_selection_attr(name, value));
  };
  function d3_selection_attr(name, value) {
    name = d3.ns.qualify(name);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
    }
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
  }
  function d3_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  d3_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }
      for (value in name) this.each(d3_selection_classed(value, name[value]));
      return this;
    }
    return this.each(d3_selection_classed(name, value));
  };
  function d3_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
  }
  function d3_selection_classes(name) {
    return (name + "").trim().split(/^|\s+/);
  }
  function d3_selection_classed(name, value) {
    name = d3_selection_classes(name).map(d3_selection_classedName);
    var n = name.length;
    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }
    return typeof value === "function" ? classedFunction : classedConstant;
  }
  function d3_selection_classedName(name) {
    var re = d3_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
      } else {
        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
      }
    };
  }
  d3_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
        return this;
      }
      if (n < 2) {
        var node = this.node();
        return d3_window(node).getComputedStyle(node, null).getPropertyValue(name);
      }
      priority = "";
    }
    return this.each(d3_selection_style(name, value, priority));
  };
  function d3_selection_style(name, value, priority) {
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
    }
    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
  }
  d3_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") return this.node()[name];
      for (value in name) this.each(d3_selection_property(value, name[value]));
      return this;
    }
    return this.each(d3_selection_property(name, value));
  };
  function d3_selection_property(name, value) {
    function propertyNull() {
      delete this[name];
    }
    function propertyConstant() {
      this[name] = value;
    }
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name]; else this[name] = x;
    }
    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
  }
  d3_selectionPrototype.text = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    } : value == null ? function() {
      this.textContent = "";
    } : function() {
      this.textContent = value;
    }) : this.node().textContent;
  };
  d3_selectionPrototype.html = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    } : value == null ? function() {
      this.innerHTML = "";
    } : function() {
      this.innerHTML = value;
    }) : this.node().innerHTML;
  };
  d3_selectionPrototype.append = function(name) {
    name = d3_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };
  function d3_selection_creator(name) {
    function create() {
      var document = this.ownerDocument, namespace = this.namespaceURI;
      return namespace === d3_nsXhtml && document.documentElement.namespaceURI === d3_nsXhtml ? document.createElement(name) : document.createElementNS(namespace, name);
    }
    function createNS() {
      return this.ownerDocument.createElementNS(name.space, name.local);
    }
    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? createNS : create;
  }
  d3_selectionPrototype.insert = function(name, before) {
    name = d3_selection_creator(name);
    before = d3_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  };
  d3_selectionPrototype.remove = function() {
    return this.each(d3_selectionRemove);
  };
  function d3_selectionRemove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  d3_selectionPrototype.data = function(value, key) {
    var i = -1, n = this.length, group, node;
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }
    function bind(group, groupData) {
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
      if (key) {
        var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue;
        for (i = -1; ++i < n; ) {
          if (node = group[i]) {
            if (nodeByKeyValue.has(keyValue = key.call(node, node.__data__, i))) {
              exitNodes[i] = node;
            } else {
              nodeByKeyValue.set(keyValue, node);
            }
            keyValues[i] = keyValue;
          }
        }
        for (i = -1; ++i < m; ) {
          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          } else if (node !== true) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          }
          nodeByKeyValue.set(keyValue, true);
        }
        for (i = -1; ++i < n; ) {
          if (i in keyValues && nodeByKeyValue.get(keyValues[i]) !== true) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0; ) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
        }
        for (;i < m; ++i) {
          enterNodes[i] = d3_selection_dataNode(groupData[i]);
        }
        for (;i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }
      enterNodes.update = updateNodes;
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }
    update.enter = function() {
      return enter;
    };
    update.exit = function() {
      return exit;
    };
    return update;
  };
  function d3_selection_dataNode(data) {
    return {
      __data__: data
    };
  }
  d3_selectionPrototype.datum = function(value) {
    return arguments.length ? this.property("__data__", value) : this.property("__data__");
  };
  d3_selectionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_filter(selector) {
    return function() {
      return d3_selectMatches(this, selector);
    };
  }
  d3_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  d3_selectionPrototype.sort = function(comparator) {
    comparator = d3_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
    return this.order();
  };
  function d3_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = d3_ascending;
    return function(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    };
  }
  d3_selectionPrototype.each = function(callback) {
    return d3_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };
  function d3_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }
  d3_selectionPrototype.call = function(callback) {
    var args = d3_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };
  d3_selectionPrototype.empty = function() {
    return !this.node();
  };
  d3_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };
  d3_selectionPrototype.size = function() {
    var n = 0;
    d3_selection_each(this, function() {
      ++n;
    });
    return n;
  };
  function d3_selection_enter(selection) {
    d3_subclass(selection, d3_selection_enterPrototype);
    return selection;
  }
  var d3_selection_enterPrototype = [];
  d3.selection.enter = d3_selection_enter;
  d3.selection.enter.prototype = d3_selection_enterPrototype;
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
  d3_selection_enterPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, upgroup, group, node;
    for (var j = -1, m = this.length; ++j < m; ) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  d3_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
    return d3_selectionPrototype.insert.call(this, name, before);
  };
  function d3_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update, n = group.length, node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n) ;
      return node;
    };
  }
  d3.select = function(node) {
    var group;
    if (typeof node === "string") {
      group = [ d3_select(node, d3_document) ];
      group.parentNode = d3_document.documentElement;
    } else {
      group = [ node ];
      group.parentNode = d3_documentElement(node);
    }
    return d3_selection([ group ]);
  };
  d3.selectAll = function(nodes) {
    var group;
    if (typeof nodes === "string") {
      group = d3_array(d3_selectAll(nodes, d3_document));
      group.parentNode = d3_document.documentElement;
    } else {
      group = d3_array(nodes);
      group.parentNode = null;
    }
    return d3_selection([ group ]);
  };
  d3_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
        return this;
      }
      if (n < 2) return (n = this.node()["__on" + type]) && n._;
      capture = false;
    }
    return this.each(d3_selection_on(type, listener, capture));
  };
  function d3_selection_on(type, listener, capture) {
    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
    if (i > 0) type = type.slice(0, i);
    var filter = d3_selection_onFilters.get(type);
    if (filter) type = filter, wrap = d3_selection_onFilter;
    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }
    function onAdd() {
      var l = wrap(listener, d3_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }
    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
  }
  var d3_selection_onFilters = d3.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });
  if (d3_document) {
    d3_selection_onFilters.forEach(function(k) {
      if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
    });
  }
  function d3_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = d3.event;
      d3.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        d3.event = o;
      }
    };
  }
  function d3_selection_onFilter(listener, argumentz) {
    var l = d3_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
        l.call(target, e);
      }
    };
  }
  var d3_event_dragSelect, d3_event_dragId = 0;
  function d3_event_dragSuppress(node) {
    var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window(node)).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
    if (d3_event_dragSelect == null) {
      d3_event_dragSelect = "onselectstart" in node ? false : d3_vendorSymbol(node.style, "userSelect");
    }
    if (d3_event_dragSelect) {
      var style = d3_documentElement(node).style, select = style[d3_event_dragSelect];
      style[d3_event_dragSelect] = "none";
    }
    return function(suppressClick) {
      w.on(name, null);
      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
      if (suppressClick) {
        var off = function() {
          w.on(click, null);
        };
        w.on(click, function() {
          d3_eventPreventDefault();
          off();
        }, true);
        setTimeout(off, 0);
      }
    };
  }
  d3.mouse = function(container) {
    return d3_mousePoint(container, d3_eventSource());
  };
  var d3_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
  function d3_mousePoint(container, e) {
    if (e.changedTouches) e = e.changedTouches[0];
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (d3_mouse_bug44083 < 0) {
        var window = d3_window(container);
        if (window.scrollX || window.scrollY) {
          svg = d3.select("body").append("svg").style({
            position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            border: "none"
          }, "important");
          var ctm = svg[0][0].getScreenCTM();
          d3_mouse_bug44083 = !(ctm.f || ctm.e);
          svg.remove();
        }
      }
      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  }
  d3.touch = function(container, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return d3_mousePoint(container, touch);
      }
    }
  };
  d3.behavior.drag = function() {
    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_window, "mousemove", "mouseup"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_identity, "touchmove", "touchend");
    function drag() {
      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
    }
    function dragstart(id, position, subject, move, end) {
      return function() {
        var that = this, target = d3.event.target.correspondingElement || d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (dragId == null ? "" : "-" + dragId), dragOffset, dragSubject = d3.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(target), position0 = position(parent, dragId);
        if (origin) {
          dragOffset = origin.apply(that, arguments);
          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];
        } else {
          dragOffset = [ 0, 0 ];
        }
        dispatch({
          type: "dragstart"
        });
        function moved() {
          var position1 = position(parent, dragId), dx, dy;
          if (!position1) return;
          dx = position1[0] - position0[0];
          dy = position1[1] - position0[1];
          dragged |= dx | dy;
          position0 = position1;
          dispatch({
            type: "drag",
            x: position1[0] + dragOffset[0],
            y: position1[1] + dragOffset[1],
            dx: dx,
            dy: dy
          });
        }
        function ended() {
          if (!position(parent, dragId)) return;
          dragSubject.on(move + dragName, null).on(end + dragName, null);
          dragRestore(dragged);
          dispatch({
            type: "dragend"
          });
        }
      };
    }
    drag.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return drag;
    };
    return d3.rebind(drag, event, "on");
  };
  function d3_behavior_dragTouchId() {
    return d3.event.changedTouches[0].identifier;
  }
  d3.touches = function(container, touches) {
    if (arguments.length < 2) touches = d3_eventSource().touches;
    return touches ? d3_array(touches).map(function(touch) {
      var point = d3_mousePoint(container, touch);
      point.identifier = touch.identifier;
      return point;
    }) : [];
  };
  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
  function d3_sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function d3_cross2d(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  }
  function d3_acos(x) {
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
  }
  function d3_asin(x) {
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
  }
  function d3_sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  function d3_cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  function d3_tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  function d3_haversin(x) {
    return (x = Math.sin(x / 2)) * x;
  }
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
  d3.interpolateZoom = function(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < ε2) {
      S = Math.log(w1 / w0) / ρ;
      i = function(t) {
        return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * t * S) ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / ρ;
      i = function(t) {
        var s = t * S, coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];
      };
    }
    i.duration = S * 1e3;
    return i;
  };
  d3.behavior.zoom = function() {
    var view = {
      x: 0,
      y: 0,
      k: 1
    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
    if (!d3_behavior_zoomWheel) {
      d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
        return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
      }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
        return d3.event.wheelDelta;
      }, "mousewheel") : (d3_behavior_zoomDelta = function() {
        return -d3.event.detail;
      }, "MozMousePixelScroll");
    }
    function zoom(g) {
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
    }
    zoom.event = function(g) {
      g.each(function() {
        var dispatch = event.of(this, arguments), view1 = view;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.zoom", function() {
            view = this.__chart__ || {
              x: 0,
              y: 0,
              k: 1
            };
            zoomstarted(dispatch);
          }).tween("zoom:zoom", function() {
            var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
            return function(t) {
              var l = i(t), k = dx / l[2];
              this.__chart__ = view = {
                x: cx - l[0] * k,
                y: cy - l[1] * k,
                k: k
              };
              zoomed(dispatch);
            };
          }).each("interrupt.zoom", function() {
            zoomended(dispatch);
          }).each("end.zoom", function() {
            zoomended(dispatch);
          });
        } else {
          this.__chart__ = view;
          zoomstarted(dispatch);
          zoomed(dispatch);
          zoomended(dispatch);
        }
      });
    };
    zoom.translate = function(_) {
      if (!arguments.length) return [ view.x, view.y ];
      view = {
        x: +_[0],
        y: +_[1],
        k: view.k
      };
      rescale();
      return zoom;
    };
    zoom.scale = function(_) {
      if (!arguments.length) return view.k;
      view = {
        x: view.x,
        y: view.y,
        k: null
      };
      scaleTo(+_);
      rescale();
      return zoom;
    };
    zoom.scaleExtent = function(_) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.center = function(_) {
      if (!arguments.length) return center;
      center = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.size = function(_) {
      if (!arguments.length) return size;
      size = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_;
      return zoom;
    };
    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    function location(p) {
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
    }
    function point(l) {
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
    }
    function scaleTo(s) {
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    }
    function translateTo(p, l) {
      l = point(l);
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }
    function zoomTo(that, p, l, k) {
      that.__chart__ = {
        x: view.x,
        y: view.y,
        k: view.k
      };
      scaleTo(Math.pow(2, k));
      translateTo(center0 = p, l);
      that = d3.select(that);
      if (duration > 0) that = that.transition().duration(duration);
      that.call(zoom.event);
    }
    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) {
        return (x - view.x) / view.k;
      }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) {
        return (y - view.y) / view.k;
      }).map(y0.invert));
    }
    function zoomstarted(dispatch) {
      if (!zooming++) dispatch({
        type: "zoomstart"
      });
    }
    function zoomed(dispatch) {
      rescale();
      dispatch({
        type: "zoom",
        scale: view.k,
        translate: [ view.x, view.y ]
      });
    }
    function zoomended(dispatch) {
      if (!--zooming) dispatch({
        type: "zoomend"
      }), center0 = null;
    }
    function mousedowned() {
      var that = this, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window(that)).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress(that);
      d3_selection_interrupt.call(that);
      zoomstarted(dispatch);
      function moved() {
        dragged = 1;
        translateTo(d3.mouse(that), location0);
        zoomed(dispatch);
      }
      function ended() {
        subject.on(mousemove, null).on(mouseup, null);
        dragRestore(dragged);
        zoomended(dispatch);
      }
    }
    function touchstarted() {
      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress(that);
      started();
      zoomstarted(dispatch);
      subject.on(mousedown, null).on(touchstart, started);
      function relocate() {
        var touches = d3.touches(that);
        scale0 = view.k;
        touches.forEach(function(t) {
          if (t.identifier in locations0) locations0[t.identifier] = location(t);
        });
        return touches;
      }
      function started() {
        var target = d3.event.target;
        d3.select(target).on(touchmove, moved).on(touchend, ended);
        targets.push(target);
        var changed = d3.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          locations0[changed[i].identifier] = null;
        }
        var touches = relocate(), now = Date.now();
        if (touches.length === 1) {
          if (now - touchtime < 500) {
            var p = touches[0];
            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
            d3_eventPreventDefault();
          }
          touchtime = now;
        } else if (touches.length > 1) {
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
          distance0 = dx * dx + dy * dy;
        }
      }
      function moved() {
        var touches = d3.touches(that), p0, l0, p1, l1;
        d3_selection_interrupt.call(that);
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
          p1 = touches[i];
          if (l1 = locations0[p1.identifier]) {
            if (l0) break;
            p0 = p1, l0 = l1;
          }
        }
        if (l1) {
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
          scaleTo(scale1 * scale0);
        }
        touchtime = null;
        translateTo(p0, l0);
        zoomed(dispatch);
      }
      function ended() {
        if (d3.event.touches.length) {
          var changed = d3.event.changedTouches;
          for (var i = 0, n = changed.length; i < n; ++i) {
            delete locations0[changed[i].identifier];
          }
          for (var identifier in locations0) {
            return void relocate();
          }
        }
        d3.selectAll(targets).on(zoomName, null);
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
        dragRestore();
        zoomended(dispatch);
      }
    }
    function mousewheeled() {
      var dispatch = event.of(this, arguments);
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), 
      translate0 = location(center0 = center || d3.mouse(this)), zoomstarted(dispatch);
      mousewheelTimer = setTimeout(function() {
        mousewheelTimer = null;
        zoomended(dispatch);
      }, 50);
      d3_eventPreventDefault();
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
      translateTo(center0, translate0);
      zoomed(dispatch);
    }
    function dblclicked() {
      var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2;
      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
    }
    return d3.rebind(zoom, event, "on");
  };
  var d3_behavior_zoomInfinity = [ 0, Infinity ], d3_behavior_zoomDelta, d3_behavior_zoomWheel;
  d3.color = d3_color;
  function d3_color() {}
  d3_color.prototype.toString = function() {
    return this.rgb() + "";
  };
  d3.hsl = d3_hsl;
  function d3_hsl(h, s, l) {
    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
  }
  var d3_hslPrototype = d3_hsl.prototype = new d3_color();
  d3_hslPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, this.l / k);
  };
  d3_hslPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, k * this.l);
  };
  d3_hslPrototype.rgb = function() {
    return d3_hsl_rgb(this.h, this.s, this.l);
  };
  function d3_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
      if (h > 360) h -= 360; else if (h < 0) h += 360;
      if (h < 60) return m1 + (m2 - m1) * h / 60;
      if (h < 180) return m2;
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
      return m1;
    }
    function vv(h) {
      return Math.round(v(h) * 255);
    }
    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
  }
  d3.hcl = d3_hcl;
  function d3_hcl(h, c, l) {
    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
  }
  var d3_hclPrototype = d3_hcl.prototype = new d3_color();
  d3_hclPrototype.brighter = function(k) {
    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.darker = function(k) {
    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.rgb = function() {
    return d3_hcl_lab(this.h, this.c, this.l).rgb();
  };
  function d3_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
  }
  d3.lab = d3_lab;
  function d3_lab(l, a, b) {
    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
  }
  var d3_lab_K = 18;
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
  var d3_labPrototype = d3_lab.prototype = new d3_color();
  d3_labPrototype.brighter = function(k) {
    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.darker = function(k) {
    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.rgb = function() {
    return d3_lab_rgb(this.l, this.a, this.b);
  };
  function d3_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = d3_lab_xyz(x) * d3_lab_X;
    y = d3_lab_xyz(y) * d3_lab_Y;
    z = d3_lab_xyz(z) * d3_lab_Z;
    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
  }
  function d3_lab_hcl(l, a, b) {
    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
  }
  function d3_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
  }
  function d3_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
  }
  function d3_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
  }
  d3.rgb = d3_rgb;
  function d3_rgb(r, g, b) {
    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
  }
  function d3_rgbNumber(value) {
    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
  }
  function d3_rgbString(value) {
    return d3_rgbNumber(value) + "";
  }
  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
  d3_rgbPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    var r = this.r, g = this.g, b = this.b, i = 30;
    if (!r && !g && !b) return new d3_rgb(i, i, i);
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
  };
  d3_rgbPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_rgb(k * this.r, k * this.g, k * this.b);
  };
  d3_rgbPrototype.hsl = function() {
    return d3_rgb_hsl(this.r, this.g, this.b);
  };
  d3_rgbPrototype.toString = function() {
    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
  };
  function d3_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }
  function d3_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, color;
    m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());
    if (m1) {
      m2 = m1[2].split(",");
      switch (m1[1]) {
       case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

       case "rgb":
        {
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
        }
      }
    }
    if (color = d3_rgb_names.get(format)) {
      return rgb(color.r, color.g, color.b);
    }
    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
      if (format.length === 4) {
        r = (color & 3840) >> 4;
        r = r >> 4 | r;
        g = color & 240;
        g = g >> 4 | g;
        b = color & 15;
        b = b << 4 | b;
      } else if (format.length === 7) {
        r = (color & 16711680) >> 16;
        g = (color & 65280) >> 8;
        b = color & 255;
      }
    }
    return rgb(r, g, b);
  }
  function d3_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
      s = l < .5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new d3_hsl(h, s, l);
  }
  function d3_rgb_lab(r, g, b) {
    r = d3_rgb_xyz(r);
    g = d3_rgb_xyz(g);
    b = d3_rgb_xyz(b);
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }
  function d3_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
  }
  function d3_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }
  var d3_rgb_names = d3.map({
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  });
  d3_rgb_names.forEach(function(key, value) {
    d3_rgb_names.set(key, d3_rgbNumber(value));
  });
  function d3_functor(v) {
    return typeof v === "function" ? v : function() {
      return v;
    };
  }
  d3.functor = d3_functor;
  d3.xhr = d3_xhrType(d3_identity);
  function d3_xhrType(response) {
    return function(url, mimeType, callback) {
      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
      mimeType = null;
      return d3_xhr(url, mimeType, response, callback);
    };
  }
  function d3_xhr(url, mimeType, response, callback) {
    var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
    if (this.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
      request.readyState > 3 && respond();
    };
    function respond() {
      var status = request.status, result;
      if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          dispatch.error.call(xhr, e);
          return;
        }
        dispatch.load.call(xhr, result);
      } else {
        dispatch.error.call(xhr, request);
      }
    }
    request.onprogress = function(event) {
      var o = d3.event;
      d3.event = event;
      try {
        dispatch.progress.call(xhr, request);
      } finally {
        d3.event = o;
      }
    };
    xhr.header = function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers[name];
      if (value == null) delete headers[name]; else headers[name] = value + "";
      return xhr;
    };
    xhr.mimeType = function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    };
    xhr.responseType = function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    };
    xhr.response = function(value) {
      response = value;
      return xhr;
    };
    [ "get", "post" ].forEach(function(method) {
      xhr[method] = function() {
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
      };
    });
    xhr.send = function(method, data, callback) {
      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
      request.open(method, url, true);
      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback != null) xhr.on("error", callback).on("load", function(request) {
        callback(null, request);
      });
      dispatch.beforesend.call(xhr, request);
      request.send(data == null ? null : data);
      return xhr;
    };
    xhr.abort = function() {
      request.abort();
      return xhr;
    };
    d3.rebind(xhr, dispatch, "on");
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
  }
  function d3_xhr_fixCallback(callback) {
    return callback.length === 1 ? function(error, request) {
      callback(error == null ? request : null);
    } : callback;
  }
  function d3_xhrHasResponse(request) {
    var type = request.responseType;
    return type && type !== "text" ? request.response : request.responseText;
  }
  d3.dsv = function(delimiter, mimeType) {
    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
    function dsv(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);
      xhr.row = function(_) {
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
      };
      return xhr;
    }
    function response(request) {
      return dsv.parse(request.responseText);
    }
    function typedResponse(f) {
      return function(request) {
        return dsv.parse(request.responseText, f);
      };
    }
    dsv.parse = function(text, f) {
      var o;
      return dsv.parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) {
          return f(a(row), i);
        } : a;
      });
    };
    dsv.parseRows = function(text, f) {
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
      function token() {
        if (I >= N) return EOF;
        if (eol) return eol = false, EOL;
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, '"');
        }
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; else if (c === 13) {
            eol = true;
            if (text.charCodeAt(I) === 10) ++I, ++k;
          } else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }
        return text.slice(j);
      }
      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }
      return rows;
    };
    dsv.format = function(rows) {
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
      var fieldSet = new d3_Set(), fields = [];
      rows.forEach(function(row) {
        for (var field in row) {
          if (!fieldSet.has(field)) {
            fields.push(fieldSet.add(field));
          }
        }
      });
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    };
    dsv.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };
    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }
    function formatValue(text) {
      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
    }
    return dsv;
  };
  d3.csv = d3.dsv(",", "text/csv");
  d3.tsv = d3.dsv("	", "text/tab-separated-values");
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_frame = this[d3_vendorSymbol(this, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 17);
  };
  d3.timer = function() {
    d3_timer.apply(this, arguments);
  };
  function d3_timer(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    var time = then + delay, timer = {
      c: callback,
      t: time,
      n: null
    };
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
    d3_timer_queueTail = timer;
    if (!d3_timer_interval) {
      d3_timer_timeout = clearTimeout(d3_timer_timeout);
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
    return timer;
  }
  function d3_timer_step() {
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
    if (delay > 24) {
      if (isFinite(delay)) {
        clearTimeout(d3_timer_timeout);
        d3_timer_timeout = setTimeout(d3_timer_step, delay);
      }
      d3_timer_interval = 0;
    } else {
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  }
  d3.timer.flush = function() {
    d3_timer_mark();
    d3_timer_sweep();
  };
  function d3_timer_mark() {
    var now = Date.now(), timer = d3_timer_queueHead;
    while (timer) {
      if (now >= timer.t && timer.c(now - timer.t)) timer.c = null;
      timer = timer.n;
    }
    return now;
  }
  function d3_timer_sweep() {
    var t0, t1 = d3_timer_queueHead, time = Infinity;
    while (t1) {
      if (t1.c) {
        if (t1.t < time) time = t1.t;
        t1 = (t0 = t1).n;
      } else {
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
      }
    }
    d3_timer_queueTail = t0;
    return time;
  }
  function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
  }
  d3.round = function(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
  };
  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
  d3.formatPrefix = function(value, precision) {
    var i = 0;
    if (value = +value) {
      if (value < 0) value *= -1;
      if (precision) value = d3.round(value, d3_format_precision(value, precision));
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
  };
  function d3_formatPrefix(d, i) {
    var k = Math.pow(10, abs(8 - i) * 3);
    return {
      scale: i > 8 ? function(d) {
        return d / k;
      } : function(d) {
        return d * k;
      },
      symbol: d
    };
  }
  function d3_locale_numberFormat(locale) {
    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
      var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = locale_grouping[j = (j + 1) % locale_grouping.length];
      }
      return t.reverse().join(locale_thousands);
    } : d3_identity;
    return function(specifier) {
      var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
      if (precision) precision = +precision.substring(1);
      if (zfill || fill === "0" && align === "=") {
        zfill = fill = "0";
        align = "=";
      }
      switch (type) {
       case "n":
        comma = true;
        type = "g";
        break;

       case "%":
        scale = 100;
        suffix = "%";
        type = "f";
        break;

       case "p":
        scale = 100;
        suffix = "%";
        type = "r";
        break;

       case "b":
       case "o":
       case "x":
       case "X":
        if (symbol === "#") prefix = "0" + type.toLowerCase();

       case "c":
        exponent = false;

       case "d":
        integer = true;
        precision = 0;
        break;

       case "s":
        scale = -1;
        type = "r";
        break;
      }
      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
      if (type == "r" && !precision) type = "g";
      if (precision != null) {
        if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
      }
      type = d3_format_types.get(type) || d3_format_typeDefault;
      var zcomma = zfill && comma;
      return function(value) {
        var fullSuffix = suffix;
        if (integer && value % 1) return "";
        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
        if (scale < 0) {
          var unit = d3.formatPrefix(value, precision);
          value = unit.scale(value);
          fullSuffix = unit.symbol + suffix;
        } else {
          value *= scale;
        }
        value = type(value, precision);
        var i = value.lastIndexOf("."), before, after;
        if (i < 0) {
          var j = exponent ? value.lastIndexOf("e") : -1;
          if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
        } else {
          before = value.substring(0, i);
          after = locale_decimal + value.substring(i + 1);
        }
        if (!zfill && comma) before = formatGroup(before, Infinity);
        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
        negative += prefix;
        value = before + after;
        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
      };
    };
  }
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
  var d3_format_types = d3.map({
    b: function(x) {
      return x.toString(2);
    },
    c: function(x) {
      return String.fromCharCode(x);
    },
    o: function(x) {
      return x.toString(8);
    },
    x: function(x) {
      return x.toString(16);
    },
    X: function(x) {
      return x.toString(16).toUpperCase();
    },
    g: function(x, p) {
      return x.toPrecision(p);
    },
    e: function(x, p) {
      return x.toExponential(p);
    },
    f: function(x, p) {
      return x.toFixed(p);
    },
    r: function(x, p) {
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
    }
  });
  function d3_format_typeDefault(x) {
    return x + "";
  }
  var d3_time = d3.time = {}, d3_date = Date;
  function d3_date_utc() {
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
  }
  d3_date_utc.prototype = {
    getDate: function() {
      return this._.getUTCDate();
    },
    getDay: function() {
      return this._.getUTCDay();
    },
    getFullYear: function() {
      return this._.getUTCFullYear();
    },
    getHours: function() {
      return this._.getUTCHours();
    },
    getMilliseconds: function() {
      return this._.getUTCMilliseconds();
    },
    getMinutes: function() {
      return this._.getUTCMinutes();
    },
    getMonth: function() {
      return this._.getUTCMonth();
    },
    getSeconds: function() {
      return this._.getUTCSeconds();
    },
    getTime: function() {
      return this._.getTime();
    },
    getTimezoneOffset: function() {
      return 0;
    },
    valueOf: function() {
      return this._.valueOf();
    },
    setDate: function() {
      d3_time_prototype.setUTCDate.apply(this._, arguments);
    },
    setDay: function() {
      d3_time_prototype.setUTCDay.apply(this._, arguments);
    },
    setFullYear: function() {
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
    },
    setHours: function() {
      d3_time_prototype.setUTCHours.apply(this._, arguments);
    },
    setMilliseconds: function() {
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
    },
    setMinutes: function() {
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
    },
    setMonth: function() {
      d3_time_prototype.setUTCMonth.apply(this._, arguments);
    },
    setSeconds: function() {
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
    },
    setTime: function() {
      d3_time_prototype.setTime.apply(this._, arguments);
    }
  };
  var d3_time_prototype = Date.prototype;
  function d3_time_interval(local, step, number) {
    function round(date) {
      var d0 = local(date), d1 = offset(d0, 1);
      return date - d0 < d1 - date ? d0 : d1;
    }
    function ceil(date) {
      step(date = local(new d3_date(date - 1)), 1);
      return date;
    }
    function offset(date, k) {
      step(date = new d3_date(+date), k);
      return date;
    }
    function range(t0, t1, dt) {
      var time = ceil(t0), times = [];
      if (dt > 1) {
        while (time < t1) {
          if (!(number(time) % dt)) times.push(new Date(+time));
          step(time, 1);
        }
      } else {
        while (time < t1) times.push(new Date(+time)), step(time, 1);
      }
      return times;
    }
    function range_utc(t0, t1, dt) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = t0;
        return range(utc, t1, dt);
      } finally {
        d3_date = Date;
      }
    }
    local.floor = local;
    local.round = round;
    local.ceil = ceil;
    local.offset = offset;
    local.range = range;
    var utc = local.utc = d3_time_interval_utc(local);
    utc.floor = utc;
    utc.round = d3_time_interval_utc(round);
    utc.ceil = d3_time_interval_utc(ceil);
    utc.offset = d3_time_interval_utc(offset);
    utc.range = range_utc;
    return local;
  }
  function d3_time_interval_utc(method) {
    return function(date, k) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = date;
        return method(utc, k)._;
      } finally {
        d3_date = Date;
      }
    };
  }
  d3_time.year = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setMonth(0, 1);
    return date;
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(date) {
    return date.getFullYear();
  });
  d3_time.years = d3_time.year.range;
  d3_time.years.utc = d3_time.year.utc.range;
  d3_time.day = d3_time_interval(function(date) {
    var day = new d3_date(2e3, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(date) {
    return date.getDate() - 1;
  });
  d3_time.days = d3_time.day.range;
  d3_time.days.utc = d3_time.day.utc.range;
  d3_time.dayOfYear = function(date) {
    var year = d3_time.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
  };
  [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
    i = 7 - i;
    var interval = d3_time[day] = d3_time_interval(function(date) {
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
      return date;
    }, function(date, offset) {
      date.setDate(date.getDate() + Math.floor(offset) * 7);
    }, function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
    });
    d3_time[day + "s"] = interval.range;
    d3_time[day + "s"].utc = interval.utc.range;
    d3_time[day + "OfYear"] = function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
    };
  });
  d3_time.week = d3_time.sunday;
  d3_time.weeks = d3_time.sunday.range;
  d3_time.weeks.utc = d3_time.sunday.utc.range;
  d3_time.weekOfYear = d3_time.sundayOfYear;
  function d3_locale_timeFormat(locale) {
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
    function d3_time_format(template) {
      var n = template.length;
      function format(date) {
        var string = [], i = -1, j = 0, c, p, f;
        while (++i < n) {
          if (template.charCodeAt(i) === 37) {
            string.push(template.slice(j, i));
            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
            if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
            string.push(c);
            j = i + 1;
          }
        }
        string.push(template.slice(j, i));
        return string.join("");
      }
      format.parse = function(string) {
        var d = {
          y: 1900,
          m: 0,
          d: 1,
          H: 0,
          M: 0,
          S: 0,
          L: 0,
          Z: null
        }, i = d3_time_parse(d, template, string, 0);
        if (i != string.length) return null;
        if ("p" in d) d.H = d.H % 12 + d.p * 12;
        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
        if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          date.setFullYear(d.y, 0, 1);
          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
        } else date.setFullYear(d.y, d.m, d.d);
        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
        return localZ ? date._ : date;
      };
      format.toString = function() {
        return template;
      };
      return format;
    }
    function d3_time_parse(date, template, string, j) {
      var c, p, t, i = 0, n = template.length, m = string.length;
      while (i < n) {
        if (j >= m) return -1;
        c = template.charCodeAt(i++);
        if (c === 37) {
          t = template.charAt(i++);
          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
          if (!p || (j = p(date, string, j)) < 0) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }
      return j;
    }
    d3_time_format.utc = function(template) {
      var local = d3_time_format(template);
      function format(date) {
        try {
          d3_date = d3_date_utc;
          var utc = new d3_date();
          utc._ = date;
          return local(utc);
        } finally {
          d3_date = Date;
        }
      }
      format.parse = function(string) {
        try {
          d3_date = d3_date_utc;
          var date = local.parse(string);
          return date && date._;
        } finally {
          d3_date = Date;
        }
      };
      format.toString = local.toString;
      return format;
    };
    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
    locale_periods.forEach(function(p, i) {
      d3_time_periodLookup.set(p.toLowerCase(), i);
    });
    var d3_time_formats = {
      a: function(d) {
        return locale_shortDays[d.getDay()];
      },
      A: function(d) {
        return locale_days[d.getDay()];
      },
      b: function(d) {
        return locale_shortMonths[d.getMonth()];
      },
      B: function(d) {
        return locale_months[d.getMonth()];
      },
      c: d3_time_format(locale_dateTime),
      d: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      e: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      H: function(d, p) {
        return d3_time_formatPad(d.getHours(), p, 2);
      },
      I: function(d, p) {
        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
      },
      j: function(d, p) {
        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
      },
      L: function(d, p) {
        return d3_time_formatPad(d.getMilliseconds(), p, 3);
      },
      m: function(d, p) {
        return d3_time_formatPad(d.getMonth() + 1, p, 2);
      },
      M: function(d, p) {
        return d3_time_formatPad(d.getMinutes(), p, 2);
      },
      p: function(d) {
        return locale_periods[+(d.getHours() >= 12)];
      },
      S: function(d, p) {
        return d3_time_formatPad(d.getSeconds(), p, 2);
      },
      U: function(d, p) {
        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
      },
      w: function(d) {
        return d.getDay();
      },
      W: function(d, p) {
        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
      },
      x: d3_time_format(locale_date),
      X: d3_time_format(locale_time),
      y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 100, p, 2);
      },
      Y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
      },
      Z: d3_time_zone,
      "%": function() {
        return "%";
      }
    };
    var d3_time_parsers = {
      a: d3_time_parseWeekdayAbbrev,
      A: d3_time_parseWeekday,
      b: d3_time_parseMonthAbbrev,
      B: d3_time_parseMonth,
      c: d3_time_parseLocaleFull,
      d: d3_time_parseDay,
      e: d3_time_parseDay,
      H: d3_time_parseHour24,
      I: d3_time_parseHour24,
      j: d3_time_parseDayOfYear,
      L: d3_time_parseMilliseconds,
      m: d3_time_parseMonthNumber,
      M: d3_time_parseMinutes,
      p: d3_time_parseAmPm,
      S: d3_time_parseSeconds,
      U: d3_time_parseWeekNumberSunday,
      w: d3_time_parseWeekdayNumber,
      W: d3_time_parseWeekNumberMonday,
      x: d3_time_parseLocaleDate,
      X: d3_time_parseLocaleTime,
      y: d3_time_parseYear,
      Y: d3_time_parseFullYear,
      Z: d3_time_parseZone,
      "%": d3_time_parseLiteralPercent
    };
    function d3_time_parseWeekdayAbbrev(date, string, i) {
      d3_time_dayAbbrevRe.lastIndex = 0;
      var n = d3_time_dayAbbrevRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseWeekday(date, string, i) {
      d3_time_dayRe.lastIndex = 0;
      var n = d3_time_dayRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonthAbbrev(date, string, i) {
      d3_time_monthAbbrevRe.lastIndex = 0;
      var n = d3_time_monthAbbrevRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonth(date, string, i) {
      d3_time_monthRe.lastIndex = 0;
      var n = d3_time_monthRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseLocaleFull(date, string, i) {
      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
    }
    function d3_time_parseLocaleDate(date, string, i) {
      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
    }
    function d3_time_parseLocaleTime(date, string, i) {
      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
    }
    function d3_time_parseAmPm(date, string, i) {
      var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
      return n == null ? -1 : (date.p = n, i);
    }
    return d3_time_format;
  }
  var d3_time_formatPads = {
    "-": "",
    _: " ",
    "0": "0"
  }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
  function d3_time_formatPad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  function d3_time_formatRe(names) {
    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
  }
  function d3_time_formatLookup(names) {
    var map = new d3_Map(), i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }
  function d3_time_parseWeekdayNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 1));
    return n ? (date.w = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberSunday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.U = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberMonday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.W = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseFullYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 4));
    return n ? (date.y = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
  }
  function d3_time_parseZone(date, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, 
    i + 5) : -1;
  }
  function d3_time_expandYear(d) {
    return d + (d > 68 ? 1900 : 2e3);
  }
  function d3_time_parseMonthNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
  }
  function d3_time_parseDay(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.d = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseDayOfYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.j = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseHour24(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.H = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMinutes(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.M = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseSeconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.S = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMilliseconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.L = +n[0], i + n[0].length) : -1;
  }
  function d3_time_zone(d) {
    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
  }
  function d3_time_parseLiteralPercent(date, string, i) {
    d3_time_percentRe.lastIndex = 0;
    var n = d3_time_percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }
  function d3_time_formatMulti(formats) {
    var n = formats.length, i = -1;
    while (++i < n) formats[i][0] = this(formats[i][0]);
    return function(date) {
      var i = 0, f = formats[i];
      while (!f[1](date)) f = formats[++i];
      return f[0](date);
    };
  }
  d3.locale = function(locale) {
    return {
      numberFormat: d3_locale_numberFormat(locale),
      timeFormat: d3_locale_timeFormat(locale)
    };
  };
  var d3_locale_enUS = d3.locale({
    decimal: ".",
    thousands: ",",
    grouping: [ 3 ],
    currency: [ "$", "" ],
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: [ "AM", "PM" ],
    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  });
  d3.format = d3_locale_enUS.numberFormat;
  d3.geo = {};
  function d3_adder() {}
  d3_adder.prototype = {
    s: 0,
    t: 0,
    add: function(y) {
      d3_adderSum(y, this.t, d3_adderTemp);
      d3_adderSum(d3_adderTemp.s, this.s, this);
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
    },
    reset: function() {
      this.s = this.t = 0;
    },
    valueOf: function() {
      return this.s;
    }
  };
  var d3_adderTemp = new d3_adder();
  function d3_adderSum(a, b, o) {
    var x = o.s = a + b, bv = x - a, av = x - bv;
    o.t = a - av + (b - bv);
  }
  d3.geo.stream = function(object, listener) {
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
      d3_geo_streamObjectType[object.type](object, listener);
    } else {
      d3_geo_streamGeometry(object, listener);
    }
  };
  function d3_geo_streamGeometry(geometry, listener) {
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
      d3_geo_streamGeometryType[geometry.type](geometry, listener);
    }
  }
  var d3_geo_streamObjectType = {
    Feature: function(feature, listener) {
      d3_geo_streamGeometry(feature.geometry, listener);
    },
    FeatureCollection: function(object, listener) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
    }
  };
  var d3_geo_streamGeometryType = {
    Sphere: function(object, listener) {
      listener.sphere();
    },
    Point: function(object, listener) {
      object = object.coordinates;
      listener.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
    },
    LineString: function(object, listener) {
      d3_geo_streamLine(object.coordinates, listener, 0);
    },
    MultiLineString: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
    },
    Polygon: function(object, listener) {
      d3_geo_streamPolygon(object.coordinates, listener);
    },
    MultiPolygon: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
    },
    GeometryCollection: function(object, listener) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
    }
  };
  function d3_geo_streamLine(coordinates, listener, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    listener.lineStart();
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
    listener.lineEnd();
  }
  function d3_geo_streamPolygon(coordinates, listener) {
    var i = -1, n = coordinates.length;
    listener.polygonStart();
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
    listener.polygonEnd();
  }
  d3.geo.area = function(object) {
    d3_geo_areaSum = 0;
    d3.geo.stream(object, d3_geo_area);
    return d3_geo_areaSum;
  };
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
  var d3_geo_area = {
    sphere: function() {
      d3_geo_areaSum += 4 * π;
    },
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_areaRingSum.reset();
      d3_geo_area.lineStart = d3_geo_areaRingStart;
    },
    polygonEnd: function() {
      var area = 2 * d3_geo_areaRingSum;
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
    }
  };
  function d3_geo_areaRingStart() {
    var λ00, φ00, λ0, cosφ0, sinφ0;
    d3_geo_area.point = function(λ, φ) {
      d3_geo_area.point = nextPoint;
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
      sinφ0 = Math.sin(φ);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      φ = φ * d3_radians / 2 + π / 4;
      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
      d3_geo_areaRingSum.add(Math.atan2(v, u));
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
    }
    d3_geo_area.lineEnd = function() {
      nextPoint(λ00, φ00);
    };
  }
  function d3_geo_cartesian(spherical) {
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
  }
  function d3_geo_cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function d3_geo_cartesianCross(a, b) {
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
  }
  function d3_geo_cartesianAdd(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
  }
  function d3_geo_cartesianScale(vector, k) {
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
  }
  function d3_geo_cartesianNormalize(d) {
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l;
    d[1] /= l;
    d[2] /= l;
  }
  function d3_geo_spherical(cartesian) {
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
  }
  function d3_geo_sphericalEqual(a, b) {
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
  }
  d3.geo.bounds = function() {
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
    var bound = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        bound.point = ringPoint;
        bound.lineStart = ringStart;
        bound.lineEnd = ringEnd;
        dλSum = 0;
        d3_geo_area.polygonStart();
      },
      polygonEnd: function() {
        d3_geo_area.polygonEnd();
        bound.point = point;
        bound.lineStart = lineStart;
        bound.lineEnd = lineEnd;
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
        range[0] = λ0, range[1] = λ1;
      }
    };
    function point(λ, φ) {
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
      if (φ < φ0) φ0 = φ;
      if (φ > φ1) φ1 = φ;
    }
    function linePoint(λ, φ) {
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
      if (p0) {
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
        d3_geo_cartesianNormalize(inflection);
        inflection = d3_geo_spherical(inflection);
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = inflection[1] * d3_degrees;
          if (φi > φ1) φ1 = φi;
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = -inflection[1] * d3_degrees;
          if (φi < φ0) φ0 = φi;
        } else {
          if (φ < φ0) φ0 = φ;
          if (φ > φ1) φ1 = φ;
        }
        if (antimeridian) {
          if (λ < λ_) {
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
          } else {
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
          }
        } else {
          if (λ1 >= λ0) {
            if (λ < λ0) λ0 = λ;
            if (λ > λ1) λ1 = λ;
          } else {
            if (λ > λ_) {
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
            } else {
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
            }
          }
        }
      } else {
        point(λ, φ);
      }
      p0 = p, λ_ = λ;
    }
    function lineStart() {
      bound.point = linePoint;
    }
    function lineEnd() {
      range[0] = λ0, range[1] = λ1;
      bound.point = point;
      p0 = null;
    }
    function ringPoint(λ, φ) {
      if (p0) {
        var dλ = λ - λ_;
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
      } else λ__ = λ, φ__ = φ;
      d3_geo_area.point(λ, φ);
      linePoint(λ, φ);
    }
    function ringStart() {
      d3_geo_area.lineStart();
    }
    function ringEnd() {
      ringPoint(λ__, φ__);
      d3_geo_area.lineEnd();
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
      range[0] = λ0, range[1] = λ1;
      p0 = null;
    }
    function angle(λ0, λ1) {
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
    }
    function compareRanges(a, b) {
      return a[0] - b[0];
    }
    function withinRange(x, range) {
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
    }
    return function(feature) {
      φ1 = λ1 = -(λ0 = φ0 = Infinity);
      ranges = [];
      d3.geo.stream(feature, bound);
      var n = ranges.length;
      if (n) {
        ranges.sort(compareRanges);
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
          b = ranges[i];
          if (withinRange(b[0], a) || withinRange(b[1], a)) {
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
          } else {
            merged.push(a = b);
          }
        }
        var best = -Infinity, dλ;
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
          b = merged[i];
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
        }
      }
      ranges = range = null;
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
    };
  }();
  d3.geo.centroid = function(object) {
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
    d3.geo.stream(object, d3_geo_centroid);
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
    if (m < ε2) {
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
      m = x * x + y * y + z * z;
      if (m < ε2) return [ NaN, NaN ];
    }
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
  };
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
  var d3_geo_centroid = {
    sphere: d3_noop,
    point: d3_geo_centroidPoint,
    lineStart: d3_geo_centroidLineStart,
    lineEnd: d3_geo_centroidLineEnd,
    polygonStart: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
    }
  };
  function d3_geo_centroidPoint(λ, φ) {
    λ *= d3_radians;
    var cosφ = Math.cos(φ *= d3_radians);
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
  }
  function d3_geo_centroidPointXYZ(x, y, z) {
    ++d3_geo_centroidW0;
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
  }
  function d3_geo_centroidLineStart() {
    var x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroid.point = nextPoint;
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_centroidLineEnd() {
    d3_geo_centroid.point = d3_geo_centroidPoint;
  }
  function d3_geo_centroidRingStart() {
    var λ00, φ00, x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ00 = λ, φ00 = φ;
      d3_geo_centroid.point = nextPoint;
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    d3_geo_centroid.lineEnd = function() {
      nextPoint(λ00, φ00);
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
      d3_geo_centroid.point = d3_geo_centroidPoint;
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
      d3_geo_centroidX2 += v * cx;
      d3_geo_centroidY2 += v * cy;
      d3_geo_centroidZ2 += v * cz;
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_compose(a, b) {
    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }
    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
    return compose;
  }
  function d3_true() {
    return true;
  }
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
    var subject = [], clip = [];
    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n];
      if (d3_geo_sphericalEqual(p0, p1)) {
        listener.lineStart();
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
        listener.lineEnd();
        return;
      }
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
      a.o = b;
      subject.push(a);
      clip.push(b);
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
      a.o = b;
      subject.push(a);
      clip.push(b);
    });
    clip.sort(compare);
    d3_geo_clipPolygonLinkCircular(subject);
    d3_geo_clipPolygonLinkCircular(clip);
    if (!subject.length) return;
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
      clip[i].e = entry = !entry;
    }
    var start = subject[0], points, point;
    while (1) {
      var current = start, isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      listener.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, listener);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, listener);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      listener.lineEnd();
    }
  }
  function d3_geo_clipPolygonLinkCircular(array) {
    if (!(n = array.length)) return;
    var n, i = 0, a = array[0], b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other;
    this.e = entry;
    this.v = false;
    this.n = this.p = null;
  }
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
    return function(rotate, listener) {
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = d3.merge(segments);
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
          if (segments.length) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
          } else if (clipStartInside) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            interpolate(null, null, 1, listener);
            listener.lineEnd();
          }
          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        },
        sphere: function() {
          listener.polygonStart();
          listener.lineStart();
          interpolate(null, null, 1, listener);
          listener.lineEnd();
          listener.polygonEnd();
        }
      };
      function point(λ, φ) {
        var point = rotate(λ, φ);
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
      }
      function pointLine(λ, φ) {
        var point = rotate(λ, φ);
        line.point(point[0], point[1]);
      }
      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }
      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }
      var segments;
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;
      function pointRing(λ, φ) {
        ring.push([ λ, φ ]);
        var point = rotate(λ, φ);
        ringListener.point(point[0], point[1]);
      }
      function ringStart() {
        ringListener.lineStart();
        ring = [];
      }
      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringListener.lineEnd();
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
        ring.pop();
        polygon.push(ring);
        ring = null;
        if (!n) return;
        if (clean & 1) {
          segment = ringSegments[0];
          var n = segment.length - 1, i = -1, point;
          if (n > 0) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            while (++i < n) listener.point((point = segment[i])[0], point[1]);
            listener.lineEnd();
          }
          return;
        }
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
      }
      return clip;
    };
  }
  function d3_geo_clipSegmentLength1(segment) {
    return segment.length > 1;
  }
  function d3_geo_clipBufferListener() {
    var lines = [], line;
    return {
      lineStart: function() {
        lines.push(line = []);
      },
      point: function(λ, φ) {
        line.push([ λ, φ ]);
      },
      lineEnd: d3_noop,
      buffer: function() {
        var buffer = lines;
        lines = [];
        line = null;
        return buffer;
      },
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      }
    };
  }
  function d3_geo_clipSort(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
  }
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);
  function d3_geo_clipAntimeridianLine(listener) {
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
    return {
      lineStart: function() {
        listener.lineStart();
        clean = 1;
      },
      point: function(λ1, φ1) {
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
        if (abs(dλ - π) < ε) {
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          listener.point(λ1, φ0);
          clean = 0;
        } else if (sλ0 !== sλ1 && dλ >= π) {
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          clean = 0;
        }
        listener.point(λ0 = λ1, φ0 = φ1);
        sλ0 = sλ1;
      },
      lineEnd: function() {
        listener.lineEnd();
        λ0 = φ0 = NaN;
      },
      clean: function() {
        return 2 - clean;
      }
    };
  }
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
  }
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
    var φ;
    if (from == null) {
      φ = direction * halfπ;
      listener.point(-π, φ);
      listener.point(0, φ);
      listener.point(π, φ);
      listener.point(π, 0);
      listener.point(π, -φ);
      listener.point(0, -φ);
      listener.point(-π, -φ);
      listener.point(-π, 0);
      listener.point(-π, φ);
    } else if (abs(from[0] - to[0]) > ε) {
      var s = from[0] < to[0] ? π : -π;
      φ = direction * s / 2;
      listener.point(-s, φ);
      listener.point(0, φ);
      listener.point(s, φ);
    } else {
      listener.point(to[0], to[1]);
    }
  }
  function d3_geo_pointInPolygon(point, polygon) {
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;
    d3_geo_areaRingSum.reset();
    for (var i = 0, n = polygon.length; i < n; ++i) {
      var ring = polygon[i], m = ring.length;
      if (!m) continue;
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
      while (true) {
        if (j === m) j = 0;
        point = ring[j];
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;
        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));
        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
          d3_geo_cartesianNormalize(arc);
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
          d3_geo_cartesianNormalize(intersection);
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
          }
        }
        if (!j++) break;
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
      }
    }
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < -ε) ^ winding & 1;
  }
  function d3_geo_clipCircle(radius) {
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);
    function visible(λ, φ) {
      return Math.cos(λ) * Math.cos(φ) > cr;
    }
    function clipLine(listener) {
      var point0, c0, v0, v00, clean;
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(λ, φ) {
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
          if (!point0 && (v00 = v0 = v)) listener.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
              point1[0] += ε;
              point1[1] += ε;
              v = visible(point1[0], point1[1]);
            }
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              listener.lineStart();
              point2 = intersect(point1, point0);
              listener.point(point2[0], point2[1]);
            } else {
              point2 = intersect(point0, point1);
              listener.point(point2[0], point2[1]);
              listener.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
              } else {
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
              }
            }
          }
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
            listener.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) listener.lineEnd();
          point0 = null;
        },
        clean: function() {
          return clean | (v00 && v0) << 1;
        }
      };
    }
    function intersect(a, b, two) {
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
      if (!determinant) return !two && a;
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
      d3_geo_cartesianAdd(A, B);
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
      if (t2 < 0) return;
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
      d3_geo_cartesianAdd(q, A);
      q = d3_geo_spherical(q);
      if (!two) return q;
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
        d3_geo_cartesianAdd(q1, A);
        return [ q, d3_geo_spherical(q1) ];
      }
    }
    function code(λ, φ) {
      var r = smallRadius ? radius : π - radius, code = 0;
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
      return code;
    }
  }
  function d3_geom_clipLine(x0, y0, x1, y1) {
    return function(line) {
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;
      r = x0 - ax;
      if (!dx && r > 0) return;
      r /= dx;
      if (dx < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dx > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = x1 - ax;
      if (!dx && r < 0) return;
      r /= dx;
      if (dx < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dx > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      r = y0 - ay;
      if (!dy && r > 0) return;
      r /= dy;
      if (dy < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dy > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = y1 - ay;
      if (!dy && r < 0) return;
      r /= dy;
      if (dy < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dy > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      if (t0 > 0) line.a = {
        x: ax + t0 * dx,
        y: ay + t0 * dy
      };
      if (t1 < 1) line.b = {
        x: ax + t1 * dx,
        y: ay + t1 * dy
      };
      return line;
    };
  }
  var d3_geo_clipExtentMAX = 1e9;
  d3.geo.clipExtent = function() {
    var x0, y0, x1, y1, stream, clip, clipExtent = {
      stream: function(output) {
        if (stream) stream.valid = false;
        stream = clip(output);
        stream.valid = true;
        return stream;
      },
      extent: function(_) {
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
        if (stream) stream.valid = false, stream = null;
        return clipExtent;
      }
    };
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);
  };
  function d3_geo_clipExtent(x0, y0, x1, y1) {
    return function(listener) {
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          listener = bufferListener;
          segments = [];
          polygon = [];
          clean = true;
        },
        polygonEnd: function() {
          listener = listener_;
          segments = d3.merge(segments);
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;
          if (inside || visible) {
            listener.polygonStart();
            if (inside) {
              listener.lineStart();
              interpolate(null, null, 1, listener);
              listener.lineEnd();
            }
            if (visible) {
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
            }
            listener.polygonEnd();
          }
          segments = polygon = ring = null;
        }
      };
      function insidePolygon(p) {
        var wn = 0, n = polygon.length, y = p[1];
        for (var i = 0; i < n; ++i) {
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
            b = v[j];
            if (a[1] <= y) {
              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;
            } else {
              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;
            }
            a = b;
          }
        }
        return wn !== 0;
      }
      function interpolate(from, to, direction, listener) {
        var a = 0, a1 = 0;
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
          do {
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
          } while ((a = (a + direction + 4) % 4) !== a1);
        } else {
          listener.point(to[0], to[1]);
        }
      }
      function pointVisible(x, y) {
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
      }
      function point(x, y) {
        if (pointVisible(x, y)) listener.point(x, y);
      }
      var x__, y__, v__, x_, y_, v_, first, clean;
      function lineStart() {
        clip.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferListener.rejoin();
          segments.push(bufferListener.buffer());
        }
        clip.point = point;
        if (v_) listener.lineEnd();
      }
      function linePoint(x, y) {
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
        var v = pointVisible(x, y);
        if (polygon) ring.push([ x, y ]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            listener.lineStart();
            listener.point(x, y);
          }
        } else {
          if (v && v_) listener.point(x, y); else {
            var l = {
              a: {
                x: x_,
                y: y_
              },
              b: {
                x: x,
                y: y
              }
            };
            if (clipLine(l)) {
              if (!v_) {
                listener.lineStart();
                listener.point(l.a.x, l.a.y);
              }
              listener.point(l.b.x, l.b.y);
              if (!v) listener.lineEnd();
              clean = false;
            } else if (v) {
              listener.lineStart();
              listener.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }
      return clip;
    };
    function corner(p, direction) {
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
    }
    function compare(a, b) {
      return comparePoints(a.x, b.x);
    }
    function comparePoints(a, b) {
      var ca = corner(a, 1), cb = corner(b, 1);
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
    }
  }
  function d3_geo_conic(projectAt) {
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
    p.parallels = function(_) {
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };
    return p;
  }
  function d3_geo_conicEqualArea(φ0, φ1) {
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
    function forward(λ, φ) {
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = ρ0 - y;
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
    };
    return forward;
  }
  (d3.geo.conicEqualArea = function() {
    return d3_geo_conic(d3_geo_conicEqualArea);
  }).raw = d3_geo_conicEqualArea;
  d3.geo.albers = function() {
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
  };
  d3.geo.albersUsa = function() {
    var lower48 = d3.geo.albers();
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
    var point, pointStream = {
      point: function(x, y) {
        point = [ x, y ];
      }
    }, lower48Point, alaskaPoint, hawaiiPoint;
    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      point = null;
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
      return point;
    }
    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
    };
    albersUsa.stream = function(stream) {
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
      return {
        point: function(x, y) {
          lower48Stream.point(x, y);
          alaskaStream.point(x, y);
          hawaiiStream.point(x, y);
        },
        sphere: function() {
          lower48Stream.sphere();
          alaskaStream.sphere();
          hawaiiStream.sphere();
        },
        lineStart: function() {
          lower48Stream.lineStart();
          alaskaStream.lineStart();
          hawaiiStream.lineStart();
        },
        lineEnd: function() {
          lower48Stream.lineEnd();
          alaskaStream.lineEnd();
          hawaiiStream.lineEnd();
        },
        polygonStart: function() {
          lower48Stream.polygonStart();
          alaskaStream.polygonStart();
          hawaiiStream.polygonStart();
        },
        polygonEnd: function() {
          lower48Stream.polygonEnd();
          alaskaStream.polygonEnd();
          hawaiiStream.polygonEnd();
        }
      };
    };
    albersUsa.precision = function(_) {
      if (!arguments.length) return lower48.precision();
      lower48.precision(_);
      alaska.precision(_);
      hawaii.precision(_);
      return albersUsa;
    };
    albersUsa.scale = function(_) {
      if (!arguments.length) return lower48.scale();
      lower48.scale(_);
      alaska.scale(_ * .35);
      hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };
    albersUsa.translate = function(_) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      return albersUsa;
    };
    return albersUsa.scale(1070);
  };
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_pathAreaPolygon = 0;
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
    }
  };
  function d3_geo_pathAreaRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathArea.point = function(x, y) {
      d3_geo_pathArea.point = nextPoint;
      x00 = x0 = x, y00 = y0 = y;
    };
    function nextPoint(x, y) {
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
      x0 = x, y0 = y;
    }
    d3_geo_pathArea.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
  var d3_geo_pathBounds = {
    point: d3_geo_pathBoundsPoint,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_pathBoundsPoint(x, y) {
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
  }
  function d3_geo_pathBuffer() {
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointCircle = d3_geo_pathBufferCircle(_);
        return stream;
      },
      result: function() {
        if (buffer.length) {
          var result = buffer.join("");
          buffer = [];
          return result;
        }
      }
    };
    function point(x, y) {
      buffer.push("M", x, ",", y, pointCircle);
    }
    function pointLineStart(x, y) {
      buffer.push("M", x, ",", y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      buffer.push("L", x, ",", y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      buffer.push("Z");
    }
    return stream;
  }
  function d3_geo_pathBufferCircle(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
  }
  var d3_geo_pathCentroid = {
    point: d3_geo_pathCentroidPoint,
    lineStart: d3_geo_pathCentroidLineStart,
    lineEnd: d3_geo_pathCentroidLineEnd,
    polygonStart: function() {
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
    }
  };
  function d3_geo_pathCentroidPoint(x, y) {
    d3_geo_centroidX0 += x;
    d3_geo_centroidY0 += y;
    ++d3_geo_centroidZ0;
  }
  function d3_geo_pathCentroidLineStart() {
    var x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
  }
  function d3_geo_pathCentroidLineEnd() {
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
  }
  function d3_geo_pathCentroidRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      z = y0 * x - x0 * y;
      d3_geo_centroidX2 += z * (x0 + x);
      d3_geo_centroidY2 += z * (y0 + y);
      d3_geo_centroidZ2 += z * 3;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
    d3_geo_pathCentroid.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  function d3_geo_pathContext(context) {
    var pointRadius = 4.5;
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointRadius = _;
        return stream;
      },
      result: d3_noop
    };
    function point(x, y) {
      context.moveTo(x + pointRadius, y);
      context.arc(x, y, pointRadius, 0, τ);
    }
    function pointLineStart(x, y) {
      context.moveTo(x, y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      context.lineTo(x, y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      context.closePath();
    }
    return stream;
  }
  function d3_geo_resample(project) {
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
    function resample(stream) {
      return (maxDepth ? resampleRecursive : resampleNone)(stream);
    }
    function resampleNone(stream) {
      return d3_geo_transformPoint(stream, function(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      });
    }
    function resampleRecursive(stream) {
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
      var resample = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          stream.polygonStart();
          resample.lineStart = ringStart;
        },
        polygonEnd: function() {
          stream.polygonEnd();
          resample.lineStart = lineStart;
        }
      };
      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }
      function lineStart() {
        x0 = NaN;
        resample.point = linePoint;
        stream.lineStart();
      }
      function linePoint(λ, φ) {
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }
      function lineEnd() {
        resample.point = point;
        stream.lineEnd();
      }
      function ringStart() {
        lineStart();
        resample.point = ringPoint;
        resample.lineEnd = ringEnd;
      }
      function ringPoint(λ, φ) {
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resample.point = linePoint;
      }
      function ringEnd() {
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
        resample.lineEnd = lineEnd;
        lineEnd();
      }
      return resample;
    }
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
      if (d2 > 4 * δ2 && depth--) {
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
        }
      }
    }
    resample.precision = function(_) {
      if (!arguments.length) return Math.sqrt(δ2);
      maxDepth = (δ2 = _ * _) > 0 && 16;
      return resample;
    };
    return resample;
  }
  d3.geo.path = function() {
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
        d3.geo.stream(object, cacheStream);
      }
      return contextStream.result();
    }
    path.area = function(object) {
      d3_geo_pathAreaSum = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathArea));
      return d3_geo_pathAreaSum;
    };
    path.centroid = function(object) {
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
    };
    path.bounds = function(object) {
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
    };
    path.projection = function(_) {
      if (!arguments.length) return projection;
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
      return reset();
    };
    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return reset();
    };
    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };
    function reset() {
      cacheStream = null;
      return path;
    }
    return path.projection(d3.geo.albersUsa()).context(null);
  };
  function d3_geo_pathProjectStream(project) {
    var resample = d3_geo_resample(function(x, y) {
      return project([ x * d3_degrees, y * d3_degrees ]);
    });
    return function(stream) {
      return d3_geo_projectionRadians(resample(stream));
    };
  }
  d3.geo.transform = function(methods) {
    return {
      stream: function(stream) {
        var transform = new d3_geo_transform(stream);
        for (var k in methods) transform[k] = methods[k];
        return transform;
      }
    };
  };
  function d3_geo_transform(stream) {
    this.stream = stream;
  }
  d3_geo_transform.prototype = {
    point: function(x, y) {
      this.stream.point(x, y);
    },
    sphere: function() {
      this.stream.sphere();
    },
    lineStart: function() {
      this.stream.lineStart();
    },
    lineEnd: function() {
      this.stream.lineEnd();
    },
    polygonStart: function() {
      this.stream.polygonStart();
    },
    polygonEnd: function() {
      this.stream.polygonEnd();
    }
  };
  function d3_geo_transformPoint(stream, point) {
    return {
      point: point,
      sphere: function() {
        stream.sphere();
      },
      lineStart: function() {
        stream.lineStart();
      },
      lineEnd: function() {
        stream.lineEnd();
      },
      polygonStart: function() {
        stream.polygonStart();
      },
      polygonEnd: function() {
        stream.polygonEnd();
      }
    };
  }
  d3.geo.projection = d3_geo_projection;
  d3.geo.projectionMutator = d3_geo_projectionMutator;
  function d3_geo_projection(project) {
    return d3_geo_projectionMutator(function() {
      return project;
    })();
  }
  function d3_geo_projectionMutator(projectAt) {
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
      x = project(x, y);
      return [ x[0] * k + δx, δy - x[1] * k ];
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
    function projection(point) {
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
      return [ point[0] * k + δx, δy - point[1] * k ];
    }
    function invert(point) {
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
    }
    projection.stream = function(output) {
      if (stream) stream.valid = false;
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
      stream.valid = true;
      return stream;
    };
    projection.clipAngle = function(_) {
      if (!arguments.length) return clipAngle;
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
      return invalidate();
    };
    projection.clipExtent = function(_) {
      if (!arguments.length) return clipExtent;
      clipExtent = _;
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
      return invalidate();
    };
    projection.scale = function(_) {
      if (!arguments.length) return k;
      k = +_;
      return reset();
    };
    projection.translate = function(_) {
      if (!arguments.length) return [ x, y ];
      x = +_[0];
      y = +_[1];
      return reset();
    };
    projection.center = function(_) {
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
      λ = _[0] % 360 * d3_radians;
      φ = _[1] % 360 * d3_radians;
      return reset();
    };
    projection.rotate = function(_) {
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
      δλ = _[0] % 360 * d3_radians;
      δφ = _[1] % 360 * d3_radians;
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
      return reset();
    };
    d3.rebind(projection, projectResample, "precision");
    function reset() {
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
      var center = project(λ, φ);
      δx = x - center[0] * k;
      δy = y + center[1] * k;
      return invalidate();
    }
    function invalidate() {
      if (stream) stream.valid = false, stream = null;
      return projection;
    }
    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return reset();
    };
  }
  function d3_geo_projectionRadians(stream) {
    return d3_geo_transformPoint(stream, function(x, y) {
      stream.point(x * d3_radians, y * d3_radians);
    });
  }
  function d3_geo_equirectangular(λ, φ) {
    return [ λ, φ ];
  }
  (d3.geo.equirectangular = function() {
    return d3_geo_projection(d3_geo_equirectangular);
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
  d3.geo.rotation = function(rotate) {
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
    function forward(coordinates) {
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    }
    forward.invert = function(coordinates) {
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    };
    return forward;
  };
  function d3_geo_identityRotation(λ, φ) {
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
  }
  d3_geo_identityRotation.invert = d3_geo_equirectangular;
  function d3_geo_rotation(δλ, δφ, δγ) {
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
  }
  function d3_geo_forwardRotationλ(δλ) {
    return function(λ, φ) {
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
    };
  }
  function d3_geo_rotationλ(δλ) {
    var rotation = d3_geo_forwardRotationλ(δλ);
    rotation.invert = d3_geo_forwardRotationλ(-δλ);
    return rotation;
  }
  function d3_geo_rotationφγ(δφ, δγ) {
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
    function rotation(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
    }
    rotation.invert = function(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
    };
    return rotation;
  }
  d3.geo.circle = function() {
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
    function circle() {
      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
      interpolate(null, null, 1, {
        point: function(x, y) {
          ring.push(x = rotate(x, y));
          x[0] *= d3_degrees, x[1] *= d3_degrees;
        }
      });
      return {
        type: "Polygon",
        coordinates: [ ring ]
      };
    }
    circle.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return circle;
    };
    circle.angle = function(x) {
      if (!arguments.length) return angle;
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
      return circle;
    };
    circle.precision = function(_) {
      if (!arguments.length) return precision;
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
      return circle;
    };
    return circle.angle(90);
  };
  function d3_geo_circleInterpolate(radius, precision) {
    var cr = Math.cos(radius), sr = Math.sin(radius);
    return function(from, to, direction, listener) {
      var step = direction * precision;
      if (from != null) {
        from = d3_geo_circleAngle(cr, from);
        to = d3_geo_circleAngle(cr, to);
        if (direction > 0 ? from < to : from > to) from += direction * τ;
      } else {
        from = radius + direction * τ;
        to = radius - .5 * step;
      }
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
      }
    };
  }
  function d3_geo_circleAngle(cr, point) {
    var a = d3_geo_cartesian(point);
    a[0] -= cr;
    d3_geo_cartesianNormalize(a);
    var angle = d3_acos(-a[1]);
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
  }
  d3.geo.distance = function(a, b) {
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
  };
  d3.geo.graticule = function() {
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
    function graticule() {
      return {
        type: "MultiLineString",
        coordinates: lines()
      };
    }
    function lines() {
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return abs(x % DX) > ε;
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
        return abs(y % DY) > ε;
      }).map(y));
    }
    graticule.lines = function() {
      return lines().map(function(coordinates) {
        return {
          type: "LineString",
          coordinates: coordinates
        };
      });
    };
    graticule.outline = function() {
      return {
        type: "Polygon",
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
      };
    };
    graticule.extent = function(_) {
      if (!arguments.length) return graticule.minorExtent();
      return graticule.majorExtent(_).minorExtent(_);
    };
    graticule.majorExtent = function(_) {
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    };
    graticule.minorExtent = function(_) {
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    };
    graticule.step = function(_) {
      if (!arguments.length) return graticule.minorStep();
      return graticule.majorStep(_).minorStep(_);
    };
    graticule.majorStep = function(_) {
      if (!arguments.length) return [ DX, DY ];
      DX = +_[0], DY = +_[1];
      return graticule;
    };
    graticule.minorStep = function(_) {
      if (!arguments.length) return [ dx, dy ];
      dx = +_[0], dy = +_[1];
      return graticule;
    };
    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = +_;
      x = d3_geo_graticuleX(y0, y1, 90);
      y = d3_geo_graticuleY(x0, x1, precision);
      X = d3_geo_graticuleX(Y0, Y1, 90);
      Y = d3_geo_graticuleY(X0, X1, precision);
      return graticule;
    };
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
  };
  function d3_geo_graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - ε, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [ x, y ];
      });
    };
  }
  function d3_geo_graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - ε, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [ x, y ];
      });
    };
  }
  function d3_source(d) {
    return d.source;
  }
  function d3_target(d) {
    return d.target;
  }
  d3.geo.greatArc = function() {
    var source = d3_source, source_, target = d3_target, target_;
    function greatArc() {
      return {
        type: "LineString",
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
      };
    }
    greatArc.distance = function() {
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
    };
    greatArc.source = function(_) {
      if (!arguments.length) return source;
      source = _, source_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.target = function(_) {
      if (!arguments.length) return target;
      target = _, target_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.precision = function() {
      return arguments.length ? greatArc : 0;
    };
    return greatArc;
  };
  d3.geo.interpolate = function(source, target) {
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
  };
  function d3_geo_interpolate(x0, y0, x1, y1) {
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
    var interpolate = d ? function(t) {
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
    } : function() {
      return [ x0 * d3_degrees, y0 * d3_degrees ];
    };
    interpolate.distance = d;
    return interpolate;
  }
  d3.geo.length = function(object) {
    d3_geo_lengthSum = 0;
    d3.geo.stream(object, d3_geo_length);
    return d3_geo_lengthSum;
  };
  var d3_geo_lengthSum;
  var d3_geo_length = {
    sphere: d3_noop,
    point: d3_noop,
    lineStart: d3_geo_lengthLineStart,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_lengthLineStart() {
    var λ0, sinφ0, cosφ0;
    d3_geo_length.point = function(λ, φ) {
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
      d3_geo_length.point = nextPoint;
    };
    d3_geo_length.lineEnd = function() {
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
    };
    function nextPoint(λ, φ) {
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
    }
  }
  function d3_geo_azimuthal(scale, angle) {
    function azimuthal(λ, φ) {
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
    }
    azimuthal.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
    };
    return azimuthal;
  }
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  }, function(ρ) {
    return 2 * Math.asin(ρ / 2);
  });
  (d3.geo.azimuthalEqualArea = function() {
    return d3_geo_projection(d3_geo_azimuthalEqualArea);
  }).raw = d3_geo_azimuthalEqualArea;
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  }, d3_identity);
  (d3.geo.azimuthalEquidistant = function() {
    return d3_geo_projection(d3_geo_azimuthalEquidistant);
  }).raw = d3_geo_azimuthalEquidistant;
  function d3_geo_conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), t = function(φ) {
      return Math.tan(π / 4 + φ / 2);
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
    if (!n) return d3_geo_mercator;
    function forward(λ, φ) {
      if (F > 0) {
        if (φ < -halfπ + ε) φ = -halfπ + ε;
      } else {
        if (φ > halfπ - ε) φ = halfπ - ε;
      }
      var ρ = F / Math.pow(t(φ), n);
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
    };
    return forward;
  }
  (d3.geo.conicConformal = function() {
    return d3_geo_conic(d3_geo_conicConformal);
  }).raw = d3_geo_conicConformal;
  function d3_geo_conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
    if (abs(n) < ε) return d3_geo_equirectangular;
    function forward(λ, φ) {
      var ρ = G - φ;
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
    };
    return forward;
  }
  (d3.geo.conicEquidistant = function() {
    return d3_geo_conic(d3_geo_conicEquidistant);
  }).raw = d3_geo_conicEquidistant;
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  }, Math.atan);
  (d3.geo.gnomonic = function() {
    return d3_geo_projection(d3_geo_gnomonic);
  }).raw = d3_geo_gnomonic;
  function d3_geo_mercator(λ, φ) {
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
  }
  d3_geo_mercator.invert = function(x, y) {
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
  };
  function d3_geo_mercatorProjection(project) {
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
    m.scale = function() {
      var v = scale.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.translate = function() {
      var v = translate.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.clipExtent = function(_) {
      var v = clipExtent.apply(m, arguments);
      if (v === m) {
        if (clipAuto = _ == null) {
          var k = π * scale(), t = translate();
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
        }
      } else if (clipAuto) {
        v = null;
      }
      return v;
    };
    return m.clipExtent(null);
  }
  (d3.geo.mercator = function() {
    return d3_geo_mercatorProjection(d3_geo_mercator);
  }).raw = d3_geo_mercator;
  var d3_geo_orthographic = d3_geo_azimuthal(function() {
    return 1;
  }, Math.asin);
  (d3.geo.orthographic = function() {
    return d3_geo_projection(d3_geo_orthographic);
  }).raw = d3_geo_orthographic;
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  }, function(ρ) {
    return 2 * Math.atan(ρ);
  });
  (d3.geo.stereographic = function() {
    return d3_geo_projection(d3_geo_stereographic);
  }).raw = d3_geo_stereographic;
  function d3_geo_transverseMercator(λ, φ) {
    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];
  }
  d3_geo_transverseMercator.invert = function(x, y) {
    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];
  };
  (d3.geo.transverseMercator = function() {
    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
    projection.center = function(_) {
      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);
    };
    projection.rotate = function(_) {
      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), 
      [ _[0], _[1], _[2] - 90 ]);
    };
    return rotate([ 0, 0, 90 ]);
  }).raw = d3_geo_transverseMercator;
  d3.geom = {};
  function d3_geom_pointX(d) {
    return d[0];
  }
  function d3_geom_pointY(d) {
    return d[1];
  }
  d3.geom.hull = function(vertices) {
    var x = d3_geom_pointX, y = d3_geom_pointY;
    if (arguments.length) return hull(vertices);
    function hull(data) {
      if (data.length < 3) return [];
      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];
      for (i = 0; i < n; i++) {
        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);
      }
      points.sort(d3_geom_hullOrder);
      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);
      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);
      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
      return polygon;
    }
    hull.x = function(_) {
      return arguments.length ? (x = _, hull) : x;
    };
    hull.y = function(_) {
      return arguments.length ? (y = _, hull) : y;
    };
    return hull;
  };
  function d3_geom_hullUpper(points) {
    var n = points.length, hull = [ 0, 1 ], hs = 2;
    for (var i = 2; i < n; i++) {
      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;
      hull[hs++] = i;
    }
    return hull.slice(0, hs);
  }
  function d3_geom_hullOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  }
  d3.geom.polygon = function(coordinates) {
    d3_subclass(coordinates, d3_geom_polygonPrototype);
    return coordinates;
  };
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
  d3_geom_polygonPrototype.area = function() {
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
    while (++i < n) {
      a = b;
      b = this[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area * .5;
  };
  d3_geom_polygonPrototype.centroid = function(k) {
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
    if (!arguments.length) k = -1 / (6 * this.area());
    while (++i < n) {
      a = b;
      b = this[i];
      c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }
    return [ x * k, y * k ];
  };
  d3_geom_polygonPrototype.clip = function(subject) {
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = this[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (d3_geom_polygonInside(d, a, b)) {
          if (!d3_geom_polygonInside(c, a, b)) {
            subject.push(d3_geom_polygonIntersect(c, d, a, b));
          }
          subject.push(d);
        } else if (d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }
    return subject;
  };
  function d3_geom_polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }
  function d3_geom_polygonIntersect(c, d, a, b) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [ x1 + ua * x21, y1 + ua * y21 ];
  }
  function d3_geom_polygonClosed(coordinates) {
    var a = coordinates[0], b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];
  function d3_geom_voronoiBeach() {
    d3_geom_voronoiRedBlackNode(this);
    this.edge = this.site = this.circle = null;
  }
  function d3_geom_voronoiCreateBeach(site) {
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
    beach.site = site;
    return beach;
  }
  function d3_geom_voronoiDetachBeach(beach) {
    d3_geom_voronoiDetachCircle(beach);
    d3_geom_voronoiBeaches.remove(beach);
    d3_geom_voronoiBeachPool.push(beach);
    d3_geom_voronoiRedBlackNode(beach);
  }
  function d3_geom_voronoiRemoveBeach(beach) {
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
      x: x,
      y: y
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];
    d3_geom_voronoiDetachBeach(beach);
    var lArc = previous;
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
      previous = lArc.P;
      disappearing.unshift(lArc);
      d3_geom_voronoiDetachBeach(lArc);
      lArc = previous;
    }
    disappearing.unshift(lArc);
    d3_geom_voronoiDetachCircle(lArc);
    var rArc = next;
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
      next = rArc.N;
      disappearing.push(rArc);
      d3_geom_voronoiDetachBeach(rArc);
      rArc = next;
    }
    disappearing.push(rArc);
    d3_geom_voronoiDetachCircle(rArc);
    var nArcs = disappearing.length, iArc;
    for (iArc = 1; iArc < nArcs; ++iArc) {
      rArc = disappearing[iArc];
      lArc = disappearing[iArc - 1];
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
    }
    lArc = disappearing[0];
    rArc = disappearing[nArcs - 1];
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiAddBeach(site) {
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;
    while (node) {
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
      if (dxl > ε) node = node.L; else {
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
        if (dxr > ε) {
          if (!node.R) {
            lArc = node;
            break;
          }
          node = node.R;
        } else {
          if (dxl > -ε) {
            lArc = node.P;
            rArc = node;
          } else if (dxr > -ε) {
            lArc = node;
            rArc = node.N;
          } else {
            lArc = rArc = node;
          }
          break;
        }
      }
    }
    var newArc = d3_geom_voronoiCreateBeach(site);
    d3_geom_voronoiBeaches.insert(lArc, newArc);
    if (!lArc && !rArc) return;
    if (lArc === rArc) {
      d3_geom_voronoiDetachCircle(lArc);
      rArc = d3_geom_voronoiCreateBeach(lArc.site);
      d3_geom_voronoiBeaches.insert(newArc, rArc);
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      d3_geom_voronoiAttachCircle(lArc);
      d3_geom_voronoiAttachCircle(rArc);
      return;
    }
    if (!rArc) {
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      return;
    }
    d3_geom_voronoiDetachCircle(lArc);
    d3_geom_voronoiDetachCircle(rArc);
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
      x: (cy * hb - by * hc) / d + ax,
      y: (bx * hc - cx * hb) / d + ay
    };
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
    if (!pby2) return rfocx;
    var lArc = arc.P;
    if (!lArc) return -Infinity;
    site = lArc.site;
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
    if (!plby2) return lfocx;
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
    return (rfocx + lfocx) / 2;
  }
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
    var rArc = arc.N;
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
    var site = arc.site;
    return site.y === directrix ? site.x : Infinity;
  }
  function d3_geom_voronoiCell(site) {
    this.site = site;
    this.edges = [];
  }
  d3_geom_voronoiCell.prototype.prepare = function() {
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;
    while (iHalfEdge--) {
      edge = halfEdges[iHalfEdge].edge;
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
    }
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
    return halfEdges.length;
  };
  function d3_geom_voronoiCloseCells(extent) {
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;
    while (iCell--) {
      cell = cells[iCell];
      if (!cell || !cell.prepare()) continue;
      halfEdges = cell.edges;
      nHalfEdges = halfEdges.length;
      iHalfEdge = 0;
      while (iHalfEdge < nHalfEdges) {
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
            x: x0,
            y: abs(x2 - x0) < ε ? y2 : y1
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
            x: abs(y2 - y1) < ε ? x2 : x1,
            y: y1
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
            x: x1,
            y: abs(x2 - x1) < ε ? y2 : y0
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
            x: abs(y2 - y0) < ε ? x2 : x0,
            y: y0
          } : null), cell.site, null));
          ++nHalfEdges;
        }
      }
    }
  }
  function d3_geom_voronoiHalfEdgeOrder(a, b) {
    return b.angle - a.angle;
  }
  function d3_geom_voronoiCircle() {
    d3_geom_voronoiRedBlackNode(this);
    this.x = this.y = this.arc = this.site = this.cy = null;
  }
  function d3_geom_voronoiAttachCircle(arc) {
    var lArc = arc.P, rArc = arc.N;
    if (!lArc || !rArc) return;
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
    if (lSite === rSite) return;
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -ε2) return;
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
    circle.arc = arc;
    circle.site = cSite;
    circle.x = x + bx;
    circle.y = cy + Math.sqrt(x * x + y * y);
    circle.cy = cy;
    arc.circle = circle;
    var before = null, node = d3_geom_voronoiCircles._;
    while (node) {
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
        if (node.L) node = node.L; else {
          before = node.P;
          break;
        }
      } else {
        if (node.R) node = node.R; else {
          before = node;
          break;
        }
      }
    }
    d3_geom_voronoiCircles.insert(before, circle);
    if (!before) d3_geom_voronoiFirstCircle = circle;
  }
  function d3_geom_voronoiDetachCircle(arc) {
    var circle = arc.circle;
    if (circle) {
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
      d3_geom_voronoiCircles.remove(circle);
      d3_geom_voronoiCirclePool.push(circle);
      d3_geom_voronoiRedBlackNode(circle);
      arc.circle = null;
    }
  }
  function d3_geom_voronoiClipEdges(extent) {
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;
    while (i--) {
      e = edges[i];
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
        e.a = e.b = null;
        edges.splice(i, 1);
      }
    }
  }
  function d3_geom_voronoiConnectEdge(edge, extent) {
    var vb = edge.b;
    if (vb) return true;
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
    if (ry === ly) {
      if (fx < x0 || fx >= x1) return;
      if (lx > rx) {
        if (!va) va = {
          x: fx,
          y: y0
        }; else if (va.y >= y1) return;
        vb = {
          x: fx,
          y: y1
        };
      } else {
        if (!va) va = {
          x: fx,
          y: y1
        }; else if (va.y < y0) return;
        vb = {
          x: fx,
          y: y0
        };
      }
    } else {
      fm = (lx - rx) / (ry - ly);
      fb = fy - fm * fx;
      if (fm < -1 || fm > 1) {
        if (lx > rx) {
          if (!va) va = {
            x: (y0 - fb) / fm,
            y: y0
          }; else if (va.y >= y1) return;
          vb = {
            x: (y1 - fb) / fm,
            y: y1
          };
        } else {
          if (!va) va = {
            x: (y1 - fb) / fm,
            y: y1
          }; else if (va.y < y0) return;
          vb = {
            x: (y0 - fb) / fm,
            y: y0
          };
        }
      } else {
        if (ly < ry) {
          if (!va) va = {
            x: x0,
            y: fm * x0 + fb
          }; else if (va.x >= x1) return;
          vb = {
            x: x1,
            y: fm * x1 + fb
          };
        } else {
          if (!va) va = {
            x: x1,
            y: fm * x1 + fb
          }; else if (va.x < x0) return;
          vb = {
            x: x0,
            y: fm * x0 + fb
          };
        }
      }
    }
    edge.a = va;
    edge.b = vb;
    return true;
  }
  function d3_geom_voronoiEdge(lSite, rSite) {
    this.l = lSite;
    this.r = rSite;
    this.a = this.b = null;
  }
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, rSite);
    d3_geom_voronoiEdges.push(edge);
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
    return edge;
  }
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, null);
    edge.a = va;
    edge.b = vb;
    d3_geom_voronoiEdges.push(edge);
    return edge;
  }
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
    if (!edge.a && !edge.b) {
      edge.a = vertex;
      edge.l = lSite;
      edge.r = rSite;
    } else if (edge.l === rSite) {
      edge.b = vertex;
    } else {
      edge.a = vertex;
    }
  }
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
    var va = edge.a, vb = edge.b;
    this.edge = edge;
    this.site = lSite;
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
  }
  d3_geom_voronoiHalfEdge.prototype = {
    start: function() {
      return this.edge.l === this.site ? this.edge.a : this.edge.b;
    },
    end: function() {
      return this.edge.l === this.site ? this.edge.b : this.edge.a;
    }
  };
  function d3_geom_voronoiRedBlackTree() {
    this._ = null;
  }
  function d3_geom_voronoiRedBlackNode(node) {
    node.U = node.C = node.L = node.R = node.P = node.N = null;
  }
  d3_geom_voronoiRedBlackTree.prototype = {
    insert: function(after, node) {
      var parent, grandpa, uncle;
      if (after) {
        node.P = after;
        node.N = after.N;
        if (after.N) after.N.P = node;
        after.N = node;
        if (after.R) {
          after = after.R;
          while (after.L) after = after.L;
          after.L = node;
        } else {
          after.R = node;
        }
        parent = after;
      } else if (this._) {
        after = d3_geom_voronoiRedBlackFirst(this._);
        node.P = null;
        node.N = after;
        after.P = after.L = node;
        parent = after;
      } else {
        node.P = node.N = null;
        this._ = node;
        parent = null;
      }
      node.L = node.R = null;
      node.U = parent;
      node.C = true;
      after = node;
      while (parent && parent.C) {
        grandpa = parent.U;
        if (parent === grandpa.L) {
          uncle = grandpa.R;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.R) {
              d3_geom_voronoiRedBlackRotateLeft(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
          }
        } else {
          uncle = grandpa.L;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.L) {
              d3_geom_voronoiRedBlackRotateRight(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
          }
        }
        parent = after.U;
      }
      this._.C = false;
    },
    remove: function(node) {
      if (node.N) node.N.P = node.P;
      if (node.P) node.P.N = node.N;
      node.N = node.P = null;
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);
      if (parent) {
        if (parent.L === node) parent.L = next; else parent.R = next;
      } else {
        this._ = next;
      }
      if (left && right) {
        red = next.C;
        next.C = node.C;
        next.L = left;
        left.U = next;
        if (next !== right) {
          parent = next.U;
          next.U = node.U;
          node = next.R;
          parent.L = node;
          next.R = right;
          right.U = next;
        } else {
          next.U = parent;
          parent = next;
          node = next.R;
        }
      } else {
        red = node.C;
        node = next;
      }
      if (node) node.U = parent;
      if (red) return;
      if (node && node.C) {
        node.C = false;
        return;
      }
      do {
        if (node === this._) break;
        if (node === parent.L) {
          sibling = parent.R;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            sibling = parent.R;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.R || !sibling.R.C) {
              sibling.L.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateRight(this, sibling);
              sibling = parent.R;
            }
            sibling.C = parent.C;
            parent.C = sibling.R.C = false;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            node = this._;
            break;
          }
        } else {
          sibling = parent.L;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            sibling = parent.L;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.L || !sibling.L.C) {
              sibling.R.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
              sibling = parent.L;
            }
            sibling.C = parent.C;
            parent.C = sibling.L.C = false;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            node = this._;
            break;
          }
        }
        sibling.C = true;
        node = parent;
        parent = parent.U;
      } while (!node.C);
      if (node) node.C = false;
    }
  };
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
    var p = node, q = node.R, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.R = q.L;
    if (p.R) p.R.U = p;
    q.L = p;
  }
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
    var p = node, q = node.L, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.L = q.R;
    if (p.L) p.L.U = p;
    q.R = p;
  }
  function d3_geom_voronoiRedBlackFirst(node) {
    while (node.L) node = node.L;
    return node;
  }
  function d3_geom_voronoi(sites, bbox) {
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;
    d3_geom_voronoiEdges = [];
    d3_geom_voronoiCells = new Array(sites.length);
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
    while (true) {
      circle = d3_geom_voronoiFirstCircle;
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
        if (site.x !== x0 || site.y !== y0) {
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
          d3_geom_voronoiAddBeach(site);
          x0 = site.x, y0 = site.y;
        }
        site = sites.pop();
      } else if (circle) {
        d3_geom_voronoiRemoveBeach(circle.arc);
      } else {
        break;
      }
    }
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
    var diagram = {
      cells: d3_geom_voronoiCells,
      edges: d3_geom_voronoiEdges
    };
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
    return diagram;
  }
  function d3_geom_voronoiVertexOrder(a, b) {
    return b.y - a.y || b.x - a.x;
  }
  d3.geom.voronoi = function(points) {
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
    if (points) return voronoi(points);
    function voronoi(data) {
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {
          var s = e.start();
          return [ s.x, s.y ];
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];
        polygon.point = data[i];
      });
      return polygons;
    }
    function sites(data) {
      return data.map(function(d, i) {
        return {
          x: Math.round(fx(d, i) / ε) * ε,
          y: Math.round(fy(d, i) / ε) * ε,
          i: i
        };
      });
    }
    voronoi.links = function(data) {
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {
        return edge.l && edge.r;
      }).map(function(edge) {
        return {
          source: data[edge.l.i],
          target: data[edge.r.i]
        };
      });
    };
    voronoi.triangles = function(data) {
      var triangles = [];
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;
        while (++j < m) {
          e0 = e1;
          s0 = s1;
          e1 = edges[j].edge;
          s1 = e1.l === site ? e1.r : e1.l;
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);
          }
        }
      });
      return triangles;
    };
    voronoi.x = function(_) {
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
    };
    voronoi.y = function(_) {
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
    };
    voronoi.clipExtent = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
      return voronoi;
    };
    voronoi.size = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
    };
    return voronoi;
  };
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];
  function d3_geom_voronoiTriangleArea(a, b, c) {
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
  }
  d3.geom.delaunay = function(vertices) {
    return d3.geom.voronoi().triangles(vertices);
  };
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;
    if (compat = arguments.length) {
      x = d3_geom_quadtreeCompatX;
      y = d3_geom_quadtreeCompatY;
      if (compat === 3) {
        y2 = y1;
        x2 = x1;
        y1 = x1 = 0;
      }
      return quadtree(points);
    }
    function quadtree(data) {
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
      if (x1 != null) {
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
      } else {
        x2_ = y2_ = -(x1_ = y1_ = Infinity);
        xs = [], ys = [];
        n = data.length;
        if (compat) for (i = 0; i < n; ++i) {
          d = data[i];
          if (d.x < x1_) x1_ = d.x;
          if (d.y < y1_) y1_ = d.y;
          if (d.x > x2_) x2_ = d.x;
          if (d.y > y2_) y2_ = d.y;
          xs.push(d.x);
          ys.push(d.y);
        } else for (i = 0; i < n; ++i) {
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
          if (x_ < x1_) x1_ = x_;
          if (y_ < y1_) y1_ = y_;
          if (x_ > x2_) x2_ = x_;
          if (y_ > y2_) y2_ = y_;
          xs.push(x_);
          ys.push(y_);
        }
      }
      var dx = x2_ - x1_, dy = y2_ - y1_;
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
      function insert(n, d, x, y, x1, y1, x2, y2) {
        if (isNaN(x) || isNaN(y)) return;
        if (n.leaf) {
          var nx = n.x, ny = n.y;
          if (nx != null) {
            if (abs(nx - x) + abs(ny - y) < .01) {
              insertChild(n, d, x, y, x1, y1, x2, y2);
            } else {
              var nPoint = n.point;
              n.x = n.y = n.point = null;
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
              insertChild(n, d, x, y, x1, y1, x2, y2);
            }
          } else {
            n.x = x, n.y = y, n.point = d;
          }
        } else {
          insertChild(n, d, x, y, x1, y1, x2, y2);
        }
      }
      function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
        if (right) x1 = xm; else x2 = xm;
        if (below) y1 = ym; else y2 = ym;
        insert(n, d, x, y, x1, y1, x2, y2);
      }
      var root = d3_geom_quadtreeNode();
      root.add = function(d) {
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
      };
      root.visit = function(f) {
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
      };
      root.find = function(point) {
        return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
      };
      i = -1;
      if (x1 == null) {
        while (++i < n) {
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
        }
        --i;
      } else data.forEach(root.add);
      xs = ys = data = d = null;
      return root;
    }
    quadtree.x = function(_) {
      return arguments.length ? (x = _, quadtree) : x;
    };
    quadtree.y = function(_) {
      return arguments.length ? (y = _, quadtree) : y;
    };
    quadtree.extent = function(_) {
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
      y2 = +_[1][1];
      return quadtree;
    };
    quadtree.size = function(_) {
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
      return quadtree;
    };
    return quadtree;
  };
  function d3_geom_quadtreeCompatX(d) {
    return d.x;
  }
  function d3_geom_quadtreeCompatY(d) {
    return d.y;
  }
  function d3_geom_quadtreeNode() {
    return {
      leaf: true,
      nodes: [],
      point: null,
      x: null,
      y: null
    };
  }
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
    if (!f(node, x1, y1, x2, y2)) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
    }
  }
  function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
    var minDistance2 = Infinity, closestPoint;
    (function find(node, x1, y1, x2, y2) {
      if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
      if (point = node.point) {
        var point, dx = x - node.x, dy = y - node.y, distance2 = dx * dx + dy * dy;
        if (distance2 < minDistance2) {
          var distance = Math.sqrt(minDistance2 = distance2);
          x0 = x - distance, y0 = y - distance;
          x3 = x + distance, y3 = y + distance;
          closestPoint = point;
        }
      }
      var children = node.nodes, xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym;
      for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
        if (node = children[i & 3]) switch (i & 3) {
         case 0:
          find(node, x1, y1, xm, ym);
          break;

         case 1:
          find(node, xm, y1, x2, ym);
          break;

         case 2:
          find(node, x1, ym, xm, y2);
          break;

         case 3:
          find(node, xm, ym, x2, y2);
          break;
        }
      }
    })(root, x0, y0, x3, y3);
    return closestPoint;
  }
  d3.interpolateRgb = d3_interpolateRgb;
  function d3_interpolateRgb(a, b) {
    a = d3.rgb(a);
    b = d3.rgb(b);
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
    return function(t) {
      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
    };
  }
  d3.interpolateObject = d3_interpolateObject;
  function d3_interpolateObject(a, b) {
    var i = {}, c = {}, k;
    for (k in a) {
      if (k in b) {
        i[k] = d3_interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }
    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }
  d3.interpolateNumber = d3_interpolateNumber;
  function d3_interpolateNumber(a, b) {
    a = +a, b = +b;
    return function(t) {
      return a * (1 - t) + b * t;
    };
  }
  d3.interpolateString = d3_interpolateString;
  function d3_interpolateString(a, b) {
    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i]) s[i] += bm; else s[++i] = bm;
      } else {
        s[++i] = null;
        q.push({
          i: i,
          x: d3_interpolateNumber(am, bm)
        });
      }
      bi = d3_interpolate_numberB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
      return b(t) + "";
    }) : function() {
      return b;
    } : (b = q.length, function(t) {
      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    });
  }
  var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
  d3.interpolate = d3_interpolate;
  function d3_interpolate(a, b) {
    var i = d3.interpolators.length, f;
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
    return f;
  }
  d3.interpolators = [ function(a, b) {
    var t = typeof b;
    return (t === "string" ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
  } ];
  d3.interpolateArray = d3_interpolateArray;
  function d3_interpolateArray(a, b) {
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
    for (;i < na; ++i) c[i] = a[i];
    for (;i < nb; ++i) c[i] = b[i];
    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }
  var d3_ease_default = function() {
    return d3_identity;
  };
  var d3_ease = d3.map({
    linear: d3_ease_default,
    poly: d3_ease_poly,
    quad: function() {
      return d3_ease_quad;
    },
    cubic: function() {
      return d3_ease_cubic;
    },
    sin: function() {
      return d3_ease_sin;
    },
    exp: function() {
      return d3_ease_exp;
    },
    circle: function() {
      return d3_ease_circle;
    },
    elastic: d3_ease_elastic,
    back: d3_ease_back,
    bounce: function() {
      return d3_ease_bounce;
    }
  });
  var d3_ease_mode = d3.map({
    "in": d3_identity,
    out: d3_ease_reverse,
    "in-out": d3_ease_reflect,
    "out-in": function(f) {
      return d3_ease_reflect(d3_ease_reverse(f));
    }
  });
  d3.ease = function(name) {
    var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
    t = d3_ease.get(t) || d3_ease_default;
    m = d3_ease_mode.get(m) || d3_identity;
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
  };
  function d3_ease_clamp(f) {
    return function(t) {
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
    };
  }
  function d3_ease_reverse(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
  function d3_ease_reflect(f) {
    return function(t) {
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
    };
  }
  function d3_ease_quad(t) {
    return t * t;
  }
  function d3_ease_cubic(t) {
    return t * t * t;
  }
  function d3_ease_cubicInOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var t2 = t * t, t3 = t2 * t;
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
  }
  function d3_ease_poly(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
  function d3_ease_sin(t) {
    return 1 - Math.cos(t * halfπ);
  }
  function d3_ease_exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }
  function d3_ease_circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  function d3_ease_elastic(a, p) {
    var s;
    if (arguments.length < 2) p = .45;
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
    };
  }
  function d3_ease_back(s) {
    if (!s) s = 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
  function d3_ease_bounce(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
  }
  d3.interpolateHcl = d3_interpolateHcl;
  function d3_interpolateHcl(a, b) {
    a = d3.hcl(a);
    b = d3.hcl(b);
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
    };
  }
  d3.interpolateHsl = d3_interpolateHsl;
  function d3_interpolateHsl(a, b) {
    a = d3.hsl(a);
    b = d3.hsl(b);
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
    };
  }
  d3.interpolateLab = d3_interpolateLab;
  function d3_interpolateLab(a, b) {
    a = d3.lab(a);
    b = d3.lab(b);
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
    return function(t) {
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
    };
  }
  d3.interpolateRound = d3_interpolateRound;
  function d3_interpolateRound(a, b) {
    b -= a;
    return function(t) {
      return Math.round(a + b * t);
    };
  }
  d3.transform = function(string) {
    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
    return (d3.transform = function(string) {
      if (string != null) {
        g.setAttribute("transform", string);
        var t = g.transform.baseVal.consolidate();
      }
      return new d3_transform(t ? t.matrix : d3_transformIdentity);
    })(string);
  };
  function d3_transform(m) {
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
    if (r0[0] * r1[1] < r1[0] * r0[1]) {
      r0[0] *= -1;
      r0[1] *= -1;
      kx *= -1;
      kz *= -1;
    }
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
    this.translate = [ m.e, m.f ];
    this.scale = [ kx, ky ];
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
  }
  d3_transform.prototype.toString = function() {
    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
  };
  function d3_transformDot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function d3_transformNormalize(a) {
    var k = Math.sqrt(d3_transformDot(a, a));
    if (k) {
      a[0] /= k;
      a[1] /= k;
    }
    return k;
  }
  function d3_transformCombine(a, b, k) {
    a[0] += k * b[0];
    a[1] += k * b[1];
    return a;
  }
  var d3_transformIdentity = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };
  d3.interpolateTransform = d3_interpolateTransform;
  function d3_interpolateTransformPop(s) {
    return s.length ? s.pop() + "," : "";
  }
  function d3_interpolateTranslate(ta, tb, s, q) {
    if (ta[0] !== tb[0] || ta[1] !== tb[1]) {
      var i = s.push("translate(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: d3_interpolateNumber(ta[0], tb[0])
      }, {
        i: i - 2,
        x: d3_interpolateNumber(ta[1], tb[1])
      });
    } else if (tb[0] || tb[1]) {
      s.push("translate(" + tb + ")");
    }
  }
  function d3_interpolateRotate(ra, rb, s, q) {
    if (ra !== rb) {
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
      q.push({
        i: s.push(d3_interpolateTransformPop(s) + "rotate(", null, ")") - 2,
        x: d3_interpolateNumber(ra, rb)
      });
    } else if (rb) {
      s.push(d3_interpolateTransformPop(s) + "rotate(" + rb + ")");
    }
  }
  function d3_interpolateSkew(wa, wb, s, q) {
    if (wa !== wb) {
      q.push({
        i: s.push(d3_interpolateTransformPop(s) + "skewX(", null, ")") - 2,
        x: d3_interpolateNumber(wa, wb)
      });
    } else if (wb) {
      s.push(d3_interpolateTransformPop(s) + "skewX(" + wb + ")");
    }
  }
  function d3_interpolateScale(ka, kb, s, q) {
    if (ka[0] !== kb[0] || ka[1] !== kb[1]) {
      var i = s.push(d3_interpolateTransformPop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: d3_interpolateNumber(ka[0], kb[0])
      }, {
        i: i - 2,
        x: d3_interpolateNumber(ka[1], kb[1])
      });
    } else if (kb[0] !== 1 || kb[1] !== 1) {
      s.push(d3_interpolateTransformPop(s) + "scale(" + kb + ")");
    }
  }
  function d3_interpolateTransform(a, b) {
    var s = [], q = [];
    a = d3.transform(a), b = d3.transform(b);
    d3_interpolateTranslate(a.translate, b.translate, s, q);
    d3_interpolateRotate(a.rotate, b.rotate, s, q);
    d3_interpolateSkew(a.skew, b.skew, s, q);
    d3_interpolateScale(a.scale, b.scale, s, q);
    a = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  function d3_uninterpolateNumber(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return (x - a) / b;
    };
  }
  function d3_uninterpolateClamp(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) / b));
    };
  }
  d3.layout = {};
  d3.layout.bundle = function() {
    return function(links) {
      var paths = [], i = -1, n = links.length;
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
      return paths;
    };
  };
  function d3_layout_bundlePath(link) {
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
    while (start !== lca) {
      start = start.parent;
      points.push(start);
    }
    var k = points.length;
    while (end !== lca) {
      points.splice(k, 0, end);
      end = end.parent;
    }
    return points;
  }
  function d3_layout_bundleAncestors(node) {
    var ancestors = [], parent = node.parent;
    while (parent != null) {
      ancestors.push(node);
      node = parent;
      parent = parent.parent;
    }
    ancestors.push(node);
    return ancestors;
  }
  function d3_layout_bundleLeastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
    while (aNode === bNode) {
      sharedNode = aNode;
      aNode = aNodes.pop();
      bNode = bNodes.pop();
    }
    return sharedNode;
  }
  d3.layout.chord = function() {
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
    function relayout() {
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3.range(n));
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function(a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function(d, i) {
          d.sort(function(a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (τ - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        while (++j < n) {
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
          subgroups[di + "-" + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: groupSums[di]
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function(a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function(x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function(x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function(x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function(x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function(x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function() {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function() {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };
  d3.layout.force = function() {
    var force = {}, event = d3.dispatch("start", "tick", "end"), timer, size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
    function repulse(node) {
      return function(quad, x1, _, x2) {
        if (quad.point !== node) {
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
          if (dw * dw / theta2 < dn) {
            if (dn < chargeDistance2) {
              var k = quad.charge / dn;
              node.px -= dx * k;
              node.py -= dy * k;
            }
            return true;
          }
          if (quad.point && dn && dn < chargeDistance2) {
            var k = quad.pointCharge / dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
        }
        return !quad.charge;
      };
    }
    force.tick = function() {
      if ((alpha *= .99) < .005) {
        timer = null;
        event.end({
          type: "end",
          alpha: alpha = 0
        });
        return true;
      }
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
      for (i = 0; i < m; ++i) {
        o = links[i];
        s = o.source;
        t = o.target;
        x = t.x - s.x;
        y = t.y - s.y;
        if (l = x * x + y * y) {
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
          x *= l;
          y *= l;
          t.x -= x * (k = s.weight + t.weight ? s.weight / (s.weight + t.weight) : .5);
          t.y -= y * k;
          s.x += x * (k = 1 - k);
          s.y += y * k;
        }
      }
      if (k = alpha * gravity) {
        x = size[0] / 2;
        y = size[1] / 2;
        i = -1;
        if (k) while (++i < n) {
          o = nodes[i];
          o.x += (x - o.x) * k;
          o.y += (y - o.y) * k;
        }
      }
      if (charge) {
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
        i = -1;
        while (++i < n) {
          if (!(o = nodes[i]).fixed) {
            q.visit(repulse(o));
          }
        }
      }
      i = -1;
      while (++i < n) {
        o = nodes[i];
        if (o.fixed) {
          o.x = o.px;
          o.y = o.py;
        } else {
          o.x -= (o.px - (o.px = o.x)) * friction;
          o.y -= (o.py - (o.py = o.y)) * friction;
        }
      }
      event.tick({
        type: "tick",
        alpha: alpha
      });
    };
    force.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return force;
    };
    force.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return force;
    };
    force.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return force;
    };
    force.linkDistance = function(x) {
      if (!arguments.length) return linkDistance;
      linkDistance = typeof x === "function" ? x : +x;
      return force;
    };
    force.distance = force.linkDistance;
    force.linkStrength = function(x) {
      if (!arguments.length) return linkStrength;
      linkStrength = typeof x === "function" ? x : +x;
      return force;
    };
    force.friction = function(x) {
      if (!arguments.length) return friction;
      friction = +x;
      return force;
    };
    force.charge = function(x) {
      if (!arguments.length) return charge;
      charge = typeof x === "function" ? x : +x;
      return force;
    };
    force.chargeDistance = function(x) {
      if (!arguments.length) return Math.sqrt(chargeDistance2);
      chargeDistance2 = x * x;
      return force;
    };
    force.gravity = function(x) {
      if (!arguments.length) return gravity;
      gravity = +x;
      return force;
    };
    force.theta = function(x) {
      if (!arguments.length) return Math.sqrt(theta2);
      theta2 = x * x;
      return force;
    };
    force.alpha = function(x) {
      if (!arguments.length) return alpha;
      x = +x;
      if (alpha) {
        if (x > 0) {
          alpha = x;
        } else {
          timer.c = null, timer.t = NaN, timer = null;
          event.end({
            type: "end",
            alpha: alpha = 0
          });
        }
      } else if (x > 0) {
        event.start({
          type: "start",
          alpha: alpha = x
        });
        timer = d3_timer(force.tick);
      }
      return force;
    };
    force.start = function() {
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }
      for (i = 0; i < n; ++i) {
        o = nodes[i];
        if (isNaN(o.x)) o.x = position("x", w);
        if (isNaN(o.y)) o.y = position("y", h);
        if (isNaN(o.px)) o.px = o.x;
        if (isNaN(o.py)) o.py = o.y;
      }
      distances = [];
      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
      strengths = [];
      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
      charges = [];
      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
      function position(dimension, size) {
        if (!neighbors) {
          neighbors = new Array(n);
          for (j = 0; j < n; ++j) {
            neighbors[j] = [];
          }
          for (j = 0; j < m; ++j) {
            var o = links[j];
            neighbors[o.source.index].push(o.target);
            neighbors[o.target.index].push(o.source);
          }
        }
        var candidates = neighbors[i], j = -1, l = candidates.length, x;
        while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x;
        return Math.random() * size;
      }
      return force.resume();
    };
    force.resume = function() {
      return force.alpha(.1);
    };
    force.stop = function() {
      return force.alpha(0);
    };
    force.drag = function() {
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
      if (!arguments.length) return drag;
      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
    };
    function dragmove(d) {
      d.px = d3.event.x, d.py = d3.event.y;
      force.resume();
    }
    return d3.rebind(force, event, "on");
  };
  function d3_layout_forceDragstart(d) {
    d.fixed |= 2;
  }
  function d3_layout_forceDragend(d) {
    d.fixed &= ~6;
  }
  function d3_layout_forceMouseover(d) {
    d.fixed |= 4;
    d.px = d.x, d.py = d.y;
  }
  function d3_layout_forceMouseout(d) {
    d.fixed &= ~4;
  }
  function d3_layout_forceAccumulate(quad, alpha, charges) {
    var cx = 0, cy = 0;
    quad.charge = 0;
    if (!quad.leaf) {
      var nodes = quad.nodes, n = nodes.length, i = -1, c;
      while (++i < n) {
        c = nodes[i];
        if (c == null) continue;
        d3_layout_forceAccumulate(c, alpha, charges);
        quad.charge += c.charge;
        cx += c.charge * c.cx;
        cy += c.charge * c.cy;
      }
    }
    if (quad.point) {
      if (!quad.leaf) {
        quad.point.x += Math.random() - .5;
        quad.point.y += Math.random() - .5;
      }
      var k = alpha * charges[quad.point.index];
      quad.charge += quad.pointCharge = k;
      cx += k * quad.point.x;
      cy += k * quad.point.y;
    }
    quad.cx = cx / quad.charge;
    quad.cy = cy / quad.charge;
  }
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;
  d3.layout.hierarchy = function() {
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
    function hierarchy(root) {
      var stack = [ root ], nodes = [], node;
      root.depth = 0;
      while ((node = stack.pop()) != null) {
        nodes.push(node);
        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
          var n, childs, child;
          while (--n >= 0) {
            stack.push(child = childs[n]);
            child.parent = node;
            child.depth = node.depth + 1;
          }
          if (value) node.value = 0;
          node.children = childs;
        } else {
          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
          delete node.children;
        }
      }
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var childs, parent;
        if (sort && (childs = node.children)) childs.sort(sort);
        if (value && (parent = node.parent)) parent.value += node.value;
      });
      return nodes;
    }
    hierarchy.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return hierarchy;
    };
    hierarchy.children = function(x) {
      if (!arguments.length) return children;
      children = x;
      return hierarchy;
    };
    hierarchy.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return hierarchy;
    };
    hierarchy.revalue = function(root) {
      if (value) {
        d3_layout_hierarchyVisitBefore(root, function(node) {
          if (node.children) node.value = 0;
        });
        d3_layout_hierarchyVisitAfter(root, function(node) {
          var parent;
          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
          if (parent = node.parent) parent.value += node.value;
        });
      }
      return root;
    };
    return hierarchy;
  };
  function d3_layout_hierarchyRebind(object, hierarchy) {
    d3.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = d3_layout_hierarchyLinks;
    return object;
  }
  function d3_layout_hierarchyVisitBefore(node, callback) {
    var nodes = [ node ];
    while ((node = nodes.pop()) != null) {
      callback(node);
      if ((children = node.children) && (n = children.length)) {
        var n, children;
        while (--n >= 0) nodes.push(children[n]);
      }
    }
  }
  function d3_layout_hierarchyVisitAfter(node, callback) {
    var nodes = [ node ], nodes2 = [];
    while ((node = nodes.pop()) != null) {
      nodes2.push(node);
      if ((children = node.children) && (n = children.length)) {
        var i = -1, n, children;
        while (++i < n) nodes.push(children[i]);
      }
    }
    while ((node = nodes2.pop()) != null) {
      callback(node);
    }
  }
  function d3_layout_hierarchyChildren(d) {
    return d.children;
  }
  function d3_layout_hierarchyValue(d) {
    return d.value;
  }
  function d3_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }
  function d3_layout_hierarchyLinks(nodes) {
    return d3.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }
  d3.layout.partition = function() {
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
    function position(node, x, dx, dy) {
      var children = node.children;
      node.x = x;
      node.y = node.depth * dy;
      node.dx = dx;
      node.dy = dy;
      if (children && (n = children.length)) {
        var i = -1, n, c, d;
        dx = node.value ? dx / node.value : 0;
        while (++i < n) {
          position(c = children[i], x, d = c.value * dx, dy);
          x += d;
        }
      }
    }
    function depth(node) {
      var children = node.children, d = 0;
      if (children && (n = children.length)) {
        var i = -1, n;
        while (++i < n) d = Math.max(d, depth(children[i]));
      }
      return 1 + d;
    }
    function partition(d, i) {
      var nodes = hierarchy.call(this, d, i);
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
      return nodes;
    }
    partition.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return partition;
    };
    return d3_layout_hierarchyRebind(partition, hierarchy);
  };
  d3.layout.pie = function() {
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
    function pie(data) {
      var n = data.length, values = data.map(function(d, i) {
        return +value.call(pie, d, i);
      }), a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), sum = d3.sum(values), k = sum ? (da - n * pa) / sum : 0, index = d3.range(n), arcs = [], v;
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
        return values[j] - values[i];
      } : function(i, j) {
        return sort(data[i], data[j]);
      });
      index.forEach(function(i) {
        arcs[i] = {
          data: data[i],
          value: v = values[i],
          startAngle: a,
          endAngle: a += v * k + pa,
          padAngle: p
        };
      });
      return arcs;
    }
    pie.value = function(_) {
      if (!arguments.length) return value;
      value = _;
      return pie;
    };
    pie.sort = function(_) {
      if (!arguments.length) return sort;
      sort = _;
      return pie;
    };
    pie.startAngle = function(_) {
      if (!arguments.length) return startAngle;
      startAngle = _;
      return pie;
    };
    pie.endAngle = function(_) {
      if (!arguments.length) return endAngle;
      endAngle = _;
      return pie;
    };
    pie.padAngle = function(_) {
      if (!arguments.length) return padAngle;
      padAngle = _;
      return pie;
    };
    return pie;
  };
  var d3_layout_pieSortByValue = {};
  d3.layout.stack = function() {
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
    function stack(data, index) {
      if (!(n = data.length)) return data;
      var series = data.map(function(d, i) {
        return values.call(stack, d, i);
      });
      var points = series.map(function(d) {
        return d.map(function(v, i) {
          return [ x.call(stack, v, i), y.call(stack, v, i) ];
        });
      });
      var orders = order.call(stack, points, index);
      series = d3.permute(series, orders);
      points = d3.permute(points, orders);
      var offsets = offset.call(stack, points, index);
      var m = series[0].length, n, i, j, o;
      for (j = 0; j < m; ++j) {
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
        for (i = 1; i < n; ++i) {
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
        }
      }
      return data;
    }
    stack.values = function(x) {
      if (!arguments.length) return values;
      values = x;
      return stack;
    };
    stack.order = function(x) {
      if (!arguments.length) return order;
      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
      return stack;
    };
    stack.offset = function(x) {
      if (!arguments.length) return offset;
      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
      return stack;
    };
    stack.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return stack;
    };
    stack.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return stack;
    };
    stack.out = function(z) {
      if (!arguments.length) return out;
      out = z;
      return stack;
    };
    return stack;
  };
  function d3_layout_stackX(d) {
    return d.x;
  }
  function d3_layout_stackY(d) {
    return d.y;
  }
  function d3_layout_stackOut(d, y0, y) {
    d.y0 = y0;
    d.y = y;
  }
  var d3_layout_stackOrders = d3.map({
    "inside-out": function(data) {
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
        return max[a] - max[b];
      }), top = 0, bottom = 0, tops = [], bottoms = [];
      for (i = 0; i < n; ++i) {
        j = index[i];
        if (top < bottom) {
          top += sums[j];
          tops.push(j);
        } else {
          bottom += sums[j];
          bottoms.push(j);
        }
      }
      return bottoms.reverse().concat(tops);
    },
    reverse: function(data) {
      return d3.range(data.length).reverse();
    },
    "default": d3_layout_stackOrderDefault
  });
  var d3_layout_stackOffsets = d3.map({
    silhouette: function(data) {
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o > max) max = o;
        sums.push(o);
      }
      for (j = 0; j < m; ++j) {
        y0[j] = (max - sums[j]) / 2;
      }
      return y0;
    },
    wiggle: function(data) {
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
      y0[0] = o = o0 = 0;
      for (j = 1; j < m; ++j) {
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
          }
          s2 += s3 * data[i][j][1];
        }
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
        if (o < o0) o0 = o;
      }
      for (j = 0; j < m; ++j) y0[j] -= o0;
      return y0;
    },
    expand: function(data) {
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
      }
      for (j = 0; j < m; ++j) y0[j] = 0;
      return y0;
    },
    zero: d3_layout_stackOffsetZero
  });
  function d3_layout_stackOrderDefault(data) {
    return d3.range(data.length);
  }
  function d3_layout_stackOffsetZero(data) {
    var j = -1, m = data[0].length, y0 = [];
    while (++j < m) y0[j] = 0;
    return y0;
  }
  function d3_layout_stackMaxIndex(array) {
    var i = 1, j = 0, v = array[0][1], k, n = array.length;
    for (;i < n; ++i) {
      if ((k = array[i][1]) > v) {
        j = i;
        v = k;
      }
    }
    return j;
  }
  function d3_layout_stackReduceSum(d) {
    return d.reduce(d3_layout_stackSum, 0);
  }
  function d3_layout_stackSum(p, d) {
    return p + d[1];
  }
  d3.layout.histogram = function() {
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
    function histogram(data, i) {
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
      while (++i < m) {
        bin = bins[i] = [];
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
        bin.y = 0;
      }
      if (m > 0) {
        i = -1;
        while (++i < n) {
          x = values[i];
          if (x >= range[0] && x <= range[1]) {
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
            bin.y += k;
            bin.push(data[i]);
          }
        }
      }
      return bins;
    }
    histogram.value = function(x) {
      if (!arguments.length) return valuer;
      valuer = x;
      return histogram;
    };
    histogram.range = function(x) {
      if (!arguments.length) return ranger;
      ranger = d3_functor(x);
      return histogram;
    };
    histogram.bins = function(x) {
      if (!arguments.length) return binner;
      binner = typeof x === "number" ? function(range) {
        return d3_layout_histogramBinFixed(range, x);
      } : d3_functor(x);
      return histogram;
    };
    histogram.frequency = function(x) {
      if (!arguments.length) return frequency;
      frequency = !!x;
      return histogram;
    };
    return histogram;
  };
  function d3_layout_histogramBinSturges(range, values) {
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
  }
  function d3_layout_histogramBinFixed(range, n) {
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
    while (++x <= n) f[x] = m * x + b;
    return f;
  }
  function d3_layout_histogramRange(values) {
    return [ d3.min(values), d3.max(values) ];
  }
  d3.layout.pack = function() {
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
    function pack(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
        return radius;
      };
      root.x = root.y = 0;
      d3_layout_hierarchyVisitAfter(root, function(d) {
        d.r = +r(d.value);
      });
      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
      if (padding) {
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r += dr;
        });
        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r -= dr;
        });
      }
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
      return nodes;
    }
    pack.size = function(_) {
      if (!arguments.length) return size;
      size = _;
      return pack;
    };
    pack.radius = function(_) {
      if (!arguments.length) return radius;
      radius = _ == null || typeof _ === "function" ? _ : +_;
      return pack;
    };
    pack.padding = function(_) {
      if (!arguments.length) return padding;
      padding = +_;
      return pack;
    };
    return d3_layout_hierarchyRebind(pack, hierarchy);
  };
  function d3_layout_packSort(a, b) {
    return a.value - b.value;
  }
  function d3_layout_packInsert(a, b) {
    var c = a._pack_next;
    a._pack_next = b;
    b._pack_prev = a;
    b._pack_next = c;
    c._pack_prev = b;
  }
  function d3_layout_packSplice(a, b) {
    a._pack_next = b;
    b._pack_prev = a;
  }
  function d3_layout_packIntersects(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
    return .999 * dr * dr > dx * dx + dy * dy;
  }
  function d3_layout_packSiblings(node) {
    if (!(nodes = node.children) || !(n = nodes.length)) return;
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
    function bound(node) {
      xMin = Math.min(node.x - node.r, xMin);
      xMax = Math.max(node.x + node.r, xMax);
      yMin = Math.min(node.y - node.r, yMin);
      yMax = Math.max(node.y + node.r, yMax);
    }
    nodes.forEach(d3_layout_packLink);
    a = nodes[0];
    a.x = -a.r;
    a.y = 0;
    bound(a);
    if (n > 1) {
      b = nodes[1];
      b.x = b.r;
      b.y = 0;
      bound(b);
      if (n > 2) {
        c = nodes[2];
        d3_layout_packPlace(a, b, c);
        bound(c);
        d3_layout_packInsert(a, c);
        a._pack_prev = c;
        d3_layout_packInsert(c, b);
        b = a._pack_next;
        for (i = 3; i < n; i++) {
          d3_layout_packPlace(a, b, c = nodes[i]);
          var isect = 0, s1 = 1, s2 = 1;
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
            if (d3_layout_packIntersects(j, c)) {
              isect = 1;
              break;
            }
          }
          if (isect == 1) {
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
              if (d3_layout_packIntersects(k, c)) {
                break;
              }
            }
          }
          if (isect) {
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
            i--;
          } else {
            d3_layout_packInsert(a, c);
            b = c;
            bound(c);
          }
        }
      }
    }
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
    for (i = 0; i < n; i++) {
      c = nodes[i];
      c.x -= cx;
      c.y -= cy;
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
    }
    node.r = cr;
    nodes.forEach(d3_layout_packUnlink);
  }
  function d3_layout_packLink(node) {
    node._pack_next = node._pack_prev = node;
  }
  function d3_layout_packUnlink(node) {
    delete node._pack_next;
    delete node._pack_prev;
  }
  function d3_layout_packTransform(node, x, y, k) {
    var children = node.children;
    node.x = x += k * node.x;
    node.y = y += k * node.y;
    node.r *= k;
    if (children) {
      var i = -1, n = children.length;
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
    }
  }
  function d3_layout_packPlace(a, b, c) {
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
    if (db && (dx || dy)) {
      var da = b.r + c.r, dc = dx * dx + dy * dy;
      da *= da;
      db *= db;
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.x = a.x + x * dx + y * dy;
      c.y = a.y + x * dy - y * dx;
    } else {
      c.x = a.x + db;
      c.y = a.y;
    }
  }
  d3.layout.tree = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null;
    function tree(d, i) {
      var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);
      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;
      d3_layout_hierarchyVisitBefore(root1, secondWalk);
      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
        var left = root0, right = root0, bottom = root0;
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.depth > bottom.depth) bottom = node;
        });
        var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          node.x = (node.x + tx) * kx;
          node.y = node.depth * ky;
        });
      }
      return nodes;
    }
    function wrapTree(root0) {
      var root1 = {
        A: null,
        children: [ root0 ]
      }, queue = [ root1 ], node1;
      while ((node1 = queue.pop()) != null) {
        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
          queue.push((children[i] = child = {
            _: children[i],
            parent: node1,
            children: (child = children[i].children) && child.slice() || [],
            A: null,
            a: null,
            z: 0,
            m: 0,
            c: 0,
            s: 0,
            t: null,
            i: i
          }).a = child);
        }
      }
      return root1.children[0];
    }
    function firstWalk(v) {
      var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
      if (children.length) {
        d3_layout_treeShift(v);
        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
        if (w) {
          v.z = w.z + separation(v._, w._);
          v.m = v.z - midpoint;
        } else {
          v.z = midpoint;
        }
      } else if (w) {
        v.z = w.z + separation(v._, w._);
      }
      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
    }
    function secondWalk(v) {
      v._.x = v.z + v.parent.m;
      v.m += v.parent.m;
    }
    function apportion(v, w, ancestor) {
      if (w) {
        var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift;
        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
          vom = d3_layout_treeLeft(vom);
          vop = d3_layout_treeRight(vop);
          vop.a = v;
          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
          if (shift > 0) {
            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);
            sip += shift;
            sop += shift;
          }
          sim += vim.m;
          sip += vip.m;
          som += vom.m;
          sop += vop.m;
        }
        if (vim && !d3_layout_treeRight(vop)) {
          vop.t = vim;
          vop.m += sim - sop;
        }
        if (vip && !d3_layout_treeLeft(vom)) {
          vom.t = vip;
          vom.m += sip - som;
          ancestor = v;
        }
      }
      return ancestor;
    }
    function sizeNode(node) {
      node.x *= size[0];
      node.y = node.depth * size[1];
    }
    tree.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return tree;
    };
    tree.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null ? sizeNode : null;
      return tree;
    };
    tree.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) == null ? null : sizeNode;
      return tree;
    };
    return d3_layout_hierarchyRebind(tree, hierarchy);
  };
  function d3_layout_treeSeparation(a, b) {
    return a.parent == b.parent ? 1 : 2;
  }
  function d3_layout_treeLeft(v) {
    var children = v.children;
    return children.length ? children[0] : v.t;
  }
  function d3_layout_treeRight(v) {
    var children = v.children, n;
    return (n = children.length) ? children[n - 1] : v.t;
  }
  function d3_layout_treeMove(wm, wp, shift) {
    var change = shift / (wp.i - wm.i);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
  }
  function d3_layout_treeShift(v) {
    var shift = 0, change = 0, children = v.children, i = children.length, w;
    while (--i >= 0) {
      w = children[i];
      w.z += shift;
      w.m += shift;
      shift += w.s + (change += w.c);
    }
  }
  function d3_layout_treeAncestor(vim, v, ancestor) {
    return vim.a.parent === v.parent ? vim.a : ancestor;
  }
  d3.layout.cluster = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function cluster(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var children = node.children;
        if (children && children.length) {
          node.x = d3_layout_clusterX(children);
          node.y = d3_layout_clusterY(children);
        } else {
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        }
      });
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
      d3_layout_hierarchyVisitAfter(root, nodeSize ? function(node) {
        node.x = (node.x - root.x) * size[0];
        node.y = (root.y - node.y) * size[1];
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
      });
      return nodes;
    }
    cluster.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return cluster;
    };
    cluster.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return cluster;
    };
    cluster.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return cluster;
    };
    return d3_layout_hierarchyRebind(cluster, hierarchy);
  };
  function d3_layout_clusterY(children) {
    return 1 + d3.max(children, function(child) {
      return child.y;
    });
  }
  function d3_layout_clusterX(children) {
    return children.reduce(function(x, child) {
      return x + child.x;
    }, 0) / children.length;
  }
  function d3_layout_clusterLeft(node) {
    var children = node.children;
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
  }
  function d3_layout_clusterRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
  }
  d3.layout.treemap = function() {
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
    function scale(children, k) {
      var i = -1, n = children.length, child, area;
      while (++i < n) {
        area = (child = children[i]).value * (k < 0 ? 0 : k);
        child.area = isNaN(area) || area <= 0 ? 0 : area;
      }
    }
    function squarify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while ((n = remaining.length) > 0) {
          row.push(child = remaining[n - 1]);
          row.area += child.area;
          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
            remaining.pop();
            best = score;
          } else {
            row.area -= row.pop().area;
            position(row, u, rect, false);
            u = Math.min(rect.dx, rect.dy);
            row.length = row.area = 0;
            best = Infinity;
          }
        }
        if (row.length) {
          position(row, u, rect, true);
          row.length = row.area = 0;
        }
        children.forEach(squarify);
      }
    }
    function stickify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), remaining = children.slice(), child, row = [];
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while (child = remaining.pop()) {
          row.push(child);
          row.area += child.area;
          if (child.z != null) {
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
            row.length = row.area = 0;
          }
        }
        children.forEach(stickify);
      }
    }
    function worst(row, u) {
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
      while (++i < n) {
        if (!(r = row[i].area)) continue;
        if (r < rmin) rmin = r;
        if (r > rmax) rmax = r;
      }
      s *= s;
      u *= u;
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
    }
    function position(row, u, rect, flush) {
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
      if (u == rect.dx) {
        if (flush || v > rect.dy) v = rect.dy;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dy = v;
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
        }
        o.z = true;
        o.dx += rect.x + rect.dx - x;
        rect.y += v;
        rect.dy -= v;
      } else {
        if (flush || v > rect.dx) v = rect.dx;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dx = v;
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
        }
        o.z = false;
        o.dy += rect.y + rect.dy - y;
        rect.x += v;
        rect.dx -= v;
      }
    }
    function treemap(d) {
      var nodes = stickies || hierarchy(d), root = nodes[0];
      root.x = root.y = 0;
      if (root.value) root.dx = size[0], root.dy = size[1]; else root.dx = root.dy = 0;
      if (stickies) hierarchy.revalue(root);
      scale([ root ], root.dx * root.dy / root.value);
      (stickies ? stickify : squarify)(root);
      if (sticky) stickies = nodes;
      return nodes;
    }
    treemap.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return treemap;
    };
    treemap.padding = function(x) {
      if (!arguments.length) return padding;
      function padFunction(node) {
        var p = x.call(treemap, node, node.depth);
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
      }
      function padConstant(node) {
        return d3_layout_treemapPad(node, x);
      }
      var type;
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
      padConstant) : padConstant;
      return treemap;
    };
    treemap.round = function(x) {
      if (!arguments.length) return round != Number;
      round = x ? Math.round : Number;
      return treemap;
    };
    treemap.sticky = function(x) {
      if (!arguments.length) return sticky;
      sticky = x;
      stickies = null;
      return treemap;
    };
    treemap.ratio = function(x) {
      if (!arguments.length) return ratio;
      ratio = x;
      return treemap;
    };
    treemap.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return treemap;
    };
    return d3_layout_hierarchyRebind(treemap, hierarchy);
  };
  function d3_layout_treemapPadNull(node) {
    return {
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    };
  }
  function d3_layout_treemapPad(node, padding) {
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
    if (dx < 0) {
      x += dx / 2;
      dx = 0;
    }
    if (dy < 0) {
      y += dy / 2;
      dy = 0;
    }
    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy
    };
  }
  d3.random = {
    normal: function(µ, σ) {
      var n = arguments.length;
      if (n < 2) σ = 1;
      if (n < 1) µ = 0;
      return function() {
        var x, y, r;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          r = x * x + y * y;
        } while (!r || r > 1);
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
      };
    },
    logNormal: function() {
      var random = d3.random.normal.apply(d3, arguments);
      return function() {
        return Math.exp(random());
      };
    },
    bates: function(m) {
      var random = d3.random.irwinHall(m);
      return function() {
        return random() / m;
      };
    },
    irwinHall: function(m) {
      return function() {
        for (var s = 0, j = 0; j < m; j++) s += Math.random();
        return s;
      };
    }
  };
  d3.scale = {};
  function d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }
  function d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
  }
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }
  function d3_scale_nice(domain, nice) {
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
    if (x1 < x0) {
      dx = i0, i0 = i1, i1 = dx;
      dx = x0, x0 = x1, x1 = dx;
    }
    domain[i0] = nice.floor(x0);
    domain[i1] = nice.ceil(x1);
    return domain;
  }
  function d3_scale_niceStep(step) {
    return step ? {
      floor: function(x) {
        return Math.floor(x / step) * step;
      },
      ceil: function(x) {
        return Math.ceil(x / step) * step;
      }
    } : d3_scale_niceIdentity;
  }
  var d3_scale_niceIdentity = {
    floor: d3_identity,
    ceil: d3_identity
  };
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }
    while (++j <= k) {
      u.push(uninterpolate(domain[j - 1], domain[j]));
      i.push(interpolate(range[j - 1], range[j]));
    }
    return function(x) {
      var j = d3.bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }
  d3.scale.linear = function() {
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
  };
  function d3_scale_linear(domain, range, interpolate, clamp) {
    var output, input;
    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, d3_interpolate);
      return scale;
    }
    function scale(x) {
      return output(x);
    }
    scale.invert = function(y) {
      return input(y);
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(Number);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(d3_interpolateRound);
    };
    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = x;
      return rescale();
    };
    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      d3_scale_linearNice(domain, m);
      return rescale();
    };
    scale.copy = function() {
      return d3_scale_linear(domain, range, interpolate, clamp);
    };
    return rescale();
  }
  function d3_scale_linearRebind(scale, linear) {
    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
  }
  function d3_scale_linearNice(domain, m) {
    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
    return domain;
  }
  function d3_scale_linearTickRange(domain, m) {
    if (m == null) m = 10;
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
    extent[0] = Math.ceil(extent[0] / step) * step;
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
    extent[2] = step;
    return extent;
  }
  function d3_scale_linearTicks(domain, m) {
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
  }
  function d3_scale_linearTickFormat(domain, m, format) {
    var range = d3_scale_linearTickRange(domain, m);
    if (format) {
      var match = d3_format_re.exec(format);
      match.shift();
      if (match[8] === "s") {
        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
        if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
        match[8] = "f";
        format = d3.format(match.join(""));
        return function(d) {
          return format(prefix.scale(d)) + prefix.symbol;
        };
      }
      if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
      format = match.join("");
    } else {
      format = ",." + d3_scale_linearPrecision(range[2]) + "f";
    }
    return d3.format(format);
  }
  var d3_scale_linearFormatSignificant = {
    s: 1,
    g: 1,
    p: 1,
    r: 1,
    e: 1
  };
  function d3_scale_linearPrecision(value) {
    return -Math.floor(Math.log(value) / Math.LN10 + .01);
  }
  function d3_scale_linearFormatPrecision(type, range) {
    var p = d3_scale_linearPrecision(range[2]);
    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
  }
  d3.scale.log = function() {
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
  };
  function d3_scale_log(linear, base, positive, domain) {
    function log(x) {
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
    }
    function pow(x) {
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
    }
    function scale(x) {
      return linear(log(x));
    }
    scale.invert = function(x) {
      return pow(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      positive = x[0] >= 0;
      linear.domain((domain = x.map(Number)).map(log));
      return scale;
    };
    scale.base = function(_) {
      if (!arguments.length) return base;
      base = +_;
      linear.domain(domain.map(log));
      return scale;
    };
    scale.nice = function() {
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
      linear.domain(niced);
      domain = niced.map(pow);
      return scale;
    };
    scale.ticks = function() {
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
      if (isFinite(j - i)) {
        if (positive) {
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
          ticks.push(pow(i));
        } else {
          ticks.push(pow(i));
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
        }
        for (i = 0; ticks[i] < u; i++) {}
        for (j = ticks.length; ticks[j - 1] > v; j--) {}
        ticks = ticks.slice(i, j);
      }
      return ticks;
    };
    scale.tickFormat = function(n, format) {
      if (!arguments.length) return d3_scale_logFormat;
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
      var k = Math.max(1, base * n / scale.ticks().length);
      return function(d) {
        var i = d / pow(Math.round(log(d)));
        if (i * base < base - .5) i *= base;
        return i <= k ? format(d) : "";
      };
    };
    scale.copy = function() {
      return d3_scale_log(linear.copy(), base, positive, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
    floor: function(x) {
      return -Math.ceil(-x);
    },
    ceil: function(x) {
      return -Math.floor(-x);
    }
  };
  d3.scale.pow = function() {
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
  };
  function d3_scale_pow(linear, exponent, domain) {
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
    function scale(x) {
      return linear(powp(x));
    }
    scale.invert = function(x) {
      return powb(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      linear.domain((domain = x.map(Number)).map(powp));
      return scale;
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      return scale.domain(d3_scale_linearNice(domain, m));
    };
    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      powp = d3_scale_powPow(exponent = x);
      powb = d3_scale_powPow(1 / exponent);
      linear.domain(domain.map(powp));
      return scale;
    };
    scale.copy = function() {
      return d3_scale_pow(linear.copy(), exponent, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_scale_powPow(e) {
    return function(x) {
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
    };
  }
  d3.scale.sqrt = function() {
    return d3.scale.pow().exponent(.5);
  };
  d3.scale.ordinal = function() {
    return d3_scale_ordinal([], {
      t: "range",
      a: [ [] ]
    });
  };
  function d3_scale_ordinal(domain, ranger) {
    var index, range, rangeBand;
    function scale(x) {
      return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
    }
    function steps(start, step) {
      return d3.range(domain.length).map(function(i) {
        return start + step * i;
      });
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      index = new d3_Map();
      var i = -1, n = x.length, xi;
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      rangeBand = 0;
      ranger = {
        t: "range",
        a: arguments
      };
      return scale;
    };
    scale.rangePoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2, 
      0) : (stop - start) / (domain.length - 1 + padding);
      range = steps(start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {
        t: "rangePoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundPoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 
      0) : (stop - start) / (domain.length - 1 + padding) | 0;
      range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
      rangeBand = 0;
      ranger = {
        t: "rangeRoundPoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {
        t: "rangeBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
      range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {
        t: "rangeRoundBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeBand = function() {
      return rangeBand;
    };
    scale.rangeExtent = function() {
      return d3_scaleExtent(ranger.a[0]);
    };
    scale.copy = function() {
      return d3_scale_ordinal(domain, ranger);
    };
    return scale.domain(domain);
  }
  d3.scale.category10 = function() {
    return d3.scale.ordinal().range(d3_category10);
  };
  d3.scale.category20 = function() {
    return d3.scale.ordinal().range(d3_category20);
  };
  d3.scale.category20b = function() {
    return d3.scale.ordinal().range(d3_category20b);
  };
  d3.scale.category20c = function() {
    return d3.scale.ordinal().range(d3_category20c);
  };
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
  d3.scale.quantile = function() {
    return d3_scale_quantile([], []);
  };
  function d3_scale_quantile(domain, range) {
    var thresholds;
    function rescale() {
      var k = 0, q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
      return scale;
    }
    function scale(x) {
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.quantiles = function() {
      return thresholds;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
    };
    scale.copy = function() {
      return d3_scale_quantile(domain, range);
    };
    return rescale();
  }
  d3.scale.quantize = function() {
    return d3_scale_quantize(0, 1, [ 0, 1 ]);
  };
  function d3_scale_quantize(x0, x1, range) {
    var kx, i;
    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }
    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }
    scale.domain = function(x) {
      if (!arguments.length) return [ x0, x1 ];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [ y, y + 1 / kx ];
    };
    scale.copy = function() {
      return d3_scale_quantize(x0, x1, range);
    };
    return rescale();
  }
  d3.scale.threshold = function() {
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
  };
  function d3_scale_threshold(domain, range) {
    function scale(x) {
      if (x <= x) return range[d3.bisect(domain, x)];
    }
    scale.domain = function(_) {
      if (!arguments.length) return domain;
      domain = _;
      return scale;
    };
    scale.range = function(_) {
      if (!arguments.length) return range;
      range = _;
      return scale;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return [ domain[y - 1], domain[y] ];
    };
    scale.copy = function() {
      return d3_scale_threshold(domain, range);
    };
    return scale;
  }
  d3.scale.identity = function() {
    return d3_scale_identity([ 0, 1 ]);
  };
  function d3_scale_identity(domain) {
    function identity(x) {
      return +x;
    }
    identity.invert = identity;
    identity.domain = identity.range = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(identity);
      return identity;
    };
    identity.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    identity.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    identity.copy = function() {
      return d3_scale_identity(domain);
    };
    return identity;
  }
  d3.svg = {};
  function d3_zero() {
    return 0;
  }
  d3.svg.arc = function() {
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
    function arc() {
      var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
      var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
        rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
        if (!cw) p1 *= -1;
        if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
        if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
      }
      if (r1) {
        x0 = r1 * Math.cos(a0 + p1);
        y0 = r1 * Math.sin(a0 + p1);
        x1 = r1 * Math.cos(a1 - p1);
        y1 = r1 * Math.sin(a1 - p1);
        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
        if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
          var h1 = (a0 + a1) / 2;
          x0 = r1 * Math.cos(h1);
          y0 = r1 * Math.sin(h1);
          x1 = y1 = null;
        }
      } else {
        x0 = y0 = 0;
      }
      if (r0) {
        x2 = r0 * Math.cos(a1 - p0);
        y2 = r0 * Math.sin(a1 - p0);
        x3 = r0 * Math.cos(a0 + p0);
        y3 = r0 * Math.sin(a0 + p0);
        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
        if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
          var h0 = (a0 + a1) / 2;
          x2 = r0 * Math.cos(h0);
          y2 = r0 * Math.sin(h0);
          x3 = y3 = null;
        }
      } else {
        x2 = y2 = 0;
      }
      if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
        cr = r0 < r1 ^ cw ? 0 : 1;
        var rc1 = rc, rc0 = rc;
        if (da < π) {
          var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
          rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
        }
        if (x1 != null) {
          var t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
          if (rc === rc1) {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
          } else {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
          }
        } else {
          path.push("M", x0, ",", y0);
        }
        if (x3 != null) {
          var t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
          if (rc === rc0) {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          } else {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          }
        } else {
          path.push("L", x2, ",", y2);
        }
      } else {
        path.push("M", x0, ",", y0);
        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
        path.push("L", x2, ",", y2);
        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
      }
      path.push("Z");
      return path.join("");
    }
    function circleSegment(r1, cw) {
      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
    }
    arc.innerRadius = function(v) {
      if (!arguments.length) return innerRadius;
      innerRadius = d3_functor(v);
      return arc;
    };
    arc.outerRadius = function(v) {
      if (!arguments.length) return outerRadius;
      outerRadius = d3_functor(v);
      return arc;
    };
    arc.cornerRadius = function(v) {
      if (!arguments.length) return cornerRadius;
      cornerRadius = d3_functor(v);
      return arc;
    };
    arc.padRadius = function(v) {
      if (!arguments.length) return padRadius;
      padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
      return arc;
    };
    arc.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return arc;
    };
    arc.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return arc;
    };
    arc.padAngle = function(v) {
      if (!arguments.length) return padAngle;
      padAngle = d3_functor(v);
      return arc;
    };
    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
      return [ Math.cos(a) * r, Math.sin(a) * r ];
    };
    return arc;
  };
  var d3_svg_arcAuto = "auto";
  function d3_svg_arcInnerRadius(d) {
    return d.innerRadius;
  }
  function d3_svg_arcOuterRadius(d) {
    return d.outerRadius;
  }
  function d3_svg_arcStartAngle(d) {
    return d.startAngle;
  }
  function d3_svg_arcEndAngle(d) {
    return d.endAngle;
  }
  function d3_svg_arcPadAngle(d) {
    return d && d.padAngle;
  }
  function d3_svg_arcSweep(x0, y0, x1, y1) {
    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
  }
  function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
    var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
    return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
  }
  function d3_svg_line(projection) {
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
    function line(data) {
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
      function segment() {
        segments.push("M", interpolate(projection(points), tension));
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
        } else if (points.length) {
          segment();
          points = [];
        }
      }
      if (points.length) segment();
      return segments.length ? segments.join("") : null;
    }
    line.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return line;
    };
    line.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return line;
    };
    line.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return line;
    };
    line.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      return line;
    };
    line.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return line;
    };
    return line;
  }
  d3.svg.line = function() {
    return d3_svg_line(d3_identity);
  };
  var d3_svg_lineInterpolators = d3.map({
    linear: d3_svg_lineLinear,
    "linear-closed": d3_svg_lineLinearClosed,
    step: d3_svg_lineStep,
    "step-before": d3_svg_lineStepBefore,
    "step-after": d3_svg_lineStepAfter,
    basis: d3_svg_lineBasis,
    "basis-open": d3_svg_lineBasisOpen,
    "basis-closed": d3_svg_lineBasisClosed,
    bundle: d3_svg_lineBundle,
    cardinal: d3_svg_lineCardinal,
    "cardinal-open": d3_svg_lineCardinalOpen,
    "cardinal-closed": d3_svg_lineCardinalClosed,
    monotone: d3_svg_lineMonotone
  });
  d3_svg_lineInterpolators.forEach(function(key, value) {
    value.key = key;
    value.closed = /-closed$/.test(key);
  });
  function d3_svg_lineLinear(points) {
    return points.length > 1 ? points.join("L") : points + "Z";
  }
  function d3_svg_lineLinearClosed(points) {
    return points.join("L") + "Z";
  }
  function d3_svg_lineStep(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
    if (n > 1) path.push("H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepBefore(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepAfter(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
    return path.join("");
  }
  function d3_svg_lineCardinalOpen(points, tension) {
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineCardinalClosed(points, tension) {
    return points.length < 3 ? d3_svg_lineLinearClosed(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
  }
  function d3_svg_lineCardinal(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineHermite(points, tangents) {
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
      return d3_svg_lineLinear(points);
    }
    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
    if (quad) {
      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
      p0 = points[1];
      pi = 2;
    }
    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      for (var i = 2; i < tangents.length; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      }
    }
    if (quad) {
      var lp = points[pi];
      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
    }
    return path;
  }
  function d3_svg_lineCardinalTangents(points, tension) {
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
    while (++i < n) {
      p0 = p1;
      p1 = p2;
      p2 = points[i];
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
    }
    return tangents;
  }
  function d3_svg_lineBasis(points) {
    if (points.length < 3) return d3_svg_lineLinear(points);
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    points.push(points[n - 1]);
    while (++i <= n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    points.pop();
    path.push("L", pi);
    return path.join("");
  }
  function d3_svg_lineBasisOpen(points) {
    if (points.length < 4) return d3_svg_lineLinear(points);
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
    while (++i < 3) {
      pi = points[i];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
    --i;
    while (++i < n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBasisClosed(points) {
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
    while (++i < 4) {
      pi = points[i % n];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    --i;
    while (++i < m) {
      pi = points[i % n];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBundle(points, tension) {
    var n = points.length - 1;
    if (n) {
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
      while (++i <= n) {
        p = points[i];
        t = i / n;
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
      }
    }
    return d3_svg_lineBasis(points);
  }
  function d3_svg_lineDot4(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
  function d3_svg_lineBasisBezier(path, x, y) {
    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
  }
  function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  }
  function d3_svg_lineFiniteDifferences(points) {
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
    while (++i < j) {
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
  }
  function d3_svg_lineMonotoneTangents(points) {
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
    while (++i < j) {
      d = d3_svg_lineSlope(points[i], points[i + 1]);
      if (abs(d) < ε) {
        m[i] = m[i + 1] = 0;
      } else {
        a = m[i] / d;
        b = m[i + 1] / d;
        s = a * a + b * b;
        if (s > 9) {
          s = d * 3 / Math.sqrt(s);
          m[i] = s * a;
          m[i + 1] = s * b;
        }
      }
    }
    i = -1;
    while (++i <= j) {
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
      tangents.push([ s || 0, m[i] * s || 0 ]);
    }
    return tangents;
  }
  function d3_svg_lineMonotone(points) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
  }
  d3.svg.line.radial = function() {
    var line = d3_svg_line(d3_svg_lineRadial);
    line.radius = line.x, delete line.x;
    line.angle = line.y, delete line.y;
    return line;
  };
  function d3_svg_lineRadial(points) {
    var point, i = -1, n = points.length, r, a;
    while (++i < n) {
      point = points[i];
      r = point[0];
      a = point[1] - halfπ;
      point[0] = r * Math.cos(a);
      point[1] = r * Math.sin(a);
    }
    return points;
  }
  function d3_svg_area(projection) {
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
    function area(data) {
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
        return x;
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
        return y;
      } : d3_functor(y1), x, y;
      function segment() {
        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
        } else if (points0.length) {
          segment();
          points0 = [];
          points1 = [];
        }
      }
      if (points0.length) segment();
      return segments.length ? segments.join("") : null;
    }
    area.x = function(_) {
      if (!arguments.length) return x1;
      x0 = x1 = _;
      return area;
    };
    area.x0 = function(_) {
      if (!arguments.length) return x0;
      x0 = _;
      return area;
    };
    area.x1 = function(_) {
      if (!arguments.length) return x1;
      x1 = _;
      return area;
    };
    area.y = function(_) {
      if (!arguments.length) return y1;
      y0 = y1 = _;
      return area;
    };
    area.y0 = function(_) {
      if (!arguments.length) return y0;
      y0 = _;
      return area;
    };
    area.y1 = function(_) {
      if (!arguments.length) return y1;
      y1 = _;
      return area;
    };
    area.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return area;
    };
    area.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      interpolateReverse = interpolate.reverse || interpolate;
      L = interpolate.closed ? "M" : "L";
      return area;
    };
    area.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return area;
    };
    return area;
  }
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
  d3.svg.area = function() {
    return d3_svg_area(d3_identity);
  };
  d3.svg.area.radial = function() {
    var area = d3_svg_area(d3_svg_lineRadial);
    area.radius = area.x, delete area.x;
    area.innerRadius = area.x0, delete area.x0;
    area.outerRadius = area.x1, delete area.x1;
    area.angle = area.y, delete area.y;
    area.startAngle = area.y0, delete area.y0;
    area.endAngle = area.y1, delete area.y1;
    return area;
  };
  d3.svg.chord = function() {
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function chord(d, i) {
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
    }
    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
      return {
        r: r,
        a0: a0,
        a1: a1,
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
      };
    }
    function equals(a, b) {
      return a.a0 == b.a0 && a.a1 == b.a1;
    }
    function arc(r, p, a) {
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
    }
    function curve(r0, p0, r1, p1) {
      return "Q 0,0 " + p1;
    }
    chord.radius = function(v) {
      if (!arguments.length) return radius;
      radius = d3_functor(v);
      return chord;
    };
    chord.source = function(v) {
      if (!arguments.length) return source;
      source = d3_functor(v);
      return chord;
    };
    chord.target = function(v) {
      if (!arguments.length) return target;
      target = d3_functor(v);
      return chord;
    };
    chord.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return chord;
    };
    chord.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return chord;
    };
    return chord;
  };
  function d3_svg_chordRadius(d) {
    return d.radius;
  }
  d3.svg.diagonal = function() {
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
    function diagonal(d, i) {
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
        x: p0.x,
        y: m
      }, {
        x: p3.x,
        y: m
      }, p3 ];
      p = p.map(projection);
      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    diagonal.source = function(x) {
      if (!arguments.length) return source;
      source = d3_functor(x);
      return diagonal;
    };
    diagonal.target = function(x) {
      if (!arguments.length) return target;
      target = d3_functor(x);
      return diagonal;
    };
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    return diagonal;
  };
  function d3_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
  }
  d3.svg.diagonal.radial = function() {
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
    diagonal.projection = function(x) {
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
    };
    return diagonal;
  };
  function d3_svg_diagonalRadialProjection(projection) {
    return function() {
      var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
      return [ r * Math.cos(a), r * Math.sin(a) ];
    };
  }
  d3.svg.symbol = function() {
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
    function symbol(d, i) {
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
    }
    symbol.type = function(x) {
      if (!arguments.length) return type;
      type = d3_functor(x);
      return symbol;
    };
    symbol.size = function(x) {
      if (!arguments.length) return size;
      size = d3_functor(x);
      return symbol;
    };
    return symbol;
  };
  function d3_svg_symbolSize() {
    return 64;
  }
  function d3_svg_symbolType() {
    return "circle";
  }
  function d3_svg_symbolCircle(size) {
    var r = Math.sqrt(size / π);
    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
  }
  var d3_svg_symbols = d3.map({
    circle: d3_svg_symbolCircle,
    cross: function(size) {
      var r = Math.sqrt(size / 5) / 2;
      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
    },
    diamond: function(size) {
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
    },
    square: function(size) {
      var r = Math.sqrt(size) / 2;
      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
    },
    "triangle-down": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
    },
    "triangle-up": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
    }
  });
  d3.svg.symbolTypes = d3_svg_symbols.keys();
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
  d3_selectionPrototype.transition = function(name) {
    var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
      time: Date.now(),
      ease: d3_ease_cubicInOut,
      delay: 0,
      duration: 250
    };
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_selectionPrototype.interrupt = function(name) {
    return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
  };
  var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());
  function d3_selection_interruptNS(ns) {
    return function() {
      var lock, activeId, active;
      if ((lock = this[ns]) && (active = lock[activeId = lock.active])) {
        active.timer.c = null;
        active.timer.t = NaN;
        if (--lock.count) delete lock[activeId]; else delete this[ns];
        lock.active += .5;
        active.event && active.event.interrupt.call(this, this.__data__, active.index);
      }
    };
  }
  function d3_transition(groups, ns, id) {
    d3_subclass(groups, d3_transitionPrototype);
    groups.namespace = ns;
    groups.id = id;
    return groups;
  }
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
  d3_transitionPrototype.call = d3_selectionPrototype.call;
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
  d3_transitionPrototype.node = d3_selectionPrototype.node;
  d3_transitionPrototype.size = d3_selectionPrototype.size;
  d3.transition = function(selection, name) {
    return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3.selection().transition(selection);
  };
  d3.transition.prototype = d3_transitionPrototype;
  d3_transitionPrototype.select = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          d3_transitionNode(subnode, i, ns, id, node[ns][id]);
          subgroup.push(subnode);
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.selectAll = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          transition = node[ns][id];
          subnodes = selector.call(node, node.__data__, i, j);
          subgroups.push(subgroup = []);
          for (var k = -1, o = subnodes.length; ++k < o; ) {
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
            subgroup.push(subnode);
          }
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_transition(subgroups, this.namespace, this.id);
  };
  d3_transitionPrototype.tween = function(name, tween) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
    return d3_selection_each(this, tween == null ? function(node) {
      node[ns][id].tween.remove(name);
    } : function(node) {
      node[ns][id].tween.set(name, tween);
    });
  };
  function d3_transition_tween(groups, name, value, tween) {
    var id = groups.id, ns = groups.namespace;
    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
    } : (value = tween(value), function(node) {
      node[ns][id].tween.set(name, value);
    }));
  }
  d3_transitionPrototype.attr = function(nameNS, value) {
    if (arguments.length < 2) {
      for (value in nameNS) this.attr(value, nameNS[value]);
      return this;
    }
    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrTween(b) {
      return b == null ? attrNull : (b += "", function() {
        var a = this.getAttribute(name), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttribute(name, i(t));
        });
      });
    }
    function attrTweenNS(b) {
      return b == null ? attrNullNS : (b += "", function() {
        var a = this.getAttributeNS(name.space, name.local), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttributeNS(name.space, name.local, i(t));
        });
      });
    }
    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.attrTween = function(nameNS, tween) {
    var name = d3.ns.qualify(nameNS);
    function attrTween(d, i) {
      var f = tween.call(this, d, i, this.getAttribute(name));
      return f && function(t) {
        this.setAttribute(name, f(t));
      };
    }
    function attrTweenNS(d, i) {
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
      return f && function(t) {
        this.setAttributeNS(name.space, name.local, f(t));
      };
    }
    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.style(priority, name[priority], value);
        return this;
      }
      priority = "";
    }
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleString(b) {
      return b == null ? styleNull : (b += "", function() {
        var a = d3_window(this).getComputedStyle(this, null).getPropertyValue(name), i;
        return a !== b && (i = d3_interpolate(a, b), function(t) {
          this.style.setProperty(name, i(t), priority);
        });
      });
    }
    return d3_transition_tween(this, "style." + name, value, styleString);
  };
  d3_transitionPrototype.styleTween = function(name, tween, priority) {
    if (arguments.length < 3) priority = "";
    function styleTween(d, i) {
      var f = tween.call(this, d, i, d3_window(this).getComputedStyle(this, null).getPropertyValue(name));
      return f && function(t) {
        this.style.setProperty(name, f(t), priority);
      };
    }
    return this.tween("style." + name, styleTween);
  };
  d3_transitionPrototype.text = function(value) {
    return d3_transition_tween(this, "text", value, d3_transition_text);
  };
  function d3_transition_text(b) {
    if (b == null) b = "";
    return function() {
      this.textContent = b;
    };
  }
  d3_transitionPrototype.remove = function() {
    var ns = this.namespace;
    return this.each("end.transition", function() {
      var p;
      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
    });
  };
  d3_transitionPrototype.ease = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].ease;
    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
    return d3_selection_each(this, function(node) {
      node[ns][id].ease = value;
    });
  };
  d3_transitionPrototype.delay = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].delay;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].delay = +value.call(node, node.__data__, i, j);
    } : (value = +value, function(node) {
      node[ns][id].delay = value;
    }));
  };
  d3_transitionPrototype.duration = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].duration;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
    } : (value = Math.max(1, value), function(node) {
      node[ns][id].duration = value;
    }));
  };
  d3_transitionPrototype.each = function(type, listener) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) {
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
      try {
        d3_transitionInheritId = id;
        d3_selection_each(this, function(node, i, j) {
          d3_transitionInherit = node[ns][id];
          type.call(node, node.__data__, i, j);
        });
      } finally {
        d3_transitionInherit = inherit;
        d3_transitionInheritId = inheritId;
      }
    } else {
      d3_selection_each(this, function(node) {
        var transition = node[ns][id];
        (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
      });
    }
    return this;
  };
  d3_transitionPrototype.transition = function() {
    var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if (node = group[i]) {
          transition = node[ns][id0];
          d3_transitionNode(node, i, ns, id1, {
            time: transition.time,
            ease: transition.ease,
            delay: transition.delay + transition.duration,
            duration: transition.duration
          });
        }
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id1);
  };
  function d3_transitionNamespace(name) {
    return name == null ? "__transition__" : "__transition_" + name + "__";
  }
  function d3_transitionNode(node, i, ns, id, inherit) {
    var lock = node[ns] || (node[ns] = {
      active: 0,
      count: 0
    }), transition = lock[id], time, timer, duration, ease, tweens;
    function schedule(elapsed) {
      var delay = transition.delay;
      timer.t = delay + time;
      if (delay <= elapsed) return start(elapsed - delay);
      timer.c = start;
    }
    function start(elapsed) {
      var activeId = lock.active, active = lock[activeId];
      if (active) {
        active.timer.c = null;
        active.timer.t = NaN;
        --lock.count;
        delete lock[activeId];
        active.event && active.event.interrupt.call(node, node.__data__, active.index);
      }
      for (var cancelId in lock) {
        if (+cancelId < id) {
          var cancel = lock[cancelId];
          cancel.timer.c = null;
          cancel.timer.t = NaN;
          --lock.count;
          delete lock[cancelId];
        }
      }
      timer.c = tick;
      d3_timer(function() {
        if (timer.c && tick(elapsed || 1)) {
          timer.c = null;
          timer.t = NaN;
        }
        return 1;
      }, 0, time);
      lock.active = id;
      transition.event && transition.event.start.call(node, node.__data__, i);
      tweens = [];
      transition.tween.forEach(function(key, value) {
        if (value = value.call(node, node.__data__, i)) {
          tweens.push(value);
        }
      });
      ease = transition.ease;
      duration = transition.duration;
    }
    function tick(elapsed) {
      var t = elapsed / duration, e = ease(t), n = tweens.length;
      while (n > 0) {
        tweens[--n].call(node, e);
      }
      if (t >= 1) {
        transition.event && transition.event.end.call(node, node.__data__, i);
        if (--lock.count) delete lock[id]; else delete node[ns];
        return 1;
      }
    }
    if (!transition) {
      time = inherit.time;
      timer = d3_timer(schedule, 0, time);
      transition = lock[id] = {
        tween: new d3_Map(),
        time: time,
        timer: timer,
        delay: inherit.delay,
        duration: inherit.duration,
        ease: inherit.ease,
        index: i
      };
      inherit = null;
      ++lock.count;
    }
  }
  d3.svg.axis = function() {
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
    function axis(g) {
      g.each(function() {
        var g = d3.select(this);
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick.order()).style("opacity", 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, tickTransform;
        var range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
        d3.transition(path));
        tickEnter.append("line");
        tickEnter.append("text");
        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text"), sign = orient === "top" || orient === "left" ? -1 : 1, x1, x2, y1, y2;
        if (orient === "bottom" || orient === "top") {
          tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
          text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
          pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
        } else {
          tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
          text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
          pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
        }
        lineEnter.attr(y2, sign * innerTickSize);
        textEnter.attr(y1, sign * tickSpacing);
        lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
        textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);
        if (scale1.rangeBand) {
          var x = scale1, dx = x.rangeBand() / 2;
          scale0 = scale1 = function(d) {
            return x(d) + dx;
          };
        } else if (scale0.rangeBand) {
          scale0 = scale1;
        } else {
          tickExit.call(tickTransform, scale1, scale0);
        }
        tickEnter.call(tickTransform, scale0, scale1);
        tickUpdate.call(tickTransform, scale1, scale1);
      });
    }
    axis.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x;
      return axis;
    };
    axis.orient = function(x) {
      if (!arguments.length) return orient;
      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
      return axis;
    };
    axis.ticks = function() {
      if (!arguments.length) return tickArguments_;
      tickArguments_ = d3_array(arguments);
      return axis;
    };
    axis.tickValues = function(x) {
      if (!arguments.length) return tickValues;
      tickValues = x;
      return axis;
    };
    axis.tickFormat = function(x) {
      if (!arguments.length) return tickFormat_;
      tickFormat_ = x;
      return axis;
    };
    axis.tickSize = function(x) {
      var n = arguments.length;
      if (!n) return innerTickSize;
      innerTickSize = +x;
      outerTickSize = +arguments[n - 1];
      return axis;
    };
    axis.innerTickSize = function(x) {
      if (!arguments.length) return innerTickSize;
      innerTickSize = +x;
      return axis;
    };
    axis.outerTickSize = function(x) {
      if (!arguments.length) return outerTickSize;
      outerTickSize = +x;
      return axis;
    };
    axis.tickPadding = function(x) {
      if (!arguments.length) return tickPadding;
      tickPadding = +x;
      return axis;
    };
    axis.tickSubdivide = function() {
      return arguments.length && axis;
    };
    return axis;
  };
  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  };
  function d3_svg_axisX(selection, x0, x1) {
    selection.attr("transform", function(d) {
      var v0 = x0(d);
      return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)";
    });
  }
  function d3_svg_axisY(selection, y0, y1) {
    selection.attr("transform", function(d) {
      var v0 = y0(d);
      return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")";
    });
  }
  d3.svg.brush = function() {
    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];
    function brush(g) {
      g.each(function() {
        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
        var background = g.selectAll(".background").data([ 0 ]);
        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
        g.selectAll(".extent").data([ 0 ]).enter().append("rect").attr("class", "extent").style("cursor", "move");
        var resize = g.selectAll(".resize").data(resizes, d3_identity);
        resize.exit().remove();
        resize.enter().append("g").attr("class", function(d) {
          return "resize " + d;
        }).style("cursor", function(d) {
          return d3_svg_brushCursor[d];
        }).append("rect").attr("x", function(d) {
          return /[ew]$/.test(d) ? -3 : null;
        }).attr("y", function(d) {
          return /^[ns]/.test(d) ? -3 : null;
        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
        resize.style("display", brush.empty() ? "none" : null);
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;
        if (x) {
          range = d3_scaleRange(x);
          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
          redrawX(gUpdate);
        }
        if (y) {
          range = d3_scaleRange(y);
          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
          redrawY(gUpdate);
        }
        redraw(gUpdate);
      });
    }
    brush.event = function(g) {
      g.each(function() {
        var event_ = event.of(this, arguments), extent1 = {
          x: xExtent,
          y: yExtent,
          i: xExtentDomain,
          j: yExtentDomain
        }, extent0 = this.__chart__ || extent1;
        this.__chart__ = extent1;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.brush", function() {
            xExtentDomain = extent0.i;
            yExtentDomain = extent0.j;
            xExtent = extent0.x;
            yExtent = extent0.y;
            event_({
              type: "brushstart"
            });
          }).tween("brush:brush", function() {
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
            xExtentDomain = yExtentDomain = null;
            return function(t) {
              xExtent = extent1.x = xi(t);
              yExtent = extent1.y = yi(t);
              event_({
                type: "brush",
                mode: "resize"
              });
            };
          }).each("end.brush", function() {
            xExtentDomain = extent1.i;
            yExtentDomain = extent1.j;
            event_({
              type: "brush",
              mode: "resize"
            });
            event_({
              type: "brushend"
            });
          });
        } else {
          event_({
            type: "brushstart"
          });
          event_({
            type: "brush",
            mode: "resize"
          });
          event_({
            type: "brushend"
          });
        }
      });
    };
    function redraw(g) {
      g.selectAll(".resize").attr("transform", function(d) {
        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
      });
    }
    function redrawX(g) {
      g.select(".extent").attr("x", xExtent[0]);
      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
    }
    function redrawY(g) {
      g.select(".extent").attr("y", yExtent[0]);
      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
    }
    function brushstart() {
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(target), center, origin = d3.mouse(target), offset;
      var w = d3.select(d3_window(target)).on("keydown.brush", keydown).on("keyup.brush", keyup);
      if (d3.event.changedTouches) {
        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
      } else {
        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
      }
      g.interrupt().selectAll("*").interrupt();
      if (dragging) {
        origin[0] = xExtent[0] - origin[0];
        origin[1] = yExtent[0] - origin[1];
      } else if (resizing) {
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];
        origin[0] = xExtent[ex];
        origin[1] = yExtent[ey];
      } else if (d3.event.altKey) center = origin.slice();
      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
      d3.select("body").style("cursor", eventTarget.style("cursor"));
      event_({
        type: "brushstart"
      });
      brushmove();
      function keydown() {
        if (d3.event.keyCode == 32) {
          if (!dragging) {
            center = null;
            origin[0] -= xExtent[1];
            origin[1] -= yExtent[1];
            dragging = 2;
          }
          d3_eventPreventDefault();
        }
      }
      function keyup() {
        if (d3.event.keyCode == 32 && dragging == 2) {
          origin[0] += xExtent[1];
          origin[1] += yExtent[1];
          dragging = 0;
          d3_eventPreventDefault();
        }
      }
      function brushmove() {
        var point = d3.mouse(target), moved = false;
        if (offset) {
          point[0] += offset[0];
          point[1] += offset[1];
        }
        if (!dragging) {
          if (d3.event.altKey) {
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];
            origin[0] = xExtent[+(point[0] < center[0])];
            origin[1] = yExtent[+(point[1] < center[1])];
          } else center = null;
        }
        if (resizingX && move1(point, x, 0)) {
          redrawX(g);
          moved = true;
        }
        if (resizingY && move1(point, y, 1)) {
          redrawY(g);
          moved = true;
        }
        if (moved) {
          redraw(g);
          event_({
            type: "brush",
            mode: dragging ? "move" : "resize"
          });
        }
      }
      function move1(point, scale, i) {
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;
        if (dragging) {
          r0 -= position;
          r1 -= size + position;
        }
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
        if (dragging) {
          max = (min += position) + size;
        } else {
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
          if (position < min) {
            max = min;
            min = position;
          } else {
            max = position;
          }
        }
        if (extent[0] != min || extent[1] != max) {
          if (i) yExtentDomain = null; else xExtentDomain = null;
          extent[0] = min;
          extent[1] = max;
          return true;
        }
      }
      function brushend() {
        brushmove();
        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
        d3.select("body").style("cursor", null);
        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
        dragRestore();
        event_({
          type: "brushend"
        });
      }
    }
    brush.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.clamp = function(z) {
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;
      return brush;
    };
    brush.extent = function(z) {
      var x0, x1, y0, y1, t;
      if (!arguments.length) {
        if (x) {
          if (xExtentDomain) {
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
          } else {
            x0 = xExtent[0], x1 = xExtent[1];
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
            if (x1 < x0) t = x0, x0 = x1, x1 = t;
          }
        }
        if (y) {
          if (yExtentDomain) {
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
          } else {
            y0 = yExtent[0], y1 = yExtent[1];
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
            if (y1 < y0) t = y0, y0 = y1, y1 = t;
          }
        }
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
      }
      if (x) {
        x0 = z[0], x1 = z[1];
        if (y) x0 = x0[0], x1 = x1[0];
        xExtentDomain = [ x0, x1 ];
        if (x.invert) x0 = x(x0), x1 = x(x1);
        if (x1 < x0) t = x0, x0 = x1, x1 = t;
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];
      }
      if (y) {
        y0 = z[0], y1 = z[1];
        if (x) y0 = y0[1], y1 = y1[1];
        yExtentDomain = [ y0, y1 ];
        if (y.invert) y0 = y(y0), y1 = y(y1);
        if (y1 < y0) t = y0, y0 = y1, y1 = t;
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];
      }
      return brush;
    };
    brush.clear = function() {
      if (!brush.empty()) {
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];
        xExtentDomain = yExtentDomain = null;
      }
      return brush;
    };
    brush.empty = function() {
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
    };
    return d3.rebind(brush, event, "on");
  };
  var d3_svg_brushCursor = {
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };
  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
  var d3_time_formatUtc = d3_time_format.utc;
  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
  function d3_time_formatIsoNative(date) {
    return date.toISOString();
  }
  d3_time_formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
  d3_time.second = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 1e3) * 1e3);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
  }, function(date) {
    return date.getSeconds();
  });
  d3_time.seconds = d3_time.second.range;
  d3_time.seconds.utc = d3_time.second.utc.range;
  d3_time.minute = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 6e4) * 6e4);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
  }, function(date) {
    return date.getMinutes();
  });
  d3_time.minutes = d3_time.minute.range;
  d3_time.minutes.utc = d3_time.minute.utc.range;
  d3_time.hour = d3_time_interval(function(date) {
    var timezone = date.getTimezoneOffset() / 60;
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
  }, function(date) {
    return date.getHours();
  });
  d3_time.hours = d3_time.hour.range;
  d3_time.hours.utc = d3_time.hour.utc.range;
  d3_time.month = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setDate(1);
    return date;
  }, function(date, offset) {
    date.setMonth(date.getMonth() + offset);
  }, function(date) {
    return date.getMonth();
  });
  d3_time.months = d3_time.month.range;
  d3_time.months.utc = d3_time.month.utc.range;
  function d3_time_scale(linear, methods, format) {
    function scale(x) {
      return linear(x);
    }
    scale.invert = function(x) {
      return d3_time_scaleDate(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
      linear.domain(x);
      return scale;
    };
    function tickMethod(extent, count) {
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
        return d / 31536e6;
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
    }
    scale.nice = function(interval, skip) {
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
      if (method) interval = method[0], skip = method[1];
      function skipped(date) {
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
      }
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
        floor: function(date) {
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
          return date;
        },
        ceil: function(date) {
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
          return date;
        }
      } : interval));
    };
    scale.ticks = function(interval, skip) {
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
        range: interval
      }, skip ];
      if (method) interval = method[0], skip = method[1];
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
    };
    scale.tickFormat = function() {
      return format;
    };
    scale.copy = function() {
      return d3_time_scale(linear.copy(), methods, format);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_time_scaleDate(t) {
    return new Date(t);
  }
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ ".%L", function(d) {
    return d.getMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getMinutes();
  } ], [ "%I %p", function(d) {
    return d.getHours();
  } ], [ "%a %d", function(d) {
    return d.getDay() && d.getDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getDate() != 1;
  } ], [ "%B", function(d) {
    return d.getMonth();
  } ], [ "%Y", d3_true ] ]);
  var d3_time_scaleMilliseconds = {
    range: function(start, stop, step) {
      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
    },
    floor: d3_identity,
    ceil: d3_identity
  };
  d3_time_scaleLocalMethods.year = d3_time.year;
  d3_time.scale = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
  };
  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {
    return [ m[0].utc, m[1] ];
  });
  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ ".%L", function(d) {
    return d.getUTCMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getUTCSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getUTCMinutes();
  } ], [ "%I %p", function(d) {
    return d.getUTCHours();
  } ], [ "%a %d", function(d) {
    return d.getUTCDay() && d.getUTCDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getUTCDate() != 1;
  } ], [ "%B", function(d) {
    return d.getUTCMonth();
  } ], [ "%Y", d3_true ] ]);
  d3_time_scaleUtcMethods.year = d3_time.year.utc;
  d3_time.scale.utc = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);
  };
  d3.text = d3_xhrType(function(request) {
    return request.responseText;
  });
  d3.json = function(url, callback) {
    return d3_xhr(url, "application/json", d3_json, callback);
  };
  function d3_json(request) {
    return JSON.parse(request.responseText);
  }
  d3.html = function(url, callback) {
    return d3_xhr(url, "text/html", d3_html, callback);
  };
  function d3_html(request) {
    var range = d3_document.createRange();
    range.selectNode(d3_document.body);
    return range.createContextualFragment(request.responseText);
  }
  d3.xml = d3_xhrType(function(request) {
    return request.responseXML;
  });
  if (true) this.d3 = d3, !(__WEBPACK_AMD_DEFINE_FACTORY__ = (d3), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); else if (typeof module === "object" && module.exports) module.exports = d3; else this.d3 = d3;
}();

/***/ },

/***/ "./node_modules/jQuery-Mapael/js/jquery.mapael.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, Raphael) {/**
*
* Jquery Mapael - Dynamic maps jQuery plugin (based on raphael.js)
* Requires jQuery and raphael.js
*
* Version: 0.7.1 (23-01-2014)
*
* Copyright (c) 2014 Vincent Brouté (http://www.neveldo.fr/mapael)
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
*
*/
(function($) {

	"use strict";
	
	$.fn.mapael = function(options) {
		options = $.extend(true, {}, $.fn.mapael.defaultOptions, options);
		
		return this.each(function() {
		
			var $self = $(this)
				, $tooltip = $("<div>").addClass(options.map.tooltip.cssClass).css("display", "none")
				, $container = $('.' + options.map.cssClass, this).empty().append($tooltip)
				, mapConf = $.fn.mapael.maps[options.map.name]
				, paper = new Raphael($container[0], mapConf.width, mapConf.height)
				, elemOptions = {}
				, resizeTO = 0
				, areas = {}
				, plots = {}
				, areaLegend = {}
				, plotLegend = {}
				, id = 0;
			
			options.map.tooltip.css && $tooltip.css(options.map.tooltip.css);
			paper.setViewBox(0, 0, mapConf.width, mapConf.height, false);
			
			// Draw map areas
			for (id in mapConf.elems) {
				elemOptions = $.fn.mapael.getElemOptions(
					options.map.defaultArea
					, (options.areas[id] ? options.areas[id] : {})
					, options.legend.area
				);
				areas[id] = {'mapElem' : paper.path(mapConf.elems[id]).attr(elemOptions.attrs)};
			}
			
			// Init map areas in a second loop (prevent texts to be hidden by map elements)
			for (id in mapConf.elems) {
				elemOptions = $.fn.mapael.getElemOptions(
					options.map.defaultArea
					, (options.areas[id] ? options.areas[id] : {})
					, options.legend.area
				);
				$.fn.mapael.initElem(paper, areas[id], elemOptions, $tooltip, id);
			}
			
			// Draw plots
			for (id in options.plots) {
				plots[id] = $.fn.mapael.drawPlot(id, options, mapConf, paper, $tooltip);
			}
			
			// Enable zoom
			if (options.map.zoom.enabled)
				$.fn.mapael.initZoom($container, paper, mapConf.width, mapConf.height, options.map.zoom);
				
			// Create the legends for areas
			if (options.legend.area.slices && options.legend.area.display)
				areaLegend = $.fn.mapael.createLegend($self, options, 'area', areas, 1);
                
			/**
			* 
			* Update the current map
			* Refresh attributes and tooltips for areas and plots
			* @param updatedOptions options to update for plots and areas
			* @param newPlots new plots to add to the map
			* @param deletedPlotsplots to delete from the map
			* @param opt option for the refresh :
			*  opt.animDuration animation duration in ms (default = 0)
			*  opt.resetAreas true to reset previous areas options
			*  opt.resetPlots true to reset previous plots options
			*  opt.afterUpdate Hook that allows to add custom processing on the map
			*/
			$self.on('update', function(e, updatedOptions, newPlots, deletedPlots, opt) {
				var i = 0
					, id = 0
					, animDuration = 0
					, elemOptions = {}
					, resetHiddenElem = function(el) {
						if(typeof el.hidden != "undefined" && el.hidden == true) {
							$(el.node).trigger('click');
						}
					};
				
				areaLegend.forEach && areaLegend.forEach(resetHiddenElem);
				plotLegend.forEach && plotLegend.forEach(resetHiddenElem);
				
				if (typeof opt != 'undefined') {
					(opt.resetAreas) && (options.areas = {});
					(opt.resetPlots) && (options.plots = {});
					(opt.animDuration) && (animDuration = opt.animDuration);
				}
				
				$.extend(true, options, updatedOptions);
				
				// Delete plots
				if (typeof deletedPlots == 'object') {
					for (;i < deletedPlots.length; i++) {
						if (typeof plots[deletedPlots[i]] != 'undefined') {
							if (animDuration > 0) {
								(function(plot) {
									plot.mapElem.animate({'opacity':0}, animDuration, 'linear', function() {plot.mapElem.remove();});
									if (plot.textElem) {
										plot.textElem.animate({'opacity':0}, animDuration, 'linear', function() {plot.textElem.remove();});
									}
								})(plots[deletedPlots[i]]);
							} else {
								plots[deletedPlots[i]].mapElem.remove();
								if (plots[deletedPlots[i]].textElem) {
									plots[deletedPlots[i]].textElem.remove();
								}
							}
							delete plots[deletedPlots[i]];
						}
					}
				}
				
				// New plots
				if (typeof newPlots == 'object') {
					for (id in newPlots) {
						if (typeof plots[id] == 'undefined') {
							options.plots[id] = newPlots[id];
							plots[id] = $.fn.mapael.drawPlot(id, options, mapConf, paper, $tooltip);
							if (animDuration > 0) {
								plots[id].mapElem.attr({opacity : 0});
								plots[id].textElem.attr({opacity : 0});
								plots[id].mapElem.animate({'opacity': (typeof plots[id].mapElem.originalAttrs.opacity != 'undefined') ? plots[id].mapElem.originalAttrs.opacity : 1}, animDuration);
								plots[id].textElem.animate({'opacity': (typeof plots[id].textElem.originalAttrs.opacity != 'undefined') ? plots[id].textElem.originalAttrs.opacity : 1}, animDuration);
							} 
						}
					}
				}
				
				// Update areas attributes and tooltips
				for (id in areas) {
					elemOptions = $.fn.mapael.getElemOptions(
						options.map.defaultArea
						, (options.areas[id] ? options.areas[id] : {})
						, options.legend.area
					);
					
					$.fn.mapael.updateElem(elemOptions, areas[id], $tooltip, animDuration);
				}
				
				// Update plots attributes and tooltips
				for (id in plots) {
					elemOptions = $.fn.mapael.getElemOptions(
						options.map.defaultPlot
						, (options.plots[id] ? options.plots[id] : {})
						, options.legend.plot
					);
					
					// Update plot size
					if ("square" == elemOptions.type) {
						elemOptions.attrs.width = elemOptions.size;
						elemOptions.attrs.height = elemOptions.size;
						elemOptions.attrs.x = plots[id].mapElem.attrs.x - (elemOptions.size - plots[id].mapElem.attrs.width) / 2;
						elemOptions.attrs.y = plots[id].mapElem.attrs.y - (elemOptions.size - plots[id].mapElem.attrs.height) / 2;
					} else { // Default : circle
						elemOptions.attrs.r = elemOptions.size / 2;
					}
					
					$.fn.mapael.updateElem(elemOptions, plots[id], $tooltip, animDuration);
				}
				
				if( typeof opt != 'undefined' )
					opt.afterUpdate && opt.afterUpdate($self, paper, areas, plots, options);
			});
			
			// Handle resizing of the map
			if (options.map.width) {
				paper.setSize(options.map.width, mapConf.height * (options.map.width / mapConf.width));
				
				// Create the legends for plots taking into account the scale of the map
				if (options.legend.plot.slices && options.legend.plot.display)
					plotLegend = $.fn.mapael.createLegend($self, options, 'plot', plots, (options.map.width / mapConf.width));
			} else {
				$(window).on('resize', function() {
					clearTimeout(resizeTO);
					resizeTO = setTimeout(function(){$container.trigger('resizeEnd');}, 150);
				});
				
				// Create the legends for plots taking into account the scale of the map
				var createPlotLegend = function() {
					if (options.legend.plot.slices && options.legend.plot.display)
						plotLegend = $.fn.mapael.createLegend($self, options, 'plot', plots, ($container.width() / mapConf.width));
					
					$container.unbind('resizeEnd', createPlotLegend);
				};
				
				$container.on('resizeEnd', function() {
					var containerWidth = $container.width();
					if (paper.width != containerWidth) {
						paper.setSize(containerWidth, mapConf.height * (containerWidth / mapConf.width));
					}
				}).on('resizeEnd', createPlotLegend).trigger('resizeEnd');
			}
			
			// Hook that allows to add custom processing on the map
			options.map.afterInit && options.map.afterInit($self, paper, areas, plots, options);
			
			$(paper.desc).append(" and Mapael (http://neveldo.fr/mapael)");
		});
	};
	
	/**
	* Init the element 'elem' on the map (drawing, setting attributes, events, tooltip, ...)
	*/
	$.fn.mapael.initElem = function(paper, elem, options, $tooltip, id) {
		var bbox = {}, textPosition = {};
		$.fn.mapael.setHoverOptions(elem.mapElem, options.attrs, options.attrsHover);
		
		if (options.text && typeof options.text.content != 'undefined') {
			// Set a text label in the area
			bbox = elem.mapElem.getBBox();
			textPosition = $.fn.mapael.getTextPosition(bbox, options.text.position, options.text.margin);
			options.text.attrs['text-anchor'] = textPosition.textAnchor;
			elem.textElem = paper.text(textPosition.x, textPosition.y, options.text.content).attr(options.text.attrs);
			$.fn.mapael.setHoverOptions(elem.textElem, options.text.attrs, options.text.attrsHover);
			$.fn.mapael.setHover(paper, elem.mapElem, elem.textElem);
			options.eventHandlers && $.fn.mapael.setEventHandlers(id, options, elem.mapElem, elem.textElem);
			$(elem.textElem.node).attr('data-id', id);
		} else {
			$.fn.mapael.setHover(paper, elem.mapElem);
			options.eventHandlers && $.fn.mapael.setEventHandlers(id, options, elem.mapElem);
		}
		
		if (options.tooltip && options.tooltip.content) {
			elem.mapElem.tooltipContent = options.tooltip.content;
			$.fn.mapael.setTooltip(elem.mapElem, $tooltip);
			
			if (options.text && typeof options.text.content !='undefined') {
				elem.textElem.tooltipContent = options.tooltip.content;
				$.fn.mapael.setTooltip(elem.textElem, $tooltip);
			}
		}
		
		if (options.href) {
			elem.mapElem.href = options.href;
			$.fn.mapael.setHref(elem.mapElem);
			
			if (options.text && typeof options.text.content !='undefined') {
				elem.textElem.href = options.href;
				$.fn.mapael.setHref(elem.textElem);
			}
		}
		
		if (typeof options.value != "undefined")
			elem.value = options.value;
			
		$(elem.mapElem.node).attr('data-id', id);
	}

	/**
	* Update the element 'elem' on the map with the new elemOptions options
	*/
	$.fn.mapael.updateElem = function(elemOptions, elem, $tooltip, animDuration) {
		var bbox, textPosition, plotOffset;
		if (typeof elemOptions.value != "undefined")
			elem.value = elemOptions.value;
		
		// Update text
		if (elem.textElem) {
			if (typeof elemOptions.text != 'undefined' && typeof elemOptions.text.content != 'undefined' && elemOptions.text.content != elem.textElem.attrs.text)
				elem.textElem.attr({text : elemOptions.text.content});

			bbox = elem.mapElem.getBBox();
			if (elemOptions.size) {
				plotOffset = (elemOptions.size - bbox.height) / 2;
				bbox.x -= plotOffset;
				bbox.x2 += plotOffset;
				bbox.y -= plotOffset;
				bbox.y2 += plotOffset;
			}
			textPosition = $.fn.mapael.getTextPosition(bbox, elemOptions.text.position, elemOptions.text.margin);
			if (textPosition.x != elem.textElem.attrs.x || textPosition.y != elem.textElem.attrs.y) {
				if (animDuration > 0) {
					elem.textElem.attr({'text-anchor' : textPosition.textAnchor});
					elem.textElem.animate({x : textPosition.x, y : textPosition.y}, animDuration);
				} else
					elem.textElem.attr({x : textPosition.x, y : textPosition.y, 'text-anchor' : textPosition.textAnchor});
			}
			
			$.fn.mapael.setHoverOptions(elem.textElem, elemOptions.text.attrs, elemOptions.text.attrsHover);
			if (animDuration > 0)
				elem.textElem.animate(elemOptions.text.attrs, animDuration);
			else
				elem.textElem.attr(elemOptions.text.attrs);
		}
		
		$.fn.mapael.setHoverOptions(elem.mapElem, elemOptions.attrs, elemOptions.attrsHover);
		if (animDuration > 0)
			elem.mapElem.animate(elemOptions.attrs, animDuration);
		else
			elem.mapElem.attr(elemOptions.attrs);
		
		if (elemOptions.tooltip && typeof elemOptions.tooltip.content != 'undefined') {
			if (typeof elem.mapElem.tooltipContent == "undefined") {
				$.fn.mapael.setTooltip(elem.mapElem, $tooltip);
				(elem.textElem) && $.fn.mapael.setTooltip(elem.textElem, $tooltip);
			}
			elem.mapElem.tooltipContent = elemOptions.tooltip.content;
			(elem.textElem) && (elem.textElem.tooltipContent = elemOptions.tooltip.content);
		}
		
		if (typeof elemOptions.href != 'undefined') {
			if (typeof elem.mapElem.href == "undefined") {
				$.fn.mapael.setHref(elem.mapElem);
				(elem.textElem) && $.fn.mapael.setHref(elem.textElem);
			}
			elem.mapElem.href = elemOptions.href;
			(elem.textElem) && (elem.textElem.href = elemOptions.href);
		}
	}
	
	/**
	* Draw the plot
	*/
	$.fn.mapael.drawPlot = function(id, options, mapConf, paper, $tooltip) {
		var plot = {}
			, coords = {}
			, elemOptions = $.fn.mapael.getElemOptions(
				options.map.defaultPlot
				, (options.plots[id] ? options.plots[id] : {})
				, options.legend.plot
			);
		
		if (elemOptions.x && elemOptions.y) 
			coords = {x : elemOptions.x, y : elemOptions.y};
		else
			coords = mapConf.getCoords(elemOptions.latitude, elemOptions.longitude);
		
		if ("square" == elemOptions.type) {
			plot = {'mapElem' : paper.rect(
				coords.x - (elemOptions.size / 2)
				, coords.y - (elemOptions.size / 2)
				, elemOptions.size
				, elemOptions.size
			).attr(elemOptions.attrs)};
		} else { // Default = circle
			plot = {'mapElem' : paper.circle(coords.x, coords.y, elemOptions.size / 2).attr(elemOptions.attrs)};
		}
		
		$.fn.mapael.initElem(paper, plot, elemOptions, $tooltip, id);
		
		return plot;
	};
	
	/**
	* Set target link on elem
	*/
	$.fn.mapael.setHref = function(elem) {
		elem.attr({cursor : 'pointer'});
		$(elem.node).bind('click', function() {
			if (!$.fn.mapael.panning && elem.href)
				window.location = elem.href;
		});
	}
	
	/**
	* Set a tooltip for the areas and plots
	* @param elem area or plot element
	* @param $tooltip the tooltip container
	* @param content the content to set in the tooltip
	*/
	$.fn.mapael.setTooltip = function(elem, $tooltip) {
		var tooltipTO = 0
        	, $container = $tooltip.parent()
			, containerY2 = $container.offset().left + $container.width();
	
		$(elem.node).on("mouseover", function(e) {
			tooltipTO = setTimeout(
				function() {
					elem.tooltipContent && $tooltip.html(elem.tooltipContent).css("display", "block");
					$tooltip.css({"left" : Math.min(containerY2 - $tooltip.outerWidth() - 5, e.pageX + 12), "top" : e.pageY + 23 - $(window).scrollTop()});
				}
				, 120
			);
		}).on("mouseout", function(e) {
			clearTimeout(tooltipTO);
			$tooltip.css("display", "none");
		}).on("mousemove", function(e) {
			$tooltip.css({"left" : Math.min(containerY2 - $tooltip.outerWidth() - 5, e.pageX + 12), "top" : e.pageY + 23 - $(window).scrollTop()});
		});
	};
	
	/**
	* Set user defined handlers for events on areas and plots
	* @param id the id of the element 
	* @param elemOptions the element parameters
	* @param mapElem the map element to set callback on
	* @param textElem the optional text within the map element
	*/
	$.fn.mapael.setEventHandlers = function(id, elemOptions, mapElem, textElem) {
		for(var event in elemOptions.eventHandlers) {
			(function(event) {
				$(mapElem.node).on(event, function(e) {!$.fn.mapael.panning && elemOptions.eventHandlers[event](e, id, mapElem, textElem)});
				textElem && $(textElem.node).on(event, function(e) {!$.fn.mapael.panning && elemOptions.eventHandlers[event](e, id, mapElem, textElem)});
			})(event);
		}
	}
	
	$.fn.mapael.panning = false;
	
	/**
	* Init zoom and panning for the map
	* @param $container
	* @param paper
	* @param mapWidth
	* @param mapHeight
	* @param options
	*/
	$.fn.mapael.initZoom = function($container, paper, mapWidth, mapHeight, options) {
		var $parentContainer = $container.parent()
			, $zoomIn = $("<div>").addClass(options.zoomInCssClass).html("+")
			, $zoomOut = $("<div>").addClass(options.zoomOutCssClass).html("&#x2212;")
			, mousedown  = false
			, previousX = 0
			, previousY = 0;
		
		// Zoom
		$parentContainer.data("zoomLevel", 0);
		$container.append($zoomIn).append($zoomOut);
		
		$parentContainer.on("zoom", function(e, level, x, y) {
			var currentLevel = Math.min(Math.max(level, 0), options.maxLevel);
			$parentContainer.data("zoomLevel", currentLevel);
			
			(typeof x == "undefined") && (x = (paper._viewBox[0] + paper._viewBox[2] / 2));
			(typeof y == "undefined") && (y = (paper._viewBox[1] + paper._viewBox[3] / 2));
			
			// Update zoom level of the map
			if (currentLevel == 0) {
				paper.setViewBox(0, 0, mapWidth, mapHeight);
			} else {
				paper.setViewBox(
					Math.min(Math.max(0, x - (mapWidth / (1 + currentLevel * options.step))/2), (mapWidth - (mapWidth / (1 + currentLevel * options.step)))), 
					Math.min(Math.max(0, y - (mapHeight / (1 + currentLevel * options.step))/2), (mapHeight - (mapHeight / (1 + currentLevel * options.step)))), 
					mapWidth / (1 + currentLevel * options.step), 
					mapHeight / (1 + currentLevel * options.step)
				);
			}
		});
		
		$zoomIn.on("click", function() {$parentContainer.trigger("zoom", $parentContainer.data("zoomLevel") + 1);});
		$zoomOut.on("click", function() {$parentContainer.trigger("zoom", $parentContainer.data("zoomLevel") - 1);});
		
		// Panning
		$('body').on("mouseup", function(e) {
			mousedown  = false;
			setTimeout(function () {$.fn.mapael.panning = false;}, 50);
		});
		
		$container.on("mousedown", function(e) {
			mousedown  = true;
			previousX = e.pageX;
			previousY = e.pageY;
			return false;
		}).on("mousemove", function(e) {
			var currentLevel = $parentContainer.data("zoomLevel");
			if (mousedown  && currentLevel != 0) {
				var offsetX = (previousX - e.pageX) / (1 + (currentLevel * options.step)) * (mapWidth / paper.width)
					, offsetY = (previousY - e.pageY) / (1 + (currentLevel * options.step)) * (mapHeight / paper.height);					
				
				if (Math.abs(offsetX) > 5 || Math.abs(offsetY) > 5) {
					paper.setViewBox(
						Math.min(Math.max(0, paper._viewBox[0] + offsetX), (mapWidth - paper._viewBox[2])), 
						Math.min(Math.max(0, paper._viewBox[1] + offsetY), (mapHeight - paper._viewBox[3])),
						paper._viewBox[2],
						paper._viewBox[3]
					);
					
					previousX = e.pageX;
					previousY = e.pageY;
					$.fn.mapael.panning = true;
				}
			}
			return false;
		});
	}
	
	/**
	* Draw a legend for areas and / or plots
	* @param $container the legend container
	* @param options map options
	* @param legendType the type of the legend : 'area' or 'plot'
	*/
	$.fn.mapael.createLegend = function ($container, options, legendType, elems, scale) {
		var legendOptions = options.legend[legendType]
			, $legend = (legendType == 'plot') ? $('.' + options.legend.plot.cssClass, $container).empty() : $('.' + options.legend.area.cssClass, $container).empty()
			, paper = new Raphael($legend.get(0))
			, width = 5
			, height = 5
			, title = {}
			, defaultElemOptions = {}
			, elem = {}
			, label = {};
		
		if(legendOptions.title) {
			title = paper.text(legendOptions.marginLeftTitle, legendOptions.marginBottom, legendOptions.title)
				.attr(legendOptions.titleAttrs);
				
			width = legendOptions.marginLeftTitle + title.getBBox().width;
			height += legendOptions.marginBottom + title.getBBox().height;
		}
		
		for(var i = 0, length = legendOptions.slices.length; i < length; ++i) {
			if (typeof legendOptions.slices[i].display == 'undefined' || legendOptions.slices[i].display == true) {
				defaultElemOptions = (legendType == 'plot') ? options.map['defaultPlot'] : options.map['defaultArea'];
				legendOptions.slices[i].attrs = $.extend(
					{}
					, defaultElemOptions.attrs
					, legendOptions.slices[i].attrs
				);
				legendOptions.slices[i].attrsHover = $.extend(
					{}
					, defaultElemOptions.attrsHover
					, legendOptions.slices[i].attrsHover
				);
				
				if(legendType == 'area' || legendOptions.slices[i].type == "square") {
					// Draw a square for squared plots AND areas
					!legendOptions.slices[i].size && (legendOptions.slices[i].size = 20);
					
					elem = paper.rect(
						legendOptions.marginLeft
						, height
						, scale * (legendOptions.slices[i].size)
						, scale * (legendOptions.slices[i].size)
					).attr(legendOptions.slices[i].attrs);
				} else {
					elem = paper.circle(
						legendOptions.marginLeft + scale * (legendOptions.slices[i].size / 2)
						, height + scale * (legendOptions.slices[i].size / 2)
						, scale * (legendOptions.slices[i].size / 2)
					).attr(legendOptions.slices[i].attrs);
				} 
				
				label = paper.text(
					legendOptions.marginLeft + scale * legendOptions.slices[i].size + legendOptions.marginLeftLabel
					, height + scale * (legendOptions.slices[i].size / 2)
					, legendOptions.slices[i].label
				).attr(legendOptions.labelAttrs);
				
				height += legendOptions.marginBottom + scale * legendOptions.slices[i].size;
				width = Math.max(width, legendOptions.marginLeft + scale * legendOptions.slices[i].size + legendOptions.marginLeftLabel + label.getBBox().width);
				
				if (legendOptions.hideElemsOnClick.enabled) {
					// Hide/show elements when user clicks on a legend element
					label.attr({cursor:'pointer'});
					
					$.fn.mapael.setHoverOptions(elem, legendOptions.slices[i].attrs, legendOptions.slices[i].attrs);
					$.fn.mapael.setHoverOptions(label, legendOptions.labelAttrs, legendOptions.labelAttrsHover);
					$.fn.mapael.setHover(paper, elem, label);
					
					label.hidden = false;
					(function(i, elem, label) {
						$(label.node).on('click', function() {
							if (!label.hidden) {
								label.animate({'opacity':0.5}, 300);
							} else {
								label.animate({'opacity':1}, 300);
							}
							
							for (var id in elems) {
								if ((typeof legendOptions.slices[i].min == 'undefined' || elems[id].value >= legendOptions.slices[i].min) 
									&& (typeof legendOptions.slices[i].max == 'undefined' || elems[id].value < legendOptions.slices[i].max)
								) {
									(function(id) {
										if (!label.hidden) {
											elems[id].mapElem.animate({'opacity':legendOptions.hideElemsOnClick.opacity}, 300, 'linear', function() {(legendOptions.hideElemsOnClick.opacity == 0) && elems[id].mapElem.hide();});
											elems[id].textElem && elems[id].textElem.animate({'opacity':legendOptions.hideElemsOnClick.opacity}, 300, 'linear', function() {(legendOptions.hideElemsOnClick.opacity == 0) && elems[id].textElem.hide();});
										} else {
											if (legendOptions.hideElemsOnClick.opacity == 0) {
												elems[id].mapElem.show();
												elems[id].textElem && elems[id].textElem.show();
											}
											elems[id].mapElem.animate({'opacity':typeof elems[id].mapElem.originalAttrs.opacity != "undefined" ? elems[id].mapElem.originalAttrs.opacity : 1}, 300);
											elems[id].textElem && elems[id].textElem.animate({'opacity':typeof elems[id].textElem.originalAttrs.opacity != "undefined" ? elems[id].textElem.originalAttrs.opacity : 1}, 300);
										}
									})(id);
								}
							}
							label.hidden = !label.hidden;
						});
					})(i, elem, label);
				}
			}
		}
		
		// VMLWidth option allows you to set static width for the legend
		// only for VML render because text.getBBox() returns wrong values on IE6/7
		if (Raphael.type != 'SVG' && legendOptions.VMLWidth) 
			width = legendOptions.VMLWidth;
		
		paper.setSize(width, height)
		return paper;
	}
	
	/**
	* Set the attributes on hover and the attributes to restore for a map element
	* @param elem the map element
	* @param originalAttrs the original attributes to restore on mouseout event
	* @param attrsHover the attributes to set on mouseover event
	*/
	$.fn.mapael.setHoverOptions = function (elem, originalAttrs, attrsHover) {
		// Disable transform option on hover for VML (IE<9) because of several bugs
		if (Raphael.type != 'SVG') delete attrsHover.transform;
		elem.attrsHover = attrsHover;
		
		if (elem.attrsHover.transform) elem.originalAttrs = $.extend({transform : "s1"}, originalAttrs);
		else elem.originalAttrs = originalAttrs;
	};
	
	/**
	* Set the hover behavior (mouseover & mouseout) for plots and areas
	* @param paper Raphael paper object
	* @param mapElem the map element
	* @param textElem the optional text element (within the map element)
	*/
	$.fn.mapael.setHover = function (paper, mapElem, textElem) {
		var $mapElem = {}
			, $textElem = {}
			, hoverTO = 0
			, overBehaviour = function() {hoverTO = setTimeout(function () {$.fn.mapael.elemHover(paper, mapElem, textElem);}, 120);}
			, outBehaviour = function () {clearTimeout(hoverTO);$.fn.mapael.elemOut(paper, mapElem, textElem);};
			
		$mapElem = $(mapElem.node);
		$mapElem.on("mouseover", overBehaviour);
		$mapElem.on("mouseout", outBehaviour);
		
		if (textElem) {
			$textElem = $(textElem.node);
			$textElem.on("mouseover", overBehaviour);
			$(textElem.node).on("mouseout", outBehaviour);
		}
	};
	
	/**
	* Set he behaviour for 'mouseover' event
	* @param paper paper Raphael paper object
	* @param mapElem mapElem the map element
	* @param textElem the optional text element (within the map element)
	*/
	$.fn.mapael.elemHover = function (paper, mapElem, textElem) {
		mapElem.animate(mapElem.attrsHover, mapElem.attrsHover.animDuration);
		textElem && textElem.animate(textElem.attrsHover, textElem.attrsHover.animDuration);
		paper.safari();
	}
	
	/**
	* Set he behaviour for 'mouseout' event
	* @param paper Raphael paper object
	* @param mapElem the map element
	* @param textElem the optional text element (within the map element)
	*/
	$.fn.mapael.elemOut = function (paper, mapElem, textElem) {
		mapElem.animate(mapElem.originalAttrs, mapElem.attrsHover.animDuration);
		textElem && textElem.animate(textElem.originalAttrs, textElem.attrsHover.animDuration);
		paper.safari();
	};
	
	/**
	* Get element options by merging default options, element options and legend options
	* @param defaultOptions
	* @param elemOptions
	* @param legendOptions
	*/
	$.fn.mapael.getElemOptions = function(defaultOptions, elemOptions, legendOptions) {
		var options = $.extend(true, {}, defaultOptions, elemOptions);
		if (typeof options.value != "undefined") {
			$.extend(true, options, $.fn.mapael.getLegendSlice(options.value, legendOptions));
		}
		
		return options;
	}
	
	/**
	* Get the coordinates of the text relative to a bbox and a position
	* @param bbox the boundary box of the element
	* @param textPosition the wanted text position (inner, right, left, top or bottom)
	*/
	$.fn.mapael.getTextPosition = function(bbox, textPosition, margin) {
		var textX = 0
			, textY = 0
			, textAnchor = '';
			
		switch (textPosition) {
			case 'bottom' :
				textX = (bbox.x + bbox.x2) / 2;
				textY = bbox.y2 + margin;
				textAnchor = "middle";
				break;
			case 'top' :
				textX = (bbox.x + bbox.x2) / 2;
				textY = bbox.y - margin;
				textAnchor = "middle";
				break;
			case 'left' :
				textX = bbox.x - margin;
				textY = (bbox.y + bbox.y2) / 2;
				textAnchor = "end";
				break;
			case 'right' :
				textX = bbox.x2 + margin;
				textY = (bbox.y + bbox.y2) / 2;
				textAnchor = "start";
				break;
			default : // 'inner' position
				textX = (bbox.x + bbox.x2) / 2;
				textY = (bbox.y + bbox.y2) / 2;
				textAnchor = "middle";
		}
		return {'x' : textX, 'y' : textY, 'textAnchor' : textAnchor};
	}
	
	/**
	* Get the legend conf matching with the value
	* @param value the value to match with a slice in the legend
	* @param legend the legend params object
	* @return the legend slice matching with the value
	*/
	$.fn.mapael.getLegendSlice = function (value, legend) {
		for(var i = 0, length = legend.slices.length; i < length; ++i) {
			if ((typeof legend.slices[i].min == 'undefined' || value >= legend.slices[i].min) 
				&& (typeof legend.slices[i].max == 'undefined' || value < legend.slices[i].max)
			) {
				return legend.slices[i];
			}
		}
		return {};
	};
	
	// Default map options
	$.fn.mapael.defaultOptions = {
		map : {
			cssClass : "map"
			, tooltip : {
				cssClass : "mapTooltip"
			}
			, defaultArea : {
				attrs : {
					fill : "#343434"
					, stroke : "#5d5d5d"
					, "stroke-width" : 1
					, "stroke-linejoin" : "round"
				}
				, attrsHover : {
					fill : "#f38a03"
					, animDuration : 300
				}
				, text : {
					position : 'inner'
					, margin : 10
					, attrs : {
						"font-size" : 15
						, fill : "#c7c7c7"
					}
					, attrsHover : {
						fill : "#eaeaea"
						, "animDuration" : 300
					}
				}
			}
			, defaultPlot : {
				type : "circle"
				, size : 15
				, attrs : {
					fill : "#0088db" 
					, stroke : "#fff"
					, "stroke-width" : 0
					, "stroke-linejoin" : "round"
				}
				, attrsHover : {
					"stroke-width" : 3
					, animDuration : 300
				}
				, text : {
					position : 'right'
					, margin : 10
					, attrs : {
						"font-size" : 15
						, fill : "#c7c7c7"
					}
					, attrsHover : {
						fill : "#eaeaea"
						, animDuration : 300
					}
				}
			}
			, zoom : {
				enabled : false
				, maxLevel : 5
				, step : 0.25
				, zoomInCssClass : "zoomIn"
				, zoomOutCssClass : "zoomOut"
			}
		}
		, legend : {
			area : {
				cssClass : "areaLegend"
				, display : false
				, marginLeft : 15
				, marginLeftTitle : 5
				, marginLeftLabel : 10
				, marginBottom : 15
				, titleAttrs : {
					"font-size" : 18
					, fill : "#343434"
					, "text-anchor" : "start"
				}
				, labelAttrs : {
					"font-size" : 15
					, fill : "#343434"
					, "text-anchor" : "start"
				}
				, labelAttrsHover : {
					fill : "#787878"
					, animDuration : 300
				}
				, hideElemsOnClick : {
					enabled : true
					, opacity : 0.2
				}
				, slices : []
			}
			, plot : {
				cssClass : "plotLegend"
				, display : false
				, marginLeft : 15
				, marginLeftTitle : 5
				, marginLeftLabel : 10
				, marginBottom : 15
				, titleAttrs : {
					"font-size" : 18
					, fill : "#343434"
					, "text-anchor" : "start"
				}
				, labelAttrs : {
					"font-size" : 15
					, fill : "#343434"
					, "text-anchor" : "start"
				}
				, labelAttrsHover : {
					fill : "#787878"
					, animDuration : 300
				}
				, hideElemsOnClick : {
					enabled : true
					, opacity : 0.2
				}
				, slices : []
			}
		}
		, areas : {}
		, plots : {}
	};
})(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js"), __webpack_require__("./node_modules/webpack-raphael/raphael-min.js")))

/***/ },

/***/ "./node_modules/jQuery-Mapael/js/maps/usa_states.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/**
*
* Jquery Mapael - Dynamic maps jQuery plugin (based on raphael.js)
* Requires jQuery and raphael.js
*
* Map of USA by state
* 
* @source http://the55.net/_11/sketch/us_map
*/
(function($) {
	$.extend(true, $.fn.mapael, 
		{
			maps :{
				usa_states : {
					width : 959,
					height : 593,
					latLngToGrid: function(lat, lng, phi1, phi2, midLng, scale) {
						var pi =Math.PI
							, midLat = (phi1 + phi2) / 2
							, n, tmp1, tmp2, tmp3, x, y, p;

						n = (Math.sin(phi1 / 180 * pi) + Math.sin(phi2 / 180 * pi)) / 2;
						tmp1 = Math.sqrt(Math.cos(phi1 / 180 * pi)) + 2 * n * Math.sin(phi1 / 180 * pi);
						tmp2 = scale * Math.pow(tmp1 - 2 * n * Math.sin(midLat / 180 * pi),0.5) / n;
						tmp3 = n * (lng - midLng);
						p = scale * Math.pow(tmp1 - 2 * n * Math.sin(lat / 180 * pi),0.5) / n;
						x = p * Math.sin(tmp3 / 180 * pi);
						y = tmp2 - p * Math.cos(tmp3 / 180 * pi);
						
						return([x,y]);
					},
					getCoords : function (lat, lon) {
						var coords = {};
						if(lat > 51) { // alaska

							// these are guesses
							var phi1= 15; // standard parallels
							var phi2= 105;
							var midLng = -134;
							var scale = 530;
							coords = this.latLngToGrid(lat, lon, phi1, phi2, midLng, scale);
							xOffset = 190;
							yOffset = 543;
							scaleX= 1;
							scaleY= -1;

						} else if (lon < -140) { // hawaii
							// Lat: 18�?55' N to 28�?27' N, Lng:154�?48' W to 178�?22' W
							// (225, 504) to (356, 588) on map

							// these are guesses
							var phi1= 0; // standard parallels
							var phi2= 26;
							var midLng = -166;
							var scale = 1280;
							coords = this.latLngToGrid(lat, lon, phi1, phi2, midLng, scale);
							xOffset = 115;
							yOffset = 723;
							scaleX= 1;
							scaleY= -1;
						} else {
							xOffset = -17;
							yOffset = -22;
							scaleX = 10.05;
							scaleY = 6.26;

							coords[0] = 50.0 + 124.03149777329222 * ((1.9694462586094064-(lat* Math.PI / 180)) * Math.sin(0.6010514667026994 * (lon + 96) * Math.PI / 180));
							coords[1] = 50.0 + 1.6155950752393982 * 124.03149777329222 * 0.02613325650382181 - 1.6155950752393982* 124.03149777329222 * (1.3236744353715044- (1.9694462586094064-(lat* Math.PI / 180)) * Math.cos(0.6010514667026994 * (lon + 96) * Math.PI / 180));
						}
						return {x : (coords[0] * scaleX + xOffset), y : (coords[1] * scaleY + yOffset)};
					},
					elems : {
						"HI" : "m 233.08751,519.30948 1.93993,-3.55655 2.26326,-0.32332 0.32332,0.8083 -2.1016,3.07157 -2.42491,0 z m 10.18466,-3.71821 6.14313,2.58657 2.10159,-0.32332 1.61661,-3.87987 -0.64664,-3.39488 -4.2032,-0.48498 -4.04153,1.77827 -0.96996,3.71821 z m 30.71563,10.023 3.7182,5.49647 2.42492,-0.32332 1.13163,-0.48498 1.45495,1.29329 3.71821,-0.16166 0.96997,-1.45495 -2.90991,-1.77827 -1.93993,-3.71822 -2.1016,-3.55654 -5.8198,2.9099 -0.64664,1.77828 z m 20.20765,8.89137 1.29329,-1.93994 4.68817,0.96996 0.64665,-0.48498 6.14312,0.64664 -0.32332,1.2933 -2.58658,1.45494 -4.36485,-0.32332 -5.49648,-1.6166 z m 5.33482,5.17315 1.93994,3.87987 3.07155,-1.13163 0.32333,-1.61662 -1.61661,-2.10159 -3.71821,-0.32332 0,1.29329 z m 6.95143,-1.13163 2.26326,-2.9099 4.68817,2.42492 4.36485,1.13163 4.36486,2.74824 0,1.93993 -3.55654,1.77828 -4.84985,0.96996 -2.42491,-1.45495 -4.84984,-6.62811 z m 16.65111,15.51947 1.61661,-1.29328 3.39489,1.61662 7.59807,3.55654 3.39489,2.10159 1.6166,2.42492 1.93994,4.36485 4.04153,2.58658 -0.32332,1.2933 -3.87987,3.23322 -4.20319,1.45495 -1.45495,-0.64664 -3.07157,1.77826 -2.42491,3.23323 -2.26326,2.9099 -1.77828,-0.16166 -3.55654,-2.58658 -0.32332,-4.52651 0.64664,-2.42492 -1.61661,-5.65814 -2.1016,-1.77828 -0.16166,-2.58658 2.26326,-0.96996 2.1016,-3.07156 0.48498,-0.96997 -1.61661,-1.77828 -0.32332,-2.1016 z",
						"AK" : "m 158.07671,453.67502 -0.32332,85.35713 1.6166,0.96996 3.07157,0.16166 1.45494,-1.13162 2.58658,0 0.16167,2.9099 6.95143,6.78977 0.48499,2.58658 3.39488,-1.93994 0.64665,-0.16166 0.32332,-3.07156 1.45494,-1.61661 1.13164,-0.16166 1.93993,-1.45496 3.07156,2.1016 0.64665,2.90991 1.93993,1.13162 1.13163,2.42492 3.87988,1.77827 3.39488,5.98147 2.74823,3.87986 2.26326,2.74825 1.45496,3.7182 5.01149,1.77828 5.17317,2.10159 0.96996,4.36486 0.48498,3.07156 -0.96996,3.39489 -1.77828,2.26325 -1.61661,-0.8083 -1.45495,-3.07157 -2.74824,-1.45494 -1.77827,-1.13164 -0.80831,0.80831 1.45495,2.74825 0.16166,3.7182 -1.13163,0.48498 -1.93993,-1.93993 -2.10159,-1.29329 0.48498,1.61661 1.29328,1.77828 -0.8083,0.8083 c 0,0 -0.8083,-0.32332 -1.29328,-0.96997 -0.485,-0.64664 -2.1016,-3.39488 -2.1016,-3.39488 l -0.96997,-2.26326 c 0,0 -0.32332,1.29329 -0.96997,0.96996 -0.64665,-0.32332 -1.29329,-1.45494 -1.29329,-1.45494 l 1.77827,-1.93994 -1.45495,-1.45495 0,-5.0115 -0.8083,0 -0.8083,3.39488 -1.13164,0.485 -0.96996,-3.71822 -0.64665,-3.71821 -0.80831,-0.48498 0.32333,5.65815 0,1.13162 -1.45496,-1.29328 -3.55654,-5.98147 -2.1016,-0.48498 -0.64664,-3.71821 -1.61661,-2.9099 -1.61662,-1.13164 0,-2.26325 2.1016,-1.29329 -0.48498,-0.32332 -2.58658,0.64664 -3.39489,-2.42491 -2.58658,-2.90991 -4.84983,-2.58658 -4.04154,-2.58658 1.2933,-3.23322 0,-1.61661 -1.77828,1.61661 -2.9099,1.13163 -3.71821,-1.13163 -5.65815,-2.42491 -5.49647,0 -0.64664,0.48498 -6.46645,-3.87988 -2.1016,-0.32332 -2.74824,-5.8198 -3.55655,0.32332 -3.55655,1.45495 0.48499,4.52652 1.13162,-2.9099 0.96998,0.32332 -1.45496,4.36485 3.23322,-2.74824 0.64665,1.61661 -3.87987,4.36485 -1.29329,-0.32332 -0.48498,-1.93994 -1.29329,-0.8083 -1.29329,1.13163 -2.74824,-1.77827 -3.07157,2.1016 -1.77826,2.10159 -3.39489,2.1016 -4.68818,-0.16167 -0.48498,-2.10159 3.7182,-0.64665 0,-1.29328 -2.26326,-0.64666 0.96998,-2.42491 2.26325,-3.87987 0,-1.77827 0.16166,-0.80831 4.36486,-2.26326 0.96996,1.29329 2.74825,0 -1.29329,-2.58657 -3.71822,-0.32333 -5.01149,2.74824 -2.42492,3.39488 -1.77827,2.58659 -1.13163,2.26326 -4.20319,1.45494 -3.07157,2.58658 -0.323321,1.61662 2.263257,0.96997 0.808313,2.10158 -2.748249,3.23323 -6.466439,4.2032 -7.759747,4.20319 -2.101597,1.13162 -5.334818,1.13164 -5.334826,2.26325 1.778275,1.29329 -1.454954,1.45495 -0.484982,1.13163 -2.748238,-0.96997 -3.23322,0.16166 -0.808312,2.26326 -0.969963,0 0.323321,-2.42492 -3.556551,1.2933 -2.909899,0.96996 -3.394886,-1.29329 -2.909901,1.93993 -3.233224,0 -2.101597,1.2933 -1.616612,0.8083 -2.101595,-0.32332 -2.58658,-1.13163 -2.263257,0.64665 -0.969967,0.96996 -1.616613,-1.13162 0,-1.93994 3.071564,-1.29329 6.304787,0.64665 4.364853,-1.61662 2.101596,-2.10159 2.909902,-0.64665 1.778273,-0.80831 2.748241,0.16166 1.616612,1.2933 0.969963,-0.32332 2.263257,-2.74824 3.07157,-0.96998 3.39488,-0.64664 1.293294,-0.32332 0.646642,0.48498 0.808312,0 1.293284,-3.71821 4.041533,-1.45494 1.939936,-3.71821 2.263259,-4.52652 1.616615,-1.45495 0.323321,-2.58658 -1.616615,1.29329 -3.394893,0.64665 -0.646642,-2.42492 -1.293284,-0.32332 -0.969973,0.96996 -0.16166,2.90991 -1.454955,-0.16167 -1.454944,-5.8198 -1.293294,1.29328 -1.131624,-0.48498 -0.32332,-1.93993 -4.041533,0.16166 -2.101596,1.13163 -2.586578,-0.32332 1.454944,-1.45495 0.484981,-2.58658 -0.646641,-1.93994 1.454954,-0.96996 1.293284,-0.16166 -0.646642,-1.77828 0,-4.36485 -0.969963,-0.96997 -0.808312,1.45495 -6.143123,0 -1.454951,-1.29329 -0.646645,-3.87986 -2.101596,-3.55656 0,-0.96996 2.101596,-0.80831 0.161661,-2.1016 1.131628,-1.13162 -0.808305,-0.48498 -1.29329,0.48498 -1.131628,-2.74824 0.969967,-5.01151 4.526514,-3.23321 2.586575,-1.61662 1.939936,-3.7182 2.748249,-1.2933 2.586578,1.13164 0.323321,2.42492 2.424917,-0.32334 3.23322,-2.42491 1.616615,0.64665 0.969962,0.64664 1.616615,0 2.263259,-1.29329 0.808313,-4.36486 c 0,0 0.323321,-2.90989 0.969963,-3.39488 0.646642,-0.48498 0.969963,-0.96996 0.969963,-0.96996 l -1.131623,-1.93994 -2.58658,0.80831 -3.23323,0.8083 -1.939936,-0.48498 -3.556541,-1.77828 -5.011495,-0.16166 -3.556551,-3.7182 0.484981,-3.87987 0.646652,-2.42492 -2.101596,-1.77827 -1.939938,-3.71822 0.484983,-0.8083 6.789771,-0.48498 2.101596,0 0.969963,0.96996 0.646652,0 -0.16166,-1.61661 3.879862,-0.64664 2.586577,0.32332 1.454955,1.13163 -1.454955,2.1016 -0.484981,1.45494 2.748249,1.61662 5.011497,1.77827 1.778276,-0.96996 -2.263257,-4.36485 -0.969974,-3.23323 0.969974,-0.80831 -3.394891,-1.93993 -0.484983,-1.13164 0.484983,-1.6166 -0.808304,-3.87987 -2.909909,-4.68818 -2.424918,-4.20319 2.909909,-1.93994 3.233222,0 1.778276,0.64665 4.203192,-0.16166 3.718205,-3.55654 1.131633,-3.07157 3.718212,-2.42492 1.616604,0.96997 2.748239,-0.64665 3.718209,-2.1016 1.13164,-0.16166 0.96996,0.80832 4.52651,-0.16167 2.74824,-3.07156 1.13163,0 3.55655,2.42491 1.93993,2.1016 -0.48498,1.13163 0.64664,1.13163 1.61662,-1.61661 3.87987,0.32332 0.32332,3.7182 1.93994,1.45496 7.11309,0.64664 6.30479,4.20319 1.45494,-0.96996 5.17317,2.58658 2.10159,-0.64664 1.93994,-0.80832 4.84983,1.93994 4.36486,2.9099 z m -115.102797,28.93736 2.101596,5.33482 -0.161662,0.96997 -2.909902,-0.32333 -1.778273,-4.04153 -1.778273,-1.45494 -2.424919,0 -0.16166,-2.58659 1.778273,-2.42492 1.131629,2.42492 1.45495,1.45495 2.748241,0.64665 z m -2.58658,33.46387 3.718209,0.80831 3.718207,0.96996 0.808307,0.96998 -1.616612,3.7182 -3.071564,-0.16166 -3.394885,-3.55654 -0.161662,-2.74825 z m -20.692636,-14.06452 1.13163,2.58657 1.131628,1.61662 -1.131628,0.8083 -2.101597,-3.07156 0,-1.93993 0.969967,0 z m -13.7412027,73.07087 3.3948853,-2.26326 3.3948854,-0.96997 2.58658,0.32332 0.484983,1.61661 1.939935,0.48499 1.939934,-1.93993 -0.323322,-1.61661 2.748241,-0.64665 2.909902,2.58658 -1.131629,1.77827 -4.364852,1.13163 -2.748242,-0.48498 -3.718207,-1.13163 -4.3648533,1.45495 -1.616612,0.32332 -1.1316284,-0.64664 z m 48.9833487,-4.52651 1.616612,1.93993 2.101593,-1.61661 -1.454948,-1.2933 -2.263257,0.96998 z m 2.909902,3.07155 1.131624,-2.26325 2.101597,0.32332 -0.808303,1.93993 -2.424918,0 z m 23.602535,-1.93993 1.454954,1.77827 0.969974,-1.13162 -0.808313,-1.93994 -1.616615,1.29329 z m 8.72971,-12.44791 1.131633,5.8198 2.909899,0.80831 5.011495,-2.90991 4.364853,-2.58658 -1.6166,-2.42491 0.48498,-2.42492 -2.1016,1.29329 -2.909898,-0.80831 1.616605,-1.13162 1.939933,0.8083 3.87987,-1.77828 0.48499,-1.45494 -2.42492,-0.80831 0.8083,-1.93994 -2.74824,1.93994 -4.688172,3.55655 -4.849834,2.9099 -1.293294,1.13163 z m 42.35524,-19.88433 2.42492,-1.45495 -0.96997,-1.77828 -1.77827,0.96997 0.32332,2.26326 z",
						"FL" : "m 759.8167,439.1428 2.26566,7.3186 3.7297,9.74226 5.33479,9.3763 3.71819,6.30476 4.84982,5.49646 4.04151,3.71819 1.6166,2.90989 -1.13162,1.29328 -0.8083,1.29328 2.90988,7.43639 2.90989,2.90988 2.58657,5.3348 3.55653,5.81978 4.52649,8.24468 1.29329,7.59804 0.48498,11.96288 0.64664,1.77826 -0.32332,3.39487 -2.42491,1.29329 0.32332,1.93992 -0.64664,1.93993 0.32332,2.4249 0.48498,1.93993 -2.74822,3.23321 -3.07155,1.45494 -3.87985,0.16166 -1.45495,1.61661 -2.4249,0.96996 -1.29329,-0.48498 -1.13162,-0.96996 -0.32332,-2.90989 -0.80831,-3.39487 -3.39487,-5.17314 -3.55653,-2.26324 -3.87985,-0.32332 -0.8083,1.29328 -3.07155,-4.36483 -0.64664,-3.55653 -2.58657,-4.04151 -1.77826,-1.13163 -1.61661,2.10159 -1.77826,-0.32332 -2.10159,-5.01148 -2.90989,-3.87985 -2.90989,-5.33479 -2.58656,-3.07155 -3.55653,-3.71819 2.10158,-2.42491 3.23321,-5.49646 -0.16166,-1.6166 -4.52649,-0.96996 -1.61661,0.64664 0.32333,0.64664 2.58656,0.96996 -1.45494,4.5265 -0.8083,0.48498 -1.77827,-4.04151 -1.29328,-4.84982 -0.32332,-2.74823 1.45494,-4.68815 0,-9.53797 -3.07155,-3.71819 -1.29328,-3.07155 -5.17314,-1.29328 -1.93992,-0.64664 -1.61661,-2.58657 -3.39487,-1.61661 -1.13162,-3.39487 -2.74823,-0.96996 -2.42491,-3.71819 -4.20317,-1.45494 -2.90989,-1.45495 -2.58656,0 -4.04152,0.80831 -0.16166,1.93992 0.80831,0.96996 -0.48499,1.13163 -3.07154,-0.16166 -3.71819,3.55653 -3.55654,1.93992 -3.87985,0 -3.23321,1.29329 -0.32332,-2.74823 -1.6166,-1.93993 -2.90989,-1.13162 -1.6166,-1.45495 -8.08303,-3.87985 -7.59804,-1.77826 -4.36483,0.64664 -5.98144,0.48498 -5.98144,2.10159 -3.47924,0.61296 -0.23792,-8.04975 -2.58657,-1.93992 -1.77827,-1.77827 0.32332,-3.07156 10.18462,-1.29328 25.5424,-2.90989 6.78975,-0.64664 5.436,0.28027 2.58657,3.87986 1.45494,1.45494 8.09816,0.51522 10.81975,-0.64664 21.51239,-1.29329 5.44572,-0.67437 5.10758,0.20451 0.42683,2.90989 2.233,0.8083 0.23494,-4.63 -1.52822,-4.17295 1.3084,-1.43983 5.55463,0.45475 5.17314,0.32332 z m 12.54541,132.40508 2.42492,-0.64664 1.29328,-0.24249 1.45496,-2.34409 2.34408,-1.61661 1.29329,0.48499 1.69744,0.32332 0.40415,1.05079 -3.4757,1.21246 -4.2032,1.45495 -2.34408,1.21246 -0.88914,-0.88914 z m 13.4987,-5.01149 1.21246,1.0508 2.74824,-2.10159 5.33481,-4.20319 3.7182,-3.87987 2.50575,-6.6281 0.96997,-1.69744 0.16166,-3.39488 -0.72748,0.48498 -0.96996,2.82907 -1.45496,4.60733 -3.23322,5.254 -4.36484,4.20318 -3.39488,1.93993 -2.50575,1.53578 z",
						"NH" : "m 880.79902,142.42476 0.869,-1.0765 1.09022,-3.29102 -2.54308,-0.91347 -0.48499,-3.07156 -3.87985,-1.13162 -0.32332,-2.74824 -7.27475,-23.44082 -4.60142,-14.542988 -0.89708,-0.0051 -0.64664,1.616605 -0.64664,-0.484981 -0.96997,-0.969963 -1.45494,1.939925 -0.0485,5.032054 0.31165,5.667218 1.93992,2.74824 0,4.04152 -3.7182,5.06278 -2.58657,1.13164 0,1.13162 1.13163,1.77827 0,8.56802 -0.80831,9.21467 -0.16166,4.84982 0.96997,1.2933 -0.16166,4.52649 -0.48499,1.77828 0.96881,0.70922 16.78767,-4.42455 2.17487,-0.60245 1.84357,-2.77333 3.60523,-1.61312 z",
						"MI" : "M581.61931,82.059006 L 583.4483,80.001402 L 585.62022,79.201221 L 590.99286,75.314624 L 593.27908,74.743065 L 593.73634,75.200319 L 588.59232,80.344339 L 585.27728,82.287628 L 583.21967,83.202124 L 581.61931,82.059006 z M 667.79369,114.18719 L 668.44033,116.69293 L 671.67355,116.85459 L 672.96684,115.64213 C 672.96684,115.64213 672.88601,114.18719 672.56269,114.02552 C 672.23936,113.86386 670.94608,112.16642 670.94608,112.16642 L 668.76366,112.40891 L 667.14704,112.57057 L 666.82372,113.7022 L 667.79369,114.18719 z M 567.49209,111.21318 L 568.20837,110.63278 L 570.9566,109.82447 L 574.51313,107.56123 L 574.51313,106.59126 L 575.15978,105.94462 L 581.14121,104.97466 L 583.56612,103.03473 L 587.93095,100.93315 L 588.09261,99.639864 L 590.03254,96.729975 L 591.8108,95.921673 L 593.10409,94.143408 L 595.36733,91.880161 L 599.73217,89.455254 L 604.42032,88.970273 L 605.55194,90.101896 L 605.22862,91.071859 L 601.51043,92.041822 L 600.05549,95.113371 L 597.79224,95.921673 L 597.30726,98.34658 L 594.88235,101.57979 L 594.55903,104.16636 L 595.36733,104.65134 L 596.3373,103.51972 L 599.89383,100.60983 L 601.18711,101.90311 L 603.45036,101.90311 L 606.68357,102.87307 L 608.13851,104.0047 L 609.59345,107.07625 L 612.34168,109.82447 L 616.22153,109.66281 L 617.67648,108.69285 L 619.29308,109.98613 L 620.90969,110.47112 L 622.20297,109.66281 L 623.33459,109.66281 L 624.9512,108.69285 L 628.99271,105.13632 L 632.38758,104.0047 L 639.01566,103.68138 L 643.54215,101.74145 L 646.12872,100.44817 L 647.58367,100.60983 L 647.58367,106.26794 L 648.06865,106.59126 L 650.97853,107.39957 L 652.91846,106.91458 L 659.06156,105.29798 L 660.19318,104.16636 L 661.64813,104.65134 L 661.64813,111.60274 L 664.88134,114.67429 L 666.17462,115.32093 L 667.4679,116.29089 L 666.17462,116.61421 L 665.36632,116.29089 L 661.64813,115.80591 L 659.54654,116.45255 L 657.28329,116.29089 L 654.05008,117.74584 L 652.27182,117.74584 L 646.45204,116.45255 L 641.27891,116.61421 L 639.33898,119.20078 L 632.38758,119.84742 L 629.96267,120.65572 L 628.83105,123.72727 L 627.53777,124.8589 L 627.05279,124.69724 L 625.59784,123.08063 L 621.07135,125.50554 L 620.42471,125.50554 L 619.29308,123.88893 L 618.48478,124.05059 L 616.54486,128.41543 L 615.57489,132.45694 L 612.39377,139.45774 L 611.21701,138.42347 L 609.84527,137.39215 L 607.90449,127.10413 L 604.36001,125.73408 L 602.30743,123.44785 L 590.18707,120.70437 L 587.3318,119.67473 L 579.10138,117.50199 L 571.21139,116.35887 L 567.49209,111.21318 z,M697.8,177.2L694.6,168.9L692.3,159.9L689.9,156.7L687.3,154.9L685.7,156L681.8,157.8L679.9,162.8L677.1,166.5L676,167.2L674.5,166.5 C 674.5,166.5 671.9,165.1 672.1,164.4 C 672.3,163.8 672.6,159.4 672.6,159.4L676,158.1L676.8,154.7L677.4,152.1L679.9,150.5L679.5,140.5L677.9,138.2L676.6,137.4L675.8,135.3L676.6,134.5L678.2,134.8L678.4,133.2L676,131L674.7,128.4L672.1,128.4L667.6,126.9L662.1,123.5L659.3,123.5L658.7,124.2L657.7,123.7L654.6,121.4L651.7,123.2L648.8,125.5L649.2,129L650.1,129.3L652.2,129.8L652.7,130.6L650.1,131.4L647.5,131.8L646.1,133.5L645.8,135.6L646.1,137.3L646.4,142.8L642.8,144.9L642.2,144.7L642.2,140.5L643.5,138.1L644.1,135.6L643.3,134.8L641.4,135.6L640.4,139.8L637.7,141L635.9,142.9L635.7,143.9L636.4,144.7L635.7,147.3L633.5,147.8L633.5,148.9L634.3,151.3L633.1,157.5L631.5,161.5L632.2,166.2L632.7,167.3L631.9,169.8L631.5,170.6L631.2,173.3L634.8,179.3L637.7,185.8L639.1,190.6L638.3,195.3L637.3,201.3L634.9,206.4L634.6,209.2L631.3,212.3L635.8,212.1L657.2,209.9L664.4,208.9L664.5,210.5L671.4,209.3L681.7,207.8L685.5,207.4L685.7,206.8L685.8,205.3L687.9,201.6L689.9,199.9L689.7,194.8L691.3,193.2L692.4,192.9L692.6,189.3L694.2,186.3L695.2,186.9L695.4,187.5L696.2,187.7L698.1,186.7L697.8,177.2z",
						"VT" : "m 844.48416,154.05791 0.3167,-5.34563 -2.89071,-10.78417 -0.64664,-0.32332 -2.9099,-1.29329 0.8083,-2.90989 -0.8083,-2.10159 -2.70005,-4.63998 0.96997,-3.87986 -0.80831,-5.17315 -2.42491,-6.46644 -0.80557,-4.92251 26.41936,-6.73182 0.3087,5.52221 1.91626,2.74223 0,4.04152 -3.70715,5.05799 -2.58657,1.14267 -0.011,1.12057 1.30997,1.51912 -0.31093,8.09797 -0.60943,9.25886 -0.22795,5.55694 0.96996,1.29329 -0.16166,4.57069 -0.48498,1.68989 1.01418,0.72716 -7.43755,1.50671 -4.50174,0.72383 z",
						"ME" : "m 922.83976,78.830719 1.93993,2.101586 2.26325,3.718191 0,1.939926 -2.10159,4.688153 -1.93993,0.646642 -3.39487,3.071549 -4.84981,5.496454 c 0,0 -0.64664,0 -1.29328,0 -0.64664,0 -0.96997,-2.101584 -0.96997,-2.101584 l -1.77826,0.16166 -0.96996,1.454944 -2.42491,1.45495 -0.96996,1.45494 1.6166,1.45494 -0.48498,0.64665 -0.48498,2.74822 -1.93993,-0.16166 0,-1.6166 -0.32332,-1.29329 -1.45494,0.32333 -1.77827,-3.23321 -2.10158,1.29328 1.29328,1.45494 0.32332,1.13163 -0.8083,1.29328 0.32332,3.07155 0.16166,1.6166 -1.6166,2.58657 -2.90989,0.48498 -0.32332,2.90989 -5.3348,3.07155 -1.29328,0.48498 -1.61661,-1.45494 -3.07155,3.55653 0.96997,3.23321 -1.45495,1.29328 -0.16166,4.36483 -1.12328,6.25936 -2.46225,-1.15595 -0.48499,-3.07156 -3.87985,-1.13163 -0.32332,-2.74824 -7.27475,-23.44082 -4.69858,-14.639742 1.42054,-0.118165 1.51379,0.409899 0,-2.586568 1.3083,-4.496456 2.58657,-4.688153 1.45495,-4.041512 -1.93993,-2.424907 0,-5.981437 0.8083,-0.969963 0.80831,-2.748228 -0.16166,-1.454944 -0.16167,-4.849814 1.77827,-4.849814 2.90989,-8.891326 2.10158,-4.203172 1.29329,0 1.29328,0.16166 0,1.131623 1.29329,2.263247 2.74822,0.646642 0.80831,-0.808303 0,-0.969962 4.04151,-2.909889 1.77826,-1.778265 1.45495,0.161661 5.98143,2.424907 1.93993,0.969962 9.05299,29.907187 5.98143,0 0.80831,1.939926 0.16166,4.849814 2.90988,2.263246 0.80831,0 0.16166,-0.484981 -0.48498,-1.131623 2.74822,-0.161661 z m -20.93175,30.147531 1.53578,-1.53578 1.37412,1.0508 0.56581,2.42492 -1.69744,0.88913 -1.77827,-2.82907 z m 6.70893,-5.90062 1.77827,1.8591 c 0,0 1.29329,0.0808 1.29329,-0.2425 0,-0.32332 0.24249,-2.02076 0.24249,-2.02076 l 0.88914,-0.8083 -0.80831,-1.77828 -2.02076,0.72748 -1.37412,2.26326 z",
						"RI" : "m 874.07001,178.89536 -3.69579,-14.95599 6.26928,-1.84514 2.19113,1.92712 3.30649,4.32065 2.6879,4.40209 -2.99934,1.62479 -1.29328,-0.16166 -1.13162,1.77827 -2.42491,1.93992 -2.90986,0.96995 z",
						"NY" : "m 830.37944,188.7456 -1.13163,-0.96996 -2.58658,-0.16166 -2.26324,-1.93992 -1.63061,-6.12913 -3.45846,0.0905 -2.44371,-2.7082 -19.38532,4.38194 -43.00178,8.72969 -7.52965,1.22799 -0.73816,-6.46834 1.4281,-1.12538 1.29328,-1.13162 0.96997,-1.61661 1.77826,-1.13162 1.93993,-1.77827 0.48498,-1.6166 2.10158,-2.74823 1.13163,-0.96996 -0.16166,-0.96997 -1.29329,-3.07154 -1.77826,-0.16166 -1.93993,-6.1431 2.90989,-1.77827 4.36483,-1.45494 4.04152,-1.29329 3.23321,-0.48498 6.30475,-0.16166 1.93993,1.29329 1.6166,0.16166 2.10159,-1.29329 2.58657,-1.13162 5.17313,-0.48498 2.10159,-1.77827 1.77826,-3.23321 1.61661,-1.93992 2.10158,0 1.93993,-1.13163 0.16166,-2.26324 -1.45494,-2.10159 -0.32332,-1.45494 1.13162,-2.10159 0,-1.45494 -1.77827,0 -1.77826,-0.8083 -0.8083,-1.13163 -0.16166,-2.58657 5.81977,-5.49645 0.64664,-0.8083 1.45495,-2.90989 2.90989,-4.5265 2.74823,-3.71819 2.10158,-2.4249 2.4151,-1.82561 3.08136,-1.24594 5.49645,-1.29329 3.23321,0.16166 4.5265,-1.45494 7.56519,-2.07117 0.51979,4.97967 2.42492,6.46644 0.8083,5.17315 -0.96996,3.87986 2.58657,4.5265 0.8083,2.10159 -0.8083,2.9099 2.9099,1.29328 0.64664,0.32332 3.07156,10.99294 -0.53629,5.05967 -0.48498,10.83127 0.8083,5.49647 0.8083,3.55654 1.45495,7.27474 0,8.08304 -1.13163,2.26325 1.83933,1.99279 0.79655,1.67842 -1.93992,1.77827 0.32332,1.29328 1.29328,-0.32332 1.45495,-1.29328 2.26324,-2.58657 1.13163,-0.64664 1.6166,0.64664 2.26325,0.16166 7.92136,-3.87985 2.90989,-2.74823 1.29328,-1.45494 4.20317,1.6166 -3.39487,3.55653 -3.87985,2.90989 -7.11306,5.33479 -2.58656,0.96997 -5.81978,1.93992 -4.04151,1.13163 -1.17474,-0.53293 -0.24402,-3.68853 0.48498,-2.74824 -0.16166,-2.10158 -2.81351,-1.699 -4.5265,-0.96997 -3.87986,-1.13162 -3.7182,-1.77828 z",
						"PA" : "m 825.1237,224.69205 1.30842,-0.271 2.32953,-1.25325 1.21188,-2.48307 1.61661,-2.26325 3.23321,-3.07156 0,-0.8083 -2.42491,-1.6166 -3.55654,-2.42492 -0.96996,-2.58657 -2.74824,-0.32332 -0.16166,-1.13163 -0.8083,-2.74823 2.26326,-1.13162 0.16166,-2.42492 -1.2933,-1.29329 0.16166,-1.61661 1.93994,-3.07155 0,-3.07156 2.69763,-2.64588 -0.92028,-0.67498 -2.52408,-0.19291 -2.29449,-1.93992 -1.54992,-6.11606 -3.50458,0.10052 -2.45523,-2.70333 -18.09099,4.19777 -43.00178,8.72969 -8.89135,1.45494 -0.62067,-6.52139 -5.36253,5.06765 -1.29329,0.48498 -4.20229,3.00889 2.91076,19.13745 2.48166,9.72936 3.5718,19.26149 3.26931,-0.63768 11.94358,-1.50247 37.92663,-7.6652 14.87621,-2.82332 8.30035,-1.62236 0.26711,-0.23853 2.1016,-1.61662 2.10158,-0.68084 z",
						"NJ" : "m 829.67942,188.46016 -2.32255,2.73427 0,3.07156 -1.93994,3.07155 -0.16166,1.61662 1.2933,1.29328 -0.16166,2.42492 -2.26326,1.13162 0.8083,2.74823 0.16166,1.13163 2.74824,0.32332 0.96996,2.58657 3.55654,2.42492 2.42491,1.6166 0,0.80831 -2.98321,2.69656 -1.61661,2.26324 -1.45495,2.74824 -2.26325,1.29328 -0.46245,1.60248 -0.2425,1.21246 -0.60923,2.60674 1.09227,2.24419 3.23321,2.90989 4.84981,2.26325 4.04151,0.64664 0.16166,1.45494 -0.8083,0.96996 0.32332,2.74823 0.8083,0 2.10159,-2.4249 0.8083,-4.84982 2.74823,-4.04151 3.07155,-6.46642 1.13162,-5.49645 -0.64664,-1.13163 -0.16166,-9.37631 -1.61661,-3.39486 -1.13162,0.8083 -2.74823,0.32332 -0.48498,-0.48498 1.13163,-0.96997 2.10158,-1.93992 0.0631,-1.09383 -0.38439,-3.43384 0.57337,-2.74824 -0.11747,-1.96901 -2.80754,-1.75035 -5.09214,-1.17576 -4.13744,-1.38163 -3.58563,-1.64569 z",
						"DE" : "m 825.6261,228.2791 0.36831,-2.14689 0.37507,-1.69105 -1.623,0.39776 -1.61546,0.46756 -2.20626,1.7643 1.72012,5.04288 2.26326,5.65812 2.10158,9.69965 1.61662,6.30478 5.01148,-0.16166 6.14212,-1.18068 -2.26423,-7.38627 -0.96997,0.48498 -3.55653,-2.4249 -1.77826,-4.68816 -1.93993,-3.55653 -3.14712,-2.87031 -0.86416,-2.09812 0.36636,-1.61546 z",
						"MD" : "m 839.79175,252.41476 -6.00855,1.20384 -5.1429,0.11746 -1.84356,-6.92233 -1.92481,-9.16932 -2.57262,-6.18845 -1.28838,-4.39833 -7.50602,1.62236 -14.87621,2.82332 -37.45143,7.5509 1.1313,5.01166 0.96996,5.65811 0.32332,-0.32332 2.1016,-2.4249 2.26324,-2.61766 2.42491,-0.61556 1.45496,-1.45495 1.77826,-2.58657 1.29328,0.64665 2.90989,-0.32333 2.58658,-2.10158 2.00689,-1.45327 1.84523,-0.48498 1.64435,1.12995 2.90989,1.45494 1.93992,1.77827 1.21246,1.53578 4.12235,1.69743 0,2.90989 5.49646,1.29329 1.14444,0.54198 1.4119,-2.02832 2.88197,1.97016 -1.27817,2.48193 -0.76527,3.98566 -1.77826,2.58657 0,2.10159 0.64664,1.77827 5.06395,1.35569 4.3111,-0.0617 3.07154,0.96997 2.10159,0.32332 0.96996,-2.10159 -1.45494,-2.10158 0,-1.77827 -2.42491,-2.10159 -2.10158,-5.49645 1.29328,-5.3348 -0.16166,-2.10158 -1.29328,-1.29329 c 0,0 1.45494,-1.6166 1.45494,-2.26324 0,-0.64665 0.48498,-2.10159 0.48498,-2.10159 l 1.93993,-1.29328 1.93992,-1.61661 0.48498,0.96997 -1.45494,1.6166 -1.29328,3.71819 0.32332,1.13162 1.77826,0.32332 0.48498,5.49646 -2.10158,0.96996 0.32332,3.55653 0.48498,-0.16166 1.13162,-1.93992 1.61661,1.77826 -1.61661,1.29329 -0.32332,3.39487 2.58657,3.39487 3.87985,0.48498 1.61661,-0.8083 3.23655,4.18293 1.35835,0.5363 6.65367,-2.79695 2.00758,-4.02387 -0.43596,-4.90798 z m -15.96958,9.02872 1.13162,2.50575 0.16166,1.77827 1.13163,1.8591 c 0,0 0.88914,-0.88914 0.88914,-1.21246 0,-0.32332 -0.72747,-3.07156 -0.72747,-3.07156 l -0.72748,-2.34409 -1.8591,0.48499 z",
						"VA" : "m 831.63885,266.06892 -0.14391,-1.94703 6.45343,-2.54988 -0.77041,3.21784 -2.91995,3.77911 -0.41809,4.58582 0.46175,3.39044 -1.82797,4.97816 -2.16427,1.91614 -1.47034,-4.64081 0.44589,-5.44911 1.587,-4.18307 0.76687,-3.09761 z m 3.34019,28.30136 -58.17418,12.57543 -37.42697,5.27907 -6.67833,-0.37518 -2.58525,1.92638 -7.33913,0.22069 -8.38211,0.97767 -10.91496,1.61462 10.46943,-5.6112 -0.0131,-2.07493 1.52005,-2.14613 10.55378,-11.50143 3.94672,4.47746 3.78301,0.96398 2.54346,-1.14032 2.23722,-1.31116 2.53661,1.34352 3.91417,-1.42776 1.87673,-4.55634 2.60092,0.54002 2.85524,-2.13125 1.79927,0.4936 2.82721,-3.67657 0.34825,-2.08311 -0.96366,-1.27557 1.00277,-1.86663 5.27427,-12.27715 0.61677,-5.73508 1.22889,-0.52354 2.17853,2.44287 3.93586,-0.30117 1.92921,-7.57363 2.79399,-0.56086 1.04975,-2.74107 2.57982,-2.34688 2.77183,-5.69519 0.0849,-5.06755 9.82151,3.82282 c 0.68085,0.34042 0.83288,-5.04915 0.83288,-5.04915 l 3.65256,1.59833 0.0683,2.93816 5.78425,1.29949 2.13295,1.1762 1.65992,2.05569 -0.65455,3.64867 -1.94744,2.59098 0.10985,2.05907 0.58896,1.85291 4.97875,1.26843 4.45127,0.0399 3.06883,0.95864 1.94351,0.3093 0.71481,3.08846 3.19044,0.40253 0.86807,1.20002 -0.43949,4.69008 1.37473,1.10255 -0.47895,1.93039 1.22941,0.78977 -0.2218,1.3846 -2.69399,-0.0949 0.089,1.61552 2.28099,1.54287 0.12154,1.4119 1.77311,1.78538 0.49179,2.52413 -2.55304,1.38131 1.57222,1.4943 5.80102,-1.68583 3.60762,6.01193 z",
						"WV" : "m 761.18551,238.96731 1.11201,4.94453 1.08344,6.03133 2.13029,-2.58034 2.26324,-3.07156 2.53838,-0.61555 1.45495,-1.45494 1.77827,-2.58657 1.44498,0.64664 2.90989,-0.32332 2.58658,-2.10159 2.00689,-1.45326 1.84523,-0.48499 1.30392,1.01647 3.64325,1.82163 1.93993,1.77827 1.37412,1.29328 -0.76172,5.55494 -5.83491,-2.54122 -4.24525,-1.62202 -0.10114,5.17843 -2.74764,5.53673 -2.53003,2.42666 -1.19209,2.74939 -2.64358,0.5001 -0.89784,3.60188 -1.04323,3.94967 -3.96824,0.34074 -2.32373,-2.43888 -1.07115,0.55941 -0.63268,5.4697 -1.35029,3.5345 -4.9584,10.95497 0.89669,1.1607 -0.20586,1.90854 -2.80869,3.88447 -1.8085,-0.54429 -2.96805,2.15974 -2.54238,-0.57221 -1.99923,4.55557 c 0,0 -3.25931,1.43022 -3.92291,1.36772 -0.16051,-0.0151 -2.4691,-1.2491 -2.4691,-1.2491 l -2.33652,1.37937 -2.4098,1.0444 -3.74469,-0.88912 -1.1214,-1.16828 -2.19222,-3.02336 -3.14259,-1.98812 -1.71157,-3.62324 -4.28488,-3.46819 -0.64665,-2.26325 -2.58657,-1.45495 -0.80831,-1.6166 -0.24249,-5.25398 2.18242,-0.0808 1.93994,-0.8083 0.16166,-2.74823 1.6166,-1.45495 0.16166,-5.01148 0.96996,-3.87986 1.29329,-0.64664 1.29328,1.13162 0.48499,1.77827 1.77827,-0.96997 0.48498,-1.6166 -1.13162,-1.77827 0,-2.42491 0.96996,-1.29329 2.26325,-3.39487 1.29328,-1.45494 2.1016,0.48498 2.26324,-1.61662 3.07155,-3.39487 2.26326,-3.87986 0.32332,-5.65811 0.48498,-5.01149 0,-4.68816 -1.13162,-3.07155 0.96996,-1.45496 1.28348,-1.29328 3.49125,19.82712 4.63101,-0.75115 12.42832,-1.79965 z",
						"OH" : "m 735.32497,193.32832 -6.09354,4.05335 -3.87985,2.26325 -3.39487,3.71819 -4.04151,3.87985 -3.23321,0.8083 -2.90989,0.48498 -5.49646,2.58657 -2.10158,0.16166 -3.39487,-3.07155 -5.17314,0.64665 -2.58656,-1.45495 -2.38107,-1.35083 -4.89257,0.70341 -10.18462,1.61661 -11.20687,2.18473 1.29329,14.63028 1.77827,13.74117 2.58656,23.4408 0.56582,4.83117 4.12235,-0.12902 2.42491,-0.80831 3.3638,1.50314 2.07049,4.36483 5.13894,-0.0171 1.89174,2.1187 1.76117,-0.0653 2.53839,-1.34146 2.50417,0.3715 5.42128,0.48268 1.72697,-2.13268 2.34565,-1.29328 2.07049,-0.68085 0.64664,2.74824 1.77828,0.96996 3.47569,2.34407 2.18242,-0.0808 1.33312,-0.49248 0.18471,-2.76153 1.58536,-1.45496 0.0992,-4.79272 c 0,0 1.02396,-4.10906 1.02396,-4.10906 l 1.29927,-0.60128 1.32135,1.14774 0.53815,1.69702 1.71913,-1.03742 0.43898,-1.46075 -1.11669,-1.90306 0.0663,-2.31443 0.749,-1.07231 2.15276,-3.30648 1.05022,-1.54334 2.10159,0.48498 2.26325,-1.61661 3.07155,-3.39487 2.77149,-4.07873 0.32033,-5.05551 0.48498,-5.01149 -0.17678,-5.30688 -0.95484,-2.89478 0.35124,-1.18978 1.80439,-1.75011 -2.28879,-9.04733 -2.90989,-19.36177 z",
						"IN" : "m 619.56954,299.97132 0.0653,-2.85858 0.48499,-4.52651 2.26324,-2.90988 1.77828,-3.87987 2.58656,-4.20317 -0.48498,-5.81979 -1.77826,-2.74823 -0.32332,-3.23321 0.8083,-5.49647 -0.48498,-6.95141 -1.2933,-16.00441 -1.29328,-15.35776 -0.97047,-11.72002 3.07106,0.88951 1.45495,0.96996 1.13162,-0.32332 2.10159,-1.93992 2.82957,-1.61699 5.0928,-0.16204 21.98587,-2.26326 5.57573,-0.53316 1.50314,15.95621 4.25135,36.84155 0.59846,5.7716 -0.3715,2.26325 1.22798,1.79537 0.0964,1.37255 -2.52129,1.59951 -3.53943,1.55131 -3.20213,0.55028 -0.59846,4.86693 -4.57469,3.31247 -2.79642,4.01044 0.32332,2.37673 -0.58134,1.5342 -3.32647,0 -1.58553,-1.6166 -2.49331,1.2622 -2.68296,1.50314 0.16167,3.05445 -1.19379,0.25803 -0.46788,-1.01814 -2.16688,-1.50314 -3.25032,1.34148 -1.55131,3.00625 -1.43784,-0.8083 -1.45495,-1.59951 -4.46434,0.48499 -5.59283,0.96996 -2.90989,1.55132 z",
						"IL" : "m 619.54145,300.34244 0.0312,-3.22971 0.56739,-4.64596 2.33253,-2.91586 1.86665,-4.07576 2.23302,-3.99533 -0.3715,-5.2524 -2.00521,-3.54257 -0.0964,-3.34668 0.69483,-5.26951 -0.82541,-7.17837 -1.06634,-15.77745 -1.29328,-15.01734 -0.92228,-11.6392 -0.27251,-0.92139 -0.8083,-2.58657 -1.29328,-3.71819 -1.61661,-1.77827 -1.45494,-2.58656 -0.23357,-5.48896 -45.79643,2.59825 0.22862,2.37195 2.28623,0.68587 0.91448,1.14311 0.45725,1.82898 3.88658,3.42934 0.68588,2.28623 -0.68588,3.42934 -1.82898,3.65796 -0.68586,2.51484 -2.28623,1.82899 -1.82898,0.68587 -5.25832,1.37173 -0.68587,1.82898 -0.68587,2.05761 0.68587,1.37174 1.82898,1.60036 -0.22862,4.1152 -1.82899,1.60036 -0.68586,1.60036 0,2.74347 -1.82898,0.45724 -1.60036,1.14312 -0.22862,1.37174 0.22862,2.0576 -1.71467,1.31457 -1.0288,2.80064 0.45724,3.65795 2.28623,7.31593 7.31593,7.54455 5.48693,3.65796 -0.22862,4.34383 0.9145,1.37174 6.40143,0.45724 2.74347,1.37174 -0.68586,3.65796 -2.28623,5.94419 -0.68587,3.20072 2.28622,3.88658 6.40144,5.25832 4.57246,0.68587 2.05759,5.0297 2.05761,3.20071 -0.91449,2.97209 1.60036,4.11521 1.82898,2.05761 1.41403,-0.88069 0.90766,-2.07479 2.21308,-1.7472 2.13147,-0.6144 2.60253,1.1798 3.62699,1.3757 1.18895,-0.29823 0.19987,-2.25845 -1.2873,-2.41179 0.30422,-2.37672 1.8384,-1.34745 3.02254,-0.81029 1.2609,-0.45852 -0.61261,-1.38688 -0.79137,-2.35437 1.4326,-0.98096 1.15747,-3.21403 z",
						"CT" : "m 874.06831,178.86288 -3.67743,-14.87881 -4.71882,0.92031 -21.22878,4.74309 1.00019,3.22567 1.45495,7.27474 0.17678,8.96692 -1.22002,2.17487 1.92079,1.93234 4.27153,-3.90564 3.55653,-3.23321 1.93992,-2.10159 0.80831,0.64664 2.74822,-1.45494 5.17314,-1.13162 7.79469,-3.17877 z",
						"WI" : "m 615.06589,197.36866 -0.0667,-3.15742 -1.17911,-4.5265 -0.64664,-6.14309 -1.13162,-2.42491 0.96996,-3.07155 0.8083,-2.90989 1.45495,-2.58656 -0.64665,-3.39487 -0.64664,-3.55653 0.48498,-1.77827 1.93993,-2.42491 0.16166,-2.74823 -0.8083,-1.29328 0.64664,-2.58657 -0.45252,-4.17071 2.74823,-5.65811 2.90989,-6.78974 0.16166,-2.26325 -0.32332,-0.96996 -0.80831,0.48498 -4.20317,6.30476 -2.74823,4.04151 -1.93992,1.77827 -0.8083,2.26324 -1.95495,0.8083 -1.13162,1.93993 -1.45495,-0.32332 -0.16166,-1.77827 1.29329,-2.4249 2.10158,-4.68816 1.77827,-1.6166 0.99083,-2.35785 -2.56045,-1.90134 -1.97482,-10.36699 -3.54747,-1.34198 -1.94626,-2.30833 -12.12971,-2.72164 -2.87589,-1.01205 -8.21312,-2.16729 -7.91792,-1.15875 -3.76516,-5.13067 -0.7504,0.55401 -1.19791,-0.16166 -0.64665,-1.13162 -1.33401,0.29655 -1.13163,0.16166 -1.77826,0.96996 -0.96997,-0.64664 0.64665,-1.93993 1.93992,-3.07155 1.13162,-1.13162 -1.93992,-1.45494 -2.10159,0.8083 -2.90989,1.93992 -7.43638,3.23321 -2.90989,0.64664 -2.90988,-0.48498 -0.98173,-0.87825 -2.1167,2.83518 -0.22862,2.74347 0,8.45903 -1.14312,1.60037 -5.25832,3.88657 -2.28622,5.94419 0.45724,0.22862 2.51485,2.05761 0.68586,3.20072 -1.82898,3.20071 0,3.88659 0.45725,6.63005 2.97209,2.9721 3.42935,0 1.82898,3.20072 3.42933,0.45724 3.88659,5.71557 7.0873,4.11521 2.0576,2.74347 0.9145,7.43024 0.68586,3.31502 2.28623,1.60036 0.22862,1.37174 -2.0576,3.42933 0.22862,3.20073 2.51485,3.88658 2.51485,1.14311 2.97209,0.45724 1.34234,1.38012 45.29836,-2.66945 z",
						"NC" : "m 834.98153,294.31554 2.085,4.91735 3.55653,6.46642 2.4249,2.42491 0.64664,2.26325 -2.4249,0.16166 0.8083,0.64664 -0.32332,4.20317 -2.58657,1.29328 -0.64664,2.10159 -1.29328,2.90989 -3.7182,1.6166 -2.4249,-0.32332 -1.45495,-0.16166 -1.6166,-1.29328 0.32332,1.29328 0,0.96997 1.93993,0 0.8083,1.29328 -1.93993,6.30476 4.20317,0 0.64665,1.6166 2.26324,-2.26324 1.29329,-0.48499 -1.93993,3.55653 -3.07155,4.84982 -1.29328,0 -1.13163,-0.48498 -2.74822,0.64664 -5.17314,2.42491 -6.46642,5.33479 -3.39487,4.68815 -1.93992,6.46642 -0.48498,2.42491 -4.68816,0.48498 -5.45313,1.33666 -9.94641,-8.20253 -12.60954,-7.59805 -2.90989,-0.80831 -12.60953,1.45495 -4.27646,0.75015 -1.6166,-3.23322 -2.97036,-2.1167 -16.48939,0.48498 -7.27474,0.8083 -9.05299,4.52651 -6.14311,2.58656 -21.17755,2.58658 0.50009,-4.05433 1.77827,-1.45494 2.74824,-0.64665 0.64664,-3.7182 4.20318,-2.74822 3.87985,-1.45496 4.20319,-3.55653 4.36483,-2.10159 0.64664,-3.07156 3.87986,-3.87985 0.64664,-0.16166 c 0,0 0,1.13163 0.80831,1.13163 0.8083,0 1.93993,0.32332 1.93993,0.32332 l 2.26325,-3.55654 2.10159,-0.64665 2.26324,0.32333 1.61662,-3.55653 2.90989,-2.58658 0.48498,-2.10159 0.1875,-3.64819 4.2765,-0.0225 7.19859,-0.85579 15.75723,-2.25243 15.13604,-2.08657 21.64048,-4.71935 19.98332,-4.25857 11.17694,-2.40581 5.04998,-1.15688 z m 4.27046,33.20657 2.58658,-2.50575 3.15238,-2.58658 1.53578,-0.64664 0.16166,-2.02076 -0.64664,-6.14312 -1.45495,-2.34408 -0.64665,-1.8591 0.72748,-0.2425 2.74824,5.49648 0.40415,4.44567 -0.16166,3.39489 -3.39488,1.53577 -2.82907,2.42492 -1.13162,1.21246 -1.0508,-0.16166 z",
						"DC" : "m 805.81945,250.84384 -1.85828,-1.82417 -1.23263,-0.68629 1.44301,-2.02247 2.88909,1.9485 -1.24119,2.58443 z",
						"MA" : "m 899.62349,173.25394 2.17192,-0.68588 0.45726,-1.71467 1.0288,0.11431 1.0288,2.28624 -1.25742,0.45724 -3.8866,0.11432 0.45724,-0.57156 z m -9.37354,0.80018 2.28622,-2.62917 1.60037,0 1.82899,1.48605 -2.40054,1.0288 -2.17192,1.0288 -1.14312,-0.91448 z m -34.79913,-21.98819 17.64687,-4.64068 2.26326,-0.64664 1.91408,-2.79571 3.73677,-1.66331 2.88924,4.41284 -2.42491,5.17314 -0.32332,1.45494 1.93993,2.58657 1.13162,-0.8083 1.77827,0 2.26324,2.58656 3.87986,5.98144 3.55653,0.48498 2.26324,-0.96996 1.77827,-1.77827 -0.80831,-2.74822 -2.10158,-1.61661 -1.45495,0.8083 -0.96996,-1.29328 0.48498,-0.48498 2.10159,-0.16166 1.77826,0.8083 1.93993,2.42491 0.96996,2.90989 0.32332,2.4249 -4.20317,1.45495 -3.87985,1.93992 -3.87985,4.5265 -1.93993,1.45494 0,-0.96996 2.42491,-1.45495 0.48498,-1.77826 -0.8083,-3.07155 -2.90989,1.45494 -0.8083,1.45495 0.48498,2.26324 -2.06633,1.00043 -2.7472,-4.52713 -3.39488,-4.36484 -2.0705,-1.81247 -6.53327,1.8762 -5.09233,1.05079 -20.67516,4.59221 -0.66776,-4.76785 0.64664,-10.58877 4.28927,-0.88914 6.78975,-1.2933 z",
						"TN" : "m 696.67788,318.25411 -51.89309,5.01149 -15.75956,1.77826 -4.6212,0.51271 -3.86835,-0.0277 -0.22097,4.10083 -8.18538,0.26401 -6.95141,0.64664 -8.09083,-0.12386 -1.41378,7.07286 -1.69623,5.48005 -3.29317,2.75084 -1.34874,4.38106 -0.32332,2.58657 -4.04152,2.26324 1.45494,3.55654 -0.96996,4.36484 -0.96838,0.78965 108.15855,-10.40755 0.40327,-3.95494 1.81073,-1.49039 2.83415,-0.74945 0.67193,-3.71698 4.0986,-2.70496 4.04693,-1.49403 4.08358,-3.57033 4.43609,-2.02546 0.52126,-3.06735 4.0646,-3.98499 0.5508,-0.11417 c 0,0 0.0312,1.13162 0.83955,1.13162 0.8083,0 1.93993,0.35457 1.93993,0.35457 l 2.26325,-3.58779 2.07034,-0.64664 2.27511,0.29521 1.59831,-3.53286 2.95525,-2.64391 0.42168,-1.93911 0.30896,-3.71115 -2.14655,-0.19977 -2.60168,2.02833 -6.99331,0.0291 -18.35929,2.38682 -8.06109,1.9082 z",
						"AR" : "m 593.82477,343.05296 -3.97988,0.7167 -5.11215,-0.63403 0.4207,-1.60207 2.97975,-2.56669 0.94338,-3.65625 -1.82898,-2.9721 -78.41757,2.51485 1.60036,6.85869 -1e-5,8.23042 1.37175,10.97399 0.22862,37.83693 2.28623,1.94329 2.97209,-1.37173 2.74348,1.14311 0.68034,6.5733 55.62126,-1.1406 1.14563,-2.09037 -0.28662,-3.54951 -1.82563,-2.9721 1.59869,-1.48521 -1.59869,-2.5115 0.6842,-2.50983 1.36839,-5.60543 2.51819,-2.06263 -0.68587,-2.28456 3.65797,-5.37179 2.74347,-1.36839 -0.11348,-1.49358 -0.34544,-1.82564 2.85695,-5.59873 2.40304,-1.25659 0.38413,-3.42763 1.77067,-1.2417 -3.14352,-0.48427 -1.34146,-4.01044 2.80408,-2.37671 0.55026,-2.0192 1.27948,-4.04661 1.06619,-3.25539 z",
						"MO" : "m 558.44022,248.11316 -2.51987,-3.08725 -1.14312,-2.28623 -64.35723,2.40054 -2.28626,0.11431 1.25743,2.51485 -0.22862,2.28622 2.51484,3.88659 3.0864,4.11521 3.08641,2.74347 2.16123,0.22862 1.49673,0.9145 0,2.97209 -1.82897,1.60036 -0.45726,2.28622 2.05761,3.42935 2.51486,2.97209 2.51484,1.82898 1.37173,11.65975 0.31414,36.07221 0.22862,4.68675 0.45724,5.38351 22.43299,-0.86682 23.20603,-0.68587 20.80466,-0.80101 11.65474,-0.2303 2.1694,3.426 -0.68419,3.3075 -3.08725,2.40304 -0.57239,1.83734 5.37849,0.45726 3.89496,-0.68588 1.71718,-5.49363 0.65142,-5.85679 2.09803,-2.55516 2.59603,-1.48689 0.0514,-3.05024 1.01602,-1.93648 -1.69423,-2.54377 -1.33093,0.98426 -1.99262,-2.22724 -1.28503,-4.759 0.80101,-2.5182 -1.94413,-3.42766 -1.83064,-4.5758 -4.79941,-0.79934 -6.9688,-5.59875 -1.71886,-4.11353 0.79935,-3.20072 2.05927,-6.05767 0.45892,-2.86363 -1.94914,-1.03131 -6.85534,-0.79767 -1.02797,-1.71216 -0.1118,-4.23036 -5.48694,-3.43101 -6.97551,-7.7715 -2.28622,-7.31593 -0.23029,-4.22532 0.80101,-2.2879 z",
						"GA" : "m 672.29229,355.5518 0,2.18242 0.16166,2.1016 0.64664,3.39487 3.39488,7.92137 2.42491,9.86131 1.45494,6.14311 1.61661,4.84981 1.45495,6.95141 2.10159,6.30477 2.58657,3.39488 0.48498,3.39487 1.93993,0.8083 0.16166,2.1016 -1.77827,4.84981 -0.48498,3.23322 -0.16166,1.93993 1.61661,4.36484 0.32332,5.3348 -0.80831,2.42491 0.64665,0.80831 1.45495,0.8083 0.2047,3.21809 2.23301,3.34953 2.25044,2.16205 7.92138,0.16166 10.81975,-0.64664 21.51239,-1.29328 5.44572,-0.67437 4.57725,0.0277 0.16166,2.90989 2.58657,0.8083 0.32332,-4.36484 -1.61661,-4.5265 1.13163,-1.6166 5.81978,0.8083 4.97741,0.31778 -0.77542,-6.29879 2.26324,-10.02295 1.45495,-4.20318 -0.48499,-2.58656 3.33441,-6.2443 -0.5103,-1.35168 -1.91341,0.70458 -2.58656,-1.2933 -0.64665,-2.10159 -1.29328,-3.55653 -2.26326,-2.10159 -2.58656,-0.64664 -1.61661,-4.84982 -2.92501,-6.335 -4.20317,-1.93993 -2.1016,-1.93993 -1.29329,-2.58657 -2.10158,-1.93993 -2.26325,-1.29329 -2.26325,-2.90989 -3.07155,-2.26324 -4.52651,-1.77828 -0.48498,-1.45494 -2.42491,-2.90989 -0.48498,-1.45495 -3.39488,-4.97048 -3.51987,0.0992 -3.75491,-2.35614 -1.41828,-1.29328 -0.32332,-1.77827 0.8708,-1.93992 2.22664,-1.11014 -0.63394,-2.09722 -41.86975,4.98893 z",
						"SC" : "m 764.94328,408.16488 -1.77706,0.9695 -2.58657,-1.29329 -0.64664,-2.10159 -1.29328,-3.55653 -2.26326,-2.1016 -2.58657,-0.64664 -1.6166,-4.84981 -2.74824,-5.98145 -4.20317,-1.93994 -2.1016,-1.93992 -1.29328,-2.58657 -2.10159,-1.93994 -2.26325,-1.29328 -2.26325,-2.90989 -3.07155,-2.26324 -4.52651,-1.77828 -0.48498,-1.45494 -2.4249,-2.90989 -0.48499,-1.45496 -3.39488,-5.17313 -3.39487,0.16166 -4.04152,-2.42492 -1.29328,-1.29328 -0.32332,-1.77827 0.8083,-1.93992 2.26325,-0.96998 -0.51082,-2.28908 5.7681,-2.33657 9.1155,-4.589 7.77473,-0.80831 16.1144,-0.42248 2.63825,1.87743 1.6791,3.35822 4.30235,-0.60998 12.60953,-1.45496 2.90989,0.80831 12.60954,7.59806 10.10808,8.12168 -5.42117,5.45834 -2.58657,6.1431 -0.48498,6.30476 -1.6166,0.8083 -1.13163,2.74823 -2.4249,0.64664 -2.10159,3.55653 -2.74823,2.74823 -2.26324,3.39487 -1.61661,0.8083 -3.55653,3.39487 -2.90989,0.16166 0.96997,3.23321 -5.01148,5.49646 -2.10159,1.29328 z",
						"KY" : "m 725.9944,295.2707 -2.29332,2.40168 -3.57819,3.99404 -4.92455,5.46467 -1.21577,1.71577 -0.0625,2.10158 -4.37986,2.16409 -5.65812,3.39488 -7.23187,1.79885 -51.86789,4.89886 -15.75956,1.77826 -4.6212,0.51271 -3.86835,-0.0277 -0.22695,4.22028 -8.17941,0.14456 -6.95141,0.64664 -7.98748,-0.0602 1.20778,-1.32008 2.49954,-1.54085 0.22863,-3.20073 0.91449,-1.82898 -1.60682,-2.5389 0.80183,-1.90681 2.26326,-1.77826 2.10158,-0.64665 2.74823,1.29329 3.55654,1.29328 1.13163,-0.32332 0.16166,-2.26325 -1.29329,-2.42491 0.32332,-2.26325 1.93993,-1.45494 2.58658,-0.64665 1.6166,-0.64664 -0.8083,-1.77827 -0.64664,-1.93993 1.50662,-0.9958 c 0.003,-0.0371 1.25396,-3.52229 1.23829,-3.65781 l 3.05322,-1.47868 5.31979,-0.96996 4.49404,-0.48498 1.39244,1.62743 1.52827,0.8708 1.59077,-3.10821 3.18708,-1.28262 2.20509,1.48403 0.41056,0.99904 1.17352,-0.26401 -0.16167,-2.95293 3.13087,-1.74919 2.14809,-1.07348 1.52936,1.66081 3.31815,-0.0442 0.58733,-1.57125 -0.36751,-2.26324 2.60053,-3.9985 4.77655,-3.4379 0.70595,-4.83586 2.92502,-0.45591 3.79146,-1.64568 2.44332,-1.70824 -0.19833,-1.56493 -1.14245,-1.45494 0.56582,-2.99491 4.18485,-0.1175 2.29991,-0.7458 3.34739,1.4291 2.05411,4.36484 5.13229,0.0108 2.05101,2.20819 1.61545,-0.1477 2.60169,-1.27817 5.23706,0.57337 2.57492,0.21751 1.68758,-2.05624 2.61795,-1.42588 1.88178,-0.7071 0.64664,2.83663 2.04343,1.05834 2.64276,2.08249 0.11747,5.67324 0.8083,1.57241 2.58972,1.55628 0.77164,2.29451 4.15989,3.43694 1.80531,3.62324 2.45655,1.65852 z",
						"AL" : "m 631.30647,460.41572 -1.4906,-14.3215 -2.74824,-18.75264 0.16166,-14.06449 0.8083,-31.03885 -0.16166,-16.65106 0.16509,-6.41906 44.48448,-3.61945 -0.1478,2.18242 0.16166,2.1016 0.64665,3.39487 3.39488,7.92137 2.4249,9.86131 1.45495,6.14311 1.6166,4.84982 1.45496,6.95141 2.10158,6.30476 2.58657,3.39489 0.48498,3.39486 1.93994,0.80831 0.16166,2.10159 -1.77828,4.84982 -0.48498,3.23322 -0.16166,1.93992 1.61662,4.36485 0.32332,5.33479 -0.80832,2.42492 0.64666,0.8083 1.45494,0.8083 0.32814,2.88882 -5.59766,-0.35355 -6.78975,0.64665 -25.5424,2.90988 -10.41156,1.40677 -0.22138,2.8774 1.77827,1.77827 2.58657,1.93992 0.58086,7.93544 -5.54206,2.5729 -2.74822,-0.32332 2.74822,-1.93993 0,-0.96996 -3.07154,-5.98144 -2.26325,-0.64664 -1.45495,4.36483 -1.29328,2.74823 -0.64664,-0.16166 -2.74823,0 z",
						"LA" : "m 607.96706,459.16125 -3.28461,-3.16614 1.00991,-5.50023 -0.66135,-0.89308 -9.26167,1.00656 -25.02832,0.45892 -0.68419,-2.39468 0.91281,-8.4557 3.31588,-5.94585 5.03136,-8.69102 -0.57407,-2.39802 1.25659,-0.68085 0.45893,-1.95249 -2.28624,-2.05593 -0.11179,-1.94245 -1.83066,-4.34551 -0.14705,-6.3386 -55.47379,0.92397 0.0286,9.57357 0.68587,9.37353 0.68587,3.88658 2.51485,4.11521 0.91449,5.02971 4.34383,5.48693 0.22862,3.20072 0.68587,0.68587 -0.68587,8.45904 -2.97209,5.02969 1.60036,2.05761 -0.68588,2.51484 -0.68586,7.31593 -1.37174,3.20071 0.12246,3.61645 4.68648,-1.52015 12.11335,0.20701 10.34627,3.55653 6.46642,1.13163 3.71819,-1.45495 3.23321,1.13163 3.23321,0.96996 0.8083,-2.10159 -3.23321,-1.13162 -2.58657,0.48498 -2.74823,-1.6166 c 0,0 0.16167,-1.29329 0.80831,-1.45495 0.64664,-0.16166 3.07155,-0.96996 3.07155,-0.96996 l 1.77826,1.45494 1.77827,-0.96996 3.23321,0.64664 1.45494,2.42491 0.32332,2.26325 4.52649,0.32332 1.77827,1.77826 -0.8083,1.61661 -1.29329,0.8083 1.61661,1.6166 8.40634,3.55653 3.55653,-1.29328 0.96997,-2.42491 2.58656,-0.64664 1.77827,-1.45494 1.29328,0.96996 0.8083,2.90989 -2.26324,0.8083 0.64664,0.64664 3.39487,-1.29328 2.26325,-3.39487 0.8083,-0.48498 -2.10159,-0.32332 0.8083,-1.61661 -0.16166,-1.45494 2.10159,-0.48498 1.13162,-1.29329 0.64664,0.8083 c 0,0 -0.16166,3.07155 0.64665,3.07155 0.8083,0 4.20317,0.64665 4.20317,0.64665 l 4.04151,1.93992 0.96996,1.45495 2.90989,0 1.13163,0.96996 2.26324,-3.07155 0,-1.45495 -1.29328,0 -3.39487,-2.74822 -5.81978,-0.80831 -3.23321,-2.26324 1.13163,-2.74823 2.26324,0.32332 0.16166,-0.64664 -1.77826,-0.96996 0,-0.48499 3.23321,0 1.77826,-3.07154 -1.29328,-1.93993 -0.32332,-2.74823 -1.45495,0.16166 -1.93992,2.10159 -0.64664,2.58657 -3.07155,-0.64665 -0.96997,-1.77826 1.77827,-1.93993 1.90333,-3.4456 -1.0611,-2.41227 -1.16564,-3.98133 z",
						"MS" : "m 631.55882,459.34458 -0.25426,1.25615 -5.17314,0 -1.45494,-0.8083 -2.10159,-0.32332 -6.78974,1.93992 -1.77826,-0.8083 -2.58657,4.20317 -1.10254,0.77802 -1.12383,-2.48798 -1.14312,-3.88659 -3.42933,-3.20071 1.1431,-5.54455 -0.68586,-0.91449 -1.82898,0.22862 -7.91792,0.87337 -24.5465,0.37337 -0.76974,-2.22536 0.87337,-8.3768 3.11684,-5.67281 5.22707,-9.1449 -0.44574,-2.4326 1.23686,-0.65625 0.43587,-1.91947 -2.31748,-2.07898 -0.11512,-2.14148 -1.83572,-4.12109 -0.109,-5.96277 1.32753,-2.48097 -0.2233,-3.41575 -1.76949,-3.08259 1.52642,-1.48221 -1.57061,-2.49954 0.45725,-1.65221 1.5774,-6.52637 2.48595,-2.03635 -0.64167,-2.36697 3.65797,-5.30253 2.83186,-1.35642 -0.22097,-1.67516 -0.28813,-1.6811 2.87606,-5.56767 2.34572,-1.23151 0.15163,-0.89301 37.34348,-3.88117 0.18486,6.28333 0.16166,16.65106 -0.8083,31.03885 -0.16166,14.06449 2.74824,18.75264 1.48437,13.39529 z",
						"IA" : "m 569.19154,199.5843 0.26438,2.7862 2.22372,0.57726 0.95394,1.22533 0.50001,1.85536 3.79284,3.35865 0.68587,2.3915 -0.67434,3.42447 -1.58231,3.23198 -0.79934,2.74179 -2.17275,1.60204 -1.71551,0.5724 -5.57902,1.8602 -1.39146,3.84869 0.72864,1.37174 1.84051,1.68259 -0.28293,4.03629 -1.76315,1.53786 -0.77141,1.64314 0.12722,2.77632 -1.88631,0.45724 -1.62545,1.10491 -0.27879,1.35263 0.27879,2.11492 -1.55102,1.11607 -2.47053,-3.13328 -1.26257,-2.44987 -65.73582,2.51485 -0.91803,0.16544 -2.0524,-4.51596 -0.22862,-6.63007 -1.60036,-4.11521 -0.68586,-5.25831 -2.28623,-3.65797 -0.91448,-4.80107 -2.74348,-7.54455 -1.14311,-5.37264 -1.37174,-2.17191 -1.60036,-2.74346 1.95398,-4.84383 1.37174,-5.71557 -2.74347,-2.05761 -0.45725,-2.74347 0.9145,-2.51485 1.71467,0 82.654,-1.26948 0.83426,4.18312 2.25218,1.56097 0.25671,1.42309 -2.02954,3.38931 0.19041,3.20552 2.51486,3.7982 2.52679,1.29362 3.07928,0.50305 0.65834,0.83236 z",
						"MN" : "m 475.23781,128.82439 -0.45725,-8.45904 -1.82898,-7.31592 -1.82898,-13.488725 -0.45725,-9.830778 -1.82898,-3.429343 -1.60036,-5.029695 0,-10.28802 0.68586,-3.886587 -1.82093,-5.451667 30.13242,0.03527 0.32332,-8.244684 0.64664,-0.161661 2.26325,0.484982 1.93992,0.808302 0.8083,5.496456 1.45495,6.143098 1.6166,1.616605 4.84982,0 0.32332,1.454944 6.30476,0.323321 0,2.101586 4.84981,0 0.32332,-1.293284 1.13162,-1.131623 2.26325,-0.646642 1.29328,0.969963 2.90989,0 3.87985,2.586567 5.3348,2.424907 2.42491,0.484982 0.48498,-0.969963 1.45494,-0.484982 0.48498,2.909889 2.58657,1.293284 0.48498,-0.484982 1.29329,0.161661 0,2.101586 2.58656,0.969963 3.07155,0 1.61661,-0.808303 3.23321,-3.233209 2.58656,-0.484981 0.80831,1.778265 0.48498,1.293283 0.96996,0 0.96996,-0.808302 8.89133,-0.323321 1.77826,3.071549 0.64665,0 0.71361,-1.084279 4.43991,-0.370665 -0.6121,2.279459 -3.93872,1.837125 -9.24578,4.061128 -4.77474,2.006897 -3.07155,2.586568 -2.42491,3.55653 -2.26324,3.879851 -1.77827,0.808304 -4.52649,5.01147 -1.29329,0.16166 -4.32778,2.75712 -2.46288,3.20511 -0.22862,3.19139 0.0944,8.04335 -1.37604,1.68875 -5.08154,3.75997 -2.23008,5.98241 2.87175,2.23371 0.67989,3.22698 -1.85524,3.23893 0.17079,3.74802 0.36886,6.7304 3.02825,3.00199 3.329,0 1.89111,3.1326 3.37917,0.50327 3.85916,5.67147 7.08729,4.11675 2.14315,2.87512 0.67115,6.43951 -81.2115,1.14479 -0.33792,-35.67685 -0.45724,-2.97209 -4.11521,-3.42934 -1.14312,-1.82898 0,-1.60037 2.0576,-1.60035 1.37174,-1.37174 0.22863,-3.20072 z",
						"OK" : "m 380.34313,320.82146 -16.68418,-1.27331 -0.88022,10.95243 20.46538,1.15688 32.05555,1.3036 -2.3346,24.41865 -0.45725,17.83257 0.22863,1.60036 4.34383,3.65796 2.0576,1.14311 0.68587,-0.22862 0.68587,-2.05761 1.37174,1.82899 2.0576,0 0,-1.37174 2.74347,1.37174 -0.45724,3.88658 4.11521,0.22862 2.51484,1.14312 4.11521,0.68587 2.51485,1.82898 2.28623,-2.0576 3.42934,0.68586 2.51485,3.42934 0.91448,0 0,2.28623 2.28623,0.68586 2.28622,-2.28622 1.82899,0.68586 2.51484,0 0.9145,2.51486 6.30107,2.07897 1.37174,-0.68586 1.82898,-4.11521 1.14311,0 1.14312,2.0576 4.11521,0.68587 3.65795,1.37174 2.9721,0.91449 1.82899,-0.91449 0.68586,-2.51485 4.34383,0 2.0576,0.91449 2.74347,-2.05761 1.14312,0 0.68587,1.60036 4.1152,0 1.60036,-2.0576 1.82899,0.45724 2.0576,2.51486 3.20071,1.82897 3.20073,0.9145 1.94108,1.11893 -0.3891,-37.21701 -1.37175,-10.97398 -0.16046,-8.87234 -1.43989,-6.53773 -0.7782,-7.17964 -0.0681,-3.81622 -12.13684,0.31874 -46.41004,-0.45724 -45.03891,-2.05762 -24.2912,-1.37173 z",
						"TX" : "m 361.46423,330.57358 22.69079,1.08594 31.09269,1.14312 -2.33461,23.4558 -0.29676,18.15352 0.0681,2.08179 4.34383,3.81843 1.98665,1.44716 1.18421,-0.55969 0.37337,-1.81772 1.14032,1.80362 2.11164,0.0439 -0.003,-1.44709 1.66994,0.96727 1.1387,0.40887 -0.35927,3.96765 4.08819,0.0935 2.92532,1.19717 3.95474,0.52538 2.38138,2.07898 2.1241,-2.07617 3.72494,0.61491 2.22091,3.22494 1.07496,0.32096 -0.16047,1.96527 2.21361,0.79229 2.33015,-2.0548 2.13302,0.61492 2.22938,0.0355 0.93307,2.43544 6.32809,2.11445 1.59305,-0.76693 1.48947,-4.17771 0.34072,0 0.90649,0.0816 1.22905,2.06863 3.92988,0.66528 3.337,1.12288 3.42563,1.19597 1.84058,-0.975 0.71376,-2.51484 4.45322,0.0442 1.80874,0.93078 2.79925,-2.10651 1.10364,0.0442 0.85104,1.60507 4.05472,0 1.51887,-2.02862 1.86737,0.40724 1.94603,2.40328 3.52057,2.04415 2.85876,0.80981 1.51362,0.79984 2.4467,1.99732 3.04304,-1.32779 2.69109,1.13888 0.56381,6.10594 -0.0398,9.70217 0.68586,9.53401 0.70218,3.60511 2.67533,4.41986 0.89818,4.95073 4.21595,5.53802 0.19602,3.14494 0.74637,0.78584 -0.73007,8.38007 -2.8721,5.0065 1.53297,2.15287 -0.63008,2.33808 -0.66957,7.40432 -1.50432,3.338 0.29488,3.50235 -5.66488,1.58518 -9.86129,4.5265 -0.96996,1.93992 -2.58657,1.93993 -2.10158,1.45494 -1.29329,0.8083 -5.65811,5.3348 -2.74823,2.10159 -5.3348,3.2332 -5.65811,2.42491 -6.30476,3.39487 -1.77826,1.45495 -5.81978,3.55653 -3.39487,0.64664 -3.87985,5.49645 -4.04151,0.32333 -0.96997,1.93992 2.26325,1.93993 -1.45495,5.49645 -1.29328,4.5265 -1.13162,3.87985 -0.8083,4.52649 0.8083,2.42491 1.77826,6.9514 0.96997,6.14309 1.77826,2.74823 -0.96996,1.45495 -3.07155,1.93992 -5.65812,-3.87985 -5.49645,-1.13162 -1.29329,0.48498 -3.23321,-0.64664 -4.20317,-3.07155 -5.17313,-1.13162 -7.59805,-3.39487 -2.10158,-3.87986 -1.29329,-6.46641 -3.2332,-1.93993 -0.64665,-2.26325 0.64665,-0.64664 0.32332,-3.39487 -1.29329,-0.64664 -0.64664,-0.96996 1.29328,-4.36484 -1.6166,-2.26324 -3.23321,-1.29329 -3.39487,-4.36483 -3.55653,-6.62808 -4.20317,-2.58657 0.16166,-1.93992 -5.3348,-12.2862 -0.8083,-4.20317 -1.77826,-1.93992 -0.16166,-1.45495 -5.98144,-5.33479 -2.58657,-3.07155 0,-1.13163 -2.58657,-2.10158 -6.78974,-1.13163 -7.43638,-0.64664 -3.07155,-2.26324 -4.52649,1.77826 -3.55653,1.45495 -2.26325,3.2332 -0.96996,3.7182 -4.36483,6.14309 -2.42491,2.42491 -2.58657,-0.96996 -1.77826,-1.13163 -1.93993,-0.64664 -3.87985,-2.26324 0,-0.64665 -1.77826,-1.93992 -5.17314,-2.10159 -7.43638,-7.7597 -2.26325,-4.68815 0,-8.08303 -3.23321,-6.46642 -0.48498,-2.74822 -1.6166,-0.96997 -1.13163,-2.10158 -5.01147,-2.10159 -1.29328,-1.6166 -7.11307,-7.92137 -1.29328,-3.23321 -4.68816,-2.26325 -1.45495,-4.36487 -2.58659,-2.90987 -1.93991,-0.48496 -0.64923,-4.67764 8.00187,0.68589 29.03499,2.74345 29.03508,1.60036 2.23353,-19.46182 3.88655,-55.55502 1.60039,-18.74732 1.37174,0.0286 m 99.02935,229.66274 -0.56581,-7.11308 -2.74824,-7.19392 -0.56582,-7.03225 1.53578,-8.24471 3.31406,-6.87059 3.4757,-5.41565 3.1524,-3.55655 0.64664,0.2425 -4.769,6.6281 -4.36484,6.54728 -2.02077,6.62809 -0.32332,5.17316 0.88913,6.14312 2.58658,7.19392 0.48498,5.17314 0.16166,1.45496 -0.88913,0.24248 z",
						"NM" : "m 288.15255,424.01315 -0.77541,-4.7481 8.64378,0.5254 30.17176,2.9459 27.26816,1.68989 2.21527,-18.70747 3.85736,-55.87597 1.73768,-19.38923 1.5717,0.12856 0.8254,-11.16339 -104.00445,-10.63595 -17.49735,120.43481 15.46067,1.98915 1.29328,-10.02295 29.23215,2.82935 z",
						"KS" : "m 507.88059,324.38028 -12.61826,0.20443 -46.08909,-0.45723 -44.55748,-2.05763 -24.62974,-1.25741 3.89379,-64.59497 22.08346,0.67517 40.28913,0.8414 44.30124,0.98758 5.09563,0 2.1844,2.1624 2.01766,-0.0214 1.6403,1.01247 -0.0625,3.00923 -1.82898,1.72537 -0.33225,2.23217 1.84308,3.40233 2.95236,3.19506 2.32735,1.61446 1.30077,11.24082 0.18913,36.08573 z",
						"NE" : "m 486.09787,240.70058 3.23061,7.01991 -0.12863,2.30252 3.45922,5.49388 2.71929,3.15234 -5.04948,0 -43.48256,-0.93868 -40.78686,-0.8903 -22.25222,-0.78387 1.07277,-21.32785 -32.31824,-2.92025 4.34383,-44.00986 15.54633,1.02881 20.11879,1.1431 17.83257,1.14312 23.77676,1.14311 10.74526,-0.45724 2.0576,2.28622 4.80108,2.9721 1.14311,0.91449 4.34383,-1.37174 3.88659,-0.45724 2.74347,-0.22863 1.82898,1.37174 4.05743,1.60036 2.97209,1.60036 0.45725,1.60036 0.91449,2.0576 1.82898,0 0.79798,0.0462 0.89423,4.68182 2.92026,8.46792 0.57253,3.75671 2.52349,3.77425 0.56959,5.11414 1.60724,4.24037 0.25234,6.47426 z",
						"SD" : "m 476.44687,204.02465 -0.0474,-0.58087 -2.89571,-4.84544 1.86023,-4.71211 1.49273,-5.88654 -2.78187,-2.07971 -0.38516,-2.74346 0.7924,-2.55435 3.18851,0.0152 -0.12308,-5.00614 -0.3333,-30.17425 -0.61773,-3.76758 -4.07232,-3.33093 -0.98263,-1.67696 -0.0625,-1.60882 2.02212,-1.5294 1.53222,-1.66567 0.24496,-2.65679 -58.25709,-1.60035 -54.79921,-3.44909 -5.32527,63.69119 14.59027,0.9038 19.94985,1.20561 17.74305,0.92859 23.77676,1.30358 11.9827,-0.42464 1.9663,2.24518 5.19464,3.25335 0.76389,0.72275 4.54144,-1.45281 6.54054,-0.61491 1.6753,1.33627 4.20451,1.59613 2.94506,1.63583 0.39898,1.48381 1.03949,2.24088 2.23737,-0.20136 z",
						"ND" : "m 475.30528,128.91846 -0.61491,-8.43367 -1.67695,-6.81592 -1.89149,-13.02422 -0.45724,-10.987026 -1.73946,-3.077142 -1.75661,-5.194396 0.0312,-10.44427 0.62336,-3.824087 -1.8341,-5.467761 -28.64225,-0.564027 -18.59095,-0.646642 -26.51232,-1.293284 -22.94634,-2.133869 -6.99324,67.176834 54.93224,3.34365 58.06901,1.38583 z",
						"WY" : "m 360.37668,143.27587 -106.7426,-13.45706 -14.08348,88.45803 113.26461,13.58549 7.56147,-88.58646 z",
						"MT" : "M 369.20952,56.969133 338.5352,54.1613 l -29.26055,-3.55653 -29.26054,-4.041512 -32.3321,-5.334795 -18.42929,-3.39487 -32.72365,-6.932736 -4.47902,21.347532 3.42934,7.544541 -1.37174,4.572452 1.82898,4.572451 3.20073,1.371739 4.62082,10.769453 2.6951,3.176523 0.45724,1.143118 3.42934,1.143118 0.45725,2.057593 -7.0873,17.603953 0,2.51485 2.51485,3.20071 0.91448,0 4.80107,-2.97209 0.68588,-1.14312 1.60036,0.68587 -0.22863,5.25832 2.74348,12.57425 2.97209,2.51484 0.91448,0.68587 1.82899,2.28622 -0.45725,3.42935 0.68587,3.42933 1.14312,0.9145 2.28622,-2.28623 2.74347,0 3.20072,1.60036 2.51485,-0.91449 4.11521,0 3.65795,1.60036 2.74348,-0.45725 0.45724,-2.9721 2.97209,-0.68586 1.37174,1.37174 0.45725,3.20071 1.42587,0.83464 1.88695,-11.03474 106.74567,13.42892 8.80221,-86.299157 z",
						"CO" : "m 380.03242,320.96457 4.90324,-86.32496 -113.38856,-12.64396 -12.21382,87.93916 120.69914,11.02976 z",
						"ID" : "m 148.47881,176.48395 8.77087,-35.22072 1.37174,-4.22952 2.51484,-5.94418 -1.25742,-2.28623 -2.51486,0.11431 -0.80017,-1.0288 0.45725,-1.14311 0.34292,-3.08641 4.45815,-5.48695 1.82898,-0.45724 1.14311,-1.14311 0.57156,-3.20072 0.91448,-0.68586 3.88659,-5.82988 3.88659,-4.34383 0.22862,-3.772268 -3.42934,-2.629163 -1.53555,-4.400983 13.62491,-63.341691 13.51759,2.528111 -4.40808,21.383013 3.56035,7.485352 -1.58111,4.66084 1.96985,4.641233 3.13822,1.255191 3.83534,9.556588 3.51269,4.437154 0.50725,1.143118 3.34095,1.143118 0.36885,2.097075 -6.97101,17.376092 -0.16518,2.56593 2.63112,3.3217 0.90508,-0.0489 4.91129,-3.0256 0.67742,-1.09497 1.56231,0.65886 -0.27844,5.35372 2.73925,12.58271 3.91783,3.17791 1.68118,2.16545 -0.71661,4.08386 1.06622,2.80741 1.06163,1.09128 2.47929,-2.35142 2.84816,0.0489 2.91925,1.3352 2.78002,-0.68193 3.79426,-0.16048 3.9789,1.60036 2.74348,-0.29676 0.49674,-3.03731 2.93259,-0.76483 1.26017,1.51591 0.44093,2.94496 1.42434,1.21321 -8.386,53.60866 c 0,0 -87.96599,-16.70061 -94.95939,-18.20435 z",
						"UT" : "m 259.49836,310.10509 -83.74903,-11.87225 20.58761,-112.54135 46.78031,8.74514 -1.4848,10.63042 -2.31162,13.17266 7.80769,0.92837 16.40652,1.80479 8.21097,0.85564 -12.24765,88.27658 z",
						"AZ" : "m 144.9112,382.62909 -2.62701,2.15833 -0.32332,1.45495 0.48498,0.96996 18.91427,10.66959 12.12454,7.59804 14.7111,8.56801 16.81269,10.02295 12.2862,2.42491 24.95116,2.70491 17.25561,-119.12707 -83.73563,-11.91725 -3.09239,16.41246 -1.60629,0.0153 -1.71467,2.62916 -2.51485,-0.11432 -1.25742,-2.74347 -2.74347,-0.34293 -0.9145,-1.14311 -0.91448,0 -0.9145,0.57156 -1.94329,1.0288 -0.1143,6.97298 -0.22864,1.71467 -0.57154,12.57424 -1.48605,2.17191 -0.57156,3.31503 2.74347,4.91539 1.25742,5.82988 0.80019,1.0288 1.0288,0.57156 -0.11432,2.28622 -1.60035,1.37173 -3.42934,1.71467 -1.94329,1.9433 -1.48605,3.65795 -0.57156,4.91539 -2.85778,2.74347 -2.0576,0.68587 0.13569,0.82988 -0.45725,1.71467 0.45725,0.80018 3.65796,0.57154 -0.57156,2.74348 -1.48605,2.17191 -3.77227,0.91449 z",
						"NV" : "m 196.39273,185.57552 -23.63891,128.82275 -1.83224,0.34915 -1.57276,2.40618 -2.37294,0.0107 -1.47195,-2.74347 -2.61847,-0.37842 -0.77092,-1.10763 -1.03783,-0.054 -2.77837,1.64429 -0.31026,6.78548 -0.36209,5.77717 -0.34857,8.59281 -1.4471,2.08916 -2.43892,-1.07403 -69.079886,-104.20119 18.989116,-67.58491 93.0921,20.66601 z",
						"OR" : "m 148.72184,175.53153 8.8497,-34.80151 1.05079,-4.22952 2.35437,-5.62323 -0.61551,-1.16288 -2.51486,-0.0462 -1.2816,-1.6707 0.45724,-1.46407 0.50341,-3.24688 4.45815,-5.48695 1.82898,-1.09915 1.14311,-1.14311 1.48604,-3.56563 4.04706,-5.6694 3.56563,-3.8624 0.22862,-3.451314 -3.26886,-2.468682 -1.78341,-4.642625 -12.66377,-3.61197 -15.08909,-3.54365 -15.43202,0.114306 -0.45724,-1.371729 -5.48695,2.057604 -4.45814,-0.571559 -2.40054,-1.600361 -1.25742,0.685875 -4.68676,-0.228632 -1.71467,-1.371729 -5.25832,-2.057604 -0.800182,0.114316 -4.34383,-1.486056 -1.943291,1.828983 -6.172812,-0.342927 -5.944183,-4.115209 0.685865,-0.80018 0.228621,-7.773173 -2.286225,-3.886577 -4.115208,-0.571559 -0.685865,-2.514847 -2.353932,-0.466565 -5.798525,2.058784 -2.263247,6.466418 -3.233209,10.022949 -3.23321,6.466419 -5.011474,14.064461 -6.466419,13.579473 -8.083023,12.60952 -1.939926,2.90989 -0.808302,8.568 0.386095,12.08023 112.578342,26.32133 z",
						"WA" : "m 102.07324,7.6117734 4.36483,1.4549443 9.69963,2.7482283 8.568,1.939925 20.0459,5.658117 22.95579,5.658116 15.22312,3.207173 -13.63236,63.585811 -12.445,-3.525318 -15.50801,-3.570679 -15.22929,0.03324 -0.45557,-1.344699 -5.59922,2.179293 -4.59543,-0.736744 -2.14697,-1.584054 -1.31321,0.657976 -4.73566,-0.140243 -1.69836,-1.349633 -5.26304,-2.112303 -0.734971,0.146918 -4.389122,-1.524448 -1.893298,1.817379 -6.265906,-0.298733 -5.925698,-4.125702 0.778957,-0.932763 0.121223,-7.677452 -2.281999,-3.839701 -4.115208,-0.60704 -0.67741,-2.510616 -2.275512,-0.456932 -3.554948,1.230576 -2.263247,-3.219247 0.323321,-2.909889 2.748228,-0.323321 1.616605,-4.041511 -2.586568,-1.131624 0.161661,-3.718191 4.364833,-0.646641 -2.748228,-2.748228 -1.454945,-7.113061 0.646642,-2.909888 0,-7.921363 -1.778265,-3.23321 2.263247,-9.376307 2.101586,0.484981 2.424907,2.909889 2.748228,2.586567 3.233209,1.939926 4.526493,2.101586 3.071551,0.646642 2.909889,1.454944 3.394873,0.969963 2.263246,-0.16166 0,-2.424908 1.293284,-1.131623 2.101582,-1.293284 0.32333,1.131624 0.32332,1.778265 -2.263251,0.484981 -0.323321,2.101586 1.778262,1.454945 1.13163,2.424907 0.64664,1.939925 1.45494,-0.16166 0.16166,-1.293284 -0.96996,-1.293284 -0.48498,-3.233209 0.8083,-1.778265 -0.64664,-1.454944 0,-2.263247 1.77827,-3.55653 -1.13163,-2.586568 -2.42491,-4.8498139 0.32333,-0.8083023 1.13162,-0.8083024 z m -9.456692,5.9789646 2.020764,-0.16166 0.484982,1.374119 1.535779,-1.616615 2.344082,0 0.808303,1.535779 -1.53578,1.69744 0.646652,0.808313 -0.727477,2.020761 -1.374119,0.404146 c 0,0 -0.889138,0.08084 -0.889138,-0.242485 0,-0.323321 1.454955,-2.586578 1.454955,-2.586578 l -1.69744,-0.565817 -0.323321,1.454954 -0.727478,0.646642 -1.535782,-2.263257 -0.484982,-2.505742 z",
						"CA" : "m 144.69443,382.19813 3.94008,-0.48862 1.48604,-2.01144 0.54454,-2.94109 -3.55152,-0.59012 -0.51417,-0.66822 0.4775,-2.03231 -0.15928,-0.58967 1.92257,-0.61959 3.04278,-2.83268 0.58156,-4.9951 1.3799,-3.40211 1.94329,-2.16626 3.51887,-1.58967 1.65439,-1.60483 0.0687,-2.10884 -0.99333,-0.58001 -1.02315,-1.07273 -1.15522,-5.84845 -2.6852,-4.83009 0.56581,-3.505 -2.41958,-1.02931 -69.061322,-104.1784 18.902112,-67.60149 -67.079863,-15.69796 -1.506896,4.73324 -0.161661,7.43638 -5.173135,11.80121 -3.071548,2.58657 -0.323321,1.13162 -1.778266,0.80831 -1.454944,4.20317 -0.808302,3.23321 2.748228,4.20317 1.616605,4.20317 1.131623,3.55653 -0.323321,6.46642 -1.778265,3.07155 -0.646642,5.81978 -0.969963,3.71819 1.778265,3.87985 2.748228,4.52649 2.263247,4.84982 1.293283,4.04151 -0.32332,3.23321 -0.323321,0.48498 0,2.10158 5.658116,6.30476 -0.484981,2.42491 -0.646642,2.26325 -0.646642,1.93992 0.16166,8.24469 2.101586,3.71819 1.939926,2.58656 2.748228,0.48499 0.969963,2.74822 -1.131623,3.55653 -2.101587,1.61661 -1.131623,0 -0.808302,3.87985 0.484981,2.90989 3.23321,4.36483 1.616604,5.3348 1.454944,4.68815 1.293284,3.07155 3.39487,5.81978 1.454944,2.58656 0.484982,2.90989 1.616604,0.96996 0,2.42491 -0.808302,1.93993 -1.778265,7.11306 -0.484982,1.93992 2.424908,2.74823 4.203172,0.48498 4.526493,1.77827 3.879851,2.10158 2.909889,0 2.909888,3.07155 2.586567,4.84982 1.131624,2.26324 3.879851,2.10159 4.849814,0.8083 1.454944,2.10159 0.646642,3.23321 -1.454944,0.64664 0.323321,0.96996 3.233211,0.8083 2.748228,0.16167 3.159889,-1.68685 3.879854,4.20317 0.808302,2.26325 2.586572,4.20317 0.32332,3.23321 0,9.37631 0.48498,1.77826 10.02295,1.45495 19.72257,2.74822 13.84504,1.3497 z m -88.135212,-43.71668 1.293288,1.53578 -0.16166,1.29329 -3.233221,-0.0808 -0.565814,-1.21246 -0.646644,-1.45495 3.314051,-0.0808 z m 1.939932,0 1.212458,-0.64664 3.556543,2.10159 3.07156,1.21245 -0.889136,0.64666 -4.526509,-0.2425 -1.61661,-1.61661 -0.808306,-1.45495 z m 20.692614,19.80348 1.778265,2.34408 0.808313,0.96997 1.535779,0.56581 0.565807,-1.45495 -0.969963,-1.77827 -2.667403,-2.02076 -1.050798,0.16166 0,1.21246 z m -1.454955,8.64886 1.778276,3.15239 1.212458,1.93994 -1.454954,0.24248 -1.293284,-1.21245 c 0,0 -0.727477,-1.45495 -0.727477,-1.85911 0,-0.40414 0,-2.18242 0,-2.18242 l 0.484981,-0.0808 z"
					}
				}
			}
		}
	);
})(jQuery);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/jquery.animate-number/jquery.animateNumber.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/** @preserve jQuery animateNumber plugin v0.0.13
 * (c) 2013, Alexandr Borisov.
 * https://github.com/aishek/jquery-animateNumber
 */

// ['...'] notation using to avoid names minification by Google Closure Compiler
(function($) {
  var reverse = function(value) {
    return value.split('').reverse().join('');
  };

  var defaults = {
    numberStep: function(now, tween) {
      var floored_number = Math.floor(now),
          target = $(tween.elem);

      target.text(floored_number);
    }
  };

  var handle = function( tween ) {
    var elem = tween.elem;
    if ( elem.nodeType && elem.parentNode ) {
      var handler = elem._animateNumberSetter;
      if (!handler) {
        handler = defaults.numberStep;
      }
      handler(tween.now, tween);
    }
  };

  if (!$.Tween || !$.Tween.propHooks) {
    $.fx.step.number = handle;
  } else {
    $.Tween.propHooks.number = {
      set: handle
    };
  }

  var extract_number_parts = function(separated_number, group_length) {
    var numbers = separated_number.split('').reverse(),
        number_parts = [],
        current_number_part,
        current_index,
        q;

    for(var i = 0, l = Math.ceil(separated_number.length / group_length); i < l; i++) {
      current_number_part = '';
      for(q = 0; q < group_length; q++) {
        current_index = i * group_length + q;
        if (current_index === separated_number.length) {
          break;
        }

        current_number_part = current_number_part + numbers[current_index];
      }
      number_parts.push(current_number_part);
    }

    return number_parts;
  };

  var remove_precending_zeros = function(number_parts) {
    var last_index = number_parts.length - 1,
        last = reverse(number_parts[last_index]);

    number_parts[last_index] = reverse(parseInt(last, 10).toString());
    return number_parts;
  };

  $.animateNumber = {
    numberStepFactories: {
      /**
       * Creates numberStep handler, which appends string to floored animated number on each step.
       *
       * @example
       * // will animate to 100 with "1 %", "2 %", "3 %", ...
       * $('#someid').animateNumber({
       *   number: 100,
       *   numberStep: $.animateNumber.numberStepFactories.append(' %')
       * });
       *
       * @params {String} suffix string to append to animated number
       * @returns {Function} numberStep-compatible function for use in animateNumber's parameters
       */
      append: function(suffix) {
        return function(now, tween) {
          var floored_number = Math.floor(now),
              target = $(tween.elem);

          target.prop('number', now).text(floored_number + suffix);
        };
      },

      /**
       * Creates numberStep handler, which format floored numbers by separating them to groups.
       *
       * @example
       * // will animate with 1 ... 217,980 ... 95,217,980 ... 7,095,217,980
       * $('#world-population').animateNumber({
       *    number: 7095217980,
       *    numberStep: $.animateNumber.numberStepFactories.separator(',')
       * });
       * @example
       * // will animate with 1% ... 217,980% ... 95,217,980% ... 7,095,217,980%
       * $('#salesIncrease').animateNumber({
       *   number: 7095217980,
       *   numberStep: $.animateNumber.numberStepFactories.separator(',', 3, '%')
       * });
       *
       * @params {String} [separator=' '] string to separate number groups
       * @params {String} [group_length=3] number group length
       * @params {String} [suffix=''] suffix to append to number
       * @returns {Function} numberStep-compatible function for use in animateNumber's parameters
       */
      separator: function(separator, group_length, suffix) {
        separator = separator || ' ';
        group_length = group_length || 3;
        suffix = suffix || '';

        return function(now, tween) {
          var floored_number = Math.floor(now),
              separated_number = floored_number.toString(),
              target = $(tween.elem);

          if (separated_number.length > group_length) {
            var number_parts = extract_number_parts(separated_number, group_length);

            separated_number = remove_precending_zeros(number_parts).join(separator);
            separated_number = reverse(separated_number);
          }

          target.prop('number', now).text(separated_number + suffix);
        };
      }
    }
  };

  $.fn.animateNumber = function() {
    var options = arguments[0],
        settings = $.extend({}, defaults, options),

        target = $(this),
        args = [settings];

    for(var i = 1, l = arguments.length; i < l; i++) {
      args.push(arguments[i]);
    }

    // needs of custom step function usage
    if (options.numberStep) {
      // assigns custom step functions
      var items = this.each(function(){
        this._animateNumberSetter = options.numberStep;
      });

      // cleanup of custom step functions after animation
      var generic_complete = settings.complete;
      settings.complete = function() {
        items.each(function(){
          delete this._animateNumberSetter;
        });

        if ( generic_complete ) {
          generic_complete.apply(this, arguments);
        }
      };
    }

    return target.animate.apply(target, args);
  };

}(jQuery));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/metrojs/release/MetroJs.Full/MetroJs.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*!
* Metro JS for jQuery
* http://drewgreenwell.com/ 
* For details and usage info see: http://drewgreenwell.com/projects/metrojs

Copyright (C) 2013, Drew Greenwell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function ($) {
    // the metrojs object contains helper methods and theme settings
    $.fn.metrojs = {
        capabilities: null,
        checkCapabilities: function(stgs, recheck){
            if($.fn.metrojs.capabilities == null || (typeof(recheck) != "undefined" && recheck == true))
                $.fn.metrojs.capabilities = new $.fn.metrojs.MetroModernizr(stgs);
            return  $.fn.metrojs.capabilities;
        }
    };
	var metrojs = $.fn.metrojs,
		console = window.console;	
	if (typeof console !== "object") {
		console = {};
		console.log = function() {};
		console.error=function() {};
	}
	var throwError = typeof ($.error) === "function" ? $.error : console.error;
var MAX_LOOP_COUNT = 99000;
// .liveTile
$.fn.liveTile = function (method) {
	if (pubMethods[method]) {
		var args = [];
		for (var i = 1; i <= arguments.length; i++) {
			args[i - 1] = arguments[i];
		}
		return pubMethods[method].apply(this, args);
	} else if (typeof method === 'object' || !method) {
		return pubMethods.init.apply(this, arguments);
	} else {
		$.error('Method ' + method + ' does not exist on jQuery.liveTile');
		return null;
	}
};


$.fn.liveTile.contentModules = {
	modules: [],
	/* the default module layout
    [
        defaultModules.imageSwap,
        defaultModules.htmlSwap
    ],*/
	addContentModule: function (moduleName, module) {
		if (!(this.modules instanceof Array))
			this.modules = [];
		this.modules.push(module);
	},
	hasContentModule: function (moduleName) {
		if (typeof (moduleName) === "undefined" || !(this.modules instanceof Array))
			return -1;
		for (var i = 0; i < this.modules.length; i++) {
			if (typeof (this.modules[i].moduleName) != "undefined" && this.modules[i].moduleName == moduleName)
				return i;
		}
		return -1;
	}
};

// default option values for .liveTile
$.fn.liveTile.defaults = {
	mode: 'slide',                          // 'fade', 'slide', 'flip', 'flip-list', carousel
	speed: 500,                             // how fast should animations be performed, in milliseconds
	initDelay: -1,                          // how long to wait before the initial animation
	delay: 5000,                            // how long to wait between animations 
	stops: "100%",                          // how much of the back tile should 'slide' reveal before starting a delay
	stack: false,                           // should tiles in slide mode appear stacked (e.g Me tile) 
	direction: 'vertical',                  // which direction should animations be performed(horizontal | vertical)
	animationDirection: 'forward',          // the direction that carousel mode uses to determine which way to slide in tiles
	tileSelector: '>div,>li,>p,>img,>a',    // the selector used by carousel mode and flip-list to choose tile containers
	tileFaceSelector: '>div,>li,>p,>img,>a',// the selector used to choose the front and back containers
	ignoreDataAttributes: false,            // should data attributes be ignored
	click: null,                            // function ($tile, tdata) { return true; }
	link: '',                               // a url to go to when clicked
	newWindow: false,                       // should the link be opened in a new window
	bounce: false,                          // should the tile shrink when tapped
	bounceDirections: 'all',                // which direction the tile will tile 'all', 'edges, 'corners'
	bounceFollowsMove: true,                // should a tile in bounce state tilt in the direction of the mouse as it moves
	pauseOnHover: false,                    // should tile animations be paused on hover in and restarted on hover out
	pauseOnHoverEvent: 'both',              // pause is called on mouseover, mouseout, or both
	playOnHover: false,                     // should "play" be called on hover
	playOnHoverEvent: 'both',               // play is called on mouseover, mouseout, or both
	onHoverDelay: 0,						// the amount of time to wait before the onHover event is fired
	onHoverOutDelay: 200,					// the amount of time in addition to the speed to wait before the onHoverOut event is fired
	repeatCount: -1,                        // number of times to repeat the animation        
	appendBack: true,                       // appends the .last tile if one doesnt exist (slide and flip only)        
	alwaysTrigger: false,                   // should every item in a flip list trigger every time a delay passes 
	flipListOnHover: false,                 // should items in flip-list flip and stop when hovered
	flipListOnHoverEvent: 'mouseout',       // which event should be used to trigger the flip-list faces
	noHAflipOpacity: '1',                   // the opacity level set for the backside of the flip animation on unaccelerated browsers
	haTransFunc: 'ease',                    // the tranisiton-timing function to use in hardware accelerated mode
	noHaTransFunc: 'linear',                // the tranisiton-timing function to use in non hardware accelerated mode
	currentIndex: 0,                        // what is the current stop index for slide mode or slide index for carousel mode
	startNow: true,                         // should the tile immediately start or wait util play or restart has been called
	useModernizr: (typeof (window.Modernizr) !== "undefined"), // checks to see if modernizer is already in use
	useHardwareAccel: true,                 // should css animations, transitions and transforms be used when available
	useTranslate: true,
	faces: {
		$front: null,                        // the jQuery element to use as the front face of the tile; this will bypass tileCssSelector
		$back: null                          // the jQuery element to use as the back face of the tile; this will bypass tileCssSelector
	},
	animationStarting: function (tileData, $front, $back) {
		// returning false will cancel the animation
	},
	animationComplete: function (tileData, $front, $back) {
	},
	triggerDelay: function (idx) {          // used by flip-list to decide how random the tile flipping should be
		return Math.random() * 3000;
	},
	swap: '',                               // which swap modules are active for this tile (image, html)
	swapFront: '-',                         // override the available swap modules for the front face
	swapBack: '-',                          // override the available swap modules for the back face
	contentModules: [],
	rebindMessage: "tile data is missing. Are you missing a call to rebind or destroy? You may also be able to avoid this error by calling stop or pause"
};
// public methods that can be called via .liveTile(method name)
var pubMethods = {
	init: function (options) {
		// Setup the public options for the livetile
		var settings = $.extend({}, $.fn.liveTile.defaults, options);
		// checks for browser feature support to enable hardware acceleration                        
		metrojs.checkCapabilities(settings);
		helperMethods.getBrowserPrefix();
		// setup the default content modules
		if ($.fn.liveTile.contentModules.hasContentModule("image") == -1)
			$.fn.liveTile.contentModules.addContentModule("image", defaultModules.imageSwap);
		if ($.fn.liveTile.contentModules.hasContentModule("html") == -1)
			$.fn.liveTile.contentModules.addContentModule("html", defaultModules.htmlSwap);
		// this is where the magic happens
		return $(this).each(function (tileIndex, ele) {
			var $this = $(ele),
            data = privMethods.initTileData($this, settings);
			// append back tiles and add appropriate classes to prepare tiles
			data.faces = privMethods.prepTile($this, data);
			// action methods
			data.fade = function (count) { privMethods.fade($this, count); };
			data.slide = function (count) { privMethods.slide($this, count); };
			data.carousel = function (count) { privMethods.carousel($this, count); };
			data.flip = function (count) { privMethods.flip($this, count); };
			data.flipList = function (count) { privMethods.flipList($this, count); };
			var actions = {
				fade: data.fade,
				slide: data.slide,
				carousel: data.carousel,
				flip: data.flip,
				'flip-list': data.flipList
			};
			data.doAction = function (count) {
				// get the action for the current mode
				var action = actions[data.mode];
				if (typeof (action) === "function") {
					action(count);
					data.hasRun = true;
				}
				// prevent pauseOnHover from resuming a tile that has finished
				if (count == data.timer.repeatCount)
					data.runEvents = false;
			};

			// create a new tile timer
			data.timer = new $.fn.metrojs.TileTimer(data.delay, data.doAction, data.repeatCount);
			// apply the data
			$this.data("LiveTile", data);
			// handle events
			// only bind pause / play on hover if we are not using a fliplist or flipListOnHover isn't set set
			if (data.mode !== "flip-list" || data.flipListOnHover == false) {
				if (data.pauseOnHover) {
					privMethods.bindPauseOnHover($this);
				} else if (data.playOnHover) {
					privMethods.bindPlayOnHover($this, data);
				}
			}
			// add a click / link to the tile
			if (data.link.length > 0 || typeof (data.click) === "function") {
				$this.css({ cursor: 'pointer' }).bind("click.liveTile", function (e) {
					var proceed = true;
					if (typeof (data.click) === "function") {
						proceed = data.click($this, data) || false;
					}
					if (proceed && data.link.length > 0) {
						e.preventDefault();
						if (data.newWindow)
							window.open(data.link);
						else
							window.location = data.link;
					}
				});
			}
			// add bounce if set            
			privMethods.bindBounce($this, data);
			// start timer
			if (data.startNow && data.mode != "none") {
				data.runEvents = true;
				data.timer.start(data.initDelay);
			}
		});
	},
	// goto is a future reserved word
	'goto': function (options) {
		var opts, t = typeof (options);
		if (t === "undefined") {
			opts = {
				index: -99, //  same as next
				delay: 0,
				autoAniDirection: false
			};
		}
		if (t === "number" || !isNaN(options)) {
			opts = {
				index: parseInt(options, 10),
				delay: 0
			};
		} else if (t === "string") {
			if (options == "next") {
				opts = {
					index: -99,
					delay: 0
				};
			} else if (options.indexOf("prev") === 0) {
				opts = {
					index: -100,
					delay: 0
				};
			} else {
				$.error(options + " is not a recognized action for .liveTile(\"goto\")");
				return $(this);
			}
		} else if (t === "object") {
			if (typeof (options.delay) === "undefined") {
				options.delay = 0;
			}
			var ti = typeof (options.index);
			if (ti === "undefined") {
				options.index = 0;
			} else if (ti === "string") {
				if (options.index === "next")
					options.index = -99;
				else if (options.index.indexOf("prev") === 0)
					options.index = -100;
			}
			opts = options;
		}
		return $(this).each(function (tileIndex, ele) {
			var $tile = $(ele),
                data = $tile.data("LiveTile"),
                aniData = $tile.data("metrojs.tile"),
                goTo = opts.index;
			if (aniData.animating === true)
				return $(this);
			if (data.mode === "carousel") {
				// get the index based off of the active carousel slide
				var $cur = data.faces.$listTiles.filter(".active");
				var curIdx = data.faces.$listTiles.index($cur);
				// carousel will look for these values as triggers
				if (goTo === -100) { // prev
					// autoAniDirection determines if a forward or backward animation should be used based on the goTo index
					if (typeof (opts.autoAniDirection) === "undefined" || opts.autoAniDirection == true)
						data.tempValues.animationDirection = typeof (opts.animationDirection) === "undefined" ? "backward" : opts.animationDirection;
					goTo = curIdx === 0 ? data.faces.$listTiles.length - 1 : curIdx - 1;
				} else if (goTo === -99) { // next
					if (typeof (opts.autoAniDirection) === "undefined" || opts.autoAniDirection == true)
						data.tempValues.animationDirection = typeof (opts.animationDirection) === "undefined" ? "forward" : opts.animationDirection;
					goTo = curIdx + 1;
				}
				if (curIdx == goTo) {
					return;
				}
				if (typeof (opts.direction) !== "undefined") {
					data.tempValues.direction = opts.direction;
				}
				if (typeof (opts.animationDirection) !== "undefined") {
					data.tempValues.animationDirection = opts.animationDirection;
				}
				// the index is offset by 1 and incremented on animate
				if (goTo == 0)
					data.currentIndex = data.faces.$listTiles.length;
				else
					data.currentIndex = goTo - 1;
			} else // slide mode will use the index directly
				data.currentIndex = goTo;
			// start the timer
			data.runEvents = true;
			data.timer.start(opts.delay >= 0 ? opts.delay : data.delay);
		});
	},
	play: function (options) {
		var opts, t = typeof (options);
		if (t === "undefined") {
			opts = {
				delay: -1
			};
		} else if (t === "number") {
			opts = {
				delay: options
			};
		} else if (t === "object") {
			if (typeof (options.delay) === "undefined") {
				options.delay = -1;
			}
			opts = options;
		}
		return $(this).each(function (tileIndex, ele) {
			var $tile = $(ele),
                data = $tile.data("LiveTile");
			data.runEvents = true;
			if (opts.delay < 0 && !data.hasRun)
				opts.delay = data.initDelay;
			data.timer.start(opts.delay >= 0 ? opts.delay : data.delay);
		});
	},
	animate: function () { // this is really only useful for certain edge cases in slide mode, use 'play' to toggle animations
		return $(this).each(function (tileIndex, ele) {
			var $tile = $(ele),
                data = $tile.data("LiveTile");
			data.doAction();
		});
	},
	stop: function () {
		return $(this).each(function (tileIndex, ele) {
			var $tile = $(ele),
                data = $tile.data("LiveTile");
			data.hasRun = false;
			data.runEvents = false;
			data.timer.stop();
			window.clearTimeout(data.eventTimeout);
			window.clearTimeout(data.flCompleteTimeout);
			window.clearTimeout(data.completeTimeout);
			if (data.mode === "flip-list") {
				data.faces.$listTiles.each(function (idx, li) {
					var ldata = $(li).data("metrojs.tile");
					window.clearTimeout(ldata.eventTimeout);
					window.clearTimeout(ldata.flCompleteTimeout);
					window.clearTimeout(ldata.completeTimeout);
				});
			}
		});
	},
	pause: function () {
		return $(this).each(function (tileIndex, ele) {
			var $tile = $(ele),
                data = $tile.data("LiveTile");
			data.timer.pause();
			data.runEvents = false;
			window.clearTimeout(data.eventTimeout);
			window.clearTimeout(data.flCompleteTimeout);
			window.clearTimeout(data.completeTimeout);
			if (data.mode === "flip-list") {
				data.faces.$listTiles.each(function (idx, li) {
					var ldata = $(li).data("metrojs.tile");
					window.clearTimeout(ldata.eventTimeout);
					window.clearTimeout(ldata.flCompleteTimeout);
					window.clearTimeout(ldata.completeTimeout);
				});
			}
		});
	},
	restart: function (options) {
		var opts, t = typeof (options);
		if (t === "undefined") {
			opts = {
				delay: -1
			};
		} else if (t === "number") {
			opts = {
				delay: options
			};
		} else if (t === "object") {
			if (typeof (options.delay) === "undefined") {
				options.delay = -1;
			}
			opts = options;
		}
		return $(this).each(function (tileIndex, ele) {
			var $tile = $(ele),
                data = $tile.data("LiveTile");
			if (opts.delay < 0 && !data.hasRun)
				opts.delay = data.initDelay;
			data.hasRun = false;
			data.runEvents = true;
			data.timer.restart(opts.delay >= 0 ? opts.delay : data.delay);
		});
	},
	rebind: function (options) {
		return $(this).each(function (tileIndex, ele) {
			if (typeof (options) !== "undefined") {
				if (typeof (options.timer) !== "undefined" && options.timer != null) {
					options.timer.stop();
				}
				options.hasRun = false;
				pubMethods["init"].apply(ele, [options]);
			} else {
				pubMethods["init"].apply(ele, [{}]);
			}
		});
	},
	destroy: function (options) {
		var t = typeof (options), opts;
		if (t === "undefined") {
			opts = {
				removeCss: false
			};
		} else if (t === "boolean") {
			opts = {
				removeCss: options
			};
		} else if (t === "object") {
			if (typeof (options.removeCss) === "undefined") {
				options.removeCss = false;
			}
			opts = options;
		}
		return $(this).each(function (tileIndex, ele) {
			var $tile = $(ele);
			var data = $tile.data("LiveTile");
			if (typeof (data) === "undefined")
				return;
			$tile.unbind(".liveTile");
			var resetCss = helperMethods.appendStyleProperties({ margin: '', cursor: '' }, ['transform', 'transition'], ['', '']);
			data.timer.stop();
			window.clearTimeout(data.eventTimeout);
			window.clearTimeout(data.flCompleteTimeout);
			window.clearTimeout(data.completeTimeout);
			if (data.faces.$listTiles != null) {
				data.faces.$listTiles.each(function (idx, li) {
					var $li = $(li);
					if (data.mode === "flip-list") {
						var ldata = $li.data("metrojs.tile");
						window.clearTimeout(ldata.eventTimeout);
						window.clearTimeout(ldata.flCompleteTimeout);
						window.clearTimeout(ldata.completeTimeout);
					} else if (data.mode === "carousel") {
						var sdata = data.listData[idx];
						if (sdata.bounce) {
							privMethods.unbindMsBounce($li, sdata);
						}
					}
					if (opts.removeCss) {
						$li.removeClass("ha");
						$li.find(data.tileFaceSelector)
                            .unbind(".liveTile")
                            .removeClass("bounce flip-front flip-back ha slide slide-front slide-back")
                            .css(resetCss);
					} else {
						$li.find(data.tileFaceSelector).unbind(".liveTile");
					}
					$li.removeData("metrojs.tile");
				}).unbind(".liveTile");
			}
			if (data.faces.$front != null && opts.removeCss) {
				data.faces.$front.removeClass("flip-front flip-back ha slide slide-front slide-back")
                    .css(resetCss);
			}
			if (data.faces.$back != null && opts.removeCss) {
				data.faces.$back.removeClass("flip-front flip-back ha slide slide-front slide-back")
                    .css(resetCss);
			}
			// remove the bounce and hover methods
			// todo: combine all mouse/touch events (down, move, up)
			if (data.bounce) {
				privMethods.unbindMsBounce($tile, data);
			}
			if (data.playOnHover) {
				privMethods.unbindMsPlayOnHover($tile, data);
			}
			if (data.pauseOnhover) {
				privMethods.unbindMsPauseOnHover($tile, data);
			}
			$tile.removeClass("ha");
			$tile.removeData("LiveTile");
			$tile.removeData("metrojs.tile");
			data = null;
		});
	}
};

// private methods that are called by .liveTile
var privMethods = {
	//getDataOrDefault for older versions of jQuery that dont look for 'data-' properties
	dataAtr: function ($ele, name, def) {
		return typeof ($ele.attr('data-' + name)) !== "undefined" ? $ele.attr('data-' + name) : def;
	},
	dataMethod: function ($ele, name, def) {
		return typeof ($ele.data(name)) !== "undefined" ? $ele.data(name) : def;
	},
	getDataOrDefault: null,
	initTileData: function ($tile, stgs) {
		var useData = stgs.ignoreDataAttributes == false,
            tdata = null;
		if (this.getDataOrDefault == null)
			this.getDataOrDefault = metrojs.capabilities.isOldJQuery ? this.dataAtr : this.dataMethod;
		if (useData) {
			tdata = { //an object to store settings for later access                
				speed: this.getDataOrDefault($tile, "speed", stgs.speed),
				delay: this.getDataOrDefault($tile, "delay", stgs.delay),
				stops: this.getDataOrDefault($tile, "stops", stgs.stops),
				stack: this.getDataOrDefault($tile, "stack", stgs.stack),
				mode: this.getDataOrDefault($tile, "mode", stgs.mode),
				direction: this.getDataOrDefault($tile, "direction", stgs.direction),
				useHardwareAccel: this.getDataOrDefault($tile, "ha", stgs.useHardwareAccel),
				repeatCount: this.getDataOrDefault($tile, "repeat", stgs.repeatCount),
				swap: this.getDataOrDefault($tile, "swap", stgs.swap),
				appendBack: this.getDataOrDefault($tile, "appendback", stgs.appendBack),
				currentIndex: this.getDataOrDefault($tile, "start-index", stgs.currentIndex),
				animationDirection: this.getDataOrDefault($tile, "ani-direction", stgs.animationDirection),
				startNow: this.getDataOrDefault($tile, "start-now", stgs.startNow),
				tileSelector: this.getDataOrDefault($tile, "tile-selector", stgs.tileSelector),
				tileFaceSelector: this.getDataOrDefault($tile, "face-selector", stgs.tileFaceSelector),
				bounce: this.getDataOrDefault($tile, "bounce", stgs.bounce),
				bounceDirections: this.getDataOrDefault($tile, "bounce-dir", stgs.bounceDirections),
				bounceFollowsMove: this.getDataOrDefault($tile, "bounce-follows", stgs.bounceFollowsMove),
				click: this.getDataOrDefault($tile, "click", stgs.click),
				link: this.getDataOrDefault($tile, "link", stgs.link),
				newWindow: this.getDataOrDefault($tile, "new-window", stgs.newWindow),
				alwaysTrigger: this.getDataOrDefault($tile, "always-trigger", stgs.alwaysTrigger),
				flipListOnHover: this.getDataOrDefault($tile, "flip-onhover", stgs.flipListOnHover),
				pauseOnHover: this.getDataOrDefault($tile, "pause-onhover", stgs.pauseOnHover),
				playOnHover: this.getDataOrDefault($tile, "play-onhover", stgs.playOnHover),
				onHoverDelay: this.getDataOrDefault($tile, "hover-delay", stgs.onHoverDelay),
				onHoverOutDelay: this.getDataOrDefault($tile, "hoverout-delay", stgs.onHoverOutDelay),
				noHAflipOpacity: this.getDataOrDefault($tile, "flip-opacity", stgs.noHAflipOpacity),
				useTranslate: this.getDataOrDefault($tile, "use-translate", stgs.useTranslate),
				runEvents: false,
				isReversed: false,
				loopCount: 0,
				contentModules: [],
				listData: [],
				height: $tile.height(),
				width: $tile.width(),
				tempValues: {}
			};
		} else {
			tdata = $.extend(true, {
				runEvents: false,
				isReversed: false,
				loopCount: 0,
				contentModules: [],
				listData: [],
				height: $tile.height(),
				width: $tile.width(),
				tempValues: {}
			}, stgs);
		}
		tdata.useTranslate = tdata.useTranslate && tdata.useHardwareAccel && metrojs.capabilities.canTransform && metrojs.capabilities.canTransition;
		// set the margin to half of the height or width based on the direction
		tdata.margin = (tdata.direction === "vertical") ? tdata.height / 2 : tdata.width / 2;
		// convert stops if needed
		tdata.stops = (typeof (stgs.stops) === "object" && (stgs.stops instanceof Array)) ? stgs.stops : ("" + tdata.stops).split(",");
		// add a return stop
		if (tdata.stops.length === 1)
			tdata.stops.push("0px");
		// add content modules, start with global swaps            
		var swaps = tdata.swap instanceof Array ? tdata.swap : tdata.swap.replace(' ', '').split(",");
		// get the front and back swap data
		var sf = useData ? this.getDataOrDefault($tile, "swap-front", stgs.swapFront) : stgs.swapFront;
		var sb = useData ? this.getDataOrDefault($tile, "swap-back", stgs.swapBack) : stgs.swapBack;
		// set the data to the global value if its still the default
		if (sf instanceof Array) {
			tdata.swapFront = sf;
		} else {
			tdata.swapFront = sf === '-' ? swaps : sf.replace(' ', '').split(",");
		}

		if (sb instanceof Array) {
			tdata.swapBack = sb;
		} else {
			tdata.swapBack = sb === '-' ? swaps : sb.replace(' ', '').split(",");
		}
		// make sure the swaps includes all front and back swaps
		var i;
		for (i = 0; i < tdata.swapFront.length; i++) {
			if (tdata.swapFront[i].length > 0 && $.inArray(tdata.swapFront[i], swaps) === -1)
				swaps.push(tdata.swapFront[i]);
		}
		for (i = 0; i < tdata.swapBack.length; i++) {
			if (tdata.swapBack[i].length > 0 && $.inArray(tdata.swapBack[i], swaps) === -1)
				swaps.push(tdata.swapBack[i]);
		}
		tdata.swap = swaps;
		// add all required content modules for the swaps
		for (i = 0; i < swaps.length; i++) {
			if (swaps[i].length > 0) {
				var moduleIdx = $.fn.liveTile.contentModules.hasContentModule(swaps[i]);
				if (moduleIdx > -1) {
					tdata.contentModules.push($.fn.liveTile.contentModules.modules[moduleIdx]);
				}
			}
		}
		// set the initDelay value to the delay if it's not set
		tdata.initDelay = useData ? this.getDataOrDefault($tile, "initdelay", stgs.initDelay) : stgs.initDelay;
		// if the delay is -1 call the triggerDelay function to get a value
		if (tdata.delay < -1)
			tdata.delay = stgs.triggerDelay(1);
		else if (tdata.delay < 0)
			tdata.delay = 3500 + (Math.random() * 4501);
		// match the delay value if less than 0
		if (tdata.initDelay < 0)
			tdata.initDelay = tdata.delay;
		// merge the objects
		var mergedData = {};
		for (i = 0; i < tdata.contentModules.length; i++)
			$.extend(mergedData, tdata.contentModules[i].data);
		$.extend(mergedData, stgs, tdata);
		// add flip-list / carousel data
		var $tiles;
		if (mergedData.mode === "flip-list") {
			$tiles = $tile.find(mergedData.tileSelector).not(".tile-title");
			$tiles.each(function (idx, ele) {
				var $li = $(ele);
				var ldata = {
					direction: useData ? privMethods.getDataOrDefault($li, "direction", mergedData.direction) : mergedData.direction,
					newWindow: useData ? privMethods.getDataOrDefault($li, "new-window", false) : false,
					link: useData ? privMethods.getDataOrDefault($li, "link", "") : "",
					faces: { $front: null, $back: null },
					height: $li.height(),
					width: $li.width(),
					isReversed: false
				};
				ldata.margin = ldata.direction === "vertical" ? ldata.height / 2 : ldata.width / 2;
				mergedData.listData.push(ldata);
			});
		} else if (mergedData.mode === "carousel") {
			mergedData.stack = true;
			$tiles = $tile.find(mergedData.tileSelector).not(".tile-title");
			$tiles.each(function (idx, ele) {
				var $slide = $(ele);
				var sdata = {
					bounce: useData ? privMethods.getDataOrDefault($slide, "bounce", false) : false,
					bounceDirections: useData ? privMethods.getDataOrDefault($slide, "bounce-dir", "all") : "all",
					link: useData ? privMethods.getDataOrDefault($slide, "link", "") : "",
					newWindow: useData ? privMethods.getDataOrDefault($slide, "new-window", false) : false,
					animationDirection: useData ? privMethods.getDataOrDefault($slide, "ani-direction", "") : "",
					direction: useData ? privMethods.getDataOrDefault($slide, "direction", "") : ""
				};
				mergedData.listData.push(sdata);
			});
		}
		// get any additional options from the modules
		for (i = 0; i < tdata.contentModules.length; i++) {
			if (typeof (mergedData.contentModules[i].initData) === "function")
				mergedData.contentModules[i].initData(mergedData, $tile);
		}
		tdata = null;
		return mergedData;
	},
	prepTile: function ($tile, tdata) {
		//add the mode to the tile if it's not already there.
		$tile.addClass(tdata.mode);
		var ret = {
			$tileFaces: null,     // all possible tile faces in a liveTile in a non list mode
			$listTiles: null,     // all possible tiles in a liveTile in a list mode
			$front: null,         // the front face of a tile in a non list mode
			$back: null          // the back face of a tile in a non list mode
		};
		var rotateDir, frontCss, backCss, tileCss;
		// prepare the tile based on the current mode
		switch (tdata.mode) {
			case "fade":
				// front and back tile faces
				ret.$tileFaces = $tile.find(tdata.tileFaceSelector).not(".tile-title");
				ret.$front = (tdata.faces.$front != null && tdata.faces.$front.length > 0) ?
                               tdata.faces.$front.addClass('fade-front') :
                               ret.$tileFaces.filter(":first").addClass('fade-front');
				// get back face from settings, via selector, or append it if necessary
				if (tdata.faces.$back != null && tdata.faces.$back.length > 0)    // use $back option
					ret.$back = tdata.faces.$back.addClass('fade-back');
				else if (ret.$tileFaces.length > 1)                             // get the last tile face
					ret.$back = ret.$tileFaces.filter(":last").addClass('fade-back');
				else if (tdata.appendBack)                                       // append the back tile
					ret.$back = $('<div class="fade-back"></div>').appendTo($tile);
				else                                                            // just keep an empty placeholder
					ret.$back = $('<div></div>');
				break;
			case "slide":
				// front and back tile faces
				ret.$tileFaces = $tile.find(tdata.tileFaceSelector).not(".tile-title");
				// get front face from settings or via selector
				ret.$front = (tdata.faces.$front != null && tdata.faces.$front.length > 0) ?
                                tdata.faces.$front.addClass('slide-front') :
                                ret.$tileFaces.filter(":first").addClass('slide-front'); // using :first for pre jQuery 1.4
				// get back face from settings, via selector, or append it if necessary
				if (tdata.faces.$back != null && tdata.faces.$back.length > 0)    // use $back option
					ret.$back = tdata.faces.$back.addClass('slide-back');
				else if (ret.$tileFaces.length > 1)                             // get the last tile face
					ret.$back = ret.$tileFaces.filter(":last").addClass('slide-back');
				else if (tdata.appendBack)                                       // append the back tile
					ret.$back = $('<div class="slide-back"></div>').appendTo($tile);
				else                                                            // just keep an empty placeholder
					ret.$back = $('<div></div>');
				// stack mode
				if (tdata.stack == true) {
					var prop,
                        translate;
					if (tdata.direction === "vertical") {
						prop = "top",
                        translate = 'translate(0%, -100%) translateZ(0)';
					} else {
						prop = "left",
                        translate = 'translate(-100%, 0%) translateZ(0)';
					}
					backCss = {};
					if (tdata.useTranslate)
						helperMethods.appendStyleProperties(backCss, ['transform'], [translate]);
					else
						backCss[prop] = "-100%";
					ret.$back.css(backCss);
				}
				$tile.data("metrojs.tile", { animating: false });
				if (metrojs.capabilities.canTransition && tdata.useHardwareAccel) {   // hardware accelerated :)                        
					$tile.addClass("ha");
					ret.$front.addClass("ha");
					ret.$back.addClass("ha");
				}
				break;
			case "carousel":
				ret.$listTiles = $tile.find(tdata.tileSelector).not(".tile-title");
				var numberOfSlides = ret.$listTiles.length;
				$tile.data("metrojs.tile", { animating: false });
				tdata.currentIndex = Math.min(tdata.currentIndex, numberOfSlides - 1);
				ret.$listTiles.each(function (idx, ele) {
					var $slide = $(ele).addClass("slide");
					var sdata = tdata.listData[idx],
                        aniDir = typeof (sdata.animationDirection) === "string" && sdata.animationDirection.length > 0 ? sdata.animationDirection : tdata.animationDirection,
                        dir = typeof (sdata.direction) === "string" && sdata.direction.length > 0 ? sdata.direction : tdata.direction;
					if (idx == tdata.currentIndex) {
						$slide.addClass("active");
					} else if (aniDir === "forward") {
						if (dir === "vertical") {
							tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(0%, 100%) translateZ(0)']) :
                                                   { left: '0%', top: '100%' };
							$slide.css(tileCss);
						} else {
							tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(100%, 0%) translateZ(0)']) :
                                                   { left: '100%', top: '0%' };
							$slide.css(tileCss);
						}
					} else if (aniDir === "backward") {
						if (dir === "vertical") {
							tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(0%, -100%) translateZ(0)']) :
                                                   { left: '0%', top: '-100%' };
							$slide.css(tileCss);
						} else {
							tileCss = tdata.useTranslate ? helperMethods.appendStyleProperties({}, ['transform'], ['translate(-100%, 0%) translateZ(0)']) :
                                                   { left: '-100%', top: '0%' };
							$slide.css(tileCss);
						}
					}
					// link and bounce can be bound per slide
					// add the click handler and link property
					privMethods.bindLink($slide, sdata);
					// add the bounce effect
					if (tdata.useHardwareAccel && metrojs.capabilities.canTransition)
						privMethods.bindBounce($slide, sdata);
					$slide = null;
					sdata = null;
				});
				// hardware accelerated :)
				if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) {
					$tile.addClass("ha");
					ret.$listTiles.addClass("ha");
				}
				break;
			case "flip-list":
				// the tile containers inside the list
				ret.$listTiles = $tile.find(tdata.tileSelector).not(".tile-title");
				ret.$listTiles.each(function (idx, ele) {
					var $li = $(ele).addClass("tile-" + (idx + 1));
					// add the flip class to the front face
					var $lFront = $li.find(tdata.tileFaceSelector).filter(":first").addClass("flip-front").css({ margin: "0px" });
					// append a back tile face if one isnt present
					if ($li.find(tdata.tileFaceSelector).length === 1 && tdata.appendBack == true)
						$li.append("<div></div>");
					// add the flip class to the back face
					var $lBack = $li.find(tdata.tileFaceSelector).filter(":last").addClass("flip-back").css({ margin: "0px" });
					// update the tdata object with the faces
					tdata.listData[idx].faces.$front = $lFront;
					tdata.listData[idx].faces.$back = $lBack;
					// set data for overrides and easy access
					$li.data("metrojs.tile", {
						animating: false,
						count: 1,
						completeTimeout: null,
						flCompleteTimeout: null,
						index: idx
					});
					var ldata = $li.data("metrojs.tile");
					// add the hardware accelerated classes
					if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) {   // hardware accelerated :)
						$li.addClass("ha");
						$lFront.addClass("ha");
						$lBack.addClass("ha");
						rotateDir = tdata.listData[idx].direction === "vertical" ? "rotateX(180deg)" : "rotateY(180deg)";
						backCss = helperMethods.appendStyleProperties({}, ["transform"], [rotateDir]);
						$lBack.css(backCss);
					} else { // not hardware accelerated :(
						// the front tile face will take up the entire tile
						frontCss = (tdata.listData[idx].direction === "vertical") ?
				{ height: '100%', width: '100%', marginTop: '0px', opacity: '1' } :
				{ height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
						// the back tile face is hidden by default and expanded halfway through a flip
						backCss = (tdata.listData[idx].direction === "vertical") ?
				{ height: '0px', width: '100%', marginTop: tdata.listData[idx].margin + 'px', opacity: tdata.noHAflipOpacity } :
				{ height: '100%', width: '0px', marginLeft: tdata.listData[idx].margin + 'px', opacity: tdata.noHAflipOpacity };
						$lFront.css(frontCss);
						$lBack.css(backCss);
					}
					var flipEnded = function () {
						ldata.count++;
						if (ldata.count >= MAX_LOOP_COUNT)
							ldata.count = 1;
					};
					if (tdata.flipListOnHover) {
						var event = tdata.flipListOnHoverEvent + ".liveTile";
						$lFront.bind(event, function () {
							privMethods.flip($li, ldata.count, tdata, flipEnded);
						});
						$lBack.bind(event, function () {
							privMethods.flip($li, ldata.count, tdata, flipEnded);
						});
					}
					if (tdata.listData[idx].link.length > 0) {
						$li.css({ cursor: 'pointer' }).bind("click.liveTile", function () {
							if (tdata.listData[idx].newWindow)
								window.open(tdata.listData[idx].link);
							else
								window.location = tdata.listData[idx].link;
						});
					}
				});
				break;
			case "flip":
				// front and back tile faces
				ret.$tileFaces = $tile.find(tdata.tileFaceSelector).not(".tile-title");
				// get front face from settings or via selector
				ret.$front = (tdata.faces.$front != null && tdata.faces.$front.length > 0) ?
                                tdata.faces.$front.addClass('flip-front') :
                                ret.$tileFaces.filter(":first").addClass('flip-front');
				// get back face from settings, via selector, or append it if necessary
				if (tdata.faces.$back != null && tdata.faces.$back.length > 0) {
					// use $back option
					ret.$back = tdata.faces.$back.addClass('flip-back');
				} else if (ret.$tileFaces.length > 1) {
					// get the last tile face
					ret.$back = ret.$tileFaces.filter(":last").addClass('flip-back');
				} else if (tdata.appendBack) {
					// append the back tile
					ret.$back = $('<div class="flip-back"></div>').appendTo($tile);
				} else {
					// just keep an empty placeholder
					ret.$back = $('<div></div>');
				}
				$tile.data("metrojs.tile", { animating: false });
				if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) {
					// hardware accelerated :)
					$tile.addClass("ha");
					ret.$front.addClass("ha");
					ret.$back.addClass("ha");
					rotateDir = tdata.direction === "vertical" ? "rotateX(180deg)" : "rotateY(180deg)";
					backCss = helperMethods.appendStyleProperties({}, ["transform"], [rotateDir]);
					ret.$back.css(backCss);

				} else {
					// not hardware accelerated :(
					// the front tile face will take up the entire tile
					frontCss = (tdata.direction === "vertical") ?
			{ height: '100%', width: '100%', marginTop: '0px', opacity: '1' } :
			{ height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
					// the back tile face is hidden by default and expanded halfway through a flip
					backCss = (tdata.direction === "vertical") ?
			{ height: '0%', width: '100%', marginTop: tdata.margin + 'px', opacity: '0' } :
			{ height: '100%', width: '0%', marginLeft: tdata.margin + 'px', opacity: '0' };
					ret.$front.css(frontCss);
					ret.$back.css(backCss);
				}
				break;
		}
		return ret;
	},
	bindPauseOnHover: function ($tile) {
		// stop the tile when hovered and resume after a delay
		(function () {
			var data = $tile.data("LiveTile"),
                isOver = false,
                isPending = false,
				touchStartedOver = false,
				touchStartedOut = false,
                pauseIn = (data.pauseOnHoverEvent == "both" || data.pauseOnHoverEvent == "mouseover" || data.pauseOnHoverEvent == "mouseenter"),
                pauseOut = (data.pauseOnHoverEvent == "both" || data.pauseOnHoverEvent == "mouseout" || data.pauseOnHoverEvent == "mouseleave");
			data.pOnHoverMethods = {
				pause: function () {
					data.timer.pause();
					if (data.mode === "flip-list") {
						data.faces.$listTiles.each(function (idx, li) {
							window.clearTimeout($(li).data("metrojs.tile").completeTimeout);
						});
					}
				},
				over: function (e, isTouch) {
					isTouch = typeof (isTouch) == "undefined" ? false : isTouch;
					if (!isTouch && touchStartedOver) {
						return;
					}
					if (isOver || isPending)
						return;
					if (data.runEvents) {
						isPending = true;
						data.eventTimeout = window.setTimeout(function () {
							isPending = false;
							if (pauseOut)
								isOver = true;
							touchStartedOver = false;
							data.pOnHoverMethods.pause();
						}, data.onHoverDelay);
					}
				},
				out: function (e, isTouch) {
					isTouch = typeof (isTouch) == "undefined" ? false : isTouch;
					if (!isTouch && touchStartedOut == true) {
						return;
					}
					if (isPending) {
						window.clearTimeout(data.eventTimeout);
						isPending = false;
						return;
					}
					if (pauseIn) {
						if (!isOver && !isPending)
							return;
						if (data.runEvents) {
							// todo: use a custom value if provided
							data.timer.start(data.hasRun ? data.delay : data.initDelay);
						}
					} else {
						data.pOnHoverMethods.pause();
					}
					isOver = false;
					touchStartedOut = false;
				}
			};
			if (!metrojs.capabilities.canTouch) {
				if (pauseIn)
					$tile.bind("mouseover.liveTile", data.pOnHoverMethods.over);
				if (pauseOut)
					$tile.bind("mouseout.liveTile", data.pOnHoverMethods.out);
			} else {
				if (window.PointerEvent || window.MSPointerEvent) { // pointer
					var eventPrefix = window.MSPointerEvent ? "MS" : "";
					if (pauseIn) {
						$tile[0].addEventListener(eventPrefix + 'PointerOver', data.pOnHoverMethods.over, false);
					}
					if (pauseOut) {
						$tile[0].addEventListener(eventPrefix + 'PointerOut', data.pOnHoverMethods.out, false);
					}
				} else { // touch events
					if (pauseIn) {
						$tile.bind("mouseover.liveTile", data.pOnHoverMethods.over);
						$tile.bind("touchstart.liveTile", function (event) {
							touchStartedOver = false;
							data.pOnHoverMethods.over.apply($tile[0], [event, true]);
						});
					}
					if (pauseOut) {
						$tile.bind("mouseout.liveTile", data.pOnHoverMethods.out);
						$tile.bind("touchend.liveTile", function (event) {
							touchStartedOut = false;
							data.pOnHoverMethods.out.apply($tile[0], [event, true]);
						});
					}
				}
			}
		})();
	},
	unbindMsPauseOnHover: function ($tile, data) {
		if (typeof (data.pOnHoverMethods) !== "undefined" && (window.PointerEvent || window.MSPointerEvent)) {
			var eventPrefix = window.MSPointerEvent ? "MS" : "";
			$tile[0].removeEventListener(eventPrefix + 'PointerOver', data.pOnHoverMethods.over, false);
			$tile[0].removeEventListener(eventPrefix + 'PointerOut', data.pOnHoverMethods.out, false);
		}
	},
	bindPlayOnHover: function ($tile, data) {
		// play the tile immediately when hovered
		(function () {
			var isOver = false,
                isPending = false,
				touchStartedOver = false,
				touchStartedOut = false,
                playIn = (data.playOnHoverEvent == "both" || data.playOnHoverEvent == "mouseover" || data.playOnHoverEvent == "mouseenter"),
                playOut = (data.playOnHoverEvent == "both" || data.playOnHoverEvent == "mouseout" || data.playOnHoverEvent == "mouseleave");
			data.onHoverMethods = {
				over: function (event, isTouch) {
					isTouch = typeof (isTouch) == "undefined" ? false : isTouch;
					if (!isTouch && touchStartedOver) {
						return;
					}
					if (isOver || isPending || (data.bounce && data.bounceMethods.down != "no"))
						return;
					// if startNow is set use the opposite of isReversed so we're in sync            
					var rev = (data.mode == "flip") || (data.startNow ? !data.isReversed : data.isReversed);
					window.clearTimeout(data.eventTimeout);
					if ((data.runEvents && rev) || !data.hasRun) {
						isPending = true;
						data.eventTimeout = window.setTimeout(function () {
							isPending = false;
							if (playOut)
								isOver = true;
							pubMethods["play"].apply($tile[0], [0]);
							touchStartedOver = false;
						}, data.onHoverDelay);
					}
				},
				out: function (event, isTouch) {
					isTouch = typeof(isTouch) == "undefined" ? false : isTouch;
					if (!isTouch && touchStartedOut == true) {
						return;
					}
					if (isPending) {
						window.clearTimeout(data.eventTimeout);
						isPending = false;
						return;
					}
					if (playIn) {
						if (!isOver && !isPending) {
							return;
						}
					}
					window.clearTimeout(data.eventTimeout);
					data.eventTimeout = window.setTimeout(function () {
						var rev = (data.mode == "flip") || (data.startNow ? data.isReversed : !data.isReversed);
						if (data.runEvents && rev) {
							pubMethods["play"].apply($tile[0], [0]);
						}
						touchStartedOut = false;
						isOver = false;
					}, data.speed + data.onHoverOutDelay);
				}
			};
			if (!metrojs.capabilities.canTouch) {
				if (playIn)
					$tile.bind('mouseenter.liveTile', data.onHoverMethods.over);
				if (playOut)
					$tile.bind('mouseleave.liveTile', data.onHoverMethods.out);
			} else {
				if (window.PointerEvent || window.MSPointerEvent) { // pointer
					var eventPrefix = window.MSPointerEvent ? "MS" : "";
					if (playIn) {
						//$tile[0].addEventListener(eventPrefix + 'PointerDown', data.onHoverMethods.over, false);
						$tile[0].addEventListener(eventPrefix + 'PointerEnter', data.onHoverMethods.over, false);
					}
					// mouseleave gives a more consistent effect than out when the children are transformed
					if (playOut)
						$tile[0].addEventListener(eventPrefix + 'PointerLeave', data.onHoverMethods.out, false);
				} else { // touch events
					if (playIn) {
						$tile.bind("touchstart.liveTile", function (event) {
							touchStartedOver = true;
							data.onHoverMethods.over.apply($tile[0], [event, true]);
						});
						$tile.bind("mouseenter.liveTile", data.onHoverMethods.over);
					}
					if (playOut) {
						$tile.bind("touchend.liveTile,touchcancel.liveTile", function (event) {
							touchStartedOut = false;
							data.onHoverMethods.out.apply($tile[0], [event, true]);
						});
						$tile.bind("mouseleave.liveTile", data.onHoverMethods.out);
					}
				}

			}
		})();
	},
	unbindMsPlayOnHover: function ($tile, data) {
		if (typeof (data.onHoverMethods) !== "undefined" && (window.PointerEvent || window.MSPointerEvent)) {
			var eventPrefix = window.MSPointerEvent ? "MS" : "";
			$tile[0].removeEventListener(eventPrefix + 'PointerOver', data.onHoverMethods.over, false);
		}
	},
	bindBounce: function ($tile, data) {
		// add bounce
		if (data.bounce) {
			$tile.addClass("bounce");
			$tile.addClass("noselect");
			(function () {
				data.bounceMethods = {
					down: "no",
					threshold: 30,
					zeroPos: { x: 0, y: 0 },
					eventPos: { x: 0, y: 0 },
					inTilePos: { x: 0, y: 0 },
					pointPos: { x: 0, y: 0 },
					regions: {
						c: [0, 0],      // center
						tl: [-1, -1],   // top left
						tr: [1, -1],    // top right
						bl: [-1, 1],    // bottom left
						br: [1, 1],     // bottom right
						t: [null, -1],  // top
						r: [1, null],   // right
						b: [null, 1],   // bottom
						l: [-1, null]   // left
					},
					targets: {
						all: ['c', 't', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br'],
						edges: ['c', 't', 'r', 'b', 'l'],
						corners: ['c', 'tl', 'tr', 'bl', 'br']
					},
					hitTest: function ($el, pos, targetRegions, omegaC) {
						var regions = data.bounceMethods.regions,
                            checkFor = data.bounceMethods.targets[targetRegions],
                            i = 0,
                            strictMatch = null,
                            looseMatch = null,
                            defResult = { hit: [0, 0], name: 'c' };
						// scale only for android 2.x and old ie
						if (metrojs.capabilities.isOldAndroid || !metrojs.capabilities.canTransition)
							return defResult;
						if (typeof (checkFor) == "undefined") {
							if (typeof (targetRegions) === "string")
								checkFor = targetRegions.split(',');
							// only default to center if explicitly requested
							if ($.isArray(checkFor) && $.inArray('c') == -1) {
								omegaC = 0;
								defResult = null;
							}
						}
						// check for a matching region
						var w = $el.width(),
                           h = $el.height(),
                           // center threshold -  maximum amount from center
                           ct = [w * omegaC, h * omegaC],
                           // how far from the center is the point
                           diffX = pos.x - (w * 0.5),
                           diffY = pos.y - (h * 0.5),
                            // if we're beyond the center threshold, set -1 or 1 else 0
                           hit = [
                               diffX > 0 ? (Math.abs(diffX) <= ct[0] ? 0 : 1) : (Math.abs(diffX) <= ct[0] ? 0 : -1),
                               diffY > 0 ? (Math.abs(diffY) <= ct[1] ? 0 : 1) : (Math.abs(diffY) <= ct[1] ? 0 : -1)
                           ];
						for (; i < checkFor.length; i++) {
							if (strictMatch != null)
								return strictMatch;
							var r = checkFor[i],
                                region = regions[r];
							if (r == "*") {
								r = checkFor[i + 1];
								return { region: regions[r], name: r };
							}
							if (hit[0] == region[0] && hit[1] == region[1]) {
								// found the region with a strict lookup
								strictMatch = { hit: region, name: r };
							} else if ((hit[0] == region[0] || region[0] == null) && (hit[1] == region[1] || region[1] == null)) {
								// found the region with a loose lookup
								looseMatch = { hit: region, name: r };
							}
						}
						// prefer a strict match
						if (strictMatch != null)
							return strictMatch;
						else if (looseMatch != null)
							return looseMatch;
						else // no matches were found, return center
							return defResult;
					},
					bounceDown: function (e) {
						if (e.target.tagName == "A" && !$(e).is(".bounce"))
							return;
						var point = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                            offsetOfTile = $tile.offset(),
                            scrollX = window.pageXOffset,
                            scrollY = window.pageYOffset;
						data.bounceMethods.pointPos = {
							x: point.pageX,
							y: point.pageY
						};
						data.bounceMethods.inTilePos = {
							x: point.pageX - offsetOfTile.left,
							y: point.pageY - offsetOfTile.top
						};

						if (!data.$tileParent) {
							data.$tileParent = $tile.parent();
						}
						var offsetOfParent = data.$tileParent.offset();
						data.bounceMethods.eventPos = {
							x: (offsetOfTile.left - offsetOfParent.left) + ($tile.width() / 2),
							y: (offsetOfTile.top - offsetOfParent.top) + ($tile.height() / 2)
						};
						var hit = data.bounceMethods.hitTest($tile, data.bounceMethods.inTilePos, data.bounceDirections, 0.25);
						if (hit == null)
							data.bounceMethods.down = "no";
						else {
							if (window.PointerEvent || window.MSPointerEvent) {
								var eventPrefix = window.MSPointerEvent ? "MS" : "";
								document.addEventListener(eventPrefix + 'PointerUp', data.bounceMethods.bounceUp, false);
								$tile[0].addEventListener(eventPrefix + 'PointerUp', data.bounceMethods.bounceUp, false);
								document.addEventListener(eventPrefix + 'PointerCancel', data.bounceMethods.bounceUp, false);
								if (data.bounceFollowsMove)
									$tile[0].addEventListener(eventPrefix + 'PointerMove', data.bounceMethods.bounceMove, false);
							} else {
								$(document).bind("mouseup.liveTile, touchend.liveTile, touchcancel.liveTile, dragstart.liveTile", data.bounceMethods.bounceUp);
								if (data.bounceFollowsMove) {
									$tile.bind("touchmove.liveTile", data.bounceMethods.bounceMove);
									$tile.bind("mousemove.liveTile", data.bounceMethods.bounceMove);
								}
							}
							var bClass = "bounce-" + hit.name;
							$tile.addClass(bClass);
							data.bounceMethods.down = bClass;
							data.bounceMethods.downPcss = helperMethods.appendStyleProperties({}, ['perspective-origin'], [data.bounceMethods.eventPos.x + "px " + data.bounceMethods.eventPos.y + "px"]);
							data.$tileParent.css(data.bounceMethods.downPcss);
						}
					},
					bounceUp: function () {
						if (data.bounceMethods.down != "no") {
							data.bounceMethods.unBounce();
							if (window.PointerEvent || window.MSPointerEvent) {
								var eventPrefix = window.MSPointerEvent ? "MS" : "";
								document.removeEventListener(eventPrefix + 'PointerUp', data.bounceMethods.bounceUp, false);
								$tile[0].removeEventListener(eventPrefix + 'PointerUp', data.bounceMethods.bounceUp, false);
								document.removeEventListener(eventPrefix + 'PointerCancel', data.bounceMethods.bounceUp, false);
								if (data.bounceFollowsMove)
									$tile[0].removeEventListener(eventPrefix + 'PointerMove', data.bounceMethods.bounceMove, false);

							} else
								$(document).unbind("mouseup.liveTile, touchend.liveTile, touchcancel.liveTile, dragstart.liveTile", data.bounceMethods.bounceUp);
							if (data.bounceFollowsMove) {
								$tile.unbind("touchmove.liveTile", data.bounceMethods.bounceMove);
								$tile.unbind("mousemove.liveTile", data.bounceMethods.bounceMove);
							}
						}
					},
					bounceMove: function (e) {
						if (data.bounceMethods.down != "no") {
							var point = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0] : e,
                                x = Math.abs(point.pageX - data.bounceMethods.pointPos.x),
                                y = Math.abs(point.pageY - data.bounceMethods.pointPos.y);
							if (x > data.bounceMethods.threshold || y > data.bounceMethods.threshold) {
								var bounceClass = data.bounceMethods.down;
								data.bounceMethods.bounceDown(e);
								if (bounceClass != data.bounceMethods.down)
									$tile.removeClass(bounceClass);
							}
						}
					},
					unBounce: function () {
						$tile.removeClass(data.bounceMethods.down);
						if (typeof (data.bounceMethods.downPcss) == "object") {
							var names = ['perspective-origin', 'perspective-origin-x', 'perspective-origin-y'],
                                vals = ['', '', ''];
							data.bounceMethods.downPcss = helperMethods.appendStyleProperties({}, names, vals);
							// let the bounce finish and then strip out the perspective
							window.setTimeout(function () {
								data.$tileParent.css(data.bounceMethods.downPcss);
							}, 200);
						}
						data.bounceMethods.down = "no";
						data.bounceMethods.inTilePos = data.bounceMethods.zeroPos;
						data.bounceMethods.eventPos = data.bounceMethods.zeroPos;
					}
				};
				// IE 10+
				if (window.PointerEvent || window.MSPointerEvent) {// touch only -> // && window.navigator.msMaxTouchPoints) {
					var eventPrefix = window.MSPointerEvent ? "MS" : "";
					$tile[0].addEventListener(eventPrefix + 'PointerDown', data.bounceMethods.bounceDown, false);
				} else if (metrojs.capabilities.canTouch) {
					// everybody else                    
					$tile.bind("touchstart.liveTile", data.bounceMethods.bounceDown);
					$tile.bind("mousedown.liveTile", data.bounceMethods.bounceDown);

				} else {
					$tile.bind("mousedown.liveTile", data.bounceMethods.bounceDown);
				}
			})();
		}
	},
	unbindMsBounce: function ($tile, data) {
		if (data.bounce && (window.PointerEvent || window.MSPointerEvent)) {// touch only -> // && window.navigator.msMaxTouchPoints) {
			var eventPrefix = window.MSPointerEvent ? "MS" : "";
			$tile[0].removeEventListener(eventPrefix + 'PointerDown', data.bounceMethods.bounceDown, false);
			$tile[0].removeEventListener(eventPrefix + 'PointerCancel', data.bounceMethods.bounceUp, false);
			$tile[0].removeEventListener(eventPrefix + 'PointerOut', data.bounceMethods.bounceUp, false);
			//$tile[0].removeEventListener(eventPrefix + 'PointerMove', data.bounceMethods.bounceMove, false);
		}
	},
	bindLink: function ($tile, data) {
		if (data.link.length > 0) {
			$tile.css({ cursor: 'pointer' }).bind("click.liveTile", function (e) {
				if (e.target.tagName == "A" && !$(e).is(".live-tile,.slide,.flip"))
					return;
				if (data.newWindow)
					window.open(data.link);
				else
					window.location = data.link;
			});
		}
	},
	runContenModules: function (data, $front, $back, index) {
		for (var i = 0; i < data.contentModules.length; i++) {
			var currentModule = data.contentModules[i];
			if (typeof (currentModule.action) == "function")
				currentModule.action(data, $front, $back, index);
		}
	},
	fade: function ($tile, count, data) {
		var tdata = typeof (data) === "object" ? data : $tile.data("LiveTile"),
            resumeTimer = function () {
            	// if the tile should run again start the timer back with the current delay
            	if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
            		if (tdata.timer.count != tdata.timer.repeatCount) {
            			tdata.timer.start(tdata.delay);
            		}
            	}
            };
		if (typeof (tdata) === "undefined") {
			throwError($.fn.liveTile.defaults.rebindMessage);
			return;
		}
		if (tdata.faces.$front.is(":animated"))
			return;
		tdata.timer.pause();
		var loopCount = tdata.loopCount + 1;
		tdata.isReversed = loopCount % 2 === 0; // the count starts at 1
		var start = tdata.animationStarting.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
		if (typeof (start) != "undefined" && start == false) {
			resumeTimer();
			return;
		}
		tdata.loopCount = loopCount;
		var faded = function () {
			resumeTimer();
			// run content modules and animationComplete callback
			privMethods.runContenModules(tdata, tdata.faces.$front, tdata.faces.$back);
			tdata.animationComplete.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
		};
		if (tdata.isReversed)
			tdata.faces.$front.fadeIn(tdata.speed, tdata.noHaTransFunc, faded);
		else
			tdata.faces.$front.fadeOut(tdata.speed, tdata.noHaTransFunc, faded);
	},
	slide: function ($tile, count, data, stopIndex, callback) {
		var tdata = typeof (data) === "object" ? data : $tile.data("LiveTile"),
            aniData = $tile.data("metrojs.tile");
		if (typeof (tdata) === "undefined") {
			throwError($.fn.liveTile.defaults.rebindMessage);
			return;
		}
		if (aniData.animating == true || $tile.is(":animated")) {
			tdata = null;
			aniData = null;
			return;
		}
		var resumeTimer = function () {
			// if the tile should run again start the timer back with the current delay
			if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
				if (tdata.timer.count != tdata.timer.repeatCount) {
					tdata.timer.start(tdata.delay);
				}
			}
		};
		if (tdata.mode !== "carousel") {
			tdata.isReversed = tdata.currentIndex % 2 !== 0;  // the count starts at 1
			// carousel mode maintains its own timer
			tdata.timer.pause();
			var start = tdata.animationStarting.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
			if (typeof (start) != "undefined" && start == false) {
				resumeTimer();
				return;
			}
			tdata.loopCount = tdata.loopCount + 1;
		} else {
			// in carousel mode the face that just left the stage is always the $back
			tdata.isReversed = true;
		}
		// get temp values passed in from data methods
		var direction;
		if (typeof (tdata.tempValues.direction) === "string" && tdata.tempValues.direction.length > 0)
			direction = tdata.tempValues.direction;
		else
			direction = tdata.direction;
		tdata.tempValues.direction = null;
		var css = {},
            cssback = {},
            // the stop index is overridden in carousel mode
            stopIdx = typeof (stopIndex) === "undefined" ? tdata.currentIndex : stopIndex,
            stop = $.trim(tdata.stops[Math.min(stopIdx, tdata.stops.length - 1)]),
            pxIdx = stop.indexOf('px'),
            offset = 0,
            amount = 0,
            metric = (direction === "vertical") ? tdata.height : tdata.width,
            tProp = (direction === "vertical") ? "top" : "left",
            stack = tdata.stack == true;
		// when the slide is complete increment the index or call the callback
		var slideFinished = function () {
			if (typeof (callback) === "undefined") {
				tdata.currentIndex = tdata.currentIndex + 1;
				if (tdata.currentIndex > tdata.stops.length - 1) {
					tdata.currentIndex = 0;
				}
			} else {
				callback();
			}
			if (tdata.mode != "carousel") {
				resumeTimer();
			}
			// run content modules and animationComplete callback            
			privMethods.runContenModules(tdata, tdata.faces.$front, tdata.faces.$back, tdata.currentIndex);
			tdata.animationComplete.call($tile[0], tdata, tdata.faces.$front, tdata.faces.$back);
			tdata = null;
			aniData = null;
		};
		if (pxIdx > 0) {
			amount = parseInt(stop.substring(0, pxIdx), 10);
			offset = (amount - metric) + 'px';
		} else {
			//is a percentage
			amount = parseInt(stop.replace('%', ''), 10);
			offset = (amount - 100) + '%';
		}
		// hardware accelerated :)
		if (metrojs.capabilities.canTransition && tdata.useHardwareAccel) {
			if (typeof (aniData.animating) !== "undefined" && aniData.animating == true)
				return;
			aniData.animating = true;
			var props = ['transition-property', 'transition-duration', 'transition-timing-function'],
                vals = [tdata.useTranslate ? "transform" : tProp, tdata.speed + 'ms', tdata.haTransFunc];
			vals[helperMethods.browserPrefix + 'transition-property'] = helperMethods.browserPrefix + "transform";
			css = helperMethods.appendStyleProperties(css, props, vals);
			cssback = helperMethods.appendStyleProperties(cssback, props, vals);
			var vertical = direction === "vertical",
                prop = vertical ? "top" : "left",
                translateTo;
			if (!tdata.useTranslate) {
				css[prop] = stop;
				if (stack)
					cssback[prop] = offset;
			} else {
				translateTo = vertical ? "translate(0%, " + stop + ")" : "translate(" + stop + ", 0%)";
				css = helperMethods.appendStyleProperties(css, ['transform'], [translateTo + "translateZ(0)"]);
				if (stack) {
					translateTo = vertical ? "translate(0%, " + offset + ")" : "translate(" + offset + ", 0%)";
					cssback = helperMethods.appendStyleProperties(cssback, ['transform'], [translateTo + "translateZ(0)"]);
				}
			}
			tdata.faces.$front.css(css);
			if (stack)
				tdata.faces.$back.css(cssback);
			window.clearTimeout(tdata.completeTimeout);
			tdata.completeTimeout = window.setTimeout(function () {
				aniData.animating = false;
				slideFinished();
			}, tdata.speed);
		} else {
			// not hardware accelerated :(
			css[tProp] = stop;
			cssback[tProp] = offset;
			aniData.animating = true;
			var $front = tdata.faces.$front.stop(),
                $back = tdata.faces.$back.stop();
			$front.animate(css, tdata.speed, tdata.noHaTransFunc, function () {
				aniData.animating = false;
				slideFinished();
			});
			// change the css value to the offset
			if (stack)
				$back.animate(cssback, tdata.speed, tdata.noHaTransFunc, function () { });
		}
	},
	carousel: function ($tile, count) {
		var tdata = $tile.data("LiveTile");
		if (typeof (tdata) === "undefined") {
			throwError($.fn.liveTile.defaults.rebindMessage);
			return;
		}
		// dont update css or call slide if animated or if there's only one face
		var aniData = $tile.data("metrojs.tile");
		if (aniData.animating == true || tdata.faces.$listTiles.length <= 1) {
			aniData = null;
			return;
		}
		var resumeTimer = function () {
			if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
				if (tdata.timer.count != tdata.timer.repeatCount) {
					tdata.timer.start(tdata.delay);
				}
			}
		};
		// pause the timer and use a per slide delay
		tdata.timer.pause();
		var $cur = tdata.faces.$listTiles.filter(".active"),
            idx = tdata.faces.$listTiles.index($cur),
            goTo = tdata.currentIndex,
            eq = goTo != idx ? goTo : idx,
            nxtIdx = eq + 1 >= tdata.faces.$listTiles.length ? 0 : eq + 1,
            sdata = tdata.listData[nxtIdx];
		if (idx == nxtIdx) {
			aniData = null;
			$cur = null;
			return;
		}
		// get temp values passed in from data methods
		var animationDirection;
		if (typeof (tdata.tempValues.animationDirection) === "string" && tdata.tempValues.animationDirection.length > 0)
			animationDirection = tdata.tempValues.animationDirection;
		else if (typeof (sdata.animationDirection) === "string" && sdata.animationDirection.length > 0) {
			animationDirection = sdata.animationDirection;
		} else
			animationDirection = tdata.animationDirection;
		// the temp value for animation direction is not used in slide so i'm setting it to null
		tdata.tempValues.animationDirection = null;
		var direction;
		if (typeof (tdata.tempValues.direction) === "string" && tdata.tempValues.direction.length > 0) {
			direction = tdata.tempValues.direction;
		} else if (typeof (sdata.direction) === "string" && sdata.direction.length > 0) {
			direction = sdata.direction;
			tdata.tempValues.direction = direction;
		} else {
			direction = tdata.direction;
		}
		var $nxt = tdata.faces.$listTiles.eq(nxtIdx),
            start = tdata.animationStarting.call($tile[0], tdata, $cur, $nxt);
		if (typeof (start) != "undefined" && start == false) {
			resumeTimer();
			return;
		}
		tdata.loopCount = tdata.loopCount + 1;
		var nxtCss = helperMethods.appendStyleProperties({}, ['transition-duration'], ['0s']),
            vertical = direction === "vertical",
            translateTo;
		if (animationDirection === "backward") {
			if (!tdata.useTranslate || !metrojs.capabilities.canTransition) {
				if (vertical) {
					nxtCss.top = "-100%";
					nxtCss.left = "0%";
				} else {
					nxtCss.top = "0%";
					nxtCss.left = "-100%";
				}
				tdata.stops = ['100%'];
			} else {
				translateTo = vertical ? "translate(0%, -100%)" : "translate(-100%, 0%)";
				nxtCss = helperMethods.appendStyleProperties(nxtCss, ["transform"], [translateTo + " translateZ(0)"]);
				tdata.stops = ['100%'];
			}
			tdata.faces.$front = $cur;
			tdata.faces.$back = $nxt;

		} else {
			if (!tdata.useTranslate || !metrojs.capabilities.canTransition) {
				if (vertical) {
					nxtCss.top = "100%";
					nxtCss.left = "0%";
				} else {
					nxtCss.top = "0%";
					nxtCss.left = "100%";
				}
			} else {
				translateTo = vertical ? "translate(0%, 100%)" : "translate(100%, 0%)";
				nxtCss = helperMethods.appendStyleProperties(nxtCss, ["transform"], [translateTo + " translateZ(0)"]);
			}
			tdata.faces.$front = $nxt;
			tdata.faces.$back = $cur;
			tdata.stops = ['0%'];
		}
		$nxt.css(nxtCss);
		// the timeout wrapper gives the css call above enough time to finish in case we dynamically set the direction
		window.setTimeout(function () {
			$cur.removeClass("active");
			$nxt.addClass("active");
			privMethods.slide($tile, count, tdata, 0, function () {
				tdata.currentIndex = nxtIdx;
				aniData = null;
				$cur = null;
				$nxt = null;
				resumeTimer();
			});
		}, 150);

	},
	flip: function ($tile, count, data, callback) {
		var aniData = $tile.data("metrojs.tile");
		if (typeof (aniData) !== "undefined" && aniData.animating == true) {
			aniData = null;
			return;
		}
		var tdata = typeof (data) === "object" ? data : $tile.data("LiveTile");
		if (typeof (tdata) === "undefined") {
			throwError($.fn.liveTile.defaults.rebindMessage);
			return;
		}
		var $front, $back, direction, deg, rotateDir, css,
            raiseEvt = typeof (callback) === "undefined",
            index = 0,
            isReversed,  // the count starts at 1
            resumeTimer = function () {
            	// if the tile should run again start the timer back with the current delay
            	if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
            		if (tdata.timer.count != tdata.timer.repeatCount) {
            			tdata.timer.start(tdata.delay);
            		}
            	}
            };
		// the timer is only paused if animationComplete is fired
		if (raiseEvt) {
			tdata.timer.pause();
			var loopCount = tdata.loopCount + 1;
			isReversed = loopCount % 2 === 0;
			tdata.isReversed = isReversed;
			$front = tdata.faces.$front;
			$back = tdata.faces.$back;
			var args = isReversed ? [tdata, $back, $front] : [tdata, $front, $back];
			var start = tdata.animationStarting.apply($tile[0], args);
			if (typeof (start) != "undefined" && start == false) {
				resumeTimer();
				return;
			}
			direction = tdata.direction;
			height = tdata.height;
			width = tdata.width;
			margin = tdata.margin;
			tdata.loopCount = loopCount;
		} else {
			isReversed = count % 2 === 0;
			index = aniData.index;
			$front = tdata.listData[index].faces.$front;
			$back = tdata.listData[index].faces.$back;
			tdata.listData[index].isReversed = isReversed;
			direction = tdata.listData[index].direction;
			height = tdata.listData[index].height;
			width = tdata.listData[index].width;
			margin = tdata.listData[index].margin;
		}

		if (metrojs.capabilities.canFlip3d && tdata.useHardwareAccel) { // Hardware accelerated :)
			deg = !isReversed ? "180deg" : "360deg";
			rotateDir = direction === "vertical" ? "rotateX(" + deg + ")" : "rotateY(" + deg + ")";
			css = helperMethods.appendStyleProperties({}, ["transform", "transition"], [rotateDir, "all " + tdata.speed + "ms " + tdata.haTransFunc + " 0s"]);
			var bDeg = !isReversed ? "360deg" : "540deg";
			var bRotateDir = direction === "vertical" ? "rotateX(" + bDeg + ")" : "rotateY(" + bDeg + ")";
			var bCss = helperMethods.appendStyleProperties({}, ["transform", "transition"], [bRotateDir, "all " + tdata.speed + "ms " + tdata.haTransFunc + " 0s"]);
			$front.css(css);
			$back.css(bCss);

			var action = function () {
				aniData.animating = false;
				var resetDir, newCss;
				if (!isReversed) {
					privMethods.runContenModules(tdata, $back, $front, index);
					if (raiseEvt) {
						resumeTimer();
						tdata.animationComplete.call($tile[0], tdata, $back, $front);
					} else
						callback(tdata, $back, $front);
				} else {
					resetDir = direction === "vertical" ? "rotateX(0deg)" : "rotateY(0deg)";
					newCss = helperMethods.appendStyleProperties({}, ["transform", "transition"], [resetDir, "all 0s " + tdata.haTransFunc + " 0s"]);
					$front.css(newCss);
					//call content modules
					privMethods.runContenModules(tdata, $front, $back, index);
					if (raiseEvt) {
						resumeTimer();
						tdata.animationComplete.call($tile[0], tdata, $front, $back);
					} else
						callback(tdata, $front, $back);
					$front = null;
					$back = null;
					tdata = null;
					aniData = null;
				}
			};
			if (tdata.mode === "flip-list") {
				window.clearTimeout(tdata.listData[index].completeTimeout);
				tdata.listData[index].completeTimeout = window.setTimeout(action, tdata.speed);
			} else {
				window.clearTimeout(tdata.completeTimeout);
				tdata.completeTimeout = window.setTimeout(action, tdata.speed);
			}
		} else { // not Hardware accelerated :(
			var speed = tdata.speed / 2;
			var hideCss = (direction === "vertical") ?
						{ height: '0px', width: '100%', marginTop: margin + 'px', opacity: tdata.noHAflipOpacity } :
						{ height: '100%', width: '0px', marginLeft: margin + 'px', opacity: tdata.noHAflipOpacity };
			var showCss = (direction === "vertical") ?
                        { height: '100%', width: '100%', marginTop: '0px', opacity: '1' } :
                        { height: '100%', width: '100%', marginLeft: '0px', opacity: '1' };
			var noHaAction;
			if (!isReversed) {
				aniData.animating = true;
				$front.stop().animate(hideCss, { duration: speed });
				noHaAction = function () {
					aniData.animating = false;
					$back.stop().animate(showCss, {
						duration: speed,
						complete: function () {
							privMethods.runContenModules(tdata, $back, $front, index);
							if (raiseEvt) {
								resumeTimer();
								tdata.animationComplete.call($tile[0], tdata, $back, $front);
							} else
								callback(tdata, $back, $front);
							$front = null;
							$back = null;
							tdata = null;
							aniData = null;
						}
					});
				};
				if (tdata.mode === "flip-list") {
					window.clearTimeout(tdata.listData[aniData.index].completeTimeout);
					tdata.listData[aniData.index].completeTimeout = window.setTimeout(noHaAction, speed);
				} else {
					window.clearTimeout(tdata.completeTimeout);
					tdata.completeTimeout = window.setTimeout(noHaAction, speed);
				}
			} else {
				aniData.animating = true;
				$back.stop().animate(hideCss, { duration: speed });
				noHaAction = function () {
					aniData.animating = false;
					$front.stop().animate(showCss, {
						duration: speed,
						complete: function () {
							privMethods.runContenModules(tdata, $front, $back, index);
							if (raiseEvt) {
								resumeTimer();
								tdata.animationComplete.call($tile[0], tdata, $front, $back);
							} else
								callback(tdata, $front, $back);
							aniData = null;
							$front = null;
							$back = null;
						}
					});
				};
				if (tdata.mode === "flip-list") {
					window.clearTimeout(tdata.listData[aniData.index].completeTimeout);
					tdata.listData[aniData.index].completeTimeout = window.setTimeout(noHaAction, speed);
				} else {
					window.clearTimeout(tdata.completeTimeout);
					tdata.completeTimeout = window.setTimeout(noHaAction, speed);
				}
			}

		}
	},
	flipList: function ($tile, count) {
		var tdata = $tile.data("LiveTile"),
            maxDelay = tdata.speed,
            triggered = false,
            resumeTimer = function () {
            	if (tdata.timer.repeatCount > 0 || tdata.timer.repeatCount == -1) {
            		if (tdata.timer.count != tdata.timer.repeatCount) {
            			tdata.timer.start(tdata.delay);
            		}
            	}
            };
		if (typeof (tdata) === "undefined") {
			throwError($.fn.liveTile.defaults.rebindMessage);
			return;
		}
		tdata.timer.pause();
		var start = tdata.animationStarting.call($tile[0], tdata, null, null);
		if (typeof (start) != "undefined" && start == false) {
			resumeTimer();
			return;
		}
		tdata.loopCount = tdata.loopCount + 1;
		tdata.faces.$listTiles.each(function (idx, ele) {
			var $li = $(ele),
                ldata = $li.data("metrojs.tile"),
                tDelay = tdata.triggerDelay(idx),
                triggerDelay = tdata.speed + Math.max(tDelay, 0),
                trigger = tdata.alwaysTrigger;
			if (!trigger)
				trigger = (Math.random() * 351) > 150 ? true : false;
			if (trigger) {
				triggered = true;
				maxDelay = Math.max(triggerDelay + tdata.speed, maxDelay);
				window.clearTimeout(ldata.flCompleteTimeout);
				ldata.flCompleteTimeout = window.setTimeout(function () {
					// call the flip method with the merged data, but dont fire animationComplete
					privMethods.flip($li, ldata.count, tdata, function (data) {
						ldata.count++;
						if (ldata.count >= MAX_LOOP_COUNT)
							ldata.count = 1;
						$li = null;
						ldata = null;
					});
				}, triggerDelay);
			}
		});
		if (triggered) {
			window.clearTimeout(tdata.flCompleteTimeout);
			tdata.flCompleteTimeout = window.setTimeout(function () {
				privMethods.runContenModules(tdata, null, null, -1);
				tdata.animationComplete.call($tile[0], tdata, null, null);
				resumeTimer();
			}, maxDelay + tdata.speed); // add some padding to make sure the final callback finished

		}
	}
};


// methods that can be called more universally
var helperMethods = {
	stylePrefixes: 'Webkit Moz O ms Khtml '.split(' '),
	domPrefixes: '-webkit- -moz- -o- -ms- -khtml- '.split(' '),
	browserPrefix: null,
	// a method to append css3 properties for each browser
	// note: values are identical for each property
	appendStyleProperties: function (obj, names, values) {
		for (var i = 0; i <= names.length - 1; i++) {
			obj[$.trim(this.browserPrefix + names[i])] = values[i];
			obj[$.trim(names[i])] = values[i];
		}
		return obj;
	},
	applyStyleValue: function (obj, name, value) {
		obj[$.trim(this.browserPrefix + name)] = value;
		obj[name] = value;
		return obj;
	},
	getBrowserPrefix: function () {
		if (this.browserPrefix == null) {
			var prefix = "";
			for (var i = 0; i <= this.domPrefixes.length - 1; i++) {
				if (typeof (document.body.style[this.domPrefixes[i] + "transform"]) != "undefined")
					prefix = this.domPrefixes[i];
			}
			return this.browserPrefix = prefix;
		}
		return this.browserPrefix;
	},
	//a shuffle method to provide more randomness than sort
	//credit: http://javascript.about.com/library/blshuffle.htm
	//note: avoiding prototype for sharepoint compatability
	shuffleArray: function (array) {
		var s = [];
		while (array.length) s.push(array.splice(Math.random() * array.length, 1));
		while (s.length) array.push(s.pop());
		return array;
	}
};

var defaultModules = {
	moduleName: 'custom',
	customSwap: {
		data: {
			customDoSwapFront: function () { return false; },
			customDoSwapBack: function () { return false; },
			customGetContent: function (tdata, $front, $back, index) { return null; }
		},
		initData: function (tdata, $ele) {
			var swapData = {};
			swapData.doSwapFront = $.inArray('custom', tdata.swapFront) > -1 && tdata.customDoSwapFront();
			swapData.doSwapBack = $.inArray('custom', tdata.swapBack) > -1 && tdata.customDoSwapBack();
			if (typeof (tdata.customSwap) !== "undefined")
				tdata.customSwap = $.extend(swapData, tdata.customSwap);
			else
				tdata.customSwap = swapData;
		},
		action: function (tdata, $front, $back, index) {

		}
	},
	htmlSwap: {
		moduleName: 'html',
		data: { // public data for the swap module                
			frontContent: [],                       // a list of html to use for the front
			frontIsRandom: true,                    // should html be chosen at random or in order                
			frontIsInGrid: false,                   // only chooses one item for each iteration in flip-list                
			backContent: [],                        // a list of html to use for the back
			backIsRandom: true,                     // should html be chosen at random or in order                
			backIsInGrid: false                     // only chooses one item for each iteration in flip-list                
		},
		initData: function (tdata, $ele) {
			var swapData = { // private data for the swap module
				backBag: [],
				backIndex: 0,
				backStaticIndex: 0,
				backStaticRndm: -1,
				prevBackIndex: -1,
				frontBag: [],
				frontIndex: 0,
				frontStaticIndex: 0,
				frontStaticRndm: -1,
				prevFrontIndex: -1
			};
			if (!tdata.ignoreDataAttributes) {
				swapData.frontIsRandom = privMethods.getDataOrDefault($ele, "front-israndom", tdata.frontIsRandom);
				swapData.frontIsInGrid = privMethods.getDataOrDefault($ele, "front-isingrid", tdata.frontIsInGrid);
				swapData.backIsRandom = privMethods.getDataOrDefault($ele, "back-israndom", tdata.backIsRandom);
				swapData.backIsInGrid = privMethods.getDataOrDefault($ele, "back-isingrid", tdata.backIsInGrid);
			} else {
				swapData.frontIsRandom = tdata.frontIsRandom;
				swapData.frontIsInGrid = tdata.frontIsInGrid;
				swapData.backIsRandom = tdata.backIsRandom;
				swapData.backIsInGrid = tdata.backIsInGrid;
			}
			swapData.doSwapFront = $.inArray('html', tdata.swapFront) > -1 && (tdata.frontContent instanceof Array) && tdata.frontContent.length > 0;
			swapData.doSwapBack = $.inArray('html', tdata.swapBack) > -1 && (tdata.backContent instanceof Array) && tdata.backContent.length > 0;
			if (typeof (tdata.htmlSwap) !== "undefined")
				tdata.htmlSwap = $.extend(swapData, tdata.htmlSwap);
			else
				tdata.htmlSwap = swapData;
			if (tdata.htmlSwap.doSwapFront) {
				tdata.htmlSwap.frontBag = this.prepBag(tdata.htmlSwap.frontBag, tdata.frontContent, tdata.htmlSwap.prevFrontIndex);
				tdata.htmlSwap.frontStaticRndm = tdata.htmlSwap.frontBag.pop();
			}
			if (tdata.htmlSwap.doSwapBack) {
				tdata.htmlSwap.backBag = this.prepBag(tdata.htmlSwap.backBag, tdata.backContent, tdata.htmlSwap.prevBackIndex);
				tdata.htmlSwap.backStaticRndm = tdata.htmlSwap.backBag.pop();
			}
		},
		prepBag: function (bag, content, prevIdx) {
			bag = bag || [];
			var bagCount = 0;
			for (var i = 0; i < content.length; i++) {
				//make sure there's not an immediate repeat
				if (i != prevIdx || bag.length === 1) {
					bag[bagCount] = i;
					bagCount++;
				}
			}
			return helperMethods.shuffleArray(bag);
		},
		getFrontSwapIndex: function (tdata) {
			var idx = 0;
			if (!tdata.htmlSwap.frontIsRandom) {
				idx = tdata.htmlSwap.frontIsInGrid ? tdata.htmlSwap.frontStaticIndex : tdata.htmlSwap.frontIndex;
			} else {
				if (tdata.htmlSwap.frontBag.length === 0) {
					tdata.htmlSwap.frontBag = this.prepBag(tdata.htmlSwap.frontBag, tdata.frontContent, tdata.htmlSwap.prevFrontIndex);
				}
				if (tdata.htmlSwap.frontIsInGrid) {
					idx = tdata.htmlSwap.frontStaticRndm;
				} else {
					idx = tdata.htmlSwap.frontBag.pop();
				}
			}
			return idx;
		},
		getBackSwapIndex: function (tdata) {
			var idx = 0;
			if (!tdata.htmlSwap.backIsRandom) {
				idx = tdata.htmlSwap.backIsInGrid ? tdata.htmlSwap.backStaticIndex : tdata.htmlSwap.backIndex;
			} else {
				if (tdata.htmlSwap.backBag.length === 0) {
					tdata.htmlSwap.backBag = this.prepBag(tdata.htmlSwap.backBag, tdata.backContent, tdata.htmlSwap.prevBackIndex);
				}
				if (tdata.htmlSwap.backIsInGrid) {
					idx = tdata.htmlSwap.backStaticRndm;
				} else {
					idx = tdata.htmlSwap.backBag.pop();
				}
			}
			return idx;
		},
		action: function (tdata, $front, $back, index) {
			if (!tdata.htmlSwap.doSwapFront && !tdata.htmlSwap.doSwapBack)
				return;
			var isList = tdata.mode === "flip-list";
			var swapIndex = 0;
			var isReversed = isList ? tdata.listData[Math.max(index, 0)].isReversed : tdata.isReversed;
			if (isList && index == -1) {
				// flip list completed
				if (!isReversed) {
					if (tdata.htmlSwap.doSwapFront) {
						// update the random value for grid mode
						if (tdata.htmlSwap.frontBag.length === 0)
							tdata.htmlSwap.frontBag = this.prepBag(tdata.htmlSwap.frontBag, tdata.frontContent, tdata.htmlSwap.frontStaticRndm);
						tdata.htmlSwap.frontStaticRndm = tdata.htmlSwap.frontBag.pop();
						// update the static index
						tdata.htmlSwap.frontStaticIndex++;
						if (tdata.htmlSwap.frontStaticIndex >= tdata.frontContent.length)
							tdata.htmlSwap.frontStaticIndex = 0;
					}
				} else {
					if (tdata.htmlSwap.doSwapBack) {
						// update the random value for grid mode
						if (tdata.htmlSwap.backBag.length === 0)
							tdata.htmlSwap.backBag = this.prepBag(tdata.htmlSwap.backBag, tdata.backContent, tdata.htmlSwap.backStaticRndm);
						tdata.htmlSwap.backStaticRndm = tdata.htmlSwap.backBag.pop();
						// update the static index
						tdata.htmlSwap.backStaticIndex++;
						if (tdata.htmlSwap.backStaticIndex >= tdata.backContent.length)
							tdata.htmlSwap.backStaticIndex = 0;
					}
				}
				return;
			}
			if (!isReversed) {
				if (!tdata.htmlSwap.doSwapFront)
					return;
				swapIndex = this.getFrontSwapIndex(tdata);
				tdata.htmlSwap.prevFrontIndex = swapIndex;
				if (tdata.mode === "slide") {
					if (!tdata.startNow)
						$front.html(tdata.frontContent[swapIndex]);
					else
						$back.html(tdata.frontContent[swapIndex]);
				} else
					$back.html(tdata.frontContent[swapIndex]);
				// increment the front index to get the next item from the list
				tdata.htmlSwap.frontIndex++;
				if (tdata.htmlSwap.frontIndex >= tdata.frontContent.length)
					tdata.htmlSwap.frontIndex = 0;
				if (!isList) {
					// increment the static index if we're not in list mode
					tdata.htmlSwap.frontStaticIndex++;
					if (tdata.htmlSwap.frontStaticIndex >= tdata.frontContent.length)
						tdata.htmlSwap.frontStaticIndex = 0;
				} else {
					// flip list
				}
			} else {
				if (!tdata.htmlSwap.doSwapBack)
					return;
				swapIndex = this.getBackSwapIndex(tdata);
				tdata.htmlSwap.prevBackIndex = swapIndex;
				$back.html(tdata.backContent[tdata.htmlSwap.backIndex]);
				tdata.htmlSwap.backIndex++;
				if (tdata.htmlSwap.backIndex >= tdata.backContent.length)
					tdata.htmlSwap.backIndex = 0;
				if (!isList) {
					tdata.htmlSwap.backStaticIndex++;
					if (tdata.htmlSwap.backStaticIndex >= tdata.backContent.length)
						tdata.htmlSwap.backStaticIndex = 0;
				} else {
					// flip list
				}
			}
		}
	},
	imageSwap: {
		moduleName: 'image',
		data: {
			preloadImages: false,
			imageCssSelector: '>img,>a>img',        // the selector used to choose a an image to apply a src or background to
			fadeSwap: false,                        // fade the image before swapping
			frontImages: [],                        // a list of images to use for the front
			frontIsRandom: true,                    // should images be chosen at random or in order
			frontIsBackgroundImage: false,          // set the src attribute or css background-image property
			frontIsInGrid: false,                   // only chooses one item for each iteration in flip-list
			backImages: null,                       // a list of images to use for the back
			backIsRandom: true,                     // should images be chosen at random or in order
			backIsBackgroundImage: false,           // set the src attribute or css background-image property
			backIsInGrid: false                     // only chooses one item for each iteration in flip-list                
		},
		initData: function (tdata, $ele) {
			var swapData = {
				backBag: [],
				backIndex: 0,
				backStaticIndex: 0,
				backStaticRndm: -1,
				frontBag: [],
				frontIndex: 0,
				frontStaticIndex: 0,
				frontStaticRndm: -1,
				prevBackIndex: -1,
				prevFrontIndex: -1
			}, useData = tdata.ignoreDataAttributes;
			if (useData) {
				swapData.imageCssSelector = privMethods.getDataOrDefault($ele, "image-css", tdata.imageCssSelector);
				swapData.fadeSwap = privMethods.getDataOrDefault($ele, "fadeswap", tdata.fadeSwap);
				swapData.frontIsRandom = privMethods.getDataOrDefault($ele, "front-israndom", tdata.frontIsRandom);
				swapData.frontIsInGrid = privMethods.getDataOrDefault($ele, "front-isingrid", tdata.frontIsInGrid);
				swapData.frontIsBackgroundImage = privMethods.getDataOrDefault($ele, "front-isbg", tdata.frontIsBackgroundImage);
				swapData.backIsRandom = privMethods.getDataOrDefault($ele, "back-israndom", tdata.backIsRandom);
				swapData.backIsInGrid = privMethods.getDataOrDefault($ele, "back-isingrid", tdata.backIsInGrid);
				swapData.backIsBackgroundImage = privMethods.getDataOrDefault($ele, "back-isbg", tdata.backIsBackgroundImage);
				swapData.doSwapFront = $.inArray('image', tdata.swapFront) > -1 && (tdata.frontImages instanceof Array) && tdata.frontImages.length > 0;
				swapData.doSwapBack = $.inArray('image', tdata.swapBack) > -1 && (tdata.backImages instanceof Array) && tdata.backImages.length > 0;
				swapData.alwaysSwapFront = privMethods.getDataOrDefault($ele, "front-alwaysswap", tdata.alwaysSwapFront);
				swapData.alwaysSwapBack = privMethods.getDataOrDefault($ele, "back-alwaysswap", tdata.alwaysSwapBack);
			} else {
				swapData.imageCssSelector = tdata.imageCssSelector;
				swapData.fadeSwap = tdata.fadeSwap;
				swapData.frontIsRandom = tdata.frontIsRandom;
				swapData.frontIsInGrid = tdata.frontIsInGrid;
				swapData.frontIsBackgroundImage = tdata.frontIsBackgroundImage;
				swapData.backIsRandom = tdata.backIsRandom;
				swapData.backIsInGrid = tdata.backIsInGrid;
				swapData.backIsBackgroundImage = tdata.backIsBackgroundImage;
				swapData.doSwapFront = $.inArray('image', tdata.swapFront) > -1 && (tdata.frontImages instanceof Array) && tdata.frontImages.length > 0;
				swapData.doSwapBack = $.inArray('image', tdata.swapBack) > -1 && (tdata.backImages instanceof Array) && tdata.backImages.length > 0;
				swapData.alwaysSwapFront = tdata.alwaysSwapFront;
				swapData.alwaysSwapBack = tdata.alwaysSwapBack;
			}
			if (typeof (tdata.imgSwap) !== "undefined")
				tdata.imgSwap = $.extend(swapData, tdata.imgSwap);
			else
				tdata.imgSwap = swapData;
			if (tdata.imgSwap.doSwapFront) {
				tdata.imgSwap.frontBag = this.prepBag(tdata.imgSwap.frontBag, tdata.frontImages, tdata.imgSwap.prevFrontIndex);
				tdata.imgSwap.frontStaticRndm = tdata.imgSwap.frontBag.pop();
				if (tdata.preloadImages)
					$(tdata.frontImages).metrojs.preloadImages(function () { });
			}
			if (tdata.imgSwap.doSwapBack) {
				tdata.imgSwap.backBag = this.prepBag(tdata.imgSwap.backBag, tdata.backImages, tdata.imgSwap.prevBackIndex);
				tdata.imgSwap.backStaticRndm = tdata.imgSwap.backBag.pop();
				if (tdata.preloadImages)
					$(tdata.backImages).metrojs.preloadImages(function () { });
			}
		},
		prepBag: function (bag, content, prevIdx) {
			bag = bag || [];
			var bagCount = 0;
			for (var i = 0; i < content.length; i++) {
				//make sure there's not an immediate repeat
				if (i != prevIdx || content.length === 1) {
					bag[bagCount] = i;
					bagCount++;
				}
			}
			return helperMethods.shuffleArray(bag);
		},
		getFrontSwapIndex: function (tdata) {
			var idx = 0;
			if (!tdata.imgSwap.frontIsRandom) {
				idx = tdata.imgSwap.frontIsInGrid ? tdata.imgSwap.frontStaticIndex : tdata.imgSwap.frontIndex;
			} else {
				if (tdata.imgSwap.frontBag.length === 0) {
					tdata.imgSwap.frontBag = this.prepBag(tdata.imgSwap.frontBag, tdata.frontImages, tdata.imgSwap.prevFrontIndex);
				}
				if (tdata.imgSwap.frontIsInGrid) {
					idx = tdata.imgSwap.frontStaticRndm;
				} else {
					idx = tdata.imgSwap.frontBag.pop();
				}
			}
			return idx;
		},
		getBackSwapIndex: function (tdata) {
			var idx = 0;
			if (!tdata.imgSwap.backIsRandom) {
				idx = tdata.imgSwap.backIsInGrid ? tdata.imgSwap.backStaticIndex : tdata.imgSwap.backIndex;
			} else {
				if (tdata.imgSwap.backBag.length === 0) {
					tdata.imgSwap.backBag = this.prepBag(tdata.imgSwap.backBag, tdata.backImages, tdata.imgSwap.prevBackIndex);
				}
				if (tdata.imgSwap.backIsInGrid) {
					idx = tdata.imgSwap.backStaticRndm;
				} else {
					idx = tdata.imgSwap.backBag.pop();
				}
			}
			return idx;
		},
		setImageProperties: function ($img, image, isBackground) {
			var css = {}, // css object to apply
                attr = {}; // attribute values to apply
			// get image source
			if (typeof (image.src) !== 'undefined') {
				if (!isBackground)
					attr.src = image.src;
				else
					css.backgroundImage = "url('" + image.src + "')";
			}
			// get alt text
			if (typeof (image.alt) !== 'undefined')
				attr.alt = image.alt;
			// set css
			if (typeof (image.css) === 'object')
				$img.css($.extend(css, image.css));
			else
				$img.css(css);
			// set attributes
			if (typeof (image.attr) === 'object')
				$img.attr($.extend(attr, image.attr));
			else
				$img.attr(attr);
		},
		action: function (tdata, $front, $back, index) {
			if (!tdata.imgSwap.doSwapFront && !tdata.imgSwap.doSwapBack)
				return;
			var isList = tdata.mode === "flip-list",
                isSlide = tdata.mode == "slide",
                swapIndex = 0,
                isReversed = isList ? tdata.listData[Math.max(index, 0)].isReversed : tdata.isReversed;
			if (isList && index == -1) {
				// flip list completed
				if (tdata.alwaysSwapFront || !isReversed) {
					if (tdata.imgSwap.doSwapFront) {
						// update the random value for grid mode
						if (tdata.imgSwap.frontBag.length === 0)
							tdata.imgSwap.frontBag = this.prepBag(tdata.imgSwap.frontBag, tdata.frontImages, tdata.imgSwap.frontStaticRndm);
						tdata.imgSwap.frontStaticRndm = tdata.imgSwap.frontBag.pop();
						// update the static index
						tdata.imgSwap.frontStaticIndex++;
						if (tdata.imgSwap.frontStaticIndex >= tdata.frontImages.length)
							tdata.imgSwap.frontStaticIndex = 0;
					}
				}
				if (tdata.alwaysSwapBack || isReversed) {
					if (tdata.imgSwap.doSwapBack) {
						// update the random value for grid mode
						if (tdata.imgSwap.backBag.length === 0)
							tdata.imgSwap.backBag = this.prepBag(tdata.imgSwap.backBag, tdata.backImages, tdata.imgSwap.backStaticRndm);
						tdata.imgSwap.backStaticRndm = tdata.imgSwap.backBag.pop();
						// update the static index
						tdata.imgSwap.backStaticIndex++;
						if (tdata.imgSwap.backStaticIndex >= tdata.backImages.length)
							tdata.imgSwap.backStaticIndex = 0;
					}
				}
				return;
			}
			var $face, // face being swapped
                $img, // image to apply values
                image,// image object to hold properties
                swap; // wrapper for setimageProperties for fade
			if (tdata.alwaysSwapFront || !isReversed) {
				if (!tdata.imgSwap.doSwapFront)
					return;
				swapIndex = this.getFrontSwapIndex(tdata);
				tdata.imgSwap.prevFrontIndex = swapIndex;
				// slide mode has a static front and back face
				$face = (tdata.mode === "slide") ? $front : $back;
				$img = $face.find(tdata.imgSwap.imageCssSelector);
				image = typeof (tdata.frontImages[swapIndex]) === "object" ? tdata.frontImages[swapIndex] : { src: tdata.frontImages[swapIndex] };
				swap = function (callback) {
					// set src, alt, css and attribute values
					var isBg = tdata.imgSwap.frontIsBackgroundImage;
					if (typeof (callback) == "function") {
						if (isBg)
							window.setTimeout(callback, 100);
						else
							$img[0].onload = callback;
					}
					defaultModules.imageSwap.setImageProperties($img, image, isBg);

				};
				if (tdata.fadeSwap) {
					$img.fadeOut(function () {
						swap(function () {
							$img.fadeIn();
						});
					});
				} else
					swap();
				// increment indexes
				tdata.imgSwap.frontIndex++;
				if (tdata.imgSwap.frontIndex >= tdata.frontImages.length)
					tdata.imgSwap.frontIndex = 0;
				if (!isList) {
					tdata.imgSwap.frontStaticIndex++;
					if (tdata.imgSwap.frontStaticIndex >= tdata.frontImages.length)
						tdata.imgSwap.frontStaticIndex = 0;
				} else {

				}
			}
			if (tdata.alwaysSwapBack || isReversed) {
				if (!tdata.imgSwap.doSwapBack)
					return;
				// get the new index
				swapIndex = this.getBackSwapIndex(tdata);
				tdata.imgSwap.prevBackIndex = swapIndex;
				// use the $face var for consistency
				$face = $back;
				$img = $face.find(tdata.imgSwap.imageCssSelector);
				image = typeof (tdata.backImages[swapIndex]) === "object" ? tdata.backImages[swapIndex] : { src: tdata.backImages[swapIndex] };
				swap = function () {
					// set src, alt, css and attribute values
					defaultModules.imageSwap.setImageProperties($img, image, tdata.imgSwap.backIsBackgroundImage);
				};
				if (tdata.fadeSwap) {
					$img.fadeOut(function () {
						swap(function () {
							$img.fadeIn();
						});
					});
				} else
					swap();
				// increment indexes
				tdata.imgSwap.backIndex++;
				if (tdata.imgSwap.backIndex >= tdata.backImages.length)
					tdata.imgSwap.backIndex = 0;
				if (!isList) {
					tdata.imgSwap.backStaticIndex++;
					if (tdata.imgSwap.backStaticIndex >= tdata.backImages.length)
						tdata.imgSwap.backStaticIndex = 0;
				} else {

				}
			}
		}
	}
};

// object to maintain timer state
$.fn.metrojs.TileTimer = function (interval, callback, repeatCount) {
	this.timerId = null;                                                        // the id of the current timeout
	this.interval = interval;                                                   // the amount of time to wait between each action call
	this.action = callback;                                                     // the method that is fired on each tick
	this.count = 0;                                                             // the number of times the action has been fired
	this.repeatCount = typeof (repeatCount) === "undefined" ? 0 : repeatCount;   // the number of times the action will be fired        
	// call the action method after a delay and call start | stop based on repeat count
	this.start = function (delay) {
		window.clearTimeout(this.timerId);
		var t = this;
		this.timerId = window.setTimeout(function () {
			t.tick.call(t, interval);
		}, delay);
	};

	this.tick = function (when) {
		this.action(this.count + 1);
		this.count++;
		// reset the loop count
		if (this.count >= MAX_LOOP_COUNT)
			this.count = 0;
		if (this.repeatCount > 0 || this.repeatCount == -1) {
			if (this.count != this.repeatCount) {
				this.start(when);
			} else
				this.stop();
		}
	}
	// clear the timer and reset the count
	this.stop = function () {
		this.timerId = window.clearTimeout(this.timerId);
		this.reset();
	};

	this.resume = function () {
		if (this.repeatCount > 0 || this.repeatCount == -1) {
			if (this.count != this.repeatCount) {
				this.start(interval);
			}
		}
	};

	// clear the timer but leave the count intact
	this.pause = function () {
		this.timerId = window.clearTimeout(this.timerId);
	};

	// reset count
	this.reset = function () {
		this.count = 0;
	};

	// reset count and timer
	this.restart = function (delay) {
		this.stop();
		this.start(delay);
	};
};
jQuery.fn.metrojs.theme = {
	loadDefaultTheme: function (stgs) {
		if (typeof (stgs) === "undefined" || stgs == null) {
			stgs = jQuery.fn.metrojs.theme.defaults;
		} else {
			var stg = jQuery.fn.metrojs.theme.defaults;
			jQuery.extend(stg, stgs);
			stgs = stg;
		}
		//get theme from local storage or set base theme
		var hasLocalStorage = typeof (window.localStorage) !== "undefined";
		var hasKeyAndValue = function (key) {
			return (typeof (window.localStorage[key]) !== "undefined" && window.localStorage[key] != null);
		};
		if (hasLocalStorage && (!hasKeyAndValue("Metro.JS.AccentColor") || !hasKeyAndValue("Metro.JS.BaseAccentColor"))) {
			//base theme
			window.localStorage["Metro.JS.AccentColor"] = stgs.accentColor;
			window.localStorage["Metro.JS.BaseAccentColor"] = stgs.baseTheme;
			jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
			jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
			if (typeof (stgs.loaded) === "function")
				stgs.loaded(stgs.baseTheme, stgs.accentColor);
			//preload light theme image
			if (typeof (stgs.preloadAltBaseTheme) !== "undefined" && stgs.preloadAltBaseTheme)
				jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
		} else {
			if (hasLocalStorage) {
				stgs.accentColor = window.localStorage["Metro.JS.AccentColor"];
				stgs.baseTheme = window.localStorage["Metro.JS.BaseAccentColor"];
				jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
				jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
				if (typeof (stgs.loaded) === "function")
					stgs.loaded(stgs.baseTheme, stgs.accentColor);
			} else {
				jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
				jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
				if (typeof (stgs.loaded) === "function")
					stgs.loaded(stgs.baseTheme, stgs.accentColor);
				//preload light theme image
				if (typeof (stgs.preloadAltBaseTheme) !== "undefined" && stgs.preloadAltBaseTheme)
					jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
			}
		}
	},
	applyTheme: function (tColor, aColor, stgs) {
		if (typeof (stgs) === "undefined" || stgs == null) {
			stgs = jQuery.fn.metrojs.theme.defaults;
		} else {
			var stg = jQuery.fn.metrojs.theme.defaults;
			stgs = jQuery.extend({}, stg, stgs);
		}

		if (typeof (tColor) !== "undefined" && tColor != null) {
			if (typeof (window.localStorage) !== "undefined") {
				window.localStorage["Metro.JS.BaseAccentColor"] = tColor;
			}
			var $theme = jQuery(stgs.baseThemeCssSelector);
			if ($theme.length > 0) {
				if (tColor == "dark")
					$theme.addClass("dark").removeClass("light");
				else if (tColor == "light")
					$theme.addClass("light").removeClass("dark");
			}
		}
		if (typeof (aColor) !== "undefined" && aColor != null) {
			if (typeof (window.localStorage) !== "undefined") {
				window.localStorage["Metro.JS.AccentColor"] = aColor;
			}
			var $accent = jQuery(stgs.accentCssSelector);
			if ($accent.length > 0) {
				var themeset = false;
				$accent.each(function () {
					jQuery(this).addClass(aColor);
					var dAccent = jQuery(this).data("accent");
					if (dAccent != aColor) {
						var cleanClass = jQuery(this).attr("class").replace(dAccent, "");
						cleanClass = cleanClass.replace(/(\s)+/, ' ');
						jQuery(this).attr("class", cleanClass);
						jQuery(this).data("accent", aColor);
						themeset = true;
					}
				});
				if (themeset && typeof (stgs.accentPicked) === "function")
					stgs.accentPicked(aColor);
			}
		}
	},
	appendAccentColors: function (stgs) {
		if (typeof (stgs) === "undefined" || stgs == null) {
			stgs = jQuery.fn.metrojs.theme.defaults;
		} else {
			var stg = jQuery.fn.metrojs.theme.defaults;
			stgs = jQuery.extend({}, stg, stgs);
		}
		var themeList = "";
		var themes = stgs.accentColors;
		var template = stgs.accentListTemplate;
		for (var i = 0; i < themes.length; i++) {
			themeList += template.replace(/\{0\}/g, themes[i]);
		}
		$(themeList).appendTo(stgs.accentListContainer);
	},
	appendBaseThemes: function (stgs) {
		if (typeof (stgs) === "undefined" || stgs == null) {
			stgs = jQuery.fn.metrojs.theme.defaults;
		} else {
			var stg = jQuery.fn.metrojs.theme.defaults;
			stgs = jQuery.extend({}, stg, stgs);
		}
		var themeList = "",
            themes = stgs.baseThemes,
            template = stgs.baseThemeListTemplate;
		for (var i = 0; i < themes.length; i++) {
			themeList += template.replace(/\{0\}/g, themes[i]);
		}
		$(themeList).appendTo(stgs.baseThemeListContainer);
	},
	// default options for theme
	defaults: {
		baseThemeCssSelector: 'body',                           // selector to place dark or light class after load or selection
		accentCssSelector: '.tiles',                            // selector to place accent color class after load or selection
		accentColor: 'blue',                                    // the default accent color. options are blue, brown, green, lime, magenta, mango, pink, purple, red, teal
		baseTheme: 'dark',                                      // the default theme color. options are dark, light
		accentColors: [
             'amber', 'blue', 'brown', 'cobalt', 'crimson', 'cyan',
             'magenta', 'lime', 'indigo', 'green', 'emerald',
             'mango', 'mauve', 'olive', 'orange', 'pink', 'red',
             'sienna', 'steel', 'teal', 'violet', 'yellow'
		],
		baseThemes: [
            'light',
            'dark'
		],
		accentListTemplate: "<li><a href='javascript:;' title='{0}' class='accent {0}'></a></li>", // template to generate accent options
		accentListContainer: "ul.theme-options,.theme-options>ul",                   // selector of container to append accents
		baseThemeListTemplate: "<li><a href='javascript:;' title='{0}' class='accent {0}'></a></li>", // template to generate accent options
		baseThemeListContainer: "ul.base-theme-options,.base-theme-options>ul"                    // selector of container to append accents
	}
};

jQuery.fn.applicationBar = function (options) {    
    /* Setup the public options for the applicationBar  */
    var stgs = typeof (jQuery.fn.metrojs.theme) !== "undefined" ? jQuery.fn.metrojs.theme.defaults : {};
    jQuery.extend(stgs, jQuery.fn.applicationBar.defaults, options);
    if (typeof (jQuery.fn.metrojs.theme) != "undefined") {
        var theme = jQuery.fn.metrojs.theme;
        if (stgs.shouldApplyTheme) {         
            theme.loadDefaultTheme(stgs);
        }
        var themeContainer = stgs.accentListContainer.replace(",", " a,") + " a";
        var themeContainerClick = function () {
            var accent = jQuery(this).attr("class").replace("accent", "").replace(" ", "");
            theme.applyTheme(null, accent, stgs);
            if (typeof (stgs.accentPicked) == "function")
                stgs.accentPicked(accent);
        };
        var baseContainer = stgs.baseThemeListContainer.replace(","," a,") + " a";
        var baseContainerClick = function () {
            var accent = jQuery(this).attr("class").replace("accent", '').replace(' ', '');
            theme.applyTheme(accent, null, stgs);
            if (typeof (stgs.themePicked) == "function")
                stgs.themePicked(accent);
        };
        if (typeof ($.fn.on) === "function") {
            $(this).on("click.appBar", themeContainer, themeContainerClick);
            $(this).on("click.appBar", baseContainer, baseContainerClick);
        } else {
            $(themeContainer).live("click.appBar", themeContainerClick);
            $(baseContainer).live("click.appBar", baseContainerClick);
        }
    }
    //this should really only run once but we can support multiple application bars
    return $(this).each(function (idx, ele) {
    	var $this = $(ele),
            data = $.extend({}, stgs);
    	if(data.collapseHeight == "auto")
        	data.collapseHeight = $(this).outerHeight();

        //unfortunately we have to sniff out mobile browsers because of the inconsistent implementation of position:fixed
        //most desktop methods return false positives on a mobile
        //todo: find/come up with a better fixed position test
        if (navigator.userAgent.match(/(Android|webOS|iPhone|iPod|BlackBerry|PIE|IEMobile)/i)) {
            // IEMobile10 supports position:fixed. This should cover up to IE20 or at least until fixed positioning gets sorted            
            // let iOS 5+ pass as well, hopefully by iOS 9 fixed pos will be standard :/
            if (!navigator.userAgent.match(/(IEMobile\/1)/i) && !navigator.userAgent.match(/(iPhone OS [56789])/i)) {
                $this.css({ position: 'absolute', bottom: '0px' });
            }
        }
        data.slideOpen = function () {
            if (!$this.hasClass("expanded"))
                data.animateAppBar(false);
        };
        data.slideClosed = function () {
            if ($this.hasClass("expanded"))
                data.animateAppBar(true);
        };
        data.animateAppBar = function (isExpanded) {
        	var hgt = isExpanded ? data.collapseHeight : data.expandHeight,
        		t;
        	if (isExpanded) {
        		t = stgs.collapse();
        		if (typeof (t) != "undefined" && t === false)
        			return;
        		$this.removeClass("expanded");
        	} else {
        		t = stgs.expand();
        		if (typeof (t) != "undefined" && t === false)
					return
        		if (!$this.hasClass("expanded"))
        			$this.addClass("expanded");
        	}
            $this.stop().animate({ height: hgt }, { duration: data.duration }, function () {
            	if (isExpanded) {
            		stgs.collapsed();
            	} else {
            		stgs.expanded();
            	}
            });
        };
        $this.data("ApplicationBar", data)

        $this.find(stgs.handleSelector).click(function () {
            data.animateAppBar($this.hasClass("expanded"));
        });

        if (data.bindKeyboard == true) {
            jQuery(document.documentElement).keyup(function (event) {
                // handle cursor keys
                if (event.keyCode == 38) {
                    // expand
                    if (event.target && event.target.tagName.match(/INPUT|TEXTAREA|SELECT/i) == null) {
                        if (!$this.hasClass("expanded")) {
                            data.animateAppBar(false);
                        }
                    }
                    
                } else if (event.keyCode == 40) {
                    // collapse
                    if (event.target && event.target.tagName.match(/INPUT|TEXTAREA|SELECT/i) == null) {
                        if ($this.hasClass("expanded")) {
                            data.animateAppBar(true);
                        }
                    }
                }
            });            
        }
    });
};

// default options for applicationBar, the theme defaults are merged with this object when the applicationBar function is called
jQuery.fn.applicationBar.defaults = {
    applyTheme: true,                                       // should the theme be loaded from local storage and applied to the page
    themePicked: function (tColor) { },                     // called when a new theme is chosen. the chosen theme (dark | light)
    accentPicked: function (aColor) { },                    // called when a new accent is chosen. the chosen theme (blue, mango, purple, etc.)
    loaded: function (tColor, aColor) { },                  // called if applyTheme is true onload when a theme has been loaded from local storage or overridden by options
    duration: 300,                                          // how fast should animation be performed, in milliseconds
    expandHeight: "320px",                                  // height the application bar to expand to when opened
    collapseHeight: "auto",                                 // height the application bar will collapse back to when closed
    bindKeyboard: true,                                     // should up and down keys on keyborad be bound to the application bar
    handleSelector: "a.etc",
    metroLightUrl: 'images/metroIcons_light.jpg',  // the url for the metro light icons (only needed if preload 'preloadAltBaseTheme' is true)
    metroDarkUrl: 'images/metroIcons.jpg',         // the url for the metro dark icons (only needed if preload 'preloadAltBaseTheme' is true)
    preloadAltBaseTheme: false,                             // should the applicationBar icons be pre loaded for the alternate theme to enable fast theme switching
    expand: function () { },								// called before expanding. return false to cancel
    collapse: function() { },								// called before collapsing. return false to cancel
    expanded: function () { },								// called after expanding
    collapsed: function () { }								// called agter collapsing
};
/* Preload Images */
// Usage: jQuery(['img1.jpg', { src: 'img2.jpg' }]).metrojs.preloadImages(function(){ ... });
// Callback function gets called after all images are preloaded
$.fn.metrojs.preloadImages = function (callback) {
        var checklist = $(this).toArray();
        var $img = $("<img style='display:none;' />").appendTo("body");
        $(this).each(function () {
                var src = this;
                if (typeof(this) == "object")
                        src = this.src;
                $img.attr({ src: src }).load(function() {
                        for (var i = 0; i < checklist.length; i++) {
                                if (checklist[i] == element) {
                                        checklist.splice(i, 1);
                                }
                        }
                        if (checklist.length == 0) {
                                callback();
                        }
                });
               
        });
    $img.remove();
};
// object used for compatibility checks
$.fn.metrojs.MetroModernizr = function (stgs) {
    if(typeof(stgs) === "undefined") {
                stgs = { useHardwareAccel: true, useModernizr: typeof(window.Modernizr) !== "undefined" };
        }
    this.isOldJQuery =  /^1\.[0123]/.test($.fn.jquery),
    this.isOldAndroid = (function(){
        try{
            var ua = navigator.userAgent;        
            if( ua.indexOf("Android") >= 0 )
            {
                var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
                if (androidversion < 2.3)
                    return true;
            }
        }catch(err){ $.error(err); }
        return false;
    })();
    this.canTransform = false;
    this.canTransition = false;
    this.canTransform3d = false;
    this.canAnimate = false;
    this.canTouch = false;
    this.canFlip3d = stgs.useHardwareAccel;
    if (stgs.useHardwareAccel == true) {
        if (stgs.useModernizr == false) {
            //determine if the browser supports the neccessary accelerated features
            if (typeof (window.MetroModernizr) !== "undefined") {
                this.canTransform = window.MetroModernizr.canTransform;
                this.canTransition = window.MetroModernizr.canTransition;
                this.canTransform3d = window.MetroModernizr.canTransform3d;
                this.canAnimate = window.MetroModernizr.canAnimate;
                this.canTouch = window.MetroModernizr.canTouch;
            } else {
                window.MetroModernizr = {};
                /***** check for browser capabilities credit: modernizr-1.7 http://modernizr.com/ *****/
                var mod = 'metromodernizr';
                var docElement = document.documentElement;
                var docHead = document.head || document.getElementsByTagName('head')[0];
                var modElem = document.createElement(mod);
                var m_style = modElem.style;
                var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
                var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
                var test_props = function (props, callback) {
                    for (var i in props) {
                        if (m_style[props[i]] !== undefined && (!callback || callback(props[i], modElem))) {
                            return true;
                        }
                    }
                };
                var test_props_all = function (prop, callback) {
                    var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props = (prop + ' ' + domPrefixes.join(uc_prop + ' ') + uc_prop).split(' ');
                    return !!test_props(props, callback);
                };
                var test_3d = function () {
                    var ret = !!test_props(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']);
                    if (ret && 'webkitPerspective' in docElement.style) {
                        // Webkit allows this media query to succeed only if the feature is enabled.
                        // '@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){ ... }'
                        ret = testMediaQuery(['@media (',prefixes.join('transform-3d),('),mod,')','{#metromodernizr{left:9px;position:absolute;height:3px;}}'].join(''), function(div){
                            return div.offsetHeight === 3 && div.offsetLeft === 9;
                        });
                    }
                    return ret;
                };
                var testMediaQuery = function (mq, predicate) {
                    var st = document.createElement('style'),
                        div = document.createElement('div'),
                        ret;
                    st.textContent = mq;
                    docHead.appendChild(st);
                    div.id = mod;
                    docElement.appendChild(div);
                    ret = predicate(div);
                    st.parentNode.removeChild(st);
                    div.parentNode.removeChild(div);
                    return !!ret;
                };
                var test_touch = function() {
                    return canTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ||
                        (window.PointerEvent && window.navigator.maxTouchPoints > 0) ||
                        (window.MSPointerEvent && window.navigator.msMaxTouchPoints > 0) ||
                        testMediaQuery(['@media (',prefixes.join('touch-enabled),('),mod,')','{#metromodernizr{top:9px;position:absolute}}'].join(''), function(div){
                            return div.offsetTop === 9;
                        });
                };
                this.canTransform = !!test_props(['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform']);
                this.canTransition = test_props_all('transitionProperty');
                this.canTransform3d = test_3d();
                this.canAnimate = test_props_all('animationName');
                this.canTouch = test_touch();
                window.MetroModernizr.canTransform = this.canTransform;
                window.MetroModernizr.canTransition = this.canTransition;
                window.MetroModernizr.canTransform3d = this.canTransform3d;
                window.MetroModernizr.canAnimate = this.canAnimate;
                window.MetroModernizr.canTouch = this.canTouch;
                docElement = null;
                docHead = null;
                modElem = null;
                m_style = null;
            }
        } else {
            this.canTransform = $("html").hasClass("csstransforms");
            this.canTransition = $("html").hasClass("csstransitions");
            this.canTransform3d = $("html").hasClass("csstransforms3d");
            this.canAnimate = $("html").hasClass("cssanimations");
            this.canTouch = $("html").hasClass("touch") || (typeof(window.navigator.msMaxTouchPoints) !== "undefined" && window.navigator.msMaxTouchPoints > 0);
        }
    }
    this.canFlip3d = this.canFlip3d && this.canAnimate && this.canTransform && this.canTransform3d;
};

})(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./node_modules/rickshaw/rickshaw.css":
/***/ function(module, exports) {

module.exports = ".rickshaw_graph .detail {\n\tpointer-events: none;\n\tposition: absolute;\n\ttop: 0;\n\tz-index: 2;\n\tbackground: rgba(0, 0, 0, 0.1);\n\tbottom: 0;\n\twidth: 1px;\n\ttransition: opacity 0.25s linear;\n\t-moz-transition: opacity 0.25s linear;\n\t-o-transition: opacity 0.25s linear;\n\t-webkit-transition: opacity 0.25s linear;\n}\n.rickshaw_graph .detail.inactive {\n\topacity: 0;\n}\n.rickshaw_graph .detail .item.active {\n\topacity: 1;\n}\n.rickshaw_graph .detail .x_label {\n\tfont-family: Arial, sans-serif;\n\tborder-radius: 3px;\n\tpadding: 6px;\n\topacity: 0.5;\n\tborder: 1px solid #e0e0e0;\n\tfont-size: 12px;\n\tposition: absolute;\n\tbackground: white;\n\twhite-space: nowrap;\n}\n.rickshaw_graph .detail .x_label.left {\n\tleft: 0;\n}\n.rickshaw_graph .detail .x_label.right {\n\tright: 0;\n}\n.rickshaw_graph .detail .item {\n\tposition: absolute;\n\tz-index: 2;\n\tborder-radius: 3px;\n\tpadding: 0.25em;\n\tfont-size: 12px;\n\tfont-family: Arial, sans-serif;\n\topacity: 0;\n\tbackground: rgba(0, 0, 0, 0.4);\n\tcolor: white;\n\tborder: 1px solid rgba(0, 0, 0, 0.4);\n\tmargin-left: 1em;\n\tmargin-right: 1em;\n\tmargin-top: -1em;\n\twhite-space: nowrap;\n}\n.rickshaw_graph .detail .item.left {\n\tleft: 0;\n}\n.rickshaw_graph .detail .item.right {\n\tright: 0;\n}\n.rickshaw_graph .detail .item.active {\n\topacity: 1;\n\tbackground: rgba(0, 0, 0, 0.8);\n}\n.rickshaw_graph .detail .item:after {\n\tposition: absolute;\n\tdisplay: block;\n\twidth: 0;\n\theight: 0;\n\n\tcontent: \"\";\n\n\tborder: 5px solid transparent;\n}\n.rickshaw_graph .detail .item.left:after {\n\ttop: 1em;\n\tleft: -5px;\n\tmargin-top: -5px;\n\tborder-right-color: rgba(0, 0, 0, 0.8);\n\tborder-left-width: 0;\n}\n.rickshaw_graph .detail .item.right:after {\n\ttop: 1em;\n\tright: -5px;\n\tmargin-top: -5px;\n\tborder-left-color: rgba(0, 0, 0, 0.8);\n\tborder-right-width: 0;\n}\n.rickshaw_graph .detail .dot {\n\twidth: 4px;\n\theight: 4px;\n\tmargin-left: -3px;\n\tmargin-top: -3.5px;\n\tborder-radius: 5px;\n\tposition: absolute;\n\tbox-shadow: 0 0 2px rgba(0, 0, 0, 0.6);\n\tbox-sizing: content-box;\n\t-moz-box-sizing: content-box;\n\tbackground: white;\n\tborder-width: 2px;\n\tborder-style: solid;\n\tdisplay: none;\n\tbackground-clip: padding-box;\n}\n.rickshaw_graph .detail .dot.active {\n\tdisplay: block;\n}\n/* graph */\n\n.rickshaw_graph {\n\tposition: relative;\n}\n.rickshaw_graph svg {\n\tdisplay: block;\t\n\toverflow: hidden;\n}\n\n/* ticks */\n\n.rickshaw_graph .x_tick {\n\tposition: absolute;\n\ttop: 0;\n\tbottom: 0;\n\twidth: 0px;\n\tborder-left: 1px dotted rgba(0, 0, 0, 0.2);\n\tpointer-events: none;\n}\n.rickshaw_graph .x_tick .title {\n\tposition: absolute;\n\tfont-size: 12px;\n\tfont-family: Arial, sans-serif;\n\topacity: 0.5;\n\twhite-space: nowrap;\n\tmargin-left: 3px;\n\tbottom: 1px;\n}\n\n/* annotations */\n\n.rickshaw_annotation_timeline {\n\theight: 1px;\n\tborder-top: 1px solid #e0e0e0;\n\tmargin-top: 10px;\n\tposition: relative;\n}\n.rickshaw_annotation_timeline .annotation {\n\tposition: absolute;\n\theight: 6px;\n\twidth: 6px;\n\tmargin-left: -2px;\n\ttop: -3px;\n\tborder-radius: 5px;\n\tbackground-color: rgba(0, 0, 0, 0.25);\n}\n.rickshaw_graph .annotation_line {\n\tposition: absolute;\n\ttop: 0;\n\tbottom: -6px;\n\twidth: 0px;\n\tborder-left: 2px solid rgba(0, 0, 0, 0.3);\n\tdisplay: none;\n}\n.rickshaw_graph .annotation_line.active {\n\tdisplay: block;\n}\n\n.rickshaw_graph .annotation_range {\n        background: rgba(0, 0, 0, 0.1);\n        display: none;\n        position: absolute;\n        top: 0;\n        bottom: -6px;\n}\n.rickshaw_graph .annotation_range.active {\n        display: block;\n}\n.rickshaw_graph .annotation_range.active.offscreen {\n        display: none;\n}\n\n.rickshaw_annotation_timeline .annotation .content {\n\tbackground: white;\n\tcolor: black;\n\topacity: 0.9;\n\tpadding: 5px 5px;\n\tbox-shadow: 0 0 2px rgba(0, 0, 0, 0.8);\n\tborder-radius: 3px;\n\tposition: relative;\n\tz-index: 20;\n\tfont-size: 12px;\n\tpadding: 6px 8px 8px;\n\ttop: 18px;\n\tleft: -11px;\n\twidth: 160px;\n\tdisplay: none;\n\tcursor: pointer;\n}\n.rickshaw_annotation_timeline .annotation .content:before {\n\tcontent: \"\\25B2\";\n\tposition: absolute;\n\ttop: -11px;\n\tcolor: white;\n\ttext-shadow: 0 -1px 1px rgba(0, 0, 0, 0.8);\n}\n.rickshaw_annotation_timeline .annotation.active,\n.rickshaw_annotation_timeline .annotation:hover {\n\tbackground-color: rgba(0, 0, 0, 0.8);\n\tcursor: none;\n}\n.rickshaw_annotation_timeline .annotation .content:hover {\n\tz-index: 50;\n}\n.rickshaw_annotation_timeline .annotation.active .content {\n\tdisplay: block;\n}\n.rickshaw_annotation_timeline .annotation:hover .content {\n\tdisplay: block;\n\tz-index: 50;\n}\n.rickshaw_graph .y_axis,\n.rickshaw_graph  .x_axis_d3 {\n\tfill: none;\n}\n.rickshaw_graph .y_ticks .tick line,\n.rickshaw_graph .x_ticks_d3 .tick {\n\tstroke: rgba(0, 0, 0, 0.16);\n\tstroke-width: 2px;\n\tshape-rendering: crisp-edges;\n\tpointer-events: none;\n}\n.rickshaw_graph .y_grid .tick,\n.rickshaw_graph .x_grid_d3 .tick {\n\tz-index: -1;\n\tstroke: rgba(0, 0, 0, 0.20);\n\tstroke-width: 1px;\n\tstroke-dasharray: 1 1;\n}\n.rickshaw_graph .y_grid .tick[data-y-value=\"0\"] {\n\tstroke-dasharray: 1 0;\n}\n.rickshaw_graph .y_grid path,\n.rickshaw_graph .x_grid_d3 path  {\n\tfill: none;\n\tstroke: none;\n}\n.rickshaw_graph .y_ticks path,\n.rickshaw_graph .x_ticks_d3 path {\n\tfill: none;\n\tstroke: #808080;\n}\n.rickshaw_graph .y_ticks text,\n.rickshaw_graph .x_ticks_d3 text {\n\topacity: 0.5;\n\tfont-size: 12px;\n\tpointer-events: none;\n}\n.rickshaw_graph .x_tick.glow .title,\n.rickshaw_graph .y_ticks.glow text {\n\tfill: black;\n\tcolor: black;\n\ttext-shadow: \n\t\t-1px 1px 0 rgba(255, 255, 255, 0.1),\n\t\t1px -1px 0 rgba(255, 255, 255, 0.1),\n\t\t1px 1px 0 rgba(255, 255, 255, 0.1),\n\t\t0px 1px 0 rgba(255, 255, 255, 0.1),\n\t\t0px -1px 0 rgba(255, 255, 255, 0.1),\n\t\t1px 0px 0 rgba(255, 255, 255, 0.1),\n\t\t-1px 0px 0 rgba(255, 255, 255, 0.1),\n\t\t-1px -1px 0 rgba(255, 255, 255, 0.1);\n}\n.rickshaw_graph .x_tick.inverse .title,\n.rickshaw_graph .y_ticks.inverse text {\n\tfill: white;\n\tcolor: white;\n\ttext-shadow: \n\t\t-1px 1px 0 rgba(0, 0, 0, 0.8),\n\t\t1px -1px 0 rgba(0, 0, 0, 0.8),\n\t\t1px 1px 0 rgba(0, 0, 0, 0.8),\n\t\t0px 1px 0 rgba(0, 0, 0, 0.8),\n\t\t0px -1px 0 rgba(0, 0, 0, 0.8),\n\t\t1px 0px 0 rgba(0, 0, 0, 0.8),\n\t\t-1px 0px 0 rgba(0, 0, 0, 0.8),\n\t\t-1px -1px 0 rgba(0, 0, 0, 0.8);\n}\n.rickshaw_legend {\n\tfont-family: Arial;\n\tfont-size: 12px;\n\tcolor: white;\n\tbackground: #404040;\n\tdisplay: inline-block;\n\tpadding: 12px 5px; \n\tborder-radius: 2px;\n\tposition: relative;\n}\n.rickshaw_legend:hover {\n\tz-index: 10;\n}\n.rickshaw_legend .swatch {\n\twidth: 10px;\n\theight: 10px;\n\tborder: 1px solid rgba(0, 0, 0, 0.2);\n}\n.rickshaw_legend .line {\n\tclear: both;\n\tline-height: 140%;\n\tpadding-right: 15px;\n}\n.rickshaw_legend .line .swatch {\n\tdisplay: inline-block;\n\tmargin-right: 3px;\n\tborder-radius: 2px;\n}\n.rickshaw_legend .label {\n\tmargin: 0;\n\twhite-space: nowrap;\n\tdisplay: inline;\n\tfont-size: inherit;\n\tbackground-color: transparent;\n\tcolor: inherit;\n\tfont-weight: normal;\n\tline-height: normal;\n\tpadding: 0px;\n\ttext-shadow: none;\n}\n.rickshaw_legend .action:hover {\n\topacity: 0.6;\n}\n.rickshaw_legend .action {\n\tmargin-right: 0.2em;\n\tfont-size: 10px;\n\topacity: 0.2;\n\tcursor: pointer;\n\tfont-size: 14px;\n}\n.rickshaw_legend .line.disabled {\n\topacity: 0.4;\n}\n.rickshaw_legend ul {\n\tlist-style-type: none;\n\tmargin: 0;\n\tpadding: 0;\n\tmargin: 2px;\n\tcursor: pointer;\n}\n.rickshaw_legend li {\n\tpadding: 0 0 0 2px;\n\tmin-width: 80px;\n\twhite-space: nowrap;\n}\n.rickshaw_legend li:hover {\n\tbackground: rgba(255, 255, 255, 0.08);\n\tborder-radius: 3px;\n}\n.rickshaw_legend li:active {\n\tbackground: rgba(255, 255, 255, 0.2);\n\tborder-radius: 3px;\n}\n"

/***/ },

/***/ "./node_modules/rickshaw/rickshaw.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery, __webpack_provided_window_dot_jQuery) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__("./node_modules/d3/d3.js")], __WEBPACK_AMD_DEFINE_RESULT__ = function (d3) {
            return (root.Rickshaw = factory(d3));
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
        module.exports = factory(require('d3'));
    } else {
        root.Rickshaw = factory(d3);
    }
}(this, function (d3) {
/* jshint -W079 */ 

var Rickshaw = {

	namespace: function(namespace, obj) {

		var parts = namespace.split('.');

		var parent = Rickshaw;

		for(var i = 1, length = parts.length; i < length; i++) {
			var currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}
		return parent;
	},

	keys: function(obj) {
		var keys = [];
		for (var key in obj) keys.push(key);
		return keys;
	},

	extend: function(destination, source) {

		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	},

	clone: function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
};
/* Adapted from https://github.com/Jakobo/PTClass */

/*
Copyright (c) 2005-2010 Sam Stephenson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/* Based on Alex Arnell's inheritance implementation. */
/** section: Language
 * class Class
 *
 *  Manages Prototype's class-based OOP system.
 *
 *  Refer to Prototype's web site for a [tutorial on classes and
 *  inheritance](http://prototypejs.org/learn/class-inheritance).
**/
(function(globalContext) {
/* ------------------------------------ */
/* Import from object.js                */
/* ------------------------------------ */
var _toString = Object.prototype.toString,
    NULL_TYPE = 'Null',
    UNDEFINED_TYPE = 'Undefined',
    BOOLEAN_TYPE = 'Boolean',
    NUMBER_TYPE = 'Number',
    STRING_TYPE = 'String',
    OBJECT_TYPE = 'Object',
    FUNCTION_CLASS = '[object Function]';
function isFunction(object) {
  return _toString.call(object) === FUNCTION_CLASS;
}
function extend(destination, source) {
  for (var property in source) if (source.hasOwnProperty(property)) // modify protect primitive slaughter
    destination[property] = source[property];
  return destination;
}
function keys(object) {
  if (Type(object) !== OBJECT_TYPE) { throw new TypeError(); }
  var results = [];
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      results.push(property);
    }
  }
  return results;
}
function Type(o) {
  switch(o) {
    case null: return NULL_TYPE;
    case (void 0): return UNDEFINED_TYPE;
  }
  var type = typeof o;
  switch(type) {
    case 'boolean': return BOOLEAN_TYPE;
    case 'number':  return NUMBER_TYPE;
    case 'string':  return STRING_TYPE;
  }
  return OBJECT_TYPE;
}
function isUndefined(object) {
  return typeof object === "undefined";
}
/* ------------------------------------ */
/* Import from Function.js              */
/* ------------------------------------ */
var slice = Array.prototype.slice;
function argumentNames(fn) {
  var names = fn.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
    .replace(/\s+/g, '').split(',');
  return names.length == 1 && !names[0] ? [] : names;
}
function wrap(fn, wrapper) {
  var __method = fn;
  return function() {
    var a = update([bind(__method, this)], arguments);
    return wrapper.apply(this, a);
  }
}
function update(array, args) {
  var arrayLength = array.length, length = args.length;
  while (length--) array[arrayLength + length] = args[length];
  return array;
}
function merge(array, args) {
  array = slice.call(array, 0);
  return update(array, args);
}
function bind(fn, context) {
  if (arguments.length < 2 && isUndefined(arguments[0])) return this;
  var __method = fn, args = slice.call(arguments, 2);
  return function() {
    var a = merge(args, arguments);
    return __method.apply(context, a);
  }
}

/* ------------------------------------ */
/* Import from Prototype.js             */
/* ------------------------------------ */
var emptyFunction = function(){};

var Class = (function() {
  
  // Some versions of JScript fail to enumerate over properties, names of which 
  // correspond to non-enumerable properties in the prototype chain
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      // check actual property name, so that it works with augmented Object.prototype
      if (p === 'toString') return false;
    }
    return true;
  })();
  
  function subclass() {};
  function create() {
    var parent = null, properties = [].slice.apply(arguments);
    if (isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      try { parent.subclasses.push(klass) } catch(e) {}
    }

    for (var i = 0, length = properties.length; i < length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = keys(source);

    // IE6 doesn't enumerate `toString` and `valueOf` (among other built-in `Object.prototype`) properties,
    // Force copy if they're not Object.prototype ones.
    // Do not copy other Object.prototype.* for performance reasons
    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && isFunction(value) &&
          argumentNames(value)[0] == "$super") {
        var method = value;
        value = wrap((function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property), method);

        value.valueOf = bind(method.valueOf, method);
        value.toString = bind(method.toString, method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();

if (globalContext.exports) {
  globalContext.exports.Class = Class;
}
else {
  globalContext.Class = Class;
}
})(Rickshaw);
Rickshaw.namespace('Rickshaw.Compat.ClassList');

Rickshaw.Compat.ClassList = function() {

	/* adapted from http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

	if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

	(function (view) {

	"use strict";

	var
		  classListProp = "classList"
		, protoProp = "prototype"
		, elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
		, objCtr = Object
		, strTrim = String[protoProp].trim || function () {
			return this.replace(/^\s+|\s+$/g, "");
		}
		, arrIndexOf = Array[protoProp].indexOf || function (item) {
			var
				  i = 0
				, len = this.length
			;
			for (; i < len; i++) {
				if (i in this && this[i] === item) {
					return i;
				}
			}
			return -1;
		}
		// Vendors: please allow content code to instantiate DOMExceptions
		, DOMEx = function (type, message) {
			this.name = type;
			this.code = DOMException[type];
			this.message = message;
		}
		, checkTokenAndGetIndex = function (classList, token) {
			if (token === "") {
				throw new DOMEx(
					  "SYNTAX_ERR"
					, "An invalid or illegal string was specified"
				);
			}
			if (/\s/.test(token)) {
				throw new DOMEx(
					  "INVALID_CHARACTER_ERR"
					, "String contains an invalid character"
				);
			}
			return arrIndexOf.call(classList, token);
		}
		, ClassList = function (elem) {
			var
				  trimmedClasses = strTrim.call(elem.className)
				, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
				, i = 0
				, len = classes.length
			;
			for (; i < len; i++) {
				this.push(classes[i]);
			}
			this._updateClassName = function () {
				elem.className = this.toString();
			};
		}
		, classListProto = ClassList[protoProp] = []
		, classListGetter = function () {
			return new ClassList(this);
		}
	;
	// Most DOMException implementations don't allow calling DOMException's toString()
	// on non-DOMExceptions. Error's toString() is sufficient here.
	DOMEx[protoProp] = Error[protoProp];
	classListProto.item = function (i) {
		return this[i] || null;
	};
	classListProto.contains = function (token) {
		token += "";
		return checkTokenAndGetIndex(this, token) !== -1;
	};
	classListProto.add = function (token) {
		token += "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			this._updateClassName();
		}
	};
	classListProto.remove = function (token) {
		token += "";
		var index = checkTokenAndGetIndex(this, token);
		if (index !== -1) {
			this.splice(index, 1);
			this._updateClassName();
		}
	};
	classListProto.toggle = function (token) {
		token += "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.add(token);
		} else {
			this.remove(token);
		}
	};
	classListProto.toString = function () {
		return this.join(" ");
	};

	if (objCtr.defineProperty) {
		var classListPropDesc = {
			  get: classListGetter
			, enumerable: true
			, configurable: true
		};
		try {
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		} catch (ex) { // IE 8 doesn't support enumerable:true
			if (ex.number === -0x7FF5EC54) {
				classListPropDesc.enumerable = false;
				objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
			}
		}
	} else if (objCtr[protoProp].__defineGetter__) {
		elemCtrProto.__defineGetter__(classListProp, classListGetter);
	}

	}(window));

	}
};

if ( (typeof RICKSHAW_NO_COMPAT !== "undefined" && !RICKSHAW_NO_COMPAT) || typeof RICKSHAW_NO_COMPAT === "undefined") {
	new Rickshaw.Compat.ClassList();
}
Rickshaw.namespace('Rickshaw.Graph');

Rickshaw.Graph = function(args) {

	var self = this;

	this.initialize = function(args) {

		if (!args.element) throw "Rickshaw.Graph needs a reference to an element";
		if (args.element.nodeType !== 1) throw "Rickshaw.Graph element was defined but not an HTML element";

		this.element = args.element;
		this.series = args.series;
		this.window = {};

		this.updateCallbacks = [];
		this.configureCallbacks = [];

		this.defaults = {
			interpolation: 'cardinal',
			offset: 'zero',
			min: undefined,
			max: undefined,
			preserve: false,
			xScale: undefined,
			yScale: undefined,
			stack: true
		};

		this._loadRenderers();
		this.configure(args);
		this.validateSeries(args.series);

		this.series.active = function() { return self.series.filter( function(s) { return !s.disabled } ) };
		this.setSize({ width: args.width, height: args.height });
		this.element.classList.add('rickshaw_graph');

		this.vis = d3.select(this.element)
			.append("svg:svg")
			.attr('width', this.width)
			.attr('height', this.height);

		this.discoverRange();
	};

	this._loadRenderers = function() {

		for (var name in Rickshaw.Graph.Renderer) {
			if (!name || !Rickshaw.Graph.Renderer.hasOwnProperty(name)) continue;
			var r = Rickshaw.Graph.Renderer[name];
			if (!r || !r.prototype || !r.prototype.render) continue;
			self.registerRenderer(new r( { graph: self } ));
		}
	};

	this.validateSeries = function(series) {

		if (!Array.isArray(series) && !(series instanceof Rickshaw.Series)) {
			var seriesSignature = Object.prototype.toString.apply(series);
			throw "series is not an array: " + seriesSignature;
		}

		var pointsCount;

		series.forEach( function(s) {

			if (!(s instanceof Object)) {
				throw "series element is not an object: " + s;
			}
			if (!(s.data)) {
				throw "series has no data: " + JSON.stringify(s);
			}
			if (!Array.isArray(s.data)) {
				throw "series data is not an array: " + JSON.stringify(s.data);
			}
			
			if (s.data.length > 0) {
				var x = s.data[0].x;
				var y = s.data[0].y;

				if (typeof x != 'number' || ( typeof y != 'number' && y !== null ) ) {
					throw "x and y properties of points should be numbers instead of " +
						(typeof x) + " and " + (typeof y);
				}
			}

			if (s.data.length >= 3) {
				// probe to sanity check sort order
				if (s.data[2].x < s.data[1].x || s.data[1].x < s.data[0].x || s.data[s.data.length - 1].x < s.data[0].x) {
					throw "series data needs to be sorted on x values for series name: " + s.name;
				}
			}

		}, this );
	};

	this.dataDomain = function() {

		var data = this.series.map( function(s) { return s.data } );

		var min = d3.min( data.map( function(d) { return d[0].x } ) );
		var max = d3.max( data.map( function(d) { return d[d.length - 1].x } ) );

		return [min, max];
	};

	this.discoverRange = function() {

		var domain = this.renderer.domain();

		// this.*Scale is coming from the configuration dictionary
		// which may be referenced by the Graph creator, or shared
		// with other Graphs. We need to ensure we copy the scale
		// so that our mutations do not change the object given to us.
		// Hence the .copy()
		this.x = (this.xScale || d3.scale.linear()).copy().domain(domain.x).range([0, this.width]);
		this.y = (this.yScale || d3.scale.linear()).copy().domain(domain.y).range([this.height, 0]);

		this.x.magnitude = d3.scale.linear()
			.domain([domain.x[0] - domain.x[0], domain.x[1] - domain.x[0]])
			.range([0, this.width]);

		this.y.magnitude = d3.scale.linear()
			.domain([domain.y[0] - domain.y[0], domain.y[1] - domain.y[0]])
			.range([0, this.height]);
	};

	this.render = function() {

		var stackedData = this.stackData();
		this.discoverRange();

		this.renderer.render();

		this.updateCallbacks.forEach( function(callback) {
			callback();
		} );

	};

	this.update = this.render;

	this.stackData = function() {

		var data = this.series.active()
			.map( function(d) { return d.data } )
			.map( function(d) { return d.filter( function(d) { return this._slice(d) }, this ) }, this);

		var preserve = this.preserve;
		if (!preserve) {
			this.series.forEach( function(series) {
				if (series.scale) {
					// data must be preserved when a scale is used
					preserve = true;
				}
			} );
		}

		data = preserve ? Rickshaw.clone(data) : data;

		this.series.active().forEach( function(series, index) {
			if (series.scale) {
				// apply scale to each series
				var seriesData = data[index];
				if(seriesData) {
					seriesData.forEach( function(d) {
						d.y = series.scale(d.y);
					} );
				}
			}
		} );

		this.stackData.hooks.data.forEach( function(entry) {
			data = entry.f.apply(self, [data]);
		} );

		var stackedData;

		if (!this.renderer.unstack) {

			this._validateStackable();

			var layout = d3.layout.stack();
			layout.offset( self.offset );
			stackedData = layout(data);
		}

		stackedData = stackedData || data;

		if (this.renderer.unstack) {
			stackedData.forEach( function(seriesData) {
				seriesData.forEach( function(d) {
					d.y0 = d.y0 === undefined ? 0 : d.y0;
				} );
			} );
		}

		this.stackData.hooks.after.forEach( function(entry) {
			stackedData = entry.f.apply(self, [data]);
		} );

		var i = 0;
		this.series.forEach( function(series) {
			if (series.disabled) return;
			series.stack = stackedData[i++];
		} );

		this.stackedData = stackedData;
		return stackedData;
	};

	this._validateStackable = function() {

		var series = this.series;
		var pointsCount;

		series.forEach( function(s) {

			pointsCount = pointsCount || s.data.length;

			if (pointsCount && s.data.length != pointsCount) {
				throw "stacked series cannot have differing numbers of points: " +
					pointsCount + " vs " + s.data.length + "; see Rickshaw.Series.fill()";
			}

		}, this );
	};

	this.stackData.hooks = { data: [], after: [] };

	this._slice = function(d) {

		if (this.window.xMin || this.window.xMax) {

			var isInRange = true;

			if (this.window.xMin && d.x < this.window.xMin) isInRange = false;
			if (this.window.xMax && d.x > this.window.xMax) isInRange = false;

			return isInRange;
		}

		return true;
	};

	this.onUpdate = function(callback) {
		this.updateCallbacks.push(callback);
	};

	this.onConfigure = function(callback) {
		this.configureCallbacks.push(callback);
	};

	this.registerRenderer = function(renderer) {
		this._renderers = this._renderers || {};
		this._renderers[renderer.name] = renderer;
	};

	this.configure = function(args) {

		this.config = this.config || {};

		if (args.width || args.height) {
			this.setSize(args);
		}

		Rickshaw.keys(this.defaults).forEach( function(k) {
			this.config[k] = k in args ? args[k]
				: k in this ? this[k]
				: this.defaults[k];
		}, this );

		Rickshaw.keys(this.config).forEach( function(k) {
			this[k] = this.config[k];
		}, this );

		if ('stack' in args) args.unstack = !args.stack;

		var renderer = args.renderer || (this.renderer && this.renderer.name) || 'stack';
		this.setRenderer(renderer, args);

		this.configureCallbacks.forEach( function(callback) {
			callback(args);
		} );
	};

	this.setRenderer = function(r, args) {
		if (typeof r == 'function') {
			this.renderer = new r( { graph: self } );
			this.registerRenderer(this.renderer);
		} else {
			if (!this._renderers[r]) {
				throw "couldn't find renderer " + r;
			}
			this.renderer = this._renderers[r];
		}

		if (typeof args == 'object') {
			this.renderer.configure(args);
		}
	};

	this.setSize = function(args) {

		args = args || {};

		if (typeof window !== undefined) {
			var style = window.getComputedStyle(this.element, null);
			var elementWidth = parseInt(style.getPropertyValue('width'), 10);
			var elementHeight = parseInt(style.getPropertyValue('height'), 10);
		}

		this.width = args.width || elementWidth || 400;
		this.height = args.height || elementHeight || 250;

		this.vis && this.vis
			.attr('width', this.width)
			.attr('height', this.height);
	};

	this.initialize(args);
};
Rickshaw.namespace('Rickshaw.Fixtures.Color');

Rickshaw.Fixtures.Color = function() {

	this.schemes = {};

	this.schemes.spectrum14 = [
		'#ecb796',
		'#dc8f70',
		'#b2a470',
		'#92875a',
		'#716c49',
		'#d2ed82',
		'#bbe468',
		'#a1d05d',
		'#e7cbe6',
		'#d8aad6',
		'#a888c2',
		'#9dc2d3',
		'#649eb9',
		'#387aa3'
	].reverse();

	this.schemes.spectrum2000 = [
		'#57306f',
		'#514c76',
		'#646583',
		'#738394',
		'#6b9c7d',
		'#84b665',
		'#a7ca50',
		'#bfe746',
		'#e2f528',
		'#fff726',
		'#ecdd00',
		'#d4b11d',
		'#de8800',
		'#de4800',
		'#c91515',
		'#9a0000',
		'#7b0429',
		'#580839',
		'#31082b'
	];

	this.schemes.spectrum2001 = [
		'#2f243f',
		'#3c2c55',
		'#4a3768',
		'#565270',
		'#6b6b7c',
		'#72957f',
		'#86ad6e',
		'#a1bc5e',
		'#b8d954',
		'#d3e04e',
		'#ccad2a',
		'#cc8412',
		'#c1521d',
		'#ad3821',
		'#8a1010',
		'#681717',
		'#531e1e',
		'#3d1818',
		'#320a1b'
	];

	this.schemes.classic9 = [
		'#423d4f',
		'#4a6860',
		'#848f39',
		'#a2b73c',
		'#ddcb53',
		'#c5a32f',
		'#7d5836',
		'#963b20',
		'#7c2626',
		'#491d37',
		'#2f254a'
	].reverse();

	this.schemes.httpStatus = {
		503: '#ea5029',
		502: '#d23f14',
		500: '#bf3613',
		410: '#efacea',
		409: '#e291dc',
		403: '#f457e8',
		408: '#e121d2',
		401: '#b92dae',
		405: '#f47ceb',
		404: '#a82a9f',
		400: '#b263c6',
		301: '#6fa024',
		302: '#87c32b',
		307: '#a0d84c',
		304: '#28b55c',
		200: '#1a4f74',
		206: '#27839f',
		201: '#52adc9',
		202: '#7c979f',
		203: '#a5b8bd',
		204: '#c1cdd1'
	};

	this.schemes.colorwheel = [
		'#b5b6a9',
		'#858772',
		'#785f43',
		'#96557e',
		'#4682b4',
		'#65b9ac',
		'#73c03a',
		'#cb513a'
	].reverse();

	this.schemes.cool = [
		'#5e9d2f',
		'#73c03a',
		'#4682b4',
		'#7bc3b8',
		'#a9884e',
		'#c1b266',
		'#a47493',
		'#c09fb5'
	];

	this.schemes.munin = [
		'#00cc00',
		'#0066b3',
		'#ff8000',
		'#ffcc00',
		'#330099',
		'#990099',
		'#ccff00',
		'#ff0000',
		'#808080',
		'#008f00',
		'#00487d',
		'#b35a00',
		'#b38f00',
		'#6b006b',
		'#8fb300',
		'#b30000',
		'#bebebe',
		'#80ff80',
		'#80c9ff',
		'#ffc080',
		'#ffe680',
		'#aa80ff',
		'#ee00cc',
		'#ff8080',
		'#666600',
		'#ffbfff',
		'#00ffcc',
		'#cc6699',
		'#999900'
	];
};
Rickshaw.namespace('Rickshaw.Fixtures.RandomData');

Rickshaw.Fixtures.RandomData = function(timeInterval) {

	var addData;
	timeInterval = timeInterval || 1;

	var lastRandomValue = 200;

	var timeBase = Math.floor(new Date().getTime() / 1000);

	this.addData = function(data) {

		var randomValue = Math.random() * 100 + 15 + lastRandomValue;
		var index = data[0].length;

		var counter = 1;

		data.forEach( function(series) {
			var randomVariance = Math.random() * 20;
			var v = randomValue / 25  + counter++ +
				(Math.cos((index * counter * 11) / 960) + 2) * 15 +
				(Math.cos(index / 7) + 2) * 7 +
				(Math.cos(index / 17) + 2) * 1;

			series.push( { x: (index * timeInterval) + timeBase, y: v + randomVariance } );
		} );

		lastRandomValue = randomValue * 0.85;
	};

	this.removeData = function(data) {
		data.forEach( function(series) {
			series.shift();
		} );
		timeBase += timeInterval;
	};
};

Rickshaw.namespace('Rickshaw.Fixtures.Time');

Rickshaw.Fixtures.Time = function() {

	var self = this;

	this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	this.units = [
		{
			name: 'decade',
			seconds: 86400 * 365.25 * 10,
			formatter: function(d) { return (parseInt(d.getUTCFullYear() / 10, 10) * 10) }
		}, {
			name: 'year',
			seconds: 86400 * 365.25,
			formatter: function(d) { return d.getUTCFullYear() }
		}, {
			name: 'month',
			seconds: 86400 * 30.5,
			formatter: function(d) { return self.months[d.getUTCMonth()] }
		}, {
			name: 'week',
			seconds: 86400 * 7,
			formatter: function(d) { return self.formatDate(d) }
		}, {
			name: 'day',
			seconds: 86400,
			formatter: function(d) { return d.getUTCDate() }
		}, {
			name: '6 hour',
			seconds: 3600 * 6,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: 'hour',
			seconds: 3600,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: '15 minute',
			seconds: 60 * 15,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: 'minute',
			seconds: 60,
			formatter: function(d) { return d.getUTCMinutes() }
		}, {
			name: '15 second',
			seconds: 15,
			formatter: function(d) { return d.getUTCSeconds() + 's' }
		}, {
			name: 'second',
			seconds: 1,
			formatter: function(d) { return d.getUTCSeconds() + 's' }
		}, {
			name: 'decisecond',
			seconds: 1/10,
			formatter: function(d) { return d.getUTCMilliseconds() + 'ms' }
		}, {
			name: 'centisecond',
			seconds: 1/100,
			formatter: function(d) { return d.getUTCMilliseconds() + 'ms' }
		}
	];

	this.unit = function(unitName) {
		return this.units.filter( function(unit) { return unitName == unit.name } ).shift();
	};

	this.formatDate = function(d) {
		return d3.time.format('%b %e')(d);
	};

	this.formatTime = function(d) {
		return d.toUTCString().match(/(\d+:\d+):/)[1];
	};

	this.ceil = function(time, unit) {

		var date, floor, year;

		if (unit.name == 'month') {

			date = new Date(time * 1000);

			floor = Date.UTC(date.getUTCFullYear(), date.getUTCMonth()) / 1000;
			if (floor == time) return time;

			year = date.getUTCFullYear();
			var month = date.getUTCMonth();

			if (month == 11) {
				month = 0;
				year = year + 1;
			} else {
				month += 1;
			}

			return Date.UTC(year, month) / 1000;
		}

		if (unit.name == 'year') {

			date = new Date(time * 1000);

			floor = Date.UTC(date.getUTCFullYear(), 0) / 1000;
			if (floor == time) return time;

			year = date.getUTCFullYear() + 1;

			return Date.UTC(year, 0) / 1000;
		}

		return Math.ceil(time / unit.seconds) * unit.seconds;
	};
};
Rickshaw.namespace('Rickshaw.Fixtures.Time.Local');

Rickshaw.Fixtures.Time.Local = function() {

	var self = this;

	this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	this.units = [
		{
			name: 'decade',
			seconds: 86400 * 365.25 * 10,
			formatter: function(d) { return (parseInt(d.getFullYear() / 10, 10) * 10) }
		}, {
			name: 'year',
			seconds: 86400 * 365.25,
			formatter: function(d) { return d.getFullYear() }
		}, {
			name: 'month',
			seconds: 86400 * 30.5,
			formatter: function(d) { return self.months[d.getMonth()] }
		}, {
			name: 'week',
			seconds: 86400 * 7,
			formatter: function(d) { return self.formatDate(d) }
		}, {
			name: 'day',
			seconds: 86400,
			formatter: function(d) { return d.getDate() }
		}, {
			name: '6 hour',
			seconds: 3600 * 6,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: 'hour',
			seconds: 3600,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: '15 minute',
			seconds: 60 * 15,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: 'minute',
			seconds: 60,
			formatter: function(d) { return d.getMinutes() }
		}, {
			name: '15 second',
			seconds: 15,
			formatter: function(d) { return d.getSeconds() + 's' }
		}, {
			name: 'second',
			seconds: 1,
			formatter: function(d) { return d.getSeconds() + 's' }
		}, {
			name: 'decisecond',
			seconds: 1/10,
			formatter: function(d) { return d.getMilliseconds() + 'ms' }
		}, {
			name: 'centisecond',
			seconds: 1/100,
			formatter: function(d) { return d.getMilliseconds() + 'ms' }
		}
	];

	this.unit = function(unitName) {
		return this.units.filter( function(unit) { return unitName == unit.name } ).shift();
	};

	this.formatDate = function(d) {
		return d3.time.format('%b %e')(d);
	};

	this.formatTime = function(d) {
		return d.toString().match(/(\d+:\d+):/)[1];
	};

	this.ceil = function(time, unit) {

		var date, floor, year;

		if (unit.name == 'day') {

			var nearFuture = new Date((time + unit.seconds - 1) * 1000);

			var rounded = new Date(0);
			rounded.setFullYear(nearFuture.getFullYear());
			rounded.setMonth(nearFuture.getMonth());
			rounded.setDate(nearFuture.getDate());
			rounded.setMilliseconds(0);
			rounded.setSeconds(0);
			rounded.setMinutes(0);
			rounded.setHours(0);

			return rounded.getTime() / 1000;
		}

		if (unit.name == 'month') {

			date = new Date(time * 1000);

			floor = new Date(date.getFullYear(), date.getMonth()).getTime() / 1000;
			if (floor == time) return time;

			year = date.getFullYear();
			var month = date.getMonth();

			if (month == 11) {
				month = 0;
				year = year + 1;
			} else {
				month += 1;
			}

			return new Date(year, month).getTime() / 1000;
		}

		if (unit.name == 'year') {

			date = new Date(time * 1000);

			floor = new Date(date.getUTCFullYear(), 0).getTime() / 1000;
			if (floor == time) return time;

			year = date.getFullYear() + 1;

			return new Date(year, 0).getTime() / 1000;
		}

		return Math.ceil(time / unit.seconds) * unit.seconds;
	};
};
Rickshaw.namespace('Rickshaw.Fixtures.Number');

Rickshaw.Fixtures.Number.formatKMBT = function(y) {
	var abs_y = Math.abs(y);
	if (abs_y >= 1000000000000)   { return y / 1000000000000 + "T" }
	else if (abs_y >= 1000000000) { return y / 1000000000 + "B" }
	else if (abs_y >= 1000000)    { return y / 1000000 + "M" }
	else if (abs_y >= 1000)       { return y / 1000 + "K" }
	else if (abs_y < 1 && y > 0)  { return y.toFixed(2) }
	else if (abs_y === 0)         { return '' }
	else                      { return y }
};

Rickshaw.Fixtures.Number.formatBase1024KMGTP = function(y) {
    var abs_y = Math.abs(y);
    if (abs_y >= 1125899906842624)  { return y / 1125899906842624 + "P" }
    else if (abs_y >= 1099511627776){ return y / 1099511627776 + "T" }
    else if (abs_y >= 1073741824)   { return y / 1073741824 + "G" }
    else if (abs_y >= 1048576)      { return y / 1048576 + "M" }
    else if (abs_y >= 1024)         { return y / 1024 + "K" }
    else if (abs_y < 1 && y > 0)    { return y.toFixed(2) }
    else if (abs_y === 0)           { return '' }
    else                        { return y }
};
Rickshaw.namespace("Rickshaw.Color.Palette");

Rickshaw.Color.Palette = function(args) {

	var color = new Rickshaw.Fixtures.Color();

	args = args || {};
	this.schemes = {};

	this.scheme = color.schemes[args.scheme] || args.scheme || color.schemes.colorwheel;
	this.runningIndex = 0;
	this.generatorIndex = 0;

	if (args.interpolatedStopCount) {
		var schemeCount = this.scheme.length - 1;
		var i, j, scheme = [];
		for (i = 0; i < schemeCount; i++) {
			scheme.push(this.scheme[i]);
			var generator = d3.interpolateHsl(this.scheme[i], this.scheme[i + 1]);
			for (j = 1; j < args.interpolatedStopCount; j++) {
				scheme.push(generator((1 / args.interpolatedStopCount) * j));
			}
		}
		scheme.push(this.scheme[this.scheme.length - 1]);
		this.scheme = scheme;
	}
	this.rotateCount = this.scheme.length;

	this.color = function(key) {
		return this.scheme[key] || this.scheme[this.runningIndex++] || this.interpolateColor() || '#808080';
	};

	this.interpolateColor = function() {
		if (!Array.isArray(this.scheme)) return;
		var color;
		if (this.generatorIndex == this.rotateCount * 2 - 1) {
			color = d3.interpolateHsl(this.scheme[this.generatorIndex], this.scheme[0])(0.5);
			this.generatorIndex = 0;
			this.rotateCount *= 2;
		} else {
			color = d3.interpolateHsl(this.scheme[this.generatorIndex], this.scheme[this.generatorIndex + 1])(0.5);
			this.generatorIndex++;
		}
		this.scheme.push(color);
		return color;
	};

};
Rickshaw.namespace('Rickshaw.Graph.Ajax');

Rickshaw.Graph.Ajax = Rickshaw.Class.create( {

	initialize: function(args) {

		this.dataURL = args.dataURL;

		this.onData = args.onData || function(d) { return d };
		this.onComplete = args.onComplete || function() {};
		this.onError = args.onError || function() {};

		this.args = args; // pass through to Rickshaw.Graph

		this.request();
	},

	request: function() {

		jQuery.ajax( {
			url: this.dataURL,
			dataType: 'json',
			success: this.success.bind(this),
			error: this.error.bind(this)
		} );
	},

	error: function() {

		console.log("error loading dataURL: " + this.dataURL);
		this.onError(this);
	},

	success: function(data, status) {

		data = this.onData(data);
		this.args.series = this._splice({ data: data, series: this.args.series });

		this.graph = this.graph || new Rickshaw.Graph(this.args);
		this.graph.render();

		this.onComplete(this);
	},

	_splice: function(args) {

		var data = args.data;
		var series = args.series;

		if (!args.series) return data;

		series.forEach( function(s) {

			var seriesKey = s.key || s.name;
			if (!seriesKey) throw "series needs a key or a name";

			data.forEach( function(d) {

				var dataKey = d.key || d.name;
				if (!dataKey) throw "data needs a key or a name";

				if (seriesKey == dataKey) {
					var properties = ['color', 'name', 'data'];
					properties.forEach( function(p) {
						if (d[p]) s[p] = d[p];
					} );
				}
			} );
		} );

		return series;
	}
} );

Rickshaw.namespace('Rickshaw.Graph.Annotate');

Rickshaw.Graph.Annotate = function(args) {

	var graph = this.graph = args.graph;
	this.elements = { timeline: args.element };
	
	var self = this;

	this.data = {};

	this.elements.timeline.classList.add('rickshaw_annotation_timeline');

	this.add = function(time, content, end_time) {
		self.data[time] = self.data[time] || {'boxes': []};
		self.data[time].boxes.push({content: content, end: end_time});
	};

	this.update = function() {

		Rickshaw.keys(self.data).forEach( function(time) {

			var annotation = self.data[time];
			var left = self.graph.x(time);

			if (left < 0 || left > self.graph.x.range()[1]) {
				if (annotation.element) {
					annotation.line.classList.add('offscreen');
					annotation.element.style.display = 'none';
				}

				annotation.boxes.forEach( function(box) {
					if ( box.rangeElement ) box.rangeElement.classList.add('offscreen');
				});

				return;
			}

			if (!annotation.element) {
				var element = annotation.element = document.createElement('div');
				element.classList.add('annotation');
				this.elements.timeline.appendChild(element);
				element.addEventListener('click', function(e) {
					element.classList.toggle('active');
					annotation.line.classList.toggle('active');
					annotation.boxes.forEach( function(box) {
						if ( box.rangeElement ) box.rangeElement.classList.toggle('active');
					});
				}, false);
					
			}

			annotation.element.style.left = left + 'px';
			annotation.element.style.display = 'block';

			annotation.boxes.forEach( function(box) {


				var element = box.element;

				if (!element) {
					element = box.element = document.createElement('div');
					element.classList.add('content');
					element.innerHTML = box.content;
					annotation.element.appendChild(element);

					annotation.line = document.createElement('div');
					annotation.line.classList.add('annotation_line');
					self.graph.element.appendChild(annotation.line);

					if ( box.end ) {
						box.rangeElement = document.createElement('div');
						box.rangeElement.classList.add('annotation_range');
						self.graph.element.appendChild(box.rangeElement);
					}

				}

				if ( box.end ) {

					var annotationRangeStart = left;
					var annotationRangeEnd   = Math.min( self.graph.x(box.end), self.graph.x.range()[1] );

					// annotation makes more sense at end
					if ( annotationRangeStart > annotationRangeEnd ) {
						annotationRangeEnd   = left;
						annotationRangeStart = Math.max( self.graph.x(box.end), self.graph.x.range()[0] );
					}

					var annotationRangeWidth = annotationRangeEnd - annotationRangeStart;

					box.rangeElement.style.left  = annotationRangeStart + 'px';
					box.rangeElement.style.width = annotationRangeWidth + 'px';

					box.rangeElement.classList.remove('offscreen');
				}

				annotation.line.classList.remove('offscreen');
				annotation.line.style.left = left + 'px';
			} );
		}, this );
	};

	this.graph.onUpdate( function() { self.update() } );
};
Rickshaw.namespace('Rickshaw.Graph.Axis.Time');

Rickshaw.Graph.Axis.Time = function(args) {

	var self = this;

	this.graph = args.graph;
	this.elements = [];
	this.ticksTreatment = args.ticksTreatment || 'plain';
	this.fixedTimeUnit = args.timeUnit;

	var time = args.timeFixture || new Rickshaw.Fixtures.Time();

	this.appropriateTimeUnit = function() {

		var unit;
		var units = time.units;

		var domain = this.graph.x.domain();
		var rangeSeconds = domain[1] - domain[0];

		units.forEach( function(u) {
			if (Math.floor(rangeSeconds / u.seconds) >= 2) {
				unit = unit || u;
			}
		} );

		return (unit || time.units[time.units.length - 1]);
	};

	this.tickOffsets = function() {

		var domain = this.graph.x.domain();

		var unit = this.fixedTimeUnit || this.appropriateTimeUnit();
		var count = Math.ceil((domain[1] - domain[0]) / unit.seconds);

		var runningTick = domain[0];

		var offsets = [];

		for (var i = 0; i < count; i++) {

			var tickValue = time.ceil(runningTick, unit);
			runningTick = tickValue + unit.seconds / 2;

			offsets.push( { value: tickValue, unit: unit } );
		}

		return offsets;
	};

	this.render = function() {

		this.elements.forEach( function(e) {
			e.parentNode.removeChild(e);
		} );

		this.elements = [];

		var offsets = this.tickOffsets();

		offsets.forEach( function(o) {
			
			if (self.graph.x(o.value) > self.graph.x.range()[1]) return;
	
			var element = document.createElement('div');
			element.style.left = self.graph.x(o.value) + 'px';
			element.classList.add('x_tick');
			element.classList.add(self.ticksTreatment);

			var title = document.createElement('div');
			title.classList.add('title');
			title.innerHTML = o.unit.formatter(new Date(o.value * 1000));
			element.appendChild(title);

			self.graph.element.appendChild(element);
			self.elements.push(element);

		} );
	};

	this.graph.onUpdate( function() { self.render() } );
};

Rickshaw.namespace('Rickshaw.Graph.Axis.X');

Rickshaw.Graph.Axis.X = function(args) {

	var self = this;
	var berthRate = 0.10;

	this.initialize = function(args) {

		this.graph = args.graph;
		this.orientation = args.orientation || 'top';

		this.pixelsPerTick = args.pixelsPerTick || 75;
		if (args.ticks) this.staticTicks = args.ticks;
		if (args.tickValues) this.tickValues = args.tickValues;

		this.tickSize = args.tickSize || 4;
		this.ticksTreatment = args.ticksTreatment || 'plain';

		if (args.element) {

			this.element = args.element;
			this._discoverSize(args.element, args);

			this.vis = d3.select(args.element)
				.append("svg:svg")
				.attr('height', this.height)
				.attr('width', this.width)
				.attr('class', 'rickshaw_graph x_axis_d3');

			this.element = this.vis[0][0];
			this.element.style.position = 'relative';

			this.setSize({ width: args.width, height: args.height });

		} else {
			this.vis = this.graph.vis;
		}

		this.graph.onUpdate( function() { self.render() } );
	};

	this.setSize = function(args) {

		args = args || {};
		if (!this.element) return;

		this._discoverSize(this.element.parentNode, args);

		this.vis
			.attr('height', this.height)
			.attr('width', this.width * (1 + berthRate));

		var berth = Math.floor(this.width * berthRate / 2);
		this.element.style.left = -1 * berth + 'px';
	};

	this.render = function() {

		if (this._renderWidth !== undefined && this.graph.width !== this._renderWidth) this.setSize({ auto: true });

		var axis = d3.svg.axis().scale(this.graph.x).orient(this.orientation);
		axis.tickFormat( args.tickFormat || function(x) { return x } );
		if (this.tickValues) axis.tickValues(this.tickValues);

		this.ticks = this.staticTicks || Math.floor(this.graph.width / this.pixelsPerTick);

		var berth = Math.floor(this.width * berthRate / 2) || 0;
		var transform;

		if (this.orientation == 'top') {
			var yOffset = this.height || this.graph.height;
			transform = 'translate(' + berth + ',' + yOffset + ')';
		} else {
			transform = 'translate(' + berth + ', 0)';
		}

		if (this.element) {
			this.vis.selectAll('*').remove();
		}

		this.vis
			.append("svg:g")
			.attr("class", ["x_ticks_d3", this.ticksTreatment].join(" "))
			.attr("transform", transform)
			.call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(this.tickSize));

		var gridSize = (this.orientation == 'bottom' ? 1 : -1) * this.graph.height;

		this.graph.vis
			.append("svg:g")
			.attr("class", "x_grid_d3")
			.call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(gridSize))
			.selectAll('text')
			.each(function() { this.parentNode.setAttribute('data-x-value', this.textContent) });

		this._renderHeight = this.graph.height;
	};

	this._discoverSize = function(element, args) {

		if (typeof window !== 'undefined') {

			var style = window.getComputedStyle(element, null);
			var elementHeight = parseInt(style.getPropertyValue('height'), 10);

			if (!args.auto) {
				var elementWidth = parseInt(style.getPropertyValue('width'), 10);
			}
		}

		this.width = (args.width || elementWidth || this.graph.width) * (1 + berthRate);
		this.height = args.height || elementHeight || 40;
	};

	this.initialize(args);
};

Rickshaw.namespace('Rickshaw.Graph.Axis.Y');

Rickshaw.Graph.Axis.Y = Rickshaw.Class.create( {

	initialize: function(args) {

		this.graph = args.graph;
		this.orientation = args.orientation || 'right';

		this.pixelsPerTick = args.pixelsPerTick || 75;
		if (args.ticks) this.staticTicks = args.ticks;
		if (args.tickValues) this.tickValues = args.tickValues;

		this.tickSize = args.tickSize || 4;
		this.ticksTreatment = args.ticksTreatment || 'plain';

		this.tickFormat = args.tickFormat || function(y) { return y };

		this.berthRate = 0.10;

		if (args.element) {

			this.element = args.element;
			this.vis = d3.select(args.element)
				.append("svg:svg")
				.attr('class', 'rickshaw_graph y_axis');

			this.element = this.vis[0][0];
			this.element.style.position = 'relative';

			this.setSize({ width: args.width, height: args.height });

		} else {
			this.vis = this.graph.vis;
		}

		var self = this;
		this.graph.onUpdate( function() { self.render() } );
	},

	setSize: function(args) {

		args = args || {};

		if (!this.element) return;

		if (typeof window !== 'undefined') {

			var style = window.getComputedStyle(this.element.parentNode, null);
			var elementWidth = parseInt(style.getPropertyValue('width'), 10);

			if (!args.auto) {
				var elementHeight = parseInt(style.getPropertyValue('height'), 10);
			}
		}

		this.width = args.width || elementWidth || this.graph.width * this.berthRate;
		this.height = args.height || elementHeight || this.graph.height;

		this.vis
			.attr('width', this.width)
			.attr('height', this.height * (1 + this.berthRate));

		var berth = this.height * this.berthRate;

		if (this.orientation == 'left') {
			this.element.style.top = -1 * berth + 'px';
		}
	},

	render: function() {

		if (this._renderHeight !== undefined && this.graph.height !== this._renderHeight) this.setSize({ auto: true });

		this.ticks = this.staticTicks || Math.floor(this.graph.height / this.pixelsPerTick);

		var axis = this._drawAxis(this.graph.y);

		this._drawGrid(axis);

		this._renderHeight = this.graph.height;
	},

	_drawAxis: function(scale) {
		var axis = d3.svg.axis().scale(scale).orient(this.orientation);
		axis.tickFormat(this.tickFormat);
		if (this.tickValues) axis.tickValues(this.tickValues);

		if (this.orientation == 'left') {
			var berth = this.height * this.berthRate;
			var transform = 'translate(' + this.width + ', ' + berth + ')';
		}

		if (this.element) {
			this.vis.selectAll('*').remove();
		}

		this.vis
			.append("svg:g")
			.attr("class", ["y_ticks", this.ticksTreatment].join(" "))
			.attr("transform", transform)
			.call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(this.tickSize));

		return axis;
	},

	_drawGrid: function(axis) {
		var gridSize = (this.orientation == 'right' ? 1 : -1) * this.graph.width;

		this.graph.vis
			.append("svg:g")
			.attr("class", "y_grid")
			.call(axis.ticks(this.ticks).tickSubdivide(0).tickSize(gridSize))
			.selectAll('text')
			.each(function() { this.parentNode.setAttribute('data-y-value', this.textContent) });
	}
} );
Rickshaw.namespace('Rickshaw.Graph.Axis.Y.Scaled');

Rickshaw.Graph.Axis.Y.Scaled = Rickshaw.Class.create( Rickshaw.Graph.Axis.Y, {

  initialize: function($super, args) {

    if (typeof(args.scale) === 'undefined') {
      throw new Error('Scaled requires scale');
    }

    this.scale = args.scale;

    if (typeof(args.grid) === 'undefined') {
      this.grid = true;
    } else {
      this.grid = args.grid;
    }

    $super(args);

  },

  _drawAxis: function($super, scale) {
    // Adjust scale's domain to compensate for adjustments to the
    // renderer's domain (e.g. padding).
    var domain = this.scale.domain();
    var renderDomain = this.graph.renderer.domain().y;

    var extents = [
      Math.min.apply(Math, domain),
      Math.max.apply(Math, domain)];

    // A mapping from the ideal render domain [0, 1] to the extent
    // of the original scale's domain.  This is used to calculate
    // the extents of the adjusted domain.
    var extentMap = d3.scale.linear().domain([0, 1]).range(extents);

    var adjExtents = [
      extentMap(renderDomain[0]),
      extentMap(renderDomain[1])];

    // A mapping from the original domain to the adjusted domain.
    var adjustment = d3.scale.linear().domain(extents).range(adjExtents);

    // Make a copy of the custom scale, apply the adjusted domain, and
    // copy the range to match the graph's scale.
    var adjustedScale = this.scale.copy()
      .domain(domain.map(adjustment))
      .range(scale.range());

    return $super(adjustedScale);
  },

  _drawGrid: function($super, axis) {
    if (this.grid) {
      // only draw the axis if the grid option is true
      $super(axis);
    }
  }
} );
Rickshaw.namespace('Rickshaw.Graph.Behavior.Series.Highlight');

Rickshaw.Graph.Behavior.Series.Highlight = function(args) {

	this.graph = args.graph;
	this.legend = args.legend;

	var self = this;

	var colorSafe = {};
	var activeLine = null;

	var disabledColor = args.disabledColor || function(seriesColor) {
		return d3.interpolateRgb(seriesColor, d3.rgb('#d8d8d8'))(0.8).toString();
	};

	this.addHighlightEvents = function (l) {

		l.element.addEventListener( 'mouseover', function(e) {

			if (activeLine) return;
			else activeLine = l;

			self.legend.lines.forEach( function(line) {

				if (l === line) {

					// if we're not in a stacked renderer bring active line to the top
					if (self.graph.renderer.unstack && (line.series.renderer ? line.series.renderer.unstack : true)) {

						var seriesIndex = self.graph.series.indexOf(line.series);
						line.originalIndex = seriesIndex;

						var series = self.graph.series.splice(seriesIndex, 1)[0];
						self.graph.series.push(series);
					}
					return;
				}

				colorSafe[line.series.name] = colorSafe[line.series.name] || line.series.color;
				line.series.color = disabledColor(line.series.color);

			} );

			self.graph.update();

		}, false );

		l.element.addEventListener( 'mouseout', function(e) {

			if (!activeLine) return;
			else activeLine = null;

			self.legend.lines.forEach( function(line) {

				// return reordered series to its original place
				if (l === line && line.hasOwnProperty('originalIndex')) {

					var series = self.graph.series.pop();
					self.graph.series.splice(line.originalIndex, 0, series);
					delete line.originalIndex;
				}

				if (colorSafe[line.series.name]) {
					line.series.color = colorSafe[line.series.name];
				}
			} );

			self.graph.update();

		}, false );
	};

	if (this.legend) {
		this.legend.lines.forEach( function(l) {
			self.addHighlightEvents(l);
		} );
	}

};
Rickshaw.namespace('Rickshaw.Graph.Behavior.Series.Order');

Rickshaw.Graph.Behavior.Series.Order = function(args) {

	this.graph = args.graph;
	this.legend = args.legend;

	var self = this;

	if (typeof __webpack_provided_window_dot_jQuery == 'undefined') {
		throw "couldn't find jQuery at window.jQuery";
	}

	if (typeof __webpack_provided_window_dot_jQuery.ui == 'undefined') {
		throw "couldn't find jQuery UI at window.jQuery.ui";
	}

	jQuery(function() {
		jQuery(self.legend.list).sortable( {
			containment: 'parent',
			tolerance: 'pointer',
			update: function( event, ui ) {
				var series = [];
				jQuery(self.legend.list).find('li').each( function(index, item) {
					if (!item.series) return;
					series.push(item.series);
				} );

				for (var i = self.graph.series.length - 1; i >= 0; i--) {
					self.graph.series[i] = series.shift();
				}

				self.graph.update();
			}
		} );
		jQuery(self.legend.list).disableSelection();
	});

	//hack to make jquery-ui sortable behave
	this.graph.onUpdate( function() { 
		var h = window.getComputedStyle(self.legend.element).height;
		self.legend.element.style.height = h;
	} );
};
Rickshaw.namespace('Rickshaw.Graph.Behavior.Series.Toggle');

Rickshaw.Graph.Behavior.Series.Toggle = function(args) {

	this.graph = args.graph;
	this.legend = args.legend;

	var self = this;

	this.addAnchor = function(line) {

		var anchor = document.createElement('a');
		anchor.innerHTML = '&#10004;';
		anchor.classList.add('action');
		line.element.insertBefore(anchor, line.element.firstChild);

		anchor.onclick = function(e) {
			if (line.series.disabled) {
				line.series.enable();
				line.element.classList.remove('disabled');
			} else { 
				if (this.graph.series.filter(function(s) { return !s.disabled }).length <= 1) return;
				line.series.disable();
				line.element.classList.add('disabled');
			}

			self.graph.update();

		}.bind(this);
		
                var label = line.element.getElementsByTagName('span')[0];
                label.onclick = function(e){

                        var disableAllOtherLines = line.series.disabled;
                        if ( ! disableAllOtherLines ) {
                                for ( var i = 0; i < self.legend.lines.length; i++ ) {
                                        var l = self.legend.lines[i];
                                        if ( line.series === l.series ) {
                                                // noop
                                        } else if ( l.series.disabled ) {
                                                // noop
                                        } else {
                                                disableAllOtherLines = true;
                                                break;
                                        }
                                }
                        }

                        // show all or none
                        if ( disableAllOtherLines ) {

                                // these must happen first or else we try ( and probably fail ) to make a no line graph
                                line.series.enable();
                                line.element.classList.remove('disabled');

                                self.legend.lines.forEach(function(l){
                                        if ( line.series === l.series ) {
                                                // noop
                                        } else {
                                                l.series.disable();
                                                l.element.classList.add('disabled');
                                        }
                                });

                        } else {

                                self.legend.lines.forEach(function(l){
                                        l.series.enable();
                                        l.element.classList.remove('disabled');
                                });

                        }

                        self.graph.update();

                };

	};

	if (this.legend) {

		var $ = jQuery;
		if (typeof $ != 'undefined' && $(this.legend.list).sortable) {

			$(this.legend.list).sortable( {
				start: function(event, ui) {
					ui.item.bind('no.onclick',
						function(event) {
							event.preventDefault();
						}
					);
				},
				stop: function(event, ui) {
					setTimeout(function(){
						ui.item.unbind('no.onclick');
					}, 250);
				}
			});
		}

		this.legend.lines.forEach( function(l) {
			self.addAnchor(l);
		} );
	}

	this._addBehavior = function() {

		this.graph.series.forEach( function(s) {
			
			s.disable = function() {

				if (self.graph.series.length <= 1) {
					throw('only one series left');
				}
				
				s.disabled = true;
			};

			s.enable = function() {
				s.disabled = false;
			};
		} );
	};
	this._addBehavior();

	this.updateBehaviour = function () { this._addBehavior() };

};
Rickshaw.namespace('Rickshaw.Graph.HoverDetail');

Rickshaw.Graph.HoverDetail = Rickshaw.Class.create({

	initialize: function(args) {

		var graph = this.graph = args.graph;

		this.xFormatter = args.xFormatter || function(x) {
			return new Date( x * 1000 ).toUTCString();
		};

		this.yFormatter = args.yFormatter || function(y) {
			return y === null ? y : y.toFixed(2);
		};

		var element = this.element = document.createElement('div');
		element.className = 'detail';

		this.visible = true;
		graph.element.appendChild(element);

		this.lastEvent = null;
		this._addListeners();

		this.onShow = args.onShow;
		this.onHide = args.onHide;
		this.onRender = args.onRender;

		this.formatter = args.formatter || this.formatter;

	},

	formatter: function(series, x, y, formattedX, formattedY, d) {
		return series.name + ':&nbsp;' + formattedY;
	},

	update: function(e) {

		e = e || this.lastEvent;
		if (!e) return;
		this.lastEvent = e;

		if (!e.target.nodeName.match(/^(path|svg|rect|circle)$/)) return;

		var graph = this.graph;

		var eventX = e.offsetX || e.layerX;
		var eventY = e.offsetY || e.layerY;

		var j = 0;
		var points = [];
		var nearestPoint;

		this.graph.series.active().forEach( function(series) {

			var data = this.graph.stackedData[j++];

			if (!data.length)
				return;

			var domainX = graph.x.invert(eventX);

			var domainIndexScale = d3.scale.linear()
				.domain([data[0].x, data.slice(-1)[0].x])
				.range([0, data.length - 1]);

			var approximateIndex = Math.round(domainIndexScale(domainX));
			if (approximateIndex == data.length - 1) approximateIndex--;

			var dataIndex = Math.min(approximateIndex || 0, data.length - 1);

			for (var i = approximateIndex; i < data.length - 1;) {

				if (!data[i] || !data[i + 1]) break;

				if (data[i].x <= domainX && data[i + 1].x > domainX) {
					dataIndex = Math.abs(domainX - data[i].x) < Math.abs(domainX - data[i + 1].x) ? i : i + 1;
					break;
				}

				if (data[i + 1].x <= domainX) { i++ } else { i-- }
			}

			if (dataIndex < 0) dataIndex = 0;
			var value = data[dataIndex];

			var distance = Math.sqrt(
				Math.pow(Math.abs(graph.x(value.x) - eventX), 2) +
				Math.pow(Math.abs(graph.y(value.y + value.y0) - eventY), 2)
			);

			var xFormatter = series.xFormatter || this.xFormatter;
			var yFormatter = series.yFormatter || this.yFormatter;

			var point = {
				formattedXValue: xFormatter(value.x),
				formattedYValue: yFormatter(series.scale ? series.scale.invert(value.y) : value.y),
				series: series,
				value: value,
				distance: distance,
				order: j,
				name: series.name
			};

			if (!nearestPoint || distance < nearestPoint.distance) {
				nearestPoint = point;
			}

			points.push(point);

		}, this );

		if (!nearestPoint)
			return;

		nearestPoint.active = true;

		var domainX = nearestPoint.value.x;
		var formattedXValue = nearestPoint.formattedXValue;

		this.element.innerHTML = '';
		this.element.style.left = graph.x(domainX) + 'px';

		this.visible && this.render( {
			points: points,
			detail: points, // for backwards compatibility
			mouseX: eventX,
			mouseY: eventY,
			formattedXValue: formattedXValue,
			domainX: domainX
		} );
	},

	hide: function() {
		this.visible = false;
		this.element.classList.add('inactive');

		if (typeof this.onHide == 'function') {
			this.onHide();
		}
	},

	show: function() {
		this.visible = true;
		this.element.classList.remove('inactive');

		if (typeof this.onShow == 'function') {
			this.onShow();
		}
	},

	render: function(args) {

		var graph = this.graph;
		var points = args.points;
		var point = points.filter( function(p) { return p.active } ).shift();

		if (point.value.y === null) return;

		var formattedXValue = point.formattedXValue;
		var formattedYValue = point.formattedYValue;

		this.element.innerHTML = '';
		this.element.style.left = graph.x(point.value.x) + 'px';

		var xLabel = document.createElement('div');

		xLabel.className = 'x_label';
		xLabel.innerHTML = formattedXValue;
		this.element.appendChild(xLabel);

		var item = document.createElement('div');

		item.className = 'item';

		// invert the scale if this series displays using a scale
		var series = point.series;
		var actualY = series.scale ? series.scale.invert(point.value.y) : point.value.y;

		item.innerHTML = this.formatter(series, point.value.x, actualY, formattedXValue, formattedYValue, point);
		item.style.top = this.graph.y(point.value.y0 + point.value.y) + 'px';

		this.element.appendChild(item);

		var dot = document.createElement('div');

		dot.className = 'dot';
		dot.style.top = item.style.top;
		dot.style.borderColor = series.color;

		this.element.appendChild(dot);

		if (point.active) {
			item.classList.add('active');
			dot.classList.add('active');
		}

		// Assume left alignment until the element has been displayed and
		// bounding box calculations are possible.
		var alignables = [xLabel, item];
		alignables.forEach(function(el) {
			el.classList.add('left');
		});

		this.show();

		// If left-alignment results in any error, try right-alignment.
		var leftAlignError = this._calcLayoutError(alignables);
		if (leftAlignError > 0) {
			alignables.forEach(function(el) {
				el.classList.remove('left');
				el.classList.add('right');
			});

			// If right-alignment is worse than left alignment, switch back.
			var rightAlignError = this._calcLayoutError(alignables);
			if (rightAlignError > leftAlignError) {
				alignables.forEach(function(el) {
					el.classList.remove('right');
					el.classList.add('left');
				});
			}
		}

		if (typeof this.onRender == 'function') {
			this.onRender(args);
		}
	},

	_calcLayoutError: function(alignables) {
		// Layout error is calculated as the number of linear pixels by which
		// an alignable extends past the left or right edge of the parent.
		var parentRect = this.element.parentNode.getBoundingClientRect();

		var error = 0;
		var alignRight = alignables.forEach(function(el) {
			var rect = el.getBoundingClientRect();
			if (!rect.width) {
				return;
			}

			if (rect.right > parentRect.right) {
				error += rect.right - parentRect.right;
			}

			if (rect.left < parentRect.left) {
				error += parentRect.left - rect.left;
			}
		});
		return error;
	},

	_addListeners: function() {

		this.graph.element.addEventListener(
			'mousemove',
			function(e) {
				this.visible = true;
				this.update(e);
			}.bind(this),
			false
		);

		this.graph.onUpdate( function() { this.update() }.bind(this) );

		this.graph.element.addEventListener(
			'mouseout',
			function(e) {
				if (e.relatedTarget && !(e.relatedTarget.compareDocumentPosition(this.graph.element) & Node.DOCUMENT_POSITION_CONTAINS)) {
					this.hide();
				}
			}.bind(this),
			false
		);
	}
});
Rickshaw.namespace('Rickshaw.Graph.JSONP');

Rickshaw.Graph.JSONP = Rickshaw.Class.create( Rickshaw.Graph.Ajax, {

	request: function() {

		jQuery.ajax( {
			url: this.dataURL,
			dataType: 'jsonp',
			success: this.success.bind(this),
			error: this.error.bind(this)
		} );
	}
} );
Rickshaw.namespace('Rickshaw.Graph.Legend');

Rickshaw.Graph.Legend = Rickshaw.Class.create( {

	className: 'rickshaw_legend',

	initialize: function(args) {
		this.element = args.element;
		this.graph = args.graph;
		this.naturalOrder = args.naturalOrder;

		this.element.classList.add(this.className);

		this.list = document.createElement('ul');
		this.element.appendChild(this.list);

		this.render();

		// we could bind this.render.bind(this) here
		// but triggering the re-render would lose the added
		// behavior of the series toggle
		this.graph.onUpdate( function() {} );
	},

	render: function() {
		var self = this;

		while ( this.list.firstChild ) {
			this.list.removeChild( this.list.firstChild );
		}
		this.lines = [];

		var series = this.graph.series
			.map( function(s) { return s } );

		if (!this.naturalOrder) {
			series = series.reverse();
		}

		series.forEach( function(s) {
			self.addLine(s);
		} );


	},

	addLine: function (series) {
		var line = document.createElement('li');
		line.className = 'line';
		if (series.disabled) {
			line.className += ' disabled';
		}
		if (series.className) {
			d3.select(line).classed(series.className, true);
		}
		var swatch = document.createElement('div');
		swatch.className = 'swatch';
		swatch.style.backgroundColor = series.color;

		line.appendChild(swatch);

		var label = document.createElement('span');
		label.className = 'label';
		label.innerHTML = series.name;

		line.appendChild(label);
		this.list.appendChild(line);

		line.series = series;

		if (series.noLegend) {
			line.style.display = 'none';
		}

		var _line = { element: line, series: series };
		if (this.shelving) {
			this.shelving.addAnchor(_line);
			this.shelving.updateBehaviour();
		}
		if (this.highlighter) {
			this.highlighter.addHighlightEvents(_line);
		}
		this.lines.push(_line);
		return line;
	}
} );

Rickshaw.namespace('Rickshaw.Graph.RangeSlider');

Rickshaw.Graph.RangeSlider = Rickshaw.Class.create({

	initialize: function(args) {

		var element = this.element = args.element;
		var graph = this.graph = args.graph;

		this.slideCallbacks = [];

		this.build();

		graph.onUpdate( function() { this.update() }.bind(this) );
	},

	build: function() {

		var element = this.element;
		var graph = this.graph;
		var $ = jQuery;

		var domain = graph.dataDomain();
		var self = this;

		$( function() {
			$(element).slider( {
				range: true,
				min: domain[0],
				max: domain[1],
				values: [ 
					domain[0],
					domain[1]
				],
				slide: function( event, ui ) {

					if (ui.values[1] <= ui.values[0]) return;

					graph.window.xMin = ui.values[0];
					graph.window.xMax = ui.values[1];
					graph.update();

					var domain = graph.dataDomain();

					// if we're at an extreme, stick there
					if (domain[0] == ui.values[0]) {
						graph.window.xMin = undefined;
					}

					if (domain[1] == ui.values[1]) {
						graph.window.xMax = undefined;
					}

					self.slideCallbacks.forEach(function(callback) {
						callback(graph, graph.window.xMin, graph.window.xMax);
					});
				}
			} );
		} );

		$(element)[0].style.width = graph.width + 'px';

	},

	update: function() {

		var element = this.element;
		var graph = this.graph;
		var $ = jQuery;

		var values = $(element).slider('option', 'values');

		var domain = graph.dataDomain();

		$(element).slider('option', 'min', domain[0]);
		$(element).slider('option', 'max', domain[1]);

		if (graph.window.xMin == null) {
			values[0] = domain[0];
		}
		if (graph.window.xMax == null) {
			values[1] = domain[1];
		}

		$(element).slider('option', 'values', values);
	},

	onSlide: function(callback) {
		this.slideCallbacks.push(callback);
	}
});

Rickshaw.namespace('Rickshaw.Graph.RangeSlider.Preview');

Rickshaw.Graph.RangeSlider.Preview = Rickshaw.Class.create({

	initialize: function(args) {

		if (!args.element) throw "Rickshaw.Graph.RangeSlider.Preview needs a reference to an element";
		if (!args.graph && !args.graphs) throw "Rickshaw.Graph.RangeSlider.Preview needs a reference to an graph or an array of graphs";

		this.element = args.element;
		this.element.style.position = 'relative';

		this.graphs = args.graph ? [ args.graph ] : args.graphs;

		this.defaults = {
			height: 75,
			width: 400,
			gripperColor: undefined,
			frameTopThickness: 3,
			frameHandleThickness: 10,
			frameColor: "#d4d4d4",
			frameOpacity: 1,
			minimumFrameWidth: 0,
			heightRatio: 0.2
		};

		this.heightRatio = args.heightRatio || this.defaults.heightRatio;
		this.defaults.gripperColor = d3.rgb(this.defaults.frameColor).darker().toString(); 

		this.configureCallbacks = [];
		this.slideCallbacks = [];

		this.previews = [];

		if (!args.width) this.widthFromGraph = true;
		if (!args.height) this.heightFromGraph = true;

		if (this.widthFromGraph || this.heightFromGraph) {
			this.graphs[0].onConfigure(function () {
				this.configure(args); this.render();
			}.bind(this));
		}

		args.width = args.width || this.graphs[0].width || this.defaults.width;
		args.height = args.height || this.graphs[0].height * this.heightRatio || this.defaults.height;

		this.configure(args);
		this.render();
	},

	onSlide: function(callback) {
		this.slideCallbacks.push(callback);
	},

	onConfigure: function(callback) {
		this.configureCallbacks.push(callback);
	},

	configure: function(args) {

		this.config = this.config || {};

		this.configureCallbacks.forEach(function(callback) {
			callback(args);
		});

		Rickshaw.keys(this.defaults).forEach(function(k) {
			this.config[k] = k in args ? args[k]
				: k in this.config ? this.config[k]
				: this.defaults[k];
		}, this);

		if ('width' in args || 'height' in args) {

			if (this.widthFromGraph) {
				this.config.width = this.graphs[0].width;
			}

			if (this.heightFromGraph) {
				this.config.height = this.graphs[0].height * this.heightRatio;
				this.previewHeight = this.config.height;
			}

			this.previews.forEach(function(preview) {

				var height = this.previewHeight / this.graphs.length - this.config.frameTopThickness * 2;
				var width = this.config.width - this.config.frameHandleThickness * 2;
				preview.setSize({ width: width, height: height });

				if (this.svg) {
					var svgHeight = height + this.config.frameHandleThickness * 2;
					var svgWidth = width + this.config.frameHandleThickness * 2;
					this.svg.style("width", svgWidth + "px");
					this.svg.style("height", svgHeight + "px");
				}
			}, this);
		}
	},

	render: function() {

		var self = this;

		this.svg = d3.select(this.element)
			.selectAll("svg.rickshaw_range_slider_preview")
			.data([null]);

		this.previewHeight = this.config.height - (this.config.frameTopThickness * 2);
		this.previewWidth = this.config.width - (this.config.frameHandleThickness * 2);

		this.currentFrame = [0, this.previewWidth];

		var buildGraph = function(parent, index) {

			var graphArgs = Rickshaw.extend({}, parent.config);
			var height = self.previewHeight / self.graphs.length;
			var renderer = parent.renderer.name;

			Rickshaw.extend(graphArgs, {
				element: this.appendChild(document.createElement("div")),
				height: height,
				width: self.previewWidth,
				series: parent.series,
				renderer: renderer
			});

			var graph = new Rickshaw.Graph(graphArgs);
			self.previews.push(graph);

			parent.onUpdate(function() { graph.render(); self.render() });

			parent.onConfigure(function(args) { 
				// don't propagate height
				delete args.height;
				args.width = args.width - self.config.frameHandleThickness * 2;
				graph.configure(args);
				graph.render();
			});

			graph.render();
		};

		var graphContainer = d3.select(this.element)
			.selectAll("div.rickshaw_range_slider_preview_container")
			.data(this.graphs);

		var translateCommand = "translate(" +
			this.config.frameHandleThickness + "px, " +
			this.config.frameTopThickness + "px)";

		graphContainer.enter()
			.append("div")
			.classed("rickshaw_range_slider_preview_container", true)
			.style("-webkit-transform", translateCommand)
			.style("-moz-transform", translateCommand)
			.style("-ms-transform", translateCommand)
			.style("transform", translateCommand)
			.each(buildGraph);

		graphContainer.exit()
			.remove();

		// Use the first graph as the "master" for the frame state
		var masterGraph = this.graphs[0];

		var domainScale = d3.scale.linear()
			.domain([0, this.previewWidth])
			.range(masterGraph.dataDomain());

		var currentWindow = [masterGraph.window.xMin, masterGraph.window.xMax];

		this.currentFrame[0] = currentWindow[0] === undefined ? 
			0 : Math.round(domainScale.invert(currentWindow[0]));

		if (this.currentFrame[0] < 0) this.currentFrame[0] = 0;

		this.currentFrame[1] = currentWindow[1] === undefined ?
			this.previewWidth : domainScale.invert(currentWindow[1]);

		if (this.currentFrame[1] - this.currentFrame[0] < self.config.minimumFrameWidth) {
			this.currentFrame[1] = (this.currentFrame[0] || 0) + self.config.minimumFrameWidth;
		}

		this.svg.enter()
			.append("svg")
			.classed("rickshaw_range_slider_preview", true)
			.style("height", this.config.height + "px")
			.style("width", this.config.width + "px")
			.style("position", "absolute")
			.style("top", 0);

		this._renderDimming();
		this._renderFrame();
		this._renderGrippers();
		this._renderHandles();
		this._renderMiddle();

		this._registerMouseEvents();
	},

	_renderDimming: function() {

		var element = this.svg
			.selectAll("path.dimming")
			.data([null]);

		element.enter()
			.append("path")
			.attr("fill", "white")
			.attr("fill-opacity", "0.7")
			.attr("fill-rule", "evenodd")
			.classed("dimming", true);

		var path = "";
		path += " M " + this.config.frameHandleThickness + " " + this.config.frameTopThickness;
		path += " h " + this.previewWidth;
		path += " v " + this.previewHeight;
		path += " h " + -this.previewWidth;
		path += " z ";
		path += " M " + Math.max(this.currentFrame[0], this.config.frameHandleThickness) + " " + this.config.frameTopThickness;
		path += " H " + Math.min(this.currentFrame[1] + this.config.frameHandleThickness * 2, this.previewWidth + this.config.frameHandleThickness);
		path += " v " + this.previewHeight;
		path += " H " + Math.max(this.currentFrame[0], this.config.frameHandleThickness);
		path += " z";

		element.attr("d", path);
	},

	_renderFrame: function() {

		var element = this.svg
			.selectAll("path.frame")
			.data([null]);

		element.enter()
			.append("path")
			.attr("stroke", "white")
			.attr("stroke-width", "1px")
			.attr("stroke-linejoin", "round")
			.attr("fill", this.config.frameColor)
			.attr("fill-opacity", this.config.frameOpacity)
			.attr("fill-rule", "evenodd")
			.classed("frame", true);

		var path = "";
		path += " M " + this.currentFrame[0] + " 0";
		path += " H " + (this.currentFrame[1] + (this.config.frameHandleThickness * 2));
		path += " V " + this.config.height;
		path += " H " + (this.currentFrame[0]);
		path += " z";
		path += " M " + (this.currentFrame[0] + this.config.frameHandleThickness) + " " + this.config.frameTopThickness;
		path += " H " + (this.currentFrame[1] + this.config.frameHandleThickness);
		path += " v " + this.previewHeight;
		path += " H " + (this.currentFrame[0] + this.config.frameHandleThickness);
		path += " z";

		element.attr("d", path);
	},

	_renderGrippers: function() {

		var gripper = this.svg.selectAll("path.gripper")
			.data([null]);

		gripper.enter()
			.append("path")
			.attr("stroke", this.config.gripperColor)
			.classed("gripper", true);

		var path = "";

		[0.4, 0.6].forEach(function(spacing) {
			path += " M " + Math.round((this.currentFrame[0] + (this.config.frameHandleThickness * spacing))) + " " + Math.round(this.config.height * 0.3);
			path += " V " + Math.round(this.config.height * 0.7);
			path += " M " + Math.round((this.currentFrame[1] + (this.config.frameHandleThickness * (1 + spacing)))) + " " + Math.round(this.config.height * 0.3);
			path += " V " + Math.round(this.config.height * 0.7);
		}.bind(this));

		gripper.attr("d", path);
	},

	_renderHandles: function() {

		var leftHandle = this.svg.selectAll("rect.left_handle")
			.data([null]);

		leftHandle.enter()
			.append("rect")
			.attr('width', this.config.frameHandleThickness)
			.style("cursor", "ew-resize")
			.style("fill-opacity", "0")
			.classed("left_handle", true);

		leftHandle
			.attr('x', this.currentFrame[0])
			.attr('height', this.config.height);

		var rightHandle = this.svg.selectAll("rect.right_handle")
			.data([null]);

		rightHandle.enter()
			.append("rect")
			.attr('width', this.config.frameHandleThickness)
			.style("cursor", "ew-resize")
			.style("fill-opacity", "0")
			.classed("right_handle", true);

		rightHandle
			.attr('x', this.currentFrame[1] + this.config.frameHandleThickness)
			.attr('height', this.config.height);
	},

	_renderMiddle: function() {

		var middleHandle = this.svg.selectAll("rect.middle_handle")
			.data([null]);

		middleHandle.enter()
			.append("rect")
			.style("cursor", "move")
			.style("fill-opacity", "0")
			.classed("middle_handle", true);

		middleHandle
			.attr('width', Math.max(0, this.currentFrame[1] - this.currentFrame[0]))
			.attr('x', this.currentFrame[0] + this.config.frameHandleThickness)
			.attr('height', this.config.height);
	},

	_registerMouseEvents: function() {

		var element = d3.select(this.element);

		var drag = {
			target: null,
			start: null,
			stop: null,
			left: false,
			right: false,
			rigid: false
		};

		var self = this;

		function onMousemove(datum, index) {

			drag.stop = self._getClientXFromEvent(d3.event, drag);
			var distanceTraveled = drag.stop - drag.start;
			var frameAfterDrag = self.frameBeforeDrag.slice(0);
			var minimumFrameWidth = self.config.minimumFrameWidth;

			if (drag.rigid) {
				minimumFrameWidth = self.frameBeforeDrag[1] - self.frameBeforeDrag[0];
			}
			if (drag.left) {
				frameAfterDrag[0] = Math.max(frameAfterDrag[0] + distanceTraveled, 0);
			}
			if (drag.right) {
				frameAfterDrag[1] = Math.min(frameAfterDrag[1] + distanceTraveled, self.previewWidth);
			}

			var currentFrameWidth = frameAfterDrag[1] - frameAfterDrag[0];

			if (currentFrameWidth <= minimumFrameWidth) {

				if (drag.left) {
					frameAfterDrag[0] = frameAfterDrag[1] - minimumFrameWidth;
				}
				if (drag.right) {
					frameAfterDrag[1] = frameAfterDrag[0] + minimumFrameWidth;
				}
				if (frameAfterDrag[0] <= 0) {
					frameAfterDrag[1] -= frameAfterDrag[0];
					frameAfterDrag[0] = 0;
				}
				if (frameAfterDrag[1] >= self.previewWidth) {
					frameAfterDrag[0] -= (frameAfterDrag[1] - self.previewWidth);
					frameAfterDrag[1] = self.previewWidth;
				}
			}

			self.graphs.forEach(function(graph) {

				var domainScale = d3.scale.linear()
					.interpolate(d3.interpolateNumber)
					.domain([0, self.previewWidth])
					.range(graph.dataDomain());

				var windowAfterDrag = [
					domainScale(frameAfterDrag[0]),
					domainScale(frameAfterDrag[1])
				];

				self.slideCallbacks.forEach(function(callback) {
					callback(graph, windowAfterDrag[0], windowAfterDrag[1]);
				});

				if (frameAfterDrag[0] === 0) {
					windowAfterDrag[0] = undefined;
				}
				if (frameAfterDrag[1] === self.previewWidth) {
					windowAfterDrag[1] = undefined;
				}
				graph.window.xMin = windowAfterDrag[0];
				graph.window.xMax = windowAfterDrag[1];

				graph.update();
			});
		}

		function onMousedown() {
			drag.target = d3.event.target;
			drag.start = self._getClientXFromEvent(d3.event, drag);
			self.frameBeforeDrag = self.currentFrame.slice();
			d3.event.preventDefault ? d3.event.preventDefault() : d3.event.returnValue = false;
			d3.select(document).on("mousemove.rickshaw_range_slider_preview", onMousemove);
			d3.select(document).on("mouseup.rickshaw_range_slider_preview", onMouseup);
			d3.select(document).on("touchmove.rickshaw_range_slider_preview", onMousemove);
			d3.select(document).on("touchend.rickshaw_range_slider_preview", onMouseup);
			d3.select(document).on("touchcancel.rickshaw_range_slider_preview", onMouseup);
		}

		function onMousedownLeftHandle(datum, index) {
			drag.left = true;
			onMousedown();
		}

		function onMousedownRightHandle(datum, index) {
			drag.right = true;
			onMousedown();
		}

		function onMousedownMiddleHandle(datum, index) {
			drag.left = true;
			drag.right = true;
			drag.rigid = true;
			onMousedown();
		}

		function onMouseup(datum, index) {
			d3.select(document).on("mousemove.rickshaw_range_slider_preview", null);
			d3.select(document).on("mouseup.rickshaw_range_slider_preview", null);
			d3.select(document).on("touchmove.rickshaw_range_slider_preview", null);
			d3.select(document).on("touchend.rickshaw_range_slider_preview", null);
			d3.select(document).on("touchcancel.rickshaw_range_slider_preview", null);
			delete self.frameBeforeDrag;
			drag.left = false;
			drag.right = false;
			drag.rigid = false;
		}

		element.select("rect.left_handle").on("mousedown", onMousedownLeftHandle);
		element.select("rect.right_handle").on("mousedown", onMousedownRightHandle);
		element.select("rect.middle_handle").on("mousedown", onMousedownMiddleHandle);
		element.select("rect.left_handle").on("touchstart", onMousedownLeftHandle);
		element.select("rect.right_handle").on("touchstart", onMousedownRightHandle);
		element.select("rect.middle_handle").on("touchstart", onMousedownMiddleHandle);
	},

	_getClientXFromEvent: function(event, drag) {

		switch (event.type) {
			case 'touchstart':
			case 'touchmove':
				var touchList = event.changedTouches;
				var touch = null;
				for (var touchIndex = 0; touchIndex < touchList.length; touchIndex++) {
					if (touchList[touchIndex].target === drag.target) {
						touch = touchList[touchIndex];
						break;
					}
				}
				return touch !== null ? touch.clientX : undefined;

			default:
				return event.clientX;
		}
	}
});

Rickshaw.namespace("Rickshaw.Graph.Renderer");

Rickshaw.Graph.Renderer = Rickshaw.Class.create( {

	initialize: function(args) {
		this.graph = args.graph;
		this.tension = args.tension || this.tension;
		this.configure(args);
	},

	seriesPathFactory: function() {
		//implement in subclass
	},

	seriesStrokeFactory: function() {
		// implement in subclass
	},

	defaults: function() {
		return {
			tension: 0.8,
			strokeWidth: 2,
			unstack: true,
			padding: { top: 0.01, right: 0, bottom: 0.01, left: 0 },
			stroke: false,
			fill: false,
			opacity: 1
		};
	},

	domain: function(data) {
		// Requires that at least one series contains some data
		var stackedData = data || this.graph.stackedData || this.graph.stackData();

		var xMin = +Infinity;
		var xMax = -Infinity;

		var yMin = +Infinity;
		var yMax = -Infinity;

		stackedData.forEach( function(series) {

			series.forEach( function(d) {

				if (d.y == null) return;

				var y = d.y + d.y0;

				if (y < yMin) yMin = y;
				if (y > yMax) yMax = y;
			} );

			if (!series.length) return;

			if (series[0].x < xMin) xMin = series[0].x;
			if (series[series.length - 1].x > xMax) xMax = series[series.length - 1].x;
		} );

		xMin -= (xMax - xMin) * this.padding.left;
		xMax += (xMax - xMin) * this.padding.right;

		yMin = this.graph.min === 'auto' ? yMin : this.graph.min || 0;
		yMax = this.graph.max === undefined ? yMax : this.graph.max;

		if (this.graph.min === 'auto' || yMin < 0) {
			yMin -= (yMax - yMin) * this.padding.bottom;
		}

		if (this.graph.max === undefined) {
			yMax += (yMax - yMin) * this.padding.top;
		}

		return { x: [xMin, xMax], y: [yMin, yMax] };
	},

	render: function(args) {

		args = args || {};

		var graph = this.graph;
		var series = args.series || graph.series;

		var vis = args.vis || graph.vis;
		vis.selectAll('*').remove();

		var data = series
			.filter(function(s) { return !s.disabled })
			.map(function(s) { return s.stack });

		var pathNodes = vis.selectAll("path.path")
			.data(data)
			.enter().append("svg:path")
			.classed('path', true)
			.attr("d", this.seriesPathFactory());

		if (this.stroke) {
                        var strokeNodes = vis.selectAll('path.stroke')
                                .data(data)
                                .enter().append("svg:path")
				.classed('stroke', true)
				.attr("d", this.seriesStrokeFactory());
		}

		var i = 0;
		series.forEach( function(series) {
			if (series.disabled) return;
			series.path = pathNodes[0][i];
			if (this.stroke) series.stroke = strokeNodes[0][i];
			this._styleSeries(series);
			i++;
		}, this );

	},

	_styleSeries: function(series) {

		var fill = this.fill ? series.color : 'none';
		var stroke = this.stroke ? series.color : 'none';
		var strokeWidth = series.strokeWidth ? series.strokeWidth : this.strokeWidth;
		var opacity = series.opacity ? series.opacity : this.opacity;

		series.path.setAttribute('fill', fill);
		series.path.setAttribute('stroke', stroke);
		series.path.setAttribute('stroke-width', strokeWidth);
		series.path.setAttribute('opacity', opacity);

		if (series.className) {
			d3.select(series.path).classed(series.className, true);
		}
		if (series.className && this.stroke) {
			d3.select(series.stroke).classed(series.className, true);
		}
	},

	configure: function(args) {

		args = args || {};

		Rickshaw.keys(this.defaults()).forEach( function(key) {

			if (!args.hasOwnProperty(key)) {
				this[key] = this[key] || this.graph[key] || this.defaults()[key];
				return;
			}

			if (typeof this.defaults()[key] == 'object') {

				Rickshaw.keys(this.defaults()[key]).forEach( function(k) {

					this[key][k] =
						args[key][k] !== undefined ? args[key][k] :
						this[key][k] !== undefined ? this[key][k] :
						this.defaults()[key][k];
				}, this );

			} else {
				this[key] =
					args[key] !== undefined ? args[key] :
					this[key] !== undefined ? this[key] :
					this.graph[key] !== undefined ? this.graph[key] :
					this.defaults()[key];
			}

		}, this );
	},

	setStrokeWidth: function(strokeWidth) {
		if (strokeWidth !== undefined) {
			this.strokeWidth = strokeWidth;
		}
	},

	setTension: function(tension) {
		if (tension !== undefined) {
			this.tension = tension;
		}
	}
} );

Rickshaw.namespace('Rickshaw.Graph.Renderer.Line');

Rickshaw.Graph.Renderer.Line = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'line',

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			unstack: true,
			fill: false,
			stroke: true
		} );
	},

	seriesPathFactory: function() {

		var graph = this.graph;

		var factory = d3.svg.line()
			.x( function(d) { return graph.x(d.x) } )
			.y( function(d) { return graph.y(d.y) } )
			.interpolate(this.graph.interpolation).tension(this.tension);

		factory.defined && factory.defined( function(d) { return d.y !== null } );
		return factory;
	}
} );

Rickshaw.namespace('Rickshaw.Graph.Renderer.Stack');

Rickshaw.Graph.Renderer.Stack = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'stack',

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			fill: true,
			stroke: false,
			unstack: false
		} );
	},

	seriesPathFactory: function() {

		var graph = this.graph;

		var factory = d3.svg.area()
			.x( function(d) { return graph.x(d.x) } )
			.y0( function(d) { return graph.y(d.y0) } )
			.y1( function(d) { return graph.y(d.y + d.y0) } )
			.interpolate(this.graph.interpolation).tension(this.tension);

		factory.defined && factory.defined( function(d) { return d.y !== null } );
		return factory;
	}
} );

Rickshaw.namespace('Rickshaw.Graph.Renderer.Bar');

Rickshaw.Graph.Renderer.Bar = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'bar',

	defaults: function($super) {

		var defaults = Rickshaw.extend( $super(), {
			gapSize: 0.05,
			unstack: false,
			opacity: 1.0
		} );

		delete defaults.tension;
		return defaults;
	},

	initialize: function($super, args) {
		args = args || {};
		this.gapSize = args.gapSize || this.gapSize;
		$super(args);
	},

	domain: function($super) {

		var domain = $super();

		var frequentInterval = this._frequentInterval(this.graph.stackedData.slice(-1).shift());
		domain.x[1] += Number(frequentInterval.magnitude);

		return domain;
	},

	barWidth: function(series) {

		var frequentInterval = this._frequentInterval(series.stack);
		var barWidth = this.graph.x.magnitude(frequentInterval.magnitude) * (1 - this.gapSize);

		return barWidth;
	},

	render: function(args) {

		args = args || {};

		var graph = this.graph;
		var series = args.series || graph.series;

		var vis = args.vis || graph.vis;
		vis.selectAll('*').remove();

		var barWidth = this.barWidth(series.active()[0]);
		var barXOffset = 0;

		var activeSeriesCount = series.filter( function(s) { return !s.disabled; } ).length;
		var seriesBarWidth = this.unstack ? barWidth / activeSeriesCount : barWidth;

		var transform = function(d) {
			// add a matrix transform for negative values
			var matrix = [ 1, 0, 0, (d.y < 0 ? -1 : 1), 0, (d.y < 0 ? graph.y.magnitude(Math.abs(d.y)) * 2 : 0) ];
			return "matrix(" + matrix.join(',') + ")";
		};

		series.forEach( function(series) {

			if (series.disabled) return;

			var barWidth = this.barWidth(series);

			var nodes = vis.selectAll("path")
				.data(series.stack.filter( function(d) { return d.y !== null } ))
				.enter().append("svg:rect")
				.attr("x", function(d) { return graph.x(d.x) + barXOffset })
				.attr("y", function(d) { return (graph.y(d.y0 + Math.abs(d.y))) * (d.y < 0 ? -1 : 1 ) })
				.attr("width", seriesBarWidth)
				.attr("height", function(d) { return graph.y.magnitude(Math.abs(d.y)) })
				.attr("opacity", series.opacity)
				.attr("transform", transform);

			Array.prototype.forEach.call(nodes[0], function(n) {
				n.setAttribute('fill', series.color);
			} );

			if (this.unstack) barXOffset += seriesBarWidth;

		}, this );
	},

	_frequentInterval: function(data) {

		var intervalCounts = {};

		for (var i = 0; i < data.length - 1; i++) {
			var interval = data[i + 1].x - data[i].x;
			intervalCounts[interval] = intervalCounts[interval] || 0;
			intervalCounts[interval]++;
		}

		var frequentInterval = { count: 0, magnitude: 1 };

		Rickshaw.keys(intervalCounts).forEach( function(i) {
			if (frequentInterval.count < intervalCounts[i]) {
				frequentInterval = {
					count: intervalCounts[i],
					magnitude: i
				};
			}
		} );

		return frequentInterval;
	}
} );

Rickshaw.namespace('Rickshaw.Graph.Renderer.Area');

Rickshaw.Graph.Renderer.Area = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'area',

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			unstack: false,
			fill: false,
			stroke: false
		} );
	},

	seriesPathFactory: function() {

		var graph = this.graph;

		var factory = d3.svg.area()
			.x( function(d) { return graph.x(d.x) } )
			.y0( function(d) { return graph.y(d.y0) } )
			.y1( function(d) { return graph.y(d.y + d.y0) } )
			.interpolate(graph.interpolation).tension(this.tension);

		factory.defined && factory.defined( function(d) { return d.y !== null } );
		return factory;
	},

	seriesStrokeFactory: function() {

		var graph = this.graph;

		var factory = d3.svg.line()
			.x( function(d) { return graph.x(d.x) } )
			.y( function(d) { return graph.y(d.y + d.y0) } )
			.interpolate(graph.interpolation).tension(this.tension);

		factory.defined && factory.defined( function(d) { return d.y !== null } );
		return factory;
	},

	render: function(args) {

		args = args || {};

		var graph = this.graph;
		var series = args.series || graph.series;

		var vis = args.vis || graph.vis;
		vis.selectAll('*').remove();

		// insert or stacked areas so strokes lay on top of areas
		var method = this.unstack ? 'append' : 'insert';

		var data = series
			.filter(function(s) { return !s.disabled })
			.map(function(s) { return s.stack });

		var nodes = vis.selectAll("path")
			.data(data)
			.enter()[method]("svg:g", 'g');

		nodes.append("svg:path")
			.attr("d", this.seriesPathFactory())
			.attr("class", 'area');

		if (this.stroke) {
			nodes.append("svg:path")
				.attr("d", this.seriesStrokeFactory())
				.attr("class", 'line');
		}

		var i = 0;
		series.forEach( function(series) {
			if (series.disabled) return;
			series.path = nodes[0][i++];
			this._styleSeries(series);
		}, this );
	},

	_styleSeries: function(series) {

		if (!series.path) return;

		d3.select(series.path).select('.area')
			.attr('fill', series.color);

		if (this.stroke) {
			d3.select(series.path).select('.line')
				.attr('fill', 'none')
				.attr('stroke', series.stroke || d3.interpolateRgb(series.color, 'black')(0.125))
				.attr('stroke-width', this.strokeWidth);
		}

		if (series.className) {
			series.path.setAttribute('class', series.className);
		}
	}
} );

Rickshaw.namespace('Rickshaw.Graph.Renderer.ScatterPlot');

Rickshaw.Graph.Renderer.ScatterPlot = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'scatterplot',

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			unstack: true,
			fill: true,
			stroke: false,
			padding:{ top: 0.01, right: 0.01, bottom: 0.01, left: 0.01 },
			dotSize: 4
		} );
	},

	initialize: function($super, args) {
		$super(args);
	},

	render: function(args) {

		args = args || {};

		var graph = this.graph;

		var series = args.series || graph.series;
		var vis = args.vis || graph.vis;

		var dotSize = this.dotSize;

		vis.selectAll('*').remove();

		series.forEach( function(series) {

			if (series.disabled) return;
			var opacity = series.opacity ? series.opacity : 1;

			var nodes = vis.selectAll("path")
				.data(series.stack.filter( function(d) { return d.y !== null } ))
				.enter().append("svg:circle")
					.attr("cx", function(d) { return graph.x(d.x) })
					.attr("cy", function(d) { return graph.y(d.y) })
					.attr("r", function(d) { return ("r" in d) ? d.r : dotSize})
					.attr("opacity", function(d) { return ("opacity" in d) ? d.opacity : opacity});
			if (series.className) {
				nodes.classed(series.className, true);
			}
			
			Array.prototype.forEach.call(nodes[0], function(n) {
				n.setAttribute('fill', series.color);
			} );

		}, this );
	}
} );
Rickshaw.namespace('Rickshaw.Graph.Renderer.Multi');

Rickshaw.Graph.Renderer.Multi = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'multi',

	initialize: function($super, args) {

		$super(args);
	},

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			unstack: true,
			fill: false,
			stroke: true 
		} );
	},

	configure: function($super, args) {

		args = args || {};
		this.config = args;
		$super(args);
	},

	domain: function($super) {

		this.graph.stackData();

		var domains = [];

		var groups = this._groups();
		this._stack(groups);

		groups.forEach( function(group) {

			var data = group.series
				.filter( function(s) { return !s.disabled } )
				.map( function(s) { return s.stack });

			if (!data.length) return;
			
			var domain = null;
			if (group.renderer && group.renderer.domain) {
				domain = group.renderer.domain(data);
			}
			else {
				domain = $super(data);
			}
			domains.push(domain);
		});

		var xMin = d3.min(domains.map( function(d) { return d.x[0] } ));
		var xMax = d3.max(domains.map( function(d) { return d.x[1] } ));
		var yMin = d3.min(domains.map( function(d) { return d.y[0] } ));
		var yMax = d3.max(domains.map( function(d) { return d.y[1] } ));

		return { x: [xMin, xMax], y: [yMin, yMax] };
	},

	_groups: function() {

		var graph = this.graph;

		var renderGroups = {};

		graph.series.forEach( function(series) {

			if (series.disabled) return;

			if (!renderGroups[series.renderer]) {

				var ns = "http://www.w3.org/2000/svg";
				var vis = document.createElementNS(ns, 'g');

				graph.vis[0][0].appendChild(vis);

				var renderer = graph._renderers[series.renderer];

				var config = {};

				var defaults = [ this.defaults(), renderer.defaults(), this.config, this.graph ];
				defaults.forEach(function(d) { Rickshaw.extend(config, d) });

				renderer.configure(config);

				renderGroups[series.renderer] = {
					renderer: renderer,
					series: [],
					vis: d3.select(vis)
				};
			}
				
			renderGroups[series.renderer].series.push(series);

		}, this);

		var groups = [];

		Object.keys(renderGroups).forEach( function(key) {
			var group = renderGroups[key];
			groups.push(group);
		});

		return groups;
	},

	_stack: function(groups) {

		groups.forEach( function(group) {

			var series = group.series
				.filter( function(series) { return !series.disabled } );

			var data = series
				.map( function(series) { return series.stack } );

			if (!group.renderer.unstack) {

				var layout = d3.layout.stack();
				var stackedData = Rickshaw.clone(layout(data));

				series.forEach( function(series, index) {
					series._stack = Rickshaw.clone(stackedData[index]);
				});
			}

		}, this );

		return groups;

	},

	render: function() {

		this.graph.series.forEach( function(series) {
			if (!series.renderer) {
				throw new Error("Each series needs a renderer for graph 'multi' renderer");
			}
		});

		this.graph.vis.selectAll('*').remove();

		var groups = this._groups();
		groups = this._stack(groups);

		groups.forEach( function(group) {

			var series = group.series
				.filter( function(series) { return !series.disabled } );

			series.active = function() { return series };

			group.renderer.render({ series: series, vis: group.vis });
			series.forEach(function(s) { s.stack = s._stack || s.stack || s.data; });
		});
	}

} );
Rickshaw.namespace('Rickshaw.Graph.Renderer.LinePlot');

Rickshaw.Graph.Renderer.LinePlot = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

	name: 'lineplot',

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			unstack: true,
			fill: false,
			stroke: true,
			padding:{ top: 0.01, right: 0.01, bottom: 0.01, left: 0.01 },
			dotSize: 3,
			strokeWidth: 2
		} );
	},

	seriesPathFactory: function() {

		var graph = this.graph;

		var factory = d3.svg.line()
			.x( function(d) { return graph.x(d.x) } )
			.y( function(d) { return graph.y(d.y) } )
			.interpolate(this.graph.interpolation).tension(this.tension);

		factory.defined && factory.defined( function(d) { return d.y !== null } );
		return factory;
	},

	render: function(args) {

		args = args || {};

		var graph = this.graph;

		var series = args.series || graph.series;
		var vis = args.vis || graph.vis;

		var dotSize = this.dotSize;

		vis.selectAll('*').remove();

		var data = series
			.filter(function(s) { return !s.disabled })
			.map(function(s) { return s.stack });

		var nodes = vis.selectAll("path")
			.data(data)
			.enter().append("svg:path")
			.attr("d", this.seriesPathFactory());

		var i = 0;
		series.forEach(function(series) {
			if (series.disabled) return;
			series.path = nodes[0][i++];
			this._styleSeries(series);
		}, this);

		series.forEach(function(series) {

			if (series.disabled) return;

			var nodes = vis.selectAll("x")
				.data(series.stack.filter( function(d) { return d.y !== null } ))
				.enter().append("svg:circle")
				.attr("cx", function(d) { return graph.x(d.x) })
				.attr("cy", function(d) { return graph.y(d.y) })
				.attr("r", function(d) { return ("r" in d) ? d.r : dotSize});

			Array.prototype.forEach.call(nodes[0], function(n) {
				if (!n) return;
				n.setAttribute('data-color', series.color);
				n.setAttribute('fill', 'white');
				n.setAttribute('stroke', series.color);
				n.setAttribute('stroke-width', this.strokeWidth);

			}.bind(this));

		}, this);
	}
} );

Rickshaw.namespace('Rickshaw.Graph.Smoother');

Rickshaw.Graph.Smoother = Rickshaw.Class.create({

	initialize: function(args) {

		this.graph = args.graph;
		this.element = args.element;
		this.aggregationScale = 1;

		this.build();

		this.graph.stackData.hooks.data.push( {
			name: 'smoother',
			orderPosition: 50,
			f: this.transformer.bind(this)
		} );
	},

	build: function() {

		var self = this;
		var $ = jQuery;

		if (this.element) {
			$( function() {
				$(self.element).slider( {
					min: 1,
					max: 100,
					slide: function( event, ui ) {
						self.setScale(ui.value);
					}
				} );
			} );
		}
	},

	setScale: function(scale) {

		if (scale < 1) {
			throw "scale out of range: " + scale;
		}

		this.aggregationScale = scale;
		this.graph.update();
	},

	transformer: function(data) {

		if (this.aggregationScale == 1) return data;

		var aggregatedData = [];

		data.forEach( function(seriesData) {

			var aggregatedSeriesData = [];

			while (seriesData.length) {

				var avgX = 0, avgY = 0;
				var slice = seriesData.splice(0, this.aggregationScale);

				slice.forEach( function(d) {
					avgX += d.x / slice.length;
					avgY += d.y / slice.length;
				} );

				aggregatedSeriesData.push( { x: avgX, y: avgY } );
			}

			aggregatedData.push(aggregatedSeriesData);

		}.bind(this) );

		return aggregatedData;
	}
});

Rickshaw.namespace('Rickshaw.Graph.Socketio');

Rickshaw.Graph.Socketio = Rickshaw.Class.create( Rickshaw.Graph.Ajax, {
	request: function() {
		var socket = io.connect(this.dataURL);
		var self = this;
		socket.on('rickshaw', function (data) {
			self.success(data);
		});
	}
} );
Rickshaw.namespace('Rickshaw.Series');

Rickshaw.Series = Rickshaw.Class.create( Array, {

	initialize: function (data, palette, options) {

		options = options || {};

		this.palette = new Rickshaw.Color.Palette(palette);

		this.timeBase = typeof(options.timeBase) === 'undefined' ? 
			Math.floor(new Date().getTime() / 1000) : 
			options.timeBase;

		var timeInterval = typeof(options.timeInterval) == 'undefined' ?
			1000 :
			options.timeInterval;

		this.setTimeInterval(timeInterval);

		if (data && (typeof(data) == "object") && Array.isArray(data)) {
			data.forEach( function(item) { this.addItem(item) }, this );
		}
	},

	addItem: function(item) {

		if (typeof(item.name) === 'undefined') {
			throw('addItem() needs a name');
		}

		item.color = (item.color || this.palette.color(item.name));
		item.data = (item.data || []);

		// backfill, if necessary
		if ((item.data.length === 0) && this.length && (this.getIndex() > 0)) {
			this[0].data.forEach( function(plot) {
				item.data.push({ x: plot.x, y: 0 });
			} );
		} else if (item.data.length === 0) {
			item.data.push({ x: this.timeBase - (this.timeInterval || 0), y: 0 });
		} 

		this.push(item);

		if (this.legend) {
			this.legend.addLine(this.itemByName(item.name));
		}
	},

	addData: function(data, x) {

		var index = this.getIndex();

		Rickshaw.keys(data).forEach( function(name) {
			if (! this.itemByName(name)) {
				this.addItem({ name: name });
			}
		}, this );

		this.forEach( function(item) {
			item.data.push({ 
				x: x || (index * this.timeInterval || 1) + this.timeBase, 
				y: (data[item.name] || 0) 
			});
		}, this );
	},

	getIndex: function () {
		return (this[0] && this[0].data && this[0].data.length) ? this[0].data.length : 0;
	},

	itemByName: function(name) {

		for (var i = 0; i < this.length; i++) {
			if (this[i].name == name)
				return this[i];
		}
	},

	setTimeInterval: function(iv) {
		this.timeInterval = iv / 1000;
	},

	setTimeBase: function (t) {
		this.timeBase = t;
	},

	dump: function() {

		var data = {
			timeBase: this.timeBase,
			timeInterval: this.timeInterval,
			items: []
		};

		this.forEach( function(item) {

			var newItem = {
				color: item.color,
				name: item.name,
				data: []
			};

			item.data.forEach( function(plot) {
				newItem.data.push({ x: plot.x, y: plot.y });
			} );

			data.items.push(newItem);
		} );

		return data;
	},

	load: function(data) {

		if (data.timeInterval) {
			this.timeInterval = data.timeInterval;
		}

		if (data.timeBase) {
			this.timeBase = data.timeBase;
		}

		if (data.items) {
			data.items.forEach( function(item) {
				this.push(item);
				if (this.legend) {
					this.legend.addLine(this.itemByName(item.name));
				}

			}, this );
		}
	}
} );

Rickshaw.Series.zeroFill = function(series) {
	Rickshaw.Series.fill(series, 0);
};

Rickshaw.Series.fill = function(series, fill) {

	var x;
	var i = 0;

	var data = series.map( function(s) { return s.data } );

	while ( i < Math.max.apply(null, data.map( function(d) { return d.length } )) ) {

		x = Math.min.apply( null, 
			data
				.filter(function(d) { return d[i] })
				.map(function(d) { return d[i].x })
		);

		data.forEach( function(d) {
			if (!d[i] || d[i].x != x) {
				d.splice(i, 0, { x: x, y: fill });
			}
		} );

		i++;
	}
};

Rickshaw.namespace('Rickshaw.Series.FixedDuration');

Rickshaw.Series.FixedDuration = Rickshaw.Class.create(Rickshaw.Series, {

	initialize: function (data, palette, options) {

		options = options || {};

		if (typeof(options.timeInterval) === 'undefined') {
			throw new Error('FixedDuration series requires timeInterval');
		}

		if (typeof(options.maxDataPoints) === 'undefined') {
			throw new Error('FixedDuration series requires maxDataPoints');
		}

		this.palette = new Rickshaw.Color.Palette(palette);
		this.timeBase = typeof(options.timeBase) === 'undefined' ? Math.floor(new Date().getTime() / 1000) : options.timeBase;
		this.setTimeInterval(options.timeInterval);

		if (this[0] && this[0].data && this[0].data.length) {
			this.currentSize = this[0].data.length;
			this.currentIndex = this[0].data.length;
		} else {
			this.currentSize  = 0;
			this.currentIndex = 0;
		}

		this.maxDataPoints = options.maxDataPoints;


		if (data && (typeof(data) == "object") && Array.isArray(data)) {
			data.forEach( function (item) { this.addItem(item) }, this );
			this.currentSize  += 1;
			this.currentIndex += 1;
		}

		// reset timeBase for zero-filled values if needed
		this.timeBase -= (this.maxDataPoints - this.currentSize) * this.timeInterval;

		// zero-fill up to maxDataPoints size if we don't have that much data yet
		if ((typeof(this.maxDataPoints) !== 'undefined') && (this.currentSize < this.maxDataPoints)) {
			for (var i = this.maxDataPoints - this.currentSize - 1; i > 1; i--) {
				this.currentSize  += 1;
				this.currentIndex += 1;
				this.forEach( function (item) {
					item.data.unshift({ x: ((i-1) * this.timeInterval || 1) + this.timeBase, y: 0, i: i });
				}, this );
			}
		}
	},

	addData: function($super, data, x) {

		$super(data, x);

		this.currentSize += 1;
		this.currentIndex += 1;

		if (this.maxDataPoints !== undefined) {
			while (this.currentSize > this.maxDataPoints) {
				this.dropData();
			}
		}
	},

	dropData: function() {

		this.forEach(function(item) {
			item.data.splice(0, 1);
		} );

		this.currentSize -= 1;
	},

	getIndex: function () {
		return this.currentIndex;
	}
} );

	return Rickshaw;
}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js"), __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/components/d3/d3.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
__webpack_require__("./node_modules/d3/d3.js");
var D3Module = (function () {
    function D3Module() {
    }
    D3Module = __decorate([
        core_1.NgModule({}), 
        __metadata('design:paramtypes', [])
    ], D3Module);
    return D3Module;
}());
exports.D3Module = D3Module;


/***/ },

/***/ "./src/app/components/rickshaw/rickshaw.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery, Rickshaw) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var RickshawChart = (function () {
    function RickshawChart(el) {
        this.$el = jQuery(el.nativeElement);
    }
    RickshawChart.prototype.render = function () {
        var _this = this;
        var graph = new Rickshaw.Graph({
            element: this.$el[0],
            height: this.height,
            renderer: this.renderer || 'area',
            series: this.series
        });
        var onResize = function () {
            var configureProperties = jQuery.extend({
                height: _this.height
            }, _this.configureProps);
            graph.configure(configureProperties);
            graph.render();
            _this.$el.find('svg').css({ height: _this.height, width: '100%' });
        };
        jQuery(window).on('sn:resize', onResize);
        onResize();
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph,
            xFormatter: function (x) {
                return new Date(x * 1000).toString();
            }
        });
        if (this.realtime) {
            setInterval(function () {
                _this.random.removeData(_this.seriesData);
                _this.random.addData(_this.seriesData);
                graph.update();
            }, 1000);
        }
    };
    RickshawChart.prototype.ngOnInit = function () {
        this.render();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RickshawChart.prototype, "height", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RickshawChart.prototype, "series", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RickshawChart.prototype, "seriesData", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RickshawChart.prototype, "random", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RickshawChart.prototype, "configureProps", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], RickshawChart.prototype, "realtime", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RickshawChart.prototype, "renderer", void 0);
    RickshawChart = __decorate([
        core_1.Directive({
            selector: '[rickshaw-chart]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], RickshawChart);
    return RickshawChart;
    var _a;
}());
exports.RickshawChart = RickshawChart;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js"), __webpack_require__("./node_modules/rickshaw/rickshaw.js")))

/***/ },

/***/ "./src/app/components/rickshaw/rickshaw.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var d3_module_1 = __webpack_require__("./src/app/components/d3/d3.module.ts");
__webpack_require__("./node_modules/rickshaw/rickshaw.js");
var rickshaw_directive_1 = __webpack_require__("./src/app/components/rickshaw/rickshaw.directive.ts");
var RickshawChartModule = (function () {
    function RickshawChartModule() {
    }
    RickshawChartModule = __decorate([
        core_1.NgModule({
            imports: [
                d3_module_1.D3Module
            ],
            declarations: [
                rickshaw_directive_1.RickshawChart
            ],
            exports: [
                rickshaw_directive_1.RickshawChart
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], RickshawChartModule);
    return RickshawChartModule;
}());
exports.RickshawChartModule = RickshawChartModule;


/***/ },

/***/ "./src/app/components/tile/tile.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var LiveTile = (function () {
    function LiveTile(el) {
        this.$el = jQuery(el.nativeElement);
    }
    LiveTile.prototype.ngOnInit = function () {
        this.$el
            .css('height', this.$el.data('height'))
            .liveTile();
    };
    LiveTile = __decorate([
        core_1.Directive({
            selector: '[live-tile]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], LiveTile);
    return LiveTile;
    var _a;
}());
exports.LiveTile = LiveTile;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/components/tile/tile.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var tile_directive_1 = __webpack_require__("./src/app/components/tile/tile.directive.ts");
__webpack_require__("./node_modules/metrojs/release/MetroJs.Full/MetroJs.js");
var LiveTileModule = (function () {
    function LiveTileModule() {
    }
    LiveTileModule = __decorate([
        core_1.NgModule({
            declarations: [
                tile_directive_1.LiveTile
            ],
            exports: [
                tile_directive_1.LiveTile
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LiveTileModule);
    return LiveTileModule;
}());
exports.LiveTileModule = LiveTileModule;


/***/ },

/***/ "./src/app/dashboard/bootstrap-calendar/bootstrap-calendar.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var BootstrapCalendar = (function () {
    function BootstrapCalendar(el) {
        this.$el = jQuery(el.nativeElement);
    }
    BootstrapCalendar.prototype.render = function () {
        var monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        var dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        var events = this.events;
        var $calendar = this.$el;
        $calendar.calendar({
            months: monthNames,
            days: dayNames,
            events: events,
            popover_options: {
                placement: 'top',
                html: true
            }
        });
        $calendar.find('.icon-arrow-left').addClass('fa fa-arrow-left');
        $calendar.find('.icon-arrow-right').addClass('fa fa-arrow-right');
        function restyleCalendar() {
            $calendar.find('.event').each(function () {
                var $this = jQuery(this), $eventIndicator = jQuery('<span></span>');
                $eventIndicator
                    .css('background-color', $this.css('background-color'))
                    .appendTo($this.find('a'));
                $this.css('background-color', '');
            });
        }
        $calendar.find('.icon-arrow-left, .icon-arrow-right').parent().on('click', restyleCalendar);
        restyleCalendar();
    };
    BootstrapCalendar.prototype.ngOnInit = function () {
        this.render();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], BootstrapCalendar.prototype, "events", void 0);
    BootstrapCalendar = __decorate([
        core_1.Directive({
            selector: '[bootstrap-calendar]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], BootstrapCalendar);
    return BootstrapCalendar;
    var _a;
}());
exports.BootstrapCalendar = BootstrapCalendar;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/dashboard/dashboard.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var app_config_1 = __webpack_require__("./src/app/app.config.ts");
var UsersService_1 = __webpack_require__("./src/app/services/UsersService.ts");
var Dashboard = (function () {
    function Dashboard(config, _usersService) {
        var _this = this;
        this._usersService = _usersService;
        this.TotalUsers = 0;
        this.FbUsers = 0;
        this.GoogleUsers = 0;
        this.LinkedINUsers = 0;
        this.TotalTodayUsers = 0;
        this.TotalTodayFbUsers = 0;
        this.TotalTodayGoogleUsers = 0;
        this.TotalTodayLinkedINUsers = 0;
        this.TodayEmailUsers = 0;
        this.EmailUsers = 0;
        this.config = config.getConfig();
        _usersService.getUsersStats()
            .subscribe(function (a) {
            if (a.code == 200) {
                _this.TotalUsers = a.data.TotalUsers;
                _this.FbUsers = a.data.FbUsers;
                _this.GoogleUsers = a.data.GoogleUsers;
                _this.LinkedINUsers = a.data.LinkedINUsers;
                _this.TotalTodayUsers = a.data.TotalTodayUsers;
                _this.TotalTodayFbUsers = a.data.TotalTodayFbUsers;
                _this.TotalTodayGoogleUsers = a.data.TotalTodayGoogleUsers;
                _this.TotalTodayLinkedINUsers = a.data.TotalTodayLinkedINUsers;
                _this.EmailUsers = a.data.EmailUsers;
                _this.TodayEmailUsers = a.data.TodayEmailUsers;
            }
        });
    }
    Dashboard.prototype.ngOnInit = function () {
        var now = new Date();
        this.month = now.getMonth() + 1;
        this.year = now.getFullYear();
    };
    Dashboard = __decorate([
        core_1.Component({
            selector: 'dashboard',
            providers: [UsersService_1.UsersService],
            template: __webpack_require__("./src/app/dashboard/dashboard.template.html"),
            styles: [__webpack_require__("./src/app/dashboard/dashboard.style.scss"), __webpack_require__("./src/app/widgets/widgets.style.scss")],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof app_config_1.AppConfig !== 'undefined' && app_config_1.AppConfig) === 'function' && _a) || Object, (typeof (_b = typeof UsersService_1.UsersService !== 'undefined' && UsersService_1.UsersService) === 'function' && _b) || Object])
    ], Dashboard);
    return Dashboard;
    var _a, _b;
}());
exports.Dashboard = Dashboard;


/***/ },

/***/ "./src/app/dashboard/dashboard.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
__webpack_require__("./node_modules/jquery.animate-number/jquery.animateNumber.js");
__webpack_require__("./node_modules/jQuery-Mapael/js/jquery.mapael.js");
__webpack_require__("./node_modules/jQuery-Mapael/js/maps/usa_states.js");
__webpack_require__("./node_modules/bootstrap_calendar/bootstrap_calendar/js/bootstrap_calendar.js");
var tile_module_1 = __webpack_require__("./src/app/components/tile/tile.module.ts");
var dashboard_component_ts_1 = __webpack_require__("./src/app/dashboard/dashboard.component.ts");
var widget_module_1 = __webpack_require__("./src/app/layout/widget/widget.module.ts");
var utils_module_1 = __webpack_require__("./src/app/layout/utils/utils.module.ts");
var rickshaw_module_1 = __webpack_require__("./src/app/components/rickshaw/rickshaw.module.ts");
var geo_locations_widget_directive_1 = __webpack_require__("./src/app/dashboard/geo-locations-widget/geo-locations-widget.directive.ts");
var market_stats_widget_component_1 = __webpack_require__("./src/app/dashboard/market-stats-widget/market-stats-widget.component.ts");
var bootstrap_calendar_component_1 = __webpack_require__("./src/app/dashboard/bootstrap-calendar/bootstrap-calendar.component.ts");
exports.routes = [
    { path: '', component: dashboard_component_ts_1.Dashboard, pathMatch: 'full' }
];
var DashboardModule = (function () {
    function DashboardModule() {
    }
    DashboardModule.routes = exports.routes;
    DashboardModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                router_1.RouterModule.forChild(exports.routes),
                widget_module_1.WidgetModule,
                utils_module_1.UtilsModule,
                rickshaw_module_1.RickshawChartModule,
                tile_module_1.LiveTileModule
            ],
            declarations: [
                dashboard_component_ts_1.Dashboard,
                geo_locations_widget_directive_1.GeoLocationsWidget,
                bootstrap_calendar_component_1.BootstrapCalendar,
                market_stats_widget_component_1.MarketStatsWidget
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], DashboardModule);
    return DashboardModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardModule;


/***/ },

/***/ "./src/app/dashboard/dashboard.style.scss":
/***/ function(module, exports) {

module.exports = "/*\n * Bootstrap calendar\n */\n.allusers {\n  background-color: #727272 !important; }\n\n.fbusers {\n  background-color: #3b5998 !important; }\n\n.googleusers {\n  background-color: #D50F25 !important; }\n\n.linkedinusers {\n  background-color: #0077B5 !important; }\n\n.cardfa {\n  font-size: 40px;\n  float: right; }\n\n.calendar {\n  font-size: 13px;\n  padding: 0.5rem 0; }\n\n.calendar a {\n  text-decoration: none;\n  cursor: pointer;\n  color: #343434 !important;\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  line-height: 30px;\n  position: relative; }\n\n.calendar td {\n  text-align: center; }\n\n.calendar .header {\n  padding: 10px 0 10px 0;\n  color: #666; }\n  .calendar .header i {\n    cursor: pointer; }\n\n.calendar .prev_month {\n  float: left; }\n\n.calendar .next_month {\n  float: right; }\n\n.calendar .year {\n  text-align: center;\n  font-weight: 500; }\n\n.calendar .week_days {\n  color: #999999; }\n\n.calendar .event {\n  color: white;\n  font-weight: bold;\n  background-color: transparent; }\n  .calendar .event:hover > a {\n    background-color: #eeeeee; }\n  .calendar .event > a {\n    background-color: #fff;\n    border-radius: 50%; }\n    .calendar .event > a > span {\n      display: inline-block;\n      width: 6px;\n      height: 6px;\n      position: absolute;\n      bottom: 1px;\n      right: 1px;\n      border-radius: 50%; }\n  .calendar .event .popover {\n    color: #555555; }\n\n.calendar .table td {\n  padding: 1px 0;\n  border-top: 0; }\n\n.calendar .table {\n  margin-bottom: 3px; }\n  .calendar .table.header {\n    margin-bottom: 0.5rem; }\n\n.calendar .visualmonthyear {\n  color: #999999; }\n\n.dropdown-menu .calendar td a {\n  padding: 0px; }\n\n/**\n * Mapael\n */\n.mapTooltip {\n  position: fixed;\n  padding: 2px;\n  z-index: 1000;\n  max-width: 200px;\n  display: none;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 0.25rem;\n  font-size: 0.875rem;\n  color: #555555; }\n\n.zoomIn, .zoomOut {\n  position: absolute;\n  bottom: 10px;\n  left: 10px;\n  width: 20px;\n  height: 20px;\n  box-sizing: content-box;\n  border: 1px solid #ccc;\n  background-color: #fff;\n  color: #555555;\n  line-height: 20px;\n  text-align: center;\n  border-radius: 0.25rem;\n  cursor: pointer;\n  font-weight: 700;\n  user-select: none; }\n\n.zoomOut {\n  left: 36px; }\n\n.mapael {\n  position: relative;\n  margin: -15px -20px 0; }\n  .mapael .map {\n    position: relative; }\n  .mapael .stats {\n    position: absolute;\n    z-index: 1;\n    top: 0;\n    left: 0;\n    margin: 5% 10%; }\n\n.table td > .abc-checkbox > label:before,\n.table td > .abc-checkbox > label:after,\n.table th > .abc-checkbox > label:before,\n.table th > .abc-checkbox > label:after {\n  margin-left: -16px; }\n\n/***********************/\n/* Part:Progress Stats */\n/***********************/\n.progress-stats .name {\n  margin-bottom: 2px; }\n\n.progress-stats .description {\n  margin-bottom: 2px; }\n\n.progress-stats .status {\n  margin-top: 15px; }\n\n@media (max-width: 1199px) {\n  .progress-stats .description + .progress {\n    margin-bottom: 0; } }\n"

/***/ },

/***/ "./src/app/dashboard/dashboard.template.html":
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-title\">Dashboard <small><small>The Lucky One</small></small></h1>\n<!--<div class=\"clearfix mb-lg\">\n  <img class=\"pull-left mr-sm mt-n-xs\" src=\"assets/img/a2.png\" alt=\"Angular 2.0\" width=\"100\">\n  <p class=\"lead\">You are looking at a completely new version of Sing App built\n    with brand new <strong>Angular 2.0</strong> Final Release!</p>\n  <p class=\"fs-mini\">Made by <a href=\"http://flatlogic.com\" target=\"_blank\">Flatlogic</a>.</p>\n</div>-->\n<div class=\"row\">\n  <div class=\"col-lg-3 col-md-6 col-xs-12\">\n    <section class=\"widget bg-info text-white allusers\">\n      <div class=\"widget-body clearfix\">\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-3\">\n            <span class=\"widget-icon\">\n              <i class=\"glyphicon glyphicon-globe\"></i>\n            </span>\n          </div>\n          <div class=\"col-xs-9\">\n            <div live-tile class=\"live-tile\" data-mode=\"carousel\" data-speed=\"750\" data-delay=\"3000\" data-height=\"57\">\n              <div>\n                <h6 class=\"no-margin\">USERS GROWTH</h6>\n                <p class=\"h2 no-margin fw-normal\">{{TotalUsers}}</p>\n              </div>\n              <div>\n                <h6 class=\"no-margin\">EMAIL USERS</h6>\n                <p class=\"h2 no-margin fw-normal\">{{EmailUsers}}</p>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-10\">\n            <h6 class=\"no-margin\">Today's Registrations</h6>\n            <div live-tile class=\"live-tile\" data-mode=\"carousel\" data-speed=\"750\" data-delay=\"3000\" data-height=\"25\">\n              <div>\n                <p class=\"value5\">{{TotalTodayUsers}}</p>\n              </div>\n              <div>\n                <p class=\"value5\">{{TodayEmailUsers}}</p>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-xs-2\">\n            <i class=\"fa fa-users cardfa\" aria-hidden=\"true\"></i>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n  <div class=\"col-lg-3 col-md-6 col-xs-12\">\n    <section class=\"widget bg-primary text-white fbusers\">\n      <div class=\"widget-body clearfix\">\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-3\">\n            <span class=\"widget-icon\">\n              <i class=\"glyphicon glyphicon-globe\"></i>\n            </span>\n          </div>\n          <div class=\"col-xs-9\">\n            <h6 class=\"no-margin\">USERS GROWTH</h6>\n            <p class=\"h2 no-margin fw-normal\">{{FbUsers}}</p>\n          </div>\n        </div>\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-10\">\n            <h6 class=\"no-margin\">Today's Registrations</h6>\n            <p class=\"value5\">{{TotalTodayFbUsers}}</p>\n          </div>\n          <div class=\"col-xs-2\">\n            <i class=\"fa fa-facebook-square cardfa\" aria-hidden=\"true\"></i>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n  <div class=\"col-lg-3 col-md-6 col-xs-12\">\n    <section class=\"widget bg-primary text-white googleusers\">\n      <div class=\"widget-body clearfix\">\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-3\">\n            <span class=\"widget-icon\">\n              <i class=\"glyphicon glyphicon-globe\"></i>\n            </span>\n          </div>\n          <div class=\"col-xs-9\">\n            <h6 class=\"no-margin\">USERS GROWTH</h6>\n            <p class=\"h2 no-margin fw-normal\">{{GoogleUsers}}</p>\n          </div>\n        </div>\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-10\">\n            <h6 class=\"no-margin\">Today's Registrations</h6>\n            <p class=\"value5\">{{TotalTodayGoogleUsers}}</p>\n          </div>\n          <div class=\"col-xs-2\">\n            <i class=\"fa fa-google-plus-square cardfa\" aria-hidden=\"true\"></i>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n  <div class=\"col-lg-3 col-md-6 col-xs-12\">\n    <section class=\"widget bg-primary text-white linkedinusers\">\n      <div class=\"widget-body clearfix\">\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-3\">\n            <span class=\"widget-icon\">\n              <i class=\"glyphicon glyphicon-globe\"></i>\n            </span>\n          </div>\n          <div class=\"col-xs-9\">\n            <h6 class=\"no-margin\">USERS GROWTH</h6>\n            <p class=\"h2 no-margin fw-normal\">{{LinkedINUsers}}</p>\n          </div>\n        </div>\n        <div class=\"row flex-nowrap\">\n          <div class=\"col-xs-10\">\n            <h6 class=\"no-margin\">Today's Registrations</h6>\n            <p class=\"value5\">{{TotalTodayLinkedINUsers}}</p>\n          </div>\n          <div class=\"col-xs-2\">\n            <i class=\"fa fa-linkedin-square cardfa\" aria-hidden=\"true\"></i>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n  <!--<div class=\"col-lg-8 col-xs-12\">\n     minimal widget consist of .widget class. note bg-transparent - it can be any background like bg-gray,\n    bg-primary, bg-white \n    <section class=\"widget bg-transparent\">\n       .widget-body is a mostly semantic class. may be a sibling to .widget>header or .widget>footer \n      <div class=\"widget-body\">\n         for this particular example we also need to preload us map, as this is mapael's extension \n        <div class=\"mapael\" geo-locations-widget>\n          <div class=\"stats\">\n            <h6 class=\"text-white m-t-1\">GEO-LOCATIONS</h6>\n            <p class=\"h3 text-warning no-margin\">\n              <strong number-animate>1 656 843</strong>\n              <i class=\"fa fa-map-marker\"></i>\n            </p>\n          </div>\n          <div class=\"map\">\n            <span>Alternative content for the map</span>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n  <div class=\"col-lg-4 col-xs-12\">\n    <section widget class=\"widget bg-transparent\">\n      <header>\n        <h5>\n          Map\n          <span class=\"fw-semi-bold\">Statistics</span>\n        </h5>\n        <div class=\"widget-controls widget-controls-hover\">\n          <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\n          <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n        </div>\n      </header>\n      <div class=\"widget-body\">\n        <p>Status: <strong>Live</strong></p>\n        <p>\n          <span class=\"circle bg-warning\"><i class=\"fa fa-map-marker\"></i></span>\n          146 Countries, 2759 Cities\n        </p>\n        <div class=\"row progress-stats\">\n          <div class=\"col-md-9 col-xs-12\">\n            <h6 class=\"name m-t-1\">Foreign Visits</h6>\n            <p class=\"description deemphasize\">Some Cool Text</p>\n            <div class=\"bg-white progress-bar\">\n              <progress progress-animate class=\"progress progress-primary progress-sm\" value=\"100\" max=\"100\" style=\"width: 60%;\" data-width=\"60%\"></progress>\n            </div>\n          </div>\n          <div class=\"col-md-3 col-xs-12 text-xs-center\">\n                                <span class=\"status rounded rounded-lg bg-body-light\">\n                                    <small><span number-animate>75</span>%</small>\n                                </span>\n          </div>\n        </div>\n        <div class=\"row progress-stats\">\n          <div class=\"col-md-9 col-xs-12\">\n            <h6 class=\"name m-t-1\">Local Visits</h6>\n            <p class=\"description deemphasize\">P. to C. Conversion</p>\n            <div class=\"bg-white progress-bar\">\n              <progress progress-animate class=\"progress progress-danger progress-sm\" value=\"100\" max=\"100\" style=\"width: 39%;\" data-width=\"39%\"></progress>\n            </div>\n          </div>\n          <div class=\"col-md-3 col-xs-12 text-xs-center\">\n                                <span class=\"status rounded rounded-lg bg-body-light\">\n                                    <small><span number-animate>84</span>%</small>\n                                </span>\n          </div>\n        </div>\n        <div class=\"row progress-stats\">\n          <div class=\"col-md-9 col-xs-12\">\n            <h6 class=\"name m-t-1\">Sound Frequencies</h6>\n            <p class=\"description deemphasize\">Average Bitrate</p>\n            <div class=\"bg-white progress-bar\">\n              <progress progress-animate class=\"progress progress-success progress-sm\" value=\"100\" max=\"100\" style=\"width: 80%;\" data-width=\"80%\"></progress>\n            </div>\n          </div>\n          <div class=\"col-md-3 col-xs-12 text-xs-center\">\n                                <span class=\"status rounded rounded-lg bg-body-light\">\n                                    <small><span number-animate>92</span>%</small>\n                                </span>\n          </div>\n        </div>\n        <h6 class=\"fw-semi-bold mt\">Map Distributions</h6>\n        <p>Tracking: <strong>Active</strong></p>\n        <p>\n          <span class=\"circle bg-warning\"><i class=\"fa fa-cog\"></i></span>\n          391 elements installed, 84 sets\n        </p>\n        <div class=\"input-group mt\">\n          <input type=\"text\" class=\"form-control\" placeholder=\"Search Map\">\n                            <span class=\"input-group-btn\">\n                                <button type=\"submit\" class=\"btn btn-default\">\n                                  <i class=\"fa fa-search text-gray\"></i>\n                                </button>\n                            </span>\n        </div>\n      </div>\n    </section>\n  </div>-->\n</div>\n<!--\n<div class=\"row\">\n  <div class=\"col-lg-4 col-xs-12\">\n    <section widget class=\"widget\">\n       .widget>header is generally a place for widget title and widget controls. see .widget in _base.scss \n      <header>\n        <h6>\n          USERBASE GROWTH\n        </h6>\n        <div class=\"widget-controls\">\n          <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n        </div>\n      </header>\n      <div class=\"widget-body\">\n        <div class=\"stats-row\">\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">Overall Growth</h6>\n            <p class=\"value\">76.38%</p>\n          </div>\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">Montly</h6>\n            <p class=\"value\">10.38%</p>\n          </div>\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">24h</h6>\n            <p class=\"value\">3.38%</p>\n          </div>\n        </div>\n        <div class=\"bg-gray-lighter progress-bar\">\n          <progress class=\"progress progress-xs progress-success\" value=\"100\" max=\"100\" style=\"width: 60%\"></progress>\n        </div>\n        <p>\n          <small><span class=\"circle bg-warning\"><i class=\"glyphicon glyphicon-chevron-up\"></i></span></small>\n          <span class=\"fw-semi-bold\">17% higher</span>\n          than last month</p>\n      </div>\n    </section>\n  </div>\n  <div class=\"col-lg-4 col-xs-12\">\n    <section widget class=\"widget\">\n      <header>\n        <h6>\n          TRAFFIC VALUES\n        </h6>\n        <div class=\"widget-controls\">\n          <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n        </div>\n      </header>\n      <div class=\"widget-body\">\n        <div class=\"stats-row\">\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">Overall Values</h6>\n            <p class=\"value\">17 567 318</p>\n          </div>\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">Montly</h6>\n            <p class=\"value\">55 120</p>\n          </div>\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">24h</h6>\n            <p class=\"value\">9 695</p>\n          </div>\n        </div>\n        <div class=\"bg-gray-lighter progress-bar\">\n          <progress class=\"progress progress-xs progress-danger\" value=\"100\" max=\"100\" style=\"width: 60%\"></progress>\n        </div>\n        <p>\n          <small><span class=\"circle bg-warning\"><i class=\"fa fa-chevron-down\"></i></span></small>\n          <span class=\"fw-semi-bold\">8% lower</span>\n          than last month\n        </p>\n      </div>\n    </section>\n  </div>\n  <div class=\"col-lg-4 col-xs-12\">\n    <section widget class=\"widget\">\n      <header>\n        <h6>\n          RANDOM VALUES\n        </h6>\n        <div class=\"widget-controls\">\n          <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n        </div>\n      </header>\n      <div class=\"widget-body\">\n        <div class=\"stats-row\">\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">Overcome T.</h6>\n            <p class=\"value\">104.85%</p>\n          </div>\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">Takeoff Angle</h6>\n            <p class=\"value\">14.29&deg;</p>\n          </div>\n          <div class=\"stat-item\">\n            <h6 class=\"name fs-sm\">World Pop.</h6>\n            <p class=\"value\">7,211M</p>\n          </div>\n        </div>\n        <div class=\"bg-gray-lighter progress-bar\">\n          <progress class=\"progress progress-xs progress-primary\" value=\"100\" max=\"100\" style=\"width: 60%\"></progress>\n        </div>\n        <p>\n          <small><span class=\"circle bg-warning\"><i class=\"fa fa-plus\"></i></span></small>\n          <span class=\"fw-semi-bold\">8 734 higher</span>\n          than last month\n        </p>\n      </div>\n    </section>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-lg-4 col-xs-12\">\n    <section widget class=\"widget\">\n      <header>\n        <h6><span class=\"tag tag-danger\">New</span> Messages</h6>\n        <div class=\"widget-controls\">\n          <a href=\"#\"><i class=\"fa fa-refresh\"></i></a>\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n        </div>\n      </header>\n      <div class=\"widget-body no-padding\">\n        <div class=\"list-group list-group-lg\">\n          <a class=\"list-group-item\" href=\"#\">\n                                <span class=\"thumb-sm pull-xs-left mr\">\n                                    <img class=\"img-circle\" src=\"assets/img/people/a2.jpg\" alt=\"...\">\n                                    <i class=\"status status-bottom bg-success\"></i>\n                                </span>\n            <h6 class=\"no-margin\">Chris Gray</h6>\n            <p class=\"help-block text-ellipsis no-margin\">Hey! What's up? So many times since we</p>\n          </a>\n          <a class=\"list-group-item\" href=\"#\">\n                                <span class=\"thumb-sm pull-xs-left mr\">\n                                    <img class=\"img-circle\" src=\"assets/img/people/a4.jpg\" alt=\"...\">\n                                    <i class=\"status status-bottom bg-success\"></i>\n                                </span>\n            <h6 class=\"no-margin\">Jamey Brownlow</h6>\n            <p class=\"help-block text-ellipsis no-margin\">Good news coming tonight. Seems they agreed to proceed</p>\n          </a>\n          <a class=\"list-group-item\" href=\"#\">\n                                <span class=\"thumb-sm pull-xs-left mr\">\n                                    <img class=\"img-circle\" src=\"assets/img/people/a1.jpg\" alt=\"...\">\n                                    <i class=\"status status-bottom bg-warning\"></i>\n                                </span>\n            <h6 class=\"no-margin\">Livia Walsh</h6>\n            <p class=\"help-block text-ellipsis no-margin\">Check my latest email plz!</p>\n          </a>\n          <a class=\"list-group-item\" href=\"#\">\n                                <span class=\"thumb-sm pull-xs-left mr\">\n                                    <img class=\"img-circle\" src=\"assets/img/people/a5.jpg\" alt=\"...\">\n                                    <i class=\"status status-bottom bg-danger\"></i>\n                                </span>\n            <h6 class=\"no-margin\">Jaron Fitzroy</h6>\n            <p class=\"help-block text-ellipsis no-margin\">What about summer break?</p>\n          </a>\n        </div>\n      </div>\n      <footer class=\"bg-body-light mt\">\n        <input type=\"search\" class=\"form-control form-control-sm\" placeholder=\"Search\">\n      </footer>\n    </section>\n  </div>\n  <div class=\"col-lg-4 col-xs-12\">\n    <section widget class=\"widget\">\n      <header>\n        <h6>\n          Market <span class=\"fw-semi-bold\">Stats</span>\n        </h6>\n        <div class=\"widget-controls\">\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n        </div>\n      </header>\n      <div class=\"widget-body\">\n        <h3>$720 Earned</h3>\n        <p class=\"fs-mini text-muted mb mt-sm\">\n          Target <span class=\"fw-semi-bold\">$820</span> day earnings\n          is <span class=\"fw-semi-bold\">96%</span> reached.\n        </p>\n      </div>\n      <div class=\"widget-table-overflow\">\n        <table class=\"table table-striped table-sm\">\n          <thead class=\"no-bd\">\n          <tr>\n            <th>\n              <div class=\"checkbox abc-checkbox\">\n                <input id=\"checkbox210\" type=\"checkbox\" check-all>\n                <label for=\"checkbox210\"></label>\n              </div>\n            </th>\n            <th></th>\n            <th></th>\n          </tr>\n          </thead>\n          <tbody>\n          <tr>\n            <td>\n              <div class=\"checkbox abc-checkbox\">\n                <input id=\"checkbox212\" type=\"checkbox\">\n                <label for=\"checkbox212\"></label>\n              </div>\n            </td>\n            <td>HP Core i7</td>\n            <td class=\"text-align-right fw-semi-bold\">$346.1</td>\n          </tr>\n          <tr>\n            <td>\n              <div class=\"checkbox abc-checkbox\">\n                <input id=\"checkbox214\" type=\"checkbox\">\n                <label for=\"checkbox214\"></label>\n              </div>\n            </td>\n            <td>Air Pro</td>\n            <td class=\"text-align-right fw-semi-bold\">$533.1</td>\n          </tr>\n          </tbody>\n        </table>\n      </div>\n      <div class=\"widget-body mt-xlg\" market-stats-widget>\n      </div>\n    </section>\n  </div>\n  <div class=\"col-lg-4 col-xs-12\">\n    <section widget class=\"widget\">\n      <header>\n        <h6>Calendar</h6>\n        <div class=\"widget-controls\">\n          <a href=\"#\"><i class=\"glyphicon glyphicon-cog\"></i></a>\n          <a href=\"#\" data-widgster=\"close\"><i class=\"glyphicon glyphicon-remove\"></i></a>\n        </div>\n      </header>\n      <div class=\"widget-body no-padding\">\n        <div class=\"bg-primary-light\" bootstrap-calendar [events]=\"[\n                [\n                        '2/'+month+'/'+year,\n                    'The flower bed',\n                    '#',\n                    config.settings.colors['brand-primary'],\n                    'Contents here'\n                ],\n                [\n                        '5/'+month+'/'+year,\n                    'Stop world water pollution',\n                    '#',\n                    config.settings.colors['brand-warning'],\n                    'Have a kick off meeting with .inc company'\n                ],\n                [\n                        '18/'+month+'/'+year,\n                    'Light Blue 2.2 release',\n                    '#',\n                    config.settings.colors['brand-success'],\n                    'Some contents here'\n                ],\n                [\n                        '29/'+month+'/'+year,\n                    'A link',\n                    'http://www.flatlogic.com',\n                    config.settings.colors['brand-danger']\n                ]\n            ]\"></div>\n        <div class=\"list-group fs-mini\">\n          <a href=\"#\" class=\"list-group-item text-ellipsis\">\n            <span class=\"tag-pill tag-warning pull-xs-right\">6:45</span>\n            Weed out the flower bed\n          </a>\n          <a href=\"#\" class=\"list-group-item text-ellipsis\">\n            <span class=\"tag-pill tag-success pull-xs-right\">9:41</span>\n            Stop world water pollution\n          </a>\n        </div>\n      </div>\n    </section>\n  </div>\n</div>-->\n"

/***/ },

/***/ "./src/app/dashboard/geo-locations-widget/geo-locations-widget.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var app_config_1 = __webpack_require__("./src/app/app.config.ts");
var GeoLocationsWidget = (function () {
    function GeoLocationsWidget(config, el) {
        this.$el = jQuery(el.nativeElement);
        this.config = config.getConfig();
        var state;
        this.mapData = {
            map: {
                name: 'usa_states',
                defaultArea: {
                    attrsHover: {
                        fill: '#242424',
                        animDuration: 100
                    },
                    tooltip: {
                        content: function () {
                            return '<strong>' + state + '</strong>';
                        }
                    },
                    eventHandlers: {
                        mouseover: function (e, id) {
                            state = id;
                        }
                    }
                },
                defaultPlot: {
                    size: 17,
                    attrs: {
                        fill: this.config.settings.colors['brand-warning'],
                        stroke: '#fff',
                        'stroke-width': 0,
                        'stroke-linejoin': 'round'
                    },
                    attrsHover: {
                        'stroke-width': 1,
                        animDuration: 100
                    }
                },
                zoom: {
                    enabled: true,
                    step: 0.75,
                    mousewheel: false
                }
            },
            plots: {
                'ny': {
                    latitude: 40.717079,
                    longitude: -74.00116,
                    tooltip: { content: 'New York' }
                },
                'on': {
                    latitude: 33.145235,
                    longitude: -83.811834,
                    size: 18,
                    tooltip: { content: 'Oconee National Forest' }
                },
                'sf': {
                    latitude: 37.792032,
                    longitude: -122.394613,
                    size: 12,
                    tooltip: { content: 'San Francisco' }
                },
                'la': {
                    latitude: 26.935080,
                    longitude: -80.851766,
                    size: 26,
                    tooltip: { content: 'Lake Okeechobee' }
                },
                'gc': {
                    latitude: 36.331308,
                    longitude: -83.336050,
                    size: 10,
                    tooltip: { content: 'Grainger County' }
                },
                'cc': {
                    latitude: 36.269356,
                    longitude: -76.587477,
                    size: 22,
                    tooltip: { content: 'Chowan County' }
                },
                'll': {
                    latitude: 30.700644,
                    longitude: -95.145249,
                    tooltip: { content: 'Lake Livingston' }
                },
                'tc': {
                    latitude: 34.546708,
                    longitude: -90.211471,
                    size: 14,
                    tooltip: { content: 'Tunica County' }
                },
                'lc': {
                    latitude: 32.628599,
                    longitude: -103.675115,
                    tooltip: { content: 'Lea County' }
                },
                'uc': {
                    latitude: 40.456692,
                    longitude: -83.522688,
                    size: 11,
                    tooltip: { content: 'Union County' }
                },
                'lm': {
                    latitude: 33.844630,
                    longitude: -118.157483,
                    tooltip: { content: 'Lakewood Mutual' }
                }
            }
        };
    }
    GeoLocationsWidget.prototype.ngOnInit = function () {
        this.$el.mapael(this.mapData);
    };
    GeoLocationsWidget = __decorate([
        core_1.Directive({
            selector: '[geo-locations-widget]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof app_config_1.AppConfig !== 'undefined' && app_config_1.AppConfig) === 'function' && _a) || Object, (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
    ], GeoLocationsWidget);
    return GeoLocationsWidget;
    var _a, _b;
}());
exports.GeoLocationsWidget = GeoLocationsWidget;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/dashboard/market-stats-widget/market-stats-widget.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Rickshaw) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var MarketStatsWidget = (function () {
    function MarketStatsWidget() {
        this.seriesData = [[], []];
        this.random = new Rickshaw.Fixtures.RandomData(30);
        for (var i = 0; i < 30; i++) {
            this.random.addData(this.seriesData);
        }
        this.series = [
            {
                color: '#F7653F',
                data: this.seriesData[0],
                name: 'Uploads'
            }, {
                color: '#F7D9C5',
                data: this.seriesData[1],
                name: 'Downloads'
            }
        ];
    }
    MarketStatsWidget = __decorate([
        core_1.Component({
            selector: '[market-stats-widget]',
            template: '<div class="chart-overflow-bottom"' +
                ' rickshaw-chart [series]="series" ' +
                '[height]="100" [seriesData]="seriesData"' +
                ' [random]="random" [realtime]="true">' +
                '</div>',
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [__webpack_require__("./node_modules/rickshaw/rickshaw.css")]
        }), 
        __metadata('design:paramtypes', [])
    ], MarketStatsWidget);
    return MarketStatsWidget;
}());
exports.MarketStatsWidget = MarketStatsWidget;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/rickshaw/rickshaw.js")))

/***/ },

/***/ "./src/app/layout/utils/directives/animate-number.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var AnimateNumber = (function () {
    function AnimateNumber(el) {
        this.$el = jQuery(el.nativeElement);
    }
    AnimateNumber.prototype.ngOnInit = function () {
        this.$el.animateNumber({
            number: this.$el.text().replace(/ /gi, ''),
            numberStep: jQuery.animateNumber.numberStepFactories.separator(' '),
            easing: 'easeInQuad'
        }, 1000);
    };
    AnimateNumber = __decorate([
        core_1.Directive({
            selector: '[number-animate]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], AnimateNumber);
    return AnimateNumber;
    var _a;
}());
exports.AnimateNumber = AnimateNumber;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/layout/utils/directives/check-all.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var CheckAll = (function () {
    function CheckAll(el) {
        this.$el = jQuery(el.nativeElement);
    }
    CheckAll.prototype.ngOnInit = function () {
        var $el = this.$el;
        $el.on('click', function () {
            $el.closest('table').find('input[type=checkbox]')
                .not(this).prop('checked', jQuery(this).prop('checked'));
        });
    };
    CheckAll = __decorate([
        core_1.Directive({
            selector: '[check-all]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], CheckAll);
    return CheckAll;
    var _a;
}());
exports.CheckAll = CheckAll;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/layout/utils/directives/progress-animate.directive.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var ProgressAnimate = (function () {
    function ProgressAnimate(el) {
        this.$el = jQuery(el.nativeElement);
    }
    ProgressAnimate.prototype.ngOnInit = function () {
        var width = this.$el.data('width'), $bar = this.$el;
        $bar.css('opacity', 0);
        setTimeout(function () {
            $bar.css({
                transition: 'none',
                width: 0,
                opacity: 1
            });
            setTimeout(function () {
                $bar.css('transition', '').css('width', width);
            });
        });
    };
    ProgressAnimate = __decorate([
        core_1.Directive({
            selector: '[progress-animate]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], ProgressAnimate);
    return ProgressAnimate;
    var _a;
}());
exports.ProgressAnimate = ProgressAnimate;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/layout/utils/utils.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var animate_number_directive_ts_1 = __webpack_require__("./src/app/layout/utils/directives/animate-number.directive.ts");
var check_all_directive_1 = __webpack_require__("./src/app/layout/utils/directives/check-all.directive.ts");
var progress_animate_directive_1 = __webpack_require__("./src/app/layout/utils/directives/progress-animate.directive.ts");
var UtilsModule = (function () {
    function UtilsModule() {
    }
    UtilsModule = __decorate([
        core_1.NgModule({
            declarations: [
                animate_number_directive_ts_1.AnimateNumber,
                check_all_directive_1.CheckAll,
                progress_animate_directive_1.ProgressAnimate
            ],
            exports: [
                animate_number_directive_ts_1.AnimateNumber,
                check_all_directive_1.CheckAll,
                progress_animate_directive_1.ProgressAnimate
            ],
            imports: [
                common_1.CommonModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], UtilsModule);
    return UtilsModule;
}());
exports.UtilsModule = UtilsModule;


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

/***/ "./src/app/widgets/widgets.style.scss":
/***/ function(module, exports) {

module.exports = "/* Sizes */\n.live-tile,\n.list-tile,\n.copy-tile,\n.tile-strip .flip-list > li {\n  height: 150px;\n  margin: 5px;\n  outline: 1px solid transparent;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  padding: 0px;\n  width: 150px; }\n\n.live-tile.half-tile,\n.list-tile.half-tile,\n.copy-tile.half-tile,\n.tile-strip .flip-list > li.half-tile {\n  height: 70px;\n  width: 70px; }\n\n.live-tile.half-wide,\n.list-tile.half-wide,\n.copy-tile.half-wide,\n.tile-strip .flip-list > li.half-wide {\n  width: 70px; }\n\n.live-tile.two-wide,\n.list-tile.two-wide,\n.copy-tile.two-wide,\n.tile-strip .flip-list > li.two-wide {\n  width: 310px; }\n\n.live-tile.three-wide,\n.list-tile.three-wide,\n.copy-tile.three-wide,\n.tile-strip .flip-list > li.three-wide {\n  width: 470px; }\n\n.live-tile.four-wide,\n.list-tile.four-wide,\n.copy-tile.four-wide,\n.tile-strip .flip-list > li.four-wide {\n  width: 630px; }\n\n.live-tile.five-wide,\n.list-tile.five-wide,\n.copy-tile.five-wide,\n.tile-strip .flip-list > li.five-wide {\n  width: 790px; }\n\n.live-tile.six-wide,\n.list-tile.six-wide,\n.copy-tile.six-wide,\n.tile-strip .flip-list > li.six-wide {\n  width: 950px; }\n\n.live-tile.seven-wide,\n.list-tile.seven-wide,\n.copy-tile.seven-wide,\n.tile-strip .flip-list > li.seven-wide {\n  width: 1110px; }\n\n.live-tile.eight-wide,\n.list-tile.eight-wide,\n.copy-tile.eight-wide,\n.tile-strip .flip-list > li.eight-wide {\n  width: 1270px; }\n\n.live-tile.nine-wide,\n.list-tile.nine-wide,\n.copy-tile.nine-wide,\n.tile-strip .flip-list > li.nine-wide {\n  width: 1430px; }\n\n.live-tile.ten-wide,\n.list-tile.ten-wide,\n.copy-tile.ten-wide,\n.tile-strip .flip-list > li.ten-wide {\n  width: 1590px; }\n\n.live-tile.half-tall,\n.list-tile.half-tall,\n.copy-tile.half-tall,\n.tile-strip .flip-list > li.half-tall {\n  height: 70px; }\n\n.live-tile.two-tall,\n.list-tile.two-tall,\n.copy-tile.two-tall,\n.tile-strip .flip-list > li.two-tall {\n  height: 310px; }\n\n.live-tile.three-tall,\n.list-tile.three-tall,\n.copy-tile.three-tall,\n.tile-strip .flip-list > li.three-tall {\n  height: 470px; }\n\n.live-tile.four-tall,\n.list-tile.four-tall,\n.copy-tile.four-tall,\n.tile-strip .flip-list > li.four-tall {\n  height: 630px; }\n\n.live-tile.five-tall,\n.list-tile.five-tall,\n.copy-tile.five-tall,\n.tile-strip .flip-list > li.five-tall {\n  height: 790px; }\n\n.live-tile.six-tall,\n.list-tile.six-tall,\n.copy-tile.six-tall,\n.tile-strip .flip-list > li.six-tall {\n  height: 950px; }\n\n.live-tile.seven-tall,\n.list-tile.seven-tall,\n.copy-tile.seven-tall,\n.tile-strip .flip-list > li.seven-tall {\n  height: 1110px; }\n\n.live-tile.eight-tall,\n.list-tile.eight-tall,\n.copy-tile.eight-tall,\n.tile-strip .flip-list > li.eight-tall {\n  height: 1270px; }\n\n.live-tile.nine-tall,\n.list-tile.nine-tall,\n.copy-tile.nine-tall,\n.tile-strip .flip-list > li.nine-tall {\n  height: 1430px; }\n\n.live-tile.ten-tall,\n.list-tile.ten-tall,\n.copy-tile.ten-tall,\n.tile-strip .flip-list > li.ten-tall {\n  height: 1590px; }\n\n/* End Sizes */\n/* flip-list tile grid sprite styles */\n.live-tile > .flip-list,\n.list-tile > .flip-list {\n  height: 100%;\n  width: 100%; }\n\n.flip-list > li {\n  height: 50px;\n  margin: 0px;\n  padding: 0px;\n  width: 50px; }\n\n.flip-list.fourTiles > li {\n  border: none;\n  padding: 0;\n  margin: 0;\n  height: 50%;\n  width: 50%; }\n\n.flip-list.nineTiles > li {\n  height: 33%;\n  width: 33%;\n  border: none;\n  padding: 0;\n  margin: 0; }\n\n.flip-list.fourTiles > li > div,\n.flip-list.fourTiles > li > div > a,\n.flip-list.fourTiles > li > div > img,\n.flip-list.nineTiles > li > div,\n.flip-list.nineTiles > li > div > a,\n.flip-list.nineTiles > li > div > img {\n  border: none;\n  height: 100%;\n  width: 100%;\n  padding: 0;\n  margin: 0; }\n\n/* fourTile background positions */\n.fourTiles .fourTiles1 img,\n.fourTiles img.fourTiles1,\n.fourTiles .fourTiles1 a,\n.fourTiles .tile-1 img,\n.fourTiles .tile-1 a {\n  background-position: 0px 0px; }\n\n.fourTiles .fourTiles2 img,\n.fourTiles img.fourTiles2,\n.fourTiles .fourTiles2 a,\n.fourTiles .tile-2 img,\n.fourTiles .tile-2 a {\n  background-position: -75px 0px; }\n\n.fourTiles .fourTiles3 img,\n.fourTiles img.fourTiles3,\n.fourTiles .fourTiles3 a,\n.fourTiles .tile-3 img,\n.fourTiles .tile-3 a {\n  background-position: 0px -75px; }\n\n.fourTiles .fourTiles4 img,\n.fourTiles img.fourTiles4,\n.fourTiles .fourTiles4 a,\n.fourTiles .tile-4 img,\n.fourTiles .tile-4 a {\n  background-position: -75px -75px; }\n\n/* nineTile background positions */\n.nineTiles .nineTiles1 img,\n.nineTiles img.nineTiles1,\n.nineTiles .nineTiles1 a,\n.nineTiles .tile-1 img,\n.nineTiles .tile-1 a {\n  background-position: 0px 0px; }\n\n.nineTiles .nineTiles2 img,\n.nineTiles img.nineTiles2,\n.nineTiles .nineTiles2 a,\n.nineTiles .tile-2 img,\n.nineTiles .tile-2 a {\n  background-position: -50px 0px; }\n\n.nineTiles .nineTiles3 img,\n.nineTiles img.nineTiles3,\n.nineTiles .nineTiles3 a,\n.nineTiles .tile-3 img,\n.nineTiles .tile-3 a {\n  background-position: -100px 0px; }\n\n.nineTiles .nineTiles4 img,\n.nineTiles img.nineTiles4,\n.nineTiles .nineTiles4 a,\n.nineTiles .tile-4 img,\n.nineTiles .tile-4 a {\n  background-position: 0px -50px; }\n\n.nineTiles .nineTiles5 img,\n.nineTiles img.nineTiles5,\n.nineTiles .nineTiles5 a,\n.nineTiles .tile-5 img,\n.nineTiles .tile-5 a {\n  background-position: -50px -50px; }\n\n.nineTiles .nineTiles6 img,\n.nineTiles img.nineTiles6,\n.nineTiles .nineTiles6 a,\n.nineTiles .tile-6 img,\n.nineTiles .tile-6 a {\n  background-position: -100px -50px; }\n\n.nineTiles .nineTiles7 img,\n.nineTiles img.nineTiles7,\n.nineTiles .nineTiles7 a,\n.nineTiles .tile-7 img,\n.nineTiles .tile-7 a {\n  background-position: 0px -100px; }\n\n.nineTiles .nineTiles8 img,\n.nineTiles img.nineTiles8,\n.nineTiles .nineTiles8 a,\n.nineTiles .tile-8 img,\n.nineTiles .tile-8 a {\n  background-position: -50px -100px; }\n\n.nineTiles .nineTiles9 img,\n.nineTiles img.nineTiles9,\n.nineTiles .nineTiles9 a,\n.nineTiles .tile-9 img,\n.nineTiles .tile-9 a {\n  background-position: -100px -100px; }\n\n.tile-group,\n.tile-strip {\n  display: block;\n  overflow: hidden;\n  position: relative;\n  z-index: 20;\n  -webkit-perspective: 800px;\n  -moz-perspective: 800px;\n  -ms-perspective: 800px;\n  perspective: 800px; }\n\n.tile-group.one-tile,\n.tile-strip.one-tile {\n  height: 160px;\n  width: 160px; }\n\n.tile-group.half-wide,\n.tile-strip.half-wide {\n  width: 80px; }\n\n.tile-group.one-wide,\n.tile-strip.one-wide {\n  width: 160px; }\n\n.tile-group.two-wide,\n.tile-strip.two-wide {\n  width: 320px; }\n\n.tile-group.three-wide,\n.tile-strip.three-wide {\n  width: 480px; }\n\n.tile-group.four-wide,\n.tile-strip.four-wide {\n  width: 640px; }\n\n.tile-group.five-wide,\n.tile-strip.five-wide {\n  width: 800px; }\n\n.tile-group.six-wide,\n.tile-strip.six-wide {\n  width: 960px; }\n\n.tile-group.seven-wide,\n.tile-strip.seven-wide {\n  width: 1120px; }\n\n.tile-group.eight-wide,\n.tile-strip.eight-wide {\n  width: 1280px; }\n\n.tile-group.nine-wide,\n.tile-strip.nine-wide {\n  width: 1440px; }\n\n.tile-group.ten-wide,\n.tile-strip.ten-wide {\n  width: 1600px; }\n\n.tile-group.half-tall,\n.tile-strip.half-tall {\n  height: 80px; }\n\n.tile-group.one-tall,\n.tile-strip.one-tall {\n  height: 160px; }\n\n.tile-group.two-tall,\n.tile-strip.two-tall {\n  height: 320px; }\n\n.tile-group.three-tall,\n.tile-strip.three-tall {\n  height: 480px; }\n\n.tile-group.four-tall,\n.tile-strip.four-tall {\n  height: 640px; }\n\n.tile-group.five-tall,\n.tile-strip.five-tall {\n  height: 800px; }\n\n.tile-group.six-tall,\n.tile-strip.six-tall {\n  height: 960px; }\n\n.tile-group.seven-tall,\n.tile-strip.seven-tall {\n  height: 1120px; }\n\n.tile-group.eight-tall,\n.tile-strip.eight-tall {\n  height: 1280px; }\n\n.tile-group.nine-tall,\n.tile-strip.nine-tall {\n  height: 1440px; }\n\n.tile-group.ten-tall,\n.tile-strip.ten-tall {\n  height: 1600px; }\n\n/* liveTile styles */\n.tile-strip,\n.live-tile,\n.list-tile,\n.copy-tile,\n.slide {\n  float: left; }\n\n.live-tile,\n.list-tile,\n.copy-tile {\n  color: #fff;\n  overflow: hidden;\n  position: relative;\n  z-index: 20; }\n\n.live-tile p,\n.list-tile p,\n.copy-tile p,\n.live-tile .face,\n.list-tile .face,\n.copy-tile .face {\n  display: block;\n  font-size: 1em;\n  line-height: 1.2em;\n  margin: 0; }\n\n.live-tile .face,\n.list-tile .face,\n.copy-tile .face {\n  padding: 0px; }\n\n.live-tile p,\n.list-tile p,\n.copy-tile p {\n  padding: 10px; }\n\n.live-tile.half-tile p,\n.list-tile.half-tile p,\n.copy-tile.half-tile p {\n  padding: 5px; }\n\n.live-tile .face.full,\n.list-tile .face.full,\n.copy-tile .face.full {\n  height: 100%;\n  width: 100%; }\n\n.live-tile img,\n.list-tile img,\n.copy-tile img {\n  border: none; }\n\n.live-tile .tile-title,\n.list-tile .tile-title,\n.copy-tile .tile-title {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  position: absolute;\n  bottom: 0px;\n  font-size: 12px;\n  left: 0px;\n  text-decoration: none;\n  width: 100%;\n  z-index: 30; }\n\n.live-tile a,\n.list-tile a,\n.copy-tile a {\n  color: #fff; }\n\n.live-tile a.tile-title:link,\n.list-tile a.tile-title:link,\n.copy-tile a.tile-title:link,\n.live-tile a.tile-title:visited,\n.list-tile a.tile-title:visited,\n.copy-tile a.tile-title:visited,\n.live-tile a.tile-title:hover,\n.list-tile a.tile-title:hover,\n.copy-tile a.tile-title:hover,\n.live-tile a.tile-title,\n.list-tile a.tile-title,\n.copy-tile a.tile-title {\n  text-decoration: none; }\n\n.live-tile a:link,\n.list-tile a:link,\n.copy-tile a:link,\n.live-tile a:visited,\n.list-tile a:visited,\n.copy-tile a:visited {\n  color: #fff;\n  text-decoration: underline; }\n\n.live-tile a:hover,\n.list-tile a:hover,\n.copy-tile a:hover {\n  color: #fff;\n  text-decoration: none; }\n\n.light .copy-tile {\n  color: #000; }\n\n.light .copy-tile.accent {\n  color: #fff; }\n\n.light .copy-tile.accent a,\n.light .copy-tile.accent a:link,\n.light .copy-tile.accent a:visited,\n.light .copy-tile.accent a:hover {\n  color: #fff; }\n\n.light .copy-tile a,\n.light .copy-tile a:link,\n.light .copy-tile a:visited,\n.light .copy-tile a:hover {\n  color: #000; }\n\n.light .copy-tile .face,\n.light .copy-tile .accent {\n  color: #fff; }\n\n.light .copy-tile .face a,\n.light .copy-tile .accent a,\n.light .copy-tile .face a:link,\n.light .copy-tile .accent a:link,\n.light .copy-tile .face a:visited,\n.light .copy-tile .accent a:visited,\n.light .copy-tile .face a:hover,\n.light .copy-tile .accent a:hover {\n  color: #fff; }\n\n.copy-tile p {\n  padding: 5px 5px 0px 5px;\n  font-size: .95em; }\n\n.noselect > div,\n.noselect > .slide,\n.noselect > .slide-front,\n.noselect > .slide-back,\n.noselect > .fade-front,\n.noselect > .fade-back,\n.noselect > .flip-front,\n.noselect > .flip-back {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.live-tile > div,\n.list-tile > div,\n.live-tile > .slide,\n.carousel > .slide,\n.live-tile > .slide-front,\n.live-tile > .slide-back,\n.live-tile > .fade-front,\n.live-tile > .fade-back,\n.live-tile > .flip-front,\n.live-tile > .flip-back {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  top: 0px;\n  left: 0px;\n  margin: 0px;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n  position: absolute;\n  z-index: 20; }\n\n.list-tile > div {\n  position: relative;\n  background-color: transparent; }\n\n.live-tile .align-mid {\n  display: inline-block;\n  position: absolute;\n  left: 50%;\n  max-height: 100%;\n  top: 50%;\n  -moz-transform: translate(-50%, -50%);\n  -ms-transform: translate(-50%, -50%);\n  -o-transform: translate(-50%, -50%);\n  -webkit-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%); }\n\n.live-tile .align-mid-x {\n  display: inline-block;\n  left: 50%;\n  max-width: 100%;\n  position: absolute;\n  -moz-transform: translate(-50%, 0px);\n  -ms-transform: translate(-50%, 0px);\n  -o-transform: translate(-50%, 0px);\n  -webkit-transform: translate(-50%, 0px);\n  transform: translate(-50%, 0px); }\n\n.live-tile .align-mid-y {\n  display: inline-block;\n  max-height: 100%;\n  position: absolute;\n  top: 50%;\n  -moz-transform: translate(0px, -50%);\n  -ms-transform: translate(0px, -50%);\n  -o-transform: translate(0px, -50%);\n  -webkit-transform: translate(0px, -50%);\n  transform: translate(0px, -50%); }\n\nimg.full,\na.full,\n.live-tile .full,\n.list-tile .full {\n  display: block;\n  margin: 0px;\n  height: 100%;\n  text-decoration: none;\n  width: 100%; }\n\nimg.full-w,\na.full-w,\n.live-tile .full-w,\n.list-tile .full-w {\n  display: block;\n  margin: 0px;\n  text-decoration: none;\n  width: 100%; }\n\nimg.full-h,\na.full-h,\n.live-tile .full-h,\n.list-tile .full-h {\n  display: block;\n  margin: 0px;\n  height: 100%; }\n\n.live-tile > .back,\n.live-tile > .slide-back,\n.live-tile > .fade-back,\n.live-tile > .flip-back,\n.flip-list .flip-back {\n  position: absolute;\n  z-index: 10; }\n\n/*  ========== flip-list Styles ==========\n\t.flip-list\n\t---li\n\t------div.flip-front\n\t------div.flip-back\n*/\n.flip-list {\n  padding: 0px;\n  margin: 0px; }\n\n.list-tile .flip-list {\n  height: 100%;\n  width: 100%; }\n\n.flip-list > li > a {\n  border: none;\n  outline: none;\n  text-decoration: none;\n  margin: 0px;\n  padding: 0px;\n  height: 100%;\n  width: 100%; }\n\n.flip-list > li img {\n  border: none;\n  outline: none;\n  height: 100%;\n  margin: 0px;\n  padding: 0px;\n  width: 100%; }\n\n.flip-list > li {\n  float: left;\n  list-style-type: none;\n  outline: none;\n  position: relative; }\n\n.flip-list > li > div {\n  border: none;\n  background: white;\n  height: 100%;\n  left: 0px;\n  margin: 0px;\n  overflow: hidden;\n  position: absolute;\n  padding: 0px;\n  top: 0px;\n  width: 100%;\n  z-index: 20; }\n\n.flip-list > li > div.flip-back {\n  height: 0px; }\n\n/* ------ Hardware Accelerated Tiles --------*/\n/* flip */\n.live-tile.flip.ha,\n.flip-list.ha {\n  position: relative;\n  overflow: hidden; }\n\n.live-tile.flip .ha.flip-front,\n.flip-list .ha.flip-front,\n.live-tile.flip .ha.flip-back,\n.flip-list .ha.flip-back {\n  position: absolute;\n  z-index: 20;\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  backface-visibility: hidden; }\n\n.flip-list > li > .ha.flip-back,\n.flip-list > li > .ha.flip-back img {\n  /* override the values set for margin and ensure the back tile is visible  */\n  margin: 0px !important;\n  height: 100%; }\n\n.bounce {\n  cursor: pointer;\n  outline: 1px solid transparent;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-transition: all .2s ease;\n  -moz-transition: all .2s ease;\n  -o-transition: all .2s ease;\n  transition: all .2s ease;\n  -webkit-transform: scale(1);\n  -ms-transform: scale(1);\n  -moz-transform: scale(1);\n  -o-transform: scale(1);\n  transform: scale(1);\n  -webkit-transform-origin: 50% 50%;\n  -moz-transform-origin: 50% 50%;\n  -ms-transform-origin: 50% 50%;\n  -o-transform-origin: 50% 50%;\n  transform-origin: 50% 50%;\n  -webkit-transform-style: preserve-3d;\n  -moz-transform-style: preserve-3d;\n  -ms-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  backface-visibility: hidden; }\n\n.bounce.bounce-c {\n  filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.95, M12=0, M21=0, M22=0.95);\n  -webkit-transform: scale(0.95);\n  -ms-transform: scale(0.95);\n  -moz-transform: scale(0.95);\n  -o-transform: scale(0.95);\n  transform: scale(0.95); }\n\n.bounce.bounce-t {\n  -webkit-transform: rotateX(20deg);\n  -ms-transform: rotateX(20deg);\n  -moz-transform: rotateX(20deg);\n  -o-transform: rotateX(20deg);\n  transform: rotateX(20deg);\n  -webkit-transform-origin: 0% 100%;\n  -moz-transform-origin: 0% 100%;\n  -ms-transform-origin: 0% 100%;\n  -o-transform-origin: 0% 100%;\n  transform-origin: 0% 100%; }\n\n.bounce.bounce-b {\n  -webkit-transform: rotateX(-20deg);\n  -ms-transform: rotateX(-20deg);\n  -moz-transform: rotateX(-20deg);\n  -o-transform: rotateX(-20deg);\n  transform: rotateX(-20deg);\n  -webkit-transform-origin: 50% 0%;\n  -moz-transform-origin: 50% 0%;\n  -ms-transform-origin: 50% 0%;\n  -o-transform-origin: 50% 0%;\n  transform-origin: 50% 0%; }\n\n.bounce.bounce-r {\n  -webkit-transform: rotateY(20deg);\n  -ms-transform: rotateY(20deg);\n  -moz-transform: rotateY(20deg);\n  -o-transform: rotateY(20deg);\n  transform: rotateY(20deg);\n  -webkit-transform-origin: 0% 50%;\n  -moz-transform-origin: 0% 50%;\n  -ms-transform-origin: 0% 50%;\n  -o-transform-origin: 0% 50%;\n  transform-origin: 0% 50%; }\n\n.bounce.bounce-l {\n  -webkit-transform: rotateY(-20deg);\n  -ms-transform: rotateY(-20deg);\n  -moz-transform: rotateY(-20deg);\n  -o-transform: rotateY(-20deg);\n  transform: rotateY(-20deg);\n  -webkit-transform-origin: 100% 50%;\n  -moz-transform-origin: 100% 50%;\n  -ms-transform-origin: 100% 50%;\n  -o-transform-origin: 100% 50%;\n  transform-origin: 100% 50%; }\n\n.bounce.bounce-tl {\n  -webkit-transform: rotateX(10deg) rotateY(-10deg);\n  -ms-transform: rotateX(10deg) rotateY(-10deg);\n  -moz-transform: rotateX(10deg) rotateY(-10deg);\n  -o-transform: rotateX(10deg) rotateY(-10deg);\n  transform: rotateX(10deg) rotateY(-10deg); }\n\n.bounce.bounce-tr {\n  -webkit-transform: rotateX(10deg) rotateY(10deg);\n  -ms-transform: rotateX(10deg) rotateY(10deg);\n  -moz-transform: rotateX(10deg) rotateY(10deg);\n  -o-transform: rotateX(10deg) rotateY(10deg);\n  transform: rotateX(10deg) rotateY(10deg); }\n\n.bounce.bounce-bl {\n  -webkit-transform: rotateX(-10deg) rotateY(-10deg);\n  -ms-transform: rotateX(-10deg) rotateY(-10deg);\n  -moz-transform: rotateX(-10deg) rotateY(-10deg);\n  -o-transform: rotateX(-10deg) rotateY(-10deg);\n  transform: rotateX(-10deg) rotateY(-10deg); }\n\n.bounce.bounce-br {\n  -webkit-transform: rotateX(-10deg) rotateY(10deg);\n  -ms-transform: rotateX(-10deg) rotateY(10deg);\n  -moz-transform: rotateX(-10deg) rotateY(10deg);\n  -o-transform: rotateX(-10deg) rotateY(10deg);\n  transform: rotateX(-10deg) rotateY(10deg); }\n\n.metroBig,\n.metroExtraLarge,\n.face.metroBig,\n.face.metroExtraLarge,\n.live-tile .metroExtraLarge {\n  font-size: 2em;\n  line-height: 1.1em; }\n\na.metroBig:link,\na.metroExtraLarge:link,\na.face.metroBig:link,\na.face.metroExtraLarge:link,\na.live-tile .metroExtraLarge:link {\n  text-decoration: none; }\n\n.metroLarger,\n.face.metroLarger,\n.live-tile .metroLarger {\n  font-size: 1.5em;\n  line-height: 1.1em; }\n\na.metroLarger:link,\na.face.metroLarger:link,\na.live-tile .metroLarger:link {\n  text-decoration: none; }\n\n.metroLarge,\n.face.metroLarge,\n.live-tile .metroLarge {\n  font-size: 1.2em;\n  line-height: 1.1em; }\n\na.metroLarge:link,\na.face.metroLarge:link,\na.live-tile .metroLarge:link {\n  text-decoration: none; }\n\n.metroSmall,\n.face.metroSmall,\n.live-tile .metroSmall {\n  font-size: .9em;\n  line-height: 1em; }\n\na.metroSmall:link,\na.face.metroSmall:link,\na.live-tile .metroSmall:link {\n  text-decoration: none; }\n\n.metroSmaller,\n.face.metroSmaller,\n.live-tile .metroSmaller {\n  font-size: .8em;\n  line-height: 1em; }\n\na.metroSmaller:link,\na.face.metroSmaller:link,\na.live-tile .metroSmaller:link {\n  text-decoration: none; }\n\n.metroExtraSmall,\n.face.metroExtraSmall,\n.live-tile .metroExtraSmall {\n  font-size: .7em;\n  line-height: 1em; }\n\na.metroExtraSmall:link,\na.face.metroExtraSmall:link,\na.live-tile .metroExtraSmall:link {\n  text-decoration: none; }\n\n.live-tile .p-top {\n  display: block;\n  position: absolute;\n  right: 0px;\n  text-decoration: none; }\n\n.live-tile .p-right {\n  display: block;\n  position: absolute;\n  right: 0px;\n  text-decoration: none; }\n\n.live-tile .p-bottom {\n  display: block;\n  position: absolute;\n  bottom: 0px;\n  text-decoration: none; }\n\n.live-tile .p-left {\n  display: block;\n  position: absolute;\n  left: 0px;\n  text-decoration: none; }\n\n/***** Theme Definitions *****/\n.light {\n  background-color: #fff;\n  color: #000; }\n\n.dark {\n  background-color: #000;\n  color: #fff; }\n\n.light.accent {\n  background-color: #fff; }\n\n.dark.accent {\n  background-color: #000; }\n\n.light .appbar {\n  background-color: #dfdfdf; }\n\n.dark .appbar {\n  background-color: #212021; }\n\n/*live tile accent colors */\n.amber .accent,\n.amber .accentBg,\n.amber .accentBgHover:hover,\n.amber .accentBgHover a:hover,\n.amber .live-tile > div,\n.amber .copy-tile > div,\n.amber .live-tile > .face,\n.amber .copy-tile > .face,\n.amber .live-tile > .slide,\n.amber .live-tile > .flip-back,\n.amber .live-tile > .flip-front,\n.amber .live-tile > .slide-back,\n.amber .live-tile > .slide-front,\n.amber .list-tile > div,\n.amber .flip-list > li > div {\n  background-color: #f1a30b; }\n\n.amber .accentColor,\n.amber .accentHover:hover,\n.amber .accentHover a:hover,\n.amber .accentLink a,\n.amber .accentLink a:hover,\n.amber .accentLink a:visited,\n.amber a.accentLink,\n.amber a.accentLink:hover,\n.amber a.accentLink:visited {\n  color: #f1a30b; }\n\n.amber .accentBorder {\n  border-color: #f1a30b; }\n\n.amber .accentBorderBottom {\n  border-bottom-color: #f1a30b; }\n\n.amber .accentBorderLeft {\n  border-left-color: #f1a30b; }\n\n.amber .accentBorderRight {\n  border-right-color: #f1a30b; }\n\n.amber .accentBorderTop {\n  border-top-color: #f1a30b; }\n\n.blue .accent,\n.blue .accentBg,\n.blue .accentBgHover:hover,\n.blue .accentBgHover a:hover,\n.blue .live-tile > div,\n.blue .copy-tile > div,\n.blue .live-tile > .face,\n.blue .copy-tile > .face,\n.blue .live-tile > .slide,\n.blue .live-tile > .flip-back,\n.blue .live-tile > .flip-front,\n.blue .live-tile > .slide-back,\n.blue .live-tile > .slide-front,\n.blue .list-tile > div,\n.blue .flip-list > li > div {\n  background-color: #1ba1e2; }\n\n.blue .accentColor,\n.blue .accentHover:hover,\n.blue .accentHover a:hover,\n.blue .accentLink a,\n.blue .accentLink a:hover,\n.blue .accentLink a:visited,\n.blue a.accentLink,\n.blue a.accentLink:hover,\n.blue a.accentLink:visited {\n  color: #1ba1e2; }\n\n.blue .accentBorder {\n  border-color: #1ba1e2; }\n\n.blue .accentBorderBottom {\n  border-bottom-color: #1ba1e2; }\n\n.blue .accentBorderLeft {\n  border-left-color: #1ba1e2; }\n\n.blue .accentBorderRight {\n  border-right-color: #1ba1e2; }\n\n.blue .accentBorderTop {\n  border-top-color: #1ba1e2; }\n\n.brown .accent,\n.brown .accentBg,\n.brown .accentBgHover:hover,\n.brown .accentBgHover a:hover,\n.brown .live-tile > div,\n.brown .copy-tile > div,\n.brown .live-tile > .face,\n.brown .copy-tile > .face,\n.brown .live-tile > .slide,\n.brown .live-tile > .flip-back,\n.brown .live-tile > .flip-front,\n.brown .live-tile > .slide-back,\n.brown .live-tile > .slide-front,\n.brown .list-tile > div,\n.brown .flip-list > li > div {\n  background-color: #a05000; }\n\n.brown .accentColor,\n.brown .accentHover:hover,\n.brown .accentHover a:hover,\n.brown .accentLink a,\n.brown .accentLink a:hover,\n.brown .accentLink a:visited,\n.brown a.accentLink,\n.brown a.accentLink:hover,\n.brown a.accentLink:visited {\n  color: #a05000; }\n\n.brown .accentBorder {\n  border-color: #a05000; }\n\n.brown .accentBorderBottom {\n  border-bottom-color: #a05000; }\n\n.brown .accentBorderLeft {\n  border-left-color: #a05000; }\n\n.brown .accentBorderRight {\n  border-right-color: #a05000; }\n\n.brown .accentBorderTop {\n  border-top-color: #a05000; }\n\n.cobalt .accent,\n.cobalt .accentBg,\n.cobalt .accentBgHover:hover,\n.cobalt .accentBgHover a:hover,\n.cobalt .live-tile > div,\n.cobalt .copy-tile > div,\n.cobalt .live-tile > .face,\n.cobalt .copy-tile > .face,\n.cobalt .live-tile > .slide,\n.cobalt .live-tile > .flip-back,\n.cobalt .live-tile > .flip-front,\n.cobalt .live-tile > .slide-back,\n.cobalt .live-tile > .slide-front,\n.cobalt .list-tile > div,\n.cobalt .flip-list > li > div {\n  background-color: #0050ef; }\n\n.cobalt .accentColor,\n.cobalt .accentHover:hover,\n.cobalt .accentHover a:hover,\n.cobalt .accentLink a,\n.cobalt .accentLink a:hover,\n.cobalt .accentLink a:visited,\n.cobalt a.accentLink,\n.cobalt a.accentLink:hover,\n.cobalt a.accentLink:visited {\n  color: #0050ef; }\n\n.cobalt .accentBorder {\n  border-color: #0050ef; }\n\n.cobalt .accentBorderBottom {\n  border-bottom-color: #0050ef; }\n\n.cobalt .accentBorderLeft {\n  border-left-color: #0050ef; }\n\n.cobalt .accentBorderRight {\n  border-right-color: #0050ef; }\n\n.cobalt .accentBorderTop {\n  border-top-color: #0050ef; }\n\n.crimson .accent,\n.crimson .accentBg,\n.crimson .accentBgHover:hover,\n.crimson .accentBgHover a:hover,\n.crimson .live-tile > div,\n.crimson .copy-tile > div,\n.crimson .live-tile > .face,\n.crimson .copy-tile > .face,\n.crimson .live-tile > .slide,\n.crimson .live-tile > .flip-back,\n.crimson .live-tile > .flip-front,\n.crimson .live-tile > .slide-back,\n.crimson .live-tile > .slide-front,\n.crimson .list-tile > div,\n.crimson .flip-list > li > div {\n  background-color: #a20025; }\n\n.crimson .accentColor,\n.crimson .accentHover:hover,\n.crimson .accentHover a:hover,\n.crimson .accentLink a,\n.crimson .accentLink a:hover,\n.crimson .accentLink a:visited,\n.crimson a.accentLink,\n.crimson a.accentLink:hover,\n.crimson a.accentLink:visited {\n  color: #a20025; }\n\n.crimson .accentBorder {\n  border-color: #a20025; }\n\n.crimson .accentBorderBottom {\n  border-bottom-color: #a20025; }\n\n.crimson .accentBorderLeft {\n  border-left-color: #a20025; }\n\n.crimson .accentBorderRight {\n  border-right-color: #a20025; }\n\n.crimson .accentBorderTop {\n  border-top-color: #a20025; }\n\n.cyan .accent,\n.cyan .accentBg,\n.cyan .accentBgHover:hover,\n.cyan .accentBgHover a:hover,\n.cyan .live-tile > div,\n.cyan .copy-tile > div,\n.cyan .live-tile > .face,\n.cyan .copy-tile > .face,\n.cyan .live-tile > .slide,\n.cyan .live-tile > .flip-back,\n.cyan .live-tile > .flip-front,\n.cyan .live-tile > .slide-back,\n.cyan .live-tile > .slide-front,\n.cyan .list-tile > div,\n.cyan .flip-list > li > div {\n  background-color: #1ba0e1; }\n\n.cyan .accentColor,\n.cyan .accentHover:hover,\n.cyan .accentHover a:hover,\n.cyan .accentLink a,\n.cyan .accentLink a:hover,\n.cyan .accentLink a:visited,\n.cyan a.accentLink,\n.cyan a.accentLink:hover,\n.cyan a.accentLink:visited {\n  color: #1ba0e1; }\n\n.cyan .accentBorder {\n  border-color: #1ba0e1; }\n\n.cyan .accentBorderBottom {\n  border-bottom-color: #1ba0e1; }\n\n.cyan .accentBorderLeft {\n  border-left-color: #1ba0e1; }\n\n.cyan .accentBorderRight {\n  border-right-color: #1ba0e1; }\n\n.cyan .accentBorderTop {\n  border-top-color: #1ba0e1; }\n\n.emerald .accent,\n.emerald .accentBg,\n.emerald .accentBgHover:hover,\n.emerald .accentBgHover a:hover,\n.emerald .live-tile > div,\n.emerald .copy-tile > div,\n.emerald .live-tile > .face,\n.emerald .copy-tile > .face,\n.emerald .live-tile > .slide,\n.emerald .live-tile > .flip-back,\n.emerald .live-tile > .flip-front,\n.emerald .live-tile > .slide-back,\n.emerald .live-tile > .slide-front,\n.emerald .list-tile > div,\n.emerald .flip-list > li > div {\n  background-color: #008a00; }\n\n.emerald .accentColor,\n.emerald .accentHover:hover,\n.emerald .accentHover a:hover,\n.emerald .accentLink a,\n.emerald .accentLink a:hover,\n.emerald .accentLink a:visited,\n.emerald a.accentLink,\n.emerald a.accentLink:hover,\n.emerald a.accentLink:visited {\n  color: #008a00; }\n\n.emerald .accentBorder {\n  border-color: #008a00; }\n\n.emerald .accentBorderBottom {\n  border-bottom-color: #008a00; }\n\n.emerald .accentBorderLeft {\n  border-left-color: #008a00; }\n\n.emerald .accentBorderRight {\n  border-right-color: #008a00; }\n\n.emerald .accentBorderTop {\n  border-top-color: #008a00; }\n\n.green .accent,\n.green .accentBg,\n.green .accentBgHover:hover,\n.green .accentBgHover a:hover,\n.green .live-tile > div,\n.green .copy-tile > div,\n.green .live-tile > .face,\n.green .copy-tile > .face,\n.green .live-tile > .slide,\n.green .live-tile > .flip-back,\n.green .live-tile > .flip-front,\n.green .live-tile > .slide-back,\n.green .live-tile > .slide-front,\n.green .list-tile > div,\n.green .flip-list > li > div {\n  background-color: #339933; }\n\n.green .accentColor,\n.green .accentHover:hover,\n.green .accentHover a:hover,\n.green .accentLink a,\n.green .accentLink a:hover,\n.green .accentLink a:visited,\n.green a.accentLink,\n.green a.accentLink:hover,\n.green a.accentLink:visited {\n  color: #339933; }\n\n.green .accentBorder {\n  border-color: #339933; }\n\n.green .accentBorderBottom {\n  border-bottom-color: #339933; }\n\n.green .accentBorderLeft {\n  border-left-color: #339933; }\n\n.green .accentBorderRight {\n  border-right-color: #339933; }\n\n.green .accentBorderTop {\n  border-top-color: #339933; }\n\n.indigo .accent,\n.indigo .accentBg,\n.indigo .accentBgHover:hover,\n.indigo .accentBgHover a:hover,\n.indigo .live-tile > div,\n.indigo .copy-tile > div,\n.indigo .live-tile > .face,\n.indigo .copy-tile > .face,\n.indigo .live-tile > .slide,\n.indigo .live-tile > .flip-back,\n.indigo .live-tile > .flip-front,\n.indigo .live-tile > .slide-back,\n.indigo .live-tile > .slide-front,\n.indigo .list-tile > div,\n.indigo .flip-list > li > div {\n  background-color: #6a00ff; }\n\n.indigo .accentColor,\n.indigo .accentHover:hover,\n.indigo .accentHover a:hover,\n.indigo .accentLink a,\n.indigo .accentLink a:hover,\n.indigo .accentLink a:visited,\n.indigo a.accentLink,\n.indigo a.accentLink:hover,\n.indigo a.accentLink:visited {\n  color: #6a00ff; }\n\n.indigo .accentBorder {\n  border-color: #6a00ff; }\n\n.indigo .accentBorderBottom {\n  border-bottom-color: #6a00ff; }\n\n.indigo .accentBorderLeft {\n  border-left-color: #6a00ff; }\n\n.indigo .accentBorderRight {\n  border-right-color: #6a00ff; }\n\n.indigo .accentBorderTop {\n  border-top-color: #6a00ff; }\n\n.lime .accent,\n.lime .accentBg,\n.lime .accentBgHover:hover,\n.lime .accentBgHover a:hover,\n.lime .live-tile > div,\n.lime .copy-tile > div,\n.lime .live-tile > .face,\n.lime .copy-tile > .face,\n.lime .live-tile > .slide,\n.lime .live-tile > .flip-back,\n.lime .live-tile > .flip-front,\n.lime .live-tile > .slide-back,\n.lime .live-tile > .slide-front,\n.lime .list-tile > div,\n.lime .flip-list > li > div {\n  background-color: #a2c139; }\n\n.lime .accentColor,\n.lime .accentHover:hover,\n.lime .accentHover a:hover,\n.lime .accentLink a,\n.lime .accentLink a:hover,\n.lime .accentLink a:visited,\n.lime a.accentLink,\n.lime a.accentLink:hover,\n.lime a.accentLink:visited {\n  color: #a2c139; }\n\n.lime .accentBorder {\n  border-color: #a2c139; }\n\n.lime .accentBorderBottom {\n  border-bottom-color: #a2c139; }\n\n.lime .accentBorderLeft {\n  border-left-color: #a2c139; }\n\n.lime .accentBorderRight {\n  border-right-color: #a2c139; }\n\n.lime .accentBorderTop {\n  border-top-color: #a2c139; }\n\n.magenta .accent,\n.magenta .accentBg,\n.magenta .accentBgHover:hover,\n.magenta .accentBgHover a:hover,\n.magenta .live-tile > div,\n.magenta .copy-tile > div,\n.magenta .live-tile > .face,\n.magenta .copy-tile > .face,\n.magenta .live-tile > .slide,\n.magenta .live-tile > .flip-back,\n.magenta .live-tile > .flip-front,\n.magenta .live-tile > .slide-back,\n.magenta .live-tile > .slide-front,\n.magenta .list-tile > div,\n.magenta .flip-list > li > div {\n  background-color: #d80073; }\n\n.magenta .accentColor,\n.magenta .accentHover:hover,\n.magenta .accentHover a:hover,\n.magenta .accentLink a,\n.magenta .accentLink a:hover,\n.magenta .accentLink a:visited,\n.magenta a.accentLink,\n.magenta a.accentLink:hover,\n.magenta a.accentLink:visited {\n  color: #d80073; }\n\n.magenta .accentBorder {\n  border-color: #d80073; }\n\n.magenta .accentBorderBottom {\n  border-bottom-color: #d80073; }\n\n.magenta .accentBorderLeft {\n  border-left-color: #d80073; }\n\n.magenta .accentBorderRight {\n  border-right-color: #d80073; }\n\n.magenta .accentBorderTop {\n  border-top-color: #d80073; }\n\n.mango .accent,\n.mango .accentBg,\n.mango .accentBgHover:hover,\n.mango .accentBgHover a:hover,\n.mango .live-tile > div,\n.mango .copy-tile > div,\n.mango .live-tile > .face,\n.mango .copy-tile > .face,\n.mango .live-tile > .slide,\n.mango .live-tile > .flip-back,\n.mango .live-tile > .flip-front,\n.mango .live-tile > .slide-back,\n.mango .live-tile > .slide-front,\n.mango .list-tile > div,\n.mango .flip-list > li > div {\n  background-color: #f09609; }\n\n.mango .accentColor,\n.mango .accentHover:hover,\n.mango .accentHover a:hover,\n.mango .accentLink a,\n.mango .accentLink a:hover,\n.mango .accentLink a:visited,\n.mango a.accentLink,\n.mango a.accentLink:hover,\n.mango a.accentLink:visited {\n  color: #f09609; }\n\n.mango .accentBorder {\n  border-color: #f09609; }\n\n.mango .accentBorderBottom {\n  border-bottom-color: #f09609; }\n\n.mango .accentBorderLeft {\n  border-left-color: #f09609; }\n\n.mango .accentBorderRight {\n  border-right-color: #f09609; }\n\n.mango .accentBorderTop {\n  border-top-color: #f09609; }\n\n.mauve .accent,\n.mauve .accentBg,\n.mauve .accentBgHover:hover,\n.mauve .accentBgHover a:hover,\n.mauve .live-tile > div,\n.mauve .copy-tile > div,\n.mauve .live-tile > .face,\n.mauve .copy-tile > .face,\n.mauve .live-tile > .slide,\n.mauve .live-tile > .flip-back,\n.mauve .live-tile > .flip-front,\n.mauve .live-tile > .slide-back,\n.mauve .live-tile > .slide-front,\n.mauve .list-tile > div,\n.mauve .flip-list > li > div {\n  background-color: #765f89; }\n\n.mauve .accentColor,\n.mauve .accentHover:hover,\n.mauve .accentHover a:hover,\n.mauve .accentLink a,\n.mauve .accentLink a:hover,\n.mauve .accentLink a:visited,\n.mauve a.accentLink,\n.mauve a.accentLink:hover,\n.mauve a.accentLink:visited {\n  color: #765f89; }\n\n.mauve .accentBorder {\n  border-color: #765f89; }\n\n.mauve .accentBorderBottom {\n  border-bottom-color: #765f89; }\n\n.mauve .accentBorderLeft {\n  border-left-color: #765f89; }\n\n.mauve .accentBorderRight {\n  border-right-color: #765f89; }\n\n.mauve .accentBorderTop {\n  border-top-color: #765f89; }\n\n.olive .accent,\n.olive .accentBg,\n.olive .accentBgHover:hover,\n.olive .accentBgHover a:hover,\n.olive .live-tile > div,\n.olive .copy-tile > div,\n.olive .live-tile > .face,\n.olive .copy-tile > .face,\n.olive .live-tile > .slide,\n.olive .live-tile > .flip-back,\n.olive .live-tile > .flip-front,\n.olive .live-tile > .slide-back,\n.olive .live-tile > .slide-front,\n.olive .list-tile > div,\n.olive .flip-list > li > div {\n  background-color: #6d8764; }\n\n.olive .accentColor,\n.olive .accentHover:hover,\n.olive .accentHover a:hover,\n.olive .accentLink a,\n.olive .accentLink a:hover,\n.olive .accentLink a:visited,\n.olive a.accentLink,\n.olive a.accentLink:hover,\n.olive a.accentLink:visited {\n  color: #6d8764; }\n\n.olive .accentBorder {\n  border-color: #6d8764; }\n\n.olive .accentBorderBottom {\n  border-bottom-color: #6d8764; }\n\n.olive .accentBorderLeft {\n  border-left-color: #6d8764; }\n\n.olive .accentBorderRight {\n  border-right-color: #6d8764; }\n\n.olive .accentBorderTop {\n  border-top-color: #6d8764; }\n\n.orange .accent,\n.orange .accentBg,\n.orange .accentBgHover:hover,\n.orange .accentBgHover a:hover,\n.orange .live-tile > div,\n.orange .copy-tile > div,\n.orange .live-tile > .face,\n.orange .copy-tile > .face,\n.orange .live-tile > .slide,\n.orange .live-tile > .flip-back,\n.orange .live-tile > .flip-front,\n.orange .live-tile > .slide-back,\n.orange .live-tile > .slide-front,\n.orange .list-tile > div,\n.orange .flip-list > li > div {\n  background-color: #fa6801; }\n\n.orange .accentColor,\n.orange .accentHover:hover,\n.orange .accentHover a:hover,\n.orange .accentLink a,\n.orange .accentLink a:hover,\n.orange .accentLink a:visited,\n.orange a.accentLink,\n.orange a.accentLink:hover,\n.orange a.accentLink:visited {\n  color: #fa6801; }\n\n.orange .accentBorder {\n  border-color: #fa6801; }\n\n.orange .accentBorderBottom {\n  border-bottom-color: #fa6801; }\n\n.orange .accentBorderLeft {\n  border-left-color: #fa6801; }\n\n.orange .accentBorderRight {\n  border-right-color: #fa6801; }\n\n.orange .accentBorderTop {\n  border-top-color: #fa6801; }\n\n.pink .accent,\n.pink .accentBg,\n.pink .accentBgHover:hover,\n.pink .accentBgHover a:hover,\n.pink .live-tile > div,\n.pink .copy-tile > div,\n.pink .live-tile > .face,\n.pink .copy-tile > .face,\n.pink .live-tile > .slide,\n.pink .live-tile > .flip-back,\n.pink .live-tile > .flip-front,\n.pink .live-tile > .slide-back,\n.pink .live-tile > .slide-front,\n.pink .list-tile > div,\n.pink .flip-list > li > div {\n  background-color: #e671b8; }\n\n.pink .accentColor,\n.pink .accentHover:hover,\n.pink .accentHover a:hover,\n.pink .accentLink a,\n.pink .accentLink a:hover,\n.pink .accentLink a:visited,\n.pink a.accentLink,\n.pink a.accentLink:hover,\n.pink a.accentLink:visited {\n  color: #e671b8; }\n\n.pink .accentBorder {\n  border-color: #e671b8; }\n\n.pink .accentBorderBottom {\n  border-bottom-color: #e671b8; }\n\n.pink .accentBorderLeft {\n  border-left-color: #e671b8; }\n\n.pink .accentBorderRight {\n  border-right-color: #e671b8; }\n\n.pink .accentBorderTop {\n  border-top-color: #e671b8; }\n\n.purple .accent,\n.purple .accentBg,\n.purple .accentBgHover:hover,\n.purple .accentBgHover a:hover,\n.purple .live-tile > div,\n.purple .copy-tile > div,\n.purple .live-tile > .face,\n.purple .copy-tile > .face,\n.purple .live-tile > .slide,\n.purple .live-tile > .flip-back,\n.purple .live-tile > .flip-front,\n.purple .live-tile > .slide-back,\n.purple .live-tile > .slide-front,\n.purple .list-tile > div,\n.purple .flip-list > li > div {\n  background-color: #a200ff; }\n\n.purple .accentColor,\n.purple .accentHover:hover,\n.purple .accentHover a:hover,\n.purple .accentLink a,\n.purple .accentLink a:hover,\n.purple .accentLink a:visited,\n.purple a.accentLink,\n.purple a.accentLink:hover,\n.purple a.accentLink:visited {\n  color: #a200ff; }\n\n.purple .accentBorder {\n  border-color: #a200ff; }\n\n.purple .accentBorderBottom {\n  border-bottom-color: #a200ff; }\n\n.purple .accentBorderLeft {\n  border-left-color: #a200ff; }\n\n.purple .accentBorderRight {\n  border-right-color: #a200ff; }\n\n.purple .accentBorderTop {\n  border-top-color: #a200ff; }\n\n.violet .accent,\n.violet .accentBg,\n.violet .accentBgHover:hover,\n.violet .accentBgHover a:hover,\n.violet .live-tile > div,\n.violet .copy-tile > div,\n.violet .live-tile > .face,\n.violet .copy-tile > .face,\n.violet .live-tile > .slide,\n.violet .live-tile > .flip-back,\n.violet .live-tile > .flip-front,\n.violet .live-tile > .slide-back,\n.violet .live-tile > .slide-front,\n.violet .list-tile > div,\n.violet .flip-list > li > div {\n  background-color: #a200ff; }\n\n.violet .accentColor,\n.violet .accentHover:hover,\n.violet .accentHover a:hover,\n.violet .accentLink a,\n.violet .accentLink a:hover,\n.violet .accentLink a:visited,\n.violet a.accentLink,\n.violet a.accentLink:hover,\n.violet a.accentLink:visited {\n  color: #a200ff; }\n\n.violet .accentBorder {\n  border-color: #a200ff; }\n\n.violet .accentBorderBottom {\n  border-bottom-color: #a200ff; }\n\n.violet .accentBorderLeft {\n  border-left-color: #a200ff; }\n\n.violet .accentBorderRight {\n  border-right-color: #a200ff; }\n\n.violet .accentBorderTop {\n  border-top-color: #a200ff; }\n\n.red .accent,\n.red .accentBg,\n.red .accentBgHover:hover,\n.red .accentBgHover a:hover,\n.red .live-tile > div,\n.red .copy-tile > div,\n.red .live-tile > .face,\n.red .copy-tile > .face,\n.red .live-tile > .slide,\n.red .live-tile > .flip-back,\n.red .live-tile > .flip-front,\n.red .live-tile > .slide-back,\n.red .live-tile > .slide-front,\n.red .list-tile > div,\n.red .flip-list > li > div {\n  background-color: #e51400; }\n\n.red .accentColor,\n.red .accentHover:hover,\n.red .accentHover a:hover,\n.red .accentLink a,\n.red .accentLink a:hover,\n.red .accentLink a:visited,\n.red a.accentLink,\n.red a.accentLink:hover,\n.red a.accentLink:visited {\n  color: #e51400; }\n\n.red .accentBorder {\n  border-color: #e51400; }\n\n.red .accentBorderBottom {\n  border-bottom-color: #e51400; }\n\n.red .accentBorderLeft {\n  border-left-color: #e51400; }\n\n.red .accentBorderRight {\n  border-right-color: #e51400; }\n\n.red .accentBorderTop {\n  border-top-color: #e51400; }\n\n.sienna .accent,\n.sienna .accentBg,\n.sienna .accentBgHover:hover,\n.sienna .accentBgHover a:hover,\n.sienna .live-tile > div,\n.sienna .copy-tile > div,\n.sienna .live-tile > .face,\n.sienna .copy-tile > .face,\n.sienna .live-tile > .slide,\n.sienna .live-tile > .flip-back,\n.sienna .live-tile > .flip-front,\n.sienna .live-tile > .slide-back,\n.sienna .live-tile > .slide-front,\n.sienna .list-tile > div,\n.sienna .flip-list > li > div {\n  background-color: #7b3a3e; }\n\n.sienna .accentColor,\n.sienna .accentHover:hover,\n.sienna .accentHover a:hover,\n.sienna .accentLink a,\n.sienna .accentLink a:hover,\n.sienna .accentLink a:visited,\n.sienna a.accentLink,\n.sienna a.accentLink:hover,\n.sienna a.accentLink:visited {\n  color: #7b3a3e; }\n\n.sienna .accentBorder {\n  border-color: #7b3a3e; }\n\n.sienna .accentBorderBottom {\n  border-bottom-color: #7b3a3e; }\n\n.sienna .accentBorderLeft {\n  border-left-color: #7b3a3e; }\n\n.sienna .accentBorderRight {\n  border-right-color: #7b3a3e; }\n\n.sienna .accentBorderTop {\n  border-top-color: #7b3a3e; }\n\n.steel .accent,\n.steel .accentBg,\n.steel .accentBgHover:hover,\n.steel .accentBgHover a:hover,\n.steel .live-tile > div,\n.steel .copy-tile > div,\n.steel .live-tile > .face,\n.steel .copy-tile > .face,\n.steel .live-tile > .slide,\n.steel .live-tile > .flip-back,\n.steel .live-tile > .flip-front,\n.steel .live-tile > .slide-back,\n.steel .live-tile > .slide-front,\n.steel .list-tile > div,\n.steel .flip-list > li > div {\n  background-color: #657688; }\n\n.steel .accentColor,\n.steel .accentHover:hover,\n.steel .accentHover a:hover,\n.steel .accentLink a,\n.steel .accentLink a:hover,\n.steel .accentLink a:visited,\n.steel a.accentLink,\n.steel a.accentLink:hover,\n.steel a.accentLink:visited {\n  color: #657688; }\n\n.steel .accentBorder {\n  border-color: #657688; }\n\n.steel .accentBorderBottom {\n  border-bottom-color: #657688; }\n\n.steel .accentBorderLeft {\n  border-left-color: #657688; }\n\n.steel .accentBorderRight {\n  border-right-color: #657688; }\n\n.steel .accentBorderTop {\n  border-top-color: #657688; }\n\n.teal .accent,\n.teal .accentBg,\n.teal .accentBgHover:hover,\n.teal .accentBgHover a:hover,\n.teal .live-tile > div,\n.teal .copy-tile > div,\n.teal .live-tile > .face,\n.teal .copy-tile > .face,\n.teal .live-tile > .slide,\n.teal .live-tile > .flip-back,\n.teal .live-tile > .flip-front,\n.teal .live-tile > .slide-back,\n.teal .live-tile > .slide-front,\n.teal .list-tile > div,\n.teal .flip-list > li > div {\n  background-color: #00aba9; }\n\n.teal .accentColor,\n.teal .accentHover:hover,\n.teal .accentHover a:hover,\n.teal .accentLink a,\n.teal .accentLink a:hover,\n.teal .accentLink a:visited,\n.teal a.accentLink,\n.teal a.accentLink:hover,\n.teal a.accentLink:visited {\n  color: #00aba9; }\n\n.teal .accentBorder {\n  border-color: #00aba9; }\n\n.teal .accentBorderBottom {\n  border-bottom-color: #00aba9; }\n\n.teal .accentBorderLeft {\n  border-left-color: #00aba9; }\n\n.teal .accentBorderRight {\n  border-right-color: #00aba9; }\n\n.teal .accentBorderTop {\n  border-top-color: #00aba9; }\n\n.yellow .accent,\n.yellow .accentBg,\n.yellow .accentBgHover:hover,\n.yellow .accentBgHover a:hover,\n.yellow .live-tile > div,\n.yellow .copy-tile > div,\n.yellow .live-tile > .face,\n.yellow .copy-tile > .face,\n.yellow .live-tile > .slide,\n.yellow .live-tile > .flip-back,\n.yellow .live-tile > .flip-front,\n.yellow .live-tile > .slide-back,\n.yellow .live-tile > .slide-front,\n.yellow .list-tile > div,\n.yellow .flip-list > li > div {\n  background-color: #d8c101; }\n\n.yellow .accentColor,\n.yellow .accentHover:hover,\n.yellow .accentHover a:hover,\n.yellow .accentLink a,\n.yellow .accentLink a:hover,\n.yellow .accentLink a:visited,\n.yellow a.accentLink,\n.yellow a.accentLink:hover,\n.yellow a.accentLink:visited {\n  color: #d8c101; }\n\n.yellow .accentBorder {\n  border-color: #d8c101; }\n\n.yellow .accentBorderBottom {\n  border-bottom-color: #d8c101; }\n\n.yellow .accentBorderLeft {\n  border-left-color: #d8c101; }\n\n.yellow .accentBorderRight {\n  border-right-color: #d8c101; }\n\n.yellow .accentBorderTop {\n  border-top-color: #d8c101; }\n\n.trans .accent,\n.trans .accentBg,\n.trans .accentBgHover:hover,\n.trans .accentBgHover a:hover,\n.trans .live-tile > div,\n.trans .copy-tile > div,\n.trans .live-tile > .face,\n.trans .copy-tile > .face,\n.trans .live-tile > .slide,\n.trans .live-tile > .flip-back,\n.trans .live-tile > .flip-front,\n.trans .live-tile > .slide-back,\n.trans .live-tile > .slide-front,\n.trans .list-tile > div,\n.trans .flip-list > li > div {\n  background-color: transparent; }\n\n.trans .accentColor,\n.trans .accentHover:hover,\n.trans .accentHover a:hover,\n.trans .accentLink a,\n.trans .accentLink a:hover,\n.trans .accentLink a:visited,\n.trans a.accentLink,\n.trans a.accentLink:hover,\n.trans a.accentLink:visited {\n  color: transparent; }\n\n.trans .accentBorder {\n  border-color: transparent; }\n\n.trans .accentBorderBottom {\n  border-bottom-color: transparent; }\n\n.trans .accentBorderLeft {\n  border-left-color: transparent; }\n\n.trans .accentBorderRight {\n  border-right-color: transparent; }\n\n.trans .accentBorderTop {\n  border-top-color: transparent; }\n\n.white .accent,\n.white .accentBg,\n.white .accentBgHover:hover,\n.white .accentBgHover a:hover,\n.white .live-tile > div,\n.white .copy-tile > div,\n.white .live-tile > .face,\n.white .copy-tile > .face,\n.white .live-tile > .slide,\n.white .live-tile > .flip-back,\n.white .live-tile > .flip-front,\n.white .live-tile > .slide-back,\n.white .live-tile > .slide-front,\n.white .list-tile > div,\n.white .flip-list > li > div {\n  background-color: #ffffff; }\n\n.white .accentColor,\n.white .accentHover:hover,\n.white .accentHover a:hover,\n.white .accentLink a,\n.white .accentLink a:hover,\n.white .accentLink a:visited,\n.white a.accentLink,\n.white a.accentLink:hover,\n.white a.accentLink:visited {\n  color: #ffffff; }\n\n.white .accentBorder {\n  border-color: #ffffff; }\n\n.white .accentBorderBottom {\n  border-bottom-color: #ffffff; }\n\n.white .accentBorderLeft {\n  border-left-color: #ffffff; }\n\n.white .accentBorderRight {\n  border-right-color: #ffffff; }\n\n.white .accentBorderTop {\n  border-top-color: #ffffff; }\n\n.black .accent,\n.black .accentBg,\n.black .accentBgHover:hover,\n.black .accentBgHover a:hover,\n.black .live-tile > div,\n.black .copy-tile > div,\n.black .live-tile > .face,\n.black .copy-tile > .face,\n.black .live-tile > .slide,\n.black .live-tile > .flip-back,\n.black .live-tile > .flip-front,\n.black .live-tile > .slide-back,\n.black .live-tile > .slide-front,\n.black .list-tile > div,\n.black .flip-list > li > div {\n  background-color: #000000; }\n\n.black .accentColor,\n.black .accentHover:hover,\n.black .accentHover a:hover,\n.black .accentLink a,\n.black .accentLink a:hover,\n.black .accentLink a:visited,\n.black a.accentLink,\n.black a.accentLink:hover,\n.black a.accentLink:visited {\n  color: #000000; }\n\n.black .accentBorder {\n  border-color: #000000; }\n\n.black .accentBorderBottom {\n  border-bottom-color: #000000; }\n\n.black .accentBorderLeft {\n  border-left-color: #000000; }\n\n.black .accentBorderRight {\n  border-right-color: #000000; }\n\n.black .accentBorderTop {\n  border-top-color: #000000; }\n\n/* Local style overrides */\nhtml body .amber.accent,\nhtml body .amber.live-tile > .accent,\nhtml body .amber.list-tile > .accent,\nhtml body .amber.copy-tile > .accent,\nhtml body .amber.live-tile > div,\nhtml body .amber.copy-tile > div,\nhtml body .amber.list-tile > div,\nhtml body .amber.live-tile > .face,\nhtml body .amber.list-tile > .face,\nhtml body .amber.copy-tile > .face,\nhtml body .amber.live-tile > .slide,\nhtml body .amber.live-tile > .flip-back,\nhtml body .amber.live-tile > .flip-front,\nhtml body .amber.live-tile > .slide-back,\nhtml body .amber.live-tile > .slide-front,\nhtml body .amber.flip-list > li > .accent,\nhtml body .amber.flip-list > li > .flip-back,\nhtml body .amber.flip-list > li > .flip-front,\nhtml body .amber.slide.accent,\nhtml body .amber.slide-front.accent,\nhtml body .amber.slide-back.accent,\nhtml body .amber.flip-front.accent,\nhtml body .amber.flip-back.accent {\n  background-color: #f1a30b; }\n\nhtml body .amber.accentColor,\nhtml body .amber.accentHover:hover,\nhtml body .amber.accentHover a:hover,\nhtml body .amber.accentLink a,\nhtml body .amber.accentLink a:hover,\nhtml body .amber.accentLink a:visited,\na.accentLinkhtml body .amber,\na.accentLinkhtml body .amber:hover,\na.accentLinkhtml body .amber:visited {\n  color: #f1a30b; }\n\nhtml body .amber.accentBorder {\n  border-color: #f1a30b; }\n\nhtml body .amber.accentBorderBottom {\n  border-bottom-color: #f1a30b; }\n\nhtml body .amber.accentBorderLeft {\n  border-left-color: #f1a30b; }\n\nhtml body .amber.accentBorderRight {\n  border-right-color: #f1a30b; }\n\nhtml body .amber.accentBorderTop {\n  border-top-color: #f1a30b; }\n\nhtml body .blue.accent,\nhtml body .blue.live-tile > .accent,\nhtml body .blue.list-tile > .accent,\nhtml body .blue.copy-tile > .accent,\nhtml body .blue.live-tile > div,\nhtml body .blue.copy-tile > div,\nhtml body .blue.list-tile > div,\nhtml body .blue.live-tile > .face,\nhtml body .blue.list-tile > .face,\nhtml body .blue.copy-tile > .face,\nhtml body .blue.live-tile > .slide,\nhtml body .blue.live-tile > .flip-back,\nhtml body .blue.live-tile > .flip-front,\nhtml body .blue.live-tile > .slide-back,\nhtml body .blue.live-tile > .slide-front,\nhtml body .blue.flip-list > li > .accent,\nhtml body .blue.flip-list > li > .flip-back,\nhtml body .blue.flip-list > li > .flip-front,\nhtml body .blue.slide.accent,\nhtml body .blue.slide-front.accent,\nhtml body .blue.slide-back.accent,\nhtml body .blue.flip-front.accent,\nhtml body .blue.flip-back.accent {\n  background-color: #1ba1e2; }\n\nhtml body .blue.accentColor,\nhtml body .blue.accentHover:hover,\nhtml body .blue.accentHover a:hover,\nhtml body .blue.accentLink a,\nhtml body .blue.accentLink a:hover,\nhtml body .blue.accentLink a:visited,\na.accentLinkhtml body .blue,\na.accentLinkhtml body .blue:hover,\na.accentLinkhtml body .blue:visited {\n  color: #1ba1e2; }\n\nhtml body .blue.accentBorder {\n  border-color: #1ba1e2; }\n\nhtml body .blue.accentBorderBottom {\n  border-bottom-color: #1ba1e2; }\n\nhtml body .blue.accentBorderLeft {\n  border-left-color: #1ba1e2; }\n\nhtml body .blue.accentBorderRight {\n  border-right-color: #1ba1e2; }\n\nhtml body .blue.accentBorderTop {\n  border-top-color: #1ba1e2; }\n\nhtml body .brown.accent,\nhtml body .brown.live-tile > .accent,\nhtml body .brown.list-tile > .accent,\nhtml body .brown.copy-tile > .accent,\nhtml body .brown.live-tile > div,\nhtml body .brown.copy-tile > div,\nhtml body .brown.list-tile > div,\nhtml body .brown.live-tile > .face,\nhtml body .brown.list-tile > .face,\nhtml body .brown.copy-tile > .face,\nhtml body .brown.live-tile > .slide,\nhtml body .brown.live-tile > .flip-back,\nhtml body .brown.live-tile > .flip-front,\nhtml body .brown.live-tile > .slide-back,\nhtml body .brown.live-tile > .slide-front,\nhtml body .brown.flip-list > li > .accent,\nhtml body .brown.flip-list > li > .flip-back,\nhtml body .brown.flip-list > li > .flip-front,\nhtml body .brown.slide.accent,\nhtml body .brown.slide-front.accent,\nhtml body .brown.slide-back.accent,\nhtml body .brown.flip-front.accent,\nhtml body .brown.flip-back.accent {\n  background-color: #a05000; }\n\nhtml body .brown.accentColor,\nhtml body .brown.accentHover:hover,\nhtml body .brown.accentHover a:hover,\nhtml body .brown.accentLink a,\nhtml body .brown.accentLink a:hover,\nhtml body .brown.accentLink a:visited,\na.accentLinkhtml body .brown,\na.accentLinkhtml body .brown:hover,\na.accentLinkhtml body .brown:visited {\n  color: #a05000; }\n\nhtml body .brown.accentBorder {\n  border-color: #a05000; }\n\nhtml body .brown.accentBorderBottom {\n  border-bottom-color: #a05000; }\n\nhtml body .brown.accentBorderLeft {\n  border-left-color: #a05000; }\n\nhtml body .brown.accentBorderRight {\n  border-right-color: #a05000; }\n\nhtml body .brown.accentBorderTop {\n  border-top-color: #a05000; }\n\nhtml body .cobalt.accent,\nhtml body .cobalt.live-tile > .accent,\nhtml body .cobalt.list-tile > .accent,\nhtml body .cobalt.copy-tile > .accent,\nhtml body .cobalt.live-tile > div,\nhtml body .cobalt.copy-tile > div,\nhtml body .cobalt.list-tile > div,\nhtml body .cobalt.live-tile > .face,\nhtml body .cobalt.list-tile > .face,\nhtml body .cobalt.copy-tile > .face,\nhtml body .cobalt.live-tile > .slide,\nhtml body .cobalt.live-tile > .flip-back,\nhtml body .cobalt.live-tile > .flip-front,\nhtml body .cobalt.live-tile > .slide-back,\nhtml body .cobalt.live-tile > .slide-front,\nhtml body .cobalt.flip-list > li > .accent,\nhtml body .cobalt.flip-list > li > .flip-back,\nhtml body .cobalt.flip-list > li > .flip-front,\nhtml body .cobalt.slide.accent,\nhtml body .cobalt.slide-front.accent,\nhtml body .cobalt.slide-back.accent,\nhtml body .cobalt.flip-front.accent,\nhtml body .cobalt.flip-back.accent {\n  background-color: #0050ef; }\n\nhtml body .cobalt.accentColor,\nhtml body .cobalt.accentHover:hover,\nhtml body .cobalt.accentHover a:hover,\nhtml body .cobalt.accentLink a,\nhtml body .cobalt.accentLink a:hover,\nhtml body .cobalt.accentLink a:visited,\na.accentLinkhtml body .cobalt,\na.accentLinkhtml body .cobalt:hover,\na.accentLinkhtml body .cobalt:visited {\n  color: #0050ef; }\n\nhtml body .cobalt.accentBorder {\n  border-color: #0050ef; }\n\nhtml body .cobalt.accentBorderBottom {\n  border-bottom-color: #0050ef; }\n\nhtml body .cobalt.accentBorderLeft {\n  border-left-color: #0050ef; }\n\nhtml body .cobalt.accentBorderRight {\n  border-right-color: #0050ef; }\n\nhtml body .cobalt.accentBorderTop {\n  border-top-color: #0050ef; }\n\nhtml body .crimson.accent,\nhtml body .crimson.live-tile > .accent,\nhtml body .crimson.list-tile > .accent,\nhtml body .crimson.copy-tile > .accent,\nhtml body .crimson.live-tile > div,\nhtml body .crimson.copy-tile > div,\nhtml body .crimson.list-tile > div,\nhtml body .crimson.live-tile > .face,\nhtml body .crimson.list-tile > .face,\nhtml body .crimson.copy-tile > .face,\nhtml body .crimson.live-tile > .slide,\nhtml body .crimson.live-tile > .flip-back,\nhtml body .crimson.live-tile > .flip-front,\nhtml body .crimson.live-tile > .slide-back,\nhtml body .crimson.live-tile > .slide-front,\nhtml body .crimson.flip-list > li > .accent,\nhtml body .crimson.flip-list > li > .flip-back,\nhtml body .crimson.flip-list > li > .flip-front,\nhtml body .crimson.slide.accent,\nhtml body .crimson.slide-front.accent,\nhtml body .crimson.slide-back.accent,\nhtml body .crimson.flip-front.accent,\nhtml body .crimson.flip-back.accent {\n  background-color: #a20025; }\n\nhtml body .crimson.accentColor,\nhtml body .crimson.accentHover:hover,\nhtml body .crimson.accentHover a:hover,\nhtml body .crimson.accentLink a,\nhtml body .crimson.accentLink a:hover,\nhtml body .crimson.accentLink a:visited,\na.accentLinkhtml body .crimson,\na.accentLinkhtml body .crimson:hover,\na.accentLinkhtml body .crimson:visited {\n  color: #a20025; }\n\nhtml body .crimson.accentBorder {\n  border-color: #a20025; }\n\nhtml body .crimson.accentBorderBottom {\n  border-bottom-color: #a20025; }\n\nhtml body .crimson.accentBorderLeft {\n  border-left-color: #a20025; }\n\nhtml body .crimson.accentBorderRight {\n  border-right-color: #a20025; }\n\nhtml body .crimson.accentBorderTop {\n  border-top-color: #a20025; }\n\nhtml body .cyan.accent,\nhtml body .cyan.live-tile > .accent,\nhtml body .cyan.list-tile > .accent,\nhtml body .cyan.copy-tile > .accent,\nhtml body .cyan.live-tile > div,\nhtml body .cyan.copy-tile > div,\nhtml body .cyan.list-tile > div,\nhtml body .cyan.live-tile > .face,\nhtml body .cyan.list-tile > .face,\nhtml body .cyan.copy-tile > .face,\nhtml body .cyan.live-tile > .slide,\nhtml body .cyan.live-tile > .flip-back,\nhtml body .cyan.live-tile > .flip-front,\nhtml body .cyan.live-tile > .slide-back,\nhtml body .cyan.live-tile > .slide-front,\nhtml body .cyan.flip-list > li > .accent,\nhtml body .cyan.flip-list > li > .flip-back,\nhtml body .cyan.flip-list > li > .flip-front,\nhtml body .cyan.slide.accent,\nhtml body .cyan.slide-front.accent,\nhtml body .cyan.slide-back.accent,\nhtml body .cyan.flip-front.accent,\nhtml body .cyan.flip-back.accent {\n  background-color: #1ba0e1; }\n\nhtml body .cyan.accentColor,\nhtml body .cyan.accentHover:hover,\nhtml body .cyan.accentHover a:hover,\nhtml body .cyan.accentLink a,\nhtml body .cyan.accentLink a:hover,\nhtml body .cyan.accentLink a:visited,\na.accentLinkhtml body .cyan,\na.accentLinkhtml body .cyan:hover,\na.accentLinkhtml body .cyan:visited {\n  color: #1ba0e1; }\n\nhtml body .cyan.accentBorder {\n  border-color: #1ba0e1; }\n\nhtml body .cyan.accentBorderBottom {\n  border-bottom-color: #1ba0e1; }\n\nhtml body .cyan.accentBorderLeft {\n  border-left-color: #1ba0e1; }\n\nhtml body .cyan.accentBorderRight {\n  border-right-color: #1ba0e1; }\n\nhtml body .cyan.accentBorderTop {\n  border-top-color: #1ba0e1; }\n\nhtml body .emerald.accent,\nhtml body .emerald.live-tile > .accent,\nhtml body .emerald.list-tile > .accent,\nhtml body .emerald.copy-tile > .accent,\nhtml body .emerald.live-tile > div,\nhtml body .emerald.copy-tile > div,\nhtml body .emerald.list-tile > div,\nhtml body .emerald.live-tile > .face,\nhtml body .emerald.list-tile > .face,\nhtml body .emerald.copy-tile > .face,\nhtml body .emerald.live-tile > .slide,\nhtml body .emerald.live-tile > .flip-back,\nhtml body .emerald.live-tile > .flip-front,\nhtml body .emerald.live-tile > .slide-back,\nhtml body .emerald.live-tile > .slide-front,\nhtml body .emerald.flip-list > li > .accent,\nhtml body .emerald.flip-list > li > .flip-back,\nhtml body .emerald.flip-list > li > .flip-front,\nhtml body .emerald.slide.accent,\nhtml body .emerald.slide-front.accent,\nhtml body .emerald.slide-back.accent,\nhtml body .emerald.flip-front.accent,\nhtml body .emerald.flip-back.accent {\n  background-color: #008a00; }\n\nhtml body .emerald.accentColor,\nhtml body .emerald.accentHover:hover,\nhtml body .emerald.accentHover a:hover,\nhtml body .emerald.accentLink a,\nhtml body .emerald.accentLink a:hover,\nhtml body .emerald.accentLink a:visited,\na.accentLinkhtml body .emerald,\na.accentLinkhtml body .emerald:hover,\na.accentLinkhtml body .emerald:visited {\n  color: #008a00; }\n\nhtml body .emerald.accentBorder {\n  border-color: #008a00; }\n\nhtml body .emerald.accentBorderBottom {\n  border-bottom-color: #008a00; }\n\nhtml body .emerald.accentBorderLeft {\n  border-left-color: #008a00; }\n\nhtml body .emerald.accentBorderRight {\n  border-right-color: #008a00; }\n\nhtml body .emerald.accentBorderTop {\n  border-top-color: #008a00; }\n\nhtml body .green.accent,\nhtml body .green.live-tile > .accent,\nhtml body .green.list-tile > .accent,\nhtml body .green.copy-tile > .accent,\nhtml body .green.live-tile > div,\nhtml body .green.copy-tile > div,\nhtml body .green.list-tile > div,\nhtml body .green.live-tile > .face,\nhtml body .green.list-tile > .face,\nhtml body .green.copy-tile > .face,\nhtml body .green.live-tile > .slide,\nhtml body .green.live-tile > .flip-back,\nhtml body .green.live-tile > .flip-front,\nhtml body .green.live-tile > .slide-back,\nhtml body .green.live-tile > .slide-front,\nhtml body .green.flip-list > li > .accent,\nhtml body .green.flip-list > li > .flip-back,\nhtml body .green.flip-list > li > .flip-front,\nhtml body .green.slide.accent,\nhtml body .green.slide-front.accent,\nhtml body .green.slide-back.accent,\nhtml body .green.flip-front.accent,\nhtml body .green.flip-back.accent {\n  background-color: #339933; }\n\nhtml body .green.accentColor,\nhtml body .green.accentHover:hover,\nhtml body .green.accentHover a:hover,\nhtml body .green.accentLink a,\nhtml body .green.accentLink a:hover,\nhtml body .green.accentLink a:visited,\na.accentLinkhtml body .green,\na.accentLinkhtml body .green:hover,\na.accentLinkhtml body .green:visited {\n  color: #339933; }\n\nhtml body .green.accentBorder {\n  border-color: #339933; }\n\nhtml body .green.accentBorderBottom {\n  border-bottom-color: #339933; }\n\nhtml body .green.accentBorderLeft {\n  border-left-color: #339933; }\n\nhtml body .green.accentBorderRight {\n  border-right-color: #339933; }\n\nhtml body .green.accentBorderTop {\n  border-top-color: #339933; }\n\nhtml body .indigo.accent,\nhtml body .indigo.live-tile > .accent,\nhtml body .indigo.list-tile > .accent,\nhtml body .indigo.copy-tile > .accent,\nhtml body .indigo.live-tile > div,\nhtml body .indigo.copy-tile > div,\nhtml body .indigo.list-tile > div,\nhtml body .indigo.live-tile > .face,\nhtml body .indigo.list-tile > .face,\nhtml body .indigo.copy-tile > .face,\nhtml body .indigo.live-tile > .slide,\nhtml body .indigo.live-tile > .flip-back,\nhtml body .indigo.live-tile > .flip-front,\nhtml body .indigo.live-tile > .slide-back,\nhtml body .indigo.live-tile > .slide-front,\nhtml body .indigo.flip-list > li > .accent,\nhtml body .indigo.flip-list > li > .flip-back,\nhtml body .indigo.flip-list > li > .flip-front,\nhtml body .indigo.slide.accent,\nhtml body .indigo.slide-front.accent,\nhtml body .indigo.slide-back.accent,\nhtml body .indigo.flip-front.accent,\nhtml body .indigo.flip-back.accent {\n  background-color: #6a00ff; }\n\nhtml body .indigo.accentColor,\nhtml body .indigo.accentHover:hover,\nhtml body .indigo.accentHover a:hover,\nhtml body .indigo.accentLink a,\nhtml body .indigo.accentLink a:hover,\nhtml body .indigo.accentLink a:visited,\na.accentLinkhtml body .indigo,\na.accentLinkhtml body .indigo:hover,\na.accentLinkhtml body .indigo:visited {\n  color: #6a00ff; }\n\nhtml body .indigo.accentBorder {\n  border-color: #6a00ff; }\n\nhtml body .indigo.accentBorderBottom {\n  border-bottom-color: #6a00ff; }\n\nhtml body .indigo.accentBorderLeft {\n  border-left-color: #6a00ff; }\n\nhtml body .indigo.accentBorderRight {\n  border-right-color: #6a00ff; }\n\nhtml body .indigo.accentBorderTop {\n  border-top-color: #6a00ff; }\n\nhtml body .lime.accent,\nhtml body .lime.live-tile > .accent,\nhtml body .lime.list-tile > .accent,\nhtml body .lime.copy-tile > .accent,\nhtml body .lime.live-tile > div,\nhtml body .lime.copy-tile > div,\nhtml body .lime.list-tile > div,\nhtml body .lime.live-tile > .face,\nhtml body .lime.list-tile > .face,\nhtml body .lime.copy-tile > .face,\nhtml body .lime.live-tile > .slide,\nhtml body .lime.live-tile > .flip-back,\nhtml body .lime.live-tile > .flip-front,\nhtml body .lime.live-tile > .slide-back,\nhtml body .lime.live-tile > .slide-front,\nhtml body .lime.flip-list > li > .accent,\nhtml body .lime.flip-list > li > .flip-back,\nhtml body .lime.flip-list > li > .flip-front,\nhtml body .lime.slide.accent,\nhtml body .lime.slide-front.accent,\nhtml body .lime.slide-back.accent,\nhtml body .lime.flip-front.accent,\nhtml body .lime.flip-back.accent {\n  background-color: #a2c139; }\n\nhtml body .lime.accentColor,\nhtml body .lime.accentHover:hover,\nhtml body .lime.accentHover a:hover,\nhtml body .lime.accentLink a,\nhtml body .lime.accentLink a:hover,\nhtml body .lime.accentLink a:visited,\na.accentLinkhtml body .lime,\na.accentLinkhtml body .lime:hover,\na.accentLinkhtml body .lime:visited {\n  color: #a2c139; }\n\nhtml body .lime.accentBorder {\n  border-color: #a2c139; }\n\nhtml body .lime.accentBorderBottom {\n  border-bottom-color: #a2c139; }\n\nhtml body .lime.accentBorderLeft {\n  border-left-color: #a2c139; }\n\nhtml body .lime.accentBorderRight {\n  border-right-color: #a2c139; }\n\nhtml body .lime.accentBorderTop {\n  border-top-color: #a2c139; }\n\nhtml body .magenta.accent,\nhtml body .magenta.live-tile > .accent,\nhtml body .magenta.list-tile > .accent,\nhtml body .magenta.copy-tile > .accent,\nhtml body .magenta.live-tile > div,\nhtml body .magenta.copy-tile > div,\nhtml body .magenta.list-tile > div,\nhtml body .magenta.live-tile > .face,\nhtml body .magenta.list-tile > .face,\nhtml body .magenta.copy-tile > .face,\nhtml body .magenta.live-tile > .slide,\nhtml body .magenta.live-tile > .flip-back,\nhtml body .magenta.live-tile > .flip-front,\nhtml body .magenta.live-tile > .slide-back,\nhtml body .magenta.live-tile > .slide-front,\nhtml body .magenta.flip-list > li > .accent,\nhtml body .magenta.flip-list > li > .flip-back,\nhtml body .magenta.flip-list > li > .flip-front,\nhtml body .magenta.slide.accent,\nhtml body .magenta.slide-front.accent,\nhtml body .magenta.slide-back.accent,\nhtml body .magenta.flip-front.accent,\nhtml body .magenta.flip-back.accent {\n  background-color: #d80073; }\n\nhtml body .magenta.accentColor,\nhtml body .magenta.accentHover:hover,\nhtml body .magenta.accentHover a:hover,\nhtml body .magenta.accentLink a,\nhtml body .magenta.accentLink a:hover,\nhtml body .magenta.accentLink a:visited,\na.accentLinkhtml body .magenta,\na.accentLinkhtml body .magenta:hover,\na.accentLinkhtml body .magenta:visited {\n  color: #d80073; }\n\nhtml body .magenta.accentBorder {\n  border-color: #d80073; }\n\nhtml body .magenta.accentBorderBottom {\n  border-bottom-color: #d80073; }\n\nhtml body .magenta.accentBorderLeft {\n  border-left-color: #d80073; }\n\nhtml body .magenta.accentBorderRight {\n  border-right-color: #d80073; }\n\nhtml body .magenta.accentBorderTop {\n  border-top-color: #d80073; }\n\nhtml body .mango.accent,\nhtml body .mango.live-tile > .accent,\nhtml body .mango.list-tile > .accent,\nhtml body .mango.copy-tile > .accent,\nhtml body .mango.live-tile > div,\nhtml body .mango.copy-tile > div,\nhtml body .mango.list-tile > div,\nhtml body .mango.live-tile > .face,\nhtml body .mango.list-tile > .face,\nhtml body .mango.copy-tile > .face,\nhtml body .mango.live-tile > .slide,\nhtml body .mango.live-tile > .flip-back,\nhtml body .mango.live-tile > .flip-front,\nhtml body .mango.live-tile > .slide-back,\nhtml body .mango.live-tile > .slide-front,\nhtml body .mango.flip-list > li > .accent,\nhtml body .mango.flip-list > li > .flip-back,\nhtml body .mango.flip-list > li > .flip-front,\nhtml body .mango.slide.accent,\nhtml body .mango.slide-front.accent,\nhtml body .mango.slide-back.accent,\nhtml body .mango.flip-front.accent,\nhtml body .mango.flip-back.accent {\n  background-color: #f09609; }\n\nhtml body .mango.accentColor,\nhtml body .mango.accentHover:hover,\nhtml body .mango.accentHover a:hover,\nhtml body .mango.accentLink a,\nhtml body .mango.accentLink a:hover,\nhtml body .mango.accentLink a:visited,\na.accentLinkhtml body .mango,\na.accentLinkhtml body .mango:hover,\na.accentLinkhtml body .mango:visited {\n  color: #f09609; }\n\nhtml body .mango.accentBorder {\n  border-color: #f09609; }\n\nhtml body .mango.accentBorderBottom {\n  border-bottom-color: #f09609; }\n\nhtml body .mango.accentBorderLeft {\n  border-left-color: #f09609; }\n\nhtml body .mango.accentBorderRight {\n  border-right-color: #f09609; }\n\nhtml body .mango.accentBorderTop {\n  border-top-color: #f09609; }\n\nhtml body .mauve.accent,\nhtml body .mauve.live-tile > .accent,\nhtml body .mauve.list-tile > .accent,\nhtml body .mauve.copy-tile > .accent,\nhtml body .mauve.live-tile > div,\nhtml body .mauve.copy-tile > div,\nhtml body .mauve.list-tile > div,\nhtml body .mauve.live-tile > .face,\nhtml body .mauve.list-tile > .face,\nhtml body .mauve.copy-tile > .face,\nhtml body .mauve.live-tile > .slide,\nhtml body .mauve.live-tile > .flip-back,\nhtml body .mauve.live-tile > .flip-front,\nhtml body .mauve.live-tile > .slide-back,\nhtml body .mauve.live-tile > .slide-front,\nhtml body .mauve.flip-list > li > .accent,\nhtml body .mauve.flip-list > li > .flip-back,\nhtml body .mauve.flip-list > li > .flip-front,\nhtml body .mauve.slide.accent,\nhtml body .mauve.slide-front.accent,\nhtml body .mauve.slide-back.accent,\nhtml body .mauve.flip-front.accent,\nhtml body .mauve.flip-back.accent {\n  background-color: #765f89; }\n\nhtml body .mauve.accentColor,\nhtml body .mauve.accentHover:hover,\nhtml body .mauve.accentHover a:hover,\nhtml body .mauve.accentLink a,\nhtml body .mauve.accentLink a:hover,\nhtml body .mauve.accentLink a:visited,\na.accentLinkhtml body .mauve,\na.accentLinkhtml body .mauve:hover,\na.accentLinkhtml body .mauve:visited {\n  color: #765f89; }\n\nhtml body .mauve.accentBorder {\n  border-color: #765f89; }\n\nhtml body .mauve.accentBorderBottom {\n  border-bottom-color: #765f89; }\n\nhtml body .mauve.accentBorderLeft {\n  border-left-color: #765f89; }\n\nhtml body .mauve.accentBorderRight {\n  border-right-color: #765f89; }\n\nhtml body .mauve.accentBorderTop {\n  border-top-color: #765f89; }\n\nhtml body .olive.accent,\nhtml body .olive.live-tile > .accent,\nhtml body .olive.list-tile > .accent,\nhtml body .olive.copy-tile > .accent,\nhtml body .olive.live-tile > div,\nhtml body .olive.copy-tile > div,\nhtml body .olive.list-tile > div,\nhtml body .olive.live-tile > .face,\nhtml body .olive.list-tile > .face,\nhtml body .olive.copy-tile > .face,\nhtml body .olive.live-tile > .slide,\nhtml body .olive.live-tile > .flip-back,\nhtml body .olive.live-tile > .flip-front,\nhtml body .olive.live-tile > .slide-back,\nhtml body .olive.live-tile > .slide-front,\nhtml body .olive.flip-list > li > .accent,\nhtml body .olive.flip-list > li > .flip-back,\nhtml body .olive.flip-list > li > .flip-front,\nhtml body .olive.slide.accent,\nhtml body .olive.slide-front.accent,\nhtml body .olive.slide-back.accent,\nhtml body .olive.flip-front.accent,\nhtml body .olive.flip-back.accent {\n  background-color: #6d8764; }\n\nhtml body .olive.accentColor,\nhtml body .olive.accentHover:hover,\nhtml body .olive.accentHover a:hover,\nhtml body .olive.accentLink a,\nhtml body .olive.accentLink a:hover,\nhtml body .olive.accentLink a:visited,\na.accentLinkhtml body .olive,\na.accentLinkhtml body .olive:hover,\na.accentLinkhtml body .olive:visited {\n  color: #6d8764; }\n\nhtml body .olive.accentBorder {\n  border-color: #6d8764; }\n\nhtml body .olive.accentBorderBottom {\n  border-bottom-color: #6d8764; }\n\nhtml body .olive.accentBorderLeft {\n  border-left-color: #6d8764; }\n\nhtml body .olive.accentBorderRight {\n  border-right-color: #6d8764; }\n\nhtml body .olive.accentBorderTop {\n  border-top-color: #6d8764; }\n\nhtml body .orange.accent,\nhtml body .orange.live-tile > .accent,\nhtml body .orange.list-tile > .accent,\nhtml body .orange.copy-tile > .accent,\nhtml body .orange.live-tile > div,\nhtml body .orange.copy-tile > div,\nhtml body .orange.list-tile > div,\nhtml body .orange.live-tile > .face,\nhtml body .orange.list-tile > .face,\nhtml body .orange.copy-tile > .face,\nhtml body .orange.live-tile > .slide,\nhtml body .orange.live-tile > .flip-back,\nhtml body .orange.live-tile > .flip-front,\nhtml body .orange.live-tile > .slide-back,\nhtml body .orange.live-tile > .slide-front,\nhtml body .orange.flip-list > li > .accent,\nhtml body .orange.flip-list > li > .flip-back,\nhtml body .orange.flip-list > li > .flip-front,\nhtml body .orange.slide.accent,\nhtml body .orange.slide-front.accent,\nhtml body .orange.slide-back.accent,\nhtml body .orange.flip-front.accent,\nhtml body .orange.flip-back.accent {\n  background-color: #fa6801; }\n\nhtml body .orange.accentColor,\nhtml body .orange.accentHover:hover,\nhtml body .orange.accentHover a:hover,\nhtml body .orange.accentLink a,\nhtml body .orange.accentLink a:hover,\nhtml body .orange.accentLink a:visited,\na.accentLinkhtml body .orange,\na.accentLinkhtml body .orange:hover,\na.accentLinkhtml body .orange:visited {\n  color: #fa6801; }\n\nhtml body .orange.accentBorder {\n  border-color: #fa6801; }\n\nhtml body .orange.accentBorderBottom {\n  border-bottom-color: #fa6801; }\n\nhtml body .orange.accentBorderLeft {\n  border-left-color: #fa6801; }\n\nhtml body .orange.accentBorderRight {\n  border-right-color: #fa6801; }\n\nhtml body .orange.accentBorderTop {\n  border-top-color: #fa6801; }\n\nhtml body .pink.accent,\nhtml body .pink.live-tile > .accent,\nhtml body .pink.list-tile > .accent,\nhtml body .pink.copy-tile > .accent,\nhtml body .pink.live-tile > div,\nhtml body .pink.copy-tile > div,\nhtml body .pink.list-tile > div,\nhtml body .pink.live-tile > .face,\nhtml body .pink.list-tile > .face,\nhtml body .pink.copy-tile > .face,\nhtml body .pink.live-tile > .slide,\nhtml body .pink.live-tile > .flip-back,\nhtml body .pink.live-tile > .flip-front,\nhtml body .pink.live-tile > .slide-back,\nhtml body .pink.live-tile > .slide-front,\nhtml body .pink.flip-list > li > .accent,\nhtml body .pink.flip-list > li > .flip-back,\nhtml body .pink.flip-list > li > .flip-front,\nhtml body .pink.slide.accent,\nhtml body .pink.slide-front.accent,\nhtml body .pink.slide-back.accent,\nhtml body .pink.flip-front.accent,\nhtml body .pink.flip-back.accent {\n  background-color: #e671b8; }\n\nhtml body .pink.accentColor,\nhtml body .pink.accentHover:hover,\nhtml body .pink.accentHover a:hover,\nhtml body .pink.accentLink a,\nhtml body .pink.accentLink a:hover,\nhtml body .pink.accentLink a:visited,\na.accentLinkhtml body .pink,\na.accentLinkhtml body .pink:hover,\na.accentLinkhtml body .pink:visited {\n  color: #e671b8; }\n\nhtml body .pink.accentBorder {\n  border-color: #e671b8; }\n\nhtml body .pink.accentBorderBottom {\n  border-bottom-color: #e671b8; }\n\nhtml body .pink.accentBorderLeft {\n  border-left-color: #e671b8; }\n\nhtml body .pink.accentBorderRight {\n  border-right-color: #e671b8; }\n\nhtml body .pink.accentBorderTop {\n  border-top-color: #e671b8; }\n\nhtml body .purple.accent,\nhtml body .purple.live-tile > .accent,\nhtml body .purple.list-tile > .accent,\nhtml body .purple.copy-tile > .accent,\nhtml body .purple.live-tile > div,\nhtml body .purple.copy-tile > div,\nhtml body .purple.list-tile > div,\nhtml body .purple.live-tile > .face,\nhtml body .purple.list-tile > .face,\nhtml body .purple.copy-tile > .face,\nhtml body .purple.live-tile > .slide,\nhtml body .purple.live-tile > .flip-back,\nhtml body .purple.live-tile > .flip-front,\nhtml body .purple.live-tile > .slide-back,\nhtml body .purple.live-tile > .slide-front,\nhtml body .purple.flip-list > li > .accent,\nhtml body .purple.flip-list > li > .flip-back,\nhtml body .purple.flip-list > li > .flip-front,\nhtml body .purple.slide.accent,\nhtml body .purple.slide-front.accent,\nhtml body .purple.slide-back.accent,\nhtml body .purple.flip-front.accent,\nhtml body .purple.flip-back.accent {\n  background-color: #a200ff; }\n\nhtml body .purple.accentColor,\nhtml body .purple.accentHover:hover,\nhtml body .purple.accentHover a:hover,\nhtml body .purple.accentLink a,\nhtml body .purple.accentLink a:hover,\nhtml body .purple.accentLink a:visited,\na.accentLinkhtml body .purple,\na.accentLinkhtml body .purple:hover,\na.accentLinkhtml body .purple:visited {\n  color: #a200ff; }\n\nhtml body .purple.accentBorder {\n  border-color: #a200ff; }\n\nhtml body .purple.accentBorderBottom {\n  border-bottom-color: #a200ff; }\n\nhtml body .purple.accentBorderLeft {\n  border-left-color: #a200ff; }\n\nhtml body .purple.accentBorderRight {\n  border-right-color: #a200ff; }\n\nhtml body .purple.accentBorderTop {\n  border-top-color: #a200ff; }\n\nhtml body .violet.accent,\nhtml body .violet.live-tile > .accent,\nhtml body .violet.list-tile > .accent,\nhtml body .violet.copy-tile > .accent,\nhtml body .violet.live-tile > div,\nhtml body .violet.copy-tile > div,\nhtml body .violet.list-tile > div,\nhtml body .violet.live-tile > .face,\nhtml body .violet.list-tile > .face,\nhtml body .violet.copy-tile > .face,\nhtml body .violet.live-tile > .slide,\nhtml body .violet.live-tile > .flip-back,\nhtml body .violet.live-tile > .flip-front,\nhtml body .violet.live-tile > .slide-back,\nhtml body .violet.live-tile > .slide-front,\nhtml body .violet.flip-list > li > .accent,\nhtml body .violet.flip-list > li > .flip-back,\nhtml body .violet.flip-list > li > .flip-front,\nhtml body .violet.slide.accent,\nhtml body .violet.slide-front.accent,\nhtml body .violet.slide-back.accent,\nhtml body .violet.flip-front.accent,\nhtml body .violet.flip-back.accent {\n  background-color: #a200ff; }\n\nhtml body .violet.accentColor,\nhtml body .violet.accentHover:hover,\nhtml body .violet.accentHover a:hover,\nhtml body .violet.accentLink a,\nhtml body .violet.accentLink a:hover,\nhtml body .violet.accentLink a:visited,\na.accentLinkhtml body .violet,\na.accentLinkhtml body .violet:hover,\na.accentLinkhtml body .violet:visited {\n  color: #a200ff; }\n\nhtml body .violet.accentBorder {\n  border-color: #a200ff; }\n\nhtml body .violet.accentBorderBottom {\n  border-bottom-color: #a200ff; }\n\nhtml body .violet.accentBorderLeft {\n  border-left-color: #a200ff; }\n\nhtml body .violet.accentBorderRight {\n  border-right-color: #a200ff; }\n\nhtml body .violet.accentBorderTop {\n  border-top-color: #a200ff; }\n\nhtml body .red.accent,\nhtml body .red.live-tile > .accent,\nhtml body .red.list-tile > .accent,\nhtml body .red.copy-tile > .accent,\nhtml body .red.live-tile > div,\nhtml body .red.copy-tile > div,\nhtml body .red.list-tile > div,\nhtml body .red.live-tile > .face,\nhtml body .red.list-tile > .face,\nhtml body .red.copy-tile > .face,\nhtml body .red.live-tile > .slide,\nhtml body .red.live-tile > .flip-back,\nhtml body .red.live-tile > .flip-front,\nhtml body .red.live-tile > .slide-back,\nhtml body .red.live-tile > .slide-front,\nhtml body .red.flip-list > li > .accent,\nhtml body .red.flip-list > li > .flip-back,\nhtml body .red.flip-list > li > .flip-front,\nhtml body .red.slide.accent,\nhtml body .red.slide-front.accent,\nhtml body .red.slide-back.accent,\nhtml body .red.flip-front.accent,\nhtml body .red.flip-back.accent {\n  background-color: #e51400; }\n\nhtml body .red.accentColor,\nhtml body .red.accentHover:hover,\nhtml body .red.accentHover a:hover,\nhtml body .red.accentLink a,\nhtml body .red.accentLink a:hover,\nhtml body .red.accentLink a:visited,\na.accentLinkhtml body .red,\na.accentLinkhtml body .red:hover,\na.accentLinkhtml body .red:visited {\n  color: #e51400; }\n\nhtml body .red.accentBorder {\n  border-color: #e51400; }\n\nhtml body .red.accentBorderBottom {\n  border-bottom-color: #e51400; }\n\nhtml body .red.accentBorderLeft {\n  border-left-color: #e51400; }\n\nhtml body .red.accentBorderRight {\n  border-right-color: #e51400; }\n\nhtml body .red.accentBorderTop {\n  border-top-color: #e51400; }\n\nhtml body .sienna.accent,\nhtml body .sienna.live-tile > .accent,\nhtml body .sienna.list-tile > .accent,\nhtml body .sienna.copy-tile > .accent,\nhtml body .sienna.live-tile > div,\nhtml body .sienna.copy-tile > div,\nhtml body .sienna.list-tile > div,\nhtml body .sienna.live-tile > .face,\nhtml body .sienna.list-tile > .face,\nhtml body .sienna.copy-tile > .face,\nhtml body .sienna.live-tile > .slide,\nhtml body .sienna.live-tile > .flip-back,\nhtml body .sienna.live-tile > .flip-front,\nhtml body .sienna.live-tile > .slide-back,\nhtml body .sienna.live-tile > .slide-front,\nhtml body .sienna.flip-list > li > .accent,\nhtml body .sienna.flip-list > li > .flip-back,\nhtml body .sienna.flip-list > li > .flip-front,\nhtml body .sienna.slide.accent,\nhtml body .sienna.slide-front.accent,\nhtml body .sienna.slide-back.accent,\nhtml body .sienna.flip-front.accent,\nhtml body .sienna.flip-back.accent {\n  background-color: #7b3a3e; }\n\nhtml body .sienna.accentColor,\nhtml body .sienna.accentHover:hover,\nhtml body .sienna.accentHover a:hover,\nhtml body .sienna.accentLink a,\nhtml body .sienna.accentLink a:hover,\nhtml body .sienna.accentLink a:visited,\na.accentLinkhtml body .sienna,\na.accentLinkhtml body .sienna:hover,\na.accentLinkhtml body .sienna:visited {\n  color: #7b3a3e; }\n\nhtml body .sienna.accentBorder {\n  border-color: #7b3a3e; }\n\nhtml body .sienna.accentBorderBottom {\n  border-bottom-color: #7b3a3e; }\n\nhtml body .sienna.accentBorderLeft {\n  border-left-color: #7b3a3e; }\n\nhtml body .sienna.accentBorderRight {\n  border-right-color: #7b3a3e; }\n\nhtml body .sienna.accentBorderTop {\n  border-top-color: #7b3a3e; }\n\nhtml body .steel.accent,\nhtml body .steel.live-tile > .accent,\nhtml body .steel.list-tile > .accent,\nhtml body .steel.copy-tile > .accent,\nhtml body .steel.live-tile > div,\nhtml body .steel.copy-tile > div,\nhtml body .steel.list-tile > div,\nhtml body .steel.live-tile > .face,\nhtml body .steel.list-tile > .face,\nhtml body .steel.copy-tile > .face,\nhtml body .steel.live-tile > .slide,\nhtml body .steel.live-tile > .flip-back,\nhtml body .steel.live-tile > .flip-front,\nhtml body .steel.live-tile > .slide-back,\nhtml body .steel.live-tile > .slide-front,\nhtml body .steel.flip-list > li > .accent,\nhtml body .steel.flip-list > li > .flip-back,\nhtml body .steel.flip-list > li > .flip-front,\nhtml body .steel.slide.accent,\nhtml body .steel.slide-front.accent,\nhtml body .steel.slide-back.accent,\nhtml body .steel.flip-front.accent,\nhtml body .steel.flip-back.accent {\n  background-color: #657688; }\n\nhtml body .steel.accentColor,\nhtml body .steel.accentHover:hover,\nhtml body .steel.accentHover a:hover,\nhtml body .steel.accentLink a,\nhtml body .steel.accentLink a:hover,\nhtml body .steel.accentLink a:visited,\na.accentLinkhtml body .steel,\na.accentLinkhtml body .steel:hover,\na.accentLinkhtml body .steel:visited {\n  color: #657688; }\n\nhtml body .steel.accentBorder {\n  border-color: #657688; }\n\nhtml body .steel.accentBorderBottom {\n  border-bottom-color: #657688; }\n\nhtml body .steel.accentBorderLeft {\n  border-left-color: #657688; }\n\nhtml body .steel.accentBorderRight {\n  border-right-color: #657688; }\n\nhtml body .steel.accentBorderTop {\n  border-top-color: #657688; }\n\nhtml body .teal.accent,\nhtml body .teal.live-tile > .accent,\nhtml body .teal.list-tile > .accent,\nhtml body .teal.copy-tile > .accent,\nhtml body .teal.live-tile > div,\nhtml body .teal.copy-tile > div,\nhtml body .teal.list-tile > div,\nhtml body .teal.live-tile > .face,\nhtml body .teal.list-tile > .face,\nhtml body .teal.copy-tile > .face,\nhtml body .teal.live-tile > .slide,\nhtml body .teal.live-tile > .flip-back,\nhtml body .teal.live-tile > .flip-front,\nhtml body .teal.live-tile > .slide-back,\nhtml body .teal.live-tile > .slide-front,\nhtml body .teal.flip-list > li > .accent,\nhtml body .teal.flip-list > li > .flip-back,\nhtml body .teal.flip-list > li > .flip-front,\nhtml body .teal.slide.accent,\nhtml body .teal.slide-front.accent,\nhtml body .teal.slide-back.accent,\nhtml body .teal.flip-front.accent,\nhtml body .teal.flip-back.accent {\n  background-color: #00aba9; }\n\nhtml body .teal.accentColor,\nhtml body .teal.accentHover:hover,\nhtml body .teal.accentHover a:hover,\nhtml body .teal.accentLink a,\nhtml body .teal.accentLink a:hover,\nhtml body .teal.accentLink a:visited,\na.accentLinkhtml body .teal,\na.accentLinkhtml body .teal:hover,\na.accentLinkhtml body .teal:visited {\n  color: #00aba9; }\n\nhtml body .teal.accentBorder {\n  border-color: #00aba9; }\n\nhtml body .teal.accentBorderBottom {\n  border-bottom-color: #00aba9; }\n\nhtml body .teal.accentBorderLeft {\n  border-left-color: #00aba9; }\n\nhtml body .teal.accentBorderRight {\n  border-right-color: #00aba9; }\n\nhtml body .teal.accentBorderTop {\n  border-top-color: #00aba9; }\n\nhtml body .yellow.accent,\nhtml body .yellow.live-tile > .accent,\nhtml body .yellow.list-tile > .accent,\nhtml body .yellow.copy-tile > .accent,\nhtml body .yellow.live-tile > div,\nhtml body .yellow.copy-tile > div,\nhtml body .yellow.list-tile > div,\nhtml body .yellow.live-tile > .face,\nhtml body .yellow.list-tile > .face,\nhtml body .yellow.copy-tile > .face,\nhtml body .yellow.live-tile > .slide,\nhtml body .yellow.live-tile > .flip-back,\nhtml body .yellow.live-tile > .flip-front,\nhtml body .yellow.live-tile > .slide-back,\nhtml body .yellow.live-tile > .slide-front,\nhtml body .yellow.flip-list > li > .accent,\nhtml body .yellow.flip-list > li > .flip-back,\nhtml body .yellow.flip-list > li > .flip-front,\nhtml body .yellow.slide.accent,\nhtml body .yellow.slide-front.accent,\nhtml body .yellow.slide-back.accent,\nhtml body .yellow.flip-front.accent,\nhtml body .yellow.flip-back.accent {\n  background-color: #d8c101; }\n\nhtml body .yellow.accentColor,\nhtml body .yellow.accentHover:hover,\nhtml body .yellow.accentHover a:hover,\nhtml body .yellow.accentLink a,\nhtml body .yellow.accentLink a:hover,\nhtml body .yellow.accentLink a:visited,\na.accentLinkhtml body .yellow,\na.accentLinkhtml body .yellow:hover,\na.accentLinkhtml body .yellow:visited {\n  color: #d8c101; }\n\nhtml body .yellow.accentBorder {\n  border-color: #d8c101; }\n\nhtml body .yellow.accentBorderBottom {\n  border-bottom-color: #d8c101; }\n\nhtml body .yellow.accentBorderLeft {\n  border-left-color: #d8c101; }\n\nhtml body .yellow.accentBorderRight {\n  border-right-color: #d8c101; }\n\nhtml body .yellow.accentBorderTop {\n  border-top-color: #d8c101; }\n\nhtml body .trans.accent,\nhtml body .trans.live-tile > .accent,\nhtml body .trans.list-tile > .accent,\nhtml body .trans.copy-tile > .accent,\nhtml body .trans.live-tile > div,\nhtml body .trans.copy-tile > div,\nhtml body .trans.list-tile > div,\nhtml body .trans.live-tile > .face,\nhtml body .trans.list-tile > .face,\nhtml body .trans.copy-tile > .face,\nhtml body .trans.live-tile > .slide,\nhtml body .trans.live-tile > .flip-back,\nhtml body .trans.live-tile > .flip-front,\nhtml body .trans.live-tile > .slide-back,\nhtml body .trans.live-tile > .slide-front,\nhtml body .trans.flip-list > li > .accent,\nhtml body .trans.flip-list > li > .flip-back,\nhtml body .trans.flip-list > li > .flip-front,\nhtml body .trans.slide.accent,\nhtml body .trans.slide-front.accent,\nhtml body .trans.slide-back.accent,\nhtml body .trans.flip-front.accent,\nhtml body .trans.flip-back.accent {\n  background-color: transparent; }\n\nhtml body .trans.accentColor,\nhtml body .trans.accentHover:hover,\nhtml body .trans.accentHover a:hover,\nhtml body .trans.accentLink a,\nhtml body .trans.accentLink a:hover,\nhtml body .trans.accentLink a:visited,\na.accentLinkhtml body .trans,\na.accentLinkhtml body .trans:hover,\na.accentLinkhtml body .trans:visited {\n  color: transparent; }\n\nhtml body .trans.accentBorder {\n  border-color: transparent; }\n\nhtml body .trans.accentBorderBottom {\n  border-bottom-color: transparent; }\n\nhtml body .trans.accentBorderLeft {\n  border-left-color: transparent; }\n\nhtml body .trans.accentBorderRight {\n  border-right-color: transparent; }\n\nhtml body .trans.accentBorderTop {\n  border-top-color: transparent; }\n\nhtml body .white.accent,\nhtml body .white.live-tile > .accent,\nhtml body .white.list-tile > .accent,\nhtml body .white.copy-tile > .accent,\nhtml body .white.live-tile > div,\nhtml body .white.copy-tile > div,\nhtml body .white.list-tile > div,\nhtml body .white.live-tile > .face,\nhtml body .white.list-tile > .face,\nhtml body .white.copy-tile > .face,\nhtml body .white.live-tile > .slide,\nhtml body .white.live-tile > .flip-back,\nhtml body .white.live-tile > .flip-front,\nhtml body .white.live-tile > .slide-back,\nhtml body .white.live-tile > .slide-front,\nhtml body .white.flip-list > li > .accent,\nhtml body .white.flip-list > li > .flip-back,\nhtml body .white.flip-list > li > .flip-front,\nhtml body .white.slide.accent,\nhtml body .white.slide-front.accent,\nhtml body .white.slide-back.accent,\nhtml body .white.flip-front.accent,\nhtml body .white.flip-back.accent {\n  background-color: #ffffff; }\n\nhtml body .white.accentColor,\nhtml body .white.accentHover:hover,\nhtml body .white.accentHover a:hover,\nhtml body .white.accentLink a,\nhtml body .white.accentLink a:hover,\nhtml body .white.accentLink a:visited,\na.accentLinkhtml body .white,\na.accentLinkhtml body .white:hover,\na.accentLinkhtml body .white:visited {\n  color: #ffffff; }\n\nhtml body .white.accentBorder {\n  border-color: #ffffff; }\n\nhtml body .white.accentBorderBottom {\n  border-bottom-color: #ffffff; }\n\nhtml body .white.accentBorderLeft {\n  border-left-color: #ffffff; }\n\nhtml body .white.accentBorderRight {\n  border-right-color: #ffffff; }\n\nhtml body .white.accentBorderTop {\n  border-top-color: #ffffff; }\n\nhtml body .black.accent,\nhtml body .black.live-tile > .accent,\nhtml body .black.list-tile > .accent,\nhtml body .black.copy-tile > .accent,\nhtml body .black.live-tile > div,\nhtml body .black.copy-tile > div,\nhtml body .black.list-tile > div,\nhtml body .black.live-tile > .face,\nhtml body .black.list-tile > .face,\nhtml body .black.copy-tile > .face,\nhtml body .black.live-tile > .slide,\nhtml body .black.live-tile > .flip-back,\nhtml body .black.live-tile > .flip-front,\nhtml body .black.live-tile > .slide-back,\nhtml body .black.live-tile > .slide-front,\nhtml body .black.flip-list > li > .accent,\nhtml body .black.flip-list > li > .flip-back,\nhtml body .black.flip-list > li > .flip-front,\nhtml body .black.slide.accent,\nhtml body .black.slide-front.accent,\nhtml body .black.slide-back.accent,\nhtml body .black.flip-front.accent,\nhtml body .black.flip-back.accent {\n  background-color: #000000; }\n\nhtml body .black.accentColor,\nhtml body .black.accentHover:hover,\nhtml body .black.accentHover a:hover,\nhtml body .black.accentLink a,\nhtml body .black.accentLink a:hover,\nhtml body .black.accentLink a:visited,\na.accentLinkhtml body .black,\na.accentLinkhtml body .black:hover,\na.accentLinkhtml body .black:visited {\n  color: #000000; }\n\nhtml body .black.accentBorder {\n  border-color: #000000; }\n\nhtml body .black.accentBorderBottom {\n  border-bottom-color: #000000; }\n\nhtml body .black.accentBorderLeft {\n  border-left-color: #000000; }\n\nhtml body .black.accentBorderRight {\n  border-right-color: #000000; }\n\nhtml body .black.accentBorderTop {\n  border-top-color: #000000; }\n\n.appbar {\n  background-color: #212021;\n  bottom: 0px;\n  color: #fff;\n  font-size: .9em;\n  height: 60px;\n  left: 0px;\n  line-height: normal;\n  margin: 0;\n  max-height: 100%;\n  overflow: hidden;\n  padding: 10px 0;\n  position: fixed;\n  right: 0px;\n  text-align: right;\n  width: 100%;\n  z-index: 100;\n  -ms-touch-action: manipulation; }\n\n.appbar.condensed {\n  height: 40px; }\n\n.appbar.condensed a.etc {\n  height: 40px;\n  line-height: 40px; }\n\n.appbar.top {\n  bottom: auto !important;\n  top: 0px; }\n\n.appbar a.etc,\n.appbar a.etc:hover,\n.appbar a.etc:visited {\n  color: #fff;\n  cursor: pointer;\n  display: block;\n  font-size: 32px;\n  /* add some extra padding to make it easier to touch */\n  height: 60px;\n  position: absolute;\n  right: 8px;\n  text-decoration: none;\n  top: 0px;\n  width: 90px;\n  z-index: 100; }\n\n.appbar .clear {\n  clear: both; }\n\n.appbar .theme-options {\n  display: block;\n  float: left;\n  margin: 0px;\n  position: relative;\n  width: 80%; }\n\n.appbar .theme-options > ul {\n  list-style-image: none;\n  list-style-type: none;\n  padding-right: 8px;\n  padding-left: 0px; }\n\n.appbar .theme-options li {\n  display: block;\n  margin: 8px;\n  float: left;\n  line-height: 32px;\n  height: 32px;\n  width: 32px; }\n\n.appbar .theme-options li > a,\n.appbar .theme-options li > a:hover,\n.appbar .theme-options li > a:visited {\n  display: block;\n  padding: 0px;\n  text-decoration: none;\n  height: 32px;\n  width: 32px; }\n\n.appbar .base-theme-options {\n  display: block;\n  float: left;\n  margin: 0px;\n  position: relative;\n  width: 20%; }\n\n.appbar .base-theme-options > ul {\n  padding-left: 2px; }\n\n.appbar .base-theme-options li {\n  display: block;\n  margin: 8px;\n  float: left;\n  line-height: 32px;\n  height: 32px;\n  width: 32px; }\n\n.appbar .base-theme-options li > a,\n.appbar .base-theme-options li > a:hover,\n.appbar .base-theme-options li > a:visited {\n  display: block;\n  padding: 0px;\n  text-decoration: none;\n  height: 32px;\n  width: 32px; }\n\n.appbar .base-theme-options li > a.dark.accent {\n  background-color: #000; }\n\n.appbar .theme-options h2,\n.appbar .base-theme-options h2 {\n  font-size: 2em;\n  font-weight: normal;\n  padding: 8px 8px 12px;\n  text-align: left; }\n\n.appbar .charm-title {\n  font-size: 10px;\n  display: block;\n  text-align: center; }\n\n.appbar .links {\n  font-size: 2em;\n  padding: 24px 0 0 8px;\n  text-align: left; }\n\n.appbar .links a,\n.appbar .links a:link {\n  text-decoration: none; }\n\n.appbar.small {\n  height: 28px; }\n\n.appbar.small a.etc,\n.appbar.small a.etc:hover,\n.appbar.small a.etc:visited {\n  font-size: 16px;\n  height: 60px;\n  width: 90px; }\n\n.light .appbar {\n  background-color: #dfdfdf;\n  color: #000; }\n\n.dark .appbar {\n  background-color: #212021; }\n\n.light .appbar-buttons li a {\n  color: #000; }\n\n.light .appbar-buttons a > img {\n  background-image: url(\"images/metroIcons_light.jpg\"); }\n\n.light .appbar a.etc,\n.light .appbar a.etc:hover,\n.light .appbar a.etc:visited {\n  color: #000; }\n\n.small .appbar-buttons {\n  /* default width is 3 buttons */\n  width: 156px; }\n\n.small .appbar-buttons a > img {\n  height: 32px;\n  width: 32px; }\n\n.small .appbar-buttons.one {\n  width: 52px; }\n\n.small .appbar-buttons.two {\n  width: 104px; }\n\n.small .appbar-buttons.three {\n  width: 156px; }\n\n.small .appbar-buttons.four {\n  width: 208px; }\n\n.small .appbar-buttons.five {\n  width: 260px; }\n\n.small .appbar-buttons.six {\n  width: 312px; }\n\n.small .appbar-buttons.seven {\n  width: 364px; }\n\n.small .appbar-buttons.eight {\n  width: 416px; }\n\n.small .appbar-buttons.nine {\n  width: 468px; }\n\n.small .appbar-buttons.ten {\n  width: 520px; }\n\n.appbar-buttons {\n  margin: 0 auto;\n  overflow: hidden;\n  position: relative;\n  padding: 0 0 2px;\n  text-align: right;\n  /* default width is 3 buttons */\n  width: 252px; }\n\n.appbar-buttons.one {\n  width: 84px; }\n\n.appbar-buttons.two {\n  width: 168px; }\n\n.appbar-buttons.three {\n  width: 252px; }\n\n.appbar-buttons.four {\n  width: 336px; }\n\n.appbar-buttons.five {\n  width: 420px; }\n\n.appbar-buttons.six {\n  width: 504px; }\n\n.appbar-buttons.seven {\n  width: 588px; }\n\n.appbar-buttons.eight {\n  width: 672px; }\n\n.appbar-buttons.nine {\n  width: 756px; }\n\n.appbar-buttons.ten {\n  width: 840px; }\n\n.appbar-buttons a > img {\n  background-image: url(\"images/metroIcons.jpg\");\n  background-repeat: no-repeat;\n  border: none;\n  height: 64px;\n  width: 64px; }\n\n.appbar-buttons a.small > img {\n  height: 32px;\n  width: 32px; }\n\n.appbar-buttons a.search > img {\n  background-position: -12px -12px; }\n\n.appbar-buttons a.home > img {\n  background-position: -104px -12px; }\n\n.appbar-buttons a.twitter > img {\n  background-position: -196px -12px; }\n\n.appbar-buttons a.calendar > img {\n  background-position: -288px -12px; }\n\n.appbar-buttons a.storm > img {\n  background-position: -380px -12px; }\n\n.appbar-buttons a.down > img {\n  background-position: -472px -12px; }\n\n.appbar-buttons a.camera > img {\n  background-position: -12px -99px; }\n\n.appbar-buttons a.camcorder > img {\n  background-position: -104px -99px; }\n\n.appbar-buttons a.qmark > img,\n.appbar-buttons a.about > img {\n  background-position: -196px -99px; }\n\n.appbar-buttons a.share > img {\n  background-position: -288px -99px; }\n\n.appbar-buttons a.rain > img {\n  background-position: -380px -99px; }\n\n.appbar-buttons a.cancel > img,\n.appbar-buttons a.close > img {\n  background-position: -472px -99px; }\n\n.appbar-buttons a.delete > img,\n.appbar-buttons a.trash > img {\n  background-position: -12px -188px; }\n\n.appbar-buttons a.tag > img {\n  background-position: -104px -188px; }\n\n.appbar-buttons a.addcontact > img {\n  background-position: -196px -188px; }\n\n.appbar-buttons a.save > img {\n  background-position: -288px -188px; }\n\n.appbar-buttons a.snow > img {\n  background-position: -380px -188px; }\n\n.appbar-buttons a.msg > img {\n  background-position: -472px -188px; }\n\n.appbar-buttons a.email > img {\n  background-position: -12px -274px; }\n\n.appbar-buttons a.clock > img {\n  background-position: -104px -274px; }\n\n.appbar-buttons a.edit > img {\n  background-position: -196px -274px; }\n\n.appbar-buttons a.circle > img {\n  background-position: -288px -274px; }\n\n.appbar-buttons a.moon > img {\n  background-position: -380px -274px; }\n\n.appbar-buttons a.calc > img {\n  background-position: -12px -362px; }\n\n.appbar-buttons a.gear > img {\n  background-position: -104px -362px; }\n\n.appbar-buttons a.plus > img {\n  background-position: -196px -362px; }\n\n.appbar-buttons a.dot > img {\n  background-position: -288px -362px; }\n\n.appbar-buttons a.restart > img,\n.appbar-buttons a.return > img {\n  background-position: -380px -362px; }\n\n.appbar-buttons a.add > img {\n  background-position: -472px -362px; }\n\n.appbar-buttons a.phone > img {\n  background-position: -12px -453px; }\n\n.appbar-buttons a.film > img {\n  background-position: -104px -453px; }\n\n.appbar-buttons a.back > img {\n  background-position: -196px -453px; }\n\n.appbar-buttons a.car > img {\n  background-position: -288px -453px; }\n\n.appbar-buttons a.forward > img {\n  background-position: -380px -453px; }\n\n.appbar-buttons a.selectmany > img {\n  background-position: -472px -453px; }\n\n.appbar-buttons a.stop > img {\n  background-position: -12px -538px; }\n\n.appbar-buttons a.contacts > img {\n  background-position: -104px -538px; }\n\n.appbar-buttons a.select > img {\n  background-position: -196px -538px; }\n\n.appbar-buttons a.sun > img {\n  background-position: -288px -538px; }\n\n.appbar-buttons a.dpad > img {\n  background-position: -380px -538px; }\n\n.appbar-buttons a.play > img {\n  background-position: -472px -538px; }\n\n.appbar-buttons li {\n  display: inline;\n  padding: 0 10px;\n  float: left;\n  list-style: none; }\n\n.appbar-buttons li a {\n  font-weight: bold;\n  background-color: transparent;\n  color: #fff; }\n\n.appbar-buttons li a:active,\n.appbar-buttons ul#menu li.selected a,\n.appbar-buttons .appbar-buttons li a:hover {\n  text-decoration: none; }\n\n.small .appbar-buttons .search > img,\n.appbar-buttons .small.search > img {\n  background-position: -562px -6px; }\n\n.small .appbar-buttons .home > img,\n.appbar-buttons .small.home > img {\n  background-position: -608px -6px; }\n\n.small .appbar-buttons .twitter > img,\n.appbar-buttons .small.twitter > img {\n  background-position: -654px -6px; }\n\n.small .appbar-buttons .calendar > img,\n.appbar-buttons .small.calendar > img {\n  background-position: -700px -6px; }\n\n.small .appbar-buttons .storm > img,\n.appbar-buttons .small.storm > img {\n  background-position: -746px -6px; }\n\n.small .appbar-buttons .down > img,\n.appbar-buttons .small.down > img {\n  background-position: -792px -6px; }\n\n.small .appbar-buttons .camera > img,\n.appbar-buttons .small.camera > img {\n  background-position: -562px -50px; }\n\n.small .appbar-buttons .camcorder > img,\n.appbar-buttons .small.camcorder > img {\n  background-position: -608px -50px; }\n\n.small .appbar-buttons .qmark > img,\n.appbar-buttons .small.qmark > img,\n.small .appbar-buttons .about > img,\n.appbar-buttons .small.about > img {\n  background-position: -654px -50px; }\n\n.small .appbar-buttons .share > img,\n.appbar-buttons .small.share > img {\n  background-position: -700px -50px; }\n\n.small .appbar-buttons .rain > img,\n.appbar-buttons .small.rain > img {\n  background-position: -746px -50px; }\n\n.small .appbar-buttons .cancel > img,\n.appbar-buttons .small.cancel > img,\n.small .appbar-buttons .close > img,\n.appbar-buttons .small.close > img {\n  background-position: -792px -50px; }\n\n.small .appbar-buttons .delete > img,\n.appbar-buttons .small.delete > img,\n.small .appbar-buttons .trash > img,\n.appbar-buttons .small.trash > img {\n  background-position: -562px -94px; }\n\n.small .appbar-buttons .tag > img,\n.appbar-buttons .small.tag > img {\n  background-position: -608px -94px; }\n\n.small .appbar-buttons .addcontact > img,\n.appbar-buttons .small.addcontact > img {\n  background-position: -654px -94px; }\n\n.small .appbar-buttons .save > img,\n.appbar-buttons .small.save > img {\n  background-position: -700px -94px; }\n\n.small .appbar-buttons .snow > img,\n.appbar-buttons .small.snow > img {\n  background-position: -746px -94px; }\n\n.small .appbar-buttons .msg > img,\n.appbar-buttons .small.msg > img {\n  background-position: -792px -94px; }\n\n.small .appbar-buttons .email > img,\n.appbar-buttons .small.email > img {\n  background-position: -562px -137px; }\n\n.small .appbar-buttons .clock > img,\n.appbar-buttons .small.clock > img {\n  background-position: -608px -137px; }\n\n.small .appbar-buttons .edit > img,\n.appbar-buttons .small.edit > img {\n  background-position: -654px -137px; }\n\n.small .appbar-buttons .circle > img,\n.appbar-buttons .small.circle > img {\n  background-position: -700px -137px; }\n\n.small .appbar-buttons .moon > img,\n.appbar-buttons .small.moon > img {\n  background-position: -746px -137px; }\n\n.small .appbar-buttons .calc > img,\n.appbar-buttons .small.calc > img {\n  background-position: -562px -181px; }\n\n.small .appbar-buttons .gear > img,\n.appbar-buttons .small.gear > img {\n  background-position: -608px -181px; }\n\n.small .appbar-buttons .plus > img,\n.appbar-buttons .small.plus > img {\n  background-position: -654px -181px; }\n\n.small .appbar-buttons .dot > img,\n.appbar-buttons .small.dot > img {\n  background-position: -700px -181px; }\n\n.small .appbar-buttons .restart > img,\n.appbar-buttons .small.restart > img,\n.small .appbar-buttons .return > img,\n.appbar-buttons .small.return > img {\n  background-position: -746px -181px; }\n\n.small .appbar-buttons .add > img,\n.appbar-buttons .small.add > img {\n  background-position: -792px -181px; }\n\n.small .appbar-buttons .phone > img,\n.appbar-buttons .small.phone > img {\n  background-position: -562px -226px; }\n\n.small .appbar-buttons .film > img,\n.appbar-buttons .small.film > img {\n  background-position: -608px -226px; }\n\n.small .appbar-buttons .back > img,\n.appbar-buttons .small.back > img {\n  background-position: -654px -226px; }\n\n.small .appbar-buttons .car > img,\n.appbar-buttons .small.car > img {\n  background-position: -700px -226px; }\n\n.small .appbar-buttons .forward > img,\n.appbar-buttons .small.forward > img {\n  background-position: -746px -226px; }\n\n.small .appbar-buttons .selectmany > img,\n.appbar-buttons .small.selectmany > img {\n  background-position: -792px -226px; }\n\n.small .appbar-buttons .stop > img,\n.appbar-buttons .small.stop > img {\n  background-position: -562px -269px; }\n\n.small .appbar-buttons .contacts > img,\n.appbar-buttons .small.contacts > img {\n  background-position: -608px -269px; }\n\n.small .appbar-buttons .select > img,\n.appbar-buttons .small.select > img {\n  background-position: -654px -269px; }\n\n.small .appbar-buttons .sun > img,\n.appbar-buttons .small.sun > img {\n  background-position: -700px -269px; }\n\n.small .appbar-buttons .dpad > img,\n.appbar-buttons .small.dpad > img {\n  background-position: -746px -269px; }\n\n.small .appbar-buttons .play > img,\n.appbar-buttons .small.play > img {\n  background-position: -792px -269px; }\n\n/* Media queries */\n@media screen and (max-width: 1025px) {\n  .appbar .theme-options h2,\n  .appbar .base-theme-options h2,\n  .appbar .links {\n    font-size: 1.7em;\n    padding: 8px 8px 2px;\n    text-align: left; }\n  .appbar .base-theme-options li,\n  .appbar .base-theme-options li a,\n  .appbar .theme-options li,\n  .appbar .theme-options li a {\n    display: block;\n    height: 32px;\n    margin: 4px;\n    width: 32px; } }\n\n@media screen and (max-width: 801px) {\n  .appbar .theme-options h2,\n  .appbar .base-theme-options h2,\n  .appbar .links {\n    font-size: 1.3em; }\n  .appbar .theme-options > ul {\n    padding-right: 6px; } }\n\n@media screen and (max-width: 641px) {\n  .appbar .theme-options {\n    width: 70%; }\n  .appbar .base-theme-options {\n    width: 30%; } }\n\n.mt-negative-lg {\n  margin-top: -2.1rem; }\n\n/**\r\n * Mapael\r\n */\n.mapTooltip {\n  position: fixed;\n  padding: 2px;\n  z-index: 1000;\n  max-width: 200px;\n  display: none;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 0.25rem;\n  font-size: 0.875rem;\n  color: #555555; }\n\n.zoomIn, .zoomOut {\n  position: absolute;\n  bottom: 10px;\n  left: 10px;\n  width: 20px;\n  height: 20px;\n  box-sizing: content-box;\n  border: 1px solid #ccc;\n  background-color: #fff;\n  color: #555555;\n  line-height: 20px;\n  text-align: center;\n  border-radius: 0.25rem;\n  cursor: pointer;\n  font-weight: 700;\n  user-select: none; }\n\n.zoomOut {\n  left: 36px; }\n\n.mapael {\n  position: relative;\n  margin: -15px -20px 0; }\n  .mapael .map {\n    position: relative; }\n  .mapael .stats {\n    position: absolute;\n    z-index: 1;\n    top: 0;\n    left: 0;\n    margin: 5% 10%; }\n\n/***********************/\n/*      Live Tiles     */\n/***********************/\n.live-tile,\n.list-tile,\n.copy-tile,\n.tile-strip .flip-list > li {\n  height: auto;\n  width: 100%;\n  margin: 0;\n  color: inherit; }\n  .live-tile.fade,\n  .list-tile.fade,\n  .copy-tile.fade,\n  .tile-strip .flip-list > li.fade {\n    opacity: 1; }\n\n.live-tile p,\n.list-tile p,\n.copy-tile p {\n  padding: 0; }\n\n.live-tile p,\n.list-tile p,\n.copy-tile p,\n.live-tile .face,\n.list-tile .face,\n.copy-tile .face {\n  /* let .h* classes work! */ }\n  .live-tile p.h1,\n  .list-tile p.h1,\n  .copy-tile p.h1,\n  .live-tile .face.h1,\n  .list-tile .face.h1,\n  .copy-tile .face.h1 {\n    font-size: 2.5rem; }\n  .live-tile p.h2,\n  .list-tile p.h2,\n  .copy-tile p.h2,\n  .live-tile .face.h2,\n  .list-tile .face.h2,\n  .copy-tile .face.h2 {\n    font-size: 2rem; }\n  .live-tile p.h3,\n  .list-tile p.h3,\n  .copy-tile p.h3,\n  .live-tile .face.h3,\n  .list-tile .face.h3,\n  .copy-tile .face.h3 {\n    font-size: 1.75rem; }\n  .live-tile p.h4,\n  .list-tile p.h4,\n  .copy-tile p.h4,\n  .live-tile .face.h4,\n  .list-tile .face.h4,\n  .copy-tile .face.h4 {\n    font-size: 1.5rem; }\n  .live-tile p.h5,\n  .list-tile p.h5,\n  .copy-tile p.h5,\n  .live-tile .face.h5,\n  .list-tile .face.h5,\n  .copy-tile .face.h5 {\n    font-size: 1.25rem; }\n  .live-tile p.h6,\n  .list-tile p.h6,\n  .copy-tile p.h6,\n  .live-tile .face.h6,\n  .list-tile .face.h6,\n  .copy-tile .face.h6 {\n    font-size: 1rem; }\n  .live-tile p.value1,\n  .list-tile p.value1,\n  .copy-tile p.value1,\n  .live-tile .face.value1,\n  .list-tile .face.value1,\n  .copy-tile .face.value1 {\n    font-size: 2.5rem; }\n  .live-tile p.value2,\n  .list-tile p.value2,\n  .copy-tile p.value2,\n  .live-tile .face.value2,\n  .list-tile .face.value2,\n  .copy-tile .face.value2 {\n    font-size: 2rem; }\n  .live-tile p.value3,\n  .list-tile p.value3,\n  .copy-tile p.value3,\n  .live-tile .face.value3,\n  .list-tile .face.value3,\n  .copy-tile .face.value3 {\n    font-size: 1.75rem; }\n  .live-tile p.value4,\n  .list-tile p.value4,\n  .copy-tile p.value4,\n  .live-tile .face.value4,\n  .list-tile .face.value4,\n  .copy-tile .face.value4 {\n    font-size: 1.5rem; }\n  .live-tile p.value5,\n  .list-tile p.value5,\n  .copy-tile p.value5,\n  .live-tile .face.value5,\n  .list-tile .face.value5,\n  .copy-tile .face.value5 {\n    font-size: 1.25rem; }\n  .live-tile p.value6,\n  .list-tile p.value6,\n  .copy-tile p.value6,\n  .live-tile .face.value6,\n  .list-tile .face.value6,\n  .copy-tile .face.value6 {\n    font-size: 1rem; }\n\n/***********************/\n/*     Chart Simple    */\n/***********************/\n.widget-chart-simple .widget-body {\n  padding-top: 10px; }\n\n.widget-chart-simple .chart-value {\n  font-size: 24px; }\n\n.widget-chart-simple .chart {\n  margin-top: 20px; }\n\n.jqstooltip {\n  box-sizing: content-box; }\n\n/***********************/\n/*    Chart Changes    */\n/***********************/\n.widget-chart-changes .chart {\n  margin: -15px -20px 0;\n  padding: 15px 0 0; }\n\n.widget-chart-changes .chart-title {\n  margin: 20px 0 0; }\n\n.widget-chart-changes .chart-value, .widget-chart-changes .chart-value-change {\n  padding: 0 20px; }\n\n.widget-chart-changes .chart-value {\n  margin-bottom: 0;\n  font-weight: 700;\n  font-size: 21px;\n  line-height: 1;\n  color: #fff; }\n\n.widget-chart-changes .chart-value-change {\n  color: rgba(255, 255, 255, 0.7);\n  font-size: 85%;\n  margin-bottom: 0.65rem; }\n\n/***********************/\n/*  Chart Stats Simple */\n/***********************/\n.widget-chart-stats-simple > header h1, .widget-chart-stats-simple > header h2, .widget-chart-stats-simple > header h3, .widget-chart-stats-simple > header h4, .widget-chart-stats-simple > header h5, .widget-chart-stats-simple > header h6 {\n  margin-bottom: 0.25rem; }\n\n.widget-chart-stats-simple .chart {\n  height: 200px;\n  margin: 0.5rem -20px -15px; }\n  .widget-chart-stats-simple .chart > .chart-inner {\n    height: 100%; }\n\n/***********************/\n/*      Big Chart      */\n/***********************/\n.widget-big-chart .chart {\n  height: 200px; }\n\n/***********************/\n/*  Part:Chart Stats   */\n/***********************/\n.chart-stats {\n  border-top: 1px solid #eeeeee; }\n\n/***********************/\n/*  Part:Map Controls  */\n/***********************/\n.map-controls {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  border-top: 1px solid #bbb;\n  background-color: #ddd;\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-right-radius: 0.25rem; }\n  .map-controls > .nav-item > .nav-link {\n    border-radius: 0;\n    padding: 0.7143rem 0 0.7143rem 0;\n    color: #555555; }\n    .map-controls > .nav-item > .nav-link:hover {\n      background-color: #eeeeee;\n      color: #555555; }\n  .map-controls > .nav-item.active > .nav-link, .map-controls > .nav-item.active > .nav-link:hover {\n    background-color: #fff;\n    color: #555555;\n    font-weight: 700; }\n  .map-controls > .nav-item:first-child > a {\n    border-bottom-left-radius: 0.25rem; }\n  .map-controls > .nav-item:last-child > a {\n    border-bottom-right-radius: 0.25rem; }\n\n.map svg {\n  height: 100%;\n  width: 100%; }\n\n/***********************************/\n/**          Post Links           **/\n/***********************************/\n.post-links {\n  margin-bottom: 0;\n  font-size: 0.875rem;\n  padding-left: 0; }\n  .post-links::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  .post-links > li {\n    float: left;\n    list-style: none; }\n    .post-links > li + li:before {\n      color: #999;\n      content: \"\\25cf\";\n      padding: 0 8px; }\n    .post-links > li > a {\n      text-decoration: none;\n      color: #999999; }\n      .post-links > li > a:hover {\n        color: #999999; }\n  .post-links.no-separator > li + li {\n    margin-left: 12px; }\n    .post-links.no-separator > li + li:before {\n      content: normal; }\n\n/***********************************/\n/**          Post Comments           **/\n/***********************************/\n.post-comments {\n  font-size: 0.875rem;\n  padding-left: 0; }\n  .post-comments::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  .post-links + .post-comments {\n    margin-top: 0.5rem; }\n  .post-comments > li {\n    padding: 10px;\n    border-top: 1px solid #e7e7e7;\n    list-style: none; }\n    .post-comments > li::after {\n      content: \"\";\n      display: table;\n      clear: both; }\n    .post-comments > li:last-child {\n      padding-bottom: 0; }\n  .post-comments p:last-child {\n    margin-bottom: 0; }\n  .post-comments .avatar {\n    margin-top: 1px; }\n  .post-comments .author {\n    margin-top: 0;\n    margin-bottom: 2px;\n    color: #7ca9dd; }\n  .post-comments .comment-body {\n    overflow: auto; }\n  .post-comments h6.author > small {\n    font-size: 11px; }\n  .widget > footer .post-comments {\n    margin-left: -20px;\n    margin-right: -20px; }\n\n/***********************************/\n/**           Post User           **/\n/***********************************/\n.post-user {\n  position: relative; }\n  .post-user::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  .post-user img {\n    border: 3px solid white; }\n\n/***********************************/\n/**             Tags              **/\n/***********************************/\n.tags {\n  padding-left: 0;\n  list-style: none; }\n  .tags::after {\n    content: \"\";\n    display: table;\n    clear: both; }\n  .tags > li {\n    float: left; }\n    .tags > li > a {\n      padding: 2px 8px;\n      font-size: 13px;\n      border-radius: 6px;\n      border: 1px solid white;\n      color: inherit;\n      text-decoration: none; }\n      .tags > li > a:hover {\n        background-color: rgba(0, 0, 0, 0.1); }\n      .tags > li > a .fa {\n        font-size: 8px;\n        vertical-align: 2px;\n        margin-right: 3px;\n        opacity: .8; }\n    .tags > li + li > a {\n      margin-left: 6px; }\n  .widget-top-overflow > img + .tags {\n    position: absolute;\n    bottom: 0;\n    right: 0;\n    margin: 20px; }\n\n/***********************************/\n/**       Chat List Group         **/\n/***********************************/\n.widget-chat-list-group {\n  padding-top: 0.5rem; }\n  .widget-chat-list-group .list-group-item {\n    margin-left: 20px;\n    margin-right: 20px;\n    padding: 0;\n    border: 0; }\n    .widget-chat-list-group .list-group-item + .list-group-item {\n      margin-top: 30px; }\n    .widget-chat-list-group .list-group-item .thumb,\n    .widget-chat-list-group .list-group-item .thumb-sm {\n      float: left;\n      margin-right: 15px; }\n    .widget-chat-list-group .list-group-item .time {\n      float: right;\n      font-size: 0.875rem;\n      color: #218BC3; }\n    .widget-chat-list-group .list-group-item .sender {\n      margin-top: 5px;\n      margin-bottom: 5px;\n      font-size: 13px;\n      font-weight: 400; }\n    .widget-chat-list-group .list-group-item .body {\n      font-size: 13px;\n      color: #999999; }\n    .widget-chat-list-group .list-group-item.on-right .thumb,\n    .widget-chat-list-group .list-group-item.on-right .thumb-sm {\n      float: right;\n      margin-left: 15px;\n      margin-right: 0; }\n    .widget-chat-list-group .list-group-item.on-right .time {\n      float: left; }\n    .widget-chat-list-group .list-group-item.on-right .sender {\n      text-align: right; }\n\n/***********************************/\n/**           Weather             **/\n/***********************************/\n.widget-image .forecast {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin-bottom: 5px;\n  padding-left: 15px;\n  padding-right: 15px;\n  text-align: center; }\n"

/***/ }

});
//# sourceMappingURL=14.map