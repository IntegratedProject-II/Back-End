require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const fs = require("fs/promises")
const kt = new PrismaClient().krathong

router.get("/getKrathong", async (req, res) => {
    let result = await kt.findMany()
    if (result == undefined || result.length < 0) {
        return res.status(400).send({ status: "Don't have any data" })
    }
    return res.send({ data: result })
})

router.delete("/delete/:id", async (req, res) => {
    let ktId = Number(req.params.id)

    let findImage = await kt.findUnique({
        where: {
            kt_id: ktId
        },
        select: {
            kt_image: true
        }
    })
    console.log(findImage)

    let imagePath = path.join(__dirname, `../../uploads/${findImage.kt_image}`)
    await fs.unlink(imagePath)
    console.log(imagePath)

    let result = await kt.delete({
        where: {
            kt_id: ktId
        }
    })

    if (!result) {
        return res.send({ status: "Can't find your krathong" })
    }
    // console.log(result)
    return res.send({ status: "Delete Successful" })
})

router.post("/addKrathong", uploadFile, async (req, res) => {
    //let { kt_name, amount, kt_image, detail, t_id } = req.body
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
            let newKrathong = await fs.readFile(file.path, { encoding: "utf-8" })
            await fs.unlink(file.path)
            body = JSON.parse(newKrathong)
            if (!body) {
                return res.status(400).send({ status: "Please add fill data" })
            }

            body.kt_image = imageName

            let result = await kt.create({
                data: body
            })

            console.log(result)
            return res.send({ status: `Upload sucessfully` })
        }

    }
})

router.put("/editKrathong/:id", uploadFile, async (req, res) => {
    let ktId = Number(req.params.id)
    // let { kt_name, amount, kt_image, detail, t_id } = req.body

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
            let findImage = await kt.findUnique({
                where: {
                    kt_id: ktId
                },
                select: {
                    kt_image: true
                }
            })

            let imagePath = path.join(__dirname, `../../uplaods/${findImage.kt_image}`)
            await fs.unlink(imagePath)

            let editKrathong = await fs.readFile(file.path, { encoding: "utf-8" })

            await fs.unlink(file.path)
            body = JSON.parse(editKrathong)
            if (!body) {
                return res.status(400).send({ status: "Please add data" })
            }

            body.kt_image = imageName

            let updateKrathong = await kt.update({
                where: {
                    kt_id: ktId
                },
                data: body
            })

            return res.send({ status: `Update sucessfully`, data: updateKrathong})
        }

    }
})

module.exports = router