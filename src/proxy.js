import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Habilitar CORS
app.use(cors());

// Ruta para obtener datos de CoinMarketCap
app.get("/api/crypto", async (req, res) => {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        params: { symbol: "BTC", convert: "USD" },
        headers: { "X-CMC_PRO_API_KEY": "1135de38-4caa-484d-8065-bc8d49bc9345" },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data from CoinMarketCap" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
