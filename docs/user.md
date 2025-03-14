# User Specification

## Create User Api
Endpoint : POST /users/register

Request Body 

```json
{
  "role" : "user",
  "username" : "helloword",
  "name" : "helloword",
  "email": "helloworld@gmail.com",
  "password" : "secretpassword"
}
```

Response Body Success :

```json
{
  "data" : {
    "role" : "user",
    "name" : "helloword",
    "username" : "helloword",
    "email": "helloworld@gmail.com"
  }
}
```

Response Body Error :

```json
{
  "error" : {
    "message" : "Email already exist"
  }
}
```
## Login User Api
Endpoint : POST /users/login

Request Body

```json
{
  "role" : "WISATAWAN",
  "email" : "helloworld@gmail.com",
  "password" : "secretpassword"
  
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors" : "username or password is wrong"
}
```
## Logout User Api
Endpoint : DELETE /users/logout

Headers :
- Authorization : token

Response Body Success :

```json
{
  "data" : "Logout Success"
}
```

Response Body Error :

```json
{
  "errors" : "Unauthorized"
}
```