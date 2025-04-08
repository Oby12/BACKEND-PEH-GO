# Destination API Documentation

## Authorization
All destination APIs require authentication via a token in the Authorization header.
Different endpoints require different user roles:
- `ADMIN`: Required for creating, updating, and deleting destinations
- `WISATAWAN` or `ADMIN`: Can access list and detail endpoints

## Create Destination API
**Endpoint:** POST /users/:categoryId/destinations

**Headers:**
- Authorization: token (ADMIN role required)

**Request Format:**
- Content-Type: multipart/form-data

**Form Fields:**
```
name: "Ampera"
address: "Jl. Jalan"
description: "Jembatan ampera adalah ikon kota Palembang"
urlLocation: "https://www.google.com/maps?q=jembatan+ampera"
```

**Form Files:**
```
cover: [Single image file] (Required)
picture: [Multiple image files, max 3] (Optional)
```

**Response Body Success (201):**
```json
{
  "data": {
    "id": 1,
    "name": "Ampera",
    "address": "Jl. Jalan",
    "description": "Jembatan ampera adalah ikon kota Palembang",
    "urlLocation": "https://www.google.com/maps?q=jembatan+ampera",
    "coverUrl": "/api/images/covers/1",
    "Category": {
      "name": "Destination"
    }
  }
}
```

**Response Body Error (400/404):**
```json
{
  "status": false,
  "message": "Error message",
  "errors": null
}
```

## Get Destination API
**Endpoint:** GET /users/:categoryId/destinations/:destinationId

**Headers:**
- Authorization: token

**Response Body Success (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Ampera",
    "address": "Jl. Jalan",
    "description": "Jembatan ampera adalah ikon kota Palembang",
    "urlLocation": "https://www.google.com/maps?q=jembatan+ampera",
    "coverUrl": "/api/images/covers/1",
    "Category": {
      "name": "Destination"
    },
    "picture": [
      {
        "id": 1,
        "imageUrl": "/api/images/pictures/1"
      },
      {
        "id": 2,
        "imageUrl": "/api/images/pictures/2"
      }
    ]
  }
}
```

**Response Body Error (404):**
```json
{
  "status": false,
  "message": "Destinasi tidak ditemukan",
  "errors": null
}
```

## Update Destination API
**Endpoint:** PUT /users/:categoryId/destinations/:destinationId

**Headers:**
- Authorization: token (ADMIN role required)

**Request Format:**
- Content-Type: multipart/form-data

**Form Fields:**
```
name: "Ampera Updated"
address: "Jl. Jalan Updated"
description: "Deskripsi yang diperbarui"
urlLocation: "https://www.google.com/maps?q=updated"
```

**Form Files:**
```
cover: [Single image file] (Optional - only if updating cover)
picture: [Multiple image files, max 3] (Optional - only if updating pictures)
```

**Response Body Success (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Ampera Updated",
    "description": "Deskripsi yang diperbarui",
    "categoryId": 1,
    "coverUrl": "/api/images/covers/1"
  }
}
```

**Response Body Error (400/404):**
```json
{
  "status": false,
  "message": "Error message",
  "errors": null
}
```

## List Destinations API
**Endpoint:** GET /users/:categoryId/destinations

**Headers:**
- Authorization: token

**Query Parameters:**
- page: [pagination page number, default: 1]
- limit: [items per page, default: 10]

**Response Body Success (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Ampera",
      "address": "Jl. Jalan",
      "description": "Jembatan ampera adalah ikon kota Palembang",
      "urlLocation": "https://www.google.com/maps?q=jembatan+ampera",
      "coverUrl": "/api/images/covers/1"
    },
    {
      "id": 2,
      "name": "Benteng Kuto Besak",
      "address": "Jl. Benteng",
      "description": "Benteng peninggalan sejarah di Palembang",
      "urlLocation": "https://www.google.com/maps?q=benteng+kuto+besak",
      "coverUrl": "/api/images/covers/2"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 42,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

**Response Body Error (404):**
```json
{
  "status": false,
  "message": "Kategori tidak ditemukan",
  "errors": null
}
```

## Delete Destination API
**Endpoint:** DELETE /users/:categoryId/destinations/:destinationId

**Headers:**
- Authorization: token (ADMIN role required)

**Response Body Success (200):**
```json
{
  "message": "Destinasi berhasil dihapus"
}
```

**Response Body Error (404):**
```json
{
  "status": false,
  "message": "Destinasi tidak ditemukan",
  "errors": null
}
```

## Get Destination Cover Image
**Endpoint:** GET /api/images/covers/:id

**Headers:**
- Authorization: token

**Response:**
- Content-Type: image/jpeg
- The binary image data

## Get Destination Picture Image
**Endpoint:** GET /api/images/pictures/:id

**Headers:**
- Authorization: token

**Response:**
- Content-Type: image/jpeg
- The binary image data