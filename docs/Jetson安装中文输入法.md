# 在Jetson设备上安装中文语言包和中文输入法（搜狗拼音）

仅在JetPack 6.x上测试

安装中文语言包，并且设置中文，可以参考其他教程，此处不再赘述

+ 可以通过图形化界面设置，亦可通过命令行设置：

``` sh
$ sudo apt-get install language-pack-zh-hans
```

+ 将系统语言设置成中文

``` sh
$ sudo update-locale LANG=zh_CN.UTF-8
```

+ 添加环境变量

在/etc/profile中添加如下环境变量，对所有用户生效

``` sh
$ echo 'export LANG=zh_CN.utf8' >> /etc/profile
$ echo 'export LC_CTYPE="zh_CN.utf8"' >> /etc/profile
```

在`~/.bashrc`下添加，对当前用户生效

``` sh
$ echo 'export LANG=zh_CN.utf8' >> ~/.bashrc
$ echo 'export LC_CTYPE="zh_CN.utf8"' >> ~/.bashrc
```

重启生效

::: info
重启后，系统会询问是否将常用目录更改为中文名称，建议保持**英文** （选择「保留旧的名称」），因为此时输入法还没安装完成，没法在终端输入中文（`cd`切换目录都无法切换，除非右键「在此处打开终端」）
而且部分软件对于中文路径的适配不好
:::

## 搜狗拼音输入法

https://shurufa.sogou.com/linux

下载`arm64`的deb软件包

安装参考：https://shurufa.sogou.com/linux/guide


``` sh
$ sudo apt-get install fcitx
```

安装deb软件包

``` sh
$ sudo dpkg -i sogoupinyin_4.2.1.145_arm64.deb
```

如果遇见安装错误，可以使用

``` sh
$ sudo apt -f install
```

修复依赖问题。 除此之外，还需要安装：

``` sh
$ sudo apt install libqt5qml5 libqt5quick5 libqt5quickwidgets5 qml-module-qtquick2
$ sudo apt install libgsettings-qt1
``` 

最后，覆盖系统共享库文件至搜狗拼音目录：

``` sh
$ sudo cp /lib/aarch64-linux-gnu/libpangoft2-1.0.so.0 /opt/sogoupinyin/files/lib
$ sudo cp /lib/aarch64-linux-gnu/libpango-1.0.so.0 /opt/sogoupinyin/files/lib
```