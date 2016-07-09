#!/bin/bash
rm -f controls_fhemtabletui_svg.txt
find ./www/tablet_eval -type d \( ! -iname ".*" \) | while read f; do
   out="DIR $f"
   echo ${out//.\//} >> controls_fhemtabletui_svg.txt
done
find ./www/tablet_eval -type f -printf "UPD %TY-%Tm-%Td_%TX %s %p\n"| sed -re s/\\.[0-9]+// -e s:\\./:: >> controls_fhemtabletui_svg.txt

# CHANGED file
echo "FHEM Tablet UI SVG widget last change:" > CHANGED
echo $(date +"%Y-%m-%d") >> CHANGED
echo " - $(git log -1 --pretty=%B)" >> CHANGED





