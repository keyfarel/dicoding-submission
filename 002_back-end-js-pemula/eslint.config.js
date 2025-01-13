module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest', // Gunakan versi ECMAScript terbaru
      sourceType: 'module',
    },
    rules: {
      'semi': ['error', 'always'], // Wajib tanda titik koma
      'quotes': ['error', 'single'], // Gunakan tanda kutip tunggal
      'indent': ['error', 2], // Indentasi 2 spasi
      'no-unused-vars': ['warn'], // Beri peringatan jika ada variabel tidak terpakai
      'eqeqeq': ['error', 'always'], // Wajib gunakan '===' atau '!=='
    },
  },
];