const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/users')

function initialize(passport){

    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({where: {email: email}}).then((user)=>{
            if(!user){
                return done(null, false, {message: "tem gente com esse email ai n"})
            }

            bcrypt.compare(password, user.password, (error, equal) => {
                if(equal){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Senha incorreta!"})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id: id } }).then((user) => {
            done(null, user)
        })
    })
}

module.exports = initialize