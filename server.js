const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const app = express();
const env = require("dotenv").config();
const port = process.env.PORT || 3000;

connectDb();
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server runing on port ${port}`);
})