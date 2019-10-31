const InfoResponse = require('../shared/inforesponse');
const CONSTANTS = require('../shared/constants');
const logger = require('../shared/logger.js');
const helpIntroService = require('../services/helpintro.service');

const retrieveHelpIntro = async (req, res) => {
  let helpIntro = await helpIntroService.findByLangAndPageId(req.query.lang, req.query.pageid);
  if (!helpIntro) {
    // we are assuming there will be always some value for default
    helpIntro = await helpIntroService.findByLangAndPageId('en', '/home');
  }

  logger.debug(`query param lang${req.query.lang} pageid ${req.query.pageid}`);

  // const intro = {
  //   steps: [
  //     {
  //       intro: 'This is a introduction of application'
  //     },
  //     {
  //       element: '#selectlang',
  //       intro: 'Change lang here',
  //       position: 'left'
  //     },
  //     {
  //       element: '#aboutus',
  //       intro: '<b><u>This is about us</u></b><br/>second line',
  //       position: 'right'
  //     },
  //     {
  //       element: '#terms',
  //       intro: 'This is terms and services',
  //       position: 'right'
  //     },
  //     {
  //       element: '#policy',
  //       intro: 'This is policy',
  //       position: 'left'
  //     }
  //   ],
  //   showProgress: true,
  //   skipLabel: 'Skip',
  //   doneLabel: 'Done',
  //   nextLabel: 'Next',
  //   prevLabel: 'Prev',
  //   overlayOpacity: '0.5'
  // };
  const infoResponse = new InfoResponse(res.translate('helpintro.success'));
  infoResponse.result = helpIntro.helpintro;

  res.status(CONSTANTS.HTTP_STATUS_OK).json(infoResponse);
};

module.exports = { retrieveHelpIntro };
