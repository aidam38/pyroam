import { loadPyodide } from "./pyodide";
import { handleKeyPress } from "./keyboard";

console.log("Loading pyroam.");

loadPyodide();

document.addEventListener("keydown", handleKeyPress);
