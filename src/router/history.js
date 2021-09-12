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

router.post("/addHistory", async (req, res) => {
    let { h_date, wish, p_id, kt_id, user_id } = req.body

    if (!(h_date || wish || p_id || kt_id || user_id)) {
        return res.send({ status: "Not have data" })
    }
    await history.createMany({
        data: req.body
    })
    return res.send({ status: "Create success" })
})

module.exports = router