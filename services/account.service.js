import { User} from '../models/user.js';
import jsonwebtoken from  'jsonwebtoken';
import fs from 'fs';


class AccountService {
    /***
  * @Type { function sendToken}
  * @Params { user }
  * @Params { statusCode }
  * @Params { Response res }
  ***/
  sendToken(user, statusCode, res){
        const token = user.getSignedToken();

        if (user?.image) {
            fs.readFile(user?.image, (err, data) => {

                if (err) {
                    // res.writeHead(500, { 'Content-Type': 'text/plain' });
                    // res.end('Internal Server Error');
                    console.error(err);
                }

                res.status(statusCode).json({
                    success: true,
                    ...(token || {}),
                    image: data,
                    user
                })
            });
        } else {
            res.status(statusCode).json({
                success: true,
                ...(token || {}),
                image: null,
                user
            })
        }
    }

    /***
    * @Type { function decode_Token}
    * @Params { token }
    ***/
    decode_token(token){
        if(token){
            const base64String = token.split('.')[1];
            const decodedValue = JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
            return decodedValue;
        }
        return null;
    }

    /***
    * @Type { function processe_refresh_token}
    * @Params { token }
    ***/
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

            return (
                {
                    valid: true,
                    expired: false,
                    decoded
                }
                )

        } catch (e) {

            return (
                {
                    valid: false,
                    expired: e.message === "jwt expired",
                    decoded: null
                }
                )
        }
    }

    /***
    * @Type { function processe_refresh_token}
    * @Params { token }
    ***/
    processe_refresh_token(token){
        if(token){
            const base64String = token.split('.')[1];
            const decodedValue = JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
            return decodedValue;
        }
        return null;
    }


    /***
    * @Type { function search}
    * @Params { token }
    ***/
    async search(key) {
        if(!(key?.length)) return null;

        const regex = new RegExp(key, 'i');

        try {
            const user = await User.find({
                $or: [
                    {
                        full_name: { $regex : regex}
                    },
                    {
                        email: { $regex : regex }
                    },
                    {
                        mobile: { $regex : regex}
                    }
                ]
            });
            return user;
        } catch(err) {
            console.error(err);
            return null;
        }
    }
}

export const  _AccountService = new AccountService();
