const { Folder } = require("../models/Folder");

const createFolder = async (req, res) => {
  const { name, type, maxFileLimit } = req.body;

  try {
    if (!name || !type || !maxFileLimit) {
      return res.status(400).json({ message: "All field are required." });
    }

    const allowTypes = ["csv", "img", "pdf", "ppt"];
    if (!allowTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid folder type." });
    }

    if (!Number.isInteger(maxFileLimit) || maxFileLimit <= 0) {
      return res
        .status(400)
        .json({ message: "maxFileLimit must be a positive integer." });
    }

    const existingFolderName = await Folder.findOne({ where: { name } });
    if (existingFolderName) {
      return res.status(400).json({ message: "Folder name must be unique." });
    }

    const createFolder = await Folder.create({
      name,
      type,
      maxFileLimit,
    });

    res.status(200).json({
      message: "Folder created successfully",
      folder: { createFolder },
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name, maxFileLimit } = req.body;

  if (!Number.isInteger(maxFileLimit) || maxFileLimit <= 0) {
    return res
      .status(400)
      .json({ message: "maxFileLimit must be a positive integer." });
  }

  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    if (name && name !== folder.name) {
      const existing = await Folder.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ message: "Folder name must be unique." });
      }
    }

    if (name) folder.name = name;
    if (maxFileLimit) folder.maxFileLimit = maxFileLimit;

    await folder.save();

    res.status(200).json({ message: "Folder updated successfully", folder });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    await folder.destroy();

    res.status(200).json({ message: "Folder deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFolder = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    res.status(200).json({ folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createFolder, updateFolder, deleteFolder, getFolder };
