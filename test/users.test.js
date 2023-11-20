const request = require('supertest');
const app = require('../server');  // Assuming your app is exported from 'server.js'
const mongoose = require('mongoose');
const User = require('../models/User');

// Create a test user for the tests
const testUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'testpassword',
};

beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    // Create the test user
    await User.create(testUser);
  });
  
  afterAll(async () => {
    // Disconnect from the test database after all tests are done
    await mongoose.connection.close();
  
    // Close the server
    await new Promise(resolve => app.close(resolve));
  });
  
describe('User Routes', () => {
  let authToken;  // Store the authentication token for the test user

  // Log in the test user and get the authentication token
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    authToken = loginResponse.body.token;
  });

  describe('PUT /api/user/:id', () => {
    it('should update the user account', async () => {
      const updatedUserData = {
        // Provide updated data here
      };

      const response = await request(app)
        .put(`/api/user/${testUser._id}`)
        .send(updatedUserData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual('account has been updated');
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete the user account', async () => {
      const response = await request(app)
        .delete(`/api/user/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual('account has been deleted');
    });
  });

  describe('GET /api/user/:id', () => {
    it('should get a user by ID', async () => {
      const response = await request(app)
        .get(`/api/user/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      // Add expectations for the user data returned
      expect(response.body.username).toBe(testUser.username);
      // Add more expectations as needed
    });

    it('should return 404 if the user is not found', async () => {
      const response = await request(app)
        .get('/api/user/nonexistentuserid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/user/:id/follow', () => {
    it('should follow a user', async () => {
      const userToFollow = {
        // Provide the ID of the user to follow
      };

      const response = await request(app)
        .put(`/api/user/${userToFollow._id}/follow`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual('user has been followed');
    });

    it('should return 403 if the user is trying to follow themselves', async () => {
      const response = await request(app)
        .put(`/api/user/${testUser._id}/follow`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual("you can't follow yourself!");
    });
  });

  describe('PUT /api/user/:id/unfollow', () => {
    it('should unfollow a user', async () => {
      const userToUnfollow = {
        // Provide the ID of the user to unfollow
      };

      const response = await request(app)
        .put(`/api/user/${userToUnfollow._id}/unfollow`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual('user has been unfollowed');
    });

    it('should return 403 if the user is trying to unfollow themselves', async () => {
      const response = await request(app)
        .put(`/api/user/${testUser._id}/unfollow`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual("you can't unfollow yourself!");
    });
  });
});
