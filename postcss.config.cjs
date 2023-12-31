module.exports = () => ({
  plugins:
      [
          require('autoprefixer')({}),
          require('postcss-sort-media-queries')({
                  sort: 'mobile-first'
              }
          ),
          require('postcss-url')({
              url: 'inline',
              maxSize: 200,
          }),

      ]
})
