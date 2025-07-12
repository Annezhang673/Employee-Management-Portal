import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';

export default async function requireHR(req, res, next) {
   try {
      const auth = req.headers.authorization?.split(' ')[1];
      if (!auth) return res.status(401).json({ error: 'Not authenticated' });

      const payload = jwt.verify(auth, process.env.JWT_SECRET);
      // payload.sub is the user ID
      // payload.role is user's role
      if (payload.role !== 'HR') {
         return res.status(403).json({ error: 'HR only endpoint' });
      }

      req.user = await User.findById(payload.sub).lean();
      next();
   } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
   }
}