import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3307,
  password: 'Shugu2190!rp',
  database: 'seginfo'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

export class UserModel {
  static async signIn({ email, password }) {
    try {
      console.log("entro signin Simetrico")

      const userQ = await connection.query('SELECT * FROM users WHERE email = ?;', [email])
      if (!userQ[0][0]) return false

      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(userQ[0][0].encryption_key, 'hex'), Buffer.from(userQ[0][0].initialization_vector, 'hex'));

      let decryptedData = decipher.update(userQ[0][0].password_hash, 'hex', 'utf-8');
      decryptedData += decipher.final('utf-8');
      
      if (password !== decryptedData) return false
      
      console.log('Decrypted Data:', decryptedData);
      console.log("exito")
      
      const token = jwt.sign({ id: userQ[0][0].id }, "passwordKey");

      const { username, emailR } = userQ[0][0]; 

      const user = { username, emailR };
      // console.log(userQ[0][0])

      return { token, user }

    } catch (e) {
      console.log(e)
      throw new Error(`${this.name}.${this.signIn.name} ${e}`)
    }
  }

  static async signinAsimetrico({ email, password }) {
    try {
      console.log("entro signin Asimetrico")

      const userQ = await connection.query('SELECT * FROM users WHERE email = ?;', [email])
      if (!userQ[0][0]) return false

      const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(userQ[0][0].password_hash, 'base64')).toString('utf-8');

      console.log('Decrypted Data:', decryptedData);
      if (password !== decryptedData) return false
      console.log("exito");

      const token = jwt.sign({ id: userQ[0][0].id }, "passwordKey");

      const { username, emailR } = userQ[0][0]; 

      const user = { username, emailR };

      return { token, user }

    } catch (e) {
      console.log(e)
      throw new Error(`${this.name}.${this.signIn.name} ${e}`)
    }
  }

  static async signUp({ name, email, password, phone }) {
    try {
      console.log("entro signup Simetrico")

      const existingEmail = await connection.query('SELECT email FROM users WHERE email = ?;', [email])
      if (existingEmail[0][0]) return { msg: 'Este correo ya existe' }

      //SIMETRICO
      const key = crypto.randomBytes(32).toString('hex');
      const iv = crypto.randomBytes(16).toString('hex');

      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));

      let encryptedData = cipher.update(password, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');

      
      await connection.query(
        `INSERT INTO users (username,email,password_hash,phone,encryption_key,initialization_vector)
        VALUES (?, ?, ?, ?,?,?);`,
        [name, email, encryptedData, phone, key, iv]
        )
        
        console.log('Encrypted Data:', encryptedData);
        console.log('Key:', key);
        console.log('IV:', iv);
        console.log("Exito");

      return { user: true, msg: false }

    } catch (e) {
      console.log(e)
      throw new Error(`${this.name}.${this.signIn.name} ${e}`)
    }
  }

  
  static async signupAsimetrico({ name, email, password, phone }) {
    try {
      console.log("entro signup Asimetrico")

      const existingEmail = await connection.query('SELECT email FROM users WHERE email = ?;', [email])
      if (existingEmail[0][0]) return { msg: 'Este correo ya existe' }

      //ASIMETRICO
      const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(password, 'utf-8')).toString('base64');

      await connection.query(
        `INSERT INTO users (username,email,password_hash,phone,encryption_key,initialization_vector)
              VALUES (?, ?, ?, ?, ? , ?);`,
        [name, email, encryptedData, phone, 'key', 'iv']
      )
      console.log('Encrypted Data:', encryptedData);
      console.log("Exito");
      
      return { user: true, msg: false }

    } catch (e) {
      console.log(e)
      throw new Error(`${this.name}.${this.signIn.name} ${e}`)
    }
  }
}