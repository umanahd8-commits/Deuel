cat > server.js << 'EOF'
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'perfumes.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    const defaultPerfumes = [
        {
            id: 1,
            name: "Baccarat Rouge 540",
            brand: "Maison Francis Kurkdjian",
            description: "A luminous fragrance with notes of jasmine, saffron, and amberwood. An olfactory masterpiece that captures the essence of crystal.",
            price: 450000,
            originalPrice: 675000,
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
            badge: "Limited Edition"
        },
        {
            id: 2,
            name: "No. 5 Parfum",
            brand: "Chanel",
            description: "The timeless classic with notes of aldehydes, ylang-ylang, and May rose. The epitome of elegance and sophistication.",
            price: 285000,
            originalPrice: 420000,
            image: "https://images.unsplash.com/photo-1590736969955-71ac4460e351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
            badge: "Heritage"
        },
        {
            id: 3,
            name: "Aventus",
            brand: "Creed",
            description: "A bold, fruity fragrance with pineapple, birch, and musk. The scent of success, ambition, and power.",
            price: 525000,
            originalPrice: 742500,
            image: "https://images.unsplash.com/photo-1613029226232-93c62f6a967a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            badge: "Exclusive"
        }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultPerfumes, null, 2));
}

// Helper function to read perfumes
function readPerfumes() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading perfumes:', error);
        return [];
    }
}

// Helper function to write perfumes
function writePerfumes(perfumes) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(perfumes, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing perfumes:', error);
        return false;
    }
}

// Routes

// Get all perfumes
app.get('/api/perfumes', (req, res) => {
    const perfumes = readPerfumes();
    res.json(perfumes);
});

// Add new perfume
app.post('/api/perfumes', (req, res) => {
    const perfumes = readPerfumes();
    const newPerfume = {
        id: perfumes.length > 0 ? Math.max(...perfumes.map(p => p.id)) + 1 : 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    perfumes.push(newPerfume);
    
    if (writePerfumes(perfumes)) {
        res.json({ success: true, perfume: newPerfume });
    } else {
        res.status(500).json({ success: false, error: 'Failed to save perfume' });
    }
});

// Delete perfume
app.delete('/api/perfumes/:id', (req, res) => {
    const perfumes = readPerfumes();
    const perfumeId = parseInt(req.params.id);
    const filteredPerfumes = perfumes.filter(p => p.id !== perfumeId);
    
    if (writePerfumes(filteredPerfumes)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to delete perfume' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Perfumes data file: ${DATA_FILE}`);
});
EOF
