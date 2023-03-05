import { NextFunction, Request, Response } from "express";

export function verifyRoles(roles: string[]) {
  return function verifyJWT(request: Request, response: Response, next: NextFunction){
    // @ts-ignore
    const role = request.userRole;
  
    if (!role) {
      return response.status(500).json({
        success: false,
        message: 'User should have a role!',
        data: null
      });
    }

    if (roles.includes(role)) {
      next();
    } else {
      return response.status(401).json({
        success: false,
        message: `User should have ${roles.map(item => `'${item}'`).join(', ')} role${roles.length > 1 ? 's' : ''}`,
        data: {
          role
        }
      });
    }
  }
}