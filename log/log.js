const log = {
  info: function (info) {
    console.log('Info' + info);
  },
  warning: function (warning) {
    console.log('Warning' + warning);
  },
  error: function (error) {
    console.log('Error' + error);
  },
};

export default log;

/**
 * module.exports = log
 */
