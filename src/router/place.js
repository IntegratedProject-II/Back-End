require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const place = new PrismaClient().place

router.get("/getPlace", async (req, res) => {
    let result = await place.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
})

router.delete("/delete/:id", async (req, res) => {
    let placeId = Number(req.params.id)
    let result = await place.delete({
        where: {
            p_id: placeId 
        }
    })
        console.log(result)
        return res.send({ status: "Delete Successful" })
})

module.exports = router