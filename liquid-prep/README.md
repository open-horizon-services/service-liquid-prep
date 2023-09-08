# Liquid Prep Express

Our goal is to integrate Liquid Prep App with Open Horizon.  We have brought over the frontend from https://github.com/Liquid-Prep/LiquidPrep-App and created an express server backend with Dockerfiles for the supported platforms.   This enables containerization of Liquid Prep App as a service for edge computing.  

# Benefits:
* Resilience
* Security
* Sensors Management
* Flexibility
* Local Storage

## To setup Edge Node Agent, and to run CLI & agent in containers

- Run `curl -sSL https://raw.githubusercontent.com/playground/hzn-cli/main/install.sh --output install.sh && bash ./install.sh`

  - ```
    1) Cli-And-Anax	      4) Anax-In-Container  7) Confirm
    2) CLI-Only	          5) Run-In-Containers  8) Quit
    3) CLI-In-Container   6) All-In-One
    Choose your environment setup: 5

    Run-In-Containers, Runs both CLI and Agent in its own container, choose <Confirm> to continue setup.

    Choose your environment setup: 7
    You have chosen Run-In-Containers
    1) Config-File
    2) Confirm
    3) Help
    4) Quit
    Continue with setup: 1

    Please provide absolute path to configuration file, then choose <Confirm> to continue setup.
    /home/ieam/fyre.216.dock.json

    Continue with setup: 2
    ```

  - As shown above, select 5) Run-In-Containers then press 7) to confirm
  - Then select 1) to provide path to your configuration json file then press 2) to confirm

- An example of the json configuration template
  Note:  HZN_CSS=true for HTTPS

```
{
  "org": {
    "HZN_ORG_ID": "fyre",
    "HZN_DEVICE_TOKEN": "",
    "HZN_NODE_ID": "fyre-216-dock",
    "HZN_DEVICE_ID": "fyre-216-dock",
    "HZN_EXCHANGE_USER_AUTH": "****************************",
    "HZN_EXCHANGE_URL": "http://9.30.255.148:3090/v1",
    "HZN_FSS_CSSURL": "http://9.30.255.148:9443/",
    "HZN_AGBOT_URL": "http://9.30.255.148:3111",
    "HZN_SDO_SVC_URL": "http://9.30.255.148:9008/api",
    "HZN_AGENT_PORT": "8510",
    "HZN_CSS": false,
    "HZN_MGMT_HUB_CERT_PATH": "/var/agent-install.crt",
    "CONFIG_CERT_PATH": "/home/ieam/agent-install.crt",
    "ANAX": "https://raw.githubusercontent.com/open-horizon/anax/master/agent-install/agent-install.sh"
  },
  "service": {
    "SERVICE_NAME": "mms-agent",
    "SERVICE_CONTAINER_NAME": "mms-agent",
    "SERVICE_VERSION": "1.0.0",
    "SERVICE_VERSION_RANGE_UPPER": "1.0.0",
    "SERVICE_VERSION_RANGE_LOWER": "1.0.0",
    "SERVICE_CONTAINER_CREDS": "",
    "VOLUME_MOUNT": "/mms-shared",
    "MMS_SHARED_VOLUME": "mms_shared_volume",
    "MMS_OBJECT_TYPE": "mms_agent_config",
    "MMS_OBJECT_ID": "mms_agent_config_json",
    "MMS_OBJECT_FILE": "config/config.json",
    "MMS_CONTAINER_CREDS": "",
    "MMS_CONTAINER_NAME": "mms-agent",
    "MMS_SERVICE_NAME": "mms-agent",
    "MMS_SERVICE_VERSION": "1.0.0",
    "MMS_SERVICE_FALLBACK_VERSION": "1.0.0",
    "UPDATE_FILE_NAME": "mms-agent-config.json"
  },
  "folders": [
    "/var/tmp/horizon/horizon1/fss-domain-socket",
    "/var/tmp/horizon/horizon1/ess-auth",
    "/var/tmp/horizon/horizon1/secrets",
    "/var/tmp/horizon/horizon1/nmp"
  ],
  "register": {
    "policy": {
      "properties": [
        {
          "name": "openhorizon.allowPrivileged",
	        "value": true
        }
      ],
      "deployment": {
        "properties": [
          {"name": "mms-agent", "value": "MMS Agent"},
	        {"name": "homehub", "value": "Home Automation"}
        ]
      }
    }
  },
  "test": true,
  "anaxInContainer": "docker run -d -t --restart always --name horizon1 --privileged -p 127.0.0.1:8081:8510 -e DOCKER_NAME=horizon1 -e HZN_VAR_RUN_BASE=/var/tmp/horizon/horizon1 -v /var/run/docker.sock:/var/run/docker.sock -v /var/horizon:/etc/default/horizon:ro -v /var/agent-install.crt:/var/agent-install.crt -v horizon1_var:/var/horizon/ -v horizon1_etc:/etc/horizon/ -v /var/tmp/horizon/horizon1:/var/tmp/horizon/horizon1 openhorizon/amd64_anax:2.30.0-1291",
  "cliInContainer": "docker run -d -it --restart always --name auto-dock --privileged --network=\"host\" -v /var/lib/docker/volumes/mms_shared_volume/_data:/mms-shared/ -p 127.0.0.1:8888:8888 -v /var/run/docker.sock:/var/run/docker.sock -v /var/agent-install.crt:/var/agent-install.crt -v /home/ieam/fyre.148.ieam.json:/var/fyre.148.ieam.json -e HORIZON_URL=http://localhost:8081 -e HZN_ORG_ID=${HZN_ORG_ID} -e HZN_EXCHANGE_USER_AUTH=${HZN_EXCHANGE_USER_AUTH} -e HZN_FSS_CSSURL=${HZN_FSS_CSSURL} -e HZN_EXCHANGE_URL=${HZN_EXCHANGE_URL} -e HZN_CONFIG_FILE=/var/fyre.148.ieam.json -e version=v2.30.0-1291 -e css=${HZN_CSS} playbox21/auto-dock-express_amd64:1.0.3"
}

```

