import express from 'express';

const router = express.Router();

router
    .route('/job')
    .get((_req, res) =>
        res.send('<h2 style="color: red; text-align: center;">Jobs route coming soon</h2>')
    );
export default router