import { Router } from 'express';
import getById from './controllers/getById.js';
import serviceHeader from '../utils/serviceHeader.js';

const router = Router();

router.get('/:analyticsId', serviceHeader('analyticsGetById'), getById);

export default router;
