module.exports = {
  'src/**/*.+(ts|tsx)': [
    () => 'tsc --project tsconfig.json --noEmit',
    'eslint --fix --cache',
    'prettier --write'
  ],
  '**/*.+(js|jsx|json|css|md)': ['prettier --write']
};

