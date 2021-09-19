require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const path = require("path")
const fs = require("fs/promises")
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
})

router.post("/addPlace", uploadFile, async (req, res) => {
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
})

// router.put("/editPlace/:id", async (req, res) => {
//     let placeId = Number(req.params.id)
//     let { p_name, p_image, tp_id } = req.body

//    let result = await place.findUnique({
//         where: {
//             p_id: placeId
//         }
//     })

//     if (!(result)) {
//         return res.status(404).send(`id ${placeId} Can't find your place id`)
//     } 

//     if (!(result.p_name)) {
//         return res.status(404).send(`id ${placeId} Not have this place name`)
//     }

//     let updatePlace = await place.update({
//         where: {
//             p_id: placeId
//         },
//         data: {
//             p_name: p_name,
//             p_image: p_image,
//             tp_id: tp_id
//         }
//     })

//     return res.send({
//         msg: `Update sucessfully`,
//         data: updatePlace
//     })

// })

router.put("/editPlace/:id", uploadFile, async (req, res) => {
    let placeId = Number(req.params.id)

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

            let editPlace = await fs.readFile(file.path, { encoding: "utf-8" })

            await fs.unlink(file.path)
            body = JSON.parse(editPlace)
            if (!body) {
                return res.status(400).send({ status: "Please add data" })
            }

            body.p_image = imageName

            let updatePlace = await place.update({
                where: {
                    p_id: placeId
                },
                data: body
            })

            return res.send({ status: `Update sucessfully`, data: updatePlace})
        }

    }
})

module.exports = router