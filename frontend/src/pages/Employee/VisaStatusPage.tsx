import { useEffect, useState } from "react";
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
  const fileType = ["OPT Receipt", "EAD", "I-983", "New I-20"];

  const [step, setStep] = useState(1);
  const progressPercentage = (step / 4) * 100;

  useEffect(() => {
    dispatch(fetchVisaDocuments());
  }, [dispatch]);

  useEffect(() => {
    setStep(visaDocs.length > 0 ? visaDocs.length : 1);
  }, [visaDocs]);

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

  console.log("visaDocs", visaDocs);

  return (
    <div className="container mt-3">
      {/* Progress steps */}
      <h4>Upload Employee Documents</h4>
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

      {step > 0 && visaDocs[step - 1]?.status === "Pending" && (
        <div className="alert alert-info text-center fw-semibold">
          <p>Waiting for HR approval</p>
        </div>
      )}

      <div className="mb-3">
        {step >= 1 && step <= fileType.length && (
          <p className="fw-semibold">Upload {fileType[step - 1]}</p>
        )}

        <div className="input-group">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={step < 1 || step > fileType.length}
          />

          <button className="btn btn-primary" onClick={handleSubmit}>
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
              <li className="list-group-item" key={index}>
                <strong>Document {index + 1}:</strong> {doc.type}
                <img
                  src={doc.previewUrl}
                  alt={doc.type}
                  className="img-thumbnail"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
