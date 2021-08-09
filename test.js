var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var UserSerializer = new JSONAPISerializer('users', {
  attributes: ['first_name', 'last_name']
});

var users = UserSerializer.serialize({ first_name: 'khaled', last_name: 'maher' });

console.log(users);
