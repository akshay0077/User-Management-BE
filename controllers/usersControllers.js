import moment from "moment";
import csv from "fast-csv";
import fs from "fs";
import dotenv from "dotenv";

import users from "../models/usersSchema.js";

dotenv.config();

const BASE_URL = process.env.BASE_URL


// Create New User
export const userCreate = async (req, res) => {
    try {
        const { fname, lname, email, mobile, gender, location, status } = req.body;
        const file = req.file.filename;

        // Check if all required fields are provided
        if (!fname || !lname || !email || !mobile || !gender || !location || !status || !file) {
            res.status(401).json("All Inputs is required");
        }

        try {
            // Check if user with the same email already exists
            const existingUser = await users.findOne({ email: email });

            if (existingUser) {
                res.status(401).json("This user already exist in our databse");
            } else {
                // Create a new user
                const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

                const newUser = new users({
                    fname, lname, email, mobile, gender, location, status, profile: file, datecreated,
                });

                await newUser.save();
                res.status(200).json(newUser);
            }
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in creating users",
        });
    }
};

// Get User: fetch user based on his name
export const userSearch = async (req, res) => {
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4; // Number of items per page

    const query = {
        fname: { $regex: search, $options: "i" },
    };

    try {
        // Calculate the number of documents matching the query
        const count = await users.countDocuments(query);

        // Calculate the number of documents to skip for pagination. Ex: 1 * 4 = 4
        const skip = (page - 1) * ITEM_PER_PAGE;

        const usersData = await users
            .find(query)
            .limit(ITEM_PER_PAGE)
            .skip(skip);

        // Calculate the total number of pages for pagination. Ex:  8 /4 = 2
        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        // Send the response with pagination information and user data
        res.status(200).json({
            Pagination: {
                count,
                pageCount,
            },
            usersData,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in while Searching users",
        });
    }
};

// singleUserGet: Fetch a single user by ID
export const singleUserGet = async (req, res) => {
    const { id } = req.params;

    try {
        // Find user by ID
        const userData = await users.findOne({ _id: id });

        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in while Searching users",
        });
    }
};

// userEdit: Edit user details
export const userEdit = async (req, res) => {
    const { id } = req.params;
    const { fname, lname, email, mobile, gender, location, status, user_profile } = req.body;

    const file = req.file ? req.file.filename : user_profile;

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        // Find user by ID to ensure it exists
        const existingUser = await users.findById(id);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateUser = await users.findByIdAndUpdate(
            { _id: id },
            {
                fname,
                lname,
                email,
                mobile,
                gender,
                location,
                status,
                profile: file,
                dateUpdated,
            },
            {
                new: true,
            }
        );

        await updateUser.save();
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while updating user",
        });
    }
};

// userDelete: Delete a user by ID
export const userDelete = async (req, res) => {
    const { id } = req.params;
    try {
        // Find and delete the user by ID
        const deletedUser = await users.findByIdAndDelete({ _id: id });

        // Check if user was found and deleted
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while deleting user",
        });
    }
};

// userStatus: Change the status (Active, InActive)
export const userStatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        // Find and update the user's status by ID
        const userStatusUpdate = await users.findByIdAndUpdate(
            { _id: id },
            { status: data },
            { new: true }
        );

        // Check if user was found and updated
        if (!userStatusUpdate) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(userStatusUpdate);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while updating user status",
        });
    }
};

// userExport: Export users to a CSV file

export const userExport = async (req, res) => {
    try {
        const usersdata = await users.find();

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export/")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/");
            }
            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export/");
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/users.csv"
        );

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/users.csv`,
            });
        });
        if (usersdata.length > 0) {
            usersdata.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : "-",
                    LastName: user.lname ? user.lname : "-",
                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
                });
            });
        }
        csvStream.end();
        writablestream.end();
    } catch (error) {
        res.status(401).json(error);
    }
};
