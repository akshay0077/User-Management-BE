import express from "express";
import {
    userCreate,
    userSearch,
    singleUserGet,
    userEdit,
    userDelete,
    userStatus,
    userExport,
} from "../controllers/usersControllers.js";
import upload from "../multerconfig/storageConfig.js";

const router = express.Router();

// Routes
// Register a new user
router.post("/user/register", upload.single("user_profile"), userCreate);

// Get details of all users based on search criteria
router.get("/user/details", userSearch);

// Get details of a single user by ID
router.get("/user/:id", singleUserGet);

// Edit user details by ID
router.put("/user/edit/:id", upload.single("user_profile"), userEdit);

// Delete a user by ID
router.delete("/user/delete/:id", userDelete);

// Change the status of a user by ID
router.put("/user/status/:id", userStatus);

// Export users to a CSV file
router.get("/userexport", userExport);

export default router;
