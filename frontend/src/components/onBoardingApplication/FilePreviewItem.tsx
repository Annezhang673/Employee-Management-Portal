import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type FilePreviewItemProps = {
  label: string;
  file: File | null | undefined;
};

export default function FilePreviewItem({ label, file }: FilePreviewItemProps) {
  const [expanded, setExpanded] = useState(false);
  if (!file) return null;

  return (
    <motion.li
      layout
      className="list-group-item cursor-pointer"
      key={file.name}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <strong>{label}</strong>: {file.name}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={label}
              className="img-thumbnail"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
