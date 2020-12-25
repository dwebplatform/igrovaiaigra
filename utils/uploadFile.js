const multer = require('multer');
const path = require('path');
/**
 * @description контейнер для загрузки одного файла
 */
const storage = multer.diskStorage({
    destination:'./public/uploads',
    filename: function(req,file,cb){// название файла при сохранении
        cb(null,file.fieldname+'-'+ Date.now()+path.extname(file.originalname));
    }
});
const uploadFile = (imageField='myImage') => multer({
    storage: storage
}).single(imageField);


module.exports = uploadFile;