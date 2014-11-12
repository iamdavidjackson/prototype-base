define([
        'jquery',
        'lodash',
        'modules/eebase-module'
    ],
    function(
        $,
        _,
        EEBaseModule
    ) {
        'use strict';

        /**
        *   BreakpointsController is a module that handles breakpoints on the JS side.
        *   It checks for IE 8 or 9 before setting up the matchMedia listeners.
        *   There is a separate IE breakpoints controller to ensure that this responsive
        *   site doesn't explode in IE.
        *
        *   @class BreakpointsController
        *   @extends EEBaseModule
        *   @constructor
        */
        var BreakpointsController = function(breakpoints) {
            EEBaseModule.call(this);

            this.breakpoints = breakpoints;

            this.initVariables();
            this.initEvents();

            var hasSupportForMediaQueries = this.hasSupportForMediaQueries();

            this.isInit = true;
        };

        BreakpointsController.prototype = _.create(EEBaseModule.prototype, {
            constructor: BreakpointsController,

            /**
            *   Initialize any variables needed, meaning mainly "wrap elements with jQuery."
            *
            *   @method initVariables
            *   @return {undefined}
            *   @private
            */
            initVariables: function() {
                this.breakpointSmall         = window.breakpointSmall;
                this.breakpointSmallPlusOne  = window.breakpointSmallPlusOne;
                this.breakpointMedium        = window.breakpointMedium;
                this.breakpointMediumMinusOne = window.breakpointMediumMinusOne;
                this.breakpointLarge         = window.breakpointLarge;
                this.breakpointLargePlusOne  = window.breakpointLargePlusOne;
                this.breakpointLargeMinusOne  = window.breakpointLargeMinusOne;

                this.mqTemplateSmall  = '(max-width: <%= maxWidth %> )';
                this.mqTemplateMedium = '(min-width: <%= minWidth %> ) and (max-width: <%= maxWidth %> )';
                this.mqTemplateLarge  = '(min-width: <%= minWidth %> )';

                this.mqSmall  = _.template(this.mqTemplateSmall, { maxWidth: convertToEm(this.breakpointMediumMinusOne) });
                this.mqMedium = _.template(this.mqTemplateMedium, { minWidth: convertToEm(this.breakpointMedium), maxWidth: convertToEm(this.breakpointLargeMinusOne) });
                this.mqLarge  = _.template(this.mqTemplateLarge, { minWidth: convertToEm(this.breakpointLarge) });
            },

            /**
            *   Initialize events and event listeners.
            *
            *   @method initEvents
            *   @return {undefined}
            *   @private
            */
            initEvents: function() {
                var breakpoints = ['small', 'medium', 'large'];

                var i, viewport, mq;
                for (i = 0; i < breakpoints.length; i++) {
                    viewport = breakpoints[i];
                    mq = this.getMediaQueryForBreakpoint(viewport);
                    this.bindBreakpointEvents(viewport, mq);
                }
            },

            /**
            *   This method returns the media query for the provided breakpoint
            *
            *   @method getMediaQueryForBreakpoint
            *   @return {string}
            *   @private
            */
            getMediaQueryForBreakpoint: function(breakpoint) {
                var mq;
                if (breakpoint === 'small') {
                    mq = this.mqSmall;
                } else if (breakpoint === 'medium') {
                    mq = this.mqMedium;
                } else {
                    mq = this.mqLarge;
                }
                return mq;
            },

            /**
            *   This method is responsible for triggering breakpoint events when
            *   they are initially bound. Without this method, breakpoint events
            *   would not fire on page-load.
            *
            *   @method onEventListenerAdded
            *   @return {undefined}
            *   @private
            */
            onEventListenerAdded: function(module, moduleEvent, eventHandler) {
                var breakpoint, mediaQuery, eventName;

                var eventNameContainsBreakpoint = moduleEvent.match(/^small|^medium|^large/);
                if (eventNameContainsBreakpoint) {
                    breakpoint = eventNameContainsBreakpoint[0];
                } else {
                    return;
                }

                var eventNameContainsEventType = moduleEvent.match(/entry$|exit$/);
                if (eventNameContainsEventType) {
                    eventName = eventNameContainsEventType[0];
                } else {
                    return;
                }

                mediaQuery = this.getMediaQueryForBreakpoint(breakpoint);

                if (this.hasSupportForMediaQueries()) {
                    var mm = window.matchMedia(mediaQuery);

                    if ((mm.matches && eventName === 'entry') || (!mm.matches && eventName === 'exit')) {
                        eventHandler.call(module);
                    }
                } else {
                    // IE8 is locked to desktop only
                    var isEntryAndLarge = ((eventName === 'entry') && (breakpoint === 'large'));
                    var isExitAndNotLarge = ((eventName === 'exit') && (breakpoint !== 'large'));

                    if (isEntryAndLarge || isExitAndNotLarge) {
                        eventHandler.call(module);
                    }
                }

            },

            /**
            *   Check if the current browser has support for media queries. IE8
            *   does not but is part of the supported browsers.
            *
            *   @method hasSupportForMediaQueries
            *   @return {undefined}
            *   @private
            */
            hasSupportForMediaQueries: function() {
                return !$('body').hasClass('lt-ie9');
            },

            /**
            *   Binds entry and exit events to media queries
            *
            *   @method bindBreakpointEvents
            *   @return {undefined}
            *   @private
            */
            bindBreakpointEvents: function(breakpoint, mediaQuery) {
                var self = this;

                if (this.hasSupportForMediaQueries()) {
                    var mm = window.matchMedia(mediaQuery);

                    mm.addListener(function(mediaQueryList) {
                        if (mediaQueryList.matches) {
                            self.trigger(breakpoint + '.entry');
                        } else {
                            self.trigger(breakpoint + '.exit');
                        }
                    });
                }
            },

            /**
            *   utterly obliterate this module and any references to it
            *
            *   @method initevents
            *   @return {undefined}
            *   @private
            */
            uninitialize: function() {
            }
        });

        function convertToEm(value) {
            var baseEm = 16; //px
            return (value  / baseEm) + 'em';
        }

        window.breakpointSmall         = 480;
        window.breakpointSmallPlusOne  = 481;
        window.breakpointMediumMinusOne = 767;
        window.breakpointMedium        = 768;
        window.breakpointLargeMinusOne = 959;
        window.breakpointLarge         = 960;
        window.breakpointLargePlusOne  = 961;


        return BreakpointsController;
    }
);
