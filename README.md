Simple 3D model viewer based on https://github.com/mrdoob/three.js/ 3D library
<ul>
  <li>The viewer is responsive to screen size changes (fit)</li>
  <li>Models made by me, backgound music not...</li>
  <li>Use left/right arrows to navigate through the models.</li>
  <li>Models rotate around the z-axis. You can disable it by setting model.rotation.z += 0 in garage.js (animate function)</li>
  <li>Live implementation at https://hereinmygarage.herokuapp.com (shows a random model)</li>
  <li>The viewer supports GLTF 3D files. You can find plenty of free GTLF models at sketchfab.com</li>
  <li>If you download a gtlf model from sketchab, you can add such model to this viewer by simply dropping the model contents in a custom folder in public/models/&lt;your model folder&gt;</li>
  <li>You can access the model view from any url that has model paramater equal to the model folder name, i.e http://localhost:3000/?model=toy for 'toy' folder</li>
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
  <li>Add orbit controls</li>
</ul>
