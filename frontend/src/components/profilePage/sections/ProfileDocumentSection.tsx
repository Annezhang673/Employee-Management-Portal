import React, { useEffect, useState } from "react";
import EditableSection from "../EditableSection";
import axiosApi from "../../../lib/axiosApi";
import toast from "react-hot-toast";

type Document = {
  _id: string;
  name: string;
  s3Key: string;
  url: string;
};

type DocumentSectionProps = {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  userInfo: any;
  userId: string;
};

export default function ProfileDocumentSection({
  documents,
  setDocuments,
  userInfo,
  userId,
}: DocumentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const updated = await Promise.all(
        documents.map(async (doc) => {
          try {
            const res = await axiosApi.get(
              `/api/s3/signed-url?key=${doc.s3Key}`
            );
            return { ...doc, url: res.data.url };
          } catch (err) {
            toast.error("Failed to load document URLs");
            return doc;
          }
        })
      );
      setDocuments(updated);
    };

    if (!isEditing) fetchSignedUrls();
  }, [isEditing]);

  const handleSave = async () => {
    try {
      await axiosApi.put(`/api/users/me?userId=${userId}`, {
        documents,
      });
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
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <a
              key={index}
              href={doc.url}
              className="list-group-item list-group-item-action"
              target="_blank"
              rel="noreferrer"
            >
              {doc.name}
            </a>
          ))
        ) : (
          <p className="text-muted">No documents available.</p>
        )}
      </div>
    </EditableSection>
  );
}
