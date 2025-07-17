import FacilityReport from '../models/facilityReport.js';

// i. Create a facility report
export const createFacilityReport = async (req, res) => {
  try {
    const { title, description, house } = req.body;
    const report = await FacilityReport.create({
      title,
      description,
      house,
      author: req.user._id
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create report' });
  }
};

// ii. View reports submitted by the authenticated user
export const getMyReports = async (req, res) => {
  try {
    const reports = await FacilityReport.find({ author: req.user._id })
      .populate('author', 'userName')
      .populate('house', 'address');
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// iii. Add a comment to a report
export const addCommentToReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { description } = req.body;

    const report = await FacilityReport.findById(reportId);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    report.comments.push({
      text: description,
      author: req.user._id,
      createdAt: new Date()
    });

    await report.save();
    res.status(200).json({ message: 'Comment added', report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// iv. View comments on a report
export const getCommentsForReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await FacilityReport.findById(reportId).populate('comments.author', 'userName');
    if (!report) return res.status(404).json({ error: 'Report not found' });

    res.status(200).json(report.comments);
  } catch (err) {

    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};


// HR: Update status of a facility report
export const updateFacilityReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    // Validate allowed statuses
    const allowedStatuses = ['Open', 'In Progress', 'Closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const report = await FacilityReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.status(200).json({ message: 'Status updated', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

export const getReportsByHouse = async (req, res) => {
  const { houseId } = req.params;
  
  try {
    const reports = await FacilityReport.find({ house: houseId })
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports by house:', err);
    res.status(500).json({ error: 'Failed to fetch reports for this house' });
  }
};