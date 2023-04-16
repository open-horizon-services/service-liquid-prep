# Service Liquid Prep

[![License: Apache 2](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Service Liquid Prep is an Open Horizon integration project for the [Liquid Prep App](https://liquid-prep-app.s3-web.us-east.cloud-object-storage.appdomain.cloud/), a Progressive Web App (PWA) that provides water advice for selected crops based on weather, crop, and soil moisture data.

## Overview

The Liquid Prep App, developed with the [Angular](https://angular.io/) web framework, retrieves weather and crop data from the [Liquid Prep Backend](https://github.com/Liquid-Prep/LiquidPrep-Backend) service and soil moisture data from the [Liquid Prep Hardware](https://github.com/Liquid-Prep/LiquidPrep-Hardware). After analyzing the weather, crop, and soil moisture data, the app computes and provides water advice for the selected crop.

The goal of Service Liquid Prep is to integrate the Liquid Prep App with Open Horizon by creating an Express server backend and using Dockerfiles for the supported platforms. This enables containerization of the Liquid Prep App as a service for edge computing, offering benefits such as improved resilience, security, sensors management, flexibility, and local storage.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Advanced Details](#advanced-details)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)

## Prerequisites

[//]: # (List the prerequisites for using the project, such as required software, hardware, or skills)

TBD

## Installation

[//]: # (Provide step-by-step instructions for installing the project)

TBD

## Usage

[//]: # (Explain how to use the project, including any available configuration options and examples)

TBD

## Advanced Details

[//]: # (Include any advanced usage details or technical information about the project)

TBD

## Contributing

[//]: # (Provide instructions for contributing to the project, including any special guidelines or steps)

TBD

## Authors

Service Liquid Prep is maintained by:

- Troy Fine ([t-fine](https://github.com/t-fine)) - troy.fine@ibm.com
- Jeff Lu ([playground](https://github.com/playground)) - ljeff@us.ibm.com

For the full list of maintainers, see the [MAINTAINERS.md](MAINTAINERS.md) file.

## License

Unless otherwise noted, this project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details.
