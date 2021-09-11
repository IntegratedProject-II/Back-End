require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const history = new PrismaClient().history

router.get("/getHistory", async (req, res) => {
    let result = await history.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
})

router.delete("/delete/:id", async (req, res) => {
    let historyId = Number(req.params.id)
    let result = await history.delete({
        where: {
            h_id: historyId
        }
    })
        console.log(result)
        return res.send({ status: "Delete Successful" })
})

module.exports = router