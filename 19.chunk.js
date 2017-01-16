webpackJsonpac__name_([19],{

/***/ "./src/app/inbox/inbox.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Inbox = (function () {
    function Inbox(el) {
        this.mailListShow = true;
        this.mailFormShow = false;
        this.mailDetailShow = false;
        this.currentFolderName = 'Inbox';
        this.$el = jQuery(el.nativeElement);
        this.initMailboxAppDemo(this.$el);
    }
    Inbox.prototype.handleComposeBtn = function (event) {
        this.repliedMessage = event || undefined;
        this.changeEmailComponents('mailForm');
    };
    Inbox.prototype.onReplyMail = function (mail) {
        this.currentMail = mail;
        this.changeEmailComponents('mailDetail');
    };
    Inbox.prototype.changeEmailComponents = function (componentName) {
        var mailState = {
            'mailList': function (that) {
                that.mailFormShow = that.mailDetailShow = false;
                that.mailListShow = true;
            },
            'mailForm': function (that) {
                that.mailListShow = that.mailDetailShow = false;
                that.mailFormShow = true;
            },
            'mailDetail': function (that) {
                that.mailListShow = that.mailFormShow = false;
                that.mailDetailShow = true;
            },
        };
        mailState[componentName](this);
    };
    Inbox.prototype.setFolderName = function (folderName) {
        this.currentFolderName = folderName;
        if (!this.mailListShow) {
            this.changeEmailComponents('mailList');
        }
    };
    /* tslint:disable */
    Inbox.prototype.initMailboxAppDemo = function ($el) {
        var showAlert = function () {
            $el.find('#app-alert')
                .removeClass('hide')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                jQuery(this).removeClass('animated bounceInLeft');
            });
        };
        setTimeout(function () { return showAlert(); }, 3000);
    };
    /* tslint:enable */
    Inbox.prototype.changeActiveItem = function () {
        this.$el.find('.nav a').on('click', function () {
            jQuery('.nav').find('.active').removeClass('active');
            jQuery(this).parent().addClass('active');
        });
    };
    Inbox.prototype.ngOnInit = function () {
        this.changeActiveItem();
    };
    Inbox = __decorate([
        core_1.Component({
            selector: 'inbox',
            template: __webpack_require__("./src/app/inbox/inbox.template.html"),
            styles: [__webpack_require__("./src/app/inbox/inbox.style.scss")]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], Inbox);
    return Inbox;
    var _a;
}());
exports.Inbox = Inbox;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/inbox/inbox.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var inbox_component_1 = __webpack_require__("./src/app/inbox/inbox.component.ts");
var mail_list_component_1 = __webpack_require__("./src/app/inbox/mail-list/mail-list.component.ts");
var mail_form_component_1 = __webpack_require__("./src/app/inbox/mail-form/mail-form.component.ts");
var mail_detail_component_1 = __webpack_require__("./src/app/inbox/mail-detail/mail-detail.component.ts");
var search_pipe_1 = __webpack_require__("./src/app/inbox/mail-list/pipes/search-pipe.ts");
var folders_pipe_1 = __webpack_require__("./src/app/inbox/mail-list/pipes/folders-pipe.ts");
exports.routes = [
    { path: '', component: inbox_component_1.Inbox, pathMatch: 'full' }
];
var InboxModule = (function () {
    function InboxModule() {
    }
    InboxModule.routes = exports.routes;
    InboxModule = __decorate([
        core_1.NgModule({
            imports: [
                forms_1.FormsModule,
                common_1.CommonModule,
                router_1.RouterModule.forChild(exports.routes)],
            declarations: [
                inbox_component_1.Inbox,
                mail_list_component_1.MailList,
                mail_form_component_1.MailForm,
                mail_detail_component_1.MailDetail,
                folders_pipe_1.FoldersPipe,
                search_pipe_1.SearchPipe
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], InboxModule);
    return InboxModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InboxModule;


/***/ },

/***/ "./src/app/inbox/inbox.style.scss":
/***/ function(module, exports) {

module.exports = ".nav-email-folders > li > .nav-link {\n  padding-top: 10px;\n  padding-bottom: 10px;\n  border-radius: 0.25rem;\n  color: #777;\n  font-weight: 400; }\n  .nav-email-folders > li > .nav-link:hover {\n    background-color: #e5e5e5;\n    color: #55595c; }\n  .nav-email-folders > li > .nav-link > .fa-circle {\n    margin-top: 3px; }\n\n.nav-email-folders > li > .nav-link > .label {\n  padding-top: 5px;\n  padding-bottom: 5px; }\n\n.nav-email-folders > li.active > .nav-link, .nav-email-folders > li.active > .nav-link:hover, .nav-email-folders > li.active > .nav-link:focus {\n  background-color: #ddd;\n  color: #55595c;\n  font-weight: 600; }\n  .nav-email-folders > li.active > .nav-link > .label, .nav-email-folders > li.active > .nav-link:hover > .label, .nav-email-folders > li.active > .nav-link:focus > .label {\n    color: #55595c;\n    background-color: #fff; }\n\n.nav-email-folders .tag-white {\n  color: #555; }\n"

/***/ },

/***/ "./src/app/inbox/inbox.template.html":
/***/ function(module, exports) {

module.exports = "<ol class=\"breadcrumb\">\r\n  <li class=\"breadcrumb-item\">YOU ARE HERE</li>\r\n  <li class=\"breadcrumb-item active\">Email</li>\r\n</ol>\r\n<div class=\"alert alert-warning alert-sm pull-right no-margin animated bounceInLeft hide\" id=\"app-alert\">\r\n  <button type=\"button\" class=\"ml-lg close\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button>\r\n  Hey! This is a <span class=\"fw-semi-bold\">real app</span> with CRUD and Search functions. Have fun!\r\n</div>\r\n<h1 class=\"page-title\">Email - <span class=\"fw-semi-bold\">Inbox</span></h1>\r\n<div class=\"row\">\r\n  <div class=\"col-lg-3 col-xl-2 col-xs-12\">\r\n    <a class=\"btn btn-danger btn-block\" href=\"#\" id=\"compose-btn\" (click)=\"handleComposeBtn()\">Compose</a>\r\n    <ul class=\"nav nav-pills nav-stacked nav-email-folders mt\" id=\"folders-list\">\r\n      <li class=\"nav-item active\">\r\n        <a class=\"nav-link\" (click)=\"setFolderName('Inbox')\">\r\n          <span class=\"tag tag-pill tag-white pull-xs-right\">2</span>\r\n          Inbox\r\n        </a>\r\n      </li>\r\n      <li class=\"nav-item\"><a class=\"nav-link\" (click)=\"setFolderName('Starred')\">Starred</a></li>\r\n      <li class=\"nav-item\"><a class=\"nav-link\" (click)=\"setFolderName('Sent Mail')\">Sent Mail</a></li>\r\n      <li class=\"nav-item\">\r\n        <a class=\"nav-link\" (click)=\"setFolderName('Draft')\">\r\n          <span class=\"tag tag-pill tag-danger pull-xs-right\">3</span>\r\n          Draft\r\n        </a>\r\n      </li>\r\n      <li class=\"nav-item\"><a class=\"nav-link\" (click)=\"setFolderName('Trash')\">Trash</a></li>\r\n    </ul>\r\n    <h6 class=\"mt\">QUICK VIEW</h6>\r\n    <ul class=\"nav nav-pills nav-stacked nav-email-folders mb-lg fs-mini\">\r\n      <li class=\"nav-item\"><a class=\"nav-link\" href=\"#\"><i class=\"fa fa-circle text-danger pull-xs-right\"></i> Work </a></li>\r\n      <li class=\"nav-item\"><a class=\"nav-link\" href=\"#\"><i class=\"fa fa-circle text-white pull-xs-right\"></i> Private </a></li>\r\n      <li class=\"nav-item\"><a class=\"nav-link\" href=\"#\"><i class=\"fa fa-circle text-gray-light pull-xs-right\"></i> Saved </a></li>\r\n    </ul>\r\n  </div>\r\n  <div *ngIf=\"mailListShow\" mail-list [folderName]=\"currentFolderName\" (replyMail)=\"onReplyMail($event)\" class=\"col-lg-9 col-xl-10 col-xs-12\"></div>\r\n  <div *ngIf=\"mailFormShow\" mail-form (backToMailList)=\"changeEmailComponents('mailList')\" [message]=\"repliedMessage\" class=\"col-lg-9 col-xl-10 col-xs-12\"></div>\r\n  <div *ngIf=\"mailDetailShow\" mail-detail [mail]=\"currentMail\" (replyMessage)=\"handleComposeBtn($event)\" (backToMailList)=\"changeEmailComponents('mailList')\" class=\"col-lg-9 col-xl-10 col-xs-12\"></div>\r\n</div>\r\n"

/***/ },

/***/ "./src/app/inbox/mail-detail/mail-detail.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var MailDetail = (function () {
    function MailDetail() {
        this.backToMailList = new core_1.EventEmitter();
        this.replyMessage = new core_1.EventEmitter();
        this.math = Math;
    }
    MailDetail.prototype.onToBack = function () {
        this.backToMailList.emit('');
    };
    MailDetail.prototype.goToReply = function (mail) {
        this.replyMessage.emit(mail);
    };
    MailDetail.prototype.Math = function () {
        return Math.random();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MailDetail.prototype, "mail", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MailDetail.prototype, "backToMailList", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MailDetail.prototype, "replyMessage", void 0);
    MailDetail = __decorate([
        core_1.Component({
            selector: '[mail-detail]',
            template: __webpack_require__("./src/app/inbox/mail-detail/mail-detail.template.html"),
            styles: [__webpack_require__("./src/app/inbox/mail-detail/mail-detail.style.scss")]
        }), 
        __metadata('design:paramtypes', [])
    ], MailDetail);
    return MailDetail;
}());
exports.MailDetail = MailDetail;


/***/ },

/***/ "./src/app/inbox/mail-detail/mail-detail.style.scss":
/***/ function(module, exports) {

module.exports = ".email-view hr {\n  margin: 5px 0; }\n\n.email-view .email-body {\n  margin-top: 1rem; }\n\n.email-details img {\n  width: 30px;\n  height: 30px;\n  float: left; }\n\n.email-details-content::after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n.email-details-content .email {\n  color: #999999;\n  font-size: 13px; }\n\n.email-details-content .receiver {\n  display: block;\n  color: #999999;\n  margin-top: -6px; }\n\n.email-details-content .email-date {\n  margin-right: 10px;\n  line-height: 28px;\n  vertical-align: middle; }\n\n.email-attachments .attachment img {\n  display: block; }\n\n.email-attachments .attachment .title {\n  margin: 0;\n  font-weight: bold; }\n"

/***/ },

/***/ "./src/app/inbox/mail-detail/mail-detail.template.html":
/***/ function(module, exports) {

module.exports = "<div class=\"clearfix mb-xs\">\r\n  <a class=\"btn btn-default btn-sm width-50 pull-xs-left\" id=\"back-btn\" (click)=\"onToBack()\">\r\n    <i class=\"fa fa-angle-left fa-lg\"></i>\r\n  </a>\r\n</div>\r\n<section class=\"widget widget-email\">\r\n  <header>\r\n    <h4>{{mail.subject}}</h4>\r\n    <div class=\"widget-controls\">\r\n      <a href=\"#\"><i class=\"fa fa-print\"></i></a>\r\n    </div>\r\n  </header>\r\n  <div class=\"widget-body\">\r\n    <div id=\"email-view\" class=\"email-view\">\r\n      <div class=\"email-details clearfix\">\r\n        <div class=\"email-details-content\">\r\n          <span class=\"thumb thumb-sm pull-xs-left\">\r\n            <img class=\"img-circle\" src=\"assets/img/people/a5.jpg\" alt=\"Philip Horbacheuski\">\r\n          </span>\r\n          <div class=\"pull-xs-left\">\r\n            <strong>{{mail.sender}}</strong>\r\n            <span *ngIf=\"mail.senderMail\" class=\"email\">&lt;{{mail.senderMail}}&gt;</span>\r\n            <span class=\"receiver\">to Wrapbootstrap</span>\r\n          </div>\r\n          <div class=\"email-actions pull-xs-right\">\r\n            <div class=\"btn-group\">\r\n              <button id=\"email-opened-reply\" class=\"btn btn-sm btn-gray\" (click)=\"goToReply(mail)\">\r\n                <i class=\"fa fa-reply\"></i> Reply\r\n              </button>\r\n              <button class=\"btn btn-sm btn-gray dropdown-toggle\" data-toggle=\"dropdown\">\r\n                <i class=\"fa fa-angle-down\"></i>\r\n              </button>\r\n              <ul class=\"dropdown-menu pull-xs-right\">\r\n                <li><a class=\"dropdown-item\" href=\"#\"><i class=\"fa fa-reply reply-btn\"></i> Reply</a></li>\r\n                <li><a class=\"dropdown-item\" href=\"#\"><i class=\"fa fa-arrow-right reply-btn\"></i> Forward</a></li>\r\n                <li><a class=\"dropdown-item\" href=\"#\"><i class=\"fa fa-print\"></i> Print</a></li>\r\n                <li class=\"dropdown-divider\"></li>\r\n                <li><a class=\"dropdown-item\" href=\"#\"><i class=\"fa fa-ban\"></i> Spam</a></li>\r\n                <li><a class=\"dropdown-item\" href=\"#\"><i class=\"glyphicon glyphicon-trash\"></i> Delete</a></li>\r\n              </ul>\r\n            </div>\r\n          </div>\r\n          <time class=\"email-date pull-xs-right\">\r\n            0:30\r\n          </time>\r\n        </div>\r\n      </div>\r\n      <div class=\"email-body\">\r\n        <div class=\"email-body\" [innerHTML]=\"mail.body\"></div>\r\n      </div>\r\n      <div *ngIf=\"!mail.body\" class=\"email-body\">\r\n        {{mail.subject}}\r\n      </div>\r\n      <div class=\"email-attachments\">\r\n        <div class=\"row\">\r\n          <div class=\"col-sm-6\">\r\n            <hr *ngIf=\"mail.attachments\">\r\n            <p  *ngIf=\"mail.attachments\" class=\"details\"><strong>{{mail.attachments.length}} attachments</strong> &nbsp;-&nbsp; <a href=\"#\">Download all attachments</a>\r\n              &nbsp;&nbsp;&nbsp;<a href=\"#\">View all Images</a></p>\r\n            <section *ngFor=\"let attachment of mail.attachments; let i = index\" class=\"attachment\">\r\n              <img class=\"img-fluid\" src=\"{{attachment}}\" alt=\"\">\r\n              <h5 class=\"title\">some-cool-image{{i + 1}}.jpg</h5>\r\n              <p class=\"details\">\r\n                568K  &nbsp;&nbsp;\r\n                <a href=\"#\">View</a> &nbsp;&nbsp;\r\n                <a href=\"#\">Download</a>\r\n              </p>\r\n            </section>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n"

/***/ },

/***/ "./src/app/inbox/mail-form/mail-form.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var core_2 = __webpack_require__("./node_modules/@angular/core/index.js");
var core_3 = __webpack_require__("./node_modules/@angular/core/index.js");
var MailForm = (function () {
    function MailForm() {
        this.backToMailList = new core_3.EventEmitter();
        this.sender = '';
        this.subject = '';
        this.body = 'There are no implementations' +
            ' of Wysiwyg editors in Angular 2 version yet.' +
            ' So we hope it will appear soon.';
    }
    MailForm.prototype.onToBack = function () {
        console.log('qwerty');
        this.backToMailList.emit('');
    };
    MailForm.prototype.ngOnInit = function () {
        if (this.message) {
            this.sender = this.message.sender;
            this.subject = 'Re: ' + this.message.subject;
            var span = document.createElement('span');
            span.innerHTML = this.message.body;
            this.body = span.innerText;
        }
    };
    __decorate([
        core_2.Output(), 
        __metadata('design:type', Object)
    ], MailForm.prototype, "backToMailList", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Object)
    ], MailForm.prototype, "message", void 0);
    MailForm = __decorate([
        core_1.Component({
            selector: '[mail-form]',
            template: __webpack_require__("./src/app/inbox/mail-form/mail-form.template.html"),
        }), 
        __metadata('design:paramtypes', [])
    ], MailForm);
    return MailForm;
}());
exports.MailForm = MailForm;


