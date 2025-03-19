# UNS User Manual

This guide provides the steps to integrate Public Guardian and Public Gatekeeper with the @unsproject/service-gateway npm package in your Express application.

## Prerequisites

Before proceeding, ensure you have the following:

- A running Express application
- Node.js and npm installed

## UNS Cloud Links

- <a href="https://guardian.universalnameservice.com" target="_blank">Guardian</a>
- <a href="https://gatekeeper.universalnameservice.com" target="_blank">Gatekeeper</a>
- <a href="https://www.npmjs.com/package/@unsproject/service-gateway" target="_blank">Gateway package</a>
- <a href="https://demo.universalnameservice.com" target="_blank">Demo</a>

## 1. Install the Gateway

Using npm, install the following dependencies on your Express server.

```
npm install @unsproject/service-gateway @unsproject/common
```

## 2. Implement the DBContext interface

Use DBContext from @unsproject/service-gateway/dist/api

- `async createTicket(ticket: AuthTicket): Promise<AuthTicket>` - Inserts the **Ticket** into the database
- `async getTicket(nonce: string): Promise<AuthTicket>` - Return the **Ticket** via its nonce
- `async updateTicketToClaimed(ticket: AuthTicket): Promise<AuthTicket>` - Updates the status of a given **Ticket** to CLAIMED and saves it.
- `async updateTicketToAuthorized(ticket: AuthTicket,serviceUserId: string):Promise<AuthTicket>` - Updates the status of a given **Ticket** to AUTHORIZED and saves it.

## 3. Database Tables

You will need to implement the following tables into your database.

- `Ticket` Table:

  | Column                  | Type    | Nullable | Primary Key | References               |
  | ----------------------- | ------- | -------- | ----------- | ------------------------ |
  | status                  | Integer | No       | No          | [Status].[status]        |
  | serviceId               | String  | No       | No          |                          |
  | sessionId               | String  | No       | No          |                          |
  | attestationTypeRequired | Integer | No       | No          | [AttestationType].[type] |
  | guardianUrl             | String  | No       | No          |                          |
  | gatekeeperUrl           | String  | No       | No          |                          |
  | qrCodeUrl               | String  | Yes      | No          |                          |
  | serviceUserId           | String  | Yes      | No          |                          |
  | nonce                   | String  | Yes      | Yes         |                          |

- `AttestationType` Table:

  | Column | Type    | Nullable | Primary Key | References |
  | ------ | ------- | -------- | ----------- | ---------- |
  | id     | Integer | No       |             |            |
  | type   | String  | No       |             |            |

- `Status` Table:

  | Column | Type    | Nullable | Primary Key | References |
  | ------ | ------- | -------- | ----------- | ---------- |
  | id     | Integer | No       |             |            |
  | status | Integer | No       |             |            |

  - `[AttestationType].[type]` can be [ 'none' | 'email_not_verified' | 'email_verified' | 'pinned_with_pki' | 'webauthn' | 'pki' ]
  - `[Status].[status]` can be [ 'CREATED' | 'CLAIMED' | 'AUTHORIZED' ]

- `User` Table:

  | Column        | Type    | Nullable | Primary Key | References               |
  | ------------- | ------- | -------- | ----------- | ------------------------ |
  | userServiceId | Integer | No       |             | [Ticket].[serviceUserId] |
  | ...           |         |          |             |                          |

  - This table is how you should extend your User table so you can reference the tickets with the `User`

## 4. Registering routes

Register the Gateway API route on your Express service.

```js
// Example:
app.use(
  "/uns/gateway/api",
  gatewayApp(
    server,
    new DBImplementation(),
    "https://gatekeeper.universalnameservice.com"
  )
);
```

GatewayApp parameters:

- server: Created using http.createServer().
  ```js
  //Example:
  const app: Express = express();
  const server = http.createServer(app);
  ```
