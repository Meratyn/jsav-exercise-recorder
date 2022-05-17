# Test bench

This is a local configuration to test a JSAV-based visual algorithm simulation
exercise with JSAV Exercise Recorder in local development.

## How to use

1. In console:

```
./start-server.py
```

This starts a Python-based web server on your machine.

2. Open http://localhost:8000/OpenDSA/AV/Development/ with your web browser.

3. Open developer tools on your browser.
   - Firefox: Press F12

4. Disable cache in developer tools.
   - Firefox: Select the Network tab. Tick the 'Disable Cache' box.

5. Click the link of one of the HTML files in the browser's normal page view.
   Example: DijkstraPE-research.html.

6. The JSAV-based exercise starts now. You can edit the source code on the
   disk with your favorite text editor and then update the page in your
   browser to see the changes.

7. Finally shutdown the server with Ctrl+C.

## Description of files
