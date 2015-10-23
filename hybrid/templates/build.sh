#!/bin/bash

MOD_NAME="<%=config.name%>"
TAR="$MOD_NAME.tar.gz"

# add path
export PATH=/home/fis/npm/bin:$PATH
#show fis version
fis --version --no-color

#构建webapp代码
fis release -cuompDd output-webapp
#进入output-webapp目录
cd output-webapp
#删除产出的test目录
rm -rf test
#将output-webapp目录进行打包
mkdir webroot
mkdir webroot/static
mkdir webroot/static/<%=config.preName%>
mv ./static webroot/static/<%=config.preName%>/static
mv ./page webroot/static/<%=config.preName%>/page
mv ./offline-config.json webroot/static/<%=config.preName%>
mv ./webroot ../

cd ..
#读取版本信息
ver=`grep -w "version" offline-config.json | awk -F \" '{print $4}'`

#构建离线包
fis release -f fis-conf-offline.js -cuompDd output-hybrid
#进入output-hybrid目录
cd output-hybrid
#对该目录下的所有文件进行zip
zip -r <%=config.name%>.zip ./static ./page

#创建ini文件
echo "{\"md5\":" > config.json
echo "\""`md5sum <%=config.name%>.zip | awk -F " " '{print $1}'`"\"" >> config.json
echo ",\"version\":\""${ver}"\"}" >> config.json

OFFLINE_ZIP=${MOD_NAME}"_"${ver}".zip"
zip -r $OFFLINE_ZIP ./<%=config.name%>.zip ./config.json

#把zip包拷贝到webroot/static/<%=config.preName%>目录下
mv $OFFLINE_ZIP ../webroot/static/<%=config.preName%>

cd ..
tar zcf $TAR ./webroot

rm -rf ./webroot
rm -rf output-webapp
rm -rf output-hybrid
rm -rf <%=config.name%>

mkdir output

mv $TAR output/

echo "build end"
