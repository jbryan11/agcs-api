const express = require("express");
const { MongoClient } = require("mongodb");
const db_uri = process.env.MONGODB_URI;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//IOT
const client = new MongoClient(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function createTrafficData(classType, trafficData) {
  const result = false;
  try {
    await client.connect();
    const database = await client.db("agcs");
    if (classType == "STUDENT")
      res = await database.collection("students").insertOne(trafficData);
    res.insertedId
      ? (result = true)
      : console.log("Theres a problem witht he query");
    if (classType == "EMPLOYEE")
      res = await database.collection("employee").insertOne(trafficData);
    res.insertedId
      ? (result = true)
      : console.log("Theres a problem witht he query");
  } catch (e) {
    console.error(e);
  }

  return result;
}
async function verifyId(uid) {
  const result = false;
  try {
    await client.connect();
    const database = await client.db("agcs");
    const employee = await database
      .collection("employee")
      .findOne({ UID: uid });
    const student = await database.collection("students").findOne({ UID: uid });
    if (employee || student) result = true;
  } catch (e) {
    console.error(e);
  }

  return result;
}
app.post("/verify-id", function (req, res) {
  let id = req.body.idScanned;
  console.log(id);
  let verification = verifyId(id);
  console.log(`Verification Result:: ${verification}`);
  verification
    ? res.status(200).json({ data: "verified" })
    : res.status(201).json({ data: "not verified" });
});
app.post("/gate-status", function (req, res) {
  const data = req.body;
});

//MONITOR
app.get("gate-status", function (req, res) {
  const data = req.body;
});

app.get("/trafficData", (req, res) => {});
app.post("/sendTraffic", (req, res) => {
  let data = req.body;
  let classType = req.body.classType;
  result = createTrafficData(classType, data);

  if (result) res.status(200).json({ message: "Success" });
});

app.get("/test", (req, res) => {
  res.status(200).json({ message: "HELLO" });
});
app.get("/", function (req, res) {
  res.render("index");
});
app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});
module.exports = app;
