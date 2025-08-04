# Configure IMX219 and IMX477 on reComputer J30/40

Test is performed on JetPack 6.x


Seeed has made modifications to the device tree to cooperate with reComputer (Classic) J30/40 to use IMX219/IMX477 camera. To use these cameras on JetPack 6, additional changes will be needed.

The below examples were demonstrated on JetPack 6.2 (Jetson Linux R36.4.3)

## IMX219

+ Download the device tree overlay file.

``` sh
# Create a workspace
$ mkdir overlay
$ cd overlay

# Download device tree overlay
$ wget -L https://raw.github.com/Seeed-Studio/Linux_for_Tegra/r36.4.3/source/hardware/nvidia/t23x/nv-public/overlay/tegra234-p3767-camera-p3768-imx219-dual-seeed.dts

# create a workspace structure for later building
$ mkdir dt-bindings
$ cd dt-bindings

# download the include file
$ wget -L https://raw.github.com/Seeed-Studio/Linux_for_Tegra/r36.4.3/source/hardware/nvidia/t23x/nv-public/include/platforms/dt-bindings/tegra234-p3767-0000-common.h
```

::: info
The device tree include file `tegra234-camera-rbpcv2-imx219.dtsi` was a part of NVidia's official BSP source, our repo didn't provide them. If you need to download and extract the file you want, navigate to your current BSP page, for an example, JetPack 6.2 (Jetson Linux R36.4.3):
https://developer.nvidia.com/embedded/jetson-linux-r3643

Download the Driver Package (BSP) Sources:

``` sh
$ wget https://developer.nvidia.com/downloads/embedded/l4t/r36_release_v4.3/sources/public_sources.tbz2
```

And extract the BSP source (oot modules). Use `find` command to locate the path of the file you need and copy the file to `overlay` workspace

``` sh
# extract the source
$ tar xf public_sources.tbz2

# continue extract the kernel out of tree module source
$ cd Linux_for_Tegra/source
$ tar xf kernel_oot_modules_src.tbz2

# Use find command to find your file
$ find ./ -iname tegra234-camera-rbpcv2-imx219.dtsi

# copy the file to workspace folder
$ cp \<PATH_to_Your_File\> ~/overlay/

```
Most of the device tree include files or header files were placed under `/usr/src/linux-headers-5.15.148-tegra-ubuntu22.04_aarch64/3rdparty/canonical/linux-jammy/kernel-source/include`. But you may need the official BSP source for out of tree module files.

:::

+ Compile the device tree overlay

``` sh
# back to workspace root folder
$ cd ..
# use cpp for pre-process
$ cpp -nostdinc -I ./ \
      -I /usr/src/linux-headers-5.15.148-tegra-ubuntu22.04_aarch64/3rdparty/canonical/linux-jammy/kernel-source/include \
      -undef -x assembler-with-cpp \
      tegra234-p3767-camera-p3768-imx219-dual-seeed.dts \
      -o tegra234-p3767-camera-p3768-imx219-dual-seeed.dts.pp

# compile
$ dtc -I dts -O dtb -o tegra234-p3767-camera-p3768-imx219-dual-seeed.dtbo tegra234-p3767-camera-p3768-imx219-dual-seeed.dts.pp
```


+ Copy the device tree blob overlay to `/boot` folder

``` sh
$ sudo cp tegra234-p3767-camera-p3768-imx219-dual-seeed.dtbo /boot
```

### Use Jetson IO to configure the CSI Pins

Since our overlay file was copied to `/boot` folder, we can use Jetson IO to configure the pins.

Launch Jetson IO with

``` sh
sudo /opt/nvidia/jetson-io/jetson-io.py
```

Select:

-> `Configure Jetson 24pin CSI Connector` 

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/Configure-Camera/jetson-io_entry.png" />

-> `Configure for compatible hardware` 

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/Configure-Camera/jetson-io_configure_csi.png" />

-> `Camera IMX219 Dual Seeed` 

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/Configure-Camera/jetson-io_configure_imx219_seeed.png" />

-> `Save pin changes`

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/Configure-Camera/jetson-io_save_pin_config.png" />

After this, you can either reboot now with `Save and reboot to reconfigure pins` or save and exit without rebooting.

<img class="h-auto mx-auto max-w-xl rounded-lg pb-10" src="/img/Configure-Camera/jetson-io_save_and_reboot.png" />

<img class="h-auto mx-auto max-w-xl rounded-lg pb-10" src="/img/Configure-Camera/jetson-io_finish_prompt.png" />


### Selecting the overlay.

The device tree overlay was compiled to main device tree binary when booted, the Jetson UEFI will ask you which configurations you wish to load. Here we select the configurations we want.

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/Configure-Camera/uefi_select_imx219.jpg" />

