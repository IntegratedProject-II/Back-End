require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const path = require("path")
const fs = require("fs/promises")
const place = new PrismaClient().place

router.get("/getPlace", async (req, res) => {
    try {
        let result = await place.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.get("/getPlace/:id", async (req, res) => {
    try {
        let placeId = Number(req.params.id)
        if (placeId == undefined) {
            return res.status(400).send({ status: "Don't have any data" })
        }

        let placeData = await place.findUnique({
            where: {
                p_id: placeId
            },
            select: {
                p_name: true,
                tp_id: true,
                detail: true,
                p_image: true,
                place_type: true
            }
        })

        if (!placeData) {
            return res.send({ status: `This place is not found` })
        }
        return res.send({ data: placeData })
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        let placeId = Number(req.params.id)

        let findImage = await place.findUnique({
            where: {
                p_id: placeId
            },
            select: {
                p_image: true
            }
        })

        let imagePath = path.join(__dirname, `../../uploads/${findImage.p_image}`)
        await fs.unlink(imagePath)

        let result = await place.delete({
            where: {
                p_id: placeId
            }
        })

        if (!result) {
            return res.send({ status: "Can't find your place" })
        }
        // console.log(result)
        return res.send({ status: "Delete Successful" })
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.post("/addPlace", uploadFile, async (req, res) => {
    try {
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
                let newPlace = await fs.readFile(file.path, { encoding: "utf-8" })
                await fs.unlink(file.path)
                body = JSON.parse(newPlace)
                if (!body) {
                    return res.status(400).send({ status: "Please add fill data" })
                }

                body.p_image = imageName

                let result = await place.create({
                    data: body
                })

                console.log(result)
                return res.send({ status: `Upload sucessfully` })
            }
        }
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

//edit
router.put("/editPlace/:id", uploadFile, async (req, res) => {
    try {
        let placeId = Number(req.params.id)

        const files = req.files
        let imageFiles = []
        let imageName;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.fieldname == "image") {
                if (files) {
                    imageFiles.push(file)
                    imageName = imageFiles[i].filename
                    let oldImg = await place.findUnique({
                        where: {
                            p_id: placeId
                        },
                        select: {
                            p_image: true
                        }
                    })
                    if(!oldImg){
                        return res.status(404).send({status: "Not found image"})
                    }
                    let imagePath = path.join(__dirname, `../../uploads/${oldImg.p_image}`)
                    await fs.unlink(imagePath)
                }else{
                    placeImage = await place.findUnique({
                        where: {
                            p_id: placeId
                        },
                        select: {
                            p_image: true
                        }
                    })
                }
            }
            if (file.fieldname == "data") {
                let findImage = await place.findFirst({
                    where: {
                        p_id: placeId
                    },
                    select: {
                        p_image: true,
                        tp_id: true
                    }
                })
                let editPlace = await fs.readFile(file.path, {
                    encoding: "utf-8"
                })
                body = JSON.parse(editPlace)
                await fs.unlink(file.path)
                if (!body) {
                    return res.status(400).send({ status: "Please add data" })
                }

                body.p_image = imageName
                body.tp_id = findImage.tp_id

                let updatePlace = await place.update({
                    where: {
                        p_id: placeId
                    },
                    data: body
                })

                return res.send({ status: `Update sucessfully`, data: updatePlace })
            }
        }
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

module.exports = router