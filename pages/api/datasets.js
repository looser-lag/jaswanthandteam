export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📡 Frontend: Loading dataset from backend...');
    
    const response = await fetch('http://localhost:5000/api/datasets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Frontend: Dataset loaded:', data.name);
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Frontend Dataset API Error:', error);
    res.status(500).json({ 
      error: 'Cannot connect to ML backend',
      details: error.message 
    });
  }
}