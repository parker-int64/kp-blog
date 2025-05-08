# Flash JetPack on Windows

This tutorial shows a possible way of flashing JetPack on Windows using WSL2.

::: warning
This is  **not** considered a stable solution, there won't be any active support. Use native Ubuntu host if you met errors.
:::


## Compatibility & Prerequisites

+ Windows 10 **1903** (with Build 18362.1049 or later) or newer is required (Include Windows 11). 
+ [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) is required.
+ [usbipd-win](https://github.com/dorssel/usbipd-win) version 4.x and above is required

::: info

You can check your Windows build version with following command

```sh [Powershell]
$ reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v CurrentBuild
```

to check your wsl version
```sh [Powershell]
% wsl -v
```

and check the usbipd version

```sh [Powershell]
$ usbipd --version
```

:::


+ WSL distributions recommended:

|JetPack Version|Recommended WSL Distributions|
|  :----:   |:----:                           |
|JetPack 4.x|Ubuntu 18.04                     |
|JetPack 5.x|Ubuntu 18.04/Ubuntu 20.04        |
|JetPack 6.x|Ubuntu 20.04/Ubuntu 22.04        |

Download distributions with your [Microsoft Store](https://apps.microsoft.com/search?query=ubuntu&hl=en-US&gl=US). Alternatively, you can use commandline to install the distribution:

```sh [Powershell]
# For example, install Ubuntu 22.04
$ wsl --install -d Ubuntu-22.04
```

+ Customized WSL kernel.

According to this [wiki](https://github.com/dorssel/usbipd-win/wiki/WSL-support), this is required in order to support different USB devices. By saying that, you can also use it for other purpose.

Check [here](./build-customized-wsl-kernel.md) if you wish to know how to build such customized kernel.

::: info
This example custom kernel `bzImage` we provided can be found through this [OneDrive link](https://seeedstudio88-my.sharepoint.com/:u:/g/personal/youjiang_yu_seeedstudio88_onmicrosoft_com/EUChZZNBCwFJilpwy9Q30tgBSLpf-M9CbNisZa1m1vmKVw?e=DdfKKG)

sha256: f249022feab9372d448d236a4401e087d0f150dd6b3367b571f0b9a703bd2d38
:::

## Replace Standard WSL Kernel

As mentioned above, we need customized kernel to operate with different USB devices. Whether using the example kernel we provided or build it yourself, we'll need to modify `.wslconfig` to enable this kernel.

Before replacing kernel, shutdown WSL

```sh
$ wsl --shutdown
```

+ If you are on Windows 11 (or some later Windows 10), open `WSL Settings` GUI application.


+ Alternatively, you can edit the following config file to replace the kernel

::: code-group

```sh [Powershell]
$ notepad $env:USERPROFILE\.wslconfig
```

```sh [CMD]
$ notepad %USERPROFILE%\.wslconfig
```
:::



Add the following contents under `[wsl2]`, for an example, if `bzImage` was saved under `D:\WSL_Kernel\`, the configuration file

```ini
[wsl2]
kernel=D:\\WSL_Kernel\\bzImage
```

After saving the configuration file, restart your WSL distribution and check the result.

```sh
# Check kernel information
$ uname -a

# Check RNDIS features
$ zcat /proc/config.gz | grep RNDIS
```

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/flash-jetpack-on-windows/check_custom_kernel.png" alt="check custom kernel" />


## Flash JetPack

Most steps are exactly the same with what you operate on native Ubuntu. Take reComputer J4012 as an example.

+ Download JetPack (possibly move it into WSL)

::: warning
When moving files from Windows to WSL, be careful with file permissions
For an example:
```sh
# move file from Windows drive to WSL storage
$ mv /mnt/c/User/seeed/Downloads/mfi_recomputer-<xxxx>.tar.gz ~
# revoke the execute permission
$ chmod -x mfi_recomputer-<xxxx>.tar.gz

# verify the sha256 checksum
$ sha256sum mfi_recomputer-<xxxx>.tar.gz
```
:::

+ Short `FEC` and `GND` pin and connect the power, USB-C data cable to your host. Your device will enter `force recovery` mode.
+ Open Powershell/CMD/Windows Terminal with Administrator privilege.
+ Check USB devices

```sh
$ usbipd list
```

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/flash-jetpack-on-windows/usbipd_list.png" alt="usbipd list all devices" />

+ As the screenshot showed above, our device is recognized and marked as `APX`. Meaning that the device has entered the force recovery mode, we will need to bind it and share it to WSL2.

```sh
$ usbipd bind -b 1-1 -f
```

> [!NOTE]
> Use `usbipd list` again, you will see that the `STATE` has changed to `Shared(forced)`

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/flash-jetpack-on-windows/usbipd_list_shared.png" alt="usbipd list all devices" />

```sh
$ usbipd attach -b 1-1 --wsl --auto-attach
```

You will see something like this:

```txt
usbipd: info: Using WSL distribution 'Ubuntu-22.04' to attach; the device will be available in all WSL 2 distributions.
usbipd: info: Using IP address 172.24.240.1 to reach the host.
usbipd: info: Starting endless attach loop; press Ctrl+C to quit.
WSL Attached
```

+ If you can see `WSL Attached`, then you have pass the USB device to WSL. You can launch WSL and use `lsusb` to check the device

```sh
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 002: ID 0955:7323 NVIDIA Corp. APX
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

The device have successfully connected to WSL.

+ Do flash

```sh
$ sudo ./tools/kernel_flash/l4t_initrd_flash.sh --flash-only --massflash 1 --network usb0  --showlogs
```

::: warning
`massflash`option has been deprecated. And make sure that you have installed the flash prerequisites.

```sh
$ sudo apt install qemu-user-static sshpass abootimg nfs-kernel-server libxml2-utils binutils -y
```
:::

You will see that the flash process has begun:

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/flash-jetpack-on-windows/flash_send_blob.png" alt="send blob" />


After `[0.3570 ] Sending blob`, your device should reboot. And Jetson device should became a `RNDIS` device in your `usbipd`:

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/flash-jetpack-on-windows/usbipd_rndis.png" alt="rndis device" />

Since we used `auto-attached` options, `usbipd` will help us attach the device to WSL once it rebooted. However, if your log shows no sign of reconnecting, you'll need check if the `BUSID` has changed. The following cases should be noted:

+ Once reboot, your device has been assigned to a new `BUSID`
+ Once rebooted, your device has changed to RNDIS device with same `BUSID`, but the `STATE` indicated that it's not shared. 

Therefore, you will need to manually bind the `Remote NDIS Compatible Device #XX` and attach it to WSL. Just like we bind and attach the APX device previously. Suppose the new BUSID was `1-14`:

```sh
$ usbipd bind -b 1-14 -f
```

And attach it:

```sh
$ usbipd attach -b 1-14 --wsl --auto-attach
```

Your flash process **will** continue.

<img class="h-auto mx-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800" src="/img/flash-jetpack-on-windows/flash_success.png" alt="flash successful" />

Once you successfully flashed the device, remove the jumper (or dupont wire) and reboot the device.
