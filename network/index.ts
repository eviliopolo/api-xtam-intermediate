import express from "express";
const route = express.Router();

import recording from '../components/recordings/network';
route.use('/recordings',recording)

import record_download from '../components/record_download/network'
route.use('/recordDownload',record_download)

import updateRecordings from '../components/updateRecordingsDate/network'
route.use('/update',updateRecordings)



export default route