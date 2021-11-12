require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const path = require("path")
const fs = require("fs/promises")
const place_type = new PrismaClient().place_type

router.get("/getPlaceType", async (req, res) => {
    let result = await place_type.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
})

router.post("/addPlaceType", uploadFile, async (req, res) => {
    const files = req.files
    let imageFiles = []
    let imageName;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.fieldname == "image") {
            imageFiles.push(file)
            imageName = imageFiles[i].filename
        }
        if (file.fieldname == "data") {
            let newPlaceType = await fs.readFile(file.path, { encoding: "utf-8" })
            await fs.unlink(file.path)
            body = JSON.parse(newPlaceType)
            if (!body) {
                return res.status(400).send({ status: "Please add fill data" })
            }

            body.tp_image = imageName

            let result = await place_type.create({
                data: body
            })

            console.log(result)
            return res.send({ status: `Upload sucessfully` })
        }

    }
})

router.delete("/delete/:id", async (req, res) => {
    let placeTypeId = Number(req.params.id)

    let findImage = await place_type.findUnique({
        where: {
            tp_id: placeTypeId
        },
        select: {
            tp_image: true
        }
    })

    let imagePath = path.join(__dirname, `../../uploads/${findImage.tp_image}`)
    await fs.unlink(imagePath)

    let result = await place_type.delete({
        where: {
            tp_id: placeTypeId
        }
    })

    if (!result) {
        return res.send({ status: "Can't find your place type" })
    }
    // console.log(result)
    return res.send({ status: "Delete Successful" })
})

router.put("/editPlaceType/:id", uploadFile, async (req, res) => {
    let placeTypeId = Number(req.params.id)

    const files = req.files
    let imageFiles = []
    let imageName;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.fieldname == "image") {
            imageFiles.push(file)
            imageName = imageFiles[i].filename
        }
        if (file.fieldname == "data") {
            let findImage = await place_type.findUnique({
                where: {
                    tp_id: placeTypeId
                },
                select: {
                    tp_image: true
                }
            })

            let imagePath = path.join(__dirname, `../../uploads/${findImage.tp_image}`)
            await fs.unlink(imagePath)

            let editPlaceType = await fs.readFile(file.path, { encoding: "utf-8" })

            await fs.unlink(file.path)
            body = JSON.parse(editPlaceType)
            if (!body) {
                return res.status(400).send({ status: "Please add data" })
            }

            body.tp_image = imageName

            let updatePlaceType = await place_type.update({
                where: {
                    tp_id: placeTypeId
                },
                data: body
            })

            return res.send({ status: `Update sucessfully`, data: updatePlaceType})
        }

    }
})

module.exports = router
