# FTUI-SVG

Extension for FHEM-Tablet UI v2.2 to use SVG images as widget elements.

## Documentation

### Widget types
- **svg** : load and display a svg image
- **svg_style** : Manipulate style attributes of a svg element
- **svg_text** : Replace text of a svg element with a reading value

####SVG widgets
- **data-src**          : URL to the svg resource
- **data-width**        : maximum width
- **data-height**       : maximum height
- **class**             : small, large, big, bigger - emulate symbol sizes (based on font size 14px)

The loaded svg file will be scaled to fiteither width or height, or a box of width x height if both are specified.
Instead of specifying a height, a class similar to the symbol widget can be assigned. 
Additionally, for correct placement, use of a class col-x-y may be necessary.

Any child division of type svg_* (svg_style, svg_text, ...) may be used to manipulate individual elements of the svg.

####SVG_style widgets
- **data-get**          : name of the reading to get from FHEM
- **data-object**       : id of the svg element (parent div must be of type **svg**)
- **data-states**       : array of states
- **data-styles**       : array of styles related to the data-states array
- **data-style**        : fallback if none of the states matches (if not specified, original style in svg is used)
- **data-substitution** : multiple functions to replace the original value (see label widget)
- **class**             : timestamp (to retrieve readings timestamp rather than value)

If data-states is an array of numeric values V1,V2,V3,..., data-state is used for val<V1 and data-states[x] for Vx <= VAL< Vx+1

If an element in data-styles starts with '@', the rest of the string is interpreted as the id of another element in the same SVG,
from which the style is copied.

Todo:
-----
- **data-refresh**      : if periodic refresh is active, specify refresh interval in seconds (default 60)
- **class**             : interpolate (for numerical states only, interpolate styles between state values)

Use data-substitution="toDate().ago()" with reading timestamp to choose style according to readings age (update periodically)

####SVG_text widgets
- **data-get**          : name of the reading to get from FHEM
- **data-object**       : id of the svg element (parent div must be of type **svg**)
- **data-fix**          : keeping a specified number of decimals. (see label widget)
- **data-substitution** : multiple functions to replace the original value (see label widget)
- **class**             : timestamp (to retrieve readings timestamp rather than value)

Todo:
-----
- **data-unit**         : add a unit after a numeric value.
- **data-refresh**      : if periodic refresh is active, specify refresh interval in seconds (default 60)
- **class**             : interpolate (for numerical states only, interpolate paths between state values)

Use data-substitution="toDate().ago()" with reading timestamp to choose style according to readings age (update periodically)


## Future Plans

####SVG_path widgets

