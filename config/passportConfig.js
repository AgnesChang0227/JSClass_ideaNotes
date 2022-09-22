import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export default (passport) => {
    passport.use(new LocalStrategy({usernameField: "emailInput",passwordField:"passwordInput"},
        (emailInput, passportInput, done) => {
            User.findOne({email: emailInput})
                .then(user => {
                    if (!user) {
                       return  done(null, false, {
                            type: "fail_passport",
                            message: "No User Found",
                        });
                    } else {
                        bcrypt.compare(passportInput, user.password, (err, isMatch) => {
                            if (err) throw err;
                            if (isMatch) {
                               return  done(null, user);
                            } else {
                               return  done(null, false, {//除了false，再send個object(err info)
                                    type: "fail_passport",
                                    message: "Password Incorrect",
                                })
                            }
                        })
                    }
                })
        }))
    passport.serializeUser((user,done)=>{// => token
        done(null,user.id);
    });
    passport.deserializeUser((id,done)=>{// delete token
        User.findById(id,()=>{
            done(err,user);
        })
    })
}