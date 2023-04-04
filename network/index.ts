import express from "express";
const route = express.Router();

import recording from '../components/recordings/network';
route.use('/recordings',recording)

import record_download from '../components/record_download/network'
route.use('/recordDownload',record_download)



export default route