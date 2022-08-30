let store = {
  user: { name: "Student" },
  apod: "",
  photosArr: [],
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
  displayPhotos();
};

// create content
const App = (state) => {
  let { rovers, apod } = state;
  return `
        <header></header>
        <main>
          <div>
            <form id="form">
              Rover: <select id="rover">
                ${store.rovers.map((rover) => `<option>${rover}</option>`)}
              </select>
              Cameras: <select id="camera">
                ${store.cameras[store.rovers[0]].map(
                  (rover) => `<option>${rover}</option>`
                )}
              </select>
              <input type="submit" value="Submit"> 
            </form>
          </div>
          <div id="photos">
          </div>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
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
    // displayPhotos();
  });
});

// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  if (!apod || apod.date === today.getDate()) {
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
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

const displayPhotos = () => {
  let displayHTML = "";
  for (const photo of store.photosArr) {
    displayHTML += `<img class='column' src="${photo.img_src}"></img>`;
  }
  let photosElement = document.getElementById("photos");
  console.log(" displayHTML");
  console.log(displayHTML);
  photosElement.innerHTML = displayHTML;
};

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  return data;
};

const getMarsPhotos = () => {};

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
      // console.log("photos ", photos.image.photos);
      let photosArr = photos.image.photos;
      updateStore(store, { photosArr });
    });
};