/***/ },

/***/ "./src/app/inbox/mail-form/mail-form.template.html":
/***/ function(module, exports) {

module.exports = "<div class=\"clearfix mb-xs\">\r\n  <a class=\"btn btn-secondary btn-sm width-50 pull-xs-left\" id=\"back-btn\" (click)=\"onToBack()\">\r\n    <i class=\"fa fa-angle-left fa-lg\"></i>\r\n  </a>\r\n</div>\r\n<section class=\"widget widget-email\">\r\n  <header id=\"widget-email-header\">\r\n    <h4>Compose <span class=\"fw-semi-bold\">New</span></h4>\r\n  </header>\r\n  <div class=\"widget-body\" id=\"mailbox-content\">\r\n    <div class=\"compose-view\" id=\"compose-view\">\r\n      <form id=\"email-compose\" class=\"form-email-compose\" method=\"get\" action=\"#\">\r\n        <div class=\"form-group\">\r\n          <input type=\"email\" id=\"input-to\" placeholder=\"To\" [(ngModel)]=\"sender\" name=\"sender\" class=\"input-transparent form-control\">\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <input type=\"text\" id=\"input-subject\" placeholder=\"Subject\" [(ngModel)]=\"subject\"  name=\"subject\" class=\"input-transparent form-control\">\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <textarea rows=\"10\" class=\"form-control\" id=\"wysiwyg\" placeholder=\"Message\">{{ body }}</textarea>\r\n        </div>\r\n        <div class=\"clearfix\">\r\n          <div class=\"btn-toolbar pull-right\">\r\n            <button type=\"reset\" id=\"compose-discard-button\" class=\"btn btn-gray\">Discard</button>\r\n            <button type=\"button\" id=\"compose-save-button\" class=\"btn btn-gray\">&nbsp;&nbsp;Save&nbsp;&nbsp;</button>\r\n            <button type=\"submit\" id=\"compose-send-button\" class=\"btn btn-danger\">&nbsp;&nbsp;&nbsp;Send&nbsp;&nbsp;&nbsp;</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n</section>\r\n"

/***/ },

