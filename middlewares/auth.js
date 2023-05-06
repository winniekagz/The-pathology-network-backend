import jsonwebtoken from  'jsonwebtoken';
import { User } from '../models/user.js';
import {  _AccountService as AccountService } from "../services/account.service.js";

export const isAuthenticated =  async(req, res, next) => {
    let token;

    if(!req.headers["x-access-token"]) {
        return res.status(403).
                  json({
                      message: "Not authorized to access this route"
                  });
    }

   try {
        token = req?.headers?.["x-access-token"];

        const decoded = await AccountService.verifyToken(token);

        if(!decoded?.expired) {
            const user = await User.findById(decoded?.decoded?.id);

            if(!user){
                return res.status(403).
                            json({
                                message: "Not authorized to access this route"
                            });
            }
            res.user = user;
            return next();
        }

       if(decoded?.expired && req?.headers?.["x-refresh-token"]) {
           const { decoded } = await AccountService.verifyToken(req?.headers?.["x-refresh-token"]);

           if(!decoded) {
               return res.status(403).
                            json({
                                message: "Not authorized to access this route"
                            });
           }

           const user = await User.findById(decoded?.id);

           if(!user){
               return res.status(403).
                            json({
                                message: "Not authorized to access this route"
                            });
           }

           const genTokens = await user.getSignedToken();

           if (AccountService.verifyToken(genTokens?.token)?.expired) {
               return res.status(403).
                            json({
                                message: "Not authorized to access this route"
                            });
           }

           res.setHeader("Access Control Expose Headers", ["y-access-token", "y-refresh-token"])
           res.setHeader("y-access-token", genTokens?.token);
           res.setHeader("y-refresh-token", genTokens?.refreshToken);
           res.user = user;
           return next();
       }

       return res.status(403).
                    json({
                        message: "Not authorized to access this route"
                    });

    } catch(e) {
        return res.status(403).
                json({
                    message: "Not authorized to access this route3"
                });
    }
}