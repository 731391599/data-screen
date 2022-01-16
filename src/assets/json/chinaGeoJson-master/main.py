#!/usr/bin/python3

#  Copyright 2020 huanggefan.cn
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.


import os
import json
import re
from urllib.request import urlopen
from urllib.request import Request

import geoJsonLib

html = geoJsonLib.get_html()
province_adcode_list = geoJsonLib.get_province_adcode_list(html)
city_adcode_list = geoJsonLib.get_city_adcode_list(html)
county_adcode_list = geoJsonLib.get_county_adcode_list(html)

province_geojson_list = []
city_geojson_list = []
county_geojson_list = []
Municipality_directly_under_the_Central_Government_geojson_list = []

# 北京 天津 重庆 上海
Municipality_directly_under_the_Central_Government = ['110000', '120000', '500000', '310000']

for adcodes in province_adcode_list:
    adcode = adcodes[0]
    adname = adcodes[1]
    geojson = geoJsonLib.get_geojson_full(adcode)
    province_geojson_list.append(
        (adcode, adname, geojson)
    )

for adcodes in city_adcode_list:
    adcode = adcodes[0]
    adname = adcodes[1]
    geojson = geoJsonLib.get_geojson_full(adcode)
    city_geojson_list.append(
        (adcode, adname, geojson)
    )

for adcodes in county_adcode_list:
    adcode = adcodes[0]
    adname = adcodes[1]
    geojson = geoJsonLib.get_geojson(adcode)
    county_geojson_list.append(
        (adcode, adname, geojson)
    )

for adcode in Municipality_directly_under_the_Central_Government:
    geojson = geoJsonLib.get_geojson(adcode)
    Municipality_directly_under_the_Central_Government_geojson_list.append(
        (adcode, geojson)
    )


def merge_all_province_full_geojson() -> str:
    geo = {"type": "FeatureCollection", "features": []}
    for geojsons in province_geojson_list:
        adcode = geojsons[0]
        geojson = geojsons[2]
        if adcode in Municipality_directly_under_the_Central_Government:
            for md in Municipality_directly_under_the_Central_Government_geojson_list:
                if md[0] == adcode:
                    geojson = md[1]
                    break
        obj = json.loads(geojson)
        geo["features"].extend(obj["features"])
    data = json.dumps(geo, ensure_ascii=False)
    return data


china_geojson = geoJsonLib.get_china_geojson()
china_full_geojson = merge_all_province_full_geojson()

with open("./data/china.json", 'w') as f:
    f.write(china_geojson)
with open("./data/china-full.json", 'w') as f:
    f.write(china_full_geojson)

for geojsons in province_geojson_list:
    adcode = geojsons[0]
    adname = geojsons[1]
    geojson = geojsons[2]
    geoJsonLib.write_province_geojson(adcode, adname, geojson)

for geojsons in county_geojson_list:
    adcode = geojsons[0]
    adname = geojsons[1]
    geojson = geojsons[2]
    geoJsonLib.write_county_geojson(adcode, adname, geojson)

for geojsons in city_geojson_list:
    adcode = geojsons[0]
    adname = geojsons[1]
    geojson = geojsons[2]
    geoJsonLib.write_city_geojson(adcode, adname, geojson)
