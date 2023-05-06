import jsonwebtoken from "jsonwebtoken";

import { User } from '../models/user.js';

export const hasPermissions = (permission) => {
    return async (req, res, next) => {
        let token;

        if(!req.headers?.['x-access-token']){
            return req.status(403).json(
                    {
                        success: false,
                        error: "No authorization token provided"
                    }
                    );
        }

        try {
            token = req.headers['x-access-token'];
            const user_data = jsonwebtoken.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(user_data?.id);
           
            if(!user){
                return res.status(403).
            json({
                message: "No permissions to perform this action"
            });
            }

            if(+(user.role) !== +permission){
                return res.status(403).
                    json({
                        message: "No permissions to perform this action"
                    });
            }

            return  next();

        } catch (e) {
            console.error(e);
            res.status(400).json(
                    {
                        success: false,
                        error: "Server error"
                    }
                    )
        }
    }
}
