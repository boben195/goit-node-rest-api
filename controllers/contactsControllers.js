// import contactsServices from "../services/contactsServices.js";
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
    Contact.findById(id)
        .then(delContact => {
            if (delContact) {
                res.status(200).json(delContact);
            } else {
                res.status(404).json({ message: 'Not found' });
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
    const { name, email, phone } = value
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
    if (Object.keys(updatedData).length === 0) {
        return res
            .status(400)
        .json({message: "Body must have at least one field"})
    } 
    const { error } = updateContactSchema.validate(updatedData)
    if (error) {
        return res.status(400).json({message: error.message})
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
    
    Contact.findById(id)
        .then((contact) => {
            if (!contact) {
            return res.status(404).json({message: "Not found"})
            }
            return Contact.findByIdAndUpdate(id, req.body, {new: true})
        })
    .catch((error) => {
        console.error("error:", error)
    })
}