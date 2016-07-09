
// widget implementation starts here
// change 'Modul_svg_text' to 'Modul_mywidgetname'
// and 'widgetname:"svg_text",' to 'widgetname:"mywidgetname",'
// usage: <div data-type="svg_text" data-device="dummy1" data-get="volume"></div>

/*
function depends_svg (){
    $('head').append('<link rel="stylesheet" href="'+ ftui.config.dir + '/../css/ftui_svg.css" type="text/css" />');
    return [];
};
*/

var Modul_svg = function () {

    // use this function to return some value while logging a message, e.g.
    // .each(function(index) {
    //     if ($(this).fails) return log(true, 1, "this element can not be handled but we check all others");
    //     if ($(this).fatal) return log(false, 1, "something bad happened, will break from each()");
    // });
    function log(ret,verb,msg) {
        ftui.log(verb.msg);
        return ret;
    };
    
    function getSvgDoc(elem_) {
        var elem = (elem instanceof jQuery) ? elem_ : $(elem_);
        var type = elem.data('type');
        if (type.substr(0,4)=="svg_") {
            return getSvgDoc(elem.parent());
        }
        if (type != "svg") return "";
        if (elem.attr('svg-initialized')==1) 
            return elem.find('object.ftuisvgcontainer').get(0).contentDocument.rootElement;
    };

    function getSvgElem(elem, svgId) {
        var me = this;
        var svgDoc = getSvgDoc(elem);
        if (!svgDoc) return null; // me.log(null,3,me.widgetname+": svg not ready");
        var svgElem = $(svgDoc).find('#'+svgId);
        if (!svgElem || !svgElem.length) return null; // me.log(null,1,me.widgetname+": svg knows nothing of "+svgId);
        return svgElem;
    };
    
    // find the class object for a given plugin name
    function queryPlugin(name) {
        var retval = Modul_widget; // fallback if no such plugin exists
        $.each(plugins.modules, function (index, module) {
            if (module.widgetname == name) { retval = module; return false; }
        });
        return retval;
    };

    // note that the callback function will be called when the svg is available
    // side note: chrome will repaint with the unaltered svg and emit another 'load' event
    //            thus calling the callback once more
    // so ideally, all elements of the svg are updated by the callback function
    //
    // param w,h: height and width cobstrainst, one of which may be undefined
    //
    function setupSVG(elem,src,w,h,callback) {
        // We need an object that loads the svg so that the svgs do not
        // share the same DOM, hence messing up non-unique ids (e.g. with "use").
        // The class we need for finding the container object w/ getSvgDoc()
        var objElement = $('<object class="ftuisvgcontainer" type="image/svg+xml"></object>');
        objElement.prependTo(elem);
        // before loading the svg, install load event handler for the native DOM element
        //  because objElement.load() will not work
        // http://www.w3schools.com/jsref/met_element_addeventlistener.asp
        // http://www.w3schools.com/jsref/dom_obj_event.asp
        objElement.get(0).addEventListener('load', function(){
            var svgRoot = objElement.get(0).contentDocument.rootElement;
            /*
            var svg = Snap(objElement.get(0).contentDocument);
            */
            var sw = svgRoot.getAttribute('width');
            var sh = svgRoot.getAttribute('height');
            var scale = 1;
            if (w) { scale = 1.0 * w / sw; }
            if (h) { var s = 1.0 * w / sw; if (s< scale) scale = s; }
            var pw = sw * scale;
            var ph = sw * scale;
            var bw = sw*(scale-1)*0.5;
            var bh = sh*(scale-1)*0.5;
            objElement.parent().css('width',pw);
            objElement.parent().css('height',ph);
            objElement.css('transform',"scale("+scale+")");
            objElement.css('margin',bh+"px "+bw+"px "+bh+"px "+bw+"px");
            objElement.css('width',sw);
            objElement.css('height',sh);
            
            callback();
        }, false);
        
        // now trigger loading the svg
        objElement.attr('data',src);
    };
    
    function init_attr (elem) {
        if (this.widgetname!='svg') return;
        elem.attr('svg-initialized',0);
    };
    
    function init_ui (elem) {
        if (this.widgetname!='svg') return;
        var me = this;
        var src = elem.data('src');
        var scale = elem.data('scale') || 1.0;
        // inspired by widget_knob:

        var n = 14;
        if(elem.hasClass('grande'))  { elem.data('height', n*4.5); }
        if(elem.hasClass('bigger'))  { elem.data('height', n*3.2); }
        if(elem.hasClass('bigplus')) { elem.data('height', n*2.7); }
        if(elem.hasClass('big'))     { elem.data('height', n*2.0); }
        if(elem.hasClass('large'))   { elem.data('height', n*1.5); }
        if(elem.hasClass('small'))   { elem.data('height', n*1.2); }
        if(elem.hasClass('normal'))  { elem.data('height', n*1.0); }
        if(elem.hasClass('mini'))    { elem.data('height', n*0.8); }

        elem.addClass('fa-stack');
        //elem.addClass('ftuisvgmaster');
        elem.css('width','100% !important');

        ftui.log(3,me.widgetname+": adding svg from src="+src);

        // make sure the svg gets sufficiently large area:
        /*
        var w=$(elem).parent().width();
        var h=$(elem).parent().height();
        */
        var subDiv = $('<i id="fg" class="svgsubdiv"></i>');
        subDiv.prependTo(elem);
        
        //elem.addClass('svgmaster');
        var w = elem.data('width');
        var h = elem.data('height');
        
        setupSVG(subDiv,src,w,h,function(){
            // callback after svg was loaded: update all elements
            elem.attr('svg-initialized',1);
            ftui.log(2,me.widgetname+": now ready: svg src='"+src);
            var elements = elem.find("div[data-type^='svg_']");
            var redraw= false;
            elements.each(function(){
                var elem= $(this);
                var module = queryPlugin(elem.attr('data-type'));
                ftui.log(1,me.widgetname+" update element "+elem.attr('data-object'));
                if (('update_elem' in module) && module.update_elem(elem)) redraw = true;
            });
            if (redraw) {
                ftui.log(2,"force redraw after svg ready");
                getSvgDoc(elem).innerHTML += ''; // force redraw
            }
        });
    };

    // mandatory function, get called after start up once and on every FHEM poll responce
    // here the widget get updated
    // 
    function update (dev,par) {
        var me = this;
        ftui.log(2,me.widgetname+":update() ");
        // do updates from reading for content
        var redraw = [];
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var svgDoc = getSvgDoc(elem);
            if (me.update_elem(elem) && svgDoc && !(svgDoc in redraw)) redraw.push(svgDoc);
        });
        
        for (var i = 0; i < redraw.length; i++) {
            ftui.log(2,"force redraw on svg after update()");
            redraw[i].innerHTML += ''; // force redraw
        }
    };

    /* update_elem() is the function called by update() or init_ui() when one of the svg_* widget divs need updating
     *
     */
    function update_elem(elem) {
        var me = this;
        var svgId = elem.data('object');
        if (!svgId) return me.log(false,1,me.widgetname+": missing data-object");
        var svgDoc = getSvgDoc(elem);
        if (!svgDoc) return me.log(false,3,me.widgetname+": svg not ready");
        var svgElem = $(svgDoc).find('#'+svgId);
        if (!svgElem || !svgElem.length) return me.log(false,1,me.widgetname+": svg knows nothing of "+svgId);
        ftui.log(3,me.widgetname+": update element "+svgId);
        return me.update_svg(elem,svgElem,svgDoc,svgId);
    };
    
    /* update_svg() is the function called by update() when one of the svg_* widget elements need updating
     *
     * overload this function in each svg_* widget to do the heavy lifting (change svg element)
     *
     * param elem: jQuery object of div-element resource 
     * param svgElem: jQuery object of referenced svg element
     * param svgDoc: DOM element of referenced svg document
     *
     * return true if svg redraw is required (e.g. if style attributes are changed), false if not
     */
    function update_svg(elem,svgElem,svgDoc) {
        return false;
    };

    // taken from widget_label.js, should reside in ftui ?
    function update_substitution(value, substitution) {
        var me = this;
        ftui.log(3,me.widgetname+' - value:'+value+', substitution:'+substitution);
        if(substitution){
            if ($.isArray(substitution)){
                for(var i=0, len=substitution.length; i<len; i+=2) {
                    if(value == substitution[i] && i+1<len)
                        return substitution[i+1];
                }
            }
            else if (substitution.match(/^s/)) {
                var f = substitution.substr(1,1);
                var subst = substitution.split(f);
                return value.replace(new RegExp(subst[1],subst[3]), subst[2]);
            }
            else if (substitution.match(/weekdayshort/))
                  return dateFromString(value).ee();
            else if (substitution.match(/.*\(\)/))
                  return eval('value.'+substitution);
        }
        return value;
    };

    // if in doubt, always return 0, 0 falls back to using state1 in interpolation
    function stateRatio(val, min, max) {
        if (val == null || !$.isNumeric(val)) return 0;
        if (min == null || !$.isNumeric(min)) return 0;
        if (max == null || !$.isNumeric(max)) return 0;
        var v = Number(val), a = Number(min), b = Number(max);
        if (a == b) return 0;
        if (v <= a) return 0;
        if (b <= v) return 1;
        return (v-a)/(b-a);
    };

    // taken from widget_label.js, should reside in ftui ?
    function update_fix(value, fix) {
        return ( $.isNumeric(value) && fix>=0 ) ? Number(value).toFixed(fix) : value;
    };

    function update_copy_attr(elem, name, value) {
        if (value.substr(0,1) == '@') {
            var svgId = value.substr(1);
            var svgElem = this.getSvgElem(elem, svgId);
            var val = svgElem.attr(name);
            return val;
        }
        return value;
    };


    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'svg',
        log:log,
        init_ui: init_ui,
        init_attr: init_attr,
        getSvgElem: getSvgElem,
        update: update, // do not override update in any svg_* widget!
        update_elem: update_elem,
        update_svg: update_svg,
        update_substitution: update_substitution,
        update_fix: update_fix,
        update_copy_attr: update_copy_attr,
        stateRatio: stateRatio,
    });
};
