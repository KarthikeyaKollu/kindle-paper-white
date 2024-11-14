import { useState, useEffect, useCallback, useRef } from "react";
import {
    AreaHighlight,
    Highlight,
    PdfHighlighter,
    PdfLoader,
    Popup,
    Tip,
    InteractivePdfViewer
} from "./react-pdf-highlighter";


import type {
    Content,
    IHighlight,
    NewHighlight,
    ScaledPosition,
} from "./react-pdf-highlighter";

import { Spinner } from "./Spinner";

import { testHighlights as _testHighlights } from "./test-highlights";




// import "./style/App.css";
// import "../../dist/style.css";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

const resetHash = () => {
    document.location.hash = "";
};

const HighlightPopup = ({
    comment,
}: {
    comment: { text: string; emoji: string };
}) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480";

const searchParams = new URLSearchParams(document.location.search);
const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL //"https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf" //;



const App1 = () => {


    const [url, setUrl] = useState(initialUrl);
    const [highlights, setHighlights] = useState<Array<IHighlight>>(
        testHighlights[initialUrl] ? [...testHighlights[initialUrl]] : [],
    );
    const [note, setNote] = useState<Content | null>(null)


    // const setNotes = (note: Note) => {
    //     // console.log(note)
    //     // setNote({ content: note.content, type: note.type });
    // }


    // testHighlights[initialUrl] ? [...testHighlights[initialUrl]] :
    const resetHighlights = () => {
        setHighlights([]);
    };

    const toggleDocument = () => {
        const newUrl =
            url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
        setUrl(newUrl);
        setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : []);
    };

    const scrollViewerTo = useRef((highlight: IHighlight) => {
        // if (!highlight) return; // Ensure the highlight is valid
    
        // // Get the element corresponding to this highlight by its id or any other property.
        // const highlightElement = document.getElementById(highlight.id);
        
        // if (highlightElement) {
        //     // Scroll into view with optional settings to ensure it is fully visible
        //     highlightElement.scrollIntoView({
        //         behavior: "smooth", // Smooth scrolling
        //         block: "center",    // Align the element in the center of the viewport
        //         inline: "nearest",  // Ensure the element is fully visible in the scrollable container
        //     });
        // } else {
        //     console.warn(`Highlight with ID ${highlight.id} not found`);
        // }
    });
    

    const scrollToHighlightFromHash = useCallback(() => {
        const highlight = getHighlightById(parseIdFromHash());
        if (highlight) {
            scrollViewerTo.current(highlight);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("hashchange", scrollToHighlightFromHash, false);
        return () => {
            window.removeEventListener(
                "hashchange",
                scrollToHighlightFromHash,
                false,
            );
        };
    }, [scrollToHighlightFromHash]);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
      
        // Cleanup to reset when the component unmounts
        return () => {
          document.body.style.overflow = '';
        };
      }, []);

    const getHighlightById = (id: string) => {
        return highlights.find((highlight) => highlight.id === id);
    };

    const addHighlight = (highlight: NewHighlight) => {
        console.log("Saving highlight", highlight);
        setHighlights((prevHighlights) => [
            { ...highlight, id: getNextId() },
            ...prevHighlights,
        ]);
    };

    const updateHighlight = (
        highlightId: string,
        position: Partial<ScaledPosition>,
        content: Partial<Content>,
    ) => {
        console.log("Updating highlight", highlightId, position, content);
        setHighlights((prevHighlights) =>
            prevHighlights.map((h) => {
                const {
                    id,
                    position: originalPosition,
                    content: originalContent,
                    ...rest
                } = h;
                return id === highlightId
                    ? {
                        id,
                        position: { ...originalPosition, ...position },
                        content: { ...originalContent, ...content },
                        ...rest,
                    }
                    : h;
            }),
        );
    };
    return (
        <div className="h-screen w-screen overflow-hidden">
            <InteractivePdfViewer 
            highlights={highlights}
            note={note}
            resetHighlights={resetHighlights}
             toggleDocument={toggleDocument}>
                <PdfLoader url={url} beforeLoad={<Spinner />}>
                    {(pdfDocument) => <div>
                        (
                        <PdfHighlighter
                            pdfDocument={pdfDocument}
                            enableAreaSelection={(event) => event.altKey}
                            onScrollChange={resetHash}
                            scrollRef={(scrollTo) => {
                                scrollViewerTo.current = scrollTo;
                                scrollToHighlightFromHash();
                            }}
                            onSelectionFinished={(
                                position,
                                content,
                                hideTipAndSelection,
                                transformSelection,
                            ) => (
                                <Tip
                                    setNotes={()=>{
                                        setNote(content)
                                        hideTipAndSelection();
                                    }}
                                    onOpen={transformSelection}
                                    onConfirm={(comment) => {
                                        addHighlight({ content, position, comment });
                                        hideTipAndSelection();
                                        
                                    }}
                                    

                                />

                            )}
                            highlightTransform={(
                                highlight,
                                index,
                                setTip,
                                hideTip,
                                viewportToScaled,
                                screenshot,
                                isScrolledTo,
                            ) => {
                                const isTextHighlight = !highlight.content?.image;

                                const component = isTextHighlight ? (
                                    <Highlight
                                        isScrolledTo={isScrolledTo}
                                        position={highlight.position}
                                        comment={highlight.comment}
                                        id={highlight.id}
                                    />
                                ) : (
                                    <AreaHighlight
                                        isScrolledTo={isScrolledTo}
                                        highlight={highlight}
                                        onChange={(boundingRect) => {
                                            updateHighlight(
                                                highlight.id,
                                                { boundingRect: viewportToScaled(boundingRect) },
                                                { image: screenshot(boundingRect) },
                                            );
                                        }}
                                        id={highlight.id}
                                    />
                                );

                                return (
                                    <Popup
                                        popupContent={<HighlightPopup {...highlight} />}
                                        onMouseOver={(popupContent) =>
                                            setTip(highlight, (highlight) => popupContent)
                                        }
                                        onMouseOut={hideTip}
                                        key={index}
                                    >
                                        {component}
                                    </Popup>
                                );
                            }}
                            highlights={highlights}
                        />
                        )</div>}
                </PdfLoader>
            </InteractivePdfViewer>
        </div>
    )
}

export default App1