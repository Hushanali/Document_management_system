const { File } = require("../models/File");
const { Folder } = require("../models/Folder");
const { Op } = require("sequelize");

const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.findAll();
    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const getAllFiles = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    const files = await File.findAll({ where: { folderId } });
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const getFilesBySize = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    const fileBySize = await File.findAll({
      where: { folderId },
      order: [["size", "DESC"]],
    });

    res.status(200).json({ fileBySize });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const getFilesByRecency = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    const fileByRecency = await File.findAll({
      where: { folderId },
      order: [["uploadedAt", "ASC"]],
    });

    res.status(200).json({ fileByRecency });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const getByFileType = async (req, res) => {
  const { type } = req.query;

  const validTypes = [
    "jpeg",
    "jpg",
    "png",
    "webp",
    "pdf",
    "csv",
    "vnd.ms-excel",
    "vnd.ms-powerpoint",
    "vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (!type || !validTypes.includes(type.toLowerCase())) {
    return res.status(400).json({ message: "Invalid or missing file type." });
  }

  try {
    const files = await File.findAll({
      where: {
        type: {
          [Op.iLike]: `%${type}%`,
        },
      },
    });

    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const getMetaData = async (req, res) => {
  const { folderId } = req.params;
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folderId) {
      return res.status(400).json({ message: "Folder not found." });
    }

    const fileMetaData = await File.findAll({
      where: { folderId },
      attributes: ["fileId", "name", "size", "description"],
    });

    res.status(200).json({ files: fileMetaData });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

module.exports = {
  getAllFolders,
  getAllFiles,
  getFilesBySize,
  getFilesByRecency,
  getByFileType,
  getMetaData,
};
