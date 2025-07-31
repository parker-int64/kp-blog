# Jetson Orin Series Build PCL (Point Cloud Library)

Refer to the official build guide [PCL Build From Source](https://pcl.readthedocs.io/projects/tutorials/en/latest/compiling_pcl_posix.html)

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


## Build PCL

+ Install necessary dependencies

``` sh
$ sudo apt update
$ sudo apt install -y \
    libeigen3-dev \
    libusb-1.0-0-dev \
    libopenni-dev \
    libopenni2-dev \
    libqhull-dev \
    libvtk9-dev \
    qtbase5-dev \
    libpcap-dev \
    libglew-dev \
    doxygen \
    graphviz \
    libboost-filesystem-dev \
    libboost-iostreams-dev \
    libboost-system-dev \
    zlib1g-dev \
    libpng-dev \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    libglx-dev
```


+ Clone the code

``` sh
$ git clone https://github.com/PointCloudLibrary/pcl.git
```

+ Configure the project

``` sh
$ cd pcl

$ mkdir build && cd build

$ cmake .. -DCMAKE_BUILD_TYPE=Release \
           -DPCL_SHARED_LIBS=ON \
           -DPCL_VERSION=1.13.1
```

+ Build the project

``` sh
$ make -j$(nproc)
```

+ Install

``` sh
$ sudo make install # sudo permission maybe required depending on your installation location
```


