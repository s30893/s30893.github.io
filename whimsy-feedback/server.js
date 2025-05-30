const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/ankieta", (req, res) => {
    const feedback = req.body;

    // Wczytaj dotychczasowe dane
    fs.readFile("responses.json", "utf8", (err, data) => {
        let responses = [];
        if (!err && data) {
            responses = JSON.parse(data);
        }

        responses.push({
            ...feedback,
            date: new Date().toISOString()
        });

        // Zapisz do pliku
        fs.writeFile("responses.json", JSON.stringify(responses, null, 2), (err) => {
            if (err) {
                console.error("Błąd zapisu:", err);
                return res.status(500).send("Błąd serwera");
            }
            res.status(200).send("Dzięki!");
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
