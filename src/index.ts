import express, { Request, Response } from "express";
import createError from "http-errors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// handle 404 error
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404));
});

app.listen(3000, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:3000`)
);