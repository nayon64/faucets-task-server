const express = require("express");
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// middle ware 
app.use(cors())
app.use(express.json())



const uri =
  `mongodb+srv://${process.env.FA_USER}:${process.env.FA_PASSWORD}@cluster0.xicrlbt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const currencyCollections = client.db("faucetsTask").collection("curency");
  const userCollections = client.db("faucetsTask").collection("users");

  // cheack user admin role
  app.get("/users/admin/:email", async (req, res) => {
	  const email = req.params.email;
	  console.log(email)
    const query = { email:email };
	  const user = await userCollections.findOne(query);
	  console.log(user.role === "Admin")
    res.send({ isAdmin: user?.role === "Admin" });
  });

  // get all currency
  app.get("/currency", async (req, res) => {
    const query = {};
    const curreny = await currencyCollections.find(query).toArray();
    res.send(curreny);
  });
  // add user in database
  app.post("/user", async (req, res) => {
    const user = req.body;
    const email = user.email;
    const query = { email: email };
    const checkEmail = await userCollections.findOne(query);
    if (checkEmail) {
      res.send({ acknowledged: true, message: "Your account was created." });
    } else {
      const result = await userCollections.insertOne(user);
      res.send(result);
    }
  });
  // get all user
  app.get("/users", async (req, res) => {
    const query = {};
    const users = await userCollections.find(query).toArray();
    res.send(users);
  });
}
run().catch(console.dir)


app.get("/", async (req, res) => {
	res.send("Faucets server is running...")
})


app.listen(port, () => {
	console.log(`Faucets Task runnig in ${port}`)
})