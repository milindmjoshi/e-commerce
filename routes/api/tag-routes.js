const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  // be sure to include its associated Products
  try {
    const tagData = await Tag.findAll({
      include: [{
        model: Product,
        attributes: ['product_name'],
        through: ProductTag
      }
      ]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }

});


router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const id = req.params.id;
  const tagData = await Tag.findByPk(id, {
    include: [{
      model: Product,
      attributes: ['product_name'],
      through: ProductTag
    }]
  })

  if (!tagData) {
    res.status(404).json({ message: 'Tag not found with id: ' + id });
  }
  else {
    res.status(200).json(tagData);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name
    })
    res.status(200).send(tagData);
  }
  catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value, sample body
  // {
  //   "tag_name": "Vintage"
  // }
  const tagId = req.params.id;
  try {
    const updatedTag = await Tag.update(
      {
        // All the fields you can update and the data attached to the request body.
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: tagId
        }
      }
    );
    return res.status(200).json(updatedTag);
  }
  catch (err) {
    return res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const tagId = req.params.id;
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: tagId,
      }
    });

    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found with id ' + tagId });
      return;
    }

    res.status(200).json(deletedTag);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
