import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/user.model.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const nombre_persona = profile.displayName;

        let user = await UserModel.findOneByEmail(email);
        console.log('Email recibido:', email);
        console.log('Usuario encontrado:', user);

        if (!user) {
          user = await UserModel.createPersona({
            nombre_persona,
            email,
            rol: 'estudiante',
          });
          return done(null, false, {
            message: 'Usuario creado. Contacta al administrador para acceso.',
          });
        }

        if (!user.activo) {
          return done(null, false, {
            message: 'Usuario inactivo. Contacta al administrador para acceso.',
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Error en GoogleStrategy:', error);
        return done(error, null);
      }
    }
  )
);

// Necesario para sesiones
passport.serializeUser((user, done) => {
  done(null, user.id_persona);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.verificar_idpersona({ id_persona: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
