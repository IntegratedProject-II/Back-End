require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const kt_type = new PrismaClient().kt_type

router.get("/getType", async (req, res) => {
    try {
    let result = await kt_type.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
    } catch(err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

module.exports = router
