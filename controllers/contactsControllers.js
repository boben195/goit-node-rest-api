
import mongoose from "mongoose";
import Contact from "../models/contacts.js"



export const getAllContacts = (req, res) => {

    const { _id: owner } = req.user;

    Contact.find({owner})
        .then((contacts) => res.status(200).json(contacts))
        .catch(error => {
            console.error("error:", error);
        });
    
};



export const getOneContact = (req, res) => {
    const id = req.params.id;
    const { _id: owner } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({message: "Invalid ID format"})
}
    Contact.findOne({_id: id, owner})
        .then(contact => {
            if (!contact || contact.owner.toString() !== req.user._id.toString()) {
                return res.status(404).json({ message: 'Not found' });
            }
            res.status(200).json(contact);
        })
        .catch(error => {
            console.error("error:", error);
        });
};



 


export const deleteContact = (req, res) => {
    const id = req.params.id;
    const { _id: owner } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" })
    }

    Contact.findOneAndDelete({_id: id, owner})
        .then(delContact => {
            if (!delContact || delContact.owner.toString() !== req.user._id.toString()) {
                return res.status(404).json({ message: "Not found" });
            }
            res.status(200).json(delContact);
        })
        .catch(error => {
            console.error("error:", error);
        });
};



export const createContact = (req, res) => {
  

    const { name, email, phone, favorite } = req.body;
    const owner = req.user._id
    const newContact = new Contact({ name, email, phone, favorite, owner });

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
    const { _id: owner } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({message: "Body must have at least one field"})
    } 
    
    Contact.findOneAndUpdate({ _id: id, owner }, updatedData, { new: true })
        .then(contact => {
            if (!contact || contact.owner.toString() !== req.user._id.toString()) {
                return res.status(404).json({ message: "Not found" });
            }
            res.status(200).json(contact);
        })
        .catch((error) => {
        console.error("error:", error)
    })
};



export const updateStatusContact = (req, res) => {
    const id = req.params.id;
    const { _id: owner } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    Contact.findOne({_id: id, owner})
        .then(contact => {
            if (!contact || contact.owner.toString() !== req.user._id.toString()) {
                return res.status(404).json({ message: "Not found" });
            }
            return Contact.findOneAndUpdate(id, req.body, { new: true });
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