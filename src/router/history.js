require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const fs = require("fs/promises")
const history = new PrismaClient().history
const place = new PrismaClient().place

router.get("/getHistory/:userId", async (req, res) => {
    try {
        let userId = Number(req.params.userId)
        let result = await history.findMany({
            where: {
                user_id: userId
            },
            include: {
                place: true
            }
        })

        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })

    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        let historyId = Number(req.params.id)
        let result = await history.delete({
            where: {
                h_id: historyId
            }
        })
        console.log(result)
        return res.send({ status: "Delete Successful" })
    } catch (err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

router.post("/addHistory", async (req, res) => {
    try {
        let { h_date, wish, kt_id, user_id, p_id } = req.body

        if (!(h_date && wish && kt_id && user_id && p_id)) {
            return res.status(400).send({ msg: "Please input information to fill" })
        }

        let result = await history.create({
            data: {
                h_date: h_date,
                wish: wish,
                kt_id: kt_id,
                user_id: user_id,
                p_id: p_id
            }
        })

        return res.send({ msg: "Create History Successfully", data: result })
    } catch (err) {
        res.status(500)
        return res.send("An error occurred")
    }
})

module.exports = router