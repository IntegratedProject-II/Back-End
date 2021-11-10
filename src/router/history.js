require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const uploadFile = require("../middlewares/uploadFile")
const history = new PrismaClient().history

router.get("/getHistory", async (req, res) => {
    let result = await history.findMany()
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

// router.post("/addHistory", uploadFile, async (req, res) => {
//     const files = req.files
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.fieldname == "data") {
//             let newHistory = await fs.readFile(file.path, { encoding: "utf-8" })
//             await fs.unlink(file.path)
//             body = JSON.parse(newPlace)
//             if (!body) {
//                 return res.status(400).send({ status: "Please add fill data" })
//             }

//             body.p_image = imageName

//             let result = await place.create({
//                 data: body
//             })

//             console.log(result)
//             return res.send({ status: `Upload sucessfully` })
//         }

//     }
// })

module.exports = router