/***/ "./src/app/inbox/mail-list/mail-list.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var core_2 = __webpack_require__("./node_modules/@angular/core/index.js");
var core_3 = __webpack_require__("./node_modules/@angular/core/index.js");
var MAILS = [
    { id: 1,
        'sender': 'Philip Horbacheuski',
        'senderMail': 'philip.horbacheuski@example.com',
        'subject': 'Hi, Welcome to Google Mail',
        'date': '18:31',
        'paperclip': true,
        'attachment': true,
        'unread': true,
        'starred': true,
        'folderId': 1,
        'selected': false,
        'attachments': ['assets/img/pictures/1.jpg', 'assets/img/pictures/2.jpg'],
        'body': '<p>Projecting surrounded literature ' +
            'yet delightful alteration but bed men. Open are' +
            ' from long why cold. If must snug by upon sang ' +
            'loud left. As me do preference entreaties compliment ' +
            'motionless ye literature. Day behaviour explained law' +
            ' remainder.</p>    <p><strong>On then sake' +
            ' home</strong> is am leaf. Of suspicion do' +
            ' departure at extremely he believing. Do know ' +
            'said mind do rent they oh hope of. General enquire' +
            ' picture letters garrets on offices of no on.</p>' +
            ' <p>All the best,</p> <p>Vitaut the Great, CEO,' +
            ' <br>Fooby Inc.</p>' },
    { 'id': 2,
        'sender': 'StackExchange',
        'subject': 'New Python questions for this week!',
        'date': 'Aug 14',
        'paperclip': true,
        'unread': true,
        'attachment': true,
        'timestamp': 1376508566000,
        'folderId': 1,
        'selected': false,
        'attachments': ['assets/img/pictures/3.jpg'],
        'body': '<h1>THIS IS HTML!!!!</h1>' },
    { 'id': 3,
        'sender': 'notifications@facebook.com',
        'senderMail': 'notifications@facebook.com',
        'subject': 'Someone just commented on your photo!',
        'date': 'Aug 7',
        'selected': false,
        'unread': false,
        'timestamp': 1375877213000,
        'folderId': 1 },
    { 'id': 4,
        'sender': 'Twitter',
        'subject': '@hackernews is now following you on Twitter',
        'date': 'Jul 31',
        'starred': true,
        'unread': true,
        'selected': false,
        'timestamp': 1375261974000,
        'folderId': 1 },
    { 'id': 5,
        'sender': 'LinkedIn',
        'subject': 'Jobs you may be interested in',
        'date': 'May 12',
        'selected': false,
        'unread': false,
        'timestamp': 1373634231000,
        'folderId': 1 },
    { 'id': 6,
        'sender': 'Naevius Victorsson',
        'subject': 'Front no party young abode state up',
        'date': 'May 1',
        'starred': true,
        'unread': false,
        'selected': false,
        'timestamp': 1373516566000,
        'folderId': 1 },
    { 'id': 7,
        'sender': 'Nikola Foley',
        'subject': 'Quiet led own cause three him',
        'date': 'Apr 23',
        'paperclip': true,
        'attachment': true,
        'attachments': ['assets/img/pictures/5.jpg', 'assets/img/pictures/4.jpg'],
        'unread': false,
        'selected': false,
        'timestamp': 1374508566000,
        'folderId': 1 },
    { 'id': 8,
        'sender': 'Ernst Hardy',
        'subject': 'Raising say express had chiefly detract demands she',
        'date': 'Apr 20',
        'selected': false,
        'unread': false,
        'timestamp': 1373877213000,
        'folderId': 1 },
    { 'id': 9,
        'sender': 'Lubbert Fuller',
        'subject': 'Civility vicinity graceful is it at',
        'date': 'Jul 3',
        'starred': true,
        'selected': false,
        'unread': false,
        'timestamp': 1376516566000,
        'folderId': 2 },
    { 'id': 10,
        'sender': 'Tatenda Guerra',
        'subject': 'Improve up at to on mention perhaps raising',
        'date': 'Jul 13',
        'attachment': true,
        'attachments': ['assets/img/pictures/6.jpg'],
        'selected': false,
        'unread': false,
        'timestamp': 1376508566000,
        'folderId': 3 },
    { 'id': 12,
        'sender': 'Ladislao Roche',
        'subject': 'Way building not get formerly her peculiar',
        'date': 'Jul 18',
        'selected': false,
        'unread': true,
        'timestamp': 1375877213000,
        'folderId': 2 },
    { 'id': 13,
        'sender': 'Areli.Tanzi@gmail.com',
        'senderMail': 'Areli.Tanzi@gmail.com',
        'subject': 'Up uncommonly prosperous sentiments simplicity',
        'date': 'Jul 24',
        'starred': true,
        'attachment': true,
        'attachments': ['assets/img/pictures/9.jpg'],
        'selected': false,
        'unread': false,
        'timestamp': 1375261974000,
        'folderId': 2 },
    { 'id': 14,
        'sender': 'Oluwaseyi Tremble',
        'subject': 'Reasonable appearance companions oh',
        'date': 'Jul 28',
        'selected': false,
        'unread': false,
        'timestamp': 1373634231000,
        'folderId': 3 }
];
var MailList = (function () {
    function MailList(el) {
        this.replyMail = new core_3.EventEmitter();
        this.mails = MAILS;
        this.$el = jQuery(el.nativeElement);
    }
    MailList.prototype.openMail = function (mail) {
        mail.unread = false;
        this.replyMail.emit(mail);
    };
    MailList.prototype.selectMail = function (mail) {
        mail.selected = mail.selected ? false : true;
        this.checkToggleAll();
    };
    MailList.prototype.selectAll = function () {
        var checked = this.$toggleAll.prop('checked');
        this.toggleAll(checked);
    };
    MailList.prototype.checkToggleAll = function () {
        var checked = true;
        // TODO select read (all)
        this.$el.find('.toggle-one').each(function (i, el) {
            if (!jQuery(el).prop('checked') && checked) {
                checked = false;
            }
        });
        this.$toggleAll.prop('checked', checked);
    };
    MailList.prototype.toggleAll = function (checked) {
        for (var _i = 0, _a = this.mails; _i < _a.length; _i++) {
            var mail = _a[_i];
            mail.selected = checked;
        }
        this.$toggleAll.prop('checked', checked);
    };
    MailList.prototype.selectRead = function () {
        this.toggleAll(false);
        this.mails.filter(function (mail) { return !mail.unread; }).forEach(function (mail) { return mail.selected = true; });
        this.checkToggleAll();
    };
    MailList.prototype.selectUnread = function () {
        this.toggleAll(false);
        this.mails.filter(function (mail) { return mail.unread; }).forEach(function (mail) { return mail.selected = true; });
        this.checkToggleAll();
    };
    MailList.prototype.markSelectedAsRead = function () {
        this.mails.filter(function (mail) { return mail.selected; }).forEach(function (mail) { return mail.unread = false; });
    };
    MailList.prototype.markSelectedAsUnread = function () {
        this.mails.filter(function (mail) { return mail.selected; }).forEach(function (mail) { return mail.unread = true; });
    };
    MailList.prototype.deleteEmails = function () {
        var mails = [];
        this.mails.forEach(function (mail) {
            if (!mail.selected) {
                mails.push(mail);
            }
        });
        this.mails = mails;
    };
    MailList.prototype.ngOnInit = function () {
        this.$toggleAll = this.$el.find('#toggle-all');
    };
    MailList.prototype.ngOnChanges = function (event) {
        if ('folderName' in event) {
            if (!(event.folderName.previousValue instanceof Object)) {
                this.toggleAll(false);
            }
        }
    };
    MailList.prototype.changeStarStatus = function (mail) {
        mail.starred = !mail.starred;
    };
    __decorate([
        core_2.Output(), 
        __metadata('design:type', Object)
    ], MailList.prototype, "replyMail", void 0);
    __decorate([
        core_2.Input(), 
        __metadata('design:type', Object)
    ], MailList.prototype, "folderName", void 0);
    MailList = __decorate([
        core_1.Component({
            selector: '[mail-list]',
            template: __webpack_require__("./src/app/inbox/mail-list/mail-list.template.html"),
            styles: [__webpack_require__("./src/app/inbox/mail-list/mail-list.style.scss")]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_3.ElementRef !== 'undefined' && core_3.ElementRef) === 'function' && _a) || Object])
    ], MailList);
    return MailList;
    var _a;
}());
exports.MailList = MailList;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ },

