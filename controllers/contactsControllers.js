// import contactsServices from "../services/contactsServices.js";
import mongoose from "mongoose";
import Contact from "../models/contacts.js"
import { createContactSchema, updateContactSchema } from "../schemas/contactSchemas.js";


export const getAllContacts = (req, res) => {
    Contact.find()
        .then((contacts) => res.status(200).json(contacts))
        .catch(error => {
            console.error("error:", error);
        });
    
};



export const getOneContact = (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({message: "Bad request"})
}
    Contact.findById(id)
        .then(contact => {
            if (contact) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch(error => {
            console.error("error:", error);
        });
};
 


export const deleteContact = (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Bad request" })
    }

    Contact.findByIdAndDelete(id)
        .then(delContact => {
            if (delContact) {
                res.status(200).json("Contact deleted");
            } else {
                res.status(404).json({ message: "Not found"});
            }
        })
        .catch(error => {
            console.error("error:", error);
        });
};

export const createContact = (req, res) => {
    const { error, value } = createContactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({message: "Bad Request"})
    }
    const { name, email, phone } = value;

    Contact.create(name, email, phone)
        .then(newContact => {
            res.status(201).json(newContact);
        })
        .catch(error => {
           console.error("error:", error);
        });
};

export const updateContact = (req, res) => {
    const id = req.params.id;
    const updatedData = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Bad request" });
    }

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({message: "Body must have at least one field"})
    } 
    const { error } = updateContactSchema.validate(updatedData)
    if (error) {
        return res.status(400).json({message: "Bad request"})
    }
    Contact.findByIdAndUpdate(id, updatedData, {new: true})
        .then((contact) => {
            if (contact) {
            res.status(200).json(contact)
            } else {
            res.status(404).json({message: "Not found"})
        }
        })
        .catch((error) => {
        console.error("error:", error)
    })
};


export const updateStatusContact = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Bad request" });
    }
    
    Contact.findById(id)
        .then((contact) => {
            if (!contact) {
            return res.status(404).json({message: "Not found"})
            }
            return Contact.findByIdAndUpdate(id, req.body, {new: true})
        })
        .then((updetedContact) => {
            if (!updetedContact) {
                return res.status(404).json({message: "Not found"})
            }
        })
    .catch((error) => {
        console.error("error:", error)
    })
}