const Product = require('../models/productSchema');
const { readSheet } = require('read-excel-file/node');
const writeXlsxFile = require('write-excel-file/node');
const path = require('path');
const fs = require('fs');


const schema = {
    tittle: {
        column: 'tittle',
        type: String
    },
    description: {
        column: 'description',
        type: String
    },
    price: {
        column: 'price',
        type: Number
    },
    discountPrice: {
        column: 'discountPrice',
        type: Number
    },
    category: {
        column: 'category',
        type: String
    },
    stock: {
        column: 'stock',
        type: Number
    },
    sku: {
        column: 'sku',
        type: String
    },
    image: {
        column: 'image',
        type: String
    },
    status: {
        column: 'status',
        type: String
    },
    tags: {
        column: 'tags',
        type: String
    },
    weight: {
        column: 'weight',
        type: Number
    },
    slug: {
        column: 'slug',
        type: String
    },

    section : {
        column : 'section',
        type : String
    }
};


const CreateProductController = async (req, res) => {
    try {
        const {
            tittle,
            description,
            price,
            discountPrice,
            category,
            stock,
            tags,
            section
        } = req.body;

        if (!tittle || !price) {
            return res.status(400).json({
                success: false,
                message: 'Title and price fields are required'
            });
        }

        const slug = tittle
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-');

        const existingSlug = await Product.findOne({ slug });

        if (existingSlug) {
            return res.status(409).json({
                success: false,
                message: 'Slug already exists'
            });
        }

        const mainImageIndex = Number(req.body.isMain ?? 0);
        const files = req.files || [];

        const images = files.map((file, index) => ({
            url: file.path,
            isMain: index === mainImageIndex
        }));

        const product = new Product({
            tittle,
            description,
            price,
            discountPrice,
            category,
            stock,
            tags,
            images,
            slug,
            section
        });

        await product.save();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProductByIdController = async (req , res) => {
    const { id} = req.params

    let data = await Product.findById({_id:id})
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            data
        })
}

const getAllProductController = async (req , res) => {
    try{

    let data = await Product.find({ })
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            data
        })

    }catch (error) {
    console.error("Get All Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getProductUpdateController = async (req , res) => {
    const { id } = req.params

     const files = req.files || [];
        const isMain = Number(req.body.isMain ?? 0);

        const images = files.map((item, index) => ({
            url: item.path,
            isMain: index === req.body.isMain
        }));


    let data = await Product.findByIdAndUpdate({_id:id}, {...req.body , images: images} , {new : true})
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

const getAllPenddingProductController = async (req , res) => {

    let data = await Product.find({status:'pendding' })
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            message:" Here All Pendding Product",
            data
        })
}

const getAllActiveProductController = async (req , res) => {

    let data = await Product.find({status:'active' })
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            message:" Here All Active Product",
            data
        })
}

const getAllInactiveProductController = async (req , res) => {

    let data = await Product.find({status:'inactive' })
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            message:" Here All Inactive Product",
            data
        })
}

const DontgetEditInactiveProductController = async (req , res) => {
    const { id} = req.params

    let pro = await Product.findById({_id:id})
    if(pro.status === 'inactive'){
        return res.json({
            success : false ,
            message:" Inactive Product Can Not Be Edited/Updated"
        })
    }

    return res.json({
            success : true ,
            data
        })
}

const getWithoutInactiveProductController = async (req , res) => {
    const { id} = req.params

    let data = await Product.find({status: {$ne : 'inactive'}})
    if(!data){
        return res.json({
            success : false ,
            message:" No Product Found"
        })
    }

    return res.json({
            success : true ,
            message:" All Product Here Without Inactive Product",
            data
        })
}

