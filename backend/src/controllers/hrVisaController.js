import User from "../models/user_model.js";

/**
 * 1. GET /api/visa/in-progress
 *    Returns all users with any visaDoc.status !== 'Approved'
 *    plus nextStep and daysRemaining.
*/
export const getInProgress = async (req, res) => {
   try {
      // Fetch all employees with visaDoc.status other than 'None'
      const users = await User.find({ visaType: { $ne: 'None' } })
         .populate( {path: "application", select: "data.visa"})
         .lean();

      const now = Date.now();

      const payload = users.map( (u) => {

         // 1. Guard against missing visaDocs
         const docs = Array.isArray(u.visaDocs) ? u.visaDocs : [];

         // 2. extract the visa dates from the populated application
         const visaInfo = u.application?.data?.visa || {};
         const startDate = visaInfo.startDate || null;
         const endDate = visaInfo.endDate || null;

         // Calculate daysRemaining
         const endTs = endDate ? new Date(endDate).getTime() : now;
         const daysRemaining = Math.max(0, Math.ceil((endTs - now) / (1000 * 60 * 60 * 24)));

         // 3. Find the first visaDoc with status !== 'Approved', (Not Approved)
         const pending = docs.find((d) => d.status !== "Approved");
         
         // determine the nextStep message
         let nextStep;
         if (docs.length === 0) {
            nextStep = "Submit OPT Receipt";
         } else if( pending ) {
            nextStep = pending.status === 'Pending' ? `Waiting for HR approval of ${pending.type}`
               : `Please upload ${pending.type}`;
         } else {
            nextStep = "All documents approved";
         }

         return {
            userId:       u._id.toString(),
            fullName:     `${u.firstName} ${u.lastName}`,
            visaType:     u.visaType,
            startDate,    // from application.data.visa
            endDate,      // from application.data.visa
            daysRemaining,
            nextStep,
            pendingDoc: pending
               ? { type: pending.type, url: pending.url }
               : null,
         };
      })
      .filter( (item) => item.nextStep !== "All documents approved" );

      return res.status(200).json(payload);
   } catch (err) {
      console.error('*** getInProgress ERROR ***', err.stack || err);
      return res.status(500).json({ error: "Server error" });
   }
};




/**
 * PUT /api/visa/:userId/docs/:docType/approve
 * Marks the given visa document as Approved.
 * If docType === 'OPT EAD', expects { startDate, endDate } in req.body
 *   to set the visa validity period on the user’s application.
*/

export const approveVisaDoc = async (req, res) => {
   try {
      const { userId, docType } = req.params;
      const { startDate, endDate } = req.body;  // only used on OPT EAD

      const user = await User.findById(userId).populate({
         path: "application",
         select: "data.visa",
      });
      if (!user) return res.status(404).json({ error: "User not found" });

      const doc = user.visaDocs.find( (d) => d.type === docType);
      if (!doc) return res.status(404).json({ error: "Visa document not found" });

      if( docType === "OPT EAD") {
         if(!startDate || !endDate) {
            return res.status(400).json({ error: "startDate and endDate are required for OPT EAD" });
         }
         user.application.data.visa.startDate = startDate;
         user.application.data.visa.endDate = endDate;
         await user.application.save();
      }

      doc.status = "Approved";
      await user.save();

      return res.status(200).json({ message: "Approved", docType, status: doc.status });
   } catch (error) {
      console.error("hrVisaController.approveVisaDoc error:", error);
      return res.status(500).json({ error: "Server error" });
   }
};

/**
 * PUT /api/visa/:userId/docs/:docType/reject
 * Marks the given visa document as Rejected and stores HR feedback.
*/

export const rejectVisaDoc = async (req, res) => {
   try {
      const { userId, docType } = req.params;
      const { feedback } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json( {error: "User not found"});

      const doc = user.visaDocs.find( (d) => d.type === docType);
      if (!doc) return res.status(404).json({ error: "Visa document not found" });

      doc.status = "Rejected";
      doc.feedback = feedback || "No feedback provided";
      await user.save();

      return res.status(200).json({ message: "Rejected", docType, status: doc.status, feedback: doc.feedback });
   } catch (error) {
      console.error("hrVisaController.rejectVisaDoc error:", error);
      return res.status(500).json({ error: "Server error" });
   }

};


/**
 * POST /api/visa/:userId/notify
 * Sends an email reminding the employee of their nextStep.
*/
export const sendVisaReminder = async (req, res) => {
   try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate({
         path: "application",
         select: "data.visa",
      });
      if (!user) return res.status(404).json({ error: "User not found" });

      // determine nextStep text
      const pending = user.visaDocs.find((d) => d.status !== "Approved");
      const nextStep = !user.visaDocs.length
      ? "Submit OPT Receipt"
      : pending
      ? pending.status === "Pending"
         ? `Waiting for HR approval of ${pending.type}`
         : `Please upload ${pending.type}`
      : "All documents approved";

      await sendEmail(
         user.email,
         "Visa Status Reminder",
         `Hello ${user.firstName},\n\nYour next step: ${nextStep}\n\nThank you.`
      );

      return res.status(200).json({ message: "Reminder sent" });
   } catch (error) {
      console.error("hrVisaController.sendVisaReminder error:", error);
      return res.status(500).json({ error: "Server error" });
   }
};

/**
 * GET /api/visa/all?search=...
 * Returns every visa-status employee, optionally filtered by name,
 * along with their approved documents.
*/
export const getAllVisaStatus = async (req, res) => {
   try{
      const { search = "" } = req.query;
      const regex = new RegExp(search, "i");

      const users = await User.find({
      visaType: { $ne: "None" },
      $or: [
         { firstName:    regex },
         { lastName:     regex },
         { preferredName: regex },
         ],
      })
         .populate({ path: "application", select: "data.visa" })
         .lean();

      const payload = users.map( (u) => {
         const visaInfo = u.application?.data?.visa || {};
         const startDate = visaInfo.startDate || null;
         const endDate = visaInfo.endDate || null;

         return {
            userId:       u._id.toString(),
            fullName:     `${u.firstName} ${u.lastName}`,
            visaType:     u.visaType,
            startDate,
            endDate,
            daysRemaining: Math.max(
               0,
               Math.ceil(
                  (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
               )
            ),
            approvedDocs: u.visaDocs.filter((d) => d.status === "Approved"),
         };
      });
      
      res.status(200).json(payload);

      } catch (error) {
         console.error("hrVisaController.getAllVisaStatus error:", error);
         return res.status(500).json({ error: "Server error" });
      }
};