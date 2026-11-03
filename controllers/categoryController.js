const Category = require ('../models/categorySchema')

const categoryController = async (req, res)=>{
    const {name} = req.body

    let category = new Category ({
        name : name
    })

    await category.save()
     return res.json({
            success : true ,
            message:" Category Created"
        })
}

let getallCategoryController = async (req , res)=>{
    let data = await Category.find({})

     return res.json({
            success : true ,
            message:"All Category Collected",
            data : data
        })
}

const CategoryUpdateController = async (req , res) => {
    const { id } = req.params



    let data = await Category.findByIdAndUpdate({_id:id}, {...req.body } , {new : true})
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            message : "Product Update Successfully",
            data
        })
}

const DeleteCategoryController = async (req , res) => {
    const { id} = req.params

    let data = await Category.findByIdAndDelete({_id:id})
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            message:" Deleted Product Successfully",
            data
        })
}



module.exports = {categoryController , getallCategoryController , CategoryUpdateController , DeleteCategoryController}