/***/ "./src/app/inbox/mail-list/mail-list.style.scss":
/***/ function(module, exports) {

module.exports = ".widget-email-count {\n  display: inline-block;\n  margin: 0;\n  font-size: 13px;\n  color: #818a91;\n  line-height: 29px; }\n  .widget-email-count + .widget-email-pagination {\n    margin-left: 10px;\n    border-left: 1px solid #ddd;\n    padding-left: 15px;\n    border-radius: 0;\n    vertical-align: -9px; }\n\n.widget-email header .form-control {\n  font-size: 0.8571rem;\n  border: 1px solid #ccc; }\n  .widget-email header .form-control:focus {\n    border-color: #66afe9;\n    outline: none; }\n\n.widget-email-pagination {\n  margin: 0; }\n  .widget-email-pagination .page-link {\n    color: #888; }\n\n.table-emails {\n  margin-bottom: 0; }\n  .table-emails tbody > tr > td:first-child {\n    width: 45px; }\n  .table-emails td,\n  .table-emails th {\n    padding: 7px 5px 7px 5px; }\n  .table-emails td > .abc-checkbox,\n  .table-emails th > .abc-checkbox {\n    left: -18px; }\n    .table-emails td > .abc-checkbox > label:before,\n    .table-emails td > .abc-checkbox > label:after,\n    .table-emails th > .abc-checkbox > label:before,\n    .table-emails th > .abc-checkbox > label:after {\n      margin-left: 0px; }\n  .table-emails .name,\n  .table-emails .subject,\n  .table-emails .date {\n    cursor: pointer; }\n  .table-emails .date {\n    text-align: right;\n    min-width: 65px; }\n  .table-emails .unread {\n    font-weight: 600;\n    color: #55595c; }\n  .table-emails .starred {\n    color: #818a91;\n    cursor: pointer; }\n    .table-emails .starred:hover {\n      color: #55595c; }\n    .table-emails .starred .fa-star {\n      color: #f0ad4e; }\n"

/***/ },

