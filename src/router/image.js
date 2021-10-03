require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const fs = require("fs/promises")
const path = require("path")
const kt = new PrismaClient().krathong
const place = new PrismaClient().place

router.get("/krathongImage/:id", async (req, res) => {
    let ktId = Number(req.params.id) 
    if (ktId == undefined) {
        return res.status(400).send({ status: "Don't have any data" })
    }

    let ktImage = await kt.findUnique({
        where: {
            kt_id: ktId
        },
        select: {
            kt_image: true
        }
    })

    if (!ktImage) {
        return res.send({ status: `This product image is not found` })
    }

    const fileDir = path.join(__dirname, `../../uploads/${ktImage.kt_image}`)
    res.sendFile(fileDir)
})

router.get("/placeImage/:id", async (req, res) => {
    let placeId = Number(req.params.id) 
    if (placeId == undefined) {
        return res.status(400).send({ status: "Don't have any data" })
    }

    let placeImage = await place.findUnique({
        where: {
            p_id: placeId
        },
        select: {
            p_image: true
        }
    })

    if (!placeImage) {
        return res.send({ status: `This product image is not found` })
    }

    const fileDir = path.join(__dirname, `../../uploads/${placeImage.p_image}`)
    res.sendFile(fileDir)
})

// router.get("/getKrathongImage/:name", async (req, res) => {
//     const image = req.params.name
//     const fileDir = path.join(__dirname, `../../uploads/${image}`)
//     let showId = await kt.findMany({
//         where: {
//             kt_image: image
//         },
//         select: {
//             kt_id: true
//         }
//     })

//     res.sendFile(fileDir, showId)
// })

module.exports = router