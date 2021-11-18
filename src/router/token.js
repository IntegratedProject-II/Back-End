require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const verifyToken = require("../middlewares/auth")
const person = new PrismaClient().person

router.get("/check", async (req,res) => {
    console.log(req.person)
    return res.send({msg: "welcome" ,user:req.person })
})

module.exports = router