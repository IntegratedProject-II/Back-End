require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
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
    let result = await kt.delete({
        where: {
            kt_id: ktId
        }
    })
    console.log(result)
    return res.send({ status: "Delete Successful" })
})

router.post("/addKrathong", async (req, res) => {
    let { kt_name, amount, kt_image, detail, t_id } = req.body

    if (!(kt_name || amount || kt_image || detail || t_id)) {
        return res.send({ status: "Not have data" })
    }
    await kt.createMany({
        data: req.body
    })
    return res.send({ status: "Create success" })
})

// router.put("/edit/:id", (req, res) => {
//     let ktId = req.params.id
//     let { kt_name, amount, kt_image, detail, t_id } = req.body

//    let result = await kt.findMany({
//         kt_id: ktId
//     })

//     if (err) {
//         return res.send({ status: "Can't update" })
//     }
//     if (result.affectedRows == 0) {
//         return res.status(400).send({ status: "Don't have any data" })
//     }
//     return res.send({ status: "Update Successful" })
// })

module.exports = router