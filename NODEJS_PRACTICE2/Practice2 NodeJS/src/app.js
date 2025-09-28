const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let cards = [
    { id: 1, suit: "Hearts", value: "Ace" },
    { id: 2, suit: "Spades", value: "King" },
    { id: 3, suit: "Diamonds", value: "Queen" }
];

let nextCardId = 4;

app.get('/cards', (req, res) => {
    res.status(200).json(cards);
});

app.get('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const card = cards.find(c => c.id === id);

    if (card) {
        res.status(200).json(card);
    } else {
        res.status(404).json({ message: `Card with ID ${id} not found.` });
    }
});

app.post('/cards', (req, res) => {
    const { suit, value } = req.body;

    if (!suit || !value) {
        return res.status(400).json({ message: "Missing required fields: suit and value." });
    }

    const newCard = {
        id: nextCardId++,
        suit,
        value
    };

    cards.push(newCard);

    res.status(201).json(newCard);
});

app.delete('/cards/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cardIndex = cards.findIndex(c => c.id === id);

    if (cardIndex !== -1) {
        const [deletedCard] = cards.splice(cardIndex, 1);

        res.status(200).json({
            message: `Card with ID ${id} removed`,
            card: deletedCard
        });
    } else {
        res.status(404).json({ message: `Card with ID ${id} not found.` });
    }
});

app.listen(port, () => {
    console.log(`Card API server listening at http://localhost:${port}`);
});