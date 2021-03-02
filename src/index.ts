import { loadPyodide } from "./pyodide";
import { handleKeyPress } from "./keyboard";
import { writeToNextBlock } from "./api";

console.log("Loading pyroam.");

loadPyodide();

document.addEventListener("keydown", handleKeyPress);
