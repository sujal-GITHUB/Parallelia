import express from 'express';
import cors from 'cors';  // Import CORS
import {router} from "./routes/v1"

const app = express();

// Enable CORS for specific origin (frontend URL)
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow frontend to make requests to the backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

app.use(express.json());

// Your routes here...
app.use('/api/v1', router);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
