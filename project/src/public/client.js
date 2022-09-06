const opportunityCameraList = [
  "Front Hazard Avoidance Camera",
  "Rear Hazard Avoidance Camera",
  "Navigation Camera",
  "Panoramic Camera",
  "Miniature Thermal Emission Spectrometer (Mini-TES)",
];

const curiosityCameraList = [
  "Front Hazard Avoidance Camera",
  "Rear Hazard Avoidance Camera",
  "Navigation Camera",
  "Mast Camera",
  "Chemistry and Camera Complex",
  "Mars Hand Lens Imager",
  "Mars Descent Imager",
];

let store = Immutable.Map({
  apod: "",
  photosArr: Immutable.List([]),
  firstLoad: true,
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
  cameras: Immutable.Map({
    Curiosity: curiosityCameraList,
    Opportunity: opportunityCameraList,
    Spirit: opportunityCameraList, // Spirit has the same cameras as Opportunity
  }),
});

const root = document.getElementById("root");
const controlPanel = document.getElementById("controlPanel");

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
};

const render = (root, store) => {
  root.innerHTML = App(store);
};

const generateInfoTable = (store) => {
  const table = document.getElementById("table");
  const { rover, camera, img_src } = store.get("photosArr").get(0);
  const tableHTML = `
    <tr>
      <td>Rover</td>
      <td>${rover.name}</td>
    </tr>
    <tr>
      <td>Camera</td>
      <td>${camera.full_name}</td>
    </tr>
    <tr>
      <td>Launch Date</td>
      <td>${rover.launch_date}</td>
    </tr>
    <tr>
      <td>Landing Date</td>
      <td>${rover.landing_date}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>${rover.status}</td>
    </tr>
    <tr>
      <td>Most Recently Available Photo</td>
      <td><a target=”_blank” href="${img_src}">link</a></td>
    </tr>
  `;
  table.style.display = "flex";
  table.innerHTML = tableHTML;
};

const getControlPanel = () => {
  return `            
          <form id="form"> 
            <div class="form-group">
              <label>Rover</label>
              <select id="rover" name="rover" class="form-select form-select-style">
                    ${store
                      .get("rovers")
                      .toArray()
                      .map((rover) => `<option>${rover}</option>`)
                      .join("")}
              </select> 
            </div>

            <div class="form-group">
              <label>Camera</label>
              <select id="camera" name="camera" class="form-select form-select-style">
                    ${store
                      .get("cameras")
                      .get(store.get("rovers").get(0))
                      .map((rover) => `<option>${rover}</option>`)
                      .join("")}
              </select>
            </div>
            <button type="submit">Submit</button> 
          </form>
        `;
};

// create content
const App = (state) => {
  if (state.get("photosArr").toArray().length != 0) generateInfoTable(store);
  return `
    ${
      state.get("photosArr").toArray().length == 0
        ? displayBlank()
        : displayPhotos(state.get("photosArr").toArray())
    }
  `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  controlPanel.innerHTML = getControlPanel();
  render(root, store);

  const roverSelect = document.getElementById("rover");
  const cameraSelect = document.getElementById("camera");
  const form = document.getElementById("form");

  roverSelect.addEventListener("change", () => {
    cameraSelect.innerHTML = store
      .get("cameras")
      .get(roverSelect.value)
      .map((camera) => `<option>${camera}</option>`);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    getRoverPhoto(roverSelect.value, cameraSelect.value);
  });
});

const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.image && apod.image.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.image.url}">here</a></p>
            <p>${apod.image.title}</p>
            <p>${apod.image.explanation}</p>
        `;
  } else if (apod.image && apod.image.media_type === "image") {
    return `
            <img src="${apod.image.url}" />
            <div>
              <h1 class="header">Astronomy Picture of the Day</h1>
              <p>${apod.image.explanation}</p>
            </div>
        `;
  } else {
    return `<h1>Loading...</h1>`;
  }
};

const displayBlank = () => {
  if (store.get("firstLoad")) {
    return ImageOfTheDay(store.get("apod"));
  } else {
    const table = document.getElementById("table");
    table.style.display = "none";
    return "<h1>Oops, no photo was found for this choice.</h1>";
  }
};

const displayPhotos = (photosArr) => {
  return photosArr
    .map((photo) => `<img src="${photo.img_src}"></img>`)
    .join("");
};

const getImageOfTheDay = () => {
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
};

const getCameraAbbrev = (camera) => {
  const lookup = Immutable.Map({
    "Front Hazard Avoidance Camera": "FHAZ",
    "Rear Hazard Avoidance Camera": "RHAZ",
    "Mast Camera": "MAST",
    "Chemistry and Camera Complex": "CHEMCAM",
    "Mars Hand Lens Imager": "MAHLI",
    "Mars Descent Imager": "MARDI",
    "Navigation Camera": "NAVCAM",
    "Panoramic Camera": "PANCAM",
    "Miniature Thermal Emission Spectrometer (Mini-TES)": "MINITES",
  });
  return lookup.get(camera);
};

const getRoverPhoto = (rover, camera) => {
  fetch(`http://localhost:3000/mrp/${rover}/${getCameraAbbrev(camera)}`)
    .then((res) => res.json())
    .then((photos) => {
      const photosArr = Immutable.List(photos.image.photos);
      updateStore(store, Immutable.Map({ photosArr, firstLoad: false }));
    });
};
