# Debug notes on binary heap

## Bug 1

Descrition: binary heap layout breaks when nodes are removed. It seems
that the horizontal spacing of nodes is calculated incorrectly.

How to produce:
- Add three nodes to the priority queue in the Dijkstra's
algorithm exercise: testbench/OpenDSA/AV/Development/DijkstraPE-research-v2.js.
- Remove two nodes.

### Locating the cause

minheapDelete causes the root node to move left at horizontally same position
as the child node below it (the same as in the empty tree).

DijkstraPE-research-v2.js:1611 minHeapify calls minheap.layout() at the end,
and that visualizes the bug.

Strangely, there is another call to minheap.layout() in
DijkstraPE-research-v2.js:1498 $("#removeButton").click(function() {}.
During stepping, that call seems to do nothing.
When stepping out of the call stack, jQuery does something. Maybe a callback
to JSAV to do other tricks?

Finally, only the root node is visible, as it should be.

### Investigation attempt 1

Treatment: Comment out call to minheap.layout() in
DijkstraPE-research-v2.js:1611 function minHeapify().

Outcome: the same bug visualizes now in
DijkstraPE-research-v2.js:1498 $("#removeButton").click(function() {}

Discussion: it seems that the removed node and the line leading to it from its
parent should be hidden before calling minheap.layout(). Some code already
does the visual operation for the removed node, but after minheap.layout()
has executed.

JSAV documentation? Binary tree removal exercise?

### Investigating OpenDSA Delete Min heap exercise

This exercise has a reference implementation on how to visualize binary heap
delete correctly with JSAV.

DSA Y repository:
tools/extras/OpenDSA/AV/Binary/heapremovePRO.js:12-25

  $("#decrement").click(function () {
    var heapsize = bh.heapsize() - 1; // decrement by one
    bh.heapsize(heapsize); // set heapsize
    // hide last item and the edge in the tree
    bh.css(heapsize, {"opacity": "0"});
    var edgeToParent = bh._treenodes[heapsize].edgeToParent();
    if (edgeToParent) {
      edgeToParent.css({"opacity": "0"});
    }
    if (swapIndex.value() !== -1) {
      swapIndex.value(-1);
    }
    exercise.gradeableStep();
  });

Indeed, the items are *hidden* with CSS. Moreover, that exercise uses the
OpenDSA implementation of a binary heap:
tools/extras/OpenDSA/DataStructures/binaryheap.js.

The binary heap is created at heapremovePRO.js:61. This call creates both
the array and the binary tree view. However, we don't want to use the OpenDSA
binary heap implementation, because:
(a) the code is not documented
(b) the visualization always includes an array
(c) we don't want to modify OpenDSA code to keep it compatible with the
    main source of OpenDSA AT GitHub.


# Bug 2

Description: When the second node is added to the binary heap, JSAV shows
an empty right node for a fraction of a second.
