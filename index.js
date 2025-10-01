import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import path from 'path';
import userRouter from './routes/user.route.js';

import session from 'express-session';
import passport from './middlewares/passport.js';
import { swaggerUiMiddleware, swaggerUiSetup } from './swagger.js';
import adminRouter from './routes/admin.route.js';
import estudianteRouter from './routes/estudainte.toute.js';

const app = express();

app.use(
  session({
    secret: 'Cedhi2025firma32961', // Usa tu FIRMA_cokie o una clave segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true solo si usas HTTPS
  })
);

app.use(
  cors({
    origin: process.env.URL_FRONT,
    credentials: true,
  })
);

app.use(cookieParser(process.env.FIRMA_cokie));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ====== 🔀 FIX para /undefined/... ======
app.get('/undefined/api/auth/google', (req, res) => {
  return res.redirect('/api/auth/google');
});

app.get('/undefined/api/auth/google/callback', (req, res) => {
  return res.redirect('/api/auth/google/callback');
});
// =======================================

// Rutas de tu app
app.use('/api/estudiante', estudianteRouter);
app.use('/api/admin', adminRouter);
app.use('/api', userRouter);

app.use('/docs', swaggerUiMiddleware, swaggerUiSetup);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor andando en ' + PORT));
