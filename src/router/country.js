require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const country = new PrismaClient().country

router.get("/getCountry", async (req, res) => {
    try {
    let result = await country.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
    } catch (err) {
        res.status(500)
        return res.send({err: err.message})
    }
})

module.exports = router
