import { processRawHtml, invertTree, mergeTreesByUid } from "../helpers";

test("properly formats code blocks", () => {
    // Raw Input
    //#region 
    const testRawHtml = `<div class="CodeMirror-code" role="presentation" style=""><div class="" style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">1</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-keyword">import</span> <span class="cm-variable">math</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">2</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-keyword">import</span> <span class="cm-variable">random</span> <span class="cm-keyword">as</span> <span class="cm-variable">rnd</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">3</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">4</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-variable">n</span> <span class="cm-operator">=</span> <span class="cm-number">100</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">5</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-variable">counter</span> <span class="cm-operator">=</span> <span class="cm-number">0</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">6</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">7</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-keyword">for</span> <span class="cm-variable">i</span> <span class="cm-keyword">in</span> <span class="cm-builtin">range</span>(<span class="cm-variable">n</span>):</span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">8</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-comment"># Sample the length of the fragment between 1 and 10</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">9</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-variable">d</span> <span class="cm-operator">=</span> <span class="cm-variable">rnd</span>.<span class="cm-property">random</span>()<span class="cm-operator">*</span><span class="cm-number">9</span><span class="cm-operator">+</span><span class="cm-number">1</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">10</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">11</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-comment"># Pick a random declination</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">12</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-variable">alpha</span> <span class="cm-operator">=</span> <span class="cm-variable">rnd</span>.<span class="cm-property">random</span>()<span class="cm-operator">*</span><span class="cm-variable">math</span>.<span class="cm-property">pi</span><span class="cm-operator">/</span><span class="cm-number">2</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">13</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">14</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-comment"># Calculate the effective radius of the fragment</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">15</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-variable">r_eff</span> <span class="cm-operator">=</span> <span class="cm-variable">d</span><span class="cm-operator">*</span><span class="cm-variable">math</span>.<span class="cm-property">sin</span>(<span class="cm-variable">alpha</span>)<span class="cm-operator">/</span><span class="cm-number">2</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">16</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">17</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-comment"># Pick a random right ascension</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">18</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-variable">beta</span> <span class="cm-operator">=</span> <span class="cm-variable">rnd</span>.<span class="cm-property">random</span>()<span class="cm-operator">*</span><span class="cm-number">2</span><span class="cm-operator">*</span><span class="cm-variable">math</span>.<span class="cm-property">pi</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">19</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">20</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-comment"># Pick a random center of the fragment within the rectangular chain link 2x2 cm</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">21</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-variable">P</span> <span class="cm-operator">=</span> (<span class="cm-variable">rnd</span>.<span class="cm-property">random</span>()<span class="cm-operator">*</span><span class="cm-number">2</span>, <span class="cm-variable">rnd</span>.<span class="cm-property">random</span>()<span class="cm-operator">*</span><span class="cm-number">2</span>)</span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">22</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;" class="CodeMirror-activeline"><div class="CodeMirror-activeline-background CodeMirror-linebackground"></div><div class="CodeMirror-gutter-background CodeMirror-activeline-gutter" style="left: -30px; width: 30px;"></div><div class="CodeMirror-gutter-wrapper CodeMirror-activeline-gutter" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">23</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-comment"># Calculate the position of the farEnd of the fragment</span></span></pre></div><div style="position: relative;" class=""><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">24</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-variable">farEnd</span> <span class="cm-operator">=</span> (<span class="cm-variable">P</span>[<span class="cm-number">0</span>]<span class="cm-operator">+</span><span class="cm-variable">r_eff</span><span class="cm-operator">*</span><span class="cm-variable">math</span>.<span class="cm-property">cos</span>(<span class="cm-variable">beta</span>), <span class="cm-variable">P</span>[<span class="cm-number">1</span>]<span class="cm-operator">+</span><span class="cm-variable">r_eff</span><span class="cm-operator">*</span><span class="cm-variable">math</span>.<span class="cm-property">sin</span>(<span class="cm-variable">beta</span>))</span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">25</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div class="" style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">26</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-comment"># If the far end is withn the chain link, add 1 to a counter</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">27</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">    <span class="cm-keyword">if</span> <span class="cm-variable">farEnd</span>[<span class="cm-number">0</span>] <span class="cm-operator">&lt;</span> <span class="cm-number">2</span> <span class="cm-keyword">and</span> <span class="cm-variable">farEnd</span>[<span class="cm-number">0</span>] <span class="cm-operator">&gt;</span> <span class="cm-number">0</span> <span class="cm-keyword">and</span> <span class="cm-variable">farEnd</span>[<span class="cm-number">1</span>] <span class="cm-operator">&lt;</span> <span class="cm-number">2</span> <span class="cm-keyword">and</span> <span class="cm-variable">farEnd</span>[<span class="cm-number">1</span>] <span class="cm-operator">&gt;</span> <span class="cm-number">0</span>:</span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">28</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">        <span class="cm-variable">counter</span> <span class="cm-operator">+=</span> <span class="cm-number">1</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">29</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="">​</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">30</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-comment"># Print the final number of fragments that go through</span></span></pre></div><div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">31</div></div><pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-builtin">print</span>(<span class="cm-variable">counter</span>)</span></pre></div></div>`
    //#endregion

    // Output
    //#region 
    const testOutput = `import math
import random as rnd

n = 100
counter = 0

for i in range(n):
    # Sample the length of the fragment between 1 and 10
    d = rnd.random()*9+1

    # Pick a random declination
    alpha = rnd.random()*math.pi/2

    # Calculate the effective radius of the fragment
    r_eff = d*math.sin(alpha)/2

    # Pick a random right ascension
    beta = rnd.random()*2*math.pi

    # Pick a random center of the fragment within the rectangular chain link 2x2 cm
    P = (rnd.random()*2, rnd.random()*2)

    # Calculate the position of the farEnd of the fragment
    farEnd = (P[0]+r_eff*math.cos(beta), P[1]+r_eff*math.sin(beta))

    # If the far end is withn the chain link, add 1 to a counter
    if farEnd[0] < 2 and farEnd[0] > 0 and farEnd[1] < 2 and farEnd[1] > 0:
        counter += 1

# Print the final number of fragments that go through
print(counter)`.replace(/\u200B/g, "")

    //#endregion
    expect(processRawHtml(testRawHtml)).toMatch(testOutput)
})

