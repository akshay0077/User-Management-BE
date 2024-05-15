# UserDash : User Management System Backend Api Flow

## Create User : 

```bash
    Post : ${BASE_URL}/api/v1/user/register

 /*
    Makes a POST request to register a new user.
    
    Parameters:
    - data: Object containing user data.
    - header: Optional header for the request.

    Returns:
    - Promise containing response data.
  */
  ```

  # Get All User Details : 

```bash
  GET : ${BASE_URL}/api/v1/user/

   /*
    Makes a GET request to fetch a list of users.

    Parameters:
    - search: Search string for filtering users.
    - page: Page number for pagination.

    Returns:
    - Promise containing response data.
  */
  ```

# Specific User Details : 

  ```bash
    GET : ${BASE_URL}/api/v1/user/{id}

     /*
    Makes a GET request to fetch details of a single user.

    Parameters:
    - id: ID of the user.

    Returns:
    - Promise containing response data.
  */
  ```

# Update User Details : 

```bash
    PUT : ${BASE_URL}/api/v1/user/edit/{id}

    /*
    Makes a PUT request to edit user details.

    Parameters:
    - id: ID of the user to be edited.
    - data: Object containing updated user data.
    - header: Optional header for the request.

    Returns:
    - Promise containing response data.
  */
```

# Delete the User : 

```bash
    DELETE : ${BASE_URL}/api/v1/user/delete/{id}

     /*
    Makes a DELETE request to delete a user.

    Parameters:
    - id: ID of the user to be deleted.

    Returns:
    - Promise containing response data.
  */
```

# Export to CSV : 

```bash
    GET : ${BASE_URL}/api/v1/userexport

    /*
    Makes a GET request to export users to CSV.

    Returns:
    - Promise containing response data.
  */
```

# Change the User Status : Active , InActive

```bash
    PUT: ${BASE_URL}/api/v1/user/status/{id}

    /*
    Makes a PUT request to change user status.

    Parameters:
    - id: ID of the user whose status is to be changed.
    - data: Object containing status data.

    Returns:
    - Promise containing response data.
  */
```


## Authors

- [@Akshay Kher](https://github.com/akshay0077)

