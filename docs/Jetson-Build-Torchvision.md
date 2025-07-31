# Jetson Orin Series Build Torchvision

Tested on JetPack 6.x, this is supposed to be executed after building the PyTorch (or installed the pre-build torch wheel).

+ Building tools like `cmake` and `ninja` are required.

+ `setuptools`, `wheel`, `numpy` (1.26.x) is usually required.

+ Install debian dependencies:

``` sh
sudo apt install libwebp-dev libjpeg-dev libpng-dev
```

Optionally, install NVJPEG:

Find the corresponding NVJPEG distribution under the below link (match your CUDA version)

https://developer.download.nvidia.cn/compute/cuda/redist/libnvjpeg/linux-aarch64/


For an example, running with JetPck 6.2, CUDA version `12.6`:

``` sh
wget https://developer.download.nvidia.cn/compute/cuda/redist/libnvjpeg/linux-aarch64/libnvjpeg-linux-aarch64-12.3.3.54-archive.tar.xz
```

To verify the CUDA version, you can download the file and extract to see the `.pc` file under the `pkg-config` directory to match the CUDA version.

Extract the file.

``` sh
sudo tar xvf libnvjpeg-linux-aarch64-12.3.3.54-archive.tar.xz
```

Copy (move) corresponding files to correct locations:

``` sh
cd libnvjpeg-linux-aarch64-12.3.3.54-archive
sudo cp -r include/* /usr/local/include
sudo cp -r lib/* /usr/local/lib

sudo mkdir -p /usr/local/lib/pkgconfig
sudo cp pkg-config/* /usr/local/lib/pkgconfig
```


Possibly add the pkg-config environment:

``` sh
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH
```

Test it with:

``` sh
$ pkg-config --cflags --libs nvjpeg-12.6
```

Also, add `/usr/local/lib` to `ldconfig`:

``` sh
$ sudo vim /etc/ld.so.conf
```

Add:

``` txt{2}
include /etc/ld.so.conf.d/*.conf
/usr/local/lib
```

Save the file and execute:

``` sh
sudo ldconfig
```

## Build Wheel

+ Clone the source code

``` sh
$ git clone https://github.com/pytorch/vision.git
```

+ Checkout corresponding version:

Check the [compatibility matrix](https://github.com/pytorch/vision/tree/release/0.22?tab=readme-ov-file#installation)

``` sh
$ git checkout release/0.20
```

+ Build

``` sh
$ python setup.py bdist_wheel
```

After building, locate the wheel file under `bdist` directory. Use pip install the file.


``` sh
$ pip install bdist/*.whl
```