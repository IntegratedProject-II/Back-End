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

router.put("/editKrathong/:id", async (req, res) => {
    let ktId = Number(req.params.id)
    let { kt_name, amount, kt_image, detail, t_id } = req.body

   let result = await kt.findUnique({
        where: {
            kt_id: ktId
        }
    })

    if (!(result)) {
        return res.status(404).send(`id ${ktId} Can't find your krathong id`)
    } 

    if (!(result.kt_name)) {
        return res.status(404).send(`id ${ktId} Not have this krathong name`)
    }

    let updateKrathong = await kt.update({
        where: {
            kt_id: ktId
        },
        data: {
            kt_name: kt_name,
            amount: amount,
            kt_image: kt_image,
            detail: detail,
            t_id: t_id
        }
    })

    return res.send({
        msg: `Update sucessfully`,
        data: updateKrathong
    })

})

module.exports = router