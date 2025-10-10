# Jetson Orin Series Build Open3D

Refer to the official build guide [Open3D: Build From Source](https://www.open3d.org/docs/latest/compilation.html)

Jetson meet most of the requirements as the above guide mentioned.

The example build was performed on JetPack 6.2 (Jetson Linux R36.4.3), it has the following components:


|JetPack Component|Version|
|:----:|:----:|
|CUDA|12.6|
|cuDNN|9.3|
|TensorRT|10.3|
|VPI|3.2|
|Vulkan|1.3|
|OpenCV|4.8|

Additionally, `torch` is necessary, make sure you have configured and installed it previously.

+ Clone the code

``` sh
$ git clone https://github.com/isl-org/Open3D
```

``` sh
$ git clone https://github.com/isl-org/Open3D-ML
```

+ Install necessary dependency

``` sh
$ cd Open3D
$ util/install_deps_ubuntu.sh
```

::: info
If you are building under conda environment, please activate your environment beforehand.
:::

+ Using cmake to configure the project.

``` sh
$ mkdir build && cd build
$ cmake ..  -DCMAKE_BUILD_TYPE=Release \
            -DBUILD_CUDA_MODULE=ON \
            -DGLIBCXX_USE_CXX11_ABI=OFF \
            -DBUILD_PYTORCH_OPS=ON \
            -DBUILD_TENSORFLOW_OPS=OFF \
            -DBUNDLE_OPEN3D_ML=ON \
            -DBUILD_SHARED_LIBS=ON \
            -DOPEN3D_ML_ROOT=$(pwd)/../../Open3D-ML
```


+ Build the project

``` sh
$ make -j$(nproc)
```

+ Install Open3D C++ Library

``` sh
$ sudo make install # sudo permission maybe required, depend on install location
```

+ Make Python package and install.

``` sh
# Install pip package in the current python environment
$ make install-pip-package

# Create Python package in build/lib
$ make python-package

# Create pip wheel in build/lib
# This creates a .whl file that you can install manually.
$ make pip-package
```

> [!NOTE]
> Due to memory constrains, when installing there might be some error, try
>
> ``` sh
> $ export LD_PRELOAD=$(pwd)/build/lib/Release/cuda/open3d_torch_ops.so
> ```
> and then continue the installing

