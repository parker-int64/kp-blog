# SDK Manager for Jetson Devices 适配说明

NVidia SDK Manager是NVidia开发的专为Jetson设备或者其他设备安装SDK （如CUDA, cuDNN等）的软件，参考其官网：

[SDK Manager](https://developer.nvidia.com/sdk-manager)

在NVidia的SDK Manager帮助说明中，有提到可以针对SDK Manager进行一定程度的定制:

+ [The Extra Configuration File](https://docs.nvidia.com/sdk-manager/extra-config-file/index.html)
+ [Adjust Hardware and Software JSON Manifest Files with NVIDIA SDK Manager](https://docs.nvidia.com/sdk-manager/adjust-json-manifest-files/index.html)

本文将会从两个方向讲述适配过程，即使用自定的配置文件和Jetson BSP打包


## 编写自己的配置文件

按照'Adjust Hardware and Software JSON Manifest Files with NVIDIA SDK Manager'一文中的说明，用户可以修改官方提供的JSON Manifest来适配自己的硬件和软件信息。此过程需要先初始化一遍SDK Manager，在安装完成SDK Manager后，运行

``` sh
sdkmanager
```

需要**登陆NVIDIA Developer账号**，当初始化完成进入选择界面后即可退出。



+ 复制配置文件

默认情况下，在完成初始化后会生成`~/.nvsdkm`目录，里面有两个比较重要的目录`dist`和`hwdata`。其中`dist`目录存放的是软件包信息，`hwdata`存放的是硬件信息。根据其目录结构，生成定制设备的目录结构（详细替换说明可以参考SDK Manager帮助文档）：

``` sh
# 创建软件目录
mkdir seeed-dist
# 复制和Jetson相关的软件目录
cp -r ~/.nvsdkm/{Deepstream,GXF,Jetson,main,SDKMANAGER} seeed-dist/
```

硬件目录

``` sh
# 创建硬件目录
mkdir -p seeed-hwdata/families/jetson/{devices,series}
# 复制最小结构
cp ~/.nvsdkm/hwdata/{sdkml1_repo_hw.json,sdkml2_jetson_hw.json} seeed-hwdata/

cp ~/.nvsdkm/hwdata/families/jetson/series/{jetson-orin-nano-targets.json,jetson-orin-nx-targets.json} seeed-hwdata/families/jetson/series/

cp ~/.nvsdkm/hwdata/families/jetson/devices/{jetson-orin-nano-8gb.json,jetson-orin-nx-16gb.json} seeed-hwdata/families/jetson/devices/
```

至此一个最小结构就复制完成了，接下来就是以复制的官方JSON文件为蓝本，修改配置文件


### 硬件目录修改

首先熟悉层级关系，查看如下文件：

::: info
只需要关心文件中和Jetson有关的部分即可
:::

`sdkml1_repo_hw.json`

``` json{7}
{
...
    "families": [
        ...
        {
            "name": "Jetson",
            "uri": "./sdkml2_jetson_hw.json"
        }
        ...
    ]
}
```

高亮行指向本地的`./sdkml2_jetson_hw.json`:

``` json{7,11}
{
...
    "series": [
...
        {
            "id": "JETSON_ORIN_NANO_TARGETS",
            "uri": "./families/jetson/series/jetson-orin-nano-targets.json"
        },
        {
            "id": "JETSON_ORIN_NX_TARGETS",
            "uri": "./families/jetson/series/jetson-orin-nx-targets.json"
        }
    ]
}
```

高亮行指向`./families/jetson/series/`下的`jetson-orin-nano-targets.json`和`jetson-orin-nx-targets.json`，以`jetson-orin-nano-targets.json`为例：

``` json{8,12,16}
{
...
    "hw": {
        "JETSON_ORIN_NANO_TARGETS": {
            "name": "Jetson Orin Nano modules",
            "devices": [
                {
                    "uri": "../devices/jetson-orin-nano-8gb.json",
                    "id": "JETSON_ORIN_NANO_8GB"
                },
                {
                    "uri": "../devices/jetson-orin-nano-4gb.json",
                    "id": "JETSON_ORIN_NANO_4GB"
                },
                {
                    "uri": "../devices/jetson-orin-nano-8gb-devkit.json",
                    "id": "JETSON_ORIN_NANO_8GB_DEVKIT"
                }
            ],
...
            "singularName": "Jetson Orin Nano module",
            "id": "JETSON_ORIN_NANO_TARGETS"
        }
    }
}
```

发现最终，`uri`指向了devices目录下面的json文件，这样一个基础的层级关系就出来了(甚至可以直接在此基础上拓展)：

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/SDKM-Adjust/hwdata_structure.jpg" />


首先需要修改路径，删掉多余的JSON Object，只保留Jetson相关内容，添加上自定义产品的内容，根据[Schema](https://developer.download.nvidia.cn/sdkmanager/resources/schemas/schemaRes_s23h1/index.html)里面的内容进行修改(参考着官方配置，结合Schema和SDK Manager的运行日志)

这里举个例子，譬如要添加reComputer Super系列产品：

1. 因为L1已经指向了L2，不需要额外修改，那么只需要在L2配置里面添加一个新文件`recomputer-super-targets.json` (可以复制`jetson-orin-nano-targets.json`然后修改)

``` sh
cd seeed-hwdata/families/jetson/series

cp ./jetson-orin-nano-targets.json ./recomputer-super-targets.json
```

2. 修改里面内容，根据Schema里面的说明，首先我们把`hw` Object里面的所有`JETSON_ORIN_NANO_TARGETS`修改为`RECOMPUTER_SUPER_TARGETS` (可替换搜索)。

3. 修改L3 - Device的路径，假设添加一个新的设备，名称为`recomputer-super-j4012.json`，将`uri`改为`../devices/recomputer-super-j4012.json`,其ID改为`RECOMPUTER_SUPER_J4012`。

``` json {3,7,8,15}
"hw": {
    ...
        "RECOMPUTER_SUPER_TARGETS": {
            "name": "reComputer Super devices",
            "devices": [
                {
                    "uri": "../devices/recomputer-super-j4012.json",
                    "id": "RECOMPUTER_SUPER_J4012"
                }
            ],
            "products": [
                "Jetson"
            ],
    ...
            "id": "RECOMPUTER_SUPER_TARGETS"
        }
    }
```

::: info
文件中的其他信息也可根据实际情况酌情更改
:::

4. 在devices目录下添加产品`recomputer-super-j4012.json` （可以复制`jetson-orin-nx-16gb.json`然后直接修改）

``` sh
cd ../devices
cp ./jetson-orin-nx-16gb.json ./recomputer-super-j4012.json
```

将里面的`JETSON_ORIN_NX_16GB`都改为`RECOMPUTER_SUPER_J4012`，其他信息也可以酌情修改


至此一个设备添加基本完成


### 软件目录修改

软件部分的适配，主要是让JetPack的组件，比如Jetson Linux，Sample rootfs和CUDA, cuDNN组件等支持之前编写的硬件Targets，比如如上的`RECOMPUTER_SUPER_TARGETS`。同样如硬件的Layer信息，软件也有自己的Layer信息，在`~/.nvsdkm/dist`文件夹下存放的就是软件适配信息。

观察其结构，入口是`main`文件夹下的`sdkml1_repo.json`，同样该文件中存放的有L2文件信息，结合之前做的更改，抽取出一个最小的案例，即仅仅包含Jetson：

+ 复制相关文件

``` sh
# 在seeed-hwdata同级目录下，创建'seeed-dist'文件夹及'main'子文件夹
mkdir -p seeed-dist/main

# 复制dist下的L1 config
cp ~/.nvsdkm/dist/main/sdkml1_repo.json seeed-dist/main/

# 复制L2 config
cp -r ~/.nvsdkm/dist/{GFX,Deepstream,Jetson,SDKMANAGER} seeed-dist/

```

+ 修改L1 config

打开`seeed-dist/main/sdkml1_repo.json`，删除没有用到的路径(`releasesIndexURL`)，只保留刚才复制文件的路径：


``` json
{
    "information": {
        "title": "SDK Manager supported releases index",
        "version": "12",
        "revision": 0,
        "serverConfigurationBuild": "1003D584J23C132DOCA"
    },
    "productCategories": [
        {
            "categoryName": "Jetson",
            "productLines": [
                {
                    "targetOS": "Linux",
                    "targetType": "",
                    "serverType": [
                        "PID",
                        "DEVZONE"
                    ],
                    "releasesIndexURL": "../Jetson/Linux/sdkml2_jetson_linux.json"
                }
            ]
        },
        {
            "categoryName": "Deepstream",
            "productLines": [
                {
                    "targetOS": "Linux",
                    "targetType": "",
                    "serverType": [
                        "PID",
                        "DEVZONE"
                    ],
                    "releasesIndexURL": "../Deepstream/Linux/sdkml2_deepstream_linux.json"
                }
            ]
        },
        {
            "categoryName": "Gxf",
            "productLines": [
                {
                    "targetOS": "Linux",
                    "targetType": "",
                    "serverType": [
                        "PID",
                        "DEVZONE"
                    ],
                    "releasesIndexURL": "../GXF/Linux/sdkml2_gxf_linux.json"
                }
            ]
        },
        {
            "categoryName": "SDK Manager",
            "productLines":[
                {
                    "targetOS": "",
                    "targetType": "",
                    "serverType": [
                        "PID",
                        "DEVZONE"
                    ],
                    "releasesIndexURL": "../SDKMANAGER/Linux/sdkml2_sdkmanager_linux.json"
                }
            ]
        }
    ]
}
```


+ 添加上刚刚配置的硬件信息

这一步可以使用批量搜索功能，在vscode的搜索界面搜索`targetHW`,`seriesId`等字样，发现已经有很多官方定义的TARGET，只需要在合适的地方加上我们自定义的TARGET即可

``` json{8}
...
"targetHW": [
                "JETSON_AGX_ORIN_TARGETS",
                "JETSON_ORIN_NX_TARGETS",
                "JETSON_ORIN_NANO_TARGETS",
                "IGX_ORIN_DEVKIT_DGPU_TARGETS",
                "IGX_ORIN_DEVKIT_IGPU_TARGETS"
                "RECOMPUTER_SUPER_TARGETS",
            ],
...
```

在进行sdkml3_jetpack修改之前，同硬件一样先看下L1/L2/L3结构图：

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/SDKM-Adjust/dist_structure.png" />

::: info
在L2 config - `sdkml2_jetson_linux.json`文件中能够找到`compRepoURL`key，其对应的值就是sdkml3_jetpack地址，对应不同的JetPack会有不同的URL，需要登陆SDK Manager之后才能下载（需要token下载）。如果地址不好找到，可以先跑一遍官方的sdkmanager (走到刷机之前的过程就行)，软件会将官方的sdkml3 config下载到`~/.nvsdkm`文件夹下，使用find命令搜索即可。

``` sh
find ~/.nvsdkm -name "sdkml3_jetpack_*.json"
```

然后选择自己想要的JetPack复制即可

:::

此处以JetPack 6.2为例，假设已经获取到了`sdkml3_jetpack_62_rev1.json`文件，比如存放在`seeed-jetpack-sdkml3`文件夹下，首先需要更改sdkml2里面的`compRepoURL`路径信息，让其使用相对路径指向这个sdkml3的文件(注意相对路径正确)：


``` json
"compRepoURL": "../../../seeed-jetpack-sdkml3/sdkml3_jetpack_62_rev1.json"
```

其次在`sdkml3_jetpack_62_rev1.json`文件中，找到`supportedHardware`下面的`seriesIds`，同样在合适的地方添加之前自定义的`RECOMPUTER_SUPER_TARGETS`:

``` json{7}
...
"supportedHardware": {
    "seriesIds": [
        "JETSON_AGX_ORIN_TARGETS",
        "JETSON_ORIN_NX_TARGETS",
        "JETSON_ORIN_NANO_TARGETS",
        "RECOMPUTER_SUPER_TARGETS",
    ]
},
...
```

找到所有合适的Object下面的`seriesIds`，需要都添加上

::: info
确认是不是合适的seriesIds，简单的方式就是看官方是怎么做的，在合适的产品处添加自定义TARGET即可
:::

## 使用配置文件

需要注意，sdkml1的config无法使用本地文件，因此必须要使用网络协议。可以使用Python自带的http服务器来进行本地host和测试：

``` sh
python3 -m http.server 8000
```

然后执行SDKManager

```sh 
sdkmanager --hw-server http://127.0.0.1:8000/seeed-hwdata/sdkml1_repo_hw.json --server http://127.0.0.1:8000/seeed-dist/main/sdkml1_repo.json
```

确认文件都可以使用http访问到，正常情况下，自定义的TARGET就会显示在SDK Manager中：

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/SDKM-Adjust/customized_sdkm.png" />

## BSP打包以及动态链接到自定义载板名称

目前没有一个特别合适的方案，需要再商讨

已经做过的尝试：

+ 手动将编译出来的内核、内核模块和各种文件打包到Linux_for_Tegra/kernel目录下的debian软件包中，确保之后执行`sudo ./apply_binaries.sh`的时候会将一些自定义的模块和内核安装到rootfs中去
+ 手动复制载板名称配置文件需要的dtb、dtsi、dtbo文件到Linux_for_Tegra/kernel/dtb文件下，确保刷机过程中不会缺少相关设备树配置文件
+ 以上操作完成后，重新打包Linux_for_Tegra目录（注意仅是BSP目录，不包含解压的rootfs），生成Jetson_Linux_{xxxx}.tbz2文件
+ 在`sdkml3_jetpack_*.json`中，更改Jetson_Linux_{xxxx}.tbz2的下载地址指向自己修改的文件地址，同时更改`md5sum`
+ 还需要在配置文件中，刷机脚本部分动态链接上载板名称：

``` json {12-29}
"commands": [
    "sudo tar -I lbzip2 -xpf {{FILE_PATH}}",
    "cd ..",
    "sudo ./tools/l4t_flash_prerequisites.sh",
    "sudo ./apply_binaries.sh",
    "if ! [ -f /proc/sys/fs/binfmt_misc/qemu-aarch64 ]; then",
    "  safe_apt_install \"sudo apt-get purge -y qemu-user-static\" 5",
    "  safe_apt_install \"sudo apt-get install -y qemu-user-static\" 5",
    "fi",
    "sudo mkdir -p rootfs/opt/nvidia/debs",
    "sudo mkdir -p rootfs/opt/nvidia/deb_repos",
    "BOARD_ID={{BOARD_ID}}",
    "case \"$BOARD_ID\" in",
    "  RECOMPUTER_CLASSIC_TARGETS)",
    "    echo 'Use reComputer Classic J401 config.'",
    "    ln -sf recomputer-orin-j401.conf jetson-orin-nano-devkit.conf ;;",
    "  RECOMPUTER_MINI_TARGETS)",
    "    echo 'Use reComputer Mini J401 config.'",
    "    ln -sf recomputer-orin-j401mini.conf jetson-orin-nano-devkit.conf ;;",
    "  RECOMPUTER_SUPER_TARGETS)",
    "    echo 'Use reComputer super J401 config.'",
    "    ln -sf recomputer-orin-super-j401.conf jetson-orin-nano-devkit.conf ;;",
    "  RECOMPUTER_INDUSTRIAL_TARGETS)",
    "    echo 'Use reComputer industrial J201 config.'",
    "    ln -sf recomputer-industrial-orin-j201.conf jetson-orin-nano-devkit.conf ;;",
    "  *)",
    "    echo 'Unknown BOARD_ID: $BOARD_ID'",
    "    exit 1;;",
    "esac",
    "sed -i '/# parse out target_board for initrd flash/i\\    sleep 15' nvsdkmanager_flash.sh"
]
```


::: info
为什么这里需要做一个链接：因为SDKManager默认使用的是Linux_for_Tegra文件夹下的`nvsdkmanager_flash.sh`脚本，而该脚本会调用`nvautoflash.sh`脚本，根据读到的SoM信息确定载板配置文件。而官方没有做自定义载板的适配，只用了`jetson-orin-nano-devkit.json`等链接文件（别名，实际文件指向的是`p3768-0000-p3767-0000-a0.conf`）。可以根据这个特性将链接更改到自定义载板上（只要使用的都是orin nano/nx模块）：

``` sh
ln -sf recomputer-orin-super-j401.conf jetson-orin-nano-devkit.conf
```

那么这样在后面调用`nvsdkmanager_flash.sh`时候，脚本就会默认使用自定义载板信息。

:::


以上过程确认能跑得通，原则上只需要更改BSP，重新打包发布自己的BSP，就可以做到契合SDK Manager生态。类似于rootfs、JetPack组件等都可以从nv官方下载，而不需要单独针对每一个载板，每一个JetPack封装一个镜像文件。