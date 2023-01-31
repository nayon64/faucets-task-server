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
	const currencyCollections = client.db("faucetsTask").collection("curency")
	const userCollections =client.db("faucetsTask").collection("users")
	

	// get all currency 
	app.get("/currency", async (req, res) => {
		const query = {}
		const curreny= await currencyCollections.find(query).toArray()
		res.send(curreny)
	})
	app.post("/user", async (req, res) => {
		const user = req.body;
		const email = user.email;
		const query = { email: email }
		const checkEmail = await userCollections.findOne(query)
		if (checkEmail) {
			res.send({ acknowledged: true, message: "Your account was created." });
		 }
		else {
			const result = await userCollections.insertOne(user);
      res.send(result);
		}
		
	})
	
}
run().catch(console.dir)


app.get("/", async (req, res) => {
	res.send("Faucets server is running...")
})


app.listen(port, () => {
	console.log(`Faucets Task runnig in ${port}`)
})