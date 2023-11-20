const request = require('supertest');
const app = require('../server');  // Update with the correct path to your server file
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

// Create a test user for the tests
const testUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'testpassword',
};

// hello

// Create a test post for the tests
let testPost;

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create the test user
  const user = await User.create(testUser);

  // Create the test post
  testPost = await Post.create({
    userId: user._id,
    content: 'Test post content',
  });
});

afterAll(async () => {
  // Disconnect from the test database after all tests are done
  await mongoose.connection.close();
});

describe('Post Routes', () => {
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

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const newPostData = {
        content: 'This is a new test post',
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPostData)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.content).toBe(newPostData.content);
      expect(response.body.userId).toBe(testUser._id.toString());
    });
  });

  // Add tests for other routes (PUT, DELETE, GET, etc.) in a similar manner
  // Be sure to test both success and error cases
});
