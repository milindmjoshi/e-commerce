const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{
        model: Product,
        attributes: ['product_name']
      }],
    });
    //console.log(categoryData);
    res.status(200).json(categoryData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const id = req.params.id;
    const categoryData = await Category.findByPk(id, {
      include: [{
        model: Product,
        attributes: ['product_name']
      }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Category not found with id: ' + id });
    }
    else {
      res.status(200).json(categoryData);
    }
     
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name
    })
    res.status(200).send(categoryData);
  }
  catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value, sample put body
  // {
  //   "category_name": "Golf shirts"
  // }
  catId = req.params.id;
  try {
    const updatedCategory = await Category.update(
      {
        // All the fields you can update and the data attached to the request body.
        category_name: req.body.category_name,
      },
      {
        where: {
          id: catId,
        }
      }
    );
    return res.status(200).json(updatedCategory);
  }
  catch (err) {
    return res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  const catId = req.params.id;
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: catId,
      }
    });

    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found with id ' + catId });
      return;
    }

    res.status(200).json(deletedCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
