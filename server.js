const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Auto-ping function
function startAutoPing() {
    const pingUrl = 'https://godscent-fragrances.onrender.com'; // CHANGE THIS to your actual Render URL
    const pingInterval = 5 * 60 * 1000; // 5 minutes
    
    function ping() {
        https.get(pingUrl, (res) => {
            console.log(`✅ App pinged successfully - Status: ${res.statusCode} - ${new Date().toLocaleString()}`);
        }).on('error', (err) => {
            console.log(`❌ Ping failed: ${err.message} - ${new Date().toLocaleString()}`);
        });
    }
    
    // Start pinging
    console.log('Auto-ping service started...');
    ping(); // Ping immediately
    setInterval(ping, pingInterval); // Then every 5 minutes
}

// API routes for perfumes (your existing functionality)
let perfumes = [
    {
        id: 1,
        name: "Baccarat Rouge 540",
        brand: "Maison Francis Kurkdjian",
        description: "A captivating amber floral scent with jasmine and saffron notes",
        price: 85000,
        originalPrice: 120000,
        image: "https://images.unsplash.com/photo-1547887538-0e319c3217cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Santal 33",
        brand: "Le Labo",
        description: "A unisex fragrance with sandalwood, cedar, and leather notes",
        price: 75000,
        originalPrice: 95000,
        image: "https://images.unsplash.com/photo-1590736969955-1d0c97c55caa?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        badge: "Popular"
    }
];

// Get all perfumes
app.get('/api/perfumes', (req, res) => {
    res.json(perfumes);
});

// Add new perfume
app.post('/api/perfumes', (req, res) => {
    const newPerfume = {
        id: perfumes.length + 1,
        ...req.body
    };
    perfumes.push(newPerfume);
    res.json({ success: true, perfume: newPerfume });
});

// Delete perfume
app.delete('/api/perfumes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    perfumes = perfumes.filter(perfume => perfume.id !== id);
    res.json({ success: true });
});

// Start server and ping service
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Website: http://localhost:${PORT}`);
    startAutoPing(); // Start the ping service when server starts
});