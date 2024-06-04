
import mongoose from "mongoose";
import Contact from "../models/contacts.js"



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
    return res.status(400).json({message: "Invalid ID format"})
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
        return res.status(400).json({ message: "Invalid ID format" })
    }

    Contact.findByIdAndDelete(id)
        .then(delContact => {
            if (delContact) {
                res.status(200).json(delContact);
            } else {
                res.status(404).json({ message: "Not found"});
            }
        })
        .catch(error => {
            console.error("error:", error);
        });
};



export const createContact = (req, res) => {
  

    const { name, email, phone, favorite } = req.body;
    const newContact = new Contact({ name, email, phone, favorite });

    newContact.save()
        .then(savedContact => {
            res.status(201).json(savedContact);
        })
        .catch((error) => {
        console.error("error:", error)
    })
};




export const updateContact = (req, res) => {
    const id = req.params.id;
    const updatedData = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({message: "Body must have at least one field"})
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



export const updateStatusContact = (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    Contact.findById(id)
        .then(contact => {
            if (!contact) {
                return res.status(404).json({ message: "Not found" });
            }
            return Contact.findByIdAndUpdate(id, req.body, { new: true });
        })
        .then(updatedContact => {
            if (!updatedContact) {
                return res.status(404).json({ message: "Not found" });
            }
            res.status(200).json(updatedContact);
        })
        .catch((error) => {
        console.error("error:", error)
    })
};