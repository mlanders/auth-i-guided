# notes

-   The main difference between using sessions and tokens for auth: Where the state is being kept
    -   Session keep state kept in the server
        -   client (browser) sends it automatically
    -   When using tokens tate is kept in the toek (client)
        -   client is responsible for sending it back to server

### Responsibilities

-   Server

    -   produce the token
    -   send the token to the client
    -   read, decode and verify the token
    -   make the payload available to the rest of the api

-   Client
    -   store the token
    -   send the token on every request
    -   destroy token on logout
