const express = require('express');
const app = express();
const port = 3000;

const LOCK_DURATION_MS = 60000; 

const seats = {
    "1": { status: "available", lockedBy: null, lockExpiresAt: null },
    "2": { status: "available", lockedBy: null, lockExpiresAt: null },
    "3": { status: "available", lockedBy: null, lockExpiresAt: null },
    "4": { status: "available", lockedBy: null, lockExpiresAt: null },
    "5": { status: "available", lockedBy: null, lockExpiresAt: null }
};

let nextUserId = 100;

function checkLockExpiration(seatId) {
    const seat = seats[seatId];
    if (seat && seat.status === 'locked' && seat.lockExpiresAt < Date.now()) {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        console.log(`Lock for Seat ${seatId} has expired.`);
        return true;
    }
    return false;
}

app.get('/seats', (req, res) => {
    Object.keys(seats).forEach(checkLockExpiration);
    
    const statusMap = {};
    for (const [id, seat] of Object.entries(seats)) {
        statusMap[id] = { status: seat.status };
    }
    
    res.status(200).json(statusMap);
});

app.post('/lock/:seatId', (req, res) => {
    const seatId = req.params.seatId;
    const seat = seats[seatId];
    
    const userId = nextUserId++; 
    
    if (!seat) {
        return res.status(404).json({ message: `Seat ${seatId} not found.` });
    }

    checkLockExpiration(seatId);

    if (seat.status === 'booked') {
        return res.status(400).json({ message: `Seat ${seatId} is already booked.` });
    }
    
    if (seat.status === 'locked') {
        return res.status(409).json({ message: `Seat ${seatId} is already locked by another user.` });
    }

    seat.status = 'locked';
    seat.lockedBy = userId;
    seat.lockExpiresAt = Date.now() + LOCK_DURATION_MS;
    
    setTimeout(() => {
        if (seats[seatId].status === 'locked' && seats[seatId].lockedBy === userId) {
            seats[seatId].status = 'available';
            seats[seatId].lockedBy = null;
            seats[seatId].lockExpiresAt = null;
            console.log(`Seat ${seatId} lock (User ${userId}) expired automatically.`);
        }
    }, LOCK_DURATION_MS);
    
    res.status(200).json({ 
        message: `Seat ${seatId} locked successfully. Confirm within ${LOCK_DURATION_MS / 1000} seconds.`,
        lockId: userId
    });
});

app.post('/confirm/:lockId', (req, res) => {
    const lockId = parseInt(req.params.lockId);
    let confirmedSeatId = null;

    const seatId = Object.keys(seats).find(id => {
        const seat = seats[id];
        checkLockExpiration(id); 
        return seat.status === 'locked' && seat.lockedBy === lockId;
    });

    if (!seatId) {
        return res.status(400).json({ message: "Seat is not locked or lock has expired and cannot be booked" });
    }
    
    const seat = seats[seatId];

    seat.status = 'booked';
    seat.lockedBy = null;
    seat.lockExpiresAt = null;
    
    res.status(200).json({ 
        message: `Seat ${seatId} booked successfully!`,
        seatId: seatId 
    });
});

app.listen(port, () => {
    console.log(`Booking API server listening at http://localhost:${port}`);
});