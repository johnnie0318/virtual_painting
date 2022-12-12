const {curIndex} = require('../../globaldata')

function roomController(){
    return {
        async index(req, res) {
            let resData = {};
            if (req.session.projectid == undefined || req.session.extofbackground == undefined) return res.redirect('/photo');
            if ( req.session.savedData == undefined ) resData['savedData'] = [];
            else resData['savedData'] = req.session.savedData;
            
            // const result = await Resource.getResource();
            // if(result.result) resData["resource"] = result.result;
            resData["stepInfo"] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
            ];
            resData["curIndex"] = curIndex;
            resData["roomPhoto"] = req.session.projectid + req.session.extofbackground;

            resData['isAdmin'] = false;
            resData['isSubscribed'] = true;
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.render('room', resData);
        }
    }
}
module.exports = roomController;