# Flash JetPack 5.1.1 with PCN patch.

This article is applied to reComputer Industrial J4012.

+ Download Seeed's JetPack 5.1.1

**Filename**: mfi_recomputer-orin-nx-16g-industrial-5.1-35.3.1-2023-08-05.tar.gz

**SHA256**: F6623A277E538F309999107297405E1378CF3791EA9FD19F91D263E3B4C88333

+ Extract the firmware

```sh
$ sudo tar xvpf mfi_recomputer-orin-nx-16g-industrial-5.1-35.3.1-2023-08-05.tar.gz
```

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/temp/Extract_JetPack.png" />

+ Download the PCN patch

This patch can be found on Jetson Linux [R35.3.1](https://developer.nvidia.com/embedded/jetson-linux-r3531) page

```sh
wget https://developer.nvidia.com/downloads/embedded/l4t/r35_release_v3.1/overlay_pcn210361_pcn210100_r35.3.1.tbz2
```

In case the PDF file cannot display the whole commandline, please refer the following plain text and photos

wget https://developer.nvidia.com/downloads/embedded/l4t/r35_release_v3.1/overlay_pcn210361_pcn210100_r35.3.1.tbz2

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/temp/download_patch.png" />

+ Extract the patch

```sh
$ tar xvf overlay_pcn210361_pcn210100_r35.3.1.tbz2
```

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/temp/extract_pcn.png" />

Once extraction finished, you should be able to get two folder, `mfi_recomputer-orin-industrial` and `Linux_for_Tegra`

+ Copy the patch contents to Seeed's firmware.

```sh
$ sudo cp -r Linux_for_Tegra/* mfi_recomputer-orin-industrial
```

+ Try flashing

```sh
$ sudo ./tools/kernel_flash/l4t_initrd_flash.sh --flash-only --massflash 1 --network usb0 --showlogs
```

The flash command is the same with wiki, in case the PDF file cannot display the codeblock completely

See if you can flash the JetPack 5.1.1 successfully.

