import { Editor } from "novel"
import "../style/Editor.module.css"
import { useEffect, useState } from "react"
import "../style/global.css"
import type {Content} from "../types" 

interface Props {
  note: Content | null;
}


export const Edit = ({ note }: Props) => {

  const [content] = useState({});
  const [editor, seteditor] = useState<any>(null)
  // Function to handle content change
  const handleContentChange = (editor:any) => {
    // setContent();
    seteditor(editor)
    console.log("updated")
    console.log(editor.getJSON())
  };

  useEffect(() => {
    if (!editor) return

    if (note?.image) {
      console.log("Image detected:", note?.image);
      editor.chain().setImage({ src: note?.image }).run();
      // Do something with the image here
    } else if (note?.text) {
      console.log("Text detected:", note?.text);
      // Do something with the text here
      editor.commands.insertContent(`\n${note?.text}`);

    }
    // editor.commands.setContent(highlights.content.text)


  }, [note])
  

  
  return (
    <div className=" ">
      <Editor
        className=""
        defaultValue={content}
        disableLocalStorage={false}
        onUpdate={handleContentChange}
      />
    </div>
  )
}


