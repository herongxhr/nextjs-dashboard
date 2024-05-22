import styleguide from '@vercel/style-guide/prettier';

const prettierConfig = {
  ...styleguide,
  plugins: [...styleguide.plugins, 'prettier-plugin-tailwindcss'],
};

export default prettierConfig;
