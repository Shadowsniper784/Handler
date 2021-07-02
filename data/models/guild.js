const { model } = require('mongoose');

class GeneralModule {
  prefix = 's/';
  blacklistedChannelIds = [];
}

module.exports = model('guild', {
  _id: String,
  general: { type: Object, default: new GeneralModule() }
});