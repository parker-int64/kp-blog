# Install LiteRT (TensorFlow Lite) on your Raspberry Pi

In this tutorial, we're going to show how to install the **LiteRT** on Raspberry Pi. I have a RPi 4 available, so the remaining part would be conducted under it.

> [!NOTE]
> “LiteRT (short for Lite Runtime) is the new name for TensorFlow Lite (TFLite). While the name is new, it's still the same trusted, high-performance runtime for on-device AI, now with an expanded vision.”  
> [Check here](https://developers.googleblog.com/en/tensorflow-lite-is-now-litert/)

The LiteRT (TensorFlow Lite) is developed by google and has been widely used on many mobile devices(iOS, Android) or embedded devices(Micro-controllers).

## Setup connections

If you have your raspberry pi connected to your router, you can use `ssh` to access the device:

```shell
ssh pi@raspberrypi.local
```

According to the instructions on terminal, type your password.

Once you connected your pi, we can begin the installation process.

## Installation

Before we start, we should check if `Python` and `pip` are installed.

```shell
python -V
```
![check_python_ver](/img/Install-LiteRT-On-RPi/01_Check_Python_Ver.png)

```shell
pip --version
```
![check_pip_ver](/img/Install-LiteRT-On-RPi/02_Check_pip_Ver.png)

In case that you haven't install Python and pip, please execute the following command to install them.

```Shell
sudo apt-get install python3 python3-pip -y
```

Then, we create a virtual environment

```shell
python -m venv litert_venv
```

![setup_venv](/img/Install-LiteRT-On-RPi/03_Setup_Venv.png)

And activate the environment 

```shell
source ./litert_venv/bin/activate
```

::: details

You can upgrade your pip's version in your virtual environment

:::

