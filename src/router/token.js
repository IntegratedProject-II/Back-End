require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const verifyToken = require("../middlewares/auth")
const person = new PrismaClient().person


router.get("/check", verifyToken, async (req,res) => {
    try {
    console.log(req.user)
    res.send({msg: "welcome" ,user:req.user })
    } catch(err) {
        res.status(500)
        return res.send({err: err.message})
    }
})

module.exports = router