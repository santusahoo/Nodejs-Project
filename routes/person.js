const express = require('express');
const router = express.Router();
const Person = require('../models/person');
const {jwtmiddleware, generateToken} = require('../jwt');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log('data saved');

        const payload = {
            id: response._id,
            username: response.username,
        }
        console.log('payload', payload);
        // generate jwt token
        const token = generateToken(payload);
        console.log('token generated', token);
        res.status(200).json({response: response, token: token});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

// login route
router.post('/login', async (req, res) => {
    try {
        // extract the username and password from the request body
        const {username, password} = req.body;
        
        // find the user with the username
        const user = await Person.findOne({username: username});

        // if the user is not found
        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({message: 'invalid username or password'});
        }

        // generate jwt token
        const payload = {
            id: user._id,
            username: user.username,
        }
        const token = generateToken(payload);
        // send the token as response
        res.status(200).json({token: token});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

// get method to get all persons
router.get('/', jwtmiddleware, async (req, res) => {
    try {
        const persons = await Person.find();
        res.status(200).send(persons);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// profile route
router.get('/profile', jwtmiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/:work_type', async (req, res) => {
    try {
        const work_type = req.params.work_type;
        if (work_type !== 'chef' && work_type !== 'manager' && work_type !== 'waiter') {
            res.status(404).send('Invalid work type');
            return;
        }else{
            const persons = await Person.find({work: work_type });
            if (persons.length === 0) {
                res.status(404).json({message: 'No person found'});
            }
            console.log('person fetched');
            res.status(200).json(persons);
        }   
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

// update a person by id
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const person = await Person.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!person) {
            res.status(404).json({message: 'Person not found'});
        }
        console.log('person updated');
        res.status(200).json(person);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal server error'});
    }
}
)

// delete a person by id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const person = await Person.findByIdAndDelete(id);
        if (!person) {
            res.status(404).json({message: 'Person not found'});
        }
        console.log('person deleted');
        res.status(200).json(person);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal server error'});
    }
})

module.exports = router; // export the router