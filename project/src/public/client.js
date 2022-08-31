let store = {
  user: { name: "Student" },
  apod: "",
  photosArr: [],
  firstLoad: true,
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  cameras: {
    Curiosity: [
      "Front Hazard Avoidance Camera",
      "Rear Hazard Avoidance Camera",
      "Mast Camera",
      "Chemistry and Camera Complex",
      "Mars Hand Lens Imager",
      "Mars Descent Imager",
      "Navigation Camera",
    ],
    Opportunity: [
      "Front Hazard Avoidance Camera",
      "Rear Hazard Avoidance Camera",
      "Navigation Camera",
      "Panoramic Camera",
      "Miniature Thermal Emission Spectrometer (Mini-TES)",
    ],
    Spirit: [
      "Front Hazard Avoidance Camera",
      "Rear Hazard Avoidance Camera",
      "Navigation Camera",
      "Panoramic Camera",
      "Miniature Thermal Emission Spectrometer (Mini-TES)",
    ],
  },
};

// add our markup to the page
const root = document.getElementById("root");
const controlPanel = document.getElementById("controlPanel");

const updateStore = (store, newState) => {
  console.log("new state is ");
  console.log(newState);
  store = Object.assign(store, newState);
  console.log("store is ");
  console.log(store);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
  console.log(" root html ");
  console.log(root.innerHTML);
};

const getControlPanel = () => {
  return `            
          <form id="form" > 
            <label>Rover</label>
            <select id="rover" name="rover" class="form-select form-select-style">
              ${store.rovers
                .map((rover) => `<option>${rover}</option>`)
                .join("")}
            </select> 
            <label>Camera</label>
            <select id="camera" name="camera" class="form-select form-select-style">
              ${store.cameras[store.rovers[0]]
                .map((rover) => `<option>${rover}</option>`)
                .join("")}
            </select>
            <button type="submit">Submit</button> 
          </form>
        `;
};

// create content
const App = (state) => {
  // let { rovers, apod } = state;
  console.log("app state");
  console.log(state);
  console.log("app store");
  console.log(store);
  return `
    ${
      state.photosArr.length == 0
        ? displayBlank()
        : displayPhotos(state.photosArr)
    }
  `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  controlPanel.innerHTML = getControlPanel();
  render(root, store);

  let roverSelect = document.getElementById("rover");
  let cameraSelect = document.getElementById("camera");
  let form = document.getElementById("form");

  roverSelect.addEventListener("change", () => {
    cameraSelect.innerHTML = store.cameras[roverSelect.value].map(
      (camera) => `<option>${camera}</option>`
    );
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("the form has been submitted");
    getRoverPhoto(roverSelect.value, cameraSelect.value);
    console.log("submit photoArr is ");
    console.log(store.photosArr);
  });
});

const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  if (!apod || apod.date === today.getDate()) {
    console.log(" apod.image   ", store);
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.image.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <h1>Astronomy Picture of the Day</h1>
            <img src="${apod.image.url}" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

const displayBlank = () => {
  if (store.firstLoad) {
    return ImageOfTheDay(store.apod);
  } else {
    return "<h1>Oops, no photo was found for this choice.</h1>";
  }
};

const displayPhotos = (photosArr) => {
  // let galleryElement = document.getElementById("gallery");
  // let imgElem = document.createElement("img");
  let displayHTML = "";
  for (const photo of photosArr) {
    // imgElem.setAttribute("class", "column");
    // imgElem.setAttribute("src", photo.img_src);
    // galleryElement.appendChild(imgElem);
    displayHTML += `<img src="${photo.img_src}" class="column"></img>`;
  }

  return displayHTML;
};

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
};

const getCameraAbbrev = (camera) => {
  let lookup = {
    "Front Hazard Avoidance Camera": "FHAZ",
    "Rear Hazard Avoidance Camera": "RHAZ",
    "Mast Camera": "MAST",
    "Chemistry and Camera Complex": "CHEMCAM",
    "Mars Hand Lens Imager": "MAHLI",
    "Mars Descent Imager": "MARDI",
    "Navigation Camera": "NAVCAM",
    "Panoramic Camera": "PANCAM",
    "Miniature Thermal Emission Spectrometer (Mini-TES)": "MINITES",
  };
  return lookup[camera];
};

const getRoverPhoto = (rover, camera) => {
  console.log(
    "fetch url ",
    `http://localhost:3000/mrp/${rover}/${getCameraAbbrev(camera)}`
  );
  fetch(`http://localhost:3000/mrp/${rover}/${getCameraAbbrev(camera)}`)
    .then((res) => res.json())
    .then((photos) => {
      console.log("photos ", photos.image.photos);
      let photosArr = photos.image.photos;
      updateStore(store, { photosArr, firstLoad: false });
    });
};
