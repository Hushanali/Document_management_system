const express = require("express");
const {
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
} = require("../controllers/folderFunctionalities");
const {
  uploadFile,
  updateFileDesc,
  deleteFile,
} = require("../controllers/fileFunctionalities");
const {
  getAllFolders,
  getAllFiles,
  getFilesBySize,
  getByFileType,
  getMetaData,
} = require("../controllers/readFunctionalities");
const router = express.Router();

router.post("/folder/create", createFolder);
router.put("/folders/:folderId", updateFolder);
router.delete("/folders/:folderId", deleteFolder);
router.get("/folders/:folderId", getFolder);

router.post("/folders/:folderId/files", uploadFile);
router.put("/folders/:folderId/files/:fileId", updateFileDesc);
router.delete("/folders/:folderId/files/:fileId", deleteFile);

router.get("/folders", getAllFolders);
router.get("/folders/:folderId/files", getAllFiles);
router.get("/folders/:folderId/filesBySort", getFilesBySize);
router.get("/files", getByFileType);
router.get("/folders/:folderId/files/metadata", getMetaData);

module.exports = { router };
