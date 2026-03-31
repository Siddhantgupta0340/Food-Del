import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';


//app configuration
const app = express();
const port = 4000;

//middlewares
app.use(cors());
app.use(express.json());

//database connection
connectDB();

//routes
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads')); // Serve static files from the "uploads" directory

//api endpoints
app.get('/', (req, res) => {
    res.send('API is running');
});

//server setup
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//mongodb+srv://siddhantgupta0304_db_user:sid0304@cluster0.0tjim0b.mongodb.net/?
