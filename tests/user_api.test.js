/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);


beforeEach(async () => {
  await User.deleteMany({});
  for (const user of helper.initialUsers) {
    const userObject = new User(user);
    // eslint-disable-next-line no-await-in-loop
    await userObject.save();
  }
});

describe('User POST', () => {
  test('works when all fields are valid', async () => {
    const newUser = {
      username: 'testman',
      password: 'testpassword',
      name: 'Robert C. Martin',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await helper.usersInDb();

    const usernames = response.map((r) => r.username);


    expect(response.length).toBe(helper.initialUsers.length + 1);
    expect(usernames).toContain(
      'testman',
    );
  });
});


afterAll(() => {
  mongoose.connection.close();
});
