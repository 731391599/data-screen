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

from urllib.request import urlopen
from urllib.request import Request

from re import findall
from re import match


def get_html() -> str:
    url = 'http://www.mca.gov.cn/article/sj/xzqh/2019/2019/202002261356.html'
    html = urlopen(url, timeout=10).read().decode()
    html = html.replace('\r\n', '')
    html = html.replace(' ', '')
    html = html.replace('"', '')
    html = html.replace("'", '')
    html = html.replace("\xa0", '*')
    a = findall(r'<trheight=19style=mso-height-source:userset;height:14.25pt>.*?</tr>', html)
    html = '\n\n\n\n\n'.join(a)
    return html


def get_county_adcode_list(html: str) -> list:
    result = findall(r'.*?<tdclass=xl7119292>(\d+)</td><tdclass=xl7119292><span.*?>\*\*</span>(.*?)</td>.*?', html)
    return result


def get_city_adcode_list(html: str) -> list:
    result = findall(r'.*?<tdclass=xl7019292>(\d+)</td><tdclass=xl7019292><span.*?>\*</span>(.*?)</td>.*?', html)
    return result


def get_province_adcode_list(html: str) -> list:
    result = findall(r'.*?<tdclass=xl7019292>(\d\d0000)</td><tdclass=xl7019292>((?!<spanstyle).*?)</td>.*?', html)
    return result


def write_county_geojson(adcode: str, adname: str, geojson: str):
    _write("./data/county", adcode, adname, geojson)


def write_city_geojson(adcode: str, adname: str, geojson: str):
    _write("./data/city", adcode, adname, geojson)


def write_province_geojson(adcode: str, adname: str, geojson: str):
    _write("./data/province", adcode, adname, geojson)


def _write(dir: str, adcode: str, adname: str, geojson):
    adname = adname.replace('<spanstyle=mso-spacerun:yes>*</span>', '')
    adname = adname.replace('<spanstyle=mso-spacerun:yes>**</span>', '')
    adname = adname.replace('<spanstyle=mso-spacerun:yes>***</span>', '')
    filename = "{}/{}-{}.json"
    file = filename.format(dir, adcode, adname)
    fd = open(file, 'w')
    fd.write(geojson)
    fd.close()


_headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Appl'
                  'eWebKit/537.36 (KHTML, like Gecko) U'
                  'buntu Chromium/80.0.3987.87 Chrome/8'
                  '0.0.3987.87 Safari/537.36',
    'cookie': 'isg=BCQkksjtJuGiB1Kt5VRZyhcZ9SsWvUgnp3vv'
              'wD5Bcu-y6dOzdc1KtUgAqUFxaIB_; l=dB_oxlpu'
              'Qw2ug3upBOfBNkYyvfQ9ZCRjfRFzthKJyICP97fB'
              '77JGWZ4zYRY6CnGVn6Y2Y3JY_7dpBMZH0z1-nxv9'
              '-16ZUCpqbBYh.',
    'dnt': '1',
    'pragma': 'no-cache',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache'
}


def get_china_geojson() -> str:
    url = 'https://geo.datav.aliyun.com/areas/bound/100000_full.json'
    geojson = urlopen(url, timeout=10).read().decode()
    return geojson


def get_geojson_full(adcode: str) -> str:
    url = 'https://geo.datav.aliyun.com/areas/bound/{}_full.json'
    now = url.format(adcode)
    return _get_geojson(now, adcode)


def get_geojson(adcode: str) -> str:
    url = 'https://geo.datav.aliyun.com/areas/bound/{}.json'
    now = url.format(adcode)
    return _get_geojson(now, adcode)


def _get_geojson(url: str, adcode: str) -> str:
    geojson = ""
    request = Request(
        method="GET",
        headers=_headers,
        url=url
    )
    try:
        print(adcode)
        geojson = urlopen(request, timeout=10).read().decode()
    except Exception as e:
        print(e, adcode)
    return geojson
