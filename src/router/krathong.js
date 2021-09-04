require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const kt = new PrismaClient().krathong
const his = new PrismaClient().history

router.get("/getKrathong", async (req, res) => {
    let result = await kt.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
})

router.delete("/delete/:id", async (req, res) => {
    let ktId = Number(req.params.id)
    let results = await his.deleteMany({
        where: {
            kt_id: ktId
        }
    })
    let result = await kt.deleteMany({
        where: {
            kt_id: ktId
        }
    })
        console.log(result)
        return res.send({ status: "Delete Successful" })
})


module.exports = router