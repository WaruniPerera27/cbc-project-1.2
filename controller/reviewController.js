import reviewModel from "../models/reviewModel.js"; 


export const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};


export const addReview = async (req, res) => {
  try {
    const review = new reviewModel(req.body);
    await review.save();
    res.json({ message: "Review submitted successfully", review });
  } catch (err) {
    res.status(500).json({ message: "Error adding review" });
  }
};
