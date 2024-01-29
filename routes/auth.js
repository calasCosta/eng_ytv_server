const express = require('express');
const router = express.Router();
const con = require("../routes/db/db");



router.post("/api/auth/signIn", (req, res)=>{
    let profile = req.body.profile;
    console.log( profile);

    const getUser = `select * from users where google_id = '${profile.id}'`;
    con.query(getUser, (error, rows)=>{
        if(error) throw error;

        if(!rows.length){
            let values = [
                [profile.name, profile.email, new Date(), profile.locale, 1, 1, profile.id, profile.picture, 1]
            ]

            console.log( profile);

            const sql = `insert into users(username, user_email, registered_at, user_country, user_type_id, state_id, google_id, image_profile, user_auth_state_id)
                        values ?`;

            con.query(sql, [values], (err, result)=>{
                if(err) throw err;

                
                con.query(getUser, (e, r)=>{
                    if (e) throw e;

                    let user = r[0];
                    delete r[0].google_id;  // delete google_id in the tracking object

                    let result = {
                        message: "user created successfully.",
                        userObject: user
                    }

                    console.log(result);

                    res.send(result).status(200);
                })
                
            })
        }else{
            
            let updateAuthStatus = `update users set user_auth_state_id = 1 where google_id = '${profile.id}'`;
            con.query(updateAuthStatus, (e, r)=>{
                if(e) throw e;
                //console.log(r);   

                let user = rows[0];
                delete rows[0].google_id;  // delete google_id in the tracking object

                let result = {
                    message: "Welcome again.",
                    userObject: user
                }

                console.log(result);

                res.send(result).status(200);
            });
        }        
    });
});


router.post("/api/auth/signOut", (req, res)=>{
    let profile = req.body.profile;



    let updateAuthStatus = `update users set user_auth_state_id = 2 where user_id = ?`;
    con.query(updateAuthStatus, [profile.user_id], (err, result)=>{
        if(err) throw err;
        console.log(result);   

        console.log("See you")
        res.send("See you.").status(200);
    });
})

module.exports = router;