const { curIndex} = require('../../globaldata')
const {getTitles} = require('../../globaldata');

function colorController(){
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
                {current: 'current', allow: 'enabled'},
            ];
            if (resData['savedData'].length > 0) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});

            resData["curIndex"] = curIndex;

            resData['isAdmin'] = false;
            resData['isSubscribed'] = true;
            resData['libraryTitle'] = getTitles();
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.render('color', resData);
        }
    }
}
module.exports = colorController;