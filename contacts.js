const fs = require('fs').promises;
const path = require('path');
const shortid = require('shortid')

const contactsPath = path.resolve('contacts.json')

async function getData() {
    try {
        const result = await fs.readFile('db/contacts.json'); 
        return JSON.parse(result)
    } catch (err) {
        console.log(err.message)
    }
    
    
};

async function writeData(data) {
    const stringifiedData = JSON.stringify(data);
    try {
        await fs.writeFile('db/contacts.json', stringifiedData);
    } catch (err) {
        console.log(err.message)
    }
}


async function listContacts() {
    try {
        const data = await getData();
        console.table(data)
    } catch (err) {
        console.log(err.message)
    }
};

async function getContactById(contactId) {
    try {
        const data = await getData();
        const contact = data.find(({ id }) => id === contactId);
        if (!contact) {
            console.log(`Contact with ID ${contactId} not found`)
            return;
        }
        console.table(contact)
    } catch (err) {
        console.log(err.message)
    }
};

async function addContact(name, email, phone) {
    const newContact = {
            id: shortid.generate(),
            name: name,
            email: email,
            phone: phone,
        };
    try {
        const data = await getData();
        const contact = data.find(contact => contact.email === email);
        if (contact !== undefined) {
            console.table(newContact)    
            console.log(`This contact already exists!`)
            return;
        }
        const upgradData = [...data, newContact];
        writeData(upgradData)
        console.log(`Managed to save a new contact`)
        console.table(newContact)
    } catch (err) {
        console.log(err.message)
        
    }
};

async function removeContact(contactId) {
    try {
        const data = await getData();
        const unremovedContact = data.filter(({ id }) => id !== contactId)
        const deletedContact = data.find(({ id }) => id === contactId)
        const contact = data.find(contact => contact.id === contactId);
        if (contact === undefined) {
            console.log(`Contact with ID ${contactId} not found`)
            return;
        }
        writeData(unremovedContact)
        console.log(`Contact, with ID ${contactId}, has been deleted`)
        console.table(deletedContact)
    } catch (err) {
        console.log(err.message)
    }
    
};

module.exports = { listContacts, getContactById, removeContact, addContact }