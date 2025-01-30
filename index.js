const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

const HUBSPOT_API_KEY = "api_key";
const OBJECT_TYPE_ID = "2-40085447";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}?properties=pet_name,pet_type,food_preferences`,
      {
        headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}` },
      }
    );

    const pets = response.data.results || []; // Pet list

    res.render("homepage", { ourpets: pets });
  } catch (error) {
    console.error("Error fetching pets:", error.response?.data || error.message);
    res.status(500).json({ status: "error", message: "Failed to fetch pets" });
  }
});

app.get("/update-pets", (req, res) => {
  res.render("updates", { title: "Add or Update Pet" });
});

app.post("/update-pets", async (req, res) => {
  const { pet_name, pet_type, food_preference } = req.body;

  try {
    const data = {
      properties: {
        pet_name,
        pet_type,
        food_preferences: food_preference
      },
    };

    const response = await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("New pet added:", response.data);
    res.redirect("/");
  } catch (error) {
    console.error("Error adding pet:", error.response?.data || error.message);
    res.status(500).json({ status: "error", message: "Failed to add pet" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
