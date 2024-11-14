import { Component } from "react";
import { motion } from "framer-motion";
import styles from "../style/Tip.module.css";
import {NotebookPen,Bookmark } from "lucide-react"

interface State {
  compact: boolean;
  text: string;
  emoji: string;
}

interface Props {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
  setNotes: () => void
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    emoji: "",
  };


  // for TipContainer
  componentDidUpdate(_: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen,setNotes } = this.props;
    const { compact, text, emoji } = this.state;

    return (
      <div>
        {compact ? (
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex space-x-4 items-center p-2 bg-gr rounded-md shadow-lg border border-gray-300 bg-gray-500"
          >
            {/* Highlighter with animation */}
            <motion.div
              onClick={() => {
                onOpen();
                this.setState({ compact: false });
              }}
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center justify-center"
            >
              <Bookmark className="h-5 w-5 fill-blue-500" />
            </motion.div>
      
            {/* NotebookPen with animation */}
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer flex items-center justify-center"
            >
              <NotebookPen 
              className="fill-yellow-500"
              onClick={()=>{
                onOpen();
                setNotes()
              }}
              
              />
            </motion.div>
          </motion.div>

        ) : (
          <form
          className={`${styles.card} bg-white p-6 rounded-lg shadow-md max-w-md mx-auto`}
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm({ text, emoji });
          }}
        >
          <div className="space-y-4">
            {/* Textarea for comment input */}
            <textarea
              placeholder="Your comment"
              autoFocus
              value={text}
              onChange={(event) =>  this.setState({ text: event.target.value })}
              className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-32"
            />
    
            {/* Emoji selection section */}
            <div className="flex justify-center space-x-3">
              {["👨‍🎓", "😱", "😍", "🔥", "😳", "⚠️"].map((_emoji) => (
                <label key={_emoji} className="flex items-center">
                  <input
                    checked={emoji === _emoji}
                    type="radio"
                    name="emoji"
                    value={_emoji}
                    onChange={(event) => this.setState({ emoji: event.target.value })}
                    className="hidden"
                  />
                  <span
                    className={`cursor-pointer text-2xl ${
                      emoji === _emoji ? "scale-125" : ""
                    } transition-transform`}
                  >
                    {_emoji}
                  </span>
                </label>
              ))}
            </div>
          </div>
    
          {/* Submit button */}
          <div className="mt-4 flex justify-center">
            <input
              type="submit"
              value="Save"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition"
              style={{backgroundColor:"#366acb"}}
            />
          </div>
        </form>
        )}
      </div>
    );
  }
}
