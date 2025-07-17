import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchVisaDocuments,
  uploadVisaDocument,
} from "../../store/slices/userInfoSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// OPT Receipt -> OPT Ead -> I-983 -> New I-20
export default function VisaStatusPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { visaDocs } = useSelector((state: RootState) => state.userInfo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileType = useMemo(
    () => ["OPT Receipt", "EAD", "I-983", "New I-20"],
    []
  );

  const [step, setStep] = useState(1);
  const progressPercentage = (step / 4) * 100;

  useEffect(() => {
    dispatch(fetchVisaDocuments());
  }, [dispatch, visaDocs]);

  useEffect(() => {
    const nextStep = fileType.findIndex(
      (type, i) => !visaDocs[i] || visaDocs[i]?.status !== "Approved"
    );
    setStep(nextStep === -1 ? fileType.length + 1 : nextStep + 1);
  }, [visaDocs, dispatch, step, fileType]);

  const handleUpload = (file: File, docName: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", docName);

    console.log("Uploading file:", file, "with doc name", docName);

    dispatch(uploadVisaDocument(formData))
      .unwrap()
      .then(() => {
        toast.success("File uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file");
      });
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (step < 1 || step > fileType.length) {
      toast.error("Invalid step.");
      return;
    }

    handleUpload(selectedFile, fileType[step - 1]);
    setSelectedFile(null);
  };

  const currentDoc = visaDocs[step - 1];
  const currentType = fileType[step - 1];

  const getMessage = () => {
    if (!currentDoc) return "";
    const status = currentDoc.status?.toLowerCase();
    const feedback = currentDoc.feedback || "";

    switch (currentType) {
      case "OPT Receipt":
        if (status === "pending")
          return "Waiting for HR to approve your OPT Receipt.";
        if (status === "approved")
          return "Please upload a copy of your OPT EAD.";
        break;
      case "EAD":
        if (status === "pending")
          return "Waiting for HR to approve your OPT EAD.";
        if (status === "approved")
          return "Please download and fill out the I-983 form.";
        break;
      case "I-983":
        if (status === "pending")
          return "Waiting for HR to approve and sign your I-983.";
        if (status === "approved")
          return "Please send the I-983 to your school and upload the new I-20.";
        break;
      case "New I-20":
        if (status === "pending") return "Waiting for HR to approve your I-20.";
        if (status === "approved") return "All documents have been approved.";
        break;
    }

    return status === "rejected" ? `Rejected: ${feedback}` : "";
  };

  const handlePreview = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="container mt-3 p-3 h-100 overflow-auto"
      style={{
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      {/* Progress steps */}
      <h4 className="fw-semibold">Upload Employee Documents</h4>
      <div className="progress my-3" style={{ height: "10px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      {getMessage() && (
        <div
          className={`alert text-center fw-semibold ${
            currentDoc?.status.toLowerCase() === "rejected"
              ? "alert-danger"
              : "alert-info"
          }`}
        >
          <p>{getMessage()}</p>
        </div>
      )}

      {step > fileType.length && (
        <div className="alert alert-success text-center fw-semibold">
          <p className="fw-semibold">All documents have been approved.</p>
        </div>
      )}

      <div className="mb-3">
        {step >= 1 && step <= fileType.length && (
          <p className="fw-semibold">Upload {fileType[step - 1]}</p>
        )}
        {/* providing Empty template and Sample Template for I-983 */}
        {fileType[step - 1] === "I-983" && (
          <div className="mb-3">
            <p>Download template:</p>
            <a
              href="/templates/i983.pdf"
              download
              className="btn btn-outline-primary me-2"
            >
              Empty Template
            </a>
            <a
              href="/templates/I-983_sample.pdf"
              download
              className="btn btn-outline-primary"
            >
              Sample Template
            </a>
          </div>
        )}

        <div className="input-group">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={
              (visaDocs[step - 1] &&
                visaDocs[step - 1]?.status === "rejected") ||
              step > fileType.length
            }
          />

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={
              (visaDocs[step - 1] &&
                visaDocs[step - 1]?.status === "rejected") ||
              step > fileType.length
            }
          >
            Upload
          </button>
        </div>
        {/* Preview file */}
        {selectedFile && (
          <>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt={selectedFile.name}
              className="img-thumbnail"
            />
            <div className="mt-3">
              <p>File Name: {selectedFile.name}</p>
              <p>File Type: {selectedFile.type}</p>
              <p>File Size: {selectedFile.size} bytes</p>
            </div>
          </>
        )}
      </div>

      {/* Showing all uploaded files */}
      {visaDocs.length > 0 && (
        <div className="mt-3">
          <h4 className="fw-semibold">Uploaded Documents</h4>
          <ul className="list-group">
            {visaDocs.map((doc, index) => (
              <li
                className="list-group-item d-flex align-items-center justify-content-between"
                key={index}
              >
                <p className="mb-0">
                  <strong>Document {index + 1}:</strong> {doc.type}
                </p>
                <img
                  src={doc.previewUrl}
                  alt={doc.type}
                  className="img-thumbnail cursor-pointer"
                  style={{ width: "150px" }}
                  onClick={() => handlePreview(doc.previewUrl)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
