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

        var BaseAnalytics = function() {
            BaseBase.call(this);

            this.base = '';
        };

        BaseAnalytics.prototype = _.create(BaseBase.prototype, {
            constructor: BaseAnalytics,

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
                throw 'BaseAnalytics: initVariables() not implemented';
            },

            track: function(pageName, extraParams, base) {

                if (typeof base !== 'undefined') {
                    pageName = base + pageName;    
                } else {
                    pageName = this.base + pageName;  
                }

                var props = pageName.split('/');

                s.pageName = pageName;
                s.channel = pageName;
                s.hier1 = pageName;

                s.prop1 = '/'+props[1];
                s.linkTrackVars=['prop1'];

                for (var i = 2; i < props.length; i++) { 
                    s['prop'+i] = s['prop'+(i-1)] + '/' + props[i];
                    s.linkTrackVars.push('prop'+i);
                }

                if (typeof extraParams === 'object') {
                    var keys = _.keys(extraParams);
                    _.each(keys, function(key) {
                        s[key] = extraParams[key];
                        s.linkTrackVars.push(key);
                    });
                }
        
                s.linkTrackVars.push('prop22','channel','hier1');
                s.linkTrackEvents='None';
                s.t(this,"o");   
            }

            
        });

        return BaseAnalytics;
    }
);
