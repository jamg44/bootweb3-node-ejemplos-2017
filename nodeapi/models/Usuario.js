'use strict';

const mongoose = require('mongoose');
var hash = require('hash.js')
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
})

const usuarioSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

usuarioSchema.statics.hashPassword = function(plain) {
  return hash.sha256().update(plain).digest('hex');
}

// método de instancia
usuarioSchema.methods.sendEmail = async function() {
  console.log('sending email...');
  // if (this.email.includes('@example.com')) {
  //   return console.log('Test email to', this.email);
  // }
  await transporter.sendMail({
    to: this.email,
    from: 'NodeAPI <admin@nodeapi.com>',
    subject: 'New products',
    text: 'There are new products!'
  })
}

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
