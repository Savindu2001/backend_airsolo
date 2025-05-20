const { Information } = require('../models');

// Create new information record
exports.createInformation = async (req, res) => {
  try {
    const {
      name,
      description,
      info_type,
      cityId,
      contact_1,
      contact_2,
    } = req.body;

    // Validate required fields
    if (!name || !info_type || !cityId || !contact_1) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Create the information record
    const information = await Information.create({
      name,
      description,
      info_type,
      cityId,
      contact_1,
      contact_2,
    });

    return res.status(201).json({ message: 'Information created successfully', information });
  } catch (error) {
    console.error('Error creating information:', error);
    return res.status(500).json({ message: 'Failed to create information', error: error.message });
  }
};

// Get all information records
exports.getAllInformation = async (req, res) => {
  try {
    const informationRecords = await Information.findAll();
    return res.status(200).json(informationRecords);
  } catch (error) {
    console.error('Error retrieving information:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving information', error: error.message });
  }
};

// Get a single information record by ID
exports.getInformationById = async (req, res) => {
  try {
    const information = await Information.findByPk(req.params.id);
    if (!information) {
      return res.status(404).json({ message: 'Information not found' });
    }
    res.status(200).json(information);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an information record
exports.updateInformation = async (req, res) => {
  try {
    const information = await Information.findByPk(req.params.id);
    if (!information) {
      return res.status(404).json({ message: 'Information not found' });
    }
    await information.update(req.body);
    res.status(200).json({ message: 'Information updated successfully', information });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an information record
exports.deleteInformation = async (req, res) => {
  try {
    const information = await Information.findByPk(req.params.id);
    if (!information) {
      return res.status(404).json({ message: 'Information not found' });
    }
    await information.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
