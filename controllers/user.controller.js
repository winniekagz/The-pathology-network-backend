import {
    create,
    fetchOne,
    fetchAll,
    update,
    deleteUser,
} from '../services/user.service.js';

import {
    response,
    hasValues
} from '../helpers/index.js';

import crypto from 'crypto';

import { User } from '../models/user.js';


import { _AccountService as AccountService } from '../services/account.service.js';

/****
* @Type function {createUser}
* @Params req
* @Params res
****/
export const createUser = async(req, res) => {
    try {
        if(hasValues(req.body, res)) {
            const user = await create(req.body);

            return AccountService.sendToken(user, 200, res);
        } 
        
        return response(res, 400, { success: false, message: 'Ensure all fields have been field'})

    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}


/****
* @Type function {updateUser}
* @Params req
* @Params res
****/
export const updateUser = async(req, res) => {
    try {
        const {id, ...rest} = req.body;
        console.log("red",req.body)
        const user = await update(id, rest);
        return response(res, 200, user);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}

/****
* @Type function {fetchUser}
* @Params req
* @Params res
****/
export const fetchUser = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await fetchOne(id);
        return response(res, 200, user);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}


/****
* @Type function {fetchUsers}
* @Params req
* @Params res
****/
export const fetchUsers = async(req, res) => {
    try {
        const users = await fetchAll();
        return response(res, 200, users);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}


  /***
  * @Type { function Login}
  * @Params { Request req }
  * @Params { Response res }
  ***/
  export const login = async(req, res) => {
    const { email, password } = req.body; console.log( email, password );
    let image = null;

    try {
        let user = await User.findOne({ email }).select("+password");

        if (!user) {
            return response(res, 400, { success: false, message: "User not found" });
        }

        const isMatch = await user.matchPasswords(password);
        if (!isMatch) {
            return response(res, 400, { success: false, message: "Incorrect credetials" })
        }
        
        user.last_login_time = Date.now();
        await user.save();

        return AccountService.sendToken(user, 200, res);
    } catch (e) {
        console.log(e);
        return response(res, 400);
    }
}

/****
* @Type function {deleteUser}
* @Params req
* @Params res
****/
export const _deleteUser = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await deleteUser(id);
        return response(res, 200, user);
    } catch(e) {
        console.log(e);
        return response(res, 400);
    }
}

  /***
  * @Type { function Login}
  * @Params { Request req }
  * @Params { Response res }
  ***/
  export const activate = async(req, res) => {
    const { activationtoken } = req.params;
    if (!activationtoken) {
        return response(res, 400);
    }
      const activateAccountToken = crypto.createHash("sha256").update(activationtoken).digest("hex");
    try {
        let user = await User.findOne({
            activateAccountToken,
            activateAccountExpire: { $gt: Date.now()}
        });

        if (!user) {
            return response(res, 400);
        }
        user = {
            ...user,
            ...(req.body || {})
        }
        user.activateAccountToken = null;
        user.activateAccountExpire = null;
        await user.save();

        return response(res, 201, user);
    } catch (e) {
        console.error(e);
        return response(res, 400);
    }
}

 /***
 * @Type { function Login}
 * @Params { Request req }
 * @Params { Response res }
 ***/
 export const resetpassword = async(req, res) => {
    const { resettoken } = req.params;
    if (!resettoken) {
        return response(res, 400, { success: false, message: "Please provide a reset token" });
    }
     const resetPasswordToken = crypto.createHash("sha256").update(resettoken).digest("hex");
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        });

        if (!user) {
            return response(res, 400, { success: false, message: "Invalid token provided" });
        }
        user.password = req.body.password;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();
        return response(res, 201, user);
    } catch (e) {
        console.error(e);
        return response(res, 400);
    }
}


  /***
  * @Type { function Login}
  * @Params { Request req }
  * @Params { Response res }
  ***/
  export const forgotPassword = async(req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400)
         .json({
             success: false,
             error: "Please provide your email"
         });
        return;
        return response(res, 400, { success: false, message: "Invalid token provided" });

    }
      console.log(email);
      try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return response(res, 400, { success: false, message: "User not found" });
        }

          const resetToken = user.getResetPasswordToken();
        await user.save()
          const resetLink = `http://${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}${process.env.VERSION}/auth/reset-password/${resetToken}`;

        return response(res, 200, { success: true, resetLink });

    } catch (e) {
        console.error(e);
        return response(res, 400, { success: false});

    }
}