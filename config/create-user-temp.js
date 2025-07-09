const path = require('path');
const mongoose = require('mongoose');
const { User } = require('@librechat/data-schemas').createModels(mongoose);
require('module-alias')({ base: path.resolve(__dirname, '..', 'api') });
const { registerUser } = require('~/server/services/AuthService');
const { askQuestion, silentExit } = require('./helpers');
const connect = require('./connect');

(async () => {
  await connect();

  console.purple('--------------------------');
  console.purple('Create a new user account!');
  console.purple('--------------------------');

  if (process.argv.length < 5) {
    console.orange('Usage: npm run create-user <email> <name> <username> [--email-verified=false]');
    console.orange('Note: if you do not pass in the arguments, you will be prompted for them.');
    console.orange(
      'If you really need to pass in the password, you can do so as the 4th argument (not recommended for security).',
    );
    console.orange('Use --email-verified=false to set emailVerified to false. Default is true.');
    console.purple('--------------------------');
  }

  let email = '';
  let password = '';
  let name = '';
  let username = '';
  let emailVerified = true;

  // Parse command line arguments
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--email-verified=')) {
      emailVerified = process.argv[i].split('=')[1].toLowerCase() !== 'false';
      continue;
    }

    if (!email) {
      email = process.argv[i];
    } else if (!name) {
      name = process.argv[i];
    } else if (!username) {
      username = process.argv[i];
    } else if (!password) {
      console.red('Warning: password passed in as argument, this is not secure!');
      password = process.argv[i];
    }
  }

  // If any required fields are missing, ask for them
  if (!email) {
    email = await askQuestion('Email: ');
  }
  if (!name) {
    name = await askQuestion('Name: ');
  }
  if (!username) {
    username = await askQuestion('Username: ');
  }
  if (!password) {
    password = await askQuestion('Password: ', true);
  }
  const confirmPassword = await askQuestion('Confirm Password: ', true);

  if (password !== confirmPassword) {
    console.red('Error: Passwords do not match!');
    process.exit(1);
  }

  try {
    console.log('Creating user...');
    const user = await registerUser({
      email,
      name,
      username,
      password,
      confirmPassword,
      emailVerified,
    });
    console.green('User created successfully!');
    console.log(user);
  } catch (error) {
    console.red('Error creating user:', error.message);
    process.exit(1);
  }
})();
