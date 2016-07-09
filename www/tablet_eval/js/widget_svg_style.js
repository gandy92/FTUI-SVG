
// widget implementation starts here
// change 'Modul_svg_style' to 'Modul_mywidgetname'
// and 'widgetname:"svg_style",' to 'widgetname:"mywidgetname",'
// usage: <div data-type="svg_style" data-device="dummy1" data-get="volume"></div>

function depends_svg_style (){
    if(typeof Module_svg == 'undefined')
        return ["svg"];
};

var Modul_svg_style = function () {

    
    function init_attr (elem) {
        var me = this;

        elem.initData('get'  ,'STATE');
        elem.initData('states' ,'["off","on"]');
        elem.initData('styles' ,'["stroke:#2a2a2a","stroke:#e0e0e0"]');
        elem.initData('substitution', '');
        elem.data('fix', ( $.isNumeric(elem.data('fix')) ) ?  Number(elem.data('fix')) : -1);
        // data-style needs to be initialized _after_svg loading is done

        // subscribe my readings for updating
        me.addReading(elem,'get');
        ftui.log(2,me.widgetname+": adding element");
    };
    
    function init_ui (elem) {
    };

    function interpolate(val1,val2,ratio) {
        return val1;
    };

    // called by update_elem() which is in turn called by update(), both defined in widget_svg
    function update_svg(elem,svgElem,svgDoc,svgId) {
        var me = this;
        if (! elem.data('style')) {
            elem.data('style', svgElem.attr('style') ? svgElem.attr('style') : "");
            ftui.log(1,me.widgetname+': no fallback style, using current style "'+elem.data('style')+'"');
        }
        var style0= elem.data('style'); // fallback
        var states= elem.data('states');
        var styles= elem.data('styles');
        // fill up styles to states.length; if an index s isn't set, use the value of s-1
        // fill up one more in case we need it for interpolation
        for(var s=0,len=states.length; s<len+1; s++) {
            if(typeof styles[s] == 'undefined') {
                styles[s]=styles[s>0?s-1:0];
            }
        }

        //var state = elem.getReading('get').val;
        var state = (elem.hasClass('timestamp'))
                    ?elem.getReading('get').date
                    :elem.getReading('get').val;
        ftui.log(2,me.widgetname+': #'+svgId+' state: '+state);
        state = me.update_substitution(state, elem.data('substitution'));

        var style;
        var idx = indexOfGeneric(states,state);
        
        if (idx < 0) {
            style = style0;
        } else if (idx+1<states.length && elem.hasClass('interpolate')) {
            var ratio = me.stateRatio(state, states[idx], states[idx+1]);
            if (ratio == 0) {
                style = styles[idx];
            } else {
                style = interpolate(styles[idx], styles[idx+1], ratio);
            }
        } else {
            style = styles[idx];
        }

        style = me.update_copy_attr(elem, 'style', style);

        // iterate through all secified styles
        var substyles = style.split(';');
        for (var i=0,len=substyles.length; i<len; i++) {
            var keyval = substyles[i].split(':');
            if (keyval.length==2) {
                svgElem.css($.trim(keyval[0]), $.trim(keyval[1]));
                ftui.log(2,me.widgetname+': #'+svgId+'.style.'+keyval[0]+'= '+keyval[1]);
            }
        }
        return true; // request update of svg
    };
    
    // public
    // inherit all public members from base class
    return $.extend(new Modul_svg(), {
        //override or own public members
        widgetname: 'svg_style',
        init_attr: init_attr,
        init_ui: init_ui,
        update_svg: update_svg,
    });
};
