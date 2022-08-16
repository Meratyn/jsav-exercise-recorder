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

### Treatment attempt 1

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

### Treatment attempt 2

Treatment: hide the removed node and edge with css before calling layout.

Add line:
DijkstraPE-research-v2.css:1588  lastNode.css({"opacity": "0"});

Results: no effect.

# Bug 2

Description: When the second node is added to the binary heap, JSAV shows
an empty right node for a fraction of a second.

Johanna said that JSAV creates an empty node to compute the layout.l
It seems that the appearance of the empty node is animated, and then it is
set to invisible.

Call stack of anim:
JSAV-min.js:607 anim
JSAV-min.js:4610 show
JSAV-min.js:1845 handleVisibility
JSAV-min.js:4422 init
JSAV-min.js:4709 BinaryTreeNode
JSAV-min.js:4304 newNode
DijkstraPE-research-v2.js:1515

Awful! The glitch cannot be reproduced with stepping.
JSAV seems to run in a loop at JSAV-min.js:497 function timeouter

The animation is running in another event. Functions in the the call stack
initiated by the user's edge click and then click on the add/update dialog
is waiting for the animation to finish.

When setting the animation speed to slowest possible, it can be seen that
adding the second node to the heap appears visually as follows:
1. Left node and its edge starts to appear (increase opacity)
2. Root node moves to the right
3. Right child node appears without edge

Logically, one should find out the code in JSAV where the nodes are created
and animated.
