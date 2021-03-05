//@ts-nocheck
import { sleep, addScriptToPage } from "./helpers";

export const loadPyodide = async () => {
  addScriptToPage(
    "pyodide",
    "https://cdn.jsdelivr.net/pyodide/v0.16.1/full/pyodide.js"
  );

  await sleep(2000);

  await languagePluginLoader;

  console.log("pyodide successfully loaded.");

  // setup pyodide environment to run code blocks as needed
  const setup_code = `
import sys, io, traceback
namespace = {}  # use separate namespace to hide run_code, modules, etc.
def run_code(code):
  """run specified code and return stdout and stderr"""
  out = io.StringIO()
  oldout = sys.stdout
  olderr = sys.stderr
  sys.stdout = sys.stderr = out
  try:
      # change next line to exec(code, {}) if you want to clear vars each time
      exec(code, namespace)
  except:
      traceback.print_exc()

  sys.stdout = oldout
  sys.stderr = olderr
  return out.getvalue()
`;
  pyodide.runPython(setup_code);

  await pyodide.loadPackage([
    "numpy",
    "matplotlib",
    "scipy",
  ]);
  console.log("Loaded packages: ");
  console.log(pyodide.loadedPackages);
};

export const runPython = async (code) => {
  if (!code) return;
  pyodide.globals.code_to_run = code;
  var out = await pyodide.runPythonAsync("run_code(code_to_run)");
  return out;
};
