import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors'
import express from 'express';
import dotenv from 'dotenv/config';
// import { createRemoteJWKSet, jwtVerify } from 'jose';

import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(express.json());

// {
//   origin: [
//     "http://localhost:3000",
//     "https://forhad-shorif-book-nook.vercel.app"
//   ],
//   methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
//   credentials: true
// }

const PORT = process.env.PORT || 8000;
const client = new MongoClient(process.env.MONGODB_SECRET_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err; // undefined রিটার্ন না করে এরর থ্রো করুন
  }
}

const MongoDB = await connectToMongoDB();
const db = MongoDB.db('Jobs-Secar')
const UserInformation = db.collection("userInfo")
const PostedJobsInfo = db.collection("Post-Jobs")


// User Information Save for Seacrh Jobs post
app.post('/UserInfo', async (req, res) => {
  try {
    const Userdata = req.body;
    const result = await UserInformation.insertOne(Userdata);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send('Error adding book');
  }
})

// User data for Seacrh Jobs Get
app.get('// UserData/:email', async (req, res) => {
  try {
    const Email = req.params;
    const books = await EmployerPostData.findOne({ Email }).toArray();
    res.send(books);
  } catch (err) {
    res.status(500).send('Error fetching my books');
  }
});

// User Add Information Update
app.patch('/EmployUpdte/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const DetaUpdate = req.body;

        const result = await EmployerPostData.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: DetaUpdate }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send('Data Not found');
        }
        res.send(result);

    } catch (err) {
        res.status(500).send('Error updating book');
    }
});

// Rcruitar Information Option
// Recuitar Post Jobs
app.post('/PostJobs', async (req, res) => {
  try {
    const PostedJobs = req.body;
    const result = await PostedJobsInfo.insertOne(PostedJobs);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send('Error adding book');
  }
})

// Recuiter Post jobs get
app.get('/GetJobs/:email', async (req, res) => {
  try {
    // req.params.email একটা string — object destructuring করলে undefined হতো
    const email = req.params.email.trim();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const jobs = await PostedJobsInfo.find({ email }).toArray();
    res.send(jobs);
  } catch (err) {
    console.error('Failed to fetch jobs', err);
    res.status(500).send('Error fetching jobs');
  }
});

// Recuiter job delete
app.delete('/DeleteJob/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PostedJobsInfo.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Job not found');
    }

    res.send(result);
  } catch (err) {
    console.error('Failed to delete job', err);
    res.status(500).send('Error deleting job');
  }
});

//Emplay data delete
app.delete('/EmaplayDelete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmployerPostData.findOneAndDelete({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Borrowed book not found');
    }
    res.send(result);
  }
  catch (err) {
    res.status(500).send('Error deleting borrowed book');
  }
});

app.get("/", (req, res) => {
  res.send("Namaj kayem korun")
})
app.listen(PORT, () => {
  console.log("Runing port is", PORT)
})