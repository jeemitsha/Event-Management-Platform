import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { auth } from "../middleware/auth";
import { AuthRequest } from "../types/express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController";

const router = express.Router();

// Type assertion middleware
const assertUser = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Validation middleware
const eventValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("category")
    .isIn([
      "Conference",
      "Workshop",
      "Seminar",
      "Networking",
      "Social",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("maxAttendees")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maximum attendees must be at least 1"),
  body("image").optional().isURL().withMessage("Image must be a valid URL"),
];

// Helper function to wrap async route handlers
const asyncHandler = (
  fn: (req: AuthRequest, res: Response) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthRequest, res)).catch(next);
  };
};

// Routes
router.get("/", auth, asyncHandler(getEvents));
router.post("/", [auth, ...eventValidation], asyncHandler(createEvent));
router.put("/:id", [auth, ...eventValidation], asyncHandler(updateEvent));
router.delete("/:id", auth, asyncHandler(deleteEvent));
router.post("/:id/join", auth, asyncHandler(joinEvent));
router.post("/:id/leave", auth, asyncHandler(leaveEvent));

export default router;
