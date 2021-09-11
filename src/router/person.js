require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const verifyToken = require("../middlewares/auth")
const person = new PrismaClient().person

router.get("/getPerson", async (req, res) => {
    let result = await person.findMany()
    if (result == undefined || result.length < 0) {
        return res.status(400).send({ status: "Don't have any data" })
    }
    return res.send({ data: result })
})

router.post("/register", async (req, res) => {
    let { fname, lname, username, password, email, id_card, phone, role_id, ct_id } = req.body
    if (!role_id) {
        return res.status(400).send({ msg: "Please input information to fill" })
    }
    if (role_id == 1) {
        if (!(fname && lname && username && password && email && role_id && ct_id)) {
            return res.status(400).send({ msg: "Please input information to fill" })
        }
    } else if (role_id == 2) {
        if (!(fname && lname && username && password && email && id_card && phone && role_id && ct_id)) {
            return res.status(400).send({ msg: "Please input information to fill" })
        }
    }


    username = username.toLowerCase()

    let findedUser = await person.findFirst({
        where: {
            username: username
        }
    })
    if (findedUser) {
        return res.status(400).send({ msg: "Username is already exists" })
    }

    const saltRound = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, saltRound)

    let result = await person.create({
        data: {
            fname: fname,
            lname: lname,
            email: email,
            id_card: id_card,
            phone: phone,
            role_id: role_id,
            ct_id: ct_id,
            username: username,
            password: hashedPassword
        }
    })

    return res.send({ msg: "Create User Successfully", data: result })
})


module.exports = router