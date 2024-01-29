const express = require("express");
const app = express();
const cors = require("cors");
const homePage = require("./routes/home.js");
const videoPage = require("./routes/video.js");
const adminPage = require("./routes/admin.js");
const auth = require("./routes/auth.js");

const extractPhrasalVerbs = require("./routes/extractPhrasalVerbs.js")

//Middleware for routes - bridge / intermediary between different component within an application

app.use(cors());
app.use(express.json());

app.use(homePage);
app.use(videoPage);
app.use(adminPage);
app.use(auth);


app.use(extractPhrasalVerbs);

app.listen(5000, ()=>{
    console.log("App listining on port 5000");
})
