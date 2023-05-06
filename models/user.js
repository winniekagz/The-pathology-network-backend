import mongoose from 'mongoose';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


//User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            "Please provide a valid email "
        ]
    },
    image: {
        type: String,
    },
    role: {
        type: Number,
        default: 1,
    },
    permissions: {
      type: [Number]  
    },
    password: {
        type: String,
        required: true
    },
    projects: {
        type: [String]
    },
    last_login_time: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    activateAccountToken:String,
    activateAccountExpire: Date,
});

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPasswords  = async function(password){
    return await bycrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function(){
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
    });
    return ({ token, refreshToken })
};

userSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

userSchema.methods.getActivateAccountToken = function (){
    const activateToken = crypto.randomBytes(20).toString("hex");

    this.activateAccountToken = crypto
     .createHash("sha256")
     .update(activateToken)
     .digest("hex");

    this.activateAccountExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}



export const User = mongoose.model('User', userSchema);
