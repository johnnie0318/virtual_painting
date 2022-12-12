const Products = require('../models/products');

const addProduct = async(data) => {
    if(!data.id || !data.title || !data.type || !data.src || !data.subtype) {
        console.log(`Data is undefined in addProduct`);
        return false;
    }

    //Check if user username already exists
    feedback = await Products.exists({ id: data.id });
    if (feedback) {
        error = 'Product already exists, Try another!';
        console.log('error while add product: ', error);
        console.log('Product', data.title);
        return false;
    }

    const product = new Products(data);
    
    const insertInfo = await product.save();
    if (insertInfo) {
        console.log("Product data inserted")  // Success
        return true;
    } else {
        console.log(insertInfo)      // Failure
        return false;
    }
}

const updateProduct = async(data) => {
    if(!data.old_id || !data.id || !data.title || !data.type || !data.src || !data.subtype) {
        console.log(`Data is undefined in addProduct`);
        return false;
    }

    //Check if user username not exists
    feedback = await Products.exists({ id: data.old_id });
    if (!feedback) {
        error = 'Product not  exists, Try again!';
        console.log('error while update product: ', error);
        console.log('Product', data.title);
        return false;
    }

    const updateInfo = await Products.updateOne({id: data.old_id}, {id: data.id, title: data.title, type: data.type, subtype:data.subtype, src: data.src});
    if (updateInfo) {
        console.log("Product data updated")  // Success
        return true;
    } else {
        console.log(updateInfo)      // Failure
        return true;
    }
}

const deleteProduct = async(data) => {
    if(!data.id) {
        console.log(`Data is undefined in addProduct`);
        return false;
    }

    //Check if user username not exists
    feedback = await Products.exists({ id: data.id });
    if (!feedback) {
        error = 'Product not  exists, Try again!';
        console.log('error while delete product: ', error);
        return false;
    }

    const deleteInfo = await Products.deleteOne({id: data.id});
    if (deleteInfo) {
        console.log("Product data deleted")  // Success
        return true;
    } else {
        console.log(deleteInfo)      // Failure
        return true;
    }
}

const getProductList = async(data) => {
    let query = {};
    if (data && data.filter) {
        query = {
            $or: [
                // {id: data.filter},
                // {title: data.filter},
                {type: data.filter}
            ]
        };
    }
    if (data && data.id_filter) {
        query = {
            $or: [
                {id: data.id_filter},
                // {title: data.filter},
                // {type: data.filter}
            ]
        };
    }
    result = await Products.find(query).sort('title').collation({locale:"en_US", numericOrdering:true});
    return { result: result, error: ''}
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductList,
};