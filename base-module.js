define([
        'jquery',
        'lodash',
        'base-base',
        'breakpoints-controller'
    ],
    function(
        $,
        _,
        BaseBase,
        BreakpointController
    ) {
        'use strict';
        
        var _moduleCount = 0;
        var _moduleList = [];

        window.baseModules = _moduleList;

        /**
        *   This is the base class for all modules. It defines handlers for common events, such as
        *   viewportSmallEntry and other Breakpoint related events.
        *
        *   @class BaseModule
        *   @constructor
        */
        var BaseModule = function() {
            BaseBase.call(this);

            this.id = _moduleCount++;
            _moduleList.push(this);
        };

        BaseModule.prototype = _.create(BaseBase.prototype, {
            constructor: BaseModule,

            /**
            *   This method will setup breakpoint event listeners needed throughout the class.
            *
            *   @method initBreakpoints
            *   @return {undefined}
            *   @required
            */
            initBreakpoints: function() {
                if (typeof window.breakpointsController !== 'undefined') {
                    this.breakpointsController = window.breakpointsController;
                } else {
                    this.breakpointsController = new BreakpointController();
                    window.breakpointsController = this.breakpointsController;
                }

                this.bindEvent(this.breakpointsController, 'small.entry', this.onSmallViewportEntry);
                this.bindEvent(this.breakpointsController, 'small.exit', this.onSmallViewportExit);
                this.bindEvent(this.breakpointsController, 'medium.entry', this.onMediumViewportEntry);
                this.bindEvent(this.breakpointsController, 'medium.exit', this.onMediumViewportExit);
                this.bindEvent(this.breakpointsController, 'large.entry', this.onLargeViewportEntry);
                this.bindEvent(this.breakpointsController, 'large.exit', this.onLargeViewportExit);
            },

            /**
            *   This method will remove breakpoint event listeners.
            *
            *   @method removeBreakpoints
            *   @return {undefined}
            *   @required
            */
            removeBreakpoints: function() {
                this.removeEvent(this.breakpointsController, 'small.entry');
                this.removeEvent(this.breakpointsController, 'small.exit');
                this.removeEvent(this.breakpointsController, 'medium.entry');
                this.removeEvent(this.breakpointsController, 'medium.exit');
                this.removeEvent(this.breakpointsController, 'large.entry');
                this.removeEvent(this.breakpointsController, 'large.exit');
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
                throw 'BaseModule: initVariables() not implemented';
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
                throw 'BaseModule: initEvents() not implemented';
            },
            
            /**
            *   This method will instantiate the analytics mediator for this page. Once instantiated,
            *   you shouldn't have to do much with it.
            *
            *   This is a placeholder function that must be overridden in the child class, which 
            *   is why it is tagged as `required` 
            *   
            *   @method initAnalytics
            *   @return {undefined}
            *   @required
            */
            initAnalytics: function() {
                throw 'BaseModule: initAnalytics() not implemented';
            },

            /**
            *   Handler for smallViewportEntry event. Listener attached by super.
            * 
            *   @method onSmallViewportEntry
            *   @return {undefined}
            *   @required
            */
            onSmallViewportEntry: function() {
                throw 'BaseModule: onSmallViewportEntry() not implemented';
            },

            /**
            *   Handler for smallViewportExit event. Listener attached by super. 
            * 
            *   @method onSmallViewportExit
            *   @return {undefined}
            *   @required
            */
            onSmallViewportExit: function() {
                throw 'BaseModule: onSmallViewportExit() not implemented';
            },

            /**
            *   Handler for mediumViewportEntry event. Listener attached by super
            * 
            *   @method onMediumViewportEntry
            *   @return {undefined}
            *   @required
            */
            onMediumViewportEntry: function() {
                throw 'BaseModule: onMediumViewportEntry() not implemented';
            },

            /**
            *   Handler for mediumViewportExit event. Listener attached by super.
            * 
            *   @method onMediumViewportExit
            *   @return {undefined}
            *   @required
            */
            onMediumViewportExit: function() {
                throw 'BaseModule: onMediumViewportExit() not implemented';
            },

            /**
            *   Handler for largeViewportEntry event. Listener attached by super.
            * 
            *   @method onLargeViewportEntry
            *   @return {undefined}
            *   @required
            */
            onLargeViewportEntry: function() {
                throw 'BaseModule: onLargeViewportEntry() not implemented';
            },

            /**
            *   Handler for largeViewportExit event. Listener attached by super. 
            * 
            *   @method onLargeViewportExit
            *   @return {undefined}
            *   @required
            */
            onLargeViewportExit: function() {
                throw 'BaseModule: onLargeViewportExit() not implemented';
            }
        });
    
        return BaseModule;
    }
);
