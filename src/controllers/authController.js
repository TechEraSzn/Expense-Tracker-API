const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const register = async (req, res) => {
    const { username, email, password } = req.body;

    // 1. Guard Clauses: Validation first (Clean and Flat)
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        // 2. Database Check (Querying the "Room")
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // 3. Logic: Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Persistence: Insert
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
            [username, email, hashedPassword]
        );

        // 5. Success
        return res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 2. THE NEW MAGIC: Generate the JWT
        // We pack the user's ID inside the payload so we know who they are later
        const payload = {
            id: user.id,
            username: user.username
        };

        // Sign the token with our secret key, set it to expire in 1 day
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        // 3. Send the token back to the user
        return res.status(200).json({
            message: 'Login successful',
            token: token, // Handing them the VIP wristband!
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { register, login };
// ... existing register function up top ...

//const login = async (req, res) => {
  //  const { email, password } = req.body;

    // 1. Guard Clause: Validation
  //  if (!email || !password) {
   //     return res.status(400).json({ error: 'Email and password are required' });
   // }

    //try {
        // 2. Database Check: Does this email exist?
    //    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
       // if (userResult.rows.length === 0) {
     //       return res.status(401).json({ error: 'Invalid credentials' }); // Don't tell them if the email exists or not, just fail
      //  }

      //  const user = userResult.rows[0];

        // 3. Security: Check if the password matches the hashed password
      //  const isMatch = await bcrypt.compare(password, user.password_hash);
       // if (!isMatch) {
       //     return res.status(401).json({ error: 'Invalid credentials' });
       // }

        // 4. Success (We will add the JWT Token here in the next step!)
       // return res.status(200).json({
           // message: 'Login successful',
           // user: {
               // id: user.id,
             //   username: user.username,
               // email: user.email
          //  }
     //   });

   // } catch (error) {
    //    console.error('Login Error:', error);
     //   return res.status(500).json({ error: 'Internal Server Error' });
   // }
//};

// Don't forget to export the new login function!


