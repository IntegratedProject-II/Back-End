require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const place_type = new PrismaClient().place_type

router.get("/getPlaceType", async (req, res) => {
    let result = await place_type.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
})

module.exports = router
