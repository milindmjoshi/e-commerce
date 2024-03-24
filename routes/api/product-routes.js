const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products, include associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name'],
        through: ProductTag
      }
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }

});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`

  const id = req.params.id;
  const productData = await Product.findByPk(id, {
    include: [{
      model: Category,
      attributes: ['category_name']
    },
    {
      model: Tag,
      attributes: ['tag_name'],
      through: ProductTag
    }]
  })

  if (!productData) {
    res.status(404).json({ message: 'Product not found with id: ' + id });
  }
  else {
    res.status(200).json(productData);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this where 
     category_id and tagIds are optional
    {
      "product_name": "Polo shirt",
      "price": "60.00",
      "stock": 25,
      "category_id": 1,
      "tagIds": [3,4,5]
      }
  */
  return await Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  /* req.body should look like this where 
     product_name, price, stock , category_id, tagIds are optional
    {
      "product_name": "New product",
      "price": "60.00",
      "stock": 25,
      "category_id": 1,
      "tagIds": [3,4,5]
      }
  */
  // update product data
  return Product.update(
    {
      // All the fields you can update and the data attached to the request body.
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tagids: req.body.tagIds
    },
    {
      where: {
        id: req.params.id,
      }
    }
  )
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  const id = req.params.id;
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found with id ' + id });
      return;
    }

    res.status(200).json(deletedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
