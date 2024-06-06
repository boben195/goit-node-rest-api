import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactSchemas.js";
import validateBody from "../helpers/validateBody.js";

import { auth } from "../middlewares/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", auth, getOneContact);

contactsRouter.delete("/:id", auth, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), auth, createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), auth, updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateFavoriteSchema), auth, updateStatusContact);

export default contactsRouter;