define([
        'jquery',
        'lodash',
        'base-base'
    ],
    function(
        $,
        _,
        BaseBase
    ) {
        'use strict';

        var _ajaxModuleCount = 0;
        var _ajaxModuleList = [];

        window.baseAjaxModules = _ajaxModuleList;

        /**
        *   This is the base class for all modules.
        *
        *   @class BaseAjaxModule
        *   @constructor
        */
        var BaseAjaxModule = function(options) {
            BaseBase.call(this);

            this.id = _ajaxModuleCount++;
            _ajaxModuleList.push(this);

            this.options = options || {};
        };

        BaseAjaxModule.prototype = _.create(BaseBase.prototype, {
            constructor: BaseAjaxModule,

            /**
            *   This method will gather the AJAX options for this module and
            *   trigger the AJAX request
            *
            *   @method triggerAjaxRequest
            *   @return {undefined}
            */
            triggerAjaxRequest: function() {
                this.options.url            = this.getAjaxUrl();
                this.options.data           = this.getAjaxData();
                this.options.type           = this.getAjaxType();
                this.options.cache          = false;
                this.options.triggerObject  = this.getAjaxTriggerObject();
                this.options.complete       = $.proxy( this.always, this );
                this.options.success        = $.proxy( this.done, this );
                this.options.error          = $.proxy( this.fail, this );
                this.options.beforeSend     = $.proxy( this.beforeSend, this);

                $.ajax(this.options);
            },

            /**
            *   This method should return the URL to which the ajax request
            *   will be made
            *
            *   @method getAjaxUrl
            *   @return {string}
            */
            getAjaxUrl: function() {
                return this.options.url;
            },

            /**
            *   This method sets the url which will be used to make the ajax
            *   request
            *
            *   @method setAjaxUrl
            *   @return {undefined}
            */
            setAjaxUrl: function(url) {
                this.options.url = url;
            },

            /**
            *   This method should return the data which will be sent along
            *   with the ajax request
            *
            *   @method getAjaxData
            *   @return {string} //FIXME: This method should return an object
            */
            getAjaxData: function() {
                return this.options.data;
            },

            /**
            *   This method sets the data which will be sent along
            *   with the ajax request
            *
            *   @method setAjaxData
            *   @return {undefined}
            */
            setAjaxData: function(data) {
                this.options.data = data;
            },

            /**
            *   This method should return the type of ajax request this module
            *   will make. Default is 'GET'.
            *
            *   @method getAjaxType
            *   @return {string}
            */
            getAjaxType: function() {
                return this.options.type;
            },

            /**
            *   This method enables or disables client side caching.
            *
            *   @method getAjaxCache
            *   @return {undefined}
            */
            getAjaxCache: function(data) {
                return this.options.cache;
            },

            /**
            *   This method enables or disables client side caching.
            *
            *   @method setAjaxCache
            *   @return {undefined}
            */
            setAjaxCache: function(cache) {
                this.options.cache = cache;
            },

            /**
            *   This method gets the trigger object.
            *
            *   @method getAjaxTriggerObject
            *   @return {string}
            */
            getAjaxTriggerObject: function() {
                return this.options.triggerObject;
            },

            /**
            *   This method sets the trigger object.
            *
            *   @method setAjaxTriggerObject
            *   @returns {undefined}
            */
            setAjaxTriggerObject: function(triggerObect) {
                this.options.triggerObject = triggerObect;
            },

            /**
            *   A function to be called if the request succeeds. The function
            *   gets passed three arguments: The data returned from the server,
            *   formatted according to the dataType parameter; a string
            *   describing the status; and the jqXHR
            *
            *   @method done
            *   @return {undefined}
            */
            done: function(data, textStatus, jqXHR) {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift('done');
                this.trigger.apply(this, args);
            },

            /**
            *   A function to be called if the request fails. The function
            *   receives three arguments: The jqXHR (in jQuery 1.4.x,
            *   XMLHttpRequest) object, a string describing the type of error
            *   that occurred and an optional exception object, if one occurred.
            *   Possible values for the second argument (besides null) are
            *   "timeout", "error", "abort", and "parsererror". When an HTTP
            *   error occurs, errorThrown receives the textual portion of the
            *   HTTP status, such as "Not Found" or "Internal Server Error."
            *
            *   @method always
            *   @return {undefined}
            */
            fail: function(jqXHR, textStatus, errorThrown) {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift('fail');
                this.trigger.apply(this, args);
            },

            /**
            *   A function to be called when the request finishes (after success
            *   and error callbacks are executed). The function gets passed two
            *   arguments: The jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object
            *   and a string categorizing the status of the request ("success",
            *   "notmodified", "error", "timeout", "abort", or "parsererror").
            *
            *   @method always
            *   @return {undefined}
            */
            always: function() {

            },

            /**
            *   This function will be called right before the AJAX request gets sent
            *   and will cache an object that you want to be able to reference when
            *   the AJAX request completes.
            *
            *   @method beforeSend
            *   @return {undefined}
            */
            beforeSend:function(jqXHR, settings) {
                jqXHR.triggerObject = settings.triggerObject;
            },

            /**
            *   This method will initialize any elements that will be needed through the rest of
            *   the class, meaning mostly that you "wrap them with jQuery."
            *
            *   This is a placeholder function that must be overridden in the child class, which
            *   is why it is tagged as `required`
            *
            *   @method initVariables
            *   @return {undefined}
            *   @required
            */
            initVariables: function() {
                throw 'BaseAjaxModule: initVariables() not implemented';
            },

            /**
            *   This method will setup any event listeners needed throughout the class. Use this
            *   for defining things like click handlers on buttons, or scroll handlers on window.
            *
            *   This is a placeholder function that must be overridden in the child class, which
            *   is why it is tagged as `required`
            *
            *   @method initEvents
            *   @return {undefined}
            *   @required
            */
            initEvents: function() {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift('always');
                this.trigger.apply(this, args);

            }
        });

        return BaseAjaxModule;
    }
);
