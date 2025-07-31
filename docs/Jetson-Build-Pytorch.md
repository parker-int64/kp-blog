# Jetson Orin Series Build PyTorch

The guide was directly from [Jetson Forum](https://forums.developer.nvidia.com/t/pytorch-for-jetson/72048)

The example build was performed on JetPack 6.2 (Jetson Linux R36.4.3), it has the following components:


|JetPack Component|Version|
|:----:|:----:|
|CUDA|12.6|
|cuDNN|9.3|
|TensorRT|10.3|
|VPI|3.2|
|Vulkan|1.3|
|OpenCV|4.8|

## Build PyTorch Wheel

+ As guided, turn on the MAXN (Super) mode for better performance

``` sh
sudo jetson_clocks

sudo nvpmodel -m 0
```

You may need to reboot to take effect


+ Clone the source code

``` sh
$ git clone --recursive --branch <version> http://github.com/pytorch/pytorch
```

In our case, JetPack 6.2 is compatible with torch 2.5:

``` sh
$ git clone --recursive --branch v2.5.1 http://github.com/pytorch/pytorch
```

::: info
If you are building under conda environment, please activate your environment beforehand.
:::

+ Change directory and prepare for build

``` sh
$ cd pytorch
$ export USE_NCCL=0
$ export USE_DISTRIBUTED=0                    # skip setting this if you want to enable OpenMPI backend
$ export USE_QNNPACK=0
$ export USE_PYTORCH_QNNPACK=0
# For Jetson Orin series
$ export TORCH_CUDA_ARCH_LIST="8.7"   
```

Python variables

``` sh
$ export PYTORCH_BUILD_VERSION=2.5.1  # without the leading 'v', e.g. 1.3.0 for PyTorch v1.3.0
$ export PYTORCH_BUILD_NUMBER=1
```

+ Install build dependencies

``` sh
$ sudo apt-get install libopenblas-dev libopenmpi-dev
$ pip install -r requirements.txt
$ pip install scikit-build
$ pip install cmake==3.24.0 ninja
$ python setup.py bdist_wheel
```

Additionally, on JetPack 6.x, `cuSPARSELt` is needed:

``` sh
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/arm64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install libcusparselt0 libcusparselt-dev
```

After building is complete, follow the prompt to install the wheel file that just build.

``` sh
$ pip install bdist/*.whl
```

## Build LibTorch Only

If you'd like to use `libtorch` only.

After cloning the source, use `cmake` to build the file:


``` sh
cd pytorch
mkdir build && cd build
```

+ Run `cmake` pre-configuration

``` sh
cmake .. -DCMAKE_BUILD_TYPE=Release \
         -DBUILD_PYTHON=OFF \
         -DBUILD_TEST=OFF \
         -DUSE_CUDA=ON \
         -DUSE_DISTRIBUTED=OFF \
          -DUSE_NCCL=OFF \
          -DTORCH_CUDA_ARCH_LIST="8.7" \
          -DUSE_PYTORCH_QNNPACK=OFF \
          -DUSE_XNNPACK=OFF -DUSE_NNPACK=OFF \
          -DBUILD_SHARED_LIBS=ON \
          -G "Ninja"
```

::: info
Add:
```
-DCUDA_NVRTC_LIB=/usr/local/cuda-12.6/targets/aarch64-linux/lib/libnvrtc.so \
-DCUDA_NVRTC_SHORTHASH=deadbeef
```
If you have some warnings with cuDNN.
:::

+ Build the file.

``` sh
$ cmake --build . --config Release --parallel
```

+ Install the LibTorch

``` sh
$ cmake --build . --config Release --target INSTALL --parallel
```

By default your libraries will be installed under `/usr/local`. You might need to configure your environment variables to correctly link the target.



