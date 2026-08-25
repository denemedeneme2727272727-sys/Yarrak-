const express = require('express');
const cors = require('cors');
const Iyzipay = require('iyzipay');

const app = express();
app.use(cors());
app.use(express.json());

// iyzico Test Anahtarları
const iyzipay = new Iyzipay({
  apiKey: 'sandbox-RF4srVABpmX4NAkT9L5LWNxTYAQYJ0rg', // iyzico Sandbox API Key
  secretKey: 'sandbox-sBbS5KWuah5z7OrFrApeMk4IK4kFD2t', // iyzico Sandbox Secret Key
  uri: 'https://sandbox-api.iyzipay.com'
});

app.post('/payment-init', (req, res) => {
  const { cart, totalAmount } = req.body;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    price: totalAmount.toString(),
    paidPrice: totalAmount.toString(),
    currency: Iyzipay.CURRENCY.TRY,
    basketId: 'B' + Date.now(),
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: 'https://yarrak-woad.vercel.app/payment-callback',
    enabledInstallments: [1],
    buyer: {
      id: 'BY789',
      name: 'Müşteri',
      surname: 'Müşteri',
      gsmNumber: '+905300000000',
      email: 'email@example.com',
      identityNumber: '11111111111',
      registrationAddress: 'Gaziantep',
      ip: '85.95.255.255',
      city: 'Gaziantep',
      country: 'Turkey'
    },
    shippingAddress: {
      contactName: 'Müşteri',
      city: 'Gaziantep',
      country: 'Turkey',
      address: 'Gaziantep Batıkent'
    },
    billingAddress: {
      contactName: 'Müşteri',
      city: 'Gaziantep',
      country: 'Turkey',
      address: 'Gaziantep Batıkent'
    },
    basketItems: cart.map((item, index) => ({
      id: 'BI' + index,
      name: item.name,
      category1: 'Kahve/Tatlı',
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toString()
    }))
  };

  iyzipay.checkoutFormInitialize.create(request, (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'failure', errorMessage: err.message });
    }
    res.json(result);
  });
});

module.exports = app;
