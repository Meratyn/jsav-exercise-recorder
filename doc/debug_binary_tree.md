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
parent should be hidden before calling minheap.layout().

JSAV documentation? Binary tree removal exercise?

# Bug 2

Description: When the second node is added to the binary heap, JSAV shows
an empty right node for a fraction of a second.
