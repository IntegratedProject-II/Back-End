require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const path = require("path")
const fs = require("fs/promises")
const kt = new PrismaClient().krathong
const history = new PrismaClient().history

router.get("/getKrathong", async (req, res) => {
    try {
        let result = await kt.findMany()
        if (result == undefined || result.length < 0) {
            return res.status(400).send({ status: "Don't have any data" })
        }
        return res.send({ data: result })
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.get("/getKrathong/:id", async (req, res) => {
    try {
        let ktId = Number(req.params.id)
        if (ktId == undefined) {
            return res.status(400).send({ status: "Don't have any data" })
        }

        let ktData = await kt.findUnique({
            where: {
                kt_id: ktId
            },
            select: {
                kt_image: true,
                kt_name: true,
                kt_type: true,
                detail: true,
                amount: true
            }
        })

        if (!ktData) {
            return res.send({ status: `This product is not found` })
        }
        return res.send({ data: ktData })
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
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

        return res.send({ status: "Delete Successful" })
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.post("/addKrathong", uploadFile, async (req, res) => {
    try {
        const files = req.files
        let imageFiles = []
        let imageName;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.fieldname == "image") {
                imageFiles.push(file)
                imageName = imageFiles[0].filename
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
    } catch (err) {
        res.status(500)
        return res.send({ err: err.message })
    }
})

router.put("/editKrathong/:id", uploadFile, async (req, res) => {
    try {
        let ktId = Number(req.params.id)

        const files = req.files
        let imageFiles = []
        let imageName;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.fieldname == "image") {
                if (files) {
                    imageFiles.push(file)
                    imageName = imageFiles[i].filename
                    let oldImg = await kt.findUnique({
                        where: {
                            kt_id: ktId
                        },
                        select: {
                            kt_image: true
                        }
                    })
                    if (!oldImg) {
                        return res.status(400).send({ status: "Not found image" })
                    }
                    let imagePath = path.join(__dirname, `../../uploads/${oldImg.kt_image}`)
                    await fs.unlink(imagePath)
                } else {
                    ktImage = await kt.findUnique({
                        where: {
                            kt_id: placeId
                        },
                        select: {
                            kt_image: true
                        }
                    })
                }
            }
            if (file.fieldname == "data") {
                let findKrathong = await kt.findFirst({
                    where: {
                        kt_id: ktId
                    },
                    select: {
                        kt_image: true,
                        t_id: true
                    }
                })

                let editKrathong = await fs.readFile(file.path, { encoding: "utf-8" })

                await fs.unlink(file.path)
                body = JSON.parse(editKrathong)
                if (!body) {
                    return res.status(400).send({ status: "Please add data" })
                }

                body.kt_image = findKrathong.kt_image
                body.t_id = findKrathong.t_id

                let updateKrathong = await kt.update({
                    where: {
                        kt_id: ktId
                    },
                    data: body
                })

                return res.send({ status: `Update sucessfully`, data: updateKrathong })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500)
        return res.send({ err: err.message })
    }
})

// router.put("/count/:id", async (req, res) => {
//     try {
//         let ktId = Number(req.params.id)
//         const ct = await kt.findUnique({
//             where: {
//                 kt_id: ktId
//             },
//             select: {
//                 amount: true
//             }
//         })

//         for (let i = 0; i < ct.amount; i++) {
//             const counting = ct - 1

//             let updateKrathong = await kt.update({
//                 where: {
//                     kt_id: ktId
//                 },
//                 data: {
//                     amount: counting,
//                     kt_image: null,
//                     kt_name: null,
//                     kt_type: null,
//                     detail: null
//                 }
//             })
//             return res.send({ status: `Update sucessfully`, data: updateKrathong })
//         }
//     } catch (err) {
//         res.status(500)
//         return res.send({ err: err.message })
//     }
// })

module.exports = router