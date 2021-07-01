const {Interpreter} = require("@alex.garcia/unofficial-observablehq-compiler")
import {Inspector, Runtime} from "@observablehq/runtime"

const observableNodeClass = "execroot"

function createRoot(parent: Element) {
    const prevRoot = parent.querySelector(`.${observableNodeClass}`)
    if (prevRoot) {
        parent.removeChild(prevRoot)
    }

    const root = document.createElement("div")
    // root.id = rootId
    root.className = observableNodeClass

    parent.appendChild(root)
    // parent.insertBefore(root, parent.children[1])
    return root
}

export class CellRunner {
    readonly runtime = new Runtime()
    readonly mainModule = this.runtime.module()

    //todo create a cell obj and store both in it?
    readonly varsForCells = new Map<string, any>()
    readonly observers = new Map<string, any>()

    constructor() {
    }

    async run(code: string, id: string, writeResult: (out: string) => Promise<void>) {
        this.clearVars(id)
        // const parent = document.querySelector(".roam-article > div:first-of-type")
        // root = root || createRoot(parent)

        // root = root || createRoot(parent)

        this.observers.set(id, this.observers.get(id) || this.getObserver(id, writeResult))
        const observer = this.observers.get(id)
        //todo save observer?
        const interpret = new Interpreter({module: this.mainModule, observer})

        this.varsForCells.set(id, await interpret.module(code))
        // return await interpret.cell(code)

    }

    private clearVars(id: string) {
        console.log("Cleaning up vars for block ", id)
        //otherwise we get "x is redefined errors"
        //from https://observablehq.com/d/63585ffc01d6a1af
        this.varsForCells.get(id)?.forEach(vars => {
            for (const v of vars) {
                v.delete()
                if (v._observer._node) {
                    v._observer._node.remove()
                }
            }
        })
        //this seems to break the interactive viewof html element though 🤔
    }

    getObserver(id: string, writeResult: (out: string) => Promise<void>) {
        const parent = document.activeElement
            .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
        //todo search up for parent instead
        // const parent = document.activeElement.parentElement

        const displayElement = createRoot(parent)
        const delegateGenerator = Inspector.into(displayElement)
        return (genInp) => {
            console.log("creating observer for", genInp)
            const delegate = delegateGenerator()
            return ({
                pending() {
                    console.log("pending")
                    delegate.pending()
                },
                rejected(e) {
                    console.log("rejected", e)
                    delegate.rejected(e)
                },
                fulfilled(value: any, name: any) {
                    console.log(value, name)
                    delegate.fulfilled(value, name)

                    //todo run html -> hiccup when relevant
                    writeResult(JSON.stringify(value))
                },
            })
        }
    }
}
