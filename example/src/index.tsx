import { createRoot } from "react-dom/client";
import "../../src/style/global.css"
import App1  from "./App1";

// biome-ignore lint/style/noNonNullAssertion: Root element must be there
const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App1 />);
