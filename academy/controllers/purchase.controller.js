import PurchaseModel from "../model/Purchase.model.js";
import CourseModel from "../model/course.model.js";
import { getStudentFromKafka } from "../services/kafka.service.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const purchaseCourse = async (req, res) => {
  try {
    const studentId = await getStudentFromKafka(req);
    console.log("Student Id: ", studentId)
    if (!studentId) {
      return res.status(400).json({ message: "Student not found" });
    }

    const { courseId, paymentMethodId } = req.body;

    const course = await CourseModel.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.coursePrice * 100,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      description: `Purchase of course ${course.title}`,
    });

    const purchase = await PurchaseModel.create({
      course: course.title,
      user: studentId,
      amount: course.coursePrice,
    });

    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error("Error purchasing course:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
