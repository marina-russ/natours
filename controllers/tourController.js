const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200)
    .json({
      status: "Success!",
      results: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours
      }
    });
};

exports.getTourByID = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID"
    });
  };

  res.status(200)
    .json({
      status: "success",
      data: {
        tour
      }
    });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  // TODO: check that user is not submitting any malicious code

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201)
        .json({
          status: "success",
          data: {
            tour: newTour
          }
        });
    });
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID"
    });
  };
  // TODO: get tour from JSON, change tour, then save it to the file
  res.status(200)
    .json({
      status: "success",
      data: {
        tour: '<Updated tour here>'
      }
    });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID"
    });
  };
  // TODO: delete tour
  res.status(204)
    .json({
      status: "success",
      data: null
    });
};