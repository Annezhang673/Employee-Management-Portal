import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type PreviousFilePreviewProps = {
  label: string;
  url?: string;
};

export function PreviousFilePreview({ label, url }: PreviousFilePreviewProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  if (!url) return null;

  return (
    <motion.li
      layout
      className="list-group-item cursor-pointer"
      onClick={() => setExpanded((prev: boolean) => !prev)}
    >
      <strong>{label}</strong>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <img src={url} alt={label} className="img-thumbnail" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
