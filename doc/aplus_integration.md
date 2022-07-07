# Integration of the exercise recorder into DSA Y course

This document discusses how to integrate the JSAV Exercise Recorder into the
Aalto University course CS-A1143 Data Structures and Algorithms Y ("DSA Y").

Assumptions:
- JSAV Exercise Recorder is cloned at `<some_dir>/jsav-exercise-recorder`
- JSAV Exercise Player is cloned at   `<some_dir>/jsav-exercise-player`
- DSA Y course is cloned at           `<some_dir>/traky`

Clone those, if you have not done that yet.
Branch `jaal` is the development branch for JAAL-DSA-Y integration.

```
git clone -b jaal git@version.aalto.fi:course/traky.git
cd traky/exercises/jsav/jaal/
./compile-jaal.sh
```

Then, in another terminal, go to `<some_dir>/traky`. As usual, compile the
course and run A+ locally.
```
./docker-compile.sh 1143
./docker-up.sh
```

The dijkstra's algorithm exercise should now be available in the course
material at [11. Graphs (week 48) 11.5 Shortest-Paths Spanning Tree](http://localhost:8000/def/current/verkot/lyhimman_polun_virittava_puu/)

For more information, see the file `exercises/jsav/jaal/README.md` in the
source code of [Data Structures and Algorithms
Y](https://version.aalto.fi/gitlab/course/traky).
