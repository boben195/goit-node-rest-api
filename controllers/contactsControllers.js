import contactsServices from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactSchemas.js";

export const getAllContacts = (req, res) => {
     contactsServices.listContacts().then((contacts) => res.status(200).json(contacts))
    
};



export const getOneContact = (req, res) => {
    const id = req.params.id;

    contactsServices.getContactById(id)
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
    contactsServices.removeContact(id)
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
    contactsServices.addContact(name, email, phone)
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
    contactsServices.updateData(id, updatedData)
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
            return updateStatusContact(id, req.body)
        })
    .catch((error) => {
        console.error("error:", error)
    })
}