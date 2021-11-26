require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const verifyToken = require("../middlewares/auth")
const person = new PrismaClient().person
const personRole = new PrismaClient().person_role
const tk = new PrismaClient().token

router.get("/getPerson", verifyToken, async (req, res) => {
    try {
        let result = await person.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
    } catch (err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

router.post("/register", async (req, res) => {
    try {
        let { fname, lname, username, password, email, role_id, ct_id } = req.body

        if (role_id == 1) {
            if (!(fname && lname && username && password && email && ct_id)) {
                return res.status(400).send({ msg: "Please input information to fill" })
            }
        }

        // } else if (role_id == 2) {
        //     if (!(fname && lname && username && password && email && id_card && phone && role_id && ct_id)) {
        //         return res.status(400).send({ msg: "Please input information to fill" })
        //     }
        // }


        username = username.toLowerCase()

        let findedUser = await person.findFirst({
            where: {
                username: username
            }
        })
        if (findedUser) {
            return res.status(403).send({ msg: "Username is already exists" })
        }

        const saltRound = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltRound)

        let result = await person.create({
            data: {
                fname: fname,
                lname: lname,
                email: email,
                username: username,
                password: hashedPassword,
                role_id: role_id,
                ct_id: ct_id
            }
        })

        return res.send({ msg: "Create User Successfully", data: result })
    } catch (err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

router.get("/checkToken", async (req, res) => {
    try {
        
    } catch(err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

router.post("/signin", async (req, res) => {
    try {
        let { username, password } = req.body

        username = username.toLowerCase()

        let findedUser = await person.findFirst({
            where: {
                username: username
            }
        })

        if (!findedUser) {
            return res.status(401).send({ msg: "Can't find this user" })
        }

        const validPassword = await bcrypt.compare(password, findedUser.password)

        if (!validPassword) {
            return res.status(401).send({ msg: "Invalid Password" })
        }
        delete findedUser.password
        const token = jwt.sign(findedUser, process.env.TOKEN, { expiresIn: "30m" }) 
        return res.header("pj-token", token).send({ token: token, role: findedUser.role_id, userId: findedUser.user_id })
    } catch (err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

router.delete("/signout", verifyToken, async (req, res) => {
    try {
        let signOut = await tk.create({
            data: {
                token: req.token
            }
        })

        return res.status(200).send({ msg: "Sign out!!" })
    } catch (err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

router.put("/editProfile/:id", async (req, res) => {
    try {
        let personId = Number(req.params.id)
        let { fname, lname, username, email, id_card, phone, role_id, ct_id } = req.body

        let isHave = await person.findUnique({
            where: {
                user_id: personId
            }
        })
        if (!(isHave)) {
            return res.status(404).send(`id ${personId} Can't find your user id`)
        }

        // console.log(isHave.username)
        if (!(isHave.username)) {
            return res.status(404).send(`id ${personId} Not have this username`)
        }
        if (role_id == 1) {
            let updateProfile = await person.update({
                where: {
                    user_id: personId
                },
                data: {
                    fname: fname,
                    lname: lname,
                    username: username,
                    email: email,
                    role_id: role_id,
                    ct_id: ct_id
                }
            })
            // console.log(updateProfile)
            return res.send({
                msg: `Update sucessfully`,
                data: updateProfile
            })
        }

        if (role_id == 2) {
            let updateProfile = await person.update({
                where: {
                    user_id: personId
                },
                data: {
                    fname: fname,
                    lname: lname,
                    username: username,
                    email: email,
                    id_card: id_card,
                    phone: phone,
                    role_id: role_id,
                    ct_id: ct_id
                }
            })
            // console.log(updateProfile)
            return res.send({
                msg: `Update sucessfully`,
                data: updateProfile
            })
        }
    } catch (err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

module.exports = router

