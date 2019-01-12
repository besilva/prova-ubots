import express from 'express';
import * as ctrl from './controller';

const router = express.Router();
router.get('/', ctrl.getAll);
router.get('/richest', ctrl.getWithHighestOrder);
router.get('/mostLoyal', ctrl.mostLoyal);
router.post('/suggest', ctrl.suggestWine);
export default router;