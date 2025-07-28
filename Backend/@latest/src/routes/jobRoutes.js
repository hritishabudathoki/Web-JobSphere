const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/', async (req, res) => res.json(await Job.find()));
router.post('/', async (req, res) => res.json(await Job.create(req.body)));
router.put('/:id', async (req, res) => res.json(await Job.findByIdAndUpdate(req.params.id, req.body)));
router.delete('/:id', async (req, res) => res.json(await Job.findByIdAndDelete(req.params.id)));

module.exports = router;
