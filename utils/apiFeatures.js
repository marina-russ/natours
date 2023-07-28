class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryString = JSON.stringify(this.queryString);
    // Below is regex to replace gte, gt, lte, lt with $gte, $gt, $lte, $lt for MongoDB
    // .replace() accepts a callback which returns the new, updated string for replacing
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // __v is an internal field used by MongoDB, minus sign excludes it
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const pageResults = this.queryString.page * 1 || 1;
    const limitResults = this.queryString.limit * 1 || 50;
    const skipResults = (pageResults - 1) * limitResults;

    this.query = this.query.skip(skipResults).limit(limitResults);

    return this;
  }
}
module.exports = APIFeatures;
