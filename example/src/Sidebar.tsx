import { motion } from "framer-motion";
import type { IHighlight } from "./react-pdf-highlighter";

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

const updateHash = (highlight: IHighlight) => {
  //Set the hash in the URL but prevent the default scroll behavior
   window.history.pushState(null, '', `#highlight-${highlight.id}`);
  //document.location.hash = `highlight-${highlight.id}`;

  //Manually scroll to the target element with smooth behavior
  const highlightElement = document.getElementById(`highlight-${highlight.id}`);
  // highlightElement?.classList.add("bg-blue-500")
  console.log(highlightElement?.classList)
  if (highlightElement) {
    highlightElement.scrollIntoView({
      behavior: "smooth", // Smooth scroll to the element
      block: "start",    // Align the element in the center of the viewport
      inline: "nearest",  // Make sure it's fully visible horizontally
    });

  } else {
    console.warn(`Element with ID 'highlight-${highlight.id}' not found.`);
  }
  

};





declare const APP_VERSION: string;

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
}: Props) {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="sidebar  shadow-lg h-full  p-4 flex flex-col "
    >

      <motion.ul
        className=" space-y-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 1 },
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {highlights.map((highlight, index) => (
          <motion.li
            key={index}
            className="cursor-pointer p-2 bg-blue-100 rounded-lg shadow hover:shadow-lg transition-shadow"
            onClick={() => updateHash(highlight)}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div>
              <strong className="text-gray-700">{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote className="mt-2 text-gray-600">
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div className="mt-2">
                  <img
                    src={highlight.content.image}
                    alt="Screenshot"
                    className="rounded-md"
                  />
                </div>
              ) : null}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Page {highlight.position.pageNumber}
            </div>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-4 flex flex-col space-y-2">
        <button
          type="button"
          onClick={toggleDocument}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          style={{backgroundColor:"#3c79e3"}}
        >
          Toggle PDF document
        </button>

        {highlights.length > 0 && (
          <button
            type="button"
            onClick={resetHighlights}
            className="w-full py-2 px-4  text-white rounded-lg shadow  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 "
            style={{backgroundColor:"#b93f3f"}}
          >
            Reset highlights
          </button>
        )}
      </div>
    </motion.div>
  );
}
