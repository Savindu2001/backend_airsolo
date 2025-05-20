const { PaymentCard } = require('../models');

const { encrypt, decrypt } = require('../utils/encryptDecrypt');



//Add Cards
exports.createCard = async (req, res) => {
    try {
        const {
            cardNumber,
            user_id,
            cvv,
            exp_date,
            card_type,
            nickname
        } = req.body;

        // Validate Fields
        // if(!cardNumber || !cvv || !exp_date || !nick_name){
        //     return res.status(400).json({message: 'Missing Required Fields'});
        // }

        // Confirm the values are present
          console.log("Card Number:", cardNumber);
          console.log("CVV:", cvv);

        // hash the card details
        const hashedCardNum = encrypt(cardNumber);
        const hashedcvv = encrypt(cvv);

        //create card
        const paymentCards = await PaymentCard.create({
            cardNumber: hashedCardNum,
            cvv: hashedcvv,
            exp_date,
            nickname,
            card_type,
            user_id,
        });

        return res.status(200).json({message: 'Card Added Sucessfully!', paymentCards});
        
    } catch (error) {
        console.error('Error adding Card:', error);
        return res.status(500).json({message: 'Failed to add Card', error: error.message});
    }
};

exports.getCardDetails = async (req, res) => {
    try {
        const cardDetails = await PaymentCard.findAll();
        return res.status(200).json(cardDetails);
    } catch (error) {
        console.error('Error retriveving Card details:', error);
        return res.status(500).json({message: 'An error occurred while retrieving card details', error: error.message});
    }
};


exports.updateCardDetails = async (req, res) => {
    try {
        const cardDetails = await PaymentCard.findByPk(req.params.id);
        if(!cardDetails){
            return res.status(404).json({ message: 'card details not found' });
        }
        await cardDetails.update(req.body);
        return res.status(200).json({message: 'Card updated successfully',cardDetails});
    } catch (error) {
        console.error('Error retriveving Card details:', error);
        return res.status(400).json({error: error.message});
    }
};


exports.deleteCardDetails = async (req, res) => {
    try {
        const cardDetails = await PaymentCard.findByPk(req.params.id);
        if(!cardDetails){
            return res.status(404).json({ message: 'card details not found' });
        }
        await cardDetails.destroy();
        return res.status(200).json({message: 'Card Deleted successfully',cardDetails});
    } catch (error) {
        console.error('Error retriveving Card details:', error);
        return res.status(400).json({error: error.message});
    }
};


exports.getCardDetailsById = async (req, res) => {
  try {
    // Retrieve the cards from the database
    const cards = await PaymentCard.findAll({
      where: { user_id: req.params.id },
      raw: true
    });

    if (!cards.length) {
      return res.status(404).json({
        success: false,
        message: 'No cards found for this user.'
      });
    }

    // Decrypt card details (card number and CVV)
    const decryptedCards = cards.map(card => ({
      ...card,
      cardNumber: decrypt(card.cardNumber),
      cvv: decrypt(card.cvv)
    }));

    // Return the decrypted card details
    return res.status(200).json({
      success: true,
      data: decryptedCards
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving cards',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};









