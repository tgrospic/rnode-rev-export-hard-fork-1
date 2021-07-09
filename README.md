# RChain Hard Fork 1 validation setup

This repo contains scripts, configurations and instructions to verify export of REV balances from **RChain main net** network.

It has two steps:

### 1. Download **Last Finalized State** (LFS) of the network on which snapshot (export of REV balances) for **Hard Fork 1** is created. 

```sh
docker-compose up -d
```

### 2. Run **`state-balance-main`** command to export REV balances in *csv* format.

This command should be run after the whole state is downloaded. Before running export it is recommended to stop the node by running `docker-compose down`.

Export command is using separate Docker Compose config file ([docker-compose-export.yml](docker-compose-export.yml)) and ouput will be written in `./export/stateBalances.csv` file with the list of REV balances.
```sh
# Stop runnng node
docker-compose down

# Run export process
docker-compose -f docker-compose-export.yml up
```

RNode versions supported for this process are [`v0.10.2`][rnode-v0.10.2] and [`v0.11.0`][rnode-v0.11.0].

[rnode-v0.10.2]: https://github.com/rchain/rchain/releases/tag/v0.10.2
[rnode-v0.11.0]: https://github.com/rchain/rchain/releases/tag/v0.11.0

NOTE: Setup is provided only for node running inside Docker container and tested on Ubuntu (20.04).

## Install

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

## Install on cloud

In the [cloud](cloud) directory are initialization scripts which can be used when creating VPS machines on [Hetzner](https://community.hetzner.com/tutorials/basic-cloud-config) and [DigitalOcean](https://www.digitalocean.com/blog/automating-application-deployments-with-user-data/) cloud providers.

```yml
#cloud-config

# https://cloudinit.readthedocs.io/en/latest/topics/examples.html

# run commands
# https://cloudinit.readthedocs.io/en/latest/topics/examples.html#run-commands-on-first-boot
runcmd:
  - "curl https://raw.githubusercontent.com/tgrospic/rnode-rev-export-hard-fork-1/master/install.sh | bash"
```

## Expected dick size of the databases after full sync

Because of long period of quarantine in PoS contract, large amout of blocks are downloaded. One of the reasons for Hard Fork 1.

```sh
$ du -h --max-depth=1 rchain/data/rnode/
42G     rchain/data/rnode/rspace
52K     rchain/data/rnode/eval
66G     rchain/data/rnode/blockstorage
1.2M    rchain/data/rnode/casperbuffer
20K     rchain/data/rnode/deploystorage
5.4G    rchain/data/rnode/dagstorage
114G    rchain/data/rnode/
```
