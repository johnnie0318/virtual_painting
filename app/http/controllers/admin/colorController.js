const fs = require('fs');
const {curIndex, getPassword, setPassword, getTitles, updateTitle, getDescs, updateDesc} = require('../../../globaldata');
const products = require('../../../methods/products');
const users = require('../../../methods/users');

let draft;

function colorController(){
    return {
        async index(req, res) {
            let resData = {};
        
            resData['stepInfo'] = [
                {current: 'enabled', allow: 'enabled'},
                {current: 'current', allow: 'enabled'},
                {current: 'enabled', allow: 'enabled'},
            ];
            resData['curIndex'] = curIndex;
            
            resData['isAdmin'] = true;

            resData['productList'] = [];
            resData['isSubscribed'] = true;
            if (req.session.authonticated == undefined) {
                res.render('admin/login', resData);
                return;
            }

            const productlist = await products.getProductList({});

            resData['productList'] = productlist.result;
            resData['userList'] = await users.getUserList();
            let timeStrings = [];
            for ( user of resData['userList']) {
                let time = new Date().toISOString().
                    replace(/T/, ' ').
                    replace(/\..+/, '');
                timeStrings.push(time);
            }
            resData['timeStrings'] = timeStrings;
            // console.log(JSON.stringify(resData['userList']));
            resData['libraryTitle'] = getTitles();
            resData['libraryDesc'] = getDescs();
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.render('admin/color', resData);
        },

        async titleUpdate(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            let {index, value} = req.body;
            console.log(index + ' '+ value);
            updateTitle(parseInt(index) - 1, value);
            console.log('Title updated');
            return res.status(200).send();
        },

        async titleDescUpdate(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            let {index, value} = req.body;
            console.log(index + ' '+ value);
            updateDesc(parseInt(index) - 1, value);
            console.log('Desc updated');
            return res.status(200).send();
        },

        async login(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            if (req.body.password == getPassword()) {
                req.session.authonticated = true;
                req.session.save();
                res.status(200).send();
                return;
            };
            return res.status(401).send();
         },

        //  async reset(req, res) {
        //     res.setHeader('Cache-Control', 'public, max-age=86400');
        //     let resData = {};
        
        //     resData['stepInfo'] = [
        //         {current: 'enabled', allow: 'enabled'},
        //         {current: 'current', allow: 'enabled'},
        //         {current: 'enabled', allow: 'enabled'},
        //     ];
        //     resData['curIndex'] = curIndex;
            
        //     resData['isAdmin'] = true;

        //     resData['productList'] = [];
        //     resData['isSubscribed'] = true;
        //     if (req.session.authonticated == undefined) {
        //         res.render('admin/login', resData);
        //         return;
        //     }

        //     return res.render('admin/reset', resData);
        // },

        async passwordChange(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            if (req.session.authonticated == undefined) {
                res.status(401).send();
                return;
            }
            setPassword(req.body.password);
            console.log('Password changed');
            return res.status(200).send();
        },

        async upload(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            try {
                if(!req.files) {
                    console.log('Error: File must be supplied while uploading.')
                    return res.status(403).send ({message: 'Error: Select the upload file.'});
                } else {
                    //Use the name of the input field (i.e. 'file') to retrieve the uploaded file
                    let file = req.files.file;
                    
                    //Use the mv() method to place the file in upload directory (i.e. 'uploads')
                    const extIndex = file.name.lastIndexOf('.');
                    let url = req.url.substring(13);
                    const now = new Date();
                    let type = url.split('?')[0], oldfilename = url.split('?')[1], filename = now.getTime();
                    if (oldfilename && (oldfilename.indexOf('/data/colors/') == -1 && oldfilename.indexOf('/data/patterns/') == -1  || oldfilename.indexOf('..') != -1)) {
                        console.log('Error occured while upload :', 'Not allowed file path.');
                        res.status(500).end({message: 'Not allowed file path.'});
                        return;
                    }
                    if (oldfilename)
                        await fs.unlink('./uploads' + oldfilename, err => {
                            if(err) console.error(`Error occured while delete image files ${err}`);
                        });
                    if (draft)
                        await fs.unlink('./uploads' + draft, err => {
                            if(err) console.error(`Error occured while delete image files ${err}`);
                        });

                    if (type == 'colors') filename = '/data/colors/' + filename + file.name.substring(extIndex);
                    else if (type == 'patterns') filename = '/data/patterns/' + filename + file.name.substring(extIndex);
                    await file.mv('./uploads' + filename);
        
                    //flash response
                    console.log('Upload image success.');
                    draft = filename;
                    return res.status(200).send({result: filename});
                }
            } catch (err) {
                console.log('Error occured while upload :', err);
                return res.status(500).end({message: err});
            }
        },

        async resetUpload(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            const src = req.body.draftsrc;
            if(!src) {
                console.log('Error: File must be supplied while uploading.')
                return res.status(403).send ({message: 'Error: Select the upload file.'});
            } else {
                if (src.indexOf('/data/colors/') == -1 && src.indexOf('/data/patterns/') == -1  || src.indexOf('..') != -1) {
                    console.log('Error occured while upload :', 'Not allowed file path.');
                    res.status(500).end({message: 'Not allowed file path.'});
                    return;
                }
                if (src)
                    await fs.unlink('./uploads' + src, err => {
                        if(err) console.error(`Error occured while delete image files ${err}`);
                    });
    
                //flash response
                console.log('Reset Draft Upload success.');
                return res.status(200).send({result: true});
            }
        },

        async addProduct(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            console.log('add prodcut request is received.');
            let {id, title, src, type, subtype} = req.body;
            if (src.indexOf(type) == -1) {
                var strList = src.split('/');
                for ( i in strList ) {
                    if (strList[i] == 'colors' || strList[i] == 'patterns') {strList[i] = type;break;}
                }
                var newStr = strList.join('/');
                await fs.copyFile('./uploads' + src, './uploads' + newStr, (err) => {
                    if (err) console.log(err);
                    console.log('src was copied to newSrc');
                });
                src = newStr;
            }
            const result =  await products.addProduct({id, title, src, type, subtype});
            if ( result ) {
                console.log('Product add succeed');
                draft = undefined;
                return res.status(200).send ({result: true});
            } else {
                console.log('Error occured while add product.')
                return res.status(403).send ({message: 'Could not add product.'});
            }
        },

        async updateProduct(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            console.log('update product request is received.');
            let {old_id, id, title, src, type, subtype} = req.body;
            if (src.indexOf(type) == -1) {
                var strList = src.split('/');
                for ( i in strList ) {
                    if (strList[i] == 'colors' || strList[i] == 'patterns') {strList[i] = type;break;}
                }
                var newStr = strList.join('/');
                await fs.copyFile('./uploads' + src, './uploads' + newStr, (err) => {
                    if (err) console.log(err);
                    else console.log('src was copied to newSrc');
                });
                src = newStr;
            }
            const result =  await products.updateProduct({old_id, id, title, src, type, subtype});
            if ( result ) {
                console.log('Product update succeed');
                draft = undefined;
                return res.status(200).send ({result: true});
            } else {
                console.log('Error occured while update product.')
                return res.status(403).send ({message: 'Could not update product.'});
            }
        },

        async deleteProduct(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            console.log('delete product request is received.');
            let {id} = req.body;
            const result =  await products.deleteProduct({id});
            if ( result ) {
                console.log('Product delete succeed');
                draft = undefined;
                return res.status(200).send({result: true});
            } else {
                console.log('Error occured while delete product.')
                return res.status(403).send ({message: 'Could not delete product.'});
            }
        },
        
        // async thumbnail(req, res) {
        //     res.setHeader('Cache-Control', 'public, max-age=86400');
        //     let resData = {};
        
        //     resData['stepInfo'] = [
        //         {current: 'enabled', allow: 'enabled'},
        //         {current: 'current', allow: 'enabled'},
        //         {current: 'enabled', allow: 'enabled'},
        //     ];
        //     resData['curIndex'] = curIndex;
            
        //     resData['isAdmin'] = true;

        //     resData['productList'] = [];
        //     resData['isSubscribed'] = true;
        //     if (req.session.authonticated == undefined) {
        //         res.render('admin/login', resData);
        //         return;
        //     }

        //     return res.render('admin/thumbnail', resData);
        // },

        async thumbnailUpload(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            try {
                if(!req.files) {
                    console.log('Error: File must be supplied while uploading.')
                    return res.status(403).send ({message: 'Error: Select the upload file.'});
                } else {
                    //Use the name of the input field (i.e. 'file') to retrieve the uploaded file
                    let file = req.files.file;
                    
                    //Use the mv() method to place the file in upload directory (i.e. 'uploads')
                    
                    let url = req.url.substring(17);
                    await file.mv('./uploads' + url);
        
                    //flash response
                    console.log('Upload image success.');
                    return res.status(200).send({result: true});
                }
            } catch (err) {
                console.log('Error occured while upload :', err);
                return res.status(500).end({message: err});
            }
        },

        async deleteUserInfo(req, res) {
            // res.setHeader('Cache-Control', 'public, max-age=86400');
            let {email} = req.body;
            console.log(email);
            const result = await users.deleteUser({email});
            if (result) return res.status(200).send({});
            else return res.status(404).send({});
        },
    }
}
module.exports = colorController;