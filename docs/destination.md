# Destination Reqruitment

## Create Destination Api
Endpoint : POST /users/destinations

Headers :
- Authorization : token

Request Body :

```json
{
  "coverImage" : "destinasi.img",
  "name" : "Ampera",
  "address" : "Jl. Jalan",
  "description" : "jembatan ampera",
  "urlLocation" : "https://www.google.com/maps",
  "picture" : [
    {
      "id" : 1,
      "gambar" : "ampera.jpg",
      "idDestination" : 1
    },
    {
      "id" : 2,
      "gambar" : "ampera.jpg",
      "idDestination" : 1
    }
  ]
}
```

Response Body Success :

```json
{
  "data" : {
    "id" : 1,
    "name" : "ampera",
    "address" : "Jl. Jalan",
    "description" : "jembatan ampera",
    "urlLocation" : "https://www.google.com/maps"
  }
}
```

Response Body Error :

```json
{
    "errors" : "Name is required"
}
```

## Get Destination Api

Endpoint : GET /users/destinations/:idDestination

Headers :
- Authorization : token

Response Body Success :

```json
{
    "data" : {
        "id" : 1,
        "name" : "ampera",
        "address" : "Jl. Jalan",
        "description" : "jembatan ampera",
        "urlLocation" : "https://www.google.com/maps",
        "picture" : [
        {
            "id" : 1,
            "gambar" : "ampera.jpg",
            "idDestination" : 1
        },
        {
            "id" : 2,
            "gambar" : "ampera.jpg",
            "idDestination" : 1
        }
        ]
    }
}
```

Response Body Error :

```json
{
    "errors" : "Data not found"
}
```

## Update Destination Api

Endpoint : PUT /users/destinations/:idDestination   

Headers :
- Authorization : token

Request Body :

```json
{
    "coverImage" : "destinasi.img",
    "name" : "Ampera",
    "address" : "Jl. Jalan",
    "description" : "jembatan ampera",
    "urlLocation" : "https://www.google.com/maps",
    "picture" : [
        {
        "id" : 1,
        "gambar" : "ampera.jpg",
        "idDestination" : 1
        },
        {
        "id" : 2,
        "gambar" : "ampera.jpg",
        "idDestination" : 1
        }
    ]
}
```

Response Body Success :

```json
{
    "data" : {
        "id" : 1,
        "name" : "ampera",
        "address" : "Jl. Jalan",
        "description" : "jembatan ampera",
        "urlLocation" : "https://www.google.com/maps",
        "picture" : [
        {
            "id" : 1,
            "gambar" : "ampera.jpg",
            "idDestination" : 1
        },
        {
            "id" : 2,
            "gambar" : "ampera.jpg",
            "idDestination" : 1
        }
        ]
    }
}
```

Response Body Error :

```json
{
    "errors" : "Data not found"
}
```

## List Destination Api
Endpoint : GET /users/destiantions

Headers :
- Authorization : token

Response Body Success :

```json
{
  "data" : [
    {
        "id" : 1,
        "name" : "Bali",
        "description" : "Pulau Dewata",
        "address" : "Jl. Jalan",
        "city" : "Jakarta",
        "province" : "DKI Jakarta",
        "country" : "Indonesia",
        "postalCode" : "12345"
    },
    {
        "id" : 2,
        "name" : "Bali",
        "description" : "Pulau Dewata",
        "address" : "Jl. Jalan",
        "city" : "Jakarta",
        "province" : "DKI Jakarta",
        "country" : "Indonesia",
        "postalCode" : "12345"
    }
  ]
}
```

Response Body Error :

```json
{
  "errors" : "Data not found"
}
```

## Delete Destination Api

Endpoint : DELETE /users/destiantions/:idDestination

Headers :
- Authorization : token

Response Body Success :

```json
{
  "data" : "Delete success"
}
```

Response Body Error :

```json
{
    "errors" : "Destination not found"
}
```