In above boot process, select `1: Custom Header Config: <CSI Camera IMX219 Dual Seeed>`


::: info
Usually, if you made modifications with Jetson IO, jetson will boot with your configurations by default, but if you faced the issue when booting, you can press `0` to enter primary kernel and fix the errors before continuing.
:::

## IMX477

+ Download the device tree overlay file.

``` sh
# Create a workspace
$ mkdir overlay
$ cd overlay
# Download device tree overlay
$ wget -L https://raw.github.com/Seeed-Studio/Linux_for_Tegra/r36.4.3/source/hardware/nvidia/t23x/nv-public/overlay/tegra234-p3767-camera-p3768-imx477-dual-seeed.dts
# create a workspace structure for later building
$ mkdir dt-bindings
$ cd dt-bindings
# download the include file
$ wget -L https://raw.github.com/Seeed-Studio/Linux_for_Tegra/r36.4.3/source/hardware/nvidia/t23x/nv-public/include/platforms/dt-bindings/tegra234-p3767-0000-common.h
```

+ Compile the device tree overlay

``` sh
# back to workspace root folder
$ cd ..
# use cpp for pre-process
$ cpp -nostdinc -I ./ \
      -I /usr/src/linux-headers-5.15.148-tegra-ubuntu22.04_aarch64/3rdparty/canonical/linux-jammy/kernel-source/include \
      -undef -x assembler-with-cpp \
      tegra234-p3767-camera-p3768-imx477-dual-seeed.dts \
      -o tegra234-p3767-camera-p3768-imx477-dual-seeed.dts.pp

# compile
$ dtc -I dts -O dtb -o tegra234-p3767-camera-p3768-imx477-dual-seeed.dtbo tegra234-p3767-camera-p3768-imx477-dual-seeed.dts.pp
```

+ Copy the device tree blob overlay to `/boot` folder

``` sh
$ sudo cp tegra234-p3767-camera-p3768-imx477-dual-seeed.dtbo /boot
```

::: info
All changes have been published on Seeed's Linux_for_Tegra [repo](https://github.com/Seeed-Studio/Linux_for_Tegra). You can select different Jetson Linux branch and see the modifications.
:::


### Use Jetson IO to configure the CSI Pins

Since our overlay file was copied to `/boot` folder, we can use Jetson IO to configure the pins.

Launch Jetson IO with

``` sh
sudo /opt/nvidia/jetson-io/jetson-io.py
```

Select:

`Configure Jetson 24pin CSI Connector` -> `Configure for compatible hardware` -> `Camera IMX477 Dual Seeed` -> `Save pin changes`

After this, you can either reboot now with `Save and reboot to reconfigure pins` or save and exit without rebooting.

::: info
When you save the configuration, the corresponding boot parameters will be written to `/boot/extlinux/extlinux.conf` (LABEL JetsonIO)

<img class="h-auto mx-auto max-w-xl" src="/img/Configure-Camera/extlinux.png" />

:::

### Selecting the overlay.

The device tree overlay was compiled to main device tree binary when booted, the Jetson UEFI will ask you which configurations you wish to load. Here we select the configurations we want.

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/Configure-Camera/uefi_select_imx219.jpg" />

In above boot process, select `1: Custom Header Config: <CSI Camera IMX477 Dual Seeed>`


::: info
Usually, if you made modifications with Jetson IO, jetson will boot with your configurations by default, but if you faced the issue when booting, you can press `0` to enter primary kernel and fix the errors before continuing.
:::

## Test the device

Connect the IMX219/IMX477 (MIPI CSI is not designed for hot-plugging, so please power off the device before connecting the camera, and then power it back on) and run

``` sh
nvgstcapture-1.0
```
+ IMX 219

<img class="h-auto mx-auto max-w-sm pb-10 rounded-lg" src="/img/Configure-Camera/cam0_connect_imx219.jpg" />

<img class="h-auto mx-auto max-w-sm pb-10 rounded-lg" src="/img/Configure-Camera/cam1_connect_imx219.jpg" />

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/Configure-Camera/imx219_result.png" />

+ IMX 477 CAM 0

<img class="h-auto mx-auto max-w-sm pb-10 rounded-lg" src="/img/Configure-Camera/cam0_connect_imx477.jpg" />


<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/Configure-Camera/cam0_imx477.png" />


+ IMX477 CAM 1

<img class="h-auto mx-auto max-w-sm pb-10 rounded-lg" src="/img/Configure-Camera/cam1_connect_imx477.jpg" />

<img class="h-auto mx-auto max-w-xl rounded-lg" src="/img/Configure-Camera/cam1_imx477.png" />



