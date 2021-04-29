import Analytics from '../analyticsModel.js';
import chalk from 'chalk';
import mongoose from 'mongoose';
import pkg from 'lodash';

const { get } = pkg;

const log = console.log;

export default function analytics(event, params = null) {
  const _id = new mongoose.Types.ObjectId();

  const supportedCategories = ['SUCCESS', 'FAIL', 'ERROR'];
  const separatorIndex = event.lastIndexOf('_');
  const analyticsCategory = event.slice(separatorIndex + 1);
  const eventCategory = supportedCategories.includes(analyticsCategory)
    ? analyticsCategory
    : 'ERROR';
  const eventAction = event.slice(0, separatorIndex);

  let user = get(params, 'user', null);
  if (user) delete params.user;

  const requestMethod = get(params, 'req.method', null);
  const endpoint = get(params, 'req.originalUrl', null);
  if (requestMethod) params.requestMethod = requestMethod;
  if (endpoint) params.endpoint = endpoint;
  delete params.req;

  console.log(_id, event, eventCategory, eventAction);

  const message = chalk`
      event: {yellow ${event}}
      params: {yellow ${JSON.stringify(params)}}
      user: {yellow ${user}}
      `;


  const localAnalytics = new Analytics({
    _id,
    event,
    params,
    user,
  });

  localAnalytics
    .save()
    .then(() => {
      if (process.env.TEST_RUNNER === 'false') {
        log(chalk.black.bgYellowBright.bold(' ANALYTICS: '), message);
      }
    })
    .catch((err) => {
      log(chalk.whiteBright.bgRed.bold(' ANALYTICS error '), message);
      log(chalk.gray(err));
    });

  return _id;
}