- horizon file should have the following env vars
```
HZN_EXCHANGE_URL=
HZN_FSS_CSSURL=
HZN_DEVICE_ID=
HZN_NODE_ID=
HZN_AGBOT_URL=
HZN_SDO_SVC_URL=
HZN_MGMT_HUB_CERT_PATH=
```

- With the above configuration, the edge node will be setup with horizon1 and auto-dock containers and agent is registered with the policy. The services with the constraints that match this policy properties will get loaded. In this case, mms-agent and homehub-express services will be loaded as described in the configuration.
- ## Docker ps will show

  ```
  CONTAINER ID        IMAGE                                     COMMAND                  CREATED             STATUS              PORTS                      NAMES
  cf4e98362460        playbox21/liquid-prep-express_arm64       "docker-entrypoint.s…"   5 hours ago         Up 5 hours          0.0.0.0:3003->3000/tcp     bd8230fff81961449fec83b8f7f4b2abb29e0db65463dc444609ccbfe7b74105-liquid-prep-express
  65fab5086f75        playbox21/mms-agent_arm64                 "npm start"              5 hours ago         Up 5 hours          0.0.0.0:3000->3000/tcp     97c2631c68fbb9ed77f1f231207b3faf41c9499ed6d70a3ab0bb0707506f949b-mms-agent
  714532bfa8c5        playbox21/auto-dock-express_arm64:1.0.5   "sh /oh/input.sh"        5 hours ago         Up 5 hours                                     auto-dock
  2a592a160be0        openhorizon/arm64_anax:2.30.0-1194        "/root/anax.service …"   5 hours ago         Up 5 hours          127.0.0.1:8081->8510/tcp   horizon1


  ```

- ## mms-agent
  mms-agent is a containerized service that checks for updates coming from MMS this edge node cares about. mms-agent will deliver updates to the shared volume for services to consume and process accordingly.

- ## Notes:
  Add this entry to your /etc/hosts files then you will be able to access Liquid-Prep App via https://local.liquid-prep.org:3003
  ```
  127.0.0.1 local.liquid-prep.org
  ```