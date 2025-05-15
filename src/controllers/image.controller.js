const { ObjectId } = require("mongodb");
const generateImageUrl = require("../utils/ai/generateImageUrl");
const getImageBuffer = require("../utils/ai/getImageBuffer");
const { imageCollection } = require("../utils/connectDB");

const insertAiImage = async (req, res) => {
  const { email, prompt, username, userImg, category } = req.body;

  if (!email || !prompt || !username || !userImg || !category) {
    res.status(400).send({
      status: 400,
      message: "Please provide email, prompt, username, userImg, category",
    });
  }

  // 1 + 2- create a final prompt &  Generate image Buffer
  try {
    const buffer = await getImageBuffer(prompt, category);
    console.log(buffer);

    // 3- upload image and get url
    const data = await generateImageUrl(buffer, prompt);
    console.log(data);

    // 4- insert data in mongodb
    const document = {
      email,
      username,
      userImg,
      prompt,
      category,
      thumb_img: data.data.thumb.url,
      medium_img: data.data.medium.url,
      original_img: data.data.url,
      createdAt: new Date().toISOString(),
    };

    const result = await imageCollection.insertOne(document);
    console.log(document);

    // 5- send response
    res.send({ ...result, url: document.original_img });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getAllImage = async (req, res) => {
  try {
    const result = await imageCollection
      .find()
      .project({ _id: 1, userImg: 1, username: 1, thumb_img: 1 })
      .toArray();
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getSingleImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (id.length != 24) {
      res.status(400).send({
        status: 400,
        message: "please provide valid id",
      });
      return;
    }

    const result = await imageCollection.findOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = { insertAiImage, getAllImage, getSingleImage };