const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve uploaded files

// MongoDB connection
mongoose.connect('mongodb://localhost/rest_apis');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Multer configuration for file uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Routes
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');
const weatherRouter = require('./routes/weather');  // route for weather API

app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);
app.use('/api/weather', weatherRouter);

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({ filePath: req.file.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Something broke!'
        }
    });
});


app.listen(port, () => console.log(`Server running on port ${port}`));
