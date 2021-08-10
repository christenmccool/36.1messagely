/** User class for message.ly */

const { DB_URI, BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db")
const ExpressError = require("../expressError")
const bcrypt = require("bcrypt");


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const results = await db.query(`
                      INSERT INTO users
                      (username, password, first_name, last_name, phone, join_at, last_login_at)
                      VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
                      RETURNING username, password, first_name, last_name, phone`,
                      [username, hashedPassword, first_name, last_name, phone]);
    return results.rows[0]; 
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    const results = await db.query(`
                            SELECT username, password FROM users 
                            WHERE username=$1`,
                            [username]);
    const user = results.rows[0];
    if (!user) {
      throw new ExpressError('Username not found', 400);
    }
    return await bcrypt.compare(password, user.password);
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const results = await db.query(`
                            UPDATE users
                            SET last_login_at = current_timestamp
                            WHERE username=$1
                            RETURNING username`,
                            [username]);
    const user = results.rows[0];
    if (!user) {
      throw new ExpressError('Username not found', 400);
    }
    return {message: "Last login updated"};
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 
    const results = await db.query(`
                            SELECT username, first_name, last_name, phone
                            FROM users`);
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    const results = await db.query(`
                            SELECT username, first_name, last_name, phone, join_at, last_login_at
                            FROM users
                            WHERE username=$1`,
                            [username]);
    const user = results.rows[0]; 
    if (!user) {
      throw new ExpressError('Username not found', 400);
    }
    return results.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(`
                      SELECT id, first_name, last_name, phone, username, body, sent_at, read_at
                      FROM messages
                      JOIN users ON to_username=username
                      WHERE from_username=$1`,
                      [username]);
    const messages = results.rows.map(row => (
      {id:row.id, 
        to_user: {first_name:row.first_name, last_name:row.last_name, phone:row.phone, username:row.username},
        body:row.body, 
        sent_at:row.sent_at, 
        read_at:row.read_at}));
    return messages;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

   static async messagesTo(username) {
    const results = await db.query(`
                      SELECT id, first_name, last_name, phone, username, body, sent_at, read_at
                      FROM messages
                      JOIN users ON from_username=username
                      WHERE to_username=$1`,
                      [username]);
    const messages = results.rows.map(row => (
      {id:row.id, 
        from_user: {first_name:row.first_name, last_name:row.last_name, phone:row.phone, username:row.username},
        body:row.body, 
        sent_at:row.sent_at, 
        read_at:row.read_at}));
    return messages;
  }

}


module.exports = User;