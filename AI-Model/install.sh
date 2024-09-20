#!/bin/bash

# Check if nvidia-ctk is installed
if ! command -v nvidia-ctk &> /dev/null; then
    echo "nvidia-ctk not found, proceeding with NVIDIA Container Toolkit installation."

    curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \
        | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
    curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \
        | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \
        | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
    sudo apt-get update
    sudo apt-get install -y nvidia-container-toolkit

    echo "NVIDIA Container Toolkit installed."
else
    echo "nvidia-ctk already installed, skipping installation."
fi

echo "Configuring Docker to use the NVIDIA runtime."
sudo nvidia-ctk runtime configure --runtime=docker

sudo systemctl restart docker
echo "Docker daemon configured with NVIDIA runtime."
