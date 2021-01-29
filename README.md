Simple 3D model viewer based on https://github.com/mrdoob/three.js/ 3D library
<ul>
  
  <li>Models made by me, backgound music not...</li>
  <li>Use left/right arrows to navigate through the models.</li>
  <li>Live implementation at https://hereinmygarage.herokuapp.com/?model=truck</li>
  <li>The viewer supports GLTF 3D files. You can find plenty of free GTLF models at sketchfab.com</li>
  <li>To add models simply drop the model contents in a custom folder in public/models/&lt;your model folder&gt;</li>
  <li>You can access the model view from any page and with the model paramater equal to the model folder name, such as http://localhost:3000/?model=toy</li>
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