/***/ "./src/app/inbox/mail-list/mail-list.template.html":
/***/ function(module, exports) {

module.exports = "<div class=\"clearfix mb-xs\">\r\n  <a class=\"btn btn-secondary btn-sm width-50 pull-left hide\" id=\"back-btn\" href=\"inbox.html\">\r\n    <i class=\"fa fa-angle-left fa-lg\"></i>\r\n  </a>\r\n  <div class=\"pull-xs-right\" id=\"folder-stats\">\r\n    <p class=\"widget-email-count\">Showing 1 - 10 of 96 messages</p>\r\n    <ul class=\"pagination pagination-sm widget-email-pagination\">\r\n      <li class=\"prev disabled page-item\"><a class=\"page-link\" href=\"#\"><i class=\"fa fa-chevron-left\"></i></a></li>\r\n      <li class=\"active page-item\"><a class=\"page-link\" href=\"#\">1</a></li>\r\n      <li class=\"page-item\"><a class=\"page-link\" href=\"#\">2</a></li>\r\n      <li class=\"next page-item\"><a class=\"page-link\" href=\"#\"><i class=\"fa fa-chevron-right\"></i></a></li>\r\n    </ul>\r\n  </div>\r\n</div>\r\n<section class=\"widget widget-email\">\r\n  <header id=\"widget-email-header\">\r\n    <div class=\"row\">\r\n      <div class=\"col-sm-6\">\r\n        <div class=\"btn-group\">\r\n          <a class=\"btn btn-secondary btn-sm dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\">\r\n            Select\r\n            <i class=\"fa fa-angle-down \"></i>\r\n          </a>\r\n          <ul class=\"dropdown-menu\">\r\n            <li><a class=\"dropdown-item\" (click)=\"toggleAll(true)\">All</a></li>\r\n            <li><a class=\"dropdown-item\" (click)=\"toggleAll(false)\">None</a></li>\r\n            <li class=\"dropdown-divider\"></li>\r\n            <li><a class=\"dropdown-item\" (click)=\"selectRead()\">Read</a></li>\r\n            <li><a class=\"dropdown-item\" (click)=\"selectUnread()\">Unread</a></li>\r\n          </ul>\r\n        </div>\r\n        <div class=\"btn-group\">\r\n          <a class=\"btn btn-sm btn-secondary dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\">\r\n            Actions\r\n            <i class=\"fa fa-angle-down \"></i>\r\n          </a>\r\n          <ul class=\"dropdown-menu\">\r\n            <li><a class=\"dropdown-item\" href=\"#\">Reply</a></li>\r\n            <li><a class=\"dropdown-item\" href=\"#\">Forward</a></li>\r\n            <li><a class=\"dropdown-item\" href=\"#\">Archive</a></li>\r\n            <li class=\"dropdown-divider\"></li>\r\n            <li><a class=\"dropdown-item\" (click)=\"markSelectedAsRead()\">Mark As Read</a></li>\r\n            <li><a class=\"dropdown-item\" (click)=\"markSelectedAsUnread()\">Mark As Unread</a></li>\r\n            <li class=\"dropdown-divider\"></li>\r\n            <li><a class=\"dropdown-item\" (click)=\"deleteEmails()\">Delete</a></li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n      <div class=\"col-sm-6\">\r\n        <input class=\"form-control form-control-sm width-200 pull-xs-right\" id=\"mailbox-search\" [(ngModel)]=\"searchText\" type=\"text\" placeholder=\"Search Messages\">\r\n      </div>\r\n    </div>\r\n  </header>\r\n  <div class=\"widget-body\" id=\"mailbox-content\">\r\n    <table class=\"table table-striped table-emails table-hover\" id=\"folder-view\" >\r\n      <thead>\r\n      <tr>\r\n        <th colspan=\"3\" id=\"folder-actions\">\r\n          <div class=\"checkbox abc-checkbox\">\r\n            <input id=\"toggle-all\" type=\"checkbox\" (click)=\"selectAll()\">\r\n            <label for=\"toggle-all\"></label>\r\n          </div>\r\n        </th>\r\n      </tr>\r\n      </thead>\r\n      <tbody>\r\n      <tr *ngFor=\"let mail of mails | FoldersPipe : folderName | SearchPipe : searchText\" [ngClass]=\"{'unread': mail.unread}\">\r\n        <td>\r\n          <div class=\"checkbox abc-checkbox\">\r\n            <input class=\"toggle-one\" type=\"checkbox\" id=\"checkbox{{mail.id}}\" [checked]=\"mail.selected\"  (click)=\"selectMail(mail)\">\r\n            <label attr.for=\"checkbox{{mail.id}}\"></label>\r\n          </div>\r\n        </td>\r\n        <td><span class=\"starred\"><i class=\"fa\" [ngClass]=\"{'fa-star': mail.starred, 'fa-star-o': !mail.starred}\" (click)=\"changeStarStatus(mail)\"></i></span></td>\r\n        <td class=\"name hidden-xs-down\" (click)=\"openMail(mail)\">{{mail.sender}}</td>\r\n        <td class=\"subject\" (click)=\"openMail(mail)\">{{mail.subject}}</td>\r\n        <td class=\"hidden-xs-down\">\r\n          <i [ngClass]=\"{'fa fa-paperclip': mail.paperclip}\"></i>\r\n        </td>\r\n        <td class=\"date\">{{mail.date}}</td>\r\n      </tr>\r\n      <tr *ngIf=\"(mails).length == 4\">\r\n          <td colspan=\"12\">\r\n              Nothing here yet\r\n          </td>\r\n      </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n</section>\r\n"

/***/ },

