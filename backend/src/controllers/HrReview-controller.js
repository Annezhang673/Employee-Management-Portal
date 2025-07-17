import Application from "../models/application_model.js";
import User from '../models/user_model.js';
import { getSignedFileURL } from '../lib/s3.js';

// 1. list all applications by status
export async function listApplications(req, res) {
   const { status } = req.query; // in a url like /review?status=Pending

   const apps = await Application.find({ status })
      .select('user createdAt')
      .populate('user', 'userName email')
      .sort({ createdAt: -1})             // newest first 
      .lean();                            // plain JS Objects

   // filter out any that failed to populate
   const validApps = apps.filter(a => a.user && a.user.userName);

   // transform the DB rows to the shape React need
   const payload = validApps.map( a => ({
      appId:      a._id.toString(),
      userName:   a.user.userName,
      email:      a.user.email,
      submitted:  a.createdAt
   }));

   res.json(payload);
}

// 2. 
// Find one application by id
// Populate the user info
// return the entire application object
export async function getApplication(req, res) {
   const { appId } = req.params;    // A route declared as /:appId

   const app = await Application.findById(appId)
      .populate('user', 'userName email')
      .lean();

   if (!app) return res.status(404).json({ error: 'Not Found'});

   const signedDocuments = await Promise.all(
      app.documents.map(async (doc) => {
         const { previewUrl, downloadUrl } = await getSignedFileURL(doc.s3Key);
         return {
            ...doc,
            previewUrl,
            downloadUrl,
         };
      })
   );
   app.documents = signedDocuments;
   res.json(app);
}

// 3. Approve an application
// Fetch by ID, set status to 'Approved'
// save and return new status
export async function approveApplication(req, res) {
   const { appId } = req.params;
   const app = await Application.findById(appId);
   if (!app) return res.status(404).json({ error: 'Not Found'});

   // Change the status, save data
   app.status = 'Approved';
   await app.save();
   res.json(app);
}

// 4. Reject an application
// fetch by ID, reads { feedback } from req.body
// set status to 'Rejected' with feedback
// save and return updated status and feedback
export async function rejectApplication(req, res) {
   const { appId } = req.params;
   const { feedback } = req.body;

   const app = await Application.findById(appId);
   if (!app) return res.status(404).json({ error: 'Not Found'});

   app.status = 'Rejected';
   app.feedback = feedback;
   await app.save();
   res.json({ status: 'Rejected', feedback: app.feedback });
}