# Test bench

This is a local configuration to test a JSAV-based visual algorithm simulation
exercise with JSAV Exercise Recorder in local development.

## How to use

1. Open a UNIX terminal and start the script:

```
./start-server.py
```

This starts a Python-based web server on your machine.

2. In another terminal:

```
./update-recorder.sh
```

This starts a Node.js program [watchify](https://www.npmjs.com/package/watchify)
which will update the JSAV Exercise recorder on the local Python-based web
server. This happens automatically and continuously every time the source code
file of JSAV Exercise Recorder is edited and saved.

3. Open http://localhost:8000/OpenDSA/AV/Development/ with your web browser.

4. Open developer tools on your browser.
   (Firefox: Press F12)

5. Disable cache in developer tools.
   (Firefox: Select the Network tab. Tick the 'Disable Cache' box.)

6. Click the link of one of the HTML files in the browser's normal page view.
   Example: DijkstraPE-research.html.

7. The JSAV-based exercise starts now. You can edit the source code on the
   disk with your favorite text editor and then update the page in your
   browser to see the changes.

8. Finally shutdown the scripts start at steps 1 and 2 with Ctrl+C.

## Description of files

The JSAV-based visual algorithm simulation exercises are bound to the
[OpenDSA electronic textbook](https://opendsa-server.cs.vt.edu/).

- `OpenDSA/AV/Development` contains the actual exercises.
- `OpenDSA/DataStructures` contains implementations for visualizable data
  structures based on JSAV.
- `OpenDSA/JSAV` contains browser-ready JSAV library, including JS libraries
   jquery.transit and raphael.
- `OpenDSA/lib` contains JS libraries common to OpenDSA, and JS libraries
   jQuery and jQuery-UI.