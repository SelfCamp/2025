/**
 * Example: sayThat('just wow') => 'that is just wow'
 * @param that
 * @returns {string}
 */
const sayThat = (that) => {
  return `That is ${that}.`;
};

/**
 * The unambigous constant value of the meaning of life
 * @type {number}
 */
const MEANING_OF_LIFE = 42;


module.exports = {
  MEANING_OF_LIFE,
  sayThat,
};
