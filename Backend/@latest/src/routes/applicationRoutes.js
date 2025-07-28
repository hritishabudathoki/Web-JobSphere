const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

router.get('/', async (req, res) => res.json(await Application.find()));
router.post('/', async (req, res) => res.json(await Application.create(req.body)));
router.put('/:id', async (req, res) => res.json(await Application.findByIdAndUpdate(req.params.id, req.body)));
router.delete('/:id', async (req, res) => res.json(await Application.findByIdAndDelete(req.params.id)));

module.exports = router;