- DBImplemnation is the implemented [DBContext](#3-implement-the-dbcontext-interface) class
- The last parameter is the UNS Cloud Gatekeeper Public URL

## 5. Run the UI builder

This will generate the prebuilt UI on your desired path where Express would serve static files.

```js
npx uns-build-ui [path-name]

//Example:
npx uns-build-ui ./dist/build-gateway
```

## 6. Register the UI route on your service

- **IMPORTANT!!** THE UI URL PATH MUST BE ON `/uns-service-gateway`

```js
//Example:
app.use(
  "/uns-service-gateway",
  express.static(path.join(__dirname, "build-gateway"))
);
```

## 7. Start registering your service on the UNS Cloud Gatekeeper

The following notes are how to effectivly use the Gateway package to make changes on your service.

- On step 2 the Gatekeeper will require your domain name, callback path and validation path. The Gateway package comes with prebuilt paths for handling ticket callback and service validation. Use `[Gateway_API_route]/validate` for service validation and `[Gateway_API_route]/callback` for callback. (The [Gateway_API_route] variable should be the path you set on [Chapter 4](#4-registering-routes-gateway_api_route)).
- After step 2 the Gatekeeeper should give you a validation code to set on your application. You must set the environment variable `VALIDATION_CODE` to the validation code that the Gatekeeper gave you. After setting the validation code the Gatekeeper will call your service to verify that you are the owner of said service.
- On step 4, the service will explain how to create a pair of private/public keys and you will have to submit your public key to the Gatekeeper. You must set these keys as environment variables named `PRIVATE_KEY` and `PUBLIC_KEY`. After sending the keys the Gatekeeper, the Gatekeeper will send you its public key and you must create an environment variable named `GATEKEEPER_PUBLIC_KEY` and set the Gatekeepers public key on it. (NOTE: ALL NEW LINES SHOULD BE CHANGED WITH THE \n CHARACTER IN YOUR ENVIRONMENT VARIABLES)
  - Example Private key:
  ```
  -----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgHvCth9BiEnYJ5Tm9J550GApLF2CN1ie2D1kP6Nav0gnz6GWHZ5Y\nGiWXITorXvcxH1w0+cvFsQbrZW2MNDi85+qnZySpXemZDOAP2CKs0xOOfHkbLeYL\nJzzNdJvoqNrxwE0X3AqVYkSiN/0haHq0Edw/ab6sqDQE49pdBnThIgI5AgMBAAEC\ngYAffytogv4ThQ51x92Do47TmkbvOV+qjyqLXUMQ6Nx7mZ4vCoxZKyTkYjUTn8wY\nbwkDJ3xXTuXB1BDJM4Bq3DDNXTA2DYjRUBoCcNKDRbQhJtDVm5zfkgqBU4giPMS5\n/RUnKR0UZSTK5IeGVJCdwwJfhpQTqU5CwfisrfeAVuDrfQJBAMjYW/+mz8bPCUHj\nal9IYn2EkoRjCFmcm/7zvmk1DXNieT8lJIPMvgcKcvTaOSdN3PogpK/okoXTq4Kv\njxLyWXMCQQCdvzhvh9BlBAMuFc9mN1nLdF8pPea4R0XN0iunlvCBvbTuJx7DXVGK\nfM1iZkh+QlLYQUEyfD/UUXtDkSQddTqjAkEAtsXuMuCjBNE0I3nJO5yrxH34t/FH\nkAUtEP7PsP5Ol0pt/EDY0fholg+0PY65pEL/bcB3Hn4PmSnfUrZhBWT2cQJALbkj\nbpB7Qwxqr4z61LHugR52Bso+eeOOxB3LMYR6qeCG9RC5xf7ih7WtAnyLPq2SvcQM\nVcnV5oDHrcoAIdm86QJBAKIQQiJ+tClgmeGwUpPVzQ5qJgeMvZC/gDtExJuc5Wl0\nM3SrF5lYPXDiPonBIlOEhzL90fXHai5iuxmZogEUbkw=\n-----END RSA PRIVATE KEY-----
  ```
  - Example Public Key:
  ```
  -----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHvCth9BiEnYJ5Tm9J550GApLF2C\nN1ie2D1kP6Nav0gnz6GWHZ5YGiWXITorXvcxH1w0+cvFsQbrZW2MNDi85+qnZySp\nXemZDOAP2CKs0xOOfHkbLeYLJzzNdJvoqNrxwE0X3AqVYkSiN/0haHq0Edw/ab6s\nqDQE49pdBnThIgI5AgMBAAE=\n-----END PUBLIC KEY-----
  ```
- In the end you will get your service id and you must create an environment variable named `SERVICE_ID` and set your service id on it to be able to comunicate with the Gatekeeper.

## 8. Using the Gateway (Susceptible to change)

- To use the Gateway on your service, add a way for the user to sign in via UNS. To make this work when the user clicks on the button, you should redirect the user to /uns-service-gateway?redirectUri=[your_domain]. `redirectUri` is the path where the Gateway should take the user after finishing the authentication process. After the redirect, the serviceUserId will be stored in your local storage, and you can manage it as needed.
