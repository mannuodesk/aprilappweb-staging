webpackJsonpac__name_([1],{

/***/ "./node_modules/angular2-localstorage/LocalStorageEmitter.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var core_2 = __webpack_require__("./node_modules/@angular/core/index.js");
var LocalStorageEmitter = (function () {
    function LocalStorageEmitter() {
    }
    LocalStorageEmitter.register = function (ngZone) {
        var index = LocalStorageEmitter.ngZones.indexOf(ngZone);
        if (index === -1) {
            index = LocalStorageEmitter.ngZones.push(ngZone) - 1;
        }
        LocalStorageEmitter.subscribed[index] = ngZone.onMicrotaskEmpty.subscribe(function () {
            for (var _i = 0, _a = LocalStorageEmitter.subscribers; _i < _a.length; _i++) {
                var callback = _a[_i];
                callback();
            }
        });
    };
    LocalStorageEmitter.subscribe = function (callback) {
        LocalStorageEmitter.subscribers.push(callback);
    };
    LocalStorageEmitter.unregister = function (ngZone) {
        var index = LocalStorageEmitter.ngZones.indexOf(ngZone);
        if (index >= 0) {
            LocalStorageEmitter.subscribed[index].unsubscribe();
        }
    };
    LocalStorageEmitter.subscribed = [];
    LocalStorageEmitter.ngZones = [];
    LocalStorageEmitter.subscribers = [];
    return LocalStorageEmitter;
}());
exports.LocalStorageEmitter = LocalStorageEmitter;
var LocalStorageService = (function () {
    function LocalStorageService(ngZone) {
        this.ngZone = ngZone;
        LocalStorageEmitter.register(this.ngZone);
    }
    LocalStorageService.prototype.ngOnDestroy = function () {
        LocalStorageEmitter.unregister(this.ngZone);
    };
    LocalStorageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_2.NgZone !== 'undefined' && core_2.NgZone) === 'function' && _a) || Object])
    ], LocalStorageService);
    return LocalStorageService;
    var _a;
}());
exports.LocalStorageService = LocalStorageService;
function LocalStorageSubscriber(appPromise) {
    appPromise.then(function (bla) {
        bla.injector.get(LocalStorageService);
    });
}
exports.LocalStorageSubscriber = LocalStorageSubscriber;


/***/ },

/***/ "./node_modules/angular2-localstorage/WebStorage.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var LocalStorageEmitter_1 = __webpack_require__("./node_modules/angular2-localstorage/LocalStorageEmitter.ts");
function LocalStorage(storageKey) {
    return WebStorage(storageKey, localStorage);
}
exports.LocalStorage = LocalStorage;
function SessionStorage(storageKey) {
    return WebStorage(storageKey, sessionStorage);
}
exports.SessionStorage = SessionStorage;
function WebStorage(storageKey, webStorage) {
    return function (target, decoratedPropertyName) {
        if (!webStorage) {
            return;
        }
        if (!storageKey) {
            storageKey = "" + "/" + decoratedPropertyName;
        }
        Object.defineProperty(target, "_" + decoratedPropertyName + "_mapped", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: false
        });
        var instances = [];
        var values = {};
        var storageValue = webStorage.getItem(storageKey) || null;
        var storageValueJSON = storageValue;
        if ("string" === typeof storageValue) {
            try {
                storageValue = JSON.parse(storageValue);
            }
            catch (e) {
                storageValue = null;
                storageValueJSON = "null";
            }
        }
        var oldJSONValues = {};
        Object.defineProperty(target, decoratedPropertyName, {
            get: function () {
                if (false === this["_" + decoratedPropertyName + "_mapped"]) {
                    this["_" + decoratedPropertyName + "_mapped"] = instances.length;
                    // first registration triggers a setting to localStorage value
                    values[instances.length] = storageValue;
                    oldJSONValues[instances.length] = storageValueJSON;
                    instances.push(this);
                }
                return values[this["_" + decoratedPropertyName + "_mapped"]];
            },
            set: function (newValue) {
                if (false === this["_" + decoratedPropertyName + "_mapped"]) {
                    this["_" + decoratedPropertyName + "_mapped"] = instances.length;
                    // first registration triggers a setting to localStorage value
                    values[instances.length] = storageValue;
                    oldJSONValues[instances.length] = storageValueJSON;
                    instances.push(this);
                    // first "set" call is ignored if we have already a value from the localStorage
                    if (storageValue) {
                        return;
                    }
                }
                values[this["_" + decoratedPropertyName + "_mapped"]] = newValue;
            },
            enumerable: true,
            configurable: true
        });
        LocalStorageEmitter_1.LocalStorageEmitter.subscribe(function () {
            for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                var instance = instances_1[_i];
                var currentValue = JSON.stringify(instance[decoratedPropertyName]);
                var oldJSONValue = oldJSONValues[instance["_" + decoratedPropertyName + "_mapped"]];
                if (currentValue !== oldJSONValue) {
                    oldJSONValues[instance["_" + decoratedPropertyName + "_mapped"]] = currentValue;
                    webStorage.setItem(storageKey, currentValue);
                }
            }
        });
    };
}


