# Debug notes on binary heap

# Bug 1

Descrition: binary heap layout breaks when nodes are removed. It seems
that the horizontal spacing of nodes is calculated incorrectly.

How to produce: Add three nodes to the priority queue in the Dijkstra's
algorithm exercise: testbench/OpenDSA/AV/Development/DijkstraPE-research-v2.js.
Then remove one node.

# Bug 2

Description: When the second node is added to the binary heap, JSAV shows
an empty right node for a fraction of a second.
