const products = require('../../methods/products');
const users = require('../../methods/users');
const { getTitles} = require('../../globaldata');
const { getDescs} = require('../../globaldata');
const fs = require('fs');

function photoController(){
    return {
        async index(req, res) {
            let resData = {};
            req.session.extofbackground = undefined;
            req.session.authonticated = undefined;
            req.session.projectid = Math.ceil(Math.random() * 100000);
            req.session.savedData = [];
            if (req.query.product_id) {
                const product = await products.getProductList({id_filter: req.query.product_id});
                if (product.result && product.result.length > 0) req.session.savedData = product.result;
            }
            resData['stepInfo'] = [
                {current: 'current', allow: 'enabled'},
            ];
            if (req.session.extofbackground != undefined) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});
            resData['stepInfo'].push({current: '', allow: ''});
            resData['savedData'] = [];

            resData['isAdmin'] = false;
            if (req.session.isSubscribed) 
                resData['isSubscribed'] = true;
            else
                resData['isSubscribed'] = false;
            resData['libraryTitle'] = getTitles();
            resData['libraryDesc'] = getDescs();
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.render('photo', resData);
        },

        async selectLibrary(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            const {/*dirId, */name} = req.body;
            const ext = name.substring(name.lastIndexOf('.'));
            if ( req.session.projectid == undefined )req.session.projectid = Math.ceil(Math.random() * 100000);
            const newStr = req.session.projectid;

            let directory = __dirname + '/../../../uploads';
            await fs.copyFile(directory /*+ 'img/library/' + dirId + '/'*/ + name, directory + '/data/images/' + newStr + ext, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(404).send({error: err});
                }
                req.session.extofbackground = ext;
                console.log('src was copied to newSrc');
                return res.status(200).send({result: true});
            });
        },
        
        async photo(req, res) {
            let resData = {};
            
            if ( req.session.projectid == undefined )req.session.projectid = Math.ceil(Math.random() * 100000);
            if ( req.session.savedData == undefined ) resData['savedData'] = [];
            else resData['savedData'] = req.session.savedData;
            
            resData['stepInfo'] = [
                {current: 'current', allow: 'enabled'},
            ];
            if (req.session.extofbackground != undefined) resData['stepInfo'].push({current: 'enabled', allow: 'enabled'});
            else resData['stepInfo'].push({current: '', allow: ''});
            resData['stepInfo'].push({current: '', allow: ''});

            resData['isAdmin'] = false;
            resData['isSubscribed'] = true;
            resData['libraryTitle'] = getTitles();
            resData['libraryDesc'] = getDescs();
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.render('photo', resData);
        }, 

        async saveData(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            let {savedProductData} = req.body;
            console.log('SavedProductDataChanged'+ savedProductData.length);
            req.session.savedData = savedProductData;
            return res.status(200).send ({result: true});
        },

        async subscribe(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            let {firstname, lastname, email} = req.body;
            console.log('userSubscribed'+ JSON.stringify(req.body));
            await users.addUser({firstname, lastname, email});
            req.session.isSubscribed = true;
            return res.status(200).send({result: true});
        }
    }
}
module.exports = photoController;