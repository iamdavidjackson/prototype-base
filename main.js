require.config({
    baseUrl: '/javascripts/',
    waitSeconds: 30,

    map: {
        // Force backbone to use lodash instead of underscore
        'backbone' : {
            'underscore' : 'lodash'
        }
    },

    paths: {
        // Libraries
        'jquery'                    : '../bower_components/jquery/jquery',
        'backbone'                  : '../bower_components/backbone/backbone',
        'lodash'                    : '../bower_components/lodash/dist/lodash',
        
        // Prototype Base
        'base-base'                 : '../bower_components/prototype-base/base-base',
        'base-module'               : '../bower_components/prototype-base/base-module',
        'base-ajax'                 : '../bower_components/prototype-base/base-ajax',
        'base-analytics'            : '../bower_components/prototype-base/base-analytics',
        'breakpoints-controller'    : '../bower_components/prototype-base/breakpoints-controller'
    }
});
