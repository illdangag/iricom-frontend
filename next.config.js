module.exports = (phase) => {
  return {
    env: {
      firebase: {
        projectId: 'iricom-test',
        apiKey: 'AIzaSyBYmjY8_YWrwttvBrtwSSKYiqvTLKdF7I0',
        authDomain: 'iricom-test.firebaseapp.com',
      },
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};