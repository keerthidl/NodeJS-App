const db = require('../Config/db');
const express = require('express');
const router = express.Router();
const id = require('shortid');

router.post("/add",(req,res)=>{
    var user = {
        user_id: id.generate(),
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password:req.body.password,
        address:req.body.address,
    }
    let query = 'INSERT INTO register VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            db.query(query, [user.user_id, user.name, user.age, user.email, user.password, user.address ])
            .then(result =>{
                console.log("inserted successfully", result.rows)
                //("New User Created") 
                res.render("user/add",{
						title: 'Add New User',
						name: '',
						age: '',
						email: '',
						password:'',
						address:''					
                })       
            })
            .catch(err =>{
                console.log(err.message)
                //('unable to create new User'+" " + err.message)
                res.render("user/add",{
                    title: 'Add New User',
                    name: user.name,
                    age: user.age,
                    email: user.email,
                    password:user.password,
                    address:user.address					
            }) 
            }) 
})

// SHOW ADD USER FORM
router.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New User',
		name: '',
		age: '',
        email: '',
        password:'',
        address:''		
	})
})

/**
 * LIST OF USERS 
 */
 router.get('/', function(req, res) {
    db.query('SELECT * FROM register')
    .then(result =>{
        res.render('user/list',{
            title: 'User List',
            data:result.rows
        })
    })
})

/**
 * LOGIN
 */
router.get("/login",(req,res)=>{
    console.log('login page:')
    res.render("user/login",{
        title:"Login",
        email:'',
        password:''
    })
})

router.post("/login",(req,res)=>{
    console.log("check1")
    // let email = req.body.email;
    // let password = req.body.password;
    db.query('SELECT * FROM register WHERE email =$1',[req.body.email])
    .then(result =>{
        console.log(result.rows)
        console.log("email::", result.rows[0].email)
        if(result.rows[0].email == req.body.email && result.rows[0].password == req.body.password){
            //("Logged in successfully");
            db.query('SELECT * FROM register').then(data =>{
                console.log(data.rows)
                res.render('user/list',{
                    title: 'User List',
                    data:data.rows
            })
            })               
        }else{
            console.log("invalid email or password")           
		//('error', error_msg)
            res.render("user/login",{
                title:"Login",
                email:'',
                password:''
            })
        }
    })
    .catch(err=>{
        console.log(err.message)
        res.render("user/login",{
            title:"Login",
            email:'',
            password:''
        })
    })
})

// SHOW EDIT USER FORM
router.get('/edit/:user_id', function(req, res, next){
    db.query('SELECT * FROM register WHERE user_id = $1',[req.params.user_id])
    .then(result =>{
        if(result.rows.length <=0){
            //('error', 'User not found with id = ' + req.params.user_id)
        }else{
            res.render('user/edit', {
                title: 'Edit User',
                user_id: result.rows[0].user_id,
                name: result.rows[0].name,
                age: result.rows[0].age,
                email: result.rows[0].email,
                password: result.rows[0].password,
                address: result.rows[0].address
            })
        }
    })
    .catch(err =>{
        console.log(err.message)
    })
})

// const list = (req, data) =>{
//    db.query('SELECT * FROM register')
   
// }

router.put("/edit/:user_id",(req,res)=>{
    let user = [       
        req.body.name,
        req.body.age,
        req.body.email,
        req.body.password,
        req.body.address,
        req.params.user_id,
    ]
    db.query('UPDATE register SET name = $1, age = $2, email = $3, password = $4, address =$5 WHERE user_id = $6',user)
    .then(result =>{
        console.log("successfully updated");
        db.query('SELECT * FROM register').then(list=>{
            res.render("user/list",{
                title: 'User List',
                data:list.rows
            })
        }).catch(err =>{
            console.log(err.message)
        })       
    })
    .catch(err =>{
        console.log(err.message)
    })
})

router.delete("/delete/:user_id",(req,res)=>{
    db.query('DELETE FROM register WHERE user_id = $1',[req.params.user_id])
    .then(result =>{
        console.log("deleted successfully")
        db.query('SELECT * FROM register').then(list =>{
            res.render("user/list",{
                title: 'User List',
                data: list.rows
            })
        }).catch(err =>{
            console.log(err.message)
        })
    })
    .catch(err =>{
        console.log(err.message)
    })
})



module.exports = router;
