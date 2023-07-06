const Tour = require("./../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {

    // * BUILD QUERY

    // * 1) Advanced Filtering - Using gte, gt, lte, lt
    let queryStr = JSON.stringify(req.query);
    // Below is regex to replace gte, gt, lte, lt with $gte, $gt, $lte, $lt for MongoDB
    // .replace() accepts a callback which returns the new, updated string for replacing
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // * 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    };

    // * 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      // __v is an internal field used by MongoDB, minus sign excludes it
      query = query.select("-__v");
    };

    // * 4) Pagination
    const pageResults = req.query.page * 1 || 1;
    const limitResults = req.query.limit * 1 || 50;
    const skipResults = (pageResults - 1) * limitResults;

    query = query.skip(skipResults).limit(limitResults);

    if (req.query.page) {
      const qtyTours = await Tour.countDocuments();
      if (skipResults >= qtyTours) throw new Error("This page does not exist");
    };

    // * EXECUTE QUERY
    const tours = await query;

    // * SEND RESPONSE
    res.status(200)
      .json({
        status: "success!",
        results: tours.length,
        data: {
          tours
        }
      });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  };
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // .findById is Mongoose shorthand for:
    // Tour.findOne({ _id: req.params.id });

    res.status(200)
      .json({
        status: "success",
        data: {
          tour
        }
      });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  };
};

exports.createTour = async (req, res) => {
  // TODO: check that user is not submitting any malicious code

  try {
    const newTour = await Tour.create(req.body);

    res.status(201)
      .json({
        status: "success",
        data: {
          tour: newTour
        }
      });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!"
    });
  };
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // properties we can set:
      new: true,
      runValidators: true
    });
    res.status(200)
      .json({
        status: "success",
        data: {
          tour
        }
      });
  } catch (err) {
    res.status(404)
      .json({
        status: "fail",
        message: err
      });
  };
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204)
      .json({
        status: "success",
        data: null
      });
  } catch (err) {
    res.status(404)
      .json({
        status: "fail",
        message: err
      });
  };
};