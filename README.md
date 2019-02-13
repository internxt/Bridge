Internxt Bridge
=======================================================================================================

[![Build Status](https://img.shields.io/travis/Internxt/bridge.svg?style=flat-square)](https://travis-ci.org/Storj/bridge)
[![Coverage Status](https://img.shields.io/coveralls/Internxt/bridge.svg?style=flat-square)](https://coveralls.io/r/Storj/bridge)
[![NPM](https://img.shields.io/npm/v/internxt-bridge.svg?style=flat-square)](https://www.npmjs.com/package/internxt-bridge)
[![GitHub license](https://img.shields.io/badge/license-AGPLv3-blue.svg?style=flat-square)](https://raw.githubusercontent.com/Internxt/data-api/master/LICENSE)


Quick Start
-----------

Install MongoDB, Git and Wget:

```
apt-get install mongodb redis-server git wget
```

Install NVM, Node.js and NPM:

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash
source ~/.profile
nvm install --lts
```

Clone the repository, install dependencies:

```
git clone https://github.com/Internxt/bridge.git && cd bridge
npm install && npm link
```

Start the server (set the `NODE_ENV` environment variable to specify the config):

```
NODE_ENV=develop internxt-bridge
```

> **Note:** Internxt Bridge cannot communicate with the network on it's own, but 
> instead must communicate with a running 
> [Internxt Complex](https://github.com/Internxt/complex) instance.

This will use the configuration file located at `~/.internxt-bridge/config/develop.json`.

Windows
-------

Install utilizing automated script

```
https://github.com/Storj/storj-automation/archive/master.zip
```

The default configuration can be modified as needed.  It is located at

```
%USERPROFILE%\.storj-bridge\config
```


Terms
-----

This software is released for testing purposes only. We make no guarantees with
respect to its function. By using this software you agree that Internxt is not
liable for any damage to your system. You also agree not to upload illegal
content, content that infringes on other's IP, or information that would be
protected by HIPAA, FERPA, or any similar standard. Generally speaking, you
agree to test the software responsibly. We'd love to hear feedback too.
