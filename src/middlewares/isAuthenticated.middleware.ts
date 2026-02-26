import express from 'express';

const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.session.userSession) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  next();
};

export default isAuthenticated;
