let store = {
  user: { name: "Student" },
  apod: "",
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
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
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
          <section>
              ${getRoverPhoto("Curiosity", "fhac")}
          </section>

        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
  let roverSelect = document.getElementById("rover");
  let cameraSelect = document.getElementById("camera");
  roverSelect.addEventListener("change", () => {
    cameraSelect.innerHTML = store.cameras[roverSelect.value].map(
      (camera) => `<option>${camera}</option>`
    );
  });
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

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

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  return data;
};

const getRoverPhoto = (rover, camera) => {
  fetch(`http://localhost:3000/mrp/${rover}/${camera}`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
};
