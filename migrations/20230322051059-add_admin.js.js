const bcrypt = require('bcrypt');
module.exports = {
  async up(db, client) {
    const hash = await bcrypt.hash("admin123", 10);
    const user = {
      username: 'shoaib khan',
      role: 'admin',
      isDeleted: false,
      email: "admin@gmail.com",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.collection('users').insertOne(user);
    console.log('migrationup');
  },

  async down(db, client) {
    console.log('migration down');
    await db.collection('users').deleteOne({email: 'admin@gmail.com'});
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
