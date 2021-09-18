require("dotenv").config()
const express = require("express")
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
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
    let result = await place.delete({
        where: {
            p_id: placeId 
        }
    })
        console.log(result)
        return res.send({ status: "Delete Successful" })
})

router.post("/addPlace", async (req, res) => {
    let { p_name, p_image, tp_id } = req.body

    if (!(p_name || p_image || tp_id )) {
        return res.send({ status: "Not have data" })
    }
    await place.createMany({
        data: req.body
    })
    return res.send({ status: "Create success" })
})

router.put("/editPlace/:id", async (req, res) => {
    let placeId = Number(req.params.id)
    let { p_name, p_image, tp_id } = req.body

   let result = await place.findUnique({
        where: {
            p_id: placeId
        }
    })

    if (!(result)) {
        return res.status(404).send(`id ${placeId} Can't find your place id`)
    } 

    if (!(result.p_name)) {
        return res.status(404).send(`id ${placeId} Not have this place name`)
    }

    let updatePlace = await place.update({
        where: {
            p_id: placeId
        },
        data: {
            p_name: p_name,
            p_image: p_image,
            tp_id: tp_id
        }
    })

    return res.send({
        msg: `Update sucessfully`,
        data: updatePlace
    })

})

module.exports = router