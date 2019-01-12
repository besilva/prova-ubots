import express from 'express';
import customer from './customer';

const router = express.Router();
router.use("/customers", customer);

export default router;