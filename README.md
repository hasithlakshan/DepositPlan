# DepositPlan App
A Node.js application for managing deposit plans, built with Express, and containerized using Docker.

---

## Features
- RESTful APIs for managing deposit plans.
- Dockerized for seamless deployment.

---

## Prerequisites
Make sure the following tools are installed on your system:
1. Node.js
2. npm
3. Docker (optional if you want to run with docker)

---

## Installation and Setup local computer

1. Clone the Repository
    git clone <repository-url>

2. cd DepositPlan
3. npm install
4. npm dev

## Docker (optional)
1. Build the Docker image
    docker build -t depositplan-app .
2. Run the Docker container:
    docker run -p 3000:3000 depositplan-app

## Stop the Docker container(optional)
1. Find the container ID:
    docker ps
2. Stop it using:
    docker stop <container-id>

## Endpoints

1. Create deposite plan
    Api: http://localhost:3000/api/deposits/create
    method: POST
    body: {
            "depositPlan": {
              "id": "1234",
              "type": "Monthly",
              
              "isComplete": false,
              "portfolios": [
                {
                  "id": "123222",
                  "portfolio": "High Risk",
                  "amount": 0
                },
                {
                  "id": "123227",
                  "portfolio": "Retirement",
                  "amount": 100
                }
              ]
            },
            "refNo": 12345
          }


2. allocate deposite plan
    Api: http://localhost:3000/api/deposits/allocate
    method: POST
    body: {"deposits": { "amount": 10700.11, "referenceNo": 12345 }}

3. get deposite plan
    Api: http://localhost:3000/api/deposits/:customerRef
    method: Get

4. delete deposite plan
    Api: http://localhost:3000/api/deposits/:customerRef/:depositeID
    method: DELETE

## Notes
## This implementation can work with percentage, equal, savings distribution plans. Additionally, the distribution plan can be configured in the store.
## This application does not support partial deposits across two months.