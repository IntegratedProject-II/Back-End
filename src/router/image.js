require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const fs = require("fs/promises")
const path = require("path")
const kt = new PrismaClient().krathong
const place = new PrismaClient().place

router.get("/getKrathongImage/:name", async (req, res) => {
    const image = req.params.name
    const fileDir = path.join(__dirname, `../../uploads/${image}`)
    res.sendFile(fileDir)
})

module.exports = router