const DeleteProductController = async (req , res) => {
    const { id} = req.params

    let data = await Product.findByIdAndDelete({_id:id})
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



const ProductCat = async (req, res) => {
  try {
    const { cat } = req.params;

    const data = await Product.find({
      $or: [
        { category: cat },
        { category: { $regex: `^${cat}$`, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error("Category product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// let BulkCreateProductController = async (req, res) => {
//     try {
//         const { objects, error } = await readSheet(
//             req.file.path,
//             { schema }
//         );

//         const products = objects.map((product, index) => ({
//             tittle: product.tittle,
//             description: product.description,
//             price: product.price,
//             discountPrice: product.discountPrice,
//             stock: product.stock,
//             category: product.category,
//             sku: product.sku,

//             images: product.image
//                 ? [
//                     {
//                         url: product.image,
//                         isMain: index === 0
//                     }
//                 ]
//                 : [],

//             status: product.status || "pendding",
//             tags: product.tags || [],
//             weight: product.weight,
//             slug: product.slug
//         }));

//         const result = await Product.insertMany(products);

//         res.status(201).send({
//             message: "Products created successfully",
//             data: result
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             message: error.message
//         });
//     }
// };



let BulkCreateProductController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Excel file is required"
            });
        }

        const { objects, error } = await readSheet(
            req.file.path,
            { schema }
        );

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Excel reading error",
                error
            });
        }

        const products = objects.map((product) => {
            let images = [];

            if (product.images) {
                try {
                    images = JSON.parse(product.images);
                } catch (error) {
                    console.log(
                        "Image parsing error:",
                        product.tittle,
                        error.message
                    );
                }
            }

            const section = String(product.section || "None")
                .trim()
                .toLowerCase();

            const sectionMap = {
                none: "None",
                flash: "Flash",
                best: "Best"
            };

            return {
                tittle: product.tittle,
                description: product.description,
                price: product.price,
                discountPrice: product.discountPrice,
                stock: product.stock,
                category: product.category,
                sku: product.sku,

                images: images,

                status: product.status || "pendding",

                tags: typeof product.tags === "string"
                    ? product.tags.split(",").map(tag => tag.trim())
                    : product.tags || [],

                weight: product.weight,
                slug: product.slug,

                section: sectionMap[section] || "None"
            };
        });

        console.log("Imported Images:", products.map(p => ({
            tittle: p.tittle,
            images: p.images
        })));

        const result = await Product.insertMany(products);

        return res.status(201).json({
            success: true,
            message: "Products created successfully",
            data: result
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const BulkGetProductController = async (req, res) => {
    try {
        const products = await Product.find();

        const header = [
            "Title",
            "Description",
            "Price",
            "Discount Price",
            "Category",
            "Stock",
            "SKU",
            "Tags",
            "Status",
            "Image 1",
            "Image 2",
            "Image 3",
            "Image 4",
            "Image 5"
        ].map((value) => ({
            value,
            type: String
        }));

        const rows = products.map((product) => [
            { value: product.tittle || "", type: String },
            { value: product.description || "", type: String },
            { value: product.price ?? 0, type: Number },
            { value: product.discountPrice ?? 0, type: Number },
            { value: String(product.category || ""), type: String },
            { value: product.stock ?? 0, type: Number },
            { value: product.sku || "", type: String },

            {
                value: Array.isArray(product.tags)
                    ? product.tags.join(", ")
                    : product.tags || "",
                type: String
            },

            { value: product.status || "", type: String },

            ...Array.from({ length: 5 }, (_, index) => {
                const imagePath = product.images?.[index]?.url || "";

                const imageUrl = imagePath
                    ? imagePath.startsWith("http")
                        ? imagePath
                        : `http://localhost:5000/${imagePath.replace(/\\/g, "/").replace(/^\/+/, "")}`
                    : "";

                return {
                    value: imageUrl,
                    type: String
                };
            })
        ]);

        const filePath = path.join(
            __dirname,
            "../exports",
            `products-${Date.now()}.xlsx`
        );

        await fs.promises.mkdir(
            path.dirname(filePath),
            { recursive: true }
        );

        await writeXlsxFile([
            {
                data: [header, ...rows],
                sheet: "Products"
            }
        ]).toFile(filePath);

        if (!fs.existsSync(filePath)) {
            throw new Error("Excel file was not created");
        }

        console.log("Excel Created:", filePath);

        return res.download(filePath, "products.xlsx", (err) => {
            if (err) {
                console.log("Download Error:", err);

                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: "Failed to download Excel file"
                    });
                }
            }
        });

    } catch (error) {
        console.log("Export Error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to export products",
                error: error.message
            });
        }
    }
};





module.exports = {CreateProductController , ProductCat , getProductByIdController , getAllProductController , getProductUpdateController , getAllPenddingProductController , getAllActiveProductController , getAllInactiveProductController ,DontgetEditInactiveProductController , getWithoutInactiveProductController , DeleteProductController , BulkCreateProductController ,BulkGetProductController }