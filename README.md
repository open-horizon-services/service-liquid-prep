# Service Liquid Prep

[![License: Apache 2](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Service Liquid Prep is an Open Horizon integration project for the [Liquid Prep App](https://liquid-prep-app.s3-web.us-east.cloud-object-storage.appdomain.cloud/), a Progressive Web App (PWA) that provides water advice for selected crops based on weather, crop, and soil moisture data.

## Overview

The Liquid Prep App, developed with the [Angular](https://angular.io/) web framework, retrieves weather and crop data from the [Liquid Prep Backend](https://github.com/Liquid-Prep/LiquidPrep-Backend) service and soil moisture data from the [Liquid Prep Hardware](https://github.com/Liquid-Prep/LiquidPrep-Hardware). After analyzing the weather, crop, and soil moisture data, the app computes and provides water advice for the selected crop.

The goal of Service Liquid Prep is to integrate the Liquid Prep App with Open Horizon by creating an Express server backend and using Dockerfiles for the supported platforms. This enables containerization of the Liquid Prep App as a service for edge computing, offering benefits such as improved resilience, security, sensors management, flexibility, and local storage. 

The integration with Open Horizon will also enrich the Liquid Prep App with additional features and allow it to perform certain tasks in real-time, even when it is offline. For example, visual inspections, analytics, and inferencing can be performed with machine learning on the edge device itself.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Authors](#authors)
- [License](#license)

## Prerequisites

To use Service Liquid Prep, you will need:

1. Node.js and NPM:
   - [Install Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Docker:
   - [Install Docker](https://docs.docker.com/engine/install/)
3. Open Horizon:
   - [Install Open Horizon](https://github.com/open-horizon/anax#installation)

## Installation

1. Clone the Service Liquid Prep repository:

```bash
git clone https://github.com/your-org/service-liquid-prep.git
cd service-liquid-prep
``` 

2. Install dependencies: 

```bash
npm install
```

3. Build the Docker image for the Service Liquid Prep: 

```bash
docker build -t service-liquid-prep
```

4. Set up the Open Horizon environment: 

- Follow the instructions in the [Open Horizon documentation](https://github.com/open-horizon/anax#installation) to set up and configure the Open Horizon environment on your edge device.

5. Deploy the Service Liquid Prep Docker container using Open Horizon:

```bash 
hzn exchange service publish -f service-liquid-prep.service.definition.json
hzn exchange pattern publish -f service-liquid-prep.pattern.json
hzn register --pattern <your-org>/service-liquid-prep-pattern
```

Replace `<your-org>` with your organization's name.

After completing these steps, the Service Liquid Prep will be installed and running on your edge device, integrated with Open Horizon.

## Usage

Once the Service Liquid Prep is installed and running on your edge device, it will provide an Express server backend for the Liquid Prep App. This backend communicates with the Liquid Prep Backend service and the Liquid Prep Hardware to retrieve the necessary data.

To use the Service Liquid Prep with the Liquid Prep App, update the `config.json` file of the Liquid Prep App with the appropriate Service Liquid Prep endpoint (e.g., `http://<your-edge-device-ip>:<express-server-port>`).

After updating the `config.json` file, you can use the Liquid Prep App to get water advice for the selected crop based on weather, crop, and soil moisture data, leveraging the benefits of edge computing provided by the Service Liquid Prep integration with Open Horizon. This integration also enables enriched features and real-time processing, allowing the app to perform tasks such as visual inspections, analytics, and inferencing using machine learning on the edge device, even when it is offline.



## Authors

Service Liquid Prep is maintained by:

- Troy Fine ([t-fine](https://github.com/t-fine)) - troy.fine@ibm.com
- Jeff Lu ([playground](https://github.com/playground)) - ljeff@us.ibm.com

For the full list of maintainers, see the [MAINTAINERS.md](MAINTAINERS.md) file.

## License

Unless otherwise noted, this project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details.
