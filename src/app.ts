import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { AuthRoutes } from './routes/AuthRoutes';
import { UserRoutes } from './routes/UserRoutes';
import { RegionRoutes } from './routes/RegionRoutes';
import { CityRoutes } from './routes/CityRoutes';
import { CineRoutes } from './routes/CineRoutes';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(AuthRoutes)
app.use(UserRoutes)
app.use(RegionRoutes)
app.use(CityRoutes)
app.use(CineRoutes)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        success: false,
        message: error.message ?? 'Unexpected error!',
        data: error
    })
})

export default app;