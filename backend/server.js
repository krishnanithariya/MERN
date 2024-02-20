// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.plugin(mongoosePaginate);

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/MERN", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB schema and model
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Product = mongoose.model("Product", productSchema);

// CORS middleware
app.use(cors());

// Endpoint to fetch data from the external API and store it in MongoDB
app.get("/fetch-and-save", async (req, res) => {
  try {
    // Fetch data from the external API
    const apiResponse = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = apiResponse.data;

    // Save the data in MongoDB
    await Product.insertMany(products);

    res.json({
      success: true,
      message: "Data fetched and saved successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error saving data to MongoDB" });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const { search, page = 1, perPage = 10 } = req.query;

    // Define pagination options
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
    };

    // Define search criteria based on the presence of the search parameter
    const searchCriteria = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } }, // Case-insensitive search on title
            { description: { $regex: search, $options: "i" } }, // Case-insensitive search on description
            { price: { $regex: search, $options: "i" } }, // Case-insensitive search on price (assuming price is a string)
          ],
        }
      : {};

    // Perform the MongoDB query with pagination and search criteria
    const transactions = await Product.paginate(searchCriteria, options);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/statistics", async (req, res) => {
  try {
    const { selectedMonth } = req.query;

    // Parse the selectedMonth to a JavaScript Date object
    const selectedDate = new Date(selectedMonth);
    console.log("Selected Month:", selectedMonth);

    // Calculate the start and end dates of the selected month
    const startDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const endDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Calculate statistics
    const totalSaleAmount = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate },
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
        },
      },
    ]);

    const totalSoldItems = await Product.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: true,
    });

    const totalNotSoldItems = await Product.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: false,
    });

    res.json({
      totalSaleAmount:
        totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/bar-chart", async (req, res) => {
  try {
    const { selectedMonth } = req.query;

    // Parse the selectedMonth to a JavaScript Date object
    const selectedDate = new Date(selectedMonth);

    // Calculate the start and end dates of the selected month
    const startDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const endDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Calculate the number of items in different price ranges
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Number.MAX_SAFE_INTEGER },
    ];

    const barChartData = [];

    for (const range of priceRanges) {
      const count = await Product.countDocuments({
        dateOfSale: { $gte: startDate, $lte: endDate },
        sold: true,
        price: { $gte: range.min, $lt: range.max },
      });

      barChartData.push({
        range: `${range.min} - ${
          range.max === Number.MAX_SAFE_INTEGER ? "above" : range.max
        }`,
        count,
      });
    }

    res.json(barChartData);
  } catch (error) {
    console.error(error); // Log the error for further inspection
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/pie-chart", async (req, res) => {
  try {
    const { selectedMonth } = req.query;

    // Parse the selectedMonth to a JavaScript Date object
    const selectedDate = new Date(selectedMonth);

    // Calculate the start and end dates of the selected month
    const startDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const endDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // Find unique categories and count the number of items from each category
    const categoryCounts = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(categoryCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/combined-data", async (req, res) => {
  try {
    const { selectedMonth } = req.query;
    // Fetch data from the three APIs
    const statisticsResponse = await axios.get(
      `http://localhost:3000/statistics?selectedMonth=${selectedMonth}`
    );
    const barChartDataResponse = await axios.get(
      `http://localhost:3000/bar-chart?selectedMonth=${selectedMonth}`
    );
    const pieChartDataResponse = await axios.get(
      `http://localhost:3000/pie-chart?selectedMonth=${selectedMonth}`
    );

    // Combine the responses
    const combinedData = {
      statistics: statisticsResponse.data,
      barChartData: barChartDataResponse.data,
      pieChartData: pieChartDataResponse.data,
    };

    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
