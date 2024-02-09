const express = require('express');
const con = require('../routes/db/db.js');
const router = express.Router();

const youtubeTranscript = require('youtube-transcript');


router.get("/api/playlist/:playlistId/getVideosByUserId/:userId", (req, res)=>{
    let userId = parseInt(req.params.userId);

    let sql = "select * from video where playlist_id = ? and state_id = 1 and user_id = ?";
    con.query(sql, [req.params.playlistId, userId], (err, result)=>{
        if (err) throw err;

        res.send(result).status(200);
    });
});


router.post("/api/playlist/:playlistId/addVideo/", (req, res)=>{
    let data = req.body.dataObject;

    let sql = "insert into video (video_title, video_url, added_at, playlist_id, user_id, yt_video_code, state_id, thumbnail, transcript) values ?";
    con.query(sql, [[[data.videoTitle, null, new Date(), data.playlistId, data.userId, data.yt_video_code, 1, data.thumbnail, null]]], (err, result)=>{
        if(err) throw err;

        res.send(result).status(200);
    });
});


router.post("/api/playlist/:playlistId/deleteVideo/:videoId", (req, res)=>{
    let videoId = req.params.videoId;
    let sql = "update video set state_id = 2 where video_id = " + videoId;
    
    con.query(sql, (err, result)=>{
        if(err) throw err;

        let sql = "select * from video where playlist_id = ? and state_id = 1";
        con.query(sql, [req.params.playlistId], (err, result)=>{
            if (err) throw err;
            res.send(result).status(200);
        });
    });
});


router.get("/api/playlist/:playlistId/:playlistTitle/:videoId/:videoCode", (req, res)=>{
    let playlistId = req.params.playlistId;
    let playlistTitle = req.params.playlistTitle;
    let videoCode = req.params.videoCode;

    youtubeTranscript.YoutubeTranscript
            .fetchTranscript(videoCode)
            .then(response => res.send(response).status(200))
            .catch(err => res.send(err).status(400));
});


router.post("/api/playlist/:playlistId/:playlistTitle/:videoId/:videoCode/addExpression", (req, res)=>{
    let videoId = !!req.params.videoId === 'undefined' ? req.params.videoId : null;
    let searchResult = req.body.searchResult;

    console.log(searchResult);
    const {
            expression, 
            meaning, 
            fl, 
            prs, 
            audioName,
            stems, 
            recognitionLevel, 
            userId
        } = searchResult;
    
    let findExpressionByUser = `select * from expression where user_id = ? and expression = ?`;

    con.query(findExpressionByUser, [userId, expression], function(error, result){
        if(error) throw error;

        if(result.length > 0){

            let sql = `update expression 
                        set def = ? 
                        where expression_id = ?`;
            con.query(sql, [JSON.stringify(searchResult), result[0].expression_id], (err, result)=> {
                if(err) throw err;
                return res.send(expression + " has already been on the list");
            });

            
        }else {
            let sql = `insert into expression(video_id, user_id, state_id, recognition_level_id, used_for_flashcard, expression, def, note) values ?`;
            con.query(sql, [[[videoId, userId, 1, recognitionLevel, null,  expression, JSON.stringify(searchResult), null]]], (err, result)=> {
                if(err) throw err;

                console.log(result);


                let sql = "select * from expression where user_id = ?";
                con.query(sql, [userId], (err, rows)=>{
                    if(err) throw err;

                    res.send(rows).status(200);
                });
            });
        }
        
        
    });
});

router.get("/api/expressions/:userId", (req, res)=>{
    let userId = parseInt(req.params.userId);

    console.log(userId);

    if(!userId) {
        return;
    }

    let sql = "select * from expression where user_id = ? and state_id = 1";
    con.query(sql, [userId], (err, rows)=>{
        if(err) throw err;

        res.send(rows).status(200);
    });
});

router.post("/api/expressions/moveExpression/:userId", (req, res)=>{
    let expressionId = req.body.expressionId;
    let toRecognitionLevel = req.body.toRecognitionLevel;
    let userId = parseInt(req.params.userId);

    let sql = "update expression set recognition_level_id = ? where expression_id = ?";

    con.query(sql, [toRecognitionLevel, expressionId], (err, result)=>{
        if(err) throw err;

        let sql = "select * from expression where user_id = ?";
        con.query(sql, [userId], (err, rows)=>{
            if(err) throw err;

            res.send(rows).status(200);
        });
    })
});

router.post("/api/expressions/deleteExpression", (req, res)=>{
    let expressionId = req.body.expressionId;

    let sql = "update expression set state_id = 2 where expression_id = ?";

    con.query(sql, [expressionId], (err, result)=>{
        if(err) throw err;

        let sql = "select * from expression";
        con.query(sql, (err, rows)=>{
            if(err) throw err;

            res.send(rows).status(200);
        });
    })
});

module.exports = router;


