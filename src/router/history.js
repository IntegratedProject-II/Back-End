require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const fs = require("fs/promises")
const history = new PrismaClient().history
const person = new PrismaClient().person

router.get("/getHistory/:userId", async (req, res) => {
    let userId = Number(req.params.userId) 
    let result = await history.findMany({
        where: {
            user_id: userId
        },
        select: {
            h_date: true,
            wish: true,
            kt_id: true,
            p_id: true,
            user_id: true
        }
    })
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

router.post("/addHistory", uploadFile, async (req, res) => {
    const files = req.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.fieldname == "data") {
            let newHistory = await fs.readFile(file.path, { encoding: "utf-8" })
            await fs.unlink(file.path)
            body = JSON.parse(newHistory)
            if (!body) {
                return res.status(400).send({ status: "Please add fill data" })
            }
            let result = await history.create({
                data: body
            })

            console.log(result)
            return res.send({ status: `Upload sucessfully` })
        }
    }
})

module.exports = router