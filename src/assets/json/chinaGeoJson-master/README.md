# 中国 GeoJson 数据

2019年12月中华人民共和国县以上行政区

## 版本

+ 数据版本 2019年12月
+ 更新时间 2020年03月


## 使用

```bash
git clone https://gitee.com/huanggefan/chinaGeoJson.git
cd chinaGeoJson/data
```

## 更新

```bash
make all
```

## 数据展示

1. https://cdn.huanggefan.cn/geojson/demo.html

2. https://cdn.huanggefan.cn/geojson/demo-full.html

## 数据详情

数据目录：chinaGeoJson/data

+ 一级行政区数据目录：chinaGeoJson/data/province
+ 地级行政区数据目录：chinaGeoJson/data/city
+ 县级行政区数据目录：chinaGeoJson/data/county

+ 包含一级行政区： 34
+ 包含地级行政区： 333
+ 包含县级行政区： 2845

+ china.json 仅包含省份信息，详见**数据展示1**
+ china-full.json 已合并所有地级行政区，详见**数据展示2**

## 数据来源

[中华人民共和国行政区划代码](http://www.mca.gov.cn/article/sj/xzqh)

[2019年12月中华人民共和国县以上行政区划代码](http://www.mca.gov.cn/article/sj/xzqh/2019/2019/202002261356.html)

[GeoJson来源-阿里云](http://datav.aliyun.com/tools/atlas/)

## 注意

获取部分县级行政区数据时，小部分发生404错误，因此县级行政区数据不完整。

## 免责

+ 本项目仅提供了获取中国所有行政区的GeoJson数据的思路。
+ 本项目包含的数据，仅用于展示，数据的使用与本项目无关。
+ 本项目不对使用本项目代码获取到的任何数据做任何准确性的保证。
