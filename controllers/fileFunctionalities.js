const { Folder } = require("../models/Folder.js");
const { File } = require("../models/File.js");
const { upload } = require("../middleware/fileUpload.js");

const uploadFile = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const description = req.body.description;
      const file = req.file;

      const uploadedFile = file.mimetype.split("/")[1];

      const validTypesMap = {
        img: ["jpeg", "jpg", "png", "webp"],
        pdf: ["pdf"],
        csv: ["csv", "vnd.ms-excel"],
        ppt: [
          "vnd.ms-powerpoint",
          "vnd.openxmlformats-officedocument.presentationml.presentation",
        ],
      };

      if (!validTypesMap[folder.type].includes(uploadedFile)) {
        return res
          .status(400)
          .json({ message: `File type must be ${folder.type}` });
      }

      const count = await File.count({ where: { folderId } });
      if (count >= folder.maxFileLimit) {
        return res.status(400).json({ message: "Folder file limit reached." });
      }

      const newFile = await File.create({
        uploadedAt: new Date(),
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        folderId: folderId,
        description,
      });

      return res
        .status(200)
        .json({ message: "File uploaded successfully", newFile });
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const updateFileDesc = async (req, res) => {
  const { folderId, fileId } = req.params;
  const description = req.body.description;

  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    const file = await File.findByPk(fileId);
    if (!file || file.folderId !== folderId) {
      return res
        .status(200)
        .json({ message: "File does not exist in the specified folder." });
    }

    if (description) file.description = description;

    await file.save();

    res.status(200).json({
      message: "File description updated successfully",
      files: {
        fileId: file.fileId,
        description: file.description,
      },
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

const deleteFile = async (req, res) => {
  const { folderId, fileId } = req.params;
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      return res.status(400).json({ message: "Folder not found." });
    }

    const file = await File.findByPk(fileId);
    if (!file || file.folderId !== folderId) {
      return res.status(400).json({ message: "File not found in the folder." });
    }

    await file.destroy();

    res.status(200).json({ message: "Deletes the specified file." });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

module.exports = { uploadFile, updateFileDesc, deleteFile };