/***/ "./src/app/inbox/mail-list/pipes/folders-pipe.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var FOLDERS = [
    { 'name': 'Inbox', 'order': 0, 'id': 1, 'unread': 2 },
    { 'name': 'Sent Mail', 'order': 6, 'id': 2, 'unread': 0 },
    { 'name': 'Draft', 'order': 7, 'id': 3, 'unread': 3 },
    { 'name': 'Trash', 'order': 8, 'id': 4, 'unread': 0 }
];
var FoldersPipe = (function () {
    function FoldersPipe() {
        this.folders = FOLDERS;
    }
    FoldersPipe.prototype.transform = function (value, args) {
        var _this = this;
        var folderName = args;
        if (value) {
            return value.filter(function (conversation) {
                /* tslint:disable */
                if (folderName == 'Starred') {
                    return conversation.starred;
                }
                else {
                    var folder = _this.folders.filter(function (folder) { return folder.name == folderName; });
                    return folder[0].id == conversation.folderId;
                }
            });
        }
    };
    FoldersPipe = __decorate([
        core_1.Pipe({
            name: 'FoldersPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], FoldersPipe);
    return FoldersPipe;
}());
exports.FoldersPipe = FoldersPipe;


/***/ },

/***/ "./src/app/inbox/mail-list/pipes/search-pipe.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var SearchPipe = (function () {
    function SearchPipe() {
    }
    SearchPipe.prototype.transform = function (value, args) {
        var searchText = new RegExp(args, 'ig');
        if (value) {
            return value.filter(function (mail) {
                if (mail.sender) {
                    return mail.sender.search(searchText) !== -1;
                }
                if (mail.subject) {
                    return mail.subject.search(searchText) !== -1;
                }
            });
        }
    };
    SearchPipe = __decorate([
        core_1.Pipe({
            name: 'SearchPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], SearchPipe);
    return SearchPipe;
}());
exports.SearchPipe = SearchPipe;


/***/ }

});
//# sourceMappingURL=19.map