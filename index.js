const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jobseekerz.netlify.app",
      "https://job-seekerz.firebaseapp.com",
      "https://job-seekerz.web.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const logger = (req, res, next) => {
  console.log("Inside the logger");
  next();
};

const verifyToken = (req, res, next) => {
  console.log("Inside verify token middlewire", req.cookies);
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

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
    // await client.connect();

    const jobCollection = client.db("JobSeekerZDB").collection("jobs");
    const jobApllicationCollection = client
      .db("JobSeekerZDB")
      .collection("job_applications");

    app.post(`/jwt`, async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "3h" });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    app.get("/jobs", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { hr_email: email };
      }
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    });

    app.post(`/jobs`, async (req, res) => {
      const newJob = req.body;
      const result = await jobCollection.insertOne(newJob);
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
      const id = data.job_id;
      const query = { _id: new ObjectId(id) };
      const job = await jobCollection.findOne(query);
      let newCount = 0;
      if (job.applicationCount) {
        newCount = job.applicationCount + 1;
      } else {
        newCount = 1;
      }
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          applicationCount: newCount,
        },
      };
      const updateJobCount = await jobCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.get("/job-application", verifyToken, async (req, res) => {
      const email = req.query.email;
      const filter = { applicant_email: email };

      if (req.user.email !== req.query.email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const result = await jobApllicationCollection.find(filter).toArray();
      for (const application of result) {
        const query = { _id: new ObjectId(application.job_id) };
        const job = await jobCollection.findOne(query);
        if (job) {
          application.tittle = job.title;
          application.company = job.company;
          application.company_logo = job.company_logo;
        }
      }
      res.send(result);
    });

    app.get(`/job-applications/jobs/:job_id`, async (req, res) => {
      const job_id = req.params.job_id;
      const filter = { job_id: job_id };
      const result = await jobApllicationCollection.find(filter).toArray();
      res.send(result);
    });

    app.patch(`/job-applications/:id`, async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: data.status,
        },
      };
      const result = await jobApllicationCollection.updateOne(
        filter,
        updatedDoc
      );
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
    // await client.db("admin").command({ ping: 1 });
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
