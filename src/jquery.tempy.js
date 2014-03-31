/*!
 * tempy.js
 * v0.1.0 - 2014-03-31
 * http://addyosmani.github.com/basket.js
 */

(function( window, document ) {
    //'use strict';

    var storagePrefix = 'tempy-';
    var defaultExpiration = 10;
    var templateServer = "templateServer.php";
    var debug = 0;


    var getTemplate = function(){

        if(arguments.length > 1){

            var templates = new Object();

        }


        for (var i in arguments) {

            if(arguments[i]['expires']){defaultExpiration = arguments[i]['expires'];}
            if(arguments[i]['debug']){ debug = arguments[i]['debug']}

            var templateName = arguments[i]['name'];
            var template = fetchTemplate(templateName);

            if(debug == 1 | template == null){
                downloadTemplate.apply(null,arguments);
                template = fetchTemplate(templateName);
            }

            if(arguments.length > 1){
                templates[templateName] = template;
            }

        }

        if(arguments.length > 1){
            return templates;
        }
        return template;
    };

    var downloadTemplate = function(){
        jQuery.ajax({
            url: templateServer,
            context: document.body,
            async:false,
            type:"POST",
            dataType:"json",
            data: {arguments:arguments},
            success:function(response){

                $(response).each(function(){
                    saveTemplate(this);
                });

            }
        });
    };

    var fetchTemplate = function(templateName){
        var item = localStorage.getItem(storagePrefix+templateName);
        var template = JSON.parse( item || 'false' );
        expire(template);
        return template.templateContent;
    }

    var saveTemplate = function(obj){
        obj = expire(obj);
        localStorage.setItem(storagePrefix+obj.templateName,JSON.stringify(obj));
    };

    var expire = function(obj){
        var now = +new Date();



        if(obj.expire <= now){
            localStorage.removeItem( storagePrefix + obj.templateName);
        }

        //console.log(obj.templateName+"expires in "+Math.round(((obj.expire-now)/60/60/1000*60))+" Minutes");

        obj.stamp = now;
        obj.expire = now + ( ( obj.expire || defaultExpiration ) * 60 * 60 * 1000 );
        return obj;
    };

    window.tempy = {
        get: function() {
          var template = getTemplate.apply( null, arguments);
          return template;
        },
        clear: function(){

            var key, template;
            var now = +new Date();

            for (item in localStorage) {

                key = item.split( storagePrefix )[ 1 ];
                template = fetchTemplate(key);

            }

            return this;
        },
        flush: function(){
            for (item in localStorage) {
                localStorage.removeItem(item);
            }
        }
    };

   //tempy.clear( true );

})( this, document );