/* test("proper tree parsing", () => {
    var testTree1NotInverted = {
        uid: "C",
        order: 0,
        _children: [{
            uid: "B",
            order: 0,
            _children: [{
                uid: "A",
                order: 3,
                _children: ["uglamugla"]
            }]
        }]
    };

    var testTree1Inverted = {
        uid: "A",
        order: 3,
        _children: ["uglamugla"],
        children: [{
            uid: "B",
            order: 0,
            _children: [{
                uid: "A",
                order: 3,
                _children: ["uglamugla"]
            }],
            children: [{
                uid: "C",
                order: 0,
                _children: [{
                    uid: "B",
                    order: 0,
                    _children: [{
                        uid: "A",
                        order: 3,
                        _children: ["uglamugla"]
                    }]
                }]
            }]
        }]
    }
    console.log(invertTree(testTree1NotInverted, "A"))
    expect(invertTree(testTree1NotInverted, "A")).toEqual(testTree1Inverted)

    var testTree2 = {
        uid: "A",
        order: 3,
        children: [{
            uid: "D",
            order: 1
        }]
    }

    var testTree = {
        uid: "A",
        order: 3,
        _children: ["uglamugla"],
        children: [{
            uid: "B",
            order: 0,
            _children: [{
                uid: "A",
                order: 3,
                _children: ["uglamugla"]
            }],
            children: [{
                uid: "C",
                order: 0,
                _children: [{
                    uid: "B",
                    order: 0,
                    _children: [{
                        uid: "A",
                        order: 3,
                        _children: ["uglamugla"]
                    }]
                }]
            }]
        },
        {
            uid: "D",
            order: 1
        }]
    }
    expect(mergeTreesByUid([testTree1Inverted, testTree2])).toEqual(testTree)
}); */