import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export function verifyJWT(request: Request, response: Response, next: NextFunction){
  const token = request.headers['authorization'];

  if (!token) {
    return response.status(401).json({
      success: false,
      message: 'No token provided.',
      data: null
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, function(err, decoded) {
    if (err || !decoded){ 
      return response.status(500).json({
        success: false,
        message: 'Failed to authenticate token.',
        data: null
      })
    }

    // @ts-ignore
    request.userId = decoded.id;
    // @ts-ignore
    request.userRole = decoded.role;
  
    next();
  });
}