/***/ },

/***/ "./src/app/login/login.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var core_2 = __webpack_require__("./node_modules/@angular/core/index.js");
var UsersService_1 = __webpack_require__("./src/app/services/UsersService.ts");
var LocalStorageEmitter_1 = __webpack_require__("./node_modules/angular2-localstorage/LocalStorageEmitter.ts");
var WebStorage_1 = __webpack_require__("./node_modules/angular2-localstorage/WebStorage.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var Login = (function () {
    function Login(_userService, storageService, router) {
        this._userService = _userService;
        this.Email = "";
        console.log(this.userId);
        this.router = router;
    }
    Login.prototype.onKey = function (event) {
        var _this = this;
        if (event.keyCode == 13) {
            jQuery('#wrongLogin').hide();
            jQuery('#enterEmail').hide();
            jQuery('#enterPassword').hide();
            if (this.Email == "") {
                jQuery('#enterEmail').show();
            }
            if (this.Password == "" || this.Password === undefined) {
                jQuery('#enterPassword').show();
            }
            if (this.Email != "" && this.Password != "") {
                jQuery('#loader').show();
                jQuery('#btns').hide();
                this._userService.authenticateAdminUser(this.Email, this.Password).subscribe(function (a) {
                    console.log(a);
                    if (a.code == 200) {
                        console.log(a.message);
                        _this.userId = a.data;
                        sessionStorage.setItem('userId', a.data);
                        //navigation
                        _this.router.navigate(['/app/dashboard']);
                        jQuery('#btns').show();
                        jQuery('#loader').hide();
                    }
                    else {
                        jQuery('#btns').show();
                        jQuery('#loader').hide();
                        jQuery('#wrongLogin').show();
                        console.log(a.message);
                    }
                });
            }
        }
    };
    Login.prototype.onSubmit = function () {
        var _this = this;
        jQuery('#wrongLogin').hide();
        jQuery('#enterEmail').hide();
        jQuery('#enterPassword').hide();
        if (this.Email == "") {
            jQuery('#enterEmail').show();
        }
        if (this.Password == "" || this.Password === undefined) {
            jQuery('#enterPassword').show();
        }
        if (this.Email != "" && this.Password != "") {
            jQuery('#loader').show();
            jQuery('#btns').hide();
            this._userService.authenticateAdminUser(this.Email, this.Password).subscribe(function (a) {
                console.log(a);
                if (a.code == 200) {
                    console.log(a.data);
                    _this.userId = a.data;
                    sessionStorage.setItem('userId', a.data);
                    //navigation
                    _this.router.navigate(['/app/dashboard']);
                    jQuery('#btns').show();
                    jQuery('#loader').hide();
                }
                else {
                    jQuery('#btns').show();
                    jQuery('#loader').hide();
                    jQuery('#wrongLogin').show();
                    console.log(a.message);
                }
            });
        }
    };
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], Login.prototype, "Email", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', String)
    ], Login.prototype, "Password", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', String)
    ], Login.prototype, "userId", void 0);
    Login = __decorate([
        core_1.Component({
            selector: 'login',
            styles: [__webpack_require__("./src/app/login/login.style.scss")],
            template: __webpack_require__("./src/app/login/login.template.html"),
            providers: [UsersService_1.UsersService, LocalStorageEmitter_1.LocalStorageService],
            encapsulation: core_1.ViewEncapsulation.None,
            host: {
                class: 'login-page app'
            }
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof UsersService_1.UsersService !== 'undefined' && UsersService_1.UsersService) === 'function' && _a) || Object, (typeof (_b = typeof LocalStorageEmitter_1.LocalStorageService !== 'undefined' && LocalStorageEmitter_1.LocalStorageService) === 'function' && _b) || Object, (typeof (_c = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _c) || Object])
    ], Login);
    return Login;
    var _a, _b, _c;
}());
exports.Login = Login;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/login/login.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
//import {Ng2Webstorage} from 'ng2-webstorage';
var login_component_1 = __webpack_require__("./src/app/login/login.component.ts");
exports.routes = [
    { path: '', component: login_component_1.Login, pathMatch: 'full' }
];
var LoginModule = (function () {
    function LoginModule() {
    }
    LoginModule.routes = exports.routes;
    LoginModule = __decorate([
        core_1.NgModule({
            declarations: [
                login_component_1.Login
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule.forChild(exports.routes)
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginModule);
    return LoginModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginModule;


/***/ },

/***/ "./src/app/login/login.style.scss":
/***/ function(module, exports) {

module.exports = "/***********************************/\n/**             LOGIN             **/\n/***********************************/\n.login-page {\n  background-color: #ddd; }\n\n.login-page .page-footer {\n  margin-bottom: 25px;\n  font-size: 13px;\n  color: #818a91;\n  text-align: center; }\n  @media (min-height: 600px) {\n    .login-page .page-footer {\n      position: absolute;\n      bottom: 0;\n      left: 0;\n      right: 0; } }\n\n.widget-login-container {\n  padding-top: 10%; }\n\n.widget-login-logo {\n  margin-top: 15px;\n  margin-bottom: 15px;\n  text-align: center;\n  font-weight: 400; }\n  .widget-login-logo .fa-circle {\n    font-size: 13px;\n    margin: 0 20px; }\n\n.widget-login {\n  padding: 30px; }\n  .widget-login > header h1, .widget-login > header h2, .widget-login > header h3, .widget-login > header h4, .widget-login > header h5, .widget-login > header h6 {\n    font-weight: 400;\n    text-align: center; }\n\n.widget-login-info {\n  font-size: 13px;\n  color: #888;\n  margin-top: 1px;\n  margin-bottom: 0;\n  text-align: center; }\n  .widget-login-info.abc-checkbox {\n    margin-left: -25px; }\n\n.login-form .form-control {\n  font-size: 13px;\n  border: none;\n  background-color: #eceeef; }\n  .login-form .form-control:focus {\n    background-color: #ddd; }\n"

/***/ },

/***/ "./src/app/login/login.template.html":
/***/ function(module, exports) {

module.exports = "<div class=\"container\">\r\n  <main id=\"content\" class=\"widget-login-container\" role=\"main\">\r\n    <div class=\"row\">\r\n      <div class=\"col-xl-4 col-md-6 col-xs-10 offset-xl-4 offset-md-3 offset-xs-1\">\r\n        <h5 class=\"widget-login-logo animated fadeInUp\">\r\n          <i class=\"fa fa-circle text-gray\"></i>\r\n          april\r\n          <i class=\"fa fa-circle text-warning\"></i>\r\n        </h5>\r\n        <section class=\"widget widget-login animated fadeInUp\">\r\n          <header>\r\n            <h3>Login to your April App</h3>\r\n          </header>\r\n          <div class=\"widget-body\">\r\n            <p class=\"widget-login-info\">\r\n              Use Facebook, Twitter or your email to sign in.\r\n            </p>\r\n            <p class=\"widget-login-info\">\r\n              Don't have an account? Sign up now!\r\n            </p>\r\n            <form class=\"login-form mt-lg\">\r\n              <div class=\"form-group\">\r\n                <input type=\"text\" [(ngModel)]=\"Email\" name=\"Email\" class=\"form-control\" id=\"exampleInputEmail1\" placeholder=\"Username\">\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <input [(ngModel)]=\"Password\" name=\"Password\" (keyup)=\"onKey($event)\" class=\"form-control\" id=\"pswd\" type=\"password\" placeholder=\"Password\">\r\n              </div>\r\n              <div id=\"wrongLogin\" style=\"display:none\" class=\"form-group\">\r\n                <div class=\"alert alert-danger alert-sm\">\r\n                  <span class=\"fw-semi-bold\">Danger:</span> Invalid User Name or Password.\r\n                </div>\r\n              </div>\r\n              <div id=\"enterEmail\" style=\"display:none\" class=\"form-group\">\r\n                <div class=\"alert alert-warning alert-sm\">\r\n                  <span class=\"fw-semi-bold\">Warning:</span> Please Enter Email.\r\n                </div>\r\n              </div>\r\n              <div id=\"enterPassword\" style=\"display:none\" class=\"form-group\">\r\n                <div class=\"alert alert-warning alert-sm\">\r\n                  <span class=\"fw-semi-bold\">Warning:</span> Please Enter Password.\r\n                </div>\r\n              </div>\r\n              <div id=\"btns\" class=\"clearfix\">\r\n                <div class=\"btn-toolbar pull-xs-right m-t-1\">\r\n                  <button type=\"button\" class=\"btn btn-secondary btn-sm\">Create an Account</button>\r\n                  <a (click)=\"onSubmit()\" class=\"btn btn-inverse btn-sm\" style=\"color:white;\">Login</a>\r\n                </div>\r\n              </div>\r\n              <div id=\"loader\" class=\"clearfix\" style=\"text-align: center;display: none\">\r\n                <i class=\"fa fa-spinner fa-spin\" style=\"font-size:24px\"></i>\r\n              </div>\r\n              <div class=\"row m-t-1\">\r\n                <div class=\"col-md-6 push-md-6\">\r\n                  <div class=\"clearfix\">\r\n                    <div class=\"abc-checkbox widget-login-info pull-xs-right\">\r\n                      <input type=\"checkbox\" id=\"checkbox1\" value=\"1\">\r\n                      <label for=\"checkbox1\">Keep me signed in </label>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n\r\n                <div class=\"col-md-6 pull-md-6\">\r\n                  <a class=\"mr-n-lg\" href=\"#\">Trouble with account?</a>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </section>\r\n      </div>\r\n    </div>\r\n  </main>\r\n  <footer class=\"page-footer\">\r\n    2016 &copy; nDever\r\n  </footer>\r\n</div>\r\n"

/***/ },

/***/ "./src/app/services/UsersService.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
var UsersService = (function () {
    //baseUrl:string = "http://localhost/";
    function UsersService(http) {
        this.http = http;
        this.baseUrl = "https://aprilappserver.azurewebsites.net/";
    }
    UsersService.prototype.getUsers = function () {
        return this.http.get(this.baseUrl + 'users/getAllUsers')
            .map(function (res) { return res.json(); });
    };
    UsersService.prototype.getUsersStats = function () {
        return this.http.get(this.baseUrl + 'users/dashboardStats')
            .map(function (res) { return res.json(); });
    };
    UsersService.prototype.getGenderGraphData = function () {
        return this.http.get(this.baseUrl + 'users/dashboardGenderStats')
            .map(function (res) { return res.json(); });
    };
    UsersService.prototype.authenticateAdminUser = function (email, password) {
        var body = JSON.stringify({ "email": email, "password": password });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "users/adminUserLogin", body, options)
            .map(function (res) { return res.json(); });
    };
    UsersService.prototype.getAdminData = function (Id) {
        var body = JSON.stringify({ "userId": Id });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        return this.http.post(this.baseUrl + "users/getAdminUser", body, options)
            .map(function (res) { return res.json(); });
    };
    UsersService.prototype.deleteUsers = function (Id) {
        return this.http.get(this.baseUrl + 'users/deleteUser/' + Id)
            .map(function (res) { return res.json(); });
    };
    UsersService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], UsersService);
    return UsersService;
    var _a;
}());
exports.UsersService = UsersService;


/***/ }

});
//# sourceMappingURL=1.map