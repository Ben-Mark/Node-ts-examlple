import { Router} from "express";
import createAnimal from './endpoints/create';
import readAnimal from './endpoints/read';
import updateAnimal from './endpoints/update';
import deleteAnimal from './endpoints/delete';
import searchAnimal from './endpoints/search';

const router = Router();

router.post('/create', createAnimal);
router.post('/read', readAnimal);
router.post('/update', updateAnimal);
router.post('/delete', deleteAnimal);
router.post('/search', searchAnimal);

process.env['NODE_TLS_REJECT_UNAUTHORIZED']='0'

export default router;



