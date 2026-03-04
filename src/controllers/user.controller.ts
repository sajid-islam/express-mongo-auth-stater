import express from 'express';
import User from '../models/User.ts';
export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.session.userSession?.userId;

    const user = await User.findOne({ userId: userId! });

    if (!user) {
      return req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Session destroy error' });
        }

        res.clearCookie('sid');
        return res.status(404).json({ message: 'User Not Found' });
      });
    }

    res.set('Cache-Control', 'no-store');
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
