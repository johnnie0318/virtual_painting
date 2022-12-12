const {curIndex} = require('../../globaldata')
const products = require('../../methods/products');

function colorCollectionController(){
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
            const productlist = await products.getProductList({filter: 'patterns'});
            resData['productList'] = productlist.result;
            resData['isSubscribed'] = true;
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.render('color_collection', resData);
        }
    }
}
module.exports = colorCollectionController;