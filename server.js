if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const Users = require('./models/users')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
// const bodyParser = require('body-parser')
const initializePassport = require('./passport-config')

initializePassport(passport)

// Configs
    app.set('view-engine', 'ejs')
    app.use(flash())
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    // app.use(bodyParser.json())
    // app.use(bodyParser.urlencoded({ extended: true}))
    app.use(express.urlencoded({extended: false}))
    

// Routes
    app.get('/', (req, res) => {
        res.render('index.ejs', { name: req.user.name })
    })

    app.get('/login', (req, res) => {
        res.render('login.ejs')
    })

    //Logging In
    app.post('/login', (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next)
    })

    app.get('/register', (req, res) => {
        res.render('register.ejs')
    })

    //Registering
    app.post('/register', async (req, res) => {
        const finder = await Users.findOne({where: {email: req.body.email}})
        
        if(finder){
            console.log("ja tem alguem com esse email")
        }else{
            if(req.body.password == req.body.password2 && req.body.password && req.body.password2){
                try {
                    const hashedPw = await bcrypt.hash(req.body.password, 10)
                    Users.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPw
                    })
                    console.log("Registrado com sucesso!")
                    res.redirect('/login')
                }catch{
                    console.log("Um erro ocorreu ao tentar criar sua conta")
                }
            }else{
                console.log("Senhas diferentes!")
                res.redirect("/register")
            }
        }
    })

app.listen(3000)