import React, { useEffect, useState } from "react";
import EditableSection from "../EditableSection";
import axiosApi from "../../../lib/axiosApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { useSelector } from "react-redux";

type Document = {
  _id: string;
  name: string;
  s3Key: string;
  previewUrl: string;
  downloadUrl: string;
};

type DocumentSectionProps = {
  userInfo: any;
};

export default function ProfileDocumentSection({
  userInfo,
}: DocumentSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const documents = useSelector((state: any) => state.userInfo.documents);

  
  
  const [parseDocuments, setParseDocuments] = useState<Document[]>([]);
  console.log("Documents:", parseDocuments);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const res = await axiosApi.get("/api/onboarding");
      const signedDocs = res.data.documents || [];
      setParseDocuments(signedDocs);
    };

    if (!isEditing) fetchSignedUrls();
  }, [isEditing, documents]);

  const handleSave = async () => {
    try {
      await axiosApi.put("/api/users/me", documents);
      toast.success("Document section saved successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save document section");
    }
  };

  return (
    <EditableSection
      title="Documents"
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    >
      {/* Show list of ducuments, Employee able to download, open preview */}
      <div className="list-group">
        {parseDocuments.length > 0 ? (
          <ul className="list-group">
            {parseDocuments.map((doc, index) => (
              <li
                key={doc._id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                style={{ cursor: "default" }}
              >
                <span className="fw-bold">{doc.name}</span>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => window.open(doc.previewUrl, "_blank")}
                  >
                    Preview
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = doc.downloadUrl;
                      link.download = doc.name;
                      document.body.appendChild(link);
                      link.target = "_blank";
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No documents available.</p>
        )}
      </div>
    </EditableSection>
  );
}
