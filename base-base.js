define([
        'jquery',
        'lodash',
        'backbone'
    ],
    function(
        $,
        _,
        Backbone
    ) {
        'use strict';
    
        var _eventCount = 0;
        var _events = {};

        // FIXME: add meaningful logging of events to _events
        window.baseEvents = _events;

        /**
        *   This is the base class for all modules. 
        *
        *   @class BaseBase
        *   @constructor
        */
        var BaseBase = function() {
            this.uuid = BaseBase.generateUUID();

            // Public functions
            // --------------------------------------------------
            
            /**
            *   This method will bind events to a specified domElem using the UUID for this class. 
            *
            *   All events should be bound using this function.
            *   
            *   @method bindEvent
            *   @return {undefined}
            *   @required
            */
            this.bindEvent = function(base, eventName /* see functions below for full list of args */) {
                if (typeof base === 'undefined') {
                    throw 'BaseBase: cannot bindEvent() to an undefined object';
                }

                if (hasBackboneEvents(base)) {
                    bindModuleEvent.apply(this, arguments);
                } else {
                    bindDomEvent.apply(this, arguments);
                }
            };

            /**
            *   This method will remove bound events to a specified domElem using the UUID for this class. 
            *   
            *   @method removeEvent
            *   @return {undefined}
            *   @required
            */
            this.removeEvent = function(base, eventName /* see functions below for full list of args */) {
                if (typeof base === 'undefined') {
                    throw 'BaseBase: cannot removeEvent() from an undefined object';
                }

                if (hasBackboneEvents(base)) {
                    removeModuleEvent.apply(this, arguments);
                } else {
                    removeDomEvent.apply(this, arguments);
                }
            };


            // Private functions
            // --------------------------------------------------
            var self = this;

            function hasBackboneEvents(object) {
                return (typeof object.listenTo !== 'undefined');
            }

            function applyUUIDToEventName(eventName) {
                // IE8 does not support string.trim();
                var eventNameList = eventName.replace(/^\s+|\s+$/g, '').split(' '); 
                var i, name, output = '';
                for (i = 0; i < eventNameList.length; i++) {
                    name = eventNameList[i];
                    output += name + '.' + self.uuid;
                    if (i+1 < eventNameList.length) {
                        output += ' ';
                    }
                }

                return output;
            }

            function bindModuleEvent(module, moduleEvent, eventHandler) {
                /* customhint: laxon */
                module.on(moduleEvent, eventHandler, self);

                // Notify "module" that it is being listened to by "self"
                // (in case it wants to take special actions)
                if (module instanceof BaseBase) {
                    module.onEventListenerAdded(self, moduleEvent, eventHandler);
                }
            }

            function removeModuleEvent(module, moduleEvent, eventHandler) {
                /* customhint: laxoff */
                module.off(moduleEvent, eventHandler);

                // Notify "module" that it is no longer being listened to "self"
                // (in case it wants to take special actions)
                if (module instanceof BaseBase) {
                    module.onEventListenerRemoved(self, moduleEvent, eventHandler);
                }
            }

            function bindDomEvent(domElem, domEvent /* [, optional domSelector], eventHandler */) {
                var $domElem = $(domElem);
                var domSelector, eventHandler, isDelegatedEvent = false;

                if (typeof arguments[2] === 'string') {
                    isDelegatedEvent = true;
                    domSelector  = arguments[2];
                    eventHandler = arguments[3];
                } else {
                    eventHandler = arguments[2];
                }

                domEvent = applyUUIDToEventName(domEvent);

                if (isDelegatedEvent) {
                    /* customhint: laxon */
                    $domElem.on(domEvent, domSelector, $.proxy(eventHandler, self));
                } else {
                    /* customhint: laxon */
                    $domElem.on(domEvent, $.proxy(eventHandler, self));
                }
            }

            function removeDomEvent(domElem, domEvent /* [, optional domSelector] [, optional eventHandler] */) {
                var $domElem = $(domElem);
                var domSelector, eventHandler, isDelegatedEvent = false;

                if (typeof arguments[2] === 'string') {
                    isDelegatedEvent = true;
                    domSelector  = arguments[2];
                    eventHandler = arguments[3];
                } else {
                    eventHandler = arguments[2];
                }

                domEvent = applyUUIDToEventName(domEvent);

                // jQuery is smart enough to figure out that we originally bound
                // to the event using a proxy function to eventHandler(). It will
                // correctly unbind the event even though we do not have a reference
                // to the original proxy function from bindEvent().
                // http://www.bennadel.com/blog/2001-Using-jQuery-s-Proxy-Method-In-Event-Binding-And-Unbinding.htm

                if (isDelegatedEvent) {
                    /* customhint: laxoff */
                    $domElem.off(domEvent, domSelector, eventHandler);
                } else {
                    /* customhint: laxoff */
                    $domElem.off(domEvent, eventHandler);
                }
            }
        };

        BaseBase.prototype = {
            constructor: BaseBase,

            /**
            *   Overridable method that can be used to run code when a class binds to events from this class
            *   
            *   @method onEventListenerAdded
            *   @return {undefined}
            *   @required
            */
            onEventListenerAdded: function(module, eventName, eventHandler) {
            },

            /**
            *   Overridable method that can be used to run code when a class removes events from this class
            *   
            *   @method onEventListenerRemoved
            *   @return {undefined}
            *   @required
            */
            onEventListenerRemoved: function(module, eventName, eventHandler) {
            }

        };

        BaseBase.generateUUID = (function (){
            // http://www.broofa.com/Tools/Math.uuid.htm
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var charArray = chars.split('');
            var uuid = new Array(36);
            var rnd = 0, r, i;
            return function () {
                for (i = 0; i < 36; i++) {
                    if (i === 8 || i === 13 || i === 18 || i === 23) {
                        uuid[i] = '-';
                    } else if (i === 14) {
                        uuid[i] = '4';
                    } else {
                        if (rnd <= 0x02) {
                            rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        } 
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
                return uuid.join('');
            };
        }());

        _.extend(BaseBase.prototype, Backbone.Events);

        return BaseBase;
    }
);
