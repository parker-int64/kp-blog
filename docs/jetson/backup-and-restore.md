# Backup and Restore on Jetson

By default, nvidia provide a convenient script under `tools/backup_restore` of your BSP directory, named `l4t_backup_restore.sh`

This script creates a backup image of a Jetson device or restores a Jetson device using a backup image.

```Shell
nvidia@nvidia:~/nv_jetpacks/Linux_for_Tegra$ ./tools/backup_restore/l4t_backup_restore.sh -h
Usage: l4t_backup_restore.sh -b [ -c ] <board-name>
       l4t_backup_restore.sh -r <board-name>

        This script creates a backup image of a Jetson device or restores a Jetson device using a backup image.

        This script should be run inside initramfs.

        Options:
                <board-name>                 Indicate which board to use.
                -u <PKC key file>            PKC key used for odm fused board.
                -v <SBK key file>            SBK key used for encryptions
                -h | --help : Display this message
                -e : Specify the device for backup
                -b : Generate the backup image and store it in /home/nvidia/nv_jetpacks/Linux_for_Tegra/tools/backup_restore/images
                -r : Restore the backup image from /home/nvidia/nv_jetpacks/Linux_for_Tegra/tools/backup_restore/images
                --raw-image ---------------- Specify the path of the raw disk image to be restored into storage device.
```


## Create a Backup

Different Jetson device may have different board name and customized BSP. But ultimately rely on the base BSP provided by NVidia. 

## Official Jetson Developer Kit

As the script usage showed, assuming that:

+ You are using Jetson Orin Nano Developer Kit
+ The Jetson BSP version is the same with the one on your board. For an example, you have downloaded BSP `Jetson_Linux_R36.4.0_aarch64.tbz2` and corresponding sample rootfs `Tegra_Linux_Sample-Root-Filesystem_R36.4.0_aarch64.tbz2`, which is JetPack 6.1 and you have flashed JetPack 6.1 to your Jetson device (Steps like assemble rootfs is a must).
+ You have made modifications to your device (like installed JetPack components, software packages and additional necessary changes to host your application), wish to create a backup for later recovery.
+ You have put your Jetson Orin Nano Developer Kit in force recovery mode.

::: details Custom modification example
We use `jtop` as an example, since it's not pre-installed on most JetPacks. If backup and restore worked as expected, you should be able to use it directly after the recovery.

```shell
sudo apt-get update && sudo apt-get install python3-pip
# To contaminant system dependencies, 
# it's not recommend to use 'sudo pip install jetson-stats'
python -m pip install --user --upgrade jetson-stats 
# Add directory to environment PATH:
echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```
Reboot your device and use `jtop` to view current status of your jetson device:

![jtop_r36.4.0_aarch64](/img/Jetson-Public/jtop_r36.4.0_aarch64.png)

:::


Connect the device with your Ubuntu host, under the BSP directory, enter the following command to create a backup for your Jetson device.


```Shell
sudo ./tools/backup_restore/l4t_backup_restore.sh -e nvme0n1 -b jetson-orin-nano-devkit
```


## Seeed's reComputer

Seeed's `mfi_rexxxx` doesn't contain this script. You'll need to download corresponding BSP and copy the files to mfi_rexxx directory. For an example, Seeed's reComputer J3011 on JetPack 6.1

Seeed's JetPack: mfi_recomputer-orin-nano-8g-j401-6.1-36.4.0-2024-12-04.tar.gz, once extracted, the BSP directory name: `mfi_recomputer-orin-j401`, you can:

+ Extract BSP from nvidia:

```shell
tar xvf  Jetson_Linux_R36.4.0_aarch64.tbz2
```

+ Copy the files to Seeed's BSP, but not overwrite the existing file

```shell
sudo cp -rn Linux_for_Tegra/* mfi_recomputer-orin-j401
```

+ Use `board name` provided by Seeed to continue the backup process

```Shell
sudo ./tools/backup_restore/l4t_backup_restore.sh -e nvme0n1 -b recomputer-orin-j401
```

> [!NOTE]
> During backup process, there might be different errors occurred. Fix these errors before continuing the process. Usually this related to missing files, or files cannot be found on designated path. 
1. When error suggest that files were missing under `rootfs` directory, it maybe because some symbolic links were broken due to path changes. Execute 
    ```Shell
    sudo ./apply_binary.sh
    ```
    again to reassemble the rootfs.

2. If you modified the kernel or kernel modules, use 
    ```shell
    sudo ./tools/l4t_update_initrd.sh
    ``` 
    to update the base initrd image and rootfs initrd image. This could be helpful if you can't mount NVMe SSD (missing `nvme` or other kernel modules) when booting .
3. Custom device tree files were missing, or not in correct place. Access Seeed's [repo](https://github.com/Seeed-Studio/Linux_for_Tegra) and select corresponding tag (e.g for JetPack 6.1, tag `r36.4.0`) and download the missing `dtb` files. For an example, download missing dtb/dtbo files for reComputer J3011 on JetPack 6.1

```Shell
# Install curl beforehand, download the file to corresponding directory, where error indicated
sudo curl -sLOf https://raw.githubusercontent.com/Seeed-Studio/Linux_for_Tegra/r36.4.0/kernel/dtb/tegra234-j401-p3768-0000%2Bp3767-0003-recomputer.dtb
sudo curl -sLOf https://raw.githubusercontent.com/Seeed-Studio/Linux_for_Tegra/blob/r36.4.0/kernel/dtb/tegra234-p3767-camera-p3768-imx219-dual-seeed.dtbo
```
During the process, the script will backup all the partitions:

![Backup Partitions](/img/Jetson-Backup-and-Restore/Backup_Partitions.png)

Wait until the backup process complete:

![Backup Complete](/img/Jetson-Backup-and-Restore/Backup_Complete.png)

## Restore

Set your device into force recovery mode, connect it to your Ubuntu host, under the BSP directory 

+ official developer kit:

```Shell
sudo ./tools/backup_restore/l4t_backup_restore.sh -e nvme0n1 -r jetson-orin-nano-devkit
```

+ Seeed's reComputer:

```Shell
sudo ./tools/backup_restore/l4t_backup_restore.sh -e nvme0n1 -r recomputer-orin-j401
```

The script will restore all the partitions:

![Restore Partitions](/img/Jetson-Backup-and-Restore/Restore_Partitions.png)

Again, wait until the process complete:

![Restore Complete](/img/Jetson-Backup-and-Restore/Restore_Complete.png)


Additionally, following cases have been tested for backup and restore:
+ On same device, restore the backup to SSD (consider most people use NVMe SSD as main storage device).
+ On same device, restore the backup to different SSD.
+ Restore the backup to **same type of carrier board**, with **Jetson module in same batch**, different SSDs.
