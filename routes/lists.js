const router = require('express').Router();
const List = require('../models/List');
const Movie = require('../models/List');
const verify = require("./verifyToken");


// CREATE LIST OF MOVIE

router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {

        const movieList = new List(req.body);
        try {
            const savedList = await movieList.save();
            res.status(200).json(savedList);
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("You are not allowed to see movie list!")
    }
});

// DELETE LIST OF MOVIE

router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json("Movie List has been deleted!")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("You are not allowed to delete!")
    }
});

// GET LIST OF MOVIE

router.get('/', verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    {
                        $sample: { size: 10 }
                    },
                    {
                        $match: { type: typeQuery, genre: genreQuery }
                    }
                ])
            } else {
                list = await List.aggregate([{
                    $sample: { size: 10 }
                },
                {
                    $match: { type: typeQuery }
                }

                ])
            }
        } else {
            list = await List.aggregate([{ $sample: { size: 10 } }])
        }
        res.status(200).json(list)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;