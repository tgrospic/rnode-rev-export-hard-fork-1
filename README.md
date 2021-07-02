# RChain Hard Fork 1 validation setup

This repo contains scripts, configurations and instructions to verify export of REV balances from **RChain main net** network.

It has two steps:
1. Download **Last Finalized State** (LFS) of the network on which snapshot (export of REV balances) for **Hard Fork 1** is created. 
2. Run script -- to export REV balances in csv format.

NOTE: Setup is provided only for node running inside Docker container and tested on Ubuntu (20.04).

# Install

[install.sh](install.sh) script contains commands to install all necessary dependencies. It will also generate **.env** file with the default variables used by Docker Compose for easier modification.  
Script will try to find external IP address from network adapter.

```sh
curl https://raw.githubusercontent.com/tgrospic/rnode-rev-export-hard-fork-1/master/install.sh | bash
```

## Run

After all dependencies installed, RNode can be started with Docker Compose. Command must be executed in the same directory with [docker-compose.yml](docker-compose.yml) which contains RNode configuration.  
Part of the configuration will be generated with _install.sh_ script to **.env** file which is read by Docker Compose.

```sh
docker-compose up -d
```

# Install on cloud

In the [cloud](cloud) directory are initialization scripts which can be used when creating VPS machines on [Hetzner](https://community.hetzner.com/tutorials/basic-cloud-config) and [DigitalOcean](https://www.digitalocean.com/blog/automating-application-deployments-with-user-data/) cloud providers.

```yml
#cloud-config

# https://cloudinit.readthedocs.io/en/latest/topics/examples.html

# run commands
# https://cloudinit.readthedocs.io/en/latest/topics/examples.html#run-commands-on-first-boot
runcmd:
  - "curl https://raw.githubusercontent.com/tgrospic/rnode-rev-export-hard-fork-1/master/install.sh | bash"
```
