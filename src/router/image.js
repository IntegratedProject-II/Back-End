require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const fs = require("fs/promises")
const path = require("path")
const kt = new PrismaClient().krathong
const place = new PrismaClient().place
const place_type = new PrismaClient().place_type

router.get("/krathongImage/:id", async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500)
        return res.send({err: err.message})
    }
})

router.get("/placeImage/:id", async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500)
        return res.send({err: err.message})
    }
})

router.get("/placeTypeImage/:id", async (req, res) => {
    try {
        let placeTypeId = Number(req.params.id)
        if (placeTypeId == undefined) {
            return res.status(400).send({ status: "Don't have any data" })
        }

        let placeTypeImage = await place_type.findUnique({
            where: {
                tp_id: placeTypeId
            },
            select: {
                tp_image: true
            }
        })

        if (!placeTypeImage) {
            return res.send({ status: `This product image is not found` })
        }

        const fileDir = path.join(__dirname, `../../uploads/${placeTypeImage.tp_image}`)
        res.sendFile(fileDir)
    } catch (err) {
        res.status(500)
        return res.send({err: err.message})
    }
})

module.exports = router