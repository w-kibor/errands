import { Router } from 'express';
import { serviceCatalog } from '../constants/services.js';

export const servicesRouter = Router();

servicesRouter.get('/', (_req, res) => {
  return res.json({ services: serviceCatalog });
});
