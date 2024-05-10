const multer = require('multer');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('../path/');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: '',
});



const storage = multer.memoryStorage({
    destination: './uploads/', // Specify the upload directory
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadFile = multer({ storage: storage });
const bucket = admin.storage().bucket("");


const uploadAndGetFirebaseUrl = async (req) => {
    const fileData = req?.file || req || undefined
    const imageBuffer = fileData?.buffer;

    if (!imageBuffer) {
        console.error('Image buffer is undefined.');
        throw new Error('Image buffer is undefined.')
    }

    else {
        const imageName = fileData.fieldname + "-" + fileData.originalname + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
        const file = bucket.file(imageName);
        await file.save(imageBuffer, { contentType: 'image/jpeg' });
        const [url] = await file.getSignedUrl({ action: 'read', expires: '03-01-2500' });
        console.log('Image uploaded to firebase successfully. Name:', fileData.originalname);
        return url;
    }

}

module.exports = {
    uploadFile,
    uploadAndGetFirebaseUrl,
    bucket
}