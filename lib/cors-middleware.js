import Cors from "cors";
import initMiddleware from "./init-middleware";

// Allow all origins for now — restrict in production
export default initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: "*",
  })
);
