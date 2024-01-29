const express = require('express');
const con = require('../routes/db/db.js');
const axios = require('axios');
const router = express.Router();

/**
 * Method to get all playlists available (/ with the active state)
 */
router.get('/api/playlists/:userId', (req, res)=>{
    let userId = parseInt(req.params.userId);
    
    if(userId){
        const sql = "select * from playlist where state_id = 1 and user_id = " + userId;

        con.query(sql, (error, rows)=>{
            if(error) throw error;
            
            // Example usage
            chatGPT('Tell me a joke.');

            res.send(rows).status(200);
        })
    }    
});

/**
 * Method to create a new playlist
 */
router.post('/api/createPlaylist', (req, res)=>{
    let date = new Date();

    const{title, user_id} = req.body.playlistObj;

    const sql = `insert into playlist (playlist_title, state_id, added_at, user_id) 
                values(?, ?, ?, ?)`;
    con.query(sql, [title, 1, date, user_id], (err, result)=>{
        if(err) throw err;
        console.log(`${title} created successfully`);

        const selectPlaylist = "select * from playlist where state_id = 1";
        con.query(selectPlaylist, (error, rows)=>{
            if(error) throw error;
            console.log(rows);
            res.send(rows).status(200);
        });
    });
});

router.post("/api/deletePlaylist/:id", (req, res)=>{
    let id = req.params.id;

    let sql = "update playlist set state_id = 2 where playlist_id = ?";

    con.query(sql, [id], (err, result)=>{
        if(err) throw err; 

        const selectPlaylist = "select * from playlist where state_id = 1";
        con.query(selectPlaylist, (error, rows)=>{
            if(error) throw error;
            console.log(rows);
            res.send(rows).status(200);
        });
    });
});


router.post("/api/updatePlaylistName/:id", (req, res)=>{

    console.log("I am hereeeeeeeeee ...");
    
    let title = req.body.title;
    let sql = "update playlist set playlist_title = ? where playlist_id = ?";
    con.query(sql, [title, req.params.id], (err, result)=>{
        if(err) throw err; 
        
        const selectPlaylist = "select * from playlist where state_id = 1";
        con.query(selectPlaylist, (error, rows)=>{
            if(error) throw error;
            console.log(rows);
            res.send(rows).status(200);
        });
    });
});

function calculateTimesDifference(lastTime){
    const timeDifferenceMs = new Date() - new Date(lastTime);

    // Step 3: Convert milliseconds to hours
    const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
    return timeDifferenceHours;
}

router.get("/api/expressionOfTheDay", (req, res)=>{

    const generateRandomIndex = (max)=>{
        return Math.floor(Math.random() * max) +1;
    }

    let expressions = "select * from expression where state_id = 1";
    con.query(expressions, (err, rows)=>{
        if(err) throw err;

        let randomExpression = generateRandomIndex(rows.length);

        let lastExpressionOfTheDay = `SELECT * FROM expression  join expression_of_the_day
                                        on expression.expression_id = expression_of_the_day.expression_id
                                        order by expression_of_the_day.expression_id desc
                                        limit 1`;

        con.query(lastExpressionOfTheDay, (error, result)=>{
            if(error) throw error;

            let values = [[
                rows[randomExpression-1] && rows[randomExpression-1].expression_id,
                new Date()
            ]];
            let addExpressionOfTheDay = `insert into expression_of_the_day(expression_id, shown_at) values ?`;

            if(result.length){

                let lastTime = result[0].shown_at;

                if(calculateTimesDifference(lastTime) >= 24){
                    //after 24 hours generate a new expression
                    con.query(addExpressionOfTheDay, [values], (e, r)=> {
                        if(e) throw e;
                        res.send(rows[randomExpression -1]);
                    });
                }else{
                    //otherwise keep the current
                    res.send(result[0])
                }
                
            } else {
                //if there is no expression of the day yet, insert this current generated expression
                
                con.query(addExpressionOfTheDay, [values], (e, r)=> {
                    if(e) throw e;

                    res.send(rows[randomExpression-1]);
                });
            }
        });
    });
});




async function chatGPT(prompt) {

    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    try {
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo',  // or another available model
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.API_KEY_EYTV}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const completions = response.data.choices;
      const reply = completions[0].message.content;
      console.log('ChatGPT Reply:', reply);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
  
  


module.exports = router;