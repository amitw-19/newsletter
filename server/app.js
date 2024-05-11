import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import https from "https";
import path from "path";
const __dirname = path.resolve();

const app = express();
dotenv.config();

//app.use(express.static("public")); //express.static - to use local files by server.
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  //res.sendFile(__dirname + "/signup.html");
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/hello"),
  function (req, res) {
    res.send("hello from vercel");
  };

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    // mailchimp parameters to add a member/subscriber.
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = process.env.MAILCHIMP_URL; // usX = become us6 (6= server no.)

  const options = {
    // (options = authentication)
    method: "POST",
    auth: process.env.API_KEY, // (:--> api key)
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      // if login success
      //res.sendFile(__dirname + "/success.html");
      res.sendFile(path.join(__dirname, "public", "success.html"));
    } else {
      //res.sendFile(__dirname + "/failure.html"); //if login fail
      res.sendFile(path.join(__dirname, "public", "failure.html"));
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  //if login fail redirect to home page
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  //process.env.PORT || 3000 -(to listen on both hosted & local server port)
  console.log("server is running on port 3000");
});
