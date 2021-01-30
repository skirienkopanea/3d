Simple 3D model viewer based on https://github.com/mrdoob/three.js/ 3D library suited for Sketchfab GLTF files.
<ul>
  <li>The viewer is responsive to screen size changes (window fit).</li>
  <li>Free sample models made with Blender by me.</li>
  <li>Use left/right arrows to navigate through the models.</li>
  <li>Hitting spacebar will play elevator music and toggle model rotation in the z-axis (free copyright music: Local Forecast - Slower, by Kevin Macleod https://incompetech.com/music/royalty-free/) just like if they were at an expo in a turntable...</li>
  <li>Use Up/Down arrows to control the volume, press 'm' to mute.</li>
  <li>You can disable the automatic model rotation by pressing the spacebar.</li>
  <li>The automatic model rotation is always disabled while clicking (using orbit controls)</li>
  <li>Use the mousewheel to zoom in/out</li>
  <li>You can grab (click and hold) and move the mouse to rotate the models</li>
  <li>Mouse sensitivity can be adjusted by pressing '-'/'+'.
  <li>Live implementation at https://hereinmygarage.herokuapp.com (shows a random model)</li>
  <li>The viewer supports GLTF 3D files. You can find plenty of free GTLF models at sketchfab.com</li>
  <li>If you download a gtlf model from sketchab, you can add such model easily to this viewer just by simply dropping the model contents in a custom folder in public/models/&lt;your model folder&gt;</li>
  <li>You can access the model view from any url that has model paramater equal to the model folder name, i.e http://localhost:3000/?model=toy for 'toy' folder</li>
  <li>All models in public/models directory will be shown in asccending alphabetic order</li>
</ul>
Screenshot:

![Preview](screenshot.jpg)

You can implement this 3D model viewer on your local machine. Install Node.js https://nodejs.org/en/ and git https://git-scm.com/. Then execute the following on the terminal:

```console
git clone https://github.com/skirienkopanea/3d
cd 3d
npm install
npm start
```

You can now access the 3D model viewer at http://localhost:3000/

Improvement points:
<ul>
  <li>Improve lighting</li>
</ul>
