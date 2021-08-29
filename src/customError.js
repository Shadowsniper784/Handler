module.exports = class CustomError extends Error {
  /**
   * @class CustomError
   * @classdesc Custom Error Testing
   * @constructor
   * @extends Error
   * @param  {...any} params 
   */
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = 'CustomError'
    // Custom debugging information
    this.foo = 'foo'
   // console.log(Error.captureStackTrace.toString())
    this.date = new Date()
  }
}
