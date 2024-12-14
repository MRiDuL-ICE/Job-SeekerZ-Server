const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@phmridul.el21o.mongodb.net/?retryWrites=true&w=majority&appName=PHMRiDuL`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection = client.db("JobSeekerZDB").collection("jobs");
    const jobApllicationCollection = client
      .db("JobSeekerZDB")
      .collection("job_applications");

    app.get("/jobs", async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    app.post("/job-applications", async (req, res) => {
      const data = req.body;
      const result = await jobApllicationCollection.insertOne(data);
      res.send(result);
    });

    app.get("/job-application", async (req, res) => {
      const email = req.query.email;
      const filter = { applicant_email: email };
      const result = await jobApllicationCollection.find(filter).toArray();
      for (const application of result) {
        const query = { _id: new ObjectId(application.job_id) };
        const job = await jobCollection.findOne(query);
        console.log(job);
        if (job) {
          application.tittle = job.title;
          application.company = job.company;
          application.company_logo = job.company_logo;
        }
      }
      res.send(result);
    });

    app.delete(`/job-application/:id`, async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const result = await jobApllicationCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Job SeekerZ Server");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
