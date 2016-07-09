
// widget implementation starts here
// change 'Modul_svg_text' to 'Modul_mywidgetname'
// and 'widgetname:"svg_text",' to 'widgetname:"mywidgetname",'
// usage: <div data-type="svg_text" data-device="dummy1" data-get="volume"></div>

function depends_svg_text (){
    if(typeof Module_svg == 'undefined')
        return ["svg"];
};

var Modul_svg_text = function () {

    function init_attr (elem) {
        var me = this;
        elem.initData('get'  ,'STATE');
        elem.initData('substitution', '');
        elem.data('fix', ( $.isNumeric(elem.data('fix')) ) ?  Number(elem.data('fix')) : -1);
        me.addReading(elem,'get');
        ftui.log(2,me.widgetname+": adding element");
    };
    
    function init_ui (elem) {
    };

    // called by update_elem() which is in turn called by update(), both defined in widget_svg
    function update_svg(elem,svgElem,svgDoc,svgId) {
        var me = this;
        //var val = elem.getReading('get').val;
        var val = (elem.hasClass('timestamp'))
                  ?elem.getReading('get').date
                  :elem.getReading('get').val;

        val = me.update_substitution(val, elem.data('substitution'));
        val = me.update_fix(val, elem.data('fix'));
        
        ftui.log(2,me.widgetname+': val: '+val);
        svgElem.html(val);
        return false; // no update required
    };

    // public
    // inherit all public members from base class
    return $.extend(new Modul_svg(), {
        //override or own public members
        widgetname: 'svg_text',
        init_attr: init_attr,
        init_ui: init_ui,
        update_svg: update_svg,
    });
};
