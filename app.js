require("dotenv").config();
const express = require("express");
const app = express();
const { router } = require("./routes/router.js");
app.use(express.json());

app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port:${process.env.PORT}`);
});
